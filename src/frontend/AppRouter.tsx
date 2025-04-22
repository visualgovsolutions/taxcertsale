/**
 * ❌ WARNING: DEPRECATED FILE - NOT USED IN PRODUCTION ❌
 * 
 * This file is not being used in the actual application!
 * All routes are defined in App.tsx, which is the primary router.
 * 
 * This file causes confusion and can lead to 404 errors when routes here 
 * do not match those in App.tsx.
 * 
 * DO NOT MODIFY THIS FILE. Instead, update App.tsx with any route changes.
 * 
 * Next steps:
 * 1. Ensure all routes in this file are properly defined in App.tsx
 * 2. Delete this file once all developers are aware of the change
 */

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FlowbiteApplicationShell from './components/FlowbiteApplicationShell';
import AdminLayout from './components/admin/AdminLayout';

// Lazy-loaded pages
const Dashboard = lazy(() => import('./pages/DashboardPage'));
const Auctions = lazy(() => import('./pages/AuctionsPage'));
const Properties = lazy(() => import('./pages/PropertiesPage'));
const Users = lazy(() => import('./pages/UsersPage'));
const Reports = lazy(() => import('./pages/ReportsPage'));
const Settings = lazy(() => import('./pages/SettingsPage'));
const Login = lazy(() => import('./pages/LoginPage'));

// Admin pages - using lazy loading for consistent approach
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminAuctionsPage = lazy(() => import('./pages/AdminAuctionsPage'));
const AdminCertificatesPage = lazy(() => import('./pages/AdminCertificatesPage'));
const AdminCountiesPage = lazy(() => import('./pages/AdminCountiesPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const AdminRegistrationsPage = lazy(() => import('./pages/AdminRegistrationsPage'));
const AdminAuditLogsPage = lazy(() => import('./pages/AdminAuditLogsPage'));
const AdminSettingsPage = lazy(() => import('./pages/AdminSettingsPage'));
const AdminTestPage = lazy(() => import('./pages/AdminTestPage'));

// Loading component
const Loading = () => <div className="flex justify-center items-center h-screen">Loading...</div>;

const AppRouter: React.FC = () => {
  // Simple auth check - replace with your actual auth logic
  const isAuthenticated = localStorage.getItem('token') !== null;
  // Simple admin check - replace with actual role check
  const isAdmin = localStorage.getItem('role') === 'admin'; 

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        
        {/* Protected bidder/general routes */}
        <Route element={isAuthenticated ? <FlowbiteApplicationShell /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

        {/* Protected Admin routes - TEMPORARILY BYPASSING AUTH CHECK FOR DEBUGGING */}
        <Route 
          path="/admin" 
          // element={isAuthenticated && isAdmin ? <AdminLayout /> : <Navigate to="/login" />} // Temporarily disabled
          element={<AdminLayout />} // Render layout directly
        >
          <Route index element={<Navigate to="dashboard" replace />} /> {/* Redirect /admin to /admin/dashboard */}
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="auctions" element={<AdminAuctionsPage />} />
          <Route path="certificates" element={<AdminCertificatesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="counties" element={<AdminCountiesPage />} />
          <Route path="registrations" element={<AdminRegistrationsPage />} />
          <Route path="audit-logs" element={<AdminAuditLogsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="test" element={<AdminTestPage />} />
        </Route>
        
        {/* Fallback route for authenticated users */}
        <Route path="*" element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter; 