import { AppDataSource, initializeDatabase } from '../src/config/database';
import { auctionRepository } from '../src/repositories/auction.repository';
import { AuctionStatus } from '../src/models/entities/auction.entity';
import { Repository } from 'typeorm';
import { County } from '../src/models/entities/county.entity';
import { Auction } from '../src/models/entities/auction.entity';
import { v4 as uuidv4 } from 'uuid';

describe('AuctionRepository', () => {
  let county: County;
  let countyRepo: Repository<County>;
  let auctionRepo: Repository<Auction>;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await initializeDatabase();
    countyRepo = AppDataSource.getRepository(County);
    auctionRepo = AppDataSource.getRepository(Auction);
  });

  beforeEach(async () => {
    await auctionRepo.createQueryBuilder().delete().execute();
    await countyRepo.createQueryBuilder().delete().execute();
    
    const uniqueName = `Test County ${uuidv4().substring(0, 8)}`;
    county = countyRepo.create({ name: uniqueName, state: 'FL' });
    county = await countyRepo.save(county);
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await auctionRepo.createQueryBuilder().delete().execute();
      await countyRepo.createQueryBuilder().delete().execute();
      await AppDataSource.destroy();
    }
  });

  it('should create an auction with UPCOMING status', async () => {
    const auctionData = {
      name: 'Test Auction',
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
    expect(auction.status).toBe(AuctionStatus.UPCOMING);
    expect(auction.countyId).toBe(county.id);
  });

  it('should activate an auction (UPCOMING -> ACTIVE)', async () => {
    const auction = await auctionRepository.create({
      name: 'Activate Auction',
      auctionDate: new Date(),
      startTime: '10:00:00',
      endTime: '18:00:00',
      status: AuctionStatus.UPCOMING,
      countyId: county.id,
    });
    const activated = await auctionRepository.activateAuction(auction.id);
    expect(activated).toBeDefined();
    expect(activated!.status).toBe(AuctionStatus.ACTIVE);
  });

  it('should complete an auction (ACTIVE -> COMPLETED)', async () => {
    const auction = await auctionRepository.create({
      name: 'Complete Auction',
      auctionDate: new Date(),
      startTime: '11:00:00',
      endTime: '19:00:00',
      status: AuctionStatus.UPCOMING,
      countyId: county.id,
    });
    await auctionRepository.activateAuction(auction.id);
    const completed = await auctionRepository.completeAuction(auction.id);
    expect(completed).toBeDefined();
    expect(completed!.status).toBe(AuctionStatus.COMPLETED);
  });

  it('should not activate an auction that is not UPCOMING', async () => {
    const auction = await auctionRepository.create({
      name: 'Invalid Activate',
      auctionDate: new Date(),
      startTime: '12:00:00',
      endTime: '20:00:00',
      status: AuctionStatus.COMPLETED,
      countyId: county.id,
    });
    const result = await auctionRepository.activateAuction(auction.id);
    expect(result).toBeNull();
  });

  it('should cancel an auction (UPCOMING -> CANCELLED)', async () => {
    const auction = await auctionRepository.create({
      name: 'Cancel Auction',
      auctionDate: new Date(),
      startTime: '13:00:00',
      endTime: '21:00:00',
      status: AuctionStatus.UPCOMING,
      countyId: county.id,
    });
    const cancelled = await auctionRepository.cancelAuction(auction.id);
    expect(cancelled).toBeDefined();
    expect(cancelled!.status).toBe(AuctionStatus.CANCELLED);
  });

  it('should not complete an auction that is not ACTIVE', async () => {
    const auction = await auctionRepository.create({
      name: 'Invalid Complete',
      auctionDate: new Date(),
      startTime: '14:00:00',
      endTime: '22:00:00',
      status: AuctionStatus.UPCOMING,
      countyId: county.id,
    });
    const result = await auctionRepository.completeAuction(auction.id);
    expect(result).toBeNull();
  });

  it('should find auctions by county', async () => {
    // Create test auctions for this county
    await auctionRepository.create({
      name: 'County Auction 1',
      auctionDate: new Date(),
      startTime: '09:00:00',
      endTime: '17:00:00',
      status: AuctionStatus.UPCOMING,
      countyId: county.id,
    });
    
    await auctionRepository.create({
      name: 'County Auction 2',
      auctionDate: new Date(),
      startTime: '10:00:00',
      endTime: '18:00:00',
      status: AuctionStatus.ACTIVE,
      countyId: county.id,
    });
    
    const countyAuctions = await auctionRepository.findByCounty(county.id);
    
    expect(countyAuctions).toBeDefined();
    expect(countyAuctions.length).toBe(2);
    expect(countyAuctions[0].countyId).toBe(county.id);
    expect(countyAuctions[1].countyId).toBe(county.id);
  });

  it('should find upcoming auctions', async () => {
    // Create auctions with different statuses
    await auctionRepository.create({
      name: 'Upcoming Auction 1',
      auctionDate: new Date(Date.now() + 86400000), // tomorrow
      startTime: '09:00:00',
      endTime: '17:00:00',
      status: AuctionStatus.UPCOMING,
      countyId: county.id,
    });
    
    await auctionRepository.create({
      name: 'Active Auction',
      auctionDate: new Date(),
      startTime: '10:00:00',
      endTime: '18:00:00',
      status: AuctionStatus.ACTIVE,
      countyId: county.id,
    });
    
    const upcomingAuctions = await auctionRepository.findUpcoming();
    
    expect(upcomingAuctions).toBeDefined();
    expect(upcomingAuctions.length).toBeGreaterThanOrEqual(1);
    expect(upcomingAuctions[0].status).toBe(AuctionStatus.UPCOMING);
  });

  it('should not cancel an auction that is not UPCOMING', async () => {
    const auction = await auctionRepository.create({
      name: 'Invalid Cancel',
      auctionDate: new Date(),
      startTime: '15:00:00',
      endTime: '23:00:00',
      status: AuctionStatus.ACTIVE,
      countyId: county.id,
    });
    
    const result = await auctionRepository.cancelAuction(auction.id);
    expect(result).toBeNull();
  });

  it('should find an auction by id', async () => {
    const auction = await auctionRepository.create({
      name: 'Find By ID Auction',
      auctionDate: new Date(),
      startTime: '16:00:00',
      endTime: '00:00:00',
      status: AuctionStatus.UPCOMING,
      countyId: county.id,
    });
    
    const found = await auctionRepository.findById(auction.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(auction.id);
    expect(found!.name).toBe('Find By ID Auction');
  });

  it('should find active auctions', async () => {
    await auctionRepository.create({
      name: 'Active Auction 1',
      auctionDate: new Date(),
      startTime: '08:00:00',
      endTime: '16:00:00',
      status: AuctionStatus.ACTIVE,
      countyId: county.id,
    });
    
    const activeAuctions = await auctionRepository.findActive();
    
    expect(activeAuctions).toBeDefined();
    expect(activeAuctions.length).toBeGreaterThanOrEqual(1);
    expect(activeAuctions[0].status).toBe(AuctionStatus.ACTIVE);
  });

  it('should update an auction', async () => {
    const auction = await auctionRepository.create({
      name: 'Update Test Auction',
      auctionDate: new Date(),
      startTime: '09:00:00',
      endTime: '17:00:00',
      status: AuctionStatus.UPCOMING,
      countyId: county.id,
    });
    
    const updateData = {
      name: 'Updated Auction Name',
      description: 'Updated description',
      location: 'Updated location'
    };
    
    const updated = await auctionRepository.update(auction.id, updateData);
    
    expect(updated).toBeDefined();
    expect(updated!.id).toBe(auction.id);
    expect(updated!.name).toBe(updateData.name);
    expect(updated!.description).toBe(updateData.description);
    expect(updated!.location).toBe(updateData.location);
    expect(updated!.status).toBe(AuctionStatus.UPCOMING); // Status shouldn't change
  });
}); 