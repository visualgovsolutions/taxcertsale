import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, Button, Spinner, Badge, Table, TextInput, Alert } from 'flowbite-react';
import { HiArrowLeft, HiExclamationCircle, HiCheckCircle, HiInformationCircle } from 'react-icons/hi';

// Types for the data
interface Certificate {
  id: string;
  certificateNumber: string;
  faceValue: number;
  status: string;
  interestRate: number;
  parcelId?: string;
  propertyAddress?: string;
  auction?: {
    id: string;
    name: string;
    countyId: string;
  };
  property?: {
    id: string;
    parcelId: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    landValue: number;
    buildingValue: number;
    totalAssessedValue: number;
    acreage: number;
    propertyClass: string;
    yearBuilt?: number;
    taxYear: number;
    ownerName?: string;
  };
}

interface Bid {
  id: string;
  certificateId: string;
  userId: string;
  interestRate: number;
  bidTime: string;
  isWinningBid: boolean;
}

// GraphQL queries and mutations
const GET_CERTIFICATE_DETAILS = gql`
  query GetCertificateDetails($certificateId: ID!) {
    certificate(id: $certificateId) {
      id
      certificateNumber
      faceValue
      status
      interestRate
      parcelId
      propertyAddress
      auction {
        id
        name
        countyId
      }
      property {
        id
        parcelId
        address
        city
        state
        zipCode
        landValue
        buildingValue
        totalAssessedValue
        acreage
        propertyClass
        yearBuilt
        taxYear
        ownerName
      }
    }
  }
`;

const GET_MY_BIDS_FOR_CERTIFICATE = gql`
  query GetMyBidsForCertificate($certificateId: ID!) {
    myBidsForCertificate(certificateId: $certificateId) {
      id
      certificateId
      userId
      interestRate
      bidTime
      isWinningBid
    }
  }
`;

const GET_APPRAISER_INFO = gql`
  query GetAppraiserInfo($countyId: ID!) {
    county(id: $countyId) {
      id
      name
      state
      appraiserName
      appraiserPhone
      appraiserEmail
      appraiserWebsite
    }
  }
`;

const PLACE_BID = gql`
  mutation PlaceBid($certificateId: ID!, $interestRate: Float!) {
    placeBid(certificateId: $certificateId, interestRate: $interestRate) {
      id
      interestRate
      bidTime
      isWinningBid
    }
  }
`;

const BidderParcelDetailsPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const navigate = useNavigate();
  const [bidRate, setBidRate] = useState<string>('18');
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);

  // Fetch certificate details
  const { 
    loading: loadingCertificate, 
    error: errorCertificate, 
    data: certificateData 
  } = useQuery(GET_CERTIFICATE_DETAILS, {
    variables: { certificateId },
    skip: !certificateId
  });

  // Fetch user's bids for this certificate
  const { 
    loading: loadingMyBids, 
    error: errorMyBids, 
    data: myBidsData,
    refetch: refetchMyBids
  } = useQuery(GET_MY_BIDS_FOR_CERTIFICATE, {
    variables: { certificateId },
    skip: !certificateId
  });

  // Fetch appraiser info
  const {
    loading: loadingAppraiser,
    error: errorAppraiser,
    data: appraiserData
  } = useQuery(GET_APPRAISER_INFO, {
    variables: { countyId: certificateData?.certificate?.auction?.countyId },
    skip: !certificateData?.certificate?.auction?.countyId
  });

  // Bid mutation
  const [placeBid, { loading: placingBid }] = useMutation(PLACE_BID, {
    onCompleted: (data) => {
      setBidSuccess(`Bid placed successfully at ${data.placeBid.interestRate}% interest rate`);
      setBidError(null);
      refetchMyBids();
    },
    onError: (error) => {
      setBidError(`Failed to place bid: ${error.message}`);
      setBidSuccess(null);
    }
  });

  // Handle bidding
  const handlePlaceBid = () => {
    setBidError(null);
    setBidSuccess(null);
    
    const rate = parseFloat(bidRate);
    if (isNaN(rate) || rate <= 0) {
      setBidError('Please enter a valid interest rate');
      return;
    }
    
    placeBid({
      variables: {
        certificateId,
        interestRate: rate
      }
    });
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Format date values
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Check if user has already bid
  const hasExistingBid = myBidsData?.myBidsForCertificate?.length > 0;
  const lowestBidRate = hasExistingBid ? 
    Math.min(...myBidsData.myBidsForCertificate.map((bid: Bid) => bid.interestRate)) : 
    null;

  // Loading state
  if (loadingCertificate) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="xl" />
        <span className="ml-2">Loading certificate details...</span>
      </div>
    );
  }

  // Error state
  if (errorCertificate) {
    return (
      <div className="px-4 pt-6">
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
          <h3 className="text-lg font-medium">Error loading certificate details</h3>
          <p>{errorCertificate.message || 'Unknown error occurred'}</p>
          <Button color="gray" onClick={() => navigate(-1)}>
            <HiArrowLeft className="mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const certificate = certificateData?.certificate;
  const property = certificate?.property;
  const appraiser = appraiserData?.county;

  return (
    <div className="px-4 pt-6">
      {/* Navigation header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button color="gray" className="mr-4" onClick={() => navigate(-1)}>
            <HiArrowLeft className="mr-2" /> Back to Auctions
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Parcel Details</h1>
        </div>
        <Badge color="dark">Certificate #{certificate?.certificateNumber}</Badge>
      </div>

      {/* Alerts for bid status */}
      {bidSuccess && (
        <Alert color="success" className="mb-4">
          <div className="flex items-center">
            <HiCheckCircle className="mr-2 h-5 w-5" />
            <span>{bidSuccess}</span>
          </div>
        </Alert>
      )}
      
      {bidError && (
        <Alert color="failure" className="mb-4">
          <div className="flex items-center">
            <HiExclamationCircle className="mr-2 h-5 w-5" />
            <span>{bidError}</span>
          </div>
        </Alert>
      )}

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property information card */}
        <Card className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Property Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Parcel ID</p>
              <p className="font-medium">{property?.parcelId || certificate?.parcelId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Owner</p>
              <p className="font-medium">{property?.ownerName || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Property Address</p>
              <p className="font-medium">
                {property?.address ? 
                  `${property.address}, ${property.city}, ${property.state} ${property.zipCode}` : 
                  certificate?.propertyAddress || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Acreage</p>
              <p className="font-medium">{property?.acreage || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year Built</p>
              <p className="font-medium">{property?.yearBuilt || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Property Class</p>
              <p className="font-medium">{property?.propertyClass || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tax Year</p>
              <p className="font-medium">{property?.taxYear || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Land Value</p>
              <p className="font-medium">{property?.landValue ? formatCurrency(property.landValue) : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Building Value</p>
              <p className="font-medium">{property?.buildingValue ? formatCurrency(property.buildingValue) : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Assessed Value</p>
              <p className="font-medium">{property?.totalAssessedValue ? formatCurrency(property.totalAssessedValue) : 'N/A'}</p>
            </div>
          </div>
        </Card>

        {/* Certificate and bidding card */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Certificate Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Certificate Number</p>
              <p className="font-medium">{certificate?.certificateNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Face Value</p>
              <p className="font-medium text-lg">{formatCurrency(certificate?.faceValue || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge
                color={
                  certificate?.status === 'AVAILABLE' || certificate?.status === 'AUCTION_ACTIVE'
                    ? 'success'
                    : 'gray'
                }
                className="mt-1"
              >
                {certificate?.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Interest Rate</p>
              <p className="font-medium text-lg">{certificate?.interestRate || 18}%</p>
            </div>

            {/* Bidding form */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Place Your Bid</h3>
              {hasExistingBid && (
                <Alert color="info" className="mb-3">
                  <div className="flex items-center">
                    <HiInformationCircle className="mr-2 h-5 w-5" />
                    <span>You already have a bid at {lowestBidRate}% interest rate</span>
                  </div>
                </Alert>
              )}
              <div className="flex items-center">
                <TextInput
                  className="flex-grow"
                  type="number"
                  step="0.01"
                  min="0.25"
                  max="18"
                  value={bidRate}
                  onChange={(e) => setBidRate(e.target.value)}
                  placeholder="Interest rate (%)"
                  sizing="sm"
                />
                <span className="mx-2">%</span>
                <Button
                  color="blue"
                  size="sm"
                  onClick={handlePlaceBid}
                  disabled={placingBid}
                >
                  {placingBid ? <Spinner size="sm" className="mr-2" /> : null}
                  Place Bid
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Enter an interest rate between 0.25% and 18%
              </p>
            </div>
          </div>
        </Card>

        {/* Appraiser information */}
        <Card className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">County Appraiser Information</h2>
          {loadingAppraiser ? (
            <div className="flex justify-center py-4">
              <Spinner size="md" />
            </div>
          ) : errorAppraiser ? (
            <p className="text-sm text-red-500">Error loading appraiser information</p>
          ) : appraiser ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">County</p>
                <p className="font-medium">{appraiser.name}, {appraiser.state}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Appraiser Name</p>
                <p className="font-medium">{appraiser.appraiserName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{appraiser.appraiserPhone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{appraiser.appraiserEmail || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Website</p>
                <a 
                  href={appraiser.appraiserWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {appraiser.appraiserWebsite || 'N/A'}
                </a>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Appraiser information not available</p>
          )}
        </Card>

        {/* Bid history card */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Bid History</h2>
          {loadingMyBids ? (
            <div className="flex justify-center py-4">
              <Spinner size="md" />
            </div>
          ) : errorMyBids ? (
            <p className="text-sm text-red-500">Error loading your bids</p>
          ) : myBidsData?.myBidsForCertificate?.length > 0 ? (
            <Table striped>
              <Table.Head>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Rate</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {myBidsData.myBidsForCertificate.map((bid: Bid) => (
                  <Table.Row key={bid.id} className="hover:bg-gray-50">
                    <Table.Cell>{formatDate(bid.bidTime)}</Table.Cell>
                    <Table.Cell>{bid.interestRate}%</Table.Cell>
                    <Table.Cell>
                      <Badge color={bid.isWinningBid ? 'success' : 'gray'}>
                        {bid.isWinningBid ? 'Winning' : 'Active'}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <p className="text-sm text-gray-500">You haven't placed any bids on this certificate yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BidderParcelDetailsPage; 