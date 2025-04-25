import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import AuctionManagementPage from '../AuctionManagementPage';
import { GET_AUCTIONS } from '../../../components/admin/AuctionListTable';
import { CREATE_AUCTION, UPDATE_AUCTION } from '../../../components/admin/AuctionForm';

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
];

describe('AuctionManagementPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page title', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuctionManagementPage />
      </MockedProvider>
    );

    expect(screen.getByText('Auction Management')).toBeInTheDocument();
  });

  it('displays auction list and handles create action', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuctionManagementPage />
      </MockedProvider>
    );

    // Wait for auctions to load
    await waitFor(() => {
      expect(screen.getByText('Test Auction 1')).toBeInTheDocument();
    });

    // Click create button
    fireEvent.click(screen.getByText('Create Auction'));

    // Check if form modal appears
    expect(screen.getByText('Create New Auction')).toBeInTheDocument();
  });

  it('handles edit action', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuctionManagementPage />
      </MockedProvider>
    );

    // Wait for auctions to load
    await waitFor(() => {
      expect(screen.getByText('Test Auction 1')).toBeInTheDocument();
    });

    // Click edit button (only visible for DRAFT status)
    fireEvent.click(screen.getByText('Edit'));

    // Check if form modal appears in edit mode
    expect(screen.getByText('Edit Auction')).toBeInTheDocument();
  });

  it('handles view details action', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuctionManagementPage />
      </MockedProvider>
    );

    // Wait for auctions to load
    await waitFor(() => {
      expect(screen.getByText('Test Auction 1')).toBeInTheDocument();
    });

    // Click view button
    fireEvent.click(screen.getByText('View'));

    // Check if console.log was called with the correct auction
    expect(consoleSpy).toHaveBeenCalledWith('View auction details:', mockAuctions[0]);

    consoleSpy.mockRestore();
  });

  it('closes form modal', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuctionManagementPage />
      </MockedProvider>
    );

    // Wait for auctions to load and click create
    await waitFor(() => {
      expect(screen.getByText('Test Auction 1')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Create Auction'));

    // Check if form appears and then close it
    expect(screen.getByText('Create New Auction')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));

    // Check if form disappears
    expect(screen.queryByText('Create New Auction')).not.toBeInTheDocument();
  });
}); 