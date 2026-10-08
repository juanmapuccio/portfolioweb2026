import { describe, expect, it } from 'vitest';
import { CV_URL, contactData } from '../../src/data/contact';

const locales = Object.keys(contactData) as (keyof typeof contactData)[];
const urlPattern = /^https?:\/\//;

describe('data/contact', () => {
  it('has a well-formed external CV_URL', () => {
    expect(CV_URL).toMatch(urlPattern);
  });

  it('covers es, en and pt locales', () => {
    expect(locales.sort()).toEqual(['en', 'es', 'pt']);
  });

  for (const locale of locales) {
    describe(`locale: ${locale}`, () => {
      const data = contactData[locale];

      it('has required top-level fields present and non-empty', () => {
        expect(data.badge.length).toBeGreaterThan(0);
        expect(data.title.length).toBeGreaterThan(0);
        expect(data.subtitle.length).toBeGreaterThan(0);
        expect(data.ctaButtonText.length).toBeGreaterThan(0);
      });

      it('has at least one contact channel with exactly one primary', () => {
        expect(data.channels.length).toBeGreaterThan(0);
        const primaryCount = data.channels.filter((c) => c.primary).length;
        expect(primaryCount).toBe(1);
      });

      it('has well-formed fields and URLs for every channel', () => {
        for (const channel of data.channels) {
          expect(channel.id.length).toBeGreaterThan(0);
          expect(channel.name.length).toBeGreaterThan(0);
          expect(channel.label.length).toBeGreaterThan(0);
          expect(channel.value.length).toBeGreaterThan(0);
          expect(channel.url).toMatch(/^(https?:\/\/|mailto:)/);
        }
      });

      it('has unique channel ids', () => {
        const ids = data.channels.map((c) => c.id);
        expect(new Set(ids).size).toBe(ids.length);
      });
    });
  }
});
