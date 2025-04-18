"use strict";
// Set testing timeout to 10s for all tests
jest.setTimeout(10000);
// Silence console logs during tests
if (process.env.NODE_ENV === 'test') {
    global.console = {
        ...console,
        // Keep error output for debugging
        error: jest.fn(),
        // Log for debugging
        log: jest.fn(),
        // Silence info and warnings in test output
        info: jest.fn(),
        warn: jest.fn(),
    };
}
// Add custom matchers or global test helpers here
expect.extend({
    toBeWithinRange(received, floor, ceiling) {
        const pass = received >= floor && received <= ceiling;
        if (pass) {
            return {
                message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
                pass: false,
            };
        }
    },
});
//# sourceMappingURL=jest.setup.js.map