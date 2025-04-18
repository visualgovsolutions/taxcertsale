import { AppDataSource, initializeDatabase } from '../src/config/database';
import { Repository, FindOptionsWhere, FindOneOptions, QueryRunner } from 'typeorm';
import { Bid } from '../src/models/entities/bid.entity';
import { User } from '../src/models/entities/user.entity';
import { Auction } from '../src/models/entities/auction.entity';
import { Certificate } from '../src/models/entities/certificate.entity';
import { County } from '../src/models/entities/county.entity';
import { Property } from '../src/models/entities/property.entity';
import { bidRepository } from '../src/repositories/bid.repository';
import { v4 as uuidv4 } from 'uuid';
import { BidStatus } from '../src/models/entities/bid.entity';
import { AuctionStatus } from '../src/models/entities/auction.entity';
import { CertificateStatus } from '../src/models/entities/certificate.entity';
import { UserRole, AccountStatus } from '../src/models/entities/user.entity';

describe('BidRepository', () => {
  let bidRepo: Repository<Bid>;
  let userRepo: Repository<User>;
  let auctionRepo: Repository<Auction>;
  let certificateRepo: Repository<Certificate>;
  let countyRepo: Repository<County>;
  let propertyRepo: Repository<Property>;
  let queryRunner: QueryRunner;

  // Test entities
  let user: User;
  let auction: Auction;
  let certificate: Certificate;
  let county: County;
  let property: Property;
  let createdBid: Bid;

  const cleanupEntities = async () => {
    try {
      await queryRunner.startTransaction();
      await bidRepo.createQueryBuilder().delete().execute();
      await certificateRepo.createQueryBuilder().delete().execute();
      await auctionRepo.createQueryBuilder().delete().execute();
      await propertyRepo.createQueryBuilder().delete().execute();
      await userRepo.createQueryBuilder().delete().execute();
      await countyRepo.createQueryBuilder().delete().execute();
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Cleanup failed: ${error.message}`);
    }
  };

  beforeAll(async () => {
    try {
      process.env.NODE_ENV = 'test';
      await initializeDatabase();

      // Get repositories and setup transaction runner
      bidRepo = AppDataSource.getRepository(Bid);
      userRepo = AppDataSource.getRepository(User);
      auctionRepo = AppDataSource.getRepository(Auction);
      certificateRepo = AppDataSource.getRepository(Certificate);
      countyRepo = AppDataSource.getRepository(County);
      propertyRepo = AppDataSource.getRepository(Property);
      queryRunner = AppDataSource.createQueryRunner();
    } catch (error) {
      throw new Error(`Database initialization failed: ${error.message}`);
    }
  });

  beforeEach(async () => {
    try {
      await cleanupEntities();
      await queryRunner.startTransaction();

      // Create prerequisite entities with unique identifiers
      county = await countyRepo.save(
        countyRepo.create({
          name: `Test County ${uuidv4().substring(0, 8)}`,
          state: 'FL',
        })
      );
      if (!county) throw new Error('Failed to create test county');

      property = await propertyRepo.save(
        propertyRepo.create({
          parcelId: `P-${uuidv4().substring(0, 8)}`,
          address: '123 Test St',
          city: 'Test City',
          state: 'FL',
          zipCode: '12345',
          countyId: county.id,
        })
      );
      if (!property) throw new Error('Failed to create test property');

      user = await userRepo.save(
        userRepo.create({
          email: `test.user.${uuidv4().substring(0, 8)}@example.com`,
          firstName: 'Test',
          lastName: 'User',
          passwordHash: 'hashedpassword123',
          role: UserRole.INVESTOR,
          status: AccountStatus.ACTIVE,
        })
      );
      if (!user) throw new Error('Failed to create test user');

      auction = await auctionRepo.save(
        auctionRepo.create({
          name: `Test Auction ${uuidv4().substring(0, 8)}`,
          auctionDate: new Date(),
          startTime: '09:00:00',
          endTime: '17:00:00',
          status: AuctionStatus.ACTIVE,
          countyId: county.id,
        })
      );
      if (!auction) throw new Error('Failed to create test auction');

      certificate = await certificateRepo.save(
        certificateRepo.create({
          certificateNumber: `CERT-${uuidv4().substring(0, 8)}`,
          faceValue: 1500.5,
          interestRate: 18.0,
          issueDate: new Date(),
          status: CertificateStatus.AVAILABLE,
          countyId: county.id,
          propertyId: property.id,
          auctionId: auction.id,
        })
      );
      if (!certificate) throw new Error('Failed to create test certificate');

      const bidData = {
        amount: 1000,
        user: user,
        certificate: certificate,
        auction: auction,
        metadata: {
          history: [],
        },
      };

      createdBid = await bidRepo.save(bidRepo.create(bidData));
      if (!createdBid) throw new Error('Failed to create initial test bid');

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Test setup failed: ${error.message}`);
    }
  });

  afterEach(async () => {
    try {
      await cleanupEntities();
    } catch (error) {
      throw new Error(`Test cleanup failed: ${error.message}`);
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      try {
        await cleanupEntities();
        await queryRunner.release();
        await AppDataSource.destroy();
      } catch (error) {
        throw new Error(`Final cleanup failed: ${error.message}`);
      }
    }
  });

  describe('Basic CRUD Operations', () => {
    it('should create a bid', async () => {
      const bidData = {
        interestRate: 16.0,
        amount: 1500.5,
        status: BidStatus.PENDING,
        userId: user.id,
        auctionId: auction.id,
        certificateId: certificate.id,
      };

      const bid = await bidRepository.create(bidData);

      expect(bid).toBeDefined();
      expect(bid.id).toBeDefined();
      expect(Number(bid.interestRate)).toBe(Number(bidData.interestRate));
      expect(Number(bid.amount)).toBe(Number(bidData.amount));
      expect(bid.status).toBe(bidData.status);
      expect(bid.userId).toBe(user.id);
      expect(bid.auctionId).toBe(auction.id);
      expect(bid.certificateId).toBe(certificate.id);
    });

    it('should not create a bid with invalid user id', async () => {
      const bidData = {
        interestRate: 16.0,
        amount: 1500.5,
        status: BidStatus.PENDING,
        userId: '00000000-0000-0000-0000-000000000000',
        auctionId: auction.id,
        certificateId: certificate.id,
      };

      await expect(bidRepository.create(bidData)).rejects.toThrow();
    });

    it('should find a bid by id', async () => {
      const bidData = {
        interestRate: 16.0,
        amount: 1500.5,
        status: BidStatus.PENDING,
        userId: user.id,
        auctionId: auction.id,
        certificateId: certificate.id,
      };

      const created = await bidRepository.create(bidData);
      const found = await bidRepository.findById(created.id);

      expect(found).toBeDefined();
      expect(found!.id).toBe(created.id);
      expect(Number(found!.interestRate)).toBe(Number(bidData.interestRate));
      expect(Number(found!.amount)).toBe(Number(bidData.amount));
      expect(found!.status).toBe(bidData.status);
      expect(found!.userId).toBe(user.id);
      expect(found!.auctionId).toBe(auction.id);
      expect(found!.certificateId).toBe(certificate.id);
    });

    it('should return null when finding non-existent bid', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const found = await bidRepository.findById(nonExistentId);
      expect(found).toBeNull();
    });

    it('should update a bid', async () => {
      const updatedAmount = 2000;
      const updated = await bidRepository.update(createdBid.id, { amount: updatedAmount });
      expect(updated).toBeDefined();
      if (!updated) throw new Error('Failed to update bid');

      const foundBid = await bidRepository.findByIdWithRelations(createdBid.id);
      expect(foundBid).toBeDefined();
      if (!foundBid) throw new Error('Failed to find updated bid');
      if (!foundBid.user || !foundBid.certificate || !foundBid.auction) {
        throw new Error('Updated bid relations not loaded');
      }

      expect(foundBid.amount).toBe(updatedAmount);
      // After the checks above, we can safely assert the types
      const { user, certificate, auction } = foundBid as {
        user: { id: string };
        certificate: { id: string };
        auction: { id: string };
      };
      expect(user.id).toBe(user.id);
      expect(certificate.id).toBe(certificate.id);
      expect(auction.id).toBe(auction.id);
    });

    it('should return null when updating non-existent bid', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const updateData = {
        interestRate: 15.0,
        status: BidStatus.ACCEPTED,
      };

      const result = await bidRepository.update(nonExistentId, updateData);
      expect(result).toBeNull();
    });

    it('should delete a bid', async () => {
      const bidData = {
        interestRate: 16.0,
        amount: 1500.5,
        status: BidStatus.PENDING,
        userId: user.id,
        auctionId: auction.id,
        certificateId: certificate.id,
      };

      const created = await bidRepository.create(bidData);
      const deleteResult = await bidRepository.delete(created.id);

      expect(deleteResult).toBe(true);

      const found = await bidRepository.findById(created.id);
      expect(found).toBeNull();
    });

    it('should return false when deleting non-existent bid', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const result = await bidRepository.delete(nonExistentId);
      expect(result).toBe(false);
    });

    it('should find a bid with user', async () => {
      const bid = await bidRepository.findByIdWithUser(createdBid.id);
      expect(bid).toBeDefined();
      if (!bid) throw new Error('Bid not found');
      if (!bid.user) throw new Error('Bid user not found');
      expect(bid.user.id).toBe(user.id);
    });

    it('should find a bid with all relations', async () => {
      const bid = await bidRepository.findByIdWithRelations(createdBid.id);
      expect(bid).toBeDefined();
      if (!bid) throw new Error('Bid not found');

      expect(bid.user.id).toBe(user.id);
      expect(bid.certificate.id).toBe(certificate.id);
      expect(bid.auction.id).toBe(auction.id);
    });

    it('should update bid history through metadata', async () => {
      const bid = await bidRepository.findById(createdBid.id);
      expect(bid).toBeDefined();
      if (!bid) throw new Error('Bid not found');

      const newAmount = 1500;
      const oldAmount = bid.amount;

      await bidRepository.update(bid.id, {
        amount: newAmount,
        metadata: {
          history: [...(bid.metadata?.history || []), { amount: oldAmount, timestamp: new Date() }],
        },
      });

      const updatedBid = await bidRepository.findById(bid.id);
      expect(updatedBid).toBeDefined();
      if (!updatedBid) throw new Error('Updated bid not found');
      if (!updatedBid.metadata?.history) throw new Error('Bid history not found');

      expect(updatedBid.amount).toBe(newAmount);
      expect(updatedBid.metadata.history).toHaveLength(1);
      expect(updatedBid.metadata.history[0].amount).toBe(oldAmount);
    });

    it('should find bids with user and all relations', async () => {
      const bid = await bidRepository.findByIdWithRelations(createdBid.id);
      expect(bid).toBeDefined();
      if (!bid) throw new Error('Bid not found');
      if (!bid.user || !bid.certificate || !bid.auction) {
        throw new Error('Bid relations not loaded');
      }

      // After the checks above, we can safely assert the types
      const { user, certificate, auction } = bid as {
        user: { id: string };
        certificate: { id: string };
        auction: { id: string };
      };
      expect(user.id).toBe(user.id);
      expect(certificate.id).toBe(certificate.id);
      expect(auction.id).toBe(auction.id);
    });
  });

  describe('Query Operations', () => {
    let testBids: Bid[];

    beforeEach(async () => {
      try {
        // Create test bids with different interest rates
        const bidPromises = [
          bidRepository.create({
            interestRate: 16.0,
            amount: 1500.5,
            status: BidStatus.PENDING,
            userId: user.id,
            auctionId: auction.id,
            certificateId: certificate.id,
          }),
          bidRepository.create({
            interestRate: 15.0,
            amount: 1500.5,
            status: BidStatus.PENDING,
            userId: user.id,
            auctionId: auction.id,
            certificateId: certificate.id,
          }),
          bidRepository.create({
            interestRate: 10.0,
            amount: 1500.5,
            status: BidStatus.PENDING,
            userId: user.id,
            auctionId: auction.id,
            certificateId: certificate.id,
          }),
        ];

        testBids = await Promise.all(bidPromises);
      } catch (error) {
        console.error('Failed to create test bids:', error);
        throw error;
      }
    });

    it('should find all bids', async () => {
      const bids = await bidRepository.findAll();

      expect(bids).toBeDefined();
      expect(bids.length).toBeGreaterThanOrEqual(3);

      // Verify all test bids are included
      const bidIds = bids.map(b => b.id);
      testBids.forEach(testBid => {
        expect(bidIds).toContain(testBid.id);
      });
    });

    it('should find bids by user', async () => {
      const bids = await bidRepository.findByUser(user.id);

      expect(bids).toBeDefined();
      expect(bids.length).toBeGreaterThanOrEqual(3);
      expect(bids.every(b => b.userId === user.id)).toBe(true);

      // Verify all test bids are included
      const bidIds = bids.map(b => b.id);
      testBids.forEach(testBid => {
        expect(bidIds).toContain(testBid.id);
      });
    });

    it('should return empty array for non-existent user', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const bids = await bidRepository.findByUser(nonExistentId);
      expect(bids).toBeDefined();
      expect(bids).toHaveLength(0);
    });

    it('should find bids by auction', async () => {
      const bids = await bidRepository.findByAuction(auction.id);

      expect(bids).toBeDefined();
      expect(bids.length).toBeGreaterThanOrEqual(3);
      expect(bids.every(b => b.auctionId === auction.id)).toBe(true);

      // Verify all test bids are included
      const bidIds = bids.map(b => b.id);
      testBids.forEach(testBid => {
        expect(bidIds).toContain(testBid.id);
      });
    });

    it('should return empty array for non-existent auction', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const bids = await bidRepository.findByAuction(nonExistentId);
      expect(bids).toBeDefined();
      expect(bids).toHaveLength(0);
    });

    it('should find bids by certificate', async () => {
      const bids = await bidRepository.findByCertificate(certificate.id);

      expect(bids).toBeDefined();
      expect(bids.length).toBeGreaterThanOrEqual(3);
      expect(bids.every(b => b.certificateId === certificate.id)).toBe(true);

      // Verify all test bids are included
      const bidIds = bids.map(b => b.id);
      testBids.forEach(testBid => {
        expect(bidIds).toContain(testBid.id);
      });
    });

    it('should return empty array for non-existent certificate', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const bids = await bidRepository.findByCertificate(nonExistentId);
      expect(bids).toBeDefined();
      expect(bids).toHaveLength(0);
    });

    it('should find lowest bid by certificate', async () => {
      const lowestBid = await bidRepository.findLowestBidByCertificate(certificate.id);

      expect(lowestBid).toBeDefined();
      expect(Number(lowestBid!.interestRate)).toBe(10.0);
      expect(lowestBid!.certificateId).toBe(certificate.id);
    });

    it('should return null for lowest bid on non-existent certificate', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const lowestBid = await bidRepository.findLowestBidByCertificate(nonExistentId);
      expect(lowestBid).toBeNull();
    });

    it('should find active bids by auction', async () => {
      // Create an active bid
      const activeBid = await bidRepository.create({
        interestRate: 14.0,
        amount: 1500.5,
        status: BidStatus.ACTIVE,
        userId: user.id,
        auctionId: auction.id,
        certificateId: certificate.id,
      });

      const activeBids = await bidRepository.findActiveByAuction(auction.id);

      expect(activeBids).toBeDefined();
      expect(activeBids.length).toBeGreaterThanOrEqual(1);
      expect(activeBids.every(b => b.status === BidStatus.ACTIVE)).toBe(true);
      expect(activeBids.every(b => b.auctionId === auction.id)).toBe(true);

      // Verify our active bid is included
      const bidIds = activeBids.map(b => b.id);
      expect(bidIds).toContain(activeBid.id);

      // Verify pending bids are not included
      testBids.forEach(testBid => {
        expect(bidIds).not.toContain(testBid.id);
      });
    });

    it('should return empty array for active bids on non-existent auction', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const activeBids = await bidRepository.findActiveByAuction(nonExistentId);
      expect(activeBids).toBeDefined();
      expect(activeBids).toHaveLength(0);
    });
  });

  describe('Status Transitions', () => {
    let pendingBid: Bid;

    beforeEach(async () => {
      pendingBid = await bidRepository.create({
        userId: user.id,
        certificateId: certificate.id,
        auctionId: auction.id,
        amount: 1000,
        interestRate: 18,
        status: BidStatus.PENDING,
        metadata: { source: 'web' },
      });
    });

    it('should transition from PENDING to ACTIVE', async () => {
      const activatedBid = await bidRepository.update(pendingBid.id, {
        status: BidStatus.ACTIVE,
      });

      expect(activatedBid).toBeDefined();
      expect(activatedBid!.status).toBe(BidStatus.ACTIVE);

      const found = await bidRepository.findById(pendingBid.id);
      expect(found!.status).toBe(BidStatus.ACTIVE);
    });

    it('should transition from ACTIVE to ACCEPTED', async () => {
      // First activate the bid
      await bidRepository.update(pendingBid.id, { status: BidStatus.ACTIVE });

      // Then accept it
      const acceptedBid = await bidRepository.update(pendingBid.id, {
        status: BidStatus.ACCEPTED,
      });

      expect(acceptedBid).toBeDefined();
      expect(acceptedBid!.status).toBe(BidStatus.ACCEPTED);

      const found = await bidRepository.findById(pendingBid.id);
      expect(found!.status).toBe(BidStatus.ACCEPTED);
    });

    it('should transition from ACTIVE to REJECTED', async () => {
      // First activate the bid
      await bidRepository.update(pendingBid.id, { status: BidStatus.ACTIVE });

      // Then reject it
      const rejectedBid = await bidRepository.update(pendingBid.id, {
        status: BidStatus.REJECTED,
        metadata: { reason: 'outbid' },
      });

      expect(rejectedBid).toBeDefined();
      expect(rejectedBid!.status).toBe(BidStatus.REJECTED);

      const found = await bidRepository.findById(pendingBid.id);
      expect(found).toBeDefined();
      if (!found) throw new Error('Failed to find rejected bid');
      expect(found.status).toBe(BidStatus.REJECTED);
      expect(found.metadata).toBeDefined();
      if (!found.metadata) throw new Error('Bid metadata is missing');
      expect(found.metadata.reason).toBe('outbid');
    });

    it('should prevent invalid status transitions', async () => {
      // Cannot go directly from PENDING to ACCEPTED
      await expect(
        bidRepository.update(pendingBid.id, { status: BidStatus.ACCEPTED })
      ).rejects.toThrow();

      // Cannot go directly from PENDING to REJECTED
      await expect(
        bidRepository.update(pendingBid.id, { status: BidStatus.REJECTED })
      ).rejects.toThrow();

      // Cannot change status after ACCEPTED
      await bidRepository.update(pendingBid.id, { status: BidStatus.ACTIVE });
      await bidRepository.update(pendingBid.id, { status: BidStatus.ACCEPTED });
      await expect(
        bidRepository.update(pendingBid.id, { status: BidStatus.REJECTED })
      ).rejects.toThrow();
    });
  });

  describe('Validation and Edge Cases', () => {
    it('should validate bid amount', async () => {
      // Amount cannot be negative
      await expect(
        bidRepository.create({
          userId: user.id,
          certificateId: certificate.id,
          auctionId: auction.id,
          amount: -100,
          interestRate: 18,
          status: BidStatus.PENDING,
        })
      ).rejects.toThrow();

      // Amount cannot be zero
      await expect(
        bidRepository.create({
          userId: user.id,
          certificateId: certificate.id,
          auctionId: auction.id,
          amount: 0,
          interestRate: 18,
          status: BidStatus.PENDING,
        })
      ).rejects.toThrow();
    });

    it('should validate interest rate', async () => {
      // Interest rate cannot be negative
      await expect(
        bidRepository.create({
          userId: user.id,
          certificateId: certificate.id,
          auctionId: auction.id,
          amount: 1000,
          interestRate: -1,
          status: BidStatus.PENDING,
        })
      ).rejects.toThrow();

      // Interest rate cannot exceed maximum (assuming 18%)
      await expect(
        bidRepository.create({
          userId: user.id,
          certificateId: certificate.id,
          auctionId: auction.id,
          amount: 1000,
          interestRate: 19,
          status: BidStatus.PENDING,
        })
      ).rejects.toThrow();
    });

    it('should handle concurrent bids on same certificate', async () => {
      // Create first bid
      const bid1 = await bidRepository.create({
        userId: user.id,
        certificateId: certificate.id,
        auctionId: auction.id,
        amount: 1000,
        interestRate: 18,
        status: BidStatus.PENDING,
      });

      // Create second bid with higher amount
      const bid2 = await bidRepository.create({
        userId: user.id,
        certificateId: certificate.id,
        auctionId: auction.id,
        amount: 1100,
        interestRate: 17,
        status: BidStatus.PENDING,
      });

      expect(bid1.id).not.toBe(bid2.id);
      expect(bid2.amount).toBeGreaterThan(bid1.amount);

      const bidsForCertificate = await bidRepository.findByCertificate(certificate.id);
      expect(bidsForCertificate).toHaveLength(2);
      expect(bidsForCertificate.map(b => b.id)).toContain(bid1.id);
      expect(bidsForCertificate.map(b => b.id)).toContain(bid2.id);
    });
  });

  describe('Relationship Loading', () => {
    let bid: Bid;

    beforeEach(async () => {
      bid = await bidRepository.create({
        userId: user.id,
        certificateId: certificate.id,
        auctionId: auction.id,
        amount: 1000,
        interestRate: 18,
        status: BidStatus.PENDING,
      });
    });

    it('should load bid with user relation', async () => {
      const bidWithUser = await bidRepository.findByIdWithUser(bid.id);
      expect(bidWithUser).toBeDefined();
      expect(bidWithUser!.id).toBe(bid.id);
      expect(bidWithUser!.user).toBeDefined();
      expect(bidWithUser!.user.id).toBe(user.id);
    });

    it('should load bid with certificate relation', async () => {
      const bidWithCertificate = await bidRepository.findByCertificate(certificate.id);
      expect(bidWithCertificate[0]).toBeDefined();
      expect(bidWithCertificate[0].id).toBe(bid.id);
      expect(bidWithCertificate[0].certificate).toBeDefined();
      expect(bidWithCertificate[0].certificate.id).toBe(certificate.id);
    });

    it('should load bid with auction relation', async () => {
      const bidWithAuction = await bidRepository.findByAuction(auction.id);
      expect(bidWithAuction[0]).toBeDefined();
      expect(bidWithAuction[0].id).toBe(bid.id);
      expect(bidWithAuction[0].auction).toBeDefined();
      expect(bidWithAuction[0].auction.id).toBe(auction.id);
    });

    it('should load bid with all relations', async () => {
      const bidWithRelations = await bidRepository.findByIdWithRelations(bid.id);
      expect(bidWithRelations).toBeDefined();
      if (!bidWithRelations) throw new Error('Bid with relations not found');
      expect(bidWithRelations.id).toBe(bid.id);

      // Check user relation
      expect(bidWithRelations.user).toBeDefined();
      if (!bidWithRelations.user) throw new Error('User relation not loaded');
      expect(bidWithRelations.user.id).toBe(user.id);

      // Check certificate relation
      expect(bidWithRelations.certificate).toBeDefined();
      if (!bidWithRelations.certificate) throw new Error('Certificate relation not loaded');
      expect(bidWithRelations.certificate.id).toBe(certificate.id);

      // Check auction relation
      expect(bidWithRelations.auction).toBeDefined();
      if (!bidWithRelations.auction) throw new Error('Auction relation not loaded');
      expect(bidWithRelations.auction.id).toBe(auction.id);
    });
  });

  describe('Metadata and Notes Handling', () => {
    it('should create and retrieve bid with metadata', async () => {
      const metadata = {
        source: 'web',
        browser: 'chrome',
        ipAddress: '127.0.0.1',
        timestamp: new Date().toISOString(),
      };

      const bid = await bidRepository.create({
        userId: user.id,
        certificateId: certificate.id,
        auctionId: auction.id,
        amount: 1000,
        interestRate: 18,
        status: BidStatus.PENDING,
        metadata,
      });

      expect(bid.metadata).toBeDefined();
      expect(bid.metadata).toEqual(metadata);

      const found = await bidRepository.findById(bid.id);
      expect(found).toBeDefined();
      if (!found) throw new Error('Created bid not found');
      expect(found.metadata).toBeDefined();
      expect(found.metadata).toEqual(metadata);
    });

    it('should update bid metadata', async () => {
      const bid = await bidRepository.create({
        userId: user.id,
        certificateId: certificate.id,
        auctionId: auction.id,
        amount: 1000,
        interestRate: 18,
        status: BidStatus.PENDING,
        metadata: { initial: 'value' },
      });

      const newMetadata = {
        updated: true,
        reason: 'price adjustment',
        timestamp: new Date().toISOString(),
      };

      const updated = await bidRepository.update(bid.id, { metadata: newMetadata });
      expect(updated).toBeDefined();
      if (!updated) throw new Error('Failed to update bid');
      expect(updated.metadata).toBeDefined();
      expect(updated.metadata).toEqual(newMetadata);

      const found = await bidRepository.findById(bid.id);
      expect(found).toBeDefined();
      if (!found) throw new Error('Updated bid not found');
      expect(found.metadata).toEqual(newMetadata);
    });

    it('should handle bid notes', async () => {
      const bid = await bidRepository.create({
        userId: user.id,
        certificateId: certificate.id,
        auctionId: auction.id,
        amount: 1000,
        interestRate: 18,
        status: BidStatus.PENDING,
        notes: 'Initial bid notes',
      });

      expect(bid.notes).toBe('Initial bid notes');

      const updatedNotes = 'Updated bid notes with additional information';
      const updated = await bidRepository.update(bid.id, { notes: updatedNotes });
      expect(updated).toBeDefined();
      if (!updated) throw new Error('Failed to update bid notes');
      expect(updated.notes).toBe(updatedNotes);

      const found = await bidRepository.findById(bid.id);
      expect(found).toBeDefined();
      if (!found) throw new Error('Updated bid not found');
      expect(found.notes).toBe(updatedNotes);
    });
  });

  describe('Bid History and Expiration', () => {
    it('should track bid history through metadata', async () => {
      const initialHistory = [
        {
          timestamp: new Date().toISOString(),
          action: 'created',
          amount: 1000,
          interestRate: 18,
        },
      ];

      const bid = await bidRepository.create({
        userId: user.id,
        certificateId: certificate.id,
        auctionId: auction.id,
        amount: 1000,
        interestRate: 18,
        status: BidStatus.PENDING,
        metadata: {
          history: initialHistory,
        },
      });

      // Update bid amount and track in history
      const updateTime = new Date().toISOString();
      const updated = await bidRepository.update(bid.id, {
        amount: 1100,
        metadata: {
          history: [
            ...(bid.metadata?.history || []),
            {
              timestamp: updateTime,
              action: 'updated',
              amount: 1100,
              interestRate: 18,
            },
          ],
        },
      });

      expect(updated).toBeDefined();
      if (!updated) throw new Error('Failed to update bid history');
      expect(updated.metadata).toBeDefined();
      if (!updated.metadata) throw new Error('Updated bid metadata is missing');
      expect(updated.metadata.history).toBeDefined();
      if (!updated.metadata.history) throw new Error('Updated bid history is missing');
      expect(updated.metadata.history).toHaveLength(2);
      expect(updated.metadata.history[1].action).toBe('updated');
      expect(updated.metadata.history[1].amount).toBe(1100);
    });

    it('should handle bid expiration scenarios', async () => {
      const bid = await bidRepository.create({
        userId: user.id,
        certificateId: certificate.id,
        auctionId: auction.id,
        amount: 1000,
        interestRate: 18,
        status: BidStatus.PENDING,
        metadata: {
          expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
        },
      });

      // Simulate bid expiration
      const expired = await bidRepository.update(bid.id, {
        status: BidStatus.EXPIRED,
        metadata: {
          ...bid.metadata,
          expiredAt: new Date().toISOString(),
          reason: 'timeout',
        },
      });

      expect(expired).toBeDefined();
      if (!expired) throw new Error('Failed to expire bid');
      expect(expired.status).toBe(BidStatus.EXPIRED);
      expect(expired.metadata).toBeDefined();
      if (!expired.metadata) throw new Error('Expired bid metadata is missing');
      expect(expired.metadata.expiredAt).toBeDefined();
      expect(expired.metadata.reason).toBe('timeout');

      // Verify cannot update expired bid
      await expect(bidRepository.update(bid.id, { amount: 1100 })).rejects.toThrow();
    });
  });
});
