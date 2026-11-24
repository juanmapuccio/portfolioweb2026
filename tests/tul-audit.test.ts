import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

// Regressions found by the visual audit of 2026-10-07 (T13f): one assertion per finding.
const read = (p: string) => readFileSync(p, 'utf8').split(String.fromCharCode(13)).join('');
const css = (src: string) => src.slice(src.indexOf('<style'));
const panel = css(read('src/components/tul/ExperiencePanel.astro'));
const principles = css(read('src/components/tul/Principles.astro'));
const chapter = css(read('src/components/tul/TulChapter.astro'));
const ky = css(read('src/components/tul/KyongYe.astro'));
const header = css(read('src/components/tul/TulHeader.astro'));
const hero = css(read('src/components/tul/HeroJoonbi.astro'));

describe('visual audit fixes (T13f)', () => {
  test('the Kyong-ye figure follows the isometric box, so it never makes the page wider than a phone', () => {
    expect(ky).toMatch(/\.ky__fig :global\(\.fd\) \{\s*width: min\(100%, calc\(var\(--ky-h\) \* 1\.55\)\);/);
    expect(ky).not.toMatch(/\.ky__fig :global\(\.fd\) \{[^}]*height: 100%/);
  });

  test('the panel Close button has one border: its focus ring is flush, not a second ring 3px away', () => {
    expect(panel).toMatch(/\.xp__close:focus-visible \{\s*outline: var\(--line-strong\) solid currentColor;\s*outline-offset: 0;/);
  });

  test('a word of the reveal waits lower, not bigger, so the gaps between words stay open', () => {
    expect(principles).toMatch(/\.pr \.w \{[^}]*transform: translateY\(0\.2em\)/);
    expect(principles).not.toMatch(/scale\(1\.06\)/);
    expect(principles).toMatch(/\.pr__quote \{[^}]*word-spacing: 0\.08em/);
  });

  test('the black chapter passage list keeps its label on one line and has room above the title', () => {
    expect(chapter).toMatch(/\.tc__passages a \{[^}]*grid-template-columns: 9\.5rem minmax\(0, 1fr\)/);
    expect(chapter).toMatch(/\.tc__passage-form \{[^}]*white-space: nowrap/);
    expect(chapter).toMatch(/\.tc--black \.tc__side:not\(\.tc__side--map\) \{\s*padding-bottom: var\(--space-m\)/);
  });

  test('the 390px header keeps core actions inside the viewport', () => {
    expect(header).toMatch(/@media \(max-width: 30rem\) \{[\s\S]*\.tul-btn--cv,[\s\S]*\.tul-btn--top \{\s*display: none;/);
    expect(header).toMatch(/\.tul-lang \.tul-btn \{[^}]*min-width: 2\.75rem[^}]*min-height: 2\.75rem/);
    expect(header).toMatch(/@media \(max-width: 22rem\) \{[\s\S]*\.tul-grade__mark,[\s\S]*\.tul-btn--qr \{\s*display: none;/);
  });

  test('the 480px hero promotes contact and removes the secondary CV from the first screen', () => {
    expect(hero).toMatch(/@media \(max-width: 29\.999rem\) \{[\s\S]*\.hero__actions \{[^}]*grid-template-columns: 1fr/);
    expect(hero).toMatch(/@media \(max-width: 29\.999rem\) \{[\s\S]*\.hero__actions \.cta--secondary \{\s*display: none;/);
    expect(hero).toMatch(/@media \(max-width: 29\.999rem\) \{[\s\S]*\.hero__cue \{\s*display: none;/);
  });
});
