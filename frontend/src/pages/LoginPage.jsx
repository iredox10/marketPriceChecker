
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { login as loginService } from '../services/api'; // Import the api service

const LoginPage = () => {
  const { login } = useAuth(); // Get the login function from context

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await loginService(email, password);
      login(data); // Call context login function, which handles state and redirect
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Or{' '}<Link to="/register" className="font-medium text-green-600 hover:text-green-500">create a new account</Link></p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">{error}</div>}
          <div className="rounded-md shadow-sm -space-y-px">
            <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-3 border rounded-t-md" placeholder="Email address" />
            <input name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-3 border rounded-b-md" placeholder="Password" />
          </div>
          <div className="flex items-center justify-end"><div className="text-sm"><a href="#" className="font-medium text-green-600 hover:text-green-500">Forgot your password?</a></div></div>
          <div><button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400">{isLoading ? 'Signing in...' : 'Sign in'}</button></div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
