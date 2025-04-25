import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client'; // Import Apollo hooks

// Define the shape of the user object (matching backend User type, excluding password)
interface User {
  id: string;
  email: string;
  username: string; // Add username
  name?: string; // Keep original name field if still used?
  firstName?: string;
  lastName?: string;
  role?: 'ADMIN' | 'COUNTY_OFFICIAL' | 'INVESTOR' | 'USER'; // Match schema roles
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
        # Include firstName/lastName if needed
      }
    }
  }
`;

// Define the shape of the context value
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  selectedCounty: string | null;
  login: (email: string, password: string, county?: string | null) => Promise<void>;
  logout: () => void;
  loading: boolean; // Add loading state
  error: string | null; // Add error state
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
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if the token is still valid (not expired)
  const isTokenValid = (token: string): boolean => {
    try {
      // JWT tokens are in three parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Get the payload (middle part) and decode it
      const payload = JSON.parse(atob(parts[1]));
      
      // Check if it has an exp (expiration) claim
      if (!payload.exp) return false;
      
      // Compare with current time (exp is in seconds, Date.now() is in milliseconds)
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      console.error('Error validating token:', e);
      return false;
    }
  };

  useEffect(() => {
    // Try to retrieve the token from localStorage when the component mounts
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('user');
    
    if (token && userJson) {
      // Check if token is still valid before restoring the session
      if (isTokenValid(token)) {
        try {
          const userData = JSON.parse(userJson);
          setUser(userData);
          setError(null);
          setSelectedCounty(null);
          localStorage.setItem('accessToken', token);
        } catch (e) {
          // If there's an error parsing the user data, log out
          console.error('Error parsing user data, logging out:', e);
          localStorage.removeItem('accessToken');
          setUser(null);
          setError('Error parsing user data, logging out');
          setSelectedCounty(null);
        }
      } else {
        // Token expired, log out
        console.log('Stored token expired, logging out');
        localStorage.removeItem('accessToken');
        setUser(null);
        setError('Stored token expired, logging out');
        setSelectedCounty(null);
      }
    } else {
      setError('No stored token or user data found');
    }
  }, []);

  // Use the LOGIN_MUTATION
  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onError: apolloError => {
      console.error('Login Mutation Error:', apolloError);
      setError(apolloError.message || 'Login failed. Please try again.');
    },
    onCompleted: data => {
      if (data?.login?.accessToken && data?.login?.user) {
        console.log('Login successful:', data.login.user.email);
        localStorage.setItem('accessToken', data.login.accessToken);
        // Map the returned user data to the frontend User interface
        const loggedInUser: User = {
          id: data.login.user.id,
          email: data.login.user.email,
          username: data.login.user.username,
          role: data.login.user.role,
          // Add name/firstName/lastName mapping if necessary
        };
        setUser(loggedInUser);
        setError(null); // Clear previous errors

        // Navigate based on role
        if (loggedInUser.role === 'ADMIN' || loggedInUser.role === 'COUNTY_OFFICIAL') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Login failed: Invalid response from server.');
      }
    },
  });

  // Actual login function using the mutation
  const login = async (email: string, password: string, county?: string | null): Promise<void> => {
    console.log(`Attempting real login with: ${email}`);
    setError(null); // Clear previous errors
    setSelectedCounty(county || null); // Set county preference early
    try {
      await loginMutation({ variables: { email, password } });
      // Navigation is handled in onCompleted
    } catch (err) {
      // Error handling is done in onError, but catch block prevents unhandled promise rejection
      console.log('Caught mutation error, but handled by onError.');
    }
  };

  // Logout function clears token and state
  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('accessToken');
    setUser(null);
    setSelectedCounty(null);
    setError(null);
    navigate('/login');
  };

  // Check token expiration periodically
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('accessToken');
      if (token && isTokenExpired(token)) {
        console.log('Token expired, logging out user');
        logout();
      }
    };

    // Check token expiration every minute
    const intervalId = setInterval(checkTokenExpiration, 60000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Update memoized context value
  const contextValue = useMemo(
    () => ({
      isAuthenticated: !!user,
      user,
      selectedCounty,
      login,
      logout,
      loading, // Expose loading state
      error, // Expose error state
    }),
    [user, selectedCounty, loading, error]
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
