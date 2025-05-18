/**
 * API Connectivity Test Script
 * This script tests the connectivity between the frontend and backend API
 * by making a series of test requests to various endpoints.
 */
import fetch from 'node-fetch';

// Test configuration
const apiBaseUrl = process.env.API_URL || 'https://softworks-trading.onrender.com';
const frontendDomain = process.env.FRONTEND_DOMAIN || 'https://www.softworkstrading.com';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Run a test and log the result
 */
async function runTest(name, fn) {
  try {
    console.log(`${colors.blue}Running test: ${name}${colors.reset}`);
    const startTime = Date.now();
    const result = await fn();
    const duration = Date.now() - startTime;
    
    if (result.success) {
      console.log(`${colors.green}✓ PASS: ${name} (${duration}ms)${colors.reset}`);
      if (result.message) {
        console.log(`  ${result.message}`);
      }
    } else {
      console.log(`${colors.red}✗ FAIL: ${name} (${duration}ms)${colors.reset}`);
      console.log(`  Error: ${result.error}`);
    }
    
    return result;
  } catch (error) {
    console.log(`${colors.red}✗ ERROR: ${name}${colors.reset}`);
    console.log(`  Unexpected error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Test CORS for a specific endpoint
 */
async function testCORS(endpoint, origin) {
  try {
    const url = `${apiBaseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Origin': origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
      'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
    };
    
    const allowedOrigin = corsHeaders['access-control-allow-origin'];
    
    if (allowedOrigin === '*' || allowedOrigin === origin) {
      return { 
        success: true,
        message: `CORS is properly configured for ${origin} → ${url}\n  Headers: ${JSON.stringify(corsHeaders)}`
      };
    }
    
    return {
      success: false,
      error: `CORS is not configured correctly. Expected ${origin} in Access-Control-Allow-Origin but got ${allowedOrigin || 'none'}`
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Test CSRF token generation
 */
async function testCSRFToken(origin) {
  try {
    const url = `${apiBaseUrl}/api/csrf-token`;
    const response = await fetch(url, {
      headers: {
        'Origin': origin
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      return { 
        success: false, 
        error: `Failed to fetch CSRF token: ${response.status} ${response.statusText}` 
      };
    }
    
    const data = await response.json();
    
    if (data && data.csrfToken) {
      return { 
        success: true, 
        message: `Successfully retrieved CSRF token${data.csrfToken ? ': ' + data.csrfToken.substring(0, 8) + '...' : ''}` 
      };
    }
    
    return { success: false, error: 'CSRF token not found in response' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Main test suite
 */
async function runTests() {
  console.log(`${colors.cyan}===== API Connectivity Tests =====`);
  console.log(`Testing API at: ${apiBaseUrl}`);
  console.log(`Frontend origin: ${frontendDomain}`);
  console.log('===============================\n' + colors.reset);
  
  // Test basic connectivity
  await runTest('API health check', async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/debug/health`);
      if (response.ok) {
        return { success: true, message: `API is online and responding` };
      }
      return { success: false, error: `API health check failed with status: ${response.status}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  
  // Test CORS for various endpoints
  await runTest('CORS setup for CSRF endpoint', () => 
    testCORS('/api/csrf-token', frontendDomain));
  
  await runTest('CORS setup for AI chat endpoint', () => 
    testCORS('/api/ai/chat', frontendDomain));
  
  await runTest('CORS setup for AI voice endpoint', () => 
    testCORS('/api/ai/voice', frontendDomain));
  
  // Test CSRF token generation
  await runTest('CSRF token generation', () => 
    testCSRFToken(frontendDomain));
  
  // Test API key verification (without exposing keys)
  await runTest('OpenAI API key verification', async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/debug/check-openai-key`);
      const data = await response.json();
      
      if (response.ok && data.configured === true) {
        return { success: true, message: 'OpenAI API key is configured and valid' };
      }
      
      return { 
        success: false, 
        error: `OpenAI API key validation failed: ${data.message || 'Unknown error'}` 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  
  await runTest('ElevenLabs API key verification', async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/debug/check-elevenlabs-key`);
      const data = await response.json();
      
      if (response.ok && data.configured === true) {
        return { success: true, message: 'ElevenLabs API key is configured and valid' };
      }
      
      return { 
        success: false, 
        error: `ElevenLabs API key validation failed: ${data.message || 'Unknown error'}`  
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  
  console.log('\n' + colors.cyan + '===== Tests Complete =====\n' + colors.reset);
}

// Run the tests
runTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});