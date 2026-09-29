import { describe, expect, it } from 'vitest';
import { automationsContent, projectsContent } from '../../src/data/projects';

const locales = Object.keys(projectsContent) as (keyof typeof projectsContent)[];
const urlPattern = /^https?:\/\//;

describe('data/projects', () => {
  it('covers es, en and pt locales', () => {
    expect(locales.sort()).toEqual(['en', 'es', 'pt']);
  });

  it('has the same set of project ids across all locales', () => {
    const idSets = locales.map((locale) => projectsContent[locale].map((p) => p.id).sort());
    const [reference, ...rest] = idSets;
    rest.forEach((ids) => expect(ids).toEqual(reference));
  });

  it('has exactly one featured project per locale', () => {
    for (const locale of locales) {
      const featuredCount = projectsContent[locale].filter((p) => p.featured).length;
      expect(featuredCount).toBe(1);
    }
  });

  for (const locale of locales) {
    describe(`locale: ${locale}`, () => {
      const projects = projectsContent[locale];

      it('has at least one project', () => {
        expect(projects.length).toBeGreaterThan(0);
      });

      it('has well-formed required fields and a valid URL on every project', () => {
        for (const p of projects) {
          expect(p.id.length).toBeGreaterThan(0);
          expect(p.badge.length).toBeGreaterThan(0);
          expect(p.name.length).toBeGreaterThan(0);
          expect(p.role.length).toBeGreaterThan(0);
          expect(p.category.length).toBeGreaterThan(0);
          expect(p.description.length).toBeGreaterThan(0);
          expect(p.problem.length).toBeGreaterThan(0);
          expect(p.solution.length).toBeGreaterThan(0);
          expect(p.impact.length).toBeGreaterThan(0);
          expect(p.url).toMatch(urlPattern);
          expect(Array.isArray(p.tech)).toBe(true);
          expect(p.tech.length).toBeGreaterThan(0);
        }
      });

      it('has unique project ids', () => {
        const ids = projects.map((p) => p.id);
        expect(new Set(ids).size).toBe(ids.length);
      });
    });
  }
});

describe('data/automationsContent', () => {
  const locales2 = Object.keys(automationsContent) as (keyof typeof automationsContent)[];

  it('covers es, en and pt locales', () => {
    expect(locales2.sort()).toEqual(['en', 'es', 'pt']);
  });

  it('has the same set of keys across all locales', () => {
    const keySets = locales2.map((locale) => Object.keys(automationsContent[locale]).sort());
    const [reference, ...rest] = keySets;
    rest.forEach((keys) => expect(keys).toEqual(reference));
  });

  it('has non-empty string values for every key', () => {
    for (const locale of locales2) {
      for (const [key, value] of Object.entries(automationsContent[locale])) {
        expect(typeof value, `${locale}.${key}`).toBe('string');
        expect((value as string).length, `${locale}.${key}`).toBeGreaterThan(0);
      }
    }
  });
});
