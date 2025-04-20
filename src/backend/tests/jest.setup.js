import 'reflect-metadata';
// Removed TypeORM / old test util imports
// import { config } from '../../config/test';
// import { TestDataSource, initializeTestDatabase, closeTestDatabase } from '../../config/database.test';
import { sign } from 'jsonwebtoken';
// import { cleanAllTables } from '../../../tests/test-utils/transaction';

// Set a longer timeout for tests (keep if needed, adjust value)
jest.setTimeout(30000);

// Mock environment variables (keep)
process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';
// Remove old DB vars if not used elsewhere
// process.env.TEST_DB_USER = 'test';
// process.env.TEST_DB_PASSWORD = 'test';
// process.env.TEST_DB_NAME = 'test';
process.env.PORT = '4000';

// Silence console logs during tests unless DEBUG is enabled (keep)
if (process.env.NODE_ENV === 'test' && !process.env.DEBUG) {
  const originalConsole = { ...console };
  global.console = {
    error: jest.fn(),
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    // Restore original error for test failures
    _error: originalConsole.error
  };
}

// Add custom matchers (keep)
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
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
  toBeValidBidPercentage(received) {
    const pass = received >= 5 && received <= 18;
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid bid percentage (5-18)`
          : `expected ${received} to be a valid bid percentage (5-18)`,
      pass,
    };
  },
});

// Global test helpers (keep)
global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

global.generateTestToken = (userId, role = 'investor') => {
  return sign(
    { userId, role },
    process.env.JWT_SECRET || 'test-secret', // Add fallback for safety
    { expiresIn: '1h' }
  );
};

global.mockDate = (isoDate) => {
  const RealDate = Date;
  global.Date = class extends RealDate {
    constructor(...args) {
      if (args.length) {
        return new RealDate(...args);
      }
      return new RealDate(isoDate);
    }
    static now() {
      return new RealDate(isoDate).getTime();
    }
  };
  // Add a way to restore the original Date if needed
  return () => {
    global.Date = RealDate;
  };
};

// Remove database-related hooks
/*
beforeAll(async () => {
  // ... removed database init ...
});
*/

/*
beforeEach(async () => {
  // ... removed table cleaning ...
  jest.clearAllMocks(); // Keep mock clearing if useful
  if (global.Date !== Date) { // Keep date restoration if using mockDate
    global.Date = Date;
  }
});
*/

// Clean up mocks and timers after each test (useful)
afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers(); // Ensure timers are reset if mocked
  // Restore Date if it was mocked by mockDate helper
  if (global.Date.name !== 'Date') { // Basic check if Date might be mocked
    global.Date = Date; 
  }
});


/*
afterAll(async () => {
  // ... removed database closing ...
});
*/