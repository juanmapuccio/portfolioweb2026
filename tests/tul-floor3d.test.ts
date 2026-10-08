import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(p, 'utf8');
const diagram = read('src/components/tul/FloorDiagram.astro');
const iso = read('src/components/tul/TatamiIso.astro');
const engine = read('src/scripts/tul.ts');
const css = (src: string) => src.slice(src.indexOf('<style>'));
const markup = (src: string) => src.slice(src.indexOf('---', 3), src.indexOf('<style>'));

// The floor is a build-time isometric SVG (TatamiIso) inside a container (FloorDiagram). There is no CSS 3D plane.
describe('floor: a container for the 3D tatami with an isometric SVG fallback', () => {
  test('FloorDiagram has no CSS perspective plane: no tilt, no camera variables, no upright HTML posts', () => {
    for (const gone of ['rotateX', 'rotateZ', 'perspective', 'preserve-3d', '--tv', '--tilt', '--yaw', '--cam', 'fd__stage', 'fd__plane', 'fd-mk', '@supports']) {
      expect(diagram).not.toContain(gone);
    }
    expect(css(diagram)).not.toMatch(/transform\s*:/);
  });

  test('it mounts TatamiIso, keeps data-tatami for the 3D scene and keeps the portrait and overlay slots', () => {
    expect(diagram).toContain("import TatamiIso from './TatamiIso.astro'");
    expect(markup(diagram)).toContain('<TatamiIso');
    expect(diagram).toContain('data-tatami={tatami}');
    expect(diagram).toContain('const numbered = labelled && !compact;');
    // The Kyong-ye return has no numbers on its posts but is drawn by the 3D scene too (the tatami prop).
    expect(diagram).toMatch(/const tatami = numbered \|\| \(forScene && !compact\)\s*\?\s*JSON\.stringify\(/);
    expect(diagram).toContain('name="portrait"');
    expect(diagram).toContain("Astro.slots.has('overlay')");
  });

  test('the SVG is the floor whenever the 3D tatami is not drawn: it steps aside only for the live scene, at any opacity', () => {
    expect(css(diagram)).toMatch(
      /:global\(html\[data-belt3d='ready'\] \[data-tatami-live\]\) \.fd:not\(\.fd--compact\) :global\(\.tatami-iso\) \{\s*visibility: hidden;/
    );
    const scene = read('src/scripts/belt3d/scene.ts');
    // No opacity threshold decides it: the scene marks the drawn diagram live as soon as it is drawn.
    expect(scene).toContain('setLive(tv.entry.scene, tv.keep);');
    expect(scene).not.toMatch(/setLive\(tv\.frame\.opacity/);
  });

  test('the SVG is generated at build time: projected polygons, no client script', () => {
    expect(iso).toContain("from './tatamiIso'");
    expect(iso).toContain('buildTatamiIso(');
    expect(iso).not.toMatch(/<script/);
    expect(iso).toContain('class="tiso-t"');
    expect(iso).toContain('class="tiso-l"');
    expect(iso).toContain('class="tiso-r"');
    expect(iso).toContain('class="tiso-base"');
  });

  test('the number of a post is horizontal text on its left face: no rotation or skew on text', () => {
    expect(iso).toContain('class="tiso-num"');
    expect(iso).toContain('text-anchor="middle"');
    expect(css(iso)).not.toContain('skew');
    const textRule = css(iso).match(/\.tiso-num \{([^}]*)\}/)?.[1] ?? '';
    expect(textRule).not.toMatch(/transform/);
    expect(iso).not.toMatch(/<text[^>]*transform=/);
  });

  test('depth is geometry only: no gradient, filter or shadow, and the tones come from the page tokens', () => {
    const styles = css(iso) + css(diagram);
    expect(styles).not.toMatch(/gradient/);
    expect(styles).not.toMatch(/filter\s*:/);
    expect(styles).not.toContain('box-shadow');
    expect(styles).not.toContain('drop-shadow');
    expect(iso).not.toMatch(/<(linearGradient|radialGradient|filter)/);
    for (const token of ['--ink', '--field', '--belt-line']) expect(css(iso)).toContain(`var(${token}`);
    // No hard-coded colour in the style rules (the brush mask uses black and white only as luminance).
    expect(css(iso)).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
  });

  test('motion is transform and the draw only, from the scene --p and --draw', () => {
    expect(css(iso)).toMatch(/transform:\s*rotate\(calc\(\(var\(--p, 0\.5\) - 0\.5\) \* 5deg\)\) scale\(/);
    expect(css(iso)).toMatch(/stroke-dashoffset:\s*calc\(1 - var\(--draw, 1\)\)/);
    expect(css(iso)).toMatch(/opacity:\s*clamp\(0, calc\(\(var\(--draw, 1\) - var\(--t, 0\)\) \* 24\), 1\)/);
    // The stylesheet animates nothing by itself: no keyframes, no transitions.
    expect(css(iso)).not.toMatch(/@keyframes|transition/);
  });

  test('no JS and reduced motion: the route is drawn (--draw unset = 1), the SVG rests and nothing hides', () => {
    const reduce = css(iso).slice(css(iso).indexOf('prefers-reduced-motion: reduce'));
    expect(reduce).toMatch(/\.tatami-iso \{\s*transform: none;/);
    expect(css(iso)).not.toMatch(/html\.js/);
    expect(css(iso)).not.toMatch(/visibility:\s*hidden/);
  });

  test('on the dark field the faces still separate: tones mix ink into the field, so they invert with the tokens', () => {
    expect(css(iso)).toMatch(/--tiso-top:\s*color-mix\(in srgb, var\(--ink\) \d+%, var\(--field\)\)/);
    expect(css(iso)).toMatch(/--tiso-left:\s*color-mix\(in srgb, var\(--ink\) \d+%, var\(--field\)\)/);
    expect(css(iso)).toMatch(/--tiso-right:\s*color-mix\(in srgb, var\(--ink\) \d+%, var\(--field\)\)/);
    expect(css(iso)).toMatch(/--tiso-base:\s*color-mix\(in srgb, var\(--ink\) \d+%, var\(--field\)\)/);
  });

  test('the hero floor stays out of sight until the portrait gives way (--q)', () => {
    expect(css(iso)).toMatch(/\.tatami-iso--portrait \{\s*opacity:\s*clamp\(0, calc\(\(var\(--q, 0\) - 0\.3\) \* 1\.4286\), 1\)/);
    expect(css(diagram)).toMatch(/\.fd__frame \{[^}]*opacity:\s*clamp\(0, calc\(1 - \(var\(--q, 0\) - 0\.3\) \* 1\.6\), 1\)/s);
  });

  test('the engine adds no per-frame loop or smooth-scroll library for the camera', () => {
    expect(engine).not.toContain('requestAnimationFrame');
    expect(engine).not.toContain('new Lenis');
  });
});
