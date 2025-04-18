"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
// Create the context with a default value
const AuthContext = (0, react_1.createContext)(undefined);
// Mock user data
const MOCK_USER = {
    id: 'user123',
    email: 'test@example.com',
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
};
const MOCK_ADMIN_USER = {
    id: 'admin999',
    email: 'admin@example.com',
    name: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
};
// Create the AuthProvider component
const AuthProvider = ({ children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [selectedCounty, setSelectedCounty] = (0, react_1.useState)(null); // Add state for county
    const navigate = (0, react_router_dom_1.useNavigate)();
    // Updated login function to accept county
    const login = async (email, password, county) => {
        console.log('Attempting mock login with:', email, 'for county:', county);
        await new Promise(resolve => setTimeout(resolve, 500));
        // Check for Admin User
        if (email === MOCK_ADMIN_USER.email && password === 'adminpassword') {
            console.log('Mock admin login successful');
            setUser(MOCK_ADMIN_USER);
            setSelectedCounty(county || null); // Store selected county (or null)
            navigate('/admin/dashboard');
        }
        // Check for Regular User
        else if (email === MOCK_USER.email && password === 'password') {
            console.log('Mock user login successful');
            setUser(MOCK_USER);
            setSelectedCounty(county || null); // Store selected county (or null)
            // Navigate to user dashboard (layout will read county from context)
            navigate('/dashboard');
        }
        // Handle login failure
        else {
            console.log('Mock login failed for:', email);
            throw new Error('Invalid credentials');
        }
    };
    // Updated logout function
    const logout = () => {
        console.log('Logging out');
        setUser(null);
        setSelectedCounty(null); // Clear selected county on logout
        navigate('/login');
    };
    // Determine authentication status
    const isAuthenticated = !!user;
    // Update memoized context value
    const contextValue = (0, react_1.useMemo)(() => ({
        isAuthenticated,
        user,
        selectedCounty, // Include county in context value
        login,
        logout,
    }), [isAuthenticated, user, selectedCounty]); // Add county dependency
    return ((0, jsx_runtime_1.jsx)(AuthContext.Provider, { value: contextValue, children: children }));
};
exports.AuthProvider = AuthProvider;
// Custom hook to use the AuthContext
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
//# sourceMappingURL=AuthContext.js.map