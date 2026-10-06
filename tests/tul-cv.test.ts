import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { martialExperienceData } from '../src/data/martialExperience';
import { TUL_CHAPTERS } from '../src/data/tuls';
import { ui } from '../src/i18n/ui';

const read = (p: string) => readFileSync(p, 'utf8');
const CV_PAGES = [
  ['src/pages/cv.astro', 'es', '/cv/'],
  ['src/pages/en/cv.astro', 'en', '/en/cv/'],
  ['src/pages/pt/cv.astro', 'pt', '/pt/cv/']
] as const;
const HOME_PAGES = ['src/pages/index.astro', 'src/pages/en/index.astro', 'src/pages/pt/index.astro'];
const quick = read('src/components/tul/QuickCv.astro');
const shortcut = read('src/components/tul/CvShortcut.astro');
const layout = read('src/layouts/TulLayout.astro');
const header = read('src/components/tul/TulHeader.astro');

describe('cv routes', () => {
  for (const [file, lang] of CV_PAGES) {
    test(`${lang}: the page renders QuickCv in the layout with the cv/ path and its own meta`, () => {
      const src = read(file);
      expect(src).toContain(`<QuickCv lang="${lang}" />`);
      expect(src).toContain('path="cv/"');
      expect(src).toContain("t('tul.cv.meta.title')");
      expect(src).toContain("t('tul.cv.meta.description')");
    });
  }

  test('the layout derives canonical, hreflang, x-default and og:url from the path prop', () => {
    expect(layout).toContain("path = ''");
    expect(layout).toContain('pageUrl(code as Lang)');
    expect(layout).toContain('localePaths[code] + path');
    expect(layout).toMatch(/og:url" content=\{canonicalUrl\}/);
    expect(layout).toMatch(/hreflang="x-default" href=\{pageUrl\('es'\)\}/);
    expect(layout).toContain('<TulHeader lang={lang} path={path} />');
  });

  test('the header language switch keeps the page path', () => {
    expect(header).toContain('href={localePaths[code] + path}');
  });

  test('every locale has its own cv meta copy', () => {
    for (const lang of ['es', 'en', 'pt'] as const) {
      expect(ui[lang]['tul.cv.meta.title'].length > 0).toBe(true);
      expect(ui[lang]['tul.cv.meta.description'].length > 0).toBe(true);
      expect(ui[lang]['tul.cv.short'].length > 0).toBe(true);
    }
  });
});

describe('built cv pages (run after bun run build)', () => {
  const built = existsSync('dist/cv/index.html');
  const html = built ? read('dist/cv/index.html') : '';
  const builtTest = built ? test : test.skip;

  builtTest('canonical, hreflang and og:url use the cv/ path', () => {
    for (const [, , route] of CV_PAGES) {
      const out = read(`dist${route}index.html`);
      expect(out).toMatch(new RegExp(`<link rel="canonical" href="[^"]+${route}"`));
      expect(out).toMatch(new RegExp(`og:url" content="[^"]+${route}"`));
      for (const href of ['/cv/', '/en/cv/', '/pt/cv/']) {
        expect(out).toMatch(new RegExp(`hreflang="[a-z-]+" href="[^"]+${href}"`));
      }
      expect(out).toMatch(/hreflang="x-default" href="[^"]+\/cv\/"/);
    }
  });

  builtTest('es renders every position id, newest first', () => {
    const ids = martialExperienceData.es.stages.flatMap((s) => s.positions.map((p) => p.id));
    const rendered = [...html.matchAll(/data-position="([^"]+)"/g)].map((m) => m[1]);
    expect([...rendered].sort()).toEqual([...ids].sort());
    expect(rendered[0]).toBe('nodosur');
    expect(rendered[rendered.length - 1]).toBe('secundario-belgrano');
  });

  builtTest('projects follow the order of tuls.ts', () => {
    const rendered = [...html.matchAll(/data-project="([^"]+)"/g)].map((m) => m[1]);
    expect(rendered).toEqual(['satori', 'nodofit', 'donpizza']);
  });

  builtTest('the home pages link to their cv route, the cv pages do not link to themselves', () => {
    expect(read('dist/index.html')).toContain('href="/cv/"');
    expect(read('dist/en/index.html')).toContain('href="/en/cv/"');
    expect(read('dist/pt/index.html')).toContain('href="/pt/cv/"');
    expect(read('dist/cv/index.html')).not.toContain('tul-btn--cv');
  });
});

describe('QuickCv source contract', () => {
  test('lists experience from the data modules, newest first, as an ordered list', () => {
    expect(quick).toContain('martialExperienceData[lang].stages');
    expect(quick).toMatch(/\]\.reverse\(\)\.flatMap/);
    expect(quick).toContain('<ol class="qcv__list" role="list" reversed>');
    expect(quick).toContain('data-position={p.id}');
  });

  test('every position carries a belt swatch with an accessible belt name', () => {
    expect(quick).toContain('BELTS[p.beltKey].beltName[lang]');
    expect(quick).toContain('data-belt={p.beltKey}');
  });

  test('projects come from the black-belt passages of tuls.ts, NodoSur as the frame', () => {
    expect(quick).toContain('TUL_CHAPTERS.negro.forms');
    expect(quick).toContain('TUL_CHAPTERS.negro.frame');
    const order = TUL_CHAPTERS.negro.forms.flatMap((f) => f.stops.map((s) => s.ref.id));
    expect(order).toEqual(['satori', 'nodofit', 'donpizza']);
  });

  test('the CV link opens the Google Drive file in a new tab', () => {
    expect(quick).toMatch(/href=\{CV_PDF_HREF\} target="_blank" rel="noopener noreferrer"/);
    expect(read('src/data/cvSheet.ts')).toContain('CV_PDF_HREF = CV_URL');
    expect(read('src/data/contact.ts')).toMatch(/CV_URL = 'https:\/\/drive\.google\.com\//);
  });

  test('one h1, h2 per block, and a print stylesheet for A4', () => {
    expect(quick.match(/<h1[\s>]/g)?.length).toBe(1);
    expect(quick.match(/<h2[\s>]/g)?.length).toBe(5);
    expect(quick).toContain('@media print');
    expect(quick).toContain('size: A4');
  });
});

describe('mobile CV entry', () => {
  const engine = read('src/scripts/tul.ts');

  test('the header CV link targets the locale cv route and is absent on the cv pages', () => {
    expect(header).toContain("localePaths[lang] + 'cv/'");
    expect(header).toContain("aria-label={t('tul.cv.short')}");
    expect(header).toContain("const isCv = path === 'cv/'");
    expect(header).toMatch(/\{!isCv && \(\s*<a class="tul-btn tul-btn--cv"/);
  });

  test('the Leyenda button gives way to the CV link below 62rem', () => {
    expect(header).toMatch(/max-width: 61\.999rem\) \{\s*\.tul-btn--legend \{\s*display: none/);
  });

  test('the grade indicator is the legend trigger and keeps a live region', () => {
    expect(header).toMatch(/<button\s+class="tul-grade"[^>]*popovertarget="tul-legend"[\s\S]*?data-grade-indicator/);
    expect(header).toContain('role="status"');
    expect(header).toContain("t('tul.grade.legend')");
    expect(header).toContain('id="tul-legend"');
  });

  test('there is no floating shortcut anywhere', () => {
    for (const f of [...HOME_PAGES, ...CV_PAGES.map(([p]) => p), 'src/components/tul/HeroJoonbi.astro', 'src/components/tul/CvShortcut.astro', 'src/scripts/tul.ts', 'src/components/tul/TulChapter.astro']) {
      expect(read(f)).not.toContain('data-cv30');
    }
    for (const f of HOME_PAGES) expect(read(f)).not.toContain('CvShortcut');
    expect(engine).not.toContain('initCvShortcut');
    expect(shortcut).not.toContain('fixed');
  });

  test('the static hero link targets the locale cv route and is absent from the cv pages', () => {
    expect(shortcut).toContain("localePaths[lang] + 'cv/'");
    expect(shortcut).toContain("es: '/', en: '/en/', pt: '/pt/'");
    expect(shortcut).toContain('min-height: 2.75rem');
    expect(read('src/components/tul/HeroJoonbi.astro')).toContain('<CvShortcut lang={lang} />');
    for (const [f] of CV_PAGES) expect(read(f)).not.toContain('CvShortcut');
    expect(quick).not.toContain('CvShortcut');
  });
});

describe('copy rules', () => {
  const FORBIDDEN = /Stoky|Inmotuls|Credituls|Abogac|—|[ᄀ-ᇿ가-힯]|\p{Extended_Pictographic}/u;
  const sources = [quick, shortcut, ...CV_PAGES.map(([f]) => read(f))];

  test('components and pages hold no forbidden words, dashes or emoji', () => {
    for (const src of sources) expect(FORBIDDEN.test(src)).toBe(false);
  });

  test('the tul.cv strings hold no forbidden words, dashes or emoji', () => {
    for (const lang of ['es', 'en', 'pt'] as const) {
      const strings = Object.entries(ui[lang]).filter(([k]) => k.startsWith('tul.cv.'));
      expect(strings.length).toBe(11);
      for (const [, v] of strings) expect(FORBIDDEN.test(v)).toBe(false);
    }
  });
});
