import type { MartialBelt } from './martialExperience';

/**
 * Tul diagram data: one floor diagram per belt chapter.
 *
 * DESIGN LAYER, NOT TECHNIQUE: the shapes and lines of movement below are a
 * simplified visual rendering of each form's ITF floor-plan letter (cross, "工",
 * "士", "土", "一"), drawn as plain lines. They are not the technical execution
 * of the form, its stances or its turning directions.
 *
 * Geometry: points live in a normalized 0..1 square. The first point is the
 * ready point (Joon-bi) and every path ends where it began.
 */

export type BeltKey = MartialBelt['key'];

export type TulShape = 'cross' | 'i-bar' | 'shi-long-top' | 'to-long-bottom' | 'single-line';

export type TulPoint = readonly [x: number, y: number];

/** A stop points at a CV position (martialExperience) or a project (projects). */
export type StopRef = { kind: 'position'; id: string } | { kind: 'project'; id: string };

export interface TulStop {
  ref: StopRef;
  /** Fraction along the path (0..1) where this milestone sits. */
  t: number;
  /** Numbered-arrow index (1..movements) the milestone is attached to. */
  move: number;
}

export interface TulForm {
  id: string;
  /** Romanized ITF name. Not translated. */
  name: string;
  /** `exercise` = fundamental exercise, not a numbered tul. */
  kind: 'exercise' | 'tul';
  movements: number;
  shape: TulShape;
  path: readonly TulPoint[];
  stops: readonly TulStop[];
}

export interface TulChapter {
  beltKey: BeltKey;
  forms: readonly TulForm[];
  /** Chapter-level frame (black belt: NodoSur wraps the three passages). */
  frame?: StopRef;
}

const pos = (id: string): StopRef => ({ kind: 'position', id });
const project = (id: string): StopRef => ({ kind: 'project', id });

/** Spreads refs evenly along the path, avoiding both endpoints. */
function spread(refs: readonly StopRef[], movements: number): TulStop[] {
  return refs.map((ref, i) => {
    const t = Number(((i + 1) / (refs.length + 1)).toFixed(3));
    return { ref, t, move: Math.min(movements, Math.max(1, Math.round(t * movements))) };
  });
}

const CROSS: readonly TulPoint[] = [
  [0.5, 0.5], [0.5, 0.1], [0.5, 0.5], [0.5, 0.9], [0.5, 0.5],
  [0.1, 0.5], [0.5, 0.5], [0.9, 0.5], [0.5, 0.5]
];

/** "工": top bar, vertical, bottom bar. */
const I_BAR: readonly TulPoint[] = [
  [0.5, 0.5], [0.5, 0.1], [0.1, 0.1], [0.9, 0.1], [0.5, 0.1],
  [0.5, 0.9], [0.1, 0.9], [0.9, 0.9], [0.5, 0.9], [0.5, 0.5]
];

/** "士": long horizontal, vertical, short horizontal. */
const SHI: readonly TulPoint[] = [
  [0.5, 0.5], [0.5, 0.15], [0.05, 0.15], [0.95, 0.15], [0.5, 0.15],
  [0.5, 0.85], [0.25, 0.85], [0.75, 0.85], [0.5, 0.85], [0.5, 0.5]
];

/** "土": short horizontal, vertical, long horizontal. */
const TO: readonly TulPoint[] = [
  [0.5, 0.5], [0.5, 0.2], [0.3, 0.2], [0.7, 0.2], [0.5, 0.2],
  [0.5, 0.85], [0.05, 0.85], [0.95, 0.85], [0.5, 0.85], [0.5, 0.5]
];

/** "一": a single horizontal line, there and back. */
const LINE: readonly TulPoint[] = [[0.05, 0.5], [0.95, 0.5], [0.05, 0.5]];

export const TUL_CHAPTERS: Record<BeltKey, TulChapter> = {
  blanco: {
    beltKey: 'blanco',
    forms: [
      {
        id: 'saju-jirugi',
        name: 'Saju Jirugi',
        kind: 'exercise',
        movements: 12,
        shape: 'cross',
        path: CROSS,
        stops: spread([pos('secundario-belgrano')], 12)
      }
    ]
  },
  amarillo: {
    beltKey: 'amarillo',
    forms: [
      {
        id: 'dan-gun',
        name: 'Dan-Gun',
        kind: 'tul',
        movements: 21,
        shape: 'i-bar',
        path: I_BAR,
        stops: spread([pos('grido'), pos('al-natural'), pos('providus'), pos('as-med')], 21)
      }
    ]
  },
  verde: {
    beltKey: 'verde',
    forms: [
      {
        id: 'won-hyo',
        name: 'Won-Hyo',
        kind: 'tul',
        movements: 28,
        shape: 'i-bar',
        path: I_BAR,
        stops: spread([pos('anses-contract')], 28)
      }
    ]
  },
  azul: {
    beltKey: 'azul',
    forms: [
      {
        id: 'joong-gun',
        name: 'Joong-Gun',
        kind: 'tul',
        movements: 32,
        shape: 'shi-long-top',
        path: SHI,
        stops: spread([pos('freelance-media'), pos('anses-permanent')], 32)
      }
    ]
  },
  rojo: {
    beltKey: 'rojo',
    forms: [
      {
        id: 'hwa-rang',
        name: 'Hwa-Rang',
        kind: 'tul',
        movements: 29,
        shape: 'i-bar',
        path: I_BAR,
        stops: spread([pos('sanatorio-delta'), pos('aurea-med'), pos('repuestos-jl')], 29)
      }
    ]
  },
  negro: {
    beltKey: 'negro',
    frame: pos('nodosur'),
    forms: [
      {
        id: 'kwang-gae',
        name: 'Kwang-Gae',
        kind: 'tul',
        movements: 39,
        shape: 'to-long-bottom',
        path: TO,
        stops: spread([project('nodofit')], 39)
      },
      {
        id: 'po-eun',
        name: 'Po-Eun',
        kind: 'tul',
        movements: 36,
        shape: 'single-line',
        path: LINE,
        stops: spread([project('satori')], 36)
      },
      {
        id: 'ge-baek',
        name: 'Ge-Baek',
        kind: 'tul',
        movements: 44,
        shape: 'shi-long-top',
        path: SHI,
        stops: spread([project('donpizza')], 44)
      }
    ]
  }
};

/** Returns the tul chapter of a belt, or undefined for an unknown key. */
export function getTulChapter(beltKey: string): TulChapter | undefined {
  return (TUL_CHAPTERS as Record<string, TulChapter>)[beltKey];
}
