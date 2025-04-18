"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../../server");
const setup_1 = require("../setup");
describe('API Integration Tests', () => {
    let teardown;
    beforeAll(async () => {
        // Setup test environment and get teardown function
        teardown = await (0, setup_1.setupTestEnvironment)();
    });
    afterAll(async () => {
        // Teardown test environment
        await teardown();
    });
    beforeEach(async () => {
        // Clear database before each test
        await (0, setup_1.clearDatabase)();
    });
    describe('Root Endpoint', () => {
        it('should return 200 and API information', async () => {
            const response = await (0, supertest_1.default)(server_1.app).get('/');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Florida Tax Certificate Sale API');
            expect(response.body).toHaveProperty('documentation');
        });
    });
    // Additional API integration tests would go here
});
//# sourceMappingURL=api.test.js.map