import React, { useState } from 'react';
import { Table, Button, Badge, TextInput, Label, Select, Card, Avatar, Pagination, Modal } from 'flowbite-react';
import { HiSearch, HiOutlineMail, HiUser, HiOutlinePhone, HiCheck, HiX, HiOutlineDocumentDownload, HiOutlineExclamation } from 'react-icons/hi';

interface UserRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  dateRegistered: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INCOMPLETE';
  idVerified: boolean;
  documents: {
    id: string;
    name: string;
    type: string;
    status: 'VERIFIED' | 'PENDING' | 'REJECTED';
    uploadDate: string;
  }[];
  notes?: string;
}

// Sample data
const sampleRegistrations: UserRegistration[] = [
  {
    id: 'reg_001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(305) 555-1234',
    company: 'Smith Investments LLC',
    title: 'Owner',
    dateRegistered: '2023-05-15T09:23:44Z',
    status: 'APPROVED',
    idVerified: true,
    documents: [
      {
        id: 'doc_001',
        name: 'drivers_license.jpg',
        type: 'ID',
        status: 'VERIFIED',
        uploadDate: '2023-05-15T09:25:32Z'
      },
      {
        id: 'doc_002',
        name: 'business_certificate.pdf',
        type: 'BUSINESS',
        status: 'VERIFIED',
        uploadDate: '2023-05-15T09:26:18Z'
      }
    ]
  },
  {
    id: 'reg_002',
    name: 'Maria Rodriguez',
    email: 'maria@investmentfirm.com',
    phone: '(786) 555-6789',
    company: 'Miami Investment Group',
    title: 'Manager',
    dateRegistered: '2023-05-16T14:12:55Z',
    status: 'PENDING',
    idVerified: false,
    documents: [
      {
        id: 'doc_003',
        name: 'passport.pdf',
        type: 'ID',
        status: 'PENDING',
        uploadDate: '2023-05-16T14:15:22Z'
      }
    ]
  },
  {
    id: 'reg_003',
    name: 'Robert Johnson',
    email: 'rjohnson@gmail.com',
    phone: '(561) 555-9876',
    company: 'Johnson Properties',
    title: 'CEO',
    dateRegistered: '2023-05-17T10:05:18Z',
    status: 'INCOMPLETE',
    idVerified: false,
    documents: []
  },
  {
    id: 'reg_004',
    name: 'Sarah Williams',
    email: 'swilliams@capitalfirm.com',
    phone: '(305) 555-4567',
    company: 'Capital Investment Firm',
    title: 'Director',
    dateRegistered: '2023-05-18T16:45:30Z',
    status: 'REJECTED',
    idVerified: false,
    documents: [
      {
        id: 'doc_004',
        name: 'drivers_license.jpg',
        type: 'ID',
        status: 'REJECTED',
        uploadDate: '2023-05-18T16:48:12Z'
      },
      {
        id: 'doc_005',
        name: 'business_license.pdf',
        type: 'BUSINESS',
        status: 'PENDING',
        uploadDate: '2023-05-18T16:50:05Z'
      }
    ],
    notes: 'ID document was blurry and couldn\'t be verified. Requested clearer image.'
  },
  {
    id: 'reg_005',
    name: 'David Chen',
    email: 'dchen@realestateinvest.com',
    phone: '(954) 555-2468',
    company: 'Real Estate Investments Inc.',
    title: 'Partner',
    dateRegistered: '2023-05-19T11:30:42Z',
    status: 'APPROVED',
    idVerified: true,
    documents: [
      {
        id: 'doc_006',
        name: 'passport.jpg',
        type: 'ID',
        status: 'VERIFIED',
        uploadDate: '2023-05-19T11:32:18Z'
      },
      {
        id: 'doc_007',
        name: 'company_registration.pdf',
        type: 'BUSINESS',
        status: 'VERIFIED',
        uploadDate: '2023-05-19T11:33:45Z'
      }
    ]
  },
  {
    id: 'reg_006',
    name: 'Emily Garcia',
    email: 'emily.garcia@hotmail.com',
    phone: '(786) 555-1357',
    company: 'Individual Investor',
    title: '',
    dateRegistered: '2023-05-20T09:15:33Z',
    status: 'PENDING',
    idVerified: true,
    documents: [
      {
        id: 'doc_008',
        name: 'drivers_license.pdf',
        type: 'ID',
        status: 'VERIFIED',
        uploadDate: '2023-05-20T09:17:22Z'
      }
    ]
  }
];

const AdminRegistrationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [selectedRegistration, setSelectedRegistration] = useState<UserRegistration | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const registrationsPerPage = 10;

  // Filter registrations based on search and filters
  const filteredRegistrations = sampleRegistrations.filter(registration => {
    const matchesSearch = (
      registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = statusFilter === 'ALL' || registration.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'ALL') {
      const regDate = new Date(registration.dateRegistered);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (dateFilter === 'TODAY') {
        matchesDate = regDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'YESTERDAY') {
        matchesDate = regDate.toDateString() === yesterday.toDateString();
      } else if (dateFilter === 'LAST_7_DAYS') {
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        matchesDate = regDate >= lastWeek;
      } else if (dateFilter === 'LAST_30_DAYS') {
        const lastMonth = new Date(today);
        lastMonth.setDate(lastMonth.getDate() - 30);
        matchesDate = regDate >= lastMonth;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const indexOfLastRegistration = currentPage * registrationsPerPage;
  const indexOfFirstRegistration = indexOfLastRegistration - registrationsPerPage;
  const currentRegistrations = filteredRegistrations.slice(indexOfFirstRegistration, indexOfLastRegistration);
  const totalPages = Math.ceil(filteredRegistrations.length / registrationsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'APPROVED':
        return <Badge color="success" icon={HiCheck}>Approved</Badge>;
      case 'REJECTED':
        return <Badge color="failure" icon={HiX}>Rejected</Badge>;
      case 'PENDING':
        return <Badge color="warning">Pending</Badge>;
      case 'INCOMPLETE':
        return <Badge color="gray">Incomplete</Badge>;
      default:
        return <Badge color="gray">{status}</Badge>;
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    switch(status) {
      case 'VERIFIED':
        return <Badge color="success" icon={HiCheck}>Verified</Badge>;
      case 'REJECTED':
        return <Badge color="failure" icon={HiX}>Rejected</Badge>;
      case 'PENDING':
      default:
        return <Badge color="warning">Pending</Badge>;
    }
  };

  const handleApproveRegistration = () => {
    // In a real app, this would send a request to the API
    console.log(`Approving registration ${selectedRegistration?.id} with notes: ${approvalNotes}`);
    setShowApproveModal(false);
    setApprovalNotes('');
    // For demo purposes, update the UI directly
    if (selectedRegistration) {
      selectedRegistration.status = 'APPROVED';
      setSelectedRegistration({...selectedRegistration});
    }
  };

  const handleRejectRegistration = () => {
    // In a real app, this would send a request to the API
    console.log(`Rejecting registration ${selectedRegistration?.id} with reason: ${rejectionReason}`);
    setShowRejectModal(false);
    // For demo purposes, update the UI directly
    if (selectedRegistration) {
      selectedRegistration.status = 'REJECTED';
      selectedRegistration.notes = rejectionReason;
      setSelectedRegistration({...selectedRegistration});
      setRejectionReason('');
    }
  };

  const handleDownloadDocument = (docId: string) => {
    // In a real app, this would initiate a document download
    console.log(`Downloading document with ID: ${docId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Registrations</h1>
          <p className="text-gray-600">
            Manage user registration applications and verifications
          </p>
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
              placeholder="Search by name, email, or company..."
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
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="INCOMPLETE">Incomplete</option>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="dateFilter" className="mb-1">Date Registered</Label>
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

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Registration list */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Registration Applications</h2>
              <div className="text-sm text-gray-500">
                {filteredRegistrations.length} {filteredRegistrations.length === 1 ? 'application' : 'applications'}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <Table.Head>
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Company</Table.HeadCell>
                  <Table.HeadCell>Date</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell>ID Verified</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {currentRegistrations.map((registration) => (
                    <Table.Row 
                      key={registration.id}
                      className={`${selectedRegistration?.id === registration.id ? 'bg-blue-50' : ''} hover:bg-gray-50 cursor-pointer`}
                      onClick={() => setSelectedRegistration(registration)}
                    >
                      <Table.Cell className="whitespace-nowrap font-medium">
                        <div className="flex items-center">
                          <Avatar 
                            placeholderInitials={registration.name.split(' ').map(n => n[0]).join('')} 
                            rounded
                            size="sm"
                            className="mr-2"
                          />
                          {registration.name}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        {registration.company}
                      </Table.Cell>
                      <Table.Cell>
                        {formatDate(registration.dateRegistered)}
                      </Table.Cell>
                      <Table.Cell>
                        {getStatusBadge(registration.status)}
                      </Table.Cell>
                      <Table.Cell>
                        {registration.idVerified ? 
                          <Badge color="success" icon={HiCheck}>Verified</Badge> : 
                          <Badge color="gray">Pending</Badge>
                        }
                      </Table.Cell>
                    </Table.Row>
                  ))}
                  
                  {currentRegistrations.length === 0 && (
                    <Table.Row>
                      <Table.Cell colSpan={5} className="text-center py-4 text-gray-500">
                        No registrations matching your criteria
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
        </div>

        {/* Right column - Registration details */}
        <div className="lg:col-span-1">
          <Card>
            {selectedRegistration ? (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-medium">Registration Details</h2>
                  {getStatusBadge(selectedRegistration.status)}
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    <Avatar 
                      placeholderInitials={selectedRegistration.name.split(' ').map(n => n[0]).join('')} 
                      rounded
                      size="lg"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-1">
                    {selectedRegistration.name}
                  </h3>
                  {selectedRegistration.title && selectedRegistration.company && (
                    <p className="text-gray-600 text-center mb-4">
                      {selectedRegistration.title}, {selectedRegistration.company}
                    </p>
                  )}
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <HiOutlineMail className="w-5 h-5 text-gray-500 mr-2" />
                    <span>{selectedRegistration.email}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <HiOutlinePhone className="w-5 h-5 text-gray-500 mr-2" />
                    <span>{selectedRegistration.phone}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <HiUser className="w-5 h-5 text-gray-500 mr-2" />
                    <span>Registered on {formatDate(selectedRegistration.dateRegistered)}</span>
                  </div>
                </div>
                
                {/* Documents section */}
                <div className="mb-6">
                  <h4 className="text-md font-medium mb-2">Uploaded Documents</h4>
                  
                  {selectedRegistration.documents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedRegistration.documents.map(doc => (
                        <div key={doc.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-xs text-gray-500">
                              {doc.type} • Uploaded on {formatDate(doc.uploadDate)}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {getDocumentStatusBadge(doc.status)}
                            <Button size="xs" color="light" onClick={() => handleDownloadDocument(doc.id)}>
                              <HiOutlineDocumentDownload className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No documents uploaded</p>
                  )}
                </div>
                
                {/* Notes section */}
                {selectedRegistration.notes && (
                  <div className="mb-6">
                    <h4 className="text-md font-medium mb-2">Notes</h4>
                    <div className="p-3 bg-gray-50 rounded text-sm">
                      {selectedRegistration.notes}
                    </div>
                  </div>
                )}
                
                {/* Action buttons */}
                {selectedRegistration.status === 'PENDING' && (
                  <div className="flex space-x-2">
                    <Button color="success" onClick={() => setShowApproveModal(true)}>
                      <HiCheck className="mr-2 h-5 w-5" />
                      Approve
                    </Button>
                    <Button color="failure" onClick={() => setShowRejectModal(true)}>
                      <HiX className="mr-2 h-5 w-5" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <HiUser className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                <p>Select a registration to view details</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Approval Modal */}
      <Modal
        show={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        size="md"
      >
        <Modal.Header>
          Approve Registration
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p>
              You are about to approve the registration for <span className="font-semibold">{selectedRegistration?.name}</span>.
            </p>
            <div>
              <Label htmlFor="approvalNotes">Notes (Optional)</Label>
              <TextInput
                id="approvalNotes"
                type="text"
                placeholder="Add approval notes..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="success" onClick={handleApproveRegistration}>
            Approve Registration
          </Button>
          <Button color="gray" onClick={() => setShowApproveModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        show={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        size="md"
      >
        <Modal.Header>
          Reject Registration
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <HiOutlineExclamation className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  You are about to reject the registration for <span className="font-semibold">{selectedRegistration?.name}</span>.
                </p>
                <p className="text-sm text-gray-500">
                  This action will prevent the user from participating in auctions until their registration is approved.
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor="rejectionReason" className="font-medium">Reason for Rejection</Label>
              <TextInput
                id="rejectionReason"
                type="text"
                placeholder="Provide reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleRejectRegistration}>
            Reject Registration
          </Button>
          <Button color="gray" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminRegistrationsPage; 