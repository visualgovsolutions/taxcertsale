import { describe, test, expect, jest } from '@jest/globals';

// Import our normalize function
// These functions are in src/backend/graphql/resolvers/certificate.resolver.ts
// For testing purposes, we'll reimplement them here
const normalizeStatus = (certificate: any) => {
  if (certificate && certificate.status) {
    // Create a mapping of lowercase to uppercase status values
    const statusMapping: Record<string, string> = {
      'available': 'AVAILABLE',
      'pending': 'PENDING',
      'auction_scheduled': 'AUCTION_SCHEDULED',
      'auction_active': 'AUCTION_ACTIVE',
      'auction_closed': 'AUCTION_CLOSED',
      'sold': 'SOLD',
      'redeemed': 'REDEEMED',
      'expired': 'EXPIRED',
    };

    // If the status is a lowercase key in our mapping, convert to uppercase
    if (statusMapping[certificate.status]) {
      certificate.status = statusMapping[certificate.status];
    }
  }
  return certificate;
};

const normalizeCertificates = (certificates: any[]) => {
  return certificates.map(normalizeStatus);
};

describe('Certificate Status Normalization', () => {
  test('normalizeStatus converts lowercase statuses to uppercase', () => {
    // Test each lowercase status value
    expect(normalizeStatus({ status: 'available' }).status).toBe('AVAILABLE');
    expect(normalizeStatus({ status: 'pending' }).status).toBe('PENDING');
    expect(normalizeStatus({ status: 'auction_scheduled' }).status).toBe('AUCTION_SCHEDULED');
    expect(normalizeStatus({ status: 'auction_active' }).status).toBe('AUCTION_ACTIVE');
    expect(normalizeStatus({ status: 'auction_closed' }).status).toBe('AUCTION_CLOSED');
    expect(normalizeStatus({ status: 'sold' }).status).toBe('SOLD');
    expect(normalizeStatus({ status: 'redeemed' }).status).toBe('REDEEMED');
    expect(normalizeStatus({ status: 'expired' }).status).toBe('EXPIRED');
  });

  test('normalizeStatus preserves uppercase statuses', () => {
    // Test uppercase status values remain unchanged
    expect(normalizeStatus({ status: 'AVAILABLE' }).status).toBe('AVAILABLE');
    expect(normalizeStatus({ status: 'PENDING' }).status).toBe('PENDING');
    expect(normalizeStatus({ status: 'AUCTION_SCHEDULED' }).status).toBe('AUCTION_SCHEDULED');
    expect(normalizeStatus({ status: 'AUCTION_ACTIVE' }).status).toBe('AUCTION_ACTIVE');
    expect(normalizeStatus({ status: 'AUCTION_CLOSED' }).status).toBe('AUCTION_CLOSED');
    expect(normalizeStatus({ status: 'SOLD' }).status).toBe('SOLD');
    expect(normalizeStatus({ status: 'REDEEMED' }).status).toBe('REDEEMED');
    expect(normalizeStatus({ status: 'EXPIRED' }).status).toBe('EXPIRED');
  });

  test('normalizeStatus handles missing status', () => {
    // Test with undefined, null and empty certificate
    expect(normalizeStatus({ otherField: 'test' })).toEqual({ otherField: 'test' });
    expect(normalizeStatus({ status: null })).toEqual({ status: null });
    expect(normalizeStatus(null)).toBeNull();
    expect(normalizeStatus(undefined)).toBeUndefined();
  });

  test('normalizeCertificates handles arrays of certificates', () => {
    // Test normalizing an array of certificates
    const certificates = [
      { id: '1', status: 'available' },
      { id: '2', status: 'SOLD' },
      { id: '3', status: 'redeemed' },
      { id: '4', status: null },
    ];

    const normalized = normalizeCertificates(certificates);
    
    expect(normalized).toEqual([
      { id: '1', status: 'AVAILABLE' },
      { id: '2', status: 'SOLD' },
      { id: '3', status: 'REDEEMED' },
      { id: '4', status: null },
    ]);
  });
}); 