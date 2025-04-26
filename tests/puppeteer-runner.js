const puppeteer = require('puppeteer');

/**
 * UI Test Runner 
 * 
 * IMPORTANT: Port configuration was updated from 8082 to 8084 to match
 * the webpack dev server configuration. If you encounter connection errors
 * like "net::ERR_CONNECTION_REFUSED", check that:
 * 
 * 1. The port here matches the webpack server port (8084)
 * 2. The backend server is running on the correct port (8083)
 * 3. The UI is properly configured to connect to these ports
 * 
 * Also note that authentication issues may occur if the admin user
 * status is not set to "ACTIVE". Run scripts/activate-admin.ts to fix.
 */

async function runTests() {
  console.log('Starting UI tests...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: false, // Use non-headless mode to see what's happening
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--disable-features=IsolateOrigins,site-per-process'],
  });
  
  try {
    // Create a single context with all permissions
    const context = browser.defaultBrowserContext();
    await context.overridePermissions('http://localhost:8084', ['notifications']);
    
    const page = await browser.newPage();
    
    // Test 1: Check if home page loads
    console.log('Testing home page load...');
    await page.goto('http://localhost:8084', { waitUntil: 'networkidle0' });
    console.log('Home page loaded successfully.');

    // Take a screenshot to debug
    await page.screenshot({ path: 'home-page.png' });
    
    // Test 2: Check if navigation to login works
    console.log('Testing navigation to login page...');
    
    // Use a button text selector instead of the link
    await page.waitForSelector('a[href="/login"] button', { timeout: 10000 });
    await page.click('a[href="/login"] button');
    // Wait for the login form to appear (client-side routing)
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    
    // Take a screenshot after navigation
    await page.screenshot({ path: 'login-page.png' });
    
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.log('Navigation to login page successful!');
    } else {
      throw new Error(`Navigation to login failed. Current URL: ${currentUrl}`);
    }
    
    // Test 3: Login as admin and extract audit log table
    console.log('Testing admin login and audit log extraction...');
    // Login form is pre-filled, just click submit
    await page.waitForSelector('button[type="submit"]', { timeout: 10000 });
    
    // Click and wait for network activity to complete (login request)
    console.log('Clicking login button...');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForResponse(
        (response) => response.url().includes('/api/auth/login') || response.url().includes('/graphql'),
        { timeout: 10000 }
      )
    ]).catch(e => console.log('No specific auth response detected, continuing...'));
    
    // Wait for potential client-side redirect using standard Promise timeout
    console.log('Waiting after login submission...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we're on a protected page or redirected back to login
    const postLoginUrl = page.url();
    console.log('URL after login attempt:', postLoginUrl);
    await page.screenshot({ path: 'post-login.png' });
    
    if (postLoginUrl.includes('/login')) {
      console.log('Still on login page. Login may have failed. Taking screenshot of possible error...');
      // Check for error message
      const errorMessage = await page.evaluate(() => {
        const errorElement = document.querySelector('[role="alert"]');
        return errorElement ? errorElement.textContent : null;
      });
      if (errorMessage) {
        console.log('Login error detected:', errorMessage);
      }
    } else {
      console.log('Login appears successful! Now on page:', postLoginUrl);
    }
    
    // Store and verify authentication
    console.log('Getting authentication cookies...');
    const cookies = await page.cookies();
    const authCookie = cookies.find(c => c.name.toLowerCase().includes('auth') || c.name.toLowerCase().includes('token') || c.name.toLowerCase().includes('session'));
    if (authCookie) {
      console.log(`Found authentication cookie: ${authCookie.name}`);
    } else {
      console.log('No obvious authentication cookie found. Cookies present:', cookies.map(c => c.name).join(', '));
    }
    
    // Navigate to audit logs directly in the same tab/session
    console.log('Navigating directly to audit logs...');
    
    // First, try clicking on a navigation link to audit logs if it exists
    try {
      const auditLogLinkExists = await page.evaluate(() => {
        // Look for any link/button that might lead to audit logs
        const links = Array.from(document.querySelectorAll('a')).filter(a => 
          a.href.includes('/audit-logs') || a.textContent.toLowerCase().includes('audit') || a.textContent.toLowerCase().includes('logs')
        );
        return links.length > 0 ? links[0].href : null;
      });
      
      if (auditLogLinkExists) {
        console.log('Found audit logs link in navigation, clicking it...');
        await page.click(`a[href*="audit-logs"]`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        // Direct navigation as fallback
        console.log('No audit logs link found, navigating directly...');
        await page.goto('http://localhost:8084/admin/audit-logs', { 
          waitUntil: 'networkidle0',
          timeout: 30000 
        });
      }
      
      // Log current URL and take screenshot
      const currentUrl = page.url();
      console.log('Current URL after navigation attempt:', currentUrl);
      await page.screenshot({ path: 'audit-logs-page.png' });
      
      // Check if we got redirected to login
      if (currentUrl.includes('/login')) {
        console.log('Redirected to login. Authentication issue detected.');
      } else {
        console.log('Successfully loaded audit logs page. Looking for table or error messages...');
        
        // Wait longer for dynamic content to load (8 seconds)
        console.log('Waiting for dynamic content to load...');
        await new Promise(resolve => setTimeout(resolve, 8000));
        await page.screenshot({ path: 'after-waiting.png' });
        
        // Check for error alert first
        const errorText = await page.evaluate(() => {
          const errorAlert = document.querySelector('[color="failure"]');
          // Look for any error messaging on the page
          if (errorAlert) return errorAlert.textContent;
          
          // Check for other error indicators
          const anyError = document.querySelector('.text-red-500, .text-red-600, .text-red-700, [role="alert"]');
          if (anyError) return anyError.textContent;
          
          return null;
        });
        
        if (errorText) {
          console.log('Error alert found on audit logs page:', errorText);
        }
        
        // Try multiple selectors for the audit log table
        const possibleTableSelectors = [
          'div.overflow-x-auto table > tbody', 
          'table > tbody',
          '.table', 
          '[data-testid="flowbite-table"]',
          'div.p-6 table'
        ];
        
        let tableFound = false;
        
        for (const selector of possibleTableSelectors) {
          try {
            const exists = await page.evaluate((sel) => {
              return Boolean(document.querySelector(sel));
            }, selector);
            
            if (exists) {
              console.log(`Found table with selector: ${selector}`);
              const tableHTML = await page.$eval(selector, el => el.outerHTML);
              console.log('Table HTML snippet:', tableHTML.substring(0, 300) + '...');
              tableFound = true;
              
              // Capture the table in a screenshot
              await page.screenshot({ path: 'audit-table-found.png' });
              break;
            }
          } catch (e) {
            console.log(`Selector "${selector}" not found`);
          }
        }
        
        if (!tableFound) {
          console.log('No audit log table found with any of the attempted selectors');
          
          // Extract and log any network requests to help diagnose API issues
          const requests = await page.evaluate(() => {
            // Look for GraphQL or API error messages in the DOM
            // (These might be shown as developer tools console messages or hidden in the DOM)
            const allElements = document.querySelectorAll('*');
            for (const elem of allElements) {
              if (elem.textContent && (
                elem.textContent.includes('400') || 
                elem.textContent.includes('error') ||
                elem.textContent.includes('failed') ||
                elem.textContent.includes('backend server')
              )) {
                return elem.textContent;
              }
            }
            return null;
          });
          
          if (requests) {
            console.log('Found potential error messages in the DOM:', requests);
          }
          
          // Get all HTML to analyze
          const pageContent = await page.content();
          console.log('Page HTML snippet:', pageContent.substring(0, 500) + '...');
          
          // Take one final screenshot of the whole page
          await page.screenshot({ path: 'final-page-state.png', fullPage: true });
        }
      }
    } catch (err) {
      console.error('Error during audit log page navigation:', err.message);
      await page.screenshot({ path: 'navigation-error.png' });
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