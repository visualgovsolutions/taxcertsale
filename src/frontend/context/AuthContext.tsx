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

// Function to parse JWT token and check if it's expired
function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));

    // Check if token has expiration
    if (!payload.exp) return true;

    // exp is in seconds, Date.now() is in milliseconds
    const expirationTime = payload.exp * 1000;
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true; // Assume token is expired if we can't parse it
  }
}

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

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      if (token && !isTokenExpired(token)) {
        try {
          // Decode the token to get the user information
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));

          // Set the user state based on token payload
          setUser({
            id: payload.userId,
            email: payload.email,
            username: payload.email.split('@')[0], // Fallback if no username in token
            role: payload.role,
          });
        } catch (err) {
          console.error('Error decoding token:', err);
          localStorage.removeItem('accessToken');
        }
      } else if (token && isTokenExpired(token)) {
        // Clear the expired token
        console.log('Token expired, logging out');
        localStorage.removeItem('accessToken');
        setUser(null);
      }
    };

    checkAuth();
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
