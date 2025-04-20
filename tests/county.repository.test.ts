// import { cleanAllTables } from './test-utils/transaction';

import prisma from '../src/lib/prisma';
import setupTestDatabase from './prisma-test-setup';
import teardownTestDatabase from './prisma-test-teardown';
import { v4 as uuidv4 } from 'uuid';

describe('County Data Access (using Prisma)', () => {

  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    // Delete in order of dependency: Bid -> Certificate -> Auction -> Property -> County
    await prisma.bid.deleteMany({});
    await prisma.certificate.deleteMany({});
    await prisma.auction.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.county.deleteMany({});
  });

  afterAll(async () => {
    await teardownTestDatabase();
    await prisma.$disconnect();
  });

  it('should create a county', async () => {
    const countyData = {
      name: `Test County ${uuidv4().substring(0, 8)}`,
      state: 'FL',
    };

    const county = await prisma.county.create({ data: countyData });

    expect(county).toBeDefined();
    expect(county.id).toBeDefined();
    expect(county.name).toBe(countyData.name);
    expect(county.state).toBe(countyData.state);
    expect(county.createdAt).toBeInstanceOf(Date);
    expect(county.updatedAt).toBeInstanceOf(Date);
  });

  it('should find all counties', async () => {
    const county1Data = { name: `Test County 1-${uuidv4().substring(0, 8)}`, state: 'FL' };
    const county2Data = { name: `Test County 2-${uuidv4().substring(0, 8)}`, state: 'GA' };

    const county1 = await prisma.county.create({ data: county1Data });
    const county2 = await prisma.county.create({ data: county2Data });

    const counties = await prisma.county.findMany();

    expect(counties).toBeDefined();
    expect(counties.length).toBeGreaterThanOrEqual(2);
    expect(counties.find(c => c.id === county1.id)).toBeDefined();
    expect(counties.find(c => c.id === county2.id)).toBeDefined();
  });

  it('should find a county by id', async () => {
    const countyData = { name: `Find By ID County ${uuidv4().substring(0, 8)}`, state: 'TX' };

    const created = await prisma.county.create({ data: countyData });
    const found = await prisma.county.findUnique({ where: { id: created.id } });

    expect(found).toBeDefined();
    expect(found!.id).toBe(created.id);
    expect(found!.name).toBe(countyData.name);
  });

  it('should update a county', async () => {
    const countyData = { name: `Update County ${uuidv4().substring(0, 8)}`, state: 'CA' };
    const created = await prisma.county.create({ data: countyData });

    const updateData = {
      name: `Updated County Name ${uuidv4().substring(0, 8)}`,
      state: 'NV'
    };

    const updated = await prisma.county.update({
      where: { id: created.id },
      data: updateData,
    });

    expect(updated).toBeDefined();
    expect(updated.id).toBe(created.id);
    expect(updated.name).toBe(updateData.name);
    expect(updated.state).toBe(updateData.state);
    expect(updated.updatedAt).toBeInstanceOf(Date);
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(created.createdAt.getTime());
  });

  it('should delete a county', async () => {
    const countyData = { name: `Delete County ${uuidv4().substring(0, 8)}`, state: 'NY' };
    const created = await prisma.county.create({ data: countyData });

    await prisma.county.delete({ where: { id: created.id } });

    const found = await prisma.county.findUnique({ where: { id: created.id } });
    expect(found).toBeNull();
  });

  it('should return null when finding non-existent county', async () => {
    const nonExistentId = uuidv4();
    const found = await prisma.county.findUnique({ where: { id: nonExistentId } });
    expect(found).toBeNull();
  });

  it('should throw error when updating non-existent county', async () => {
    const nonExistentId = uuidv4();
    const updateData = { name: 'This should fail' };

    await expect(prisma.county.update({
      where: { id: nonExistentId },
      data: updateData,
    })).rejects.toThrow();
  });

  it('should throw error when deleting non-existent county', async () => {
    const nonExistentId = uuidv4();

    await expect(prisma.county.delete({
      where: { id: nonExistentId },
    })).rejects.toThrow();
  });
});
