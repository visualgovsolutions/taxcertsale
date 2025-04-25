import React, { useState } from 'react';
import { Modal, Button, Label, Select, Textarea, Toast } from 'flowbite-react';
import { UserStatus } from './UserStatusBadge';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { HiCheck, HiX } from 'react-icons/hi';

const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($id: ID!, $status: UserStatus!, $reason: String) {
    updateUserStatus(id: $id, status: $status, reason: $reason) {
      id
      username
      email
      status
      updatedAt
    }
  }
`;

interface UserStatusChangeModalProps {
  show: boolean;
  onClose: () => void;
  userId: string;
  currentStatus: UserStatus;
  onStatusChanged: () => void;
}

export const UserStatusChangeModal: React.FC<UserStatusChangeModalProps> = ({
  show,
  onClose,
  userId,
  currentStatus,
  onStatusChanged,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>(currentStatus);
  const [reason, setReason] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: 'success', message: '' });
  const [updateUserStatus, { loading }] = useMutation(UPDATE_USER_STATUS);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserStatus({
        variables: {
          id: userId,
          status: selectedStatus,
          reason: reason.trim() || undefined,
        },
      });
      setToastMessage({
        type: 'success',
        message: 'User status updated successfully',
      });
      setShowToast(true);
      onStatusChanged();
      onClose();
    } catch (error) {
      console.error('Error updating user status:', error);
      setToastMessage({
        type: 'error',
        message: `Failed to update status: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      setShowToast(true);
    }
  };

  return (
    <>
      <Modal show={show} onClose={onClose}>
        <Modal.Header>Change User Status</Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">New Status</Label>
                <Select
                  id="status"
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value as UserStatus)}
                  required
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="PENDING_KYC">Pending KYC</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="reason">Reason for Change</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter the reason for this status change..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end gap-2">
              <Button color="gray" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>

      {showToast && (
        <div className="fixed bottom-5 right-5 z-50">
          <Toast>
            <div className="flex items-center">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                {toastMessage.type === 'success' ? (
                  <HiCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <HiX className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="ml-3 text-sm font-normal">{toastMessage.message}</div>
              <Toast.Toggle onClick={() => setShowToast(false)} />
            </div>
          </Toast>
        </div>
      )}
    </>
  );
};

export default UserStatusChangeModal;
