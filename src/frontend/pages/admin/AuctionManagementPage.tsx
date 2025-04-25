/**
 * AuctionManagementPage Component
 * 
 * Advanced admin page for managing tax certificate auctions.
 * Provides functionality to set up, configure, and monitor auctions.
 */

import React, { useState } from 'react';
import { Breadcrumb, Tabs, Card, Button, Badge, Progress } from 'flowbite-react';
import { HiHome, HiPlus, HiCog, HiDocumentReport } from 'react-icons/hi';

interface Auction {
  id: string;
  title: string;
  county: string;
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  totalCertificates: number;
  totalValue: number;
  certificatesAssigned: number;
  certificatesSold: number;
  createdAt: string;
  updatedAt: string;
}

// Sample data
const sampleAuctions: Auction[] = [
  {
    id: '1',
    title: 'Miami-Dade Tax Certificate Auction 2023',
    county: 'Miami-Dade',
    status: 'COMPLETED',
    startDate: '2023-05-31',
    endDate: '2023-06-03',
    totalCertificates: 5000,
    totalValue: 25000000,
    certificatesAssigned: 5000,
    certificatesSold: 4850,
    createdAt: '2023-04-15T10:00:00Z',
    updatedAt: '2023-06-04T14:30:00Z'
  },
  {
    id: '2',
    title: 'Broward County Tax Certificate Auction 2023',
    county: 'Broward',
    status: 'COMPLETED',
    startDate: '2023-06-15',
    endDate: '2023-06-17',
    totalCertificates: 3500,
    totalValue: 18500000,
    certificatesAssigned: 3500,
    certificatesSold: 3200,
    createdAt: '2023-05-01T10:00:00Z',
    updatedAt: '2023-06-18T14:30:00Z'
  },
  {
    id: '3',
    title: 'Miami-Dade Tax Certificate Auction 2024',
    county: 'Miami-Dade',
    status: 'SCHEDULED',
    startDate: '2024-05-28',
    endDate: '2024-05-31',
    totalCertificates: 5200,
    totalValue: 28000000,
    certificatesAssigned: 3600,
    certificatesSold: 0,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z'
  },
  {
    id: '4',
    title: 'Broward County Tax Certificate Auction 2024',
    county: 'Broward',
    status: 'DRAFT',
    startDate: '2024-06-12',
    endDate: '2024-06-15',
    totalCertificates: 0,
    totalValue: 0,
    certificatesAssigned: 0,
    certificatesSold: 0,
    createdAt: '2024-01-30T10:00:00Z',
    updatedAt: '2024-01-30T10:00:00Z'
  }
];

const AuctionManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);

  const upcomingAuctions = sampleAuctions.filter(auction => 
    auction.status === 'DRAFT' || auction.status === 'SCHEDULED'
  );
  
  const activeAuctions = sampleAuctions.filter(auction => 
    auction.status === 'ACTIVE'
  );
  
  const pastAuctions = sampleAuctions.filter(auction => 
    auction.status === 'COMPLETED' || auction.status === 'CANCELLED'
  );

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'DRAFT': return 'gray';
      case 'SCHEDULED': return 'purple';
      case 'ACTIVE': return 'success';
      case 'COMPLETED': return 'info';
      case 'CANCELLED': return 'failure';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderAuctionCard = (auction: Auction) => {
    const isSelectable = auction.status !== 'COMPLETED' && auction.status !== 'CANCELLED';
    const isSelected = selectedAuction === auction.id;
    const assignedPercentage = auction.totalCertificates > 0 
      ? Math.round((auction.certificatesAssigned / auction.totalCertificates) * 100)
      : 0;
    const soldPercentage = auction.certificatesAssigned > 0 
      ? Math.round((auction.certificatesSold / auction.certificatesAssigned) * 100)
      : 0;

    return (
      <Card 
        key={auction.id} 
        className={`mb-4 cursor-pointer transform transition-transform hover:scale-[1.01] ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={() => isSelectable && setSelectedAuction(auction.id)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h5 className="text-xl font-bold">{auction.title}</h5>
            <p className="text-gray-600">{auction.county} County</p>
          </div>
          <Badge color={getStatusBadgeColor(auction.status)}>
            {auction.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <p className="text-sm text-gray-600">Dates</p>
            <p className="font-medium">{formatDate(auction.startDate)} - {formatDate(auction.endDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="font-medium">{formatCurrency(auction.totalValue)}</p>
          </div>
        </div>
        
        {auction.status !== 'DRAFT' && (
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-700">Certificates Assigned</span>
              <span className="text-sm font-medium text-gray-700">{assignedPercentage}%</span>
            </div>
            <Progress progress={assignedPercentage} color="indigo" size="sm" />
            
            {(auction.status === 'COMPLETED' || auction.status === 'ACTIVE') && (
              <>
                <div className="flex justify-between mt-2 mb-1">
                  <span className="text-sm text-gray-700">Certificates Sold</span>
                  <span className="text-sm font-medium text-gray-700">{soldPercentage}%</span>
                </div>
                <Progress progress={soldPercentage} color="green" size="sm" />
              </>
            )}
          </div>
        )}
        
        {isSelected && isSelectable && (
          <div className="mt-4 flex space-x-2">
            <Button size="sm" color="light" href={`/admin/auctions/${auction.id}`}>
              <HiCog className="mr-2 h-4 w-4" />
              Configure
            </Button>
            <Button size="sm" color="light">
              <HiDocumentReport className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Auction Management
          </h1>
          <Breadcrumb>
            <Breadcrumb.Item href="/admin" icon={HiHome}>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item>Auctions</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Button color="blue">
          <HiPlus className="mr-2 h-5 w-5" />
          Create New Auction
        </Button>
      </div>

      <Tabs.Group
        style="underline"
        onActiveTabChange={(tab) => {
          setActiveTab(tab === 0 ? 'upcoming' : tab === 1 ? 'active' : 'past');
          setSelectedAuction(null);
        }}
      >
        <Tabs.Item title={`Upcoming (${upcomingAuctions.length})`} active={activeTab === 'upcoming'}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingAuctions.length > 0 ? (
              upcomingAuctions.map(auction => renderAuctionCard(auction))
            ) : (
              <div className="col-span-2 text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No upcoming auctions</p>
                <Button color="blue" className="mt-4">
                  <HiPlus className="mr-2" />
                  Create New Auction
                </Button>
              </div>
            )}
          </div>
        </Tabs.Item>
        
        <Tabs.Item title={`Active (${activeAuctions.length})`} active={activeTab === 'active'}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeAuctions.length > 0 ? (
              activeAuctions.map(auction => renderAuctionCard(auction))
            ) : (
              <div className="col-span-2 text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No active auctions</p>
              </div>
            )}
          </div>
        </Tabs.Item>
        
        <Tabs.Item title={`Past (${pastAuctions.length})`} active={activeTab === 'past'}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pastAuctions.length > 0 ? (
              pastAuctions.map(auction => renderAuctionCard(auction))
            ) : (
              <div className="col-span-2 text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No past auctions</p>
              </div>
            )}
          </div>
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
};

export default AuctionManagementPage; 