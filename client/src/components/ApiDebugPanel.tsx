import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

/**
 * API Debug Panel for testing API connections and troubleshooting
 */
const ApiDebugPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Record<string, any>>({});
  const [activeTest, setActiveTest] = useState<string | null>(null);

  // Run all tests when component mounts
  useEffect(() => {
    runAllTests();
  }, []);

  const runAllTests = async () => {
    setIsLoading(true);
    setResults({});

    try {
      await Promise.all([
        runHealthCheck(),
        runCsrfTest(),
        runApiConfigTest(),
        runSimpleAiTest()
      ]);
    } finally {
      setIsLoading(false);
      setActiveTest(null);
    }
  };

  const runHealthCheck = async () => {
    setActiveTest('health');
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setResults(prev => ({ ...prev, health: { success: true, data } }));
    } catch (error) {
      console.error('Health check failed:', error);
      setResults(prev => ({ 
        ...prev, 
        health: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }));
    }
  };

  const runCsrfTest = async () => {
    setActiveTest('csrf');
    try {
      const response = await fetch('/api/debug/csrf-test', {
        credentials: 'include'  // Important for CSRF cookies
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, csrf: { success: true, data } }));
    } catch (error) {
      console.error('CSRF test failed:', error);
      setResults(prev => ({ 
        ...prev, 
        csrf: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }));
    }
  };

  const runApiConfigTest = async () => {
    setActiveTest('config');
    try {
      const response = await fetch('/api/debug/api-config');
      const data = await response.json();
      setResults(prev => ({ ...prev, config: { success: true, data } }));
    } catch (error) {
      console.error('API config test failed:', error);
      setResults(prev => ({ 
        ...prev, 
        config: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }));
    }
  };

  const runSimpleAiTest = async () => {
    setActiveTest('ai');
    try {
      const response = await fetch('/api/debug/test-ai');
      const data = await response.json();
      setResults(prev => ({ ...prev, ai: { success: true, data } }));
    } catch (error) {
      console.error('AI test failed:', error);
      setResults(prev => ({ 
        ...prev, 
        ai: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-navy dark:text-white">API Diagnostics</h2>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button 
          onClick={runAllTests} 
          disabled={isLoading}
          className="bg-cyan hover:bg-cyan-light text-navy"
        >
          {isLoading && !activeTest ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running All Tests...
            </>
          ) : "Run All Tests"}
        </Button>
        
        <Button 
          onClick={runHealthCheck} 
          disabled={isLoading}
          variant="outline"
          className="text-navy dark:text-gray-200"
        >
          {activeTest === 'health' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : "Test Health Endpoint"}
        </Button>
        
        <Button 
          onClick={runCsrfTest} 
          disabled={isLoading}
          variant="outline"
          className="text-navy dark:text-gray-200"
        >
          {activeTest === 'csrf' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : "Test CSRF Token"}
        </Button>
        
        <Button 
          onClick={runApiConfigTest} 
          disabled={isLoading}
          variant="outline"
          className="text-navy dark:text-gray-200"
        >
          {activeTest === 'config' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : "Check API Config"}
        </Button>
        
        <Button 
          onClick={runSimpleAiTest} 
          disabled={isLoading}
          variant="outline"
          className="text-navy dark:text-gray-200 col-span-2"
        >
          {activeTest === 'ai' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing AI Service...
            </>
          ) : "Test AI Response"}
        </Button>
      </div>
      
      <div className="space-y-4">
        {Object.entries(results).map(([key, result]) => (
          <div 
            key={key}
            className={`p-3 border rounded-md ${
              result.success 
                ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' 
                : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
            }`}
          >
            <h3 className="font-medium mb-1 flex items-center">
              <span className={`h-2 w-2 rounded-full mr-2 ${
                result.success ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {key.charAt(0).toUpperCase() + key.slice(1)} Test: {result.success ? 'Success' : 'Failed'}
            </h3>
            
            {result.success ? (
              <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-40 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 rounded">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            ) : (
              <div className="text-red-600 dark:text-red-400 text-sm">
                Error: {result.error}
              </div>
            )}
          </div>
        ))}
        
        {Object.keys(results).length === 0 && !isLoading && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            No tests run yet. Click the buttons above to test API connectivity.
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        This diagnostic panel helps identify issues with the API connectivity.
        Check the browser console for additional error details.
      </div>
    </div>
  );
};

export default ApiDebugPanel;