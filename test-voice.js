import fetch from 'node-fetch';
import fs from 'fs';

async function testVoice() {
  try {
    console.log("Testing voice API with new knowledge base...");
    
    // Get CSRF token
    const csrfResponse = await fetch('http://127.0.0.1:5001/api/csrf');
    if (!csrfResponse.ok) {
      throw new Error(`Failed to get CSRF token: ${csrfResponse.status}`);
    }
    
    const { token } = await csrfResponse.json();
    console.log("Got CSRF token:", token);
    
    // Test voice endpoint with a short message
    const voiceResponse = await fetch('http://127.0.0.1:5001/api/ai/voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      },
      body: JSON.stringify({
        text: "Welcome to Softworks Trading Company. We help businesses implement practical, no-code AI solutions that save time and scale operations."
      })
    });
    
    if (!voiceResponse.ok) {
      throw new Error(`Voice request failed: ${voiceResponse.status}`);
    }
    
    const result = await voiceResponse.json();
    console.log("\n\nVOICE RESPONSE:\n");
    console.log("Audio data length:", result.audioData ? result.audioData.length : 0);
    console.log("Provider:", result.provider);
    console.log("Success:", result.success);
    
    // Save audio to file if successful
    if (result.success && result.audioData) {
      const buffer = Buffer.from(result.audioData, 'base64');
      fs.writeFileSync('test-voice-output.mp3', buffer);
      console.log("\nAudio saved to test-voice-output.mp3");
    }
    
    return result;
  } catch (error) {
    console.error("Error testing voice:", error);
  }
}

// Call the test function
testVoice().then(() => console.log("Test complete"));