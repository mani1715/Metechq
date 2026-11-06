import axios from 'axios';

/**
 * API SERVICE – RENDER + VERCEL SAFE (FIXED)
 * With improved timeout handling and retry logic
 */

// ⚠️ IMPORTANT: MUST include /api
// Force the correct backend URL with /api prefix
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL 
  ? (process.env.REACT_APP_BACKEND_URL.endsWith('/api') 
      ? process.env.REACT_APP_BACKEND_URL 
      : `${process.env.REACT_APP_BACKEND_URL}/api`)
  : 'https://mspn-dev.onrender.com/api';

if (!BACKEND_URL) {
  console.error('❌ Backend URL not defined');
}

console.log('🔗 API Base URL:', BACKEND_URL);

// Increased timeout for cold starts on Render (free tier can take 30-50 seconds to wake up)
const API_TIMEOUT = process.env.NODE_ENV === 'development' ? 15000 : 60000;

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
  withCredentials: true,
});

// Retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 2000; // 2 seconds

// Helper function to delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Attach token intelligently based on request context
api.interceptors.request.use(
  (config) => {
    const isClientTarget = config.url?.startsWith('/client') || config.url?.includes('/client/');
    const adminToken = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');
    const clientToken = localStorage.getItem('client_token');

    if (isClientTarget && clientToken) {
      config.headers.Authorization = `Bearer ${clientToken}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (clientToken) {
      config.headers.Authorization = `Bearer ${clientToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handling with retry logic and scoped session expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Log the error with more details
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('API Error: timeout of', API_TIMEOUT + 'ms exceeded');
      
      // Retry logic for timeout errors on GET requests
      if (config && config.method === 'get' && !config._retry) {
        config._retry = true;
        config._retryCount = config._retryCount || 0;
        
        if (config._retryCount < MAX_RETRIES) {
          config._retryCount++;
          console.log(`Retrying request (${config._retryCount}/${MAX_RETRIES})...`);
          await delay(RETRY_DELAY);
          return api(config);
        } else {
          console.error('❌ Max retries reached. Backend might be sleeping or unavailable.');
        }
      }
    } else {
      console.error('API Error:', error?.response?.data || error.message);
    }

    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/client')) {
        localStorage.removeItem('client_token');
        localStorage.removeItem('client_data');
        window.location.href = '/client/login';
      } else if (currentPath.startsWith('/admin')) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
