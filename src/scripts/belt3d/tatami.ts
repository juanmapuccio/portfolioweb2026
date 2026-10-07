// The tatami: the floor of FloorDiagram, drawn in 3D inside the one scene of scene.ts (T12c).
// It imports three, so it is part of the lazy scene chunk and nothing else imports it.
//
// What it draws, for the diagram whose scene is active:
//   - the floor: ten tatami mats in ONE InstancedMesh (a seam between them, a subtle canvas-2D rush weave),
//   - the route of the tul: a thin tube in the belt's line colour, drawn by `--draw` (a draw range),
//   - one post per milestone at the diagram coordinates FloorDiagram uses, with a numbered disc sprite.
// Everything lives on layer 1: scene.ts renders it with its own camera (journey.ts) and then the belt
// on top with the belt camera, in the same scene, the same renderer and the same canvas.
//
// Coordinates: a diagram point (x, y) in 0..100 units lies at world ((x - 50), (y - 50)) * 0.01 * FLOOR_W metres
// on the XZ plane; the floor surface is at y = FLOOR_TOP, where the belt rests.
import {
  BoxGeometry,
  CanvasTexture,
  Color,
  CurvePath,
  CylinderGeometry,
  Group,
  InstancedMesh,
  Line,
  LineCurve3,
  LineDashedMaterial,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  type Object3D,
  type PerspectiveCamera,
  Quaternion,
  Raycaster,
  RepeatWrapping,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TubeGeometry,
  Vector2,
  Vector3,
  BufferGeometry
} from 'three';
import { FLOOR_TOP, FLOOR_W } from './journey';

export interface TatamiStop {
  /** Movement number shown in the disc. */
  n: number;
  /** Diagram units, 0..100. */
  x: number;
  y: number;
  /** Fraction along the route where the milestone sits (the post appears once `--draw` passes it). */
  t: number;
  /** Position id: the post opens the experience panel with it. Projects have none. */
  id?: string;
  /** Text of the tooltip. */
  l?: string;
}

export interface TatamiData {
  /** The route, diagram units. */
  p: [number, number][];
  s: TatamiStop[];
}

/** Layer the tatami lives on; the belt stays on layer 0. */
export const TATAMI_LAYER = 1;

const UNIT = 0.01 * FLOOR_W;
/** The floor covers the diagram frame (0..100) plus a margin, so the posts at the edges stand on it. */
const FLOOR_SIDE = 108 * UNIT;
const MAT_THICK = 0.014;
const SEAM = 0.009;
const ROUTE_RADIUS = 0.0045;
const ROUTE_TUBULAR = 240;
const ROUTE_RADIAL = 5;
const POST_H = 0.1;
const DISC = 0.066;
const DISC_HOVER = 0.084;
/** Opacity a post gains per unit of `--draw` past its stop: the same 24 as the isometric SVG (TatamiIso). */
const REVEAL_RATE = 24;

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));
const toWorld = (x: number, y: number, h = 0): Vector3 => new Vector3((x - 50) * UNIT, FLOOR_TOP + h, (y - 50) * UNIT);

interface Post {
  stop: TatamiStop;
  stem: Mesh;
  disc: Sprite;
  hit: Mesh;
  top: Vector3;
}

interface Form {
  group: Group;
  route: Mesh;
  ghost: Line;
  posts: Post[];
  dispose: () => void;
}

export interface Tatami {
  group: Group;
  /** Show the diagram `key` (built the first time). `line` / `field` are hex colours of the belt chapter. */
  show: (key: string, data: TatamiData, line: string, field: string) => void;
  /**
   * `opacity` of everything, `draw` 0..1 (route and posts), `all`: show every post whatever `draw` is
   * (the on-demand mobile view has no scroll-drawn route).
   */
  look: (opacity: number, draw: number, all: boolean) => void;
  setYaw: (rad: number) => void;
  /** Index of the post under the pointer, or -1. Called by scene.ts on pointer moves and touch taps only. */
  pick: (clientX: number, clientY: number, w: number, h: number, camera: PerspectiveCamera) => number;
  setHover: (index: number) => void;
  /** World position of the top of a post, for the tooltip. */
  postTop: (index: number, out: Vector3) => Vector3;
  stopOf: (index: number) => TatamiStop | undefined;
  dispose: () => void;
}

/** Fine horizontal rush lines with a few cross threads, drawn once. Multiplies the mat colour. */
function weaveTexture(): CanvasTexture {
  const S = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext('2d');
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  texture.repeat.set(3, 10);
  if (!ctx) return texture;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, S, S);
  for (let y = 0; y < S; y += 2) {
    ctx.fillStyle = `rgba(60,48,20,${y % 4 === 0 ? 0.1 : 0.04})`;
    ctx.fillRect(0, y, S, 1);
  }
  ctx.fillStyle = 'rgba(60,48,20,0.07)';
  for (let x = 0; x < S; x += 16) ctx.fillRect(x, 0, 1, S);
  return texture;
}

/** The numbered disc of a post: field fill, belt-line ring and number (the CSS `fd-mk__disc`). */
function discTexture(n: number, line: string, field: string): CanvasTexture {
  const S = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext('2d');
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  if (!ctx) return texture;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 7, 0, Math.PI * 2);
  ctx.fillStyle = field;
  ctx.fill();
  ctx.lineWidth = 9;
  ctx.strokeStyle = line;
  ctx.stroke();
  ctx.fillStyle = line;
  ctx.font = '700 62px "Archivo Variable", Archivo, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(n), S / 2, S / 2 + 3);
  return texture;
}

export function createTatami(): Tatami {
  const group = new Group();
  group.name = 'tatami';
  const forms = new Map<string, Form>();
  let current: Form | undefined;
  let hover = -1;
  let hits: Object3D[] = [];
  const raycaster = new Raycaster();
  raycaster.layers.set(TATAMI_LAYER);
  const ndc = new Vector2();

  // ---- The floor: one draw call for the mats, one for the dark underlay the seams show ----------------------
  const weave = weaveTexture();
  const matGeo = new BoxGeometry(1, 1, 1);
  const matMaterial = new MeshStandardMaterial({ color: '#d8d3c4', map: weave, roughness: 0.95, metalness: 0 });
  const baseGeo = new BoxGeometry(FLOOR_SIDE, 0.002, FLOOR_SIDE);
  const baseMaterial = new MeshStandardMaterial({ color: '#4d4a40', roughness: 1, metalness: 0 });

  // Mats are 2:1. Four rows; the odd rows are shifted by half a mat, so the ends are half mats.
  const rows = 4;
  const rowD = FLOOR_SIDE / rows;
  const matW = rowD * 2;
  const mats: { x: number; z: number; w: number }[] = [];
  for (let r = 0; r < rows; r++) {
    const z = -FLOOR_SIDE / 2 + rowD * (r + 0.5);
    if (r % 2 === 0) {
      mats.push({ x: -matW / 2, z, w: matW }, { x: matW / 2, z, w: matW });
    } else {
      mats.push({ x: -FLOOR_SIDE / 2 + matW / 4, z, w: matW / 2 }, { x: 0, z, w: matW }, { x: FLOOR_SIDE / 2 - matW / 4, z, w: matW / 2 });
    }
  }
  const floor = new InstancedMesh(matGeo, matMaterial, mats.length);
  const m4 = new Matrix4();
  const q0 = new Quaternion();
  mats.forEach((m, i) => {
    m4.compose(new Vector3(m.x, FLOOR_TOP - MAT_THICK / 2, m.z), q0, new Vector3(m.w - SEAM, MAT_THICK, rowD - SEAM));
    floor.setMatrixAt(i, m4);
  });
  floor.instanceMatrix.needsUpdate = true;
  floor.name = 'tatami_mats';
  const base = new Mesh(baseGeo, baseMaterial);
  base.position.set(0, FLOOR_TOP - 0.008, 0);
  group.add(base, floor);
  group.traverse((o) => o.layers.set(TATAMI_LAYER));

  // ---- One diagram -------------------------------------------------------------------------------------------
  function build(data: TatamiData, line: string, field: string): Form {
    const g = new Group();
    const disposables: { dispose: () => void }[] = [];
    const own = <T extends { dispose: () => void }>(o: T): T => {
      disposables.push(o);
      return o;
    };

    const pts = data.p.map(([x, y]) => toWorld(x, y, 0.004));
    const path = new CurvePath<Vector3>();
    for (let i = 1; i < pts.length; i++) path.add(new LineCurve3(pts[i - 1], pts[i]));
    const routeGeo = own(new TubeGeometry(path, ROUTE_TUBULAR, ROUTE_RADIUS, ROUTE_RADIAL, false));
    const routeMat = own(new MeshBasicMaterial({ color: line, toneMapped: false, transparent: true }));
    const route = new Mesh(routeGeo, routeMat);
    route.name = 'tatami_route';

    const ghostGeo = own(new BufferGeometry().setFromPoints(pts));
    const ghostMat = own(new LineDashedMaterial({ color: line, dashSize: 0.014, gapSize: 0.016, toneMapped: false, transparent: true }));
    const ghost = new Line(ghostGeo, ghostMat);
    ghost.computeLineDistances();
    g.add(ghost, route);

    const stemGeo = own(new CylinderGeometry(0.0035, 0.0035, POST_H, 6));
    const hitGeo = own(new SphereGeometry(0.05, 8, 6));
    const posts: Post[] = data.s.map((stop, i) => {
      const foot = toWorld(stop.x, stop.y);
      const stem = new Mesh(stemGeo, own(new MeshBasicMaterial({ color: line, toneMapped: false, transparent: true })));
      stem.position.copy(foot).y += POST_H / 2;
      const top = foot.clone();
      top.y += POST_H + DISC / 2;
      const disc = new Sprite(
        own(new SpriteMaterial({ map: own(discTexture(stop.n, line, field)), toneMapped: false, transparent: true }))
      );
      disc.position.copy(top);
      disc.scale.setScalar(DISC);
      // A generous invisible target on top of the post: a finger is wider than the disc.
      const hit = new Mesh(hitGeo, own(new MeshBasicMaterial({ visible: false })));
      hit.position.copy(top);
      hit.userData.post = i;
      disc.userData.post = i;
      stem.userData.post = i;
      g.add(stem, disc, hit);
      return { stop, stem, disc, hit, top };
    });

    g.traverse((o) => o.layers.set(TATAMI_LAYER));
    return {
      group: g,
      route,
      ghost,
      posts,
      dispose: () => {
        g.removeFromParent();
        for (const d of disposables) d.dispose();
      }
    };
  }

  function show(key: string, data: TatamiData, line: string, field: string): void {
    // On the black field the floor is charcoal (a straw floor would glow); on the white one it is pale straw.
    const dark = new Color(field).getHSL({ h: 0, s: 0, l: 0 }).l < 0.3;
    matMaterial.color.set(dark ? '#34363a' : '#d8d3c4');
    baseMaterial.color.set(dark ? '#141517' : '#2f2d27');
    let form = forms.get(key);
    if (!form) {
      form = build(data, line, field);
      forms.set(key, form);
      group.add(form.group);
    }
    if (current === form) return;
    if (current) current.group.visible = false;
    current = form;
    form.group.visible = true;
    hover = -1;
    hits = [];
  }

  function look(opacity: number, draw: number, all: boolean): void {
    const o = clamp01(opacity);
    const visible = o > 0;
    floor.visible = base.visible = visible;
    matMaterial.opacity = baseMaterial.opacity = o;
    matMaterial.transparent = baseMaterial.transparent = o < 1;
    if (!current) return;
    const f = current;
    const d = clamp01(draw);
    const routeMat = f.route.material as MeshBasicMaterial;
    routeMat.opacity = o;
    (f.ghost.material as LineDashedMaterial).opacity = 0.4 * o;
    f.route.geometry.setDrawRange(0, Math.floor(d * ROUTE_TUBULAR) * ROUTE_RADIAL * 6);
    hits = [];
    for (const p of f.posts) {
      const a = (all ? 1 : clamp01((d - p.stop.t) * REVEAL_RATE)) * o;
      (p.stem.material as MeshBasicMaterial).opacity = a;
      (p.disc.material as SpriteMaterial).opacity = a;
      p.stem.visible = p.disc.visible = a > 0.02;
      if (a >= 0.5) hits.push(p.hit);
    }
  }

  function setHover(index: number): void {
    if (index === hover || !current) return;
    hover = index;
    current.posts.forEach((p, i) => p.disc.scale.setScalar(i === index ? DISC_HOVER : DISC));
  }

  function pick(clientX: number, clientY: number, w: number, h: number, camera: PerspectiveCamera): number {
    if (!hits.length || w <= 0 || h <= 0) return -1;
    ndc.set((clientX / w) * 2 - 1, -(clientY / h) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const found = raycaster.intersectObjects(hits, false)[0];
    return found ? (found.object.userData.post as number) : -1;
  }

  const postTop = (index: number, out: Vector3): Vector3 => {
    const p = current?.posts[index];
    if (!p) return out.set(0, 0, 0);
    group.updateMatrixWorld(true);
    return group.localToWorld(out.copy(p.top).setY(p.top.y + DISC / 2));
  };

  const dispose = (): void => {
    for (const f of forms.values()) f.dispose();
    forms.clear();
    current = undefined;
    matGeo.dispose();
    matMaterial.dispose();
    baseGeo.dispose();
    baseMaterial.dispose();
    weave.dispose();
    floor.dispose();
    group.removeFromParent();
  };

  return {
    group,
    show,
    look,
    setYaw: (rad) => {
      group.rotation.y = rad;
    },
    pick,
    setHover,
    postTop,
    stopOf: (index) => current?.posts[index]?.stop,
    dispose
  };
}
