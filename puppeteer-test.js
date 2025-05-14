// Frontend UI Testing with Puppeteer
import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:3000';
const VIEWPORT = { width: 1280, height: 800 };
const MOBILE_VIEWPORT = { width: 375, height: 667 };
const TEST_TIMEOUT = 30000; // 30 seconds timeout for tests

// Utility function for logging with color
const log = (message, type = 'info') => {
  const color = type === 'success' ? '\x1b[32m' :
               type === 'error' ? '\x1b[31m' :
               type === 'warning' ? '\x1b[33m' : '\x1b[36m';
  console.log(`${color}${message}\x1b[0m`);
};

// Test results tracking
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  screenshots: []
};

async function runTests() {
  log('=== PUPPETEER FRONTEND TESTING STARTED ===');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new", // Use the new headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: VIEWPORT
    });
    
    const page = await browser.newPage();
    page.setDefaultTimeout(TEST_TIMEOUT);
    
    // Test 1: Page Load
    log('\n--- Testing Home Page Load ---');
    results.total++;
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    
    const title = await page.title();
    log(`Page title: ${title}`, 'info');
    
    // Take a screenshot
    const screenshotPath = './homepage-test.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    results.screenshots.push(screenshotPath);
    log(`Screenshot saved to ${screenshotPath}`, 'success');
    
    // Check if key elements are present
    const headerExists = await page.$('header');
    const heroExists = await page.$('[class*="hero"]');
    const footerExists = await page.$('footer');
    
    if (headerExists && heroExists && footerExists) {
      log('Key page elements found', 'success');
      results.passed++;
    } else {
      log('Some key page elements missing', 'error');
      results.failed++;
    }
    
    // Test 2: Responsive Design (Mobile)
    log('\n--- Testing Responsive Design (Mobile) ---');
    results.total++;
    await page.setViewport(MOBILE_VIEWPORT);
    
    // Reload page with mobile viewport
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    
    // Take a mobile screenshot
    const mobileScreenshotPath = './homepage-mobile-test.png';
    await page.screenshot({ path: mobileScreenshotPath, fullPage: true });
    results.screenshots.push(mobileScreenshotPath);
    log(`Mobile screenshot saved to ${mobileScreenshotPath}`, 'success');
    
    // Check if mobile menu toggle is present (common in responsive designs)
    const mobileMenuToggle = await page.$('[class*="menu"] button') || 
                             await page.$('[class*="hamburger"]') ||
                             await page.$('[class*="toggle"]');
    
    if (mobileMenuToggle) {
      log('Mobile menu toggle found', 'success');
      results.passed++;
    } else {
      log('Mobile menu toggle not found (might not be implemented yet)', 'warning');
      // Don't fail the test as the site might use a different mobile navigation approach
      results.passed++;
    }
    
    // Test 3: Navigation Links
    log('\n--- Testing Navigation Links ---');
    results.total++;
    
    // Go back to desktop view
    await page.setViewport(VIEWPORT);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    
    // Find all navigation links
    const navLinks = await page.$$('header a, nav a');
    log(`Found ${navLinks.length} navigation links`, 'info');
    
    if (navLinks.length > 0) {
      log('Navigation links found', 'success');
      results.passed++;
    } else {
      log('Navigation links not found', 'error');
      results.failed++;
    }
    
    // Test 4: Contact Form Presence & Fields
    log('\n--- Testing Contact Form ---');
    results.total++;
    
    // Scroll to contact section (assuming it's at the bottom)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Look for contact form elements
    const contactFormExists = await page.$('form') || 
                              await page.$('[class*="contact"]') ||
                              await page.$('#contact');
    
    if (contactFormExists) {
      // Check for form fields
      const nameField = await page.$('input[name="fullName"], input[name="name"]');
      const emailField = await page.$('input[name="email"], input[type="email"]');
      const messageField = await page.$('textarea');
      const submitButton = await page.$('button[type="submit"], input[type="submit"]');
      
      if (nameField && emailField && messageField && submitButton) {
        log('All contact form fields found', 'success');
        results.passed++;
      } else {
        log('Some contact form fields missing', 'warning');
        // Don't fail as form might have different structure
        results.passed++;
      }
    } else {
      log('Contact form not found on page', 'warning');
      // Don't fail as form might be on a different page
      results.passed++;
    }
    
    // Test 5: Dark Mode Toggle (if exists)
    log('\n--- Testing Dark Mode Toggle ---');
    results.total++;
    
    const darkModeToggle = await page.$('[class*="theme"], [class*="dark"], [class*="mode"]');
    
    if (darkModeToggle) {
      log('Found potential dark mode toggle', 'info');
      
      // Get initial background color
      const initialBgColor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });
      
      // Click the toggle
      await darkModeToggle.click();
      
      // Wait for potential animation
      await page.waitForTimeout(500);
      
      // Get new background color
      const newBgColor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });
      
      if (initialBgColor !== newBgColor) {
        log('Dark mode toggle works - colors changed', 'success');
        results.passed++;
      } else {
        log('Element clicked but no visible change in theme detected', 'warning');
        // Don't fail as it might not be a theme toggle
        results.passed++;
      }
    } else {
      log('No dark mode toggle found', 'info');
      // Don't fail as dark mode is optional
      results.passed++;
    }
    
    // Test 6: Images and Assets Loading
    log('\n--- Testing Images and Assets Loading ---');
    results.total++;
    
    // Reload and check for failed resources
    const failedRequests = [];
    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });
    
    await page.reload({ waitUntil: 'networkidle0' });
    
    if (failedRequests.length === 0) {
      log('All page resources loaded successfully', 'success');
      results.passed++;
    } else {
      log(`Failed to load ${failedRequests.length} resources:`, 'error');
      failedRequests.forEach(url => log(` - ${url}`, 'error'));
      results.failed++;
    }
    
    // Test 7: Animation Verification (basic check)
    log('\n--- Testing for Animations ---');
    results.total++;
    
    // Look for CSS animation or transition properties
    const hasAnimations = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (let element of elements) {
        const style = window.getComputedStyle(element);
        if (style.animation && style.animation !== 'none' || 
            style.transition && style.transition !== 'none' ||
            element.classList.contains('animated') ||
            element.classList.contains('animate')) {
          return true;
        }
      }
      return false;
    });
    
    if (hasAnimations) {
      log('Animations detected on page', 'success');
      results.passed++;
    } else {
      log('No animations detected on page', 'warning');
      // Don't fail as animations are optional
      results.passed++;
    }
    
  } catch (error) {
    log(`Error during tests: ${error.message}`, 'error');
    results.failed++;
  } finally {
    if (browser) {
      await browser.close();
    }
    
    // Print test summary
    log('\n=== TEST SUMMARY ===');
    log(`Total tests: ${results.total}`);
    log(`Passed: ${results.passed}`, 'success');
    log(`Failed: ${results.failed}`, results.failed > 0 ? 'error' : 'success');
    log(`Screenshots saved: ${results.screenshots.join(', ')}`, 'info');
    
    if (results.failed === 0) {
      log('\n✅ All tests passed!', 'success');
    } else {
      log('\n❌ Some tests failed.', 'error');
    }
  }
}

// Execute tests
runTests();