import React from 'react';
import { Sidebar, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import useActiveRoute from '../hooks/useActiveRoute';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const isActive = (path: string) => useActiveRoute(path);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Sidebar container */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl">
        <div className="h-full overflow-y-auto">
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-xl font-bold">Tax Cert Sale</h2>
            <Button 
              size="sm" 
              color="gray" 
              onClick={onClose}
            >
              ✕
            </Button>
          </div>
          
          <Sidebar aria-label="Mobile navigation menu">
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item
                  as={Link}
                  to="/"
                  active={isActive('/')}
                  onClick={onClose}
                >
                  Dashboard
                </Sidebar.Item>
                
                <Sidebar.Item
                  as={Link}
                  to="/auctions"
                  active={isActive('/auctions')}
                  onClick={onClose}
                >
                  Auctions
                </Sidebar.Item>
                
                <Sidebar.Item
                  as={Link}
                  to="/properties"
                  active={isActive('/properties')}
                  onClick={onClose}
                >
                  Properties
                </Sidebar.Item>
                
                <Sidebar.Item
                  as={Link}
                  to="/users"
                  active={isActive('/users')}
                  onClick={onClose}
                >
                  Users
                </Sidebar.Item>
                
                <Sidebar.Item
                  as={Link}
                  to="/products"
                  active={isActive('/products')}
                  onClick={onClose}
                >
                  Products
                </Sidebar.Item>
                
                <Sidebar.Item
                  as={Link}
                  to="/reports"
                  active={isActive('/reports')}
                  onClick={onClose}
                >
                  Reports
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar; 