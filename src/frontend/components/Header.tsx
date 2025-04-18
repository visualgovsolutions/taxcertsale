// import React from 'react'; // No longer needed for JSX
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'flowbite-react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-gray-900 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="/public/VG.png"
            alt="VisualGov Solutions Logo" 
            className="h-8 w-auto"
          />
          <span className="self-center text-lg font-medium whitespace-nowrap text-white">VisualGov Solutions</span>
        </Link>
        
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <Link to="/login">
            <Button color="red" className="hidden md:block">
              Sign In
            </Button>
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        </div>
        
        <nav className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? "block" : "hidden"}`} id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0">
            <li>
              <Link 
                to="/" 
                className={`block py-2 px-3 rounded md:p-0 ${isActive('/') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/auctions" 
                className={`block py-2 px-3 rounded md:p-0 ${isActive('/auctions') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Auctions
              </Link>
            </li>
            <li>
              <Link 
                to="/properties" 
                className={`block py-2 px-3 rounded md:p-0 ${isActive('/properties') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Properties
              </Link>
            </li>
            <li>
              <Link 
                to="/reports" 
                className={`block py-2 px-3 rounded md:p-0 ${isActive('/reports') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Reports
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard" 
                className={`block py-2 px-3 rounded md:p-0 ${isActive('/dashboard') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Dashboard
              </Link>
            </li>
            <li className="md:hidden">
              <Link 
                to="/login" 
                className="block py-2 px-3 text-red-500 hover:text-red-400"
              >
                Sign In
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header; 