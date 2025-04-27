const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function addMoreCertificates() {
  try {
    // Target a specific auction - the one we already created a certificate for
    const auctionId = '89739a71-cdfe-4532-ae05-1b375677e20a';
    
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: { county: true }
    });
    
    if (!auction) {
      console.log(`Auction with ID ${auctionId} not found`);
      return;
    }
    
    console.log(`Adding certificates to auction: ${auction.name} (${auction.id})`);
    
    // Create 10 more certificates
    for (let i = 1; i <= 10; i++) {
      // Create a property first
      const property = await prisma.property.create({
        data: {
          parcelId: `SAMPLE-0000${i + 1}`,
          address: `${100 + i} Sample Street`,
          city: 'Sample City',
          state: 'FL',
          zipCode: '33133',
          countyId: auction.countyId,
        }
      });
      
      // Create a certificate linked to the property and auction
      const certificate = await prisma.certificate.create({
        data: {
          certificateNumber: `CERT-2023-0000${i + 1}`,
          countyId: auction.countyId,
          propertyId: property.id,
          auctionId: auction.id,
          status: 'AUCTION_ACTIVE',
          faceValue: 5000.00 + (i * 1000),
          interestRate: 18.0,
        }
      });
      
      console.log(`Created certificate: ${certificate.id}`);
    }
    
    console.log('\nDone creating certificates.');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreCertificates(); 