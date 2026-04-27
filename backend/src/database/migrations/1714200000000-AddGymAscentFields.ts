import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGymAscentFields1714200000000 implements MigrationInterface {
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE "ascents" ALTER COLUMN "route_id" DROP NOT NULL`);
    await runner.query(`ALTER TABLE "ascents" ADD COLUMN IF NOT EXISTS "free_grade" varchar(20)`);
    await runner.query(`ALTER TABLE "ascents" ADD COLUMN IF NOT EXISTS "gym_style" varchar(20)`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE "ascents" ALTER COLUMN "route_id" SET NOT NULL`);
    await runner.query(`ALTER TABLE "ascents" DROP COLUMN IF EXISTS "free_grade"`);
    await runner.query(`ALTER TABLE "ascents" DROP COLUMN IF EXISTS "gym_style"`);
  }
}
