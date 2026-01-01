import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1767299780945 implements MigrationInterface {
  name = "Migration1767299780945";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "telegram_account" ADD "isBotBlocked" boolean NOT NULL DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "telegram_account" DROP COLUMN "isBotBlocked"`
    );
  }
}
