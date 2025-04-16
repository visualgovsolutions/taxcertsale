import request from 'supertest';
import { app } from '../../server';
import { setupTestEnvironment, clearDatabase } from '../setup';

describe('API Integration Tests', () => {
  let teardown: () => Promise<void>;

  beforeAll(async () => {
    // Setup test environment and get teardown function
    teardown = await setupTestEnvironment();
  });

  afterAll(async () => {
    // Teardown test environment
    await teardown();
  });

  beforeEach(async () => {
    // Clear database before each test
    await clearDatabase();
  });

  describe('Root Endpoint', () => {
    it('should return 200 and API information', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Florida Tax Certificate Sale API');
      expect(response.body).toHaveProperty('documentation');
    });
  });

  // Additional API integration tests would go here
}); 