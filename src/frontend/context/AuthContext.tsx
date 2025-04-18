import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the shape of the user object (can be expanded later)
interface User {
  id: string;
  email: string;
  name: string; // Keep for now, maybe combine first/last
  firstName?: string; // Add optional firstName
  lastName?: string; // Add optional lastName
  role?: 'user' | 'admin';
  // Add other user properties like roles if needed
}

// Define the shape of the context value
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  selectedCounty: string | null; // Add selected county
  login: (email: string, password: string, county?: string | null) => Promise<void>; // Update login signature
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data
const MOCK_USER: User = {
  id: 'user123',
  email: 'test@example.com',
  name: 'Test User',
  firstName: 'Test',
  lastName: 'User',
  role: 'user',
};

const MOCK_ADMIN_USER: User = {
  id: 'admin999',
  email: 'admin@example.com',
  name: 'Admin User',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
};

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null); // Add state for county
  const navigate = useNavigate();

  // Updated login function to accept county
  const login = async (email: string, password: string, county?: string | null): Promise<void> => {
    console.log('Attempting mock login with:', email, 'for county:', county);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check for Admin User
    if (email === MOCK_ADMIN_USER.email && password === 'adminpassword') { 
      console.log('Mock admin login successful');
      setUser(MOCK_ADMIN_USER);
      setSelectedCounty(county || null); // Store selected county (or null)
      navigate('/admin/dashboard'); 
    } 
    // Check for Regular User
    else if (email === MOCK_USER.email && password === 'password') {
      console.log('Mock user login successful');
      setUser(MOCK_USER);
      setSelectedCounty(county || null); // Store selected county (or null)
      // Navigate to user dashboard (layout will read county from context)
      navigate('/dashboard'); 
    } 
    // Handle login failure
    else {
      console.log('Mock login failed for:', email);
      throw new Error('Invalid credentials'); 
    }
  };

  // Updated logout function
  const logout = () => {
    console.log('Logging out');
    setUser(null);
    setSelectedCounty(null); // Clear selected county on logout
    navigate('/login');
  };

  // Determine authentication status
  const isAuthenticated = !!user;

  // Update memoized context value
  const contextValue = useMemo(() => ({
    isAuthenticated,
    user,
    selectedCounty, // Include county in context value
    login,
    logout,
  }), [isAuthenticated, user, selectedCounty]); // Add county dependency

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