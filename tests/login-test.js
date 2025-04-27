const puppeteer = require('puppeteer');
require('dotenv').config();

const BASE_URL = process.env.TEST_URL || 'http://localhost:8084';
const ADMIN_EMAIL = 'admin@visualgov.com';
const ADMIN_PASSWORD = 'password123';

// Helper function to log with timestamps
function logWithTime(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

async function runLoginTest() {
  logWithTime('Starting login test...');
  
  let browser;
  try {
    // Launch browser in non-headless mode to see what's happening
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: null,
      args: ['--window-size=1366,768'] 
    });
    
    const page = await browser.newPage();
    
    // Set a longer timeout and enable request interception to log network activity
    page.setDefaultTimeout(15000);
    await page.setRequestInterception(true);
    
    // Log all requests and responses
    page.on('request', request => {
      if (request.resourceType() === 'graphql') {
        logWithTime(`GraphQL Request: ${request.url()}`);
        try {
          const postData = request.postData();
          if (postData) {
            logWithTime(`GraphQL Payload: ${postData}`);
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
      request.continue();
    });
    
    page.on('response', async response => {
      const url = response.url();
      if (url.includes('graphql')) {
        logWithTime(`GraphQL Response: ${response.status()} from ${url}`);
        try {
          const responseBody = await response.text();
          logWithTime(`GraphQL Response Body: ${responseBody}`);
        } catch (e) {
          logWithTime(`Error reading response body: ${e.message}`);
        }
      }
    });
    
    // Listen for console events from the page
    page.on('console', msg => {
      const messageType = msg.type();
      const text = msg.text();
      
      // Only log errors and warnings
      if (messageType === 'error' || messageType === 'warning') {
        logWithTime(`Browser Console ${messageType.toUpperCase()}: ${text}`);
      }
    });
    
    // Navigate to login page
    logWithTime(`Navigating to ${BASE_URL}/login`);
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    
    await page.screenshot({ path: 'login-page.png', fullPage: true });
    logWithTime('Login page loaded. Screenshot saved as login-page.png');
    
    // Wait for login form elements
    await page.waitForSelector('input[type="email"]');
    await page.waitForSelector('input[type="password"]');
    
    // Fill the login form
    logWithTime(`Entering email: ${ADMIN_EMAIL}`);
    await page.type('input[type="email"]', ADMIN_EMAIL);
    
    logWithTime('Entering password');
    await page.type('input[type="password"]', ADMIN_PASSWORD);
    
    // Take screenshot of filled form
    await page.screenshot({ path: 'login-form-filled.png', fullPage: true });
    
    // Submit the form
    logWithTime('Submitting login form');
    
    // Look for the login button and click it
    const loginButton = await page.$('button[type="submit"]');
    if (loginButton) {
      await loginButton.click();
    } else {
      // Try finding by text content as fallback
      const buttonSelectors = [
        'button:has-text("Login")', 
        'button:has-text("Sign In")', 
        'button:has-text("Log In")'
      ];
      
      for (const selector of buttonSelectors) {
        const button = await page.$(selector);
        if (button) {
          await button.click();
          break;
        }
      }
    }
    
    // Wait some time for the login process to complete
    await page.waitForTimeout(3000);
    
    // Take screenshot after login attempt
    await page.screenshot({ path: 'after-login-attempt.png', fullPage: true });
    
    // Get any error messages that might be displayed
    const errorMessages = await page.evaluate(() => {
      // Find all elements that might contain error messages
      const errorElements = Array.from(document.querySelectorAll('.error, .alert, .alert-danger, [role="alert"]'));
      return errorElements.map(el => el.textContent.trim());
    });
    
    if (errorMessages.length > 0) {
      logWithTime('Error messages found on page:');
      errorMessages.forEach(msg => logWithTime(`- ${msg}`));
    }
    
    // Check local storage for token to see if login succeeded
    const token = await page.evaluate(() => localStorage.getItem('accessToken'));
    
    if (token) {
      logWithTime('Login SUCCESSFUL - Auth token found in localStorage');
    } else {
      logWithTime('Login FAILED - No auth token found in localStorage');
    }
    
    // Check current URL to see if we were redirected to dashboard
    const currentUrl = page.url();
    logWithTime(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('dashboard')) {
      logWithTime('Login successful - Redirected to dashboard');
    } else {
      logWithTime('Login likely failed - Not redirected to dashboard');
    }
    
    // Wait a moment before closing to see the final state
    await page.waitForTimeout(3000);
    
    return token != null;
  } catch (error) {
    logWithTime(`TEST ERROR: ${error.message}`);
    logWithTime(error.stack);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
runLoginTest()
  .then(success => {
    if (success) {
      logWithTime('Login test completed successfully');
      process.exit(0);
    } else {
      logWithTime('Login test failed');
      process.exit(1);
    }
  })
  .catch(error => {
    logWithTime(`Error running test: ${error.message}`);
    process.exit(1);
  }); 