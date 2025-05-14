/**
 * Simple script to take a screenshot of the website
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function takeScreenshot() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    console.log('Navigating to http://localhost:5000...');
    await page.goto('http://localhost:5000', { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('Page loaded, taking screenshot...');
    
    // Create screenshots directory if it doesn't exist
    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }
    
    // Take screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = path.join(screenshotsDir, `screenshot-${timestamp}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`Screenshot saved to ${screenshotPath}`);
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshot();