import fetch from 'node-fetch';

async function testChat() {
  try {
    console.log("Testing chat API with fixed knowledge base...\n");
    
    // Get CSRF token
    console.log("Step 1: Getting CSRF token...");
    const csrfResponse = await fetch('http://127.0.0.1:5001/api/csrf');
    if (!csrfResponse.ok) {
      throw new Error(`Failed to get CSRF token: ${csrfResponse.status} ${csrfResponse.statusText}`);
    }
    
    const csrfData = await csrfResponse.json();
    if (!csrfData.token) {
      throw new Error("CSRF token not found in response");
    }
    
    const token = csrfData.token;
    console.log("✓ Got CSRF token:", token.substring(0, 10) + "...");
    
    // Test chat endpoint with a question that requires knowledge base
    console.log("\nStep 2: Testing chat endpoint with knowledge base query...");
    const chatResponse = await fetch('http://127.0.0.1:5001/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      },
      body: JSON.stringify({
        message: "What are your services for healthcare companies?",
        conversationId: `test_${Date.now()}`
      })
    });
    
    if (!chatResponse.ok) {
      throw new Error(`Chat request failed: ${chatResponse.status} ${chatResponse.statusText}`);
    }
    
    const result = await chatResponse.json();
    console.log("✓ Chat response received successfully!");
    console.log("\n========== AI RESPONSE ==========\n");
    console.log(result.text);
    console.log("\n=================================\n");
    console.log("Response Provider:", result.provider);
    console.log("Success:", result.success);
    console.log("Conversation ID:", result.conversationId);
    
    // Check if the response contains healthcare-specific information from the knowledge base
    const healthcareTerms = [
      "healthcare", "clinical", "patient", "compliance", 
      "documentation", "recruitment", "screening", "administrative burden"
    ];
    
    const responseContainsHealthcareKnowledge = healthcareTerms.some(term => 
      result.text.toLowerCase().includes(term.toLowerCase())
    );
    
    console.log("\nValidation: Response contains healthcare-specific information:", 
      responseContainsHealthcareKnowledge ? "✓ YES" : "❌ NO");
    
    return result;
  } catch (error) {
    console.error("Error testing chat:", error);
  }
}

// Call the test function
testChat().then(() => console.log("Test complete"));