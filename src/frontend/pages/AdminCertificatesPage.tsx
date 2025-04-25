import React, { useState } from 'react';

interface Certificate {
  id: number;
  certificateNumber: string;
  propertyId: string;
  county: string;
  faceValue: number;
  status: string;
  issueDate: string;
  expirationDate: string;
  interestRate: number;
}

const sampleCertificates: Certificate[] = [
  { id: 1, certificateNumber: 'CERT-2023-001', propertyId: 'A123456', county: 'Miami-Dade', faceValue: 5000, status: 'Active', issueDate: '2023-05-15', expirationDate: '2026-05-15', interestRate: 18 },
  { id: 2, certificateNumber: 'CERT-2023-002', propertyId: 'B789012', county: 'Broward', faceValue: 3500, status: 'Active', issueDate: '2023-06-01', expirationDate: '2026-06-01', interestRate: 16 },
  { id: 3, certificateNumber: 'CERT-2023-003', propertyId: 'C345678', county: 'Palm Beach', faceValue: 7500, status: 'Redeemed', issueDate: '2023-03-10', expirationDate: '2026-03-10', interestRate: 18 },
  { id: 4, certificateNumber: 'CERT-2023-004', propertyId: 'D901234', county: 'Miami-Dade', faceValue: 12000, status: 'Expired', issueDate: '2020-04-20', expirationDate: '2023-04-20', interestRate: 18 },
  { id: 5, certificateNumber: 'CERT-2023-005', propertyId: 'E567890', county: 'Broward', faceValue: 9000, status: 'Active', issueDate: '2023-07-05', expirationDate: '2026-07-05', interestRate: 16 },
];

const AdminCertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>(sampleCertificates);
  const [searchTerm, setSearchTerm] = useState('');
  const [countyFilter, setCountyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('view');
  
  // Filter certificates based on search and filters
  const filteredCertificates = certificates.filter(certificate => {
    const matchesSearch = 
      certificate.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      certificate.propertyId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounty = countyFilter === 'All' || certificate.county === countyFilter;
    const matchesStatus = statusFilter === 'All' || certificate.status === statusFilter;
    
    return matchesSearch && matchesCounty && matchesStatus;
  });

  const openAddModal = () => {
    setModalMode('add');
    setSelectedCertificate(null);
    setIsModalOpen(true);
  };

  const openEditModal = (certificate: Certificate) => {
    setModalMode('edit');
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  const openViewModal = (certificate: Certificate) => {
    setModalMode('view');
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  const handleDeleteCertificate = (certificateId: number) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      setCertificates(certificates.filter(certificate => certificate.id !== certificateId));
    }
  };

  const handleSaveCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call
    // For this demo, we'll just close the modal
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Certificate Management</h1>
          <p className="text-gray-600">
            Manage tax certificates, view status, and process redemptions
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => window.location.href = "/admin/certificate-management"}
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
            Add Certificate
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
              placeholder="Search by certificate number or property ID"
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
              <option value="Miami-Dade">Miami-Dade</option>
              <option value="Broward">Broward</option>
              <option value="Palm Beach">Palm Beach</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Redeemed">Redeemed</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate #</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">County</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Face Value</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCertificates.map((certificate) => (
              <tr key={certificate.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openViewModal(certificate)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-600">{certificate.certificateNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{certificate.propertyId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{certificate.county}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${certificate.faceValue.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{certificate.interestRate}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${certificate.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      certificate.status === 'Redeemed' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {certificate.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(certificate);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCertificate(certificate.id);
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
        {filteredCertificates.length === 0 && (
          <div className="text-center py-4 text-gray-500">No certificates found matching your criteria</div>
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
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCertificates.length}</span> of{' '}
              <span className="font-medium">{filteredCertificates.length}</span> results
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

      {/* Add/Edit/View Certificate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {modalMode === 'add' ? 'Add Certificate' : 
                 modalMode === 'edit' ? 'Edit Certificate' : 
                 'Certificate Details'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveCertificate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Number</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={selectedCertificate?.certificateNumber || ''}
                  required
                  readOnly={modalMode === 'view'}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Property ID</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={selectedCertificate?.propertyId || ''}
                  required
                  readOnly={modalMode === 'view'}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={selectedCertificate?.county || 'Miami-Dade'}
                  disabled={modalMode === 'view'}
                >
                  <option value="Miami-Dade">Miami-Dade</option>
                  <option value="Broward">Broward</option>
                  <option value="Palm Beach">Palm Beach</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Face Value ($)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={selectedCertificate?.faceValue || ''}
                  required
                  readOnly={modalMode === 'view'}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={selectedCertificate?.interestRate || '18'}
                  required
                  readOnly={modalMode === 'view'}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={selectedCertificate?.issueDate || ''}
                  required
                  readOnly={modalMode === 'view'}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={selectedCertificate?.expirationDate || ''}
                  required
                  readOnly={modalMode === 'view'}
                />
              </div>
              {(modalMode === 'edit' || modalMode === 'view') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    defaultValue={selectedCertificate?.status || 'Active'}
                    disabled={modalMode === 'view'}
                  >
                    <option value="Active">Active</option>
                    <option value="Redeemed">Redeemed</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
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
                    {modalMode === 'add' ? 'Add Certificate' : 'Save Changes'}
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

export default AdminCertificatesPage; 