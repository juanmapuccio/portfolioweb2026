import type { Lang } from '../../i18n/ui';
import { BELTS, martialExperienceData } from '../../data/martialExperience';

/** The coloured belts the sprint runs through, in order. The black belt is where it lands (BlackBeltWork). */
export const SPRINT_BELTS = ['blanco', 'amarillo', 'verde', 'azul', 'rojo'] as const;
export type SprintBelt = (typeof SPRINT_BELTS)[number];

/** The six belts of the progress indicator: the sprint plus the black belt it leads to. */
export const PROGRESS_BELTS = [...SPRINT_BELTS, 'negro'] as const;

export interface SprintStep {
  key: SprintBelt;
  /** Grade, e.g. "8º gup". */
  gup: string;
  /** Belt name in the page language. */
  name: string;
  years: string;
  /** The one line of the belt: the existing `line` of the stage in martialExperience.ts. */
  line: string;
}

/** One step per coloured belt, condensed from the existing career data (no new copy). */
export function sprintSteps(lang: Lang): SprintStep[] {
  const stages = martialExperienceData[lang].stages;
  return SPRINT_BELTS.map((key) => {
    const stage = stages.find((s) => s.beltKey === key);
    return {
      key,
      gup: BELTS[key].gup,
      name: BELTS[key].beltName[lang],
      years: stage?.years ?? '',
      line: stage?.line ?? ''
    };
  });
}

// ---- Motion: pure numbers for the engine (tul.ts). The sprint track's scroll progress `s` (0..1) becomes a
// position along the belts (0 = first belt, n - 1 = last): it holds on each belt while its line is read and eases
// to the next one in between (cubic in-out), so the scrub never feels linear.

/** Share of each belt-to-belt stretch spent holding, at each end. */
const HOLD = 0.3;
const clamp = (x: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, x));
const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Position along `n` belts for the scroll progress `s` (0..1): 0 .. n - 1, eased between belts. */
export function sprintPosition(s: number, n: number): number {
  const last = Math.max(1, n - 1);
  const pos = clamp(s, 0, 1) * last;
  const i = Math.min(Math.floor(pos), last - 1);
  const g = clamp((pos - i - HOLD) / (1 - 2 * HOLD), 0, 1);
  return i + easeInOutCubic(g);
}

/**
 * State of step `i` at position `pos`: `o` its opacity (1 on its belt, 0 one belt away) and `d` its signed offset
 * (-1..1: positive once passed, negative while still to come), which the CSS turns into a slide.
 */
export function stepState(pos: number, i: number): { o: number; d: number } {
  const d = clamp(pos - i, -1, 1) + 0;
  return { o: 1 - Math.abs(d), d };
}

/** Progress (0..1) of the change from belt `j` to belt `j + 1` at position `pos`: the 3D shift beat. */
export function shiftProgress(pos: number, j: number): number {
  return clamp(pos - j, 0, 1);
}
