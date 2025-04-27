import { PrismaClient } from '@prisma/client';
import { Context } from '../../types';
import { W9FormRepository } from '../../../repositories/w9form.repository';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { logger } from '../../utils/logger';

// Initialize Prisma client
const prisma = new PrismaClient();

// Initialize repository
const w9FormRepository = new W9FormRepository(prisma);

export const w9FormResolvers = {
  Query: {
    /**
     * Get all W9 forms for the current user
     */
    myW9Forms: async (_: any, __: any, context: Context) => {
      // Check if user is authenticated
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to access your W9 forms');
      }

      try {
        return await w9FormRepository.findByUserId(context.user.id);
      } catch (error) {
        logger.error('Error fetching W9 forms:', error);
        throw new Error('Failed to fetch W9 forms');
      }
    },

    /**
     * Get all W9 forms for a specific county (admin/county official only)
     */
    w9FormsByCounty: async (_: any, { countyId }: { countyId: string }, context: Context) => {
      // Check if user is authenticated and has proper role
      if (!context.user) {
        throw new AuthenticationError('You must be logged in');
      }

      if (context.user.role !== 'ADMIN' && context.user.role !== 'COUNTY_OFFICIAL') {
        throw new ForbiddenError('Insufficient permissions to access W9 forms');
      }

      try {
        return await w9FormRepository.findByCountyId(countyId);
      } catch (error) {
        logger.error('Error fetching W9 forms by county:', error);
        throw new Error('Failed to fetch W9 forms for county');
      }
    },

    /**
     * Get W9 form status for current user and specific county
     */
    w9FormStatus: async (_: any, { countyId }: { countyId: string }, context: Context) => {
      // Check if user is authenticated
      if (!context.user) {
        throw new AuthenticationError('You must be logged in');
      }

      try {
        const form = await w9FormRepository.findByUserAndCounty(context.user.id, countyId);
        return form ? form.status : null;
      } catch (error) {
        logger.error('Error fetching W9 form status:', error);
        throw new Error('Failed to fetch W9 form status');
      }
    },

    /**
     * Get all pending W9 forms (admin/county official only)
     */
    pendingW9Forms: async (_: any, { countyId }: { countyId?: string }, context: Context) => {
      // Check if user is authenticated and has proper role
      if (!context.user) {
        throw new AuthenticationError('You must be logged in');
      }

      if (context.user.role !== 'ADMIN' && context.user.role !== 'COUNTY_OFFICIAL') {
        throw new ForbiddenError('Insufficient permissions to access pending W9 forms');
      }

      try {
        return await w9FormRepository.findPending(countyId);
      } catch (error) {
        logger.error('Error fetching pending W9 forms:', error);
        throw new Error('Failed to fetch pending W9 forms');
      }
    },
  },

  Mutation: {
    /**
     * Submit a W9 form
     */
    submitW9Form: async (_: any, { input }: { input: any }, context: Context) => {
      // Check if user is authenticated
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to submit a W9 form');
      }

      try {
        // Check if a form already exists for this user and county
        const existingForm = await w9FormRepository.findByUserAndCounty(context.user.id, input.countyId);

        if (existingForm) {
          // Update existing form
          return await w9FormRepository.update(existingForm.id, {
            ...input,
            status: 'SUBMITTED', // Reset status to submitted if previously rejected
          });
        } else {
          // Create new form
          return await w9FormRepository.create({
            userId: context.user.id,
            ...input,
          });
        }
      } catch (error) {
        logger.error('Error submitting W9 form:', error);
        throw new Error('Failed to submit W9 form');
      }
    },

    /**
     * Approve a W9 form (admin/county official only)
     */
    approveW9Form: async (_: any, { id }: { id: string }, context: Context) => {
      // Check if user is authenticated and has proper role
      if (!context.user) {
        throw new AuthenticationError('You must be logged in');
      }

      if (context.user.role !== 'ADMIN' && context.user.role !== 'COUNTY_OFFICIAL') {
        throw new ForbiddenError('Insufficient permissions to approve W9 forms');
      }

      try {
        return await w9FormRepository.approve(id, context.user.id);
      } catch (error) {
        logger.error('Error approving W9 form:', error);
        throw new Error('Failed to approve W9 form');
      }
    },

    /**
     * Reject a W9 form (admin/county official only)
     */
    rejectW9Form: async (_: any, { id, reason }: { id: string, reason: string }, context: Context) => {
      // Check if user is authenticated and has proper role
      if (!context.user) {
        throw new AuthenticationError('You must be logged in');
      }

      if (context.user.role !== 'ADMIN' && context.user.role !== 'COUNTY_OFFICIAL') {
        throw new ForbiddenError('Insufficient permissions to reject W9 forms');
      }

      try {
        return await w9FormRepository.reject(id, reason);
      } catch (error) {
        logger.error('Error rejecting W9 form:', error);
        throw new Error('Failed to reject W9 form');
      }
    },
  },

  // Field resolvers
  W9FormData: {
    county: async (parent: any) => {
      // If county is already included in the parent, return it
      if (parent.county) {
        return parent.county;
      }

      // Otherwise fetch it
      try {
        return await prisma.county.findUnique({
          where: { id: parent.countyId },
        });
      } catch (error) {
        logger.error('Error resolving county for W9 form:', error);
        return null;
      }
    },
  },
}; 