import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = 'tests/visual-audit';
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 1440x900
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    console.log('Navigating desktop to http://localhost:4321/ ...');
    await page.goto('http://localhost:4321/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // Hero
    await page.screenshot({ path: `${OUT_DIR}/desktop-01-hero.png` });
    console.log('Captured desktop hero');

    // Scroll to sections
    const sections = ['#manifiesto', '#cinturones', '#dimension-humana', '#etica-operativa', '#contacto'];
    for (const sec of sections) {
      const el = await page.$(sec);
      if (el) {
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1200);
        const name = sec.replace('#', '');
        await page.screenshot({ path: `${OUT_DIR}/desktop-${name}.png` });
        console.log(`Captured desktop ${name}`);
      }
    }
    await page.close();
  }

  // 2. Mobile 390x844 (iPhone 14)
  {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
    });
    console.log('Navigating mobile to http://localhost:4321/ ...');
    await page.goto('http://localhost:4321/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // Mobile Hero
    await page.screenshot({ path: `${OUT_DIR}/mobile-01-hero.png` });
    console.log('Captured mobile hero');

    // Scroll to mobile sections
    const sections = ['#manifiesto', '#cinturones', '#dimension-humana', '#etica-operativa', '#contacto'];
    for (const sec of sections) {
      const el = await page.$(sec);
      if (el) {
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1200);
        const name = sec.replace('#', '');
        await page.screenshot({ path: `${OUT_DIR}/mobile-${name}.png` });
        console.log(`Captured mobile ${name}`);
      }
    }
    await page.close();
  }

  await browser.close();
  console.log('Visual audit capture complete!');
})();
