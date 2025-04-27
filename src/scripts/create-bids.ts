import prisma from '../lib/prisma';

async function main() {
  console.log('Creating test bids...');
  
  // Find the bidder user
  const bidder = await prisma.user.findUnique({ 
    where: { email: 'bidder01@visualgov.com' } 
  });
  
  if (!bidder) {
    console.error('Bidder user not found. Please run the seed script first.');
    return;
  }
  
  // Get active auction
  const activeAuction = await prisma.auction.findFirst({
    where: { status: 'ACTIVE' },
  });
  
  if (!activeAuction) {
    console.error('No active auction found. Please run the seed script first.');
    return;
  }
  
  // Get certificates in the active auction
  const certificates = await prisma.certificate.findMany({
    where: { 
      auctionId: activeAuction.id,
      status: 'available' // Lowercase as in the DB
    },
    take: 5 // Get 5 certificates to bid on
  });
  
  if (certificates.length === 0) {
    console.error('No certificates found in the active auction. Please run the seed script first.');
    return;
  }
  
  console.log(`Found ${certificates.length} certificates to create bids for.`);
  
  // Create bids with different statuses
  const bidStatuses = ['ACTIVE', 'WINNING', 'OUTBID'];
  
  for (let i = 0; i < certificates.length; i++) {
    const certificate = certificates[i];
    const bidStatus = bidStatuses[i % bidStatuses.length];
    const now = new Date();
    
    // Create bidTime between 1 and 24 hours ago
    const bidTime = new Date(now.getTime() - Math.floor(Math.random() * 24) * 3600000);
    
    // Base bid is 1% to 5% of face value
    const bidAmount = Math.floor(certificate.faceValue * (1 + (Math.random() * 4 + 1) / 100));
    
    // Check if bid already exists
    const existingBid = await prisma.bid.findFirst({
      where: { 
        userId: bidder.id,
        certificateId: certificate.id
      }
    });
    
    if (existingBid) {
      console.log(`Bid already exists for certificate ${certificate.id}, updating...`);
      
      await prisma.bid.update({
        where: { id: existingBid.id },
        data: {
          bidAmount,
          bidTime,
          isWinningBid: bidStatus === 'WINNING',
        }
      });
    } else {
      console.log(`Creating bid for certificate ${certificate.id}`);
      
      await prisma.bid.create({
        data: {
          bidAmount,
          bidTime,
          bidType: 'interest_rate',
          isWinningBid: bidStatus === 'WINNING',
          userId: bidder.id,
          certificateId: certificate.id,
          auctionId: activeAuction.id,
        }
      });
    }
  }
  
  console.log('Created test bids successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 