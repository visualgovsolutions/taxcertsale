import express from 'express';
import { Server } from 'http';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import { startTestServer, stopTestServer } from '../test-server';
import prisma from '@src/lib/prisma'; // Assuming prisma is used
import { Server as SocketIOServer } from 'socket.io'; // Import type if needed
import { setupAuctionGateway } from '../../websockets/auction.gateway'; // Import gateway setup

// Increase timeout for async operations, especially socket connections/disconnections
jest.setTimeout(30000);

// Helper function to wait for a specific socket event
const waitForEvent = <T>(socket: ClientSocket, eventName: string, timeout = 5000): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event "${eventName}"`));
    }, timeout);

    socket.once(eventName, (data: T) => {
      clearTimeout(timer);
      resolve(data);
    });

    // Handle potential errors during waiting
    socket.once('disconnect', (reason) => {
        clearTimeout(timer);
        reject(new Error(`Socket disconnected while waiting for ${eventName}: ${reason}`));
    });
    socket.once('connect_error', (err) => {
        clearTimeout(timer);
        reject(new Error(`Socket connection error while waiting for ${eventName}: ${err.message}`));
    });
     socket.once('errorEvent', (err) => { // Listen for general errors too
         clearTimeout(timer);
         reject(new Error(`Received errorEvent while waiting for ${eventName}: ${err.message || err}`));
     });
  });
};

describe('Auction WebSocket Gateway', () => {
  let port: number;
  let server: Server;
  let io: SocketIOServer; // Variable to hold the Socket.IO server instance
  let clients: ClientSocket[] = [];
  let testCounty: any; // Using any temporarily to bypass type errors

  beforeAll(async () => {
    const serverSetup = await startTestServer();
    server = serverSetup.server;
    port = (server.address() as any).port;
    io = setupAuctionGateway(server);
    testCounty = await prisma.county.create({
      data: { name: 'Test County WS', state: 'TS' }
    });
  });

  beforeEach(async () => {
    // Clean up existing auctions and bids before each test
    await prisma.bid.deleteMany({});
    await prisma.certificate.deleteMany({}); // Certificates might depend on auctions/properties
    await prisma.auction.deleteMany({});
    await prisma.property.deleteMany({}); // Properties might depend on county

    // Create specific auctions needed for tests and set them to ACTIVE
    const auctionData = [
      { id: 'auction1', status: 'SCHEDULED', countyId: testCounty.id, auctionDate: new Date() },
      { id: 'auction2', status: 'ACTIVE', countyId: testCounty.id, auctionDate: new Date() },
      { id: 'auction3', status: 'SCHEDULED', countyId: testCounty.id, auctionDate: new Date() }, // For bid without joining test
      { id: 'auction4', status: 'ACTIVE', countyId: testCounty.id, auctionDate: new Date() }, // Maybe needed? (Keep for now)
      { id: 'auction5', status: 'ACTIVE', countyId: testCounty.id, auctionDate: new Date() },
      { id: 'auction6', status: 'SCHEDULED', countyId: testCounty.id, auctionDate: new Date() }, // For multi-room test
      { id: 'auctionNoJoin', status: 'ACTIVE', countyId: testCounty.id, auctionDate: new Date() },
      { id: 'auctionInvalidBid', status: 'ACTIVE', countyId: testCounty.id, auctionDate: new Date() },
      { id: 'auctionAuth', status: 'SCHEDULED', countyId: testCounty.id, auctionDate: new Date() },
    ];

    for (const data of auctionData) {
      await prisma.auction.create({ data });
    }
  });

  afterEach(() => {
    // Disconnect clients
    clients.forEach(client => client.connected && client.disconnect());
    clients = [];
  });

  afterAll(async () => {
    // Close Socket.IO server first (important!)
    if (io) {
       // Force disconnect all clients immediately
       io.disconnectSockets(true);
       io.close(); 
    }
    // Clean up test data
    await prisma.bid.deleteMany({});
    await prisma.certificate.deleteMany({});
    await prisma.auction.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.county.delete({ where: { id: testCounty.id }});
    // Disconnect Prisma 
    await prisma.$disconnect();
    // Stop the HTTP server
    await stopTestServer();
  });

  const createClient = (token?: string): ClientSocket => {
    const socketUrl = `http://localhost:${port}`;
    const options: any = {
        reconnection: false,
        forceNew: true,
    };
    if (token) {
        options.auth = { token };
    }
    const client = Client(socketUrl, options);
    clients.push(client);
    return client;
  };

  it('should join an auction room and receive confirmation', async () => {
    const client = createClient('testtoken');
    await waitForEvent(client, 'connect');
    client.emit('joinAuction', 'auction1');
    const data = await waitForEvent(client, 'joinedAuction') as { auctionId: string };
    expect(data.auctionId).toEqual('auction1');
  }, 10000);

  it('should broadcast bidPlaced event to all clients in the room', async () => {
    const client1 = createClient('client1-token');
    const client2 = createClient('client2-token');
    const auctionId = 'auction2';

    await Promise.all([
        waitForEvent(client1, 'connect'), 
        waitForEvent(client2, 'connect')
    ]);

    client1.emit('joinAuction', auctionId);
    client2.emit('joinAuction', auctionId);

    await Promise.all([
        waitForEvent(client1, 'joinedAuction'),
        waitForEvent(client2, 'joinedAuction')
    ]);

    client1.emit('placeBid', { auctionId: auctionId, bidAmount: 100, userId: 'user1' });

    const bidData1 = await waitForEvent(client1, 'bidPlaced') as { userId: string, bidAmount: number };
    const bidData2 = await waitForEvent(client2, 'bidPlaced') as { userId: string, bidAmount: number };

    expect(bidData1.userId).toBe('user1');
    expect(bidData1.bidAmount).toBe(100);
    expect(bidData2.userId).toBe('user1');
    expect(bidData2.bidAmount).toBe(100);

  }, 10000);

  it('should emit error if placing a bid without joining', async () => {
    const client = createClient('testtoken');
    await waitForEvent(client, 'connect');
    client.emit('placeBid', { auctionId: 'auctionNoJoin', bidAmount: 100, userId: 'user1' });
    const errorData = await waitForEvent(client, 'errorEvent') as { message: string };
    expect(errorData.message).toContain('join the auction room before bidding');
  }, 10000);

  it('should emit error for invalid bid payload', async () => {
    const client = createClient('testtoken');
    await waitForEvent(client, 'connect');
    
    client.emit('joinAuction', 'auctionInvalidBid');
    await waitForEvent(client, 'joinedAuction');

    client.emit('placeBid', { auctionId: 'auctionInvalidBid' /* missing bidAmount */ });
    const errorData = await waitForEvent(client, 'errorEvent') as { message: string };
    expect(errorData.message).toContain('Invalid bid payload');
  }, 10000);

  it('should only broadcast bidPlaced to clients in the correct room', async () => {
    const clientA = createClient('clientA-token');
    const clientB = createClient('clientB-token');
    const clientC = createClient('clientC-token');
    const auctionId5 = 'auction5';
    const auctionId6 = 'auction6';

    await Promise.all([
        waitForEvent(clientA, 'connect'), 
        waitForEvent(clientB, 'connect'),
        waitForEvent(clientC, 'connect')
    ]);

    clientA.emit('joinAuction', auctionId5);
    clientB.emit('joinAuction', auctionId5);
    clientC.emit('joinAuction', auctionId6);

    await Promise.all([
        waitForEvent(clientA, 'joinedAuction'),
        waitForEvent(clientB, 'joinedAuction'),
        waitForEvent(clientC, 'joinedAuction')
    ]);

    clientA.emit('placeBid', { auctionId: auctionId5, bidAmount: 200, userId: 'userA' });

    const bidDataB = await waitForEvent(clientB, 'bidPlaced') as { userId: string, bidAmount: number };
    expect(bidDataB.userId).toBe('userA');
    expect(bidDataB.bidAmount).toBe(200);

    await expect(waitForEvent(clientA, 'bidPlaced', 1000)).rejects.toThrow('Timeout waiting for event "bidPlaced"');
    await expect(waitForEvent(clientC, 'bidPlaced', 1000)).rejects.toThrow('Timeout waiting for event "bidPlaced"');

  }, 10000);

  it('should reject connection without token', async () => {
    const client = createClient(); // No token
    try {
      await waitForEvent(client, 'connect');
      fail('Connection succeeded without token');
    } catch (error: any) {
      expect(error.message).toContain('Authentication token required');
    }
  }, 10000);

  it('should allow connection with token and join auction', async () => {
    const client = createClient('valid-token');
    await waitForEvent(client, 'connect');
    client.emit('joinAuction', 'auctionAuth');
    const joinData = await waitForEvent(client, 'joinedAuction') as { auctionId: string };
    expect(joinData.auctionId).toEqual('auctionAuth');
  }, 10000);
});
