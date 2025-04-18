import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot for React 18+
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider
// Import styles from their correct location
import './styles/index.css'; // Import main styles
import 'flowbite'; // Import Flowbite JS

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element with id 'root'");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
); 