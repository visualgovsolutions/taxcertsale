/**
 * UserActivityLogModal Component
 *
 * A modal component that displays a user's activity history.
 * Shows a paginated table of activities including role changes, status updates, and KYC updates.
 * Uses GraphQL query to fetch activity data from the backend.
 */

import React from 'react';
import { Modal, Button, Table, Badge, Spinner } from 'flowbite-react';
import { useQuery, gql } from '@apollo/client';
import { format } from 'date-fns';

// GraphQL query to fetch user activities with optional limit
const GET_USER_ACTIVITIES = gql`
  query GetUserActivities($userId: ID, $limit: Int) {
    userActivities(userId: $userId, limit: $limit) {
      id
      userId
      username
      activityType
      details
      oldValue
      newValue
      reason
      performedBy
      performedAt
    }
  }
`;

// Type definition for activity data returned from the API
interface UserActivity {
  id: string;
  userId: string;
  username: string;
  activityType: 'STATUS_CHANGE' | 'ROLE_CHANGE' | 'KYC_UPDATE';
  details: string;
  oldValue: string;
  newValue: string;
  reason?: string;
  performedBy: string;
  performedAt: string;
}

interface UserActivityLogModalProps {
  show: boolean; // Controls modal visibility
  onClose: () => void; // Callback when modal is closed
  userId: string; // ID of the user whose activities to display
  username: string; // Username to display in the modal header
}

// Color mapping for different activity types
const activityTypeColors = {
  STATUS_CHANGE: 'warning',
  ROLE_CHANGE: 'info',
  KYC_UPDATE: 'success',
};

const UserActivityLogModal: React.FC<UserActivityLogModalProps> = ({
  show,
  onClose,
  userId,
  username,
}) => {
  // Query hook for fetching user activities
  const { loading, error, data } = useQuery(GET_USER_ACTIVITIES, {
    variables: { userId, limit: 50 }, // Fetch up to 50 most recent activities
    skip: !show, // Skip query when modal is hidden
    fetchPolicy: 'network-only', // Always fetch fresh data
  });

  return (
    <Modal show={show} onClose={onClose} size="xl">
      <Modal.Header>Activity Log for {username}</Modal.Header>
      <Modal.Body>
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center p-4">
            <Spinner size="xl" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-red-500 text-center p-4">
            Error loading activity log: {error.message}
          </div>
        )}

        {/* Data display */}
        {data && (
          <div className="overflow-x-auto">
            <Table>
              <Table.Head>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Activity</Table.HeadCell>
                <Table.HeadCell>Changes</Table.HeadCell>
                <Table.HeadCell>Reason</Table.HeadCell>
                <Table.HeadCell>Performed By</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {data.userActivities.map((activity: UserActivity) => (
                  <Table.Row key={activity.id}>
                    <Table.Cell>
                      {format(new Date(activity.performedAt), 'MMM d, yyyy HH:mm')}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={activityTypeColors[activity.activityType] as any}
                        className="font-medium"
                      >
                        {activity.activityType.replace('_', ' ')}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <span className="line-through text-gray-500">{activity.oldValue}</span>
                        <span>→</span>
                        <span className="font-medium">{activity.newValue}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{activity.reason || '-'}</Table.Cell>
                    <Table.Cell>{activity.performedBy}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end">
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default UserActivityLogModal;
