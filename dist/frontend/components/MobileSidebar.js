"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const flowbite_react_1 = require("flowbite-react");
const react_router_dom_1 = require("react-router-dom");
const useActiveRoute_1 = __importDefault(require("../hooks/useActiveRoute"));
const MobileSidebar = ({ isOpen, onClose }) => {
    const isActive = (path) => (0, useActiveRoute_1.default)(path);
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 z-50 lg:hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50", onClick: onClose }), (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl", children: (0, jsx_runtime_1.jsxs)("div", { className: "h-full overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 flex justify-between items-center border-b", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold", children: "Tax Cert Sale" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Button, { size: "sm", color: "gray", onClick: onClose, children: "\u2715" })] }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Sidebar, { "aria-label": "Mobile navigation menu", children: (0, jsx_runtime_1.jsx)(flowbite_react_1.Sidebar.Items, { children: (0, jsx_runtime_1.jsxs)(flowbite_react_1.Sidebar.ItemGroup, { children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Sidebar.Item, { as: react_router_dom_1.Link, to: "/", active: isActive('/'), onClick: onClose, children: "Dashboard" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Sidebar.Item, { as: react_router_dom_1.Link, to: "/auctions", active: isActive('/auctions'), onClick: onClose, children: "Auctions" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Sidebar.Item, { as: react_router_dom_1.Link, to: "/properties", active: isActive('/properties'), onClick: onClose, children: "Properties" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Sidebar.Item, { as: react_router_dom_1.Link, to: "/users", active: isActive('/users'), onClick: onClose, children: "Users" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Sidebar.Item, { as: react_router_dom_1.Link, to: "/products", active: isActive('/products'), onClick: onClose, children: "Products" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Sidebar.Item, { as: react_router_dom_1.Link, to: "/reports", active: isActive('/reports'), onClick: onClose, children: "Reports" })] }) }) })] }) })] }));
};
exports.default = MobileSidebar;
//# sourceMappingURL=MobileSidebar.js.map