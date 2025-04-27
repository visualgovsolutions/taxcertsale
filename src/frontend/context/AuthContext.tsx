import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, gql, useApolloClient } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';

// Define the shape of the user object (matching backend User type, excluding password)
interface User {
  id: string;
  email: string;
  username: string; // Add username
  name?: string; // Keep original name field if still used?
  role?: 'ADMIN' | 'COUNTY_OFFICIAL' | 'INVESTOR' | 'USER'; // Match schema roles
  status?: string;
}

interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  role: string;
  exp: number;
}

// GraphQL Login Mutation Definition
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        id
        email
        username
        role
        status
      }
    }
  }
`;

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  selectedCounty: string | null;
  checkAuthState: () => Promise<boolean>;
}

// Function to check if a token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    // Split token and get payload
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Check expiration time
    const now = Date.now() / 1000;
    return payload.exp < now;
  } catch (err) {
    console.error('Error checking token expiration:', err);
    return true; // Assume expired if there's an error
  }
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider
interface AuthProviderProps {
  children: React.ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const client = useApolloClient();

  // Login mutation
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  // Function to check if a token is valid
  const isTokenValid = useCallback((token: string) => {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }, []);

  // Function to check authentication state - can be called manually
  const checkAuthState = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      
      if (token && isTokenValid(token)) {
        // Token exists and is valid
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          return true;
        }
      } else if (token) {
        // Token exists but is invalid, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      }
      return false;
    } catch (error) {
      console.error('Failed to check auth state:', error);
      return false;
    }
  }, [isTokenValid]);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        await checkAuthState();
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [checkAuthState]);

  // Also check auth on location changes (route navigation)
  useEffect(() => {
    if (!loading) {
      checkAuthState();
    }
  }, [location.pathname, checkAuthState, loading]);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await loginMutation({ variables: { email, password } });
      const { accessToken, user } = data.login;
      
      // Save token in localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      
      // Redirect based on user role
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'COUNTY_OFFICIAL') {
        navigate('/county/dashboard');
      } else {
        // For bidders, check if there's a redirect path
        const from = location.state?.from?.pathname || '/bidder/auctions';
        navigate(from);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error : new Error('Failed to login'));
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    // Reset Apollo store
    client.resetStore();
    navigate('/login');
  }, [client, navigate]);

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
      isAuthenticated,
      selectedCounty,
      checkAuthState
    }),
    [user, loading, error, login, logout, isAuthenticated, selectedCounty, checkAuthState]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Add this to inject the token into all GraphQL requests
export const authLink = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};
