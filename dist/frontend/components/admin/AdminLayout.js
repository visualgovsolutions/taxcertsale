"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../../context/AuthContext"); // Use correct path
// This layout is specifically for the Admin section, with a Light Theme + Red Accents
function AdminLayout() {
    const location = (0, react_router_dom_1.useLocation)();
    const { user, logout } = (0, AuthContext_1.useAuth)(); // Removed selectedCounty as it's not needed for admin layout styling
    // Check if the current path matches the link (adjust for admin base path)
    const isActive = (path) => {
        // Check if the path starts with the admin base path
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };
    const handleLogout = () => {
        logout();
    };
    // Theme classes for Light mode with Red accents
    const sidebarBg = 'bg-white';
    const mainBg = 'bg-gray-100';
    const headerBg = 'bg-white';
    const borderColor = 'border-gray-200';
    const titleColor = 'text-gray-800';
    const textColor = 'text-gray-600';
    const linkHoverBg = 'hover:bg-gray-100';
    const linkActiveBg = 'bg-red-100'; // Light red for active background
    const linkActiveText = 'text-red-700'; // Dark red text for active
    const iconColor = 'text-gray-500'; // Default icon color
    const buttonTextColor = 'text-gray-700';
    const buttonHoverBg = 'hover:bg-gray-50';
    return ((0, jsx_runtime_1.jsxs)("div", { className: `flex h-screen ${mainBg}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: `w-64 ${sidebarBg} shadow-md border-r ${borderColor}`, children: [(0, jsx_runtime_1.jsx)("div", { className: `p-4 border-b ${borderColor}`, children: (0, jsx_runtime_1.jsx)("h2", { className: `text-xl font-semibold ${titleColor}`, children: "Admin Panel" }) }), (0, jsx_runtime_1.jsxs)("nav", { className: "mt-4 px-2", children: [" ", (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsxs)("li", { className: "mb-1", children: [" ", (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/admin/dashboard", className: `flex items-center px-3 py-2 rounded-md ${isActive('/admin/dashboard') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`, children: [(0, jsx_runtime_1.jsx)("span", { className: `material-icons mr-3 text-lg ${isActive('/admin/dashboard') ? linkActiveText : iconColor}`, children: "admin_panel_settings" }), "Admin Home"] })] }), (0, jsx_runtime_1.jsx)("li", { className: "mb-1", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/admin/users", className: `flex items-center px-3 py-2 rounded-md ${isActive('/admin/users') ? `${linkActiveBg} ${linkActiveText}` : `${textColor} ${linkHoverBg}`}`, children: [(0, jsx_runtime_1.jsx)("span", { className: `material-icons mr-3 text-lg ${isActive('/admin/users') ? linkActiveText : iconColor}`, children: "manage_accounts" }), "Manage Users"] }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-0 w-64 p-2 border-t border-gray-200", children: (0, jsx_runtime_1.jsxs)("button", { onClick: handleLogout, className: `w-full flex items-center justify-center px-3 py-2 rounded-md ${buttonTextColor} ${buttonHoverBg} border border-gray-300`, children: [(0, jsx_runtime_1.jsx)("span", { className: `material-icons mr-2 text-lg ${iconColor}`, children: "logout" }), "Logout"] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 overflow-auto", children: [(0, jsx_runtime_1.jsx)("header", { className: `${headerBg} shadow-sm border-b ${borderColor}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "px-4 py-3 flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: `text-xl font-semibold ${titleColor}`, children: "Admin Dashboard" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("button", { className: `p-1 rounded-full ${textColor} ${buttonHoverBg}`, children: (0, jsx_runtime_1.jsx)("span", { className: `material-icons ${iconColor}`, children: "notifications" }) }), (0, jsx_runtime_1.jsx)("button", { className: `p-1 rounded-full ${textColor} ${buttonHoverBg} ml-2`, children: (0, jsx_runtime_1.jsx)("span", { className: `material-icons ${iconColor}`, children: "account_circle" }) }), (0, jsx_runtime_1.jsx)("div", { className: "ml-2", children: (0, jsx_runtime_1.jsx)("span", { className: `text-sm ${textColor}`, children: user?.name || 'Admin' }) })] })] }) }), (0, jsx_runtime_1.jsx)("main", { className: "p-6", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Outlet, {}) })] })] }));
}
exports.default = AdminLayout;
//# sourceMappingURL=AdminLayout.js.map