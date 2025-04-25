import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@visualgov.com');
  const [password, setPassword] = useState('AdminPass1!');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  
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
      await login(email, password, selectedCounty);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <section className="bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-white">
          <img 
            className="w-8 h-8 mr-3"
            src="/public/VG.png"
            alt="VisualGov Solutions Logo" 
          />
          VisualGov Solutions {selectedCounty ? `(${selectedCounty})` : ''}
        </Link>
        <div className="w-full bg-gray-800 rounded-lg shadow border border-gray-700 md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
              Sign in {selectedCounty ? `for ${selectedCounty} County` : 'to your account'}
            </h1>
            
            {error && (
              <div className="p-4 mb-4 text-sm text-red-800 bg-red-200 rounded-lg dark:text-red-400 dark:bg-gray-800" role="alert">
                 <span className="font-medium">Login Error!</span> {error}
              </div>
            )}
            
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</Label>
                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</Label>
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
                    <Label htmlFor="remember" className="text-gray-300">Remember me</Label>
                  </div>
                </div>
                <Link to="/forgot-password" className="text-sm font-medium text-red-500 hover:underline">Forgot password?</Link>
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
                Don't have an account yet?{' '}
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