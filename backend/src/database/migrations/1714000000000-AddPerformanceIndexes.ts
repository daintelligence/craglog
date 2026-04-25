import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPerformanceIndexes1714000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Logbook queries: user's ascents ordered by date
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_ascents_user_date ON ascents (user_id, date DESC)`,
    );
    // Project tick check: has user already logged this route?
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_ascents_user_route ON ascents (user_id, route_id)`,
    );
    // Crag detail: load all routes for a buttress
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_routes_buttress ON routes (buttress_id)`,
    );
    // Crag list: filter by region
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_crags_region ON crags (region_id)`,
    );
    // Projects table: user's projects
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_projects_user ON projects (user_id)`,
    );
    // PostGIS spatial index for nearby-crags queries
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_crags_location ON crags USING gist (
        ST_SetSRID(ST_MakePoint(longitude::float, latitude::float), 4326)::geography
      ) WHERE latitude IS NOT NULL AND longitude IS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_ascents_user_date`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_ascents_user_route`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_routes_buttress`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_crags_region`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_projects_user`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_crags_location`);
  }
}
