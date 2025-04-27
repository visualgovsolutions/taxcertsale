import React from 'react';
import { 
  Card, 
  Table, 
  Badge, 
  Button,
  Progress,
  Avatar,
} from 'flowbite-react';
import { HiCreditCard, HiDocumentText, HiCalendar, HiGlobeAlt } from 'react-icons/hi';

const BidderDashboardPage: React.FC = () => {
  return (
    <div className="px-4 pt-6">
      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {/* Welcome Card */}
        <Card className="2xl:col-span-2">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Welcome, John Bidder
            </h1>
            <Badge color="success">Verified Bidder</Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your bidder account is active and you're ready to participate in Florida tax certificate auctions.
            Your current bidding limit is $50,000.
          </p>
          
          {/* Account Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <Card className="dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    $12,500
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Active Bids
                  </p>
                </div>
                <div className="inline-flex items-center rounded-lg bg-blue-100 p-2 text-blue-800 dark:bg-blue-200 dark:text-blue-800">
                  <HiCreditCard className="h-5 w-5" />
                </div>
              </div>
            </Card>
            
            <Card className="dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    5
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Certificates Owned
                  </p>
                </div>
                <div className="inline-flex items-center rounded-lg bg-green-100 p-2 text-green-800 dark:bg-green-200 dark:text-green-800">
                  <HiDocumentText className="h-5 w-5" />
                </div>
              </div>
            </Card>
            
            <Card className="dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    3
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Upcoming Auctions
                  </p>
                </div>
                <div className="inline-flex items-center rounded-lg bg-purple-100 p-2 text-purple-800 dark:bg-purple-200 dark:text-purple-800">
                  <HiCalendar className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </div>
        </Card>
        
        {/* Bidding Limit Card */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Bidding Limit
            </h3>
            <Badge color="gray">$50,000 total</Badge>
          </div>
          
          <div className="mb-1 text-sm flex justify-between">
            <span className="text-gray-700 dark:text-gray-400">
              Current Usage
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              $12,500 / $50,000
            </span>
          </div>
          <Progress
            color="blue"
            progress={25}
            size="lg"
            className="mb-4"
          />
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            To increase your bidding limit, please complete KYC verification and provide additional documentation.
          </p>
          
          <Button color="blue">
            Request Limit Increase
          </Button>
        </Card>
      </div>
      
      {/* Active Bids Table */}
      <div className="mt-4">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Active Bids
            </h3>
            <Button color="gray" size="xs">
              View All
            </Button>
          </div>
          
          <Table>
            <Table.Head>
              <Table.HeadCell>Certificate ID</Table.HeadCell>
              <Table.HeadCell>County</Table.HeadCell>
              <Table.HeadCell>Property Address</Table.HeadCell>
              <Table.HeadCell>Bid Amount</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Auction Ends</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Actions</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {[
                { 
                  id: 'FL-2023-0012', 
                  county: 'Orange', 
                  address: '123 Palm Ave, Orlando, FL',
                  amount: '$5,200',
                  status: 'highest',
                  ends: '2 days',
                },
                { 
                  id: 'FL-2023-0045', 
                  county: 'Miami-Dade', 
                  address: '789 Ocean Dr, Miami, FL',
                  amount: '$7,300',
                  status: 'outbid',
                  ends: '3 days',
                },
              ].map((bid) => (
                <Table.Row key={bid.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {bid.id}
                  </Table.Cell>
                  <Table.Cell>{bid.county}</Table.Cell>
                  <Table.Cell>{bid.address}</Table.Cell>
                  <Table.Cell>{bid.amount}</Table.Cell>
                  <Table.Cell>
                    <Badge color={bid.status === 'highest' ? 'success' : 'warning'}>
                      {bid.status === 'highest' ? 'Highest Bid' : 'Outbid'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{bid.ends}</Table.Cell>
                  <Table.Cell>
                    <Button color="blue" size="xs">
                      {bid.status === 'highest' ? 'View Details' : 'Increase Bid'}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      </div>
      
      {/* Upcoming Auctions */}
      <div className="mt-4">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Upcoming Auctions
            </h3>
            <Button color="gray" size="xs">
              View Calendar
            </Button>
          </div>
          
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { id: 1, county: 'Orange County', date: 'Jun 12, 2023', properties: 32, interest: '18%' },
                { id: 2, county: 'Miami-Dade County', date: 'Jun 15, 2023', properties: 56, interest: '18%' },
                { id: 3, county: 'Hillsborough County', date: 'Jun 20, 2023', properties: 41, interest: '18%' },
              ].map((auction) => (
                <li key={auction.id} className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Avatar rounded>
                        <div className="space-y-1">
                          <div className="flex items-center justify-center bg-blue-100 text-blue-800 rounded-full w-10 h-10">
                            <HiGlobeAlt className="h-5 w-5" />
                          </div>
                        </div>
                      </Avatar>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {auction.county}
                      </p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {auction.date} • Max Interest: {auction.interest}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      {auction.properties} certificates
                    </div>
                    <Button color="blue" size="xs">Register</Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BidderDashboardPage; 