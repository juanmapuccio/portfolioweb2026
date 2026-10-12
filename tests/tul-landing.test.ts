import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { ui } from '../src/i18n/ui';

const read = (p: string) => readFileSync(p, 'utf8');
const PAGES = [
  ['src/pages/index.astro', 'es'],
  ['src/pages/en/index.astro', 'en'],
  ['src/pages/pt/index.astro', 'pt']
] as const;
const SPRINT = 'src/components/tul/BeltSprint.astro';
const BLACK = 'src/components/tul/BlackBeltWork.astro';
const HELPERS = 'src/components/tul/beltSprint.ts';

describe('condensed home composition', () => {
  for (const [file, lang] of PAGES) {
    test(`${lang}: hero, belt sprint, the one passage to black, black belt work, close`, () => {
      const src = read(file);
      const tags = [...src.matchAll(/<(HeroJoonbi|BeltSprint|InkPassage|BlackBeltWork|KyongYe|TulChapter|Principles|TechSheet)\b([^>]*)\/>/g)];
      expect(tags.map((m) => m[1])).toEqual(['HeroJoonbi', 'BeltSprint', 'InkPassage', 'BlackBeltWork', 'KyongYe']);
      for (const m of tags.filter((t) => t[1] !== 'InkPassage')) expect(m[2]).toContain(`lang="${lang}"`);
      expect(src).toContain('<InkPassage from="rojo" to="negro" />');
    });

    test(`${lang}: the long chapters, principles, sheet and experience panel are gone from the home`, () => {
      const src = read(file);
      for (const name of ['TulChapter', 'Principles', 'TechSheet', 'ExperiencePanel']) expect(src).not.toContain(name);
      expect(src.match(/<InkPassage /g)?.length).toBe(1);
    });
  }
});

describe('belt sprint', () => {
  test('the component and its helpers exist', () => {
    expect(existsSync(SPRINT)).toBe(true);
    expect(existsSync(HELPERS)).toBe(true);
  });

  test('covers the five coloured belts in order, one line each, from the existing data', async () => {
    const { SPRINT_BELTS, PROGRESS_BELTS, sprintSteps } = await import('../src/components/tul/beltSprint');
    expect([...SPRINT_BELTS]).toEqual(['blanco', 'amarillo', 'verde', 'azul', 'rojo']);
    expect([...PROGRESS_BELTS]).toEqual([...SPRINT_BELTS, 'negro']);
    const { martialExperienceData } = await import('../src/data/martialExperience');
    for (const lang of ['es', 'en', 'pt'] as const) {
      const steps = sprintSteps(lang);
      expect(steps.map((s) => s.key)).toEqual([...SPRINT_BELTS]);
      for (const s of steps) {
        const stage = martialExperienceData[lang].stages.find((x) => x.beltKey === s.key)!;
        expect(s.line).toBe(stage.line);
        expect(s.gup.length).toBeGreaterThan(0);
        expect(s.name.length).toBeGreaterThan(0);
      }
    }
  });

  test('every step is a list item that carries its belt, plus the 3D shift hooks between steps', () => {
    const src = read(SPRINT);
    expect(src).toContain('<ol');
    expect(src).toContain('data-sprint-step');
    expect(src).toContain('data-belt={step.key}');
    expect(src).toContain('data-belt-sprint');
    expect(src).toContain('data-belt-beat="shift"');
    expect(src).toContain('data-from={');
    expect(src).toContain('data-step={');
  });

  test('has a decorative progress indicator of the six belts', () => {
    const src = read(SPRINT);
    expect(src).toContain('PROGRESS_BELTS.map');
    expect(src).toMatch(/class="bs__rail"[^>]*aria-hidden="true"/);
  });
});

describe('black belt work', () => {
  test('carries the negro belt (black field), a travel beat for the 3D belt and the four projects', () => {
    const src = read(BLACK);
    expect(src).toMatch(/<section[^>]*data-belt="negro"/);
    expect(src).toContain('data-belt-beat="travel"');
    expect(src).toContain("['nodosur', 'nodofit', 'satori', 'donpizza']");
    // P3: NodoFit renders first as the lead case; the other three keep their fixed relative order in the index.
    expect(src).toContain("const LEAD_ID = 'nodofit'");
    expect(src).toContain('const others = projects.filter((p) => p.id !== LEAD_ID)');
    expect(src).toContain('projectsContent');
    expect(src).toContain('skillsData');
  });

  test('project links open in a new tab and say so', () => {
    const src = read(BLACK);
    expect(src).toContain('target="_blank" rel="noopener noreferrer"');
    expect(src).toContain("t('tul.cv.newTab')");
  });
});

describe('close', () => {
  test('Kyong-ye keeps #contacto and links to the full CV of its language', () => {
    const src = read('src/components/tul/KyongYe.astro');
    expect(src).toContain('id="contacto"');
    expect(src).toContain("localePaths[lang] + 'cv/'");
    expect(src).toContain("t('tul.close.cv')");
  });
});

describe('landing i18n', () => {
  const keys = ['tul.sprint.title', 'tul.black.title', 'tul.black.stack', 'tul.close.cv'];
  for (const lang of ['es', 'en', 'pt'] as const) {
    test(`${lang} has every landing key, with no em-dash`, () => {
      const dict = ui[lang] as Record<string, string>;
      for (const key of keys) {
        expect(dict[key]?.length).toBeGreaterThan(0);
        expect(dict[key]).not.toContain('—');
      }
    });
  }
});
