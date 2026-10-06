import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { ui } from '../src/i18n/ui';
import { BELTS } from '../src/data/martialExperience';

const read = (p: string) => readFileSync(p, 'utf8');
const hero = read('src/components/tul/HeroJoonbi.astro');
const diagram = read('src/components/tul/FloorDiagram.astro');
const engine = read('src/scripts/tul.ts');
const layout = read('src/layouts/TulLayout.astro');

describe('tul hero', () => {
  test('has exactly one h1', () => {
    expect(hero.match(/<h1[\s>]/g)?.length).toBe(1);
  });

  test('primary CTA points at #contacto', () => {
    expect(hero).toMatch(/class="cta cta--primary" href="#contacto"/);
  });

  test('secondary CTA downloads the CV PDF', () => {
    expect(hero).toContain("const CV_HREF = '/CV-Juan-Manuel-Puccio-2026-1.pdf'");
    expect(hero).toMatch(/href=\{CV_HREF\} download/);
  });

  test('the CV PDF exists in public/', () => {
    expect(existsSync('public/CV-Juan-Manuel-Puccio-2026-1.pdf')).toBe(true);
  });

  test('the scene exposes its draw range for the white chapter', () => {
    expect(hero).toContain('data-tul-scene');
    expect(hero).toContain('data-draw-end');
    expect(hero).toContain('data-p-to={DRAW_END}');
  });

  test('the hero is rendered on all three pages', () => {
    for (const [file, lang] of [
      ['src/pages/index.astro', 'es'],
      ['src/pages/en/index.astro', 'en'],
      ['src/pages/pt/index.astro', 'pt']
    ] as const) {
      expect(read(file)).toContain(`<HeroJoonbi lang="${lang}" />`);
    }
  });
});

describe('FloorDiagram', () => {
  test('draws the line of movement with pathLength="1"', () => {
    expect(diagram).toContain('pathLength="1"');
  });

  test('is decorative and fully drawn without --draw', () => {
    expect(diagram).toContain('aria-hidden="true"');
    expect(diagram).toContain('var(--draw, 1)');
  });
});

describe('tul engine', () => {
  test('uses native scroll: no Lenis', () => {
    expect(engine).not.toContain('new Lenis');
    expect(engine).not.toMatch(/from 'lenis'/);
  });

  test('schedules no raw requestAnimationFrame loop', () => {
    expect(engine).not.toContain('requestAnimationFrame');
  });

  test('honours prefers-reduced-motion', () => {
    expect(engine).toContain('prefers-reduced-motion: reduce');
  });

  test('is loaded from TulLayout', () => {
    expect(layout).toContain("import '../scripts/tul.ts'");
  });
});

describe('hero i18n', () => {
  const keys = ['tul.hero.availability', 'tul.hero.cta.contact', 'tul.hero.diagramNote', 'tul.hero.ready', 'tul.hero.readyShort', 'tul.hero.cue'];

  for (const lang of ['es', 'en', 'pt'] as const) {
    test(`${lang} has every tul.hero key and the reused hook and CV keys`, () => {
      const dict = ui[lang] as Record<string, string>;
      for (const key of [...keys, 'header.role', 'hero.tagline', 'hero.btn.cv', 'header.name']) {
        expect(dict[key]?.length).toBeGreaterThan(0);
      }
    });

    test(`${lang} copy has no em-dash`, () => {
      const dict = ui[lang] as Record<string, string>;
      for (const key of keys) expect(dict[key]).not.toContain('—');
    });
  }
});

describe('grade labels and diagram contract', () => {
  test('gup and dan labels use the ordinal indicator U+00BA, never the degree sign U+00B0', () => {
    for (const belt of Object.values(BELTS)) {
      expect(belt.gup).not.toContain('°');
      expect(belt.gup).toContain('º');
    }
  });

  test('FloorDiagram takes the ready label as a prop and imports no i18n', () => {
    expect(diagram).toContain('readyLabel');
    expect(diagram).not.toMatch(/i18n/);
  });

  test('FloorDiagram draws a ghost of the full route', () => {
    expect(diagram).toContain('fd-ghost');
  });
});

describe('portrait and entrance', () => {
  test('the portrait goes through astro:assets, not the raw PNG in public/', () => {
    expect(hero).toContain("from 'astro:assets'");
    expect(hero).toContain('<Picture');
    expect(hero).toContain("../../assets/fotojmPerfil.png");
    expect(hero).not.toContain('/fotojmPerfil.PNG');
  });

  test('the portrait is eager, high priority and sized', () => {
    expect(hero).toContain('fetchpriority="high"');
    expect(hero).toContain('loading="eager"');
    expect(hero).toMatch(/width=\{\d+\}/);
    expect(hero).toMatch(/height=\{\d+\}/);
    expect(hero).toContain("formats={['avif', 'webp']}");
  });

  test('the portrait alt exists in es, en and pt', () => {
    for (const lang of ['es', 'en', 'pt'] as const) {
      expect((ui[lang] as Record<string, string>)['hero.portraitAlt']?.length).toBeGreaterThan(0);
    }
  });

  test('the intro is gated by a JS-set class and every entrance rule hangs off it', () => {
    expect(layout).toContain("c.add('tul-intro')");
    expect(layout).toContain('prefers-reduced-motion: reduce');
    expect(engine).toContain("'tul-intro'");
    const rules = hero.match(/^\s*:global\(html\.tul-intro\)[^{]*\{/gm) ?? [];
    expect(rules.length).toBeGreaterThan(5);
    expect(hero).not.toMatch(/^\s*\.hero__[a-z]+\s*\{[^}]*animation:/m);
  });

  test('FloorDiagram exposes a portrait slot', () => {
    expect(diagram).toContain('name="portrait"');
  });
});
