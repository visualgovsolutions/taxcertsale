/**
 * Bidder Account Setup Script
 * 
 * This script ensures that a bidder account exists with the credentials:
 * - Email: bidder01@visualgov.com
 * - Password: BidderPass1!
 * 
 * Run this script to create or update the bidder account before
 * working on the bidder dashboard and UI components.
 * 
 * To run: npx ts-node scripts/setup-bidder.ts
 */

import { PrismaClient } from '../src/generated/prisma';
import { hashPassword } from '../src/backend/utils/passwordUtils';

async function setupBidderAccount() {
  const prisma = new PrismaClient();
  
  try {
    // Find the bidder user
    const bidderUser = await prisma.user.findFirst({
      where: {
        email: 'bidder01@visualgov.com',
      },
    });

    const hashedPassword = await hashPassword('BidderPass1!');
    
    if (!bidderUser) {
      console.log('Bidder user not found. Creating new bidder account...');
      
      // Create a new bidder user
      const newBidder = await prisma.user.create({
        data: {
          username: 'bidder01',
          email: 'bidder01@visualgov.com',
          password: hashedPassword,
          role: 'INVESTOR', // Using INVESTOR role for bidder
          status: 'ACTIVE',
          kycStatus: 'VERIFIED',
        },
      });
      
      console.log('Created new bidder account:', newBidder.id);
    } else {
      console.log('Found existing bidder account:', bidderUser.id);
      
      // Update the bidder account
      const updatedBidder = await prisma.user.update({
        where: {
          id: bidderUser.id,
        },
        data: {
          password: hashedPassword,
          role: 'INVESTOR',
          status: 'ACTIVE',
          kycStatus: 'VERIFIED',
        },
      });
      
      console.log('Updated bidder account with new password and active status');
    }
  } catch (error) {
    console.error('Error setting up bidder account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
setupBidderAccount().catch(console.error); 