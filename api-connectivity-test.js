/**
 * API Connectivity Test Script
 * 
 * This script tests connectivity to the API endpoints on Render
 * to verify they are accessible.
 */

import fetch from 'node-fetch';

const API_BASE_URL = 'https://softworks-trading.onrender.com';
const endpoints = [
  '/api/health',
  '/api/csrf-token',
  '/api/ai/chat', // POST endpoint
];

async function testEndpoint(endpoint) {
  console.log(`Testing endpoint: ${endpoint}`);
  
  try {
    // Default to GET method
    const isPostEndpoint = endpoint.includes('/api/ai/');
    const method = isPostEndpoint ? 'POST' : 'GET';
    
    // Set up request options
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    // Add body for POST endpoints
    if (method === 'POST') {
      options.body = JSON.stringify({
        message: 'Hello - API connectivity test',
        conversationId: 'test-' + Date.now()
      });
    }
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    // Check response status
    if (response.ok) {
      console.log(`✅ Status: ${response.status}, OK`);
      
      // Try to get JSON response if possible
      try {
        const data = await response.json();
        console.log('Response data:', JSON.stringify(data).substring(0, 150) + '...');
      } catch (error) {
        // Not JSON or other issue
        const text = await response.text();
        console.log('Response text:', text.substring(0, 150) + '...');
      }
    } else {
      console.error(`❌ Status: ${response.status}, ${response.statusText}`);
      const text = await response.text();
      console.error('Error response:', text.substring(0, 150) + '...');
    }
  } catch (error) {
    console.error(`❌ Connection error: ${error.message}`);
  }
  
  console.log('-----------------------------------');
}

async function runTests() {
  console.log('🧪 Testing API connectivity to Render deployment');
  console.log(`🔗 Base URL: ${API_BASE_URL}`);
  console.log('===================================');
  
  // Test each endpoint
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }
  
  console.log('🏁 API connectivity tests completed');
}

runTests();