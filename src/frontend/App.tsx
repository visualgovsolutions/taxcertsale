import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AdminLayout from './components/admin/AdminLayout';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import DashboardPage from './pages/DashboardPage';
import AuctionsPage from './pages/AuctionsPage';
import AuctionDetailPage from './pages/AuctionDetailPage';
import PropertiesPage from './pages/PropertiesPage';
import Home from './pages/Home';
import About from './pages/About';
import CorporateThemeExample from './pages/CorporateThemeExample';

// Admin pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminAuctionsPage from './pages/AdminAuctionsPage';
import AdminCertificatesPage from './pages/AdminCertificatesPage';
import AdminCountiesPage from './pages/AdminCountiesPage';
import AdminRegistrationsPage from './pages/AdminRegistrationsPage';
import AdminAuditLogsPage from './pages/AdminAuditLogsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminBatchesPage from './pages/AdminBatchesPage';
import AdminPaymentsPage from './pages/AdminPaymentsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';
import AdminSystemConfigPage from './pages/AdminSystemConfigPage';
import DataImportExportPage from './pages/admin/DataImportExportPage';
import AuctionManagementPage from './pages/admin/AuctionManagementPage';
import CertificateManagementPage from './pages/admin/CertificateManagementPage';
import AdminTestPage from './pages/AdminTestPage';

import { useAuth } from './context/AuthContext';

/**
 * ⚠️ CRITICAL PATH: MAIN ROUTER DEFINITION ⚠️
 *
 * This is the PRIMARY router configuration for the entire application.
 * All routes MUST be defined here to be accessible.
 *
 * DO NOT create parallel router configurations elsewhere (e.g., AppRouter.tsx).
 * If you need to refactor routes, move ALL routes together.
 *
 * Any routes defined in AdminLayout.tsx sidebar MUST have a corresponding route here.
 *
 * Sync the following files when adding/changing routes:
 * 1. This file (App.tsx) - The actual route definitions
 * 2. components/admin/AdminLayout.tsx - Sidebar navigation links
 */

// Updated Protected route component to use AuthContext
const ProtectedRoute = ({
  children,
  requiredRoles = [],
}: {
  children: JSX.Element;
  requiredRoles?: string[];
}) => {
  const { isAuthenticated, user } = useAuth(); // Get auth state from context

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" replace />;
  }

  // Check for required roles if specified
  if (requiredRoles.length > 0 && user?.role) {
    if (!requiredRoles.includes(user.role)) {
      // User doesn't have the required role - redirect to appropriate page
      if (user.role === 'ADMIN' || user.role === 'COUNTY_OFFICIAL') {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="login" element={<LoginPage />} />

      {/* Layout with Header and Footer for public pages */}
      <Route element={<Layout />}>
        <Route index element={<Home />} /> {/* Root path renders Home component */}
        <Route path="about" element={<About />} />
        <Route path="theme-example" element={<CorporateThemeExample />} />
        {/* Public auction routes */}
        <Route path="auctions" element={<AuctionsPage />} />
        <Route path="auctions/:id" element={<AuctionDetailPage />} />
      </Route>

      {/* Protected dashboard routes */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="auctions" element={<AuctionsPage />} />
        <Route path="auctions/:id" element={<AuctionDetailPage />} />
        <Route path="properties" element={<PropertiesPage />} />
        {/* Add more dashboard routes as needed */}
      </Route>

      {/* Admin dashboard routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'COUNTY_OFFICIAL']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* ⚠️ CRITICAL: All admin routes must be defined here to match AdminLayout.tsx sidebar links */}
        <Route index element={<Navigate to="dashboard" replace />} />{' '}
        {/* Redirect /admin to /admin/dashboard */}
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="auctions" element={<AdminAuctionsPage />} />
        <Route path="certificates" element={<AdminCertificatesPage />} />
        <Route path="counties" element={<AdminCountiesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="registrations" element={<AdminRegistrationsPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="batches" element={<AdminBatchesPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="system-config" element={<AdminSystemConfigPage />} />
        <Route path="import-export" element={<DataImportExportPage />} />
        <Route path="auction-management" element={<AuctionManagementPage />} />
        <Route path="certificate-management" element={<CertificateManagementPage />} />
        <Route path="test" element={<AdminTestPage />} />
      </Route>

      {/* 404 Not Found */}
      <Route
        path="*"
        element={
          <NotFound>
            <p>
              Page not found. <a href="/">Return home</a>
            </p>
          </NotFound>
        }
      />
    </Routes>
  );
}

export default App;
