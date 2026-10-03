import { describe, expect, test } from 'bun:test';
import { readFile, readdir } from 'node:fs/promises';

const read = (path: string) => readFile(new URL(path, import.meta.url), 'utf8');

const friction = await read('../src/components/site/FrictionSection.astro');
const projects = await read('../src/components/site/ProjectsSection.astro');
const stack = await read('../src/components/site/StackSection.astro');
const principles = await read('../src/components/site/PrinciplesSection.astro');
const contact = await read('../src/components/site/ContactSection.astro');
const channels = await read('../src/components/site/ChannelList.astro');
const exitScene = await read('../src/components/site/InkExit.astro');
const inkTs = await read('../src/scripts/ink.ts');
const ui = await read('../src/i18n/ui.ts');
const projectsData = await read('../src/data/projects.ts');
const pages = {
  es: await read('../src/pages/index.astro'),
  en: await read('../src/pages/en/index.astro'),
  pt: await read('../src/pages/pt/index.astro'),
};

const sections = { friction, projects, stack, principles, contact };
const components = { friction, projects, stack, principles, contact, channels, exitScene };

async function walk(dir: URL): Promise<URL[]> {
  const out: URL[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir);
    if (entry.isDirectory()) out.push(...(await walk(url)));
    else out.push(url);
  }
  return out;
}

const keysOf = (prefix: string) => [...new Set([...ui.matchAll(new RegExp(`'(${prefix}[a-zA-Z.]*)':`, 'g'))].map((m) => m[1]))];

describe('batch B: the five sections replace the placeholders', () => {
  test('each section has its id, data-belt negro and is mounted in order on es, en and pt', () => {
    const ids = [
      ['friccion', friction],
      ['proyectos', projects],
      ['stack', stack],
      ['principios', principles],
      ['contacto', contact],
    ] as const;
    for (const [id, text] of ids) {
      expect(text).toContain(`<section id="${id}"`);
      expect(text).toContain('data-belt="negro"');
    }
    for (const [lang, text] of Object.entries(pages)) {
      let last = text.indexOf('<BeltsSection');
      for (const name of ['Friction', 'Projects', 'Stack', 'Principles', 'Contact']) {
        const marker = `<${name}Section lang="${lang}" />`;
        expect(text).toContain(marker);
        expect(text.indexOf(marker)).toBeGreaterThan(last);
        last = text.indexOf(marker);
      }
      expect(text).not.toContain('Placeholders');
    }
  });

  test('Placeholders.astro is deleted and nothing imports it', async () => {
    const files = await walk(new URL('../src/', import.meta.url));
    expect(files.some((u) => u.pathname.endsWith('/Placeholders.astro'))).toBe(false);
    for (const url of files.filter((u) => /\.(ts|astro)$/.test(u.pathname))) {
      expect((await readFile(url, 'utf8')).includes('Placeholders')).toBe(false);
    }
  });
});

describe('content comes from src/data and src/i18n', () => {
  test('projects render the four own systems from projects.ts, in order', () => {
    expect(projects).toContain("from '../../data/projects'");
    expect(projects).toContain('projectsContent[lang]');
    for (const field of ['project.name', 'project.badge', 'project.problem', 'project.impact', 'project.url', 'project.solution']) {
      expect(projects).toContain(field);
    }
    const ids = [...projectsData.matchAll(/id: '([a-z]+)'/g)].map((m) => m[1]);
    expect(ids.slice(0, 4)).toEqual(['nodosur', 'nodofit', 'satori', 'donpizza']);
    for (const name of ['NodoSur', 'NodoFit', 'Satori Dojo', 'Don Pizza']) expect(projects).not.toContain(`>${name}<`);
  });

  test('stack, principles and contact read their data modules', () => {
    expect(stack).toContain("from '../../data/skills'");
    expect(stack).toContain('skillsData[lang].categories');
    expect(principles).toContain("from '../../data/principles'");
    expect(principles).toContain('principlesData[lang]');
    expect(principles).toContain('skillsData[lang].philosophy');
    expect(contact).toContain("from '../../data/contact'");
    expect(contact).toContain('contactData[lang]');
    expect(contact).toContain('CV_URL');
    expect(channels).toContain('channel.url');
  });

  test('every t() key used by the new components exists in es, en and pt', () => {
    const used = new Set<string>();
    for (const text of Object.values(components)) {
      for (const m of text.matchAll(/\bt\('([a-zA-Z.]+)'\)/g)) used.add(m[1]);
    }
    expect(used.size).toBeGreaterThan(30);
    for (const key of used) {
      expect(ui.split(`'${key}':`)).toHaveLength(4);
    }
  });

  test('the new i18n keys are present in all three languages', () => {
    for (const prefix of ['friction.', 'projects.', 'stack.', 'principles.', 'contact.']) {
      const keys = keysOf(prefix);
      expect(keys.length).toBeGreaterThan(0);
      for (const key of keys) expect(ui.split(`'${key}':`)).toHaveLength(4);
    }
    expect(ui).toContain("'friction.title': 'De horas a segundos.'");
    expect(ui).toContain("'friction.title': 'From hours to seconds.'");
    expect(ui).toContain("'contact.end': 'Fin del capítulo. Hablemos.'");
    expect(ui).toContain("'contact.footer': 'Rosario, Argentina · © 2026 Juan Manuel Puccio'");
  });

  test('no user-facing literal is hardcoded in the new components', () => {
    for (const label of ['De horas a segundos', 'Fin del capítulo', 'EN PRODUCCIÓN', 'Ver en vivo', 'Solo muestro', 'Hablemos', 'RESULTADO', '© 2026']) {
      for (const text of Object.values(components)) expect(text).not.toContain(label);
    }
  });
});

describe('content rules (copywriting-full.md section 0)', () => {
  test('Stoky, Inmotuls and Credituls never appear in the new components, pages or i18n', () => {
    for (const text of [...Object.values(components), ...Object.values(pages), ui]) {
      for (const name of ['Stoky', 'Inmotuls', 'Credituls']) expect(text).not.toContain(name);
    }
  });

  test('no forbidden claims in the new components or i18n', () => {
    const forbidden = [/ingresos? pasivos?/i, /passive income/i, /renda passiva/i, /abogac/i, /fuera de mi horario/i, /outside (of )?my (working )?hours/i, /no interfiere/i, /informal/i, /no requier\w+ intervenci/i, /facturaci[oó]n anual/i];
    for (const text of [...Object.values(components), ui]) {
      for (const pattern of forbidden) expect(pattern.test(text)).toBe(false);
    }
  });

  test('result screen shows only verifiable facts: computed system count, +10 years ITF, 1st dan from BELTS', () => {
    expect(contact).toContain('projects.length');
    expect(contact).toContain('BELTS.negro.gup');
    expect(ui).toContain("'contact.result.yearsValue': '+10'");
    const markup = contact.slice(0, contact.indexOf('<style'));
    expect(markup).not.toMatch(/\d+\s*%/);
    expect(markup).not.toMatch(/\$\s*\d/);
  });
});

describe('scroll engine rules', () => {
  test('scenes run through [data-ink-scene] and no component schedules frames or scroll handlers', () => {
    for (const text of Object.values(sections)) {
      expect(text.includes('requestAnimationFrame')).toBe(false);
      expect(text.includes('new Lenis')).toBe(false);
      expect(text.includes('ScrollTrigger')).toBe(false);
      expect(text.includes('addEventListener')).toBe(false);
      expect(text.includes('<script')).toBe(false);
    }
    for (const text of [friction, contact, exitScene]) expect(text).toContain('data-ink-scene');
  });

  test('no requestAnimationFrame or new Lenis anywhere in src outside ink.ts', async () => {
    const files = (await walk(new URL('../src/', import.meta.url))).filter((u) => /\.(ts|astro|js|css)$/.test(u.pathname));
    for (const url of files) {
      const text = await readFile(url, 'utf8');
      expect(text.includes('requestAnimationFrame')).toBe(false);
      if (!url.pathname.endsWith('/src/scripts/ink.ts')) expect(text.includes('new Lenis')).toBe(false);
    }
  });

  test('the sheet and the hold are wired in ink.ts, not in components, and never on scroll events', () => {
    expect(inkTs).toContain('function initChannelSheet');
    expect(inkTs).toContain('showModal()');
    expect(inkTs).toContain('function initHoldToSend');
    expect(inkTs).toContain('window.setTimeout');
    expect(inkTs).toContain('initChannelSheet();');
    expect(inkTs).toContain('initHoldToSend();');
    expect(inkTs).not.toMatch(/addEventListener\(\s*['"]scroll/);
  });

  test('only transform, opacity, clip-path and stroke-dashoffset are driven by scene variables', () => {
    const allowed = ['transform', 'opacity', 'clip-path', 'stroke-dashoffset', 'translate', 'transition', '--c', '--s', '--b', '--k', '--f', '--e', '--h'];
    for (const text of [friction, contact, exitScene]) {
      const css = text.slice(text.indexOf('<style'));
      const driven = [...css.matchAll(/([a-z-]+):[^;{}]*var\(--(?:p|c|s|b|k|f|e)[,)]/g)].map((m) => m[1]);
      for (const prop of driven) expect(allowed).toContain(prop);
    }
  });

  test('no CSS filter, backdrop-filter or inline SVG filter in the new section components', () => {
    for (const text of Object.values(components)) {
      expect(text).not.toMatch(/(^|[;{\s])filter\s*:/m);
      expect(text).not.toContain('backdrop-filter');
      expect(text).not.toContain('filter="');
    }
  });

  test('at most one blot per section change: one flood, one exit scene per section, one impact-free cut', () => {
    expect((projects.match(/class="projects__flood"/g) ?? []).length).toBe(1);
    for (const text of [projects, stack, principles]) expect((text.match(/<InkExit/g) ?? []).length).toBe(1);
    expect(friction).not.toContain('<InkExit');
    expect((friction.match(/class="friction__bars"/g) ?? []).length).toBe(1);
    expect(exitScene).not.toMatch(/background:\s*#fff/);
  });
});

describe('S3 friction', () => {
  test('7j converge on --p, then 10i, then the 10m bars with the black bar last', () => {
    expect(friction).toContain("t('friction.words')");
    expect(friction).toContain('InkSlashTitle');
    expect(friction).toContain('--c: clamp(0, calc(var(--p, 0) / 0.6), 1)');
    expect(friction).toContain('translate(calc(var(--x) * 1vw * (1 - var(--c)))');
    expect(friction).toContain("const bars = ['white', 'yellow', 'green', 'blue', 'red', 'black']");
    expect(friction).toContain('position: sticky');
    expect(friction).toContain('240svh');
  });
});

describe('S4 projects', () => {
  test('5d flood, 3b unroll cards, 5e stamp, 9e live link and 3g versus only for the featured project', () => {
    expect(projects).toContain('projects__flood');
    expect(projects).toContain('ink-unroll');
    expect(projects).toContain('proj__stamp ink-stamp');
    expect(projects).toContain("t('projects.status')");
    expect(projects).toContain('<InkLaunchArrow');
    expect(projects).toContain('project.featured ?');
    expect((projects.match(/<div class="versus"/g) ?? []).length).toBe(1);
    expect(projects).toContain('<InkExit variant="strip"');
  });

  test('external links open safely', () => {
    expect(projects).toContain('href={project.url} target="_blank" rel="noopener noreferrer"');
  });

  test('mobile is a native scroll-snap carousel that peeks the next card and is keyboard reachable', () => {
    expect(projects).toContain('scroll-snap-type: x mandatory');
    expect(projects).toContain('scroll-snap-align: start');
    expect(projects).toContain('- 30px');
    expect(projects).toContain('tabindex="0"');
    expect(projects).toContain('data-nested-scroll');
    expect(projects).toContain('aria-label={t(');
  });

  test('the flood and exit only exist with motion allowed', () => {
    const flood = projects.slice(projects.indexOf('@keyframes projects-flood'));
    expect(flood).toMatch(/@media \(prefers-reduced-motion: no-preference\) \{\s*html\.js \.projects__flood \{ display: block;/);
    expect(projects).toMatch(/\.projects__flood \{ display: none; \}/);
    expect(projects).toContain('@media (prefers-reduced-motion: reduce)');
  });
});

describe('S5 stack', () => {
  test('five scrolls drop once with a stagger, mobile stacks them in one column', () => {
    expect(stack).toContain('class="tscroll"');
    expect(stack).toContain('tscroll-drop');
    expect(stack).toContain('calc(var(--i) * 0.12s)');
    expect(stack).toContain('grid-template-columns: 1fr');
    expect(stack).toContain('repeat(5, minmax(0, 1fr))');
    expect(stack).toContain('<InkExit variant="scroll"');
    expect(stack).toContain('@media (prefers-reduced-motion: reduce)');
  });
});

describe('S6 principles', () => {
  test('1b title, five 2g seals (row of 5, mobile 3+2), two quotes and the katana exit', () => {
    expect(principles).toContain('<InkUnderlineDry');
    expect(principles).toContain('ink-stamp');
    expect(principles).toContain('repeat(5, minmax(0, 1fr))');
    expect(principles).toContain('repeat(6, minmax(0, 1fr))');
    expect(principles).toContain('.seal:nth-child(4) { grid-column: 2 / span 2; }');
    expect(principles).toContain('<blockquote');
    expect(principles).toContain('<InkExit variant="katana"');
  });

  test('the katana is desktop only and the exits are removed without motion or JS', () => {
    expect(exitScene).toMatch(/\.exit \{ display: none; \}/);
    expect(exitScene).toMatch(/@media \(prefers-reduced-motion: no-preference\) \{\s*html\.js \.exit \{ display: block;/);
    expect(exitScene).toContain('@media (max-width: 1023.98px)');
    expect(exitScene).toContain('.exit--katana { display: none !important; }');
    expect(exitScene).toContain('aria-hidden="true"');
  });
});

describe('S7 contact', () => {
  test('desktop has 10v result, 10w channels, WhatsApp CTA with 11b aura, CV link and 10z end credits', () => {
    expect(contact).toContain('data-specimen="10v"');
    expect(contact).toContain('<ChannelList');
    expect(channels).toContain('data-specimen="10w"');
    expect(contact).toContain('cta__aura');
    expect(contact).toContain('.cta:hover .cta__aura, .cta:focus-within .cta__aura');
    expect(contact).toContain('href={CV_URL}');
    expect(contact).toContain('credits__end');
    expect(contact).toContain("t('contact.end')");
    expect(contact).toContain('translateY(calc(100svh - var(--p, 0) * 235svh))');
  });

  test('mobile has the 7k curtain on --p, a native dialog sheet and a hold that only confirms the WhatsApp link', () => {
    expect(contact).toContain('data-specimen="7k"');
    expect(contact).toContain('transform: translateY(calc(100% - var(--k) * 125%))');
    expect(contact).toContain('<dialog class="sheet"');
    expect(contact).toContain('aria-labelledby="contact-sheet-title"');
    expect(contact).toContain('<form method="dialog">');
    expect(contact).toContain('data-sheet-open="contact-sheet"');
    expect(contact).toContain('aria-haspopup="dialog"');
    expect(contact).toContain('data-hold-to-send data-hold-href={whatsapp.url}');
    expect(contact).toContain('aria-describedby="hold-hint"');
    expect(contact).not.toContain('<form action');
    expect(contact).not.toContain('fetch(');
    expect(contact).not.toContain('<input');
    expect(contact).not.toContain('<textarea');
  });

  test('without JS the plain CTA and the inline channels stay available; with JS mobile swaps them', () => {
    expect(contact).toContain('html.js .cta { display: none; }');
    expect(contact).toContain('html.js .contact__channels { display: none; }');
    expect(contact).toMatch(/\.contact__sheet-btn, \.hold, \.hold__hint \{ display: none; \}/);
  });

  test('reduced motion: no pin, no curtain, no roll; the end line stays visible', () => {
    const scrubMobile = contact.slice(contact.indexOf('/* 7k curtain'));
    expect(scrubMobile).toContain('@media (max-width: 1023.98px) and (prefers-reduced-motion: no-preference)');
    expect(contact).toContain('@media (min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    const staticPart = contact.slice(contact.indexOf('<style'), contact.indexOf('/* ---- Desktop motion'));
    expect(staticPart).not.toContain('position: sticky');
    expect(staticPart).not.toContain('260svh');
    expect(contact).toMatch(/\.credits__roll \{ display: none; \}/);
    expect(contact).toContain('@media (prefers-reduced-motion: reduce)');
    expect(contact).toContain('.contact__curtain { display: none; }');
  });

  test('footer has the 2026 line from i18n', () => {
    expect(contact).toContain('<footer class="contact__footer">');
    expect(contact).toContain("t('contact.footer')");
  });
});

describe('links, touch targets and focus', () => {
  test('every external link has rel noopener (components with target blank)', () => {
    for (const [name, text] of Object.entries(components)) {
      const anchors = [...text.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map((m) => m[0]);
      for (const anchor of anchors) expect(`${name}: ${anchor}`).toContain('noopener');
    }
    expect(channels).toContain("rel={external ? 'noopener noreferrer' : undefined}");
    expect(contact).toContain('href={whatsapp.url} target="_blank" rel="noopener noreferrer"');
    expect(contact).toContain('href={CV_URL} target="_blank" rel="noopener noreferrer"');
  });

  test('interactive targets are at least 44px and have focus-visible styles', () => {
    expect(projects).toMatch(/\.proj__live \{[^}]*min-height: 44px/);
    expect(channels).toMatch(/\.channels__link \{[^}]*min-height: 52px/);
    expect(contact).toMatch(/\.cta__link \{[^}]*min-height: 56px/);
    expect(contact).toMatch(/\.contact__cv \{[^}]*min-height: 48px/);
    expect(contact).toMatch(/\.sheet__close \{[^}]*min-height: 48px/);
    expect(contact).toMatch(/\.hold \{[^}]*min-height: 56px/);
    for (const text of [projects, channels, contact]) expect(text).toContain(':focus-visible');
  });

  test('the sections give the engine one named heading each', () => {
    for (const [id, text] of [['friction-title', friction], ['projects-title', projects], ['stack-title', stack], ['principles-title', principles], ['contact-title', contact]] as const) {
      expect(text).toContain(`id="${id}"`);
      expect(text).toContain(`aria-labelledby="${id}"`);
    }
  });
});
