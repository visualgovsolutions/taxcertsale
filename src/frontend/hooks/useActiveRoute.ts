import { useLocation } from 'react-router-dom';

/**
 * Custom hook to determine if a route is active
 * 
 * @param {string} path - The route path to check
 * @param {boolean} exact - Whether to match the path exactly or allow sub-paths
 * @returns {boolean} - Whether the route is active
 */
export const useActiveRoute = (path: string, exact: boolean = false): boolean => {
  const location = useLocation();
  
  if (exact) {
    return location.pathname === path;
  }
  
  return location.pathname === path || 
         (path !== '/' && location.pathname.startsWith(path));
};

export default useActiveRoute; 