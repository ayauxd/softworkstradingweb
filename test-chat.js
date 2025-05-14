import fetch from 'node-fetch';

async function testChat() {
  try {
    console.log("Testing chat API with new knowledge base...");
    
    // Get CSRF token
    const csrfResponse = await fetch('http://127.0.0.1:5001/api/csrf');
    if (!csrfResponse.ok) {
      throw new Error(`Failed to get CSRF token: ${csrfResponse.status}`);
    }
    
    const { token } = await csrfResponse.json();
    console.log("Got CSRF token:", token);
    
    // Test chat endpoint
    const chatResponse = await fetch('http://127.0.0.1:5001/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      },
      body: JSON.stringify({
        message: "Tell me about Softworks Trading Company. What industries do you serve?",
        conversationId: `test_${Date.now()}`
      })
    });
    
    if (!chatResponse.ok) {
      throw new Error(`Chat request failed: ${chatResponse.status}`);
    }
    
    const result = await chatResponse.json();
    console.log("\n\nAI RESPONSE:\n");
    console.log(result.text);
    console.log("\n\nProvider:", result.provider);
    console.log("Success:", result.success);
    
    return result;
  } catch (error) {
    console.error("Error testing chat:", error);
  }
}

// Call the test function
testChat().then(() => console.log("Test complete"));