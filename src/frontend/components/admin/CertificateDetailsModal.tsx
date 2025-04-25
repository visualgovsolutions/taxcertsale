import React from 'react';
import { Modal, Button, Label, Badge } from 'flowbite-react';
import { format } from 'date-fns';

interface Certificate {
  id: string;
  parcelId: string;
  propertyAddress: string;
  ownerName: string;
  faceValue: number;
  interestRate: number;
  status: string;
  redemptionAmount?: number;
  redemptionDate?: string;
  auctionId?: string;
  createdAt: string;
  updatedAt: string;
}

interface CertificateDetailsModalProps {
  show: boolean;
  onClose: () => void;
  certificate: Certificate | null;
}

const statusColors: Record<string, string> = {
  AVAILABLE: 'success',
  ASSIGNED: 'purple',
  SOLD: 'warning',
  REDEEMED: 'gray',
};

const CertificateDetailsModal: React.FC<CertificateDetailsModalProps> = ({
  show,
  onClose,
  certificate,
}) => {
  if (!certificate) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Modal show={show} onClose={onClose} size="xl">
      <Modal.Header>Certificate Details</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <h5 className="text-lg font-medium mb-2">Certificate Information</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parcelId">Parcel ID</Label>
                <div className="font-medium">{certificate.parcelId}</div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <div>
                  <Badge color={(statusColors[certificate.status] as any) || 'gray'}>
                    {certificate.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label htmlFor="propertyAddress">Property Address</Label>
                <div>{certificate.propertyAddress}</div>
              </div>
              <div>
                <Label htmlFor="ownerName">Property Owner</Label>
                <div>{certificate.ownerName}</div>
              </div>
              <div>
                <Label htmlFor="faceValue">Face Value</Label>
                <div>${certificate.faceValue.toLocaleString()}</div>
              </div>
              <div>
                <Label htmlFor="interestRate">Interest Rate</Label>
                <div>{certificate.interestRate}%</div>
              </div>
            </div>
          </div>

          {certificate.status === 'REDEEMED' &&
            certificate.redemptionAmount &&
            certificate.redemptionDate && (
              <div>
                <h5 className="text-lg font-medium mb-2">Redemption Details</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="redemptionAmount">Redemption Amount</Label>
                    <div>${certificate.redemptionAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <Label htmlFor="redemptionDate">Redemption Date</Label>
                    <div>{formatDate(certificate.redemptionDate)}</div>
                  </div>
                </div>
              </div>
            )}

          {(certificate.status === 'ASSIGNED' || certificate.status === 'SOLD') &&
            certificate.auctionId && (
              <div>
                <h5 className="text-lg font-medium mb-2">Auction Details</h5>
                <div>
                  <Label htmlFor="auctionId">Auction ID</Label>
                  <div>{certificate.auctionId}</div>
                  {/* In a real app, you would probably fetch and display more auction details */}
                </div>
              </div>
            )}

          <div>
            <h5 className="text-lg font-medium mb-2">System Information</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="createdAt">Created</Label>
                <div>{formatDate(certificate.createdAt)}</div>
              </div>
              <div>
                <Label htmlFor="updatedAt">Last Updated</Label>
                <div>{formatDate(certificate.updatedAt)}</div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CertificateDetailsModal;
