import { Server, Socket } from 'socket.io';
import http from 'http';

// Helper to track which sockets have joined which auctions
const joinedAuctions: Record<string, Set<string>> = {};

// This function sets up the Socket.io server for auction events
export function setupAuctionGateway(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // Adjust as needed for production
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`AuctionGateway: Client connected: ${socket.id}`);

    // Join auction room
    socket.on('joinAuction', (auctionId: string) => {
      socket.join(`auction_${auctionId}`);
      if (!joinedAuctions[auctionId]) joinedAuctions[auctionId] = new Set();
      joinedAuctions[auctionId].add(socket.id);
      socket.emit('joinedAuction', auctionId);
      console.log(`Client ${socket.id} joined auction ${auctionId}`);
    });

    // Leave auction room
    socket.on('leaveAuction', (auctionId: string) => {
      socket.leave(`auction_${auctionId}`);
      joinedAuctions[auctionId]?.delete(socket.id);
      socket.emit('leftAuction', auctionId);
      console.log(`Client ${socket.id} left auction ${auctionId}`);
    });

    // Handle bid event with validation
    socket.on('placeBid', (data: { auctionId?: string; bidAmount?: number; userId?: string }) => {
      const { auctionId, bidAmount, userId } = data || {};
      if (!auctionId || !userId || typeof bidAmount !== 'number') {
        socket.emit('errorEvent', { message: 'Invalid bid payload.' });
        return;
      }
      if (!joinedAuctions[auctionId] || !joinedAuctions[auctionId].has(socket.id)) {
        socket.emit('errorEvent', { message: 'You must join the auction room before bidding.' });
        return;
      }
      if (bidAmount <= 0) {
        socket.emit('errorEvent', { message: 'Bid amount must be positive.' });
        return;
      }
      io.to(`auction_${auctionId}`).emit('bidPlaced', {
        userId,
        bidAmount,
        timestamp: new Date().toISOString(),
      });
      console.log(`Bid placed in auction ${auctionId} by user ${userId}: $${bidAmount}`);
    });

    // Auction status events (for demonstration)
    socket.on('startAuction', (auctionId: string) => {
      io.to(`auction_${auctionId}`).emit('auctionStarted', {
        auctionId,
        startedAt: new Date().toISOString(),
      });
      console.log(`Auction ${auctionId} started.`);
    });
    socket.on('endAuction', (auctionId: string) => {
      io.to(`auction_${auctionId}`).emit('auctionEnded', {
        auctionId,
        endedAt: new Date().toISOString(),
      });
      console.log(`Auction ${auctionId} ended.`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      Object.keys(joinedAuctions).forEach(auctionId => {
        if (joinedAuctions[auctionId]) {
          joinedAuctions[auctionId].delete(socket.id);
        }
      });
      console.log(`AuctionGateway: Client disconnected: ${socket.id}`);
    });
  });

  return io;
}
