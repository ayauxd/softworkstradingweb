const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');

(async () => {
  // Launch a new browser instance
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  
  // Create a new page
  const page = await browser.newPage();
  
  // Navigate to the local file
  await page.goto('file:///Users/fredpro/SoftworksTradingWeb/dist/public/index.html');
  
  // Wait for the page to load
  await page.waitForTimeout(2000);
  
  // Generate a unique filename in the temp directory
  const screenshotPath = path.join(os.tmpdir(), `screenshot-${Date.now()}.png`);
  
  // Take a screenshot
  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });
  
  // Output the path to the screenshot
  console.log(screenshotPath);
  
  // Close the browser
  await browser.close();
})();