# API Testing Guide for SoftworksTradingWeb

This guide provides instructions for testing the backend API endpoints of the SoftworksTradingWeb application using the provided test scripts.

## Prerequisites

Before running the tests, ensure that:

1. The server is running locally on port 3000 (or update the `BASE_URL` in the scripts)
2. Node.js is installed (version 18.0.0 or higher)
3. Required npm packages are installed:
   ```bash
   npm install node-fetch chalk
   ```

## Available Test Scripts

### 1. Basic Test Script: `test-api-endpoints.js`

This script provides a simple way to verify that all API endpoints are functioning correctly.

- Tests all major API endpoints
- Handles CSRF token acquisition
- Provides colored console output
- Reports test results with pass/fail status

#### Usage:

```bash
node test-api-endpoints.js
```

### 2. Running Individual Endpoint Tests

If you want to test specific endpoints individually:

```bash
# Set the TEST_SPECIFIC_ENDPOINT environment variable
# Options: health, debug, csrf, contact, subscribe, chat, error
TEST_SPECIFIC_ENDPOINT=contact node test-api-endpoints.js
```

## Tested Endpoints

The test scripts verify the following endpoints:

1. **Health Check**: `/api/health`
   - Verifies that the API is up and running

2. **Debug Information**: `/api/debug`
   - Checks the debug endpoint for system information

3. **CSRF Token**: `/api/csrf-token`
   - Tests the acquisition of CSRF tokens for protected mutations

4. **Contact Form**: `/api/contact`
   - Tests submission of contact form data
   - Validates proper handling of required fields

5. **Newsletter Subscription**: `/api/subscribe`
   - Tests newsletter subscription functionality
   - Checks handling of optional fields

6. **AI Chat**: `/api/ai/chat`
   - Verifies AI chat functionality
   - Tests conversation tracking

7. **Error Handling**: 
   - Tests proper validation and error responses
   - Ensures appropriate HTTP status codes are returned

## Interpreting Test Results

The test scripts provide a summary of results at the end of execution:

```
=== TEST SUMMARY ===
Total tests: 7
Passed: 7
Failed: 0

✅ All tests passed!
```

If any tests fail, review the error messages for details on what went wrong. Common issues include:

- Server not running
- Incorrect port configuration
- Missing CSRF token
- Invalid request body format
- Backend dependencies not configured (e.g., AI service providers)

## Troubleshooting

If you encounter errors while running the tests:

1. **CSRF Token Issues**:
   - Ensure the CSRF middleware is properly configured
   - Check that the token is being sent in the correct header

2. **Connection Refused**:
   - Verify the server is running
   - Check the port configuration

3. **Validation Errors**:
   - Review the schema requirements in `server/schemas/api.ts`
   - Ensure test data meets all validation criteria

4. **AI Service Errors**:
   - Verify that environment variables for AI services are configured
   - Check service credentials and quotas

## Extending the Tests

To add more test cases:

1. Add new test functions to the script
2. Follow the existing pattern of incrementing counters
3. Use the helper functions for making requests
4. Handle both success and error cases

## CI/CD Integration

These tests can be integrated into a CI/CD pipeline by:

1. Adding the tests to a test stage in your pipeline
2. Setting up a test server instance with the necessary environment
3. Using the exit code to determine test success/failure:
   ```bash
   node test-api-endpoints.js || exit 1
   ```