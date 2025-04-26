import React, { useState } from 'react';
import { Card, Table, Badge, Button, Spinner, Tabs, TextInput, Modal, Label } from 'flowbite-react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { HiSearch, HiOutlineExclamationCircle, HiArrowUp } from 'react-icons/hi';

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
  bidAmount: number;
  bidDate: string;
  status: string;
  winningBid?: number;
  certificate?: Certificate;
  auction?: Auction;
}

// GraphQL queries
const GET_MY_BIDS = gql`
  query GetMyBids {
    myBids {
      id
      certificateId
      auctionId
      certificateNumber
      propertyAddress
      parcelId
      county
      bidAmount
      bidDate
      status
      winningBid
      certificate {
        faceValue
        interestRate
        propertyAddress
        ownerName
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
  mutation IncreaseBid($bidId: ID!, $newAmount: Float!) {
    increaseBid(bidId: $bidId, amount: $newAmount) {
      id
      bidAmount
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
  const [newBidAmount, setNewBidAmount] = useState('');

  // Fetch bids data
  const { loading, error, data, refetch } = useQuery(GET_MY_BIDS);

  // Set up increase bid mutation
  const [increaseBid, { loading: submitting }] = useMutation(INCREASE_BID, {
    onCompleted: () => {
      setShowBidModal(false);
      refetch();
    },
  });

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
      .sort((a, b) => new Date(b.bidDate).getTime() - new Date(a.bidDate).getTime());
  };

  // Filter bids by status for tabs
  const activeBids = processBids(
    data?.myBids?.filter((bid: Bid) => ['ACTIVE', 'WINNING', 'OUTBID'].includes(bid.status))
  );

  const completedBids = processBids(
    data?.myBids?.filter((bid: Bid) => ['WON', 'LOST', 'CANCELLED'].includes(bid.status))
  );

  // Format functions
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
    setNewBidAmount((bid.bidAmount * 1.05).toFixed(2)); // Default 5% increase
    setShowBidModal(true);
  };

  // Handle submitting the increased bid
  const handleIncreaseBid = () => {
    if (!selectedBid || !newBidAmount) return;

    increaseBid({
      variables: {
        bidId: selectedBid.id,
        newAmount: parseFloat(newBidAmount),
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
            <Table.HeadCell>Certificate #</Table.HeadCell>
            <Table.HeadCell>Property</Table.HeadCell>
            <Table.HeadCell>County</Table.HeadCell>
            <Table.HeadCell>Auction</Table.HeadCell>
            <Table.HeadCell>Your Bid</Table.HeadCell>
            <Table.HeadCell>Bid Date</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Actions</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {bids.map(bid => (
              <Table.Row key={bid.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {bid.certificateNumber}
                </Table.Cell>
                <Table.Cell>
                  {bid.propertyAddress || bid.certificate?.propertyAddress || 'N/A'}
                </Table.Cell>
                <Table.Cell>{bid.county}</Table.Cell>
                <Table.Cell>
                  {bid.auction?.name || 'N/A'}
                  {bid.auction?.endTime && bid.status !== 'WON' && bid.status !== 'LOST' && (
                    <div className="text-xs text-gray-500 mt-1">
                      {getTimeRemaining(bid.auction.endTime)} remaining
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {formatCurrency(bid.bidAmount)}
                  {bid.status === 'OUTBID' && (
                    <div className="text-xs text-red-500 mt-1">
                      Current highest: {formatCurrency(bid.winningBid || 0)}
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell>{formatDate(bid.bidDate)}</Table.Cell>
                <Table.Cell>
                  <Badge color={statusLabels[bid.status]?.color || 'gray'}>
                    {statusLabels[bid.status]?.label || bid.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {['ACTIVE', 'OUTBID'].includes(bid.status) && (
                    <Button
                      size="xs"
                      color={bid.status === 'OUTBID' ? 'warning' : 'blue'}
                      onClick={() => handleOpenBidModal(bid)}
                    >
                      <HiArrowUp className="mr-1 h-4 w-4" />
                      {bid.status === 'OUTBID' ? 'Increase Bid' : 'Update Bid'}
                    </Button>
                  )}
                  {['WINNING', 'WON'].includes(bid.status) && (
                    <Button
                      size="xs"
                      color="light"
                      as="a"
                      href={`/bidder/certificates/${bid.certificateId}`}
                    >
                      View Certificate
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

  return (
    <div className="px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Bids</h1>
        <p className="text-gray-600">View and manage your bids on tax certificates</p>
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
                <li>You will be notified if you are outbid on a certificate</li>
                <li>You can increase your bid at any time before the auction ends</li>
                <li>
                  If you win, the certificate will appear in your &quot;My Certificates&quot; page
                </li>
                <li>Payment will be processed automatically for winning bids</li>
              </ul>
            </div>
          </div>
        )}
      </Card>

      {/* Increase Bid Modal */}
      <Modal show={showBidModal} onClose={() => setShowBidModal(false)} popup size="md">
        <Modal.Header>Increase Bid</Modal.Header>
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
                  <span>Interest Rate:</span>
                  <span className="font-medium">{selectedBid.certificate?.interestRate || 0}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Your Current Bid:</span>
                  <span className="font-medium">{formatCurrency(selectedBid.bidAmount)}</span>
                </div>
                {selectedBid.status === 'OUTBID' && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Current Highest Bid:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedBid.winningBid || 0)}
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
                    Your bid needs to be at least{' '}
                    {formatCurrency((selectedBid.winningBid || 0) * 1.01)} to become the highest
                    bidder.
                  </p>
                </div>
              )}

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="bidAmount" value="New Bid Amount ($)" />
                </div>
                <TextInput
                  id="bidAmount"
                  type="number"
                  step="0.01"
                  min={
                    selectedBid.status === 'OUTBID'
                      ? (selectedBid.winningBid || 0) * 1.01
                      : selectedBid.bidAmount * 1.01
                  }
                  value={newBidAmount}
                  onChange={e => setNewBidAmount(e.target.value)}
                  required
                />
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
                    !newBidAmount ||
                    parseFloat(newBidAmount) <= selectedBid.bidAmount ||
                    (selectedBid.status === 'OUTBID' &&
                      parseFloat(newBidAmount) <= (selectedBid.winningBid || 0))
                  }
                >
                  Confirm New Bid
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BidderBidsPage;
