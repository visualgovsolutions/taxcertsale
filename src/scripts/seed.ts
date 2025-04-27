import prisma from '../lib/prisma';
import { hashPassword } from '../backend/utils/passwordUtils';

async function main() {
  // Seed users
  const users = [
    { email: 'admin@visualgov.com', username: 'admin', role: 'ADMIN', password: 'AdminPass1!' },
    { email: 'bidder01@visualgov.com', username: 'bidder01', role: 'INVESTOR', password: 'BidderPass1!' },
    { email: 'county@visualgov.com', username: 'county', role: 'COUNTY_OFFICIAL', password: 'CountyPass1!' },
  ];

  for (const u of users) {
    const hashed = await hashPassword(u.password);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        username: u.username,
        role: u.role as any,
        password: hashed,
      },
    });
    console.log(`Seeded user ${u.email}`);
  }

  // Seed counties
  const counties = [
    { name: 'Orange County', state: 'FL' },
    { name: 'Miami-Dade County', state: 'FL' },
    { name: 'Palm Beach County', state: 'FL' },
    { name: 'Wakulla County', state: 'FL' }
  ];

  const createdCounties = [];
  for (const county of counties) {
    const createdCounty = await prisma.county.upsert({
      where: { name: county.name },
      update: {},
      create: {
        name: county.name,
        state: county.state,
      },
    });
    createdCounties.push(createdCounty);
    console.log(`Seeded county ${county.name}`);
  }

  // Seed auctions
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const nextMonth = new Date(today);
  nextMonth.setDate(nextMonth.getDate() + 30);

  const auctions = [
    {
      name: 'Orange County Tax Certificate Auction',
      auctionDate: today.toISOString(),
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0, 0).toISOString(),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0, 0, 0).toISOString(),
      status: 'ACTIVE',
      countyId: createdCounties[0].id,
      adUrl: 'https://example.com/orange-county-auction',
      description: 'Annual tax certificate auction for Orange County properties',
      location: 'Online',
      registrationUrl: 'https://register.orangecounty-auction.com'
    },
    {
      name: 'Miami-Dade County Tax Certificate Auction',
      auctionDate: nextWeek.toISOString(),
      startTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 10, 0, 0, 0).toISOString(),
      endTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 18, 0, 0, 0).toISOString(),
      status: 'SCHEDULED',
      countyId: createdCounties[1].id,
      adUrl: 'https://example.com/miami-dade-auction',
      description: 'Annual tax certificate auction for Miami-Dade County properties',
      location: 'Online',
      registrationUrl: 'https://register.miamidade-auction.com'
    },
    {
      name: 'Palm Beach County Tax Certificate Auction',
      auctionDate: nextMonth.toISOString(),
      startTime: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextMonth.getDate(), 8, 30, 0, 0).toISOString(),
      endTime: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextMonth.getDate(), 16, 30, 0, 0).toISOString(),
      status: 'SCHEDULED',
      countyId: createdCounties[2].id,
      adUrl: 'https://example.com/palm-beach-auction',
      description: 'Annual tax certificate auction for Palm Beach County properties',
      location: 'Online',
      registrationUrl: 'https://register.palmbeach-auction.com'
    },
    {
      name: 'Wakulla County Tax Certificate Auction',
      auctionDate: today.toISOString(),
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0, 0).toISOString(),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 17, 0, 0, 0).toISOString(),
      status: 'ACTIVE',
      countyId: createdCounties[3].id,
      adUrl: 'https://example.com/wakulla-county-auction',
      description: 'Annual tax certificate auction for Wakulla County properties with special coastal properties',
      location: 'Online + Wakulla County Administration Building',
      registrationUrl: 'https://register.wakulla-auction.com'
    }
  ];

  const createdAuctions = [];
  for (const auction of auctions) {
    // For upsert, we need to use a unique identifier
    // Since there's no compound unique constraint in the schema,
    // let's create a unique auction for each county
    const existingAuction = await prisma.auction.findFirst({
      where: { countyId: auction.countyId }
    });

    let createdAuction;
    if (existingAuction) {
      createdAuction = await prisma.auction.update({
        where: { id: existingAuction.id },
        data: {
          name: auction.name,
          status: auction.status,
          auctionDate: auction.auctionDate,
          startTime: auction.startTime,
          endTime: auction.endTime,
          adUrl: auction.adUrl,
          description: auction.description,
          location: auction.location,
          registrationUrl: auction.registrationUrl
        },
      });
    } else {
      createdAuction = await prisma.auction.create({
        data: {
          name: auction.name,
          auctionDate: auction.auctionDate,
          startTime: auction.startTime,
          endTime: auction.endTime,
          status: auction.status,
          adUrl: auction.adUrl,
          countyId: auction.countyId,
          description: auction.description,
          location: auction.location,
          registrationUrl: auction.registrationUrl
        },
      });
    }
    
    createdAuctions.push(createdAuction);
    console.log(`Seeded auction for county ID ${auction.countyId}`);
  }

  // Seed properties first
  const properties = [];
  
  // Create 30 properties (10 for each county)
  for (let i = 0; i < createdCounties.length; i++) {
    const county = createdCounties[i];
    
    for (let j = 1; j <= 10; j++) {
      const parcelId = `PAR-${String(i + 1).padStart(2, '0')}-${String(j).padStart(4, '0')}`;
      
      // Check if property exists
      const existingProperty = await prisma.property.findUnique({
        where: { parcelId }
      });
      
      let property;
      if (existingProperty) {
        property = await prisma.property.update({
          where: { id: existingProperty.id },
          data: {
            address: `${100 + j} Main St`,
            city: county.name.replace(' County', ''),
            state: county.state,
            zipCode: `3${i}${j}00`,
            countyId: county.id,
          }
        });
      } else {
        property = await prisma.property.create({
          data: {
            parcelId,
            address: `${100 + j} Main St`,
            city: county.name.replace(' County', ''),
            state: county.state,
            zipCode: `3${i}${j}00`,
            countyId: county.id,
          }
        });
      }
      
      properties.push(property);
      console.log(`Seeded property ${property.parcelId}`);
    }
  }

  // Seed certificates
  // Create certificates for each auction using the properties we created
  let certificateIdx = 0;
  for (let i = 0; i < createdAuctions.length; i++) {
    const auction = createdAuctions[i];
    const county = createdCounties[i];
    
    for (let j = 1; j <= 10; j++) {
      const property = properties[certificateIdx];
      certificateIdx = (certificateIdx + 1) % properties.length;
      
      const certificateNumber = `${county.name.substring(0, 3).toUpperCase()}-2023-${String(j).padStart(4, '0')}`;
      
      // Check if certificate exists
      const existingCertificate = await prisma.certificate.findFirst({
        where: { certificateNumber }
      });
      
      if (existingCertificate) {
        await prisma.certificate.update({
          where: { id: existingCertificate.id },
          data: {
            faceValue: 5000 + (j * 1000),
            interestRate: 5 + (j % 10),
            status: auction.status === 'ACTIVE' ? 'available' : 'available',
            auctionId: auction.id,
            countyId: county.id,
            propertyId: property.id,
          }
        });
      } else {
        await prisma.certificate.create({
          data: {
            certificateNumber,
            faceValue: 5000 + (j * 1000),
            interestRate: 5 + (j % 10),
            status: auction.status === 'ACTIVE' ? 'available' : 'available',
            auctionId: auction.id,
            countyId: county.id,
            propertyId: property.id,
          }
        });
      }
      
      console.log(`Seeded certificate ${j} for auction ${i+1}`);
    }
  }

  // Create certificates for Bidder01
  const bidder = await prisma.user.findUnique({ where: { email: 'bidder01@visualgov.com' } });
  
  if (bidder) {
    // Create 5 owned certificates for the bidder (some active, some redeemed)
    for (let i = 1; i <= 5; i++) {
      const county = createdCounties[i % createdCounties.length];
      const property = properties[i % properties.length];
      const purchaseDate = new Date();
      purchaseDate.setMonth(purchaseDate.getMonth() - i);
      
      const certificateNumber = `${county.name.substring(0, 3).toUpperCase()}-2023-OWN-${i}`;
      
      // Check if certificate exists
      const existingCertificate = await prisma.certificate.findFirst({
        where: { certificateNumber }
      });
      
      let certificate;
      if (existingCertificate) {
        certificate = await prisma.certificate.update({
          where: { id: existingCertificate.id },
          data: {
            propertyId: property.id,
            faceValue: 8000 + (i * 1200),
            interestRate: 8 + (i % 5),
            status: i % 3 === 0 ? 'redeemed' : i % 2 === 0 ? 'available' : 'available',
            countyId: county.id,
            buyerId: bidder.id,
            purchaseDate: purchaseDate.toISOString(),
            auctionId: createdAuctions[i % createdAuctions.length].id,
          }
        });
      } else {
        certificate = await prisma.certificate.create({
          data: {
            certificateNumber,
            propertyId: property.id,
            faceValue: 8000 + (i * 1200),
            interestRate: 8 + (i % 5),
            status: i % 3 === 0 ? 'redeemed' : i % 2 === 0 ? 'available' : 'available',
            countyId: county.id,
            buyerId: bidder.id,
            purchaseDate: purchaseDate.toISOString(),
            auctionId: createdAuctions[i % createdAuctions.length].id,
          }
        });
      }
      console.log(`Seeded owned certificate ${i} for bidder01`);
      
      // Add bids for some of these certificates
      if (i < 3) {
        // Check if bid exists
        const existingBid = await prisma.bid.findFirst({
          where: { 
            userId: bidder.id,
            certificateId: certificate.id
          }
        });
        
        if (!existingBid) {
          await prisma.bid.create({
            data: {
              bidAmount: certificate.faceValue * (1 + (i % 10) / 100),
              bidTime: new Date(purchaseDate.getTime() - 86400000).toISOString(),
              bidType: 'interest_rate',
              isWinningBid: true,
              userId: bidder.id,
              certificateId: certificate.id,
              auctionId: certificate.auctionId,
            }
          });
          console.log(`Seeded bid for certificate ${certificate.certificateNumber}`);
        } else {
          console.log(`Bid already exists for certificate ${certificate.certificateNumber}`);
        }
      }
    }
  }
}

main().then(() => {
  console.log('Seed complete');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
}); 