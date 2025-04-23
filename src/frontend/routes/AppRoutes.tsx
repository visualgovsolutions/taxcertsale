import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FlowbiteWithRouter from '../components/FlowbiteWithRouter'; // Layout for public/bidder section
import AdminLayout from '../components/layouts/AdminLayout'; // Layout for admin section
import UserManagementPage from '../../pages/admin/UserManagementPage';
import UserDetailPage from '../../pages/admin/UserDetailPage';

// --- Placeholder Page Components --- 
const Dashboard = () => <div className="p-4">Main Dashboard Content</div>;
const Auctions = () => <div className="p-4">Auctions Content</div>;
const Properties = () => <div className="p-4">Properties Content</div>;
// const Users = () => <div className="p-4">Users Content</div>; // Keep commented out for now
const Products = () => <div className="p-4">Products Content</div>;
const Reports = () => <div className="p-4">Reports Content</div>;
// Placeholder Admin Dashboard Page
const AdminDashboard = () => <div className="p-4">Admin Dashboard Overview</div>; // Placeholder for /admin index

/**
 * Defines the main application routing structure using React Router.
 * Separates routes into public/bidder facing (using FlowbiteWithRouter layout)
 * and admin facing (using AdminLayout).
 */
const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public/Bidder routes */}
        <Route path="/" element={<FlowbiteWithRouter />}>
          {/* Default route for logged-in non-admin users */}
          <Route index element={<Dashboard />} /> 
          {/* Other public/bidder routes nested here */}
          <Route path="auctions" element={<Auctions />} />
          <Route path="properties" element={<Properties />} />
          {/* <Route path="users" element={<Users />} /> */}
          <Route path="products" element={<Products />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Admin routes */}
        {/* All routes under "/admin" use the AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Default route for "/admin" */}
          <Route index element={<AdminDashboard />} /> 
          {/* User management routes */}
          <Route path="users" element={<UserManagementPage />} />
          {/* User detail route with dynamic userId parameter */}
          <Route path="users/:userId" element={<UserDetailPage />} /> 
          {/* Add future admin routes here (e.g., settings, auctions) */}
          {/* <Route path="settings" element={<AdminSettingsPage />} /> */}
        </Route>

        {/* Top-level routes (e.g., Login page, potentially outside main layouts) */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes; 