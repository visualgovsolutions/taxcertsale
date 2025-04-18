"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../../config/index"));
const postgresPool_1 = require("../../database/postgresPool"); // Import the check function
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../../../package.json'); // Adjust path as needed
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    // Perform database check
    const dbConnected = await (0, postgresPool_1.checkPostgresConnection)();
    res.status(dbConnected ? 200 : 503).json({
        status: dbConnected ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
        environment: index_1.default.server.nodeEnv,
        version: version,
        database: dbConnected ? 'connected' : 'disconnected',
    });
});
exports.default = router;
//# sourceMappingURL=health.js.map