import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Label, TextInput, Tabs } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

// CRITICAL PATH COMPONENT
// This login page is the main entry point for all user types.
// DO NOT modify the core authentication flow or tab structure.
// The default credentials must remain accessible for demo purposes.

interface LoginError {
  message: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('bidder01@visualgov.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [userType, setUserType] = useState('bidder'); // 'bidder', 'admin', or 'county'
  const [defaultEmailHelp, setDefaultEmailHelp] = useState(
    'Default: bidder01@visualgov.com / password123'
  );
  const [activeTab, setActiveTab] = useState(0);

  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    if (location.state && location.state.county) {
      setSelectedCounty(location.state.county);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);

      // Redirect based on user type after successful login
      // This will be handled by the AuthContext component
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // This function updates the user credentials based on the active tab
  const handleUserTypeChange = (type: string) => {
    setUserType(type);

    // Set default credentials based on user type
    if (type === 'bidder') {
      setEmail('bidder01@visualgov.com');
      setPassword('password123');
      setDefaultEmailHelp('Default: bidder01@visualgov.com / password123');
    } else if (type === 'admin') {
      setEmail('admin@visualgov.com');
      setPassword('password123');
      setDefaultEmailHelp('Default: admin@visualgov.com / password123');
    } else if (type === 'county') {
      setEmail('county_palmbeach@visualgov.com');
      setPassword('password123');
      setDefaultEmailHelp('Format: county_[countyname]@visualgov.com / password123');
    }
  };

  // Handle tab change from the Flowbite Tabs component
  const handleTabChange = (index: number) => {
    setActiveTab(index);

    // Map tab index to user type
    if (index === 0) {
      handleUserTypeChange('bidder');
    } else if (index === 1) {
      handleUserTypeChange('admin');
    } else if (index === 2) {
      handleUserTypeChange('county');
    }
  };

  return (
    <section className="bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-white">
          <Logo className="w-8 h-8 mr-3" />
          VisualGov Solutions {selectedCounty ? `(${selectedCounty})` : ''}
        </Link>
        <div className="w-full bg-gray-800 rounded-lg shadow border border-gray-700 md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
              Sign in {selectedCounty ? `for ${selectedCounty} County` : 'to your account'}
            </h1>

            {error && (
              <div
                className="p-4 mb-4 text-sm text-red-800 bg-red-200 rounded-lg dark:text-red-400 dark:bg-gray-800"
                role="alert"
              >
                <span className="font-medium">Login Error!</span> {error}
              </div>
            )}

            <Tabs.Group style="underline" onActiveTabChange={handleTabChange}>
              <Tabs.Item active={activeTab === 0} title="Bidder">
                <p className="text-sm text-gray-300 mb-4">
                  Sign in as a bidder to participate in auctions and manage your certificates
                </p>
              </Tabs.Item>
              <Tabs.Item active={activeTab === 1} title="Admin">
                <p className="text-sm text-gray-300 mb-4">
                  Sign in as an admin to manage the platform
                </p>
              </Tabs.Item>
              <Tabs.Item active={activeTab === 2} title="County Admin">
                <p className="text-sm text-gray-300 mb-4">
                  Sign in as a county administrator to manage county-specific features
                </p>
              </Tabs.Item>
            </Tabs.Group>

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email" className="block mb-2 text-sm font-medium text-white">
                  Your email
                </Label>
                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                />
                <p className="mt-1 text-xs text-gray-400">{defaultEmailHelp}</p>
                {userType === 'county' && (
                  <div className="mt-2 p-2 bg-gray-700 rounded text-xs text-gray-300">
                    <strong>Available counties:</strong> palmbeach, broward, miami, orange,
                    hillsborough
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
                  Password
                </Label>
                <TextInput
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <Checkbox
                      id="remember"
                      name="remember"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <Label htmlFor="remember" className="text-gray-300">
                      Remember me
                    </Label>
                  </div>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-red-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                color="red"
                disabled={isLoading}
                isProcessing={isLoading}
                className="w-full hover:bg-white hover:text-red-700 focus:ring-red-300 dark:focus:ring-red-800"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
              <p className="text-sm font-light text-gray-400">
                Don&apos;t have an account yet?{' '}
                <Link to="/register" className="font-medium text-red-500 hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
