import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

/**
 * ⚠️ CRITICAL: ADMIN NAVIGATION SIDEBAR ⚠️
 * 
 * Any link added to this sidebar MUST have a corresponding route in App.tsx.
 * The primary route configuration is in App.tsx - not in AppRouter.tsx.
 * 
 * When adding a new admin page:
 * 1. Create the page component (e.g., AdminNewFeaturePage.tsx)
 * 2. Add a route in App.tsx
 * 3. Add a link here
 * 
 * Never create links without corresponding routes!
 */

// This layout is specifically for the Admin section, with a Light Theme + Red Accents
function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    users: false,
    certificates: false,
    auctions: false,
    system: false
  });
  
  // State for password prompt
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [purgeError, setPurgeError] = useState('');
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  
  // Check if the current path matches the link (adjust for admin base path)
  const isActive = (path: string) => {
    // Check if the path starts with the admin base path
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const isSubmenuActive = (paths: string[]) => {
    return paths.some(path => isActive(path));
  };

  const toggleSubmenu = (menu: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleLogout = () => {
    logout();
  };
  
  // Handle purge data button click
  const handlePurgeClick = () => {
    setShowPasswordPrompt(true);
    setPassword('');
    setPurgeError('');
    setPurgeSuccess(false);
  };
  
  // Handle password submit
  const handlePasswordSubmit = async () => {
    if (password === 'zPkm135!') {
      try {
        // Call API to truncate InfluxDB tables
        const response = await fetch('/api/admin/purge-influxdb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        });
        
        if (response.ok) {
          setPurgeSuccess(true);
          setPurgeError('');
          // Close dialog after 2 seconds
          setTimeout(() => {
            setShowPasswordPrompt(false);
            setPurgeSuccess(false);
          }, 2000);
        } else {
          const data = await response.json();
          setPurgeError(data.message || 'Failed to purge data');
        }
      } catch (error) {
        setPurgeError('An error occurred while purging data');
        console.error('Purge error:', error);
      }
    } else {
      setPurgeError('Invalid password');
    }
  };

  // Theme classes for Light mode with Red accents
  const sidebarBg = 'bg-white';
  const mainBg = 'bg-gray-100';
  const headerBg = 'bg-white';
  const borderColor = 'border-gray-200';
  const titleColor = 'text-gray-800';
  const textColor = 'text-gray-600';
  const linkHoverBg = 'hover:bg-gray-100';
  const linkActiveBg = 'bg-red-100'; // Light red for active background
  const linkActiveText = 'text-red-700'; // Dark red text for active
  const iconColor = 'text-gray-500'; // Default icon color
  const buttonTextColor = 'text-gray-700';
  const buttonHoverBg = 'hover:bg-gray-50';
  const submenuPadding = 'pl-10'; // Extra padding for submenu items

  return (
    <div className={`flex h-screen ${mainBg}`}>
      {/* Sidebar - Light Theme */}
      <div className={`w-64 ${sidebarBg} shadow-md border-r ${borderColor}`}>
        <div className={`p-4 border-b ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${titleColor}`}>Admin Panel</h2>
        </div>
        <nav className="mt-4 px-2">
          {/* ⚠️ WARNING: Each link below MUST have a corresponding route in App.tsx */}
          <ul>
            <li className="mb-1">
              <Link
                to="/admin/dashboard"
                className={`flex items-center px-3 py-2 rounded-md ${isActive('/admin/dashboard') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
              >
                <span className={`material-icons mr-3 text-lg ${isActive('/admin/dashboard') ? linkActiveText : iconColor}`}>dashboard</span>
                Admin Home
              </Link>
            </li>

            {/* Auctions submenu */}
            <li className="mb-1">
              <button
                onClick={() => toggleSubmenu('auctions')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${isSubmenuActive(['/admin/auctions']) ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
              >
                <div className="flex items-center">
                  <span className={`material-icons mr-3 text-lg ${isSubmenuActive(['/admin/auctions']) ? linkActiveText : iconColor}`}>gavel</span>
                  Auctions
                </div>
                <span className="material-icons text-sm">
                  {expandedMenus.auctions ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {expandedMenus.auctions && (
                <ul className="mt-1 mb-2">
                  <li>
                    <Link
                      to="/admin/auctions"
                      className={`flex items-center ${submenuPadding} py-2 rounded-md ${isActive('/admin/auctions') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
                    >
                      Manage Auctions
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/batches"
                      className={`flex items-center ${submenuPadding} py-2 rounded-md ${isActive('/admin/batches') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
                    >
                      Auction Batches
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Certificates submenu */}
            <li className="mb-1">
              <button
                onClick={() => toggleSubmenu('certificates')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${isSubmenuActive(['/admin/certificates']) ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
              >
                <div className="flex items-center">
                  <span className={`material-icons mr-3 text-lg ${isSubmenuActive(['/admin/certificates']) ? linkActiveText : iconColor}`}>receipt_long</span>
                  Certificates
                </div>
                <span className="material-icons text-sm">
                  {expandedMenus.certificates ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {expandedMenus.certificates && (
                <ul className="mt-1 mb-2">
                  <li>
                    <Link
                      to="/admin/certificates"
                      className={`flex items-center ${submenuPadding} py-2 rounded-md ${isActive('/admin/certificates') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
                    >
                      Manage Certificates
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="mb-1">
              <Link
                to="/admin/counties"
                className={`flex items-center px-3 py-2 rounded-md ${isActive('/admin/counties') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
              >
                <span className={`material-icons mr-3 text-lg ${isActive('/admin/counties') ? linkActiveText : iconColor}`}>location_city</span>
                Manage Counties
              </Link>
            </li>

            {/* Users submenu */}
            <li className="mb-1">
              <button
                onClick={() => toggleSubmenu('users')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${isSubmenuActive(['/admin/users']) ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
              >
                <div className="flex items-center">
                  <span className={`material-icons mr-3 text-lg ${isSubmenuActive(['/admin/users']) ? linkActiveText : iconColor}`}>manage_accounts</span>
                  User Management
                </div>
                <span className="material-icons text-sm">
                  {expandedMenus.users ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {expandedMenus.users && (
                <ul className="mt-1 mb-2">
                  <li>
                    <Link
                      to="/admin/users"
                      className={`flex items-center ${submenuPadding} py-2 rounded-md ${isActive('/admin/users') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
                    >
                      Users
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="mb-1">
              <Link
                to="/admin/registrations"
                className={`flex items-center px-3 py-2 rounded-md ${isActive('/admin/registrations') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
              >
                <span className={`material-icons mr-3 text-lg ${isActive('/admin/registrations') ? linkActiveText : iconColor}`}>how_to_reg</span>
                Bidder Registrations
              </Link>
            </li>

            <li className="mb-1">
              <Link
                to="/admin/audit-logs"
                className={`flex items-center px-3 py-2 rounded-md ${isActive('/admin/audit-logs') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
              >
                <span className={`material-icons mr-3 text-lg ${isActive('/admin/audit-logs') ? linkActiveText : iconColor}`}>history</span>
                Audit Logs
              </Link>
            </li>

            {/* System Settings Submenu with confirmed routes */}
            <li className="mb-1">
              <button
                onClick={() => toggleSubmenu('system')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${isSubmenuActive(['/admin/settings', '/admin/payments', '/admin/analytics', '/admin/notifications', '/admin/system-config']) ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
              >
                <div className="flex items-center">
                  <span className={`material-icons mr-3 text-lg ${isSubmenuActive(['/admin/settings', '/admin/payments', '/admin/analytics', '/admin/notifications', '/admin/system-config']) ? linkActiveText : iconColor}`}>settings</span>
                  System
                </div>
                <span className="material-icons text-sm">
                  {expandedMenus.system ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {expandedMenus.system && (
                <ul className="mt-1 mb-2">
                  <li>
                    <Link
                      to="/admin/settings"
                      className={`flex items-center ${submenuPadding} py-2 rounded-md ${isActive('/admin/settings') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/payments"
                      className={`flex items-center ${submenuPadding} py-2 rounded-md ${isActive('/admin/payments') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
                    >
                      Payment Processing
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/analytics"
                      className={`flex items-center ${submenuPadding} py-2 rounded-md ${isActive('/admin/analytics') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
                    >
                      Analytics
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/notifications"
                      className={`flex items-center ${submenuPadding} py-2 rounded-md ${isActive('/admin/notifications') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
                    >
                      Notifications
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/system-config"
                      className={`flex items-center ${submenuPadding} py-2 rounded-md ${isActive('/admin/system-config') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
                    >
                      System Configuration
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
        {/* Logout Button - Styled for light theme */}
        <div className="absolute bottom-0 w-64 p-2 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center px-3 py-2 rounded-md ${buttonTextColor} ${buttonHoverBg} border border-gray-300`}
          >
            <span className={`material-icons mr-2 text-lg ${iconColor}`}>logout</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header - Light Theme */}
        <header className={`${headerBg} shadow-sm border-b ${borderColor}`}>
          <div className="px-4 py-3 flex justify-between items-center">
            <h1 className={`text-xl font-semibold ${titleColor}`}>Admin Dashboard</h1>
            <div className="flex items-center">
              {/* Add Purge Data button */}
              <button 
                onClick={handlePurgeClick}
                className={`p-1 px-3 mr-3 rounded-md text-red-700 border border-red-300 hover:bg-red-50`}
              >
                <span className="flex items-center">
                  <span className={`material-icons mr-1 text-lg`}>delete_forever</span>
                  Purge Data
                </span>
              </button>
              
              <button className={`p-1 rounded-full ${textColor} ${buttonHoverBg}`}>
                <span className={`material-icons ${iconColor}`}>notifications</span>
              </button>
              <button className={`p-1 rounded-full ${textColor} ${buttonHoverBg} ml-2`}>
                <span className={`material-icons ${iconColor}`}>account_circle</span>
              </button>
              <div className="ml-2">
                <span className={`text-sm ${textColor}`}>{user?.name || 'Admin'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Password Prompt Modal */}
        {showPasswordPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Data Purge</h3>
              
              {purgeSuccess ? (
                <div className="text-green-700 bg-green-50 p-3 rounded mb-4">
                  InfluxDB tables have been successfully truncated.
                </div>
              ) : (
                <>
                  <p className="text-gray-700 mb-4">
                    This action will truncate all InfluxDB tables. This operation cannot be undone.
                    Please enter the administrator password to continue.
                  </p>
                  
                  {purgeError && (
                    <div className="text-red-700 bg-red-50 p-3 rounded mb-4">
                      {purgeError}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter password"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowPasswordPrompt(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePasswordSubmit}
                      className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                      Confirm Purge
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout; 