// import React from 'react'; // No longer needed for JSX
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout; 