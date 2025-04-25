import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { normalizeRole } from '../utils/roleUtils';

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

const AdminDashboardPage: React.FC = () => {
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

  const countyCount = dataCounties?.counties?.length;
  const bidderCount = dataUsers?.users?.filter(
    user => normalizeRole(user.role) === 'INVESTOR'
  ).length;
  const upcomingAuctionCount = dataUpcoming?.upcomingAuctions?.length;
  const registrationsTodayCount = dataRegToday?.usersRegisteredTodayCount;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Welcome to the Admin Dashboard. Manage users, settings, and site configuration here.
      </p>

      {/* Grid for Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4">
        {' '}
        {/* Adjusted columns for more widgets */}
        {/* Active Auctions Section */}
        <div className="p-4 border rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Active Auctions</h2>
          {loadingAuctions && <p>Loading...</p>}
          {errorAuctions && <p className="text-red-500">Error: {errorAuctions.message}</p>}
          {dataAuctions && dataAuctions.activeAuctions ? (
            <p className="text-3xl font-bold">{dataAuctions.activeAuctions.length}</p> // Display count instead of list
          ) : (
            !loadingAuctions && !errorAuctions && <p className="text-3xl font-bold">0</p> // Show 0 if none
          )}
        </div>
        {/* Counties Count Section */}
        <div className="p-4 border rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Total Counties</h2>
          {loadingCounties && <p>Loading...</p>}
          {errorCounties && <p className="text-red-500">Error: {errorCounties.message}</p>}
          {dataCounties && typeof countyCount === 'number' ? (
            <p className="text-3xl font-bold">{countyCount}</p>
          ) : (
            !loadingCounties && !errorCounties && <p className="text-3xl font-bold">-</p> // Show dash if error/no data
          )}
        </div>
        {/* Bidders Count Section */}
        <div className="p-4 border rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Total Bidders</h2>
          {loadingUsers && <p>Loading...</p>}
          {errorUsers && <p className="text-red-500">Error: {errorUsers.message}</p>}
          {dataUsers && typeof bidderCount === 'number' ? (
            <p className="text-3xl font-bold">{bidderCount}</p>
          ) : (
            !loadingUsers && !errorUsers && <p className="text-3xl font-bold">-</p> // Show dash if error/no data
          )}
        </div>
        {/* Upcoming Auctions Count Section */}
        <div className="p-4 border rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Upcoming Auctions</h2>
          {loadingUpcoming && <p>Loading...</p>}
          {errorUpcoming && <p className="text-red-500">Error</p>}
          {dataUpcoming && typeof upcomingAuctionCount === 'number' ? (
            <p className="text-3xl font-bold">{upcomingAuctionCount}</p>
          ) : (
            !loadingUpcoming && !errorUpcoming && <p className="text-3xl font-bold">-</p>
          )}
        </div>
        {/* Registrations Today Count */}
        <div className="p-4 border rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Registrations Today</h2>
          {loadingRegToday && <p>Loading...</p>}
          {errorRegToday && <p className="text-red-500">Error</p>}
          {dataRegToday && typeof registrationsTodayCount === 'number' ? (
            <p className="text-3xl font-bold">{registrationsTodayCount}</p>
          ) : (
            !loadingRegToday && !errorRegToday && <p className="text-3xl font-bold">-</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
