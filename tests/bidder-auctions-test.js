const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)){
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Helper function to save screenshots
const takeScreenshot = async (page, name) => {
  const screenshotPath = path.join(screenshotsDir, `${name}-${Date.now()}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to ${screenshotPath}`);
  return screenshotPath;
};

// Helper function to save page HTML
const savePageHtml = async (page, name) => {
  const htmlPath = path.join(screenshotsDir, `${name}-${Date.now()}.html`);
  const html = await page.content();
  fs.writeFileSync(htmlPath, html);
  console.log(`HTML saved to ${htmlPath}`);
  return htmlPath;
};

// Helper function to log current URL and page title
const logPageInfo = async (page) => {
  const url = page.url();
  const title = await page.title();
  console.log(`Current URL: ${url}`);
  console.log(`Page title: ${title}`);
};

async function testBidderAuctionsPage() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 800 }
  });
  
  let page;

  try {
    page = await browser.newPage();
    
    // Enable detailed logging
    page.on('request', request => {
      if (request.url().includes('graphql') || request.url().includes('login') || request.url().includes('bidder')) {
        console.log(`Request: ${request.method()} ${request.url()}`);
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('graphql') || response.url().includes('login') || response.url().includes('bidder')) {
        console.log(`Response: ${response.status()} ${response.url()}`);
      }
    });
    
    // Enable console logging from the browser
    page.on('console', msg => {
      console.log(`Browser console: ${msg.text()}`);
    });

    // Set longer timeouts
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(60000);

    // Log all cookies to debug session issues
    const logCookies = async () => {
      const cookies = await page.cookies();
      console.log('Current cookies:', JSON.stringify(cookies, null, 2));
    };

    // Navigate to homepage
    console.log('Navigating to homepage...');
    await page.goto('http://localhost:8084', { waitUntil: 'networkidle2' });
    await takeScreenshot(page, 'homepage');
    await logPageInfo(page);
    await logCookies();

    // Navigate to login page
    console.log('Navigating to login page...');
    await page.goto('http://localhost:8084/login', { waitUntil: 'networkidle2' });
    await takeScreenshot(page, 'login-page');
    await logPageInfo(page);

    // Fill login form
    console.log('Filling login form...');
    await page.type('input[name="email"]', 'bidder01@visualgov.com');
    await page.type('input[name="password"]', 'BidderPass1!');
    await takeScreenshot(page, 'login-form-filled');

    // Click login button
    console.log('Clicking login button...');
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    try {
      console.log('Waiting for login response...');
      await page.waitForResponse(
        (response) => response.url().includes('/api/auth/login') || response.url().includes('/graphql'),
        { timeout: 10000 }
      );
      console.log('Login response received');
    } catch (error) {
      console.log('No specific login response detected, continuing...');
    }
    
    // Wait for navigation to complete
    try {
      console.log('Waiting for navigation after login...');
      await page.waitForNavigation({ timeout: 10000 });
      console.log('Navigation completed');
    } catch (error) {
      console.log('Navigation timeout, but continuing...');
    }
    
    await takeScreenshot(page, 'after-login');
    await logPageInfo(page);
    await logCookies();
    
    // Check current URL to see if login was successful
    const currentUrl = page.url();
    console.log('Checking if login was successful based on URL:', currentUrl);
    
    if (currentUrl.includes('/login')) {
      console.log('Still on login page, login may have failed. Checking for error messages...');
      const errorText = await page.evaluate(() => {
        const errorElement = document.querySelector('.error-message') || 
                            document.querySelector('.alert-error') ||
                            document.querySelector('.text-red-500');
        return errorElement ? errorElement.textContent : 'No specific error message found';
      });
      console.log(`Error message: ${errorText}`);
      await savePageHtml(page, 'login-failed');
      
      console.log('Trying alternate login flow...');
      // Try submitting the form directly
      await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) form.submit();
      });
      
      await page.waitForTimeout(5000);
      await takeScreenshot(page, 'after-form-submit');
      await logPageInfo(page);
      await logCookies();
    }
    
    // Try to navigate directly to bidder auctions even if login failed
    console.log('Navigating to bidder auctions page directly...');
    await page.goto('http://localhost:8084/bidder/auctions', { waitUntil: 'networkidle2', timeout: 20000 });
    await takeScreenshot(page, 'bidder-auctions-page');
    await savePageHtml(page, 'bidder-auctions-page');
    await logPageInfo(page);
    await logCookies();
    
    // Check for page content or errors
    const pageContent = await page.content();
    const isLoginPage = pageContent.includes('login') || pageContent.includes('Sign in');
    
    if (isLoginPage) {
      console.log('Redirected to login page. Authentication is required.');
      console.log('Trying login on this page...');
      
      // Try to login again
      if (await page.$('input[name="email"]') !== null) {
        await page.type('input[name="email"]', 'bidder01@visualgov.com');
        await page.type('input[name="password"]', 'BidderPass1!');
        await page.click('button[type="submit"]');
        
        await page.waitForTimeout(5000);
        await takeScreenshot(page, 'second-login-attempt');
        await logPageInfo(page);
        
        // Try navigating again
        await page.goto('http://localhost:8084/bidder/auctions', { waitUntil: 'networkidle2', timeout: 20000 });
        await takeScreenshot(page, 'bidder-page-after-relogin');
        await logPageInfo(page);
      }
    }
    
    console.log('Checking for expected elements...');
    
    // Wait for specific elements
    try {
      await page.waitForSelector('.auction-cards, .auctions-container, h1:contains("Auctions"), h1, .bidder-layout, .bidder-dashboard', { 
        timeout: 10000,
        visible: true 
      });
      console.log('Found some page elements');
    } catch (error) {
      console.log('Could not find expected elements:', error.message);
      
      // Capture network requests
      const requests = await page.evaluate(() => {
        if (window.performance && window.performance.getEntries) {
          return window.performance.getEntries()
            .filter(entry => entry.name.includes('graphql') || entry.name.includes('bidder'))
            .map(entry => ({
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime,
              type: entry.entryType
            }));
        }
        return [];
      });
      
      console.log('Network requests:', JSON.stringify(requests, null, 2));
      
      // Check if there's any content at all
      const bodyContent = await page.evaluate(() => {
        return {
          innerHTML: document.body.innerHTML.substring(0, 500) + '...',
          textContent: document.body.textContent.trim().substring(0, 200) + '...',
          hasContent: document.body.textContent.trim().length > 0
        };
      });
      
      console.log('Page content preview:', bodyContent);
      
      // Check for error messages in the React app
      await page.evaluate(() => {
        console.error('DIAGNOSTIC: Checking React app state');
        if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
          console.error('React DevTools hook found');
        }
      });
    }
    
    // Take final screenshots
    await takeScreenshot(page, 'final-state');
    await savePageHtml(page, 'final-html');
    
    console.log('Test completed');
  } catch (error) {
    console.error('Test failed:', error);
    if (page) {
      await takeScreenshot(page, 'error-state');
      await savePageHtml(page, 'error-state');
    }
  } finally {
    await browser.close();
  }
}

// Run the test
testBidderAuctionsPage().catch(console.error); 