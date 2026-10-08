import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(p, 'utf8');
const mark = read('src/components/tul/BeltMark.astro');
const chapter = read('src/components/tul/TulChapter.astro');
const header = read('src/components/tul/TulHeader.astro');
const quick = read('src/components/tul/QuickCv.astro');
const engine = read('src/scripts/tul.ts');

describe('BeltMark drawing', () => {
  test('flat belt fill, ink outline, no gradient, filter or turbulence', () => {
    expect(mark).toContain('fill: var(--belt-fill)');
    expect(mark).toMatch(/\.bm__o \{[^}]*stroke: var\(--ink\);[^}]*stroke-width: 1\.5;/);
    expect(mark).not.toMatch(/gradient|filter|feTurbulence/i);
  });

  test('knot shade is one flat second tone', () => {
    expect(mark).toContain('color-mix(in srgb, var(--belt-fill) 82%, var(--ink))');
  });

  test('decorative by default, an image only when a title is passed', () => {
    expect(mark).toContain("aria-hidden={title ? undefined : 'true'}");
    expect(mark).toContain("role={title ? 'img' : undefined}");
    expect(mark).toContain('{title && <title>{title}</title>}');
  });

  test('sizes, optional tip and animate props', () => {
    expect(mark).toMatch(/size\?: 'mark' \| 'mini'/);
    expect(mark).toContain('tip?: BeltKey');
    expect(mark).toContain('animate?: boolean');
  });

  test('outline draws in with pathLength 1, then the fill fades in; only under html.js with motion', () => {
    expect(mark).toContain('pathLength="1"');
    expect(mark).toMatch(/animation: bm-draw 700ms var\(--ease-out\)/);
    expect(mark).toMatch(/animation: bm-fill 250ms var\(--ease-out\) 700ms/);
    const motion = mark.slice(mark.indexOf('@media (prefers-reduced-motion: no-preference)'));
    expect(motion).toContain('html.js) .bm[data-belt-mark]:not(.is-in) .bm__o');
    expect(mark).toContain('print-color-adjust: exact');
  });
});

describe('BeltMark placement', () => {
  test('chapter head carries the mark with a reserved box', () => {
    expect(chapter).toContain("import BeltMark from './BeltMark.astro'");
    expect(chapter).toMatch(/<BeltMark beltKey=\{beltKey\} animate title=/);
    expect(chapter).toMatch(/\.tc__seal \{\s*width: 4\.5rem;\s*aspect-ratio: 120 \/ 88;/);
  });

  test('header grade indicator uses stacked mini marks for the wipe, and the legend has a belt row', () => {
    expect(header).toContain('data-swatch-prev><BeltMark size="mini" />');
    expect(header).toContain('data-swatch-fill><BeltMark size="mini" />');
    expect(header).toContain("id: 'belt'");
    expect(header).toContain("t('tul.legend.belt.term')");
  });

  test('quick CV rows use the mini mark with the belt name', () => {
    expect(quick).toContain('<BeltMark beltKey={p.beltKey} size="mini"');
    expect(quick).toMatch(/\.qcv__sw \{\s*-webkit-print-color-adjust: exact;\s*print-color-adjust: exact;/);
  });
});

describe('engine', () => {
  test('handles data-belt-mark in the shared entrance observer, no rAF, no Lenis', () => {
    expect(engine).toContain('data-belt-mark');
    expect(engine).not.toContain('requestAnimationFrame');
    expect(engine).not.toContain('new Lenis');
  });
});
