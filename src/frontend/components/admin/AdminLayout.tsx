import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import HeaderBar from './HeaderBar';

/**
 * AdminLayout component
 *
 * This serves as the base layout for all admin pages.
 * It provides the common sidebar navigation and header.
 */
function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Toggle visibility on mobile */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HeaderBar toggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>

        {/* Footer - Optional */}
        <footer className="bg-white border-t border-gray-200 p-3 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} VisualGov Solutions. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;
