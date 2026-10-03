import { describe, expect, test } from 'bun:test';
import { readFile, readdir } from 'node:fs/promises';
import { martialExperienceData } from '../src/data/martialExperience';

const read = (path: string) => readFile(new URL(path, import.meta.url), 'utf8');
const langs = ['es', 'en', 'pt'] as const;

async function walk(dir: URL): Promise<URL[]> {
  const out: URL[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir);
    if (entry.isDirectory()) out.push(...(await walk(url)));
    else out.push(url);
  }
  return out;
}

describe('belt journey copy', () => {
  test('every belt has kicker and a line of at most 16 words in es, en and pt', () => {
    for (const lang of langs) {
      const stages = martialExperienceData[lang].stages;
      expect(stages).toHaveLength(6);
      for (const stage of stages) {
        expect(stage.kicker.length).toBeGreaterThan(0);
        expect(stage.line.length).toBeGreaterThan(0);
        expect(stage.line.trim().split(/\s+/).length).toBeLessThanOrEqual(16);
      }
    }
  });

  test('only the black belt has a closing, in the three languages', () => {
    for (const lang of langs) {
      const stages = martialExperienceData[lang].stages;
      expect(stages.filter((s) => s.closing).map((s) => s.beltKey)).toEqual(['negro']);
    }
    expect(martialExperienceData.es.stages[5].closing).toContain('el cinturón negro no es la meta');
    expect(martialExperienceData.en.stages[5].closing).toContain("the black belt isn't the finish line");
    expect(martialExperienceData.pt.stages[5].closing).toContain('a faixa preta não é a linha de chegada');
  });

  test('new facts appear in the detail and the old one-liner is gone', () => {
    for (const lang of langs) {
      const [, , verde, azul] = martialExperienceData[lang].stages;
      expect(verde.detail).toContain('ACJ Rosario');
      expect(azul.detail).toContain('Rooftop');
    }
  });

  test('component renders kicker, line, detail and closing; detail is desktop-only', async () => {
    const belts = await read('../src/components/site/BeltsSection.astro');
    for (const token of ['chapter__kicker', 'chapter__line', 'chapter__detail', 'chapter__closing']) {
      expect(belts).toContain(token);
    }
    expect(belts).toMatch(/\.chapter__detail \{ display: none;/);
    const desktop = belts.slice(belts.indexOf('@media (min-width: 1024px) {'));
    expect(desktop).toMatch(/\.chapter__detail \{ display: block;/);
  });

  test('src has no forbidden terms', async () => {
    const files = (await walk(new URL('../src/', import.meta.url))).filter((u) => /\.(ts|astro)$/.test(u.pathname));
    for (const url of files) {
      const text = await readFile(url, 'utf8');
      expect(text).not.toMatch(/maestro|maestría|mastery|mestria|quedaban chicos|\bPNL\b/i);
    }
  });
});
