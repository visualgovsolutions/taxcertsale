/**
 * CertificateListTable Component
 *
 * Displays a table of tax certificates with management actions.
 * Supports filtering, searching, and actions like assigning to auctions and marking as redeemed.
 */

import React, { useState, useMemo } from 'react';
import { Table, Button, Badge, TextInput } from 'flowbite-react';
import { format } from 'date-fns';
import { HiSearch } from 'react-icons/hi';

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
  certificates: Certificate[];
  onAssignToAuction: (certificate: Certificate) => void;
  onMarkAsRedeemed: (certificate: Certificate) => void;
  onViewDetails: (certificate: Certificate) => void;
  loading?: boolean;
}

const statusColors = {
  AVAILABLE: 'success',
  ASSIGNED: 'purple',
  SOLD: 'warning',
  REDEEMED: 'gray',
};

const CertificateListTable: React.FC<CertificateListTableProps> = ({
  certificates,
  onAssignToAuction,
  onMarkAsRedeemed,
  onViewDetails,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter certificates based on search term
  const filteredCertificates = useMemo(() => {
    if (!searchTerm.trim()) return certificates;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return certificates.filter(
      cert =>
        cert.parcelId.toLowerCase().includes(lowerSearchTerm) ||
        cert.propertyAddress.toLowerCase().includes(lowerSearchTerm) ||
        cert.ownerName.toLowerCase().includes(lowerSearchTerm)
    );
  }, [certificates, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

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
          ) : filteredCertificates.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={8}>
                <div className="text-center">No certificates found</div>
              </Table.Cell>
            </Table.Row>
          ) : (
            filteredCertificates.map((certificate: Certificate) => (
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
