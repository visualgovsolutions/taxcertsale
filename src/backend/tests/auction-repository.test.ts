import { AppDataSource } from '../../config/database';
import { auctionRepository } from '../../repositories/auction.repository';
import { AuctionStatus } from '../../models/entities/auction.entity';

describe('AuctionRepository', () => {
  // Helper function to format time as HH:MM:SS
  function formatTimeForDB(date: Date): string {
    if (!date) {
      return '00:00:00'; // Default time if date is undefined
    }
    const timeString = date.toTimeString();
    // Split the time string and ensure we have a string value
    const timeParts = timeString.split(' ');
    return timeParts[0] || '00:00:00'; // Returns "HH:MM:SS"
  }

  beforeAll(async () => {
    // Initialize the database connection
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    // Close the database connection
    await AppDataSource.destroy();
  });

  // Clean up test data after each test
  afterEach(async () => {
    // Delete all auctions created during tests
    const allAuctions = await auctionRepository.findAll();
    for (const auction of allAuctions) {
      if (auction.name.startsWith('Test Auction')) {
        await auctionRepository.delete(auction.id);
      }
    }
  });

  describe('Auction State Transitions', () => {
    test('Should activate an UPCOMING auction', async () => {
      // Create a test auction with UPCOMING status
      const now = new Date();
      const auction = await auctionRepository.create({
        name: 'Test Auction - Activate',
        auctionDate: now,
        startTime: formatTimeForDB(now),
        endTime: formatTimeForDB(new Date(now.getTime() + 3600000)), // 1 hour from now
        status: AuctionStatus.UPCOMING
      });

      // Activate the auction
      const activatedAuction = await auctionRepository.activateAuction(auction.id);

      // Verify state changed to ACTIVE
      expect(activatedAuction).not.toBeNull();
      expect(activatedAuction?.status).toBe(AuctionStatus.ACTIVE);

      // Verify in database
      const updatedAuction = await auctionRepository.findById(auction.id);
      expect(updatedAuction?.status).toBe(AuctionStatus.ACTIVE);
    });

    test('Should not activate a non-UPCOMING auction', async () => {
      // Create a test auction with ACTIVE status
      const now = new Date();
      const auction = await auctionRepository.create({
        name: 'Test Auction - Already Active',
        auctionDate: now,
        startTime: formatTimeForDB(now),
        endTime: formatTimeForDB(new Date(now.getTime() + 3600000)), // 1 hour from now
        status: AuctionStatus.ACTIVE // Already active
      });

      // Try to activate the auction
      const activatedAuction = await auctionRepository.activateAuction(auction.id);

      // Verify activation failed (returns null)
      expect(activatedAuction).toBeNull();

      // Verify state didn't change in database
      const updatedAuction = await auctionRepository.findById(auction.id);
      expect(updatedAuction?.status).toBe(AuctionStatus.ACTIVE);
    });

    test('Should complete an ACTIVE auction', async () => {
      // Create a test auction with ACTIVE status
      const now = new Date();
      const auction = await auctionRepository.create({
        name: 'Test Auction - Complete',
        auctionDate: now,
        startTime: formatTimeForDB(now),
        endTime: formatTimeForDB(new Date(now.getTime() + 3600000)), // 1 hour from now
        status: AuctionStatus.ACTIVE
      });

      // Complete the auction
      const completedAuction = await auctionRepository.completeAuction(auction.id);

      // Verify state changed to COMPLETED
      expect(completedAuction).not.toBeNull();
      expect(completedAuction?.status).toBe(AuctionStatus.COMPLETED);

      // Verify in database
      const updatedAuction = await auctionRepository.findById(auction.id);
      expect(updatedAuction?.status).toBe(AuctionStatus.COMPLETED);
    });

    test('Should not complete a non-ACTIVE auction', async () => {
      // Create a test auction with UPCOMING status
      const now = new Date();
      const auction = await auctionRepository.create({
        name: 'Test Auction - Not Active Yet',
        auctionDate: now,
        startTime: formatTimeForDB(now),
        endTime: formatTimeForDB(new Date(now.getTime() + 3600000)), // 1 hour from now
        status: AuctionStatus.UPCOMING // Not active yet
      });

      // Try to complete the auction
      const completedAuction = await auctionRepository.completeAuction(auction.id);

      // Verify completion failed (returns null)
      expect(completedAuction).toBeNull();

      // Verify state didn't change in database
      const updatedAuction = await auctionRepository.findById(auction.id);
      expect(updatedAuction?.status).toBe(AuctionStatus.UPCOMING);
    });

    test('Should cancel an UPCOMING auction', async () => {
      // Create a test auction with UPCOMING status
      const now = new Date();
      const auction = await auctionRepository.create({
        name: 'Test Auction - Cancel Upcoming',
        auctionDate: now,
        startTime: formatTimeForDB(now),
        endTime: formatTimeForDB(new Date(now.getTime() + 3600000)), // 1 hour from now
        status: AuctionStatus.UPCOMING
      });

      // Cancel the auction
      const cancelledAuction = await auctionRepository.cancelAuction(auction.id);

      // Verify state changed to CANCELLED
      expect(cancelledAuction).not.toBeNull();
      expect(cancelledAuction?.status).toBe(AuctionStatus.CANCELLED);

      // Verify in database
      const updatedAuction = await auctionRepository.findById(auction.id);
      expect(updatedAuction?.status).toBe(AuctionStatus.CANCELLED);
    });

    test('Should cancel an ACTIVE auction', async () => {
      // Create a test auction with ACTIVE status
      const now = new Date();
      const auction = await auctionRepository.create({
        name: 'Test Auction - Cancel Active',
        auctionDate: now,
        startTime: formatTimeForDB(now),
        endTime: formatTimeForDB(new Date(now.getTime() + 3600000)), // 1 hour from now
        status: AuctionStatus.ACTIVE
      });

      // Cancel the auction
      const cancelledAuction = await auctionRepository.cancelAuction(auction.id);

      // Verify state changed to CANCELLED
      expect(cancelledAuction).not.toBeNull();
      expect(cancelledAuction?.status).toBe(AuctionStatus.CANCELLED);

      // Verify in database
      const updatedAuction = await auctionRepository.findById(auction.id);
      expect(updatedAuction?.status).toBe(AuctionStatus.CANCELLED);
    });

    test('Should not cancel a COMPLETED auction', async () => {
      // Create a test auction with COMPLETED status
      const now = new Date();
      const auction = await auctionRepository.create({
        name: 'Test Auction - Already Completed',
        auctionDate: now,
        startTime: formatTimeForDB(now),
        endTime: formatTimeForDB(new Date(now.getTime() + 3600000)), // 1 hour from now
        status: AuctionStatus.COMPLETED // Already completed
      });

      // Try to cancel the auction
      const cancelledAuction = await auctionRepository.cancelAuction(auction.id);

      // Verify cancellation failed (returns null)
      expect(cancelledAuction).toBeNull();

      // Verify state didn't change in database
      const updatedAuction = await auctionRepository.findById(auction.id);
      expect(updatedAuction?.status).toBe(AuctionStatus.COMPLETED);
    });

    test('Should not allow invalid state transitions', async () => {
      // Create test auctions with different states
      const now = new Date();
      const baseAuctionData = {
        auctionDate: now,
        startTime: formatTimeForDB(now),
        endTime: formatTimeForDB(new Date(now.getTime() + 3600000))
      };

      // Create COMPLETED auction
      const completedAuction = await auctionRepository.create({
        name: 'Test Auction - Completed State',
        ...baseAuctionData,
        status: AuctionStatus.COMPLETED
      });

      // Create CANCELLED auction
      const cancelledAuction = await auctionRepository.create({
        name: 'Test Auction - Cancelled State',
        ...baseAuctionData,
        status: AuctionStatus.CANCELLED
      });

      // Try invalid transitions
      
      // Can't activate COMPLETED auction
      expect(await auctionRepository.activateAuction(completedAuction.id)).toBeNull();
      
      // Can't activate CANCELLED auction
      expect(await auctionRepository.activateAuction(cancelledAuction.id)).toBeNull();
      
      // Can't complete CANCELLED auction
      expect(await auctionRepository.completeAuction(cancelledAuction.id)).toBeNull();
      
      // Can't complete COMPLETED auction (idempotent)
      expect(await auctionRepository.completeAuction(completedAuction.id)).toBeNull();
      
      // Verify states didn't change
      expect((await auctionRepository.findById(completedAuction.id))?.status).toBe(AuctionStatus.COMPLETED);
      expect((await auctionRepository.findById(cancelledAuction.id))?.status).toBe(AuctionStatus.CANCELLED);
    });
  });
}); 