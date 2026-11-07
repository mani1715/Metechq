import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get the backend URL with proper HTTPS protocol enforcement
 * On deployed domains, returns /api to leverage same-origin proxy and prevent CSP / mixed-content errors.
 * @returns {string} The backend URL with correct protocol
 */
export function getBackendURL() {
  // If in browser on a remote/production domain, always use relative /api
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }

  const backendUrl = (process.env.REACT_APP_BACKEND_URL || '').trim() || '/api';
  
  if (backendUrl.startsWith('/')) {
    return backendUrl;
  }
  
  // If it's an absolute URL and we're on HTTPS, force HTTPS
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    if (backendUrl.startsWith('http://')) {
      return backendUrl.replace('http://', 'https://');
    }
  }
  
  return backendUrl;
}
