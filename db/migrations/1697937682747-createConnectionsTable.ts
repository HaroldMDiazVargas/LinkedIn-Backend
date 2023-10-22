import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConnectionsTable1697937682747 implements MigrationInterface {
    name = 'CreateConnectionsTable1697937682747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "connections" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer, "receiverId" integer, CONSTRAINT "PK_0a1f844af3122354cbd487a8d03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "connections" ADD CONSTRAINT "FK_dc6206f1c3d6d67e0d829cd28e6" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connections" ADD CONSTRAINT "FK_7a7cc4dfe8b8fe397b1faf6698a" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connections" DROP CONSTRAINT "FK_7a7cc4dfe8b8fe397b1faf6698a"`);
        await queryRunner.query(`ALTER TABLE "connections" DROP CONSTRAINT "FK_dc6206f1c3d6d67e0d829cd28e6"`);
        await queryRunner.query(`DROP TABLE "connections"`);
    }

}
