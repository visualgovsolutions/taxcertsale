"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
// Placeholder function for demonstration
function add(a, b) {
    return a + b;
}
(0, globals_1.describe)('Example Utility', () => {
    (0, globals_1.it)('should add two numbers correctly', () => {
        (0, globals_1.expect)(add(2, 3)).toBe(5);
    });
    (0, globals_1.it)('should handle negative numbers', () => {
        (0, globals_1.expect)(add(-1, -2)).toBe(-3);
    });
    (0, globals_1.it)('should handle zero', () => {
        (0, globals_1.expect)(add(5, 0)).toBe(5);
    });
});
//# sourceMappingURL=example.util.test.js.map