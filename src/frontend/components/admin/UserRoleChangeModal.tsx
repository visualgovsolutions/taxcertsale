/**
 * UserRoleChangeModal Component
 *
 * A modal component for changing a user's role in the system.
 * Supports changing between USER, ADMIN, and MODERATOR roles.
 * Uses GraphQL mutation to update the role in the backend.
 */

import React, { useState } from 'react';
import { Modal, Button, Select } from 'flowbite-react';
import { useMutation, gql } from '@apollo/client';

// Available user roles in the system
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';

// GraphQL mutation for updating a user's role
const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: ID!, $role: String!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      role
    }
  }
`;

interface UserRoleChangeModalProps {
  show: boolean; // Controls modal visibility
  onClose: () => void; // Callback when modal is closed
  userId: string; // ID of the user whose role is being changed
  currentRole: UserRole; // Current role of the user
  onRoleChanged: () => void; // Callback when role is successfully changed
}

const UserRoleChangeModal: React.FC<UserRoleChangeModalProps> = ({
  show,
  onClose,
  userId,
  currentRole,
  onRoleChanged,
}) => {
  // Local state for the selected role in the dropdown
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);

  // GraphQL mutation hook with loading state
  const [updateUserRole, { loading }] = useMutation(UPDATE_USER_ROLE);

  /**
   * Handles the submission of the role change
   * Executes the GraphQL mutation and handles success/error cases
   */
  const handleSubmit = async () => {
    try {
      await updateUserRole({
        variables: {
          userId,
          role: selectedRole,
        },
      });
      onRoleChanged(); // Notify parent component of successful change
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating user role:', error);
      // Error handling could be enhanced with user notification
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Change User Role</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900">
              Select Role
            </label>
            <Select
              id="role"
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value as UserRole)}
            >
              <option value="USER">User</option>
              <option value="MODERATOR">Moderator</option>
              <option value="ADMIN">Admin</option>
            </Select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-2">
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Updating...' : 'Update Role'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default UserRoleChangeModal;
