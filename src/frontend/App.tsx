import React, { useState, FormEvent } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// --- Protected Route Component ---
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  console.log('ProtectedRoute Check - isAuthenticated:', isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// --- Placeholder Components (Move to separate files later) ---

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      <h1>Welcome to the Tax Certificate Platform</h1>
      <p>Your gateway to Florida tax certificate investments.</p>
      {isAuthenticated ? (
        <Link to="/dashboard">Go to Dashboard</Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
};

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <p>Welcome, {user.name} ({user.email})!</p>
      ) : (
        <p>Loading user data...</p>
      )}
      <p>Investor dashboard content goes here.</p>
      <button onClick={logout}>Logout</button>
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <nav style={{ padding: '1rem', background: '#eee', marginBottom: '1rem' }}>
        <Link to="/">Home</Link>
        {isAuthenticated && (
           <span style={{ marginLeft: '1rem' }}>
             | <Link to="/dashboard">Dashboard</Link>
           </span>
        )}
        <span style={{ float: 'right' }}>
          {isAuthenticated ? (
            <button onClick={() => useAuth().logout()}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </span>
      </nav>

      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route index element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<div><h2>404 Not Found</h2><Link to="/">Go Home</Link></div>} />
        </Routes>
      </main>

      <footer style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #ccc', textAlign: 'center' }}>
        <p>&copy; {new Date().getFullYear()} Tax Certificate Platform</p>
      </footer>
    </div>
  );
};

export default App; 