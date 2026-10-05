import { describe, expect, test } from 'bun:test';
import { readFile, readdir } from 'node:fs/promises';
import { BELTS, martialExperienceData } from '../src/data/martialExperience';
import { projectsContent } from '../src/data/projects';
import { TUL_CHAPTERS, getTulChapter, type StopRef } from '../src/data/tuls';

const langs = ['es', 'en', 'pt'] as const;
const chapters = Object.values(TUL_CHAPTERS);
const forms = chapters.flatMap((c) => c.forms);
const allRefs = chapters.flatMap((c) => [...(c.frame ? [c.frame] : []), ...c.forms.flatMap((f) => f.stops.map((s) => s.ref))]);

function exists(ref: StopRef, lang: (typeof langs)[number]): boolean {
  if (ref.kind === 'project') return projectsContent[lang].some((p) => p.id === ref.id);
  return martialExperienceData[lang].stages.some((s) => s.positions.some((p) => p.id === ref.id));
}

describe('tul chapters', () => {
  test('every site belt has a chapter and getTulChapter resolves it', () => {
    for (const key of Object.keys(BELTS)) {
      expect(getTulChapter(key)?.beltKey).toBe(key as never);
    }
    expect(getTulChapter('nope')).toBeUndefined();
  });

  test('movement counts match the graduation rules table', async () => {
    const rules = await readFile(new URL('../rules/graduaciones_gup_y_cinturones_en_taekwon_do_itf.md', import.meta.url), 'utf8');
    for (const name of ['Dan-Gun', 'Won-Hyo', 'Joong-Gun', 'Hwa-Rang']) {
      const form = forms.find((f) => f.name === name)!;
      const match = rules.match(new RegExp(`${name} Tul\\*+ \\((\\d+) movimientos\\)`));
      expect(match).not.toBeNull();
      expect(form.movements).toBe(Number(match![1]));
    }
    expect(TUL_CHAPTERS.blanco.forms[0].kind).toBe('exercise');
    const dan = Object.fromEntries(TUL_CHAPTERS.negro.forms.map((f) => [f.id, f.movements]));
    expect(dan).toEqual({ 'kwang-gae': 39, 'po-eun': 36, 'ge-baek': 44 });
  });

  test('black has exactly three forms mapped to existing own projects', () => {
    const black = TUL_CHAPTERS.negro;
    expect(black.forms.map((f) => f.id)).toEqual(['kwang-gae', 'po-eun', 'ge-baek']);
    expect(black.forms.map((f) => f.stops.map((s) => s.ref))).toEqual([
      [{ kind: 'project', id: 'nodofit' }],
      [{ kind: 'project', id: 'satori' }],
      [{ kind: 'project', id: 'donpizza' }]
    ]);
    expect(black.frame).toEqual({ kind: 'position', id: 'nodosur' });
  });

  test('every path is closed, points and stop t are inside 0..1, stops are sorted', () => {
    for (const form of forms) {
      expect(form.path[0]).toEqual(form.path[form.path.length - 1]);
      for (const [x, y] of form.path) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(1);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(1);
      }
      const ts = form.stops.map((s) => s.t);
      for (const t of ts) {
        expect(t).toBeGreaterThanOrEqual(0);
        expect(t).toBeLessThanOrEqual(1);
      }
      expect(ts).toEqual([...ts].sort((a, b) => a - b));
      for (const s of form.stops) {
        expect(s.move).toBeGreaterThanOrEqual(1);
        expect(s.move).toBeLessThanOrEqual(form.movements);
      }
    }
  });

  test('every stop and frame references an existing id in es, en and pt', () => {
    for (const ref of allRefs) for (const lang of langs) expect(exists(ref, lang)).toBe(true);
  });

  test('position ids match across languages and every position is covered by a stop', () => {
    const ids = (lang: (typeof langs)[number]) => martialExperienceData[lang].stages.flatMap((s) => s.positions.map((p) => p.id));
    expect(ids('en')).toEqual(ids('es'));
    expect(ids('pt')).toEqual(ids('es'));
    const used = new Set(allRefs.map((r) => r.id));
    for (const id of ids('es')) expect(used.has(id)).toBe(true);
  });

  test('data files never mention excluded names or Abogacía', async () => {
    const dir = new URL('../src/data/', import.meta.url);
    for (const name of await readdir(dir)) {
      const text = await readFile(new URL(name, dir), 'utf8');
      expect(text).not.toMatch(/Stoky|Inmotuls|Credituls|Abogac/i);
    }
  });
});
