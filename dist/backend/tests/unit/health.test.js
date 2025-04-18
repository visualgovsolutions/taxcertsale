"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../../server");
// import { createTestServer } from '../setup'; // Comment out unused import
describe('Health Endpoint', () => {
    // let server: any; // Comment out unused variable
    beforeAll(() => {
        // server = createTestServer(); // Comment out assignment
    });
    it('should return 200 status and correct response format', async () => {
        const response = await (0, supertest_1.default)(server_1.app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'ok');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('environment');
    });
});
//# sourceMappingURL=health.test.js.map