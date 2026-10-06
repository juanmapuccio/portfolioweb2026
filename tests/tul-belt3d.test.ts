import { describe, expect, test } from 'bun:test';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

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
const engine = read('src/scripts/tul.ts');
const hero = read('src/components/tul/HeroJoonbi.astro');
const chapter = read('src/components/tul/TulChapter.astro');

describe('three stays out of the initial bundle', () => {
  test('only the scene and the files it imports import three', () => {
    const allowed = new Set([
      'src/scripts/belt3d/scene.ts',
      'src/scripts/belt3d/proceduralBelt.ts',
      'src/scripts/belt3d/poses.ts'
    ]);
    const offenders = sources
      .map((f) => f.replaceAll('\\', '/'))
      .filter((f) => /from\s+['"]three(\/|['"])/.test(read(f)))
      .filter((f) => !allowed.has(f));
    expect(offenders).toEqual([]);
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
});

describe('scene', () => {
  test('one renderer: transparent, antialiased, low power, pixel ratio capped, ACES', () => {
    expect(scene).toMatch(/alpha:\s*true/);
    expect(scene).toMatch(/antialias:\s*true/);
    expect(scene).toContain("powerPreference: 'low-power'");
    expect(scene).toMatch(/PIXEL_RATIO_CAP\s*=\s*1\.5/);
    expect(scene).toContain('Math.min(window.devicePixelRatio');
    expect(scene).toContain('ACESFilmicToneMapping');
    expect(scene).toContain('PMREMGenerator');
    expect(scene).toContain('RoomEnvironment');
  });

  test('handles context loss, resize, visibility and disposes', () => {
    expect(scene).toContain('webglcontextlost');
    expect(scene).toContain('webglcontextrestored');
    expect(scene).toContain('ResizeObserver');
    expect(scene).toContain('IntersectionObserver');
    expect(scene).toContain('renderer.dispose()');
    expect(scene).toContain('forceContextLoss()');
    expect(scene).toMatch(/belt\.dispose\(\)/);
    expect(scene).toContain('envTexture?.dispose()');
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

  test('progress is read from inline custom properties, not from layout', () => {
    expect(scene).toContain('el.style.getPropertyValue');
    expect(scene).not.toContain('getBoundingClientRect');
    expect(scene).not.toContain('getComputedStyle');
  });
});

describe('containers', () => {
  test('the hero container sits inside the floor diagram and has no layout cost', () => {
    expect(hero).toContain('data-belt3d="hero"');
    expect(hero).toMatch(/slot="overlay"/);
    expect(hero).toMatch(/\.hero__belt\s*{[^}]*position:\s*absolute/s);
    expect(hero).toMatch(/aspect-ratio:\s*1/);
    expect(hero).toContain('aria-hidden="true"');
  });

  test('the negro head reserves its box with aspect-ratio and keeps the poster in the DOM', () => {
    expect(chapter).toContain('data-belt3d="tie"');
    expect(chapter).toContain('data-tul-scrub');
    expect(chapter).toMatch(/\.tc--black \.tc__seal\s*{[^}]*aspect-ratio:\s*1/s);
    expect(chapter).toContain('<BeltMark');
    expect(chapter).toContain("[data-state='ready']");
  });

  test('the engine scrubs --p for the tie without touching --draw', () => {
    const scrub = engine.slice(engine.indexOf('function initScrubs'), engine.indexOf('function initChapters'));
    expect(scrub).toContain("'--p'");
    expect(scrub).not.toContain('--draw');
    expect(scrub).not.toContain('--q');
  });
});

describe('belt colours', () => {
  test('mirror --belt-fill in tokens.css', () => {
    const colors = read('src/scripts/belt3d/colors.ts');
    const tokens = read('src/styles/tul/tokens.css');
    for (const key of ['blanco', 'amarillo', 'verde', 'azul', 'rojo', 'negro']) {
      const css = tokens.match(new RegExp(`\\[data-belt="${key}"\\]\\s*{[^}]*--belt-fill:\\s*(#[0-9a-fA-F]{6})`));
      const ts = colors.match(new RegExp(`${key}:\\s*'(#[0-9a-fA-F]{6})'`));
      expect(css?.[1]).toBeDefined();
      expect(ts?.[1].toLowerCase()).toBe(css?.[1].toLowerCase());
    }
  });
});
