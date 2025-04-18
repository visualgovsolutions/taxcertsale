"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useActiveRoute = void 0;
const react_router_dom_1 = require("react-router-dom");
/**
 * Custom hook to determine if a route is active
 *
 * @param {string} path - The route path to check
 * @param {boolean} exact - Whether to match the path exactly or allow sub-paths
 * @returns {boolean} - Whether the route is active
 */
const useActiveRoute = (path, exact = false) => {
    const location = (0, react_router_dom_1.useLocation)();
    if (exact) {
        return location.pathname === path;
    }
    return location.pathname === path ||
        (path !== '/' && location.pathname.startsWith(path));
};
exports.useActiveRoute = useActiveRoute;
exports.default = exports.useActiveRoute;
//# sourceMappingURL=useActiveRoute.js.map