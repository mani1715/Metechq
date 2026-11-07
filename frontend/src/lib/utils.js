import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get the backend URL with proper protocol enforcement.
 * - On deployed domains: returns /api to leverage same-origin reverse proxy.
 * - On local development: returns local backend or live Render backend.
 * @returns {string} The backend URL
 */
export function getBackendURL() {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }

  const backendUrl = (process.env.REACT_APP_BACKEND_URL || '').trim();
  if (backendUrl && backendUrl.startsWith('http')) {
    return backendUrl;
  }
  
  return 'https://metechq.onrender.com/api';
}
