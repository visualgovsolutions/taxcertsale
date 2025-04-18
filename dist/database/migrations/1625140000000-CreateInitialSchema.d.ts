import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreateInitialSchema1625140000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
