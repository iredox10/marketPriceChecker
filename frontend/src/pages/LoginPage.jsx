
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * LoginPage Component
 * A versatile login page for both Admins and Shop Owners.
 */
const LoginPage = () => {
  // State to toggle between 'Admin' and 'ShopOwner' roles
  const [role, setRole] = useState('ShopOwner'); // Default role
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles the form submission.
   * In a real app, this would make an API call to authenticate the user.
   */
  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    console.log(`Attempting to log in as ${role} with email: ${email}`);

    // --- MOCK API CALL ---
    // Replace this with your actual authentication logic
    setTimeout(() => {
      setIsLoading(false);
      // On successful login, you would typically receive a token and user data.
      // Then, you would navigate the user to their dashboard.
      alert(`Successfully logged in as ${role}! You would be redirected to your dashboard now.`);
      // Example redirection:
      // if (role === 'Admin') navigate('/admin/dashboard');
      // else navigate('/shop-owner/dashboard');
    }, 1500);
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back!
          </p>
        </div>

        {/* Role Switcher */}
        <div className="flex justify-center bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setRole('ShopOwner')}
            className={`w-full py-2 rounded-full text-sm font-medium transition-colors duration-300 ${role === 'ShopOwner' ? 'bg-green-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'
              }`}
          >
            Shop Owner
          </button>
          <button
            onClick={() => setRole('Admin')}
            className={`w-full py-2 rounded-full text-sm font-medium transition-colors duration-300 ${role === 'Admin' ? 'bg-green-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'
              }`}
          >
            Admin
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
