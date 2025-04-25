import React from 'react';
import { Table, Badge } from 'flowbite-react';
import { useQuery, gql } from '@apollo/client';
import { format } from 'date-fns';

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

interface UserActivityLogProps {
  userId?: string;
  limit?: number;
}

const activityTypeColors = {
  STATUS_CHANGE: 'warning',
  ROLE_CHANGE: 'info',
  KYC_UPDATE: 'success',
};

export const UserActivityLog: React.FC<UserActivityLogProps> = ({ userId, limit = 10 }) => {
  const { data, loading, error } = useQuery(GET_USER_ACTIVITIES, {
    variables: { userId, limit },
    fetchPolicy: 'network-only',
  });

  if (loading) return <div>Loading activity log...</div>;
  if (error) return <div>Error loading activity log: {error.message}</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Activity Log</h3>
      <Table>
        <Table.Head>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>User</Table.HeadCell>
          <Table.HeadCell>Activity</Table.HeadCell>
          <Table.HeadCell>Changes</Table.HeadCell>
          <Table.HeadCell>Reason</Table.HeadCell>
          <Table.HeadCell>Performed By</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {data.userActivities.map((activity: UserActivity) => (
            <Table.Row key={activity.id}>
              <Table.Cell>{format(new Date(activity.performedAt), 'MMM d, yyyy HH:mm')}</Table.Cell>
              <Table.Cell>{activity.username}</Table.Cell>
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
  );
};

export default UserActivityLog;
