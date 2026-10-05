import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });

  // Wait for loader to finish (wait for is-ready on html or wait 3.5s)
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready') || !document.querySelector('.site-loader'), { timeout: 10000 });
  await page.waitForTimeout(500);

  // Now scroll to belts section
  const belts = await page.$('#cinturones');
  if (belts) {
    const box = await belts.boundingBox();
    if (box) {
      // Scroll into the middle of the belts section so --p is around 0.15 (Yellow/White belt in view)
      await page.mouse.wheel(0, box.y + 400);
      await page.waitForTimeout(800);
    }
  }

  await page.screenshot({ path: 'tests/screenshot-belts-scrub.png' });
  console.log('Saved to tests/screenshot-belts-scrub.png');

  await browser.close();
})();
