const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Screenshots directory
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

// Main test function
async function testAppLayout() {
  console.log('Starting UI tests for AppLayout...');
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  // Add console log handler
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  // Try to connect to both possible ports
  const ports = [8080, 8081];
  let connected = false;
  
  try {
    for (const port of ports) {
      try {
        console.log(`Trying to connect to port ${port}...`);
        // Test the root route first
        await page.goto(`http://localhost:${port}/`, { 
          timeout: 5000,
          waitUntil: 'domcontentloaded'
        });
        
        console.log(`Successfully connected to server on port ${port}`);
        connected = true;
        
        // Take screenshots of different routes
        await page.screenshot({ path: path.join(screenshotsDir, `1-root-page-port-${port}.png`) });
        
        console.log(`Testing /login on port ${port}:`);
        await page.goto(`http://localhost:${port}/login`, { 
          timeout: 5000,
          waitUntil: 'domcontentloaded'
        });
        await page.screenshot({ path: path.join(screenshotsDir, `2-login-page-port-${port}.png`) });
        
        // Check for 404 on this page
        const pageContent = await page.content();
        if (pageContent.includes('404') || pageContent.includes('Not Found')) {
          console.log(`WARNING: 404 Not Found detected on login page (port ${port})`);
        }
        
        // --- ADMIN PAGE TESTS ---
        const adminPages = [
          'dashboard',
          'auctions',
          'certificates',
          'users',
          'counties',
          'registrations',
          'audit-logs',
          'settings',
          'test' // <-- Added test page
        ];
        for (const pageName of adminPages) {
          const url = `http://localhost:${port}/admin/${pageName}`;
          console.log(`Testing ${url} on port ${port}:`);
          await page.goto(url, { 
            timeout: 5000,
            waitUntil: 'domcontentloaded'
          });
          await page.screenshot({ path: path.join(screenshotsDir, `${pageName}-page-port-${port}.png`) });
        }
        
        // We've found a working port, so break out of the loop
        break;
      } catch (portError) {
        console.log(`Could not connect to port ${port}: ${portError.message}`);
        // Continue to the next port
      }
    }
    
    if (!connected) {
      console.error('ERROR: Could not connect to the development server on any tried ports.');
      console.log('Make sure the development server is running on port 8080 or 8081.');
    } else {
      console.log('Tests completed. Check screenshots for results.');
    }
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testAppLayout();
