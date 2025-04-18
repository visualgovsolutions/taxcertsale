"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// import React from 'react';
const react_1 = require("@testing-library/react");
const Card_1 = __importDefault(require("../../components/Card"));
describe('Card Component', () => {
    test('renders children content', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("p", { children: "Test content" }) }));
        expect(react_1.screen.getByText('Test content')).toBeInTheDocument();
    });
    test('renders with title when provided', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { title: "Card Title", children: (0, jsx_runtime_1.jsx)("p", { children: "Card content" }) }));
        expect(react_1.screen.getByText('Card Title')).toBeInTheDocument();
        expect(react_1.screen.getByText('Card content')).toBeInTheDocument();
    });
    test('renders footer when provided', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { title: "Card With Footer", footer: (0, jsx_runtime_1.jsx)("button", { children: "Action Button" }), children: (0, jsx_runtime_1.jsx)("p", { children: "Card content" }) }));
        expect(react_1.screen.getByText('Card With Footer')).toBeInTheDocument();
        expect(react_1.screen.getByText('Card content')).toBeInTheDocument();
        expect(react_1.screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
    });
    test('applies elevation classes correctly', () => {
        const { rerender } = (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { elevation: "none", "data-testid": "card", children: (0, jsx_runtime_1.jsx)("p", { children: "No elevation" }) }));
        let card = react_1.screen.getByTestId('card');
        expect(card).not.toHaveClass('shadow');
        expect(card).not.toHaveClass('shadow-sm');
        expect(card).not.toHaveClass('shadow-lg');
        rerender((0, jsx_runtime_1.jsx)(Card_1.default, { elevation: "sm", "data-testid": "card", children: (0, jsx_runtime_1.jsx)("p", { children: "Small elevation" }) }));
        card = react_1.screen.getByTestId('card');
        expect(card).toHaveClass('shadow-sm');
        rerender((0, jsx_runtime_1.jsx)(Card_1.default, { elevation: "md", "data-testid": "card", children: (0, jsx_runtime_1.jsx)("p", { children: "Medium elevation" }) }));
        card = react_1.screen.getByTestId('card');
        expect(card).toHaveClass('shadow');
        rerender((0, jsx_runtime_1.jsx)(Card_1.default, { elevation: "lg", "data-testid": "card", children: (0, jsx_runtime_1.jsx)("p", { children: "Large elevation" }) }));
        card = react_1.screen.getByTestId('card');
        expect(card).toHaveClass('shadow-lg');
    });
    test('applies border when bordered is true', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { bordered: true, "data-testid": "card", children: (0, jsx_runtime_1.jsx)("p", { children: "Bordered card" }) }));
        const card = react_1.screen.getByTestId('card');
        expect(card).toHaveClass('border');
        expect(card).toHaveClass('border-gray-200');
    });
    test('applies hover effect when hoverEffect is true', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { hoverEffect: true, "data-testid": "card", children: (0, jsx_runtime_1.jsx)("p", { children: "Card with hover effect" }) }));
        const card = react_1.screen.getByTestId('card');
        expect(card).toHaveClass('transition-all');
        expect(card).toHaveClass('duration-300');
        expect(card).toHaveClass('hover:shadow-lg');
    });
    test('applies custom class names', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { className: "custom-class", "data-testid": "card", children: (0, jsx_runtime_1.jsx)("p", { children: "Custom card" }) }));
        const card = react_1.screen.getByTestId('card');
        expect(card).toHaveClass('custom-class');
    });
    test('applies custom header class names', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { title: "Custom Header", headerClassName: "header-custom-class", "data-testid": "card", children: (0, jsx_runtime_1.jsx)("p", { children: "Content" }) }));
        const header = react_1.screen.getByText('Custom Header').parentElement;
        expect(header).toHaveClass('header-custom-class');
    });
    test('applies custom body class names', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { bodyClassName: "body-custom-class", "data-testid": "card", children: (0, jsx_runtime_1.jsx)("p", { children: "Content" }) }));
        const body = react_1.screen.getByText('Content').parentElement;
        expect(body).toHaveClass('body-custom-class');
    });
    test('applies custom footer class names', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Card_1.default, { footer: (0, jsx_runtime_1.jsx)("p", { children: "Footer content" }), footerClassName: "footer-custom-class", "data-testid": "card", children: (0, jsx_runtime_1.jsx)("p", { children: "Content" }) }));
        const footer = react_1.screen.getByText('Footer content').parentElement;
        expect(footer).toHaveClass('footer-custom-class');
    });
});
//# sourceMappingURL=Card.test.js.map