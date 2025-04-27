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

// Helper function to normalize certificate status (convert lowercase to uppercase)
const normalizeStatus = (certificate: any) => {
  if (certificate && certificate.status) {
    // Create a mapping of lowercase to uppercase status values
    const statusMapping: Record<string, string> = {
      available: 'AVAILABLE',
      pending: 'PENDING',
      auction_scheduled: 'AUCTION_SCHEDULED',
      auction_active: 'AUCTION_ACTIVE',
      auction_closed: 'AUCTION_CLOSED',
      sold: 'SOLD',
      redeemed: 'REDEEMED',
      expired: 'EXPIRED',
    };

    // If the status is a lowercase key in our mapping, convert to uppercase
    if (statusMapping[certificate.status]) {
      certificate.status = statusMapping[certificate.status];
    }
  }
  return certificate;
};

// Helper function to normalize status for an array of certificates
const normalizeCertificates = (certificates: any[]) => {
  return certificates.map(normalizeStatus);
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
  propertyId?: string;
};

// Certificate resolvers
export const certificateResolvers = {
  Query: {
    certificates: async (_: ResolverParent, args: CertificateArgs, context: GraphQLContext) => {
      try {
        checkAuth(context, [UserRoles.ADMIN, UserRoles.COUNTY_OFFICIAL, UserRoles.INVESTOR]);

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
            include: {
              property: true,
            },
          }),
          prisma.certificate.count({ where }),
        ]);

        return {
          totalCount,
          certificates: normalizeCertificates(certificates),
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

        const certificate = await prisma.certificate.findUnique({
          where: { id },
          include: {
            property: true,
          },
        });

        if (!certificate) {
          throw new GraphQLError(`Certificate with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        return normalizeStatus(certificate);
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

        const certificates = await prisma.certificate.findMany({
          where: { status },
          orderBy: { updatedAt: 'desc' },
          include: {
            property: true,
          },
        });

        return normalizeCertificates(certificates);
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

        const certificates = await prisma.certificate.findMany({
          where: { countyId },
          orderBy: { updatedAt: 'desc' },
          include: {
            property: true,
          },
        });

        return normalizeCertificates(certificates);
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

        const certificates = await prisma.certificate.findMany({
          where: { auctionId },
          orderBy: { updatedAt: 'desc' },
          include: {
            property: true,
          },
        });

        return normalizeCertificates(certificates);
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

        // Check if we need to create a Property
        let propertyId: string | undefined;

        if (input.parcelId) {
          // Check if a property with this parcel ID already exists
          const existingProperty = await prisma.property.findUnique({
            where: { parcelId: input.parcelId },
          });

          if (existingProperty) {
            propertyId = existingProperty.id;
          } else {
            // Create a new property
            // Parse the property address if provided
            let address = '',
              city = '',
              state = 'FL',
              zipCode = '';

            if (input.propertyAddress) {
              const parts = input.propertyAddress.split(',').map(part => part.trim());
              if (parts.length >= 1) address = parts[0];
              if (parts.length >= 2) city = parts[1];
              if (parts.length >= 3) {
                const stateZip = parts[2].split(' ');
                if (stateZip.length >= 1) state = stateZip[0];
                if (stateZip.length >= 2) zipCode = stateZip[1];
              }
            }

            const newProperty = await prisma.property.create({
              data: {
                parcelId: input.parcelId,
                address: address || 'Unknown',
                city: city || 'Unknown',
                state: state,
                zipCode: zipCode || '00000',
                countyId: input.countyId,
              },
            });

            propertyId = newProperty.id;
          }
        }

        // Convert input to the format expected by Prisma
        const certificateData: any = {
          certificateNumber: input.certificateNumber,
          countyId: input.countyId,
          faceValue: input.faceValue,
          status: input.status,
          createdAt: now,
          updatedAt: now,
        };

        // Add the propertyId if we have one
        if (propertyId) {
          certificateData.propertyId = propertyId;
        }

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

        // Handle property updates if parcelId or propertyAddress changed
        if (input.parcelId !== undefined || input.propertyAddress !== undefined) {
          // If certificate doesn't have a propertyId, we need to create a property
          if (!existingCertificate.propertyId || input.parcelId !== undefined) {
            const parcelId = input.parcelId || (existingCertificate as any).parcelId;

            if (parcelId) {
              let property = await prisma.property.findUnique({
                where: { parcelId },
              });

              if (!property) {
                // Create a new property
                // Parse the property address if provided
                let address = '',
                  city = '',
                  state = 'FL',
                  zipCode = '';

                if (input.propertyAddress) {
                  const parts = input.propertyAddress.split(',').map(part => part.trim());
                  if (parts.length >= 1) address = parts[0];
                  if (parts.length >= 2) city = parts[1];
                  if (parts.length >= 3) {
                    const stateZip = parts[2].split(' ');
                    if (stateZip.length >= 1) state = stateZip[0];
                    if (stateZip.length >= 2) zipCode = stateZip[1];
                  }
                }

                property = await prisma.property.create({
                  data: {
                    parcelId,
                    address: address || 'Unknown',
                    city: city || 'Unknown',
                    state: state,
                    zipCode: zipCode || '00000',
                    countyId: input.countyId || existingCertificate.countyId,
                  },
                });
              } else if (input.propertyAddress) {
                // Update existing property if propertyAddress changed
                let address = '',
                  city = '',
                  state = property.state,
                  zipCode = property.zipCode;

                const parts = input.propertyAddress.split(',').map(part => part.trim());
                if (parts.length >= 1) address = parts[0];
                if (parts.length >= 2) city = parts[1];
                if (parts.length >= 3) {
                  const stateZip = parts[2].split(' ');
                  if (stateZip.length >= 1) state = stateZip[0];
                  if (stateZip.length >= 2) zipCode = stateZip[1];
                }

                await prisma.property.update({
                  where: { id: property.id },
                  data: {
                    address: address || property.address,
                    city: city || property.city,
                    state,
                    zipCode,
                  },
                });
              }

              // Update the certificate's propertyId
              input.propertyId = property.id;
            }
          }
        }

        // Prepare update data
        const updateData: any = {
          updatedAt: new Date(),
        };

        // Only include fields that are defined in the input
        if (input.certificateNumber !== undefined)
          updateData.certificateNumber = input.certificateNumber;
        if (input.countyId !== undefined) updateData.countyId = input.countyId;
        if (input.propertyId !== undefined) updateData.propertyId = input.propertyId;
        if (input.faceValue !== undefined) updateData.faceValue = input.faceValue;
        if (input.status !== undefined) updateData.status = input.status;
        if (input.interestRate !== undefined) updateData.interestRate = input.interestRate;
        if (input.purchaserId !== undefined) updateData.buyerId = input.purchaserId; // Map to buyerId
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
        // Note: expirationDate is handled by resolver, not stored in DB

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

  Certificate: {
    parcelId: async (parent: any) => {
      // If parent already has parcelId (direct field or included via prisma), return it
      if (parent.parcelId) return parent.parcelId;

      // Otherwise, we need to fetch the property to get its parcelId
      if (!parent.propertyId) {
        throw new GraphQLError('Certificate is missing property information');
      }

      try {
        const property = await prisma.property.findUnique({
          where: { id: parent.propertyId },
          select: { parcelId: true },
        });

        if (!property) {
          throw new GraphQLError(`Property with ID ${parent.propertyId} not found`);
        }

        return property.parcelId;
      } catch (error) {
        console.error(`Error resolving parcelId for certificate ${parent.id}:`, error);
        throw new GraphQLError(
          `Failed to resolve parcelId: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    propertyAddress: async (parent: any) => {
      // If parent already has propertyAddress (direct field or included via prisma), return it
      if (parent.propertyAddress) return parent.propertyAddress;

      // Otherwise, we need to fetch the property to get its address
      if (!parent.propertyId) {
        throw new GraphQLError('Certificate is missing property information');
      }

      try {
        const property = await prisma.property.findUnique({
          where: { id: parent.propertyId },
          select: { address: true, city: true, state: true, zipCode: true },
        });

        if (!property) {
          throw new GraphQLError(`Property with ID ${parent.propertyId} not found`);
        }

        // Format the address
        return `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;
      } catch (error) {
        console.error(`Error resolving propertyAddress for certificate ${parent.id}:`, error);
        throw new GraphQLError(
          `Failed to resolve propertyAddress: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    ownerName: async (parent: any) => {
      // If parent already has ownerName (direct field or included via prisma), return it
      if (parent.ownerName) return parent.ownerName;

      // Since ownerName is not in the database schema, we could:
      // 1. Return a placeholder or null
      // 2. Fetch it from an external source if available
      // 3. Derive it from another field

      // For now, returning a placeholder with the parcel ID if available
      try {
        let parcelId = parent.parcelId;

        if (!parcelId && parent.propertyId) {
          const property = await prisma.property.findUnique({
            where: { id: parent.propertyId },
            select: { parcelId: true },
          });

          if (property) {
            parcelId = property.parcelId;
          }
        }

        return parcelId ? `Owner of ${parcelId}` : null;
      } catch (error) {
        console.error(`Error resolving ownerName for certificate ${parent.id}:`, error);
        return null; // Return null on error rather than throw for this optional field
      }
    },

    auctionDate: async (parent: any) => {
      // If parent already has auctionDate, return it
      if (parent.auctionDate) {
        return typeof parent.auctionDate === 'string'
          ? parent.auctionDate
          : parent.auctionDate.toISOString();
      }

      // Otherwise, fetch it from the auction
      if (!parent.auctionId) {
        return null; // No auction associated
      }

      try {
        const auction = await prisma.auction.findUnique({
          where: { id: parent.auctionId },
          select: { auctionDate: true },
        });

        if (!auction) {
          return null;
        }

        return auction.auctionDate.toISOString();
      } catch (error) {
        console.error(`Error resolving auctionDate for certificate ${parent.id}:`, error);
        return null; // Return null on error rather than throw for this optional field
      }
    },

    expirationDate: async (parent: any) => {
      // If parent already has expirationDate, return it
      if (parent.expirationDate) {
        return typeof parent.expirationDate === 'string'
          ? parent.expirationDate
          : parent.expirationDate.toISOString();
      }

      // Calculate expiration date from purchase date (typically 3 years after purchase)
      if (parent.purchaseDate) {
        const purchaseDate = new Date(parent.purchaseDate);
        const expirationDate = new Date(purchaseDate);
        expirationDate.setFullYear(expirationDate.getFullYear() + 3); // Add 3 years
        return expirationDate.toISOString();
      }

      // If no purchase date, check if there's an auction date to base on
      try {
        let auctionDate: Date | null = null;

        if (parent.auctionId) {
          const auction = await prisma.auction.findUnique({
            where: { id: parent.auctionId },
            select: { auctionDate: true },
          });

          if (auction) {
            auctionDate = auction.auctionDate;
          }
        }

        if (auctionDate) {
          const expirationDate = new Date(auctionDate);
          expirationDate.setFullYear(expirationDate.getFullYear() + 3); // Add 3 years
          return expirationDate.toISOString();
        }

        return null;
      } catch (error) {
        console.error(`Error resolving expirationDate for certificate ${parent.id}:`, error);
        return null; // Return null on error rather than throw for this optional field
      }
    },

    purchaserId: (parent: any) => {
      // Map buyerId to purchaserId for GraphQL schema compatibility
      return parent.buyerId || null;
    },

    property: async (parent: any) => {
      if (!parent.propertyId) return null;

      try {
        return await prisma.property.findUnique({
          where: { id: parent.propertyId },
        });
      } catch (error) {
        console.error(`Error fetching property for certificate ${parent.id}:`, error);
        return null;
      }
    },

    bidCount: async (parent: any) => {
      try {
        console.log(`Fetching bid count for certificate ${parent.id}`);
        const count = await prisma.bid.count({
          where: { certificateId: parent.id },
        });
        console.log(`Found ${count} bids for certificate ${parent.id}`);
        return count;
      } catch (error) {
        console.error(`Error counting bids for certificate ${parent.id}:`, error);
        return 0;
      }
    },
  },
};

export default certificateResolvers;
