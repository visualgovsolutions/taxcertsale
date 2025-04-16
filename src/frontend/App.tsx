import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import AboutPage from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          {/* Add additional routes as needed */}
          <Route path="*" element={<div className="page not-found-page"><h1>Page Not Found</h1></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App; 