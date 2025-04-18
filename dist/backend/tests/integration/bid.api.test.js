"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../../server");
const bid_entity_1 = require("../../../models/entities/bid.entity");
const postgresPool_1 = require("../../../database/postgresPool");
const uuid_1 = require("uuid");
describe('Bid API Integration', () => {
    let createdBidId;
    let app;
    let userId;
    let auctionId;
    let certificateId;
    const pool = (0, postgresPool_1.getPostgresPool)();
    beforeAll(async () => {
        app = await (0, server_1.createTestServer)();
        // Insert test user
        userId = (0, uuid_1.v4)();
        await pool.query("INSERT INTO users (id, email, passwordhash, role, status, created_at, updated_at) VALUES ($1, $2, $3, 'investor', 'active', NOW(), NOW())", [userId, 'testuser@example.com', 'hashedpassword']);
        // Insert test auction
        auctionId = (0, uuid_1.v4)();
        await pool.query('INSERT INTO auctions (id, name, auction_date, start_time, end_time, status, created_at, updated_at, county_id) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), $7)', [auctionId, 'Test Auction', '2024-01-01', '09:00', '17:00', 'upcoming', (0, uuid_1.v4)()]);
        // Insert test certificate
        certificateId = (0, uuid_1.v4)();
        await pool.query("INSERT INTO certificates (id, certificate_number, auction_id, property_id, county_id, face_value, interest_rate, issue_date, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, 1000, 10, '2024-01-01', 'available', NOW(), NOW())", [certificateId, 'CERT-001', auctionId, (0, uuid_1.v4)(), (0, uuid_1.v4)()]);
    });
    afterAll(async () => {
        // Clean up test data
        await pool.query('DELETE FROM bids');
        await pool.query('DELETE FROM certificates');
        await pool.query('DELETE FROM auctions');
        await pool.query('DELETE FROM users');
        await (0, postgresPool_1.closePostgresPool)();
    });
    it('should create a new bid', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/bids')
            .send({
            userId,
            certificateId,
            auctionId,
            amount: 1000,
            interestRate: 10,
            notes: 'Integration test bid',
        })
            .expect(201);
        expect(res.body).toHaveProperty('id');
        createdBidId = res.body.id;
        expect(res.body.amount).toBe(1000);
        expect(res.body.interestRate).toBe(10);
    });
    it('should get the created bid by id', async () => {
        const res = await (0, supertest_1.default)(app).get(`/bids/${createdBidId}`).expect(200);
        expect(res.body).toHaveProperty('id', createdBidId);
    });
    it('should update the bid', async () => {
        const res = await (0, supertest_1.default)(app)
            .put(`/bids/${createdBidId}`)
            .send({ amount: 2000, status: bid_entity_1.BidStatus.ACCEPTED })
            .expect(200);
        expect(res.body.amount).toBe(2000);
        expect(res.body.status).toBe(bid_entity_1.BidStatus.ACCEPTED);
    });
    it('should list all bids', async () => {
        const res = await (0, supertest_1.default)(app).get('/bids').expect(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    it('should delete the bid', async () => {
        await (0, supertest_1.default)(app).delete(`/bids/${createdBidId}`).expect(200);
    });
});
//# sourceMappingURL=bid.api.test.js.map