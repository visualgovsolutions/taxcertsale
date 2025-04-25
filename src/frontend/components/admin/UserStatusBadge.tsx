import React from 'react';
import { Badge } from 'flowbite-react';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_KYC' | 'SUSPENDED';

interface UserStatusBadgeProps {
  status: UserStatus;
}

const statusColors: Record<UserStatus, { color: string; icon: string }> = {
  ACTIVE: { color: 'success', icon: '🟢' },
  INACTIVE: { color: 'gray', icon: '⚫' },
  PENDING_KYC: { color: 'warning', icon: '🟡' },
  SUSPENDED: { color: 'failure', icon: '🔴' },
};

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status }) => {
  const { color, icon } = statusColors[status];

  return (
    <Badge color={color as any} size="sm" className="flex items-center gap-1">
      <span>{icon}</span>
      {status.replace('_', ' ')}
    </Badge>
  );
};

export default UserStatusBadge;
