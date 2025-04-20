import { v4 as uuidv4 } from 'uuid';
// Import Prisma client and types
import prisma from './test-utils/prisma-client-setup';
import type { User, County, Property, Auction, Certificate, Bid } from '../../src/generated/prisma';

// Define statuses/types as strings matching Prisma schema
const BidType = {
  INTEREST_RATE: 'interest_rate',
  PREMIUM: 'premium'
};

describe('Bid Data Access (using Prisma)', () => {
  let testUser: User;
  let testCounty: County;
  let testProperty: Property;
  let testAuction: Auction;
  let testCertificate: Certificate;

  beforeEach(async () => {
    // Clean up in reverse dependency order
    await prisma.bid.deleteMany({});
    await prisma.certificate.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.auction.deleteMany({});
    await prisma.county.deleteMany({});
    await prisma.user.deleteMany({});

    // Create necessary dependencies for bid tests
    testUser = await prisma.user.create({
      data: {
        username: `testuser_${uuidv4().substring(0, 8)}`,
        email: `user_${uuidv4().substring(0, 8)}@test.com`,
        password: 'hashedpassword' // In real app, use bcrypt
      }
    });

    testCounty = await prisma.county.create({
      data: { name: `Test County ${uuidv4().substring(0, 8)}`, state: 'FL' }
    });

    testProperty = await prisma.property.create({
      data: {
        parcelId: `P-${uuidv4().substring(0, 8)}`,
        address: '456 Test Ave', city: 'Testville', state: 'FL', zipCode: '54321',
        countyId: testCounty.id
      }
    });

    testAuction = await prisma.auction.create({
      data: {
        auctionDate: new Date(),
        countyId: testCounty.id
      }
    });

    testCertificate = await prisma.certificate.create({
      data: {
        certificateNumber: `CERT-${uuidv4().substring(0, 8)}`,
        faceValue: 500.00,
        countyId: testCounty.id,
        propertyId: testProperty.id,
        auctionId: testAuction.id
      }
    });
  });

  it('should create a bid', async () => {
    const bidData = {
      bidAmount: 17.5, // Example interest rate
      bidType: BidType.INTEREST_RATE,
      isWinningBid: false,
      userId: testUser.id,
      auctionId: testAuction.id,
      certificateId: testCertificate.id,
    };

    const bid = await prisma.bid.create({ data: bidData });

    expect(bid).toBeDefined();
    expect(bid.id).toBeDefined();
    expect(bid.userId).toBe(testUser.id);
    expect(bid.certificateId).toBe(testCertificate.id);
    expect(bid.auctionId).toBe(testAuction.id);
    expect(bid.bidAmount).toBe(bidData.bidAmount);
    expect(bid.bidType).toBe(bidData.bidType);
    expect(bid.isWinningBid).toBe(false);
    expect(bid.bidTime).toBeInstanceOf(Date);
    expect(bid.createdAt).toBeInstanceOf(Date);
  });

  it('should find a bid by id', async () => {
    const bidData = { bidAmount: 15.0, bidType: BidType.INTEREST_RATE, userId: testUser.id, auctionId: testAuction.id, certificateId: testCertificate.id };
    const createdBid = await prisma.bid.create({ data: bidData });

    const foundBid = await prisma.bid.findUnique({ where: { id: createdBid.id } });

    expect(foundBid).toBeDefined();
    expect(foundBid!.id).toBe(createdBid.id);
    expect(foundBid!.bidAmount).toBe(bidData.bidAmount);
  });

  it('should update a bid (e.g., mark as winning)', async () => {
    const bidData = { bidAmount: 12.0, bidType: BidType.INTEREST_RATE, userId: testUser.id, auctionId: testAuction.id, certificateId: testCertificate.id, isWinningBid: false };
    const createdBid = await prisma.bid.create({ data: bidData });

    const updatedBid = await prisma.bid.update({
      where: { id: createdBid.id },
      data: { isWinningBid: true },
    });

    expect(updatedBid).toBeDefined();
    expect(updatedBid.id).toBe(createdBid.id);
    expect(updatedBid.isWinningBid).toBe(true);
  });

  it('should delete a bid', async () => {
    const bidData = { bidAmount: 8.0, bidType: BidType.INTEREST_RATE, userId: testUser.id, auctionId: testAuction.id, certificateId: testCertificate.id };
    const createdBid = await prisma.bid.create({ data: bidData });

    await prisma.bid.delete({ where: { id: createdBid.id } });

    const foundBid = await prisma.bid.findUnique({ where: { id: createdBid.id } });
    expect(foundBid).toBeNull();
  });

  it('should find bids by certificateId', async () => {
     // Create another certificate and bids for it
     const otherCert = await prisma.certificate.create({ data: { certificateNumber: `CERT2-${uuidv4()}`, faceValue: 600, countyId: testCounty.id, propertyId: testProperty.id, auctionId: testAuction.id }});
     await prisma.bid.create({ data: { bidAmount: 10.0, bidType: BidType.INTEREST_RATE, userId: testUser.id, auctionId: testAuction.id, certificateId: otherCert.id }});

     // Create bids for the main test certificate
     await prisma.bid.create({ data: { bidAmount: 11.0, bidType: BidType.INTEREST_RATE, userId: testUser.id, auctionId: testAuction.id, certificateId: testCertificate.id }});
     await prisma.bid.create({ data: { bidAmount: 10.5, bidType: BidType.INTEREST_RATE, userId: testUser.id, auctionId: testAuction.id, certificateId: testCertificate.id }});

    const bidsForCert = await prisma.bid.findMany({ where: { certificateId: testCertificate.id } });
    expect(bidsForCert.length).toBe(2);
    bidsForCert.forEach(b => expect(b.certificateId).toBe(testCertificate.id));

    const bidsForOtherCert = await prisma.bid.findMany({ where: { certificateId: otherCert.id } });
    expect(bidsForOtherCert.length).toBe(1);
  });

  // Add more tests for finding by userId, auctionId, filtering, sorting, relations etc.
});

afterAll(async () => {
  if (prisma && typeof prisma.$disconnect === 'function') {
    await prisma.$disconnect();
  }
});
