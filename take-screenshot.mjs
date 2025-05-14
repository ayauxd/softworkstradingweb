import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

async function takeScreenshot() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    // Enable console logging
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url()));
    
    // Navigate to the website
    console.log('Navigating to http://localhost:8000...');
    const response = await page.goto('http://localhost:8000', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('Response status:', response.status());
    console.log('Response headers:', response.headers());
    
    // Wait additional time for any animations or delayed content
    console.log('Waiting for 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Get page title and content info
    const title = await page.title();
    console.log('Page title:', title);
    
    const bodyContent = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
    console.log('Body content (first 500 chars):', bodyContent);
    
    // Set viewport to a reasonable size
    await page.setViewport({
      width: 1280,
      height: 900
    });
    
    // Take a screenshot
    const screenshotPath = join(tmpdir(), `softworks-website-${Date.now()}.png`);
    console.log('Taking screenshot:', screenshotPath);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved to:', screenshotPath);
    
    return screenshotPath;
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshot();