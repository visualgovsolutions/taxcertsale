import { Express } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ioc from 'socket.io-client';
import request from 'supertest';
import assert from 'assert';
import { initializeDatabase } from '../../config/database';
import { AuctionStatus } from '../../models/entities/auction.entity';
import { auctionRepository } from '../../repositories/auction.repository';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { readFileSync } from 'fs';
import path from 'path';

// Create a test Express app with mock GraphQL endpoint
async function createTestApp(): Promise<Express> {
  const app = express();
  
  // Load schema from file
  const typeDefs = readFileSync(
    path.join(__dirname, '../../backend/graphql/schema.graphql'),
    'utf8'
  );
  
  // Create mock resolvers for testing
  const resolvers = {
    Query: {
      hello: () => 'Hello world!'
    },
    Mutation: {
      startAuction: async (_: any, { id }: { id: string }) => {
        try {
          const auction = await auctionRepository.findById(id);
          if (!auction) {
            return {
              success: false,
              message: 'Auction not found',
              auction: null
            };
          }
          
          const updatedAuction = await auctionRepository.activateAuction(id);
          return {
            success: true,
            message: 'Auction started successfully',
            auction: updatedAuction
          };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            auction: null
          };
        }
      },
      completeAuction: async (_: any, { id }: { id: string }) => {
        try {
          const auction = await auctionRepository.findById(id);
          if (!auction) {
            return {
              success: false,
              message: 'Auction not found',
              auction: null
            };
          }
          
          const updatedAuction = await auctionRepository.completeAuction(id);
          return {
            success: true,
            message: 'Auction completed successfully',
            auction: updatedAuction
          };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            auction: null
          };
        }
      },
      cancelAuction: async (_: any, { id }: { id: string }) => {
        try {
          const auction = await auctionRepository.findById(id);
          if (!auction) {
            return {
              success: false,
              message: 'Auction not found',
              auction: null
            };
          }
          
          const updatedAuction = await auctionRepository.cancelAuction(id);
          return {
            success: true,
            message: 'Auction cancelled successfully',
            auction: updatedAuction
          };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            auction: null
          };
        }
      }
    }
  };
  
  // Create Apollo Server
  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();
  app.use('/graphql', expressMiddleware(apolloServer));
  
  return app;
}

describe('Auction State Management Integration Tests', () => {
  let testApp: Express;
  let httpServer: ReturnType<typeof createServer>;
  let socketServer: Server;
  let clientSocket: ReturnType<typeof ioc>;
  
  beforeAll(async () => {
    await initializeDatabase();
    testApp = await createTestApp();
    httpServer = createServer(testApp);
    
    // Setup WebSocket server
    socketServer = new Server(httpServer);
    httpServer.listen(5000);
    
    // Setup WebSocket event handlers
    socketServer.on('connection', (socket) => {
      socket.on('joinAuction', (auctionId) => {
        socket.join(`auction:${auctionId}`);
        socket.emit('auctionJoined', { auctionId, message: 'Joined auction room' });
      });
      
      // Handle bid placement based on auction status
      socket.on('placeBid', async (data) => {
        const { auctionId, amount, userId } = data;
        
        try {
          // Get auction to check status
          const auction = await auctionRepository.findById(auctionId);
          
          if (!auction) {
            socket.emit('bidError', { message: 'Auction not found' });
            return;
          }
          
          if (auction.status !== AuctionStatus.ACTIVE) {
            socket.emit('bidError', { 
              message: 'Bids can only be placed on active auctions',
              auctionStatus: auction.status
            });
            return;
          }
          
          // Mock successful bid
          socket.emit('bidAccepted', { 
            auctionId, 
            amount, 
            userId,
            timestamp: new Date().toISOString()
          });
          
          // Broadcast to all clients in the auction room
          socketServer.to(`auction:${auctionId}`).emit('newBid', {
            auctionId,
            amount,
            userId,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          socket.emit('bidError', { message: 'Error processing bid' });
        }
      });
      
      // Handle auction state changes
      socket.on('auctionStateChange', (data) => {
        const { auctionId, status } = data;
        socketServer.to(`auction:${auctionId}`).emit('auctionStatusUpdated', {
          auctionId,
          status,
          timestamp: new Date().toISOString()
        });
      });
    });
    
    // Setup client socket
    clientSocket = ioc('http://localhost:5000');
  });
  
  afterAll(() => {
    socketServer.close();
    httpServer.close();
    clientSocket.close();
  });
  
  describe('GraphQL Auction State Management', () => {
    test('Start Auction mutation changes status to ACTIVE', async () => {
      const response = await request(testApp)
        .post('/graphql')
        .send({
          query: `
            mutation {
              startAuction(id: "test-auction-1") {
                success
                message
                auction {
                  id
                  status
                }
              }
            }
          `
        });
      
      expect(response.status).toBe(200);
      expect(response.body.data).not.toBeUndefined();
      expect(response.body.data.startAuction.success).toBe(true);
      expect(response.body.data.startAuction.auction.status).toBe(AuctionStatus.ACTIVE);
    });
    
    test('Complete Auction mutation changes status to COMPLETED', async () => {
      const response = await request(testApp)
        .post('/graphql')
        .send({
          query: `
            mutation {
              completeAuction(id: "test-auction-1") {
                success
                message
                auction {
                  id
                  status
                }
              }
            }
          `
        });
      
      expect(response.status).toBe(200);
      expect(response.body.data).not.toBeUndefined();
      expect(response.body.data.completeAuction.success).toBe(true);
      expect(response.body.data.completeAuction.auction.status).toBe(AuctionStatus.COMPLETED);
    });
  });
  
  describe('WebSocket Bid Validation', () => {
    test('Bids are rejected for non-active auctions', (done) => {
      // First join the auction room
      clientSocket.emit('joinAuction', 'test-auction-2');
      
      // Create test data for a completed auction
      const testData = {
        auctionId: 'test-auction-2',
        amount: 1000,
        userId: 'test-user-1'
      };
      
      // Listen for bid error event
      clientSocket.on('bidError', (response) => {
        try {
          expect(response.message).not.toBeUndefined();
          expect(response.auctionStatus).toBe(AuctionStatus.COMPLETED);
          done();
        } catch (error) {
          done(error);
        }
      });
      
      // Emit bid attempt on a completed auction (status set in previous test)
      clientSocket.emit('placeBid', testData);
    });
  });
});

// Setup test suite for auction state transitions
describe('Auction State Transitions', () => {
  let app: Express;
  let server: ReturnType<typeof createServer>;
  let io: Server;
  let auctionId: string;
  
  beforeAll(async () => {
    // Initialize database connection
    await initializeDatabase();
    
    // Create test app with GraphQL endpoint
    app = await createTestApp();
    
    // Setup WebSocket server for auction events
    server = createServer(app);
    io = new Server(server);
    
    // Handle WebSocket connections for auctions
    io.on('connection', (socket) => {
      // Handle auction state changes
      socket.on('join-auction', (data) => {
        socket.join(`auction-${data.auctionId}`);
        socket.emit('auction-joined', { auctionId: data.auctionId });
      });
      
      // Handle bids - only accept if auction is ACTIVE
      socket.on('place-bid', async (data) => {
        try {
          const auction = await auctionRepository.findById(data.auctionId);
          
          if (!auction) {
            socket.emit('bid-error', { message: 'Auction not found' });
            return;
          }
          
          if (auction.status !== AuctionStatus.ACTIVE) {
            socket.emit('bid-error', { 
              message: `Cannot place bid on auction with status ${auction.status}` 
            });
            return;
          }
          
          // Mock successful bid processing
          socket.emit('bid-accepted', { 
            auctionId: data.auctionId,
            bidAmount: data.amount,
            timestamp: new Date()
          });
          
          // Broadcast to all clients in the auction room
          io.to(`auction-${data.auctionId}`).emit('new-bid', {
            auctionId: data.auctionId,
            bidAmount: data.amount,
            timestamp: new Date()
          });
        } catch (error) {
          socket.emit('bid-error', { 
            message: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      });
    });
    
    // Start server on a random port
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        resolve();
      });
    });
    
    // Create a test auction
    const now = new Date();
    const auction = await auctionRepository.create({
      name: 'Test Auction',
      auctionDate: now,
      startTime: formatTimeForDB(now),
      endTime: formatTimeForDB(new Date(now.getTime() + 3600000)), // 1 hour from now
      status: AuctionStatus.UPCOMING
    });
    
    auctionId = auction.id;
  });
  
  // Helper function to format time as HH:MM:SS
  function formatTimeForDB(date: Date): string {
    if (!date) {
      return '00:00:00'; // Default time if date is undefined
    }
    const timeString = date.toTimeString();
    // Split the time string and ensure we have a string value
    const timeParts = timeString.split(' ');
    return timeParts[0] || '00:00:00'; // Returns "HH:MM:SS"
  }
  
  afterAll(async () => {
    // Clean up
    io.close();
    server.close();
  });
  
  test('Should start an auction with GraphQL mutation', async () => {
    const mutation = `
      mutation {
        startAuction(id: "${auctionId}") {
          success
          message
          auction {
            id
            status
          }
        }
      }
    `;
    
    const response = await request(app)
      .post('/graphql')
      .send({
        query: mutation
      })
      .set('Accept', 'application/json');
      
    expect(response.status).toBe(200);
    expect(response.body.data.startAuction.success).toBe(true);
    expect(response.body.data.startAuction.auction.status).toBe(AuctionStatus.ACTIVE);
    
    // Verify in database
    const updatedAuction = await auctionRepository.findById(auctionId);
    expect(updatedAuction?.status).toBe(AuctionStatus.ACTIVE);
  });
  
  test('Should not accept bids for non-active auctions', async () => {
    // Create a new test auction with UPCOMING status
    const now = new Date();
    const futureDateHour = new Date(now.getTime() + 3600000); // 1 hour from now
    const futureDateTwoHours = new Date(now.getTime() + 7200000); // 2 hours from now
    
    const upcomingAuction = await auctionRepository.create({
      name: 'Upcoming Test Auction',
      auctionDate: now,
      startTime: formatTimeForDB(futureDateHour),
      endTime: formatTimeForDB(futureDateTwoHours),
      status: AuctionStatus.UPCOMING
    });
    
    // Connect to WebSocket
    const port = (server.address() as any).port;
    const socket = ioc(`http://localhost:${port}`);
    
    // Join the auction room
    socket.emit('join-auction', { auctionId: upcomingAuction.id });
    
    // Wait for join confirmation
    await new Promise<void>((resolve) => {
      socket.once('auction-joined', () => {
        resolve();
      });
    });
    
    // Try to place a bid on UPCOMING auction
    let bidErrorMessage: string | null = null;
    
    socket.emit('place-bid', { 
      auctionId: upcomingAuction.id, 
      amount: 1000 
    });
    
    await new Promise<void>((resolve) => {
      socket.once('bid-error', (data) => {
        bidErrorMessage = data.message;
        resolve();
      });
      
      // Safety timeout
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    
    // Disconnect socket
    socket.disconnect();
    
    // Assert bid was rejected due to auction status
    expect(bidErrorMessage).toContain('Cannot place bid on auction with status');
  });
  
  test('Should complete an auction with GraphQL mutation', async () => {
    const mutation = `
      mutation {
        completeAuction(id: "${auctionId}") {
          success
          message
          auction {
            id
            status
          }
        }
      }
    `;
    
    const response = await request(app)
      .post('/graphql')
      .send({
        query: mutation
      })
      .set('Accept', 'application/json');
      
    expect(response.status).toBe(200);
    expect(response.body.data.completeAuction.success).toBe(true);
    expect(response.body.data.completeAuction.auction.status).toBe(AuctionStatus.COMPLETED);
    
    // Verify in database
    const updatedAuction = await auctionRepository.findById(auctionId);
    expect(updatedAuction?.status).toBe(AuctionStatus.COMPLETED);
  });
  
  test('Should cancel an auction with GraphQL mutation', async () => {
    // Create a new test auction
    const now = new Date();
    const futureDate = new Date(now.getTime() + 3600000); // 1 hour from now
    
    const newAuction = await auctionRepository.create({
      name: 'Auction to Cancel',
      auctionDate: now,
      startTime: formatTimeForDB(now),
      endTime: formatTimeForDB(futureDate),
      status: AuctionStatus.UPCOMING
    });
    
    const mutation = `
      mutation {
        cancelAuction(id: "${newAuction.id}") {
          success
          message
          auction {
            id
            status
          }
        }
      }
    `;
    
    const response = await request(app)
      .post('/graphql')
      .send({
        query: mutation
      })
      .set('Accept', 'application/json');
      
    expect(response.status).toBe(200);
    expect(response.body.data.cancelAuction.success).toBe(true);
    expect(response.body.data.cancelAuction.auction.status).toBe(AuctionStatus.CANCELLED);
    
    // Verify in database
    const updatedAuction = await auctionRepository.findById(newAuction.id);
    expect(updatedAuction?.status).toBe(AuctionStatus.CANCELLED);
  });
}); 