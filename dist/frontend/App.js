"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const Layout_1 = __importDefault(require("./components/Layout"));
const DashboardLayout_1 = __importDefault(require("./components/dashboard/DashboardLayout"));
const AdminLayout_1 = __importDefault(require("./components/admin/AdminLayout"));
const LoginPage_1 = __importDefault(require("./pages/LoginPage"));
const NotFound_1 = __importDefault(require("./pages/NotFound"));
const DashboardPage_1 = __importDefault(require("./pages/DashboardPage"));
const AuctionsPage_1 = __importDefault(require("./pages/AuctionsPage"));
const AuctionDetailPage_1 = __importDefault(require("./pages/AuctionDetailPage"));
const PropertiesPage_1 = __importDefault(require("./pages/PropertiesPage"));
const Home_1 = __importDefault(require("./pages/Home"));
const About_1 = __importDefault(require("./pages/About"));
const CorporateThemeExample_1 = __importDefault(require("./pages/CorporateThemeExample"));
const AdminDashboardPage_1 = __importDefault(require("./pages/AdminDashboardPage"));
const AdminUsersPage_1 = __importDefault(require("./pages/AdminUsersPage"));
const AuthContext_1 = require("./context/AuthContext");
// Updated Protected route component to use AuthContext
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = (0, AuthContext_1.useAuth)(); // Get auth state from context
    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login", replace: true });
    }
    return children;
};
function App() {
    return ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "login", element: (0, jsx_runtime_1.jsx)(LoginPage_1.default, {}) }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Route, { element: (0, jsx_runtime_1.jsx)(Layout_1.default, {}), children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { index: true, element: (0, jsx_runtime_1.jsx)(Home_1.default, {}) }), " ", (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "about", element: (0, jsx_runtime_1.jsx)(About_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "theme-example", element: (0, jsx_runtime_1.jsx)(CorporateThemeExample_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "auctions", element: (0, jsx_runtime_1.jsx)(AuctionsPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "auctions/:id", element: (0, jsx_runtime_1.jsx)(AuctionDetailPage_1.default, {}) })] }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Route, { path: "dashboard", element: (0, jsx_runtime_1.jsx)(ProtectedRoute, { children: (0, jsx_runtime_1.jsx)(DashboardLayout_1.default, {}) }), children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { index: true, element: (0, jsx_runtime_1.jsx)(DashboardPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "auctions", element: (0, jsx_runtime_1.jsx)(AuctionsPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "auctions/:id", element: (0, jsx_runtime_1.jsx)(AuctionDetailPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "properties", element: (0, jsx_runtime_1.jsx)(PropertiesPage_1.default, {}) })] }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Route, { path: "/admin", element: (0, jsx_runtime_1.jsx)(ProtectedRoute, { children: (0, jsx_runtime_1.jsx)(AdminLayout_1.default, {}) }), children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "dashboard", element: (0, jsx_runtime_1.jsx)(AdminDashboardPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "users", element: (0, jsx_runtime_1.jsx)(AdminUsersPage_1.default, {}) })] }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "*", element: (0, jsx_runtime_1.jsx)(NotFound_1.default, { children: (0, jsx_runtime_1.jsxs)("p", { children: ["Page not found. ", (0, jsx_runtime_1.jsx)("a", { href: "/", children: "Return home" })] }) }) })] }));
}
exports.default = App;
//# sourceMappingURL=App.js.map