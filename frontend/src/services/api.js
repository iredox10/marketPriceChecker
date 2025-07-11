
import axios from 'axios';

// Define the base URL for your backend API.
const API_URL = 'http://localhost:5000/api';

/**
 * Create an Axios instance with predefined configuration.
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
 * This interceptor will automatically add the authorization token to every request.
 */
api.interceptors.request.use((config) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
  } catch (error) {
    console.error("Could not parse user info from localStorage", error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// --- API Service Functions ---

// == AUTH SERVICES ==
const login = (email, password) => api.post('/auth/login', { email, password });
const register = (userData) => api.post('/auth/register', userData);
const forgotPassword = (emailData) => api.post('/auth/forgot-password', emailData); // Added this function

// == PRODUCT SERVICES ==
const getProducts = (params) => api.get('/products', { params });
const createProduct = (productData) => api.post('/products', productData);
const addProductPrice = (productId, priceData) => api.post(`/products/${productId}/prices`, priceData);

// == MARKET SERVICES ==
const getMarkets = () => api.get('/markets');
const createMarket = (marketData) => api.post('/markets', marketData);
const getMarketById = (id) => api.get(`/markets/${id}`); // Added this function

// == USER/ADMIN SERVICES ==
const getUsers = () => api.get('/users');
const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
const deleteUser = (id) => api.delete(`/users/${id}`);
// New function to get the logged-in user's profile - let's assume the backend provides a '/profile' route
const getMyProfile = () => api.get('/auth/profile'); // Corrected to a more likely endpoint

const uploadShopOwners = (formData) => {
  return api.post('/users/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

const uploadProducts = (formData) => {
  return api.post('/products/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};


// == REPORT SERVICES ==
const getMyReports = () => api.get('/reports/myreports');
const createPriceReport = (reportData) => api.post('/reports', reportData);
const getPublicReports = (params) => api.get('/reports/public', { params });
// New functions for admin to manage reports
const getPendingReports = () => api.get('/reports/pending');
const approveReport = (id) => api.put(`/reports/${id}/approve`);
const rejectReport = (id) => api.delete(`/reports/${id}`);

const getShopDetails = (id) => api.get(`/users/shop/${id}`);

// --- Export all functions ---
export {
  login,
  register,
  forgotPassword,
  getProducts,
  createProduct,
  addProductPrice,
  getMarkets,
  createMarket,
  getUsers,
  updateUser,
  deleteUser,
  getMyProfile,
  uploadShopOwners,
  uploadProducts,
  getMyReports,
  createPriceReport,
  getPublicReports,
  getMarketById,
  getPendingReports,
  approveReport,
  rejectReport,
  getShopDetails
};


export default api;
