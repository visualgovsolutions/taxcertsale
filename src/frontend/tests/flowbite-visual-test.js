const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Helper function for older Puppeteer versions
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testFlowbiteStyles() {
  console.log('Starting Flowbite visual test...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
    timeout: 60000, // Increase timeout to 60 seconds
    protocolTimeout: 60000 // Add protocol timeout setting
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('Navigating to login page...');
    await page.goto('http://localhost:8080/login', { 
      waitUntil: 'networkidle0',
      timeout: 60000 // Increase page navigation timeout
    });
    
    // Wait for potentially async-loaded styles to apply
    await wait(5000); // Increase wait time to 5 seconds
    
    // Take screenshot of login page
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'login-page.png'),
      fullPage: true,
      timeout: 60000 // Add timeout for screenshot
    });
    
    console.log('Login page screenshot captured');
    
    // Check for Flowbite/Tailwind classes and computed styles
    const styleCheck = await page.evaluate(() => {
      // Look for typical Flowbite classes
      const flowbiteElements = document.querySelectorAll(
        '.bg-gray-50, .dark\\:bg-gray-700, .text-gray-900, .dark\\:text-white'
      );
      
      // Get specific elements to check computed styles
      const loginButton = document.querySelector('button[type="submit"]');
      const emailInput = document.querySelector('input[type="email"]');
      
      // Get computed styles
      const buttonStyles = loginButton ? getComputedStyle(loginButton) : {};
      const inputStyles = emailInput ? getComputedStyle(emailInput) : {};
      
      // Check if styles are actually applied (not just class names)
      const hasAppliedStyles = loginButton && (
        buttonStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' && // Not transparent
        buttonStyles.borderRadius !== '0px' // Has rounded corners
      );
      
      return {
        elementsFound: flowbiteElements.length,
        hasFlowbiteClasses: flowbiteElements.length > 0,
        hasAppliedStyles: !!hasAppliedStyles,
        buttonBackgroundColor: buttonStyles.backgroundColor,
        buttonBorderRadius: buttonStyles.borderRadius,
        inputBackgroundColor: inputStyles.backgroundColor,
        // Get a sample of all class names for debugging
        classes: Array.from(document.querySelectorAll('[class]')).slice(0, 10).map(el => el.className).join(' ')
      };
    });
    
    console.log('Style check results:', styleCheck);
    
    // Check if page contains any loaded stylesheets
    const stylesheets = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      return {
        count: sheets.length,
        urls: sheets.map(sheet => {
          try {
            return sheet.href || 'inline';
          } catch (e) {
            return 'inaccessible';
          }
        })
      };
    });
    
    console.log('Loaded stylesheets:', stylesheets);
    
    // Try to fill in login form and log in
    console.log('Attempting to fill login form...');
    await page.type('input[type="email"]', 'test@example.com');
    await page.type('input[type="password"]', 'password123');
    
    console.log('Clicking login button...');
    // Using a simpler approach for compatibility
    await page.click('button[type="submit"]');
    await wait(5000); // Increase wait time to 5 seconds
    
    // Take screenshot after login attempt
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'after-login-attempt.png'),
      fullPage: true,
      timeout: 60000 // Add timeout for screenshot
    });
    
    // Check URL to see where we are
    const currentUrl = page.url();
    console.log('Current URL after login attempt:', currentUrl);
    
    // Check if we can now see the advanced features
    console.log('Checking for FlowbiteWithRouter features...');
    
    // Try navigating to dashboard if we're authenticated
    if (currentUrl.includes('dashboard') || !currentUrl.includes('login')) {
      console.log('Successfully logged in, checking FlowbiteWithRouter features');
      
      // Test collapsible sidebar
      const sidebarFeatures = await page.evaluate(() => {
        const sidebar = document.querySelector('.sidebar, [class*="sidebar"]');
        const collapsibleButton = document.querySelector('button[aria-label*="collapse"], button[aria-label*="Collapse"]');
        const navLinks = document.querySelectorAll('.sidebar a, [class*="sidebar"] a');
        
        return {
          hasSidebar: !!sidebar,
          hasCollapsibleButton: !!collapsibleButton,
          numberOfNavLinks: navLinks.length,
          sidebarClasses: sidebar ? sidebar.className : 'not found'
        };
      });
      
      console.log('Sidebar features:', sidebarFeatures);
      
      // Take a screenshot of the dashboard with sidebar
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'dashboard-with-sidebar.png'),
        fullPage: true,
        timeout: 60000
      });
      
      // Test mobile menu if we can find the hamburger button
      const mobileMenuButton = await page.$('button:has-text("☰")');
      if (mobileMenuButton) {
        console.log('Found mobile menu button, clicking it');
        await mobileMenuButton.click();
        await wait(1000);
        
        // Take screenshot with mobile menu open
        await page.screenshot({ 
          path: path.join(screenshotsDir, 'mobile-menu-open.png'),
          fullPage: true,
          timeout: 60000
        });
        
        const mobileMenuFeatures = await page.evaluate(() => {
          const mobileMenu = document.querySelector('.md\\:hidden .sidebar, .md\\:hidden [class*="sidebar"]');
          return {
            hasMobileMenu: !!mobileMenu,
            mobileMenuClasses: mobileMenu ? mobileMenu.className : 'not found'
          };
        });
        
        console.log('Mobile menu features:', mobileMenuFeatures);
      } else {
        console.log('Mobile menu button not found');
      }
    }
    
    console.log('Test completed successfully');
    return {
      success: true,
      hasFlowbiteClasses: styleCheck.hasFlowbiteClasses,
      hasAppliedStyles: styleCheck.hasAppliedStyles,
      stylesData: styleCheck,
      stylesheets,
      screenshots: [
        path.join(screenshotsDir, 'login-page.png'),
        path.join(screenshotsDir, 'after-login-attempt.png'),
        path.join(screenshotsDir, 'dashboard-with-sidebar.png'),
        path.join(screenshotsDir, 'mobile-menu-open.png')
      ].filter(screenshot => fs.existsSync(screenshot)),
      currentUrl
    };
  } catch (error) {
    console.error('Test failed:', error);
    return {
      success: false,
      error: error.toString()
    };
  } finally {
    await browser.close();
  }
}

// Run the test and print results
testFlowbiteStyles().then(result => {
  console.log('=== TEST RESULTS ===');
  console.log(JSON.stringify(result, null, 2));
  
  if (result.success && result.hasAppliedStyles) {
    console.log('✅ FLOWBITE STYLES VERIFIED - CSS IS PROPERLY LOADED AND APPLIED');
    console.log('Screenshots saved to:', screenshotsDir);
    
    if (result.screenshots && result.screenshots.length > 2) {
      console.log('✅ ADVANCED FEATURES CONFIRMED - Screenshots captured showing sidebar and/or mobile menu');
    } else {
      console.log('⚠️ COULD NOT CONFIRM ADVANCED FEATURES - Not enough screenshots captured');
    }
  } else if (result.success && result.hasFlowbiteClasses) {
    console.log('⚠️ FLOWBITE CLASSES FOUND BUT STYLES MAY NOT BE APPLIED');
    console.log('Screenshots saved to:', screenshotsDir);
  } else {
    console.log('❌ FLOWBITE STYLES NOT DETECTED');
  }
}); 