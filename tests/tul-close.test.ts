import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { RETURN_FORM } from '../src/data/tuls';
import { contactData } from '../src/data/contact';
import { ui } from '../src/i18n/ui';

const read = (p: string) => readFileSync(p, 'utf8');
const PAGES = [
  ['src/pages/index.astro', 'es'],
  ['src/pages/en/index.astro', 'en'],
  ['src/pages/pt/index.astro', 'pt']
] as const;
const COMPONENTS = ['Principles', 'TechSheet', 'KyongYe'].map((n) => `src/components/tul/${n}.astro`);

describe('close mounting', () => {
  for (const [file, lang] of PAGES) {
    test(`${lang}: principles, sheet and Kyong-ye follow the negro chapter`, () => {
      const src = read(file);
      const tags = [...src.matchAll(/<(HeroJoonbi|TulChapter|Principles|TechSheet|KyongYe) lang="(\w+)"(?: beltKey="(\w+)")? \/>/g)];
      const names = tags.map((m) => (m[1] === 'TulChapter' ? `chapter:${m[3]}` : m[1]));
      expect(names.slice(-4)).toEqual(['chapter:negro', 'Principles', 'TechSheet', 'KyongYe']);
      expect(tags.every((m) => m[2] === lang)).toBe(true);
    });
  }
});

describe('anchors', () => {
  test('exactly one element has id="contacto" among the mounted tul components', () => {
    const files = [...COMPONENTS, 'src/components/tul/TulChapter.astro', 'src/components/tul/HeroJoonbi.astro', 'src/components/tul/TulHeader.astro'];
    const hits = files.flatMap((f) => [...read(f).matchAll(/\bid="contacto"/g)]);
    expect(hits.length).toBe(1);
    expect(read('src/components/tul/KyongYe.astro')).toContain('id="contacto"');
  });

  test('the section ids exist and the header and hero point at #contacto', () => {
    expect(read('src/components/tul/Principles.astro')).toContain('id="principios"');
    expect(read('src/components/tul/TechSheet.astro')).toContain('id="hoja-tecnica"');
    expect(read('src/components/tul/TulHeader.astro')).toContain('href="#contacto"');
    expect(read('src/components/tul/HeroJoonbi.astro')).toContain('href="#contacto"');
  });

  test('the three sections stay on the white field with the 1st dan grade', () => {
    for (const f of COMPONENTS) {
      const src = read(f);
      expect(src).toContain('data-belt="blanco"');
      expect(src).toContain('data-grade-belt="negro"');
    }
  });
});

describe('contact channels', () => {
  for (const lang of ['es', 'en', 'pt'] as const) {
    test(`${lang}: five channels, each with a real href scheme`, () => {
      const channels = contactData[lang].channels;
      expect(channels.map((c) => c.id)).toEqual(['whatsapp', 'email', 'linkedin', 'github', 'nodosur']);
      for (const c of channels) expect(/^(mailto:|https:\/\/)/.test(c.url)).toBe(true);
      expect(channels.find((c) => c.id === 'email')?.url.startsWith('mailto:')).toBe(true);
      expect(channels.find((c) => c.id === 'whatsapp')?.url.startsWith('https://wa.me/')).toBe(true);
    });
  }
});

describe('RETURN_FORM', () => {
  test('is a closed path inside the unit square', () => {
    const p = RETURN_FORM.path;
    expect(p.length).toBeGreaterThan(3);
    expect(p[0]).toEqual(p[p.length - 1]);
    for (const [x, y] of p) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(1);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(1);
    }
  });

  test('starts at the footprints of the hero (centre of the white diagram)', () => {
    expect(RETURN_FORM.path[0]).toEqual([0.5, 0.5]);
  });
});

describe('technical sheet', () => {
  const sheet = read('src/components/tul/TechSheet.astro');
  const skills = read('src/data/skills.ts');

  test('is a definition list with a heading and the Drive CV link', () => {
    expect(sheet).toContain('<dl');
    expect(read('src/data/cvSheet.ts')).toContain('CV_URL');
    expect(sheet).toContain('target="_blank" rel="noopener noreferrer"');
  });

  test('the data holds all five certifications with their year and English B2, in every language', () => {
    for (const name of ['AWS Certified Cloud Practitioner (2025)', 'AZ-900 (2025)', 'Google Cloud Computing Foundations (2024)', 'CS50: Introduction to Computer Science', '(2022)']) {
      expect(skills.split(name).length - 1).toBe(3);
    }
    for (const lang of ['es', 'en', 'pt'] as const) expect(ui[lang]['tul.sheet.lang.en']).toContain('B2');
  });
});

describe('copy and glyph rules', () => {
  test('no hangul in the new components', () => {
    for (const f of COMPONENTS) expect(/[ᄀ-ᇿ㄰-㆏가-힯]/.test(read(f))).toBe(false);
  });

  test('new i18n strings are complete, in first person, with no em-dash', () => {
    const keys = Object.keys(ui.es).filter((k) => /^tul\.(principles|sheet|close)\./.test(k));
    expect(keys.length).toBeGreaterThan(10);
    for (const lang of ['es', 'en', 'pt'] as const) {
      for (const k of keys) {
        const v = (ui[lang] as Record<string, string>)[k];
        expect(typeof v).toBe('string');
        expect(v.includes('—')).toBe(false);
        expect(/Stoky|Inmotuls|Credituls|Abogac/i.test(v)).toBe(false);
      }
    }
  });

  test('the engine supports the grade override', () => {
    const engine = read('src/scripts/tul.ts');
    expect(engine).toContain('gradeBelt');
    expect(engine).toContain('nextGradeBelt');
  });
});
