import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client'; // Import Apollo hooks

const ITEMS_PER_PAGE = 10;

// Define the GraphQL query for fetching users
const GET_USERS = gql`
  query GetUsers {
    users { # Use the existing 'users' query
      id
      username # Use username from schema
      email
      role
      status
      kycStatus
      createdAt # Keep if needed for sorting/display later
      updatedAt # Keep if needed for sorting/display later
    }
  }
`;

// Define structure for user data from GraphQL
interface UserListData {
    id: string;
    username: string;
    email: string;
    role: string;
    status?: string | null;
    kycStatus?: string | null;
}

const UserManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: queryData, loading: queryLoading, error: queryError } = useQuery<{ users: UserListData[] }>(GET_USERS, {
      fetchPolicy: 'cache-and-network',
  });

  // Derived state for the list of users from the GraphQL query result.
  const usersList = queryData?.users || [];

  // Memoized calculation for filtered users list based on search term.
  // Recalculates only when searchTerm or the fetched usersList changes.
  const filteredUsers = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    if (!searchTerm) {
      return usersList;
    }
    return usersList.filter(user =>
      user.username.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.email.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm, usersList]);

  // --- Pagination Calculation ---
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Memoized calculation for the subset of users to display on the current page.
  // Includes logic to reset to page 1 if filters reduce total pages below current page.
  const paginatedUsers = useMemo(() => {
      if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(1); // Reset to page 1 if current page becomes invalid
          return filteredUsers.slice(0, ITEMS_PER_PAGE); // Return the first page immediately
      }
      return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, startIndex, endIndex, currentPage, totalPages]);

  // --- Event Handlers ---
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // --- Render Logic --- 

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by username or email..." // Updated placeholder
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {queryLoading && <p>Loading users...</p>}

      {/* Error State */}
      {queryError && (
          <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Error loading users: {queryError.message}
          </div>
      )}

      {/* Table Display (only render if not loading and no error, or if data exists despite error?) */}
      {!queryLoading && !queryError && (
          <>
              <div className="overflow-x-auto bg-white shadow rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                          <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th> {/* Changed from Name */}
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC Status</th>
                              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                          {paginatedUsers.map((user) => (
                              <tr key={user.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td> {/* Display username */}
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.status ?? 'N/A'}</td> {/* Handle null */} 
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.kycStatus ?? 'N/A'}</td> {/* Handle null */}
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <Link to={`/admin/users/${user.id}`} className="text-indigo-600 hover:text-indigo-900">View/Edit</Link>
                                  </td>
                              </tr>
                          ))}
                           {/* Handle empty state */}
                          {paginatedUsers.length === 0 && (
                              <tr>
                                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                      {searchTerm ? 'No users match your search.' : 'No users found.'}
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>

              {/* Pagination controls (only show if there are pages) */}
              {totalPages > 0 && (
                  <div className="mt-4 flex justify-between items-center">
                      <div>
                          <p className="text-sm text-gray-700">
                              Showing <span className="font-medium">{Math.min(startIndex + 1, filteredUsers.length)}</span> to <span className="font-medium">{Math.min(endIndex, filteredUsers.length)}</span> of{' '}
                              <span className="font-medium">{filteredUsers.length}</span> results
                          </p>
                      </div>
                      <div>
                          <button onClick={handlePreviousPage} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed mr-2">
                              Previous
                          </button>
                          <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                              Next
                          </button>
                      </div>
                  </div>
              )}
          </>
      )}
    </div>
  );
};

export default UserManagementPage; 