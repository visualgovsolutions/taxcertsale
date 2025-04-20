import request from 'supertest';
// Removed direct app import: import { app } from '../../server';
import { startTestServer, stopTestServer } from '../test-server'; // Corrected import path

describe('Health Endpoint', () => {
  let agent: request.SuperAgentTest;

  beforeAll(async () => {
    console.log('[HealthTest] beforeAll: starting test server...');
    const serverSetup = await startTestServer();
    agent = serverSetup.agent; // Use the agent from the test server setup
    console.log('[HealthTest] beforeAll: agent set?', !!agent);
  });

  afterAll(async () => {
    console.log('[HealthTest] afterAll: stopping test server...');
    await stopTestServer();
    console.log('[HealthTest] afterAll: test server stopped.');
  });

  it('should return 200 status and correct response format', async () => {
    console.log('[HealthTest] test: making GET /health request...');
    const response = await agent.get('/health'); 
    console.log('[HealthTest] test: response status', response.status);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('environment');
  });
}); 