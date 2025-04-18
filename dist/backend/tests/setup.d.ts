import testConfig from '@config/test';
export declare function setupTestEnvironment(): Promise<() => Promise<void>>;
export declare function clearDatabase(): Promise<void>;
export declare function createTestServer(): import("express").Application;
export { testConfig };
