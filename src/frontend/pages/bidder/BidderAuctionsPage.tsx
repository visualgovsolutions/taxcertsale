import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Card, Table, Badge, Button, Spinner, Dropdown, Tabs } from 'flowbite-react';
import { HiCalendar, HiLocationMarker, HiClock, HiInformationCircle } from 'react-icons/hi';

// Define types for our data
interface Certificate {
  id: string;
  certificateNumber: string;
  parcelId: string;
  propertyAddress?: string;
  ownerName?: string;
  faceValue: number;
  status: string;
  interestRate: number;
}

interface Auction {
  id: string;
  name: string;
  auctionDate: string;
  startTime: string;
  endTime?: string;
  status: string;
  description?: string;
  location?: string;
  countyId: string;
}

// GraphQL queries
const GET_ACTIVE_AUCTIONS = gql`
  query GetActiveAuctions {
    activeAuctions {
      id
      name
      auctionDate
      startTime
      endTime
      status
      description
      location
      countyId
    }
  }
`;

const GET_UPCOMING_AUCTIONS = gql`
  query GetUpcomingAuctions {
    upcomingAuctions {
      id
      name
      auctionDate
      startTime
      status
      description
      location
      countyId
    }
  }
`;

const GET_CERTIFICATES_BY_AUCTION = gql`
  query GetCertificatesByAuction($auctionId: ID!) {
    certificatesByAuction(auctionId: $auctionId) {
      id
      certificateNumber
      parcelId
      propertyAddress
      ownerName
      faceValue
      status
      interestRate
    }
  }
`;

const BidderAuctionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('faceValue');
  const [sortDirection, setSortDirection] = useState('desc');

  // Fetch active auctions
  const {
    loading: loadingActive,
    error: errorActive,
    data: activeAuctionsData,
  } = useQuery(GET_ACTIVE_AUCTIONS);

  // Fetch upcoming auctions
  const {
    loading: loadingUpcoming,
    error: errorUpcoming,
    data: upcomingAuctionsData,
  } = useQuery(GET_UPCOMING_AUCTIONS);

  // Fetch certificates for selected auction
  const {
    loading: loadingCertificates,
    error: errorCertificates,
    data: certificatesData,
    refetch: refetchCertificates,
  } = useQuery(GET_CERTIFICATES_BY_AUCTION, {
    variables: { auctionId: selectedAuction },
    skip: !selectedAuction,
  });

  // Set first active auction as selected when data loads
  useEffect(() => {
    if (activeAuctionsData?.activeAuctions?.length > 0 && !selectedAuction) {
      setSelectedAuction(activeAuctionsData.activeAuctions[0].id);
    }
  }, [activeAuctionsData, selectedAuction]);

  // Handle auction selection
  const handleAuctionSelect = (auctionId: string) => {
    setSelectedAuction(auctionId);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Filter and sort certificates
  const filteredCertificates = certificatesData?.certificatesByAuction
    ? certificatesData.certificatesByAuction
        .filter(
          (cert: Certificate) =>
            cert.propertyAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.parcelId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a: Certificate, b: Certificate) => {
          const aValue = a[sortField as keyof Certificate];
          const bValue = b[sortField as keyof Certificate];

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
          }

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          return 0;
        })
    : [];

  // Get current auction data
  const currentAuction =
    selectedAuction &&
    [
      ...(activeAuctionsData?.activeAuctions || []),
      ...(upcomingAuctionsData?.upcomingAuctions || []),
    ].find((auction: Auction) => auction.id === selectedAuction);

  // Handle place bid action
  const handlePlaceBid = (certificateId: string) => {
    alert(`Place bid on certificate ${certificateId}`);
    // This would trigger a modal or navigate to a bid page in a real implementation
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tax Certificate Auctions</h1>
        <p className="text-gray-600">Browse active and upcoming tax certificate auctions</p>
      </div>

      <Tabs.Group
        style="pills"
        onActiveTabChange={tab => setActiveTab(tab === 0 ? 'active' : 'upcoming')}
      >
        <Tabs.Item
          title={
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Active Auctions
            </div>
          }
          active={activeTab === 'active'}
        >
          {loadingActive ? (
            <div className="flex justify-center my-8">
              <Spinner size="xl" />
            </div>
          ) : errorActive ? (
            <div className="text-center text-red-600 my-8">
              Error loading auctions: {errorActive.message}
            </div>
          ) : activeAuctionsData?.activeAuctions?.length === 0 ? (
            <div className="text-center my-8">
              <p className="text-gray-500">No active auctions at this time.</p>
              <p className="text-gray-500">Check back later or view upcoming auctions.</p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-4">
              {activeAuctionsData?.activeAuctions?.map((auction: Auction) => (
                <Card
                  key={auction.id}
                  className={`hover:bg-gray-50 ${
                    selectedAuction === auction.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleAuctionSelect(auction.id)}
                >
                  <div className="flex justify-between items-start">
                    <h5 className="text-xl font-bold text-gray-900">{auction.name}</h5>
                    <Badge color="success">Active</Badge>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center">
                      <HiCalendar className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-gray-700">{formatDate(auction.auctionDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <HiClock className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-gray-700">
                        {formatTime(auction.startTime)} -{' '}
                        {auction.endTime ? formatTime(auction.endTime) : 'Ongoing'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <HiLocationMarker className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-gray-700">{auction.location || 'Online'}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      color="blue"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleAuctionSelect(auction.id);
                      }}
                      fullSized
                    >
                      View Certificates
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Tabs.Item>

        <Tabs.Item title="Upcoming Auctions" active={activeTab === 'upcoming'}>
          {loadingUpcoming ? (
            <div className="flex justify-center my-8">
              <Spinner size="xl" />
            </div>
          ) : errorUpcoming ? (
            <div className="text-center text-red-600 my-8">
              Error loading auctions: {errorUpcoming.message}
            </div>
          ) : upcomingAuctionsData?.upcomingAuctions?.length === 0 ? (
            <div className="text-center my-8">
              <p className="text-gray-500">No upcoming auctions scheduled.</p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-4">
              {upcomingAuctionsData?.upcomingAuctions?.map((auction: any) => (
                <Card
                  key={auction.id}
                  className={`hover:bg-gray-50 ${selectedAuction === auction.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleAuctionSelect(auction.id)}
                >
                  <div className="flex justify-between items-start">
                    <h5 className="text-xl font-bold text-gray-900">{auction.name}</h5>
                    <Badge color="purple">Upcoming</Badge>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center">
                      <HiCalendar className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-gray-700">{formatDate(auction.auctionDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <HiClock className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-gray-700">{formatTime(auction.startTime)}</span>
                    </div>
                    <div className="flex items-center">
                      <HiLocationMarker className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-gray-700">{auction.location || 'Online'}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      color="purple"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleAuctionSelect(auction.id);
                      }}
                      fullSized
                    >
                      Preview Certificates
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Tabs.Item>
      </Tabs.Group>

      {selectedAuction && currentAuction && (
        <div className="mt-8">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {currentAuction.name} - Available Certificates
              </h2>
              <Badge color={currentAuction.status === 'ACTIVE' ? 'success' : 'purple'}>
                {currentAuction.status === 'ACTIVE' ? 'Active' : 'Upcoming'}
              </Badge>
            </div>

            <div className="mb-4 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
              <div className="w-full md:w-1/3">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="search"
                    className="block w-full p-2.5 pl-10 text-sm border border-gray-300 rounded-lg"
                    placeholder="Search by property address or parcel ID"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Dropdown label="Sort By" color="light">
                  <Dropdown.Item
                    onClick={() => {
                      setSortField('faceValue');
                      setSortDirection('desc');
                    }}
                  >
                    Face Value (High to Low)
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setSortField('faceValue');
                      setSortDirection('asc');
                    }}
                  >
                    Face Value (Low to High)
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setSortField('interestRate');
                      setSortDirection('desc');
                    }}
                  >
                    Interest Rate (High to Low)
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setSortField('interestRate');
                      setSortDirection('asc');
                    }}
                  >
                    Interest Rate (Low to High)
                  </Dropdown.Item>
                </Dropdown>

                <Button color="light" onClick={() => refetchCertificates()}>
                  Refresh
                </Button>
              </div>
            </div>

            {loadingCertificates ? (
              <div className="flex justify-center my-8">
                <Spinner size="xl" />
              </div>
            ) : errorCertificates ? (
              <div className="text-center text-red-600 my-8">
                Error loading certificates: {errorCertificates.message}
              </div>
            ) : filteredCertificates.length === 0 ? (
              <div className="text-center my-8">
                <p className="text-gray-500">No certificates found for this auction.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table striped>
                  <Table.Head>
                    <Table.HeadCell>Certificate #</Table.HeadCell>
                    <Table.HeadCell>Parcel ID</Table.HeadCell>
                    <Table.HeadCell>Property Address</Table.HeadCell>
                    <Table.HeadCell>Owner</Table.HeadCell>
                    <Table.HeadCell>Face Value</Table.HeadCell>
                    <Table.HeadCell>Interest Rate</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>
                      <span className="sr-only">Actions</span>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {filteredCertificates.map((certificate: Certificate) => (
                      <Table.Row
                        key={certificate.id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {certificate.certificateNumber}
                        </Table.Cell>
                        <Table.Cell>{certificate.parcelId}</Table.Cell>
                        <Table.Cell>{certificate.propertyAddress || 'N/A'}</Table.Cell>
                        <Table.Cell>{certificate.ownerName || 'N/A'}</Table.Cell>
                        <Table.Cell>{formatCurrency(certificate.faceValue)}</Table.Cell>
                        <Table.Cell>
                          {certificate.interestRate ? `${certificate.interestRate}%` : 'N/A'}
                        </Table.Cell>
                        <Table.Cell>
                          <Badge
                            color={
                              certificate.status === 'AUCTION_ACTIVE'
                                ? 'success'
                                : certificate.status === 'AUCTION_SCHEDULED'
                                  ? 'purple'
                                  : 'gray'
                            }
                          >
                            {certificate.status.replace('AUCTION_', '')}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex justify-end">
                            <Button.Group>
                              <Button
                                color="light"
                                size="xs"
                                onClick={() =>
                                  window.open(`/bidder/certificates/${certificate.id}`, '_blank')
                                }
                              >
                                <HiInformationCircle className="mr-2 h-4 w-4" />
                                Details
                              </Button>
                              {currentAuction.status === 'ACTIVE' && (
                                <Button
                                  color="blue"
                                  size="xs"
                                  onClick={() => handlePlaceBid(certificate.id)}
                                >
                                  Place Bid
                                </Button>
                              )}
                            </Button.Group>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            )}

            {currentAuction.status === 'ACTIVE' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start">
                <HiInformationCircle className="w-5 h-5 text-blue-700 mt-0.5 mr-2" />
                <div>
                  <p className="text-blue-700 font-medium">Bidding Information</p>
                  <p className="text-blue-600 text-sm mt-1">
                    This auction is currently active. You can place bids on certificates until{' '}
                    {formatDate(currentAuction.endTime || currentAuction.auctionDate)} at{' '}
                    {formatTime(currentAuction.endTime || currentAuction.startTime)}.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default BidderAuctionsPage;
