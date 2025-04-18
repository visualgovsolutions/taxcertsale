import React from 'react';
import { Card } from 'flowbite-react';

const UsersPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <Card>
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          User Management
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          This page will contain user listings and account management tools.
        </p>
      </Card>
    </div>
  );
};

export default UsersPage; 