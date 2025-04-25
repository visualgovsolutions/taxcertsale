const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Ensure screenshot directory exists
const screenshotDir = path.join(__dirname, '../e2e-screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

(async () => {
  let browser;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: true, // Run headlessly
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Recommended arguments
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 }); // Set viewport size

    const frontendUrl = 'http://localhost:8082'; // Ensure this matches your frontend port
    const loginUrl = `${frontendUrl}/login`;
    const auditLogUrl = `${frontendUrl}/admin/audit-logs`;

    // --- Login ---
    console.log(`Navigating to login page: ${loginUrl}`);
    await page.goto(loginUrl, { waitUntil: 'networkidle0' });

    console.log('Attempting login...');
    // IMPORTANT: Update credentials if necessary
    await page.type('input[name="email"]', 'admin@visualgov.com');
    await page.type('input[name="password"]', 'AdminPass1!');
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard or another authenticated page
    console.log('Waiting for navigation after login...');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(e => console.log('Navigation after login took longer than expected or failed. Continuing...'));
    console.log('Login likely successful.');

    // --- Navigate to Audit Logs ---
    console.log(`Navigating to Audit Log page: ${auditLogUrl}`);
    await page.goto(auditLogUrl, { waitUntil: 'networkidle0' });
    console.log('On Audit Log page.');

    // --- Check for Log Rows ---
    console.log('Waiting for table content...');
    const logTableBodySelector = 'div[class*="table-root"] table > tbody';
    try {
      await page.waitForSelector(logTableBodySelector, { timeout: 10000 });
      console.log('Table body found.');
    } catch (err) {
      console.error('Could not find table body selector:', logTableBodySelector);
      const errorPath = path.join(screenshotDir, 'audit-log-table-error.png');
      console.log(`Taking error screenshot: ${errorPath}`);
      await page.screenshot({ path: errorPath });
      throw new Error('Audit log table body not found.');
    }

    console.log('Checking for log entries...');
    const logRows = await page.$$(`${logTableBodySelector} tr`);

    // --- Take Screenshot ---
    const screenshotPath = path.join(screenshotDir, 'audit-log-page.png');
    console.log(`Taking screenshot: ${screenshotPath}`);
    await page.screenshot({ path: screenshotPath });

    if (logRows.length > 0) {
      console.log(`SUCCESS: Found ${logRows.length} log entries in the audit log table.`);
    } else {
      console.warn('WARN: No log entries found in the table body.');
    }

  } catch (error) {
    console.error('Puppeteer test failed:', error);
    if (browser) {
       // Try to take a screenshot on error if possible
       try {
         const page = (await browser.pages())[0]; // Get the current page
         const errorPath = path.join(screenshotDir, 'activity-log-error.png');
         console.log(`Taking error screenshot: ${errorPath}`);
         await page.screenshot({ path: errorPath });
       } catch (ssError) {
         console.error('Failed to take error screenshot:', ssError);
       }
    }
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
    }
  }
})(); 