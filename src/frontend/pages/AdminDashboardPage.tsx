import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { normalizeRole } from '../utils/roleUtils';
import {
  HiUsers,
  HiOfficeBuilding,
  HiCalendar,
  HiClock,
  HiUserAdd,
  HiCash,
  HiCreditCard,
} from 'react-icons/hi';
import StatsWidget from '../components/admin/StatsWidget';
import DashboardChartWidget, { TimeRange } from '../components/admin/DashboardChartWidget';

// Query for Active Auctions
const GET_ACTIVE_AUCTIONS = gql`
  query GetActiveAuctions {
    activeAuctions {
      id
      name
      startTime
      status
    }
  }
`;

// Query for Counties
const GET_COUNTIES = gql`
  query GetCounties {
    counties {
      id
    }
  }
`;

// Query for Users
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      role
    }
  }
`;

// Query for Upcoming Auctions
const GET_UPCOMING_AUCTIONS = gql`
  query GetUpcomingAuctions {
    upcomingAuctions {
      id # Just need ID for count
    }
  }
`;

// Query for count of users registered today
const GET_USERS_REGISTERED_TODAY_COUNT = gql`
  query GetUsersRegisteredTodayCount {
    usersRegisteredTodayCount
  }
`;

// New query for certificates summary
const GET_CERTIFICATES_SUMMARY = gql`
  query GetCertificatesSummary {
    certificatesSummary {
      total
      redeemed
      available
      activeInAuction
      totalValue
    }
  }
`;

// New query for user activity over time
const GET_USER_ACTIVITY = gql`
  query GetUserActivity($timeRange: String!) {
    userActivity(timeRange: $timeRange) {
      date
      count
    }
  }
`;

// New query for certificate redemption rate
const GET_REDEMPTION_RATE = gql`
  query GetRedemptionRate($timeRange: String!) {
    redemptionRate(timeRange: $timeRange) {
      date
      rate
    }
  }
`;

interface Auction {
  id: string;
  name: string;
  startTime: string;
  status: string;
}

interface GetActiveAuctionsData {
  activeAuctions: Auction[];
}

interface County {
  id: string;
}

interface GetCountiesData {
  counties: County[];
}

interface User {
  id: string;
  role: string; // Changed from enum to string to handle case differences
}

interface GetUsersData {
  users: User[];
}

// Interface for Upcoming Auctions data (even if just ID for count)
interface GetUpcomingAuctionsData {
  upcomingAuctions: { id: string }[];
}

// Interface for users registered today count
interface GetUsersRegisteredTodayData {
  usersRegisteredTodayCount: number;
}

// Interface for certificates summary
interface CertificatesSummary {
  total: number;
  redeemed: number;
  available: number;
  activeInAuction: number;
  totalValue: number;
}

interface GetCertificatesSummaryData {
  certificatesSummary: CertificatesSummary;
}

// Interface for activity data points
interface ActivityDataPoint {
  date: string;
  count: number;
}

interface GetUserActivityData {
  userActivity: ActivityDataPoint[];
}

// Interface for redemption rate data
interface RedemptionRatePoint {
  date: string;
  rate: number;
}

interface GetRedemptionRateData {
  redemptionRate: RedemptionRatePoint[];
}

const AdminDashboardPage: React.FC = () => {
  const [activityTimeRange, setActivityTimeRange] = useState<TimeRange>('week');
  const [redemptionTimeRange, setRedemptionTimeRange] = useState<TimeRange>('month');

  const {
    loading: loadingAuctions,
    error: errorAuctions,
    data: dataAuctions,
  } = useQuery<GetActiveAuctionsData>(GET_ACTIVE_AUCTIONS);

  const {
    loading: loadingCounties,
    error: errorCounties,
    data: dataCounties,
  } = useQuery<GetCountiesData>(GET_COUNTIES);

  const {
    loading: loadingUsers,
    error: errorUsers,
    data: dataUsers,
  } = useQuery<GetUsersData>(GET_USERS);

  const {
    loading: loadingUpcoming,
    error: errorUpcoming,
    data: dataUpcoming,
  } = useQuery<GetUpcomingAuctionsData>(GET_UPCOMING_AUCTIONS);

  const {
    loading: loadingRegToday,
    error: errorRegToday,
    data: dataRegToday,
  } = useQuery<GetUsersRegisteredTodayData>(GET_USERS_REGISTERED_TODAY_COUNT);

  const {
    loading: loadingCertSummary,
    error: errorCertSummary,
    data: dataCertSummary,
  } = useQuery<GetCertificatesSummaryData>(GET_CERTIFICATES_SUMMARY);

  const {
    loading: loadingUserActivity,
    error: errorUserActivity,
    data: dataUserActivity,
    refetch: refetchUserActivity,
  } = useQuery<GetUserActivityData>(GET_USER_ACTIVITY, {
    variables: { timeRange: activityTimeRange },
  });

  const {
    loading: loadingRedemptionRate,
    error: errorRedemptionRate,
    data: dataRedemptionRate,
    refetch: refetchRedemptionRate,
  } = useQuery<GetRedemptionRateData>(GET_REDEMPTION_RATE, {
    variables: { timeRange: redemptionTimeRange },
  });

  const countyCount = dataCounties?.counties?.length || 0;
  const bidderCount =
    dataUsers?.users?.filter(user => normalizeRole(user.role) === 'INVESTOR').length || 0;
  const upcomingAuctionCount = dataUpcoming?.upcomingAuctions?.length || 0;
  const registrationsTodayCount = dataRegToday?.usersRegisteredTodayCount || 0;
  const activeAuctionCount = dataAuctions?.activeAuctions?.length || 0;

  // Mock data for user activity chart - use real data when available
  const userActivityData = dataUserActivity?.userActivity || [
    { date: 'Mon', count: 12 },
    { date: 'Tue', count: 19 },
    { date: 'Wed', count: 15 },
    { date: 'Thu', count: 22 },
    { date: 'Fri', count: 28 },
    { date: 'Sat', count: 10 },
    { date: 'Sun', count: 8 },
  ];

  // Mock data for redemption rate chart - use real data when available
  const redemptionRateData = dataRedemptionRate?.redemptionRate || [
    { date: 'Jan', rate: 68 },
    { date: 'Feb', rate: 72 },
    { date: 'Mar', rate: 65 },
    { date: 'Apr', rate: 70 },
    { date: 'May', rate: 75 },
    { date: 'Jun', rate: 78 },
  ];

  // Handle refresh of charts
  const handleRefreshUserActivity = () => {
    refetchUserActivity();
  };

  const handleRefreshRedemptionRate = () => {
    refetchRedemptionRate();
  };

  // Format for chart data
  const formattedUserActivityData = userActivityData.map(item => ({
    label: item.date,
    value: item.count,
  }));

  const formattedRedemptionRateData = redemptionRateData.map(item => ({
    label: item.date,
    value: item.rate,
  }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Welcome to the Admin Dashboard. Manage users, settings, and site configuration here.
      </p>

      {/* Stats Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <StatsWidget
          title="Active Auctions"
          value={activeAuctionCount}
          loading={loadingAuctions}
          error={errorAuctions || undefined}
          icon={HiCalendar}
          iconColor="text-purple-600"
        />

        <StatsWidget
          title="Counties"
          value={countyCount}
          loading={loadingCounties}
          error={errorCounties || undefined}
          icon={HiOfficeBuilding}
          iconColor="text-blue-600"
        />

        <StatsWidget
          title="Bidders"
          value={bidderCount}
          loading={loadingUsers}
          error={errorUsers || undefined}
          icon={HiUsers}
          iconColor="text-green-600"
        />

        <StatsWidget
          title="Upcoming Auctions"
          value={upcomingAuctionCount}
          loading={loadingUpcoming}
          error={errorUpcoming || undefined}
          icon={HiClock}
          iconColor="text-yellow-600"
        />

        <StatsWidget
          title="New Registrations Today"
          value={registrationsTodayCount}
          loading={loadingRegToday}
          error={errorRegToday || undefined}
          icon={HiUserAdd}
          iconColor="text-indigo-600"
        />

        <StatsWidget
          title="Total Certificates"
          value={dataCertSummary?.certificatesSummary?.total || 0}
          loading={loadingCertSummary}
          error={errorCertSummary || undefined}
          icon={HiCreditCard}
          iconColor="text-gray-600"
        />

        <StatsWidget
          title="Available Certificates"
          value={dataCertSummary?.certificatesSummary?.available || 0}
          loading={loadingCertSummary}
          error={errorCertSummary || undefined}
          icon={HiCreditCard}
          iconColor="text-green-600"
        />

        <StatsWidget
          title="Total Certificate Value"
          value={dataCertSummary?.certificatesSummary?.totalValue || 0}
          loading={loadingCertSummary}
          error={errorCertSummary || undefined}
          icon={HiCash}
          iconColor="text-emerald-600"
          valuePrefix="$"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <DashboardChartWidget
          title="User Activity"
          subtitle="Number of active users over time"
          data={formattedUserActivityData}
          loading={loadingUserActivity}
          error={errorUserActivity || undefined}
          timeRange={activityTimeRange}
          onTimeRangeChange={setActivityTimeRange}
          onRefresh={handleRefreshUserActivity}
          chartType="bar"
        />

        <DashboardChartWidget
          title="Certificate Redemption Rate"
          subtitle="Percentage of certificates redeemed over time"
          data={formattedRedemptionRateData}
          loading={loadingRedemptionRate}
          error={errorRedemptionRate || undefined}
          timeRange={redemptionTimeRange}
          onTimeRangeChange={setRedemptionTimeRange}
          onRefresh={handleRefreshRedemptionRate}
          chartType="bar"
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
