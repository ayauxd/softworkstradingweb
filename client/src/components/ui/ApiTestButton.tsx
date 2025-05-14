import React, { useState } from 'react';
import { Button } from './button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * A test button for checking API connectivity
 * Only for development use
 */
const ApiTestButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const checkApiConnection = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      // Test simple health endpoint first
      const healthResponse = await fetch('/api/health');
      if (!healthResponse.ok) {
        throw new Error(`Health check failed: ${healthResponse.status}`);
      }
      
      // Now test API configuration
      const configResponse = await fetch('/api/debug/api-config');
      if (!configResponse.ok) {
        throw new Error(`Config check failed: ${configResponse.status}`);
      }
      
      const configData = await configResponse.json();
      
      // Format result nicely
      const resultText = `
        API Status: ✅ Connected
        
        OpenAI API: ${configData.config.openai.isConfigured ? '✅' : '❌'}
        ElevenLabs API: ${configData.config.elevenlabs.isConfigured ? '✅' : '❌'}
        Gemini API: ${configData.config.gemini.isConfigured ? '✅' : '❌'}
        
        Environment: ${configData.config.environment}
      `;
      
      setResult(resultText);
      
      // Show success toast
      toast({
        title: "API Connection Successful",
        description: "Successfully connected to the API server"
      });
    } catch (error) {
      console.error('API test error:', error);
      
      setResult(`❌ API Test Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Show error toast
      toast({
        title: "API Connection Failed",
        description: error instanceof Error ? error.message : 'Failed to connect to API',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-medium mb-2 text-navy dark:text-white">API Connection Test</h3>
      
      <Button 
        onClick={checkApiConnection}
        disabled={isLoading}
        className="bg-cyan hover:bg-cyan-light text-navy w-full mb-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing Connection...
          </>
        ) : "Test API Connection"}
      </Button>
      
      {result && (
        <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono whitespace-pre-wrap">
          {result}
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Use this to check if your API keys are properly configured.
      </div>
    </div>
  );
};

export default ApiTestButton;