import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFkPostAuthorId1698097308615 implements MigrationInterface {
    name = 'AddFkPostAuthorId1698097308615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feed_post" DROP CONSTRAINT "FK_775f4cfee914a573dc1cac42d32"`);
        await queryRunner.query(`ALTER TABLE "feed_post" ALTER COLUMN "authorId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "feed_post" ADD CONSTRAINT "FK_775f4cfee914a573dc1cac42d32" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feed_post" DROP CONSTRAINT "FK_775f4cfee914a573dc1cac42d32"`);
        await queryRunner.query(`ALTER TABLE "feed_post" ALTER COLUMN "authorId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "feed_post" ADD CONSTRAINT "FK_775f4cfee914a573dc1cac42d32" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
