const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/frontend/**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/frontend/tests/jest.setup.ts'
  ],
}; 