"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const path_1 = require("path");
const config_1 = __importDefault(require("../config"));
// Dynamically load entity files
const entityPath = (0, path_1.join)(__dirname, '../models/entities');
const options = {
    type: 'postgres',
    host: config_1.default.db.host,
    port: config_1.default.db.port,
    username: config_1.default.db.user,
    password: config_1.default.db.password,
    database: config_1.default.db.database,
    synchronize: process.env.NODE_ENV === 'development', // Only for development
    logging: process.env.NODE_ENV === 'development',
    entities: [(0, path_1.join)(entityPath, '**', '*.entity.{ts,js}')],
    migrations: [(0, path_1.join)(__dirname, 'migrations', '**', '*.{ts,js}')],
    subscribers: [(0, path_1.join)(__dirname, 'subscribers', '**', '*.{ts,js}')],
    migrationsTableName: 'typeorm_migrations',
    metadataTableName: 'typeorm_metadata',
};
// Export the configured data source
exports.AppDataSource = new typeorm_1.DataSource(options);
exports.default = exports.AppDataSource;
//# sourceMappingURL=datasource.js.map