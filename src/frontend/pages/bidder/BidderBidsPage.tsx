import React, { useState } from 'react';
import { Card, Table, Badge, Button, Spinner, Tabs, TextInput, Modal, Label } from 'flowbite-react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { HiSearch, HiOutlineExclamationCircle, HiArrowUp } from 'react-icons/hi';
import { useParams } from 'react-router-dom';
import CountyHeader from '../../components/bidder/CountyHeader';

// Define interfaces for our data types
interface Certificate {
  faceValue: number;
  interestRate: number;
  propertyAddress?: string;
  ownerName?: string;
}

interface Auction {
  name: string;
  endTime?: string;
}

interface Bid {
  id: string;
  certificateId: string;
  auctionId: string;
  certificateNumber: string;
  propertyAddress?: string;
  parcelId: string;
  county: string;
  interestRate: number;
  bidDate: string;
  status: string;
  winningBid?: boolean;
  certificate?: Certificate;
  auction?: Auction;
  bidTime?: string;
}

// GraphQL queries
const GET_MY_BIDS = gql`
  query GetMyBids {
    myBids {
      id
      certificateId
      auctionId
      interestRate
      bidTime
      bidDate
      status
      isWinningBid
      winningBid
      certificateNumber
      propertyAddress
      parcelId
      county
      certificate {
        faceValue
        interestRate
      }
      auction {
        name
        endTime
      }
    }
  }
`;

// GraphQL mutations
const INCREASE_BID = gql`
  mutation IncreaseBid($bidId: ID!, $newRate: Float!) {
    increaseBid(bidId: $bidId, rate: $newRate) {
      id
      interestRate
      status
      winningBid
    }
  }
`;

// Bid status labels
const statusLabels: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Active', color: 'blue' },
  WINNING: { label: 'Winning', color: 'success' },
  OUTBID: { label: 'Outbid', color: 'warning' },
  LOST: { label: 'Lost', color: 'gray' },
  WON: { label: 'Won', color: 'success' },
  CANCELLED: { label: 'Cancelled', color: 'purple' },
};

const BidderBidsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [newBidRate, setNewBidRate] = useState('');

  // Fetch bids data
  const { loading, error, data, refetch } = useQuery(GET_MY_BIDS);

  // Set up increase bid mutation
  const [increaseBid, { loading: submitting }] = useMutation(INCREASE_BID, {
    onCompleted: () => {
      setShowBidModal(false);
      refetch();
    },
  });

  // Format functions
  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      // Try parsing as a date string first
      const date = new Date(dateString);
      
      // Check if date is valid
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
      
      // If invalid, try parsing as timestamp
      const timestamp = parseInt(dateString);
      if (!isNaN(timestamp)) {
        const dateFromTimestamp = new Date(timestamp);
        if (!isNaN(dateFromTimestamp.getTime())) {
          return dateFromTimestamp.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        }
      }
      
      // If all parsing fails
      return 'Date unavailable';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date unavailable';
    }
  };

  // Sort bids by date
  const sortBids = (a: Bid, b: Bid) => {
    // Use bidDate if available, fall back to bidTime
    const aDate = a.bidDate ? new Date(a.bidDate) : a.bidTime ? new Date(a.bidTime) : new Date();
    const bDate = b.bidDate ? new Date(b.bidDate) : b.bidTime ? new Date(b.bidTime) : new Date();
    return bDate.getTime() - aDate.getTime();
  };

  // Filter and process bids
  const processBids = (bids: Bid[] = []) => {
    if (!bids) return [];

    return bids
      .filter(
        bid =>
          bid.certificateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bid.propertyAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bid.parcelId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bid.county?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(sortBids);
  };

  // Filter bids by status for tabs
  const activeBids = processBids(
    data?.myBids?.filter((bid: Bid) => ['ACTIVE', 'WINNING', 'OUTBID'].includes(bid.status))
  );

  const completedBids = processBids(
    data?.myBids?.filter((bid: Bid) => ['WON', 'LOST', 'CANCELLED'].includes(bid.status))
  );

  // Calculate time remaining for auction
  const getTimeRemaining = (endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const distance = end - now;

    if (distance < 0) return 'Ended';

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else {
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
  };

  // Handle opening the increase bid modal
  const handleOpenBidModal = (bid: Bid) => {
    setSelectedBid(bid);
    // For Florida tax certificates, we want to decrease the interest rate
    // Default to 0.25% lower than the current rate
    const newRate = Math.max(0, (bid.interestRate - 0.25));
    setNewBidRate(newRate.toFixed(2)); 
    setShowBidModal(true);
  };

  // Handle submitting the increased bid
  const handleIncreaseBid = () => {
    if (!selectedBid || !newBidRate) return;

    increaseBid({
      variables: {
        bidId: selectedBid.id,
        newRate: parseFloat(newBidRate),
      },
    });
  };

  // Render bid table
  const renderBidsTable = (bids: Bid[]) => {
    if (loading) {
      return (
        <div className="flex justify-center my-8">
          <Spinner size="xl" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-600 my-8">Error loading bids: {error.message}</div>
      );
    }

    if (bids.length === 0) {
      return (
        <div className="text-center my-8">
          <h3 className="text-xl font-medium text-gray-500">No bids found</h3>
          <p className="text-gray-500 mt-2">
            {searchTerm
              ? 'No bids match your search criteria.'
              : activeTab === 0
                ? "You don't have any active bids. Browse auctions to place bids."
                : "You don't have any completed bids yet."}
          </p>
          {!searchTerm && activeTab === 0 && (
            <Button color="blue" className="mt-4" as="a" href="/bidder/auctions">
              Browse Auctions
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Cert. #</Table.HeadCell>
            <Table.HeadCell>Property</Table.HeadCell>
            <Table.HeadCell>Interest Rate</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Actions</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {bids.map(bid => (
              <Table.Row
                key={bid.id}
                className={bid.status === 'OUTBID' ? 'bg-red-50' : 'bg-white hover:bg-gray-50'}
              >
                <Table.Cell className="font-medium">{bid.certificateNumber}</Table.Cell>
                <Table.Cell>
                  <div>
                    <div className="text-sm font-medium">{bid.propertyAddress}</div>
                    <div className="text-xs text-gray-500">
                      {bid.parcelId} | {bid.county}
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {formatPercent(bid.interestRate)}
                  {bid.certificate?.faceValue && (
                    <div className="text-xs text-gray-500">
                      Face Value: {formatCurrency(bid.certificate.faceValue)}
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell>{formatDate(bid.bidDate || bid.bidTime || '')}</Table.Cell>
                <Table.Cell>
                  <Badge color={statusLabels[bid.status]?.color || 'gray'}>
                    {statusLabels[bid.status]?.label || bid.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {/* Only show lower interest rate button for ongoing auctions */}
                  {['ACTIVE', 'OUTBID'].includes(bid.status) && (
                    <Button
                      size="xs"
                      color={bid.status === 'OUTBID' ? 'failure' : 'light'}
                      onClick={() => handleOpenBidModal(bid)}
                    >
                      <HiArrowUp className="mr-1" />
                      Lower Rate
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  };

  // Get auction ID from URL params to determine if we're in a county auction context
  const { auctionId } = useParams<{ auctionId: string }>();
  const isCountyContext = !!auctionId;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <>
      {/* CRITICAL PATH: County Header must be first element */}
      {isCountyContext && <CountyHeader />}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Bids</h1>
          <Button color="blue" onClick={() => refetch()}>
            Refresh Bids
          </Button>
        </div>

        <Card>
          <div className="mb-4 flex justify-between items-center">
            <div className="w-full md:w-1/3">
              <TextInput
                id="search"
                type="search"
                icon={HiSearch}
                placeholder="Search by certificate # or address"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <Button color="blue" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>

          <Tabs.Group aria-label="Bid tabs" style="underline" onActiveTabChange={setActiveTab}>
            <Tabs.Item
              title={
                <div className="flex items-center gap-2">
                  Active Bids
                  {activeBids.length > 0 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-blue-500 rounded-full">
                      {activeBids.length}
                    </span>
                  )}
                </div>
              }
            >
              {renderBidsTable(activeBids)}
            </Tabs.Item>

            <Tabs.Item title="Completed Bids">{renderBidsTable(completedBids)}</Tabs.Item>
          </Tabs.Group>

          {!loading && !error && activeBids.length > 0 && activeTab === 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-700">
                <p className="font-medium">Bidding Information</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-blue-600">
                  <li>Florida tax certificates are awarded to bidders offering the lowest interest rate</li>
                  <li>Bids must be in 0.25% increments</li>
                  <li>You will be notified if someone bids a lower rate</li>
                  <li>If you win, the certificate will appear in your &quot;My Certificates&quot; page</li>
                  <li>Payment will be processed automatically for winning bids</li>
                </ul>
              </div>
            </div>
          )}
        </Card>

        {/* Increase Bid Modal - Renamed to "Lower Interest Rate" */}
        <Modal show={showBidModal} onClose={() => setShowBidModal(false)} popup size="md">
          <Modal.Header>Lower Interest Rate</Modal.Header>
          <Modal.Body>
            {selectedBid && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Certificate #{selectedBid.certificateNumber}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedBid.propertyAddress || selectedBid.certificate?.propertyAddress || 'N/A'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Face Value:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedBid.certificate?.faceValue || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Certificate Interest Rate:</span>
                    <span className="font-medium">{selectedBid.certificate?.interestRate || 0}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Your Current Bid Rate:</span>
                    <span className="font-medium">{formatPercent(selectedBid.interestRate)}</span>
                  </div>
                  {selectedBid.status === 'OUTBID' && (
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Current Lowest Rate:</span>
                      <span className="font-medium">
                        {formatPercent(selectedBid.winningBid ? 0 : selectedBid.interestRate + 0.25)}
                      </span>
                    </div>
                  )}
                </div>

                {selectedBid.status === 'OUTBID' && (
                  <div className="p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                    <div className="flex items-center">
                      <HiOutlineExclamationCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">You&apos;ve been outbid</span>
                    </div>
                    <p className="mt-1">
                      Your bid must be at least 0.25% lower than the current lowest bid to become the winning bidder.
                    </p>
                  </div>
                )}

                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="bidRate" value="New Interest Rate (%)" />
                  </div>
                  <TextInput
                    id="bidRate"
                    type="number"
                    step="0.25"
                    min={0}
                    max={18}
                    value={newBidRate}
                    onChange={e => setNewBidRate(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter a rate between 0% and 18% in 0.25% increments</p>
                </div>

                {selectedBid.auction?.endTime && (
                  <div className="text-sm text-gray-600">
                    <p>Time remaining: {getTimeRemaining(selectedBid.auction.endTime)}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Button color="gray" onClick={() => setShowBidModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    color="blue"
                    onClick={handleIncreaseBid}
                    isProcessing={submitting}
                    disabled={
                      submitting ||
                      !newBidRate ||
                      parseFloat(newBidRate) >= selectedBid.interestRate ||
                      (selectedBid.status === 'OUTBID' &&
                        parseFloat(newBidRate) >= (selectedBid.interestRate - 0.25)) ||
                      parseFloat(newBidRate) < 0 ||
                      parseFloat(newBidRate) > 18 ||
                      (parseFloat(newBidRate) * 4) % 1 !== 0 // Check for 0.25% increments
                    }
                  >
                    Submit Lower Rate
                  </Button>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default BidderBidsPage;
