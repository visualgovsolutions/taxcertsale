import React, { useState, ReactNode } from 'react';
import { Navbar, Sidebar, Button, Card, Dropdown, Avatar } from 'flowbite-react';
import { Link, Outlet, useLocation, LinkProps } from 'react-router-dom';

// Create a LinkWrapper component to handle the Link integration with Flowbite components
interface LinkWrapperProps extends Omit<LinkProps, 'to'> {
  children: ReactNode;
  to: string;
}

const LinkWrapper: React.FC<LinkWrapperProps> = ({ children, to, ...rest }) => {
  return (
    <Link to={to} {...rest}>
      {children}
    </Link>
  );
};

const FlowbiteWithRouter: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Sidebar - rendered conditionally */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sidebar container */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl">
            <div className="h-full overflow-y-auto">
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-xl font-bold">Tax Cert Sale</h2>
                <Button 
                  size="sm" 
                  color="gray" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ✕
                </Button>
              </div>
              
              <Sidebar aria-label="Mobile navigation menu">
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item
                      href="/"
                      active={isActive('/')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Sidebar.Item>
                    
                    <Sidebar.Item
                      href="/auctions"
                      active={isActive('/auctions')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Auctions
                    </Sidebar.Item>
                    
                    <Sidebar.Item
                      href="/properties"
                      active={isActive('/properties')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Properties
                    </Sidebar.Item>
                    
                    <Sidebar.Item
                      href="/users"
                      active={isActive('/users')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Users
                    </Sidebar.Item>
                    
                    <Sidebar.Item
                      href="/reports"
                      active={isActive('/reports')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Reports
                    </Sidebar.Item>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </Sidebar>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Sidebar */}
      <div className={`hidden md:block ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 shadow-md`}>
        <Sidebar aria-label="Navigation sidebar">
          <div className="flex justify-between items-center mb-4 px-3 pt-2">
            {!collapsed && <span className="text-xl font-bold">Tax Cert Sale</span>}
            <Button 
              size="sm" 
              color="gray" 
              pill
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? '→' : '←'}
            </Button>
          </div>
          
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                href="/"
                active={isActive('/')}
              >
                {!collapsed && 'Dashboard'}
              </Sidebar.Item>
              
              <Sidebar.Item
                href="/auctions"
                active={isActive('/auctions')}
              >
                {!collapsed && 'Auctions'}
              </Sidebar.Item>
              
              <Sidebar.Item
                href="/properties"
                active={isActive('/properties')}
              >
                {!collapsed && 'Properties'}
              </Sidebar.Item>
              
              <Sidebar.Item
                href="/users"
                active={isActive('/users')}
              >
                {!collapsed && 'Users'}
              </Sidebar.Item>
              
              <Sidebar.Item
                href="/reports"
                active={isActive('/reports')}
              >
                {!collapsed && 'Reports'}
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
      
      {/* Main content area */}
      <div className="flex-1">
        <Navbar fluid>
          {/* For mobile: hamburger menu */}
          <div className="flex md:hidden">
            <Button
              color="gray"
              size="sm"
              onClick={() => setMobileMenuOpen(true)}
            >
              ☰
            </Button>
          </div>
          
          <div className="flex-1 flex justify-between items-center">
            <LinkWrapper to="/">
              <Navbar.Brand>
                <span className="self-center whitespace-nowrap text-xl font-semibold">
                  Tax Cert Sale
                </span>
              </Navbar.Brand>
            </LinkWrapper>
            
            <div className="flex space-x-2">
              {/* On mobile we'd show links here, on desktop we use the sidebar */}
              <div className="hidden md:flex space-x-4">
                <LinkWrapper to="/">
                  <Navbar.Link active={isActive('/')}>
                    Dashboard
                  </Navbar.Link>
                </LinkWrapper>
                <LinkWrapper to="/auctions">
                  <Navbar.Link active={isActive('/auctions')}>
                    Auctions
                  </Navbar.Link>
                </LinkWrapper>
              </div>
              
              {/* User dropdown menu */}
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar 
                    alt="User avatar" 
                    img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" 
                    rounded
                  />
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">John Doe</span>
                  <span className="block truncate text-sm font-medium">john.doe@example.com</span>
                </Dropdown.Header>
                <Dropdown.Item>
                  <LinkWrapper to="/profile">Profile</LinkWrapper>
                </Dropdown.Item>
                <Dropdown.Item>
                  <LinkWrapper to="/settings">Settings</LinkWrapper>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>Sign out</Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </Navbar>
        
        {/* Page content */}
        <div className="p-4">
          {/* Example card showing Flowbite integration */}
          <Card className="mb-4">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900">
              Flowbite + React Router Example
            </h5>
            <p className="font-normal text-gray-700">
              This example shows how to integrate Flowbite React components with React Router.
              The sidebar and navbar links will highlight based on the active route.
            </p>
            <div className="flex flex-wrap gap-2">
              <LinkWrapper to="/">
                <Button>
                  Go to Dashboard
                </Button>
              </LinkWrapper>
            </div>
          </Card>
          
          {/* This renders the nested routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FlowbiteWithRouter;