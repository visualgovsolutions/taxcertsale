import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Badge,
  TextInput,
  Select,
  Label,
  Card,
  Pagination,
  Dropdown,
  Spinner,
  Alert,
} from 'flowbite-react';
import {
  HiSearch,
  HiOutlineDownload,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineExclamation,
  HiOutlineFilter,
  HiOutlineDocument,
  HiOutlineCalendar,
  HiInformationCircle,
} from 'react-icons/hi';
import { gql, useQuery } from '@apollo/client';

// Define the GraphQL query
// Updated to use activityLogs instead of auditLogs to match the backend resolver
const GET_AUDIT_LOGS = gql`
  query GetActivityLogs($page: Int, $limit: Int, $filter: ActivityLogFilterInput) {
    activityLogs(page: $page, limit: $limit, filter: $filter) {
      logs {
        id
        timestamp
        action
        resource
        resourceId
        ipAddress
        details
        status
        user {
          # Assuming user info is nested
          id
          username # Use username
          role
        }
      }
      totalCount
    }
  }
`;

interface AuditLogUser {
  // Nested user info
  id: string;
  username: string;
  role: string;
}

interface AuditLog {
  id: string;
  user: AuditLogUser; // Use nested structure
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  details: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
}

const AdminAuditLogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [resourceFilter, setResourceFilter] = useState('ALL');
  const [userFilter, setUserFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const logsPerPage = 10;

  // Prepare filter object to match the backend schema structure
  const prepareFilter = () => {
    const filter: any = {};

    if (searchTerm) filter.searchTerm = searchTerm;

    // Convert single value filters to arrays as expected by backend
    if (actionFilter !== 'ALL') filter.actions = [actionFilter];
    if (statusFilter !== 'ALL') filter.statuses = [statusFilter];
    if (resourceFilter !== 'ALL') filter.resources = [resourceFilter];

    // Handle date range
    if (dateRange !== 'ALL') {
      const now = new Date();

      if (dateRange === 'TODAY') {
        filter.fromDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        filter.toDate = new Date(now.setHours(23, 59, 59, 999)).toISOString();
      } else if (dateRange === 'YESTERDAY') {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        filter.fromDate = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString();
        filter.toDate = new Date(yesterday.setHours(23, 59, 59, 999)).toISOString();
      } else if (dateRange === 'LAST_7_DAYS') {
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        filter.fromDate = new Date(lastWeek).toISOString();
        filter.toDate = new Date(now).toISOString();
      } else if (dateRange === 'LAST_30_DAYS') {
        const lastMonth = new Date(now);
        lastMonth.setDate(lastMonth.getDate() - 30);
        filter.fromDate = new Date(lastMonth).toISOString();
        filter.toDate = new Date(now).toISOString();
      }
    }

    return filter;
  };

  // Apollo Query - updated to use the prepared filter
  const { data, loading, error, refetch } = useQuery(GET_AUDIT_LOGS, {
    variables: {
      page: currentPage,
      limit: logsPerPage,
      filter: prepareFilter(),
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  // Data Processing
  const { currentLogs, totalLogs, totalPages, uniqueActions, uniqueResources, uniqueUserRoles } =
    useMemo(() => {
      const logs = data?.activityLogs?.logs || [];
      const total = data?.activityLogs?.totalCount || 0;
      const pages = Math.ceil(total / logsPerPage);

      // Ensure elements are strings and explicitly type map parameters
      const actions = Array.from(
        new Set(logs.map((log: AuditLog) => String(log.action || '')))
      ).filter(Boolean) as string[];
      const resources = Array.from(
        new Set(logs.map((log: AuditLog) => String(log.resource || '')))
      ).filter(Boolean) as string[];

      // Filter out logs without users first (system-generated logs) before extracting roles
      // This prevents errors when trying to access user.role on null user objects
      const roles = Array.from(
        new Set(
          logs
            .filter((log: AuditLog) => log.user != null) // Filter out logs without user
            .map((log: AuditLog) => String(log.user?.role || ''))
        )
      ).filter(Boolean) as string[];

      return {
        currentLogs: logs,
        totalLogs: total,
        totalPages: pages,
        uniqueActions: actions,
        uniqueResources: resources,
        uniqueUserRoles: roles,
      };
    }, [data, logsPerPage]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge color="success">Success</Badge>;
      case 'FAILURE':
        return <Badge color="failure">Failure</Badge>;
      case 'WARNING':
        return <Badge color="warning">Warning</Badge>;
      default:
        return <Badge color="gray">{status}</Badge>;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return 'Login';
      case 'UPDATE':
        return 'Update';
      case 'BID':
        return 'Bid Placed';
      case 'DELETE':
        return 'Delete';
      case 'CREATE':
        return 'Create';
      case 'ASSIGN':
        return 'Assign';
      case 'PAYMENT':
        return 'Payment';
      case 'ACCESS':
        return 'Access';
      case 'BACKUP':
        return 'Backup';
      case 'MODIFY':
        return 'Modify';
      case 'DOCUMENT':
        return 'Document';
      case 'BID_WITHDRAW':
        return 'Bid Withdrawal';
      case 'CONFIG':
        return 'Configuration';
      default:
        return action;
    }
  };

  const toggleExpandLog = (logId: string) => {
    if (expandedLogId === logId) {
      setExpandedLogId(null);
    } else {
      setExpandedLogId(logId);
    }
  };

  const handleExportLogs = () => {
    console.log('Exporting logs with current filters:', {
      searchTerm,
      actionFilter,
      statusFilter,
      resourceFilter,
      userFilter,
      dateRange,
    });
    alert('Export functionality not yet implemented.');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setter(value);
    setCurrentPage(1);
  };

  if (loading && !data?.activityLogs) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Spinner size="xl" aria-label="Loading audit logs..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">Error!</span> Failed to load audit logs: {error.message}
          <p>Please ensure the backend server and database are running correctly.</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">Track and monitor all system activity</p>
        </div>

        <Button color="light" onClick={handleExportLogs}>
          <HiOutlineDownload className="mr-2 h-5 w-5" />
          Export Logs
        </Button>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search" className="mb-1">
              Search
            </Label>
            <TextInput
              id="search"
              type="text"
              icon={HiSearch}
              placeholder="Search logs..."
              value={searchTerm}
              onChange={e => handleFilterChange(setSearchTerm, e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="dateRange" className="mb-1">
              Date Range
            </Label>
            <Select
              id="dateRange"
              value={dateRange}
              onChange={e => handleFilterChange(setDateRange, e.target.value)}
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="YESTERDAY">Yesterday</option>
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="statusFilter" className="mb-1">
              Status
            </Label>
            <Select
              id="statusFilter"
              value={statusFilter}
              onChange={e => handleFilterChange(setStatusFilter, e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILURE">Failure</option>
              <option value="WARNING">Warning</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <Label htmlFor="actionFilter" className="mb-1">
              Action
            </Label>
            <Select
              id="actionFilter"
              value={actionFilter}
              onChange={e => handleFilterChange(setActionFilter, e.target.value)}
            >
              <option value="ALL">All Actions</option>
              {uniqueActions.map((action: string) => (
                <option key={action} value={action}>
                  {getActionLabel(action)}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="resourceFilter" className="mb-1">
              Resource
            </Label>
            <Select
              id="resourceFilter"
              value={resourceFilter}
              onChange={e => handleFilterChange(setResourceFilter, e.target.value)}
            >
              <option value="ALL">All Resources</option>
              {uniqueResources.map((resource: string) => (
                <option key={resource} value={resource}>
                  {resource}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="userFilter" className="mb-1">
              User Role
            </Label>
            <Select
              id="userFilter"
              value={userFilter}
              onChange={e => handleFilterChange(setUserFilter, e.target.value)}
            >
              <option value="ALL">All Roles</option>
              {uniqueUserRoles.map((role: string) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">System Activity Logs</h2>
          <div className="text-sm text-gray-500">
            {totalLogs} {totalLogs === 1 ? 'log' : 'logs'} found
            {loading && <Spinner size="sm" className="ml-2" />}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>Timestamp</Table.HeadCell>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
              <Table.HeadCell>Resource</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Details</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {currentLogs.map((log: AuditLog) => (
                <React.Fragment key={log.id}>
                  <Table.Row
                    className={`hover:bg-gray-50 cursor-pointer ${expandedLogId === log.id ? 'bg-blue-50' : ''}`}
                    onClick={() => toggleExpandLog(log.id)}
                  >
                    <Table.Cell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <HiOutlineClock className="w-4 h-4 mr-1 text-gray-500" />
                        {formatDateTime(log.timestamp)}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center">
                        <HiOutlineUser className="w-4 h-4 mr-1 text-gray-500" />
                        <div>
                          {/* Handle logs with null user (system-generated logs) */}
                          {log.user ? (
                            <>
                              <div className="font-medium">{log.user.username}</div>
                              <div className="text-xs text-gray-500">{log.user.role}</div>
                            </>
                          ) : (
                            <div className="font-medium">System</div>
                          )}
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{getActionLabel(log.action)}</Table.Cell>
                    <Table.Cell>
                      <div>
                        {log.resource}
                        {log.resourceId && (
                          <div className="text-xs text-gray-500">ID: {log.resourceId}</div>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>{getStatusBadge(log.status)}</Table.Cell>
                    <Table.Cell className="max-w-xs truncate">{log.details}</Table.Cell>
                  </Table.Row>

                  {expandedLogId === log.id && (
                    <Table.Row className="bg-gray-50">
                      <Table.Cell colSpan={6}>
                        <div className="p-3">
                          <h4 className="font-medium mb-2">Detailed Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center mb-2">
                                <HiOutlineUser className="w-4 h-4 mr-2 text-gray-500" />
                                <div>
                                  <div className="text-sm font-medium">User</div>
                                  {/* Display appropriate info for system-generated logs with no user */}
                                  {log.user ? (
                                    <>
                                      <div>
                                        {log.user.username} ({log.user.role})
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        User ID: {log.user.id}
                                      </div>
                                    </>
                                  ) : (
                                    <div>System / Automated Action</div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center mb-2">
                                <HiOutlineCalendar className="w-4 h-4 mr-2 text-gray-500" />
                                <div>
                                  <div className="text-sm font-medium">Timestamp</div>
                                  <div>{formatDateTime(log.timestamp)}</div>
                                </div>
                              </div>

                              <div className="flex items-start mb-2">
                                <HiOutlineDocument className="w-4 h-4 mr-2 text-gray-500 mt-1" />
                                <div>
                                  <div className="text-sm font-medium">Resource</div>
                                  <div>{log.resource}</div>
                                  {log.resourceId && (
                                    <div className="text-sm text-gray-500">
                                      Resource ID: {log.resourceId}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center mb-2">
                                <span className="w-4 h-4 mr-2 text-gray-500">IP:</span>
                                <div>{log.ipAddress}</div>
                              </div>

                              <div className="flex items-start mb-2">
                                <HiOutlineExclamation className="w-4 h-4 mr-2 text-gray-500 mt-1" />
                                <div>
                                  <div className="text-sm font-medium">Status</div>
                                  <div>{getStatusBadge(log.status)}</div>
                                </div>
                              </div>

                              <div className="flex items-start">
                                <HiOutlineFilter className="w-4 h-4 mr-2 text-gray-500 mt-1" />
                                <div>
                                  <div className="text-sm font-medium">Action</div>
                                  <div>{getActionLabel(log.action)}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="text-sm font-medium">Details</div>
                            <div className="text-sm p-2 bg-gray-100 rounded mt-1">
                              {log.details}
                            </div>
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </React.Fragment>
              ))}

              {currentLogs.length === 0 && !loading && (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center py-4 text-gray-500">
                    {totalLogs > 0
                      ? 'No logs matching your current filter criteria'
                      : 'No audit logs found in the system.'}
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showIcons
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminAuditLogsPage;
