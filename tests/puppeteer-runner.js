const puppeteer = require('puppeteer');

async function runTests() {
  console.log('Starting UI tests...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: false, // Use non-headless mode to see what's happening
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Test 1: Check if home page loads
    console.log('Testing home page load...');
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
    console.log('Home page loaded successfully.');

    // Take a screenshot to debug
    await page.screenshot({ path: 'home-page.png' });
    
    // Test 2: Check if navigation to login works
    console.log('Testing navigation to login page...');
    
    // Use a button text selector instead of the link
    await page.waitForSelector('button:has-text("Sign In")', { timeout: 10000 });
    await page.click('button:has-text("Sign In")');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    // Take a screenshot after navigation
    await page.screenshot({ path: 'login-page.png' });
    
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.log('Navigation to login page successful!');
    } else {
      throw new Error(`Navigation to login failed. Current URL: ${currentUrl}`);
    }
    
    console.log('UI tests completed successfully!');
  } catch (error) {
    console.error('UI test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the tests
runTests(); 