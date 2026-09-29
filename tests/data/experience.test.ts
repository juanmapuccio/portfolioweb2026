import { describe, expect, it } from 'vitest';
import { experienceData } from '../../src/data/experience';

const locales = Object.keys(experienceData) as (keyof typeof experienceData)[];

describe('data/experience', () => {
  it('covers es, en and pt locales', () => {
    expect(locales.sort()).toEqual(['en', 'es', 'pt']);
  });

  it('has the same number of milestones across all locales', () => {
    const counts = locales.map((locale) => experienceData[locale].length);
    expect(new Set(counts).size).toBe(1);
    expect(counts[0]).toBeGreaterThan(0);
  });

  for (const locale of locales) {
    describe(`locale: ${locale}`, () => {
      const milestones = experienceData[locale];

      it('has well-formed required fields on every milestone', () => {
        for (const m of milestones) {
          expect(m.period.length).toBeGreaterThan(0);
          expect(m.badge.length).toBeGreaterThan(0);
          expect(m.title.length).toBeGreaterThan(0);
          expect(m.organization.length).toBeGreaterThan(0);
          expect(m.summary.length).toBeGreaterThan(0);
          expect(m.transferableSkill.length).toBeGreaterThan(0);
          expect(Array.isArray(m.highlights)).toBe(true);
          expect(m.highlights.length).toBeGreaterThan(0);
          for (const h of m.highlights) {
            expect(h.length).toBeGreaterThan(0);
          }
        }
      });

      it('every period follows a "<start> — <end>" shape', () => {
        for (const m of milestones) {
          expect(m.period).toMatch(/.+—.+/);
        }
      });
    });
  }
});
