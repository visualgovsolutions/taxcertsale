/**
 * CertificateManagementPage Component
 *
 * Admin page for managing tax certificates.
 * Provides functionality to view, assign, and mark certificates as redeemed.
 */

import React, { useState } from 'react';
import { Breadcrumb, Button, Alert, Spinner } from 'flowbite-react';
import { HiHome, HiPlus, HiCloudUpload, HiDocumentDownload } from 'react-icons/hi';
import { gql, useQuery, useMutation } from '@apollo/client';
import CertificateListTable from '../../components/admin/CertificateListTable';
import CertificateAssignModal from '../../components/admin/CertificateAssignModal';
import CertificateRedemptionModal from '../../components/admin/CertificateRedemptionModal';
import CertificateDetailsModal from '../../components/admin/CertificateDetailsModal';
import CertificateCreateModal, {
  CertificateCreateData,
} from '../../components/admin/CertificateCreateModal';
import type { CertificateStatus } from '../../components/admin/CertificateListTable';

// GraphQL query to fetch certificates
const GET_CERTIFICATES = gql`
  query GetCertificates($limit: Int, $offset: Int, $status: String) {
    certificates(limit: $limit, offset: $offset, status: $status) {
      id
      parcelId
      propertyAddress
      ownerName
      faceValue
      interestRate
      status
      redemptionAmount
      redemptionDate
      auctionId
      createdAt
      updatedAt
    }
  }
`;

// GraphQL mutation to assign certificate to auction
const ASSIGN_CERTIFICATE = gql`
  mutation AssignCertificate($certificateId: ID!, $auctionId: ID!) {
    assignCertificateToAuction(certificateId: $certificateId, auctionId: $auctionId) {
      id
      status
      auctionId
    }
  }
`;

// GraphQL mutation to mark certificate as redeemed
const REDEEM_CERTIFICATE = gql`
  mutation RedeemCertificate(
    $certificateId: ID!
    $redemptionAmount: Float!
    $redemptionDate: String!
  ) {
    redeemCertificate(
      certificateId: $certificateId
      redemptionAmount: $redemptionAmount
      redemptionDate: $redemptionDate
    ) {
      id
      status
      redemptionAmount
      redemptionDate
    }
  }
`;

// GraphQL mutation to create a new certificate
const CREATE_CERTIFICATE = gql`
  mutation CreateCertificate(
    $parcelId: String!
    $propertyAddress: String!
    $ownerName: String!
    $faceValue: Float!
    $interestRate: Float!
  ) {
    createCertificate(
      parcelId: $parcelId
      propertyAddress: $propertyAddress
      ownerName: $ownerName
      faceValue: $faceValue
      interestRate: $interestRate
    ) {
      id
      parcelId
      propertyAddress
      ownerName
      faceValue
      interestRate
      status
    }
  }
`;

// GraphQL query to fetch auctions for assignment
const GET_AUCTIONS = gql`
  query GetAuctions($status: String) {
    auctions(status: $status) {
      id
      name
      startDate
      endDate
      status
    }
  }
`;

interface Certificate {
  id: string;
  parcelId: string;
  propertyAddress: string;
  ownerName: string;
  faceValue: number;
  interestRate: number;
  status: CertificateStatus;
  redemptionAmount?: number;
  redemptionDate?: string;
  auctionId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Auction {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
}

const CertificateManagementPage: React.FC = () => {
  // State for modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRedemptionModal, setShowRedemptionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Pagination state
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  // Query for certificates
  const { loading, data, refetch } = useQuery(GET_CERTIFICATES, {
    variables: { limit, offset },
    onError: error => {
      setError(`Error loading certificates: ${error.message}`);
    },
  });

  // Query for auctions
  const { data: auctionsData } = useQuery(GET_AUCTIONS, {
    variables: { status: 'UPCOMING' },
    onError: error => {
      setError(`Error loading auctions: ${error.message}`);
    },
  });

  // Mutation for assigning certificate to auction
  const [assignCertificate, { loading: assignLoading }] = useMutation(ASSIGN_CERTIFICATE, {
    onCompleted: () => {
      setSuccess('Certificate successfully assigned to auction');
      setShowAssignModal(false);
      refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: error => {
      setError(`Error assigning certificate: ${error.message}`);
    },
  });

  // Mutation for redeeming certificate
  const [redeemCertificate, { loading: redeemLoading }] = useMutation(REDEEM_CERTIFICATE, {
    onCompleted: () => {
      setSuccess('Certificate successfully marked as redeemed');
      setShowRedemptionModal(false);
      refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: error => {
      setError(`Error redeeming certificate: ${error.message}`);
    },
  });

  // Mutation for creating a new certificate
  const [createCertificate, { loading: createLoading }] = useMutation(CREATE_CERTIFICATE, {
    onCompleted: () => {
      setSuccess('Certificate successfully created');
      setShowCreateModal(false);
      refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: error => {
      setError(`Error creating certificate: ${error.message}`);
    },
  });

  const handleAssignToAuction = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowAssignModal(true);
    setError(null);
  };

  const handleMarkAsRedeemed = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowRedemptionModal(true);
    setError(null);
  };

  const handleViewDetails = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowDetailsModal(true);
    setError(null);
  };

  const handleShowCreateModal = () => {
    setShowCreateModal(true);
    setError(null);
  };

  // Handle assign certificate to auction
  const handleAssign = (certificateId: string, auctionId: string) => {
    assignCertificate({ variables: { certificateId, auctionId } });
  };

  // Handle mark certificate as redeemed
  const handleRedeem = (
    certificateId: string,
    redemptionAmount: number,
    redemptionDate: string
  ) => {
    redeemCertificate({
      variables: {
        certificateId,
        redemptionAmount,
        redemptionDate,
      },
    });
  };

  // Handle create certificate
  const handleCreate = (certificateData: CertificateCreateData) => {
    createCertificate({
      variables: certificateData,
    });
  };

  // Handle pagination
  const handleNextPage = () => {
    if (data?.certificates?.length === limit) {
      setOffset(offset + limit);
    }
  };

  const handlePrevPage = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Certificate Management</h1>
          <Breadcrumb>
            <Breadcrumb.Item href="/admin" icon={HiHome}>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item>Certificates</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="flex space-x-2">
          <Button color="success" size="sm" onClick={handleShowCreateModal}>
            <HiPlus className="mr-2 h-5 w-5" />
            New Certificate
          </Button>
          <Button color="light" size="sm">
            <HiCloudUpload className="mr-2 h-5 w-5" />
            Import
          </Button>
          <Button color="light" size="sm">
            <HiDocumentDownload className="mr-2 h-5 w-5" />
            Export
          </Button>
        </div>
      </div>

      {/* Error or success alert */}
      {error && (
        <Alert color="failure" onDismiss={() => setError(null)}>
          <span className="font-medium">Error!</span> {error}
        </Alert>
      )}

      {success && (
        <Alert color="success" onDismiss={() => setSuccess(null)}>
          <span className="font-medium">Success!</span> {success}
        </Alert>
      )}

      {/* Loading indicator */}
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Spinner size="xl" />
          <span className="ml-2">Loading certificates...</span>
        </div>
      ) : (
        <>
          <CertificateListTable
            certificates={data?.certificates || []}
            onAssignToAuction={handleAssignToAuction}
            onMarkAsRedeemed={handleMarkAsRedeemed}
            onViewDetails={handleViewDetails}
          />

          {/* Pagination controls */}
          <div className="flex justify-between mt-4">
            <Button onClick={handlePrevPage} disabled={offset === 0} color="light">
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={data?.certificates?.length < limit}
              color="light"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Modal components */}
      <CertificateAssignModal
        show={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        certificate={selectedCertificate}
        onAssign={handleAssign}
        loading={assignLoading}
        auctions={auctionsData?.auctions || []}
      />

      <CertificateRedemptionModal
        show={showRedemptionModal}
        onClose={() => setShowRedemptionModal(false)}
        certificate={selectedCertificate}
        onRedeem={handleRedeem}
        loading={redeemLoading}
      />

      <CertificateDetailsModal
        show={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        certificate={selectedCertificate}
      />

      <CertificateCreateModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
        loading={createLoading}
      />
    </div>
  );
};

export default CertificateManagementPage;
