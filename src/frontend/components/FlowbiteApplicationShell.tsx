import React from 'react';
import { Sidebar, Navbar, Dropdown, Avatar } from 'flowbite-react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiFileText, FiPackage, FiPieChart, FiSettings, FiLogOut } from 'react-icons/fi';

const FlowbiteApplicationShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('User logged out');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 hidden md:block">
        <Sidebar className="h-full">
          <div className="mb-5 flex items-center pl-2.5">
            <img src="/logo.svg" className="h-6 mr-3" alt="Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap">TaxCertSale</span>
          </div>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item as={Link} to="/" icon={FiHome} active={isActive('/')}>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item as={Link} to="/auctions" icon={FiPieChart} active={isActive('/auctions')}>
                Auctions
              </Sidebar.Item>
              <Sidebar.Item as={Link} to="/properties" icon={FiPackage} active={isActive('/properties')}>
                Properties
              </Sidebar.Item>
              <Sidebar.Item as={Link} to="/users" icon={FiUsers} active={isActive('/users')}>
                Users
              </Sidebar.Item>
              <Sidebar.Item as={Link} to="/reports" icon={FiFileText} active={isActive('/reports')}>
                Reports
              </Sidebar.Item>
              <Sidebar.Item as={Link} to="/settings" icon={FiSettings} active={isActive('/settings')}>
                Settings
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar fluid className="border-b border-gray-200">
          <div className="flex md:order-2">
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User avatar"
                  img="/images/avatar.png"
                  rounded
                  size="sm"
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">John Doe</span>
                <span className="block text-sm font-medium truncate">john.doe@example.com</span>
              </Dropdown.Header>
              <Dropdown.Item icon={FiSettings} as={Link} to="/settings">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item icon={FiLogOut} onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown>
            <Navbar.Toggle />
          </div>
          <Navbar.Collapse>
            <Navbar.Link as={Link} to="/" active={isActive('/')}>Dashboard</Navbar.Link>
            <Navbar.Link as={Link} to="/auctions" active={isActive('/auctions')}>Auctions</Navbar.Link>
            <Navbar.Link as={Link} to="/properties" active={isActive('/properties')}>Properties</Navbar.Link>
            <Navbar.Link as={Link} to="/users" active={isActive('/users')}>Users</Navbar.Link>
            <Navbar.Link as={Link} to="/reports" active={isActive('/reports')}>Reports</Navbar.Link>
          </Navbar.Collapse>
        </Navbar>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FlowbiteApplicationShell; 