import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import AuctionForm, { CREATE_AUCTION, UPDATE_AUCTION } from '../AuctionForm';

const mockAuction = {
  id: '1',
  title: 'Test Auction',
  status: 'DRAFT' as const,
  startDate: '2024-03-01T10:00:00Z',
  endDate: '2024-03-02T10:00:00Z',
  minInterestRate: 5,
  description: 'Test Description',
};

const mockProps = {
  show: true,
  onClose: jest.fn(),
  onSaved: jest.fn(),
};

const createAuctionMock = {
  request: {
    query: CREATE_AUCTION,
    variables: {
      input: {
        title: 'New Auction',
        status: 'DRAFT',
        startDate: expect.any(String),
        endDate: expect.any(String),
        minInterestRate: 5,
        description: 'New Description',
      },
    },
  },
  result: {
    data: {
      createAuction: {
        id: '2',
        title: 'New Auction',
        status: 'DRAFT',
        startDate: '2024-03-01T10:00:00Z',
        endDate: '2024-03-02T10:00:00Z',
        minInterestRate: 5,
      },
    },
  },
};

const updateAuctionMock = {
  request: {
    query: UPDATE_AUCTION,
    variables: {
      id: '1',
      input: {
        title: 'Updated Auction',
        status: 'DRAFT',
        startDate: expect.any(String),
        endDate: expect.any(String),
        minInterestRate: 6,
        description: 'Updated Description',
      },
    },
  },
  result: {
    data: {
      updateAuction: {
        id: '1',
        title: 'Updated Auction',
        status: 'DRAFT',
        startDate: '2024-03-01T10:00:00Z',
        endDate: '2024-03-02T10:00:00Z',
        minInterestRate: 6,
      },
    },
  },
};

describe('AuctionForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders create form correctly', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AuctionForm {...mockProps} />
      </MockedProvider>
    );

    expect(screen.getByText('Create New Auction')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimum Interest Rate (%)')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('renders edit form with auction data', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AuctionForm {...mockProps} auction={mockAuction} />
      </MockedProvider>
    );

    expect(screen.getByText('Edit Auction')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Auction')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  it('handles form submission for create', async () => {
    render(
      <MockedProvider mocks={[createAuctionMock]} addTypename={false}>
        <AuctionForm {...mockProps} />
      </MockedProvider>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Auction' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New Description' },
    });
    fireEvent.change(screen.getByLabelText('Minimum Interest Rate (%)'), {
      target: { value: '5' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(mockProps.onSaved).toHaveBeenCalled();
      expect(mockProps.onClose).toHaveBeenCalled();
    });
  });

  it('handles form submission for update', async () => {
    render(
      <MockedProvider mocks={[updateAuctionMock]} addTypename={false}>
        <AuctionForm {...mockProps} auction={mockAuction} />
      </MockedProvider>
    );

    // Update form fields
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Updated Auction' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Updated Description' },
    });
    fireEvent.change(screen.getByLabelText('Minimum Interest Rate (%)'), {
      target: { value: '6' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(mockProps.onSaved).toHaveBeenCalled();
      expect(mockProps.onClose).toHaveBeenCalled();
    });
  });

  it('handles mutation errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const errorMock = {
      request: {
        query: CREATE_AUCTION,
        variables: {
          input: {
            title: 'New Auction',
            status: 'DRAFT',
            startDate: expect.any(String),
            endDate: expect.any(String),
            minInterestRate: 5,
            description: 'New Description',
          },
        },
      },
      error: new Error('Failed to create auction'),
    };

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <AuctionForm {...mockProps} />
      </MockedProvider>
    );

    // Fill out and submit the form
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Auction' },
    });
    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error saving auction:',
        expect.any(Error)
      );
      expect(mockProps.onSaved).not.toHaveBeenCalled();
      expect(mockProps.onClose).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('validates required fields', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AuctionForm {...mockProps} />
      </MockedProvider>
    );

    const titleInput = screen.getByLabelText('Title');
    const interestRateInput = screen.getByLabelText('Minimum Interest Rate (%)');

    expect(titleInput).toBeRequired();
    expect(interestRateInput).toBeRequired();
  });

  it('disables status changes for active or closed auctions', () => {
    const activeAuction = { ...mockAuction, status: 'ACTIVE' as const };
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AuctionForm {...mockProps} auction={activeAuction} />
      </MockedProvider>
    );

    expect(screen.getByLabelText('Status')).toBeDisabled();
  });
}); 