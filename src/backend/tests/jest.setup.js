// Set testing timeout to 30s for all tests (database operations might take longer)
jest.setTimeout(30000);

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_USERNAME = 'test';
process.env.DB_PASSWORD = 'test';
process.env.DB_DATABASE = 'test';

// Global test database connection
let connection;

// Silence console logs during tests unless DEBUG is enabled
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    error: (...args) => {
      if (process.env.DEBUG) console.error(...args);
    },
    log: (...args) => {
      if (process.env.DEBUG) console.log(...args);
    },
    info: jest.fn(),
    warn: jest.fn(),
  };
}

// Add custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      message: () =>
        pass
          ? `expected ${received} not to be within range ${floor} - ${ceiling}`
          : `expected ${received} to be within range ${floor} - ${ceiling}`,
      pass,
    };
  },
  toBeValidUUID(received) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid UUID`
          : `expected ${received} to be a valid UUID`,
      pass,
    };
  },
  toBeISODate(received) {
    const pass = !isNaN(Date.parse(received));
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid ISO date string`
          : `expected ${received} to be a valid ISO date string`,
      pass,
    };
  },
});

// Global test helpers
global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Database connection and transaction handling
beforeAll(async () => {
  try {
    const { TestDataSource } = require('../config/database.test');
    connection = await TestDataSource.initialize();
    await connection.synchronize(true); // Force schema recreation
    
    // Store connection for use in tests
    global.__JEST_TYPEORM_CONNECTION__ = connection;
  } catch (error) {
    console.error('Test database initialization failed:', error);
    throw error;
  }
});

// Clean up database after all tests
afterAll(async () => {
  try {
    if (connection?.isInitialized) {
      await connection.dropDatabase(); // Drop all tables
      await connection.destroy(); // Close connection
    }
  } catch (error) {
    console.error('Test database cleanup failed:', error);
    throw error;
  }
});

// Transaction handling for each test
beforeEach(async () => {
  if (connection?.isInitialized) {
    await connection.synchronize(true); // Recreate schema before each test
  }
});

// Rollback transaction after each test
afterEach(async () => {
  if (connection?.isInitialized) {
    await connection.query('TRUNCATE TABLE bid CASCADE');
    await connection.query('TRUNCATE TABLE certificate CASCADE');
    await connection.query('TRUNCATE TABLE auction CASCADE');
    await connection.query('TRUNCATE TABLE property CASCADE');
    await connection.query('TRUNCATE TABLE county CASCADE');
    await connection.query('TRUNCATE TABLE "user" CASCADE');
  }
}); 