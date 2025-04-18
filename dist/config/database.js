"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../models/entities");
const index_1 = __importDefault(require("./index"));
const { db } = index_1.default;
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: db.host,
    port: db.port,
    username: db.user,
    password: db.password,
    database: db.database,
    entities: entities_1.entities,
    synchronize: process.env.NODE_ENV === 'development', // Only in development
    logging: process.env.NODE_ENV === 'development',
    migrations: ['src/migrations/*.ts'],
    migrationsTableName: 'migrations',
    migrationsRun: process.env.NODE_ENV === 'development',
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
    } : false
});
const initializeDatabase = async () => {
    try {
        if (!exports.AppDataSource.isInitialized) {
            await exports.AppDataSource.initialize();
            console.log('Database connection established');
        }
    }
    catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
exports.default = exports.AppDataSource;
//# sourceMappingURL=database.js.map