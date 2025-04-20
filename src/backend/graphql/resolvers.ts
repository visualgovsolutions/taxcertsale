import { GraphQLJSON } from 'graphql-type-json';
import { auctionRepository } from '../../repositories/auction.repository';
import { Server } from 'socket.io';
import { GraphQLContext } from './index';
import { GraphQLError } from 'graphql';
import { emitAuctionStateChange } from '../websockets/auction.gateway';

// Define constants for roles/statuses used in logic
const UserRoles = { ADMIN: 'admin', COUNTY_OFFICIAL: 'county_official' }; // Adjust if needed
const AuctionStatuses = { SCHEDULED: 'scheduled', ACTIVE: 'active', COMPLETED: 'closed', CANCELLED: 'cancelled' }; // Map to Prisma strings

// Socket.io server instance - will be initialized elsewhere
let io: Server | null = null;

// Give the socket.io server to the resolvers
export const setSocketServer = (socketServer: Server) => {
  io = socketServer;
};

// Helper function to check if user is authenticated and has required roles
const checkAuth = (context: GraphQLContext, roles: string[]) => { // Use string[] for roles
  if (!context.user) {
    throw new GraphQLError('User not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }
  
  if (!roles.includes(context.user.role)) { // Check against user's string role
    throw new GraphQLError(`User does not have required role. Required: ${roles.join(', ')}`, {
      extensions: { code: 'FORBIDDEN' }
    });
  }
};

// Use the auctionRepository instance
const auctionRepositoryInstance = auctionRepository;

// Define resolver parameter types
type ResolverParent = unknown;
type IdArg = { id: string };
type StatusArg = { status: string }; // Status is now a string
type CountyIdArg = { countyId: string };

// Define a basic resolver map
const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    hello: (_parent: ResolverParent, _args: Record<string, never>, _context: GraphQLContext) => 'Hello world!',
    // Add other query resolvers here
    auctions: async (_: ResolverParent, _args: Record<string, never>, _context: GraphQLContext) => {
      return await auctionRepositoryInstance.findAll();
    },
    auction: async (_: ResolverParent, { id }: IdArg, _context: GraphQLContext) => {
      return await auctionRepositoryInstance.findById(id);
    },
    auctionsByCounty: async (_: ResolverParent, { countyId }: CountyIdArg, _context: GraphQLContext) => {
      return await auctionRepositoryInstance.findByCounty(countyId);
    },
    upcomingAuctions: async (_: ResolverParent, _args: Record<string, never>, _context: GraphQLContext) => {
      return await auctionRepositoryInstance.findUpcoming();
    },
    activeAuctions: async (_: ResolverParent, _args: Record<string, never>, _context: GraphQLContext) => {
      return await auctionRepositoryInstance.findActive();
    },
    auctionsByStatus: async (_: ResolverParent, args: StatusArg, _context: GraphQLContext) => {
      try {
        // Public endpoint - no auth required
        return await auctionRepositoryInstance.findByStatus(args.status);
      } catch (error) {
        throw new GraphQLError(`Failed to fetch auctions by status: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    auctionManagementData: async (_: ResolverParent, _args: Record<string, never>, context: GraphQLContext) => {
      try {
        // Only admins and county officials can access management data
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);
        
        // Return management statistics
        // Assuming repository methods return arrays or use prisma count
        const activeCount = (await auctionRepositoryInstance.findActive()).length;
        const upcomingCount = (await auctionRepositoryInstance.findUpcoming()).length;
        const completedCount = (await auctionRepositoryInstance.findCompleted()).length;
        
        return {
          activeAuctions: activeCount,
          upcomingAuctions: upcomingCount,
          completedAuctions: completedCount,
          totalAuctions: activeCount + upcomingCount + completedCount
        };
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new GraphQLError(`Failed to fetch management data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  },
  Mutation: {
    // Auction state transition mutations
    startAuction: async (_: ResolverParent, { id }: IdArg, context: GraphQLContext) => {
      try {
        // Only admins and county officials can start auctions
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);
        
        const auction = await auctionRepositoryInstance.findById(id);
        
        // Debug log: print auction object and status
        console.log('[GraphQL] startAuction: loaded auction:', auction);
        
        if (!auction) {
          throw new GraphQLError(`Auction with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' }
          });
        }
        
        // Use string status
        if (auction.status !== AuctionStatuses.SCHEDULED) {
          console.log('[GraphQL] startAuction: status mismatch:', auction.status, '!=', AuctionStatuses.SCHEDULED);
          throw new GraphQLError(`Cannot start auction with status ${auction.status}. Only SCHEDULED auctions can be started.`, {
            extensions: { code: 'BAD_REQUEST' }
          });
        }
        
        const updatedAuction = await auctionRepositoryInstance.activateAuction(id);
        
        if (!updatedAuction) {
          // This might happen if the atomic update in repo failed (e.g., status changed concurrently)
           throw new GraphQLError(`Failed to start auction ${id}. It might not be in the correct state or was not found.`, {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
          });
        }
        
        // Use the shared emitter function for WebSocket notifications
        emitAuctionStateChange('auctionStarted', {
          auctionId: id,
          status: AuctionStatuses.ACTIVE, // Use string status
          startedBy: context.user?.email || 'system'
        });
        
        return updatedAuction;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new GraphQLError(`Failed to start auction: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    
    completeAuction: async (_: ResolverParent, { id }: IdArg, context: GraphQLContext) => {
      try {
        // Only admins and county officials can complete auctions
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);
        
        const auction = await auctionRepositoryInstance.findById(id);
        
        if (!auction) {
          throw new GraphQLError(`Auction with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' }
          });
        }
        
        // Use string status
        if (auction.status !== AuctionStatuses.ACTIVE) {
          throw new GraphQLError(`Cannot complete auction with status ${auction.status}. Only ACTIVE auctions can be completed.`, {
            extensions: { code: 'BAD_REQUEST' }
          });
        }
        
        const updatedAuction = await auctionRepositoryInstance.completeAuction(id);

        if (!updatedAuction) {
          throw new GraphQLError(`Failed to complete auction ${id}. It might not be in the correct state or was not found.`, {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
          });
        }
        
        // Use the shared emitter function for WebSocket notifications
        emitAuctionStateChange('auctionCompleted', {
          auctionId: id,
          status: AuctionStatuses.COMPLETED, // Use string status
          completedBy: context.user?.email || 'system'
        });
        
        return updatedAuction;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new GraphQLError(`Failed to complete auction: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    
    cancelAuction: async (_: ResolverParent, { id }: IdArg, context: GraphQLContext) => {
      try {
        // Only admins and county officials can cancel auctions
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);
        
        const auction = await auctionRepositoryInstance.findById(id);
        
        if (!auction) {
          throw new GraphQLError(`Auction with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' }
          });
        }
        
        // Can only cancel upcoming or active auctions (use string status)
        if (auction.status !== AuctionStatuses.SCHEDULED && auction.status !== AuctionStatuses.ACTIVE) {
          throw new GraphQLError(`Cannot cancel auction with status ${auction.status}. Only SCHEDULED or ACTIVE auctions can be cancelled.`, {
            extensions: { code: 'BAD_REQUEST' }
          });
        }
        
        const updatedAuction = await auctionRepositoryInstance.cancelAuction(id);

        if (!updatedAuction) {
           throw new GraphQLError(`Failed to cancel auction ${id}. It might not be in the correct state or was not found.`, {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
          });
        }
        
        // Use the shared emitter function for WebSocket notifications
        emitAuctionStateChange('auctionCancelled', {
          auctionId: id,
          status: AuctionStatuses.CANCELLED, // Use string status
          cancelledBy: context.user?.email || 'system'
        });
        
        return updatedAuction;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new GraphQLError(`Failed to cancel auction: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
};

export default resolvers;