import request from 'supertest';
import { createTestServer } from '../../server';
import { BidStatus } from '../../../models/entities/bid.entity';

describe('Bid API Integration', () => {
  let createdBidId: string;
  let app: any;
  const testBid = {
    userId: '00000000-0000-0000-0000-000000000001',
    certificateId: '00000000-0000-0000-0000-000000000002',
    auctionId: '00000000-0000-0000-0000-000000000003',
    amount: 1000,
    interestRate: 10,
    notes: 'Integration test bid',
  };

  beforeAll(async () => {
    app = await createTestServer();
  });

  it('should create a new bid', async () => {
    const res = await request(app).post('/bids').send(testBid).expect(201);
    expect(res.body).toHaveProperty('id');
    createdBidId = res.body.id;
    expect(res.body.amount).toBe(testBid.amount);
    expect(res.body.interestRate).toBe(testBid.interestRate);
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
