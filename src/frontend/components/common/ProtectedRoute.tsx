import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'COUNTY_OFFICIAL' | 'INVESTOR' | 'USER';
}

/**
 * A wrapper component that protects routes by checking authentication state
 * and optionally verifying user roles before rendering children.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, loading, user, checkAuthState } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      setIsChecking(true);
      await checkAuthState();
      setIsChecking(false);
    };

    verifyAuth();
  }, [checkAuthState]);

  // Show loading while checking auth state
  if (loading || isChecking) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role check is required and user doesn't have the required role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on their actual role
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === 'COUNTY_OFFICIAL') {
      return <Navigate to="/county/dashboard" replace />;
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute; 