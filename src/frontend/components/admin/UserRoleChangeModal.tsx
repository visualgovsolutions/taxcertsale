/**
 * UserRoleChangeModal Component
 *
 * A modal component for changing a user's role in the system.
 * Supports changing between USER, ADMIN, and MODERATOR roles.
 * Uses GraphQL mutation to update the role in the backend.
 */

import React, { useState } from 'react';
import { Modal, Label, Select, Button } from 'flowbite-react';
import { gql, useMutation } from '@apollo/client';

// Available user roles in the system
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';

// GraphQL mutation for updating a user's role
export const UPDATE_USER_ROLE = gql`
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
  onRoleChange: (newRole: UserRole) => void; // Callback when role is successfully changed
}

const UserRoleChangeModal: React.FC<UserRoleChangeModalProps> = ({
  show,
  onClose,
  userId,
  currentRole,
  onRoleChange,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [error, setError] = useState<string | null>(null);

  const [updateUserRole, { loading }] = useMutation(UPDATE_USER_ROLE, {
    onCompleted: (data) => {
      onRoleChange(data.updateUserRole.role as UserRole);
      onClose();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async () => {
    if (!selectedRole) return;
    
    try {
      await updateUserRole({
        variables: {
          userId,
          role: selectedRole,
        },
      });
    } catch (e) {
      // Error is handled by onError in useMutation
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Change User Role</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          {error && (
            <div className="text-red-600">{error}</div>
          )}
          <div>
            <Label htmlFor="role">Select Role</Label>
            <Select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            >
              <option value="">Select a role</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="MODERATOR">Moderator</option>
            </Select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="gray"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedRole || loading}
        >
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserRoleChangeModal;
