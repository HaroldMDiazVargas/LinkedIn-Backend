import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordField1695175559032 implements MigrationInterface {
    name = 'AddPasswordField1695175559032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }

}
