import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { martialExperienceData } from '../src/data/martialExperience';
import { ui } from '../src/i18n/ui';

const read = (p: string) => readFileSync(p, 'utf8');
const panel = read('src/components/tul/ExperiencePanel.astro');
const chapter = read('src/components/tul/TulChapter.astro');
const script = read('src/scripts/experiencePanel.ts');
const engine = read('src/scripts/tul.ts');

const PAGES = [
  ['src/pages/index.astro', 'es'],
  ['src/pages/en/index.astro', 'en'],
  ['src/pages/pt/index.astro', 'pt']
] as const;

describe('experience panel markup', () => {
  test('exactly one modal dialog, with a close button and a body slot', () => {
    expect(panel.match(/<dialog\s/g)?.length).toBe(1);
    expect(panel).toContain('data-exp-panel');
    expect(panel).toContain('data-exp-close');
    expect(panel).toContain('data-exp-body');
  });

  test('data comes from one template per position, never a fetch', () => {
    expect(panel).toContain('<template data-exp-template={position.id}');
    expect(panel).toContain('flatMap');
    expect(script).not.toContain('fetch(');
  });

  test('every page mounts the panel once, after main, in its own language', () => {
    for (const [file, lang] of PAGES) {
      const src = read(file);
      expect(src.match(/<ExperiencePanel /g)?.length).toBe(1);
      expect(src).toContain(`<ExperiencePanel lang="${lang}" />`);
      expect(src.indexOf('</main>')).toBeLessThan(src.indexOf('<ExperiencePanel'));
    }
  });

  test('the panel only uses page tokens, so it works on the black field', () => {
    expect(panel).toContain('var(--field)');
    expect(panel).toContain('var(--ink)');
    expect(panel).toContain('--field: var(--field-dark)');
    expect(panel).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });

  test('motion is transform and opacity only, 280 ms, and off under reduced motion', () => {
    expect(panel).toContain('280ms');
    expect(panel).toMatch(/prefers-reduced-motion: reduce\)\s*\{[\s\S]*transition: none/);
    expect(panel).not.toMatch(/transition:[^;]*\b(width|height|top|left|margin)\b/);
  });

  test('the page scroll is locked without moving the layout', () => {
    expect(panel).toContain('scrollbar-gutter: stable');
    expect(panel).toContain('html.xp-lock');
  });
});

describe('chapter rows', () => {
  test('each row has a detail button keyed by the position id', () => {
    expect(chapter).toContain('data-exp-open={row.id}');
    expect(chapter).toContain('aria-haspopup="dialog"');
  });

  test('without JS each row is a <details> with the same content; with JS only the button shows', () => {
    expect(chapter).toContain('<details class="ms__more">');
    expect(chapter).toContain('row.position.transferableCompetency');
    expect(chapter).toMatch(/html\.js\) \.ms__more\s*\{\s*display: none/);
    expect(chapter).toMatch(/\.ms__open\s*\{\s*display: none/);
  });

  test('a chapter shows the stage summary, not the full position copy', () => {
    expect(chapter).toContain('{stage.lede}');
    expect(chapter).toContain('{stage.line}');
    expect(chapter).not.toContain('class="ms__teaser">{row.position.teaser}</p>\n                <details');
  });

  test('the rows keep the ids the scroll engine and the tul stops use', () => {
    expect(chapter).toContain('id={row.id}');
    expect(chapter).toContain('data-stop={row.id}');
  });
});

describe('experience panel behaviour', () => {
  test('modal focus trap, focus return and the three ways to close', () => {
    expect(script).toContain('showModal()');
    expect(script).toContain('trigger?.focus');
    expect(script).toContain("'cancel'");
    expect(script).toContain('event.target === dlg');
    expect(script).toContain('[data-exp-close]');
  });

  test('deep link on load, hash on open, history Back closes', () => {
    expect(script).toContain('#exp-');
    expect(script).toContain('history.pushState');
    expect(script).toContain('history.back()');
    expect(script).toContain("'popstate'");
    expect(script).toMatch(/const initial = idFromHash\(\);\s*if \(initial\) show\(initial/);
  });

  test('reduced motion closes at once and there is no raw requestAnimationFrame', () => {
    expect(script).toContain('prefers-reduced-motion: reduce');
    expect(script).not.toContain('requestAnimationFrame');
  });

  test('the open API is exported and bound to a window event', () => {
    expect(script).toContain('export function openExperience(');
    expect(script).toContain('export function closeExperience(');
    expect(script).toContain("'tul:open-experience'");
    expect(engine).toContain('initExperiencePanel()');
  });
});

describe('panel i18n and data', () => {
  for (const lang of ['es', 'en', 'pt'] as const) {
    test(`${lang} has the panel keys and every position has what the panel shows`, () => {
      const dict = ui[lang] as Record<string, string>;
      for (const key of ['tul.panel.close', 'tul.chapter.more']) {
        expect(dict[key]?.length).toBeGreaterThan(0);
        expect(dict[key]).not.toContain('—');
      }
      const ids = martialExperienceData[lang].stages.flatMap((s) => s.positions.map((p) => p.id));
      expect(new Set(ids).size).toBe(ids.length);
      for (const stage of martialExperienceData[lang].stages) {
        expect(stage.lede.length).toBeGreaterThan(0);
        expect(stage.line.length).toBeGreaterThan(0);
        for (const p of stage.positions) {
          for (const field of [p.dates, p.role, p.org, p.teaser, p.description]) expect(field.length).toBeGreaterThan(0);
        }
      }
    });
  }

  test('es, en and pt expose the same position ids', () => {
    const idsOf = (l: 'es' | 'en' | 'pt') => martialExperienceData[l].stages.flatMap((s) => s.positions.map((p) => p.id));
    expect(idsOf('en')).toEqual(idsOf('es'));
    expect(idsOf('pt')).toEqual(idsOf('es'));
  });
});
