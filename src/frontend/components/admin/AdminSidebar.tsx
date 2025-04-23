import React from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * Renders the navigation sidebar for the admin section.
 * Uses NavLink for automatic active class styling.
 */
const AdminSidebar: React.FC = () => {

  // Define active link style for NavLink
  const activeClassName = "bg-gray-900 text-white";
  const inactiveClassName = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0">
      <div className="px-4 py-6 text-xl font-semibold border-b border-gray-700">
        Admin Portal
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {/* Use NavLink to automatically apply active styles */}
        {/* 
        <NavLink 
          to="/admin" // Link to admin dashboard index
          end // Match only the exact path "/admin"
          className={({ isActive }) =>
             `${isActive ? activeClassName : inactiveClassName} block px-3 py-2 rounded-md text-base font-medium`
          }
        >
          Dashboard
        </NavLink> 
        */}
        <NavLink 
          to="/admin/users"
          className={({ isActive }) =>
             `${isActive ? activeClassName : inactiveClassName} block px-3 py-2 rounded-md text-base font-medium`
          }
        >
          User Management
        </NavLink>
        {/* Add other admin links using NavLink here */}
      </nav>
      <div className="px-4 py-4 border-t border-gray-700">
        {/* Placeholder for User Info / Logout button */}
        {/* TODO: Implement logout functionality, potentially using AuthContext */}
        <button className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar; 