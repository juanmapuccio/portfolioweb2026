import { describe, expect, it } from 'vitest';
import { skillsData } from '../../src/data/skills';

const locales = Object.keys(skillsData) as (keyof typeof skillsData)[];

describe('data/skills', () => {
  it('covers es, en and pt locales', () => {
    expect(locales.sort()).toEqual(['en', 'es', 'pt']);
  });

  it('has the same set of category ids across all locales', () => {
    const idSets = locales.map((locale) => skillsData[locale].categories.map((c) => c.id).sort());
    const [reference, ...rest] = idSets;
    rest.forEach((ids) => expect(ids).toEqual(reference));
  });

  it('has the same number of philosophy pillars across all locales', () => {
    const counts = locales.map((locale) => skillsData[locale].philosophy.length);
    expect(new Set(counts).size).toBe(1);
    expect(counts[0]).toBeGreaterThan(0);
  });

  for (const locale of locales) {
    describe(`locale: ${locale}`, () => {
      const data = skillsData[locale];

      it('has at least one skill category', () => {
        expect(data.categories.length).toBeGreaterThan(0);
      });

      it('has well-formed fields on every category with non-empty items', () => {
        for (const cat of data.categories) {
          expect(cat.id.length).toBeGreaterThan(0);
          expect(cat.title.length).toBeGreaterThan(0);
          expect(cat.badge.length).toBeGreaterThan(0);
          expect(cat.description.length).toBeGreaterThan(0);
          expect(Array.isArray(cat.items)).toBe(true);
          expect(cat.items.length).toBeGreaterThan(0);
          for (const item of cat.items) {
            expect(item.length).toBeGreaterThan(0);
          }
        }
      });

      it('has unique category ids', () => {
        const ids = data.categories.map((c) => c.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      it('has well-formed fields on every philosophy pillar', () => {
        for (const p of data.philosophy) {
          expect(p.title.length).toBeGreaterThan(0);
          expect(p.subtitle.length).toBeGreaterThan(0);
          expect(p.description.length).toBeGreaterThan(0);
          expect(p.quote.length).toBeGreaterThan(0);
        }
      });
    });
  }
});
