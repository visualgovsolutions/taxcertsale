"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
function NotFound({ children }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-center min-h-screen px-4 text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "mb-4 text-4xl font-bold", children: "404 Not Found" }), children || ((0, jsx_runtime_1.jsx)("a", { href: "/", className: "px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg", children: "Go Home" }))] }));
}
exports.default = NotFound;
//# sourceMappingURL=NotFound.js.map