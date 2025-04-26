/**
 * Admin Account Activation Script
 *
 * IMPORTANT: This script was created to fix authentication failures in the UI tests.
 *
 * The issue was that the admin user's status was set to something other than 'ACTIVE'
 * (likely 'PENDING_KYC'), which prevented successful login.
 *
 * If you encounter login failures with "Authentication failed" or "Account is not active" errors:
 * 1. Run this script to ensure the admin user exists and is active
 * 2. Check the user's status in the database
 * 3. Verify the password is correct (the default password hash is for "password123")
 *
 * To run: npx ts-node scripts/activate-admin.ts
 */

import { PrismaClient } from '../src/generated/prisma';

async function activateAdmin() {
  const prisma = new PrismaClient();

  try {
    // Find the admin user
    const adminUser = await prisma.user.findFirst({
      where: {
        email: 'admin@visualgov.com', // The default admin email used in the tests
      },
    });

    if (!adminUser) {
      console.log('Admin user not found. Creating new admin user...');

      // Create a new admin user if not found
      const newAdmin = await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@visualgov.com',
          password: '$2b$10$vA9oCo5lxdl0c6HXhjr4quR.aeH.L0Z/x.qrOVItv2jC5fxyBU9gK', // password123 hashed
          role: 'ADMIN',
          status: 'ACTIVE', // Set status to ACTIVE to allow login
          kycStatus: 'VERIFIED', // Set KYC status to VERIFIED
        },
      });

      console.log('Created new admin user:', newAdmin.id);
    } else {
      console.log('Found admin user:', adminUser.id);

      // Update the admin status to ACTIVE
      const updatedAdmin = await prisma.user.update({
        where: {
          id: adminUser.id,
        },
        data: {
          status: 'ACTIVE', // Ensure status is ACTIVE
          kycStatus: 'VERIFIED', // Ensure KYC is VERIFIED
        },
      });

      console.log('Updated admin user status to ACTIVE');
    }
  } catch (error) {
    console.error('Error updating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
activateAdmin().catch(console.error);
