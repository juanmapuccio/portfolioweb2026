import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });

  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready') || !document.querySelector('.site-loader'), { timeout: 10000 });
  await page.waitForTimeout(500);

  // Scroll to #cinturones section stage bottom to inspect Black Belt (1º Dan)
  const belts = await page.$('#cinturones');
  if (belts) {
    const box = await belts.boundingBox();
    if (box) {
      // Scroll to near the end of the 700svh section where 1º Dan lives
      await page.mouse.wheel(0, box.y + 4200);
      await page.waitForTimeout(1000);
    }
  }

  await page.screenshot({ path: 'tests/screenshot-black-belt.png' });
  console.log('Saved to tests/screenshot-black-belt.png');

  await browser.close();
})();
