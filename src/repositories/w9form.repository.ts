import { PrismaClient } from '@prisma/client';
import { logger } from '../backend/utils/logger';

export class W9FormRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Find all W9 forms for a specific user
   */
  async findByUserId(userId: string) {
    try {
      return await this.prisma.w9FormData.findMany({
        where: { userId },
        include: {
          county: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
    } catch (error) {
      logger.error('Error finding W9 forms by user ID:', error);
      throw error;
    }
  }

  /**
   * Find a specific W9 form by user ID and county ID
   */
  async findByUserAndCounty(userId: string, countyId: string) {
    try {
      return await this.prisma.w9FormData.findUnique({
        where: {
          userId_countyId: {
            userId,
            countyId,
          },
        },
        include: {
          county: true,
        },
      });
    } catch (error) {
      logger.error('Error finding W9 form by user and county:', error);
      throw error;
    }
  }

  /**
   * Find all W9 forms for a specific county
   */
  async findByCountyId(countyId: string) {
    try {
      return await this.prisma.w9FormData.findMany({
        where: { countyId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
        orderBy: {
          submissionDate: 'desc',
        },
      });
    } catch (error) {
      logger.error('Error finding W9 forms by county ID:', error);
      throw error;
    }
  }

  /**
   * Find all pending W9 forms (optional filter by county)
   */
  async findPending(countyId?: string) {
    try {
      return await this.prisma.w9FormData.findMany({
        where: {
          status: 'SUBMITTED',
          ...(countyId && { countyId }),
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
              status: true,
            },
          },
          county: true,
        },
        orderBy: {
          submissionDate: 'asc', // Oldest first
        },
      });
    } catch (error) {
      logger.error('Error finding pending W9 forms:', error);
      throw error;
    }
  }

  /**
   * Create a new W9 form
   */
  async create(data: {
    userId: string;
    countyId: string;
    name: string;
    businessName?: string;
    taxClassification: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    accountNumbers?: string;
    ssn?: string;
    ein?: string;
    fileUrl?: string;
  }) {
    try {
      return await this.prisma.w9FormData.create({
        data: {
          ...data,
          status: 'SUBMITTED',
        },
        include: {
          county: true,
        },
      });
    } catch (error) {
      logger.error('Error creating W9 form:', error);
      throw error;
    }
  }

  /**
   * Update an existing W9 form
   */
  async update(id: string, data: Partial<{
    name: string;
    businessName?: string;
    taxClassification: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    accountNumbers?: string;
    ssn?: string;
    ein?: string;
    status: string;
    fileUrl?: string;
    approvedBy?: string;
    rejectionReason?: string;
    approvalDate?: Date;
  }>) {
    try {
      return await this.prisma.w9FormData.update({
        where: { id },
        data,
        include: {
          county: true,
        },
      });
    } catch (error) {
      logger.error('Error updating W9 form:', error);
      throw error;
    }
  }

  /**
   * Approve a W9 form
   */
  async approve(id: string, adminId: string) {
    try {
      return await this.prisma.w9FormData.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedBy: adminId,
          approvalDate: new Date(),
        },
        include: {
          county: true,
        },
      });
    } catch (error) {
      logger.error('Error approving W9 form:', error);
      throw error;
    }
  }

  /**
   * Reject a W9 form
   */
  async reject(id: string, reason: string) {
    try {
      return await this.prisma.w9FormData.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectionReason: reason,
        },
        include: {
          county: true,
        },
      });
    } catch (error) {
      logger.error('Error rejecting W9 form:', error);
      throw error;
    }
  }
} 