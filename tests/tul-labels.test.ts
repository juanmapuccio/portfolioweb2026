import { describe, expect, test } from 'bun:test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { BELTS } from '../src/data/martialExperience';
import { ui } from '../src/i18n/ui';

const read = (p: string) => readFileSync(p, 'utf8');
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const ITF_NAMES = ['Saju Jirugi', 'Dan-Gun', 'Won-Hyo', 'Joong-Gun', 'Hwa-Rang', 'Kwang-Gae', 'Po-Eun', 'Ge-Baek'];

describe('tul are named by grade, never by their Korean name', () => {
  test('no ITF tul name appears in components, i18n or scripts', () => {
    const files = [...walk('src/components'), ...walk('src/i18n'), ...walk('src/scripts')];
    for (const file of files) {
      const src = read(file).toLowerCase();
      for (const name of ITF_NAMES) {
        const variants = [name, name.replace(' ', '-'), name.replace(/[ -]/g, '')];
        for (const v of variants) expect(`${file}: ${src.includes(v.toLowerCase())}`).toBe(`${file}: false`);
      }
    }
  });

  test('chapter figcaptions and passage labels are built from the grade and the i18n keys', () => {
    const chapter = read('src/components/tul/TulChapter.astro');
    expect(chapter).toContain("t('tul.chapter.tulLabel')");
    expect(chapter).toContain("t('tul.chapter.passageOf')");
    expect(chapter).toContain('caption(tulLabel(belt.gup), mainForm.movements)');
    expect(chapter).toContain('data-form-label={p.project.name}');
    expect(chapter).not.toMatch(/\{(p\.)?form\.name\}|mainForm\.name/);
  });

  test('the header shows the area title next to the grade', () => {
    const header = read('src/components/tul/TulHeader.astro');
    expect(header).toContain('stages.find((s) => s.beltKey === key)?.title');
    expect(header).not.toContain('TUL_CHAPTERS');
  });

  for (const lang of ['es', 'en', 'pt'] as const) {
    test(`${lang}: label keys exist and carry their placeholders`, () => {
      const dict = ui[lang] as Record<string, string>;
      expect(dict['tul.chapter.tulLabel']).toContain('{grade}');
      expect(dict['tul.chapter.passageOf']).toContain('{n}');
      expect(dict['tul.chapter.passageOf']).toContain('{total}');
      expect(dict['tul.cv.newTab'].length).toBeGreaterThan(0);
    });
  }
});

describe('CV links open a document in a new tab', () => {
  const links = ['HeroJoonbi', 'TechSheet', 'QuickCv'].map((n) => [n, read(`src/components/tul/${n}.astro`)] as const);

  for (const [name, src] of links) {
    test(`${name} uses ExternalDocIcon and announces the new tab`, () => {
      expect(src).toContain("import ExternalDocIcon from './ExternalDocIcon.astro'");
      expect(src).toContain('<ExternalDocIcon />');
      expect(src).toContain("t('tul.cv.newTab')");
    });
  }

  test('the download arrow path is gone from every component', () => {
    for (const file of walk('src/components')) expect(read(file)).not.toContain('M10 3V13M5 8.5');
  });

  test('no copy says download', () => {
    for (const lang of ['es', 'en', 'pt'] as const) {
      for (const key of ['hero.btn.cv', 'tul.cv.pdf'] as const) {
        expect(ui[lang][key]).not.toMatch(/descargar|download|baixar/i);
      }
    }
  });
});

describe('grade labels', () => {
  test('use the ordinal indicator U+00BA and never the degree sign U+00B0', () => {
    for (const belt of Object.values(BELTS)) {
      expect(belt.gup).toContain('º');
      expect(belt.gup).not.toContain('°');
    }
  });
});
