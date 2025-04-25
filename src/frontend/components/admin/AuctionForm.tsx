/**
 * AuctionForm Component
 *
 * Form for creating and editing auctions.
 * Handles validation, date selection, and certificate assignment.
 */

import React, { useState } from 'react';
import { Modal, Button, Label, TextInput, Select } from 'flowbite-react';
import { useMutation, gql } from '@apollo/client';
import type { AuctionStatus } from './AuctionListTable';

export const CREATE_AUCTION = gql`
  mutation CreateAuction($input: CreateAuctionInput!) {
    createAuction(input: $input) {
      id
      title
      status
      startDate
      endDate
      minInterestRate
    }
  }
`;

export const UPDATE_AUCTION = gql`
  mutation UpdateAuction($id: ID!, $input: UpdateAuctionInput!) {
    updateAuction(id: $id, input: $input) {
      id
      title
      status
      startDate
      endDate
      minInterestRate
    }
  }
`;

interface AuctionFormData {
  title: string;
  status: AuctionStatus;
  startDate: Date;
  endDate: Date;
  minInterestRate: number;
  description?: string;
}

interface AuctionFormProps {
  show: boolean;
  onClose: () => void;
  auction?: {
    id: string;
    title: string;
    status: AuctionStatus;
    startDate: string;
    endDate: string;
    minInterestRate: number;
    description?: string;
  };
  onSaved: () => void;
}

const initialFormData: AuctionFormData = {
  title: '',
  status: 'DRAFT',
  startDate: new Date(),
  endDate: new Date(),
  minInterestRate: 0,
  description: '',
};

const AuctionForm: React.FC<AuctionFormProps> = ({ show, onClose, auction, onSaved }) => {
  const [formData, setFormData] = useState<AuctionFormData>(
    auction
      ? {
          ...auction,
          startDate: new Date(auction.startDate),
          endDate: new Date(auction.endDate),
        }
      : initialFormData
  );

  const [createAuction, { loading: createLoading }] = useMutation(CREATE_AUCTION);
  const [updateAuction, { loading: updateLoading }] = useMutation(UPDATE_AUCTION);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'minInterestRate' ? parseFloat(value) : value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: new Date(value) }));
  };

  const handleSubmit = async () => {
    try {
      if (auction?.id) {
        await updateAuction({
          variables: {
            id: auction.id,
            input: {
              ...formData,
              startDate: formData.startDate.toISOString(),
              endDate: formData.endDate.toISOString(),
            },
          },
        });
      } else {
        await createAuction({
          variables: {
            input: {
              ...formData,
              startDate: formData.startDate.toISOString(),
              endDate: formData.endDate.toISOString(),
            },
          },
        });
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error('Error saving auction:', error);
      // Handle error appropriately
    }
  };

  const isLoading = createLoading || updateLoading;

  return (
    <Modal show={show} onClose={onClose} size="xl">
      <Modal.Header>{auction ? 'Edit Auction' : 'Create New Auction'}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <TextInput
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <TextInput
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <TextInput
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={formData.startDate.toISOString().slice(0, 16)}
                onChange={handleDateChange}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <TextInput
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={formData.endDate.toISOString().slice(0, 16)}
                onChange={handleDateChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="minInterestRate">Minimum Interest Rate (%)</Label>
            <TextInput
              id="minInterestRate"
              name="minInterestRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.minInterestRate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={auction?.status === 'ACTIVE' || auction?.status === 'CLOSED'}
            >
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
              <option value="CANCELLED">Cancelled</option>
            </Select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-2">
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : auction ? 'Update' : 'Create'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AuctionForm;
