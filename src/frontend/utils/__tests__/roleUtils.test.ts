import { normalizeRole, isRole, hasRole } from '../roleUtils';

describe('Role Utilities', () => {
  describe('normalizeRole', () => {
    test('should handle empty values', () => {
      expect(normalizeRole('')).toBe('');
      expect(normalizeRole(null as any)).toBe('');
      expect(normalizeRole(undefined as any)).toBe('');
    });

    test('should normalize admin roles', () => {
      expect(normalizeRole('admin')).toBe('ADMIN');
      expect(normalizeRole('ADMIN')).toBe('ADMIN');
      expect(normalizeRole('Admin')).toBe('ADMIN');
      expect(normalizeRole('administrator')).toBe('ADMIN');
    });

    test('should normalize county official roles', () => {
      expect(normalizeRole('county_official')).toBe('COUNTY_OFFICIAL');
      expect(normalizeRole('COUNTY_OFFICIAL')).toBe('COUNTY_OFFICIAL');
      expect(normalizeRole('County_Official')).toBe('COUNTY_OFFICIAL');
    });

    test('should normalize investor roles', () => {
      expect(normalizeRole('investor')).toBe('INVESTOR');
      expect(normalizeRole('INVESTOR')).toBe('INVESTOR');
      expect(normalizeRole('Investor')).toBe('INVESTOR');
      expect(normalizeRole('bidder')).toBe('INVESTOR');
      expect(normalizeRole('BIDDER')).toBe('INVESTOR');
    });

    test('should normalize user roles', () => {
      expect(normalizeRole('user')).toBe('USER');
      expect(normalizeRole('USER')).toBe('USER');
      expect(normalizeRole('User')).toBe('USER');
    });

    test('should return uppercase for unknown roles', () => {
      expect(normalizeRole('custom_role')).toBe('CUSTOM_ROLE');
      expect(normalizeRole('manager')).toBe('MANAGER');
    });
  });

  describe('isRole', () => {
    test('should correctly match roles regardless of case', () => {
      expect(isRole('admin', 'ADMIN')).toBe(true);
      expect(isRole('ADMIN', 'admin')).toBe(true);
      expect(isRole('county_official', 'COUNTY_OFFICIAL')).toBe(true);
      expect(isRole('investor', 'INVESTOR')).toBe(true);
      expect(isRole('bidder', 'INVESTOR')).toBe(true);
      expect(isRole('user', 'USER')).toBe(true);
    });

    test('should return false for non-matching roles', () => {
      expect(isRole('admin', 'USER')).toBe(false);
      expect(isRole('investor', 'ADMIN')).toBe(false);
      expect(isRole('county_official', 'INVESTOR')).toBe(false);
    });
  });

  describe('hasRole', () => {
    test('should check if user has any of the allowed roles', () => {
      expect(hasRole('admin', ['ADMIN', 'COUNTY_OFFICIAL'])).toBe(true);
      expect(hasRole('county_official', ['ADMIN', 'COUNTY_OFFICIAL'])).toBe(true);
      expect(hasRole('investor', ['ADMIN', 'INVESTOR'])).toBe(true);
      expect(hasRole('user', ['USER'])).toBe(true);
    });

    test("should return false if user doesn't have any allowed role", () => {
      expect(hasRole('admin', ['USER', 'INVESTOR'])).toBe(false);
      expect(hasRole('county_official', ['USER'])).toBe(false);
      expect(hasRole('investor', ['ADMIN', 'COUNTY_OFFICIAL'])).toBe(false);
    });
  });
});
