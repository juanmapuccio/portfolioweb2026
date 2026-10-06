import type { Lang } from '../i18n/ui';
import { skillsData } from './skills';

export const CV_PDF_HREF = '/CV-Juan-Manuel-Puccio-2026-1.pdf';

export interface StackRow {
  id: string;
  label: string;
  value: string;
}

export interface Certification {
  name: string;
  year: string;
}

/** Stack rows (every category except certifications) as label and comma-joined value. */
export function stackRows(lang: Lang): StackRow[] {
  return skillsData[lang].categories
    .filter((c) => c.id !== 'certifications')
    .map((c) => ({ id: c.id, label: c.title, value: c.items.join(', ') }));
}

/** Certifications carry their year in parentheses; it is split into its own numeric column. */
export function certifications(lang: Lang): Certification[] {
  const items = skillsData[lang].categories.find((c) => c.id === 'certifications')?.items ?? [];
  return items
    .map((item) => item.match(/^(.*?)\s*\((\d{4})\)$/))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => ({ name: m[1], year: m[2] }));
}
