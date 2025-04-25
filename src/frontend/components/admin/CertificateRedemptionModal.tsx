import React, { useState } from 'react';
import { Modal, Button, Label, TextInput } from 'flowbite-react';

interface Certificate {
  id: string;
  parcelId: string;
  propertyAddress: string;
  ownerName: string;
  faceValue: number;
  interestRate: number;
  status: string;
}

interface CertificateRedemptionModalProps {
  show: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  onRedeem: (certificateId: string, redemptionAmount: number, redemptionDate: string) => void;
}

const CertificateRedemptionModal: React.FC<CertificateRedemptionModalProps> = ({
  show,
  onClose,
  certificate,
  onRedeem,
}) => {
  const [redemptionAmount, setRedemptionAmount] = useState('');
  const [redemptionDate, setRedemptionDate] = useState(
    new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  );
  const [errors, setErrors] = useState<{ amount?: string; date?: string }>({});

  // Calculate estimated redemption amount based on face value and interest
  const calculateEstimatedAmount = (): number => {
    if (!certificate) return 0;

    // Simple calculation for demonstration
    // In a real app, this would be more complex based on time elapsed
    const principal = certificate.faceValue;
    const interestRate = certificate.interestRate / 100;
    const timeInYears = 1; // Placeholder, would be actual time calculation

    return principal * (1 + interestRate * timeInYears);
  };

  const handleRedeem = () => {
    if (!certificate) return;

    const newErrors: { amount?: string; date?: string } = {};

    // Validate redemption amount
    const amount = parseFloat(redemptionAmount);
    if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Please enter a valid redemption amount';
    }

    // Validate date
    if (!redemptionDate) {
      newErrors.date = 'Please select a valid redemption date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onRedeem(certificate.id, amount, redemptionDate);
    handleClose();
  };

  const handleClose = () => {
    setRedemptionAmount('');
    setRedemptionDate(new Date().toISOString().split('T')[0]);
    setErrors({});
    onClose();
  };

  const estimatedAmount = calculateEstimatedAmount();

  if (!certificate) return null;

  return (
    <Modal show={show} onClose={handleClose}>
      <Modal.Header>Mark Certificate as Redeemed</Modal.Header>
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
                <Label htmlFor="faceValue">Face Value</Label>
                <div>${certificate.faceValue.toLocaleString()}</div>
              </div>
              <div>
                <Label htmlFor="interestRate">Interest Rate</Label>
                <div>{certificate.interestRate}%</div>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium">Redemption Information</h5>
            <div className="space-y-4 mt-2">
              <div>
                <Label htmlFor="redemptionAmount">Redemption Amount</Label>
                <TextInput
                  id="redemptionAmount"
                  type="number"
                  value={redemptionAmount}
                  onChange={e => {
                    setRedemptionAmount(e.target.value);
                    setErrors({ ...errors, amount: undefined });
                  }}
                  placeholder={`Estimated: $${estimatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  color={errors.amount ? 'failure' : undefined}
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Enter the actual amount paid to redeem this certificate.
                </p>
              </div>

              <div>
                <Label htmlFor="redemptionDate">Redemption Date</Label>
                <TextInput
                  id="redemptionDate"
                  type="date"
                  value={redemptionDate}
                  onChange={e => {
                    setRedemptionDate(e.target.value);
                    setErrors({ ...errors, date: undefined });
                  }}
                  color={errors.date ? 'failure' : undefined}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleRedeem}>Mark as Redeemed</Button>
        <Button color="gray" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CertificateRedemptionModal;
