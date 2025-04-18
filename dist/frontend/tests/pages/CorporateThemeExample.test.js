"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// import React from 'react';
const react_1 = require("@testing-library/react");
const react_router_dom_1 = require("react-router-dom");
const CorporateThemeExample_1 = __importDefault(require("../../pages/CorporateThemeExample"));
describe('CorporateThemeExample Page', () => {
    beforeEach(() => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(CorporateThemeExample_1.default, {}) }));
    });
    test('renders page title', () => {
        expect(react_1.screen.getByText('Corporate Theme Example')).toBeInTheDocument();
    });
    test('renders buttons section with variants', () => {
        expect(react_1.screen.getByText('Buttons')).toBeInTheDocument();
        expect(react_1.screen.getByText('Primary Variants')).toBeInTheDocument();
        expect(react_1.screen.getByText('Secondary Variants')).toBeInTheDocument();
        expect(react_1.screen.getByText('Outline Variants')).toBeInTheDocument();
    });
    test('renders cards section with examples', () => {
        expect(react_1.screen.getByText('Cards')).toBeInTheDocument();
        expect(react_1.screen.getByText('Basic Card')).toBeInTheDocument();
        expect(react_1.screen.getByText('Card with Footer')).toBeInTheDocument();
        expect(react_1.screen.getByText('Hover Effect Card')).toBeInTheDocument();
        expect(react_1.screen.getByText('Dark Card')).toBeInTheDocument();
    });
    test('renders buttons in different sizes', () => {
        const smallButtons = react_1.screen.getAllByText('Small');
        const defaultButtons = [
            ...react_1.screen.getAllByText('Default'),
        ];
        const largeButtons = react_1.screen.getAllByText('Large');
        expect(smallButtons.length).toBeGreaterThan(0);
        expect(defaultButtons.length).toBeGreaterThan(0);
        expect(largeButtons.length).toBeGreaterThan(0);
    });
    test('renders corporate design system section', () => {
        expect(react_1.screen.getByText('Corporate Design System')).toBeInTheDocument();
        expect(react_1.screen.getByText('Corporate Theme')).toBeInTheDocument();
        expect(react_1.screen.getByText(/this example page demonstrates/i)).toBeInTheDocument();
    });
    test('renders action buttons in the corporate design section', () => {
        expect(react_1.screen.getByText('View Auctions')).toBeInTheDocument();
        expect(react_1.screen.getByText('Properties')).toBeInTheDocument();
        expect(react_1.screen.getByText('Contact')).toBeInTheDocument();
    });
    test('renders a back to home link', () => {
        expect(react_1.screen.getByText('Back to Home')).toBeInTheDocument();
        expect(react_1.screen.getByText('Back to Home').closest('a')).toHaveAttribute('href', '/');
    });
});
//# sourceMappingURL=CorporateThemeExample.test.js.map