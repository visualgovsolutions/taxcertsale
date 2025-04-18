"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
/**
 * Application Configuration
 *
 * CRITICAL PORT CONFIGURATION:
 * - Server port 8081: Backend API/GraphQL server
 * - Port 8080: Webpack dev server (frontend)
 * - Port 4000: Reserved for legacy testing
 * - Port 4001: Alternative frontend port (if 8080 is in use)
 *
 * DO NOT change these ports without updating corresponding webpack configurations
 * and ensuring no conflicts with other services during development.
 */
const config = {
    server: {
        port: process.env.PORT || 8081,
        nodeEnv: process.env.NODE_ENV || 'development',
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'taxcertsale',
        poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default_development_secret',
        expiresIn: parseInt(process.env.JWT_EXPIRATION || '3600', 10),
        refreshExpiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRATION || '2592000', 10),
    },
    api: {
        prefix: process.env.API_PREFIX || '/api/v1',
    },
};
exports.default = config;
//# sourceMappingURL=index.js.map