import { GraphQLJSON } from 'graphql-type-json';
import { auctionRepository } from '../../repositories/auction.repository';
import { Server } from 'socket.io';
import { GraphQLContext } from './index';
import { GraphQLError } from 'graphql';
import { emitAuctionStateChange } from '../websockets/auction.gateway';
import prisma from '../../lib/prisma';
import { Prisma, PrismaClient } from '../../generated/prisma';
import { hashPassword } from '../utils/passwordUtils';
import { generateAccessToken } from '../utils/jwtUtils';
import { comparePassword } from '../utils/passwordUtils';
import { startOfDay, endOfDay, format } from 'date-fns'; // Import date-fns helpers
import {
  activityLogService,
  ActivityLogInput as ServiceActivityLogInput,
} from '../services/activityLog/ActivityLogService';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { User, Auction, Certificate } from '@prisma/client';
import { AuctionService } from '../services/auction/AuctionService';
import { WebSocketService } from '../services/websocket/WebSocketService';
import { ApolloError } from 'apollo-server-express';

// Define constants for roles/statuses used in logic
// Convert UserRole enum to a simple string map for easier checks
const UserRoles = {
  ADMIN: 'ADMIN',
  COUNTY_OFFICIAL: 'COUNTY_OFFICIAL',
  INVESTOR: 'INVESTOR', // Add other roles as needed
  USER: 'USER', // Added USER role
};
// Convert AuctionStatus enum to a simple string map
const AuctionStatuses = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const UserStatuses = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING_KYC: 'PENDING_KYC',
  SUSPENDED: 'SUSPENDED',
};

// Socket.io server instance - will be initialized elsewhere
let io: Server | null = null;

// Give the socket.io server to the resolvers
export const setSocketServer = (socketServer: Server) => {
  io = socketServer;
};

// Helper function to check if user is authenticated and has required roles
const checkAuth = (context: GraphQLContext, roles: string[]) => {
  if (!context.isAuthenticated || !context.user) {
    throw new GraphQLError('User not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  // Convert user role to uppercase for case-insensitive check
  const userRole = context.user.role?.toUpperCase();

  // Check if the uppercase user role is included in the uppercase required roles array
  if (!userRole || !roles.map(role => role.toUpperCase()).includes(userRole)) {
    throw new GraphQLError(`User does not have required role. Required: ${roles.join(', ')}`, {
      extensions: { code: 'FORBIDDEN' },
    });
  }
};

// Use the auctionRepository instance
const auctionRepositoryInstance = auctionRepository;

// Define resolver parameter types
type ResolverParent = unknown;
type IdArg = { id: string };
type StatusArg = { status: string };
type CountyIdArg = { countyId: string };

// Update GraphQLContext type to include user ID
interface ContextUser {
  userId: string;
  id: string; // Add ID field
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface ExtendedGraphQLContext extends GraphQLContext {
  user: ContextUser;
}

// ActivityLog filter types
type ActivityLogFilterInput = {
  fromDate?: string;
  toDate?: string;
  actions?: string[];
  resources?: string[];
  statuses?: string[];
  userId?: string;
  searchTerm?: string;
};

type ActivityLogByResourceArgs = {
  resource: string;
  id?: string;
  limit?: number;
  offset?: number;
};

type ActivityLogByUserArgs = {
  userId: string;
  limit?: number;
  offset?: number;
};

type ActivityLogArgs = {
  filter?: ActivityLogFilterInput;
  limit?: number;
  offset?: number;
  page?: number;
};

type ActivityLogInput = {
  action: string;
  resource: string;
  resourceId?: string;
  status: string;
  details?: string;
  userAgent?: string;
  ipAddress?: string;
};

// Define a basic resolver map
const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    hello: (_parent: ResolverParent, _args: Record<string, never>, _context: GraphQLContext) =>
      'Hello world!',

    // --- Auction Queries ---
    auctions: async (_: ResolverParent, _args: Record<string, never>, _context: GraphQLContext) => {
      // Add auth check if needed
      return await auctionRepositoryInstance.findAll();
    },
    auction: async (_: ResolverParent, { id }: IdArg, _context: GraphQLContext) => {
      // Add auth check if needed
      return await auctionRepositoryInstance.findById(id);
    },
    auctionsByCounty: async (
      _: ResolverParent,
      { countyId }: CountyIdArg,
      _context: GraphQLContext
    ) => {
      // Add auth check if needed
      return await auctionRepositoryInstance.findByCounty(countyId);
    },
    upcomingAuctions: async (
      _: ResolverParent,
      _args: Record<string, never>,
      _context: GraphQLContext
    ) => {
      // Add auth check if needed
      return await auctionRepositoryInstance.findUpcoming();
    },
    activeAuctions: async (
      _: ResolverParent,
      _args: Record<string, never>,
      _context: GraphQLContext
    ) => {
      // Add auth check if needed
      return await auctionRepositoryInstance.findActive();
    },
    auctionsByStatus: async (_: ResolverParent, args: StatusArg, _context: GraphQLContext) => {
      try {
        // Public endpoint - no auth required? Confirm this.
        // Ensure status string matches AuctionStatuses values if needed for repo
        return await auctionRepositoryInstance.findByStatus(args.status);
      } catch (error) {
        console.error('Error fetching auctions by status:', error);
        throw new GraphQLError(
          `Failed to fetch auctions by status: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    auctionManagementData: async (
      _: ResolverParent,
      _args: Record<string, never>,
      context: GraphQLContext
    ) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);

        const activeCount = await prisma.auction.count({
          where: { status: AuctionStatuses.ACTIVE },
        });
        const upcomingCount = await prisma.auction.count({
          where: { status: AuctionStatuses.UPCOMING },
        });
        const completedCount = await prisma.auction.count({
          where: { status: AuctionStatuses.COMPLETED },
        });
        const totalCount = activeCount + upcomingCount + completedCount; // Consider if cancelled should be included

        return {
          activeAuctions: activeCount,
          upcomingAuctions: upcomingCount,
          completedAuctions: completedCount,
          totalAuctions: totalCount,
        };
      } catch (error) {
        console.error('Error fetching auction management data:', error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to fetch management data: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    // --- County Queries ---
    counties: async (_: ResolverParent, _args: Record<string, never>, context: GraphQLContext) => {
      try {
        // Public or specific roles? Assuming Admin/County Official for now
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);
        return await prisma.county.findMany();
      } catch (error) {
        console.error('Error fetching counties:', error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to fetch counties: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    county: async (_: ResolverParent, { id }: IdArg, context: GraphQLContext) => {
      try {
        // Public or specific roles? Assuming Admin/County Official for now
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);
        const county = await prisma.county.findUnique({ where: { id } });
        if (!county) {
          throw new GraphQLError(`County with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        return county;
      } catch (error) {
        console.error(`Error fetching county ${id}:`, error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to fetch county: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    // --- User Queries ---
    users: async (_: ResolverParent, _args: Record<string, never>, context: GraphQLContext) => {
      try {
        checkAuth(context, [UserRoles.ADMIN]);
        return await prisma.user.findMany({
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            status: true, // Included for admin list view
            kycStatus: true, // Included for admin list view
            createdAt: true,
            updatedAt: true,
          },
        });
      } catch (error) {
        console.error('Error fetching users:', error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    user: async (_: ResolverParent, { id }: IdArg, context: GraphQLContext) => {
      try {
        checkAuth(context, [UserRoles.ADMIN]);
        const user = await prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            status: true, // Included for admin detail view
            kycStatus: true, // Included for admin detail view
            createdAt: true,
            updatedAt: true,
          },
        });
        if (!user) {
          throw new GraphQLError(`User with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        return user;
      } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    usersRegisteredTodayCount: async (
      _: ResolverParent,
      _args: Record<string, never>,
      context: GraphQLContext
    ) => {
      try {
        // Only Admins/County Officials can view this stat?
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);

        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        const count = await prisma.user.count({
          where: {
            createdAt: {
              gte: todayStart, // Greater than or equal to start of today
              lt: todayEnd, // Less than end of today (exclusive)
            },
          },
        });
        return count;
      } catch (error) {
        console.error('Error fetching users registered today count:', error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to fetch users registered today count: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    // Activity log queries
    activityLogs: async (
      _: ResolverParent,
      { filter, limit = 20, offset = 0, page }: ActivityLogArgs & { page?: number },
      context: GraphQLContext
    ) => {
      try {
        // If page is provided, calculate the correct offset
        const calculatedOffset = page ? (page - 1) * limit : offset;

        console.log('ACTIVITY LOGS QUERY', { filter, limit, calculatedOffset, originalPage: page });
        const result = await activityLogService.getActivityLogs({
          filter,
          limit,
          offset: calculatedOffset,
        });
        console.log('ACTIVITY LOGS RESULT', {
          count: result.totalCount,
          logs: result.logs.length,
          firstLog: result.logs[0],
        });
        return result;
      } catch (error) {
        console.error('Error fetching activity logs:', error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to fetch activity logs: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    activityLogsByResource: async (
      _: ResolverParent,
      { resource, id, limit = 20, offset = 0 }: ActivityLogByResourceArgs,
      context: GraphQLContext
    ) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);
        return await activityLogService.getActivityLogsByResource({ resource, id, limit, offset });
      } catch (error) {
        console.error(`Error fetching activity logs for resource ${resource}:`, error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to fetch activity logs: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    activityLogsByUser: async (
      _: ResolverParent,
      { userId, limit = 20, offset = 0 }: ActivityLogByUserArgs,
      context: GraphQLContext
    ) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);
        return await activityLogService.getActivityLogsByUser({ userId, limit, offset });
      } catch (error) {
        console.error(`Error fetching activity logs for user ${userId}:`, error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to fetch activity logs: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
  },
  Mutation: {
    // --- Authentication ---
    login: async (
      _: ResolverParent,
      { email, password }: { email: string; password: string },
      context: GraphQLContext
    ) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          // Log failed login attempt directly
          await prisma.systemActivityLog.create({
            data: {
              action: 'LOGIN_ATTEMPT',
              resource: 'System',
              status: 'ERROR',
              details: `Failed login attempt for email: ${email} - User not found`,
              userAgent: context.req?.headers['user-agent'] || 'Unknown',
              ipAddress: String(context.req?.ip || 'Unknown'),
            },
          });
          throw new GraphQLError('Invalid credentials', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        const valid = await comparePassword(password, user.password);
        if (!valid) {
          // Log failed login attempt directly
          await prisma.systemActivityLog.create({
            data: {
              action: 'LOGIN_ATTEMPT',
              resource: 'System',
              status: 'ERROR',
              details: `Failed login attempt for user: ${user.email} - Invalid password`,
              userAgent: context.req?.headers['user-agent'] || 'Unknown',
              ipAddress: String(context.req?.ip || 'Unknown'),
              userId: user.id,
            },
          });
          throw new GraphQLError('Invalid credentials', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        const accessToken = generateAccessToken({
          userId: user.id,
          email: user.email,
          role: user.role as any,
        });

        // Log successful login directly
        await prisma.systemActivityLog.create({
          data: {
            action: 'LOGIN',
            resource: 'System',
            status: 'SUCCESS',
            details: `User logged in successfully: ${user.email}`,
            userAgent: context.req?.headers['user-agent'] || 'Unknown',
            ipAddress: String(context.req?.ip || 'Unknown'),
            userId: user.id,
          },
        });

        // Exclude password from returned user object
        const { password: _pw, ...safeUser } = user;
        return { accessToken, user: safeUser };
      } catch (error) {
        console.error('Login error:', error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError('Login failed');
      }
    },
    // --- Auction State Transition Mutations ---
    startAuction: async (_: ResolverParent, { id }: IdArg, context: GraphQLContext) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);

        const auction = await auctionRepositoryInstance.findById(id);
        if (!auction) {
          throw new GraphQLError(`Auction with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        if (auction.status !== AuctionStatuses.UPCOMING) {
          // Use defined constant
          throw new GraphQLError(
            `Cannot start auction with status ${auction.status}. Only UPCOMING auctions can be started.`,
            { extensions: { code: 'BAD_REQUEST' } }
          );
        }

        const updatedAuction = await auctionRepositoryInstance.activateAuction(id);
        if (!updatedAuction) {
          throw new GraphQLError(`Failed to start auction ${id}.`, {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
          });
        }

        emitAuctionStateChange('auctionStarted', {
          auctionId: id,
          status: AuctionStatuses.ACTIVE,
          startedBy: context.user?.email || 'system',
        });
        return updatedAuction;
      } catch (error) {
        console.error(`Error starting auction ${id}:`, error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to start auction: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    completeAuction: async (_: ResolverParent, { id }: IdArg, context: GraphQLContext) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);

        const auction = await auctionRepositoryInstance.findById(id);
        if (!auction) {
          throw new GraphQLError(`Auction with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        if (auction.status !== AuctionStatuses.ACTIVE) {
          // Use defined constant
          throw new GraphQLError(
            `Cannot complete auction with status ${auction.status}. Only ACTIVE auctions can be completed.`,
            { extensions: { code: 'BAD_REQUEST' } }
          );
        }

        const updatedAuction = await auctionRepositoryInstance.completeAuction(id);
        if (!updatedAuction) {
          throw new GraphQLError(`Failed to complete auction ${id}.`, {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
          });
        }

        emitAuctionStateChange('auctionCompleted', {
          auctionId: id,
          status: AuctionStatuses.COMPLETED,
          completedBy: context.user?.email || 'system',
        });
        return updatedAuction;
      } catch (error) {
        console.error(`Error completing auction ${id}:`, error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to complete auction: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    cancelAuction: async (_: ResolverParent, { id }: IdArg, context: GraphQLContext) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);

        const auction = await auctionRepositoryInstance.findById(id);
        if (!auction) {
          throw new GraphQLError(`Auction with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        if (
          auction.status !== AuctionStatuses.UPCOMING &&
          auction.status !== AuctionStatuses.ACTIVE
        ) {
          // Use defined constants
          throw new GraphQLError(
            `Cannot cancel auction with status ${auction.status}. Only UPCOMING or ACTIVE auctions can be cancelled.`,
            { extensions: { code: 'BAD_REQUEST' } }
          );
        }

        const updatedAuction = await auctionRepositoryInstance.cancelAuction(id);
        if (!updatedAuction) {
          throw new GraphQLError(`Failed to cancel auction ${id}.`, {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
          });
        }

        emitAuctionStateChange('auctionCancelled', {
          auctionId: id,
          status: AuctionStatuses.CANCELLED,
          cancelledBy: context.user?.email || 'system',
        });
        return updatedAuction;
      } catch (error) {
        console.error(`Error cancelling auction ${id}:`, error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to cancel auction: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    // --- County Mutations ---
    createCounty: async (
      _: ResolverParent,
      { input }: { input: Prisma.CountyCreateInput },
      context: GraphQLContext
    ) => {
      try {
        // Only Admins can create counties
        checkAuth(context, [UserRoles.ADMIN]);
        const newCounty = await prisma.county.create({
          data: input,
        });
        return newCounty;
      } catch (error) {
        console.error('Error creating county:', error);
        if ((error as any).code === 'P2002') {
          throw new GraphQLError('County with this name or code already exists.', {
            extensions: { code: 'BAD_REQUEST' },
          });
        }
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to create county: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    updateCounty: async (
      _: ResolverParent,
      { id, input }: { id: string; input: Prisma.CountyUpdateInput },
      context: GraphQLContext
    ) => {
      try {
        // Only Admins can update counties
        checkAuth(context, [UserRoles.ADMIN]);
        const updatedCounty = await prisma.county.update({
          where: { id },
          data: input,
        });
        return updatedCounty;
      } catch (error) {
        console.error(`Error updating county ${id}:`, error);
        if ((error as any).code === 'P2025') {
          throw new GraphQLError(`County with ID ${id} not found.`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to update county: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    deleteCounty: async (_: ResolverParent, { id }: IdArg, context: GraphQLContext) => {
      try {
        // Only Admins can delete counties
        checkAuth(context, [UserRoles.ADMIN]);
        // Consider checks for related entities (auctions, properties) before deleting
        const deletedCounty = await prisma.county.delete({
          where: { id },
        });
        return deletedCounty;
      } catch (error) {
        console.error(`Error deleting county ${id}:`, error);
        if ((error as any).code === 'P2025') {
          // Example: Prisma record not found
          throw new GraphQLError(`County with ID ${id} not found.`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        // Handle case where deletion fails due to foreign key constraints (P2003)
        if ((error as any).code === 'P2003') {
          throw new GraphQLError(
            `Cannot delete county ${id} because it has related records (e.g., auctions, properties).`,
            { extensions: { code: 'BAD_REQUEST' } }
          );
        }
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to delete county: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    // --- User Mutations ---
    createUser: async (_: ResolverParent, { input }: { input: any }, context: GraphQLContext) => {
      try {
        checkAuth(context, [UserRoles.ADMIN]);
        const hashedPassword = await hashPassword(input.password);
        const userData = {
          ...input,
          password: hashedPassword,
          role: input.role?.toUpperCase(),
          // status & kycStatus use Prisma defaults on creation
        };
        const newUser = await prisma.user.create({
          data: userData,
          select: {
            // Return the newly created user, including new fields
            id: true,
            username: true,
            email: true,
            role: true,
            status: true,
            kycStatus: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        return newUser;
      } catch (error: any) {
        console.error('Error creating user:', error);
        if (error.code === 'P2002') {
          // Prisma unique constraint violation (e.g., email/username exists)
          const field = error.meta?.target?.[0]; // Get the field causing the error
          throw new GraphQLError(`User with this ${field || 'email/username'} already exists.`, {
            extensions: { code: 'BAD_REQUEST' },
          });
        }
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(`Failed to create user: ${error.message || 'Unknown error'}`);
      }
    },
    updateUser: async (
      _: ResolverParent,
      { id, input }: { id: string; input: any },
      context: GraphQLContext
    ) => {
      try {
        checkAuth(context, [UserRoles.ADMIN]);

        // Build the data payload incrementally to handle optional fields.
        const updateData: Record<string, any> = {};
        if (input.username !== undefined) updateData.username = input.username;
        if (input.email !== undefined) updateData.email = input.email;
        if (input.role !== undefined) updateData.role = input.role?.toUpperCase();
        // Include status fields if provided in the input
        if (input.status !== undefined) updateData.status = input.status;
        if (input.kycStatus !== undefined) updateData.kycStatus = input.kycStatus;

        const updatedUser = await prisma.user.update({
          where: { id },
          data: updateData,
          select: {
            // Return the updated user, including new fields
            id: true,
            username: true,
            email: true,
            role: true,
            status: true,
            kycStatus: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        return updatedUser;
      } catch (error: any) {
        console.error(`Error updating user ${id}:`, error);
        if (error.code === 'P2002') {
          // Prisma unique constraint violation (e.g., email/username exists)
          const field = error.meta?.target?.[0];
          throw new GraphQLError(`User with this ${field || 'email/username'} already exists.`, {
            extensions: { code: 'BAD_REQUEST' },
          });
        }
        if (error.code === 'P2025') {
          // Prisma record not found
          throw new GraphQLError(`User with ID ${id} not found.`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(`Failed to update user: ${error.message || 'Unknown error'}`);
      }
    },
    deleteUser: async (_: ResolverParent, { id }: IdArg, context: GraphQLContext) => {
      try {
        checkAuth(context, [UserRoles.ADMIN]);
        const deletedUser = await prisma.user.delete({
          where: { id },
          select: {
            // Return the deleted user data, including new fields
            id: true,
            username: true,
            email: true,
            role: true,
            status: true,
            kycStatus: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        return deletedUser;
      } catch (error: any) {
        console.error(`Error deleting user ${id}:`, error);
        if (error.code === 'P2025') {
          // Prisma record not found
          throw new GraphQLError(`User with ID ${id} not found.`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        // Handle potential foreign key constraint errors if needed (e.g., P2003)
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(`Failed to delete user: ${error.message || 'Unknown error'}`);
      }
    },
    updateUserStatus: async (
      _: ResolverParent,
      { id, status, reason }: { id: string; status: string; reason?: string },
      context: ExtendedGraphQLContext // Use extended context type
    ) => {
      try {
        // Only admins can change user status
        checkAuth(context, [UserRoles.ADMIN]);

        // Get the current user data
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
          throw new GraphQLError(`User with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        // Don't allow status changes for admin users (optional security measure)
        if (user.role === UserRoles.ADMIN) {
          throw new GraphQLError('Cannot modify admin user status', {
            extensions: { code: 'FORBIDDEN' },
          });
        }

        // Validate the new status
        if (!Object.values(UserStatuses).includes(status)) {
          throw new GraphQLError(`Invalid status: ${status}`, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Update the user status
        const updatedUser = await prisma.user.update({
          where: { id },
          data: { status },
        });

        // Log the status change using a transaction
        await prisma.$transaction([
          prisma.user.update({
            where: { id },
            data: { status },
          }),
          prisma.userActivityLog.create({
            data: {
              userId: id,
              action: 'STATUS_CHANGE',
              oldValue: user.status,
              newValue: status,
              reason: reason || null,
              performedBy: context.user.id,
            },
          }),
        ]);

        return updatedUser;
      } catch (error) {
        console.error('Error updating user status:', error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to update user status: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    createActivityLog: async (
      _: ResolverParent,
      { input }: { input: ActivityLogInput },
      context: GraphQLContext
    ) => {
      try {
        checkAuth(context, [UserRoles.ADMIN]);

        // Get user ID from context if available
        const userId =
          context.user && 'id' in context.user ? (context.user.id as string) : undefined;

        // Create the service input with the correct type
        const serviceInput: ServiceActivityLogInput = {
          action: input.action,
          resource: input.resource,
          resourceId: input.resourceId,
          status: input.status,
          details: input.details,
          userAgent: input.userAgent,
          ipAddress: input.ipAddress,
          userId: userId,
        };

        return await activityLogService.logActivity(serviceInput);
      } catch (error) {
        console.error('Error creating activity log:', error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to create activity log: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    // Create Certificate
    createCertificate: async (
      _: any,
      {
        parcelId,
        propertyAddress,
        ownerName,
        faceValue,
        interestRate,
      }: {
        parcelId: string;
        propertyAddress: string;
        ownerName: string;
        faceValue: number;
        interestRate: number;
      },
      context: any
    ) => {
      try {
        // Check authentication
        if (!context.user) {
          throw new Error('You must be logged in to create a certificate');
        }

        // Check authorization (only admins and county users can create certificates)
        if (!['ADMIN', 'COUNTY'].includes(context.user.role)) {
          throw new Error('You do not have permission to create certificates');
        }

        // Create the certificate
        const certificate = await prisma.certificate.create({
          data: {
            parcelId,
            propertyAddress,
            ownerName,
            faceValue,
            interestRate,
            status: 'AVAILABLE',
          },
        });

        // Log the activity
        await prisma.systemActivityLog.create({
          data: {
            userId: context.user.id,
            action: 'CREATE',
            resource: 'CERTIFICATE',
            resourceId: certificate.id,
            status: 'SUCCESS',
            details: JSON.stringify({
              parcelId,
              propertyAddress,
              ownerName,
              faceValue,
              interestRate,
            }),
          },
        });

        return certificate;
      } catch (error) {
        console.error('Error creating certificate:', error);
        throw error;
      }
    },
  },
};

export default resolvers;
