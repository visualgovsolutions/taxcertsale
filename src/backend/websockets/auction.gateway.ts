import { Server, Socket } from 'socket.io';
import http from 'http';
import { auctionRepository } from '../../repositories/auction.repository';
import { AuctionStatus } from '../../models/entities/auction.entity';

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

  io.use((socket, next) => {
    // Simulate authentication: require a 'token' in handshake query
    const token = socket.handshake.query.token;
    if (!token) {
      return next(new Error('Authentication token required'));
    }
    // In real app, verify token here
    next();
  });

  io.on('connection', (socket: Socket) => {
    if (!socket.handshake.query.token) {
      socket.emit('authError', { message: 'Authentication required' });
      socket.disconnect();
      return;
    }
    console.log(`AuctionGateway: Client connected: ${socket.id}`);

    // Join auction room
    socket.on('joinAuction', async (auctionId: string) => {
      socket.join(`auction_${auctionId}`);
      if (!joinedAuctions[auctionId]) joinedAuctions[auctionId] = new Set();
      joinedAuctions[auctionId].add(socket.id);
      
      // Fetch auction status and emit to the client
      try {
        const auction = await auctionRepository.findById(auctionId);
        socket.emit('joinedAuction', {
          auctionId,
          status: auction?.status || 'unknown'
        });
        console.log(`Client ${socket.id} joined auction ${auctionId} (status: ${auction?.status})`);
      } catch (error) {
        socket.emit('joinedAuction', { auctionId, status: 'unknown' });
        console.log(`Client ${socket.id} joined auction ${auctionId} (status fetch failed)`);
      }
    });

    // Leave auction room
    socket.on('leaveAuction', (auctionId: string) => {
      socket.leave(`auction_${auctionId}`);
      joinedAuctions[auctionId]?.delete(socket.id);
      socket.emit('leftAuction', auctionId);
      console.log(`Client ${socket.id} left auction ${auctionId}`);
    });

    // Handle bid event with validation including auction status
    socket.on('placeBid', async (data: { auctionId?: string; bidAmount?: number; userId?: string }) => {
      const { auctionId, bidAmount, userId } = data || {};
      
      // Basic validation
      if (!auctionId || !userId || typeof bidAmount !== 'number') {
        socket.emit('errorEvent', { message: 'Invalid bid payload.' });
        return;
      }
      
      // Check if user has joined the auction room
      if (!joinedAuctions[auctionId] || !joinedAuctions[auctionId].has(socket.id)) {
        socket.emit('errorEvent', { message: 'You must join the auction room before bidding.' });
        return;
      }
      
      if (bidAmount <= 0) {
        socket.emit('errorEvent', { message: 'Bid amount must be positive.' });
        return;
      }
      
      // Check auction status
      try {
        const auction = await auctionRepository.findById(auctionId);
        
        if (!auction) {
          socket.emit('errorEvent', { message: 'Auction not found.' });
          return;
        }
        
        // Only allow bids for ACTIVE auctions
        if (auction.status !== AuctionStatus.ACTIVE) {
          socket.emit('errorEvent', { 
            message: `Cannot place bid. Auction is ${auction.status.toLowerCase()}, not active.` 
          });
          return;
        }
        
        // Process valid bid
        io.to(`auction_${auctionId}`).emit('bidPlaced', {
          userId,
          bidAmount,
          timestamp: new Date().toISOString(),
        });
        console.log(`Bid placed in auction ${auctionId} by user ${userId}: $${bidAmount}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        socket.emit('errorEvent', { message: `Error processing bid: ${errorMessage}` });
      }
    });

    // Auction status events - with improved state validation
    socket.on('startAuction', async (data: { auctionId: string, adminToken?: string }) => {
      try {
        // Check for admin permissions
        if (!data.adminToken || data.adminToken !== process.env.ADMIN_TOKEN) {
          socket.emit('errorEvent', { message: 'Unauthorized: Admin privileges required to start auction' });
          return;
        }

        const auction = await auctionRepository.findById(data.auctionId);
        
        if (!auction) {
          socket.emit('errorEvent', { message: `Auction with ID ${data.auctionId} not found` });
          return;
        }
        
        if (auction.status !== AuctionStatus.UPCOMING) {
          socket.emit('errorEvent', { 
            message: `Cannot start auction with status ${auction.status}. Only UPCOMING auctions can be started.` 
          });
          return;
        }
        
        const updatedAuction = await auctionRepository.activateAuction(data.auctionId);
        
        if (!updatedAuction) {
          socket.emit('errorEvent', { message: 'Failed to update auction status' });
          return;
        }
        
        io.to(`auction_${data.auctionId}`).emit('auctionStarted', {
          auctionId: data.auctionId,
          status: AuctionStatus.ACTIVE,
          startedAt: new Date().toISOString(),
        });
        
        console.log(`Auction ${data.auctionId} started successfully.`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        socket.emit('errorEvent', { message: `Failed to start auction: ${errorMessage}` });
      }
    });
    
    socket.on('endAuction', async (data: { auctionId: string, adminToken?: string }) => {
      try {
        // Check for admin permissions
        if (!data.adminToken || data.adminToken !== process.env.ADMIN_TOKEN) {
          socket.emit('errorEvent', { message: 'Unauthorized: Admin privileges required to end auction' });
          return;
        }

        const auction = await auctionRepository.findById(data.auctionId);
        
        if (!auction) {
          socket.emit('errorEvent', { message: `Auction with ID ${data.auctionId} not found` });
          return;
        }
        
        if (auction.status !== AuctionStatus.ACTIVE) {
          socket.emit('errorEvent', { 
            message: `Cannot end auction with status ${auction.status}. Only ACTIVE auctions can be completed.` 
          });
          return;
        }
        
        const updatedAuction = await auctionRepository.completeAuction(data.auctionId);
        
        if (!updatedAuction) {
          socket.emit('errorEvent', { message: 'Failed to update auction status' });
          return;
        }
        
        io.to(`auction_${data.auctionId}`).emit('auctionEnded', {
          auctionId: data.auctionId,
          status: AuctionStatus.COMPLETED,
          endedAt: new Date().toISOString(),
        });
        
        console.log(`Auction ${data.auctionId} ended successfully.`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        socket.emit('errorEvent', { message: `Failed to end auction: ${errorMessage}` });
      }
    });

    socket.on('cancelAuction', async (data: { auctionId: string, adminToken?: string }) => {
      try {
        // Check for admin permissions
        if (!data.adminToken || data.adminToken !== process.env.ADMIN_TOKEN) {
          socket.emit('errorEvent', { message: 'Unauthorized: Admin privileges required to cancel auction' });
          return;
        }

        const auction = await auctionRepository.findById(data.auctionId);
        
        if (!auction) {
          socket.emit('errorEvent', { message: `Auction with ID ${data.auctionId} not found` });
          return;
        }
        
        if (auction.status !== AuctionStatus.UPCOMING && auction.status !== AuctionStatus.ACTIVE) {
          socket.emit('errorEvent', { 
            message: `Cannot cancel auction with status ${auction.status}. Only UPCOMING or ACTIVE auctions can be cancelled.` 
          });
          return;
        }
        
        const updatedAuction = await auctionRepository.cancelAuction(data.auctionId);
        
        if (!updatedAuction) {
          socket.emit('errorEvent', { message: 'Failed to update auction status' });
          return;
        }
        
        io.to(`auction_${data.auctionId}`).emit('auctionCancelled', {
          auctionId: data.auctionId,
          status: AuctionStatus.CANCELLED,
          cancelledAt: new Date().toISOString(),
        });
        
        console.log(`Auction ${data.auctionId} cancelled successfully.`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        socket.emit('errorEvent', { message: `Failed to cancel auction: ${errorMessage}` });
      }
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
