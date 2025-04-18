const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Screenshots directory
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

async function testUI() {
  console.log('Starting simple UI test...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: 250 // Slow down operations by 250ms
  });
  
  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000); // 30 seconds timeout
    page.setDefaultTimeout(30000);
    
    console.log('Testing home page...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(screenshotsDir, 'home-page.png') });
    console.log('Home page loaded successfully.');
    
    // Wait a moment to ensure everything is loaded
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('UI test completed successfully!');
  } catch (error) {
    console.error('UI test failed:', error);
  } finally {
    // Keep the browser open for 5 seconds for inspection
    await new Promise(resolve => setTimeout(resolve, 5000));
    await browser.close();
  }
}

// Run the test
testUI(); 