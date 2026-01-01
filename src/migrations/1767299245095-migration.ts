import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1767299245095 implements MigrationInterface {
  name = "Migration1767299245095";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "telegram_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "telegramId" bigint NOT NULL, "isBot" boolean NOT NULL DEFAULT false, "firstName" text NOT NULL, "lastName" text, "username" text, "languageCode" text, "isPremium" boolean, "lastVisitAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9ea7581eb54e829047a9b5ec1fd" UNIQUE ("userId"), CONSTRAINT "REL_9ea7581eb54e829047a9b5ec1f" UNIQUE ("userId"), CONSTRAINT "PK_cc8aed65a1be5fdd81ae83cc98a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."UserRole" AS ENUM('Administrator')`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."UserRole", "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_account" ADD CONSTRAINT "FK_9ea7581eb54e829047a9b5ec1fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "telegram_account" DROP CONSTRAINT "FK_9ea7581eb54e829047a9b5ec1fd"`
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."UserRole"`);
    await queryRunner.query(`DROP TABLE "telegram_account"`);
  }
}
