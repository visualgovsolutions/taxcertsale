import React, { useState } from 'react';
import { Modal, Button, Label, Select, TextInput } from 'flowbite-react';
import { useQuery, gql } from '@apollo/client';

const GET_ACTIVE_AUCTIONS = gql`
  query GetActiveAuctions {
    auctions(status: ["DRAFT", "SCHEDULED", "ACTIVE"]) {
      id
      title
      county
      status
      startDate
      endDate
    }
  }
`;

interface Auction {
  id: string;
  title: string;
  county: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface Certificate {
  id: string;
  parcelId: string;
  propertyAddress: string;
  ownerName: string;
  faceValue: number;
  interestRate: number;
  status: string;
}

interface CertificateAssignModalProps {
  show: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  onAssign: (certificateId: string, auctionId: string) => void;
}

const CertificateAssignModal: React.FC<CertificateAssignModalProps> = ({
  show,
  onClose,
  certificate,
  onAssign,
}) => {
  const [selectedAuctionId, setSelectedAuctionId] = useState('');
  const [minBidAmount, setMinBidAmount] = useState('');

  const { loading, error, data } = useQuery(GET_ACTIVE_AUCTIONS, {
    fetchPolicy: 'network-only',
    skip: !show,
  });

  const handleAssign = () => {
    if (!certificate || !selectedAuctionId) return;

    onAssign(certificate.id, selectedAuctionId);
    handleClose();
  };

  const handleClose = () => {
    setSelectedAuctionId('');
    setMinBidAmount('');
    onClose();
  };

  if (!certificate) return null;

  return (
    <Modal show={show} onClose={handleClose}>
      <Modal.Header>Assign Certificate to Auction</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <h5 className="text-lg font-medium">Certificate Details</h5>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="parcelId">Parcel ID</Label>
                <div className="font-medium">{certificate.parcelId}</div>
              </div>
              <div>
                <Label htmlFor="propertyAddress">Property Address</Label>
                <div>{certificate.propertyAddress}</div>
              </div>
              <div>
                <Label htmlFor="ownerName">Owner</Label>
                <div>{certificate.ownerName}</div>
              </div>
              <div>
                <Label htmlFor="faceValue">Face Value</Label>
                <div>${certificate.faceValue.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium">Auction Assignment</h5>
            <div className="mt-2">
              <div className="mb-3">
                <Label htmlFor="auctionId">Select Auction</Label>
                <Select
                  id="auctionId"
                  value={selectedAuctionId}
                  onChange={e => setSelectedAuctionId(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select an auction...</option>
                  {data?.auctions.map((auction: Auction) => (
                    <option key={auction.id} value={auction.id}>
                      {auction.title} ({auction.status})
                    </option>
                  ))}
                </Select>
                {error && (
                  <p className="text-red-500 text-sm mt-1">
                    Error loading auctions: {error.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="minBidAmount">Minimum Bid Amount (Optional)</Label>
                <TextInput
                  id="minBidAmount"
                  type="number"
                  value={minBidAmount}
                  onChange={e => setMinBidAmount(e.target.value)}
                  placeholder="Leave empty to use face value"
                />
                <p className="text-xs text-gray-500 mt-1">
                  If left empty, the face value will be used as the minimum bid amount.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleAssign} disabled={!selectedAuctionId}>
          Assign to Auction
        </Button>
        <Button color="gray" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CertificateAssignModal;
