import { AppDataSource, initializeDatabase } from '../src/config/database';
import { auctionRepository } from '../src/repositories/auction.repository';
import { AuctionStatus } from '../src/models/entities/auction.entity';
import { Repository } from 'typeorm';
import { County } from '../src/models/entities/county.entity';
import { Auction } from '../src/models/entities/auction.entity';
import { v4 as uuidv4 } from 'uuid';
import { Certificate } from '../src/models/entities/certificate.entity';
import { CertificateStatus } from '../src/models/entities/certificate.entity';
import { Property } from '../src/models/entities/property.entity';
import { Bid } from '../src/models/entities/bid.entity';

describe('AuctionRepository', () => {
  let county: County;
  let countyRepo: Repository<County>;
  let auctionRepo: Repository<Auction>;
  let certificateRepo: Repository<Certificate>;
  let propertyRepo: Repository<Property>;
  let bidRepo: Repository<Bid>;
  let property: Property;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await initializeDatabase();
    countyRepo = AppDataSource.getRepository(County);
    auctionRepo = AppDataSource.getRepository(Auction);
    certificateRepo = AppDataSource.getRepository(Certificate);
    propertyRepo = AppDataSource.getRepository(Property);
    bidRepo = AppDataSource.getRepository(Bid);
  });

  beforeEach(async () => {
    try {
      // Clean up in correct order to avoid foreign key violations
      await bidRepo.createQueryBuilder().delete().execute();
      await certificateRepo.createQueryBuilder().delete().execute();
      await auctionRepo.createQueryBuilder().delete().execute();
      await propertyRepo.createQueryBuilder().delete().execute();
      await countyRepo.createQueryBuilder().delete().execute();

      // Create prerequisite county with unique name
      county = await countyRepo.save(
        countyRepo.create({
          name: `Test County ${uuidv4().substring(0, 8)}`,
          state: 'FL',
        })
      );

      // Create prerequisite property with unique parcelId
      property = await propertyRepo.save(
        propertyRepo.create({
          parcelId: `PID-${uuidv4().substring(0, 8)}`,
          address: '123 Test St',
          city: 'Test City',
          state: 'FL',
          zipCode: '12345',
          countyId: county.id,
        })
      );
    } catch (error) {
      console.error('Setup failed:', error);
      throw error;
    }
  });

  afterEach(async () => {
    try {
      // Clean up in correct order after each test
      await bidRepo.createQueryBuilder().delete().execute();
      await certificateRepo.createQueryBuilder().delete().execute();
      await auctionRepo.createQueryBuilder().delete().execute();
      await propertyRepo.createQueryBuilder().delete().execute();
      await countyRepo.createQueryBuilder().delete().execute();
    } catch (error) {
      console.error('Cleanup failed:', error);
      throw error;
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      try {
        await bidRepo.createQueryBuilder().delete().execute();
        await certificateRepo.createQueryBuilder().delete().execute();
        await auctionRepo.createQueryBuilder().delete().execute();
        await propertyRepo.createQueryBuilder().delete().execute();
        await countyRepo.createQueryBuilder().delete().execute();
        await AppDataSource.destroy();
      } catch (error) {
        console.error('Final cleanup failed:', error);
        throw error;
      }
    }
  });

  describe('Basic CRUD Operations', () => {
    it('should create an auction with UPCOMING status', async () => {
      const auctionData = {
        name: `Test Auction ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(),
        startTime: '09:00:00',
        endTime: '17:00:00',
        status: AuctionStatus.UPCOMING,
        description: 'A test auction',
        location: 'Test Location',
        registrationUrl: 'http://example.com',
        countyId: county.id,
      };

      const auction = await auctionRepository.create(auctionData);

      expect(auction).toBeDefined();
      expect(auction.id).toBeDefined();
      expect(auction.name).toBe(auctionData.name);
      expect(auction.status).toBe(AuctionStatus.UPCOMING);
      expect(auction.countyId).toBe(county.id);
      expect(auction.startTime).toBe(auctionData.startTime);
      expect(auction.endTime).toBe(auctionData.endTime);
      expect(auction.description).toBe(auctionData.description);
      expect(auction.location).toBe(auctionData.location);
      expect(auction.registrationUrl).toBe(auctionData.registrationUrl);
    });

    it('should find an auction by id', async () => {
      const auction = await auctionRepository.create({
        name: `Find By ID ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(),
        startTime: '16:00:00',
        endTime: '00:00:00',
        status: AuctionStatus.UPCOMING,
        countyId: county.id,
      });

      const found = await auctionRepository.findById(auction.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(auction.id);
      expect(found!.name).toBe(auction.name);
      expect(found!.countyId).toBe(county.id);
    });

    it('should update an auction', async () => {
      const auction = await auctionRepository.create({
        name: `Update Test ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(),
        startTime: '09:00:00',
        endTime: '17:00:00',
        status: AuctionStatus.UPCOMING,
        countyId: county.id,
      });

      const updateData = {
        name: `Updated ${uuidv4().substring(0, 8)}`,
        description: 'Updated description',
        location: 'Updated location',
      };

      const updated = await auctionRepository.update(auction.id, updateData);

      expect(updated).toBeDefined();
      expect(updated!.id).toBe(auction.id);
      expect(updated!.name).toBe(updateData.name);
      expect(updated!.description).toBe(updateData.description);
      expect(updated!.location).toBe(updateData.location);
      expect(updated!.status).toBe(AuctionStatus.UPCOMING);
      expect(updated!.countyId).toBe(county.id);
    });

    it('should handle updating non-existent auction', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const updateData = {
        name: 'Should Not Update',
        description: 'Should Not Update',
      };

      const result = await auctionRepository.update(nonExistentId, updateData);
      expect(result).toBeNull();
    });
  });

  describe('Status Transitions', () => {
    it('should activate an auction (UPCOMING -> ACTIVE)', async () => {
      const auction = await auctionRepository.create({
        name: `Activate ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(),
        startTime: '10:00:00',
        endTime: '18:00:00',
        status: AuctionStatus.UPCOMING,
        countyId: county.id,
      });

      const activated = await auctionRepository.activateAuction(auction.id);
      expect(activated).toBeDefined();
      expect(activated!.id).toBe(auction.id);
      expect(activated!.status).toBe(AuctionStatus.ACTIVE);

      // Verify persistence
      const found = await auctionRepository.findById(auction.id);
      expect(found!.status).toBe(AuctionStatus.ACTIVE);
    });

    it('should complete an auction (ACTIVE -> COMPLETED)', async () => {
      const auction = await auctionRepository.create({
        name: `Complete ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(),
        startTime: '11:00:00',
        endTime: '19:00:00',
        status: AuctionStatus.UPCOMING,
        countyId: county.id,
      });

      const activated = await auctionRepository.activateAuction(auction.id);
      expect(activated!.status).toBe(AuctionStatus.ACTIVE);

      const completed = await auctionRepository.completeAuction(auction.id);
      expect(completed).toBeDefined();
      expect(completed!.id).toBe(auction.id);
      expect(completed!.status).toBe(AuctionStatus.COMPLETED);

      // Verify persistence
      const found = await auctionRepository.findById(auction.id);
      expect(found!.status).toBe(AuctionStatus.COMPLETED);
    });

    it('should cancel an auction (UPCOMING -> CANCELLED)', async () => {
      const auction = await auctionRepository.create({
        name: `Cancel ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(),
        startTime: '13:00:00',
        endTime: '21:00:00',
        status: AuctionStatus.UPCOMING,
        countyId: county.id,
      });

      const cancelled = await auctionRepository.cancelAuction(auction.id);
      expect(cancelled).toBeDefined();
      expect(cancelled!.id).toBe(auction.id);
      expect(cancelled!.status).toBe(AuctionStatus.CANCELLED);

      // Verify persistence
      const found = await auctionRepository.findById(auction.id);
      expect(found!.status).toBe(AuctionStatus.CANCELLED);
    });

    it('should not activate an auction that is not UPCOMING', async () => {
      const auction = await auctionRepository.create({
        name: `Invalid Activate ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(),
        startTime: '12:00:00',
        endTime: '20:00:00',
        status: AuctionStatus.COMPLETED,
        countyId: county.id,
      });

      const result = await auctionRepository.activateAuction(auction.id);
      expect(result).toBeNull();

      // Verify status didn't change
      const found = await auctionRepository.findById(auction.id);
      expect(found!.status).toBe(AuctionStatus.COMPLETED);
    });

    it('should not complete an auction that is not ACTIVE', async () => {
      const auction = await auctionRepository.create({
        name: `Invalid Complete ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(),
        startTime: '14:00:00',
        endTime: '22:00:00',
        status: AuctionStatus.UPCOMING,
        countyId: county.id,
      });

      const result = await auctionRepository.completeAuction(auction.id);
      expect(result).toBeNull();

      // Verify status didn't change
      const found = await auctionRepository.findById(auction.id);
      expect(found!.status).toBe(AuctionStatus.UPCOMING);
    });

    it('should not cancel an auction that is COMPLETED', async () => {
      const auction = await auctionRepository.create({
        name: `Invalid Cancel ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(),
        startTime: '15:00:00',
        endTime: '23:00:00',
        status: AuctionStatus.COMPLETED,
        countyId: county.id,
      });

      const result = await auctionRepository.cancelAuction(auction.id);
      expect(result).toBeNull();

      // Verify status didn't change
      const found = await auctionRepository.findById(auction.id);
      expect(found!.status).toBe(AuctionStatus.COMPLETED);
    });
  });

  describe('Query Operations', () => {
    let upcomingAuction: Auction;
    let activeAuction: Auction;
    let completedAuction: Auction;

    beforeEach(async () => {
      // Create test auctions with unique names
      upcomingAuction = await auctionRepository.create({
        name: `Upcoming ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(Date.now() + 86400000), // tomorrow
        startTime: '09:00:00',
        endTime: '17:00:00',
        status: AuctionStatus.UPCOMING,
        countyId: county.id,
      });

      activeAuction = await auctionRepository.create({
        name: `Active ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(),
        startTime: '10:00:00',
        endTime: '18:00:00',
        status: AuctionStatus.ACTIVE,
        countyId: county.id,
      });

      completedAuction = await auctionRepository.create({
        name: `Completed ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(Date.now() - 86400000), // yesterday
        startTime: '11:00:00',
        endTime: '19:00:00',
        status: AuctionStatus.COMPLETED,
        countyId: county.id,
      });
    });

    it('should find auctions by county', async () => {
      const countyAuctions = await auctionRepository.findByCounty(county.id);
      expect(countyAuctions).toBeDefined();
      expect(countyAuctions.length).toBeGreaterThanOrEqual(3);
      expect(countyAuctions.every(a => a.countyId === county.id)).toBe(true);

      // Verify all test auctions are included
      const auctionIds = countyAuctions.map(a => a.id);
      expect(auctionIds).toContain(upcomingAuction.id);
      expect(auctionIds).toContain(activeAuction.id);
      expect(auctionIds).toContain(completedAuction.id);
    });

    it('should find upcoming auctions', async () => {
      const upcomingAuctions = await auctionRepository.findUpcoming();
      expect(upcomingAuctions).toBeDefined();
      expect(upcomingAuctions.length).toBeGreaterThanOrEqual(1);
      expect(upcomingAuctions.every(a => a.status === AuctionStatus.UPCOMING)).toBe(true);

      // Verify our test upcoming auction is included
      const auctionIds = upcomingAuctions.map(a => a.id);
      expect(auctionIds).toContain(upcomingAuction.id);
      expect(auctionIds).not.toContain(activeAuction.id);
      expect(auctionIds).not.toContain(completedAuction.id);
    });

    it('should find active auctions', async () => {
      const activeAuctions = await auctionRepository.findActive();
      expect(activeAuctions).toBeDefined();
      expect(activeAuctions.length).toBeGreaterThanOrEqual(1);
      expect(activeAuctions.every(a => a.status === AuctionStatus.ACTIVE)).toBe(true);

      // Verify our test active auction is included
      const auctionIds = activeAuctions.map(a => a.id);
      expect(auctionIds).not.toContain(upcomingAuction.id);
      expect(auctionIds).toContain(activeAuction.id);
      expect(auctionIds).not.toContain(completedAuction.id);
    });

    it('should find auctions by date range', async () => {
      const startDate = new Date(Date.now() - 86400000 * 2); // 2 days ago
      const endDate = new Date(Date.now() + 86400000 * 2); // 2 days from now

      const auctions = await auctionRepository.findByDateRange(startDate, endDate);
      expect(auctions).toBeDefined();
      expect(auctions.length).toBeGreaterThanOrEqual(3);

      // Verify all test auctions are included
      const auctionIds = auctions.map(a => a.id);
      expect(auctionIds).toContain(upcomingAuction.id);
      expect(auctionIds).toContain(activeAuction.id);
      expect(auctionIds).toContain(completedAuction.id);

      // Verify dates are within range
      auctions.forEach(auction => {
        const auctionDate = new Date(auction.auctionDate);
        expect(auctionDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
        expect(auctionDate.getTime()).toBeLessThanOrEqual(endDate.getTime());
      });
    });

    it('should handle empty date range results', async () => {
      const futureDate = new Date(Date.now() + 86400000 * 30); // 30 days from now
      const furtherFutureDate = new Date(Date.now() + 86400000 * 31); // 31 days from now

      const auctions = await auctionRepository.findByDateRange(futureDate, furtherFutureDate);
      expect(auctions).toBeDefined();
      expect(auctions).toHaveLength(0);
    });

    it('should handle invalid county id', async () => {
      const nonExistentCountyId = '00000000-0000-0000-0000-000000000000';
      const auctions = await auctionRepository.findByCounty(nonExistentCountyId);
      expect(auctions).toBeDefined();
      expect(auctions).toHaveLength(0);
    });
  });

  describe('Additional Query Operations', () => {
    let upcomingAuction1: Auction;
    let upcomingAuction2: Auction;
    let activeAuction: Auction;
    let completedAuction: Auction;
    let cancelledAuction: Auction;

    beforeEach(async () => {
      try {
        // Create test auctions with different statuses and dates
        upcomingAuction1 = await auctionRepository.create({
          name: `Upcoming1 ${uuidv4().substring(0, 8)}`,
          auctionDate: new Date(Date.now() + 86400000), // tomorrow
          startTime: '09:00:00',
          endTime: '17:00:00',
          status: AuctionStatus.UPCOMING,
          countyId: county.id,
          metadata: { priority: 'high', tags: ['featured'] },
        });

        upcomingAuction2 = await auctionRepository.create({
          name: `Upcoming2 ${uuidv4().substring(0, 8)}`,
          auctionDate: new Date(Date.now() + 86400000 * 2), // day after tomorrow
          startTime: '10:00:00',
          endTime: '18:00:00',
          status: AuctionStatus.UPCOMING,
          countyId: county.id,
        });

        activeAuction = await auctionRepository.create({
          name: `Active ${uuidv4().substring(0, 8)}`,
          auctionDate: new Date(),
          startTime: '11:00:00',
          endTime: '19:00:00',
          status: AuctionStatus.ACTIVE,
          countyId: county.id,
        });

        completedAuction = await auctionRepository.create({
          name: `Completed ${uuidv4().substring(0, 8)}`,
          auctionDate: new Date(Date.now() - 86400000), // yesterday
          startTime: '12:00:00',
          endTime: '20:00:00',
          status: AuctionStatus.COMPLETED,
          countyId: county.id,
        });

        cancelledAuction = await auctionRepository.create({
          name: `Cancelled ${uuidv4().substring(0, 8)}`,
          auctionDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
          startTime: '13:00:00',
          endTime: '21:00:00',
          status: AuctionStatus.CANCELLED,
          countyId: county.id,
        });
      } catch (error) {
        console.error('Failed to create test auctions:', error);
        throw error;
      }
    });

    it('should find all auctions', async () => {
      const allAuctions = await auctionRepository.findAll();
      expect(allAuctions).toBeDefined();
      expect(allAuctions.length).toBeGreaterThanOrEqual(5);

      const auctionIds = allAuctions.map(a => a.id);
      expect(auctionIds).toContain(upcomingAuction1.id);
      expect(auctionIds).toContain(upcomingAuction2.id);
      expect(auctionIds).toContain(activeAuction.id);
      expect(auctionIds).toContain(completedAuction.id);
      expect(auctionIds).toContain(cancelledAuction.id);
    });

    it('should find auctions by status', async () => {
      const upcomingAuctions = await auctionRepository.findByStatus(AuctionStatus.UPCOMING);
      expect(upcomingAuctions.length).toBeGreaterThanOrEqual(2);
      expect(upcomingAuctions.every(a => a.status === AuctionStatus.UPCOMING)).toBe(true);
      expect(upcomingAuctions.map(a => a.id)).toContain(upcomingAuction1.id);
      expect(upcomingAuctions.map(a => a.id)).toContain(upcomingAuction2.id);

      const completedAuctions = await auctionRepository.findByStatus(AuctionStatus.COMPLETED);
      expect(completedAuctions.length).toBeGreaterThanOrEqual(1);
      expect(completedAuctions.every(a => a.status === AuctionStatus.COMPLETED)).toBe(true);
      expect(completedAuctions.map(a => a.id)).toContain(completedAuction.id);
    });

    it('should find completed auctions', async () => {
      const completed = await auctionRepository.findCompleted();
      expect(completed).toBeDefined();
      expect(completed.length).toBeGreaterThanOrEqual(1);
      expect(completed.every(a => a.status === AuctionStatus.COMPLETED)).toBe(true);
      expect(completed.map(a => a.id)).toContain(completedAuction.id);
    });

    it('should find upcoming auctions by date range', async () => {
      const startDate = new Date(Date.now());
      const endDate = new Date(Date.now() + 86400000 * 3); // 3 days from now

      const upcomingInRange = await auctionRepository.findUpcomingByDateRange(startDate, endDate);
      expect(upcomingInRange).toBeDefined();
      expect(upcomingInRange.length).toBeGreaterThanOrEqual(2);
      expect(upcomingInRange.every(a => a.status === AuctionStatus.UPCOMING)).toBe(true);

      const auctionIds = upcomingInRange.map(a => a.id);
      expect(auctionIds).toContain(upcomingAuction1.id);
      expect(auctionIds).toContain(upcomingAuction2.id);
    });

    it('should find auctions before date', async () => {
      const date = new Date();
      const beforeDate = await auctionRepository.findBeforeDate(date);
      expect(beforeDate).toBeDefined();
      expect(beforeDate.length).toBeGreaterThanOrEqual(2);

      const auctionIds = beforeDate.map(a => a.id);
      expect(auctionIds).toContain(completedAuction.id);
      expect(auctionIds).toContain(cancelledAuction.id);
    });

    it('should find auctions after date', async () => {
      const date = new Date();
      const afterDate = await auctionRepository.findAfterDate(date);
      expect(afterDate).toBeDefined();
      expect(afterDate.length).toBeGreaterThanOrEqual(2);

      const auctionIds = afterDate.map(a => a.id);
      expect(auctionIds).toContain(upcomingAuction1.id);
      expect(auctionIds).toContain(upcomingAuction2.id);
    });

    it('should handle invalid date ranges', async () => {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() + 86400000); // start date after end date

      const auctions = await auctionRepository.findByDateRange(startDate, endDate);
      expect(auctions).toBeDefined();
      expect(auctions).toHaveLength(0);
    });
  });

  describe('Relationship Loading', () => {
    let auctionWithCertificates: Auction;
    let certificates: Certificate[];

    beforeEach(async () => {
      try {
        // Create an auction with certificates
        auctionWithCertificates = await auctionRepository.create({
          name: `WithCerts ${uuidv4().substring(0, 8)}`,
          auctionDate: new Date(),
          startTime: '09:00:00',
          endTime: '17:00:00',
          status: AuctionStatus.UPCOMING,
          countyId: county.id,
        });

        // Create certificates for the auction
        certificates = await Promise.all([
          certificateRepo.save(
            certificateRepo.create({
              certificateNumber: `CERT-${uuidv4().substring(0, 8)}`,
              faceValue: 1000,
              interestRate: 18,
              issueDate: new Date(),
              status: CertificateStatus.AVAILABLE,
              countyId: county.id,
              propertyId: property.id,
              auctionId: auctionWithCertificates.id,
            })
          ),
          certificateRepo.save(
            certificateRepo.create({
              certificateNumber: `CERT-${uuidv4().substring(0, 8)}`,
              faceValue: 2000,
              interestRate: 18,
              issueDate: new Date(),
              status: CertificateStatus.AVAILABLE,
              countyId: county.id,
              propertyId: property.id,
              auctionId: auctionWithCertificates.id,
            })
          ),
        ]);
      } catch (error) {
        console.error('Failed to create auction with certificates:', error);
        throw error;
      }
    });

    it('should load auction with certificates', async () => {
      const auction = await auctionRepository.findWithCertificates(auctionWithCertificates.id);
      expect(auction).toBeDefined();
      expect(auction!.id).toBe(auctionWithCertificates.id);
      expect(auction!.certificates).toBeDefined();
      expect(auction!.certificates.length).toBe(2);

      const certificateIds = auction!.certificates.map(c => c.id);
      certificates.forEach(cert => {
        expect(certificateIds).toContain(cert.id);
      });
    });

    it('should load auction with all relations', async () => {
      const auction = await auctionRepository.findWithRelations(auctionWithCertificates.id);
      expect(auction).toBeDefined();
      expect(auction!.id).toBe(auctionWithCertificates.id);

      // Check county relation
      expect(auction!.county).toBeDefined();
      expect(auction!.county.id).toBe(county.id);

      // Check certificates relation
      expect(auction!.certificates).toBeDefined();
      expect(auction!.certificates.length).toBe(2);

      const certificateIds = auction!.certificates.map(c => c.id);
      certificates.forEach(cert => {
        expect(certificateIds).toContain(cert.id);
      });
    });

    it('should return null when loading relations for non-existent auction', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const withCertificates = await auctionRepository.findWithCertificates(nonExistentId);
      expect(withCertificates).toBeNull();

      const withRelations = await auctionRepository.findWithRelations(nonExistentId);
      expect(withRelations).toBeNull();
    });
  });

  describe('Metadata Handling', () => {
    it('should create and retrieve auction with metadata', async () => {
      const metadata = {
        priority: 'high',
        tags: ['featured', 'special'],
        customField: 'test value',
      };

      const auction = await auctionRepository.create({
        name: `Metadata Test ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(),
        startTime: '09:00:00',
        endTime: '17:00:00',
        status: AuctionStatus.UPCOMING,
        countyId: county.id,
        metadata,
      });

      expect(auction.metadata).toBeDefined();
      expect(auction.metadata).toEqual(metadata);

      const found = await auctionRepository.findById(auction.id);
      expect(found!.metadata).toBeDefined();
      expect(found!.metadata).toEqual(metadata);
    });

    it('should update auction metadata', async () => {
      const auction = await auctionRepository.create({
        name: `Metadata Update ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(),
        startTime: '09:00:00',
        endTime: '17:00:00',
        status: AuctionStatus.UPCOMING,
        countyId: county.id,
        metadata: { initial: 'value' },
      });

      const newMetadata = {
        updated: true,
        timestamp: new Date().toISOString(),
      };

      const updated = await auctionRepository.update(auction.id, { metadata: newMetadata });
      expect(updated!.metadata).toBeDefined();
      expect(updated!.metadata).toEqual(newMetadata);

      const found = await auctionRepository.findById(auction.id);
      expect(found!.metadata).toEqual(newMetadata);
    });
  });
});
