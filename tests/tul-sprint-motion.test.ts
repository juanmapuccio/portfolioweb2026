import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { shiftProgress, sprintPosition, stepState } from '../src/components/tul/beltSprint';
import { frameFor, heroFrame, passageFrame, shiftFrame, travelFrame, type Metrics } from '../src/scripts/belt3d/journey';

const read = (p: string) => readFileSync(p, 'utf8');
const engine = read('src/scripts/tul.ts');
const scene = read('src/scripts/belt3d/scene.ts');
const sprint = read('src/components/tul/BeltSprint.astro');
const black = read('src/components/tul/BlackBeltWork.astro');

const N = 5;
const close = (a: number, b: number, eps = 1e-6) => expect(Math.abs(a - b)).toBeLessThan(eps);
const sizes: Metrics[] = [
  { w: 1440, h: 900, col: { x: 1292, y: 474, w: 216, h: 852 }, hero: { x: 1080, y: 470, s: 364 } },
  { w: 1024, h: 768, col: { x: 913, y: 408, w: 154, h: 720 }, hero: { x: 790, y: 400, s: 250 } }
];
const CAM = ['sx', 'sy', 'ppm', 'elevation', 'dist'] as const;

describe('sprint position', () => {
  test('runs from the first belt to the last, monotonic', () => {
    close(sprintPosition(0, N), 0);
    close(sprintPosition(1, N), N - 1);
    let prev = -1;
    for (let s = 0; s <= 1.0001; s += 0.01) {
      const pos = sprintPosition(s, N);
      expect(pos).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = pos;
    }
  });

  test('holds on each belt and moves smoothly between them', () => {
    // Right after a belt is reached the position barely moves (the line is read), then eases to the next.
    for (let i = 0; i < N - 1; i++) {
      const at = i / (N - 1);
      close(sprintPosition(at + 0.02 / (N - 1), N), i, 1e-3);
      close(sprintPosition(at + 0.5 / (N - 1), N), i + 0.5, 1e-6);
    }
  });

  test('holds long enough to read: 30% of each stretch at each end', () => {
    for (let i = 0; i < N - 1; i++) {
      const at = i / (N - 1);
      close(sprintPosition(at + 0.29 / (N - 1), N), i, 1e-9);
      close(sprintPosition(at + 0.71 / (N - 1), N), i + 1, 1e-9);
    }
  });

  test('clamps progress outside 0..1', () => {
    close(sprintPosition(-1, N), 0);
    close(sprintPosition(2, N), N - 1);
  });
});

describe('step state', () => {
  test('the current belt is fully shown, the others hidden and offset to their side', () => {
    expect(stepState(2, 2)).toEqual({ o: 1, d: 0 });
    expect(stepState(2, 0)).toEqual({ o: 0, d: 1 });
    expect(stepState(2, 4)).toEqual({ o: 0, d: -1 });
  });

  test('two neighbours crossfade halfway between them', () => {
    const a = stepState(1.5, 1);
    const b = stepState(1.5, 2);
    close(a.o + b.o, 1);
    close(a.d, 0.5);
    close(b.d, -0.5);
  });
});

describe('shift progress', () => {
  test('each change of belt runs 0..1 while the position crosses it', () => {
    close(shiftProgress(0, 0), 0);
    close(shiftProgress(0.5, 0), 0.5);
    close(shiftProgress(1, 0), 1);
    close(shiftProgress(1, 1), 0);
    close(shiftProgress(4, 3), 1);
  });
});

describe('journey: the shift beat', () => {
  for (const m of sizes) {
    test(`${m.w}x${m.h}: the hero hands over to the first shift, shifts chain, and the last one hands over to the tie beat`, () => {
      const out = heroFrame(1, 1, m, 0);
      const first = shiftFrame('blanco', 'amarillo', 0, m, 0, 4);
      for (const key of CAM) close(out.cam[key], first.cam[key]);
      expect(out.poseB).toEqual(first.pose);
      close(first.mix, 0);

      const keys = ['blanco', 'amarillo', 'verde', 'azul', 'rojo'] as const;
      for (let j = 1; j < 4; j++) {
        const a = shiftFrame(keys[j - 1], keys[j], 1, m, j - 1, 4);
        const b = shiftFrame(keys[j], keys[j + 1], 0, m, j, 4);
        for (const key of CAM) close(a.cam[key], b.cam[key]);
        expect(a.pose).toEqual(b.pose);
        close(a.mix, 1);
        close(b.mix, 0);
      }

      const last = shiftFrame('azul', 'rojo', 1, m, 3, 4);
      const tie = passageFrame('rojo', 'negro', 0, m);
      for (const key of CAM) close(last.cam[key], tie.cam[key]);
      expect(last.pose).toEqual(tie.pose);
      close(last.mix, 1);
      expect(last.to).toBe('rojo');
    });
  }

  test('the colour changes in the column, the belt loosens a little and ties again; no gold, no rim, no tie', () => {
    const m = sizes[0];
    const mid = shiftFrame('verde', 'azul', 0.5, m, 1, 4);
    const col = travelFrame('verde', 0, m).cam;
    for (const key of CAM) close(mid.cam[key], col[key]);
    expect(mid.mix).toBeGreaterThan(0.3);
    expect(mid.mix).toBeLessThan(0.7);
    expect((mid.pose as { k: number }).k).toBeLessThan(1);
    expect((mid.pose as { k: number }).k).toBeGreaterThan(0.5);
    for (let p = 0; p <= 1; p += 0.1) {
      const f = shiftFrame('verde', 'azul', p, m, 1, 4);
      expect(f.gold).toBe(0);
      expect(f.rim).toBe(0);
      expect(f.tie).toBe(false);
      expect(f.opacity).toBe(1);
    }
  });

  test('frameFor routes the shift beat', () => {
    const m = sizes[0];
    const f = frameFor({ kind: 'shift', belt: 'amarillo', from: 'blanco', step: 0, steps: 4 }, 0.5, 1, 1, m, 0);
    expect(f).toEqual(shiftFrame('blanco', 'amarillo', 0.5, m, 0, 4));
  });
});

describe('scene reads the shift beat', () => {
  test('collects it with its step and reads --p as its progress', () => {
    expect(scene).toMatch(/KEY_PROGRESS[^=]*=\s*\{[^}]*shift: '--p'/);
    expect(scene).toContain("kind !== 'shift'");
    expect(scene).toContain('el.dataset.step');
    expect(scene).toContain('el.dataset.steps');
  });

  test('the pointer cursor only promises a click when the page has the experience panel', () => {
    expect(scene).toContain('dialog[data-exp-panel]');
  });
});

describe('sprint engine', () => {
  const fn = engine.slice(engine.indexOf('function initSprint'), engine.indexOf('function initPassages'));

  test('is scrubbed by ScrollTrigger over the track, with native scroll only', () => {
    expect(fn).toContain('[data-belt-sprint]');
    expect(fn).toContain('scrollTrigger');
    expect(fn).toMatch(/scrub:\s*[\d.]+/);
    expect(fn).toContain('sprintPosition(');
    expect(fn).not.toMatch(/requestAnimationFrame|lenis/i);
    expect(engine).not.toContain('requestAnimationFrame');
    expect(engine).not.toContain('new Lenis');
  });

  test('writes the steps, the progress fill and the shift beats, and moves the header grade', () => {
    expect(fn).toContain("'--o'");
    expect(fn).toContain("'--d'");
    expect(fn).toContain("'--fill'");
    expect(fn).toContain('[data-belt-beat="shift"]');
    expect(fn).toContain('shiftProgress(');
    expect(fn).toContain('setBelt(');
  });

  test('with reduced motion nothing is scrubbed: the header follows the list item at mid-viewport', () => {
    expect(fn).toMatch(/if \(reduced\) \{/);
    expect(fn).toContain('IntersectionObserver');
  });

  test('the engine runs the sprint between the beats and the passages', () => {
    expect(engine).toMatch(/initBeats\(\);\s*initSprint\(\);\s*initPassages\(\);/);
  });
});

describe('sprint styles', () => {
  test('the sprint is a tall track with a sticky stage only with JS and motion; otherwise a static list', () => {
    expect(sprint).toMatch(/prefers-reduced-motion: no-preference\)\s*\{[\s\S]*html\.js\) \.bs__track\s*\{[\s\S]*?height:/);
    expect(sprint).toMatch(/html\.js\) \.bs__stage\s*\{[\s\S]*?position: sticky/);
  });

  test('the steps stack and read --d; the rail fill reads --fill; no blend modes, shadows or gradients', () => {
    // The dye: the engine's --d dyes the band with the scroll and hands the text over without overlap.
    expect(sprint).toMatch(/--dd: var\(--d, calc\(-1 \* min\(var\(--i\), 1\)\)\)/);
    expect(sprint).toContain('clip-path: inset(-2px calc(var(--in) * 100%) -2px 0)');
    // The leaving belt is gone (45%) before the arriving one shows (55%): the text never double-exposes.
    expect(sprint).toContain('(0.45 - var(--out)) / 0.45');
    expect(sprint).toContain('(0.55 - var(--in)) / 0.55');
    expect(sprint).toContain('opacity: var(--sv)');
    expect(sprint).toContain('var(--fill');
    expect(sprint.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/mix-blend-mode|box-shadow|gradient/);
  });

  test('the static belt marks step aside on desktop once the 3D belt is ready, and the stages reserve its column', () => {
    expect(sprint).toContain("html[data-belt3d='ready']");
    expect(sprint).toContain('var(--belt-col)');
    expect(black).toContain('var(--belt-col)');
  });
});

describe('sprint pacing and ink drops between belts', () => {
  test('each belt change gets a long stretch of scroll (90svh)', () => {
    expect(sprint).toMatch(/\.bs__track\s*\{\s*height: calc\(100svh \+ \(var\(--n\) - 1\) \* 90svh\);/);
  });

  test('one decorative ink drop per change, coloured by the belt it brings', () => {
    expect(sprint).toMatch(/<div class="bs__ink" aria-hidden="true">/);
    expect(sprint).toMatch(/class="bs__drop" data-belt=\{s\.to\} style=\{`--j:\$\{j\}`\}/);
    expect(sprint).toContain('class="bs__fall"');
    expect(sprint).toContain('class="bs__pool"');
    // The drop reads the scroll from the section's --fill: no extra engine writes.
    expect(sprint).toMatch(/--t: clamp\(0, calc\(var\(--fill, 0\) \* 5 - var\(--j\)\), 1\)/);
  });

  test('the ink only exists with JS and motion; the static list never shows it', () => {
    const css = sprint.replace(/\/\*[\s\S]*?\*\//g, '');
    const base = css.slice(css.indexOf('<style>'), css.indexOf('@media (prefers-reduced-motion: no-preference)'));
    expect(base).toMatch(/\.bs__ink\s*\{\s*display: none;/);
    expect(css).toMatch(/:global\(html\.js\) \.bs__ink\s*\{[^}]*display: block;/);
  });
});
