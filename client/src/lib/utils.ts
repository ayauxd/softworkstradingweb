import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the API base URL based on the current environment
 * - In production on www.softworkstrading.com: Use the Render deployment URL
 * - In other environments: Use relative paths
 */
export function getApiBaseUrl(): string {
  const hostname = window.location.hostname;
  
  // Production website - always use the Render deployment URL
  if (hostname === 'www.softworkstrading.com' || hostname === 'softworkstrading.com') {
    return 'https://softworks-trading.onrender.com';
  }
  
  // If we're on the Render domain itself, use a relative URL
  if (hostname === 'softworks-trading.onrender.com') {
    return '';
  }
  
  // For localhost development, default to relative URLs
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return '';
  }
  
  // For any other domains (like preview deployments), try to use the same origin
  // This helps avoid CORS issues with preview deployments
  return window.location.origin;
}
