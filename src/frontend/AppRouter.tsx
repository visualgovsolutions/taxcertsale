import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FlowbiteApplicationShell from './components/FlowbiteApplicationShell';

// Lazy-loaded pages
const Dashboard = lazy(() => import('./pages/DashboardPage'));
const Auctions = lazy(() => import('./pages/AuctionsPage'));
const Properties = lazy(() => import('./pages/PropertiesPage'));
const Users = lazy(() => import('./pages/UsersPage'));
const Reports = lazy(() => import('./pages/ReportsPage'));
const Settings = lazy(() => import('./pages/SettingsPage'));
const Login = lazy(() => import('./pages/LoginPage'));

// Loading component
const Loading = () => <div className="flex justify-center items-center h-screen">Loading...</div>;

const AppRouter: React.FC = () => {
  // Simple auth check - replace with your actual auth logic
  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        
        {/* Protected routes */}
        <Route element={isAuthenticated ? <FlowbiteApplicationShell /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter; 