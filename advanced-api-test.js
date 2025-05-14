/**
 * Advanced API Testing Script for Softworks Trading Web Backend
 * 
 * This script provides comprehensive testing for API endpoints with:
 * - Detailed logging and error reporting
 * - CSRF token handling
 * - Cookie management
 * - Configurable test suites
 * - Success/failure stats and summaries
 * 
 * Run with: node advanced-api-test.js
 */

const fetch = require('node-fetch');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 30000, // 30 seconds
  retries: 2,
  logToFile: true,
  logFilePath: path.join(__dirname, 'api-test-results.log'),
  verbose: true
};

// Test endpoints
const ENDPOINTS = {
  health: '/api/health',
  csrfToken: '/api/csrf-token',
  contact: '/api/contact',
  subscribe: '/api/subscribe',
  chat: '/api/ai/chat',
  debug: '/api/debug'
};

// Test data
const TEST_DATA = {
  validContact: {
    fullName: 'Test User',
    company: 'Softworks Trading',
    email: 'test@example.com',
    phone: '+1234567890',
    message: 'This is an automated test message from the API testing script. Please ignore.'
  },
  invalidContact: {
    email: 'invalid-email',
    message: 'Too short'
  },
  validSubscription: {
    email: 'subscriber@example.com',
    name: 'Newsletter Tester',
    interests: ['ai', 'automation', 'consulting'],
    marketingConsent: true
  },
  invalidSubscription: {
    email: 'not-an-email',
    interests: 'should-be-array'
  },
  validChat: {
    message: 'Hello, this is a test message for the AI assistant. What services does Softworks Trading offer?',
    conversationId: `test-${Date.now()}`
  },
  invalidChat: {
    message: '',
    conversationId: '123'
  }
};

// Store auth state
const AUTH = {
  csrfToken: null,
  cookies: null
};

// Test results
const RESULTS = {
  startTime: new Date(),
  endTime: null,
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
};

// Logger
const logger = {
  log: (message) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} | ${message}`);
    
    if (CONFIG.logToFile) {
      fs.appendFileSync(
        CONFIG.logFilePath, 
        `${timestamp} | ${message}\n`, 
        { flag: 'a+' }
      );
    }
  },
  
  error: (message, error) => {
    const timestamp = new Date().toISOString();
    const errorDetail = error ? `\n${error.stack || error}` : '';
    console.error(chalk.red(`${timestamp} | ERROR: ${message}${errorDetail}`));
    
    if (CONFIG.logToFile) {
      fs.appendFileSync(
        CONFIG.logFilePath, 
        `${timestamp} | ERROR: ${message}${errorDetail}\n`, 
        { flag: 'a+' }
      );
    }
  },
  
  success: (message) => {
    const timestamp = new Date().toISOString();
    console.log(chalk.green(`${timestamp} | SUCCESS: ${message}`));
    
    if (CONFIG.logToFile) {
      fs.appendFileSync(
        CONFIG.logFilePath, 
        `${timestamp} | SUCCESS: ${message}\n`, 
        { flag: 'a+' }
      );
    }
  },
  
  warn: (message) => {
    const timestamp = new Date().toISOString();
    console.log(chalk.yellow(`${timestamp} | WARNING: ${message}`));
    
    if (CONFIG.logToFile) {
      fs.appendFileSync(
        CONFIG.logFilePath, 
        `${timestamp} | WARNING: ${message}\n`, 
        { flag: 'a+' }
      );
    }
  },
  
  info: (message) => {
    if (CONFIG.verbose) {
      const timestamp = new Date().toISOString();
      console.log(chalk.blue(`${timestamp} | INFO: ${message}`));
      
      if (CONFIG.logToFile) {
        fs.appendFileSync(
          CONFIG.logFilePath, 
          `${timestamp} | INFO: ${message}\n`, 
          { flag: 'a+' }
        );
      }
    }
  }
};

/**
 * Initialize testing environment
 */
function initializeTest() {
  logger.log(chalk.blueBright('=== Softworks Trading API Test Suite ==='));
  logger.log(`Base URL: ${CONFIG.baseUrl}`);
  logger.log(`Timeout: ${CONFIG.timeout}ms`);
  logger.log(`Retries: ${CONFIG.retries}`);
  logger.log(`Log file: ${CONFIG.logToFile ? CONFIG.logFilePath : 'Disabled'}`);
  logger.log('');
  
  // Create or clear log file
  if (CONFIG.logToFile) {
    fs.writeFileSync(CONFIG.logFilePath, `=== API TEST RUN: ${new Date().toISOString()} ===\n`, { flag: 'w' });
  }
}

/**
 * Wrap fetch with timeout, retries and error handling
 */
async function fetchWithRetry(url, options = {}, retries = CONFIG.retries) {
  const fullUrl = `${CONFIG.baseUrl}${url}`;
  
  // Add CSRF token if available
  if (AUTH.csrfToken && options.method && options.method !== 'GET') {
    if (!options.headers) options.headers = {};
    options.headers['x-csrf-token'] = AUTH.csrfToken;
  }
  
  // Add cookies if available
  if (AUTH.cookies) {
    if (!options.headers) options.headers = {};
    options.headers['Cookie'] = AUTH.cookies;
  }
  
  // Add default headers for POST requests
  if (options.method === 'POST' && options.body && !options.headers?.['Content-Type']) {
    if (!options.headers) options.headers = {};
    options.headers['Content-Type'] = 'application/json';
  }
  
  // Log request details
  logger.info(`Request: ${options.method || 'GET'} ${fullUrl}`);
  if (options.body) {
    logger.info(`Request body: ${options.body}`);
  }
  if (options.headers) {
    const safeHeaders = { ...options.headers };
    if (safeHeaders['x-csrf-token']) safeHeaders['x-csrf-token'] = '***REDACTED***';
    if (safeHeaders['Cookie']) safeHeaders['Cookie'] = '***REDACTED***';
    logger.info(`Request headers: ${JSON.stringify(safeHeaders)}`);
  }
  
  try {
    // Add timeout to fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);
    
    const fetchOptions = {
      ...options,
      signal: controller.signal
    };
    
    const response = await fetch(fullUrl, fetchOptions);
    clearTimeout(timeoutId);
    
    // Store cookies from response
    if (response.headers.has('set-cookie')) {
      AUTH.cookies = response.headers.get('set-cookie');
      logger.info('Received cookies from server');
    }
    
    // Log response details
    logger.info(`Response status: ${response.status} ${response.statusText}`);
    
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      logger.error(`Request timeout after ${CONFIG.timeout}ms: ${fullUrl}`);
    } else {
      logger.error(`Fetch error for ${fullUrl}: ${error.message}`);
    }
    
    // Retry logic
    if (retries > 0) {
      logger.warn(`Retrying request to ${fullUrl} (${retries} retries left)...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      return fetchWithRetry(url, options, retries - 1);
    }
    
    throw error;
  }
}

/**
 * Parse response with error handling
 */
async function parseResponse(response) {
  try {
    if (response.headers.get('content-type')?.includes('application/json')) {
      const jsonData = await response.json();
      logger.info(`Response body (JSON): ${JSON.stringify(jsonData)}`);
      return jsonData;
    } else {
      const textData = await response.text();
      logger.info(`Response body (text): ${textData.substring(0, 200)}${textData.length > 200 ? '...' : ''}`);
      return textData;
    }
  } catch (error) {
    logger.error('Error parsing response:', error);
    return null;
  }
}

/**
 * Record test result
 */
function recordTestResult(testName, success, response = null, error = null, details = null) {
  const result = {
    name: testName,
    success,
    timestamp: new Date().toISOString(),
    statusCode: response ? response.status : null,
    error: error ? (error.message || String(error)) : null,
    details
  };
  
  RESULTS.tests.push(result);
  
  if (success) {
    RESULTS.passed++;
    logger.success(`Test '${testName}' PASSED`);
  } else {
    RESULTS.failed++;
    logger.error(`Test '${testName}' FAILED${error ? ': ' + error.message : ''}`);
  }
  
  return result;
}

/**
 * Test: CSRF Token
 * Gets a CSRF token for protected endpoints
 */
async function testGetCsrfToken() {
  const testName = 'Get CSRF Token';
  logger.log(chalk.cyan(`Running test: ${testName}`));
  
  try {
    const response = await fetchWithRetry(ENDPOINTS.csrfToken);
    const data = await parseResponse(response);
    
    const success = 
      response.status === 200 && 
      data && 
      data.csrfToken && 
      typeof data.csrfToken === 'string';
    
    if (success) {
      AUTH.csrfToken = data.csrfToken;
      logger.info(`CSRF Token obtained: ${AUTH.csrfToken.substring(0, 10)}...`);
    }
    
    return recordTestResult(testName, success, response, null, {
      tokenReceived: !!AUTH.csrfToken
    });
  } catch (error) {
    return recordTestResult(testName, false, null, error);
  }
}

/**
 * Test: Health Endpoint
 * Checks the API health endpoint
 */
async function testHealthEndpoint() {
  const testName = 'Health Endpoint';
  logger.log(chalk.cyan(`Running test: ${testName}`));
  
  try {
    const response = await fetchWithRetry(ENDPOINTS.health);
    const data = await parseResponse(response);
    
    const success = 
      response.status === 200 && 
      data && 
      data.status === 'ok' && 
      data.timestamp;
    
    return recordTestResult(testName, success, response, null, {
      responseData: data
    });
  } catch (error) {
    return recordTestResult(testName, false, null, error);
  }
}

/**
 * Test: Debug Endpoint
 * Tests the debug endpoint if available
 */
async function testDebugEndpoint() {
  const testName = 'Debug Endpoint';
  logger.log(chalk.cyan(`Running test: ${testName}`));
  
  try {
    const response = await fetchWithRetry(ENDPOINTS.debug);
    const data = await parseResponse(response);
    
    // Debug endpoint may return different status codes
    const success = [200, 404].includes(response.status);
    
    return recordTestResult(testName, success, response, null, {
      responseData: data
    });
  } catch (error) {
    return recordTestResult(testName, false, null, error);
  }
}

/**
 * Test: Contact Form - Valid Data
 */
async function testValidContact() {
  const testName = 'Contact Form - Valid Data';
  logger.log(chalk.cyan(`Running test: ${testName}`));
  
  try {
    const response = await fetchWithRetry(ENDPOINTS.contact, {
      method: 'POST',
      body: JSON.stringify(TEST_DATA.validContact)
    });
    
    const data = await parseResponse(response);
    
    const success = [200, 201].includes(response.status);
    
    return recordTestResult(testName, success, response, null, {
      requestData: TEST_DATA.validContact,
      responseData: data
    });
  } catch (error) {
    return recordTestResult(testName, false, null, error);
  }
}

/**
 * Test: Contact Form - Invalid Data
 */
async function testInvalidContact() {
  const testName = 'Contact Form - Invalid Data';
  logger.log(chalk.cyan(`Running test: ${testName}`));
  
  try {
    const response = await fetchWithRetry(ENDPOINTS.contact, {
      method: 'POST',
      body: JSON.stringify(TEST_DATA.invalidContact)
    });
    
    const data = await parseResponse(response);
    
    // For invalid data, we expect 400 Bad Request
    const success = response.status === 400;
    
    return recordTestResult(testName, success, response, null, {
      requestData: TEST_DATA.invalidContact,
      responseData: data
    });
  } catch (error) {
    return recordTestResult(testName, false, null, error);
  }
}

/**
 * Test: Subscription - Valid Data
 */
async function testValidSubscription() {
  const testName = 'Newsletter Subscription - Valid Data';
  logger.log(chalk.cyan(`Running test: ${testName}`));
  
  try {
    const response = await fetchWithRetry(ENDPOINTS.subscribe, {
      method: 'POST',
      body: JSON.stringify(TEST_DATA.validSubscription)
    });
    
    const data = await parseResponse(response);
    
    const success = [200, 201].includes(response.status);
    
    return recordTestResult(testName, success, response, null, {
      requestData: TEST_DATA.validSubscription,
      responseData: data
    });
  } catch (error) {
    return recordTestResult(testName, false, null, error);
  }
}

/**
 * Test: Subscription - Invalid Data
 */
async function testInvalidSubscription() {
  const testName = 'Newsletter Subscription - Invalid Data';
  logger.log(chalk.cyan(`Running test: ${testName}`));
  
  try {
    const response = await fetchWithRetry(ENDPOINTS.subscribe, {
      method: 'POST',
      body: JSON.stringify(TEST_DATA.invalidSubscription)
    });
    
    const data = await parseResponse(response);
    
    // For invalid data, we expect 400 Bad Request
    const success = response.status === 400;
    
    return recordTestResult(testName, success, response, null, {
      requestData: TEST_DATA.invalidSubscription,
      responseData: data
    });
  } catch (error) {
    return recordTestResult(testName, false, null, error);
  }
}

/**
 * Test: AI Chat - Valid Message
 */
async function testValidChat() {
  const testName = 'AI Chat - Valid Message';
  logger.log(chalk.cyan(`Running test: ${testName}`));
  
  try {
    const response = await fetchWithRetry(ENDPOINTS.chat, {
      method: 'POST',
      body: JSON.stringify(TEST_DATA.validChat)
    });
    
    const data = await parseResponse(response);
    
    const success = 
      response.status === 200 && 
      data && 
      data.text;
    
    return recordTestResult(testName, success, response, null, {
      requestData: TEST_DATA.validChat,
      responsePreview: data && data.text ? data.text.substring(0, 100) + '...' : null
    });
  } catch (error) {
    return recordTestResult(testName, false, null, error);
  }
}

/**
 * Test: AI Chat - Invalid Message
 */
async function testInvalidChat() {
  const testName = 'AI Chat - Invalid Message';
  logger.log(chalk.cyan(`Running test: ${testName}`));
  
  try {
    const response = await fetchWithRetry(ENDPOINTS.chat, {
      method: 'POST',
      body: JSON.stringify(TEST_DATA.invalidChat)
    });
    
    const data = await parseResponse(response);
    
    // For invalid data, we expect 400 Bad Request
    const success = response.status === 400;
    
    return recordTestResult(testName, success, response, null, {
      requestData: TEST_DATA.invalidChat,
      responseData: data
    });
  } catch (error) {
    return recordTestResult(testName, false, null, error);
  }
}

/**
 * Print summary of test results
 */
function printSummary() {
  RESULTS.endTime = new Date();
  const duration = (RESULTS.endTime - RESULTS.startTime) / 1000;
  
  logger.log('');
  logger.log(chalk.blueBright('=== Test Results Summary ==='));
  logger.log(`Duration: ${duration.toFixed(2)} seconds`);
  logger.log(chalk.green(`Passed: ${RESULTS.passed} tests`));
  logger.log(chalk.red(`Failed: ${RESULTS.failed} tests`));
  if (RESULTS.skipped > 0) {
    logger.log(chalk.yellow(`Skipped: ${RESULTS.skipped} tests`));
  }
  logger.log(chalk.blueBright(`Total: ${RESULTS.passed + RESULTS.failed + RESULTS.skipped} tests`));
  
  // List failed tests
  if (RESULTS.failed > 0) {
    logger.log('');
    logger.log(chalk.red('Failed tests:'));
    RESULTS.tests
      .filter(test => !test.success)
      .forEach(test => {
        logger.log(chalk.red(`- ${test.name}${test.error ? ': ' + test.error : ''}`));
      });
  }
  
  // Save results to file
  if (CONFIG.logToFile) {
    const summary = {
      timestamp: new Date().toISOString(),
      duration,
      passed: RESULTS.passed,
      failed: RESULTS.failed,
      skipped: RESULTS.skipped,
      tests: RESULTS.tests
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'api-test-summary.json'),
      JSON.stringify(summary, null, 2),
      { flag: 'w' }
    );
    
    logger.log(`Detailed results saved to: ${path.join(__dirname, 'api-test-summary.json')}`);
  }
  
  // Return appropriate exit code
  return RESULTS.failed === 0;
}

/**
 * Run all tests
 */
async function runTests() {
  try {
    initializeTest();
    
    // First get CSRF token
    await testGetCsrfToken();
    
    // Basic endpoints
    await testHealthEndpoint();
    await testDebugEndpoint();
    
    // Contact form endpoints
    await testValidContact();
    await testInvalidContact();
    
    // Newsletter subscription endpoints
    await testValidSubscription();
    await testInvalidSubscription();
    
    // AI chat endpoints
    await testValidChat();
    await testInvalidChat();
    
    // Print summary
    const success = printSummary();
    
    // Exit with appropriate code
    process.exit(success ? 0 : 1);
  } catch (error) {
    logger.error('Fatal error during test execution:', error);
    process.exit(1);
  }
}

// Run all tests
runTests();