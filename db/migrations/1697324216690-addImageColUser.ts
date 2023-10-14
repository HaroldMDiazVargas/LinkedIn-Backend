import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageColUser1697324216690 implements MigrationInterface {
    name = 'AddImageColUser1697324216690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "imagePath" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "imagePath"`);
    }

}
