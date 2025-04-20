import { PrismaClient } from '../../src/generated/prisma';

// Instantiate Prisma Client with the TEST_DATABASE_URL
// This URL is set by the global setup script (prisma-test-setup.ts)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL, // Use the specific test database URL
    },
  },
});

// Optional: Add a global beforeAll/afterAll within this setup file
// if you need to connect/disconnect the client explicitly for each test file,
// though typically Prisma Client manages connections implicitly.
/*
beforeAll(async () => {
  // Optional: Explicitly connect if needed, though usually not required
  // await prisma.$connect();
});

afterAll(async () => {
  // Disconnect the client after all tests in a file are done
  await prisma.$disconnect();
});
*/

// Export the configured Prisma client instance for tests to import
export default prisma; 