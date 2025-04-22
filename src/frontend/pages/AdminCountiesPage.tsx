import React, { useState, useEffect } from 'react';
import axios from 'axios';

// County type definition based on our Prisma schema
interface County {
  id: string;
  name: string;
  state: string;
  countyCode?: string;
  websiteUrl?: string;
  taxCollectorUrl?: string;
  propertyAppraiserUrl?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Form state for creating/editing counties
interface CountyFormData {
  name: string;
  state: string;
  countyCode?: string;
  websiteUrl?: string;
  taxCollectorUrl?: string;
  propertyAppraiserUrl?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

const AdminCountiesPage: React.FC = () => {
  // State for counties list
  const [counties, setCounties] = useState<County[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for county form
  const [formData, setFormData] = useState<CountyFormData>({
    name: '',
    state: '',
    countyCode: '',
    websiteUrl: '',
    taxCollectorUrl: '',
    propertyAppraiserUrl: '',
    description: '',
  });
  
  // State for CRUD operations
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentCountyId, setCurrentCountyId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Fetch counties on component mount
  useEffect(() => {
    fetchCounties();
  }, []);

  // Fetch counties from API
  const fetchCounties = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/counties');
      setCounties(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch counties. Please try again later.');
      console.error('Error fetching counties:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      state: '',
      countyCode: '',
      websiteUrl: '',
      taxCollectorUrl: '',
      propertyAppraiserUrl: '',
      description: '',
    });
    setIsEditing(false);
    setCurrentCountyId(null);
  };

  // Open modal for creating a new county
  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open modal for editing an existing county
  const handleEdit = (county: County) => {
    setFormData({
      name: county.name,
      state: county.state,
      countyCode: county.countyCode || '',
      websiteUrl: county.websiteUrl || '',
      taxCollectorUrl: county.taxCollectorUrl || '',
      propertyAppraiserUrl: county.propertyAppraiserUrl || '',
      description: county.description || '',
      latitude: county.latitude,
      longitude: county.longitude,
    });
    setIsEditing(true);
    setCurrentCountyId(county.id);
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentCountyId) {
        // Update existing county
        await axios.put(`/api/counties/${currentCountyId}`, formData);
      } else {
        // Create new county
        await axios.post('/api/counties', formData);
      }
      
      // Refresh the counties list
      fetchCounties();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError('Failed to save county. Please try again.');
      console.error('Error saving county:', err);
    }
  };

  // Handle county deletion
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/counties/${id}`);
      setCounties(counties.filter(county => county.id !== id));
      setConfirmDelete(null);
    } catch (err) {
      setError('Failed to delete county. Please try again.');
      console.error('Error deleting county:', err);
    }
  };

  // Filter counties based on search term
  const filteredCounties = counties.filter(
    county => county.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              county.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add Wakulla County (for the task requirement)
  const addWakullaCounty = async () => {
    const wakullaData = {
      name: 'Wakulla',
      state: 'Florida',
      countyCode: 'FL-65',
      websiteUrl: 'https://www.mywakulla.com',
      taxCollectorUrl: 'https://wakulla.county-taxes.com/public',
      propertyAppraiserUrl: 'https://www.wakullapa.com/',
      description: 'Wakulla County is a county located in the Florida Panhandle in the northwestern part of the U.S. state of Florida.',
      latitude: 30.0977,
      longitude: -84.3866
    };
    
    try {
      await axios.post('/api/counties', wakullaData);
      fetchCounties();
    } catch (err) {
      setError('Failed to add Wakulla County. Please try again.');
      console.error('Error adding Wakulla County:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">Manage Counties</h1>
        <div className="flex space-x-2">
          <button
            onClick={addWakullaCounty}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Add Wakulla County (FL)
          </button>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add New County
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search counties by name or state..."
          className="px-4 py-2 border border-gray-300 rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Counties Table */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading counties...</p>
        </div>
      ) : filteredCounties.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">County Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Websites</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCounties.map((county) => (
                <tr key={county.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{county.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{county.state}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{county.countyCode || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 space-y-1">
                      {county.websiteUrl && (
                        <a href={county.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                          County Website
                        </a>
                      )}
                      {county.taxCollectorUrl && (
                        <a href={county.taxCollectorUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                          Tax Collector
                        </a>
                      )}
                      {county.propertyAppraiserUrl && (
                        <a href={county.propertyAppraiserUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                          Property Appraiser
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleEdit(county)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    {confirmDelete === county.id ? (
                      <div className="inline-flex items-center">
                        <span className="text-red-600 mr-2">Confirm?</span>
                        <button
                          onClick={() => handleDelete(county.id)}
                          className="text-red-600 hover:text-red-900 mr-2"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(county.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-600">No counties found. Please try a different search or add a new county.</p>
        </div>
      )}

      {/* County Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit County' : 'Add New County'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    County Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    County Code
                  </label>
                  <input
                    type="text"
                    name="countyCode"
                    value={formData.countyCode}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    County Website URL
                  </label>
                  <input
                    type="url"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tax Collector URL
                  </label>
                  <input
                    type="url"
                    name="taxCollectorUrl"
                    value={formData.taxCollectorUrl}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Property Appraiser URL
                  </label>
                  <input
                    type="url"
                    name="propertyAppraiserUrl"
                    value={formData.propertyAppraiserUrl}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-5 pt-5 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {isEditing ? 'Update County' : 'Add County'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCountiesPage; 