import { describe, expect, test } from 'bun:test';
import { readFile, readdir } from 'node:fs/promises';

const read = (path: string) => readFile(new URL(path, import.meta.url), 'utf8');

const inkTs = await read('../src/scripts/ink.ts');
const loaderTs = await read('../src/scripts/loader.ts');
const siteLoader = await read('../src/components/site/SiteLoader.astro');
const siteHeader = await read('../src/components/site/SiteHeader.astro');
const placeholders = await read('../src/components/site/Placeholders.astro');
const sections = await read('../src/data/sections.ts');
const layout = await read('../src/layouts/Layout.astro');
const ui = await read('../src/i18n/ui.ts');
const pages = {
  es: await read('../src/pages/index.astro'),
  en: await read('../src/pages/en/index.astro'),
  pt: await read('../src/pages/pt/index.astro'),
};

const ids = ['hero', 'cinturones', 'friccion', 'proyectos', 'stack', 'principios', 'contacto'];
const belts = ['blanco', 'amarillo', 'verde', 'azul', 'rojo', 'negro', 'negro'];

async function walk(dir: URL): Promise<URL[]> {
  const out: URL[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir);
    if (entry.isDirectory()) out.push(...(await walk(url)));
    else out.push(url);
  }
  return out;
}

describe('S0 loader', () => {
  test('is skipped under reduced motion and without JS', () => {
    expect(loaderTs).toContain('if (reduced && !preview)');
    expect(siteLoader).toContain('@media (prefers-reduced-motion: reduce)');
    expect(siteLoader).toMatch(/\.site-loader:not\(\.site-loader--preview\)\s*\{\s*display:\s*none\s*!important/);
    // Hidden by default, only shown when the early inline script added `.js`.
    expect(siteLoader).toMatch(/\.site-loader\s*\{\s*display:\s*none;/);
    expect(siteLoader).toContain('html.js .site-loader { display: block; }');
    expect(layout).toContain("<script is:inline>document.documentElement.classList.add('js');</script>");
  });

  test('stops Lenis while visible and starts it on exit', () => {
    expect(loaderTs).toContain('__lenis?.stop()');
    expect(loaderTs).toContain('__lenis?.start()');
  });

  test('sets aria-busy while loading and removes it, then leaves the a11y tree', () => {
    expect(loaderTs).toContain("setAttribute('aria-busy', 'true')");
    expect(loaderTs).toContain("removeAttribute('aria-busy')");
    expect(loaderTs).toContain('el.hidden = true');
    expect(loaderTs).toContain('el.remove()');
  });

  test('progress follows real readiness within the 1.2s..3s window', () => {
    expect(loaderTs).toContain('document.fonts.ready');
    expect(loaderTs).toContain("addEventListener('load'");
    expect(loaderTs).toMatch(/desktop:\s*1200/);
    expect(loaderTs).toMatch(/MAX_MS\s*=\s*3000/);
  });

  test('curtain exit is translateY(-100%) in 0.75s', () => {
    expect(siteLoader).toContain('transform 0.75s');
    expect(siteLoader).toContain('translateY(-100%)');
  });

  test('composes the catalog loaders instead of duplicating their svg', () => {
    expect(siteLoader).toContain("import InkLoaderEnso from '../ink/InkLoaderEnso.astro'");
    expect(siteLoader).toContain("import InkLoaderDrop from '../ink/InkLoaderDrop.astro'");
    expect(siteLoader).not.toContain('<svg');
    expect(siteLoader).toContain('min-width: 768px');
  });

  test('is mounted once in Layout, before the slot', () => {
    expect(layout.split('<SiteLoader').length).toBe(2);
    expect(layout.indexOf('<SiteLoader')).toBeLessThan(layout.indexOf('<slot />'));
    expect(layout.indexOf('<SiteHeader')).toBeLessThan(layout.indexOf('<slot />'));
  });
});

describe('single engine', () => {
  test('no requestAnimationFrame and no new Lenis outside ink.ts', async () => {
    const files = (await walk(new URL('../src/', import.meta.url))).filter((u) => /\.(ts|astro|js|css)$/.test(u.pathname));
    for (const url of files) {
      const text = await readFile(url, 'utf8');
      expect(text.includes('requestAnimationFrame')).toBe(false);
      if (!url.pathname.endsWith('/src/scripts/ink.ts')) {
        expect(text.includes('new Lenis')).toBe(false);
        expect(text.includes('ScrollTrigger.create')).toBe(false);
      }
    }
  });

  test('ink.ts imports the loader and owns header scroll state', () => {
    expect(inkTs).toContain("import { initLoader } from './loader'");
    expect(inkTs).toContain('initLoader(reduced)');
    expect(inkTs).toContain("'--page-p'");
    expect(inkTs).toContain('root.dataset.belt');
    expect(inkTs).toContain('data-header-hidden');
    expect(inkTs).not.toMatch(/addEventListener\(\s*['"]scroll/);
  });
});

describe('S0 header', () => {
  test('lists the 7 anchors in order', () => {
    const found = [...sections.matchAll(/id:\s*'([a-z]+)'/g)].map((m) => m[1]);
    expect(found).toEqual(ids);
    expect(siteHeader).toContain('href: `#${section.id}`');
    expect(siteHeader).toContain("import { siteSections } from '../../data/sections'");
  });

  test('nav labels come from ui.ts in es, en and pt, none hardcoded', () => {
    for (const key of ['nav.hero', 'nav.belts', 'nav.friction', 'nav.projects', 'nav.stack', 'nav.principles', 'nav.contact']) {
      expect(sections).toContain(`'${key}'`);
      expect(ui.split(`'${key}':`)).toHaveLength(4);
    }
    for (const label of ['Inicio', 'Cinturones', 'Fricción', 'Proyectos', 'Principios', 'Contacto', 'Disponible', 'DISPONIBLE']) {
      expect(siteHeader).not.toContain(label);
    }
    expect(siteHeader).toContain("t('nav.label')");
  });

  test('language switch links to /, /en/ and /pt/', () => {
    expect(siteHeader).toContain("es: '/', en: '/en/', pt: '/pt/'");
    expect(siteHeader).toContain('InkLangStamp');
  });

  test('touch targets are at least 44px and focus is visible', () => {
    expect(siteHeader).toMatch(/\.ink-11j__link\s*\{[^}]*min-height:\s*44px/);
    expect(siteHeader).toMatch(/\.ink-11m__lang::after\s*\{[^}]*inset:\s*-11px -8px/);
    expect(siteHeader).toContain(':focus-visible');
  });

  test('progress line is coloured by the --ink-belt-* tokens through data-belt', () => {
    for (const color of ['white', 'yellow', 'green', 'blue', 'red', 'black']) {
      expect(siteHeader).toContain(`var(--ink-belt-${color})`);
    }
    expect(siteHeader).toContain('transform: scaleX(var(--page-p, 0))');
    expect(siteHeader).toContain('var(--belt-now');
  });

  test('hide on scroll applies only on desktop and keeps focus reachable', () => {
    const desktopBlock = siteHeader.slice(siteHeader.indexOf('@media (min-width: 768px)'));
    expect(desktopBlock).toContain('html[data-header-hidden]');
    expect(desktopBlock).toContain(':not(:focus-within)');
  });

  test('nav is hidden on mobile', () => {
    expect(siteHeader).toMatch(/\.site-header \.ink-11j nav\s*\{\s*display:\s*none;/);
  });
});

describe('index pages', () => {
  test('placeholders render the 7 sections with the belt attribute', () => {
    expect(placeholders).toContain('id={section.id}');
    expect(placeholders).toContain('data-belt={section.belt}');
    expect(placeholders).toContain('min-height: 100svh');
    const belted = [...sections.matchAll(/belt:\s*'([a-z]+)'/g)].map((m) => m[1]);
    expect(belted).toEqual(belts);
  });

  test('every locale page mounts the placeholders with the h1 inside #hero', () => {
    for (const [lang, text] of Object.entries(pages)) {
      expect(text).toContain(`<Placeholders lang="${lang}">`);
      expect(text).toMatch(/<Placeholders[^>]*>\s*<h1/);
    }
  });
});
