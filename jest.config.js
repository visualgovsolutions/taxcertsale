const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
      diagnostics: {
        ignoreCodes: [1343] // Ignore 'implicitly has any' errors
      }
    }],
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' })
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: [
    '<rootDir>/src/backend/tests/jest.setup.js',
    '<rootDir>/src/frontend/tests/jest.setup.ts'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      isolatedModules: true
    }
  },
  verbose: true,
  testTimeout: 30000,
  maxWorkers: 1, // Run tests sequentially
  projects: [
    {
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/tests/**/*.test.ts',
        '<rootDir>/src/backend/**/*.test.ts'
      ],
      setupFilesAfterEnv: ['<rootDir>/src/backend/tests/jest.setup.js']
    },
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/src/frontend/**/*.test.tsx',
        '<rootDir>/src/frontend/**/*.test.ts'
      ],
      setupFilesAfterEnv: ['<rootDir>/src/frontend/tests/jest.setup.ts']
    }
  ]
}; 