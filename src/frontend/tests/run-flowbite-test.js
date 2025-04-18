const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure the application is running
function checkAppRunning() {
  try {
    // Make a simple request to check if the server is running
    const result = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:8080');
    if (result.toString().trim() !== '200') {
      console.log('App is not responding with 200 status, might not be running correctly');
      return false;
    }
    return true;
  } catch (error) {
    console.log('App is not running. Please start it with "npm run dev"');
    return false;
  }
}

// Check for routing issues
function checkRoutes() {
  const routes = [
    '/',
    '/login',
    '/dashboard',
    '/auctions',
    '/properties',
    '/users',
    '/reports',
    '/settings'
  ];
  
  console.log('Checking routes accessibility...');
  const results = {};
  
  for (const route of routes) {
    try {
      const status = execSync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:8080${route}`).toString().trim();
      results[route] = status;
      console.log(`Route ${route}: ${status === '200' ? '✅' : '❌'} (${status})`);
    } catch (error) {
      results[route] = 'error';
      console.log(`Route ${route}: ❌ (error)`);
    }
  }
  
  return results;
}

// Run the tests
async function runTests() {
  console.log('=== FLOWBITE INTEGRATION TEST ===');
  
  // First, check if the app is running
  if (!checkAppRunning()) {
    console.log('Please start the application before running tests.');
    process.exit(1);
  }
  
  // Check routes
  console.log('\n=== ROUTES CHECK ===');
  const routeResults = checkRoutes();
  
  // Run the visual test
  console.log('\n=== RUNNING VISUAL TEST ===');
  try {
    execSync('node ./src/frontend/tests/flowbite-visual-test.js', { stdio: 'inherit' });
    
    // Check if screenshots were generated
    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (fs.existsSync(path.join(screenshotsDir, 'login-page.png'))) {
      console.log('\n=== SCREENSHOTS GENERATED ===');
      console.log('Screenshots are available in:', screenshotsDir);
    }
    
    console.log('\n=== TEST SUMMARY ===');
    console.log('Routes check:', Object.values(routeResults).every(r => r === '200') ? '✅' : '⚠️');
    console.log('Visual test completed. Please check the screenshots for visual confirmation.');
  } catch (error) {
    console.error('Error running visual test:', error.message);
  }
}

runTests(); 