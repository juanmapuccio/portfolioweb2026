import { describe, expect, test } from 'bun:test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { TUL_CHAPTERS } from '../src/data/tuls';
import { ui } from '../src/i18n/ui';

const read = (p: string) => readFileSync(p, 'utf8');
const chapter = read('src/components/tul/TulChapter.astro');
const engine = read('src/scripts/tul.ts');

const ORDER = ['blanco', 'amarillo', 'verde', 'azul', 'rojo', 'negro'] as const;
const PAGES = [
  ['src/pages/index.astro', 'es'],
  ['src/pages/en/index.astro', 'en'],
  ['src/pages/pt/index.astro', 'pt']
] as const;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

describe('chapter mounting', () => {
  for (const [file, lang] of PAGES) {
    test(`${lang}: hero then the six chapters, in belt order`, () => {
      const src = read(file);
      const tags = [...src.matchAll(/<(HeroJoonbi|TulChapter) lang="(\w+)"(?: beltKey="(\w+)")? \/>/g)];
      expect(tags.map((m) => m[1])).toEqual(['HeroJoonbi', ...ORDER.map(() => 'TulChapter')]);
      expect(tags.every((m) => m[2] === lang)).toBe(true);
      expect(tags.slice(1).map((m) => m[3])).toEqual([...ORDER]);
    });
  }
});

describe('chapter structure', () => {
  test('one h2 and one ordered list in the template (every belt renders them once)', () => {
    expect(chapter.match(/<h2[\s>]/g)?.length).toBe(1);
    expect(chapter.match(/<ol[\s>]/g)?.length).toBe(1);
  });

  test('the chapter is a belt-drenched, scrubbed scene', () => {
    expect(chapter).toContain('data-belt={beltKey}');
    expect(chapter).toContain("'data-tul-scene'");
    expect(chapter).toContain("'data-p-from'");
  });

  test('milestone rows carry the stop id and the diagram threshold', () => {
    expect(chapter).toContain('id={row.id}');
    expect(chapter).toContain('data-stop={row.id}');
    expect(chapter).toContain('--t:${row.t}');
  });

  test('activation is driven by --draw against the row --t', () => {
    expect(chapter).toContain('var(--draw, 1)');
    expect(chapter).toContain('var(--t, 0)');
  });

  test('the diagram is only pinned when JS runs and motion is allowed', () => {
    expect(chapter).toMatch(/prefers-reduced-motion: no-preference\)\s*\{[\s\S]*html\.js\) \.tc__scene--pin \.tc__stage\s*\{\s*position: sticky/);
  });

  test('the next belt plane is hidden unless the engine scrubs', () => {
    expect(chapter).toContain('clip-path: inset(calc((1 - var(--rise)) * 100%) 0 0 0)');
    expect(chapter).toMatch(/\.tc__next\s*\{\s*display: none;/);
  });
});

describe('milestone rows match the tul stops', () => {
  test('every position stop of every belt has a matching position id in each language', async () => {
    const { martialExperienceData } = await import('../src/data/martialExperience');
    for (const lang of ['es', 'en', 'pt'] as const) {
      for (const key of ORDER) {
        const stage = martialExperienceData[lang].stages.find((s) => s.beltKey === key)!;
        const ids = new Set(stage.positions.map((p) => p.id));
        const chap = TUL_CHAPTERS[key];
        const refs = key === 'negro' ? [chap.frame!] : chap.forms[0].stops.map((s) => s.ref);
        const positionRefs = refs.filter((r) => r.kind === 'position');
        expect(positionRefs.length).toBeGreaterThan(0);
        for (const ref of positionRefs) expect(ids.has(ref.id)).toBe(true);
      }
    }
  });

  test('the black belt renders three forms mapped to satori, nodofit and donpizza', () => {
    const forms = TUL_CHAPTERS.negro.forms;
    expect(forms.map((f) => f.id)).toEqual(['kwang-gae', 'po-eun', 'ge-baek']);
    expect(forms.map((f) => f.stops[0].ref.id)).toEqual(['satori', 'nodofit', 'donpizza']);
    expect(chapter).toContain('chapter.forms.flatMap');
    expect(chapter).toContain('data-form-label={p.form.name}');
  });
});

describe('red belt automation block', () => {
  test('reads the real automation from projects.ts', () => {
    expect(chapter).toContain('automationsContent');
    expect(chapter).toContain('bot1Title');
  });
});

describe('chapter i18n', () => {
  const keys = [
    'tul.chapter.more',
    'tul.chapter.diagram',
    'tul.chapter.movements',
    'tul.chapter.passages',
    'tul.project.problem',
    'tul.project.solution',
    'tul.project.impact',
    'tul.project.stack',
    'tul.project.visit',
    'tul.auto.title',
    'tul.auto.in',
    'tul.auto.step1',
    'tul.auto.step2',
    'tul.auto.step3',
    'tul.auto.out'
  ];
  for (const lang of ['es', 'en', 'pt'] as const) {
    test(`${lang} has every chapter key, with no em-dash`, () => {
      const dict = ui[lang] as Record<string, string>;
      for (const key of keys) {
        expect(dict[key]?.length).toBeGreaterThan(0);
        expect(dict[key]).not.toContain('—');
      }
    });
  }
});

describe('authorship and engine guards', () => {
  test('no component or data file names work that is not Juan\'s', () => {
    const files = [...walk('src/components/tul'), ...walk('src/data'), 'src/scripts/tul.ts', 'src/i18n/ui.ts'];
    for (const file of files) {
      const src = read(file);
      for (const word of ['Stoky', 'Inmotuls', 'Credituls', 'Abogac']) {
        expect(src.includes(word)).toBe(false);
      }
    }
  });

  test('the engine has no Lenis and no raw requestAnimationFrame', () => {
    expect(engine).not.toContain('new Lenis');
    expect(engine).not.toContain('requestAnimationFrame');
  });

  test('the engine supports the next-belt early flip and the passage form labels', () => {
    expect(engine).toContain('data-next-belt');
    expect(engine).toContain('data-form-label');
  });
});
