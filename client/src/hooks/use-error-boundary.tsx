import React, { ErrorInfo, ReactNode, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';

interface ErrorBoundaryHookReturn {
  ErrorBoundary: React.ComponentType<{ children: ReactNode }>;
  resetError: () => void;
  error: Error | null;
}

/**
 * Hook that provides an error boundary component and error state management
 * @param onError Optional callback that will be called when an error is caught
 * @param fallback Optional custom fallback UI to display when an error occurs
 * @returns An object containing the ErrorBoundary component, a resetError function, and the current error state
 */
export function useErrorBoundary(
  onError?: (error: Error, errorInfo: ErrorInfo) => void,
  fallback?: ReactNode
): ErrorBoundaryHookReturn {
  const [error, setError] = useState<Error | null>(null);

  const resetError = () => {
    setError(null);
  };

  const handleError = (capturedError: Error, errorInfo: ErrorInfo) => {
    setError(capturedError);
    if (onError) {
      onError(capturedError, errorInfo);
    }
  };

  const ErrorBoundaryComponent = ({ children }: { children: ReactNode }) => (
    <ErrorBoundary onError={handleError} onReset={resetError} fallback={fallback}>
      {children}
    </ErrorBoundary>
  );

  return {
    ErrorBoundary: ErrorBoundaryComponent,
    resetError,
    error,
  };
}