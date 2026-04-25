import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserBadge } from './entities/user-badge.entity';
import * as path from 'path';
import * as fs from 'fs';

interface BadgeRule {
  id: string;
  name: string;
  description: string;
  tier: string;
  icon: string;
  category: string;
  rules: {
    operator: 'AND' | 'OR';
    conditions: Condition[];
  };
}

interface Condition {
  type: string;
  operator: 'gte' | 'lte' | 'eq' | 'gt' | 'lt';
  value: number;
  climbingType?: string;
  ascentType?: string;
  gradeSystem?: string;
  minDifficulty?: number;
  cragName?: string;
}

@Injectable()
export class BadgeEngineService {
  private readonly logger = new Logger(BadgeEngineService.name);
  private readonly rules: BadgeRule[] = this.loadRules();

  private loadRules(): BadgeRule[] {
    try {
      const candidates = [
        path.join(__dirname, 'config', 'badge-rules.json'),
        path.join(process.cwd(), 'src', 'modules', 'badges', 'config', 'badge-rules.json'),
      ];
      for (const p of candidates) {
        if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf-8'));
      }
    } catch (e) {
      this.logger.warn('Could not load badge-rules.json, using empty rules');
    }
    return [];
  }

  constructor(
    @InjectRepository(UserBadge) private userBadgeRepo: Repository<UserBadge>,
    private dataSource: DataSource,
  ) {}

  async evaluateForUser(userId: string): Promise<BadgeRule[]> {
    const earned = await this.userBadgeRepo.find({ where: { userId } });
    const earnedIds = new Set(earned.map((b) => b.badgeId));

    const stats = await this.getUserStats(userId);
    const newBadges: BadgeRule[] = [];

    for (const badge of this.rules) {
      if (earnedIds.has(badge.id)) continue;

      const qualifies = this.evaluate(badge.rules, stats);
      if (qualifies) {
        await this.userBadgeRepo.save(
          this.userBadgeRepo.create({ userId, badgeId: badge.id, context: stats }),
        );
        newBadges.push(badge);
        this.logger.log(`User ${userId} earned badge: ${badge.id}`);
      }
    }

    return newBadges;
  }

  async getUserBadges(userId: string): Promise<{ badge: BadgeRule; earnedAt: Date }[]> {
    const earned = await this.userBadgeRepo.find({ where: { userId }, order: { earnedAt: 'DESC' } });
    return earned
      .map((ub) => {
        const badge = this.rules.find((r) => r.id === ub.badgeId);
        if (!badge) return null;
        return { badge, earnedAt: ub.earnedAt };
      })
      .filter(Boolean);
  }

  getAllBadges(): BadgeRule[] {
    return this.rules;
  }

  private evaluate(rules: BadgeRule['rules'], stats: Record<string, any>): boolean {
    const results = rules.conditions.map((c) => this.evaluateCondition(c, stats));
    return rules.operator === 'AND' ? results.every(Boolean) : results.some(Boolean);
  }

  private evaluateCondition(c: Condition, stats: Record<string, any>): boolean {
    let actual: number;

    switch (c.type) {
      case 'total_ascents':
        actual = stats.totalAscents;
        break;
      case 'ascents_by_climbing_type':
        actual = stats.byClimbingType[c.climbingType] || 0;
        break;
      case 'ascents_by_type':
        actual = stats.byAscentType[c.ascentType] || 0;
        break;
      case 'unique_crags':
        actual = stats.uniqueCrags;
        break;
      case 'grade_milestone':
        actual = stats.gradeAchievements?.[`${c.gradeSystem}_${c.minDifficulty}`] || 0;
        break;
      case 'multipitch_ascents':
        actual = stats.multipitchAscents;
        break;
      case 'onsight_streak_day':
        actual = stats.maxOnsightDay;
        break;
      case 'crag_visits':
        actual = stats.cragVisits?.[c.cragName] || 0;
        break;
      default:
        return false;
    }

    switch (c.operator) {
      case 'gte': return actual >= c.value;
      case 'lte': return actual <= c.value;
      case 'eq':  return actual === c.value;
      case 'gt':  return actual > c.value;
      case 'lt':  return actual < c.value;
      default:    return false;
    }
  }

  private async getUserStats(userId: string): Promise<Record<string, any>> {
    const [totals, byType, byCT, uniqueCrags, gradeMilestones, multipitch, onsightDay, cragVisits] =
      await Promise.all([
        this.dataSource.query(
          `SELECT COUNT(*) as total FROM ascents WHERE user_id = $1`,
          [userId],
        ),
        this.dataSource.query(
          `SELECT ascent_type, COUNT(*) as cnt FROM ascents WHERE user_id = $1 GROUP BY ascent_type`,
          [userId],
        ),
        this.dataSource.query(
          `SELECT r.climbing_type, COUNT(*) as cnt
           FROM ascents a JOIN routes r ON r.id = a.route_id
           WHERE a.user_id = $1 GROUP BY r.climbing_type`,
          [userId],
        ),
        this.dataSource.query(
          `SELECT COUNT(DISTINCT crag_id) as cnt FROM ascents WHERE user_id = $1 AND crag_id IS NOT NULL`,
          [userId],
        ),
        this.dataSource.query(
          `SELECT r.grade_system, r.grade_difficulty, COUNT(*) as cnt
           FROM ascents a JOIN routes r ON r.id = a.route_id
           WHERE a.user_id = $1
           GROUP BY r.grade_system, r.grade_difficulty`,
          [userId],
        ),
        this.dataSource.query(
          `SELECT COUNT(*) as cnt FROM ascents a
           JOIN routes r ON r.id = a.route_id
           WHERE a.user_id = $1 AND r.pitches > 1`,
          [userId],
        ),
        this.dataSource.query(
          `SELECT date, COUNT(*) as cnt FROM ascents
           WHERE user_id = $1 AND ascent_type = 'onsight'
           GROUP BY date ORDER BY cnt DESC LIMIT 1`,
          [userId],
        ),
        this.dataSource.query(
          `SELECT c.name, COUNT(DISTINCT a.date) as visits
           FROM ascents a JOIN crags c ON c.id = a.crag_id
           WHERE a.user_id = $1 GROUP BY c.name`,
          [userId],
        ),
      ]);

    const byAscentType: Record<string, number> = {};
    byType.forEach((r: any) => { byAscentType[r.ascent_type] = parseInt(r.cnt, 10); });

    const byClimbingType: Record<string, number> = {};
    byCT.forEach((r: any) => { byClimbingType[r.climbing_type] = parseInt(r.cnt, 10); });

    const gradeAchievements: Record<string, number> = {};
    gradeMilestones.forEach((r: any) => {
      const key = `${r.grade_system}_${r.grade_difficulty}`;
      gradeAchievements[key] = (gradeAchievements[key] || 0) + parseInt(r.cnt, 10);
      for (let d = 1; d < parseInt(r.grade_difficulty, 10); d++) {
        const lowerKey = `${r.grade_system}_${d}`;
        gradeAchievements[lowerKey] = (gradeAchievements[lowerKey] || 0) + parseInt(r.cnt, 10);
      }
    });

    const cragVisitsMap: Record<string, number> = {};
    cragVisits.forEach((r: any) => { cragVisitsMap[r.name] = parseInt(r.visits, 10); });

    return {
      totalAscents: parseInt(totals[0]?.total || '0', 10),
      byAscentType,
      byClimbingType,
      uniqueCrags: parseInt(uniqueCrags[0]?.cnt || '0', 10),
      gradeAchievements,
      multipitchAscents: parseInt(multipitch[0]?.cnt || '0', 10),
      maxOnsightDay: parseInt(onsightDay[0]?.cnt || '0', 10),
      cragVisits: cragVisitsMap,
    };
  }
}
