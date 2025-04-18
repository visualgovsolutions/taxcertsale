"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const FlowbiteWithRouter_1 = __importDefault(require("../components/FlowbiteWithRouter"));
// Example page components (these would be your actual pages)
const Dashboard = () => (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: "Dashboard Content" });
const Auctions = () => (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: "Auctions Content" });
const Properties = () => (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: "Properties Content" });
const Users = () => (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: "Users Content" });
const Products = () => (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: "Products Content" });
const Reports = () => (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: "Reports Content" });
const AppRoutes = () => {
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Routes, { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(FlowbiteWithRouter_1.default, {}), children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { index: true, element: (0, jsx_runtime_1.jsx)(Dashboard, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "auctions", element: (0, jsx_runtime_1.jsx)(Auctions, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "properties", element: (0, jsx_runtime_1.jsx)(Properties, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "users", element: (0, jsx_runtime_1.jsx)(Users, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "products", element: (0, jsx_runtime_1.jsx)(Products, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "reports", element: (0, jsx_runtime_1.jsx)(Reports, {}) })] }) }) }));
};
exports.default = AppRoutes;
//# sourceMappingURL=AppRoutes.example.js.map