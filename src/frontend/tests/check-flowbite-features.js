const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function checkFlowbiteFeatures() {
  console.log('Starting feature check...');
  
  // Use a more robust browser launch to avoid protocol timeouts
  const browser = await puppeteer.launch({
    headless: false, // Use non-headless to avoid some protocol issues
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
    defaultViewport: null,
    slowMo: 100 // Slow down operations to avoid race conditions
  });
  
  try {
    const page = await browser.newPage();
    
    // Visit the homepage
    console.log('Navigating to homepage...');
    await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' });
    
    // Wait for a short time and take a screenshot
    await wait(3000);
    await page.screenshot({ path: path.join(screenshotsDir, 'home-page.png') });
    console.log('Screenshot saved: home-page.png');
    
    // Now check for the login page
    console.log('Navigating to login page...');
    await page.goto('http://localhost:8080/login', { waitUntil: 'domcontentloaded' });
    await wait(3000);
    await page.screenshot({ path: path.join(screenshotsDir, 'login-page.png') });
    console.log('Screenshot saved: login-page.png');
    
    // Try to log in with correct credentials
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    if (emailInput && passwordInput && submitButton) {
      console.log('Filling login form...');
      // Use the proper credentials shown in the alert
      await emailInput.type('test@example.com');
      await passwordInput.type('password');
      await submitButton.click();
      
      await wait(3000);
      await page.screenshot({ path: path.join(screenshotsDir, 'after-login.png') });
      console.log('Screenshot saved: after-login.png');
    }
    
    // Bypass authentication if needed by directly accessing protected routes
    // This approach works if your router doesn't strictly enforce authentication on the client side
    console.log('Attempting to bypass authentication to access protected routes...');
    
    // Set localStorage token if that's how your app handles auth
    await page.evaluate(() => {
      // Simulate being logged in by adding a dummy token
      localStorage.setItem('authToken', 'dummy-token-for-testing');
      // Also mock the isAuthenticated flag if your app uses it
      localStorage.setItem('isAuthenticated', 'true');
    });
    
    // Check protected routes where FlowbiteWithRouter would be rendered
    const protectedRoutes = [
      '/dashboard',
      '/auctions',
      '/properties'
    ];
    
    for (const route of protectedRoutes) {
      console.log(`Checking route: ${route}`);
      await page.goto(`http://localhost:8080${route}`, { waitUntil: 'domcontentloaded' });
      await wait(3000);
      
      // Take screenshot
      await page.screenshot({ 
        path: path.join(screenshotsDir, `route-${route.replace(/\//g, '-')}.png`),
        fullPage: true
      });
      console.log(`Screenshot saved: route-${route.replace(/\//g, '-')}.png`);
      
      // Check for Flowbite components
      const routeFeatures = await page.evaluate(() => {
        const findElements = (selectors) => {
          let results = {};
          for (const key in selectors) {
            const elements = document.querySelectorAll(selectors[key]);
            results[key] = elements.length;
          }
          return results;
        };
        
        // Check for basic elements
        const elementsCount = findElements({
          sidebar: '.sidebar, [class*="sidebar"]',
          navbar: '.navbar, [class*="navbar"]',
          bgGray: '[class*="bg-gray"]',
          buttons: 'button',
          card: '.card, [class*="card"]',
          flexElements: '[class*="flex"]',
          tailwindClasses: '[class*="md:"], [class*="lg:"], [class*="dark:"]',
        });
        
        // HTML content for debugging
        const htmlContent = document.documentElement.innerHTML.substring(0, 1000);
        
        return {
          elementsCount,
          pageTitle: document.title,
          url: window.location.href,
          htmlContent
        };
      });
      
      console.log(`Route ${route} features:`, routeFeatures.elementsCount);
    }
    
    // Try checking for advanced features (desktop view)
    console.log('Checking for advanced features in desktop view...');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:8080/dashboard', { waitUntil: 'domcontentloaded' });
    await wait(3000);
    
    // Take a screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'desktop-dashboard.png'),
      fullPage: true 
    });
    console.log('Screenshot saved: desktop-dashboard.png');
    
    // Look for collapsible sidebar button
    const buttons = await page.$$('button');
    console.log(`Found ${buttons.length} buttons on desktop view`);
    
    // If we found buttons, try clicking the first one (it might be the collapsible sidebar button)
    if (buttons.length > 0) {
      await buttons[0].click();
      await wait(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'after-button-click.png'),
        fullPage: true 
      });
      console.log('Screenshot saved: after-button-click.png');
    }
    
    // Try mobile view
    console.log('Checking mobile view...');
    await page.setViewport({ width: 414, height: 896 });
    await wait(3000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'mobile-view.png'),
      fullPage: true 
    });
    console.log('Screenshot saved: mobile-view.png');
    
    // Look for hamburger menu button in mobile view
    const mobileButtons = await page.$$('button');
    console.log(`Found ${mobileButtons.length} buttons on mobile view`);
    
    // If we found buttons in mobile view, try clicking the first one (it might be the hamburger button)
    if (mobileButtons.length > 0) {
      await mobileButtons[0].click();
      await wait(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'mobile-menu.png'),
        fullPage: true 
      });
      console.log('Screenshot saved: mobile-menu.png');
    }
    
    return {
      success: true,
      screenshots: fs.readdirSync(screenshotsDir)
        .filter(file => file.endsWith('.png'))
        .map(file => path.join(screenshotsDir, file))
    };
  } catch (error) {
    console.error('Test failed:', error);
    return {
      success: false,
      error: error.toString()
    };
  } finally {
    // Keep browser open for a moment to see results
    await wait(5000);
    await browser.close();
  }
}

// Run the test and print results
checkFlowbiteFeatures().then(result => {
  console.log('=== TEST RESULTS ===');
  
  if (result.success) {
    console.log(`✅ TEST COMPLETED - ${result.screenshots.length} screenshots captured`);
    console.log('Screenshots saved to:', screenshotsDir);
    console.log('Screenshots:');
    result.screenshots.forEach(screenshot => {
      console.log(`- ${path.basename(screenshot)}`);
    });
    
    console.log('\nIMPORTANT: Review the screenshots to confirm advanced features are present:');
    console.log('1. Collapsible sidebar: Check before/after button click screenshots');
    console.log('2. Mobile menu: Check mobile view and mobile menu screenshots');
    console.log('3. React Router integration: Check different route screenshots');
  } else {
    console.log('❌ TEST FAILED');
    console.log(result.error);
  }
}); 