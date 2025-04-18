"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load test environment variables
dotenv_1.default.config({ path: '.env.test' });
const testConfig = {
    server: {
        port: process.env.TEST_PORT || 3001,
        nodeEnv: 'test',
    },
    db: {
        host: process.env.TEST_DB_HOST || 'localhost',
        port: parseInt(process.env.TEST_DB_PORT || '5432', 10),
        user: process.env.TEST_DB_USER || 'postgres',
        password: process.env.TEST_DB_PASSWORD || 'postgres',
        database: process.env.TEST_DB_NAME || 'taxcertsale_test',
        poolSize: parseInt(process.env.TEST_DB_POOL_SIZE || '5', 10),
    },
    jwt: {
        secret: process.env.TEST_JWT_SECRET || 'test_secret_key',
        expiresIn: parseInt(process.env.TEST_JWT_EXPIRATION || '3600', 10),
        refreshExpiresIn: parseInt(process.env.TEST_REFRESH_TOKEN_EXPIRATION || '86400', 10),
    },
    api: {
        prefix: process.env.TEST_API_PREFIX || '/api/v1',
    },
    test: {
        timeout: parseInt(process.env.TEST_TIMEOUT || '5000', 10),
    }
};
exports.default = testConfig;
//# sourceMappingURL=test.js.map