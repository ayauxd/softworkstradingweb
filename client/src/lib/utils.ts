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
  
  // Local development or Render preview deployments - use relative paths
  return '';
}
