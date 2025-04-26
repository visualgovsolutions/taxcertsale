import React, { useState } from 'react';
import { Card, Table, Badge, Button, Spinner, Dropdown, TextInput } from 'flowbite-react';
import { useQuery, gql } from '@apollo/client';
import { HiSearch, HiDocumentReport, HiExternalLink, HiDownload } from 'react-icons/hi';

// Define interface for certificate data
interface Certificate {
  id: string;
  certificateNumber: string;
  parcelId: string;
  propertyAddress?: string;
  ownerName?: string;
  faceValue: number;
  interestRate: number;
  purchaseDate: string;
  redemptionAmount?: number;
  status: string;
  countyName: string;
  auctionName?: string;
}

// GraphQL query to fetch bidder's certificates
const GET_MY_CERTIFICATES = gql`
  query GetMyCertificates {
    myCertificates {
      id
      certificateNumber
      parcelId
      propertyAddress
      ownerName
      faceValue
      interestRate
      purchaseDate
      redemptionAmount
      status
      countyName
      auctionName
    }
  }
`;

const BidderCertificatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('purchaseDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Fetch certificates data
  const { loading, error, data, refetch } = useQuery(GET_MY_CERTIFICATES);

  // Handle data filtering and sorting
  const filteredCertificates = data?.myCertificates
    ? data.myCertificates
        .filter(
          (cert: Certificate) =>
            // Apply status filter
            (filterStatus === 'ALL' || cert.status === filterStatus) &&
            // Apply search filter
            (cert.certificateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              cert.parcelId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              cert.propertyAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              cert.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              cert.countyName?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a: Certificate, b: Certificate) => {
          // Apply sorting
          if (
            sortField === 'faceValue' ||
            sortField === 'redemptionAmount' ||
            sortField === 'interestRate'
          ) {
            return sortDirection === 'asc'
              ? parseFloat(a[sortField as keyof Certificate] as string) -
                  parseFloat(b[sortField as keyof Certificate] as string)
              : parseFloat(b[sortField as keyof Certificate] as string) -
                  parseFloat(a[sortField as keyof Certificate] as string);
          }

          if (sortField === 'purchaseDate') {
            return sortDirection === 'asc'
              ? new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
              : new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
          }

          // Default string comparison
          const aValue = a[sortField as keyof Certificate];
          const bValue = b[sortField as keyof Certificate];

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          return 0;
        })
    : [];

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

  // Handle certificate details
  const handleViewCertificate = (certificateId: string) => {
    window.open(`/certificates/${certificateId}`, '_blank');
  };

  // Handle certificate download
  const handleDownloadCertificate = (certificateId: string) => {
    alert(`Downloading certificate ${certificateId}`);
    // In a real implementation, this would trigger the download
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Tax Certificates</h1>
        <p className="text-gray-600">View and manage your purchased tax certificates</p>
      </div>

      <Card>
        <div className="mb-4 flex flex-col md:flex-row justify-between gap-4">
          <div className="w-full md:w-1/3">
            <TextInput
              id="search"
              type="search"
              icon={HiSearch}
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Dropdown label="Filter Status">
              <Dropdown.Item
                onClick={() => setFilterStatus('ALL')}
                className={filterStatus === 'ALL' ? 'bg-gray-100' : ''}
              >
                All Certificates
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => setFilterStatus('ACTIVE')}
                className={filterStatus === 'ACTIVE' ? 'bg-gray-100' : ''}
              >
                Active
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => setFilterStatus('REDEEMED')}
                className={filterStatus === 'REDEEMED' ? 'bg-gray-100' : ''}
              >
                Redeemed
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => setFilterStatus('MATURED')}
                className={filterStatus === 'MATURED' ? 'bg-gray-100' : ''}
              >
                Matured
              </Dropdown.Item>
            </Dropdown>

            <Dropdown label="Sort By">
              <Dropdown.Item
                onClick={() => {
                  setSortField('purchaseDate');
                  setSortDirection('desc');
                }}
              >
                Purchase Date (Newest)
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setSortField('purchaseDate');
                  setSortDirection('asc');
                }}
              >
                Purchase Date (Oldest)
              </Dropdown.Item>
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
            </Dropdown>

            <Button color="blue" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center my-8">
            <Spinner size="xl" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 my-8">
            Error loading certificates: {error.message}
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="text-center my-8">
            <div className="flex justify-center mb-4">
              <HiDocumentReport className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Certificates Found</h2>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'ALL'
                ? 'No certificates match your current filters. Try adjusting your search criteria.'
                : "You haven't purchased any tax certificates yet. Browse available auctions to get started."}
            </p>
            {!searchTerm && filterStatus === 'ALL' && (
              <Button color="blue" className="mt-4" as="a" href="/bidder/auctions">
                Browse Auctions
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table striped>
              <Table.Head>
                <Table.HeadCell>Certificate #</Table.HeadCell>
                <Table.HeadCell>County</Table.HeadCell>
                <Table.HeadCell>Property Address</Table.HeadCell>
                <Table.HeadCell>Purchase Date</Table.HeadCell>
                <Table.HeadCell>Face Value</Table.HeadCell>
                <Table.HeadCell>Interest Rate</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Actions</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {filteredCertificates.map((certificate: Certificate) => (
                  <Table.Row
                    key={certificate.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {certificate.certificateNumber}
                    </Table.Cell>
                    <Table.Cell>{certificate.countyName}</Table.Cell>
                    <Table.Cell>{certificate.propertyAddress || 'N/A'}</Table.Cell>
                    <Table.Cell>{formatDate(certificate.purchaseDate)}</Table.Cell>
                    <Table.Cell>{formatCurrency(certificate.faceValue)}</Table.Cell>
                    <Table.Cell>{certificate.interestRate}%</Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={
                          certificate.status === 'ACTIVE'
                            ? 'success'
                            : certificate.status === 'REDEEMED'
                              ? 'purple'
                              : certificate.status === 'MATURED'
                                ? 'warning'
                                : 'gray'
                        }
                      >
                        {certificate.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="xs"
                          color="light"
                          onClick={() => handleViewCertificate(certificate.id)}
                        >
                          <HiExternalLink className="mr-1 h-4 w-4" />
                          View
                        </Button>
                        <Button
                          size="xs"
                          color="light"
                          onClick={() => handleDownloadCertificate(certificate.id)}
                        >
                          <HiDownload className="mr-1 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}

        {!loading && !error && filteredCertificates.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-700">
              <p className="font-medium">Certificate Information</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-blue-600">
                <li>Active certificates can be redeemed by property owners at any time</li>
                <li>You will receive interest payments when certificates are redeemed</li>
                <li>
                  Certificates mature after 2 years and become eligible for tax deed application
                </li>
                <li>Download certificates for your records or for tax purposes</li>
              </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BidderCertificatesPage;
