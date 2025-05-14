// MCP Demonstration Test for SoftworksTradingWeb

// Import necessary modules
import puppeteer from 'puppeteer-mcp-server';

async function testPuppeteerMCP() {
  console.log("Starting Puppeteer MCP test...");
  
  try {
    // Launch a browser instance
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // Navigate to the project's local test page
    await page.goto('http://localhost:3000');
    
    // Take a screenshot
    await page.screenshot({ path: 'mcp-test-screenshot.png' });
    
    // Get page title
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Close the browser
    await browser.close();
    console.log("Puppeteer MCP test completed successfully!");
  } catch (error) {
    console.error("Puppeteer MCP test failed:", error);
  }
}

// Run the test
testPuppeteerMCP();