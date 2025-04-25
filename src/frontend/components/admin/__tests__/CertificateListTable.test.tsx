import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import CertificateListTable, { GET_CERTIFICATES } from '../CertificateListTable';

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
    redemptionAmount: 52500,
    redemptionDate: null,
    auctionId: null
  },
  {
    id: '2',
    parcelId: 'PARC-002',
    propertyAddress: '456 Oak Ave',
    ownerName: 'Jane Smith',
    faceValue: 75000,
    interestRate: 6,
    status: 'ASSIGNED',
    createdAt: '2024-02-28T11:00:00Z',
    updatedAt: '2024-02-28T11:00:00Z',
    redemptionAmount: 79500,
    redemptionDate: null,
    auctionId: 'auction-1'
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
  },
  {
    request: {
      query: GET_CERTIFICATES,
      variables: { search: 'Main' }
    },
    result: {
      data: {
        certificates: [mockCertificates[0]]
      }
    }
  },
  {
    request: {
      query: GET_CERTIFICATES,
      variables: { search: '' }
    },
    error: new Error('Failed to fetch certificates')
  }
];

describe('CertificateListTable', () => {
  const mockHandlers = {
    onAssignToAuction: jest.fn(),
    onMarkAsRedeemed: jest.fn(),
    onViewDetails: jest.fn()
  };

  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CertificateListTable {...mockHandlers} />
      </MockedProvider>
    );
    expect(screen.getByText('Loading certificates...')).toBeInTheDocument();
  });

  it('renders certificates after loading', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CertificateListTable {...mockHandlers} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('PARC-001')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CertificateListTable {...mockHandlers} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('PARC-001')).toBeInTheDocument();
      expect(screen.getByText('PARC-002')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search certificates...');
    fireEvent.change(searchInput, { target: { value: 'Main' } });

    await waitFor(() => {
      expect(screen.getByText('PARC-001')).toBeInTheDocument();
      expect(screen.queryByText('PARC-002')).not.toBeInTheDocument();
    });
  });

  it('shows appropriate action buttons based on status', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CertificateListTable {...mockHandlers} />
      </MockedProvider>
    );

    await waitFor(() => {
      const assignButtons = screen.getAllByText('Assign');
      expect(assignButtons).toHaveLength(1);
      const viewButtons = screen.getAllByText('View');
      expect(viewButtons.length).toBeGreaterThan(0);
    });
  });

  it('calls appropriate handlers when buttons are clicked', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CertificateListTable {...mockHandlers} />
      </MockedProvider>
    );

    await waitFor(() => {
      const assignButton = screen.getByText('Assign');
      fireEvent.click(assignButton);
      expect(mockHandlers.onAssignToAuction).toHaveBeenCalledWith(mockCertificates[0]);

      const viewButton = screen.getAllByText('View')[0];
      fireEvent.click(viewButton);
      expect(mockHandlers.onViewDetails).toHaveBeenCalledWith(mockCertificates[0]);
    });
  });

  it('handles GraphQL errors', async () => {
    render(
      <MockedProvider mocks={[mocks[2]]} addTypename={false}>
        <CertificateListTable {...mockHandlers} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading certificates/)).toBeInTheDocument();
    });
  });
}); 