import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client'; // Import Apollo hooks and gql

// Define user data structure (reflecting added fields)
interface UserData {
    id: string;
    username?: string; // From GraphQL query
    name?: string; // Mapped from username for form
    email?: string;
    role?: string;
    status?: string | null; // Now included, can be null from Prisma
    kycStatus?: string | null; // Now included, can be null from Prisma
    createdAt?: string;
    updatedAt?: string; // Added updatedAt
}

// GraphQL Query Definition (uncomment status fields)
const GET_USER_DETAILS = gql`
  query GetUser($userId: ID!) {
    user(id: $userId) {
      id
      username
      email
      role
      status # Include status
      kycStatus # Include kycStatus
      createdAt
      updatedAt
    }
  }
`;

// GraphQL Mutation Definition (uncomment status fields)
const UPDATE_USER_DETAILS = gql`
  mutation UpdateUser($userId: ID!, $input: UpdateUserInput!) {
    updateUser(id: $userId, input: $input) {
      id
      username
      email
      role
      status # Include status
      kycStatus # Include kycStatus
      updatedAt
    }
  }
`;

const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // State to manage view vs. edit mode.
  const [isEditing, setIsEditing] = useState(false);
  // State to hold the form data independently during editing.
  // This prevents direct mutation of the cached query data.
  const [formData, setFormData] = useState<Partial<UserData>>({});
  // State specifically for errors encountered during the save mutation.
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetches user details using Apollo Client's useQuery hook.
  // 'cache-and-network' ensures initial load is fast (from cache if available)
  // but also checks the network for updates.
  const { data: queryData, loading: queryLoading, error: queryError, refetch } = useQuery<{ user: UserData }>(GET_USER_DETAILS, {
      variables: { userId },
      skip: !userId,
      fetchPolicy: 'cache-and-network',
  });

  // Prepares the updateUser mutation using Apollo Client's useMutation hook.
  // Includes basic error handling via the onError callback.
  const [updateUserMutation, { loading: mutationLoading }] = useMutation(UPDATE_USER_DETAILS, {
      onError: (error) => {
          console.error("Error updating user:", error);
          setSaveError(`Failed to save: ${error.message}`);
      }
      // Consider adding onCompleted or cache update logic for more complex scenarios.
  });

  // Effect to initialize or reset form data based on the fetched query data
  // or when exiting edit mode.
  useEffect(() => {
      if (queryData?.user && !isEditing) {
          const fetchedUser = {
              ...queryData.user,
              name: queryData.user.username, // Map DB field 'username' to form field 'name'
              status: queryData.user.status ?? '', // Convert null from DB to empty string for select input
              kycStatus: queryData.user.kycStatus ?? '', // Convert null from DB to empty string
          };
          setFormData(fetchedUser);
      }
  }, [queryData, isEditing]);

  // Handles changes to form inputs, updating the formData state.
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Switches component to edit mode, initializing form data from the current query result.
  const handleEditClick = () => {
    if (queryData?.user) {
        // Initialize form with current data from query result
        const currentUser = {
            ...queryData.user,
            name: queryData.user.username,
            status: queryData.user.status ?? '',
            kycStatus: queryData.user.kycStatus ?? '',
        };
        setFormData(currentUser);
        setIsEditing(true);
        setSaveError(null); // Clear previous save errors
    }
  };

  // Cancels editing, resetting form data to the original query result and exiting edit mode.
  const handleCancelClick = () => {
    if (queryData?.user) {
        // Reset form data to original from query result
        const originalUser = {
            ...queryData.user,
            name: queryData.user.username,
            status: queryData.user.status ?? '',
            kycStatus: queryData.user.kycStatus ?? '',
        };
        setFormData(originalUser);
    }
    setIsEditing(false);
    setSaveError(null); // Clear errors on cancel
  };

  // Handles the save action.
  // Prepares the input object for the GraphQL mutation, mapping form fields back to schema fields.
  // Converts null form values back to undefined if needed by the backend/mutation input type.
  // Calls the Apollo mutation function.
  const handleSaveClick = async () => {
      if (!userId || !formData) return;
      setSaveError(null);

      // Prepare input for mutation, matching UpdateUserInput type
      // Explicitly type the input object to help TypeScript
      const input: { username?: string; email?: string; role?: string; status?: string; kycStatus?: string } = {
          username: formData.name,
          email: formData.email,
          role: formData.role?.toUpperCase(),
          // Convert null to undefined for the mutation input type
          status: formData.status === null ? undefined : formData.status,
          kycStatus: formData.kycStatus === null ? undefined : formData.kycStatus 
      };

      // Remove undefined fields from input
      // Now TypeScript knows the possible keys of input
      Object.keys(input).forEach((key) => {
          const typedKey = key as keyof typeof input; // Cast key to known keys
          if (input[typedKey] === undefined) {
              delete input[typedKey];
          }
      });

      try {
          const result = await updateUserMutation({ variables: { userId, input } });
          if (result.data?.updateUser) {
              // Successfully updated
              setIsEditing(false);
              // Data might be updated in cache automatically or via refetchQueries/onCompleted
              // Optionally explicitly update local form state if needed, but relying on cache is better
              // refetch(); // Or refetch data explicitly if cache updates aren't reliable
          } else {
               // Handle case where mutation succeeded but returned no data (unexpected)
               setSaveError("Save completed but no data returned.");
          }
      } catch (err) {
          // Error handled by useMutation's onError callback
          console.error("Save click caught error (should be handled by onError):"); // Should not usually be reached if onError is set
      }
  };
  
  // Placeholder for deactivation logic (requires backend mutation).
  const handleDeactivate = () => {
      if (userId && window.confirm('Are you sure you want to deactivate this user?')) {
          console.log('Deactivating user:', userId);
          // TODO: Implement actual API call for deactivation (likely another mutation)
          alert('Deactivation functionality needs a backend mutation.');
      }
  };

  // Loading state
  if (queryLoading) {
      return <div className="container mx-auto px-4 py-8">Loading user details...</div>;
  }

  if (queryError) {
    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/admin/users" className="text-indigo-600 hover:text-indigo-900 mb-4 inline-block">&larr; Back to User List</Link>
            <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading User</h1>
            <p>{queryError.message}</p>
        </div>
    );
  }

  // Get user data safely after loading and error checks
  const displayUser = isEditing ? formData : { 
      ...queryData?.user, 
      name: queryData?.user?.username, 
      status: queryData?.user?.status ?? 'N/A',
      kycStatus: queryData?.user?.kycStatus ?? 'N/A' 
  };

  if (!displayUser?.id) {
      // This case should ideally be covered by queryError, but acts as a fallback
      return (
          <div className="container mx-auto px-4 py-8">
              <Link to="/admin/users" className="text-indigo-600 hover:text-indigo-900 mb-4 inline-block">&larr; Back to User List</Link>
              <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
              <p>Could not retrieve details for user ID: {userId}.</p>
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/admin/users" className="text-indigo-600 hover:text-indigo-900 mb-4 inline-block">&larr; Back to User List</Link>

      <h1 className="text-3xl font-bold mb-6">User Details: {isEditing ? 'Editing...' : displayUser.name}</h1>

      <div className="bg-white shadow rounded-lg p-6 relative">
          {/* Loading indicator during save (uses mutationLoading) */}
          {mutationLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <p>Saving...</p>
              </div>
          )}

          {/* Display Save Error during Edit */}
          {saveError && isEditing && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {saveError}
              </div>
          )}

          {!isEditing ? (
            // --- Read-only View (uses displayUser) ---
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div><span className="font-semibold">ID:</span> {displayUser.id}</div>
                <div><span className="font-semibold">Name:</span> {displayUser.name}</div>
                <div><span className="font-semibold">Email:</span> {displayUser.email}</div>
                <div><span className="font-semibold">Role:</span> {displayUser.role}</div>
                <div><span className="font-semibold">Status:</span> {displayUser.status}</div> 
                <div><span className="font-semibold">KYC Status:</span> {displayUser.kycStatus}</div> 
                <div><span className="font-semibold">Created At:</span> {displayUser.createdAt ? new Date(displayUser.createdAt).toLocaleString() : 'N/A'}</div>
                {displayUser.updatedAt && <div><span className="font-semibold">Updated At:</span> {new Date(displayUser.updatedAt).toLocaleString()}</div>}
              </div>
              <div className="border-t pt-4 flex justify-end space-x-2">
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Edit User
                </button>
                <button
                  onClick={handleDeactivate}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Deactivate User
                </button>
              </div>
            </>
          ) : (
            // --- Edit Form (uses formData for controlled inputs) ---
            <form onSubmit={(e) => { e.preventDefault(); handleSaveClick(); }}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div><span className="font-semibold">ID:</span> {formData.id}</div>
                  <div><span className="font-semibold">Created At:</span> {formData.createdAt ? new Date(formData.createdAt).toLocaleString() : 'N/A'}</div>
                  {/* Fields use formData.name, .email etc */}
                  <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                      <select name="role" id="role" value={formData.role || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          <option value="" disabled>Select Role</option>
                          <option value="INVESTOR">Bidder/Investor</option> {/* Adjust based on UserRole enum */}
                          <option value="ADMIN">Admin</option>
                          <option value="COUNTY_OFFICIAL">County Official</option>
                          <option value="USER">User</option>
                      </select>
                  </div>
                  {/* Add Status/KYC Status inputs if added to schema/mutation */}
                   {/* Example: Status Dropdown */}
                   <div>
                       <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                       <select name="status" id="status" value={formData.status || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                           <option value="" disabled>Select Status</option>
                           <option value="Active">Active</option>
                           <option value="Inactive">Inactive</option>
                           <option value="Pending KYC">Pending KYC</option>
                       </select>
                   </div>
                   {/* Example: KYC Status Dropdown */}
                  <div>
                       <label htmlFor="kycStatus" className="block text-sm font-medium text-gray-700">KYC Status</label>
                       <select name="kycStatus" id="kycStatus" value={formData.kycStatus || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          <option value="" disabled>Select KYC Status</option>
                          <option value="Verified">Verified</option>
                          <option value="Pending">Pending</option>
                          <option value="Rejected">Rejected</option>
                      </select>
                   </div>
              </div>
              <div className="border-t pt-4 flex justify-end space-x-2">
                  <button
                      type="button"
                      onClick={handleCancelClick}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      disabled={mutationLoading} // Disable cancel while saving
                  >
                      Cancel
                  </button>
                  <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      disabled={mutationLoading} // Disable save while saving
                  >
                      Save Changes
                  </button>
              </div>
            </form>
          )}
      </div>
    </div>
  );
};

export default UserDetailPage; 