import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component that catches JavaScript errors in its child component tree
 * and displays a fallback UI instead of crashing the entire application.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  // Update state when an error occurs
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  // Log error details when an error is caught
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Call optional error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  // Reset the error state and trigger any provided reset callback
  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI if provided, otherwise default error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gray-50 dark:bg-navy-dark rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              We've encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            
            {this.state.error && process.env.NODE_ENV !== 'production' && (
              <div className="mb-6 max-w-md mx-auto">
                <details className="text-left bg-gray-100 dark:bg-navy-light p-3 rounded-md">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                    Error Details (Development Only)
                  </summary>
                  <p className="mt-2 text-sm text-gray-800 dark:text-gray-200 overflow-auto max-h-[200px] whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </p>
                </details>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button 
                onClick={this.resetErrorBoundary}
                className="bg-cyan hover:bg-cyan-light text-navy font-medium transition-colors"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;