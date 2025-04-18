import React from 'react';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Welcome to the Admin Dashboard. Manage users, settings, and site configuration here.
      </p>
      {/* Add admin-specific components and data here */}
    </div>
  );
};

export default AdminDashboardPage; 