import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import testConfig from '../../config/test';

// Global test setup before all tests
export async function setupTestEnvironment() {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Create in-memory MongoDB server for tests
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri);
  
  // Return teardown function
  return async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  };
}

// Helper to clear all collections between tests
export async function clearDatabase() {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

// Helper to create test server instance
export function createTestServer() {
  // This would import your Express app without starting the server
  const { app } = require('../server');
  return app;
}

// Export test config for use in tests
export { testConfig }; 