import { createServer } from 'http';
import express from 'express';
import { setupAuctionGateway } from '../../websockets/auction.gateway';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';

describe('Auction WebSocket Gateway', () => {
  let httpServer: ReturnType<typeof createServer>;
  let serverAddress: string;
  let clientSocket: ClientSocket;

  beforeAll(done => {
    const app = express();
    httpServer = createServer(app);
    setupAuctionGateway(httpServer);

    httpServer.listen(() => {
      const { port } = httpServer.address() as any;
      serverAddress = `http://localhost:${port}`;
      done();
    });
  });

  afterAll(done => {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
    httpServer.close(done);
  });

  it('should join an auction room and receive confirmation', (done) => {
    clientSocket = Client(serverAddress + '?token=testtoken');

    clientSocket.on('connect', () => {
      clientSocket.emit('joinAuction', 'auction1');
    });

    clientSocket.on('joinedAuction', (auctionId: string) => {
      expect(auctionId).toBe('auction1');
      clientSocket.disconnect();
      done();
    });
    setTimeout(() => {
      clientSocket.disconnect();
      done(new Error('Did not receive joinedAuction event'));
    }, 2000);
  });

  it('should broadcast bidPlaced event to all clients in the room', (done) => {
    const client1 = Client(serverAddress + '?token=testtoken');
    const client2 = Client(serverAddress + '?token=testtoken');

    let received = false;

    client1.on('connect', () => {
      client1.emit('joinAuction', 'auction2');
    });
    client2.on('connect', () => {
      client2.emit('joinAuction', 'auction2');
    });

    client2.on('joinedAuction', () => {
      setTimeout(() => {
        client1.emit('placeBid', {
          auctionId: 'auction2',
          bidAmount: 500,
          userId: 'user1',
        });
      }, 100);
    });

    client2.on('bidPlaced', (data) => {
      expect(data).toMatchObject({
        userId: 'user1',
        bidAmount: 500,
      });
      received = true;
      client1.disconnect();
      client2.disconnect();
      done();
    });

    setTimeout(() => {
      if (!received) {
        client1.disconnect();
        client2.disconnect();
        done(new Error('Did not receive bidPlaced event'));
      }
    }, 2000);
  });

  it('should emit error if placing a bid without joining', (done) => {
    const client = Client(serverAddress + '?token=testtoken');
    client.on('connect', () => {
      client.emit('placeBid', { auctionId: 'auction3', bidAmount: 100, userId: 'user2' });
    });
    client.on('errorEvent', (err) => {
      expect(err).toHaveProperty('message', 'You must join the auction room before bidding.');
      client.disconnect();
      done();
    });
    setTimeout(() => {
      client.disconnect();
      done(new Error('Did not receive errorEvent for bid without joining'));
    }, 2000);
  });

  it('should emit error for invalid bid payload', (done) => {
    const client = Client(serverAddress + '?token=testtoken');
    client.on('connect', () => {
      client.emit('joinAuction', 'auction4');
      client.emit('placeBid', { auctionId: 'auction4', bidAmount: -10, userId: 'user3' });
    });
    client.on('errorEvent', (err) => {
      expect(err.message).toMatch(/(positive|payload)/i);
      client.disconnect();
      done();
    });
    setTimeout(() => {
      client.disconnect();
      done(new Error('Did not receive errorEvent for invalid bid payload'));
    }, 2000);
  });

  it('should only broadcast bidPlaced to clients in the correct room', (done) => {
    const clientA = Client(serverAddress + '?token=testtoken');
    const clientB = Client(serverAddress + '?token=testtoken');
    const clientC = Client(serverAddress + '?token=testtoken');
    let received = false;
    clientA.on('connect', () => {
      clientA.emit('joinAuction', 'auction5');
    });
    clientB.on('connect', () => {
      clientB.emit('joinAuction', 'auction5');
    });
    clientC.on('connect', () => {
      clientC.emit('joinAuction', 'auction6');
    });
    clientB.on('joinedAuction', () => {
      setTimeout(() => {
        clientA.emit('placeBid', { auctionId: 'auction5', bidAmount: 200, userId: 'userA' });
      }, 100);
    });
    clientB.on('bidPlaced', (data) => {
      expect(data.userId).toBe('userA');
      received = true;
      clientA.disconnect();
      clientB.disconnect();
      clientC.disconnect();
      done();
    });
    clientC.on('bidPlaced', () => {
      clientA.disconnect();
      clientB.disconnect();
      clientC.disconnect();
      done(new Error('Client in wrong room received bidPlaced event'));
    });
    setTimeout(() => {
      if (!received) {
        clientA.disconnect();
        clientB.disconnect();
        clientC.disconnect();
        done(new Error('Did not receive bidPlaced event in correct room'));
      }
    }, 2000);
  });

  it('should broadcast auctionStarted and auctionEnded events', (done) => {
    const client1 = Client(serverAddress + '?token=testtoken');
    const client2 = Client(serverAddress + '?token=testtoken');
    let started = false;
    let ended = false;
    client1.on('connect', () => {
      client1.emit('joinAuction', 'auction7');
    });
    client2.on('connect', () => {
      client2.emit('joinAuction', 'auction7');
    });
    client2.on('joinedAuction', () => {
      setTimeout(() => {
        client1.emit('startAuction', 'auction7');
      }, 100);
    });
    client2.on('auctionStarted', (data) => {
      expect(data.auctionId).toBe('auction7');
      started = true;
      setTimeout(() => {
        client1.emit('endAuction', 'auction7');
      }, 100);
    });
    client2.on('auctionEnded', (data) => {
      expect(data.auctionId).toBe('auction7');
      ended = true;
      client1.disconnect();
      client2.disconnect();
      done();
    });
    setTimeout(() => {
      if (!started || !ended) {
        client1.disconnect();
        client2.disconnect();
        done(new Error('Did not receive auctionStarted or auctionEnded event'));
      }
    }, 3000);
  });

  it('should reject connection without token', (done) => {
    const client = require('socket.io-client')(`http://localhost:${(httpServer.address() as any).port}`, {
      reconnection: false,
      timeout: 1000,
      autoConnect: false,
    });
    client.on('authError', (err: any) => {
      expect(err).toHaveProperty('message', 'Authentication required');
      client.disconnect();
      done();
    });
    client.on('connect_error', (err: any) => {
      // Should not connect
      expect(err.message).toMatch(/Authentication token required/);
      client.disconnect();
      done();
    });
    client.open();
  });

  it('should allow connection with token and join auction', (done) => {
    const client = require('socket.io-client')(`http://localhost:${(httpServer.address() as any).port}?token=validtoken`);
    client.on('connect', () => {
      client.emit('joinAuction', 'auctionAuth');
    });
    client.on('joinedAuction', (auctionId: string) => {
      expect(auctionId).toBe('auctionAuth');
      client.disconnect();
      done();
    });
  });
});
