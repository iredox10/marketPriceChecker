import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext(null);

/**
 * AuthProvider component that will wrap your entire app.
 * It manages the user's authentication state.
 */
export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // On initial load, check if user info is in localStorage
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // Login function
  const login = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUserInfo(userData);

    // Redirect based on role after login
    if (userData.role === 'Admin') {
      navigate('/admin/dashboard');
    } else if (userData.role === 'ShopOwner') {
      navigate('/shop-owner/dashboard');
    } else {
      navigate('/profile');
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/login');
  };

  // The value that will be available to all consuming components
  const value = {
    userInfo,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the AuthContext
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
