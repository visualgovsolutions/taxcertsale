import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the shape of the user object (can be expanded later)
interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties like roles if needed
}

// Define the shape of the context value
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>; // Simulate async login
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data (replace with actual API call later)
const MOCK_USER: User = {
  id: 'user123',
  email: 'test@example.com',
  name: 'Test User',
};

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Mock login function
  const login = async (email: string, password: string): Promise<void> => {
    console.log('Attempting mock login with:', email);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Basic mock validation (replace with real auth later)
    if (email === 'test@example.com' && password === 'password') {
      console.log('Mock login successful');
      setUser(MOCK_USER);
      navigate('/dashboard'); // Redirect to dashboard on successful login
    } else {
      console.log('Mock login failed');
      // Handle login failure (e.g., show error message)
      alert('Invalid credentials (use test@example.com / password)');
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logging out');
    setUser(null);
    navigate('/login'); // Redirect to login page on logout
  };

  // Determine authentication status
  const isAuthenticated = !!user;

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    isAuthenticated,
    user,
    login,
    logout,
  }), [isAuthenticated, user]); // Dependencies user and isAuthenticated

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 