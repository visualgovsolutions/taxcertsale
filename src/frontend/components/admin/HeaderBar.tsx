import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Avatar, Badge, Button } from 'flowbite-react';
import { HiBell, HiCog, HiOutlineMenuAlt2, HiOutlineUser, HiLogout } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

interface HeaderBarProps {
  toggleSidebar?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [notificationCount, setNotificationCount] = useState(3); // Mock notification count

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2.5 shadow-sm">
      <div className="flex justify-between items-center">
        {/* Left side: Toggle button and breadcrumb */}
        <div className="flex items-center">
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="mr-3 text-gray-500 hover:text-gray-900 focus:outline-none"
            >
              <HiOutlineMenuAlt2 className="h-6 w-6" />
            </button>
          )}

          <h1 className="text-xl font-semibold text-gray-800 hidden md:block">Admin Dashboard</h1>
        </div>

        {/* Right side: Search, notifications, user menu */}
        <div className="flex items-center space-x-3">
          {/* Search input - Can be expanded/customized as needed */}
          <div className="hidden md:block">
            <input
              type="search"
              className="p-2 pl-3 w-64 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
              placeholder="Search..."
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button color="light" size="sm" pill>
              <HiBell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  color="failure"
                  className="absolute -top-1 -right-1 h-4 w-4 text-xs p-0 flex items-center justify-center"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Settings */}
          <Link to="/admin/settings">
            <Button color="light" size="sm" pill>
              <HiCog className="h-5 w-5" />
            </Button>
          </Link>

          {/* User Menu Dropdown */}
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="flex items-center">
                <Avatar
                  rounded
                  size="sm"
                  img=""
                  alt={user?.email || 'User'}
                  placeholderInitials={(user?.email?.charAt(0) || 'A').toUpperCase()}
                />
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  {user?.email || 'Admin User'}
                </span>
              </div>
            }
          >
            <Dropdown.Header>
              <div className="text-sm font-medium text-gray-900">{user?.email}</div>
              <div className="text-xs text-gray-600">{user?.role || 'Admin'}</div>
            </Dropdown.Header>
            <Dropdown.Item icon={HiOutlineUser}>
              <Link to="/admin/profile">Profile</Link>
            </Dropdown.Item>
            <Dropdown.Item icon={HiCog}>
              <Link to="/admin/settings">Settings</Link>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={HiLogout} onClick={logout}>
              Sign out
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
