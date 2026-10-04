import axios from 'axios';

// Base URL configured from environment variable or fallback to Vite proxy path
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Request interceptor: Automatically attach JWT Bearer token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cloudnexus_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Normalize responses and handle HTTP errors predictably
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    let userMessage = 'An unexpected error occurred. Please try again.';

    if (!error.response) {
      // Network error, timeout, or backend not reachable
      userMessage = 'Unable to reach backend server. Please check your network connection.';
    } else if (status === 401) {
      userMessage = error.response.data?.message || 'Session expired or unauthorized. Please log in.';
      localStorage.removeItem('cloudnexus_token');
      localStorage.removeItem('cloudnexus_user');
      
      // Dispatch custom event for React components to react without hard reload
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cloudnexus:unauthorized', { detail: { message: userMessage } }));
      }
    } else if (status === 403) {
      userMessage = error.response.data?.message || 'Access denied: You do not have permission to access this resource.';
    } else if (status === 404) {
      userMessage = error.response.data?.message || 'Requested resource not found.';
    } else if (status >= 500) {
      userMessage = error.response.data?.message || 'Internal server error occurred. Please try again later.';
    } else if (error.response.data?.message) {
      userMessage = error.response.data.message;
    }

    const enhancedError = new Error(userMessage);
    enhancedError.status = status;
    enhancedError.data = error.response?.data || null;
    enhancedError.originalError = error;

    return Promise.reject(enhancedError);
  }
);

/**
 * Normalizes backend ApiResponse<T> envelope or direct payload.
 * Backend contract: { success: boolean, message: string, data: T, timestamp: number }
 */
export function extractData(response) {
  if (!response) return null;
  const body = response.data !== undefined ? response.data : response;
  if (body && typeof body === 'object' && 'data' in body && 'success' in body) {
    return body.data;
  }
  return body;
}

/**
 * Ensures collection data is safely returned as an Array, preventing .map errors.
 */
export function ensureArray(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.items)) return data.items;
  }
  return [];
}

export default apiClient;
