import React from 'react';
import { Outlet } from 'react-router-dom';
import CountyAdminSidebar from '../county/CountyAdminSidebar';

/**
 * Provides the main layout structure for all county admin-related pages.
 * Includes a fixed sidebar and a main content area where nested routes are rendered via <Outlet />.
 */
const CountyAdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Fixed navigation sidebar for county admin sections */}
      <CountyAdminSidebar />

      {/* Main content container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Potential location for a top header bar (optional) */}
        {/* <HeaderBar /> */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Renders the component for the matched nested county admin route */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CountyAdminLayout; 