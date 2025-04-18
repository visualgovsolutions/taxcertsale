import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Badge, Button, Spinner, Tabs, Table, Alert } from 'flowbite-react';
import {
  HiCalendar,
  HiClock,
  HiLocationMarker,
  HiInformationCircle,
  HiExternalLink,
} from 'react-icons/hi';
import { format } from 'date-fns';
import axios from 'axios';

interface Certificate {
  id: string;
  certificateNumber: string;
  faceValue: number;
  interestRate: number;
  status: string;
  property: {
    id: string;
    parcelId: string;
    address: string;
    city: string;
    zipCode: string;
  };
}

interface Auction {
  id: string;
  name: string;
  auctionDate: string;
  startTime: string;
  endTime: string;
  status: string;
  description: string;
  location: string;
  registrationUrl: string;
  certificates: Certificate[];
  county: {
    id: string;
    name: string;
    state: string;
  };
  metadata: Record<string, any>;
}

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/auctions/${id}/certificates`);
        setAuction(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load auction details. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchAuction();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge color="info">Scheduled</Badge>;
      case 'in_progress':
        return <Badge color="warning">In Progress</Badge>;
      case 'completed':
        return <Badge color="success">Completed</Badge>;
      case 'cancelled':
        return <Badge color="failure">Cancelled</Badge>;
      default:
        return <Badge color="gray">Unknown</Badge>;
    }
  };

  const getCertificateStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge color="success">Available</Badge>;
      case 'sold':
        return <Badge color="purple">Sold</Badge>;
      case 'redeemed':
        return <Badge color="info">Redeemed</Badge>;
      default:
        return <Badge color="gray">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 h-full">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert color="failure">
          <span className="font-medium">Error!</span> {error}
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button color="gray" onClick={() => navigate('/auctions')}>
            Back to Auctions
          </Button>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert color="warning">
          <span className="font-medium">Not Found!</span> Auction not found.
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button color="gray" onClick={() => navigate('/auctions')}>
            Back to Auctions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <Button color="gray" size="sm" onClick={() => navigate('/auctions')} className="mb-2">
            &larr; Back to Auctions
          </Button>
          <h1 className="text-3xl font-bold">{auction.name}</h1>
          <p className="text-gray-600">
            {auction.county.name} County, {auction.county.state}
          </p>
        </div>
        <div className="mt-4 md:mt-0">{getStatusBadge(auction.status)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <HiCalendar className="w-5 h-5 text-gray-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="text-lg font-semibold">{formatDate(auction.auctionDate)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <HiClock className="w-5 h-5 text-gray-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Time</h3>
              <p className="text-lg font-semibold">
                {auction.startTime} - {auction.endTime}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <HiLocationMarker className="w-5 h-5 text-gray-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="text-lg font-semibold">{auction.location}</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs.Group style="underline">
        <Tabs.Item title="Overview" icon={HiInformationCircle} active>
          <Card>
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {auction.description || 'No description available.'}
              </p>
            </div>

            {auction.registrationUrl && (
              <div className="mt-4">
                <Button color="dark" onClick={() => window.open(auction.registrationUrl, '_blank')}>
                  <HiExternalLink className="mr-2 h-5 w-5" />
                  Register for Auction
                </Button>
              </div>
            )}
          </Card>
        </Tabs.Item>

        <Tabs.Item title={`Certificates (${auction.certificates?.length || 0})`}>
          <Card>
            {auction.certificates?.length > 0 ? (
              <div className="overflow-x-auto">
                <Table striped>
                  <Table.Head>
                    <Table.HeadCell>Certificate Number</Table.HeadCell>
                    <Table.HeadCell>Property Address</Table.HeadCell>
                    <Table.HeadCell>Parcel ID</Table.HeadCell>
                    <Table.HeadCell>Face Value</Table.HeadCell>
                    <Table.HeadCell>Interest Rate</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Actions</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {auction.certificates.map(certificate => (
                      <Table.Row
                        key={certificate.id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {certificate.certificateNumber}
                        </Table.Cell>
                        <Table.Cell>
                          {certificate.property.address}
                          <br />
                          <span className="text-sm text-gray-500">
                            {certificate.property.city}, {certificate.property.zipCode}
                          </span>
                        </Table.Cell>
                        <Table.Cell>{certificate.property.parcelId}</Table.Cell>
                        <Table.Cell>{formatCurrency(certificate.faceValue)}</Table.Cell>
                        <Table.Cell>{certificate.interestRate}%</Table.Cell>
                        <Table.Cell>{getCertificateStatusBadge(certificate.status)}</Table.Cell>
                        <Table.Cell>
                          <Button
                            color="light"
                            size="xs"
                            onClick={() => navigate(`/certificates/${certificate.id}`)}
                          >
                            View Details
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No certificates are available for this auction yet.</p>
              </div>
            )}
          </Card>
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
};

export default AuctionDetailPage;
