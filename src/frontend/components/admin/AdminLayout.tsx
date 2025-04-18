import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Use correct path

// This layout is specifically for the Admin section, with a Light Theme + Red Accents
function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth(); // Removed selectedCounty as it's not needed for admin layout styling
  
  // Check if the current path matches the link (adjust for admin base path)
  const isActive = (path: string) => {
    // Check if the path starts with the admin base path
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    logout();
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

  return (
    <div className={`flex h-screen ${mainBg}`}> 
      {/* Sidebar - Light Theme */}
      <div className={`w-64 ${sidebarBg} shadow-md border-r ${borderColor}`}> 
        <div className={`p-4 border-b ${borderColor}`}> 
          <h2 className={`text-xl font-semibold ${titleColor}`}>Admin Panel</h2> 
        </div>
        <nav className="mt-4 px-2"> {/* Added horizontal padding */}
          <ul>
            <li className="mb-1"> {/* Reduced margin */} 
              <Link
                to="/admin/dashboard"
                className={`flex items-center px-3 py-2 rounded-md ${isActive('/admin/dashboard') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
              >
                <span className={`material-icons mr-3 text-lg ${isActive('/admin/dashboard') ? linkActiveText : iconColor}`}>admin_panel_settings</span>
                Admin Home
              </Link>
            </li>
            {/* Activate Manage Users Link */}
            <li className="mb-1">
              <Link
                to="/admin/users" 
                className={`flex items-center px-3 py-2 rounded-md ${isActive('/admin/users') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
              >
                <span className={`material-icons mr-3 text-lg ${isActive('/admin/users') ? linkActiveText : iconColor}`}>manage_accounts</span>
                Manage Users
              </Link>
            </li>
            {/* Keep Settings commented out for now */}
            {/*
            <li className="mb-1">
              <Link
                to="/admin/settings" 
                className={`flex items-center px-3 py-2 rounded-md ${isActive('/admin/settings') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`}
              >
                <span className={`material-icons mr-3 text-lg ${isActive('/admin/settings') ? linkActiveText : iconColor}`}>settings</span>
                Settings
              </Link>
            </li>
            */}
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

        {/* Content */}
        <main className="p-6">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}

export default AdminLayout; 