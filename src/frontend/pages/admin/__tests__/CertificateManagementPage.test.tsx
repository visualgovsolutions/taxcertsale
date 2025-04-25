import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import CertificateManagementPage from '../CertificateManagementPage';
import { GET_CERTIFICATES } from '../../../components/admin/CertificateListTable';

const mockCertificates = [
  {
    id: '1',
    parcelId: 'PARC-001',
    propertyAddress: '123 Main St',
    ownerName: 'John Doe',
    faceValue: 50000,
    interestRate: 5,
    status: 'AVAILABLE',
    createdAt: '2024-02-28T10:00:00Z',
    updatedAt: '2024-02-28T10:00:00Z',
    redemptionAmount: null,
    redemptionDate: null,
    auctionId: null
  },
  {
    id: '2',
    parcelId: 'PARC-002',
    propertyAddress: '456 Oak Ave',
    ownerName: 'Jane Smith',
    faceValue: 75000,
    interestRate: 4.5,
    status: 'SOLD',
    redemptionAmount: 78000,
    redemptionDate: '2024-03-15T10:00:00Z',
    auctionId: 'auction-1',
    createdAt: '2024-02-28T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  }
];

const mocks = [
  {
    request: {
      query: GET_CERTIFICATES,
      variables: { search: '' }
    },
    result: {
      data: {
        certificates: mockCertificates
      }
    }
  }
];

describe('CertificateManagementPage', () => {
  it('renders the page title and breadcrumbs', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CertificateManagementPage />
      </MockedProvider>
    );

    expect(screen.getByText('Certificate Management')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Certificates')).toBeInTheDocument();
  });

  it('displays certificate list and handles assign action', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CertificateManagementPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('PARC-001')).toBeInTheDocument();
    });

    const assignButton = screen.getByText('Assign');
    fireEvent.click(assignButton);

    // TODO: Add assertions for assign modal when implemented
  });

  it('displays certificate list and handles mark as redeemed action', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CertificateManagementPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('PARC-002')).toBeInTheDocument();
    });

    const redeemButton = screen.getByText('Mark Redeemed');
    fireEvent.click(redeemButton);

    // TODO: Add assertions for redemption modal when implemented
  });

  it('displays certificate list and handles view details action', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CertificateManagementPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('PARC-001')).toBeInTheDocument();
    });

    const viewButton = screen.getAllByText('View')[0];
    fireEvent.click(viewButton);

    // TODO: Add assertions for details modal when implemented
  });

  it('handles GraphQL errors', async () => {
    const errorMock = [
      {
        request: {
          query: GET_CERTIFICATES,
          variables: { search: '' }
        },
        error: new Error('Failed to load certificates')
      }
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <CertificateManagementPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading certificates: Failed to load certificates')).toBeInTheDocument();
    });
  });
}); 