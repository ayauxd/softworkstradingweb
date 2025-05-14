import fetch from 'node-fetch';

async function debugCSRF() {
  try {
    console.log("Debugging CSRF endpoint...");
    
    // Get CSRF token and examine the raw response
    const response = await fetch('http://127.0.0.1:5001/api/csrf');
    console.log("Status:", response.status, response.statusText);
    console.log("Content-Type:", response.headers.get('content-type'));
    
    // Get the response as text first to see what's actually being returned
    const responseText = await response.text();
    console.log("\nResponse text (first 500 chars):", responseText.substring(0, 500));
    
    // Try parsing as JSON if it looks like JSON
    if (responseText.trim().startsWith('{') && responseText.trim().endsWith('}')) {
      try {
        const data = JSON.parse(responseText);
        console.log("\nParsed JSON data:", data);
      } catch (e) {
        console.log("\nCould not parse response as JSON:", e.message);
      }
    } else {
      console.log("\nResponse is not in JSON format");
    }
    
    // Make a second request to see if it's a configuration issue or an intermittent problem
    console.log("\n\nMaking a second request to API endpoint...");
    const response2 = await fetch('http://127.0.0.1:5001/api');
    console.log("Status:", response2.status, response2.statusText);
    console.log("Content-Type:", response2.headers.get('content-type'));
    
    const responseText2 = await response2.text();
    console.log("\nResponse text (first 500 chars):", responseText2.substring(0, 500));
    
  } catch (error) {
    console.error("Error debugging CSRF:", error);
  }
}

debugCSRF().catch(console.error);