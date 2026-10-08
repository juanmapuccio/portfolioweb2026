import { describe, expect, test } from 'bun:test';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  COL_FILL,
  KNOT_UNTIL,
  RING_W,
  SPACER_VH,
  columnPpm,
  heroFrame,
  passageFrame,
  pickBeat,
  travelFrame,
  type Metrics
} from '../src/scripts/belt3d/journey';

const read = (p: string) => readFileSync(p, 'utf8');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const sources = walk('src').filter((f) => /\.(ts|astro)$/.test(f));
const eligible = read('src/scripts/belt3d/eligible.ts');
const boot = read('src/scripts/belt3d/boot.ts');
const scene = read('src/scripts/belt3d/scene.ts');
const journey = read('src/scripts/belt3d/journey.ts');
const poses = read('src/scripts/belt3d/poses.ts');
const belt = read('src/scripts/belt3d/proceduralBelt.ts');
const engine = read('src/scripts/tul.ts');
const hero = read('src/components/tul/HeroJoonbi.astro');
const chapter = read('src/components/tul/TulChapter.astro');
const passage = read('src/components/tul/InkPassage.astro');
const base = read('src/styles/tul/base.css');
const tokens = read('src/styles/tul/tokens.css');
const css = (src: string) => src.slice(src.indexOf('<style>'));

describe('three stays out of the initial bundle', () => {
  test('only the scene and the files it imports import three', () => {
    const allowed = new Set([
      'src/scripts/belt3d/scene.ts',
      'src/scripts/belt3d/proceduralBelt.ts',
      'src/scripts/belt3d/poses.ts',
      'src/scripts/belt3d/tatami.ts',
      // T7: the dojo stations (one per belt, fixed at its own beltDepth) are their own module, imported
      // only by scene.ts, reusing createProceduralBelt/poseHang for each station's own belt instance.
      'src/scripts/belt3d/station.ts'
    ]);
    const offenders = sources
      .map((f) => f.replaceAll('\\', '/'))
      .filter((f) => /from\s+['"]three(\/|['"])/.test(read(f)))
      .filter((f) => !allowed.has(f));
    expect(offenders).toEqual([]);
  });

  test('the journey model is plain numbers: no three, no DOM', () => {
    expect(journey).not.toMatch(/from\s+'three/);
    expect(journey).not.toMatch(/document\.|window\.|getBoundingClientRect|getComputedStyle/);
  });

  test('boot.ts and tul.ts reach the scene only through a dynamic import', () => {
    expect(boot).toMatch(/import\(\s*'\.\/scene'\s*\)/);
    for (const code of [boot, engine]) {
      expect(code).not.toMatch(/import\s[^;]*from\s+'\.\/(belt3d\/)?scene'/);
      expect(code).not.toMatch(/from\s+'three/);
    }
    expect(engine).toMatch(/from '\.\/belt3d\/boot'/);
  });

  test('the scene loads after the load event, on an idle callback with a timeout and a fallback', () => {
    expect(boot).toContain("addEventListener('load'");
    expect(boot).toContain('requestIdleCallback');
    expect(boot).toMatch(/timeout:\s*IDLE_TIMEOUT_MS/);
    expect(boot).toMatch(/IDLE_TIMEOUT_MS\s*=\s*3000/);
    expect(boot).toContain('setTimeout(');
    expect(boot).toContain("document.querySelector('[data-belt-beat]')");
  });

  test('three is a dependency again and the unused GLBs are gone', () => {
    const pkg = JSON.parse(read('package.json')) as { dependencies: Record<string, string>; devDependencies: Record<string, string> };
    expect(pkg.dependencies.three).toMatch(/^\^0\.186/);
    expect(pkg.devDependencies['@types/three']).toBeDefined();
    expect(existsSync('public/models/cinturon-itf.glb')).toBe(false);
    expect(existsSync('public/models/cinturon-itfv2.glb')).toBe(false);
    expect(existsSync('public/models')).toBe(false);
  });
});

describe('eligibility gate', () => {
  test('needs width >= 1024, no reduced motion, WebGL and no saveData', () => {
    expect(eligible).toContain("matchMedia('(min-width: 1024px)')");
    expect(eligible).toContain("matchMedia('(prefers-reduced-motion: reduce)')");
    expect(eligible).toMatch(/getContext\('webgl2'\)\s*\|\|\s*\w+\.getContext\('webgl'\)/);
    expect(eligible).toMatch(/saveData\s*===\s*true/);
  });

  test('the scene never re-probes WebGL per frame: the gate runs on media changes only', () => {
    const tick = scene.slice(scene.indexOf('function tick'), scene.indexOf('function attachDrag'));
    expect(tick).not.toContain('isBelt3dEligible');
    expect(scene).toMatch(/matchMedia\('\(min-width: 1024px\)'\)\.addEventListener\('change', sync\)/);
    expect(scene).toMatch(/matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.addEventListener\('change', sync\)/);
  });
});

describe('scene: one fixed full-viewport canvas, one renderer', () => {
  test('one renderer: transparent, antialiased, low power, pixel ratio capped, ACES', () => {
    expect(scene).toMatch(/alpha:\s*true/);
    expect(scene).toMatch(/antialias:\s*true/);
    expect(scene).toContain("powerPreference: 'low-power'");
    expect(scene).toMatch(/PIXEL_RATIO_CAP\s*=\s*1\.5/);
    expect(scene).toContain('Math.min(window.devicePixelRatio');
    expect(scene).toContain('ACESFilmicToneMapping');
    expect(scene).toContain('PMREMGenerator');
    expect(scene).toContain('RoomEnvironment');
    expect(scene.match(/new WebGLRenderer\(/g)?.length).toBe(1);
    expect(scene.match(/createElement\('canvas'\)/g)?.length).toBe(1);
  });

  test('the canvas is fixed over the whole viewport: above the field and the flood, below the header, no pointer events', () => {
    const rule = base.match(/\.belt3d__canvas \{([^}]*)\}/)?.[1] ?? '';
    expect(rule).toMatch(/position:\s*fixed/);
    expect(rule).toMatch(/inset:\s*0/);
    expect(rule).toMatch(/width:\s*100%/);
    expect(rule).toMatch(/height:\s*100%/);
    expect(rule).toMatch(/pointer-events:\s*none/);
    expect(scene).not.toContain('canvas.style.transform');
    const z = Number(rule.match(/z-index:\s*(\d+)/)?.[1]);
    const floodZ = Number(css(passage).match(/z-index:\s*(\d+)/)?.[1]);
    const headerZ = Number(read('src/components/tul/TulHeader.astro').match(/\.tul-header \{[^}]*z-index:\s*(\d+)/)?.[1]);
    expect(z).toBeGreaterThan(floodZ);
    expect(z).toBeLessThan(headerZ);
    expect(scene).toContain("canvas.className = 'belt3d__canvas'");
    expect(scene).toContain("canvas.setAttribute('aria-hidden', 'true')");
    expect(scene).toContain('document.body.append(canvas)');
  });

  test('handles context loss, resize and disposes', () => {
    expect(scene).toContain('webglcontextlost');
    expect(scene).toContain('webglcontextrestored');
    // The size comes from the metrics tul.ts publishes on refresh, so there is no observer to leak.
    expect(scene).toContain('function fitCanvas');
    expect(scene).toContain('renderer.setSize(metrics.w, metrics.h, false)');
    expect(scene).not.toContain('ResizeObserver');
    expect(scene).toContain('renderer.dispose()');
    expect(scene).toContain('forceContextLoss()');
    expect(scene).toMatch(/belt\.dispose\(\)/);
    expect(scene).toContain('envTexture?.dispose()');
    expect(scene).toMatch(/TEARDOWN_DELAY_MS\s*=\s*4000/);
  });

  test('the belt is torn down when no beat needs it and the posters return', () => {
    expect(scene).toMatch(/function needed\(/);
    expect(scene).toMatch(/teardownTimer = setTimeout\(/);
    expect(scene).toContain("root.dataset.belt3d = 'ready'");
    expect(scene).toContain('delete root.dataset.belt3d');
    // The posters hide on the same attribute (T11c).
    expect(css(passage)).toContain("html[data-belt3d='ready']");
  });

  test('frames come from the gsap ticker only', () => {
    expect(scene).toContain('gsap.ticker.add(tick)');
    expect(scene).toContain('gsap.ticker.remove(tick)');
    for (const f of sources) {
      const code = read(f);
      expect(code).not.toContain('requestAnimationFrame');
      expect(code).not.toContain('setAnimationLoop');
      expect(code).not.toContain('new Lenis');
    }
  });

  test('progress is read from inline custom properties, never from layout', () => {
    expect(scene).toContain('el.style.getPropertyValue');
    for (const code of [scene, journey, poses, read('src/scripts/belt3d/tatami.ts')]) {
      expect(code).not.toContain('getBoundingClientRect');
      expect(code).not.toContain('getComputedStyle');
    }
    for (const name of ['--p', '--bp', '--q', '--e', '--draw', '--belt-vw', '--belt-vh', '--belt-col-x', '--belt-col-y', '--belt-col-w', '--belt-hero-x', '--belt-hero-s', '--en', '--ex', '--tat-x', '--tat-s', '--tat-h', '--tat-t']) {
      expect(scene).toContain(`'${name}'`);
    }
  });

  test('the hero belt drags through its own box, not through the canvas', () => {
    expect(scene).toContain('[data-belt-anchor="hero"]');
    expect(scene).toContain('attachDrag(heroAnchor)');
    expect(scene).toContain("elastic.out(1, 0.45)");
  });
});

describe('beats in the markup', () => {
  test('the hero lands in its floor box, which is only an anchor and a drag zone', () => {
    expect(hero).toContain('data-belt-beat="land"');
    expect(hero).toContain('data-belt-stage');
    expect(hero).toContain('data-belt-anchor="hero"');
    expect(hero).toMatch(/slot="overlay"/);
    expect(hero).toMatch(/\.hero__belt\s*{[^}]*position:\s*absolute/s);
    expect(hero).toMatch(/aspect-ratio:\s*1/);
    expect(hero).toContain('aria-hidden="true"');
    expect(hero).toMatch(/html\[data-belt3d='ready'\]\) \.hero__belt \{[^}]*pointer-events: auto/);
    expect(hero).not.toMatch(/data-belt3d="hero"|\.hero__belt :global\(canvas\)/);
  });

  test('every chapter is a travel beat and every spacer a passage beat', () => {
    expect(chapter).toContain('data-belt-beat="travel"');
    expect(passage).toContain('data-belt-beat="passage"');
    expect(passage).toContain('data-from={from}');
  });

  test('the in-flow tie container and its poster swap are gone', () => {
    for (const src of [hero, chapter, engine, scene]) {
      expect(src).not.toMatch(/data-belt3d="(hero|tie)"|tc__belt3d|data-tul-scrub|initScrubs/);
    }
    expect(chapter).not.toMatch(/\.tc--black \.tc__seal/);
  });

  test('the chapter keeps its belt mark, with its reserved box (no layout shift)', () => {
    expect(chapter).toContain('<BeltMark');
    expect(chapter).toMatch(/\.tc__seal \{\s*width: 4\.5rem;\s*aspect-ratio: 120 \/ 88;/);
  });
});

describe('the reserved column', () => {
  test('one token sizes it: the chapters reserve it and the probe measures the same box', () => {
    expect(tokens).toMatch(/--belt-col: clamp\(8\.5rem, 15vw, 17rem\);/);
    expect(css(chapter)).toMatch(
      /min-width: 64rem\) and \(prefers-reduced-motion: no-preference\) \{\s*:global\(html\.js\) \.tc__stage \{\s*padding-inline-end: calc\(var\(--gutter\) \+ var\(--belt-col\)\);/
    );
    const probe = base.match(/\.belt-col-probe \{([^}]*)\}/)?.[1] ?? '';
    expect(probe).toContain('right: var(--gutter)');
    expect(probe).toContain('width: var(--belt-col)');
    expect(probe).toMatch(/visibility:\s*hidden/);
    expect(probe).toMatch(/pointer-events:\s*none/);
  });

  test('the narrow desktop keeps the compact three-column rows so the copy still fits', () => {
    expect(css(chapter)).toMatch(/min-width: 64rem\) and \(max-width: 84\.99rem\) and \(prefers-reduced-motion: no-preference\) \{\s*:global\(html\.js\) \.ms \{\s*grid-template-columns: 1\.75rem 5\.5rem minmax\(0, 1fr\);/);
  });

  test('the spacer height the journey assumes is the one the spacer has', () => {
    expect(SPACER_VH).toBe(0.5);
    expect(css(passage)).toMatch(/html\.js\) \.ink \{\s*--ink-h: 50svh/);
  });
});

describe('the engine drives the beats', () => {
  const fn = engine.slice(engine.indexOf('function initBeats'), engine.indexOf('const FLOOD_FULL'));

  test('travel gets --bp on desktop with motion only; the hero --e on every viewport (the phone tatami rides it); all scrubbed by ScrollTrigger', () => {
    expect(fn).toMatch(/const wide = !reduced && matchMedia\('\(min-width: 1024px\)'\)\.matches/);
    expect(fn).toContain('if (wide)');
    expect(fn).toContain("[data-belt-beat=\"travel\"]");
    expect(fn).toContain("'--bp'");
    expect(fn).toContain("'--e'");
    expect(fn).toContain("start: 'bottom bottom', end: 'bottom top'");
    expect(fn).toContain('scrollTrigger');
    expect(fn).not.toContain('--draw');
    expect(fn).not.toContain("'--q'");
    expect(engine).toMatch(/initScenes\(\);\s*initBeats\(\);\s*initPassages\(\);/);
  });

  test('layout is measured here, on refresh only, and published in px on <html>', () => {
    expect(fn).toContain('ScrollTrigger.addEventListener(\'refresh\', publish)');
    for (const name of ['--belt-vw', '--belt-vh', '--belt-col-x', '--belt-col-y', '--belt-col-w', '--belt-col-h', '--belt-hero-x', '--belt-hero-y', '--belt-hero-s', '--tat-x', '--tat-y', '--tat-s', '--tat-h', '--tat-t', '--en', '--ex']) {
      expect(fn).toContain(`'${name}'`);
    }
    // The probe, the hero box and stage, and the box and stage of each scene's figure: the only layout reads of the
    // scene, all inside publish(). It measures again when the phone turns the 3D view on.
    expect(engine.match(/getBoundingClientRect/g)?.length).toBe(5);
    expect(fn).toContain("window.addEventListener('tul:belt3d-tap', publish)");
    expect(fn).not.toContain('requestAnimationFrame');
  });
});

describe('the knot is the centre of the flood', () => {
  test('the scene publishes it with units during the tie beat only and clears it after', () => {
    expect(scene).toMatch(/'--knot-x', `\$\{.*\}px`/);
    expect(scene).toMatch(/'--knot-y', `\$\{.*\}px`/);
    expect(scene).toContain("root.style.removeProperty('--knot-x')");
    expect(scene).toContain("root.style.removeProperty('--knot-y')");
    expect(scene).toMatch(/if \(!f\.tie\) \{\s*clearKnot\(\);/);
    expect(scene).toContain('.project(v.camera)');
  });
});

describe('colour mix', () => {
  test('the cloth mixes to a second colour through a noise mask on a uniform', () => {
    expect(belt).toContain('onBeforeCompile');
    expect(belt).toContain('uniform float uMix');
    expect(belt).toContain('uniform vec3 uColorB');
    expect(belt).toContain('beltMask()');
    expect(belt).toMatch(/setColors: \(from: string \| Color, to\?: string \| Color, mix\?: number/);
    expect(scene).toContain('belt.setColors(paletteOf(f.from), paletteOf(f.to), f.mix)');
  });

  test('colours mirror --belt-fill in tokens.css', () => {
    const colors = read('src/scripts/belt3d/colors.ts');
    for (const key of ['blanco', 'amarillo', 'verde', 'azul', 'rojo', 'negro']) {
      const fill = tokens.match(new RegExp(`\\[data-belt="${key}"\\]\\s*{[^}]*--belt-fill:\\s*(#[0-9a-fA-F]{6})`));
      const ts = colors.match(new RegExp(`${key}:\\s*'(#[0-9a-fA-F]{6})'`));
      expect(fill?.[1]).toBeDefined();
      expect(ts?.[1].toLowerCase()).toBe(fill?.[1].toLowerCase());
    }
  });
});

// The journey itself, as numbers.
const sizes: Metrics[] = [
  { w: 1440, h: 900, col: { x: 1292, y: 474, w: 216, h: 852 }, hero: { x: 1080, y: 470, s: 364 } },
  { w: 1024, h: 768, col: { x: 913, y: 408, w: 154, h: 720 }, hero: { x: 790, y: 400, s: 250 } }
];
const BELTS = ['blanco', 'amarillo', 'verde', 'azul', 'rojo', 'negro'] as const;
const close = (a: number, b: number, eps = 1e-6) => expect(Math.abs(a - b)).toBeLessThan(eps);

describe('journey: continuity between beats', () => {
  for (const m of sizes) {
    test(`${m.w}x${m.h}: travel ends where the passage starts, and the passage ends where the next travel starts`, () => {
      for (let i = 1; i < BELTS.length; i++) {
        const from = BELTS[i - 1];
        const to = BELTS[i];
        const a = travelFrame(from, 1, m);
        const b = passageFrame(from, to, 0, m);
        const c = passageFrame(from, to, 1, m);
        const d = travelFrame(to, 0, m);
        for (const [x, y] of [[a, b], [c, d]] as const) {
          for (const key of ['sx', 'sy', 'ppm', 'elevation', 'dist'] as const) close(x.cam[key], y.cam[key]);
          expect(x.pose).toEqual(y.pose);
        }
        expect(b.from).toBe(from);
        close(b.mix, 0);
        expect(c.to).toBe(to);
        close(c.mix, 1);
      }
    });

    test(`${m.w}x${m.h}: the hero leaves for the column exactly where the first chapter starts`, () => {
      const out = heroFrame(1, 1, m, 0);
      const first = travelFrame('blanco', 0, m);
      for (const key of ['sx', 'sy', 'ppm', 'elevation', 'dist'] as const) close(out.cam[key], first.cam[key]);
      close(out.blend, 1);
      expect(out.poseB).toEqual(first.pose);
    });
  }

  test('the hero belt appears once the portrait is mostly gone and rests after landing', () => {
    const m = sizes[0];
    expect(heroFrame(0, 0, m, 0).opacity).toBe(0);
    expect(heroFrame(0.6, 0, m, 0).opacity).toBe(0);
    expect(heroFrame(0.7, 0, m, 0).opacity).toBe(1);
    expect(heroFrame(0.7, 0, m, 0).resting).toBe(false);
    expect(heroFrame(1, 0, m, 0).resting).toBe(true);
    expect(heroFrame(1, 0.2, m, 0).resting).toBe(false);
  });

  test('the active beat is the last one that has started', () => {
    expect(pickBeat([0, 0, 0])).toBe(0);
    expect(pickBeat([0.4, 0, 0])).toBe(0);
    expect(pickBeat([1, 0.2, 0])).toBe(1);
    expect(pickBeat([1, 1, 0.5, 0])).toBe(2);
    expect(pickBeat([1, 1, 1, 1])).toBe(3);
  });
});

describe('journey: where the belt is', () => {
  for (const m of sizes) {
    test(`${m.w}x${m.h}: in the column the belt fits it, and it never leaves it except inside the spacer`, () => {
      expect(RING_W * travelFrame('azul', 0.5, m).cam.ppm).toBeLessThanOrEqual(m.col.w * COL_FILL + 1e-6);
      const spacerH = SPACER_VH * m.h;
      for (const [from, to] of [['blanco', 'amarillo'], ['rojo', 'negro']] as const) {
        for (let p = 0; p <= 1.0001; p += 0.01) {
          const f = passageFrame(from, to, p, m);
          // Pixels the belt is away from the column: the spacer (an empty box) must contain it vertically.
          if (Math.abs(f.cam.sx - m.col.x) > 1) {
            const centre = m.h * (1 + SPACER_VH / 2 - (1 + SPACER_VH) * p);
            const half = 0.5 * RING_W * f.cam.ppm;
            expect(Math.abs(f.cam.sy - centre) + half).toBeLessThanOrEqual(spacerH / 2 + 1e-6);
          }
        }
        // The belt reaches the centre of the screen, loose, in the middle of the spacer.
        const mid = passageFrame(from, to, 0.5, m);
        close(mid.cam.sx, m.w / 2);
        if (to !== 'negro') expect((mid.pose as { k: number }).k).toBe(0);
      }
    });
  }

  test('T9: the passage swings the camera a few degrees mid-way and is straight on at both ends', () => {
    for (const m of sizes) {
      for (const [from, to] of [['blanco', 'amarillo'], ['rojo', 'negro']] as const) {
        close(passageFrame(from, to, 0, m).cam.azimuth ?? 0, 0);
        close(passageFrame(from, to, 1, m).cam.azimuth ?? 0, 0);
        const mid = passageFrame(from, to, 0.5, m).cam;
        expect(Math.abs(mid.azimuth ?? 0)).toBeGreaterThan(0.05);
        expect(Math.abs(mid.azimuth ?? 0)).toBeLessThan(0.15);
        // The dolly is eased: halfway through the passage the camera is halfway between the two stations.
        close(mid.target[2], (travelFrame(from, 0, m).cam.target[2] + travelFrame(to, 0, m).cam.target[2]) / 2);
      }
    }
  });

  test('an ordinary passage unties, changes colour while loose and ties again; no gold, no rim', () => {
    const m = sizes[0];
    const k = (p: number) => (passageFrame('verde', 'azul', p, m).pose as { k: number }).k;
    expect(k(0.2)).toBe(1);
    expect(k(0.5)).toBe(0);
    expect(k(0.8)).toBe(1);
    expect(passageFrame('verde', 'azul', 0.3, m).mix).toBe(0);
    expect(passageFrame('verde', 'azul', 0.5, m).mix).toBeGreaterThan(0.3);
    expect(passageFrame('verde', 'azul', 0.5, m).mix).toBeLessThan(0.7);
    for (let p = 0; p <= 1; p += 0.05) {
      const f = passageFrame('verde', 'azul', p, m);
      expect(f.gold).toBe(0);
      expect(f.rim).toBe(0);
      expect(f.tie).toBe(false);
    }
  });

  test('the tie beat: red to black with gold stitches and a rim light, and the knot is published only while the flood grows', () => {
    const m = sizes[0];
    const early = passageFrame('rojo', 'negro', 0.2, m);
    const late = passageFrame('rojo', 'negro', 0.9, m);
    expect(early.tie).toBe(true);
    expect(early.mix).toBe(0);
    expect(late.tie).toBe(false);
    close(late.mix, 1);
    close(late.gold, 1, 0.02);
    expect(late.rim).toBeGreaterThan(0.99);
    expect(passageFrame('rojo', 'negro', KNOT_UNTIL, m).tie).toBe(true);
    expect(passageFrame('rojo', 'negro', KNOT_UNTIL + 0.01, m).tie).toBe(false);
    // The knot is tied (k = 1) again by the time the flood has covered the screen and the field flips (p = 0.5).
    const k = (p: number) => (passageFrame('rojo', 'negro', p, m).pose as { k: number }).k;
    expect(k(0.28)).toBe(0);
    expect(k(0.62)).toBe(1);
  });

  test('rest on black: rim light and gold stitches, fading out before the chapter ends', () => {
    const m = sizes[0];
    const start = travelFrame('negro', 0, m);
    expect(start.rim).toBe(1);
    expect(start.gold).toBe(1);
    expect(start.opacity).toBe(1);
    expect(travelFrame('negro', 0.9, m).opacity).toBe(1);
    expect(travelFrame('negro', 0.98, m).opacity).toBe(0);
    expect(travelFrame('negro', 1, m).opacity).toBe(0);
    // On white there is no rim and no fade.
    expect(travelFrame('rojo', 1, m).rim).toBe(0);
    expect(travelFrame('rojo', 1, m).opacity).toBe(1);
  });

  test('travel turns the belt slowly with the scroll and leans the tails toward the route', () => {
    const m = sizes[0];
    const yaw = (p: number) => (travelFrame('verde', p, m).pose as { yaw: number }).yaw;
    expect(yaw(0)).toBeLessThan(yaw(0.5));
    expect(yaw(0.5)).toBeLessThan(yaw(1));
    expect(Math.abs(yaw(1) - yaw(0))).toBeLessThan(1.5);
    expect((travelFrame('verde', 0.5, m).pose as { lean: number }).lean).toBe(1);
  });
});
