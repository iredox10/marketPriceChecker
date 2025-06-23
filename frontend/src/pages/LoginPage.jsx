
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Import the login function from our API service
import { login, forgotPassword } from '../services/api'; // Add forgotPassword
import { useAuth } from '../context/AuthContext';

// --- ICONS ---
const FiX = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

/**
 * ForgotPasswordModal Component
 */
const ForgotPasswordModal = ({ isOpen, onClose, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onForgotPassword(email);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX className="h-6 w-6" /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h2>
        <p className="text-gray-600 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="sr-only">Email Address</label>
            <input
              type="email"
              id="reset-email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">Send Reset Link</button>
          </div>
        </form>
      </div>
    </div>
  );
};


/**
 * LoginPage Component
 */
const LoginPage = () => {
  const { login: contextLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setNotification('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await login(email, password);
      contextLogin(data); // Use login from context to set user and redirect
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (resetEmail) => {
    setIsLoading(true);
    try {
      const { data } = await forgotPassword({ email: resetEmail });
      setNotification(data.message);
      setIsForgotModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onForgotPassword={handleForgotPassword}
      />
      <div className="bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Or{' '}<Link to="/register" className="font-medium text-green-600 hover:text-green-500">create a new account</Link></p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">{error}</div>}
            {notification && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md text-center">{notification}</div>}
            <div className="rounded-md shadow-sm -space-y-px">
              <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-3 border rounded-t-md" placeholder="Email address" />
              <input name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-3 border rounded-b-md" placeholder="Password" />
            </div>
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <button type="button" onClick={() => setIsForgotModalOpen(true)} className="font-medium text-green-600 hover:text-green-500">
                  Forgot your password?
                </button>
              </div>
            </div>
            <div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400">
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
