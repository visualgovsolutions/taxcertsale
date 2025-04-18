"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const flowbite_react_1 = require("flowbite-react");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../context/AuthContext");
const LoginPage = () => {
    const [email, setEmail] = (0, react_1.useState)('admin@example.com');
    const [password, setPassword] = (0, react_1.useState)('adminpassword');
    const [rememberMe, setRememberMe] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const [selectedCounty, setSelectedCounty] = (0, react_1.useState)(null);
    const location = (0, react_router_dom_1.useLocation)();
    const { login } = (0, AuthContext_1.useAuth)();
    (0, react_1.useEffect)(() => {
        if (location.state && location.state.county) {
            setSelectedCounty(location.state.county);
        }
    }, [location.state]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(email, password, selectedCounty);
        }
        catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
            console.error('Login error:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsx)("section", { className: "bg-gray-900", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0", children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/", className: "flex items-center mb-6 text-2xl font-semibold text-white", children: [(0, jsx_runtime_1.jsx)("img", { className: "w-8 h-8 mr-3", src: "/public/VG.png", alt: "VisualGov Solutions Logo" }), "VisualGov Solutions ", selectedCounty ? `(${selectedCounty})` : ''] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-800 rounded-lg shadow border border-gray-700 md:mt-0 sm:max-w-md xl:p-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 space-y-4 md:space-y-6 sm:p-8", children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-xl font-bold leading-tight tracking-tight text-white md:text-2xl", children: ["Sign in ", selectedCounty ? `for ${selectedCounty} County` : 'to your account'] }), error && ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 mb-4 text-sm text-red-800 bg-red-200 rounded-lg dark:text-red-400 dark:bg-gray-800", role: "alert", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Login Error!" }), " ", error] })), (0, jsx_runtime_1.jsxs)("form", { className: "space-y-4 md:space-y-6", onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Label, { htmlFor: "email", className: "block mb-2 text-sm font-medium text-white", children: "Your email" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.TextInput, { id: "email", type: "email", name: "email", placeholder: "name@company.com", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Label, { htmlFor: "password", className: "block mb-2 text-sm font-medium text-white", children: "Password" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.TextInput, { id: "password", type: "password", name: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center h-5", children: (0, jsx_runtime_1.jsx)(flowbite_react_1.Checkbox, { id: "remember", name: "remember", checked: rememberMe, onChange: () => setRememberMe(!rememberMe) }) }), (0, jsx_runtime_1.jsx)("div", { className: "ml-3 text-sm", children: (0, jsx_runtime_1.jsx)(flowbite_react_1.Label, { htmlFor: "remember", className: "text-gray-300", children: "Remember me" }) })] }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/forgot-password", className: "text-sm font-medium text-red-500 hover:underline", children: "Forgot password?" })] }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Button, { type: "submit", color: "red", disabled: isLoading, isProcessing: isLoading, className: "w-full hover:bg-white hover:text-red-700 focus:ring-red-300 dark:focus:ring-red-800", children: isLoading ? 'Signing in...' : 'Sign in' }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-light text-gray-400", children: ["Don't have an account yet?", ' ', (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/register", className: "font-medium text-red-500 hover:underline", children: "Sign up" })] })] })] }) })] }) }));
};
exports.default = LoginPage;
//# sourceMappingURL=LoginPage.js.map