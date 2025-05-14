// Basic API Endpoint Test Script
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000'; // Adjust port if needed
let csrfToken = null;

// Helper function for logging
const log = (message, type = 'info') => {
  const color = type === 'success' ? '\x1b[32m' :
               type === 'error' ? '\x1b[31m' :
               type === 'warning' ? '\x1b[33m' : '\x1b[36m';
  console.log(`${color}${message}\x1b[0m`);
};

// Helper function to make API requests
async function makeRequest(endpoint, options = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    log(`Making ${options.method || 'GET'} request to: ${url}`);
    
    // Add CSRF token to headers if it exists and this is a mutation
    if (csrfToken && ['POST', 'PUT', 'DELETE'].includes(options.method)) {
      options.headers = {
        ...options.headers,
        'X-CSRF-Token': csrfToken
      };
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${JSON.stringify(data)}`);
    }
    
    return data;
  } catch (error) {
    log(`Request failed: ${error.message}`, 'error');
    throw error;
  }
}

// Main test function
async function runTests() {
  log('=== API ENDPOINT TESTING STARTED ===');
  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };

  try {
    // Test 1: Health Check
    log('\n--- Testing /api/health endpoint ---');
    results.total++;
    const healthData = await makeRequest('/api/health');
    log(`Health status: ${healthData.status}`, 'success');
    if (healthData.status === 'ok') {
      results.passed++;
    } else {
      results.failed++;
    }

    // Test 2: Debug Endpoint
    log('\n--- Testing /api/debug endpoint ---');
    results.total++;
    const debugData = await makeRequest('/api/debug');
    log(`Debug environment: ${debugData.environment}`, 'success');
    if (debugData.status === 'ok') {
      results.passed++;
    } else {
      results.failed++;
    }

    // Test 3: Get CSRF Token (needed for POST requests)
    log('\n--- Getting CSRF token ---');
    results.total++;
    try {
      // Try to get it from cookies and a dedicated endpoint
      const csrfResponse = await fetch(`${BASE_URL}/api/csrf-token`);
      const csrfData = await csrfResponse.json();
      
      if (csrfData.csrfToken) {
        csrfToken = csrfData.csrfToken;
        log(`CSRF token acquired: ${csrfToken.substring(0, 10)}...`, 'success');
        results.passed++;
      } else {
        // If not available, try a different approach (check for Set-Cookie header etc.)
        log('CSRF token not available from endpoint, using cookie instead', 'warning');
        
        // Some Express CSRF implementations use cookies
        const cookieHeader = csrfResponse.headers.get('set-cookie');
        if (cookieHeader) {
          const csrfCookie = cookieHeader.split(';')[0];
          csrfToken = csrfCookie.split('=')[1];
          log(`CSRF token acquired from cookie: ${csrfToken.substring(0, 10)}...`, 'success');
          results.passed++;
        } else {
          throw new Error('Could not acquire CSRF token');
        }
      }
    } catch (error) {
      log('Warning: CSRF token acquisition failed. Continuing without token.', 'warning');
      results.failed++;
    }

    // Test 4: Contact Form Submission
    log('\n--- Testing /api/contact endpoint ---');
    results.total++;
    try {
      const contactData = await makeRequest('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: 'Test User',
          email: 'test@example.com',
          company: 'Test Company',
          phone: '555-123-4567',
          message: 'This is a test message from the API test script.'
        })
      });
      
      log(`Contact form submission: ${contactData.success ? 'Successful' : 'Failed'}`, contactData.success ? 'success' : 'error');
      
      if (contactData.success) {
        results.passed++;
      } else {
        results.failed++;
      }
    } catch (error) {
      log(`Contact form test failed: ${error.message}`, 'error');
      results.failed++;
    }

    // Test 5: Newsletter Subscription
    log('\n--- Testing /api/subscribe endpoint ---');
    results.total++;
    try {
      const subscribeData = await makeRequest('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'subscriber@example.com',
          name: 'Test Subscriber',
          interests: ['AI', 'Automation'],
          marketingConsent: true
        })
      });
      
      log(`Newsletter subscription: ${subscribeData.success ? 'Successful' : 'Failed'}`, subscribeData.success ? 'success' : 'error');
      
      if (subscribeData.success) {
        results.passed++;
      } else {
        results.failed++;
      }
    } catch (error) {
      log(`Subscription test failed: ${error.message}`, 'error');
      results.failed++;
    }

    // Test 6: AI Chat Endpoint
    log('\n--- Testing /api/ai/chat endpoint ---');
    results.total++;
    try {
      const chatData = await makeRequest('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello! This is a test message.',
          conversationId: 'test-conversation-' + Math.random().toString(36).substring(2, 10)
        })
      });
      
      log(`AI chat response: ${chatData.success ? 'Successful' : 'Failed'}`, chatData.success ? 'success' : 'error');
      log(`AI provider: ${chatData.provider || 'Unknown'}`, 'info');
      
      if (chatData.success) {
        results.passed++;
      } else {
        results.failed++;
      }
    } catch (error) {
      log(`AI chat test failed: ${error.message}`, 'error');
      results.failed++;
    }

    // Test 7: Test Error Handling (Invalid Input)
    log('\n--- Testing Error Handling with Invalid Input ---');
    results.total++;
    try {
      await makeRequest('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Missing required fields
          email: 'invalid-email', // Invalid email format
          message: 'too short' // Too short message
        })
      });
      
      // If we get here, validation failed
      log('Validation error not detected!', 'error');
      results.failed++;
    } catch (error) {
      // Expected error - validation should fail
      log('Error handling test: Validation errors correctly detected', 'success');
      results.passed++;
    }

  } catch (error) {
    log(`Fatal error: ${error.message}`, 'error');
  }

  // Print test summary
  log('\n=== TEST SUMMARY ===');
  log(`Total tests: ${results.total}`);
  log(`Passed: ${results.passed}`, 'success');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'error' : 'success');
  
  if (results.passed === results.total) {
    log('\n✅ All tests passed!', 'success');
  } else {
    log('\n❌ Some tests failed.', 'error');
  }
}

// Start tests
runTests();