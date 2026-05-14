import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { UserAward } from './entities/user-award.entity';

export interface AwardDefinition {
  id: string;
  scheme: 'NICAS' | 'NIBAS';
  level: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  skills: { id: string; label: string }[];
}

@Injectable()
export class AwardsService {
  private definitions: AwardDefinition[];

  constructor(
    @InjectRepository(UserAward)
    private readonly repo: Repository<UserAward>,
  ) {
    try {
      const configPath = path.join(__dirname, 'config', 'awards-config.json');
      this.definitions = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch {
      this.definitions = [];
    }
  }

  getDefinitions(): AwardDefinition[] {
    return this.definitions;
  }

  async getUserProgress(userId: string) {
    const rows = await this.repo.find({ where: { userId } });
    const byType = Object.fromEntries(rows.map((r) => [r.awardType, r]));

    return this.definitions.map((def) => {
      const row = byType[def.id];
      const checked: Record<string, boolean> = row?.skills ?? {};
      const completed = def.skills.filter((s) => checked[s.id]).length;
      return {
        ...def,
        status: row?.status ?? 'not_started',
        completedAt: row?.completedAt ?? null,
        checked,
        progress: { completed, total: def.skills.length },
      };
    });
  }

  async updateSkills(userId: string, awardType: string, skills: Record<string, boolean>) {
    const def = this.definitions.find((d) => d.id === awardType);
    if (!def) throw new NotFoundException(`Award type "${awardType}" not found`);

    let row = await this.repo.findOne({ where: { userId, awardType } });
    if (!row) {
      row = this.repo.create({ userId, awardType, skills: {}, status: 'in_progress' });
    }

    row.skills = skills;
    const allChecked = def.skills.every((s) => skills[s.id]);
    if (allChecked && row.status !== 'completed') {
      row.status = 'completed';
      row.completedAt = new Date();
    } else if (!allChecked && row.status === 'completed') {
      row.status = 'in_progress';
      row.completedAt = null;
    }

    await this.repo.save(row);
    return {
      ...def,
      status: row.status,
      completedAt: row.completedAt,
      checked: skills,
      progress: {
        completed: def.skills.filter((s) => skills[s.id]).length,
        total: def.skills.length,
      },
    };
  }
}
