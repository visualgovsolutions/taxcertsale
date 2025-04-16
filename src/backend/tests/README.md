# Testing Strategy

This directory contains the test suite for the Florida Tax Certificate Sale platform. The tests are organized into three main categories:

## Test Structure

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test interactions between components
- **E2E Tests**: Test complete user flows

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (automatically reruns when files change)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test categories
npm run test:unit
npm run test:integration
npm run test:e2e
```

## Test Environment

Tests run in a separate environment from development and production. The `.env.test` file contains configuration specific to the test environment. Notable differences include:

- Different database connection (uses an in-memory MongoDB for tests)
- Different port (3001 instead of 3000)
- Test-specific JWT secrets

## Test Utilities

The `setup.ts` file contains utilities for setting up and tearing down the test environment:

- `setupTestEnvironment()`: Initializes the test environment and returns a teardown function
- `clearDatabase()`: Clears all database collections between tests
- `createTestServer()`: Creates a test server instance

## Adding New Tests

When adding new tests, follow these guidelines:

1. Place tests in the appropriate directory (unit, integration, or e2e)
2. Name test files with a `.test.ts` extension (or `.e2e-test.ts` for E2E tests)
3. Use descriptive test suites and test cases
4. Ensure tests are isolated and do not depend on each other
5. Clean up any resources created during tests

## Best Practices

- Write tests before implementing features (TDD) when possible
- Keep tests focused and concise
- Use realistic test data
- Don't mock what you don't own
- Test both success and failure scenarios
- Optimize tests for readability and maintainability 