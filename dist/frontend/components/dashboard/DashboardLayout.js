"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../../context/AuthContext");
// Define county-specific theme colors (Tailwind classes)
const countyThemes = {
    Wakulla: {
        bg: 'bg-blue-800',
        border: 'border-blue-700',
        active: 'bg-blue-900 text-white',
        hover: 'hover:bg-blue-700 hover:text-white',
        text: 'text-gray-100' // Light text for contrast
    },
    Leon: {
        bg: 'bg-green-800',
        border: 'border-green-700',
        active: 'bg-green-900 text-white',
        hover: 'hover:bg-green-700 hover:text-white',
        text: 'text-gray-100' // Light text for contrast
    },
    // Add more counties and themes here
};
function DashboardLayout() {
    const location = (0, react_router_dom_1.useLocation)();
    const { user, logout, selectedCounty } = (0, AuthContext_1.useAuth)();
    // Determine theme based on selected county, default to dark gray
    const theme = selectedCounty && countyThemes[selectedCounty] ?
        countyThemes[selectedCounty] :
        {
            bg: 'bg-gray-800',
            border: 'border-gray-700',
            active: 'bg-gray-700 text-white',
            hover: 'hover:bg-gray-700 hover:text-white',
            text: 'text-gray-300'
        };
    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };
    const handleLogout = () => {
        logout();
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex h-screen bg-gray-900", children: [(0, jsx_runtime_1.jsxs)("div", { className: `w-64 ${theme.bg} shadow-md border-r ${theme.border}`, children: [(0, jsx_runtime_1.jsx)("div", { className: `p-4 border-b ${theme.border}`, children: (0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-white", children: selectedCounty ? `${selectedCounty} County` : (user?.firstName ? `${user.firstName}'s Dashboard` : 'Dashboard') }) }), (0, jsx_runtime_1.jsx)("nav", { className: "mt-4", children: (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { className: "mb-2", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/dashboard", className: `flex items-center px-4 py-2 rounded-md mx-2 ${isActive('/dashboard') ? theme.active : `${theme.text} ${theme.hover}`}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "material-icons mr-3 text-lg", children: "dashboard" }), "Dashboard Home"] }) }), (0, jsx_runtime_1.jsx)("li", { className: "mb-2", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/dashboard/auctions", className: `flex items-center px-4 py-2 rounded-md mx-2 ${isActive('/dashboard/auctions') ? theme.active : `${theme.text} ${theme.hover}`}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "material-icons mr-3 text-lg", children: "gavel" }), "Auctions"] }) }), (0, jsx_runtime_1.jsx)("li", { className: "mb-2", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/dashboard/properties", className: `flex items-center px-4 py-2 rounded-md mx-2 ${isActive('/dashboard/properties') ? theme.active : `${theme.text} ${theme.hover}`}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "material-icons mr-3 text-lg", children: "home" }), "Properties"] }) }), (0, jsx_runtime_1.jsx)("li", { className: "mb-2", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/dashboard/users", className: `flex items-center px-4 py-2 ${isActive('/dashboard/users') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "material-icons mr-3 text-lg", children: "people" }), "Users"] }) }), (0, jsx_runtime_1.jsx)("li", { className: "mb-2", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/dashboard/reports", className: `flex items-center px-4 py-2 ${isActive('/dashboard/reports') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "material-icons mr-3 text-lg", children: "assessment" }), "Reports"] }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-0 w-64 p-4 border-t border-gray-700", children: (0, jsx_runtime_1.jsxs)("button", { onClick: handleLogout, className: `w-full flex items-center justify-center px-4 py-2 rounded-md ${theme.text} ${theme.hover} bg-opacity-20 ${theme.bg} border ${theme.border}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "material-icons mr-2 text-lg", children: "logout" }), "Logout"] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 overflow-auto", children: [(0, jsx_runtime_1.jsx)("header", { className: `${theme.bg} shadow-sm border-b ${theme.border}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "px-4 py-3 flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-xl font-semibold text-white", children: selectedCounty ? `${selectedCounty} County Dashboard` : 'User Dashboard' }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("button", { className: `p-1 rounded-full ${theme.text} ${theme.hover}`, children: (0, jsx_runtime_1.jsx)("span", { className: "material-icons", children: "notifications" }) }), (0, jsx_runtime_1.jsx)("button", { className: `p-1 rounded-full ${theme.text} ${theme.hover} ml-2`, children: (0, jsx_runtime_1.jsx)("span", { className: "material-icons", children: "account_circle" }) }), (0, jsx_runtime_1.jsx)("div", { className: "ml-2", children: (0, jsx_runtime_1.jsx)("span", { className: `text-sm ${theme.text}`, children: user?.name || 'User' }) })] })] }) }), (0, jsx_runtime_1.jsx)("main", { className: "p-6", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Outlet, {}) })] })] }));
}
exports.default = DashboardLayout;
//# sourceMappingURL=DashboardLayout.js.map