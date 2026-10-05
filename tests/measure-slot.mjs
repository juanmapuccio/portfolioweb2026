import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready') || !document.querySelector('.site-loader'), { timeout: 10000 });
  
  const belts = page.locator('#cinturones');
  const box = await belts.boundingBox();
  if (box) {
    await page.evaluate((y) => window.scrollTo(0, y), box.y + 10);
    await page.waitForTimeout(1000);
  }

  const geom = await page.evaluate(() => {
    const slot = document.querySelector('#cinturones [data-chapter-index="0"] [data-belt3d-slot]');
    const ghost = slot?.querySelector('.koma-ghost-ring');
    const root = document.getElementById('belt3d-root');
    const canvas = document.getElementById('belt3d-canvas');
    return {
      slot: slot ? slot.getBoundingClientRect() : null,
      ghost: ghost ? ghost.getBoundingClientRect() : null,
      root: root ? root.getBoundingClientRect() : null,
      canvas: canvas ? canvas.getBoundingClientRect() : null,
      rootTransform: root ? root.style.transform : null
    };
  });
  console.log('Geometry details:', JSON.stringify(geom, null, 2));
  await browser.close();
})();
