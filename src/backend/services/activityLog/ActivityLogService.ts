import prisma from '../../../lib/prisma';
import { format } from 'date-fns';

// TESTING - Create a log on service init
(async () => {
  try {
    console.log('Creating test activity log entry');
    await prisma.systemActivityLog.create({
      data: {
        action: 'TEST_ACTION',
        resource: 'SYSTEM',
        status: 'SUCCESS',
        details: 'Test log created on service init',
        timestamp: new Date(),
        ipAddress: '127.0.0.1',
        userAgent: 'Test Agent',
      },
    });
    console.log('Test activity log created successfully');
  } catch (err) {
    console.error('Failed to create test log:', err);
  }
})();

export interface ActivityLogInput {
  action: string;
  resource: string;
  resourceId?: string;
  status: string;
  details?: string;
  userAgent?: string;
  ipAddress?: string;
  userId?: string;
}

export class ActivityLogService {
  async logActivity(input: ActivityLogInput) {
    try {
      const log = await prisma.systemActivityLog.create({
        data: {
          action: input.action,
          resource: input.resource,
          resourceId: input.resourceId,
          status: input.status,
          details: input.details,
          userAgent: input.userAgent,
          ipAddress: input.ipAddress,
          userId: input.userId || null,
        },
        include: {
          user: true,
        },
      });

      return {
        ...log,
        timestamp: format(log.timestamp, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      };
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  }

  async getActivityLogs(options: {
    filter?: {
      fromDate?: string;
      toDate?: string;
      actions?: string[];
      resources?: string[];
      statuses?: string[];
      userId?: string;
      searchTerm?: string;
    };
    limit?: number;
    offset?: number;
  }) {
    try {
      const { filter, limit = 20, offset = 0 } = options;

      // Build where clause based on filters
      const where: any = {};

      console.log('ActivityLogService.getActivityLogs - INPUT:', JSON.stringify(options, null, 2));

      if (filter) {
        // Date filters
        if (filter.fromDate || filter.toDate) {
          where.timestamp = {};
          if (filter.fromDate) {
            const fromDateObj = new Date(filter.fromDate);
            where.timestamp.gte = fromDateObj;
            console.log('FROM DATE FILTER:', filter.fromDate, '=> GTE:', fromDateObj.toISOString());
          }
          if (filter.toDate) {
            const toDateObj = new Date(filter.toDate);
            where.timestamp.lte = toDateObj;
            console.log('TO DATE FILTER:', filter.toDate, '=> LTE:', toDateObj.toISOString());
          }
        } else {
          console.log('NO DATE FILTER APPLIED');
        }

        // Action, resource, status filters
        if (filter.actions && filter.actions.length > 0) {
          where.action = { in: filter.actions };
        }
        if (filter.resources && filter.resources.length > 0) {
          where.resource = { in: filter.resources };
        }
        if (filter.statuses && filter.statuses.length > 0) {
          where.status = { in: filter.statuses };
        }

        // User filter
        if (filter.userId) {
          where.userId = filter.userId;
        }

        // Search term (checks action, resource, status, or details)
        if (filter.searchTerm) {
          where.OR = [
            { action: { contains: filter.searchTerm, mode: 'insensitive' } },
            { resource: { contains: filter.searchTerm, mode: 'insensitive' } },
            { status: { contains: filter.searchTerm, mode: 'insensitive' } },
            { details: { contains: filter.searchTerm, mode: 'insensitive' } },
          ];
        }
      }

      console.log('FINAL WHERE CLAUSE:', JSON.stringify(where, null, 2));

      // Get total count
      const totalCount = await prisma.systemActivityLog.count({ where });
      console.log('TOTAL COUNT:', totalCount);

      // Get paginated logs
      const logs = await prisma.systemActivityLog.findMany({
        where,
        include: {
          user: true,
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: limit,
        skip: offset,
      });

      return {
        totalCount,
        logs: logs.map(log => ({
          ...log,
          timestamp: format(log.timestamp, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        })),
      };
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }
  }

  async getActivityLogsByResource(options: {
    resource: string;
    id?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      const { resource, id, limit = 20, offset = 0 } = options;

      const where: any = { resource };
      if (id) {
        where.resourceId = id;
      }

      const totalCount = await prisma.systemActivityLog.count({ where });

      const logs = await prisma.systemActivityLog.findMany({
        where,
        include: {
          user: true,
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: limit,
        skip: offset,
      });

      return {
        totalCount,
        logs: logs.map(log => ({
          ...log,
          timestamp: format(log.timestamp, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        })),
      };
    } catch (error) {
      console.error('Error fetching activity logs for resource:', error);
      throw error;
    }
  }

  async getActivityLogsByUser(options: { userId: string; limit?: number; offset?: number }) {
    try {
      const { userId, limit = 20, offset = 0 } = options;

      const totalCount = await prisma.systemActivityLog.count({ where: { userId } });

      const logs = await prisma.systemActivityLog.findMany({
        where: { userId },
        include: {
          user: true,
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: limit,
        skip: offset,
      });

      return {
        totalCount,
        logs: logs.map(log => ({
          ...log,
          timestamp: format(log.timestamp, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        })),
      };
    } catch (error) {
      console.error('Error fetching activity logs for user:', error);
      throw error;
    }
  }
}

export const activityLogService = new ActivityLogService();
