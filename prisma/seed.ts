import { PrismaClient } from "../src/generated/prisma";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  console.log("Cleaning existing data...");
  await prisma.bid.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.auction.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.county.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Creating test users...");
  // Generate a proper bcrypt hash that will work with comparePassword
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Generated password hash:", hashedPassword);

  // Create test users
  await prisma.user.create({
    data: {
      username: "bidder01",
      email: "bidder01@visualgov.com",
      password: hashedPassword,
      role: "INVESTOR",
      status: "ACTIVE",
      kycStatus: "Verified",
    },
  });

  await prisma.user.create({
    data: {
      username: "admin01",
      email: "admin01@visualgov.com",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
      kycStatus: "Verified",
    },
  });

  await prisma.user.create({
    data: {
      username: "county01",
      email: "county01@visualgov.com",
      password: hashedPassword,
      role: "COUNTY_OFFICIAL",
      status: "ACTIVE",
      kycStatus: "Verified",
    },
  });

  console.log("Creating counties...");
  // Create counties
  const counties = await Promise.all([
    prisma.county.create({
      data: {
        name: "Miami-Dade",
        state: "FL",
        countyCode: "MDC",
        websiteUrl: "https://www.miamidade.gov",
        taxCollectorUrl: "https://www.miamidade.gov/taxcollector",
        propertyAppraiserUrl: "https://www.miamidade.gov/pa",
        description: "The most populous county in Florida",
        latitude: 25.7617,
        longitude: -80.1918,
        primaryColor: "#0077B6",
        logoUrl: "https://www.miamidade.gov/resources/images/logo.png"
      },
    }),
    prisma.county.create({
      data: {
        name: "Broward",
        state: "FL",
        countyCode: "BRW",
        websiteUrl: "https://www.broward.org",
        taxCollectorUrl: "https://www.broward.org/taxcollector",
        propertyAppraiserUrl: "https://www.broward.org/pa",
        description: "The second most populous county in Florida",
        latitude: 26.1201,
        longitude: -80.1434,
        primaryColor: "#00B4D8",
        logoUrl: "https://www.broward.org/images/logo.png"
      },
    }),
    prisma.county.create({
      data: {
        name: "Palm Beach",
        state: "FL",
        countyCode: "PBC",
        websiteUrl: "https://www.pbcgov.org",
        taxCollectorUrl: "https://www.pbctax.com",
        propertyAppraiserUrl: "https://www.pbcgov.org/papa",
        description: "The third most populous county in Florida",
        latitude: 26.7056,
        longitude: -80.0364,
        primaryColor: "#90E0EF",
        logoUrl: "https://www.pbcgov.org/images/logo.png"
      },
    }),
  ]);

  console.log("Creating auctions...");
  // Create auctions
  const miamidadeCounty = counties[0];
  const browardCounty = counties[1];
  const palmBeachCounty = counties[2];

  // Create upcoming auctions
  await prisma.auction.create({
    data: {
      name: "Miami-Dade County Tax Certificate Auction",
      countyId: miamidadeCounty.id,
      auctionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      startTime: "10:00 AM",
      endTime: "4:00 PM",
      status: "UPCOMING", // Use the status value from the enum
      description: "Annual tax certificate auction for Miami-Dade County",
      location: "Online",
      registrationUrl: "https://www.miamidade.gov/taxauction/register",
    },
  });

  await prisma.auction.create({
    data: {
      name: "Broward County Tax Certificate Auction",
      countyId: browardCounty.id,
      auctionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      startTime: "9:00 AM",
      endTime: "5:00 PM",
      status: "UPCOMING", // Use the status value from the enum
      description: "Annual tax certificate auction for Broward County",
      location: "Online",
      registrationUrl: "https://www.broward.org/taxauction/register",
    },
  });

  // Create active auctions
  await prisma.auction.create({
    data: {
      name: "Palm Beach County Tax Certificate Auction",
      countyId: palmBeachCounty.id,
      auctionDate: new Date(), // Today
      startTime: "8:00 AM",
      endTime: "6:00 PM",
      status: "ACTIVE", // Use the status value from the enum
      description: "Annual tax certificate auction for Palm Beach County",
      location: "Online",
      registrationUrl: "https://www.pbcgov.org/taxauction/register",
    },
  });

  await prisma.auction.create({
    data: {
      name: "Miami-Dade County Special Tax Certificate Auction",
      countyId: miamidadeCounty.id,
      auctionDate: new Date(), // Today
      startTime: "11:00 AM",
      endTime: "3:00 PM",
      status: "ACTIVE", // Use the status value from the enum
      description: "Special tax certificate auction for Miami-Dade County",
      location: "Online",
      registrationUrl: "https://www.miamidade.gov/taxauction/special/register",
    },
  });

  // Create completed auctions
  await prisma.auction.create({
    data: {
      name: "Broward County Past Tax Certificate Auction",
      countyId: browardCounty.id,
      auctionDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      startTime: "9:00 AM",
      endTime: "5:00 PM",
      status: "COMPLETED", // Use the status value from the enum
      description: "Past tax certificate auction for Broward County",
      location: "Online",
      registrationUrl: "https://www.broward.org/taxauction/past/register",
    },
  });

  await prisma.auction.create({
    data: {
      name: "Palm Beach County Past Tax Certificate Auction",
      countyId: palmBeachCounty.id,
      auctionDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      startTime: "8:00 AM",
      endTime: "6:00 PM",
      status: "COMPLETED", // Use the status value from the enum
      description: "Past tax certificate auction for Palm Beach County",
      location: "Online",
      registrationUrl: "https://www.pbcgov.org/taxauction/past/register",
    },
  });

  // Create cancelled auctions
  await prisma.auction.create({
    data: {
      name: "Miami-Dade County Cancelled Tax Certificate Auction",
      countyId: miamidadeCounty.id,
      auctionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      startTime: "10:00 AM",
      endTime: "4:00 PM",
      status: "CANCELLED", // Use the status value from the enum
      description: "Cancelled tax certificate auction for Miami-Dade County",
      location: "Online",
      registrationUrl: "https://www.miamidade.gov/taxauction/cancelled/register",
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 