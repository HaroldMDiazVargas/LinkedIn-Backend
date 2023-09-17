import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFeedTable1694977874481 implements MigrationInterface {
    name = 'CreateFeedTable1694977874481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feed_post" ("id" SERIAL NOT NULL, "body" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1dd475e18c5436c2bd0e56db39a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "feed_post"`);
    }

}
