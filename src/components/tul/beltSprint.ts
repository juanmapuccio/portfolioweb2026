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
