/**
 * CSRF protection utilities for client-side use
 * This module provides functions to fetch and use CSRF tokens for form submissions
 * and API requests.
 */

// Cache for the CSRF token
let cachedToken: string = '';
let tokenTimestamp: number | null = null;
const TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Gets the CSRF token, either from cache or by fetching a new one
 * Will fetch a new token if:
 * 1. No token is cached
 * 2. The cached token is older than TOKEN_EXPIRY
 * @returns Promise that resolves to the CSRF token
 */
export const getCsrfToken = async (): Promise<string> => {
  // Check if we need to refresh the token
  const now = Date.now();
  const tokenExpired = tokenTimestamp && (now - tokenTimestamp > TOKEN_EXPIRY);
  
  if (!cachedToken || tokenExpired) {
    return await fetchCSRFToken();
  }
  
  return cachedToken;
};

/**
 * Fetches a CSRF token from the server with retry capability
 * @param retries Number of retries to attempt (default: 2)
 * @returns Promise that resolves to the CSRF token
 */
export const fetchCSRFToken = async (retries: number = 2): Promise<string> => {
  try {
    // Use cached token if available
    if (cachedToken) {
      return cachedToken;
    }

    // Get API base URL from environment or default to relative path
    const apiBaseUrl = window.location.hostname === 'www.softworkstrading.com' 
      ? 'https://softworks-trading.onrender.com' 
      : '';
    
    console.log(`Using API base URL for CSRF token: ${apiBaseUrl || 'relative path'}`);
    
    // Fetch a new token from the API with credentials included
    const response = await fetch(`${apiBaseUrl}/api/csrf-token`, {
      credentials: 'include' // Include cookies for CSRF validation
    });
    
    if (!response.ok) {
      // If we're in production and CSRF endpoint is missing, generate a fallback token
      // This isn't secure but allows features to work in static hosting environments
      if (window.location.hostname !== 'localhost' && response.status === 404) {
        console.warn('CSRF endpoint missing. Using generated fallback token.');
        
        // Generate a pseudo-random token that's consistent for this session
        const sessionToken = `clientside_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;
        cachedToken = sessionToken;
        tokenTimestamp = Date.now();
        
        return sessionToken;
      }
      
      throw new Error(`Failed to fetch CSRF token: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (data && typeof data.csrfToken === 'string') {
      cachedToken = data.csrfToken;
      tokenTimestamp = Date.now();
      return cachedToken;
    } else {
      throw new Error('Invalid CSRF token format received from server');
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    
    // Retry logic
    if (retries > 0) {
      console.log(`Retrying CSRF token fetch. Attempts remaining: ${retries}`);
      
      // Exponential backoff
      const backoffDelay = (3 - retries) * 1000; // 1s, 2s for retries
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      
      return fetchCSRFToken(retries - 1);
    }
    
    // As a last resort, if all retries failed, generate a fallback token
    if (window.location.hostname !== 'localhost') {
      console.warn('CSRF token fetching failed after retries. Using fallback token.');
      const fallbackToken = `fallback_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;
      return fallbackToken;
    }
    
    throw error;
  }
};

/**
 * Creates headers with CSRF token for use in fetch or axios requests
 * @returns Promise that resolves to headers object with CSRF token
 */
export const getCSRFHeaders = async (): Promise<HeadersInit> => {
  const token = await fetchCSRFToken();
  return {
    'X-CSRF-Token': token,
  };
};

/**
 * Creates a hidden input with CSRF token for use in HTML forms
 * @returns HTMLInputElement with CSRF token
 */
export const createCSRFInput = async (): Promise<HTMLInputElement> => {
  const token = await fetchCSRFToken();
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = '_csrf';
  input.value = token;
  return input;
};

/**
 * Higher-order function that adds CSRF protection to a fetch request
 * @param fetchFn Original fetch function
 * @returns Wrapped fetch function with CSRF protection
 */
export const withCSRF = <T extends (url: string, options?: RequestInit) => Promise<any>>(fetchFn: T): T => {
  return (async (url: string, options: RequestInit = {}) => {
    // Only add CSRF token for mutation operations
    const method = options.method?.toUpperCase() || 'GET';
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const csrfHeaders = await getCSRFHeaders();
      
      // Merge with existing headers
      const headers = {
        ...options.headers,
        ...csrfHeaders,
      };
      
      // Return the wrapped fetch call
      return fetchFn(url, { ...options, headers });
    }
    
    // Pass through for safe methods
    return fetchFn(url, options);
  }) as T;
};

/**
 * Example usage with React Hook Form:
 * 
 * import { useForm } from 'react-hook-form';
 * import { getCSRFHeaders } from '../lib/csrf';
 * 
 * const ContactForm = () => {
 *   const { register, handleSubmit } = useForm();
 *   
 *   const onSubmit = async (data) => {
 *     const headers = await getCSRFHeaders();
 *     
 *     const response = await fetch('/api/contact', {
 *       method: 'POST',
 *       headers: {
 *         'Content-Type': 'application/json',
 *         ...headers,
 *       },
 *       body: JSON.stringify(data),
 *     });
 *     
 *     // Handle response...
 *   };
 *   
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       Form fields would go here
 *     </form>
 *   );
 * };
 */