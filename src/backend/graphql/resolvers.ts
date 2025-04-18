import { GraphQLJSON } from 'graphql-type-json';
import { auctionService } from '../../services/auction.service';
import { auctionRepository } from '../../repositories/auction.repository';
import { AuctionStatus } from '../../models/entities/auction.entity';
import { Server } from 'socket.io';

// Global socket.io instance reference
let io: Server | null = null;

// Function to set the socket.io instance (called from server setup)
export const setSocketInstance = (socketIo: Server) => {
  io = socketIo;
};

// Create repository instances
// const auctionRepositoryInstance = new AuctionRepository();

// Define a basic resolver map
const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    hello: () => 'Hello from GraphQL!',
    // Add other query resolvers here
    auctions: async () => {
      try {
        return await auctionRepository.findAll();
      } catch (error) {
        throw new Error(`Failed to fetch auctions: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    auction: async (_: any, args: { id: string }) => {
      try {
        const auction = await auctionRepository.findById(args.id);
        if (!auction) {
          throw new Error(`Auction with ID ${args.id} not found`);
        }
        return auction;
      } catch (error) {
        throw new Error(`Failed to fetch auction: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    auctionsByCounty: async (_: unknown, { countyId }: { countyId: string }) => {
      return await auctionRepository.findByCounty(countyId);
    },
    upcomingAuctions: async () => {
      return await auctionRepository.findUpcoming();
    },
    activeAuctions: async () => {
      return await auctionRepository.findActive();
    },
    auctionsByStatus: async (_: any, args: { status: AuctionStatus }) => {
      try {
        return await auctionRepository.findByStatus(args.status);
      } catch (error) {
        throw new Error(`Failed to fetch auctions by status: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  },
  Mutation: {
    startAuction: async (_: any, args: { id: string }) => {
      try {
        const auction = await auctionRepository.findById(args.id);
        
        if (!auction) {
          return {
            success: false,
            message: `Auction with ID ${args.id} not found`,
            auction: null
          };
        }
        
        if (auction.status !== AuctionStatus.UPCOMING) {
          return {
            success: false,
            message: `Cannot start auction with status ${auction.status}. Only UPCOMING auctions can be started.`,
            auction
          };
        }
        
        const activatedAuction = await auctionRepository.activateAuction(args.id);
        
        // Emit WebSocket event if io is available
        if (io) {
          io.to(`auction:${args.id}`).emit('auctionStarted', {
            auctionId: args.id,
            status: AuctionStatus.ACTIVE
          });
        }
        
        return {
          success: true,
          message: 'Auction started successfully',
          auction: activatedAuction
        };
      } catch (error) {
        return {
          success: false,
          message: `Failed to start auction: ${error instanceof Error ? error.message : 'Unknown error'}`,
          auction: null
        };
      }
    },
    completeAuction: async (_: any, args: { id: string }) => {
      try {
        const auction = await auctionRepository.findById(args.id);
        
        if (!auction) {
          return {
            success: false,
            message: `Auction with ID ${args.id} not found`,
            auction: null
          };
        }
        
        if (auction.status !== AuctionStatus.ACTIVE) {
          return {
            success: false,
            message: `Cannot complete auction with status ${auction.status}. Only ACTIVE auctions can be completed.`,
            auction
          };
        }
        
        const completedAuction = await auctionRepository.completeAuction(args.id);
        
        // Emit WebSocket event if io is available
        if (io) {
          io.to(`auction:${args.id}`).emit('auctionCompleted', {
            auctionId: args.id,
            status: AuctionStatus.COMPLETED
          });
        }
        
        return {
          success: true,
          message: 'Auction completed successfully',
          auction: completedAuction
        };
      } catch (error) {
        return {
          success: false,
          message: `Failed to complete auction: ${error instanceof Error ? error.message : 'Unknown error'}`,
          auction: null
        };
      }
    },
    cancelAuction: async (_: any, args: { id: string }) => {
      try {
        const auction = await auctionRepository.findById(args.id);
        
        if (!auction) {
          return {
            success: false,
            message: `Auction with ID ${args.id} not found`,
            auction: null
          };
        }
        
        // Only allow cancellation of UPCOMING or ACTIVE auctions
        if (auction.status !== AuctionStatus.UPCOMING && auction.status !== AuctionStatus.ACTIVE) {
          return {
            success: false,
            message: `Cannot cancel auction with status ${auction.status}. Only UPCOMING or ACTIVE auctions can be cancelled.`,
            auction
          };
        }
        
        const canceledAuction = await auctionRepository.cancelAuction(args.id);
        
        // Emit WebSocket event if io is available
        if (io) {
          io.to(`auction:${args.id}`).emit('auctionCancelled', {
            auctionId: args.id,
            status: AuctionStatus.CANCELLED
          });
        }
        
        return {
          success: true,
          message: 'Auction cancelled successfully',
          auction: canceledAuction
        };
      } catch (error) {
        return {
          success: false,
          message: `Failed to cancel auction: ${error instanceof Error ? error.message : 'Unknown error'}`,
          auction: null
        };
      }
    }
  },
  // Add resolvers for custom types if needed
  Auction: {
    // For example, to resolve related fields like county or certificates
    // county: (parent) => countyRepository.findById(parent.countyId),
    // certificates: (parent) => certificateRepository.findByAuctionId(parent.id),
  }
};

export default resolvers; 