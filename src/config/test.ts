import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Test configuration
export const config = {
  server: {
    port: 3001, // Different port for test environment
    apiPrefix: '/api'
  },
  database: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5432', 10),
    user: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'postgres',
    database: process.env.TEST_DB_NAME || 'test',
    poolSize: parseInt(process.env.TEST_DB_POOL_SIZE || '5', 10),
  },
  jwt: {
    secret: 'test-secret-key',
    expiresIn: '1h'
  },
  auction: {
    minBidIncrement: 100,
    timeout: 5 // minutes
  }
}; 