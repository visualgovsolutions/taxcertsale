import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot for React 18+
import App from './App';
import './styles/index.css'; // Import our CSS
// Import base styles later if needed (e.g., index.css)
// import './index.css'; 

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element with id 'root'");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 