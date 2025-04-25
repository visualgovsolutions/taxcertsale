import React, { useState } from 'react';
import { Card, Tabs, Spinner, Button, Select } from 'flowbite-react';
import {
  HiChartPie,
  HiCurrencyDollar,
  HiDocumentText,
  HiUsers,
  HiCalendar,
  HiDownload,
  HiFilter,
} from 'react-icons/hi';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Sample data for charts
const revenueData = [
  { month: 'Jan', revenue: 65000 },
  { month: 'Feb', revenue: 59000 },
  { month: 'Mar', revenue: 80000 },
  { month: 'Apr', revenue: 81000 },
  { month: 'May', revenue: 56000 },
  { month: 'Jun', revenue: 55000 },
  { month: 'Jul', revenue: 40000 },
  { month: 'Aug', revenue: 73000 },
  { month: 'Sep', revenue: 92000 },
  { month: 'Oct', revenue: 110000 },
  { month: 'Nov', revenue: 137000 },
  { month: 'Dec', revenue: 91000 },
];

const userActivityData = [
  { date: '11/1', newUsers: 13, activeUsers: 65 },
  { date: '11/5', newUsers: 15, activeUsers: 71 },
  { date: '11/10', newUsers: 12, activeUsers: 83 },
  { date: '11/15', newUsers: 11, activeUsers: 85 },
  { date: '11/20', newUsers: 16, activeUsers: 88 },
  { date: '11/25', newUsers: 21, activeUsers: 90 },
  { date: '11/30', newUsers: 18, activeUsers: 95 },
];

const certificateStatusData = [
  { name: 'Available', value: 120, color: '#16a34a' },
  { name: 'Assigned', value: 75, color: '#3b82f6' },
  { name: 'Sold', value: 210, color: '#6366f1' },
  { name: 'Redeemed', value: 165, color: '#f97316' },
];

const auctionPerformanceData = [
  { county: 'Broward', participation: 87, revenue: 420000, redemptionRate: 65 },
  { county: 'Miami-Dade', participation: 92, revenue: 530000, redemptionRate: 72 },
  { county: 'Palm Beach', participation: 78, revenue: 380000, redemptionRate: 61 },
  { county: 'Hillsborough', participation: 83, revenue: 330000, redemptionRate: 68 },
  { county: 'Orange', participation: 76, revenue: 310000, redemptionRate: 59 },
];

// Key metrics data
const keyMetrics = [
  {
    name: 'Total Revenue',
    value: '$923,500',
    icon: <HiCurrencyDollar className="w-7 h-7 text-green-600" />,
    change: '+12%',
  },
  {
    name: 'Active Investors',
    value: '287',
    icon: <HiUsers className="w-7 h-7 text-blue-600" />,
    change: '+8%',
  },
  {
    name: 'Certificates Sold',
    value: '842',
    icon: <HiDocumentText className="w-7 h-7 text-purple-600" />,
    change: '+15%',
  },
  {
    name: 'Upcoming Auctions',
    value: '7',
    icon: <HiCalendar className="w-7 h-7 text-orange-600" />,
    change: '+2',
  },
];

const AdminAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('year');
  const [loading, setLoading] = useState(false);

  const handleTimeRangeChange = (value: string) => {
    setLoading(true);
    setTimeRange(value);

    // Simulate data loading
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleExportData = () => {
    alert('Analytics data export initiated. The file will be available for download shortly.');
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-gray-600">Platform performance metrics and insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onChange={e => handleTimeRangeChange(e.target.value)}>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </Select>
          <Button color="light" onClick={handleExportData}>
            <HiDownload className="mr-2 h-5 w-5" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-100">{metric.icon}</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                <div className="flex items-center">
                  <p className="text-xl font-semibold">{metric.value}</p>
                  <span
                    className={`ml-2 text-sm ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs for different analytics views */}
      <Tabs.Group
        aria-label="Analytics tabs"
        style="underline"
        onActiveTabChange={tab => setActiveTab(String(tab))}
      >
        <Tabs.Item active={activeTab === 'overview'} title="Overview" icon={HiChartPie}>
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <Spinner size="xl" />
              <span className="ml-2">Loading data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {/* Revenue Chart */}
              <Card>
                <h5 className="text-lg font-semibold mb-2">Revenue Trend</h5>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={value => `$${value / 1000}k`} />
                      <Tooltip formatter={value => [`$${value.toLocaleString()}`, 'Revenue']} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* User Activity Chart */}
              <Card>
                <h5 className="text-lg font-semibold mb-2">User Activity</h5>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={userActivityData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="newUsers" stroke="#16a34a" strokeWidth={2} />
                      <Line
                        type="monotone"
                        dataKey="activeUsers"
                        stroke="#6366f1"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Certificate Status Chart */}
              <Card>
                <h5 className="text-lg font-semibold mb-2">Certificate Status Distribution</h5>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={certificateStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {certificateStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={value => [value, 'Certificates']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* County Performance Chart */}
              <Card>
                <h5 className="text-lg font-semibold mb-2">Auction Performance by County</h5>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={auctionPerformanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="county" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="participation"
                        fill="#3b82f6"
                        name="Participation (%)"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="redemptionRate"
                        fill="#f97316"
                        name="Redemption Rate (%)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}
        </Tabs.Item>

        <Tabs.Item
          active={activeTab === 'revenue'}
          title="Revenue Analytics"
          icon={HiCurrencyDollar}
        >
          <div className="mt-4">
            <Card>
              <h5 className="text-lg font-semibold">Revenue by County</h5>
              <p className="text-sm text-gray-600 mb-4">
                Detailed breakdown of revenue generation across different counties
              </p>

              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={auctionPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="county" />
                    <YAxis tickFormatter={value => `$${value / 1000}k`} />
                    <Tooltip formatter={value => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#16a34a" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </Tabs.Item>

        <Tabs.Item active={activeTab === 'users'} title="User Analytics" icon={HiUsers}>
          <div className="mt-4">
            <Card>
              <h5 className="text-lg font-semibold">Coming Soon</h5>
              <p className="text-gray-600">
                Detailed user analytics features are currently in development and will be available
                soon.
              </p>
            </Card>
          </div>
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
};

export default AdminAnalyticsPage;
