import React, { useState } from 'react';
import { Navbar, Button, Dropdown } from 'flowbite-react';
import { 
  HiHome, 
  HiCreditCard, 
  HiDocumentReport, 
  HiShoppingBag, 
  HiUser, 
  HiCog, 
  HiBell, 
  HiOutlineLogout,
  HiMenuAlt1,
  HiLockClosed
} from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface BidderLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean; // Added optional config for sidebar
}

const BidderLayout: React.FC<BidderLayoutProps> = ({ children, showSidebar = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Check if the current path is a county auction page
  const isCountyAuctionPage = location.pathname.includes('/bidder/county-auction/');
  
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };
  
  return (
    <div className="flex flex-col h-screen bidder-layout">
      <Navbar fluid className="border-b px-4">
        <Navbar.Brand as={Link} to="/bidder/dashboard">
          <img
            src="/public/VG.png"
            className="mr-3 h-6 sm:h-8"
            alt="Florida Tax Certificate Sale"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Bidder Portal
          </span>
        </Navbar.Brand>
        
        <div className="flex md:order-2 gap-2 items-center">
          <Button color="gray" size="sm">
            <HiBell className="mr-2 h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="flex items-center gap-2 p-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <HiUser className="h-5 w-5" />
                <span className="hidden md:inline-block">My Account</span>
              </div>
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{user?.username || "Bidder"}</span>
              <span className="block truncate text-sm font-medium">{user?.email || "bidder@example.com"}</span>
            </Dropdown.Header>
            <Dropdown.Item icon={HiUser} as={Link} to="/bidder/profile">Profile</Dropdown.Item>
            <Dropdown.Item icon={HiCog} as={Link} to="/bidder/settings">Settings</Dropdown.Item>
            <Dropdown.Item icon={HiLockClosed} as={Link} to="/bidder/change-password">Change Password</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={HiOutlineLogout} onClick={() => logout()}>Logout</Dropdown.Item>
          </Dropdown>
          
          <Navbar.Toggle />
        </div>
        
        <Navbar.Collapse>
          {isCountyAuctionPage ? (
            // County auction specific menu
            <>
              <Navbar.Link 
                as={Link} 
                to={location.pathname.includes('/bidder/county-auction/') 
                  ? `/bidder/county-auction/${location.pathname.split('/bidder/county-auction/')[1].split('/')[0]}`
                  : '/bidder/auction-summary'
                } 
                active={location.pathname.includes('/bidder/county-auction/') && !location.pathname.includes('/search') && !location.pathname.includes('/place-bids') && !location.pathname.includes('/deposit') && !location.pathname.includes('/w9-form') && !location.pathname.includes('/upload-bids')}
              >
                Auction Summary
              </Navbar.Link>
              <Navbar.Link 
                as={Link} 
                to={location.pathname.includes('/bidder/county-auction/') 
                  ? `/bidder/county-auction/${location.pathname.split('/bidder/county-auction/')[1].split('/')[0]}/search`
                  : '/bidder/search'
                }
                active={location.pathname.includes('/search')}
              >
                Search
              </Navbar.Link>
              <Navbar.Link 
                as={Link} 
                to={location.pathname.includes('/bidder/county-auction/') 
                  ? `/bidder/county-auction/${location.pathname.split('/bidder/county-auction/')[1].split('/')[0]}/place-bids`
                  : '/bidder/auctions'
                }
                active={location.pathname.includes('/place-bids')}
              >
                Place Bids
              </Navbar.Link>
              <Navbar.Link 
                as={Link} 
                to={location.pathname.includes('/bidder/county-auction/') 
                  ? `/bidder/county-auction/${location.pathname.split('/bidder/county-auction/')[1].split('/')[0]}/my-bids`
                  : '/bidder/my-bids'
                }
                active={location.pathname.includes('/my-bids')}
              >
                My Bids
              </Navbar.Link>
              <Navbar.Link 
                as={Link} 
                to={location.pathname.includes('/bidder/county-auction/') 
                  ? `/bidder/county-auction/${location.pathname.split('/bidder/county-auction/')[1].split('/')[0]}/deposit`
                  : '/bidder/deposit'
                } 
                active={location.pathname.includes('/deposit')}
              >
                Deposit
              </Navbar.Link>
              <Navbar.Link 
                as={Link} 
                to={location.pathname.includes('/bidder/county-auction/') 
                  ? `/bidder/county-auction/${location.pathname.split('/bidder/county-auction/')[1].split('/')[0]}/w9-form`
                  : '/bidder/w9-form'
                } 
                active={location.pathname.includes('/w9-form')}
              >
                W9 Form
              </Navbar.Link>
              <Navbar.Link 
                as={Link} 
                to={location.pathname.includes('/bidder/county-auction/') 
                  ? `/bidder/county-auction/${location.pathname.split('/bidder/county-auction/')[1].split('/')[0]}/upload-bids`
                  : '/bidder/upload-bids'
                } 
                active={location.pathname.includes('/upload-bids')}
              >
                Upload Bids
              </Navbar.Link>
              <Navbar.Link as={Link} to="/bidder/support" active={location.pathname === '/bidder/support'}>
                Support
              </Navbar.Link>
            </>
          ) : (
            // Default bidder dashboard menu
            <>
              <Navbar.Link as={Link} to="/bidder/dashboard" active={location.pathname === '/bidder/dashboard' || location.pathname === '/bidder'}>
                <div className="flex items-center">
                  <HiHome className="mr-2 h-5 w-5" />
                  Cross-County Dashboard
                </div>
              </Navbar.Link>
              <Navbar.Link as={Link} to="/bidder/auctions" active={location.pathname === '/bidder/auctions'}>
                <div className="flex items-center">
                  <HiShoppingBag className="mr-2 h-5 w-5" />
                  Auctions
                </div>
              </Navbar.Link>
              <Navbar.Link as={Link} to="/bidder/certificates" active={location.pathname === '/bidder/certificates'}>
                <div className="flex items-center">
                  <HiDocumentReport className="mr-2 h-5 w-5" />
                  My Certificates
                </div>
              </Navbar.Link>
              <Navbar.Link as={Link} to="/bidder/bids" active={location.pathname === '/bidder/bids'}>
                <div className="flex items-center">
                  <HiCreditCard className="mr-2 h-5 w-5" />
                  My Bids
                </div>
              </Navbar.Link>
              <Navbar.Link as={Link} to="/bidder/auctions" active={location.pathname === '/bidder/place-bids'}>
                <div className="flex items-center">
                  <HiShoppingBag className="mr-2 h-5 w-5" />
                  Place Bids
                </div>
              </Navbar.Link>
            </>
          )}
        </Navbar.Collapse>
      </Navbar>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Conditionally render sidebar based on showSidebar prop */}
        {showSidebar && (
          <aside className="w-64 hidden md:block bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="h-full px-3 py-4 overflow-y-auto">
              <ul className="space-y-2 font-medium">
                <li>
                  <Link 
                    to="/bidder/dashboard"
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      location.pathname === '/bidder/dashboard' || location.pathname === '/' ? 'text-blue-600 dark:text-blue-500' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <HiHome className="w-5 h-5" />
                    <span className="ml-3">Cross-County Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/bidder/auctions"
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      location.pathname === '/bidder/auctions' ? 'text-blue-600 dark:text-blue-500' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <HiShoppingBag className="w-5 h-5" />
                    <span className="ml-3">Auctions</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/bidder/certificates"
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      location.pathname === '/bidder/certificates' ? 'text-blue-600 dark:text-blue-500' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <HiDocumentReport className="w-5 h-5" />
                    <span className="ml-3">My Certificates</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/bidder/bids"
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      location.pathname === '/bidder/bids' ? 'text-blue-600 dark:text-blue-500' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <HiCreditCard className="w-5 h-5" />
                    <span className="ml-3">My Bids</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/bidder/profile"
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      location.pathname === '/bidder/profile' ? 'text-blue-600 dark:text-blue-500' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <HiUser className="w-5 h-5" />
                    <span className="ml-3">Profile</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/bidder/settings"
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      location.pathname === '/bidder/settings' ? 'text-blue-600 dark:text-blue-500' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <HiCog className="w-5 h-5" />
                    <span className="ml-3">Settings</span>
                  </Link>
                </li>
                <li>
                  <a 
                    href="#"
                    onClick={handleLogout}
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <HiOutlineLogout className="w-5 h-5" />
                    <span className="ml-3">Logout</span>
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        )}
        
        <main className={`flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 bidder-dashboard ${showSidebar ? '' : 'w-full'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default BidderLayout; 