import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { BELT_LINES } from '../src/scripts/belt3d/colors';
import {
  FLOOR_W,
  diagramPpm,
  heroFrame,
  tatamiChapterFrame,
  tatamiHeroFrame,
  type Metrics
} from '../src/scripts/belt3d/journey';

const read = (p: string) => readFileSync(p, 'utf8');
const scene = read('src/scripts/belt3d/scene.ts');
const tatami = read('src/scripts/belt3d/tatami.ts');
const tip = read('src/scripts/belt3d/tatamiTip.ts');
const diagram = read('src/components/tul/FloorDiagram.astro');
const hero = read('src/components/tul/HeroJoonbi.astro');
const chapter = read('src/components/tul/TulChapter.astro');
const base = read('src/styles/tul/base.css');
const tokens = read('src/styles/tul/tokens.css');
const css = (src: string) => src.slice(src.indexOf('<style>'));

const m: Metrics = {
  w: 1440,
  h: 900,
  col: { x: 1292, y: 474, w: 216, h: 852 },
  hero: { x: 1080, y: 470, s: 364 },
  tat: { x: 1100, y: 480, s: 560 }
};
const DEG = Math.PI / 180;
const close = (a: number, b: number, eps: number) => expect(Math.abs(a - b)).toBeLessThan(eps);

describe('tatami: the same renderer and the same scene', () => {
  test('one renderer, one canvas, one scene: the tatami and the belt are two passes on two layers', () => {
    expect(scene.match(/new WebGLRenderer\(/g)?.length).toBe(1);
    expect(scene.match(/new Scene\(\)/g)?.length).toBe(1);
    expect(tatami).not.toContain('new WebGLRenderer');
    expect(tatami).not.toMatch(/new Scene\(/);
    expect(scene).toContain('scene.add(tatami.group)');
    expect(scene).toContain('tcam.layers.set(TATAMI_LAYER)');
    expect(scene).toContain('renderer.render(view.scene, view.tcam)');
    expect(scene).toContain('renderer.render(view.scene, view.camera)');
    expect(scene).toContain('renderer.clearDepth()');
    expect(scene).toContain('renderer.autoClear = false');
    expect(tatami).toContain('o.layers.set(TATAMI_LAYER)');
  });

  test('the mats are one InstancedMesh with seams, the weave is drawn on a canvas 2D (no image)', () => {
    expect(tatami.match(/new InstancedMesh\(/g)?.length).toBe(1);
    expect(tatami).toContain('SEAM');
    expect(tatami).toContain("getContext('2d')");
    expect(tatami).toContain('CanvasTexture');
    expect(tatami).not.toMatch(/TextureLoader|\.(png|jpg|jpeg|webp|avif)/);
  });

  test('the route is a tube in the belt line colour, drawn by --draw as a draw range', () => {
    expect(tatami).toContain('new TubeGeometry(');
    expect(tatami).toContain('setDrawRange(');
    expect(scene).toContain("'--draw'");
    expect(scene).toContain('BELT_LINES[tv.entry.belt]');
  });

  test('a post per milestone, at the FloorDiagram coordinates, with a number sprite', () => {
    expect(tatami).toContain('new Sprite(');
    expect(tatami).toContain('discTexture(stop.n');
    expect(tatami).toMatch(/\(x - 50\) \* UNIT/);
    expect(diagram).toContain('data-tatami={tatami}');
    // The stop coordinates are the ones the SVG posts use (pointAt in diagram units).
    expect(diagram).toMatch(/x: stops\[i\]\.x,\s*y: stops\[i\]\.y,/);
    expect(chapter).toContain('stopLabels={stopLabels}');
    expect(hero).toContain('stopLabels={stopLabels}');
  });

  test('belt line colours mirror --belt-line in tokens.css', () => {
    for (const key of ['blanco', 'amarillo', 'verde', 'azul', 'rojo'] as const) {
      const line = tokens.match(new RegExp(`\\[data-belt="${key}"\\]\\s*{[^}]*--belt-line:\\s*(#[0-9a-fA-F]{6})`));
      expect(line?.[1].toLowerCase()).toBe(BELT_LINES[key].toLowerCase());
    }
    expect(tokens).toMatch(new RegExp(`--line-dark:\\s*${BELT_LINES.negro}`, 'i'));
  });

  test('GL resources are disposed and the tatami goes with the rest', () => {
    expect(scene).toContain('view.tatami.dispose()');
    expect(tatami).toContain('const dispose = (): void =>');
    expect(tatami).toContain('weave.dispose()');
    expect(scene).toContain("document.addEventListener('visibilitychange'");
    expect(scene).toContain('if (document.hidden) return;');
    expect(scene).toMatch(/PIXEL_RATIO_CAP\s*=\s*1\.5/);
  });
});

describe('tatami: the pointer', () => {
  test('one Raycaster, one intersectObjects, and only the pointer handlers reach it', () => {
    expect(tatami.match(/new Raycaster\(/g)?.length).toBe(1);
    expect(tatami.match(/\.intersectObjects\(/g)?.length).toBe(1);
    expect(scene).not.toMatch(/Raycaster/);
    // The ray is cast by pickAt, and pickAt is called by the pointer handlers only: never by the ticker.
    expect(scene.match(/view\.tatami\.pick\(/g)?.length).toBe(1);
    const tick = scene.slice(scene.indexOf('function tick'), scene.indexOf('function attachDrag'));
    expect(tick).not.toContain('pickAt');
    expect(tick).not.toContain('.pick(');
    const move = scene.slice(scene.indexOf('function onPointerMove'), scene.indexOf('function onPointerLeave'));
    expect(move).toContain('pickAt(e.clientX, e.clientY)');
    // A touch has no move: its tap casts the ray from pointerup, never from a scroll.
    const up = scene.slice(scene.indexOf('function onPointerUp'), scene.indexOf('function bindPointer'));
    expect(up).toContain('TAP_SLOP');
    expect(up).toContain('pickAt(');
    expect(scene).toContain("listen(window, 'pointermove'");
  });

  test('a click or tap on a post opens the experience panel', () => {
    expect(scene).toContain("import { openExperience } from '../experiencePanel'");
    expect(scene).toMatch(/openExperience\(id, null\)/);
    expect(scene).toMatch(/function activate\(index: number\)/);
    // Mouse clicks open on the hovered post; the click that follows a touch is ignored (the tap already opened it).
    expect(scene).toMatch(/pointerType === 'touch'\) return;/);
    // Positions only: a project post has no id and does nothing.
    expect(tatami).toMatch(/id\?: string/);
    expect(diagram).toMatch(/stop\.ref\.kind === 'position' \? \{ id: stop\.ref\.id \}/);
    // Not behind the open panel, not on a link or a button.
    expect(scene).toContain("root.classList.contains('xp-lock')");
    expect(scene).toContain("closest('a, button, input, select, textarea, dialog')");
  });

  test('hover lights the post and shows an HTML tooltip placed from the projected post', () => {
    expect(tatami).toContain('DISC_HOVER');
    expect(scene).toContain('tip.show(stop.l');
    expect(scene).toContain('.project(v.tcam)');
    expect(tip).toContain('aria-hidden');
    expect(tip).toContain('translate3d(');
    expect(tip).not.toMatch(/getBoundingClientRect|getComputedStyle|from 'three/);
    const rule = base.match(/\.tatami-tip \{([^}]*)\}/)?.[1] ?? '';
    expect(rule).toMatch(/position:\s*fixed/);
    expect(rule).toMatch(/pointer-events:\s*none/);
    expect(rule).not.toMatch(/box-shadow|filter|gradient/);
  });

  test('the HTML rows stay the accessible path: the canvas and the tooltip are aria-hidden', () => {
    expect(scene).toContain("canvas.setAttribute('aria-hidden', 'true')");
    expect(chapter).toContain('data-exp-open={row.id}');
  });

  test('mouse parallax is 3 degrees, lerped in the ticker, off with reduced motion and on a phone', () => {
    const journey = read('src/scripts/belt3d/journey.ts');
    expect(journey).toMatch(/PARALLAX_DEG\s*=\s*3/);
    expect(scene).toContain('function stepParallax');
    expect(scene).toContain('Math.exp(-dt * 7)');
    expect(scene).toMatch(/const on = !tap && !reducedMotion\.matches/);
    expect(scene).toMatch(/if \(!tap && !reducedMotion\.matches && metrics\.w > 0\)/);
    expect(scene).not.toContain('requestAnimationFrame');
  });
});

describe('tatami: the camera follows the CSS floor curve', () => {
  test('a chapter map tilts 58 to 44 degrees with a dolly of 0.96 to 1.04 over the scene progress', () => {
    const a = tatamiChapterFrame(0.02, m.tat);
    const b = tatamiChapterFrame(0.5, m.tat);
    const c = tatamiChapterFrame(0.98, m.tat);
    // Elevation above the horizon = 90 degrees minus the CSS tilt.
    close(a.cam.elevation / DEG, 90 - (58 - 14 * 0.02), 10 ** -4);
    close(b.cam.elevation / DEG, 90 - 51, 10 ** -4);
    close(c.cam.elevation / DEG, 90 - (58 - 14 * 0.98), 10 ** -4);
    expect(c.cam.elevation).toBeGreaterThan(a.cam.elevation);
    // Dolly times the fit of the CSS plane (1 - 0.0048 * tilt).
    close(a.cam.ppm, diagramPpm(m.tat.s) * (0.96 + 0.08 * 0.02) * (1 - 0.0048 * (58 - 14 * 0.02)), 10 ** -6);
    expect(c.cam.ppm).toBeGreaterThan(a.cam.ppm);
    // Where the map sits on screen: its box, lifted like the CSS plane (0.14% of the width per degree).
    expect(b.cam.sx).toBe(m.tat.x);
    close(b.cam.sy, m.tat.y - 0.0014 * m.tat.s * 51, 10 ** -6);
    // The camera is the only 3D left on the page: the diagram declares no tilt of its own.
    expect(css(diagram)).not.toMatch(/--tv|--cam|rotateX/);
  });

  test('it is drawn only while its scene is pinned: gone at both ends', () => {
    expect(tatamiChapterFrame(0, m.tat).opacity).toBe(0);
    expect(tatamiChapterFrame(0.5, m.tat).opacity).toBe(1);
    expect(tatamiChapterFrame(1, m.tat).opacity).toBe(0);
    close(tatamiChapterFrame(0.5, m.tat).yaw, 8 * DEG, 10 ** -8);
  });

  test('the hero tatami shares the camera of the hero belt, so the belt rests on it, and rides up with the stage', () => {
    const t = tatamiHeroFrame(1, 0, m);
    const b = heroFrame(1, 0, m, 0);
    for (const key of ['sx', 'sy', 'ppm', 'elevation', 'dist'] as const) close(t.cam[key], b.cam[key], 10 ** -8);
    expect(t.cam.target).toEqual(b.cam.target);
    expect(tatamiHeroFrame(0.2, 0, m).opacity).toBe(0);
    expect(tatamiHeroFrame(0.7, 0, m).opacity).toBe(1);
    close(tatamiHeroFrame(1, 1, m).cam.sy, b.cam.sy - m.h, 10 ** -6);
    expect(tatamiHeroFrame(1, 1, m).opacity).toBe(0);
  });

  test('the floor scale ties the box to the diagram: 116 units across the box', () => {
    close(diagramPpm(116 * FLOOR_W * 0.01 * 100), 100, 10 ** -6);
  });
});

describe('the isometric floor steps aside only where the tatami is drawn', () => {
  test('hidden for the scene the scene marks live, while 3D is ready; kept otherwise', () => {
    expect(css(diagram)).toMatch(
      /html\[data-belt3d='ready'\] \[data-tatami-live\]\) \.fd:not\(\.fd--compact\) :global\(\.tatami-iso\) \{\s*visibility: hidden;/
    );
    expect(scene).toContain("live?.removeAttribute('data-tatami-live')");
    expect(scene).toContain("root.dataset.belt3d = 'ready'");
  });
});
