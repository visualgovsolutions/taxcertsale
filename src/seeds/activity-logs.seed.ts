import prisma from '../../src/lib/prisma';
import { subDays } from 'date-fns';

/**
 * Seed script to create example activity logs
 */
export async function seedActivityLogs() {
  console.log('Seeding activity logs...');

  // Get a user for the logs (admin)
  const adminUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'admin@example.com' },
        { email: 'admin@visualgov.com' },
        { username: 'admin' },
        { role: 'admin' },
      ],
    },
  });

  if (!adminUser) {
    console.error('No admin user found. Please run user seed first.');
    return;
  }

  // Sample log entries
  const sampleLogs = [
    {
      timestamp: new Date(),
      userId: adminUser.id,
      action: 'LOGIN',
      resource: 'System',
      status: 'SUCCESS',
      details: 'User logged in successfully',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      ipAddress: '192.168.1.1',
    },
    {
      timestamp: subDays(new Date(), 1),
      userId: adminUser.id,
      action: 'CONFIGURATION',
      resource: 'System',
      status: 'SUCCESS',
      details: 'Modified system auction settings',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      ipAddress: '192.168.1.1',
    },
    {
      timestamp: subDays(new Date(), 2),
      userId: adminUser.id,
      action: 'BID_WITHDRAWAL',
      resource: 'Auction',
      resourceId: 'auction_001',
      status: 'WARNING',
      details: 'Withdrew bid from auction',
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
      ipAddress: '192.168.1.2',
    },
    {
      timestamp: subDays(new Date(), 3),
      userId: adminUser.id,
      action: 'DOCUMENT_DOWNLOAD',
      resource: 'Property',
      resourceId: 'prop_002',
      status: 'SUCCESS',
      details: 'Downloaded property documents',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
      ipAddress: '192.168.1.3',
    },
    {
      timestamp: subDays(new Date(), 4),
      userId: adminUser.id,
      action: 'USER_ROLE_CHANGE',
      resource: 'UserAccount',
      resourceId: 'user_002',
      status: 'SUCCESS',
      details: 'Modified user role from Bidder to Investor',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      ipAddress: '192.168.1.1',
    },
    {
      timestamp: subDays(new Date(), 5),
      userId: adminUser.id,
      action: 'CERTIFICATE_CREATION',
      resource: 'Certificate',
      resourceId: 'cert_001',
      status: 'SUCCESS',
      details: 'Created new certificate',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      ipAddress: '192.168.1.1',
    },
    {
      timestamp: subDays(new Date(), 6),
      userId: adminUser.id,
      action: 'COUNTY_CREATION',
      resource: 'County',
      resourceId: 'county_001',
      status: 'SUCCESS',
      details: 'Added new county',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      ipAddress: '192.168.1.1',
    },
    {
      timestamp: subDays(new Date(), 7),
      userId: adminUser.id,
      action: 'PASSWORD_RESET',
      resource: 'UserAccount',
      resourceId: 'user_003',
      status: 'SUCCESS',
      details: 'Reset user password',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
      ipAddress: '192.168.1.3',
    },
    {
      timestamp: subDays(new Date(), 8),
      userId: adminUser.id,
      action: 'SECURITY_SETTINGS',
      resource: 'System',
      status: 'SUCCESS',
      details: 'Updated 2FA requirements',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      ipAddress: '192.168.1.1',
    },
    {
      timestamp: subDays(new Date(), 9),
      userId: adminUser.id,
      action: 'AUCTION_STATUS_CHANGE',
      resource: 'Auction',
      resourceId: 'auction_003',
      status: 'SUCCESS',
      details: 'Changed auction status from Scheduled to Active',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      ipAddress: '192.168.1.1',
    },
    {
      timestamp: subDays(new Date(), 10),
      userId: adminUser.id,
      action: 'LOGIN',
      resource: 'System',
      status: 'WARNING',
      details: 'Login from new device - sent verification email',
      userAgent:
        'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
      ipAddress: '192.168.1.4',
    },
    {
      timestamp: subDays(new Date(), 11),
      userId: adminUser.id,
      action: 'EMAIL_NOTIFICATION',
      resource: 'System',
      status: 'SUCCESS',
      details: 'Sent batch email notifications to bidders',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      ipAddress: '192.168.1.1',
    },
    {
      timestamp: subDays(new Date(), 12),
      userId: adminUser.id,
      action: 'BACKUP',
      resource: 'Database',
      status: 'SUCCESS',
      details: 'Completed scheduled database backup',
      userAgent: 'Server',
      ipAddress: '192.168.1.10',
    },
    {
      timestamp: subDays(new Date(), 13),
      userId: adminUser.id,
      action: 'CERTIFICATE_REDEMPTION',
      resource: 'Certificate',
      resourceId: 'cert_005',
      status: 'SUCCESS',
      details: 'Certificate redeemed by property owner',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      ipAddress: '192.168.1.1',
    },
    {
      timestamp: subDays(new Date(), 14),
      userId: adminUser.id,
      action: 'LOGIN_ATTEMPT',
      resource: 'System',
      status: 'ERROR',
      details: 'Failed login attempt - incorrect password',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      ipAddress: '192.168.1.5',
    },
  ];

  // Create all logs
  await prisma.systemActivityLog.createMany({
    data: sampleLogs,
    skipDuplicates: true,
  });

  console.log(`Created ${sampleLogs.length} activity logs`);
}

// Run directly if called directly
if (require.main === module) {
  seedActivityLogs()
    .then(() => {
      console.log('Activity logs seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error seeding activity logs:', error);
      process.exit(1);
    });
}
