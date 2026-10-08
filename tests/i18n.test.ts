import { describe, expect, it } from 'vitest';
import { defaultLang, languages, ui } from '../src/i18n/ui';

const locales = Object.keys(languages) as (keyof typeof languages)[];

describe('i18n/ui', () => {
  it('exposes es, en and pt locales', () => {
    expect(locales.sort()).toEqual(['en', 'es', 'pt']);
  });

  it('has a valid defaultLang that exists in languages', () => {
    expect(languages).toHaveProperty(defaultLang);
  });

  it('defines a non-empty label for every locale', () => {
    for (const locale of locales) {
      expect(typeof languages[locale]).toBe('string');
      expect(languages[locale].length).toBeGreaterThan(0);
    }
  });

  it('has the same set of translation keys across all locales', () => {
    const keySets = locales.map((locale) => Object.keys(ui[locale]).sort());
    const [reference, ...rest] = keySets;

    rest.forEach((keys, i) => {
      expect(keys, `locale "${locales[i + 1]}" keys differ from "${locales[0]}"`).toEqual(reference);
    });
  });

  it('has a non-empty string value for every key in every locale', () => {
    for (const locale of locales) {
      for (const [key, value] of Object.entries(ui[locale])) {
        expect(typeof value, `${locale}.${key} should be a string`).toBe('string');
        expect((value as string).length, `${locale}.${key} should not be empty`).toBeGreaterThan(0);
      }
    }
  });
});
