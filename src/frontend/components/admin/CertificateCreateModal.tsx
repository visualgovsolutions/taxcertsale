import React, { useState } from 'react';
import { Button, Modal, Label, TextInput, Spinner } from 'flowbite-react';

interface CertificateCreateModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (certificateData: CertificateCreateData) => void;
  loading: boolean;
}

export interface CertificateCreateData {
  parcelId: string;
  propertyAddress: string;
  ownerName: string;
  faceValue: number;
  interestRate: number;
}

const CertificateCreateModal: React.FC<CertificateCreateModalProps> = ({
  show,
  onClose,
  onCreate,
  loading,
}) => {
  const [formData, setFormData] = useState<CertificateCreateData>({
    parcelId: '',
    propertyAddress: '',
    ownerName: '',
    faceValue: 0,
    interestRate: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    let parsedValue: string | number = value;
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }

    setFormData({
      ...formData,
      [name]: parsedValue,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.parcelId.trim()) {
      newErrors.parcelId = 'Parcel ID is required';
    }

    if (!formData.propertyAddress.trim()) {
      newErrors.propertyAddress = 'Property address is required';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    if (formData.faceValue <= 0) {
      newErrors.faceValue = 'Face value must be greater than 0';
    }

    if (formData.interestRate < 0 || formData.interestRate > 18) {
      newErrors.interestRate = 'Interest rate must be between 0 and 18%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onCreate(formData);
    }
  };

  const handleClose = () => {
    // Reset form data when modal is closed
    setFormData({
      parcelId: '',
      propertyAddress: '',
      ownerName: '',
      faceValue: 0,
      interestRate: 0,
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal show={show} onClose={handleClose} size="md">
      <Modal.Header>Create New Certificate</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <Label htmlFor="parcelId" value="Parcel ID" />
            <TextInput
              id="parcelId"
              name="parcelId"
              value={formData.parcelId}
              onChange={handleChange}
              color={errors.parcelId ? 'failure' : undefined}
              helperText={errors.parcelId}
              placeholder="Parcel ID (e.g., A12-345-6789)"
            />
          </div>

          <div>
            <Label htmlFor="propertyAddress" value="Property Address" />
            <TextInput
              id="propertyAddress"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              color={errors.propertyAddress ? 'failure' : undefined}
              helperText={errors.propertyAddress}
              placeholder="123 Main St, City, FL 12345"
            />
          </div>

          <div>
            <Label htmlFor="ownerName" value="Owner Name" />
            <TextInput
              id="ownerName"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              color={errors.ownerName ? 'failure' : undefined}
              helperText={errors.ownerName}
              placeholder="John Doe"
            />
          </div>

          <div>
            <Label htmlFor="faceValue" value="Face Value ($)" />
            <TextInput
              id="faceValue"
              name="faceValue"
              type="number"
              step="0.01"
              min="0"
              value={formData.faceValue === 0 ? '' : formData.faceValue}
              onChange={handleChange}
              color={errors.faceValue ? 'failure' : undefined}
              helperText={errors.faceValue}
              placeholder="1000.00"
            />
          </div>

          <div>
            <Label htmlFor="interestRate" value="Interest Rate (%)" />
            <TextInput
              id="interestRate"
              name="interestRate"
              type="number"
              step="0.01"
              min="0"
              max="18"
              value={formData.interestRate === 0 ? '' : formData.interestRate}
              onChange={handleChange}
              color={errors.interestRate ? 'failure' : undefined}
              helperText={errors.interestRate}
              placeholder="5.00"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Creating...
            </>
          ) : (
            'Create Certificate'
          )}
        </Button>
        <Button color="gray" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CertificateCreateModal;
