import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Navigate to local dev server
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });

  // Scroll to #cinturones section
  const belts = await page.$('#cinturones');
  if (belts) {
    await belts.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
  }

  // Capture screenshot of the viewport
  await page.screenshot({ path: 'tests/screenshot-belts.png' });
  console.log('Screenshot saved to tests/screenshot-belts.png');

  await browser.close();
})();
