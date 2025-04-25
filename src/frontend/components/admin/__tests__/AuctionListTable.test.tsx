import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import AuctionListTable, { GET_AUCTIONS } from '../AuctionListTable';

const mockAuctions = [
  {
    id: '1',
    title: 'Test Auction 1',
    status: 'DRAFT',
    startDate: '2024-03-01T10:00:00Z',
    endDate: '2024-03-02T10:00:00Z',
    certificateCount: 5,
    totalValue: 50000,
    minInterestRate: 5,
    createdAt: '2024-02-28T10:00:00Z',
    updatedAt: '2024-02-28T10:00:00Z',
  },
  {
    id: '2',
    title: 'Test Auction 2',
    status: 'ACTIVE',
    startDate: '2024-03-03T10:00:00Z',
    endDate: '2024-03-04T10:00:00Z',
    certificateCount: 3,
    totalValue: 30000,
    minInterestRate: 4,
    createdAt: '2024-02-28T10:00:00Z',
    updatedAt: '2024-02-28T10:00:00Z',
  },
];

const mocks = [
  {
    request: {
      query: GET_AUCTIONS,
      variables: { search: '' },
    },
    result: {
      data: {
        auctions: mockAuctions,
      },
    },
  },
  {
    request: {
      query: GET_AUCTIONS,
      variables: { search: 'Test Auction 1' },
    },
    result: {
      data: {
        auctions: [mockAuctions[0]],
      },
    },
  },
];

const mockProps = {
  onCreateAuction: jest.fn(),
  onEditAuction: jest.fn(),
  onViewDetails: jest.fn(),
};

describe('AuctionListTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuctionListTable {...mockProps} />
      </MockedProvider>
    );

    expect(screen.getByText('Loading auctions...')).toBeInTheDocument();
  });

  it('renders auctions after loading', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuctionListTable {...mockProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Auction 1')).toBeInTheDocument();
      expect(screen.getByText('Test Auction 2')).toBeInTheDocument();
    });

    // Check if status badges are rendered
    expect(screen.getByText('DRAFT')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();

    // Check if values are formatted correctly
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('5%')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuctionListTable {...mockProps} />
      </MockedProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Auction 1')).toBeInTheDocument();
    });

    // Find search input and type
    const searchInput = screen.getByPlaceholderText('Search auctions...');
    fireEvent.change(searchInput, { target: { value: 'Test Auction 1' } });

    // Wait for filtered results
    await waitFor(() => {
      expect(screen.getByText('Test Auction 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Auction 2')).not.toBeInTheDocument();
    });
  });

  it('calls appropriate handlers when buttons are clicked', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuctionListTable {...mockProps} />
      </MockedProvider>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Auction 1')).toBeInTheDocument();
    });

    // Test Create button
    fireEvent.click(screen.getByText('Create Auction'));
    expect(mockProps.onCreateAuction).toHaveBeenCalled();

    // Test View button
    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);
    expect(mockProps.onViewDetails).toHaveBeenCalledWith(mockAuctions[0]);

    // Test Edit button (only shown for DRAFT status)
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    expect(mockProps.onEditAuction).toHaveBeenCalledWith(mockAuctions[0]);
  });

  it('handles GraphQL errors', async () => {
    const errorMock = [
      {
        request: {
          query: GET_AUCTIONS,
          variables: { search: '' },
        },
        error: new Error('Failed to load auctions'),
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <AuctionListTable {...mockProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading auctions: Failed to load auctions')).toBeInTheDocument();
    });
  });
}); 