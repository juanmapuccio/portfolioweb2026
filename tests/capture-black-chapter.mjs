import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready') || !document.querySelector('.site-loader'), { timeout: 10000 });
  await page.waitForTimeout(500);

  // Scroll to BeltsSection and get its bounding box
  const belts = await page.$('#cinturones');
  if (belts) {
    // Stage height is ~700svh ≈ 6300px.
    // Index 5 (Black Belt / 1º Dan) is at progress ~5/5 = 1.0 (between 0.83 and 1.0)
    // Let's scroll to the start of chapter 5 (~4700px)
    await page.mouse.wheel(0, 4800);
    await page.waitForTimeout(1000);
  }

  await page.screenshot({ path: 'tests/screenshot-black-chapter.png' });
  console.log('Saved to tests/screenshot-black-chapter.png');

  await browser.close();
})();
