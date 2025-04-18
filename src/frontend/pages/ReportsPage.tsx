import React from 'react';
import { Card } from 'flowbite-react';

const ReportsPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <Card>
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Tax Certificate Reports
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Generate and view reports on tax certificate sales, auction performance, and bidding activity.
        </p>
      </Card>
    </div>
  );
};

export default ReportsPage; 