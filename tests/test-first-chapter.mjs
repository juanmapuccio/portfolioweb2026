import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready') || !document.querySelector('.site-loader'), { timeout: 10000 });
  
  const belts = page.locator('#cinturones');
  const box = await belts.boundingBox();
  console.log('Belts box top:', box?.y);

  if (box) {
    // Scroll so belts section starts at the top of the viewport
    await page.evaluate((y) => window.scrollTo(0, y), box.y + 10);
    await page.waitForTimeout(1000);
  }

  const data = await page.evaluate(() => {
    const sec = document.getElementById('cinturones');
    const ch = sec ? sec.dataset.chapter : null;
    const r = sec ? sec.getBoundingClientRect() : null;
    const beltRoot = document.getElementById('belt3d-root');
    const activeCh = sec ? sec.querySelector(`[data-chapter-index="${ch || '0'}"]`) : null;
    const slot = activeCh ? activeCh.querySelector('[data-belt3d-slot]') : null;
    const slotR = slot ? slot.getBoundingClientRect() : null;
    return {
      windowScrollY: window.scrollY,
      secBounding: r ? { top: r.top, bottom: r.bottom } : null,
      chapter: ch,
      slotRect: slotR ? { x: slotR.x, y: slotR.y, w: slotR.width, h: slotR.height } : null,
      beltTransform: beltRoot ? beltRoot.style.transform : null,
      beltOpacity: beltRoot ? beltRoot.style.opacity : null
    };
  });
  console.log('Result at start of belts:', data);
  await page.screenshot({ path: 'tests/visual-audit/desktop-belt-first-chapter.png' });
  console.log('Captured tests/visual-audit/desktop-belt-first-chapter.png');

  await browser.close();
})();
