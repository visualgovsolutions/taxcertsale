import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';
import { io as SocketClient, Socket as ClientSocket } from 'socket.io-client';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import prisma from '../../lib/prisma';
import jwt from 'jsonwebtoken';
import request from 'supertest';
// Import the test server utilities
import { startTestServer, stopTestServer } from './test-server';
// Import the real gateway setup
import { setupAuctionGateway } from '../websockets/auction.gateway';

jest.setTimeout(20000); // Increase timeout for slow integration tests

describe('Auction State Management Integration Tests', () => {
  let httpServer: Server;
  let io: SocketServer;
  let apolloServer: ApolloServer;
  let agent: request.SuperAgentTest; // Use agent for HTTP requests

  const generateToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' });
  };

  beforeAll(async () => {
    console.log('[AuctionStateTest] beforeAll: starting test server...');
    // Start the test server and get the httpServer and agent instances
    const serverSetup = await startTestServer();
    httpServer = serverSetup.server;
    agent = serverSetup.agent; // Use the agent from the test server
    // Attach the real Socket.IO gateway to the HTTP server
    io = setupAuctionGateway(httpServer);
  });

  afterAll(async () => {
    console.log('[AuctionStateTest] afterAll: stopping test server...');
    // Disconnect Prisma 
    if (prisma) { 
      await prisma.$disconnect();
    }
    // Finally stop the underlying HTTP server
    if (io) {
      io.close(); // Properly close the WebSocket server
    }
    await stopTestServer(); 
    console.log('[AuctionStateTest] afterAll: test server stopped.');
  });

  beforeEach(async () => {
    console.log('[AuctionStateTest] beforeEach: cleaning up and setting up test data...');
    // Clear database before each test
    await prisma.bid.deleteMany({});
    await prisma.certificate.deleteMany({});
    await prisma.auction.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.county.deleteMany({});
  });

  describe('WebSocket Bid Validation', () => {
    // Increase timeout for WebSocket tests
    jest.setTimeout(10000);

    it('should emit error when placing bid on non-active auction', (done) => {
      let socket: ClientSocket | undefined;
      let finished = false;
      (async () => {
        try {
          console.log('[AuctionStateTest] WebSocket test: creating county and auction...');
          const county = await prisma.county.create({
            data: { name: 'Test County Socket', state: 'TS' }
          });
          const auction = await prisma.auction.create({
            data: {
              countyId: county.id,
              auctionDate: new Date(),
              status: 'scheduled', // Not active
            }
          });
          const serverAddress = `http://localhost:${(httpServer.address() as any).port}`;
          socket = SocketClient(serverAddress, {
            auth: { token: generateToken('test-user-id', 'investor') },
            transports: ['websocket'],
          });
          console.log('[AuctionStateTest] WebSocket test: connecting socket...');
          await new Promise<void>((resolve, reject) => {
            socket!.once('connect', resolve);
            socket!.once('connect_error', (err: any) => reject(new Error(`Socket connection error: ${err.message}`)));
            setTimeout(() => reject(new Error('Socket connection timed out')), 3000);
          });
          console.log('[AuctionStateTest] WebSocket test: socket connected');
          // Join the auction room first
          socket.emit('joinAuction', auction.id);
          await new Promise<void>((resolve, reject) => {
            socket!.once('joinedAuction', (data: any) => {
              console.log('[AuctionStateTest] WebSocket test: joinedAuction', data);
              resolve();
            });
            setTimeout(() => reject(new Error('Timeout waiting for joinedAuction')), 3000);
          });
          // Set up errorEvent handler BEFORE emitting placeBid
          socket!.once('errorEvent', (err: { message: string }) => {
            if (finished) return;
            finished = true;
            console.log('[AuctionStateTest] WebSocket test: received errorEvent:', err);
            try {
              expect(err).toBeDefined();
              expect(err.message).toMatch(/not active/);
              done();
            } catch (e) {
              done(e);
            }
          });
          setTimeout(() => {
            if (finished) return;
            finished = true;
            console.error('[AuctionStateTest] WebSocket test: timed out waiting for errorEvent');
            done(new Error('Test timed out waiting for errorEvent'));
          }, 10000);
          // Emit the bid after handler is set up
          socket.emit('placeBid', { auctionId: auction.id, bidAmount: 100, userId: 'test-user-id' });
        } catch (err) {
          if (!finished) {
            finished = true;
            done(err);
          }
        } finally {
          if (socket && socket.connected) {
            socket.disconnect();
            await new Promise((resolve) => socket!.on('disconnect', resolve));
            console.log('[AuctionStateTest] WebSocket test: socket disconnected');
          }
        }
      })();
    });

    // For GraphQL tests, skip until Apollo middleware is confirmed in test server
    it.skip('should introspect GraphQL schema and log available mutations', async () => {
      // Skipped: Apollo middleware may not be applied in test server
    });
  });

  describe('GraphQL Mutations', () => {
     // Increase timeout for tests involving database operations
    jest.setTimeout(15000);

    it('should start and complete auction', async () => {
      console.log('[AuctionStateTest] GraphQL test: creating county and auction...');
      const county = await prisma.county.create({
        data: { name: 'Test County GraphQL', state: 'TS' }
      });
      const auction = await prisma.auction.create({
        data: {
          countyId: county.id,
          auctionDate: new Date(),
          status: 'scheduled',
        }
      });
      // Use the agent for GraphQL requests via the test server
      const startResponse = await agent
        .post('/graphql')
        .set('Authorization', `Bearer ${generateToken('admin-id', 'admin')}`)
        .send({
          query: `
            mutation StartAuction($id: ID!) {
              startAuction(id: $id) {
                id
                status
              }
            }
          `,
          variables: { id: auction.id }
        });
      console.log('[AuctionStateTest] GraphQL test: sending startAuction mutation...');
      console.log('[AuctionStateTest] GraphQL test: startAuction response body:', startResponse.body);
      if (startResponse.status !== 200 || startResponse.body.errors) {
        console.error('[AuctionStateTest] GraphQL test: startAuction error:', startResponse.body.errors);
        // Optionally, fetch the schema and log available mutations here
      }
      expect(startResponse.status).toBe(200);
      expect(startResponse.body.errors).toBeUndefined();
      expect(startResponse.body.data).toBeDefined();
      expect(startResponse.body.data.startAuction.status).toBe('active');
      // Verify database state change
      const updatedAuctionStart = await prisma.auction.findUnique({ where: { id: auction.id }});
      expect(updatedAuctionStart?.status).toBe('active');
      // Use the agent for the completeAuction mutation
      const completeResponse = await agent
        .post('/graphql')
        .set('Authorization', `Bearer ${generateToken('admin-id', 'admin')}`)
        .send({
          query: `
            mutation CompleteAuction($id: ID!) {
              completeAuction(id: $id) {
                id
                status
              }
            }
          `,
          variables: { id: auction.id }
        });
      console.log('[AuctionStateTest] GraphQL test: sending completeAuction mutation...');
      console.log('[AuctionStateTest] GraphQL test: completeAuction response body:', completeResponse.body);
      if (completeResponse.status !== 200 || completeResponse.body.errors) {
        console.error('[AuctionStateTest] GraphQL test: completeAuction error:', completeResponse.body.errors);
        // Optionally, fetch the schema and log available mutations here
      }
      expect(completeResponse.status).toBe(200);
      expect(completeResponse.body.errors).toBeUndefined();
      expect(completeResponse.body.data).toBeDefined();
      expect(completeResponse.body.data.completeAuction.status).toBe('closed');
      // Verify database state change
      const updatedAuctionComplete = await prisma.auction.findUnique({ where: { id: auction.id }});
      expect(updatedAuctionComplete?.status).toBe('closed');
      console.log('[AuctionStateTest] GraphQL test: startAuction response', startResponse.status, startResponse.body);
      console.log('[AuctionStateTest] GraphQL test: completeAuction response', completeResponse.status, completeResponse.body);
    });
  });
});