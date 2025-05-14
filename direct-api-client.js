import fetch from 'node-fetch';

/**
 * A direct API client to test the AI endpoints with a mock CSRF token
 * This bypasses the normal CSRF flow since we're having issues with the CSRF endpoint
 */
async function directApiTest() {
  try {
    console.log("Testing direct API access to AI endpoints...");
    
    // Create a mock CSRF token (normally this would come from the server)
    const mockCsrfToken = 'mock_csrf_token_for_testing_' + Date.now();
    
    // Define the conversation ID
    const conversationId = `test_${Date.now()}`;
    
    console.log(`Using mock CSRF token: ${mockCsrfToken}`);
    console.log(`Conversation ID: ${conversationId}`);
    
    // Test chat endpoint with direct access
    console.log("\nAttempting direct chat API request...");
    
    // Prepare the request body
    const requestBody = {
      message: "What are your services for healthcare companies?",
      conversationId
    };
    
    console.log("Request body:", JSON.stringify(requestBody, null, 2));
    
    // Make the API request
    const response = await fetch('http://127.0.0.1:5001/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': mockCsrfToken
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log("Status:", response.status, response.statusText);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));
    
    const contentType = response.headers.get('content-type');
    console.log("Content-Type:", contentType);
    
    // Handle different response types appropriately
    if (contentType && contentType.includes('application/json')) {
      const jsonResponse = await response.json();
      console.log("\nJSON Response:", JSON.stringify(jsonResponse, null, 2));
      return jsonResponse;
    } else {
      const textResponse = await response.text();
      console.log("\nText Response (first 500 chars):", textResponse.substring(0, 500));
      return { text: textResponse, success: false };
    }
    
  } catch (error) {
    console.error("Error in direct API test:", error);
    return { success: false, error: error.message };
  }
}

// Execute the test
directApiTest()
  .then(result => {
    console.log("\nTest completed.");
    if (result.success) {
      console.log("SUCCESS: The AI chat endpoint is working correctly!");
    } else {
      console.log("FAILED: The AI chat endpoint is not working correctly.");
    }
  })
  .catch(error => {
    console.error("Fatal error:", error);
  });