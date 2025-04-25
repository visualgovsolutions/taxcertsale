/**
 * CertificateListTable Component
 *
 * Displays a table of tax certificates with management actions.
 * Supports filtering, searching, and actions like assigning to auctions and marking as redeemed.
 */

import React, { useState } from 'react';
import { Table, Button, Badge, TextInput } from 'flowbite-react';
import { useQuery, gql } from '@apollo/client';
import { format } from 'date-fns';
import { HiSearch } from 'react-icons/hi';

export const GET_CERTIFICATES = gql`
  query GetCertificates($search: String, $status: [CertificateStatus!]) {
    certificates(search: $search, status: $status) {
      id
      parcelId
      propertyAddress
      ownerName
      faceValue
      interestRate
      status
      redemptionAmount
      redemptionDate
      auctionId
      createdAt
      updatedAt
    }
  }
`;

export type CertificateStatus = 'AVAILABLE' | 'ASSIGNED' | 'SOLD' | 'REDEEMED';

interface Certificate {
  id: string;
  parcelId: string;
  propertyAddress: string;
  ownerName: string;
  faceValue: number;
  interestRate: number;
  status: CertificateStatus;
  redemptionAmount?: number;
  redemptionDate?: string;
  auctionId?: string;
  createdAt: string;
  updatedAt: string;
}

interface CertificateListTableProps {
  onAssignToAuction: (certificate: Certificate) => void;
  onMarkAsRedeemed: (certificate: Certificate) => void;
  onViewDetails: (certificate: Certificate) => void;
}

const statusColors = {
  AVAILABLE: 'success',
  ASSIGNED: 'purple',
  SOLD: 'warning',
  REDEEMED: 'gray',
};

const CertificateListTable: React.FC<CertificateListTableProps> = ({
  onAssignToAuction,
  onMarkAsRedeemed,
  onViewDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { loading, error, data } = useQuery(GET_CERTIFICATES, {
    variables: { search: searchTerm },
    fetchPolicy: 'network-only',
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (error) return <div>Error loading certificates: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-1/3">
          <TextInput
            type="text"
            icon={HiSearch}
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Table>
        <Table.Head>
          <Table.HeadCell>Parcel ID</Table.HeadCell>
          <Table.HeadCell>Property Address</Table.HeadCell>
          <Table.HeadCell>Owner</Table.HeadCell>
          <Table.HeadCell>Face Value</Table.HeadCell>
          <Table.HeadCell>Interest Rate</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Redemption</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={8}>
                <div className="text-center">Loading certificates...</div>
              </Table.Cell>
            </Table.Row>
          ) : (
            data?.certificates.map((certificate: Certificate) => (
              <Table.Row key={certificate.id}>
                <Table.Cell className="font-medium">{certificate.parcelId}</Table.Cell>
                <Table.Cell>{certificate.propertyAddress}</Table.Cell>
                <Table.Cell>{certificate.ownerName}</Table.Cell>
                <Table.Cell>${certificate.faceValue.toLocaleString()}</Table.Cell>
                <Table.Cell>{certificate.interestRate}%</Table.Cell>
                <Table.Cell>
                  <Badge color={statusColors[certificate.status] as any}>
                    {certificate.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {certificate.redemptionAmount && (
                    <div>
                      ${certificate.redemptionAmount.toLocaleString()}
                      <br />
                      <span className="text-sm text-gray-500">
                        {certificate.redemptionDate &&
                          format(new Date(certificate.redemptionDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => onViewDetails(certificate)}>
                      View
                    </Button>
                    {certificate.status === 'AVAILABLE' && (
                      <Button
                        size="sm"
                        color="purple"
                        onClick={() => onAssignToAuction(certificate)}
                      >
                        Assign
                      </Button>
                    )}
                    {certificate.status === 'SOLD' && (
                      <Button
                        size="sm"
                        color="success"
                        onClick={() => onMarkAsRedeemed(certificate)}
                      >
                        Mark Redeemed
                      </Button>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default CertificateListTable;
