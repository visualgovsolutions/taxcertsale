"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// import React from 'react'; // No longer needed for JSX
const react_router_dom_1 = require("react-router-dom");
const Header_1 = __importDefault(require("./Header"));
const Footer_1 = __importDefault(require("./Footer"));
function Layout() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col min-h-screen bg-gray-50", children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsx)("main", { className: "flex-grow", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Outlet, {}) }), (0, jsx_runtime_1.jsx)(Footer_1.default, {})] }));
}
exports.default = Layout;
//# sourceMappingURL=Layout.js.map