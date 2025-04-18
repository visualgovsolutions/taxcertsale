import { AppDataSource, initializeDatabase } from '../src/config/database';
import { Repository } from 'typeorm';
import { County } from '../src/models/entities/county.entity';
import { countyRepository } from '../src/repositories/county.repository';
import { Property } from '../src/models/entities/property.entity';
import { v4 as uuidv4 } from 'uuid';
import { Auction } from '../src/models/entities/auction.entity';
import { Certificate } from '../src/models/entities/certificate.entity';
import { Bid } from '../src/models/entities/bid.entity';

describe('CountyRepository', () => {
  let countyRepo: Repository<County>;
  let propertyRepo: Repository<Property>;
  let auctionRepo: Repository<Auction>;
  let certificateRepo: Repository<Certificate>;
  let bidRepo: Repository<Bid>;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await initializeDatabase();
    countyRepo = AppDataSource.getRepository(County);
    propertyRepo = AppDataSource.getRepository(Property);
    auctionRepo = AppDataSource.getRepository(Auction);
    certificateRepo = AppDataSource.getRepository(Certificate);
    bidRepo = AppDataSource.getRepository(Bid);
  });

  beforeEach(async () => {
    // Clean properties first, then counties
    await propertyRepo.createQueryBuilder().delete().execute();
    await countyRepo.createQueryBuilder().delete().execute();
  });

  afterAll(async () => {
    // Final cleanup: properties first, then counties
    if (AppDataSource.isInitialized) {
      await propertyRepo.createQueryBuilder().delete().execute();
      await countyRepo.createQueryBuilder().delete().execute();
      await AppDataSource.destroy();
    }
  });

  it('should create a county', async () => {
    const countyData = {
      name: `Test County ${uuidv4().substring(0, 8)}`,
      state: 'FL',
      description: 'A test county',
      websiteUrl: 'https://example.com',
      countyCode: '001',
      latitude: 25.7617,
      longitude: -80.1918,
    };

    const county = await countyRepository.create(countyData);

    expect(county).toBeDefined();
    expect(county.id).toBeDefined();
    expect(county.name).toBe(countyData.name);
    expect(county.state).toBe(countyData.state);
  });

  it('should find all counties', async () => {
    // Create test counties
    const county1 = await countyRepository.create({
      name: `Test County 1-${uuidv4().substring(0, 8)}`,
      state: 'FL',
    });

    const county2 = await countyRepository.create({
      name: `Test County 2-${uuidv4().substring(0, 8)}`,
      state: 'GA',
    });

    const counties = await countyRepository.findAll();

    expect(counties).toBeDefined();
    expect(counties.length).toBeGreaterThanOrEqual(2);
    expect(counties.find(c => c.id === county1.id)).toBeDefined();
    expect(counties.find(c => c.id === county2.id)).toBeDefined();
  });

  it('should find a county by id', async () => {
    const countyData = {
      name: `Find By ID County ${uuidv4().substring(0, 8)}`,
      state: 'TX',
    };

    const created = await countyRepository.create(countyData);
    const found = await countyRepository.findById(created.id);

    expect(found).toBeDefined();
    expect(found!.id).toBe(created.id);
    expect(found!.name).toBe(countyData.name);
  });

  it('should update a county', async () => {
    const countyData = {
      name: `Update County ${uuidv4().substring(0, 8)}`,
      state: 'CA',
    };

    const created = await countyRepository.create(countyData);

    const updateData = {
      description: 'Updated description',
      websiteUrl: 'https://updated.example.com',
    };

    const updated = await countyRepository.update(created.id, updateData);

    expect(updated).toBeDefined();
    expect(updated!.id).toBe(created.id);
    expect(updated!.name).toBe(countyData.name); // Name shouldn't change
    expect(updated!.description).toBe(updateData.description);
    expect(updated!.websiteUrl).toBe(updateData.websiteUrl);
  });

  it('should delete a county', async () => {
    const countyData = {
      name: `Delete County ${uuidv4().substring(0, 8)}`,
      state: 'NY',
    };

    const created = await countyRepository.create(countyData);
    const deleteResult = await countyRepository.delete(created.id);

    expect(deleteResult).toBe(true);

    const found = await countyRepository.findById(created.id);
    expect(found).toBeNull();
  });

  it('should return null when updating non-existent county', async () => {
    const nonExistentId = uuidv4();
    const updateData = { description: 'This county does not exist' };

    const result = await countyRepository.update(nonExistentId, updateData);

    expect(result).toBeNull();
  });

  it('should return false when deleting non-existent county', async () => {
    const nonExistentId = uuidv4();
    const result = await countyRepository.delete(nonExistentId);

    expect(result).toBe(false);
  });
});
