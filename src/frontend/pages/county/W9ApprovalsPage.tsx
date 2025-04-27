import React, { useState } from 'react';
import {
  Table,
  Button,
  Badge,
  Card,
  Spinner,
  Alert,
} from 'flowbite-react';
import { HiCheckCircle, HiXCircle, HiDocumentDownload, HiEye } from 'react-icons/hi';
import { gql, useQuery, useMutation } from '@apollo/client';

// GraphQL query to fetch pending W9 forms for the county
const GET_PENDING_W9_FORMS = gql`
  query GetPendingW9Forms {
    pendingW9Forms {
      id
      userId
      name
      businessName
      taxClassification
      address
      city
      state
      zipCode
      ssn
      ein
      status
      fileUrl
      submissionDate
      user {
        email
        firstName
        lastName
      }
    }
  }
`;

// GraphQL mutations to approve/reject W9 forms
const APPROVE_W9_FORM = gql`
  mutation ApproveW9Form($id: ID!) {
    approveW9Form(id: $id) {
      id
      status
      approvalDate
    }
  }
`;

const REJECT_W9_FORM = gql`
  mutation RejectW9Form($id: ID!, $reason: String!) {
    rejectW9Form(id: $id, reason: $reason) {
      id
      status
    }
  }
`;

const W9ApprovalsPage: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showFormPreview, setShowFormPreview] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Query to fetch pending W9 forms
  const { data, loading, error, refetch } = useQuery(GET_PENDING_W9_FORMS);

  // Mutations for approving/rejecting W9 forms
  const [approveW9Form, { loading: approveLoading }] = useMutation(APPROVE_W9_FORM, {
    onCompleted: () => {
      setAlert({ type: 'success', message: 'W9 form approved successfully!' });
      refetch();
    },
    onError: (error) => {
      setAlert({ type: 'error', message: `Error approving W9 form: ${error.message}` });
    }
  });

  const [rejectW9Form, { loading: rejectLoading }] = useMutation(REJECT_W9_FORM, {
    onCompleted: () => {
      setAlert({ type: 'success', message: 'W9 form rejected successfully!' });
      setShowRejectionModal(false);
      refetch();
    },
    onError: (error) => {
      setAlert({ type: 'error', message: `Error rejecting W9 form: ${error.message}` });
    }
  });

  const handleApprove = (id: string) => {
    approveW9Form({ variables: { id } });
  };

  const handleReject = (id: string) => {
    if (rejectionReason.trim() === '') {
      setAlert({ type: 'error', message: 'Please provide a reason for rejection' });
      return;
    }
    
    rejectW9Form({ variables: { id, reason: rejectionReason } });
  };

  const openRejectionModal = (form: any) => {
    setSelectedForm(form);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const openFormPreview = (form: any) => {
    setSelectedForm(form);
    setShowFormPreview(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">W9 Form Approvals</h1>
      <p className="text-gray-600 mb-6">
        Review and approve or reject pending W9 form submissions for your county.
      </p>

      {alert && (
        <Alert
          color={alert.type === 'success' ? 'success' : 'failure'}
          onDismiss={() => setAlert(null)}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      <Card>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Spinner size="xl" />
            <span className="ml-2">Loading W9 forms...</span>
          </div>
        ) : error ? (
          <Alert color="failure">
            Error loading W9 forms: {error.message}
          </Alert>
        ) : data?.pendingW9Forms?.length === 0 ? (
          <p className="text-center p-8 text-gray-500">
            No pending W9 forms to approve.
          </p>
        ) : (
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Tax Classification</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Submitted</Table.HeadCell>
              <Table.HeadCell>Form</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {data?.pendingW9Forms?.map((form: any) => (
                <Table.Row key={form.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {form.name}
                  </Table.Cell>
                  <Table.Cell>{form.user?.email}</Table.Cell>
                  <Table.Cell>{form.taxClassification}</Table.Cell>
                  <Table.Cell>
                    <Badge color="warning">
                      {form.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {form.submissionDate ? new Date(parseInt(form.submissionDate)).toLocaleDateString() : 'N/A'}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button
                        size="xs"
                        color="info"
                        onClick={() => openFormPreview(form)}
                      >
                        <HiEye className="mr-1" /> View
                      </Button>
                      {form.fileUrl && (
                        <a
                          href={form.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded flex items-center"
                        >
                          <HiDocumentDownload className="mr-1" /> PDF
                        </a>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button
                        size="xs"
                        color="success"
                        onClick={() => handleApprove(form.id)}
                        disabled={approveLoading}
                      >
                        <HiCheckCircle className="mr-1" /> Approve
                      </Button>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => openRejectionModal(form)}
                        disabled={rejectLoading}
                      >
                        <HiXCircle className="mr-1" /> Reject
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Card>

      {/* Form Preview Modal */}
      {showFormPreview && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              W9 Form Details - {selectedForm.name}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-gray-700">Taxpayer Information</h4>
                <p><span className="font-medium">Name:</span> {selectedForm.name}</p>
                {selectedForm.businessName && (
                  <p><span className="font-medium">Business Name:</span> {selectedForm.businessName}</p>
                )}
                <p><span className="font-medium">Tax Classification:</span> {selectedForm.taxClassification}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700">Contact Information</h4>
                <p><span className="font-medium">Email:</span> {selectedForm.user?.email}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700">Address</h4>
              <p>{selectedForm.address}</p>
              <p>{selectedForm.city}, {selectedForm.state} {selectedForm.zipCode}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-gray-700">Taxpayer Identification</h4>
                {selectedForm.ssn && (
                  <p><span className="font-medium">SSN:</span> ••••••{selectedForm.ssn.slice(-4)}</p>
                )}
                {selectedForm.ein && (
                  <p><span className="font-medium">EIN:</span> ••••{selectedForm.ein.slice(-4)}</p>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700">Submission Details</h4>
                <p>
                  <span className="font-medium">Submitted:</span> {selectedForm.submissionDate ? new Date(parseInt(selectedForm.submissionDate)).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              {selectedForm.fileUrl && (
                <a
                  href={selectedForm.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded flex items-center"
                >
                  <HiDocumentDownload className="mr-2" /> Download PDF
                </a>
              )}
              <Button
                color="gray"
                onClick={() => setShowFormPreview(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Reject W9 Form
            </h3>
            <p className="mb-4">
              Please provide a reason for rejecting this W9 form submission from {selectedForm.name}:
            </p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Rejection reason..."
            />
            <div className="flex justify-end space-x-2">
              <Button
                color="gray"
                onClick={() => setShowRejectionModal(false)}
              >
                Cancel
              </Button>
              <Button
                color="failure"
                onClick={() => handleReject(selectedForm.id)}
                disabled={rejectLoading}
              >
                {rejectLoading ? <Spinner size="sm" /> : <HiXCircle className="mr-1" />} Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default W9ApprovalsPage; 