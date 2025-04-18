import { Repository, DataSource, DeepPartial } from 'typeorm';
import { Bid, BidStatus } from '../src/models/entities/bid.entity';
import { User, UserRole, AccountStatus } from '../src/models/entities/user.entity';
import { Auction, AuctionStatus } from '../src/models/entities/auction.entity';
import { Certificate, CertificateStatus } from '../src/models/entities/certificate.entity';
import { County } from '../src/models/entities/county.entity';
import { Property } from '../src/models/entities/property.entity';
import { initializeTestDatabase, closeTestDatabase } from '../src/config/database.test';

// Constants for Florida tax certificate rules
const MAX_INTEREST_RATE = 18.0;
const MIN_INTEREST_RATE = 5.0;
const ZERO_INTEREST_RATE = 0.0;

interface TestBidData {
  bidPercentage: number;
  status: BidStatus;
  userId: string;
  auctionId: string;
  certificateId: string;
  metadata?: Record<string, unknown>;
}

const createTestBidData = (overrides: Partial<TestBidData> = {}): TestBidData => ({
  bidPercentage: 10.0,
  status: BidStatus.PENDING,
  userId: '',
  auctionId: '',
  certificateId: '',
  metadata: { note: 'Test bid' },
  ...overrides,
});

const createTestBid = async (
  bidRepository: Repository<Bid>,
  userId: string,
  auctionId: string,
  certificateId: string,
  overrides: Partial<TestBidData> = {}
): Promise<Bid> => {
  const bidData = createTestBidData({
    userId,
    auctionId,
    certificateId,
    ...overrides,
  });

  const bid = bidRepository.create(bidData);
  return await bidRepository.save(bid);
};

interface BidMetadata {
  history: Array<{
    timestamp: Date;
    action: string;
    previousPercentage: number;
    newPercentage: number;
  }>;
}

// Add these type definitions after the imports
type BidUpdateData = {
  bidPercentage?: number;
  status?: BidStatus;
  metadata?: {
    history: Array<{
      timestamp: Date;
      action: string;
      previousPercentage: number;
      newPercentage: number;
    }>;
  };
};

describe('BidRepository', () => {
  let dataSource: DataSource;
  let bidRepo: Repository<Bid>;
  let userRepo: Repository<User>;
  let auctionRepo: Repository<Auction>;
  let certificateRepo: Repository<Certificate>;
  let countyRepo: Repository<County>;
  let propertyRepo: Repository<Property>;

  let user: User;
  let auction: Auction;
  let certificate: Certificate;
  let county: County;
  let property: Property;
  let createdBid: Bid;

  beforeAll(async () => {
    dataSource = await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  beforeEach(async () => {
    bidRepo = dataSource.getRepository(Bid);
    userRepo = dataSource.getRepository(User);
    auctionRepo = dataSource.getRepository(Auction);
    certificateRepo = dataSource.getRepository(Certificate);
    countyRepo = dataSource.getRepository(County);
    propertyRepo = dataSource.getRepository(Property);

    // Clean up existing data
    await bidRepo.delete({});
    await certificateRepo.delete({});
    await auctionRepo.delete({});
    await userRepo.delete({});
    await propertyRepo.delete({});
    await countyRepo.delete({});

    // Create test data
    county = await countyRepo.save(
      countyRepo.create({
        name: 'Test County',
        state: 'FL',
      })
    );

    property = await propertyRepo.save(
      propertyRepo.create({
        parcelId: 'TEST-PARCEL',
        address: '123 Test St',
        city: 'Test City',
        state: 'FL',
        zipCode: '12345',
        countyId: county.id,
      })
    );

    user = await userRepo.save(
      userRepo.create({
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.INVESTOR,
        status: AccountStatus.ACTIVE,
      })
    );

    auction = await auctionRepo.save(
      auctionRepo.create({
        name: 'Test Auction',
        auctionDate: new Date(),
        startTime: '09:00:00',
        endTime: '17:00:00',
        status: AuctionStatus.ACTIVE,
        countyId: county.id,
      })
    );

    certificate = await certificateRepo.save(
      certificateRepo.create({
        certificateNumber: 'TEST-CERT',
        faceValue: 1000.0,
        interestRate: MAX_INTEREST_RATE,
        issueDate: new Date(),
        status: CertificateStatus.AVAILABLE,
        propertyId: property.id,
        auctionId: auction.id,
        countyId: county.id,
      })
    );

    createdBid = await createTestBid(bidRepo, user.id, auction.id, certificate.id);
  });

  describe('Basic CRUD Operations', () => {
    it('should create a bid', async () => {
      const bidData = {
        bidPercentage: 15.0,
        status: BidStatus.PENDING,
        userId: user.id,
        auctionId: auction.id,
        certificateId: certificate.id,
        metadata: { note: 'Test bid' },
      };

      const bid = await bidRepo.save(bidRepo.create(bidData));

      expect(bid).toBeDefined();
      expect(bid.id).toBeDefined();
      expect(bid.bidPercentage).toBe(bidData.bidPercentage);
      expect(bid.status).toBe(bidData.status);
      expect(bid.userId).toBe(bidData.userId);
      expect(bid.auctionId).toBe(bidData.auctionId);
      expect(bid.certificateId).toBe(bidData.certificateId);
      expect(bid.metadata).toEqual(bidData.metadata);
    });

    it('should find a bid by id', async () => {
      const found = await bidRepo.findOne({ where: { id: createdBid.id } });
      expect(found).toBeDefined();
      expect(found!.id).toBe(createdBid.id);
      expect(found!.userId).toBe(user.id);
      expect(found!.auctionId).toBe(auction.id);
      expect(found!.certificateId).toBe(certificate.id);
    });

    it('should update a bid', async () => {
      const updateData: BidUpdateData = {
        bidPercentage: 16.0,
        status: BidStatus.ACTIVE,
        metadata: {
          history: [],
        },
      };

      await bidRepo.update(createdBid.id, updateData);
      const updated = await bidRepo.findOne({ where: { id: createdBid.id } });

      expect(updated).toBeDefined();
      expect(updated!.id).toBe(createdBid.id);
      expect(updated!.bidPercentage).toBe(updateData.bidPercentage);
      expect(updated!.status).toBe(updateData.status);
      expect(updated!.metadata).toBeDefined();
    });

    it('should delete a bid', async () => {
      await bidRepo.delete(createdBid.id);
      const found = await bidRepo.findOne({ where: { id: createdBid.id } });
      expect(found).toBeNull();
    });
  });

  describe('Query Operations', () => {
    let additionalBids: Bid[];

    beforeEach(async () => {
      // Create additional test bids
      additionalBids = await Promise.all([
        createTestBid(bidRepo, user.id, auction.id, certificate.id, {
          bidPercentage: 17.0,
          status: BidStatus.ACTIVE,
        }),
        createTestBid(bidRepo, user.id, auction.id, certificate.id, {
          bidPercentage: 16.5,
          status: BidStatus.PENDING,
        }),
      ]);
    });

    it('should find all bids', async () => {
      const allBids = await bidRepo.find();
      expect(allBids).toHaveLength(3); // createdBid + 2 additional bids
    });

    it('should find bids by user', async () => {
      const userBids = await bidRepo.find({ where: { userId: user.id } });
      expect(userBids).toHaveLength(3);
      expect(userBids.every(bid => bid.userId === user.id)).toBe(true);
    });

    it('should find bids by auction', async () => {
      const auctionBids = await bidRepo.find({ where: { auctionId: auction.id } });
      expect(auctionBids).toHaveLength(3);
      expect(auctionBids.every(bid => bid.auctionId === auction.id)).toBe(true);
    });

    it('should find bids by certificate', async () => {
      const certificateBids = await bidRepo.find({ where: { certificateId: certificate.id } });
      expect(certificateBids).toHaveLength(3);
      expect(certificateBids.every(bid => bid.certificateId === certificate.id)).toBe(true);
    });

    it('should find bids by status', async () => {
      const activeBids = await bidRepo.find({ where: { status: BidStatus.ACTIVE } });
      expect(activeBids).toHaveLength(1);
      expect(activeBids[0].status).toBe(BidStatus.ACTIVE);

      const pendingBids = await bidRepo.find({ where: { status: BidStatus.PENDING } });
      expect(pendingBids).toHaveLength(2);
      expect(pendingBids.every((bid: Bid) => bid.status === BidStatus.PENDING)).toBe(true);
    });

    it('should find bids with relations', async () => {
      const bidWithRelations = await bidRepo.findOne({
        where: { id: createdBid.id },
        relations: ['user', 'auction', 'certificate'],
      });

      expect(bidWithRelations).toBeDefined();
      if (bidWithRelations) {
        expect(bidWithRelations.user).toBeDefined();
        expect(bidWithRelations.user.id).toBe(user.id);
        expect(bidWithRelations.auction).toBeDefined();
        expect(bidWithRelations.auction.id).toBe(auction.id);
        expect(bidWithRelations.certificate).toBeDefined();
        expect(bidWithRelations.certificate.id).toBe(certificate.id);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle creating bid with non-existent user', async () => {
      const invalidBidData: TestBidData = createTestBidData({
        userId: '00000000-0000-0000-0000-000000000000',
        auctionId: auction.id,
        certificateId: certificate.id,
      });

      await expect(bidRepo.save(bidRepo.create(invalidBidData))).rejects.toThrow();
    });

    it('should handle creating bid with non-existent auction', async () => {
      const invalidBidData = createTestBidData({
        userId: user.id,
        auctionId: '00000000-0000-0000-0000-000000000000',
        certificateId: certificate.id,
      });

      await expect(bidRepo.save(bidRepo.create(invalidBidData))).rejects.toThrow();
    });

    it('should handle creating bid with non-existent certificate', async () => {
      const invalidBidData = createTestBidData({
        userId: user.id,
        auctionId: auction.id,
        certificateId: '00000000-0000-0000-0000-000000000000',
      });

      await expect(bidRepo.save(bidRepo.create(invalidBidData))).rejects.toThrow();
    });
  });

  describe('Florida Tax Certificate Bidding Rules', () => {
    it('should enforce maximum interest rate of 18%', async () => {
      const invalidBidData = createTestBidData({
        userId: user.id,
        auctionId: auction.id,
        certificateId: certificate.id,
        bidPercentage: MAX_INTEREST_RATE + 1, // Invalid: Above maximum
      });

      await expect(bidRepo.save(bidRepo.create(invalidBidData))).rejects.toThrow(
        'Bid percentage cannot exceed 18%'
      );
    });

    it('should enforce minimum interest rate of 5% (except for zero bids)', async () => {
      const invalidBidData = createTestBidData({
        userId: user.id,
        auctionId: auction.id,
        certificateId: certificate.id,
        bidPercentage: 3.0, // Invalid: Between 0 and 5%
      });

      await expect(bidRepo.save(bidRepo.create(invalidBidData))).rejects.toThrow(
        'Bid percentage must be either 0% or at least 5%'
      );
    });

    it('should allow zero interest rate bids', async () => {
      const zeroBidData = createTestBidData({
        userId: user.id,
        auctionId: auction.id,
        certificateId: certificate.id,
        bidPercentage: ZERO_INTEREST_RATE,
      });

      const bid = await bidRepo.save(bidRepo.create(zeroBidData));
      expect(bid.bidPercentage).toBe(ZERO_INTEREST_RATE);
    });

    it('should validate bid percentage precision to 2 decimal places', async () => {
      const invalidBidData = createTestBidData({
        userId: user.id,
        auctionId: auction.id,
        certificateId: certificate.id,
        bidPercentage: 15.555, // Invalid: More than 2 decimal places
      });

      await expect(bidRepo.save(bidRepo.create(invalidBidData))).rejects.toThrow(
        'Bid percentage must have at most 2 decimal places'
      );
    });
  });

  describe('Bid Status Transitions', () => {
    it('should start new bids in PENDING status', async () => {
      const bid = await createTestBid(bidRepo, user.id, auction.id, certificate.id);
      expect(bid.status).toBe(BidStatus.PENDING);
    });

    it('should allow transition from PENDING to ACTIVE', async () => {
      const bid = await createTestBid(bidRepo, user.id, auction.id, certificate.id);

      const updated = await bidRepo.save({
        ...bid,
        status: BidStatus.ACTIVE,
      });

      expect(updated.status).toBe(BidStatus.ACTIVE);
    });

    it('should allow transition from ACTIVE to ACCEPTED', async () => {
      const bid = await createTestBid(bidRepo, user.id, auction.id, certificate.id, {
        status: BidStatus.ACTIVE,
      });

      const updated = await bidRepo.save({
        ...bid,
        status: BidStatus.ACCEPTED,
      });

      expect(updated.status).toBe(BidStatus.ACCEPTED);
    });

    it('should prevent direct transition from PENDING to ACCEPTED', async () => {
      const bid = await createTestBid(bidRepo, user.id, auction.id, certificate.id);

      await expect(
        bidRepo.save({
          ...bid,
          status: BidStatus.ACCEPTED,
        })
      ).rejects.toThrow('Invalid status transition');
    });
  });

  describe('Competitive Bidding Rules', () => {
    it('should only accept lower bids than existing ones', async () => {
      // Create initial bid at 18%
      const initialBid = await createTestBid(bidRepo, user.id, auction.id, certificate.id, {
        bidPercentage: MAX_INTEREST_RATE,
        status: BidStatus.ACTIVE,
      });

      // Create competing bid at higher rate (should fail)
      const higherBidData = createTestBidData({
        userId: user.id,
        auctionId: auction.id,
        certificateId: certificate.id,
        bidPercentage: MAX_INTEREST_RATE, // Same rate should fail
      });

      await expect(bidRepo.save(bidRepo.create(higherBidData))).rejects.toThrow(
        'New bid must be lower than existing bids'
      );

      // Create valid lower bid
      const lowerBidData = createTestBidData({
        userId: user.id,
        auctionId: auction.id,
        certificateId: certificate.id,
        bidPercentage: 15.0, // Lower rate should succeed
      });

      const lowerBid = await bidRepo.save(bidRepo.create(lowerBidData));
      expect(lowerBid.bidPercentage).toBe(15.0);
    });
  });

  describe('Metadata Operations', () => {
    it('should update metadata', async () => {
      type BidHistory = {
        timestamp: Date;
        action: string;
        previousPercentage: number;
        newPercentage: number;
      };

      // Create initial bid
      const bid = await bidRepo.save({
        userId: user.id,
        certificateId: certificate.id,
        auctionId: auction.id,
        bidPercentage: 10,
        status: BidStatus.PENDING,
        metadata: {
          history: [] as BidHistory[],
        },
      });

      const updateData: BidUpdateData = {
        metadata: {
          history: [
            {
              timestamp: new Date(),
              action: 'update',
              previousPercentage: 10,
              newPercentage: 8,
            },
          ],
        },
      };

      await bidRepo.update(bid.id, updateData);

      const updatedBid = await bidRepo.findOneOrFail({ where: { id: bid.id } });
      expect(updatedBid.metadata).toBeDefined();
      const history = updatedBid.metadata.history as BidHistory[];
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBe(1);
      expect(history[0]).toMatchObject({
        action: 'update',
        previousPercentage: 10,
        newPercentage: 8,
      });
    });
  });
});
