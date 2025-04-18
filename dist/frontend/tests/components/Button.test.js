"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// import React from 'react';
const react_1 = require("@testing-library/react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
const Button_1 = __importDefault(require("../../components/Button"));
describe('Button Component', () => {
    test('renders with default props', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.default, { children: "Click Me" }));
        const button = react_1.screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-red-600'); // Primary variant
    });
    test('renders different variants', () => {
        const { rerender } = (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", children: "Primary" }));
        let button = react_1.screen.getByRole('button', { name: /primary/i });
        expect(button).toHaveClass('bg-red-600');
        rerender((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", children: "Secondary" }));
        button = react_1.screen.getByRole('button', { name: /secondary/i });
        expect(button).toHaveClass('bg-gray-800');
        rerender((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", children: "Outline" }));
        button = react_1.screen.getByRole('button', { name: /outline/i });
        expect(button).toHaveClass('border-red-600');
        expect(button).toHaveClass('text-red-600');
    });
    test('applies size classes correctly', () => {
        const { rerender } = (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.default, { size: "sm", children: "Small" }));
        let button = react_1.screen.getByRole('button', { name: /small/i });
        expect(button).toHaveClass('px-3 py-1.5 text-sm');
        rerender((0, jsx_runtime_1.jsx)(Button_1.default, { size: "md", children: "Medium" }));
        button = react_1.screen.getByRole('button', { name: /medium/i });
        expect(button).toHaveClass('px-4 py-2 text-base');
        rerender((0, jsx_runtime_1.jsx)(Button_1.default, { size: "lg", children: "Large" }));
        button = react_1.screen.getByRole('button', { name: /large/i });
        expect(button).toHaveClass('px-6 py-3 text-lg');
    });
    test('applies full width class when fullWidth is true', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.default, { fullWidth: true, children: "Full Width" }));
        const button = react_1.screen.getByRole('button', { name: /full width/i });
        expect(button).toHaveClass('w-full');
    });
    test('applies disabled state correctly', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.default, { disabled: true, children: "Disabled" }));
        const button = react_1.screen.getByRole('button', { name: /disabled/i });
        expect(button).toBeDisabled();
        expect(button).toHaveClass('opacity-50');
        expect(button).toHaveClass('cursor-not-allowed');
    });
    test('applies custom class names', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.default, { className: "custom-class", children: "Custom Class" }));
        const button = react_1.screen.getByRole('button', { name: /custom class/i });
        expect(button).toHaveClass('custom-class');
    });
    test('calls onClick handler when clicked', async () => {
        const handleClick = jest.fn();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.default, { onClick: handleClick, children: "Click Handler" }));
        const button = react_1.screen.getByRole('button', { name: /click handler/i });
        await user_event_1.default.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=Button.test.js.map