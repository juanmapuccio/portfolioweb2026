// Procedural ITF belt: a quilted cotton band, front wraps, a square knot, two flaps and two tails,
// all swept from code (no model file). Ported from feat/ink-redesign and split into parts so the
// scene can animate them: band, wraps, knot, flapL/flapR, tailL/tailR and the stitches.
//
// Model space: metres, the ring axis is Y, the front of the belt (the knot) faces +Z, the tails hang
// down -Y. The ring is centred on the origin.
import {
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DoubleSide,
  Euler,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  type Object3D,
  RepeatWrapping,
  Shape,
  SRGBColorSpace,
  Vector3
} from 'three';
import { STITCH_NEUTRAL } from './colors';

export interface BeltParts {
  band: Group;
  wraps: Group;
  knot: Group;
  flapL: Group;
  flapR: Group;
  tailL: Group;
  tailR: Group;
  /** Every thread mesh (they all share one material, `materials.stitch`). */
  stitches: Mesh[];
}

interface Rest {
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
}

export interface ProceduralBelt {
  /** Add this to a scene. */
  group: Group;
  parts: BeltParts;
  materials: { cloth: MeshPhysicalMaterial; stitch: MeshPhysicalMaterial };
  /**
   * Cloth colour `from`. With `to` and `mix` the cloth turns into `to` through a noise mask that is fixed on
   * the belt (the change spreads in blotches and stays put while the belt moves). Without `stitch`, the
   * thread follows the cloth colour.
   */
  setColors: (from: string | Color, to?: string | Color, mix?: number, stitch?: string | Color) => void;
  /** Put every part back to its modelled transform (poses are computed from rest, never accumulated). */
  resetPose: () => void;
  dispose: () => void;
}

const MIX_GLSL = /* glsl */ `
varying vec3 vBeltPos;
uniform vec3 uColorB;
uniform float uMix;
float bHash( vec3 p ) {
  p = fract( p * 0.3183099 + 0.1 );
  p *= 17.0;
  return fract( p.x * p.y * p.z * ( p.x + p.y + p.z ) );
}
float bNoise( vec3 x ) {
  vec3 i = floor( x );
  vec3 f = fract( x );
  f = f * f * ( 3.0 - 2.0 * f );
  return mix(
    mix( mix( bHash( i ), bHash( i + vec3( 1.0, 0.0, 0.0 ) ), f.x ), mix( bHash( i + vec3( 0.0, 1.0, 0.0 ) ), bHash( i + vec3( 1.0, 1.0, 0.0 ) ), f.x ), f.y ),
    mix( mix( bHash( i + vec3( 0.0, 0.0, 1.0 ) ), bHash( i + vec3( 1.0, 0.0, 1.0 ) ), f.x ), mix( bHash( i + vec3( 0.0, 1.0, 1.0 ) ), bHash( i + vec3( 1.0, 1.0, 1.0 ) ), f.x ), f.y ),
    f.z );
}
float beltMask() {
  float n = 0.6 * bNoise( vBeltPos * 34.0 ) + 0.4 * bNoise( vBeltPos * 96.0 );
  float t = uMix * 1.24 - 0.12;
  return smoothstep( n - 0.06, n + 0.06, t );
}
`;

/**
 * Triangle budget of the whole belt (T12b). The first version swept ~200k triangles, which was the whole
 * frame cost in software GL; the puffs are 0.4 mm deep and the threads 0.4 mm thick, so the extra rings and
 * profile points were invisible. Counted from the real geometry by `beltTriangleCount` (tests assert it).
 */
export const BELT_TRIANGLE_BUDGET = 60000;

/** Segments along each swept part. */
const SEGMENTS = { band: 100, wrap1: 36, wrap2: 26, flap: 20, tail: 40 } as const;
/** Profile points per quilted puff, and sides of a thread's cross-section. */
const PUFF_STEPS = 4;
const THREAD_SIDES = 4;

/** Ring radii, band width and thickness (metres). */
export const BELT_DIMS = { A: 0.16, B: 0.11, W: 0.045, T: 0.0075 } as const;

interface Frame {
  p: Vector3;
  n: Vector3;
  u: Vector3;
}

const V = (x: number, y: number, z: number): Vector3 => new Vector3(x, y, z);

/** Triangles in every mesh of a belt (indexed geometry). */
export function beltTriangleCount(belt: ProceduralBelt): number {
  let n = 0;
  belt.group.traverse((o) => {
    const geo = (o as Mesh).geometry as BufferGeometry | undefined;
    if (geo) n += (geo.index ? geo.index.count : geo.getAttribute('position').count) / 3;
  });
  return n;
}

export function createProceduralBelt(initial: { color?: string } = {}): ProceduralBelt {
  const { A, B, W, T } = BELT_DIMS;
  const PITCH = 0.064; // twill repeat

  // Cotton twill, drawn once on a small canvas.
  function createWeaveTexture(): CanvasTexture {
    const S = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = S;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new CanvasTexture(canvas);

    const im = ctx.createImageData(S, S);
    const th = 4;
    let seed = 7;
    const rnd = (): number => (seed = (seed * 16807) % 2147483647) / 2147483647;

    for (let j = 0; j < S; j++) {
      for (let i = 0; i < S; i++) {
        const ci = Math.floor(i / th);
        const cj = Math.floor(j / th);
        const over = (ci + cj) % 3 === 0;
        const fx = ((i % th) + 0.5) / th;
        const fy = ((j % th) + 0.5) / th;
        const round = over ? Math.sin(Math.PI * fx) : Math.sin(Math.PI * fy);
        const v = (over ? 255 : 238) * (0.9 + 0.1 * round) + (rnd() - 0.5) * 10;
        const k = (j * S + i) * 4;
        const c = Math.max(0, Math.min(255, v));
        im.data[k] = im.data[k + 1] = im.data[k + 2] = c;
        im.data[k + 3] = 255;
      }
    }
    ctx.putImageData(im, 0, 0);

    const texture = new CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(1 / PITCH, 1 / PITCH);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }

  const tex = createWeaveTexture();

  const cloth = new MeshPhysicalMaterial({
    name: 'belt_cloth',
    color: initial.color ?? '#ece8df',
    map: tex,
    bumpMap: tex,
    bumpScale: 0.8,
    roughness: 0.92,
    metalness: 0,
    sheen: 1,
    sheenRoughness: 0.45,
    sheenColor: new Color('#ffffff'),
    side: DoubleSide
  });

  // Colour change by a noise mask: `uMix` 0..1 sweeps a threshold through 3D value noise of the object-space
  // position, so cloth `uColorB` appears in blotches that are glued to the belt.
  const uColorB = { value: new Color('#ffffff') };
  const uMix = { value: 0 };
  cloth.onBeforeCompile = (shader) => {
    shader.uniforms.uColorB = uColorB;
    shader.uniforms.uMix = uMix;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vBeltPos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvBeltPos = position;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${MIX_GLSL}`)
      .replace('vec4 diffuseColor = vec4( diffuse, opacity );', 'vec4 diffuseColor = vec4( mix( diffuse, uColorB, beltMask() ), opacity );');
  };
  cloth.customProgramCacheKey = () => 'belt_cloth_mix';

  const stitch = new MeshPhysicalMaterial({
    name: 'belt_stitch',
    color: STITCH_NEUTRAL,
    roughness: 0.8,
    sheen: 0.6,
    sheenRoughness: 0.5,
    metalness: 0,
    side: DoubleSide
  });

  const root = new Group();
  root.name = 'taekwondo_belt_root';
  const body = new Group();
  body.name = 'belt_body';
  root.add(body);

  const meshes: Mesh[] = [];
  const stitchMeshes: Mesh[] = [];

  const mesh = (name: string, geo: BufferGeometry, mat: MeshPhysicalMaterial, parent: Object3D): Mesh => {
    const m = new Mesh(geo, mat);
    m.name = name;
    parent.add(m);
    meshes.push(m);
    if (mat === stitch) stitchMeshes.push(m);
    return m;
  };

  const part = (name: string, parent: Object3D = body): Group => {
    const g = new Group();
    g.name = name;
    parent.add(g);
    return g;
  };

  // Sweep profiles along a path, with metric UVs.
  function sweep(profiles: number[][][], frames0: Frame[], closed: boolean): BufferGeometry {
    const fr = closed ? [...frames0, frames0[0]] : frames0;
    const Mn = fr.length;
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];

    const L = [0];
    for (let i = 1; i < Mn; i++) L[i] = L[i - 1] + fr[i].p.distanceTo(fr[i - 1].p);

    for (const p0 of profiles) {
      const prof = [...p0, p0[0]];
      const K = prof.length;
      const C = [0];
      for (let j = 1; j < K; j++) {
        C[j] = C[j - 1] + Math.hypot(prof[j][0] - prof[j - 1][0], prof[j][1] - prof[j - 1][1]);
      }
      const put = (f: Frame, a: number, b: number, uVal: number, vVal: number): void => {
        pos.push(f.p.x + f.n.x * a + f.u.x * b, f.p.y + f.n.y * a + f.u.y * b, f.p.z + f.n.z * a + f.u.z * b);
        uv.push(uVal, vVal);
      };
      const base = pos.length / 3;
      fr.forEach((f, i) => prof.forEach(([a, b], j) => put(f, a, b, L[i], C[j])));
      for (let i = 0; i < Mn - 1; i++) {
        for (let j = 0; j < K - 1; j++) {
          const a = base + i * K + j;
          const c = a + K;
          idx.push(a, c, a + 1, a + 1, c, c + 1);
        }
      }
      if (!closed) {
        for (const rIdx of [0, Mn - 1]) {
          const f = fr[rIdx];
          const b0 = pos.length / 3;
          prof.forEach(([a, b], j) => put(f, a, b, C[j], 0));
          put(f, 0, 0, 0.01, 0.01);
          const c0 = b0 + K;
          for (let j = 0; j < K - 1; j++) {
            if (rIdx === 0) idx.push(c0, b0 + j + 1, b0 + j);
            else idx.push(c0, b0 + j, b0 + j + 1);
          }
        }
      }
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  }

  // Quilted padding profile.
  function puffProfile(Wd: number, Tt: number, puffs: number, amp: number): number[][] {
    const out: number[][] = [];
    const inn: number[][] = [];
    const per = PUFF_STEPS;
    const n = puffs * per;
    for (let i = 0; i <= n; i++) {
      const y = -Wd / 2 + (Wd * i) / n;
      const fr = (i % per) / per;
      const e = i === n ? 0 : Math.pow(Math.sin(Math.PI * fr), 0.75);
      const h = Tt / 2 + amp * e;
      out.push([h, y]);
      inn.push([-h, y]);
    }
    return [...out, [0, Wd / 2 + 0.0004], ...inn.reverse(), [0, -Wd / 2 - 0.0004]];
  }

  function threads(Wd: number, Tt: number, puffs: number, r: number): number[][][] {
    const ps: number[][][] = [];
    for (let k = 1; k < puffs; k++) {
      const y = -Wd / 2 + (Wd * k) / puffs;
      for (const s of [1, -1]) {
        const p: number[][] = [];
        for (let a = 0; a < THREAD_SIDES; a++) {
          const t = (a * 2 * Math.PI) / THREAD_SIDES;
          p.push([s * (Tt / 2 - 0.0001) + r * Math.cos(t), y + r * Math.sin(t)]);
        }
        ps.push(p);
      }
    }
    return ps;
  }

  const ellArc = (rx: number, rz: number, a0: number, a1: number, N: number): Frame[] =>
    Array.from({ length: N }, (_, k) => {
      const t = a0 + ((a1 - a0) * k) / (N - 1);
      const c = Math.cos(t);
      const s = Math.sin(t);
      return { p: V(rx * c, 0, rz * s), n: V(c / rx, 0, s / rz).normalize(), u: V(0, 1, 0) };
    });

  const ellFull = (rx: number, rz: number, N: number): Frame[] =>
    ellArc(rx, rz, 0, (2 * Math.PI * (N - 1)) / N, N);

  function pathFrames(P: (s: number) => Vector3, N: number, ph: number, tw: number): Frame[] {
    const out: Frame[] = [];
    for (let i = 0; i < N; i++) {
      const s = i / (N - 1);
      const p = P(s);
      const t = P(Math.min(1, s + 0.005))
        .sub(P(Math.max(0, s - 0.005)))
        .normalize();
      const z0 = V(0, 0, 1);
      const n = z0.sub(t.clone().multiplyScalar(z0.dot(t))).normalize();
      const u = n.clone().cross(t).normalize();
      const f = tw * Math.sin(s * 4 + ph) * s;
      const cf = Math.cos(f);
      const sf = Math.sin(f);
      out.push({
        p,
        n: n.clone().multiplyScalar(cf).add(u.clone().multiplyScalar(sf)),
        u: u.clone().multiplyScalar(cf).sub(n.clone().multiplyScalar(sf))
      });
    }
    return out;
  }

  const layer = (name: string, fr: Frame[], closed: boolean, parent: Object3D, Wd: number = W, Tt: number = T): void => {
    mesh(name, sweep([puffProfile(Wd, Tt, 5, 0.0004)], fr, closed), cloth, parent);
    mesh(`${name}_stitch`, sweep(threads(Wd, Tt, 5, 0.00042), fr, closed), stitch, parent);
  };

  // 1. Waist band and the front wrap layers
  const band = part('band');
  layer('band_loop', ellFull(A, B, SEGMENTS.band), true, band);
  const wraps = part('wraps');
  layer('wrap_layer_1', ellArc(A + T, B + T, Math.PI / 2 - 0.62, Math.PI / 2 + 0.62, SEGMENTS.wrap1), false, wraps);
  layer('wrap_layer_2', ellArc(A + 2 * T, B + 2 * T, Math.PI / 2 - 0.34, Math.PI / 2 + 0.34, SEGMENTS.wrap2), false, wraps);

  // 2. Front knot (its group origin is the centre of the plate, so scale and rotation pivot there)
  const zs = B + 0.008;
  const kw = 0.064;
  const kh = 0.05;
  const r = 0.012;
  const sh = new Shape();
  sh.moveTo(-kw / 2 + r, -kh / 2);
  sh.lineTo(kw / 2 - r, -kh / 2);
  sh.quadraticCurveTo(kw / 2, -kh / 2, kw / 2, -kh / 2 + r);
  sh.lineTo(kw / 2, kh / 2 - r);
  sh.quadraticCurveTo(kw / 2, kh / 2, kw / 2 - r, kh / 2);
  sh.lineTo(-kw / 2 + r, kh / 2);
  sh.quadraticCurveTo(-kw / 2, kh / 2, -kw / 2, kh / 2 - r);
  sh.lineTo(-kw / 2, -kh / 2 + r);
  sh.quadraticCurveTo(-kw / 2, -kh / 2, -kw / 2 + r, -kh / 2);

  const knot = part('knot');
  knot.position.set(0, 0, zs + 0.006);
  const kg = new ExtrudeGeometry(sh, {
    depth: 0.012,
    bevelEnabled: true,
    bevelSize: 0.006,
    bevelThickness: 0.007,
    bevelSegments: 5,
    curveSegments: 8
  });
  kg.translate(0, 0, -0.006);
  mesh('knot_body', kg, cloth, knot);

  const zf = 0.006 + 0.007 + 0.0003;
  [-0.0165, -0.0055, 0.0055, 0.0165].forEach((y, i) => {
    const l = mesh(`knot_stitch_${i + 1}`, new CylinderGeometry(0.00042, 0.00042, 0.066, 6), stitch, knot);
    l.rotation.z = Math.PI / 2;
    l.position.set(0, y, zf);
  });

  // 3. Flaps either side of the knot (group origin = where they leave the knot)
  const flaps: Record<'left' | 'right', Group> = { left: new Group(), right: new Group() };
  (
    [
      [-1, 'left'],
      [1, 'right']
    ] as const
  ).forEach(([s, nm]) => {
    const g = part(`flap_${nm}`);
    g.position.set(s * 0.022, 0, zs + 0.004);
    const P = (t: number): Vector3 => V(s * 0.062 * t, -0.004 * t - 0.02 * t * t, -0.012 * t);
    layer(`knot_flap_${nm}`, pathFrames(P, SEGMENTS.flap, s, s * 0.25), false, g, 0.04, T);
    flaps[nm] = g;
  });

  // 4. Hanging tails (group origin = where they leave the knot)
  function tail(name: string, len: number, x: number, z: number, rz: number, ph: number, tw: number): Group {
    const P = (s: number): Vector3 =>
      V(0.005 * Math.sin(s * 4.5 + ph) * s, -len * s, -0.014 * s * s + 0.004 * Math.sin(s * 6 + ph) * s);
    const g = part(name);
    g.position.set(x, -0.022, z);
    g.rotation.set(-0.03, 0, rz);
    layer(name, pathFrames(P, SEGMENTS.tail, ph, tw), false, g);
    return g;
  }
  const tailL = tail('tail_left', 0.25, -0.014, zs + 0.006, -0.1, 0.6, 0.35);
  const tailR = tail('tail_right', 0.205, 0.014, zs + 0.002, 0.12, 2.1, -0.3);

  const parts: BeltParts = {
    band,
    wraps,
    knot,
    flapL: flaps.left,
    flapR: flaps.right,
    tailL,
    tailR,
    stitches: stitchMeshes
  };

  // Remember the modelled transform of every animated part.
  const animated: Object3D[] = [band, wraps, knot, flaps.left, flaps.right, tailL, tailR];
  const rest = new Map<Object3D, Rest>(
    animated.map((o) => [o, { position: o.position.clone(), rotation: o.rotation.clone(), scale: o.scale.clone() }])
  );

  const resetPose = (): void => {
    for (const o of animated) {
      const r0 = rest.get(o);
      if (!r0) continue;
      o.position.copy(r0.position);
      o.rotation.copy(r0.rotation);
      o.scale.copy(r0.scale);
    }
  };

  const tint = (hex: Color): Color => {
    const hsl = { h: 0, s: 0, l: 0 };
    hex.getHSL(hsl);
    hsl.l = hsl.l > 0.25 ? hsl.l * 0.8 : hsl.l + 0.1;
    return new Color().setHSL(hsl.h, hsl.s, hsl.l);
  };

  const mixed = new Color();
  const setColors = (from: string | Color, to?: string | Color, mix = 0, st?: string | Color): void => {
    cloth.color.set(from);
    uColorB.value.set(to ?? from);
    uMix.value = to === undefined ? 0 : mix;
    if (st !== undefined) {
      stitch.color.set(st);
      return;
    }
    mixed.copy(cloth.color).lerp(uColorB.value, uMix.value);
    stitch.color.copy(tint(mixed));
  };

  const dispose = (): void => {
    for (const m of meshes) m.geometry.dispose();
    cloth.dispose();
    stitch.dispose();
    tex.dispose();
  };

  return { group: root, parts, materials: { cloth, stitch }, setColors, resetPose, dispose };
}
