"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../context/AuthContext");
const LoginPage_1 = __importDefault(require("../pages/LoginPage"));
const DashboardPage_1 = __importDefault(require("../pages/DashboardPage"));
// Mock the AuthContext
jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        login: jest.fn(),
        logout: jest.fn(),
        user: null,
        isAuthenticated: false,
    }),
    AuthProvider: ({ children }) => (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children }),
}));
describe('Flowbite Styles Integration Test', () => {
    test('LoginPage renders with Flowbite styles', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(AuthContext_1.AuthProvider, { children: (0, jsx_runtime_1.jsx)(LoginPage_1.default, {}) }) }));
        // Check for Flowbite-specific classes
        const emailInput = react_1.screen.getByLabelText(/your email/i).closest('input');
        const passwordInput = react_1.screen.getByLabelText(/password/i).closest('input');
        const signInButton = react_1.screen.getByRole('button', { name: /sign in/i });
        // Log for debugging
        console.log('Email input classes:', emailInput?.className);
        console.log('Password input classes:', passwordInput?.className);
        console.log('Sign in button classes:', signInButton?.className);
        // Check if Flowbite styles are applied
        expect(emailInput).toHaveClass('bg-gray-50');
        expect(passwordInput).toHaveClass('bg-gray-50');
        expect(signInButton).toHaveClass('text-white');
    });
    test('DashboardPage renders with Flowbite components', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(DashboardPage_1.default, {}) }));
        // Check for Flowbite components
        const cards = document.querySelectorAll('[class*="text-gray-900"]');
        const buttons = document.querySelectorAll('button');
        const badges = document.querySelectorAll('[class*="badge"]');
        console.log('Number of cards found:', cards.length);
        console.log('Number of buttons found:', buttons.length);
        console.log('Number of badges found:', badges.length);
        // Verify Flowbite components are present
        expect(cards.length).toBeGreaterThan(0);
        expect(buttons.length).toBeGreaterThan(0);
        expect(document.querySelector('[data-testid="flowbite-card"]')).toBeTruthy();
    });
});
//# sourceMappingURL=flowbite-styles.test.js.map