import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { BELT_LINES } from '../src/scripts/belt3d/colors';
import { routeOf } from '../src/data/tulRoute';
import {
  FLOOR_W,
  diagramPpm,
  frameFor,
  heroFrame,
  outroFrame,
  stageOffset,
  stageScore,
  tapBeltFrame,
  tatamiChapterFrame,
  tatamiHeroFrame,
  tatamiLowFrame,
  travelFrame,
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
  hero: { x: 1080, y: 470, s: 364 }
};
/** The box of a chapter figure, as tul.ts publishes it on its scene (centre and width, px). */
const box = { x: 1100, y: 480, s: 560 };
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
    const a = tatamiChapterFrame(0.02, box);
    const b = tatamiChapterFrame(0.5, box);
    const c = tatamiChapterFrame(0.98, box);
    // Elevation above the horizon = 90 degrees minus the CSS tilt.
    close(a.cam.elevation / DEG, 90 - (58 - 14 * 0.02), 10 ** -4);
    close(b.cam.elevation / DEG, 90 - 51, 10 ** -4);
    close(c.cam.elevation / DEG, 90 - (58 - 14 * 0.98), 10 ** -4);
    expect(c.cam.elevation).toBeGreaterThan(a.cam.elevation);
    // Dolly times the fit of the CSS plane (1 - 0.0048 * tilt).
    close(a.cam.ppm, diagramPpm(box.s) * (0.96 + 0.08 * 0.02) * (1 - 0.0048 * (58 - 14 * 0.02)), 10 ** -6);
    expect(c.cam.ppm).toBeGreaterThan(a.cam.ppm);
    // Where the map sits on screen: its box, lifted like the CSS plane (0.14% of the width per degree).
    expect(b.cam.sx).toBe(box.x);
    close(b.cam.sy, box.y - 0.0014 * box.s * 51, 10 ** -6);
    // The camera is the only 3D left on the page: the diagram declares no tilt of its own.
    expect(css(diagram)).not.toMatch(/--tv|--cam|rotateX/);
  });

  test('it does not fade at the ends of the pin: the route is already drawn at both, and the stage offset moves it', () => {
    for (const p of [0, 0.5, 1]) expect(tatamiChapterFrame(p, box).opacity).toBe(1);
    close(tatamiChapterFrame(0.5, box).yaw, 8 * DEG, 10 ** -8);
    // The same frame, shifted by the stage's offset from its pinned place.
    close(tatamiChapterFrame(0.5, box, 120).cam.sy - tatamiChapterFrame(0.5, box).cam.sy, 120, 10 ** -9);
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
    expect(scene).toContain("e.removeAttribute('data-tatami-live')");
    expect(scene).toContain("root.dataset.belt3d = 'ready'");
  });
});

describe('sticky coherence: a tatami for every stage, from entry to exit', () => {
  const engine = read('src/scripts/tul.ts');
  const ky = read('src/components/tul/KyongYe.astro');

  test('the stage offset follows the scroll: from the viewport bottom into place, then up and out', () => {
    expect(stageOffset(0, 0, 900, 48)).toBe(900 - 48);
    expect(stageOffset(0.5, 0, 900, 48)).toBe(450 - 48);
    // In place (the sticky offset reached) and while pinned.
    expect(stageOffset(1, 0, 900, 48)).toBe(0);
    expect(stageOffset(0.99, 0, 900, 48)).toBe(0);
    expect(stageOffset(1, 0.5, 900, 48)).toBe(-450);
    expect(stageOffset(1, 1, 900, 48)).toBe(-900);
  });

  test('the stage most in place owns the tatami; adjacent stages hand over when both are half away', () => {
    expect(stageScore(0, 0)).toBe(0);
    expect(stageScore(1, 1)).toBe(0);
    expect(stageScore(1, 0)).toBe(1);
    // The leaving stage (ex) and the next one entering (en = ex): equal at the half.
    expect(stageScore(1, 0.4)).toBeGreaterThan(stageScore(0.4, 0));
    expect(stageScore(1, 0.6)).toBeLessThan(stageScore(0.6, 0));
    close(stageScore(1, 0.5), stageScore(0.5, 0), 10 ** -12);
  });

  const route = routeOf([[10, 50], [50, 50], [50, 10], [90, 10]]);

  test('the low camera sits near the floor, travels the route and cuts the picture to its box', () => {
    const a = tatamiLowFrame(0, box, route);
    const b = tatamiLowFrame(1, box, route);
    expect(a.cam.elevation / DEG).toBeLessThan(25);
    expect(a.opacity).toBe(1);
    expect(a.cam.target).not.toEqual(b.cam.target);
    expect(a.yaw).toBeLessThan(b.yaw);
    expect(a.clip?.w).toBe(box.s);
    close((a.clip?.x ?? 0) + (a.clip?.w ?? 0) / 2, box.x, 10 ** -9);
    close((a.clip?.y ?? 0) + (a.clip?.h ?? 0) / 2, box.y, 10 ** -9);
    // Close up: more pixels per metre than the chapter view.
    expect(a.cam.ppm).toBeGreaterThan(tatamiChapterFrame(0.5, box).cam.ppm);
    close((tatamiLowFrame(0.5, box, route, -200).clip?.y ?? 0) - (tatamiLowFrame(0.5, box, route).clip?.y ?? 0), -200, 10 ** -9);
  });

  test('the black outro rises, turns and fades the resting belt, and starts from the pose travel leaves it in', () => {
    const rest = travelFrame('negro', 0.85, m, false);
    expect(outroFrame(rest, 0, m)).toBe(rest);
    const end = outroFrame(rest, 1, m);
    expect(end.cam.sy).toBeLessThan(rest.cam.sy);
    expect(end.opacity).toBe(0);
    expect(end.pose.kind === 'hang' && rest.pose.kind === 'hang' ? end.pose.yaw > rest.pose.yaw : false).toBe(true);
    // Without the outro the belt fades at the end of the chapter; with it, only the outro fades it.
    const beat = { kind: 'travel', belt: 'negro', from: 'negro' } as const;
    expect(frameFor(beat, 0.95, 0, 0, m, 0).opacity).toBeLessThan(1);
    expect(frameFor(beat, 0.95, 0, 0, m, 0, 0).opacity).toBe(1);
    expect(frameFor(beat, 0.95, 0, 0, m, 0, 1).opacity).toBe(0);
  });

  test('on a phone the hero belt rests on its floor and rides up with it instead of flying to a column', () => {
    const rest = tapBeltFrame(0, m);
    const hero = heroFrame(1, 0, m, 0);
    expect(rest.pose).toEqual(hero.pose);
    expect(rest.cam).toEqual(hero.cam);
    const away = tapBeltFrame(1, m);
    close(away.cam.sy, hero.cam.sy - m.h, 10 ** -6);
    expect(away.opacity).toBe(0);
    expect(away.blend).toBe(0);
  });

  test('the scene picks the stage by score, not by the belt beat; it clips the low camera with a scissor', () => {
    expect(scene).toContain('stageScore(en, ex)');
    expect(scene).toContain('stageOffset(en, ex, metrics.h');
    expect(scene).toContain("readNum(t.scene, '--en', 0)");
    expect(scene).toContain('renderer.setScissorTest(true)');
    expect(scene).toContain('renderer.setScissorTest(false)');
    expect(scene).not.toMatch(/beat\.kind !== 'travel'/);
  });

  test('tul.ts writes the exact entry and exit progress and the figure box on each scene, on desktop with motion', () => {
    expect(engine).toMatch(/ScrollTrigger\.create\(\{ trigger: scene, start: 'top bottom', end: 'top top'/);
    expect(engine).toMatch(/ScrollTrigger\.create\(\{ trigger: scene, start: 'bottom bottom', end: 'bottom top'/);
    expect(engine).toContain("scene.style.setProperty('--tat-s'");
    expect(engine).toContain('const stages = wide');
  });

  test('on a phone --bp is written only while "Ver en 3D" is on, so the hero belt hands over to the chapters', () => {
    expect(engine).toContain("root.dataset.belt3dTap === 'on'");
    expect(engine).toMatch(/if \(tapOn\(\)\) el\.style\.setProperty\('--bp'/);
    expect(engine).toContain("window.addEventListener('tul:belt3d-tap', () => {");
  });

  test('the red automation block is a tatami beat with a low camera; the black outro and Kyong-ye are wired', () => {
    expect(chapter).toContain('data-tatami-low');
    expect(chapter).toMatch(/<div class="auto__map" data-tatami-box aria-hidden="true">\s*<FloorDiagram form=\{mainForm\} labelled progress/);
    expect(chapter).toContain('data-belt-outro');
    expect(scene).toContain("el.querySelector<HTMLElement>('[data-belt-outro]')");
    expect(scene).toContain("low: scene.hasAttribute('data-tatami-low')");
    expect(ky).toContain('<FloorDiagram form={RETURN_FORM} progress tatami');
  });

  test('below 62rem nothing is pinned and nothing scrolls inside: only the figure sticks, the copy flows', () => {
    const style = css(chapter).split(String.fromCharCode(13)).join('');
    const pinned = style.match(/@media \(min-width: 62rem\) and \(prefers-reduced-motion: no-preference\) \{[\s\S]*?\n  \}\n/)?.[0] ?? '';
    expect(pinned).toContain('overflow-y: auto');
    expect(pinned).toContain('position: sticky');
    const phone = style.match(/@media \(max-width: 61\.99rem\) and \(prefers-reduced-motion: no-preference\) \{[\s\S]*?\n  \}\n/)?.[0] ?? '';
    expect(phone).toMatch(/\.tc__scene--pin \.tc__side--map \{\s*position: sticky;\s*top: 3rem;[\s\S]*max-height: 45svh/);
    expect(phone).toMatch(/\.tc__scene--pin \.tc__stage \{\s*display: block;/);
    expect(phone).not.toContain('overflow-y');
    expect(phone).not.toMatch(/height: calc\(100svh/);
  });
});
