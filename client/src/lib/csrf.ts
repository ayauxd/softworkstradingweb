/**
 * CSRF protection utilities for client-side use
 * This module provides functions to fetch and use CSRF tokens for form submissions
 * and API requests.
 */

// Cache for the CSRF token
let cachedToken: string | null = null;

/**
 * Fetches a CSRF token from the server
 * @returns Promise that resolves to the CSRF token
 */
export const fetchCSRFToken = async (): Promise<string> => {
  try {
    // Use cached token if available
    if (cachedToken) {
      return cachedToken;
    }

    // Fetch a new token from the API
    const response = await fetch('/api/csrf-token');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSRF token: ${response.statusText}`);
    }
    
    const data = await response.json();
    cachedToken = data.csrfToken;
    return cachedToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
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
export const withCSRF = <T extends (...args: any[]) => Promise<any>>(fetchFn: T): T => {
  return (async (...args: Parameters<T>) => {
    const [url, options = {}] = args as [string, RequestInit];
    
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
    return fetchFn(...args);
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
 *       {/* Form fields */}
 *     </form>
 *   );
 * };
 */