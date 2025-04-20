# Database Testing Strategy

## Problem Statement

The project is experiencing persistent foreign key constraint errors during test execution. These issues are caused by:

1. **Circular Foreign Key Dependencies**: Tables reference each other creating circular dependencies
2. **Strict Constraint Enforcement**: PostgreSQL strictly enforces these constraints during test operations
3. **Inadequate Test Isolation**: Current test cleanup approaches conflict with the constraint system
4. **Cascading Effects**: Test failures in one area can affect seemingly unrelated tests

## Recommended Solutions

This document outlines multiple strategies to address these issues, from most to least preferred.

### Strategy 1: Transaction-Based Testing

This approach uses database transactions to automatically roll back changes after each test, providing perfect isolation without constraint conflicts.

#### Implementation Steps:

1. Create a transaction utility function:

```typescript
// tests/test-utils/transaction.ts
import { TestDataSource } from './test-data-source';

export const withTestTransaction = async (testFn: () => Promise<void>) => {
  await TestDataSource.query('BEGIN');
  try {
    await testFn();
  } finally {
    await TestDataSource.query('ROLLBACK');
  }
};
```

2. Update test files to use transactions:

```typescript
import { withTestTransaction } from './test-utils/transaction';

describe('EntityRepository', () => {
  beforeAll(async () => {
    await TestDataSource.initialize();
    await TestDataSource.runMigrations();
  });

  afterAll(async () => {
    await TestDataSource.destroy();
  });

  it('should create an entity', async () => {
    await withTestTransaction(async () => {
      // Test implementation
      // No manual cleanup needed - transaction will be rolled back
    });
  });
});
```

### Strategy 2: Complete Schema Reset

This approach completely drops and recreates the schema between test runs, ensuring a clean state.

#### Implementation Steps:

1. Create a database reset utility:

```typescript
// tests/test-utils/database.ts
import { TestDataSource } from './test-data-source';

export const resetTestDatabase = async () => {
  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
  }
  
  // Drop and recreate schema
  await TestDataSource.query('DROP SCHEMA public CASCADE');
  await TestDataSource.query('CREATE SCHEMA public');
  await TestDataSource.query('GRANT ALL ON SCHEMA public TO postgres');
  await TestDataSource.query('GRANT ALL ON SCHEMA public TO public');
  
  // Run migrations to recreate all tables with constraints
  await TestDataSource.runMigrations();
};
```

2. Use in test suite setup:

```typescript
import { resetTestDatabase } from './test-utils/database';

beforeAll(async () => {
  await resetTestDatabase();
});

afterAll(async () => {
  await TestDataSource.destroy();
});
```

### Strategy 3: Disable Foreign Key Constraints During Test Cleanup

Temporarily disable constraints during cleanup operations.

#### Implementation Steps:

1. Create a cleanup utility:

```typescript
// tests/test-utils/cleanup.ts
import { TestDataSource } from './test-data-source';

export const cleanAllTables = async () => {
  // Temporarily disable constraint checking
  await TestDataSource.query('SET session_replication_role = "replica";');
  
  try {
    // Clear tables in correct order
    await TestDataSource.query('TRUNCATE TABLE bids CASCADE');
    await TestDataSource.query('TRUNCATE TABLE certificates CASCADE');
    await TestDataSource.query('TRUNCATE TABLE properties CASCADE');
    await TestDataSource.query('TRUNCATE TABLE auctions CASCADE');
    await TestDataSource.query('TRUNCATE TABLE counties CASCADE');
    await TestDataSource.query('TRUNCATE TABLE users CASCADE');
    // Add any other tables as needed
  } finally {
    // Re-enable constraint checking
    await TestDataSource.query('SET session_replication_role = "origin";');
  }
};
```

2. Use in test lifecycles:

```typescript
import { cleanAllTables } from './test-utils/cleanup';

beforeEach(async () => {
  await cleanAllTables();
  // Set up test data
});
```

### Strategy 4: Update Database Schema Design

A more permanent solution involves modifying the database schema itself.

#### Implementation Steps:

1. Add `ON DELETE CASCADE` to all foreign key constraints:

```typescript
// Update all entity files to include cascade option
@ManyToOne(() => ParentEntity, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'parent_id' })
parent: ParentEntity;
```

2. Create a migration to update existing constraints:

```typescript
// src/database/migrations/UpdateForeignKeyConstraints.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateForeignKeyConstraints implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Example of updating constraint for certificates table
    await queryRunner.query(`
      ALTER TABLE "certificates" DROP CONSTRAINT "FK_certificates_property";
      ALTER TABLE "certificates" ADD CONSTRAINT "FK_certificates_property" 
      FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE;
    `);
    
    // Repeat for all foreign key constraints
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse the changes if needed
  }
}
```

## Comprehensive Implementation Plan

### Phase 1: Immediate Fix (1-2 days)

1. Implement Strategy 3 (Disable Foreign Key Constraints) for immediate test stability:
   - Create the cleanup utility
   - Update all test files to use this approach
   - Verify tests run consistently

2. Document current database schema and relationships:
   - Map all entity relationships
   - Identify circular dependencies
   - Document constraints that cause issues

### Phase 2: Robust Solution (3-5 days)

3. Implement Strategy 1 (Transaction-Based Testing):
   - Create transaction utility
   - Update repository test files to use transactions
   - Add support for nested transactions if needed
   - Update Jest configuration to support this pattern

4. Update test fixtures and data creation:
   - Create reusable test data factories
   - Ensure each test only creates data it needs
   - Add data validation before/after test runs

### Phase 3: Long-term Architecture Improvements (1-2 weeks)

5. Implement Strategy 4 (Update Database Schema):
   - Review all foreign key relationships
   - Create migration to update constraints with CASCADE options
   - Consider soft delete pattern for entities that shouldn't be physically deleted

6. Implement monitoring and debugging tools:
   - Add logging of database operations during tests
   - Create utility to visualize database state
   - Add performance metrics for database operations

## Best Practices Going Forward

1. **Test Isolation**: Each test should be completely independent
2. **Transactional Testing**: Prefer transaction-based testing for repository tests
3. **Avoid Fixture Coupling**: Don't rely on data created by other tests
4. **Consistent Cleanup**: Always clean up data in the reverse order of creation
5. **Schema Verification**: Regularly verify that the test database schema matches production

## Conclusion

By implementing these strategies, we can eliminate the foreign key constraint errors in our test suite and improve overall test reliability. The transaction-based approach (Strategy 1) provides the best balance of isolation and performance, while schema improvements (Strategy 4) address the root causes of the issues. 