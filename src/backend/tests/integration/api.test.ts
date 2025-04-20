import request from 'supertest';
import { startTestServer, stopTestServer } from '../test-server';
import { Server } from 'http';
import { Express } from 'express';
import setupTestDatabase from '@tests/prisma-test-setup';
import teardownTestDatabase from '@tests/prisma-test-teardown';
import prisma from '@src/lib/prisma';

describe('API Integration Tests', () => {
  let agent: request.SuperAgentTest;
  let server: Server;

  beforeAll(async () => {
    await setupTestDatabase();
    const serverSetup = await startTestServer();
    server = serverSetup.server;
    agent = serverSetup.agent;
  });

  beforeEach(async () => {
    await prisma.bid.deleteMany({});
    await prisma.certificate.deleteMany({});
    await prisma.auction.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.county.deleteMany({});
  });

  afterAll(async () => {
    await stopTestServer();
    await teardownTestDatabase();
  });

  it('should return 404 for non-existent routes', async () => {
    // ... existing code ...
  });
}); 