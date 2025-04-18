import { AppDataSource, initializeDatabase } from '../src/config/database';
import { Repository } from 'typeorm';
import { Bid } from '../src/models/entities/bid.entity';
import { User } from '../src/models/entities/user.entity';
import { Auction } from '../src/models/entities/auction.entity';
import { Certificate } from '../src/models/entities/certificate.entity';
import { County } from '../src/models/entities/county.entity';
import { Property } from '../src/models/entities/property.entity';
import { bidRepository } from '../src/repositories/bid.repository';
import { v4 as uuidv4 } from 'uuid';

describe('BidRepository', () => {
  let bidRepo: Repository<Bid>;
  let userRepo: Repository<User>;
  let auctionRepo: Repository<Auction>;
  let certificateRepo: Repository<Certificate>;
  let countyRepo: Repository<County>;
  let propertyRepo: Repository<Property>;
  
  // Test entities
  let user: User;
  let auction: Auction;
  let certificate: Certificate;
  let county: County;
  let property: Property;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await initializeDatabase();
    
    // Get repositories
    bidRepo = AppDataSource.getRepository(Bid);
    userRepo = AppDataSource.getRepository(User);
    auctionRepo = AppDataSource.getRepository(Auction);
    certificateRepo = AppDataSource.getRepository(Certificate);
    countyRepo = AppDataSource.getRepository(County);
    propertyRepo = AppDataSource.getRepository(Property);
  });

  beforeEach(async () => {
    // Clean up existing data in the correct order (respecting foreign keys)
    await bidRepo.createQueryBuilder().delete().execute();
    await certificateRepo.createQueryBuilder().delete().execute();
    await auctionRepo.createQueryBuilder().delete().execute();
    await propertyRepo.createQueryBuilder().delete().execute();
    await userRepo.createQueryBuilder().delete().execute();
    await countyRepo.createQueryBuilder().delete().execute();
    
    // Create prerequisite county
    county = await countyRepo.save(
      countyRepo.create({
        name: `Test County ${uuidv4().substring(0, 8)}`,
        state: 'FL'
      })
    );
    
    // Create prerequisite property
    property = await propertyRepo.save(
      propertyRepo.create({
        parcelId: `P-${uuidv4().substring(0, 8)}`,
        address: '123 Test St',
        city: 'Test City',
        state: 'FL',
        zipCode: '12345',
        countyId: county.id
      })
    );
    
    // Create prerequisite user
    user = await userRepo.save(
      userRepo.create({
        email: `test.user.${uuidv4().substring(0, 8)}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        passwordHash: 'hashedpassword123',
        role: 'investor',
        status: 'active'
      })
    );
    
    // Create prerequisite auction
    auction = await auctionRepo.save(
      auctionRepo.create({
        name: `Test Auction ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(),
        startTime: '09:00:00',
        endTime: '17:00:00',
        status: 'active',
        countyId: county.id
      })
    );
    
    // Create prerequisite certificate
    certificate = await certificateRepo.save(
      certificateRepo.create({
        certificateNumber: `CERT-${uuidv4().substring(0, 8)}`,
        faceValue: 1500.50,
        interestRate: 18.0,
        issueDate: new Date(),
        status: 'available',
        countyId: county.id,
        propertyId: property.id,
        auctionId: auction.id
      })
    );
  });

  afterAll(async () => {
    // Final cleanup
    if (AppDataSource.isInitialized) {
      await bidRepo.createQueryBuilder().delete().execute();
      await certificateRepo.createQueryBuilder().delete().execute();
      await auctionRepo.createQueryBuilder().delete().execute();
      await propertyRepo.createQueryBuilder().delete().execute();
      await userRepo.createQueryBuilder().delete().execute();
      await countyRepo.createQueryBuilder().delete().execute();
      await AppDataSource.destroy();
    }
  });
  
  it('should create a bid', async () => {
    const bidData = {
      interestRate: 16.0,
      amount: 1500.50,
      status: 'pending',
      userId: user.id,
      auctionId: auction.id,
      certificateId: certificate.id
    };
    
    const bid = await bidRepository.create(bidData);
    
    expect(bid).toBeDefined();
    expect(bid.id).toBeDefined();
    expect(bid.interestRate).toBe(bidData.interestRate);
    expect(bid.amount).toBe(bidData.amount);
    expect(bid.userId).toBe(user.id);
    expect(bid.auctionId).toBe(auction.id);
    expect(bid.certificateId).toBe(certificate.id);
  });
  
  it('should find all bids', async () => {
    // Create test bids
    const bid1 = await bidRepository.create({
      interestRate: 16.0,
      amount: 1500.50,
      status: 'pending',
      userId: user.id,
      auctionId: auction.id,
      certificateId: certificate.id
    });
    
    const bid2 = await bidRepository.create({
      interestRate: 15.0,
      amount: 1500.50,
      status: 'pending',
      userId: user.id,
      auctionId: auction.id,
      certificateId: certificate.id
    });
    
    const bids = await bidRepository.findAll();
    
    expect(bids).toBeDefined();
    expect(bids.length).toBeGreaterThanOrEqual(2);
    expect(bids.find(b => b.id === bid1.id)).toBeDefined();
    expect(bids.find(b => b.id === bid2.id)).toBeDefined();
  });
  
  it('should find a bid by id', async () => {
    const bidData = {
      interestRate: 16.0,
      amount: 1500.50,
      status: 'pending',
      userId: user.id,
      auctionId: auction.id,
      certificateId: certificate.id
    };
    
    const created = await bidRepository.create(bidData);
    const found = await bidRepository.findById(created.id);
    
    expect(found).toBeDefined();
    expect(found!.id).toBe(created.id);
    expect(found!.interestRate).toBe(bidData.interestRate);
  });
  
  it('should find bids by user', async () => {
    const bid = await bidRepository.create({
      interestRate: 16.0,
      amount: 1500.50,
      status: 'pending',
      userId: user.id,
      auctionId: auction.id,
      certificateId: certificate.id
    });
    
    const bids = await bidRepository.findByUser(user.id);
    
    expect(bids).toBeDefined();
    expect(bids.length).toBeGreaterThanOrEqual(1);
    expect(bids.find(b => b.id === bid.id)).toBeDefined();
  });
  
  it('should find bids by auction', async () => {
    const bid = await bidRepository.create({
      interestRate: 16.0,
      amount: 1500.50,
      status: 'pending',
      userId: user.id,
      auctionId: auction.id,
      certificateId: certificate.id
    });
    
    const bids = await bidRepository.findByAuction(auction.id);
    
    expect(bids).toBeDefined();
    expect(bids.length).toBeGreaterThanOrEqual(1);
    expect(bids.find(b => b.id === bid.id)).toBeDefined();
  });
  
  it('should find bids by certificate', async () => {
    const bid = await bidRepository.create({
      interestRate: 16.0,
      amount: 1500.50,
      status: 'pending',
      userId: user.id,
      auctionId: auction.id,
      certificateId: certificate.id
    });
    
    const bids = await bidRepository.findByCertificate(certificate.id);
    
    expect(bids).toBeDefined();
    expect(bids.length).toBeGreaterThanOrEqual(1);
    expect(bids.find(b => b.id === bid.id)).toBeDefined();
  });
  
  it('should update a bid', async () => {
    const bidData = {
      interestRate: 16.0,
      amount: 1500.50,
      status: 'pending',
      userId: user.id,
      auctionId: auction.id,
      certificateId: certificate.id
    };
    
    const created = await bidRepository.create(bidData);
    
    const updateData = {
      interestRate: 15.0,
      status: 'accepted'
    };
    
    const updated = await bidRepository.update(created.id, updateData);
    
    expect(updated).toBeDefined();
    expect(updated!.id).toBe(created.id);
    expect(updated!.interestRate).toBe(updateData.interestRate);
    expect(updated!.status).toBe(updateData.status);
    expect(updated!.amount).toBe(bidData.amount); // Shouldn't change
  });
  
  it('should delete a bid', async () => {
    const bidData = {
      interestRate: 16.0,
      amount: 1500.50,
      status: 'pending',
      userId: user.id,
      auctionId: auction.id,
      certificateId: certificate.id
    };
    
    const created = await bidRepository.create(bidData);
    const deleteResult = await bidRepository.delete(created.id);
    
    expect(deleteResult).toBe(true);
    
    const found = await bidRepository.findById(created.id);
    expect(found).toBeNull();
  });
  
  it('should find lowest bid by certificate', async () => {
    // Create multiple bids with different interest rates
    await bidRepository.create({
      interestRate: 15.0,
      amount: 1500.50,
      status: 'pending',
      userId: user.id,
      auctionId: auction.id,
      certificateId: certificate.id
    });
    
    await bidRepository.create({
      interestRate: 10.0, // This should be the lowest
      amount: 1500.50,
      status: 'pending',
      userId: user.id,
      auctionId: auction.id,
      certificateId: certificate.id
    });
    
    await bidRepository.create({
      interestRate: 12.0,
      amount: 1500.50,
      status: 'pending',
      userId: user.id,
      auctionId: auction.id,
      certificateId: certificate.id
    });
    
    const lowestBid = await bidRepository.findLowestBidByCertificate(certificate.id);
    
    expect(lowestBid).toBeDefined();
    expect(lowestBid!.interestRate).toBe(10.0);
  });
}); 