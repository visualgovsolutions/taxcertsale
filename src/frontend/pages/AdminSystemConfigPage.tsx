import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { format } from 'date-fns';

// Define GraphQL query for activity logs
const GET_ACTIVITY_LOGS = gql`
  query GetActivityLogs($filter: ActivityLogFilterInput, $limit: Int, $offset: Int) {
    activityLogs(filter: $filter, limit: $limit, offset: $offset) {
      totalCount
      logs {
        id
        timestamp
        action
        resource
        resourceId
        status
        details
        user {
          id
          username
          email
          role
        }
        userAgent
        ipAddress
      }
    }
  }
`;

interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  resource: string;
  resourceId?: string;
  status: string;
  details?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  userAgent?: string;
  ipAddress?: string;
}

interface ActivityLogsResponse {
  activityLogs: {
    totalCount: number;
    logs: ActivityLog[];
  };
}

const AdminSystemConfigPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('activity-logs');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('week'); // Default to last 7 days
  
  // Function to get date range based on selected filter
  const getDateRangeFilter = (filterValue: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filterValue) {
      case 'today':
        return { fromDate: today.toISOString(), toDate: now.toISOString() };
      case 'yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { fromDate: yesterday.toISOString(), toDate: today.toISOString() };
      }
      case 'week': {
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        return { fromDate: lastWeek.toISOString(), toDate: now.toISOString() };
      }
      case 'month': {
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return { fromDate: lastMonth.toISOString(), toDate: now.toISOString() };
      }
      default:
        return { fromDate: undefined, toDate: undefined };
    }
  };
  
  // Query for fetching activity logs
  const { loading, error, data, refetch } = useQuery<ActivityLogsResponse>(GET_ACTIVITY_LOGS, {
    variables: {
      filter: {
        searchTerm: searchTerm !== '' ? searchTerm : undefined,
        statuses: statusFilter !== '' ? [statusFilter] : undefined,
        resources: resourceFilter !== '' ? [resourceFilter] : undefined,
        // Apply date range filter correctly
        ...getDateRangeFilter(dateRangeFilter)
      },
      limit,
      offset: page * limit
    },
    fetchPolicy: 'network-only'
  });
  
  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [searchTerm, statusFilter, resourceFilter, dateRangeFilter, page, limit, refetch]);
  
  // Helper function to format timestamps
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MM/dd/yyyy, h:mm:ss a');
    } catch (error) {
      return dateString;
    }
  };
  
  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page when search changes
  };
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };
  
  const handleResourceFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setResourceFilter(e.target.value);
    setPage(0);
  };
  
  const handleDateRangeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRangeFilter(e.target.value);
    setPage(0);
  };
  
  // Get the unique resources from the logs to populate the filter dropdown
  const uniqueResources = data?.activityLogs.logs
    ? [...new Set(data.activityLogs.logs.map(log => log.resource))]
    : [];
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">System Configuration</h1>
      
      {/* Tabs */}
      <div className="mt-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button 
            onClick={() => setCurrentTab('activity-logs')}
            className={`${
              currentTab === 'activity-logs' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Activity Logs
          </button>
          <button 
            onClick={() => setCurrentTab('settings')}
            className={`${
              currentTab === 'settings' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            System Settings
          </button>
          <button 
            onClick={() => setCurrentTab('security')}
            className={`${
              currentTab === 'security' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Security & Authentication
          </button>
        </nav>
      </div>
      
      {/* Activity Logs Tab Content */}
      {currentTab === 'activity-logs' && (
        <div className="mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <h2 className="text-lg font-medium">System Activity Logs</h2>
            <div className="flex-1 md:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <div className="absolute left-3 top-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                className="border border-gray-300 rounded-md p-2"
                value={dateRangeFilter}
                onChange={handleDateRangeFilterChange}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
              <select
                className="border border-gray-300 rounded-md p-2"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="SUCCESS">Success</option>
                <option value="WARNING">Warning</option>
                <option value="ERROR">Error</option>
                <option value="INFO">Info</option>
              </select>
              <select
                className="border border-gray-300 rounded-md p-2"
                value={resourceFilter}
                onChange={handleResourceFilterChange}
              >
                <option value="">All Resources</option>
                {uniqueResources.map(resource => (
                  <option key={resource} value={resource}>{resource}</option>
                ))}
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-10">
              <svg className="animate-spin h-8 w-8 mx-auto text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-600">Loading activity logs...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
              <p>Error loading activity logs: {error.message}</p>
              <p className="mt-2">Please try again or contact support if the problem persists.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.activityLogs.logs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {log.user ? (
                            <div>
                              <div className="text-sm font-medium text-gray-900">{log.user.username}</div>
                              <div className="text-sm text-gray-500">{log.user.email}</div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">System</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.action}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{log.resource}</div>
                          {log.resourceId && <div className="text-xs text-gray-500">ID: {log.resourceId}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-md">
                          {log.details || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* No data state */}
              {data?.activityLogs.logs.length === 0 && (
                <div className="text-center py-10 bg-white shadow rounded-lg mt-4">
                  <svg className="h-12 w-12 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2 text-gray-600">No activity logs found</p>
                </div>
              )}
              
              {/* Pagination */}
              {data && data.activityLogs.totalCount > 0 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      className={`${page === 0 ? 'opacity-50 cursor-not-allowed' : ''} relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={(page + 1) * limit >= data.activityLogs.totalCount}
                      className={`${(page + 1) * limit >= data.activityLogs.totalCount ? 'opacity-50 cursor-not-allowed' : ''} ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{page * limit + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min((page + 1) * limit, data.activityLogs.totalCount)}
                        </span>{' '}
                        of <span className="font-medium">{data.activityLogs.totalCount}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setPage(Math.max(0, page - 1))}
                          disabled={page === 0}
                          className={`${page === 0 ? 'opacity-50 cursor-not-allowed' : ''} relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50`}
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {/* Page numbers */}
                        {[...Array(Math.ceil(data.activityLogs.totalCount / limit))].slice(0, 5).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`${
                              page === i
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            } relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => setPage(page + 1)}
                          disabled={(page + 1) * limit >= data.activityLogs.totalCount}
                          className={`${(page + 1) * limit >= data.activityLogs.totalCount ? 'opacity-50 cursor-not-allowed' : ''} relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50`}
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {/* Settings Tab Content */}
      {currentTab === 'settings' && (
        <div className="mt-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">System Settings</h2>
            <p className="mb-4 text-gray-600">
              This section will include application settings, environment variables, and feature flags.
            </p>
            
            {/* Placeholder form for system settings */}
            <form className="space-y-4">
              <div>
                <label htmlFor="app-name" className="block text-sm font-medium text-gray-700">Application Name</label>
                <input type="text" id="app-name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Tax Certificate Sale Platform" />
              </div>
              <div>
                <label htmlFor="support-email" className="block text-sm font-medium text-gray-700">Support Email</label>
                <input type="email" id="support-email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="support@example.com" />
              </div>
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Default Timezone</label>
                <select id="timezone" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                </select>
              </div>
              <div className="pt-2">
                <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Security Tab Content */}
      {currentTab === 'security' && (
        <div className="mt-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Security & Authentication Settings</h2>
            <p className="mb-4 text-gray-600">
              Configure security settings, authentication policies, and session management.
            </p>
            
            {/* Placeholder for security settings */}
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-800">Password Policy</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="min-length" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
                    <label htmlFor="min-length" className="ml-2 block text-sm text-gray-700">Minimum length: 8 characters</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="require-special" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
                    <label htmlFor="require-special" className="ml-2 block text-sm text-gray-700">Require special characters</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="require-numbers" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
                    <label htmlFor="require-numbers" className="ml-2 block text-sm text-gray-700">Require numbers</label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-800">Session Settings</h3>
                <div className="mt-2">
                  <label htmlFor="session-timeout" className="block text-sm text-gray-700">Session timeout (minutes)</label>
                  <input type="number" id="session-timeout" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="30" value="30" />
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-800">Two-Factor Authentication</h3>
                <div className="mt-2 flex items-center">
                  <input type="checkbox" id="require-2fa" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <label htmlFor="require-2fa" className="ml-2 block text-sm text-gray-700">Require 2FA for all administrative users</label>
                </div>
              </div>
              
              <div className="pt-2">
                <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save Security Settings</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSystemConfigPage; 