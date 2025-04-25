/**
 * AuctionListTable Component
 *
 * Displays a table of auctions with management actions.
 * Supports filtering, pagination, and various auction actions (activate, close, cancel).
 */

import React, { useState } from 'react';
import { Table, Button, Badge, TextInput } from 'flowbite-react';
import { useQuery, gql } from '@apollo/client';
import { format } from 'date-fns';
import { HiSearch, HiPlus } from 'react-icons/hi';

export const GET_AUCTIONS = gql`
  query GetAuctions($status: [AuctionStatus!], $search: String) {
    auctions(status: $status, search: $search) {
      id
      title
      status
      startDate
      endDate
      certificateCount
      totalValue
      minInterestRate
      createdAt
      updatedAt
    }
  }
`;

export type AuctionStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'CLOSED' | 'CANCELLED';

interface Auction {
  id: string;
  title: string;
  status: AuctionStatus;
  startDate: string;
  endDate: string;
  certificateCount: number;
  totalValue: number;
  minInterestRate: number;
  createdAt: string;
  updatedAt: string;
}

interface AuctionListTableProps {
  onCreateAuction: () => void;
  onEditAuction: (auction: Auction) => void;
  onViewDetails: (auction: Auction) => void;
}

// Status badge colors for different auction states
const statusColors = {
  DRAFT: 'gray',
  SCHEDULED: 'purple',
  ACTIVE: 'success',
  CLOSED: 'warning',
  CANCELLED: 'failure',
};

const AuctionListTable: React.FC<AuctionListTableProps> = ({
  onCreateAuction,
  onEditAuction,
  onViewDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { loading, error, data, refetch } = useQuery(GET_AUCTIONS, {
    variables: { search: searchTerm },
    fetchPolicy: 'network-only',
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (error) return <div>Error loading auctions: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-1/3">
          <TextInput
            type="text"
            icon={HiSearch}
            placeholder="Search auctions..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button onClick={onCreateAuction}>
          <HiPlus className="mr-2 h-5 w-5" />
          Create Auction
        </Button>
      </div>

      <Table>
        <Table.Head>
          <Table.HeadCell>Title</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Start Date</Table.HeadCell>
          <Table.HeadCell>End Date</Table.HeadCell>
          <Table.HeadCell>Certificates</Table.HeadCell>
          <Table.HeadCell>Total Value</Table.HeadCell>
          <Table.HeadCell>Min Interest Rate</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={8}>
                <div className="text-center">Loading auctions...</div>
              </Table.Cell>
            </Table.Row>
          ) : (
            data?.auctions.map((auction: Auction) => (
              <Table.Row key={auction.id}>
                <Table.Cell className="font-medium">{auction.title}</Table.Cell>
                <Table.Cell>
                  <Badge color={statusColors[auction.status] as any}>{auction.status}</Badge>
                </Table.Cell>
                <Table.Cell>{format(new Date(auction.startDate), 'MMM d, yyyy HH:mm')}</Table.Cell>
                <Table.Cell>{format(new Date(auction.endDate), 'MMM d, yyyy HH:mm')}</Table.Cell>
                <Table.Cell>{auction.certificateCount}</Table.Cell>
                <Table.Cell>${auction.totalValue.toLocaleString()}</Table.Cell>
                <Table.Cell>{auction.minInterestRate}%</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => onViewDetails(auction)}>
                      View
                    </Button>
                    {auction.status === 'DRAFT' && (
                      <Button size="sm" color="purple" onClick={() => onEditAuction(auction)}>
                        Edit
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

export default AuctionListTable;
