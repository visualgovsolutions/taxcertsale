import request from 'supertest';
import { app } from '../../server';
import { createTestServer } from '../setup';

describe('Health Endpoint', () => {
  let server: any;

  beforeAll(() => {
    server = createTestServer();
  });

  it('should return 200 status and correct response format', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('environment');
  });
}); 