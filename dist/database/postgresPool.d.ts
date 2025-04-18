import { Pool } from 'pg';
export declare const getPostgresPool: () => Pool;
export declare const checkPostgresConnection: () => Promise<boolean>;
export declare const closePostgresPool: () => Promise<void>;
