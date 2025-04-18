import { Connection } from 'typeorm';
export declare class InitialDataSeed {
    private connection;
    constructor(connection: Connection);
    run(): Promise<void>;
    private seedUsers;
    private seedCounties;
}
export declare function seed(connection: Connection): Promise<void>;
