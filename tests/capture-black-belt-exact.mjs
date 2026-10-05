import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready') || !document.querySelector('.site-loader'), { timeout: 10000 });
  await page.waitForTimeout(500);

  // Directly set scroll inside belts section around progress = 0.95 (Black Belt)
  const belts = await page.$('#cinturones');
  if (belts) {
    const box = await belts.boundingBox();
    if (box) {
      // Belts height is 700svh ≈ 6300px. Progress 0.92 is ~ 5800px from top of belts
      await page.mouse.wheel(0, box.y + 5500);
      await page.waitForTimeout(1000);
    }
  }

  await page.screenshot({ path: 'tests/screenshot-black-belt-exact.png' });
  console.log('Saved to tests/screenshot-black-belt-exact.png');

  await browser.close();
})();
