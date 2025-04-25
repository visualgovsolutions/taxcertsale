import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  DatePicker, 
  Select, 
  Button, 
  Tooltip, 
  Spin, 
  Empty,
  Tabs,
  Alert,
  Typography
} from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  PieChartOutlined, 
  ReloadOutlined,
  DownloadOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useQuery, gql } from '@apollo/client';
import ErrorDisplay from '../common/ErrorDisplay';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

// GraphQL query to fetch county performance metrics
const GET_COUNTY_METRICS = gql`
  query GetCountyMetrics($countyId: ID!, $startDate: String, $endDate: String) {
    countyMetrics(countyId: $countyId, startDate: $startDate, endDate: $endDate) {
      id
      countyId
      date
      totalAuctions
      activeAuctions
      completedAuctions
      canceledAuctions
      totalCertificates
      activeCertificates
      soldCertificates
      redeemedCertificates
      averageCertificateValue
      totalRevenue
      totalBids
      uniqueBidders
      averageBidsPerAuction
    }
  }
`;

// GraphQL query to fetch top performing properties
const GET_TOP_PROPERTIES = gql`
  query GetTopProperties($countyId: ID!, $limit: Int) {
    topProperties(countyId: $countyId, limit: $limit) {
      id
      address
      parcelId
      auctionDate
      winningBidAmount
      interestRate
      bidCount
    }
  }
`;

interface CountyPerformanceMetricsProps {
  countyId: string | null;
}

const CountyPerformanceMetrics: React.FC<CountyPerformanceMetricsProps> = ({ countyId }) => {
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [topPropertyLimit, setTopPropertyLimit] = useState(5);
  const [timeFrame, setTimeFrame] = useState<string>('month');
  
  // Calculate default date range (last 30 days)
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setDateRange([start.toISOString(), end.toISOString()]);
  }, []);

  // Query for county metrics
  const { loading, error, data } = useQuery(GET_COUNTY_METRICS, {
    variables: {
      countyId,
      startDate: dateRange?.[0],
      endDate: dateRange?.[1]
    },
    skip: !countyId || !dateRange,
  });

  // Fetch top properties
  const { 
    loading: loadingProperties, 
    error: errorProperties, 
    data: propertiesData 
  } = useQuery(GET_TOP_PROPERTIES, {
    variables: {
      countyId,
      limit: topPropertyLimit
    },
    skip: !countyId
  });

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) {
      const [start, end] = dates;
      setDateRange([start.toISOString(), end.toISOString()]);
    } else {
      setDateRange(null);
    }
  };

  const handleRefresh = () => {
    // Implement refresh logic
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleTopPropertyLimitChange = (value: number) => {
    setTopPropertyLimit(value);
  };

  const handleTimeFrameChange = (value: string) => {
    setTimeFrame(value);
  };

  const downloadCSV = () => {
    // Implementation for downloading metrics as CSV
    // Would create a CSV from the data and trigger download
    console.log('Download metrics as CSV');
  };

  if (!countyId) {
    return (
      <Card>
        <Empty description="Select a county to view performance metrics" />
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <p>Loading metrics...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} message="Error loading county metrics" />;
  }

  const metrics = data?.countyMetrics || [];

  if (metrics.length === 0) {
    return (
      <Card>
        <Alert
          message="No Data Available"
          description="There is no performance data available for the selected county and time period."
          type="info"
          showIcon
        />
      </Card>
    );
  }

  // Calculate summary metrics
  const calculateSummary = () => {
    if (!metrics.length) return {};

    return {
      totalRevenue: metrics.reduce((sum, m) => sum + (m.totalRevenue || 0), 0),
      totalCertificates: metrics.reduce((sum, m) => sum + (m.totalCertificates || 0), 0),
      soldCertificates: metrics.reduce((sum, m) => sum + (m.soldCertificates || 0), 0),
      redeemedCertificates: metrics.reduce((sum, m) => sum + (m.redeemedCertificates || 0), 0),
      totalBids: metrics.reduce((sum, m) => sum + (m.totalBids || 0), 0),
      uniqueBidders: Math.max(...metrics.map(m => m.uniqueBidders || 0)),
      averageCertificateValue: metrics.reduce((sum, m) => sum + (m.averageCertificateValue || 0), 0) / metrics.length,
    };
  };

  const summary = calculateSummary();

  // Prepare data for auction status chart
  const auctionStatusData = [
    { name: 'Active', value: metrics.reduce((sum, m) => sum + (m.activeAuctions || 0), 0) },
    { name: 'Completed', value: metrics.reduce((sum, m) => sum + (m.completedAuctions || 0), 0) },
    { name: 'Canceled', value: metrics.reduce((sum, m) => sum + (m.canceledAuctions || 0), 0) },
  ];

  // Prepare data for certificate status chart
  const certificateStatusData = [
    { name: 'Active', value: metrics.reduce((sum, m) => sum + ((m.activeCertificates || 0)), 0) },
    { name: 'Sold', value: metrics.reduce((sum, m) => sum + (m.soldCertificates || 0), 0) },
    { name: 'Redeemed', value: metrics.reduce((sum, m) => sum + (m.redeemedCertificates || 0), 0) },
  ];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Prepare time series data for revenue and bids
  const timeSeriesData = metrics.map(m => ({
    date: new Date(m.date).toLocaleDateString(),
    revenue: m.totalRevenue || 0,
    bids: m.totalBids || 0,
    certificates: m.totalCertificates || 0,
  }));

  // Table columns for top properties
  const topPropertiesColumns = [
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Parcel ID',
      dataIndex: 'parcelId',
      key: 'parcelId',
    },
    {
      title: 'Auction Date',
      dataIndex: 'auctionDate',
      key: 'auctionDate',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Winning Bid',
      dataIndex: 'winningBidAmount',
      key: 'winningBidAmount',
      render: (amount: number) => `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      title: 'Interest Rate',
      dataIndex: 'interestRate',
      key: 'interestRate',
      render: (rate: number) => `${rate}%`
    },
    {
      title: 'Bid Count',
      dataIndex: 'bidCount',
      key: 'bidCount',
    },
  ];

  return (
    <div className="county-performance-metrics">
      <div className="metrics-header" style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={12}>
            <Title level={4}>County Performance Metrics</Title>
            <Text type="secondary">
              {dateRange ? `${new Date(dateRange[0]).toLocaleDateString()} - ${new Date(dateRange[1]).toLocaleDateString()}` : 'No date range selected'}
            </Text>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <RangePicker
              onChange={handleDateRangeChange}
              style={{ marginRight: 16 }}
            />
            <Select
              defaultValue="month"
              style={{ width: 120 }}
              onChange={handleTimeFrameChange}
            >
              <Option value="week">Week</Option>
              <Option value="month">Month</Option>
              <Option value="quarter">Quarter</Option>
              <Option value="year">Year</Option>
            </Select>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Revenue" value={summary.totalRevenue} prefix="$" precision={2} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Certificates" value={summary.totalCertificates} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Bids" value={summary.totalBids} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Unique Bidders" value={summary.uniqueBidders} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Revenue Over Time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Bid Activity">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="bids" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Auction Status">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={auctionStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {auctionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => value} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Certificate Status">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={certificateStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {certificateStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => value} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Overview" key="overview">
          {/* Render overview tab content */}
        </TabPane>
        
        <TabPane tab="Auction Details" key="auction">
          {/* Render auction details tab content */}
        </TabPane>
        
        <TabPane tab="Revenue Analysis" key="revenue">
          {/* Render revenue analysis tab content */}
        </TabPane>
        
        <TabPane tab="Certificate Statistics" key="certificates">
          {/* Render certificate statistics tab content */}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CountyPerformanceMetrics; 