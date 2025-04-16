import { describe, it, expect } from '@jest/globals';

// Placeholder function for demonstration
function add(a: number, b: number): number {
  return a + b;
}

describe('Example Utility', () => {
  it('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(add(-1, -2)).toBe(-3);
  });

  it('should handle zero', () => {
    expect(add(5, 0)).toBe(5);
  });
}); 