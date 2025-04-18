import request from 'supertest';
import { createTestServer } from '../../server';
import { BidStatus } from '../../../models/entities/bid.entity';
import { getPostgresPool, closePostgresPool } from '../../../database/postgresPool';
import { v4 as uuidv4 } from 'uuid';

describe('Bid API Integration', () => {
  let createdBidId: string;
  let app: any;
  let userId: string;
  let auctionId: string;
  let certificateId: string;
  const pool = getPostgresPool();

  beforeAll(async () => {
    app = await createTestServer();
    // Insert test user
    userId = uuidv4();
    await pool.query(
      "INSERT INTO users (id, email, passwordhash, role, status, created_at, updated_at) VALUES ($1, $2, $3, 'investor', 'active', NOW(), NOW())",
      [userId, 'testuser@example.com', 'hashedpassword']
    );
    // Insert test auction
    auctionId = uuidv4();
    await pool.query(
      'INSERT INTO auctions (id, name, auction_date, start_time, end_time, status, created_at, updated_at, county_id) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), $7)',
      [auctionId, 'Test Auction', '2024-01-01', '09:00', '17:00', 'upcoming', uuidv4()]
    );
    // Insert test certificate
    certificateId = uuidv4();
    await pool.query(
      "INSERT INTO certificates (id, certificate_number, auction_id, property_id, county_id, face_value, interest_rate, issue_date, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, 1000, 10, '2024-01-01', 'available', NOW(), NOW())",
      [certificateId, 'CERT-001', auctionId, uuidv4(), uuidv4()]
    );
  });

  afterAll(async () => {
    // Clean up test data
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM certificates');
    await pool.query('DELETE FROM auctions');
    await pool.query('DELETE FROM users');
    await closePostgresPool();
  });

  it('should create a new bid', async () => {
    const res = await request(app)
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
    const res = await request(app).get(`/bids/${createdBidId}`).expect(200);
    expect(res.body).toHaveProperty('id', createdBidId);
  });

  it('should update the bid', async () => {
    const res = await request(app)
      .put(`/bids/${createdBidId}`)
      .send({ amount: 2000, status: BidStatus.ACCEPTED })
      .expect(200);
    expect(res.body.amount).toBe(2000);
    expect(res.body.status).toBe(BidStatus.ACCEPTED);
  });

  it('should list all bids', async () => {
    const res = await request(app).get('/bids').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should delete the bid', async () => {
    await request(app).delete(`/bids/${createdBidId}`).expect(200);
  });
});
