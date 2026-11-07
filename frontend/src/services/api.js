import axios from 'axios';

/**
 * API SERVICE – RENDER + VERCEL SAFE
 * - On deployed domains (Vercel): uses /api reverse proxy
 * - On local development: uses local backend or falls back to live Render backend
 */

export function getApiBaseUrl() {
  // If running in browser on remote deployed host (e.g. Vercel), use same-origin /api rewrite
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }

  const envUrl = (process.env.REACT_APP_BACKEND_URL || '').trim();
  if (envUrl && envUrl.startsWith('http')) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }

  // On localhost when no local backend is specified, connect directly to live Render backend
  return 'https://metechq.onrender.com/api';
}

const BACKEND_URL = getApiBaseUrl();

// Increased timeout for cold starts on Render
const API_TIMEOUT = process.env.NODE_ENV === 'development' ? 20000 : 60000;

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
const RETRY_DELAY = 2000;

// Helper function to delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Attach token intelligently based on request context
api.interceptors.request.use(
  (config) => {
    // Ensure deployed hosts always use /api proxy
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      config.baseURL = '/api';
    }
    const isClientTarget = config.url?.startsWith('/client') || config.url?.includes('/client/');
    const adminToken = localStorage.getItem('admin_token') || localStorage.getItem('adminToken') || localStorage.getItem('token');
    const clientToken = localStorage.getItem('client_token');

    if (isClientTarget) {
      if (clientToken) config.headers.Authorization = `Bearer ${clientToken}`;
    } else if (adminToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${adminToken}`;
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
      if (config && config.method === 'get') {
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

    if (error.response?.status === 401 && config?.headers?.Authorization && !config.url?.includes('/auth/login')) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      if (currentPath.startsWith('/client') && (config.url?.startsWith('/client') || config.url?.includes('/client/'))) {
        localStorage.removeItem('client_token');
        localStorage.removeItem('client_data');
        if (typeof window !== 'undefined') window.location.href = '/client/login';
      } else if (currentPath.startsWith('/admin')) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        if (typeof window !== 'undefined') window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
