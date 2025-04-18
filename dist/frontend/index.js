"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client")); // Use createRoot for React 18+
const react_router_dom_1 = require("react-router-dom"); // Import BrowserRouter
const App_1 = __importDefault(require("./App"));
const AuthContext_1 = require("./context/AuthContext"); // Import the AuthProvider
// Import styles from their correct location
require("./styles/index.css"); // Import main styles
require("flowbite"); // Import Flowbite JS
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element with id 'root'");
}
const root = client_1.default.createRoot(rootElement);
root.render((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(AuthContext_1.AuthProvider, { children: (0, jsx_runtime_1.jsx)(App_1.default, {}) }) }) }));
//# sourceMappingURL=index.js.map