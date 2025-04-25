import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';

// Define the county type
interface County {
  id: string;
  name: string;
  state: string;
}

// Add the GraphQL query for counties
const GET_COUNTIES = gql`
  query GetCounties {
    counties {
      id
      name
      state
    }
  }
`;

interface Auction {
  id: number;
  title: string;
  county: string;
  status: string;
  startDate: string;
  endDate: string;
  totalCertificates: number;
  totalValue: number;
  bidders: number;
}

const sampleAuctions: Auction[] = [
  { id: 1, title: 'Miami-Dade Tax Certificate Auction 2023', county: 'Miami-Dade', status: 'Completed', startDate: '2023-05-31', endDate: '2023-06-03', totalCertificates: 5000, totalValue: 25000000, bidders: 380 },
  { id: 2, title: 'Broward County Tax Certificate Auction 2023', county: 'Broward', status: 'Completed', startDate: '2023-06-15', endDate: '2023-06-17', totalCertificates: 3500, totalValue: 18500000, bidders: 250 },
  { id: 3, title: 'Palm Beach Tax Certificate Auction 2023', county: 'Palm Beach', status: 'Completed', startDate: '2023-06-28', endDate: '2023-06-30', totalCertificates: 4200, totalValue: 22000000, bidders: 320 },
  { id: 4, title: 'Miami-Dade Tax Certificate Auction 2024', county: 'Miami-Dade', status: 'Scheduled', startDate: '2024-05-28', endDate: '2024-05-31', totalCertificates: 5200, totalValue: 28000000, bidders: 0 },
  { id: 5, title: 'Broward County Tax Certificate Auction 2024', county: 'Broward', status: 'Draft', startDate: '2024-06-12', endDate: '2024-06-15', totalCertificates: 3600, totalValue: 20000000, bidders: 0 },
];

const AdminAuctionsPage: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>(sampleAuctions);
  const [searchTerm, setSearchTerm] = useState('');
  const [countyFilter, setCountyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('view');
  
  // Replace the county query with the hook
  const { data: countiesData, loading: countiesLoading, error: countiesError } = useQuery(GET_COUNTIES);
  
  // Add form state for the auction modal
  const [formData, setFormData] = useState({
    title: '',
    county: '',
    startDate: '',
    endDate: '',
    status: 'Draft'
  });

  // Update when selectedAuction changes
  useEffect(() => {
    if (selectedAuction) {
      setFormData({
        title: selectedAuction.title || '',
        county: selectedAuction.county || '',
        startDate: selectedAuction.startDate || '',
        endDate: selectedAuction.endDate || '',
        status: selectedAuction.status || 'Draft'
      });
    } else {
      // Reset form for new auction
      setFormData({
        title: '',
        county: '',
        startDate: '',
        endDate: '',
        status: 'Draft'
      });
    }
  }, [selectedAuction]);

  // Form input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter auctions based on search and filters
  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = 
      auction.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounty = countyFilter === 'All' || auction.county === countyFilter;
    const matchesStatus = statusFilter === 'All' || auction.status === statusFilter;
    
    return matchesSearch && matchesCounty && matchesStatus;
  });

  const openAddModal = () => {
    setModalMode('add');
    setSelectedAuction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (auction: Auction) => {
    setModalMode('edit');
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  const openViewModal = (auction: Auction) => {
    setModalMode('view');
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  const handleDeleteAuction = (auctionId: number) => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      setAuctions(auctions.filter(auction => auction.id !== auctionId));
    }
  };

  const handleSaveAuction = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use formData instead of form elements
    if (modalMode === 'add') {
      // Add new auction logic here
      console.log('Adding new auction:', formData);
      
      // For mock data demo, add to the auctions array
      const newAuction: Auction = {
        id: Math.max(...auctions.map(a => a.id)) + 1,
        title: formData.title,
        county: formData.county,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalCertificates: 0,
        totalValue: 0,
        bidders: 0
      };
      
      // In a real app, you'd use a mutation here
      // setAuctions([...auctions, newAuction]);
    } else if (modalMode === 'edit' && selectedAuction) {
      // Edit existing auction logic here
      console.log('Editing auction:', formData);
      
      // For mock data demo, update the auction in the array
      const updatedAuction: Auction = {
        ...selectedAuction,
        title: formData.title,
        county: formData.county,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
      };
      
      // In a real app, you'd use a mutation here
      // setAuctions(auctions.map(a => a.id === selectedAuction.id ? updatedAuction : a));
    }
    
    // Close modal
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Auction Management</h1>
          <p className="text-gray-600">
            Create, manage, and monitor tax certificate auctions
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => window.location.href = "/admin/auction-management"}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            Advanced Management
          </button>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Auction
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by auction title"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md"
              value={countyFilter}
              onChange={(e) => setCountyFilter(e.target.value)}
            >
              <option value="All">All Counties</option>
              {countiesLoading ? (
                <option value="">Loading counties...</option>
              ) : countiesError ? (
                <option value="">Error loading counties</option>
              ) : countiesData?.counties.length > 0 ? (
                countiesData.counties.map((county: County) => (
                  <option key={county.id} value={county.name}>
                    {county.name}
                  </option>
                ))
              ) : (
                <option value="">No counties available</option>
              )}
            </select>
            {countiesError && (
              <p className="text-red-500 text-xs mt-1">Failed to load counties. Please try again.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Auctions Table */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auction Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">County</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificates</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAuctions.map((auction) => (
              <tr key={auction.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openViewModal(auction)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-600">{auction.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{auction.county}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${auction.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      auction.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                      auction.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      auction.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'}`}>
                    {auction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{auction.startDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{auction.endDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{auction.totalCertificates.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(auction);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAuction(auction.id);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAuctions.length === 0 && (
          <div className="text-center py-4 text-gray-500">No auctions found matching your criteria</div>
        )}
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAuctions.length}</span> of{' '}
              <span className="font-medium">{filteredAuctions.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button aria-current="page" className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Add/Edit/View Auction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {modalMode === 'add' ? 'Create Auction' : 
                 modalMode === 'edit' ? 'Edit Auction' : 
                 'Auction Details'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveAuction}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Auction Title</label>
                <input
                  type="text"
                  name="title"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  readOnly={modalMode === 'view'}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  name="county"
                  value={formData.county}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view'}
                >
                  <option value="">Select a county</option>
                  {countiesLoading ? (
                    <option value="" disabled>Loading counties...</option>
                  ) : countiesError ? (
                    <option value="" disabled>Error loading counties</option>
                  ) : countiesData?.counties.length > 0 ? (
                    countiesData.counties.map((county: County) => (
                      <option key={county.id} value={county.name}>
                        {county.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No counties available</option>
                  )}
                </select>
                {countiesError && (
                  <p className="text-red-500 text-xs mt-1">Failed to load counties. Please try again.</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    readOnly={modalMode === 'view'}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    readOnly={modalMode === 'view'}
                  />
                </div>
              </div>
              {modalMode !== 'add' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              )}
              {modalMode === 'add' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    defaultValue="Draft"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              )}
              {modalMode === 'view' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Certificates</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                        value={selectedAuction?.totalCertificates.toLocaleString() || '0'}
                        readOnly
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Value</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                        value={`$${selectedAuction?.totalValue.toLocaleString() || '0'}`}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Bidders</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                      value={selectedAuction?.bidders.toString() || '0'}
                      readOnly
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {modalMode !== 'view' && (
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    {modalMode === 'add' ? 'Create Auction' : 'Save Changes'}
                  </button>
                )}
                {modalMode === 'view' && selectedAuction?.status !== 'Completed' && selectedAuction?.status !== 'Cancelled' && (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Manage Certificates
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuctionsPage; 