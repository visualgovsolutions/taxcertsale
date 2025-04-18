import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FlowbiteWithRouter from '../components/FlowbiteWithRouter';

// Example page components (these would be your actual pages)
const Dashboard = () => <div className="p-4">Dashboard Content</div>;
const Auctions = () => <div className="p-4">Auctions Content</div>;
const Properties = () => <div className="p-4">Properties Content</div>;
const Users = () => <div className="p-4">Users Content</div>;
const Products = () => <div className="p-4">Products Content</div>;
const Reports = () => <div className="p-4">Reports Content</div>;

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FlowbiteWithRouter />}>
          {/* Nested routes will appear in the <Outlet /> */}
          <Route index element={<Dashboard />} />
          <Route path="auctions" element={<Auctions />} />
          <Route path="properties" element={<Properties />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes; 