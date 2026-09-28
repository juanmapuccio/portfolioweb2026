import { describe, expect, it } from 'vitest';
import { educationData } from '../../src/data/education';

const locales = Object.keys(educationData) as (keyof typeof educationData)[];
const validCategories = ['cloud', 'academic', 'foundations'];
const validStatuses = ['completed', 'in_progress'];

describe('data/education', () => {
  it('covers es, en and pt locales', () => {
    expect(locales.sort()).toEqual(['en', 'es', 'pt']);
  });

  it('has the same set of item ids across all locales', () => {
    const idSets = locales.map((locale) => educationData[locale].items.map((i) => i.id).sort());
    const [reference, ...rest] = idSets;
    rest.forEach((ids) => expect(ids).toEqual(reference));
  });

  for (const locale of locales) {
    describe(`locale: ${locale}`, () => {
      const data = educationData[locale];

      it('has required section fields present', () => {
        expect(data.sectionBadge.length).toBeGreaterThan(0);
        expect(data.title.length).toBeGreaterThan(0);
        expect(data.subtitle.length).toBeGreaterThan(0);
      });

      it('has filter labels for every category plus "all"', () => {
        expect(Object.keys(data.filterLabels).sort()).toEqual(['academic', 'all', 'cloud', 'foundations']);
        for (const label of Object.values(data.filterLabels)) {
          expect((label as string).length).toBeGreaterThan(0);
        }
      });

      it('has at least one education item', () => {
        expect(data.items.length).toBeGreaterThan(0);
      });

      it('has well-formed required fields on every item', () => {
        for (const item of data.items) {
          expect(item.id.length).toBeGreaterThan(0);
          expect(validCategories).toContain(item.category);
          expect(item.title.length).toBeGreaterThan(0);
          expect(item.issuer.length).toBeGreaterThan(0);
          expect(item.period.length).toBeGreaterThan(0);
          expect(validStatuses).toContain(item.status);
          expect(item.description.length).toBeGreaterThan(0);
          expect(Array.isArray(item.highlights)).toBe(true);
          expect(item.highlights.length).toBeGreaterThan(0);
          for (const h of item.highlights) {
            expect(h.length).toBeGreaterThan(0);
          }
        }
      });

      it('has unique item ids', () => {
        const ids = data.items.map((i) => i.id);
        expect(new Set(ids).size).toBe(ids.length);
      });
    });
  }
});
