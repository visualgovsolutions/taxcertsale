import { v4 as uuidv4 } from 'uuid';
// Import the Prisma client instance configured for tests
import prisma from './test-utils/prisma-client-setup';
// Import generated types if needed
// import { County, Property, Auction, Certificate } from '@prisma/client';

// Define expected statuses (can use strings directly as defined in Prisma schema)
const CertificateStatus = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  REDEEMED: 'redeemed'
};

const AuctionStatus = {
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  CLOSED: 'closed',
  CANCELLED: 'cancelled'
};

describe('Certificate Data Access (using Prisma)', () => {

  // No beforeAll/afterAll needed - handled by global setup/teardown

  beforeEach(async () => {
    // Clean up data in reverse order of dependency
    // Note: onDelete: Cascade in Prisma schema might handle some of this automatically,
    // but explicit deletion ensures a clean slate, especially for testing edge cases.
    await prisma.bid.deleteMany({}); // Assuming bids depend on certificates/auctions/users
    await prisma.certificate.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.auction.deleteMany({});
    await prisma.county.deleteMany({});
    await prisma.user.deleteMany({}); // Assuming users exist and might be related via buyerId
  });

  it('should perform basic CRUD operations using Prisma Client', async () => {
    const testPrefix = uuidv4().substring(0, 8);

    // 1. Create dependencies
    const county = await prisma.county.create({
      data: {
        name: `Test County ${testPrefix}`,
        state: 'FL'
      }
    });

    const property = await prisma.property.create({
      data: {
        parcelId: `P-${testPrefix}`,
        address: '123 Test St',
        city: 'Test City',
        state: 'FL',
        zipCode: '12345',
        countyId: county.id
      }
    });

    const auction = await prisma.auction.create({
      data: {
        auctionDate: new Date(),
        status: AuctionStatus.ACTIVE,
        countyId: county.id
        // Removed name, startTime, endTime as they are not in the current Prisma schema
      }
    });

    // 2. Create a certificate
    const certificateData = {
      certificateNumber: `CERT-${testPrefix}`,
      faceValue: 1500.50,
      interestRate: 18.0,
      status: CertificateStatus.AVAILABLE,
      countyId: county.id,
      propertyId: property.id,
      auctionId: auction.id,
    };

    const createdCert = await prisma.certificate.create({ data: certificateData });

    expect(createdCert).toBeDefined();
    expect(createdCert.id).toBeDefined();
    expect(createdCert.certificateNumber).toBe(certificateData.certificateNumber);
    expect(createdCert.faceValue).toBe(certificateData.faceValue);
    expect(createdCert.status).toBe(CertificateStatus.AVAILABLE);

    // 3. Find the certificate
    const foundCert = await prisma.certificate.findUnique({
      where: { id: createdCert.id }
    });
    expect(foundCert).toBeDefined();
    expect(foundCert!.certificateNumber).toBe(certificateData.certificateNumber);

    // 4. Update the certificate
    const updatedCert = await prisma.certificate.update({
      where: { id: createdCert.id },
      data: {
        faceValue: 2000.0,
        status: CertificateStatus.SOLD,
      }
    });

    expect(updatedCert).toBeDefined();
    expect(updatedCert.faceValue).toBe(2000.0);
    expect(updatedCert.status).toBe(CertificateStatus.SOLD);

    // 5. Delete the certificate
    await prisma.certificate.delete({ where: { id: createdCert.id } });

    // 6. Verify deletion
    const deletedCert = await prisma.certificate.findUnique({
      where: { id: createdCert.id }
    });
    expect(deletedCert).toBeNull();

  });

  // Add more tests as needed for finding by different criteria, relations, etc.

});

afterAll(async () => {
  if (prisma && typeof prisma.$disconnect === 'function') {
    await prisma.$disconnect();
  }
});
