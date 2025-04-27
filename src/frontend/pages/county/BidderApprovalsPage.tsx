import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Badge,
  Card,
  Spinner,
  Alert,
} from 'flowbite-react';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { gql, useQuery, useMutation } from '@apollo/client';

// GraphQL query to fetch pending bidder registrations for the county
const GET_PENDING_BIDDERS = gql`
  query GetPendingBidderRegistrations {
    pendingBidderRegistrationsForCounty {
      id
      userId
      user {
        email
        firstName
        lastName
      }
      status
      createdAt
      documents {
        id
        documentType
        fileUrl
      }
    }
  }
`;

// GraphQL mutation to approve/reject bidder
const APPROVE_BIDDER = gql`
  mutation ApproveBidderRegistration($id: ID!) {
    approveBidderRegistration(id: $id) {
      id
      status
    }
  }
`;

const REJECT_BIDDER = gql`
  mutation RejectBidderRegistration($id: ID!, $reason: String!) {
    rejectBidderRegistration(id: $id, reason: $reason) {
      id
      status
    }
  }
`;

const BidderApprovalsPage: React.FC = () => {
  const [selectedBidder, setSelectedBidder] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Query to fetch pending bidder registrations
  const { data, loading, error, refetch } = useQuery(GET_PENDING_BIDDERS);

  // Mutations for approving/rejecting bidders
  const [approveBidder, { loading: approveLoading }] = useMutation(APPROVE_BIDDER, {
    onCompleted: () => {
      setAlert({ type: 'success', message: 'Bidder approved successfully!' });
      refetch();
    },
    onError: (error) => {
      setAlert({ type: 'error', message: `Error approving bidder: ${error.message}` });
    }
  });

  const [rejectBidder, { loading: rejectLoading }] = useMutation(REJECT_BIDDER, {
    onCompleted: () => {
      setAlert({ type: 'success', message: 'Bidder rejected successfully!' });
      setShowRejectionModal(false);
      refetch();
    },
    onError: (error) => {
      setAlert({ type: 'error', message: `Error rejecting bidder: ${error.message}` });
    }
  });

  const handleApprove = (id: string) => {
    approveBidder({ variables: { id } });
  };

  const handleReject = (id: string) => {
    if (rejectionReason.trim() === '') {
      setAlert({ type: 'error', message: 'Please provide a reason for rejection' });
      return;
    }
    
    rejectBidder({ variables: { id, reason: rejectionReason } });
  };

  const openRejectionModal = (bidder: any) => {
    setSelectedBidder(bidder);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Bidder Approvals</h1>
      <p className="text-gray-600 mb-6">
        Review and approve or reject pending bidder registrations for your county.
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
            <span className="ml-2">Loading bidder registrations...</span>
          </div>
        ) : error ? (
          <Alert color="failure">
            Error loading bidder registrations: {error.message}
          </Alert>
        ) : data?.pendingBidderRegistrationsForCounty?.length === 0 ? (
          <p className="text-center p-8 text-gray-500">
            No pending bidder registrations to approve.
          </p>
        ) : (
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Submitted</Table.HeadCell>
              <Table.HeadCell>Documents</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {data?.pendingBidderRegistrationsForCounty?.map((registration: any) => (
                <Table.Row key={registration.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {`${registration.user.firstName} ${registration.user.lastName}`}
                  </Table.Cell>
                  <Table.Cell>{registration.user.email}</Table.Cell>
                  <Table.Cell>
                    <Badge color="warning">
                      {registration.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(registration.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {registration.documents?.length > 0 ? (
                      <div className="flex flex-col space-y-1">
                        {registration.documents.map((doc: any) => (
                          <a
                            key={doc.id}
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {doc.documentType}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">No documents</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button
                        size="xs"
                        color="success"
                        onClick={() => handleApprove(registration.id)}
                        disabled={approveLoading}
                      >
                        <HiCheckCircle className="mr-1" /> Approve
                      </Button>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => openRejectionModal(registration)}
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

      {/* Rejection Modal - In a real app, use a proper modal component */}
      {showRejectionModal && selectedBidder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Reject Bidder Registration
            </h3>
            <p className="mb-4">
              Please provide a reason for rejecting {selectedBidder.user.firstName} {selectedBidder.user.lastName}'s registration:
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
                onClick={() => handleReject(selectedBidder.id)}
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

export default BidderApprovalsPage; 