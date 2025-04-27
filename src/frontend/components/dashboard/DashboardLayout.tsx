import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Define county-specific theme colors (Tailwind classes)
const countyThemes: { [key: string]: { bg: string; border: string; active: string; hover: string; text: string } } = {
  Wakulla: { // Blue Theme
    bg: 'bg-blue-800',
    border: 'border-blue-700',
    active: 'bg-blue-900 text-white',
    hover: 'hover:bg-blue-700 hover:text-white',
    text: 'text-gray-100' // Light text for contrast
  },
  Leon: { // Green Theme
    bg: 'bg-green-800',
    border: 'border-green-700',
    active: 'bg-green-900 text-white',
    hover: 'hover:bg-green-700 hover:text-white',
    text: 'text-gray-100' // Light text for contrast
  },
  // Add more counties and themes here
};

function DashboardLayout() {
  const location = useLocation();
  const { user, logout, selectedCounty } = useAuth();

  // Determine theme based on selected county, default to dark gray
  const theme = selectedCounty && countyThemes[selectedCounty] ? 
                countyThemes[selectedCounty] : 
                { // Default Dark Theme
                  bg: 'bg-gray-800',
                  border: 'border-gray-700',
                  active: 'bg-gray-700 text-white',
                  hover: 'hover:bg-gray-700 hover:text-white',
                  text: 'text-gray-300'
                };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className={`w-64 ${theme.bg} shadow-md border-r ${theme.border}`}>
        <div className={`p-4 border-b ${theme.border}`}>
          <h2 className="text-xl font-semibold text-white">
             {selectedCounty ? `${selectedCounty} County` : (user?.username ? `${user.username}'s Dashboard` : 'Dashboard')} 
          </h2>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="mb-2">
              <Link
                to="/dashboard"
                className={`flex items-center px-4 py-2 rounded-md mx-2 ${isActive('/dashboard') ? theme.active : `${theme.text} ${theme.hover}`}`}
              >
                <span className="material-icons mr-3 text-lg">dashboard</span>
                Dashboard Home
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/auctions"
                className={`flex items-center px-4 py-2 rounded-md mx-2 ${isActive('/dashboard/auctions') ? theme.active : `${theme.text} ${theme.hover}`}`}
              >
                <span className="material-icons mr-3 text-lg">gavel</span>
                Auctions
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/properties"
                className={`flex items-center px-4 py-2 rounded-md mx-2 ${isActive('/dashboard/properties') ? theme.active : `${theme.text} ${theme.hover}`}`}
              >
                <span className="material-icons mr-3 text-lg">home</span>
                Properties
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/users"
                className={`flex items-center px-4 py-2 ${isActive('/dashboard/users') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span className="material-icons mr-3 text-lg">people</span>
                Users
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/reports"
                className={`flex items-center px-4 py-2 ${isActive('/dashboard/reports') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span className="material-icons mr-3 text-lg">assessment</span>
                Reports
              </Link>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
             <button 
                onClick={handleLogout}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-md ${theme.text} ${theme.hover} bg-opacity-20 ${theme.bg} border ${theme.border}`}
             > 
                <span className="material-icons mr-2 text-lg">logout</span>
                Logout
             </button>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className={`${theme.bg} shadow-sm border-b ${theme.border}`}>
          <div className="px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-white">
               {selectedCounty ? `${selectedCounty} County Dashboard` : 'User Dashboard'}
            </h1>
            <div className="flex items-center">
              <button className={`p-1 rounded-full ${theme.text} ${theme.hover}`}>
                <span className="material-icons">notifications</span>
              </button>
              <button className={`p-1 rounded-full ${theme.text} ${theme.hover} ml-2`}>
                <span className="material-icons">account_circle</span>
              </button>
              <div className="ml-2">
                <span className={`text-sm ${theme.text}`}>{user?.username || 'User'}</span>
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

export default DashboardLayout; 