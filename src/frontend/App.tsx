import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AdminLayout from './components/admin/AdminLayout';
import CountyAdminLayout from './components/layouts/CountyAdminLayout';
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

// County Admin pages
import CountyAdminDashboardPage from './pages/county/CountyAdminDashboardPage';
import BidderApprovalsPage from './pages/county/BidderApprovalsPage';
import W9ApprovalsPage from './pages/county/W9ApprovalsPage';

import { useAuth } from './context/AuthContext';
import BidderLayout from './components/layouts/BidderLayout';
import BidderDashboardPage from './pages/BidderDashboardPage';
// Import bidder page components
import BidderAuctionsPage from './pages/bidder/BidderAuctionsPage';
import BidderCertificatesPage from './pages/bidder/BidderCertificatesPage';
import BidderBidsPage from './pages/bidder/BidderBidsPage';
import BidderCertificateDetailPage from './pages/bidder/BidderCertificateDetailPage';
import CountyAuctionPage from './pages/bidder/CountyAuctionPage';
import BidderLandingPage from './pages/bidder/BidderLandingPage';
import W9FormPage from './pages/bidder/W9FormPage';
import UploadBidsPage from './pages/bidder/UploadBidsPage';
import DepositPage from './pages/bidder/DepositPage';
import ParcelSearchPage from './pages/bidder/ParcelSearchPage';
import PlaceBidsPage from './pages/bidder/PlaceBidsPage';
import ProtectedRoute from './components/common/ProtectedRoute';

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

      {/* Bidder routes */}
      <Route
        path="/bidder"
        element={
          <ProtectedRoute requiredRole="INVESTOR">
            <BidderLayout>
              <Outlet />
            </BidderLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<BidderLandingPage />} />
        <Route path="dashboard" element={<BidderDashboardPage />} />
        <Route path="auctions" element={<BidderAuctionsPage />} />
        <Route path="county-auction/:auctionId" element={<CountyAuctionPage />} />
        <Route path="county-auction/:auctionId/w9-form" element={<W9FormPage />} />
        <Route path="county-auction/:auctionId/deposit" element={<DepositPage />} />
        <Route path="county-auction/:auctionId/upload-bids" element={<UploadBidsPage />} />
        <Route path="county-auction/:auctionId/search" element={<ParcelSearchPage />} />
        <Route path="county-auction/:auctionId/place-bids" element={<PlaceBidsPage />} />
        <Route path="county-auction/:auctionId/my-bids" element={<BidderBidsPage />} />
        <Route path="certificates" element={<BidderCertificatesPage />} />
        <Route path="certificates/:certificateId" element={<BidderCertificateDetailPage />} />
        <Route path="certificates/:certificateId/bid" element={<div>Place Bid Page</div>} />
        <Route path="bids" element={<BidderBidsPage />} />
        <Route path="profile" element={<div>Bidder Profile</div>} />
        <Route path="settings" element={<div>Bidder Settings</div>} />
        {/* New bidder routes matching navigation menu */}
        <Route path="auction-summary" element={<BidderLandingPage />} />
        <Route path="search" element={<div>Search Page</div>} />
        <Route path="place-bids" element={<Navigate to="/bidder/auctions" replace />} />
        <Route path="my-bids" element={<BidderBidsPage />} />
        <Route path="change-password" element={<div>Change Password Page</div>} />
        <Route path="support" element={<div>Support Page</div>} />
      </Route>

      {/* County Admin routes */}
      <Route
        path="/county-admin"
        element={
          <ProtectedRoute requiredRole="COUNTY_OFFICIAL">
            <CountyAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CountyAdminDashboardPage />} />
        <Route path="bidder-approvals" element={<BidderApprovalsPage />} />
        <Route path="w9-approvals" element={<W9ApprovalsPage />} />
        <Route path="certificates" element={<div>County Certificates Page</div>} />
        <Route path="county-info" element={<div>County Information Page</div>} />
        <Route path="settings" element={<div>County Settings Page</div>} />
        <Route path="analytics" element={<div>County Analytics Page</div>} />
        <Route path="investors" element={<div>County Investors Page</div>} />
      </Route>

      {/* Admin dashboard routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
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
