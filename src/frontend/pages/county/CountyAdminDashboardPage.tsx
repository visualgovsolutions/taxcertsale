import React from 'react';
import { Card, Button } from 'flowbite-react';
import { 
  HiUsers, 
  HiClipboardCheck, 
  HiDocumentText, 
  HiOfficeBuilding,
  HiChartBar
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CountyAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // In a real application, these would be fetched from the backend
  const mockData = {
    pendingBidders: 5,
    pendingW9Forms: 12,
    activeCertificates: 87,
    totalInvestors: 45
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">County Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.username || 'County Administrator'}. Here's what's happening in your county.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
              <HiUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h5 className="text-xl font-bold text-gray-900">
                {mockData.pendingBidders}
              </h5>
              <p className="text-sm font-normal text-gray-500">Pending Bidder Approvals</p>
            </div>
          </div>
          <Link to="/county-admin/bidder-approvals">
            <Button color="blue" size="sm" className="w-full mt-2">
              Review Bidders
            </Button>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-800">
              <HiClipboardCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h5 className="text-xl font-bold text-gray-900">
                {mockData.pendingW9Forms}
              </h5>
              <p className="text-sm font-normal text-gray-500">Pending W9 Forms</p>
            </div>
          </div>
          <Link to="/county-admin/w9-approvals">
            <Button color="red" size="sm" className="w-full mt-2">
              Review W9 Forms
            </Button>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-800">
              <HiDocumentText className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h5 className="text-xl font-bold text-gray-900">
                {mockData.activeCertificates}
              </h5>
              <p className="text-sm font-normal text-gray-500">Active Certificates</p>
            </div>
          </div>
          <Link to="/county-admin/certificates">
            <Button color="green" size="sm" className="w-full mt-2">
              View Certificates
            </Button>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-800">
              <HiUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h5 className="text-xl font-bold text-gray-900">
                {mockData.totalInvestors}
              </h5>
              <p className="text-sm font-normal text-gray-500">Total Investors</p>
            </div>
          </div>
          <Link to="/county-admin/investors">
            <Button color="purple" size="sm" className="w-full mt-2">
              View Investors
            </Button>
          </Link>
        </Card>
      </div>

      {/* Quick Access Section */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <h5 className="text-lg font-bold text-gray-900 flex items-center">
            <HiOfficeBuilding className="mr-2 h-5 w-5" /> County Information
          </h5>
          <p className="text-sm text-gray-600 mb-4">
            View and update your county information and settings
          </p>
          <Link to="/county-admin/county-info">
            <Button color="gray" size="sm">Manage County Info</Button>
          </Link>
        </Card>

        <Card>
          <h5 className="text-lg font-bold text-gray-900 flex items-center">
            <HiClipboardCheck className="mr-2 h-5 w-5" /> W9 Form Approvals
          </h5>
          <p className="text-sm text-gray-600 mb-4">
            Review and approve submitted W9 forms from investors
          </p>
          <Link to="/county-admin/w9-approvals">
            <Button color="gray" size="sm">Manage W9 Forms</Button>
          </Link>
        </Card>

        <Card>
          <h5 className="text-lg font-bold text-gray-900 flex items-center">
            <HiChartBar className="mr-2 h-5 w-5" /> Analytics
          </h5>
          <p className="text-sm text-gray-600 mb-4">
            View detailed analytics for your county's tax certificate sales
          </p>
          <Link to="/county-admin/analytics">
            <Button color="gray" size="sm">View Analytics</Button>
          </Link>
        </Card>
      </div>

      {/* Recent Activity Section (Placeholder) */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <Card>
        <div className="space-y-4">
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-sm">
              <span className="font-semibold">John Smith</span> submitted a new W9 form
            </p>
            <p className="text-xs text-gray-500">Today at 2:30 PM</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-sm">
              <span className="font-semibold">Jane Doe</span> registered as a new bidder
            </p>
            <p className="text-xs text-gray-500">Yesterday at 10:15 AM</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-sm">
              <span className="font-semibold">Tax certificate #1234</span> was redeemed
            </p>
            <p className="text-xs text-gray-500">August 10, 2023</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CountyAdminDashboardPage; 