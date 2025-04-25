import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  HiHome,
  HiUsers,
  HiDocumentText,
  HiOfficeBuilding,
  HiCog,
  HiClipboardCheck,
  HiChartBar,
  HiCash,
  HiBell,
  HiLogout,
  HiCollection,
  HiDatabase,
  HiDocumentReport,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

/**
 * Renders the navigation sidebar for the admin section.
 * Uses NavLink for automatic active class styling.
 */
const AdminSidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  // Define active link style for NavLink
  const activeClassName = 'bg-gray-900 text-white';
  const inactiveClassName = 'text-gray-300 hover:bg-gray-700 hover:text-white';

  // Navigation links with icons
  const navLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <HiHome className="mr-3 h-5 w-5" /> },
    { to: '/admin/users', label: 'User Management', icon: <HiUsers className="mr-3 h-5 w-5" /> },
    {
      to: '/admin/auction-management',
      label: 'Auction Management',
      icon: <HiDocumentText className="mr-3 h-5 w-5" />,
    },
    {
      to: '/admin/certificate-management',
      label: 'Certificate Management',
      icon: <HiClipboardCheck className="mr-3 h-5 w-5" />,
    },
    {
      to: '/admin/counties',
      label: 'County Management',
      icon: <HiOfficeBuilding className="mr-3 h-5 w-5" />,
    },
    { to: '/admin/settings', label: 'System Settings', icon: <HiCog className="mr-3 h-5 w-5" /> },
    { to: '/admin/analytics', label: 'Analytics', icon: <HiChartBar className="mr-3 h-5 w-5" /> },
    { to: '/admin/payments', label: 'Payments', icon: <HiCash className="mr-3 h-5 w-5" /> },
    {
      to: '/admin/notifications',
      label: 'Notifications',
      icon: <HiBell className="mr-3 h-5 w-5" />,
    },
    {
      to: '/admin/audit-logs',
      label: 'Audit Logs',
      icon: <HiDocumentReport className="mr-3 h-5 w-5" />,
    },
    {
      to: '/admin/import-export',
      label: 'Import/Export',
      icon: <HiDatabase className="mr-3 h-5 w-5" />,
    },
    {
      to: '/admin/batches',
      label: 'Batch Management',
      icon: <HiCollection className="mr-3 h-5 w-5" />,
    },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0 h-full">
      <div className="px-4 py-6 text-xl font-semibold border-b border-gray-700 flex items-center">
        <img src="/public/VG.png" alt="VisualGov Solutions Logo" className="h-8 w-8 mr-3" />
        Admin Portal
      </div>

      {/* User info section */}
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="text-sm font-medium text-gray-300">Logged in as:</div>
        <div className="text-white font-semibold">{user?.email || 'Admin User'}</div>
        <div className="text-xs text-gray-400">{user?.role || 'Admin'}</div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {/* Render navigation links */}
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `${isActive ? activeClassName : inactiveClassName} flex items-center px-3 py-2 rounded-md text-base font-medium`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-700">
        {/* Logout button */}
        <button
          onClick={logout}
          className="w-full flex items-center text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <HiLogout className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
