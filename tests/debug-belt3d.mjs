import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready') || !document.querySelector('.site-loader'), { timeout: 10000 });
  
  const belts = await page.locator('#cinturones');
  const box = await belts.boundingBox();
  console.log('Belts box:', box);

  const slot = page.locator('#cinturones [data-belt3d-slot]').first();
  console.log('Slot box before scroll:', await slot.boundingBox());

  if (box) {
    // Scroll into the start of belts section
    await page.mouse.wheel(0, box.y + 200);
    await page.waitForTimeout(1000);
  }

  console.log('Slot box after scroll:', await slot.boundingBox());
  const rootStyle = await page.$eval('#belt3d-root', el => ({
    transform: el.style.transform,
    opacity: el.style.opacity,
    hidden: el.hidden
  }));
  console.log('Belt3D root style:', rootStyle);

  await page.screenshot({ path: 'tests/visual-audit/desktop-belt3d-debug.png' });
  console.log('Screenshot saved to tests/visual-audit/desktop-belt3d-debug.png');

  await browser.close();
})();
