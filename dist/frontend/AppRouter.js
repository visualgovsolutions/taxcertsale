"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const FlowbiteApplicationShell_1 = __importDefault(require("./components/FlowbiteApplicationShell"));
// Lazy-loaded pages
const Dashboard = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./pages/DashboardPage'))));
const Auctions = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./pages/AuctionsPage'))));
const Properties = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./pages/PropertiesPage'))));
const Users = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./pages/UsersPage'))));
const Reports = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./pages/ReportsPage'))));
const Settings = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./pages/SettingsPage'))));
const Login = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./pages/LoginPage'))));
// Loading component
const Loading = () => (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center items-center h-screen", children: "Loading..." });
const AppRouter = () => {
    // Simple auth check - replace with your actual auth logic
    const isAuthenticated = localStorage.getItem('token') !== null;
    return ((0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(Loading, {}), children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/login", element: !isAuthenticated ? (0, jsx_runtime_1.jsx)(Login, {}) : (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/" }) }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Route, { element: isAuthenticated ? (0, jsx_runtime_1.jsx)(FlowbiteApplicationShell_1.default, {}) : (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login" }), children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(Dashboard, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/auctions", element: (0, jsx_runtime_1.jsx)(Auctions, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/properties", element: (0, jsx_runtime_1.jsx)(Properties, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/users", element: (0, jsx_runtime_1.jsx)(Users, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/reports", element: (0, jsx_runtime_1.jsx)(Reports, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/settings", element: (0, jsx_runtime_1.jsx)(Settings, {}) })] }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "*", element: (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/" }) })] }) }));
};
exports.default = AppRouter;
//# sourceMappingURL=AppRouter.js.map