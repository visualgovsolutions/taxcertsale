import prisma from '../src/lib/prisma';
import setupTestDatabase from './prisma-test-setup'; // Use default import for setup
import teardownTestDatabase from './prisma-test-teardown'; // Use default import for teardown
// import { clearDatabase } from './prisma-test-setup'; // Removed - clearDatabase is not exported

describe('Property Data Access (using Prisma)', () => {

  beforeAll(async () => {
    // Run the default export function from prisma-test-setup
    await setupTestDatabase();
  });

  beforeEach(async () => {
    // Use the exported clearDatabase function
    // await clearDatabase();
    // Delete manually in correct order
    await prisma.certificate.deleteMany({}); // Depends on Property, Auction, County
    await prisma.property.deleteMany({});    // Depends on County
    // We don't need to delete auctions or bids here as Property doesn't depend on them
    await prisma.county.deleteMany({});      // Base entity for this test
  });

  afterAll(async () => {
    // Run the default export function from prisma-test-teardown
    await teardownTestDatabase();
    await prisma.$disconnect();
  });

  it('should perform basic CRUD operations on Property', async () => {
    // Create a county first as Property depends on it
    const county = await prisma.county.create({
      data: {
        name: 'Test County for Property',
        state: 'TP',
      },
    });

    const propertyData = {
      countyId: county.id,
      parcelId: 'PROP-123',
      address: '123 Test St',
      city: 'Testville',
      state: 'TP',
      zipCode: '12345', // Correct field name
      legalDescription: 'Lot 1 Block A',
    };

    // Create
    const createdProperty = await prisma.property.create({
      data: propertyData,
    });
    expect(createdProperty).toBeDefined();
    expect(createdProperty.parcelId).toBe(propertyData.parcelId);

    // Read
    const foundProperty = await prisma.property.findUnique({
      where: { id: createdProperty.id },
    });
    expect(foundProperty).toBeDefined();
    expect(foundProperty?.parcelId).toBe(propertyData.parcelId);
    expect(foundProperty?.zipCode).toBe(propertyData.zipCode);

    // Update
    const updatedAddress = '456 Updated Ave';
    const updatedProperty = await prisma.property.update({
      where: { id: createdProperty.id },
      data: { address: updatedAddress },
    });
    expect(updatedProperty).toBeDefined();
    expect(updatedProperty.address).toBe(updatedAddress);

    // Delete
    await prisma.property.delete({ where: { id: createdProperty.id } });
    const deletedProperty = await prisma.property.findUnique({
      where: { id: createdProperty.id },
    });
    expect(deletedProperty).toBeNull();
  });

  // Add more specific tests as needed...
}); 