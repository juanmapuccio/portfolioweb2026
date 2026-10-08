import { describe, expect, it } from 'vitest';
import { educationContent } from '../../src/data/education';

const locales = Object.keys(educationContent) as (keyof typeof educationContent)[];

describe('data/education', () => {
  it('covers es, en and pt locales', () => {
    expect(locales.sort()).toEqual(['en', 'es', 'pt']);
  });

  it('has the same set of entry ids across all locales', () => {
    const idSets = locales.map((locale) => educationContent[locale].entries.map((e) => e.id).sort());
    const [reference, ...rest] = idSets;
    rest.forEach((ids) => expect(ids).toEqual(reference));
  });

  for (const locale of locales) {
    describe(`locale: ${locale}`, () => {
      const data = educationContent[locale];

      it('has required section fields present', () => {
        expect(data.title.length).toBeGreaterThan(0);
      });

      it('has at least one education entry', () => {
        expect(data.entries.length).toBeGreaterThan(0);
      });

      it('has well-formed required fields on every entry', () => {
        for (const entry of data.entries) {
          expect(entry.id.length).toBeGreaterThan(0);
          expect(entry.dates.length).toBeGreaterThan(0);
          expect(entry.title.length).toBeGreaterThan(0);
          expect(entry.institution.length).toBeGreaterThan(0);
          if (entry.status !== undefined) {
            expect(entry.status.length).toBeGreaterThan(0);
          }
        }
      });

      it('has unique entry ids', () => {
        const ids = data.entries.map((e) => e.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      it('has well-formed teaching credential fields', () => {
        expect(data.teaching.title.length).toBeGreaterThan(0);
        expect(data.teaching.org.length).toBeGreaterThan(0);
        expect(data.teaching.note.length).toBeGreaterThan(0);
      });
    });
  }
});
