/**
 * Custom hook to determine if a route is active
 *
 * @param {string} path - The route path to check
 * @param {boolean} exact - Whether to match the path exactly or allow sub-paths
 * @returns {boolean} - Whether the route is active
 */
export declare const useActiveRoute: (path: string, exact?: boolean) => boolean;
export default useActiveRoute;
