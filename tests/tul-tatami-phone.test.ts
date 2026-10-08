import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { ui } from '../src/i18n/ui';

const read = (p: string) => readFileSync(p, 'utf8');
const scene = read('src/scripts/belt3d/scene.ts');
const boot = read('src/scripts/belt3d/boot.ts');
const eligible = read('src/scripts/belt3d/eligible.ts');
const hero = read('src/components/tul/HeroJoonbi.astro');
const css = (src: string) => src.slice(src.indexOf('<style>'));

describe('the phone gate (T12d)', () => {
  test('the phone never loads it by itself: the scene is imported on a tap of the hero toggle only', () => {
    // bootBelt3d returns before the idle import unless the desktop gate passes; the toggle imports on click.
    expect(boot).toMatch(/if \(!isBelt3dEligible\(\)\) return;/);
    const toggle = boot.slice(boot.indexOf('function bindToggle'), boot.indexOf('export function bootBelt3d'));
    expect(toggle).toContain("addEventListener('click'");
    expect(toggle).toMatch(/isBelt3dTapAllowed\(\)/);
    expect(toggle.indexOf('isBelt3dTapAllowed()')).toBeLessThan(toggle.indexOf("import('./scene')"));
    expect(toggle).toContain('scene.setTapMode(next)');
    expect(toggle).toContain("setAttribute('aria-pressed'");
    // Nothing outside the click handler imports it for the phone.
    expect(boot.match(/import\(\s*'\.\/scene'\s*\)/g)?.length).toBe(2);
  });

  test('the phone toggle checks WebGL and data saving, not the width or reduced motion', () => {
    const tapGate = eligible.slice(eligible.indexOf('export function isBelt3dTapAllowed'));
    expect(tapGate).toMatch(/!saveData\(\)\s*&&\s*hasWebGL\(\)/);
    expect(tapGate).not.toContain('matchMedia');
  });
});

describe('the phone: "Ver en 3D" on demand (T12d)', () => {
  test('the hero has a toggle with es/en/pt labels, bound by boot.ts, hidden from 1024 px up', () => {
    expect(hero).toContain('data-belt3d-toggle');
    expect(hero).toContain('aria-pressed="false"');
    expect(hero).toContain("data-on={t('tul.hero.view3d')}");
    expect(hero).toContain("data-off={t('tul.hero.view2d')}");
    expect(css(hero)).toMatch(/@media \(min-width: 64rem\) \{\s*:global\(html\.js\) \.hero__3d:not\(\[hidden\]\) \{\s*display: none;/);
    expect(css(hero)).toMatch(/min-height:\s*2\.75rem/);
  });

  test('the labels exist in every language', () => {
    const want = { es: ['Ver en 3D', 'Ver en 2D'], en: ['View in 3D', 'View in 2D'], pt: ['Ver em 3D', 'Ver em 2D'] } as const;
    for (const lang of ['es', 'en', 'pt'] as const) {
      const strings = ui[lang] as Record<string, string>;
      expect(strings['tul.hero.view3d']).toBe(want[lang][0]);
      expect(strings['tul.hero.view2d']).toBe(want[lang][1]);
    }
  });

  test('tap mode shows the hero only: no scroll journey, hero landed, every post shown, no mouse parallax', () => {
    expect(scene).toContain('export function setTapMode(on: boolean)');
    expect(scene).toContain("root.dataset.belt3dTap = 'on'");
    expect(scene).toContain("delete root.dataset.belt3dTap");
    expect(scene).toContain("window.dispatchEvent(new Event('tul:belt3d-tap'))");
    expect(scene).toMatch(/if \(tap && \(idx !== 0 \|\| beats\[0\]\.kind !== 'land'\)\) return undefined;/);
    expect(scene).toMatch(/const q = tap \? 1 : readNum\(/);
    expect(scene).toMatch(/all: tap/);
    // The toggle back to 2D tears everything down.
    expect(scene).toMatch(/if \(tap \|\| isBelt3dEligible\(\)\)/);
    expect(css(hero)).toMatch(/html\[data-belt3d-tap='on'\]\) \.hero__belt \{[^}]*pointer-events: none/s);
    expect(css(hero)).toMatch(/html\[data-belt3d-tap='on'\]\) \.hero__plate \{\s*visibility: hidden/);
  });
});
