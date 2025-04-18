import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Badge, Button, Spinner, TextInput } from 'flowbite-react';
import { HiSearch, HiCalendar, HiLocationMarker } from 'react-icons/hi';
// import { format } from 'date-fns';
// import axios from 'axios';

interface Auction {
  id: string;
  name: string;
  auctionDate: string;
  startTime: string;
  endTime: string;
  status: string;
  location: string;
  county: {
    id: string;
    name: string;
  };
}

const AuctionsPage: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        // Commented out axios call
        // const response = await axios.get('/api/v1/auctions');
        // setAuctions(response.data);
        // setFilteredAuctions(response.data);

        // Using mock data instead
        const mockData: Auction[] = [
          {
            id: '1',
            name: 'Miami-Dade County Tax Certificate Auction',
            auctionDate: '2024-08-15',
            startTime: '10:00 AM',
            endTime: '4:00 PM',
            status: 'scheduled',
            location: 'Online',
            county: { id: '1', name: 'Miami-Dade' },
          },
          {
            id: '2',
            name: 'Broward County Tax Certificate Auction',
            auctionDate: '2024-09-01',
            startTime: '9:00 AM',
            endTime: '5:00 PM',
            status: 'scheduled',
            location: 'Online',
            county: { id: '2', name: 'Broward' },
          },
        ];
        setAuctions(mockData);
        setFilteredAuctions(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load auctions. Please try again later.');
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = auctions;

    // Apply search term
    if (searchTerm) {
      result = result.filter(
        auction =>
          auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auction.county.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auction.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(auction => auction.status === statusFilter);
    }

    setFilteredAuctions(result);
  }, [searchTerm, statusFilter, auctions]);

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

  const formatDate = (dateString: string) => {
    // Commented out date-fns usage
    // const date = new Date(dateString);
    // return format(date, 'MMM d, yyyy');

    // Using basic JS Date formatting instead
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tax Certificate Auctions</h1>

      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Search Auctions
            </h5>
            <HiSearch className="w-5 h-5 text-gray-500" />
          </div>
          <TextInput
            id="search"
            type="text"
            placeholder="Search by name, county, or location"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            icon={HiSearch}
          />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Filter by Status
            </h5>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              color={statusFilter === 'all' ? 'dark' : 'light'}
              onClick={() => setStatusFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              color={statusFilter === 'scheduled' ? 'info' : 'light'}
              onClick={() => setStatusFilter('scheduled')}
              size="sm"
            >
              Scheduled
            </Button>
            <Button
              color={statusFilter === 'in_progress' ? 'warning' : 'light'}
              onClick={() => setStatusFilter('in_progress')}
              size="sm"
            >
              In Progress
            </Button>
            <Button
              color={statusFilter === 'completed' ? 'success' : 'light'}
              onClick={() => setStatusFilter('completed')}
              size="sm"
            >
              Completed
            </Button>
            <Button
              color={statusFilter === 'cancelled' ? 'failure' : 'light'}
              onClick={() => setStatusFilter('cancelled')}
              size="sm"
            >
              Cancelled
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Quick Actions
            </h5>
          </div>
          <div className="flex flex-col space-y-2">
            <Button color="info" onClick={() => navigate('/auctions/upcoming')}>
              <HiCalendar className="mr-2 h-5 w-5" />
              View Upcoming Auctions
            </Button>
            <Button color="light" onClick={() => navigate('/counties')}>
              <HiLocationMarker className="mr-2 h-5 w-5" />
              Browse by County
            </Button>
          </div>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Spinner size="xl" />
        </div>
      ) : error ? (
        <div className="text-center p-8 text-red-500">
          <p>{error}</p>
          <Button color="failure" onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table striped>
              <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>County</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Time</Table.HeadCell>
                <Table.HeadCell>Location</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {filteredAuctions.length > 0 ? (
                  filteredAuctions.map(auction => (
                    <Table.Row
                      key={auction.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {auction.name}
                      </Table.Cell>
                      <Table.Cell>{auction.county.name}</Table.Cell>
                      <Table.Cell>{formatDate(auction.auctionDate)}</Table.Cell>
                      <Table.Cell>{`${auction.startTime} - ${auction.endTime}`}</Table.Cell>
                      <Table.Cell>{auction.location}</Table.Cell>
                      <Table.Cell>{getStatusBadge(auction.status)}</Table.Cell>
                      <Table.Cell>
                        <Button
                          color="light"
                          size="sm"
                          onClick={() => navigate(`/auctions/${auction.id}`)}
                        >
                          View Details
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={7} className="text-center py-4">
                      No auctions found matching your criteria.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AuctionsPage;
