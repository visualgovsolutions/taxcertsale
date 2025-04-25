import React, { useState } from 'react';
import { Table, Button } from 'flowbite-react';
import { useQuery, gql } from '@apollo/client';
import UserStatusBadge, { UserStatus } from './UserStatusBadge';
import UserStatusChangeModal from './UserStatusChangeModal';
import UserRoleChangeModal from './UserRoleChangeModal';
import UserActivityLogModal from './UserActivityLogModal';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
      role
      status
      kycStatus
      createdAt
      updatedAt
    }
  }
`;

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: UserStatus;
  kycStatus: string;
  createdAt: string;
  updatedAt: string;
}

export const UserList: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  const handleStatusChange = (user: User) => {
    setSelectedUser(user);
    setShowStatusModal(true);
  };

  const handleRoleChange = (user: User) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleViewActivity = (user: User) => {
    setSelectedUser(user);
    setShowActivityModal(true);
  };

  const handleStatusChanged = () => {
    refetch(); // Refresh the user list
  };

  const handleRoleChanged = () => {
    refetch(); // Refresh the user list
  };

  return (
    <div className="space-y-4">
      <Table>
        <Table.Head>
          <Table.HeadCell>Username</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Role</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>KYC Status</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {data.users.map((user: User) => (
            <Table.Row key={user.id}>
              <Table.Cell>{user.username}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell className="capitalize">{user.role.toLowerCase()}</Table.Cell>
              <Table.Cell>
                <UserStatusBadge status={user.status} />
              </Table.Cell>
              <Table.Cell>{user.kycStatus}</Table.Cell>
              <Table.Cell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(user)}
                    disabled={user.role === 'ADMIN'} // Prevent status changes for admin users
                  >
                    Change Status
                  </Button>
                  <Button
                    size="sm"
                    color="purple"
                    onClick={() => handleRoleChange(user)}
                    disabled={user.role === 'ADMIN'} // Prevent role changes for admin users
                  >
                    Change Role
                  </Button>
                  <Button size="sm" color="gray" onClick={() => handleViewActivity(user)}>
                    Activity Log
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {selectedUser && (
        <>
          <UserStatusChangeModal
            show={showStatusModal}
            onClose={() => setShowStatusModal(false)}
            userId={selectedUser.id}
            currentStatus={selectedUser.status}
            onStatusChanged={handleStatusChanged}
          />
          <UserRoleChangeModal
            show={showRoleModal}
            onClose={() => setShowRoleModal(false)}
            userId={selectedUser.id}
            currentRole={selectedUser.role}
            onRoleChanged={handleRoleChanged}
          />
          <UserActivityLogModal
            show={showActivityModal}
            onClose={() => setShowActivityModal(false)}
            userId={selectedUser.id}
            username={selectedUser.username}
          />
        </>
      )}
    </div>
  );
};

export default UserList;
