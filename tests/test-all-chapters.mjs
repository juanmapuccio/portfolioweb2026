import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready') || !document.querySelector('.site-loader'), { timeout: 10000 });
  
  const belts = page.locator('#cinturones');
  const box = await belts.boundingBox();

  for (const fraction of [0, 0.2, 0.4, 0.6, 0.8, 0.98]) {
    await page.evaluate(({ y, h, f }) => window.scrollTo(0, y + h * f), { y: box.y, h: box.height - 900, f: fraction });
    await page.waitForTimeout(700);
    const info = await page.evaluate(() => {
      const sec = document.getElementById('cinturones');
      const ch = sec ? sec.dataset.chapter : null;
      const activeCh = sec ? sec.querySelector(`[data-chapter-index="${ch || '0'}"]`) : null;
      const beltName = activeCh ? activeCh.querySelector('.koma-emblem-name')?.textContent : null;
      const root = document.getElementById('belt3d-root');
      return { ch, beltName, transform: root?.style.transform, opacity: root?.style.opacity };
    });
    console.log(`Fraction ${fraction}:`, info);
  }
  await browser.close();
})();
