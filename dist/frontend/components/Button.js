"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'md', className = '', disabled = false, fullWidth = false, }) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };
    const variantClasses = {
        primary: 'bg-red-700 text-white hover:bg-red-800 focus:ring-red-600',
        secondary: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700',
        outline: 'border border-red-700 text-red-700 hover:bg-red-50 focus:ring-red-600',
        text: 'text-red-700 hover:text-red-800 hover:bg-gray-100 focus:ring-red-600',
    };
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    const widthClasses = fullWidth ? 'w-full' : '';
    return ((0, jsx_runtime_1.jsx)("button", { type: type, onClick: onClick, disabled: disabled, className: `
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabledClasses}
        ${widthClasses}
        ${className}
      `, children: children }));
};
exports.default = Button;
//# sourceMappingURL=Button.js.map