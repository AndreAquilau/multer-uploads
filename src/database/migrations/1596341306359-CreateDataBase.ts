import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateDataBase1596341306359 implements MigrationInterface {
    name = 'CreateDataBase1596341306359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "created_At" TIMESTAMP NOT NULL DEFAULT 'now()', "updated_At" TIMESTAMP NOT NULL DEFAULT 'now()', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "pkey_id_user" ON "users" ("id") `);
        await queryRunner.query(`CREATE TABLE "photos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, "originalname" character varying(255) NOT NULL, "filename" character varying(255) NOT NULL, "created_At" TIMESTAMP NOT NULL DEFAULT 'now()', "updated_At" TIMESTAMP NOT NULL DEFAULT 'now()', "fkIdUserId" uuid, CONSTRAINT "PK_5220c45b8e32d49d767b9b3d725" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "pkey_id_photo" ON "photos" ("id") `);
        await queryRunner.query(`ALTER TABLE "photos" ADD CONSTRAINT "FK_8b26607a37ae1e731aca68ab9a7" FOREIGN KEY ("fkIdUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photos" DROP CONSTRAINT "FK_8b26607a37ae1e731aca68ab9a7"`);
        await queryRunner.query(`DROP INDEX "pkey_id_photo"`);
        await queryRunner.query(`DROP TABLE "photos"`);
        await queryRunner.query(`DROP INDEX "pkey_id_user"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
