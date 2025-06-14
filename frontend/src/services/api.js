
import axios from 'axios';

// Define the base URL for your backend API.
// In a production app, this should come from an environment variable.
const API_URL = 'http://localhost:5000/api';

/**
 * Create an Axios instance with predefined configuration.
 * This is useful for setting base URLs, headers, and interceptors.
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
 * Add a request interceptor to include the auth token in headers.
 * This function will check for a user token (e.g., in localStorage)
 * and attach it to the Authorization header for every request.
 *
 * This is commented out for now but is ready for when you implement
 * full user authentication.
*/
/*
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
*/


// --- API Service Functions ---

// == AUTH SERVICES ==
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (userData) => api.post('/auth/register', userData);

// == PRODUCT SERVICES ==
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const addProductPrice = (productId, priceData, token) => {
    // Example of passing token manually if not using interceptors
    const config = { headers: { Authorization: `Bearer ${token}` } };
    return api.post(`/products/${productId}/prices`, priceData, config);
};


// == MARKET SERVICES ==
export const getMarkets = () => api.get('/markets');
export const getMarketById = (id) => api.get(`/markets/${id}`);


export default api;
