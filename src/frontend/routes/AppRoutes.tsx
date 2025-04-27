import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import FlowbiteWithRouter from '../components/FlowbiteWithRouter'; // Layout for public/bidder section
import AdminLayout from '../components/layouts/AdminLayout'; // Layout for admin section
import LoginPage from '../pages/LoginPage'; // Corrected path
import BidderDashboardPage from '../pages/BidderDashboardPage';
import BidderAuctionsPage from '../pages/bidder/BidderAuctionsPage';
import BidderCertificatesPage from '../pages/bidder/BidderCertificatesPage';
import BidderBidsPage from '../pages/bidder/BidderBidsPage';
import BidderLayout from '../components/layouts/BidderLayout';
import { useAuth } from '../context/AuthContext';

// --- Placeholder Page Components ---
const Dashboard = () => <div className="p-4">Main Dashboard Content</div>;
const Auctions = () => <div className="p-4">Auctions Content</div>;
const Properties = () => <div className="p-4">Properties Content</div>;
const Products = () => <div className="p-4">Products Content</div>;
const Reports = () => <div className="p-4">Reports Content</div>;
// Placeholder Bidder Pages
const BidderProfile = () => <div className="p-4">Bidder Profile Page</div>;
const BidderSettings = () => <div className="p-4">Bidder Settings Page</div>;
// Placeholder for missing components
const HomePage = () => <div className="p-4">Home Page</div>;
const UserManagementPage = () => <div className="p-4">User Management Page</div>;
const UserDetailPage = () => <div className="p-4">User Detail Page</div>;
const AdminDashboardPage = () => <div className="p-4">Admin Dashboard Page</div>;
const AuctionManagementPage = () => <div className="p-4">Auction Management Page</div>;
const CertificateManagementPage = () => <div className="p-4">Certificate Management Page</div>;
const AuditLogsPage = () => <div className="p-4">Audit Logs Page</div>;

// For the ProtectedRoute component, replace with properly typed version
// Simple ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  const userRole = user?.role || '';
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.log(`User role ${userRole} not in allowed roles: ${allowedRoles.join(', ')}`);
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and authorized
  return <>{children}</>;
};

/**
 * Defines the main application routing structure using React Router.
 * Separates routes into public/bidder facing (using FlowbiteWithRouter layout)
 * and admin facing (using AdminLayout).
 */
const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'COUNTY_OFFICIAL']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="auctions" element={<AuctionManagementPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="certificates" element={<CertificateManagementPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
        </Route>

        {/* Bidder Routes - FIXED: Use proper nested routing pattern */}
        <Route
          path="/bidder"
          element={
            <ProtectedRoute allowedRoles={['INVESTOR']}>
              <BidderLayout>
                <Outlet />
              </BidderLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<BidderDashboardPage />} />
          <Route path="auctions" element={<BidderAuctionsPage />} />
          <Route path="certificates" element={<BidderCertificatesPage />} />
          <Route path="bids" element={<BidderBidsPage />} />
          <Route path="profile" element={<BidderProfile />} />
          <Route path="settings" element={<BidderSettings />} />
        </Route>

        {/* Public/Bidder routes */}
        <Route path="/" element={<FlowbiteWithRouter />}>
          {/* Default route for logged-in non-admin users */}
          <Route index element={<Dashboard />} />
          {/* Other public/bidder routes nested here */}
          <Route path="auctions" element={<Auctions />} />
          <Route path="properties" element={<Properties />} />
          <Route path="products" element={<Products />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* User detail route with dynamic userId parameter */}
        <Route path="users/:userId" element={<UserDetailPage />} />

        {/* Fallback route - can redirect to homepage or 404 page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
