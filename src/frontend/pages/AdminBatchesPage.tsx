import React, { useState } from 'react';
import { Table, Button, Badge, TextInput, Label, Select, Card, Pagination, Modal, Spinner } from 'flowbite-react';
import { HiSearch, HiPlus, HiCloudUpload, HiDocumentDownload, HiOutlineExclamation } from 'react-icons/hi';

interface Batch {
  id: string;
  name: string;
  description: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalCertificates: number;
  processedCertificates: number;
  createdAt: string;
  createdBy: string;
  lastModified: string;
}

// Sample data
const sampleBatches: Batch[] = [
  {
    id: 'batch_001',
    name: 'Miami-Dade County 2023 Q1',
    description: 'Q1 2023 tax certificates for Miami-Dade County',
    status: 'COMPLETED',
    totalCertificates: 450,
    processedCertificates: 450,
    createdAt: '2023-01-15T09:00:00Z',
    createdBy: 'John Smith',
    lastModified: '2023-01-15T11:30:00Z'
  },
  {
    id: 'batch_002',
    name: 'Broward County 2023 Q1',
    description: 'Q1 2023 tax certificates for Broward County',
    status: 'COMPLETED',
    totalCertificates: 320,
    processedCertificates: 320,
    createdAt: '2023-01-20T10:15:00Z',
    createdBy: 'Maria Rodriguez',
    lastModified: '2023-01-20T13:45:00Z'
  },
  {
    id: 'batch_003',
    name: 'Palm Beach County 2023 Q1',
    description: 'Q1 2023 tax certificates for Palm Beach County',
    status: 'PROCESSING',
    totalCertificates: 380,
    processedCertificates: 215,
    createdAt: '2023-01-25T14:30:00Z',
    createdBy: 'John Smith',
    lastModified: '2023-01-25T16:20:00Z'
  },
  {
    id: 'batch_004',
    name: 'Miami-Dade County 2023 Q2',
    description: 'Q2 2023 tax certificates for Miami-Dade County',
    status: 'PENDING',
    totalCertificates: 500,
    processedCertificates: 0,
    createdAt: '2023-04-15T09:30:00Z',
    createdBy: 'John Smith',
    lastModified: '2023-04-15T09:30:00Z'
  },
  {
    id: 'batch_005',
    name: 'Broward County 2023 Q2',
    description: 'Q2 2023 tax certificates for Broward County',
    status: 'FAILED',
    totalCertificates: 300,
    processedCertificates: 125,
    createdAt: '2023-04-18T11:00:00Z',
    createdBy: 'Maria Rodriguez',
    lastModified: '2023-04-18T12:45:00Z'
  }
];

const AdminBatchesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showNewBatchModal, setShowNewBatchModal] = useState(false);
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchDescription, setNewBatchDescription] = useState('');
  const batchesPerPage = 10;

  // Filter batches based on search and filters
  const filteredBatches = sampleBatches.filter(batch => {
    const matchesSearch = (
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = statusFilter === 'ALL' || batch.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'ALL') {
      const batchDate = new Date(batch.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (dateFilter === 'TODAY') {
        matchesDate = batchDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'YESTERDAY') {
        matchesDate = batchDate.toDateString() === yesterday.toDateString();
      } else if (dateFilter === 'LAST_7_DAYS') {
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        matchesDate = batchDate >= lastWeek;
      } else if (dateFilter === 'LAST_30_DAYS') {
        const lastMonth = new Date(today);
        lastMonth.setDate(lastMonth.getDate() - 30);
        matchesDate = batchDate >= lastMonth;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const indexOfLastBatch = currentPage * batchesPerPage;
  const indexOfFirstBatch = indexOfLastBatch - batchesPerPage;
  const currentBatches = filteredBatches.slice(indexOfFirstBatch, indexOfLastBatch);
  const totalPages = Math.ceil(filteredBatches.length / batchesPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'COMPLETED':
        return <Badge color="success">Completed</Badge>;
      case 'PROCESSING':
        return <Badge color="warning">Processing</Badge>;
      case 'PENDING':
        return <Badge color="info">Pending</Badge>;
      case 'FAILED':
        return <Badge color="failure">Failed</Badge>;
      default:
        return <Badge color="gray">{status}</Badge>;
    }
  };

  const handleDeleteBatch = () => {
    // In a real app, this would send a request to the API
    console.log(`Deleting batch ${selectedBatch?.id}`);
    setShowDeleteModal(false);
    // For demo purposes, we can just clear the selection
    setSelectedBatch(null);
  };

  const handleCreateBatch = () => {
    // In a real app, this would send a request to the API
    console.log(`Creating new batch: ${newBatchName}`);
    setShowNewBatchModal(false);
    setNewBatchName('');
    setNewBatchDescription('');
    // For demo purposes, we could add the new batch to the list
  };

  const handleProcessBatch = (batchId: string) => {
    // In a real app, this would send a request to the API to start processing
    console.log(`Processing batch ${batchId}`);
  };

  const handleExportBatch = (batchId: string) => {
    // In a real app, this would initiate a download
    console.log(`Exporting batch ${batchId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Certificate Batches</h1>
          <p className="text-gray-600">
            Manage certificate import batches and processing
          </p>
        </div>
        <div className="flex space-x-2">
          <Button color="success" onClick={() => setShowNewBatchModal(true)}>
            <HiPlus className="mr-2 h-5 w-5" />
            New Batch
          </Button>
          <Button color="light">
            <HiCloudUpload className="mr-2 h-5 w-5" />
            Import
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search" className="mb-1">Search</Label>
            <TextInput
              id="search"
              type="text"
              icon={HiSearch}
              placeholder="Search batches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="statusFilter" className="mb-1">Status</Label>
            <Select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="dateFilter" className="mb-1">Date Created</Label>
            <Select
              id="dateFilter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="YESTERDAY">Yesterday</option>
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Batches Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>Batch Name</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Progress</Table.HeadCell>
              <Table.HeadCell>Created</Table.HeadCell>
              <Table.HeadCell>Created By</Table.HeadCell>
              <Table.HeadCell>Last Modified</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {currentBatches.map((batch) => (
                <Table.Row key={batch.id} className="hover:bg-gray-50">
                  <Table.Cell className="whitespace-nowrap font-medium">
                    <div>
                      <div className="font-medium">{batch.name}</div>
                      <div className="text-xs text-gray-500">{batch.description}</div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {getStatusBadge(batch.status)}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <div className="text-sm mb-1">
                        {batch.processedCertificates} / {batch.totalCertificates}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            batch.status === 'FAILED' ? 'bg-red-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${(batch.processedCertificates / batch.totalCertificates) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {formatDate(batch.createdAt)}
                  </Table.Cell>
                  <Table.Cell>
                    {batch.createdBy}
                  </Table.Cell>
                  <Table.Cell>
                    {formatDate(batch.lastModified)}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      {batch.status === 'PENDING' && (
                        <Button size="xs" color="info" onClick={() => handleProcessBatch(batch.id)}>
                          Process
                        </Button>
                      )}
                      {batch.status === 'COMPLETED' && (
                        <Button size="xs" color="light" onClick={() => handleExportBatch(batch.id)}>
                          <HiDocumentDownload className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="xs" color="failure" onClick={() => {
                        setSelectedBatch(batch);
                        setShowDeleteModal(true);
                      }}>
                        Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
              
              {currentBatches.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center py-4 text-gray-500">
                    No batches matching your criteria
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
              onPageChange={setCurrentPage}
              showIcons
            />
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        size="md"
      >
        <Modal.Header>
          Delete Batch
        </Modal.Header>
        <Modal.Body>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <HiOutlineExclamation className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="font-medium">
                Are you sure you want to delete the batch "{selectedBatch?.name}"?
              </p>
              <p className="text-sm text-gray-500 mt-1">
                This action cannot be undone. All certificates in this batch will be permanently removed.
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleDeleteBatch}>
            Delete Batch
          </Button>
          <Button color="gray" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* New Batch Modal */}
      <Modal
        show={showNewBatchModal}
        onClose={() => setShowNewBatchModal(false)}
        size="md"
      >
        <Modal.Header>
          Create New Batch
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="batchName" className="mb-1">Batch Name</Label>
              <TextInput
                id="batchName"
                type="text"
                placeholder="Enter batch name..."
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="batchDescription" className="mb-1">Description (Optional)</Label>
              <TextInput
                id="batchDescription"
                type="text"
                placeholder="Enter batch description..."
                value={newBatchDescription}
                onChange={(e) => setNewBatchDescription(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="batchFile" className="mb-1">Upload File</Label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col rounded-lg border-2 border-dashed border-gray-300 w-full h-32 p-10 group text-center cursor-pointer">
                  <div className="h-full w-full text-center flex flex-col items-center justify-center">
                    <HiCloudUpload className="w-8 h-8 text-gray-400 group-hover:text-gray-600" />
                    <p className="pointer-none text-gray-500 mt-2">
                      <span className="text-blue-600 hover:underline">Click to upload</span> or drag and drop CSV file
                    </p>
                  </div>
                  <input type="file" className="hidden" accept=".csv,.xlsx,.xls" />
                </label>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="success" onClick={handleCreateBatch}>
            Create Batch
          </Button>
          <Button color="gray" onClick={() => setShowNewBatchModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminBatchesPage; 