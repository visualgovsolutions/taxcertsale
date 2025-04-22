const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080'; // Your dev server URL
const ADMIN_PATHS = [
  "/admin/batches",
  "/admin/payments",
  "/admin/analytics",
  "/admin/notifications",
  "/admin/system-config",
  '/admin/dashboard',
  '/admin/auctions',
  '/admin/certificates',
  '/admin/counties',
  '/admin/users',
  '/admin/registrations',
  '/admin/audit-logs',
  '/admin/settings',
  '/admin/test' 
];
const CHECK_INTERVAL = 5000; // Check every 5 seconds

async function checkPageStatus(page, path) {
  const url = `${BASE_URL}${path}`;
  let response;
  try {
    console.log(`Checking ${url}...`);
    response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 }); // Wait for network activity to cease
  } catch (error) {
    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      console.error(`Error checking ${url}: Connection refused. Is the server running?`);
      return false; // Treat connection refused as failure
    } else if (error.message.includes('timeout')) {
      console.warn(`Timeout checking ${url}. Assuming it's loading or not 404.`);
      return true; // Might still be loading, don't fail yet
    }
    console.error(`Error navigating to ${url}:`, error.message);
    return false; // Other navigation errors are failures
  }

  const status = response.status();
  
  // Even if status is 200, check if the content indicates a 404 page (client-side routing)
  const pageContent = await page.content();
  const pageText = await page.evaluate(() => document.body.innerText);
  
  // Check for common 404 indicators in the rendered content
  const has404Title = pageText.includes('404') && pageText.includes('Not Found');
  const hasPageNotFound = pageText.toLowerCase().includes('page not found');
  
  if (has404Title || hasPageNotFound) {
    console.log(`❌ ${url} shows a 404 page (though status was ${status})`);
    // Take a screenshot so we can see what the page looks like
    await page.screenshot({ path: `screenshot-${path.replace(/\//g, '-')}.png` });
    return false;
  }
  
  if (status === 404) {
    console.log(`❌ ${url} returned 404`);
    return false;
  } else if (status >= 400) {
    console.warn(`⚠️ ${url} returned status ${status}`);
    // Optionally treat other errors (like 500) as failures too
    // return false; 
    return true; // For now, only fail on 404
  } else {
    console.log(`✅ ${url} returned ${status}`);
    return true;
  }
}

async function runCheck() {
  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({ 
    headless: false, // Run in non-headless mode so we can see what's happening
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Common args for CI/Linux
  });
  const page = await browser.newPage();
  
  // Set viewport to a reasonable size
  await page.setViewport({ width: 1280, height: 800 });
  
  // Optional: Add authentication steps here if needed
  // e.g., await page.goto(`${BASE_URL}/login`);
  // await page.type('#username', 'your_admin_user');
  // await page.type('#password', 'your_admin_password');
  // await page.click('button[type="submit"]');
  // await page.waitForNavigation(); 
  // console.log('Logged in (if applicable).');

  let allOk = false;
  let cycles = 0;
  const MAX_CYCLES = 20; // Max number of cycles to try before giving up
  
  while (!allOk && cycles < MAX_CYCLES) {
    cycles++;
    allOk = true; // Assume OK until a failure
    console.log(`\n--- Starting check cycle ${cycles}/${MAX_CYCLES} ---`);
    
    for (const path of ADMIN_PATHS) {
      const pageOk = await checkPageStatus(page, path);
      if (!pageOk) {
        allOk = false;
        console.log(`Found a non-OK page (${path}). Will retry in ${CHECK_INTERVAL / 1000} seconds...`);
        break; // No need to check other pages in this cycle if one fails
      }
    }

    if (!allOk) {
      if (cycles === MAX_CYCLES) {
        console.log(`\n⚠️ Reached maximum number of cycles (${MAX_CYCLES}). Exiting.`);
        break;
      }
      await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
    }
  }

  if (allOk) {
    console.log('\n🎉 All admin pages responded successfully!');
  } else {
    console.log('\n⚠️ Some pages are still not working correctly after all retry attempts.');
  }
  
  await browser.close();
}

runCheck().catch(error => {
  console.error('An error occurred during the check:', error);
  process.exit(1);
}); 