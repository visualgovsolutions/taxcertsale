"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Card = ({ children, title, className = '', headerClassName = '', bodyClassName = '', footer, footerClassName = '', bordered = false, elevation = 'md', hoverEffect = false, 'data-testid': dataTestId, }) => {
    const elevationClasses = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow',
        lg: 'shadow-lg',
    };
    const borderClass = bordered ? 'border border-gray-200' : '';
    const hoverClass = hoverEffect ? 'transition-all duration-300 hover:shadow-lg' : '';
    return ((0, jsx_runtime_1.jsxs)("div", { className: `
        bg-white rounded-lg overflow-hidden
        ${elevationClasses[elevation]}
        ${borderClass}
        ${hoverClass}
        ${className}
      `, "data-testid": dataTestId, children: [title && ((0, jsx_runtime_1.jsx)("div", { className: `px-6 py-4 bg-gray-50 border-b border-gray-200 ${headerClassName}`, children: (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: title }) })), (0, jsx_runtime_1.jsx)("div", { className: `px-6 py-4 ${bodyClassName}`, children: children }), footer && ((0, jsx_runtime_1.jsx)("div", { className: `px-6 py-4 bg-gray-50 border-t border-gray-200 ${footerClassName}`, children: footer }))] }));
};
exports.default = Card;
//# sourceMappingURL=Card.js.map