import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { FLOOD_FULL, PASSAGE_SVH } from '../src/scripts/belt3d/passage';
import { contactData } from '../src/data/contact';

// P1 of the black-belt critique: no dead black stretch after the flood, no leftovers on the dark field, a calm
// reduced-motion close (2-column grid, an ink edge instead of a ruler-straight cut) and a pitch that does not repeat
// the title.

const read = (p: string) => readFileSync(p, 'utf8');
const noComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const styleOf = (src: string) => noComments(src.slice(src.indexOf('<style>')));
const motionStart = (css: string) => css.indexOf('@media (prefers-reduced-motion: no-preference)');
const black = read('src/components/tul/BlackBeltWork.astro');
const sprint = read('src/components/tul/BeltSprint.astro');
const passage = read('src/components/tul/InkPassage.astro');

describe('the 1st dan rises as the field flips (no dead black stretch)', () => {
  test('the passage tail after the flip is short: under ~18svh on desktop and ~15svh on a phone', () => {
    expect((1 - FLOOD_FULL) * PASSAGE_SVH.wide).toBeLessThanOrEqual(18);
    expect((1 - FLOOD_FULL) * PASSAGE_SVH.narrow).toBeLessThanOrEqual(15);
  });

  test('the black section is pulled up over that tail, the length passed in from passage.ts', () => {
    expect(black).toContain("import { FLOOD_FULL } from '../../scripts/belt3d/passage';");
    expect(black).toMatch(/--tail:\$\{[^}]*FLOOD_FULL[^}]*\}/);
    const css = styleOf(black);
    expect(css).toMatch(/:global\(html\.js\) \.bw \{[^}]*margin-top: calc\(-1 \* var\(--tail\) \* var\(--pass-h\) - 20svh\);/);
    expect(css).toMatch(/:global\(html\.js\) \.bw \{[^}]*padding-top: var\(--space-l\);/);
  });

  test('the header waits under the flood and rises when the field flips, reversibly, only with motion', () => {
    const css = styleOf(black);
    const motion = css.slice(motionStart(css));
    expect(css.slice(0, motionStart(css))).not.toContain('data-field');
    expect(motion).toMatch(/:global\(html\.js:not\(\[data-field='dark'\]\)\) \.bw__head \{[^}]*opacity: 0;[^}]*transform: translateY/);
    expect(motion).toMatch(/:global\(html\.js\) \.bw__head \{[^}]*transition:[^}]*opacity/);
  });
});

describe('nothing of the sprint is left on the dark field', () => {
  const css = styleOf(sprint);

  test('the band outline and the drawn mark fade out once html[data-field="dark"] is set', () => {
    const motion = css.slice(motionStart(css));
    expect(motion).toMatch(/:global\(html\[data-field='dark'\]\) \.bs__band,\s*:global\(html\[data-field='dark'\]\) \.bs__mark > :global\(\*\) \{\s*opacity: 0;/);
    expect(motion).toMatch(/:global\(html\.js\) \.bs__mark > :global\(\*\) \{[^}]*transition: opacity/);
    expect(motion).toMatch(/:global\(html\.js\) \.bs__band \{[^}]*transition: opacity/);
  });
});

describe('reduced motion and no JS', () => {
  test('the projects sit in one column on a phone and exactly two from 48rem (no 3+1 orphan)', () => {
    const css = styleOf(black);
    expect(css).not.toContain('auto-fit');
    expect(css).toMatch(/\.bw__projects \{[^}]*grid-template-columns: minmax\(0, 1fr\);/);
    expect(css).toMatch(/@media \(min-width: 48rem\) \{[^@]*\.bw__projects \{\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
  });

  test('the light-to-black cut is a static ink edge (seep polygon at a fixed progress), hidden when the flood runs', () => {
    expect(passage).toMatch(/\{floods && <div class="ink__edge" style=\{`--edge-clip:\$\{edgeClip\}`\}><\/div>\}/);
    expect(passage).toMatch(/const edgeClip = seepPolygon\(\{[^}]*v: '--edge'/);
    const css = styleOf(passage);
    const base = css.slice(0, motionStart(css));
    expect(base).toMatch(/\.ink__edge \{[^}]*--edge: 0\.\d+;[^}]*background-color: var\(--field-dark\);[^}]*clip-path: var\(--edge-clip\);/);
    expect(css.slice(motionStart(css))).toMatch(/:global\(html\.js\) \.ink__edge \{\s*display: none;/);
    expect(base).not.toContain('ink--flood');
  });
});

describe('the close pitch carries the proof, not the title again', () => {
  for (const [lang, data] of Object.entries(contactData)) {
    test(`${lang}: no repeat of the title, no "full-time" (the availability line has it), about one line`, () => {
      const opening = data.title.split(/\s+/).slice(0, 2).join(' ').toLowerCase();
      expect(data.subtitle.toLowerCase()).not.toContain(opening);
      expect(data.subtitle.toLowerCase()).not.toContain('full-time');
      expect(data.subtitle.toLowerCase()).not.toContain('full stack');
      expect(data.subtitle.length).toBeLessThanOrEqual(130);
      expect(data.subtitle.length).toBeGreaterThan(40);
    });
  }
});
