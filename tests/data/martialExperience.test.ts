import { describe, expect, it } from 'vitest';
import { BELTS, martialExperienceData } from '../../src/data/martialExperience';

const locales = Object.keys(martialExperienceData) as (keyof typeof martialExperienceData)[];
const validBeltKeys = Object.keys(BELTS);

describe('data/martialExperience', () => {
  it('covers es, en and pt locales', () => {
    expect(locales.sort()).toEqual(['en', 'es', 'pt']);
  });

  it('has the same number of stages across all locales', () => {
    const counts = locales.map((locale) => martialExperienceData[locale].stages.length);
    expect(new Set(counts).size).toBe(1);
    expect(counts[0]).toBeGreaterThan(0);
  });

  it('has the same belt key sequence across all locales', () => {
    const sequences = locales.map((locale) => martialExperienceData[locale].stages.map((s) => s.beltKey));
    const [reference, ...rest] = sequences;
    rest.forEach((seq) => expect(seq).toEqual(reference));
  });

  it('has the same position ids per stage across all locales', () => {
    const idLists = locales.map((locale) =>
      martialExperienceData[locale].stages.map((s) => s.positions.map((p) => p.id))
    );
    const [reference, ...rest] = idLists;
    rest.forEach((ids) => expect(ids).toEqual(reference));
  });

  for (const locale of locales) {
    describe(`locale: ${locale}`, () => {
      const content = martialExperienceData[locale];

      it('has a non-empty competency label', () => {
        expect(content.competencyLabel.length).toBeGreaterThan(0);
      });

      it('has well-formed required fields on every stage', () => {
        for (const stage of content.stages) {
          expect(validBeltKeys).toContain(stage.beltKey);
          expect(stage.years.length).toBeGreaterThan(0);
          expect(stage.title.length).toBeGreaterThan(0);
          expect(stage.line.length).toBeGreaterThan(0);
          expect(stage.lede.length).toBeGreaterThan(0);
          expect(Array.isArray(stage.positions)).toBe(true);
          expect(stage.positions.length).toBeGreaterThan(0);
        }
      });

      it('has well-formed required fields on every position', () => {
        for (const stage of content.stages) {
          for (const position of stage.positions) {
            expect(position.id.length).toBeGreaterThan(0);
            expect(position.dates.length).toBeGreaterThan(0);
            expect(position.role.length).toBeGreaterThan(0);
            expect(position.org.length).toBeGreaterThan(0);
            expect(position.teaser.length).toBeGreaterThan(0);
            expect(position.description.length).toBeGreaterThan(0);
          }
        }
      });

      it('has unique position ids across all stages', () => {
        const ids = content.stages.flatMap((s) => s.positions.map((p) => p.id));
        expect(new Set(ids).size).toBe(ids.length);
      });
    });
  }

  it('defines all six belts with well-formed fields', () => {
    const keys = Object.keys(BELTS);
    expect(keys.sort()).toEqual(['amarillo', 'azul', 'blanco', 'negro', 'rojo', 'verde']);
    for (const belt of Object.values(BELTS)) {
      expect(belt.color.length).toBeGreaterThan(0);
      expect(belt.gup.length).toBeGreaterThan(0);
      expect(Object.keys(belt.beltName).sort()).toEqual(['en', 'es', 'pt']);
      expect(Object.keys(belt.philosophicalTitle).sort()).toEqual(['en', 'es', 'pt']);
      expect(Object.keys(belt.symbolism).sort()).toEqual(['en', 'es', 'pt']);
    }
  });
});
