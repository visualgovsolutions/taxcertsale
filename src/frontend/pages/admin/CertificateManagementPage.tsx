/**
 * CertificateManagementPage Component
 * 
 * Admin page for managing tax certificates.
 * Provides functionality to view, assign, and mark certificates as redeemed.
 */

import React, { useState } from 'react';
import { Breadcrumb, Button } from 'flowbite-react';
import { HiHome, HiPlus, HiCloudUpload, HiDocumentDownload } from 'react-icons/hi';
import CertificateListTable from '../../components/admin/CertificateListTable';
import CertificateAssignModal from '../../components/admin/CertificateAssignModal';
import CertificateRedemptionModal from '../../components/admin/CertificateRedemptionModal';
import CertificateDetailsModal from '../../components/admin/CertificateDetailsModal';
import type { CertificateStatus } from '../../components/admin/CertificateListTable';

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

const CertificateManagementPage: React.FC = () => {
  // State for modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRedemptionModal, setShowRedemptionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const handleAssignToAuction = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowAssignModal(true);
  };

  const handleMarkAsRedeemed = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowRedemptionModal(true);
  };

  const handleViewDetails = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowDetailsModal(true);
  };

  // Handle assign certificate to auction
  const handleAssign = (certificateId: string, auctionId: string) => {
    console.log(`Assigning certificate ${certificateId} to auction ${auctionId}`);
    // In a real app, this would make an API call
    // Update UI state as needed
  };

  // Handle mark certificate as redeemed
  const handleRedeem = (certificateId: string, redemptionAmount: number, redemptionDate: string) => {
    console.log(`Marking certificate ${certificateId} as redeemed for $${redemptionAmount} on ${redemptionDate}`);
    // In a real app, this would make an API call
    // Update UI state as needed
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Certificate Management
          </h1>
          <Breadcrumb>
            <Breadcrumb.Item href="/admin" icon={HiHome}>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item>Certificates</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="flex space-x-2">
          <Button color="success" size="sm">
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

      <CertificateListTable
        onAssignToAuction={handleAssignToAuction}
        onMarkAsRedeemed={handleMarkAsRedeemed}
        onViewDetails={handleViewDetails}
      />

      {/* Modal components */}
      <CertificateAssignModal
        show={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        certificate={selectedCertificate}
        onAssign={handleAssign}
      />

      <CertificateRedemptionModal
        show={showRedemptionModal}
        onClose={() => setShowRedemptionModal(false)}
        certificate={selectedCertificate}
        onRedeem={handleRedeem}
      />

      <CertificateDetailsModal
        show={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        certificate={selectedCertificate}
      />
    </div>
  );
};

export default CertificateManagementPage; 