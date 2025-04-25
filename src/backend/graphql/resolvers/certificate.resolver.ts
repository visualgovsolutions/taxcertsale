import { GraphQLError } from 'graphql';
import prisma from '../../../lib/prisma';
import { activityLogService } from '../../services/activityLog/ActivityLogService';
import { GraphQLContext } from '../index';

// User roles for authorization checks
const UserRoles = {
  ADMIN: 'ADMIN',
  COUNTY_OFFICIAL: 'COUNTY_OFFICIAL',
  INVESTOR: 'INVESTOR',
  USER: 'USER',
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

// Define resolver parameter types
type ResolverParent = unknown;
type IdArg = { id: string };
type StatusArg = { status: string };

// Certificate filter types
type CertificateFilterInput = {
  statuses?: string[];
  countyId?: string;
  auctionId?: string;
  fromDate?: string;
  toDate?: string;
  minFaceValue?: number;
  maxFaceValue?: number;
  searchTerm?: string;
};

type CertificateArgs = {
  filter?: CertificateFilterInput;
  limit?: number;
  offset?: number;
  page?: number;
};

type CreateCertificateInput = {
  certificateNumber: string;
  countyId: string;
  parcelId: string;
  propertyAddress?: string;
  ownerName?: string;
  faceValue: number;
  auctionDate?: string;
  status: string;
  interestRate?: number;
  batchId?: string;
};

type UpdateCertificateInput = {
  certificateNumber?: string;
  countyId?: string;
  parcelId?: string;
  propertyAddress?: string;
  ownerName?: string;
  faceValue?: number;
  auctionDate?: string;
  status?: string;
  interestRate?: number;
  purchaserId?: string;
  purchaseDate?: string;
  redemptionDate?: string;
  expirationDate?: string;
  batchId?: string;
};

// Certificate resolvers
export const certificateResolvers = {
  Query: {
    certificates: async (_: ResolverParent, args: CertificateArgs, context: GraphQLContext) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);

        const { filter, limit = 20, offset = 0, page = 1 } = args;
        const skip = page && page > 1 ? (page - 1) * (limit || 20) : offset;

        // Build filter conditions
        const where: any = {}; // Use any type to avoid Prisma schema type errors

        if (filter) {
          if (filter.statuses && filter.statuses.length > 0) {
            where.status = { in: filter.statuses };
          }

          if (filter.countyId) {
            where.countyId = filter.countyId;
          }

          if (filter.auctionId) {
            where.auctionId = filter.auctionId;
          }

          if (filter.minFaceValue !== undefined || filter.maxFaceValue !== undefined) {
            where.faceValue = {};

            if (filter.minFaceValue !== undefined) {
              where.faceValue.gte = filter.minFaceValue;
            }

            if (filter.maxFaceValue !== undefined) {
              where.faceValue.lte = filter.maxFaceValue;
            }
          }

          if (filter.searchTerm) {
            where.OR = [
              { certificateNumber: { contains: filter.searchTerm, mode: 'insensitive' } },
              { parcelId: { contains: filter.searchTerm, mode: 'insensitive' } },
              { propertyAddress: { contains: filter.searchTerm, mode: 'insensitive' } },
              { ownerName: { contains: filter.searchTerm, mode: 'insensitive' } },
            ];
          }
        }

        // Execute the query
        const [certificates, totalCount] = await Promise.all([
          prisma.certificate.findMany({
            where,
            take: limit,
            skip,
            orderBy: { updatedAt: 'desc' },
          }),
          prisma.certificate.count({ where }),
        ]);

        return {
          totalCount,
          certificates,
        };
      } catch (error) {
        console.error('Error fetching certificates:', error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to fetch certificates: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    certificate: async (_: ResolverParent, { id }: IdArg, context: GraphQLContext) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL, UserRoles.INVESTOR]);

        const certificate = await prisma.certificate.findUnique({ where: { id } });

        if (!certificate) {
          throw new GraphQLError(`Certificate with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        return certificate;
      } catch (error) {
        console.error(`Error fetching certificate ${id}:`, error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to fetch certificate: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    certificatesByStatus: async (
      _: ResolverParent,
      { status }: StatusArg,
      context: GraphQLContext
    ) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);

        return await prisma.certificate.findMany({
          where: { status },
          orderBy: { updatedAt: 'desc' },
        });
      } catch (error) {
        console.error(`Error fetching certificates by status ${status}:`, error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to fetch certificates by status: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    certificatesByCounty: async (
      _: ResolverParent,
      { countyId }: { countyId: string },
      context: GraphQLContext
    ) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);

        return await prisma.certificate.findMany({
          where: { countyId },
          orderBy: { updatedAt: 'desc' },
        });
      } catch (error) {
        console.error(`Error fetching certificates by county ${countyId}:`, error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to fetch certificates by county: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    certificatesByAuction: async (
      _: ResolverParent,
      { auctionId }: { auctionId: string },
      context: GraphQLContext
    ) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL, UserRoles.INVESTOR]);

        return await prisma.certificate.findMany({
          where: { auctionId },
          orderBy: { updatedAt: 'desc' },
        });
      } catch (error) {
        console.error(`Error fetching certificates by auction ${auctionId}:`, error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to fetch certificates by auction: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
  },

  Mutation: {
    createCertificate: async (
      _: ResolverParent,
      { input }: { input: CreateCertificateInput },
      context: GraphQLContext
    ) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);

        const now = new Date();

        // Convert input to the format expected by Prisma
        const certificateData: any = {
          certificateNumber: input.certificateNumber,
          countyId: input.countyId,
          parcelId: input.parcelId,
          propertyAddress: input.propertyAddress || null,
          ownerName: input.ownerName || null,
          faceValue: input.faceValue,
          status: input.status,
          createdAt: now,
          updatedAt: now,
        };

        if (input.auctionDate) {
          certificateData.auctionDate = new Date(input.auctionDate);
        }

        if (input.interestRate !== undefined) {
          certificateData.interestRate = input.interestRate;
        }

        if (input.batchId) {
          certificateData.batchId = input.batchId;
        }

        const certificate = await prisma.certificate.create({
          data: certificateData,
        });

        // Log activity
        await activityLogService.logActivity({
          userId: context.user?.userId || '',
          action: 'CREATE',
          resource: 'CERTIFICATE',
          resourceId: certificate.id,
          status: 'SUCCESS',
          details: `Certificate ${certificate.certificateNumber} created`,
        });

        return certificate;
      } catch (error) {
        console.error('Error creating certificate:', error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to create certificate: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    updateCertificate: async (
      _: ResolverParent,
      { id, input }: { id: string; input: UpdateCertificateInput },
      context: GraphQLContext
    ) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);

        // Check if certificate exists
        const existingCertificate = await prisma.certificate.findUnique({ where: { id } });

        if (!existingCertificate) {
          throw new GraphQLError(`Certificate with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        // Prepare update data
        const updateData: any = {
          updatedAt: new Date(),
        };

        // Only include fields that are defined in the input
        if (input.certificateNumber !== undefined)
          updateData.certificateNumber = input.certificateNumber;
        if (input.countyId !== undefined) updateData.countyId = input.countyId;
        if (input.parcelId !== undefined) updateData.parcelId = input.parcelId;
        if (input.propertyAddress !== undefined) updateData.propertyAddress = input.propertyAddress;
        if (input.ownerName !== undefined) updateData.ownerName = input.ownerName;
        if (input.faceValue !== undefined) updateData.faceValue = input.faceValue;
        if (input.status !== undefined) updateData.status = input.status;
        if (input.interestRate !== undefined) updateData.interestRate = input.interestRate;
        if (input.purchaserId !== undefined) updateData.purchaserId = input.purchaserId;
        if (input.batchId !== undefined) updateData.batchId = input.batchId;

        // Handle date fields
        if (input.auctionDate !== undefined) {
          updateData.auctionDate = input.auctionDate ? new Date(input.auctionDate) : null;
        }
        if (input.purchaseDate !== undefined) {
          updateData.purchaseDate = input.purchaseDate ? new Date(input.purchaseDate) : null;
        }
        if (input.redemptionDate !== undefined) {
          updateData.redemptionDate = input.redemptionDate ? new Date(input.redemptionDate) : null;
        }
        if (input.expirationDate !== undefined) {
          updateData.expirationDate = input.expirationDate ? new Date(input.expirationDate) : null;
        }

        // Update the certificate
        const certificate = await prisma.certificate.update({
          where: { id },
          data: updateData,
        });

        // Log activity
        await activityLogService.logActivity({
          userId: context.user?.userId || '',
          action: 'UPDATE',
          resource: 'CERTIFICATE',
          resourceId: certificate.id,
          status: 'SUCCESS',
          details: `Certificate ${certificate.certificateNumber} updated`,
        });

        return certificate;
      } catch (error) {
        console.error(`Error updating certificate ${id}:`, error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to update certificate: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    deleteCertificate: async (_: ResolverParent, { id }: IdArg, context: GraphQLContext) => {
      try {
        checkAuth(context, [UserRoles.ADMIN]);

        // Check if certificate exists
        const existingCertificate = await prisma.certificate.findUnique({ where: { id } });

        if (!existingCertificate) {
          throw new GraphQLError(`Certificate with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        // Delete the certificate
        await prisma.certificate.delete({ where: { id } });

        // Log activity
        await activityLogService.logActivity({
          userId: context.user?.userId || '',
          action: 'DELETE',
          resource: 'CERTIFICATE',
          resourceId: id,
          status: 'SUCCESS',
          details: `Certificate ${existingCertificate.certificateNumber} deleted`,
        });

        return true;
      } catch (error) {
        console.error(`Error deleting certificate ${id}:`, error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to delete certificate: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    assignCertificatesToAuction: async (
      _: ResolverParent,
      { certificateIds, auctionId }: { certificateIds: string[]; auctionId: string },
      context: GraphQLContext
    ) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);

        // Check if auction exists
        const auction = await prisma.auction.findUnique({ where: { id: auctionId } });

        if (!auction) {
          throw new GraphQLError(`Auction with ID ${auctionId} not found`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        // Update certificates
        const now = new Date();

        // Update all certificates in a transaction
        const updateResult = await prisma.$transaction(async tx => {
          // Update all certificates
          const result = await tx.certificate.updateMany({
            where: { id: { in: certificateIds } },
            data: {
              auctionId,
              status: 'AUCTION_SCHEDULED',
              updatedAt: now,
            },
          });

          // Log the activity for each certificate outside of the transaction
          for (const certificateId of certificateIds) {
            const certificate = await tx.certificate.findUnique({
              where: { id: certificateId },
            });

            if (certificate) {
              // Use the activityLogService instead of direct table access
              await activityLogService.logActivity({
                userId: context.user?.userId || '',
                action: 'ASSIGN_TO_AUCTION',
                resource: 'CERTIFICATE',
                resourceId: certificateId,
                status: 'SUCCESS',
                details: `Certificate ${certificate.certificateNumber} assigned to auction ${auctionId}`,
              });
            }
          }

          return result.count;
        });

        return updateResult;
      } catch (error) {
        console.error('Error assigning certificates to auction:', error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to assign certificates to auction: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    markCertificateAsRedeemed: async (
      _: ResolverParent,
      { id, redemptionDate }: { id: string; redemptionDate: string },
      context: GraphQLContext
    ) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);

        // Check if certificate exists
        const existingCertificate = await prisma.certificate.findUnique({ where: { id } });

        if (!existingCertificate) {
          throw new GraphQLError(`Certificate with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        // Update the certificate
        const certificate = await prisma.certificate.update({
          where: { id },
          data: {
            status: 'REDEEMED',
            redemptionDate: new Date(redemptionDate),
            updatedAt: new Date(),
          },
        });

        // Log activity
        await activityLogService.logActivity({
          userId: context.user?.userId || '',
          action: 'REDEEM',
          resource: 'CERTIFICATE',
          resourceId: certificate.id,
          status: 'SUCCESS',
          details: `Certificate ${certificate.certificateNumber} marked as redeemed`,
        });

        return certificate;
      } catch (error) {
        console.error(`Error marking certificate ${id} as redeemed:`, error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to mark certificate as redeemed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    updateCertificateStatus: async (
      _: ResolverParent,
      { id, status }: { id: string; status: string },
      context: GraphQLContext
    ) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL]);

        // Check if certificate exists
        const existingCertificate = await prisma.certificate.findUnique({ where: { id } });

        if (!existingCertificate) {
          throw new GraphQLError(`Certificate with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        // Update the certificate
        const certificate = await prisma.certificate.update({
          where: { id },
          data: {
            status,
            updatedAt: new Date(),
          },
        });

        // Log activity
        await activityLogService.logActivity({
          userId: context.user?.userId || '',
          action: 'UPDATE_STATUS',
          resource: 'CERTIFICATE',
          resourceId: certificate.id,
          status: 'SUCCESS',
          details: `Certificate ${certificate.certificateNumber} status updated to ${status}`,
        });

        return certificate;
      } catch (error) {
        console.error(`Error updating certificate ${id} status:`, error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError(
          `Failed to update certificate status: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
  },
};

export default certificateResolvers;
