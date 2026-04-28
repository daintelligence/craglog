import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class StatsService {
  constructor(private dataSource: DataSource) {}

  async getDashboard(userId: string) {
    const [totals, byType, byGrade, byCrag, progression, recentAscents, onsightRate] =
      await Promise.all([
        this.getTotals(userId),
        this.getByClimbingType(userId),
        this.getGradeDistribution(userId),
        this.getMostClimbedCrags(userId),
        this.getProgressionByMonth(userId),
        this.getRecentAscents(userId),
        this.getOnsightRate(userId),
      ]);

    return {
      totals,
      byType,
      gradeDistribution: byGrade,
      topCrags: byCrag,
      progression,
      recentAscents,
      onsightRate,
    };
  }

  private async getTotals(userId: string) {
    const [row] = await this.dataSource.query(
      `SELECT
        COUNT(*) as total_ascents,
        COUNT(DISTINCT a.crag_id) as unique_crags,
        COUNT(DISTINCT a.route_id) as unique_routes,
        COUNT(DISTINCT a.date) as total_days,
        MAX(r."gradeDifficulty") as max_difficulty
       FROM ascents a
       LEFT JOIN routes r ON r.id = a.route_id
       WHERE a.user_id = $1`,
      [userId],
    );
    return {
      totalAscents: parseInt(row.total_ascents, 10),
      uniqueCrags: parseInt(row.unique_crags, 10),
      uniqueRoutes: parseInt(row.unique_routes, 10),
      totalDays: parseInt(row.total_days, 10),
      maxDifficulty: parseInt(row.max_difficulty || '0', 10),
    };
  }

  private async getByClimbingType(userId: string) {
    const rows = await this.dataSource.query(
      `SELECT r."climbingType", COUNT(*) as cnt
       FROM ascents a JOIN routes r ON r.id = a.route_id
       WHERE a.user_id = $1
       GROUP BY r."climbingType" ORDER BY cnt DESC`,
      [userId],
    );
    return rows.map((r: any) => ({ type: r.climbingType, count: parseInt(r.cnt, 10) }));
  }

  private async getGradeDistribution(userId: string) {
    const rows = await this.dataSource.query(
      `SELECT r.grade, r."gradeSystem", r."gradeDifficulty", COUNT(*) as cnt
       FROM ascents a JOIN routes r ON r.id = a.route_id
       WHERE a.user_id = $1
       GROUP BY r.grade, r."gradeSystem", r."gradeDifficulty"
       ORDER BY r."gradeDifficulty" ASC`,
      [userId],
    );
    return rows.map((r: any) => ({
      grade: r.grade,
      gradeSystem: r.gradeSystem,
      difficulty: parseInt(r.gradeDifficulty, 10),
      count: parseInt(r.cnt, 10),
    }));
  }

  private async getMostClimbedCrags(userId: string) {
    const rows = await this.dataSource.query(
      `SELECT c.id, c.name, c.latitude, c.longitude, COUNT(a.id) as visits
       FROM ascents a JOIN crags c ON c.id = a.crag_id
       WHERE a.user_id = $1
       GROUP BY c.id, c.name, c.latitude, c.longitude
       ORDER BY visits DESC LIMIT 10`,
      [userId],
    );
    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      latitude: parseFloat(r.latitude),
      longitude: parseFloat(r.longitude),
      visits: parseInt(r.visits, 10),
    }));
  }

  private async getProgressionByMonth(userId: string) {
    const rows = await this.dataSource.query(
      `SELECT
        TO_CHAR(a.date::date, 'YYYY-MM') as month,
        COUNT(*) as total,
        MAX(r."gradeDifficulty") as max_difficulty,
        COUNT(CASE WHEN a."ascentType" = 'onsight' THEN 1 END) as onsights
       FROM ascents a JOIN routes r ON r.id = a.route_id
       WHERE a.user_id = $1
         AND a.date >= NOW() - INTERVAL '12 months'
       GROUP BY month
       ORDER BY month ASC`,
      [userId],
    );
    return rows.map((r: any) => ({
      month: r.month,
      total: parseInt(r.total, 10),
      maxDifficulty: parseInt(r.max_difficulty || '0', 10),
      onsights: parseInt(r.onsights, 10),
    }));
  }

  private async getRecentAscents(userId: string) {
    return this.dataSource.query(
      `SELECT a.id, a.date, a."ascentType", a.notes,
              r.name as route_name, r.grade, r."gradeSystem", r."climbingType",
              c.name as crag_name
       FROM ascents a
       JOIN routes r ON r.id = a.route_id
       LEFT JOIN crags c ON c.id = a.crag_id
       WHERE a.user_id = $1
       ORDER BY a.date DESC, a."createdAt" DESC
       LIMIT 10`,
      [userId],
    );
  }

  private async getOnsightRate(userId: string) {
    const [row] = await this.dataSource.query(
      `SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN "ascentType" = 'onsight' THEN 1 END) as onsights,
        COUNT(CASE WHEN "ascentType" = 'flash' THEN 1 END) as flashes,
        COUNT(CASE WHEN "ascentType" = 'redpoint' THEN 1 END) as redpoints
       FROM ascents WHERE user_id = $1`,
      [userId],
    );
    const total = parseInt(row.total, 10);
    return {
      total,
      onsights: parseInt(row.onsights, 10),
      flashes: parseInt(row.flashes, 10),
      redpoints: parseInt(row.redpoints, 10),
      onsightRate: total > 0 ? Math.round((parseInt(row.onsights, 10) / total) * 100) : 0,
    };
  }

  async getHeatmap(userId: string) {
    const rows = await this.dataSource.query(
      `SELECT
        TO_CHAR(date::date, 'YYYY-MM-DD') as day,
        COUNT(*) as cnt
       FROM ascents
       WHERE user_id = $1
         AND date::date >= CURRENT_DATE - INTERVAL '364 days'
       GROUP BY day
       ORDER BY day ASC`,
      [userId],
    );
    return rows.map((r: any) => ({
      date: r.day,
      count: parseInt(r.cnt, 10),
    }));
  }

  async getPersonalBests(userId: string) {
    const [hardestOnsight, hardestFlash, hardestRedpoint, longestRoute, mostVisited] =
      await Promise.all([
        this.dataSource.query(
          `SELECT r.grade, r."gradeSystem", r."gradeDifficulty", r.name as route_name, c.name as crag_name
           FROM ascents a JOIN routes r ON r.id = a.route_id LEFT JOIN crags c ON c.id = a.crag_id
           WHERE a.user_id = $1 AND a."ascentType" = 'onsight'
           ORDER BY r."gradeDifficulty" DESC LIMIT 1`,
          [userId],
        ),
        this.dataSource.query(
          `SELECT r.grade, r."gradeSystem", r."gradeDifficulty", r.name as route_name, c.name as crag_name
           FROM ascents a JOIN routes r ON r.id = a.route_id LEFT JOIN crags c ON c.id = a.crag_id
           WHERE a.user_id = $1 AND a."ascentType" = 'flash'
           ORDER BY r."gradeDifficulty" DESC LIMIT 1`,
          [userId],
        ),
        this.dataSource.query(
          `SELECT r.grade, r."gradeSystem", r."gradeDifficulty", r.name as route_name, c.name as crag_name
           FROM ascents a JOIN routes r ON r.id = a.route_id LEFT JOIN crags c ON c.id = a.crag_id
           WHERE a.user_id = $1 AND a."ascentType" = 'redpoint'
           ORDER BY r."gradeDifficulty" DESC LIMIT 1`,
          [userId],
        ),
        this.dataSource.query(
          `SELECT r.name as route_name, r."heightMetres", c.name as crag_name
           FROM ascents a JOIN routes r ON r.id = a.route_id LEFT JOIN crags c ON c.id = a.crag_id
           WHERE a.user_id = $1 AND r."heightMetres" IS NOT NULL
           ORDER BY r."heightMetres" DESC LIMIT 1`,
          [userId],
        ),
        this.dataSource.query(
          `SELECT c.id, c.name, COUNT(a.id) as visits
           FROM ascents a JOIN crags c ON c.id = a.crag_id
           WHERE a.user_id = $1
           GROUP BY c.id, c.name ORDER BY visits DESC LIMIT 1`,
          [userId],
        ),
      ]);

    return {
      hardestOnsight: hardestOnsight[0] ?? null,
      hardestFlash: hardestFlash[0] ?? null,
      hardestRedpoint: hardestRedpoint[0] ?? null,
      longestRoute: longestRoute[0] ?? null,
      mostVisitedCrag: mostVisited[0]
        ? { ...mostVisited[0], visits: parseInt(mostVisited[0].visits, 10) }
        : null,
    };
  }

  async getYearComparison(userId: string) {
    const rows = await this.dataSource.query(
      `SELECT
        EXTRACT(YEAR FROM date::date) as year,
        COUNT(*) as total,
        COUNT(DISTINCT crag_id) as crags,
        COUNT(CASE WHEN "ascentType" = 'onsight' THEN 1 END) as onsights
       FROM ascents
       WHERE user_id = $1 AND EXTRACT(YEAR FROM date::date) >= EXTRACT(YEAR FROM NOW()) - 2
       GROUP BY year ORDER BY year DESC`,
      [userId],
    );
    return rows.map((r: any) => ({
      year: parseInt(r.year, 10),
      total: parseInt(r.total, 10),
      crags: parseInt(r.crags, 10),
      onsights: parseInt(r.onsights, 10),
    }));
  }
}
