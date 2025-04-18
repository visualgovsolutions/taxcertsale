import React from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Dropdown, 
  Badge,
  Tabs 
} from 'flowbite-react';
import { HiChartPie, HiDocumentDownload, HiDotsVertical, HiShoppingBag, HiUser } from 'react-icons/hi';

const DashboardPage: React.FC = () => {
  return (
    <div className="px-4 pt-6">
      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {/* Welcome Card */}
        <Card className="2xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Tax Certificate Sale Platform
            </h3>
            <Button size="sm">
              <HiDocumentDownload className="mr-2 h-5 w-5" />
              Download Report
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome to the Tax Certificate Sale management dashboard. Monitor auctions, manage properties, 
            and track certificate sales all in one place.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <Card className="dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    12
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Active Auctions
                  </p>
                </div>
                <div className="inline-flex items-center rounded-lg bg-green-100 p-2 text-green-800 dark:bg-green-200 dark:text-green-800">
                  <HiChartPie className="h-5 w-5" />
                </div>
              </div>
            </Card>
            <Card className="dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    243
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Available Properties
                  </p>
                </div>
                <div className="inline-flex items-center rounded-lg bg-blue-100 p-2 text-blue-800 dark:bg-blue-200 dark:text-blue-800">
                  <HiShoppingBag className="h-5 w-5" />
                </div>
              </div>
            </Card>
            <Card className="dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    186
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Registered Bidders
                  </p>
                </div>
                <div className="inline-flex items-center rounded-lg bg-purple-100 p-2 text-purple-800 dark:bg-purple-200 dark:text-purple-800">
                  <HiUser className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </div>
        </Card>

        {/* Upcoming Auctions */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Upcoming Auctions
            </h3>
            <Button color="gray" size="xs">View all</Button>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { id: 1, county: 'Orange County', date: 'Jun 12, 2023', properties: 32, status: 'scheduled' },
                { id: 2, county: 'Miami-Dade County', date: 'Jun 15, 2023', properties: 56, status: 'scheduled' },
                { id: 3, county: 'Hillsborough County', date: 'Jun 20, 2023', properties: 41, status: 'scheduled' },
                { id: 4, county: 'Palm Beach County', date: 'Jun 25, 2023', properties: 29, status: 'scheduled' },
              ].map((auction) => (
                <li key={auction.id} className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {auction.county}
                      </p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {auction.date}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      {auction.properties} properties
                    </div>
                    <Badge color="info">{auction.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Recent Bidding Activity */}
        <Card className="2xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Bidding Activity
            </h3>
            <Button color="gray" size="xs">View all</Button>
          </div>
          <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <Table.Head className="bg-gray-100 dark:bg-gray-700">
              <Table.HeadCell>Property ID</Table.HeadCell>
              <Table.HeadCell>County</Table.HeadCell>
              <Table.HeadCell>Bidder</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
              <Table.HeadCell>Time</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Actions</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {[
                { id: 'PRO-123', county: 'Orange', bidder: 'John Smith', amount: '$2,300', time: '2 min ago', status: 'highest' },
                { id: 'PRO-456', county: 'Miami-Dade', bidder: 'Sarah Johnson', amount: '$4,100', time: '15 min ago', status: 'outbid' },
                { id: 'PRO-789', county: 'Hillsborough', bidder: 'Michael Davis', amount: '$1,800', time: '32 min ago', status: 'highest' },
                { id: 'PRO-101', county: 'Palm Beach', bidder: 'Amy Wilson', amount: '$3,500', time: '1 hour ago', status: 'highest' },
                { id: 'PRO-112', county: 'Broward', bidder: 'Robert Jones', amount: '$2,750', time: '2 hours ago', status: 'outbid' },
              ].map((bid) => (
                <Table.Row key={bid.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {bid.id}
                  </Table.Cell>
                  <Table.Cell>{bid.county}</Table.Cell>
                  <Table.Cell>{bid.bidder}</Table.Cell>
                  <Table.Cell>{bid.amount}</Table.Cell>
                  <Table.Cell>{bid.time}</Table.Cell>
                  <Table.Cell>
                    <Badge color={bid.status === 'highest' ? 'success' : 'gray'}>
                      {bid.status === 'highest' ? 'Highest Bid' : 'Outbid'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Dropdown label="" inline renderTrigger={() => <HiDotsVertical className="h-5 w-5" />}>
                      <Dropdown.Item>View Details</Dropdown.Item>
                      <Dropdown.Item>Contact Bidder</Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      </div>

      <div className="mt-4">
        <Tabs.Group>
          <Tabs.Item title="Analytics" active icon={HiChartPie}>
            <p className="text-gray-500 dark:text-gray-400">
              Analytics dashboard coming soon. Track your tax certificate sale performance, monitor bidding trends, 
              and get insights into auction performance.
            </p>
          </Tabs.Item>
          <Tabs.Item title="Notifications">
            <p className="text-gray-500 dark:text-gray-400">
              You have no new notifications.
            </p>
          </Tabs.Item>
          <Tabs.Item title="Reports">
            <p className="text-gray-500 dark:text-gray-400">
              Generate and view reports on tax certificate sales, auction performance, and bidding activity.
            </p>
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
};

export default DashboardPage; 