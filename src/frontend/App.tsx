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
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import { useAuth } from './context/AuthContext';

// Updated Protected route component to use AuthContext
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth(); // Get auth state from context

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" replace />;
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
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
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
