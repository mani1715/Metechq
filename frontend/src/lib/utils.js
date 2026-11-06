import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get the backend URL with proper HTTPS protocol enforcement
 * This ensures all API calls use HTTPS when the page is loaded over HTTPS
 * @returns {string} The backend URL with correct protocol
 */
export function getBackendURL() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || '/api';
  
  // If it's a relative URL, construct full URL with current protocol
  if (backendUrl.startsWith('/')) {
    if (typeof window !== 'undefined') {
      // Use the same protocol as the current page
      const protocol = window.location.protocol; // https: or http:
      const host = window.location.host;
      return `${protocol}//${host}${backendUrl}`;
    }
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
