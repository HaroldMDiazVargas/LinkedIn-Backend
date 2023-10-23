import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFkFriendRequest1698097032639 implements MigrationInterface {
    name = 'AddFkFriendRequest1698097032639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connections" DROP CONSTRAINT "FK_dc6206f1c3d6d67e0d829cd28e6"`);
        await queryRunner.query(`ALTER TABLE "connections" DROP CONSTRAINT "FK_7a7cc4dfe8b8fe397b1faf6698a"`);
        await queryRunner.query(`ALTER TABLE "connections" ALTER COLUMN "creatorId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "connections" ALTER COLUMN "receiverId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "connections" ADD CONSTRAINT "FK_dc6206f1c3d6d67e0d829cd28e6" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connections" ADD CONSTRAINT "FK_7a7cc4dfe8b8fe397b1faf6698a" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connections" DROP CONSTRAINT "FK_7a7cc4dfe8b8fe397b1faf6698a"`);
        await queryRunner.query(`ALTER TABLE "connections" DROP CONSTRAINT "FK_dc6206f1c3d6d67e0d829cd28e6"`);
        await queryRunner.query(`ALTER TABLE "connections" ALTER COLUMN "receiverId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "connections" ALTER COLUMN "creatorId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "connections" ADD CONSTRAINT "FK_7a7cc4dfe8b8fe397b1faf6698a" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connections" ADD CONSTRAINT "FK_dc6206f1c3d6d67e0d829cd28e6" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
