import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenHash1714100000000 implements MigrationInterface {
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "refresh_token_hash" varchar`,
    );
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "refresh_token_hash"`);
  }
}
