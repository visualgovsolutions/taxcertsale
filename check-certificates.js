// check-certificates.js
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function checkCertificates() {
  try {
    // Get all auctions
    const auctions = await prisma.auction.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        _count: {
          select: {
            certificates: true
          }
        }
      }
    });
    
    console.log('Available auctions:');
    auctions.forEach(auction => {
      console.log(`Auction: ${auction.id} - ${auction.name} (${auction.status}) - Certificates: ${auction._count.certificates}`);
    });
    
    // Check if any certificates exist in the database
    const totalCertificates = await prisma.certificate.count();
    console.log(`\nTotal certificates in database: ${totalCertificates}`);
    
    if (totalCertificates > 0) {
      const sampleCertificates = await prisma.certificate.findMany({
        include: {
          property: true,
          auction: true,
          _count: {
            select: {
              bids: true
            }
          }
        },
        take: 5
      });
      
      console.log(`\nSample certificates:`);
      sampleCertificates.forEach(cert => {
        console.log(`\nCertificate: ${cert.id}`);
        console.log(`Certificate Number: ${cert.certificateNumber}`);
        console.log(`Face Value: ${cert.faceValue}`);
        console.log(`Status: ${cert.status}`);
        console.log(`Bid Count: ${cert._count.bids}`);
        console.log(`Property ID: ${cert.propertyId}`);
        console.log(`Auction ID: ${cert.auctionId}`);
        console.log(`Auction Name: ${cert.auction ? cert.auction.name : 'N/A'}`);
        console.log(`Property Address: ${cert.property ? `${cert.property.address}, ${cert.property.city}` : 'N/A'}`);
      });
    } else {
      console.log('No certificates found in the database.');
      
      // Let's create some sample data
      console.log('\nCreating sample certificate data...');
      
      // Get the first active auction or any auction if no active ones
      const activeAuction = await prisma.auction.findFirst({
        where: { status: 'ACTIVE' },
      });
      
      const targetAuction = activeAuction || (auctions.length > 0 ? auctions[0] : null);
      
      if (targetAuction) {
        // Create a property first
        const property = await prisma.property.create({
          data: {
            parcelId: 'SAMPLE-00001',
            address: '123 Sample Street',
            city: 'Sample City',
            state: 'FL',
            zipCode: '33133',
            countyId: targetAuction.countyId,
          }
        });
        
        // Create a certificate linked to the property and auction
        const certificate = await prisma.certificate.create({
          data: {
            certificateNumber: 'CERT-2023-00001',
            countyId: targetAuction.countyId,
            propertyId: property.id,
            auctionId: targetAuction.id,
            status: 'AUCTION_ACTIVE',
            faceValue: 5000.00,
            interestRate: 18.0,
          }
        });
        
        console.log(`Created certificate: ${certificate.id} for auction: ${targetAuction.id}`);
      } else {
        console.log('No auctions found to create sample certificates');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCertificates(); 