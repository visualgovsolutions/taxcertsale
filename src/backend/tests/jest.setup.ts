import { TestDataSource, clearAllTables, initializeTestDatabase } from '../../config/database.test';
import { setupTestRepositories } from './utils/test-utils';

// Make repositories available globally for tests
declare global {
  namespace NodeJS {
    interface Global {
      testRepos: ReturnType<typeof setupTestRepositories>;
    }
  }
}

beforeAll(async () => {
  await initializeTestDatabase();
  (global as any).testRepos = setupTestRepositories();
});

beforeEach(async () => {
  await clearAllTables(TestDataSource);
});

afterAll(async () => {
  await TestDataSource.destroy();
});

// Comment out problematic line causing TS7017 error
// global['someProperty'] = ... // (commented out to fix build) 