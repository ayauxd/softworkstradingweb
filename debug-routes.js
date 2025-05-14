import fetch from 'node-fetch';

async function checkRoutes() {
  const baseUrl = 'http://127.0.0.1:5001';
  
  // 1. Check if server is running at all
  console.log("Checking if server is running...");
  try {
    const response = await fetch(`${baseUrl}/`);
    console.log(`Server root endpoint: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error(`Server root endpoint failed: ${error.message}`);
  }
  
  // 2. Check CSRF endpoint
  console.log("\nChecking CSRF endpoint...");
  try {
    const response = await fetch(`${baseUrl}/api/csrf`);
    if (response.ok) {
      const data = await response.json();
      console.log(`CSRF endpoint works: ${response.status} ${response.statusText}`);
      console.log(`Token received: ${data.token ? 'Yes' : 'No'}`);
    } else {
      console.error(`CSRF endpoint error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`CSRF endpoint failed: ${error.message}`);
  }
  
  // 3. Check API routes available
  console.log("\nChecking available API routes...");
  try {
    const response = await fetch(`${baseUrl}/api`);
    console.log(`API endpoint: ${response.status} ${response.statusText}`);
    if (response.ok) {
      try {
        const text = await response.text();
        console.log(`API response: ${text.substring(0, 100)}...`);
      } catch (e) {
        console.log("Couldn't parse API response");
      }
    }
  } catch (error) {
    console.error(`API endpoint failed: ${error.message}`);
  }
}

// Run the checks
checkRoutes().catch(console.error);