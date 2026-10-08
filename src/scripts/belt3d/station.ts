// T7/T8: the dojo environment. One fixed "station" per belt chapter — its own floor plate, a thin
// editorial frame marking its boundary, and its own belt instance (never the shared, pose-animated
// belt that scene.ts still drives for the travel/passage beats). Every station lives permanently at
// its chapter's own `beltDepth()` Z (journey.ts), so the camera travels past real geometry instead of
// one object teleporting its pose: a station that was already passed recedes behind the camera and the
// next one grows ahead, which is the parallax/recession T8 asks for.
//
// Aesthetic: flat, industrial, no gradients — the same language as tatami.ts's mat grid and the belt
// mark's thin keyline (see src/styles/tul/tokens.css: `--belt-line`, `--ink-soft`). A station is a floor
// plate (reusing the tatami's mat tone, not its interactive route/posts — those stay on the one shared
// tatami object scene.ts already draws for the active chapter) plus four corner posts and a thin top
// rail standing in for a wall/frame, and a resting (untied-never, always tied) belt instance tinted
// toward the chapter's own colour.
//
// Performance: a full ProceduralBelt is ~44k triangles (see proceduralBelt.ts's BELT_TRIANGLE_BUDGET).
// Six of them (one per BELT_KEYS entry) would add ~260k triangles if all were always drawn. Since the
// corridor only ever shows a handful of stations around the active one (the rest are behind the far fog
// plane — see scene.ts's applyFrame/applyTatami fog tuning), stations further than STATION_CULL_CHAPTERS
// chapters from the camera's own target are hidden outright (`group.visible = false`): cheap to flip,
// no geometry rebuild, and it keeps the live triangle count bounded to a small neighbourhood instead of
// the whole dojo at once.
import { BoxGeometry, Color, Group, Mesh, MeshStandardMaterial } from 'three';
import { BELT_COLORS, BELT_LINES, BELT_KEYS, type BeltKey } from './colors';
import { beltDepth, FLOOR_TOP } from './journey';
import { createProceduralBelt, type ProceduralBelt } from './proceduralBelt';
import { poseHang } from './poses';

/** Stations further than this many chapter-depths from the camera's target are hidden (perf, see above). */
export const STATION_CULL_CHAPTERS = 3.2;
const PLATE_SIDE = 0.62;
const PLATE_THICK = 0.012;
const POST_H = 0.46;
const POST_W = 0.012;
const RAIL_W = 0.01;

export interface Station {
  belt: BeltKey;
  /** World Z this station is permanently parked at (`beltDepth(belt)`). */
  z: number;
  group: Group;
  proceduralBelt: ProceduralBelt;
}

export interface Stations {
  group: Group;
  stations: Station[];
  /** Hides stations further than `STATION_CULL_CHAPTERS` chapters from `targetZ` (the camera's own target). */
  cull: (targetZ: number) => void;
  dispose: () => void;
}

function buildFrame(line: Color): Group {
  const frame = new Group();
  frame.name = 'station_frame';
  const postGeo = new BoxGeometry(POST_W, POST_H, POST_W);
  const railGeo = new BoxGeometry(PLATE_SIDE + POST_W, RAIL_W, RAIL_W);
  const mat = new MeshStandardMaterial({ color: line, roughness: 0.6, metalness: 0.1 });
  const half = PLATE_SIDE / 2;
  for (const [x, z] of [
    [-half, -half],
    [half, -half],
    [-half, half],
    [half, half]
  ]) {
    const post = new Mesh(postGeo, mat);
    post.position.set(x, FLOOR_TOP + POST_H / 2, z);
    frame.add(post);
  }
  // Two top rails (front and back edge) only: a minimal boundary line, not a boxed-in room.
  for (const z of [-half, half]) {
    const rail = new Mesh(railGeo, mat);
    rail.position.set(0, FLOOR_TOP + POST_H, z);
    frame.add(rail);
  }
  return frame;
}

function buildPlate(field: string): Mesh {
  const geo = new BoxGeometry(PLATE_SIDE, PLATE_THICK, PLATE_SIDE);
  const mat = new MeshStandardMaterial({ color: field, roughness: 0.95, metalness: 0 });
  const plate = new Mesh(geo, mat);
  plate.position.set(0, FLOOR_TOP - PLATE_THICK / 2, 0);
  plate.name = 'station_plate';
  return plate;
}

/** One station: floor plate, editorial frame, and its own tied, resting belt, tinted toward `belt`. */
function buildStation(belt: BeltKey): Station {
  const group = new Group();
  group.name = `station_${belt}`;
  const dark = belt === 'negro';
  const plate = buildPlate(dark ? '#20232a' : '#e7e2d2');
  const frame = buildFrame(new Color(BELT_LINES[belt]));
  group.add(plate, frame);

  const proceduralBelt = createProceduralBelt({ color: BELT_COLORS[belt] });
  proceduralBelt.setColors(BELT_COLORS[belt]);
  poseHang(proceduralBelt, { yaw: 0, k: 1, lean: 0 });
  // Rests on the plate, scaled down a little: a marker of the chapter, not the protagonist belt (that
  // one stays the shared, pose-animated instance scene.ts draws for the active travel/passage beat).
  proceduralBelt.group.scale.setScalar(0.72);
  proceduralBelt.group.position.set(0, FLOOR_TOP + 0.05, 0);
  group.add(proceduralBelt.group);

  const z = beltDepth(belt);
  group.position.z = z;
  return { belt, z, group, proceduralBelt };
}

export function createStations(): Stations {
  const group = new Group();
  group.name = 'dojo_stations';
  const stations = BELT_KEYS.map((belt) => {
    const s = buildStation(belt);
    group.add(s.group);
    return s;
  });

  function cull(targetZ: number): void {
    for (const s of stations) {
      s.group.visible = Math.abs(s.z - targetZ) <= STATION_CULL_CHAPTERS * Math.abs(beltDepth('amarillo'));
    }
  }

  function dispose(): void {
    for (const s of stations) {
      s.proceduralBelt.dispose();
      s.group.traverse((o) => {
        const mesh = o as Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as MeshStandardMaterial | MeshStandardMaterial[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
    }
    group.clear();
  }

  return { group, stations, cull, dispose };
}
