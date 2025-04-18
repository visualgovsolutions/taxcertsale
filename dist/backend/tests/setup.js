"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConfig = void 0;
exports.setupTestEnvironment = setupTestEnvironment;
exports.clearDatabase = clearDatabase;
exports.createTestServer = createTestServer;
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const test_1 = __importDefault(require("@config/test"));
exports.testConfig = test_1.default;
const server_1 = require("../server");
// Global test setup before all tests
async function setupTestEnvironment() {
    // Set test environment
    process.env.NODE_ENV = 'test';
    // Create in-memory MongoDB server for tests
    const mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    // Connect to the in-memory database
    await mongoose_1.default.connect(mongoUri);
    // Return teardown function
    return async () => {
        await mongoose_1.default.disconnect();
        await mongoServer.stop();
    };
}
// Helper to clear all collections between tests
async function clearDatabase() {
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        if (collection) {
            await collection.deleteMany({});
        }
    }
}
// Helper to create test server instance
function createTestServer() {
    // This would import your Express app without starting the server
    return server_1.app;
}
//# sourceMappingURL=setup.js.map