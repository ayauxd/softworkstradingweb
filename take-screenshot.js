const puppeteer = require('puppeteer');
const os = require('os');
const path = require('path');

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the URL
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle2' // Wait until network is idle
    });
    
    // Additional wait time to ensure everything loads
    await page.waitForTimeout(5000);
    
    // Create a temporary file path
    const screenshotPath = path.join(os.tmpdir(), `screenshot-${Date.now()}.png`);
    
    // Take a screenshot
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    // Output the path so it can be read
    console.log(screenshotPath);
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
})();