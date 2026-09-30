import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { contactData } from '../src/data/contact';
import { skillsData } from '../src/data/skills';

const skillsComponent = await readFile(new URL('../src/components/SkillsPhilosophySection.astro', import.meta.url), 'utf8');
const contactComponent = await readFile(new URL('../src/components/ContactSection.astro', import.meta.url), 'utf8');
const homePage = await readFile(new URL('../src/components/HomePage.astro', import.meta.url), 'utf8');
const layout = await readFile(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf8');

describe('final portfolio sections', () => {
  test('moves directly from the technology stack to contact', () => {
    expect(homePage).not.toContain('EducationSection');
  });

  test('keeps both Spanish human-dimension entries with their exact copy and quotes', () => {
    const { philosophy } = skillsData.es;
    expect(philosophy).toHaveLength(2);
    const martial = philosophy.find(({ title }) => title === 'Liderazgo, Disciplina y Templanza Marcial');
    const ethics = philosophy.find(({ title }) => title === 'Pensamiento Crítico y Ética de Sistemas');
    expect(martial?.subtitle).toBe('Profesor Internacional de Taekwondo ITF (+10 años)');
    expect(martial?.description).toContain('Más de una década formando a niños, jóvenes y adultos.');
    expect(martial?.quote).toBe('La constancia vence a la improvisación; la templanza resuelve la urgencia.');
    expect(ethics?.subtitle).toBe('Licenciatura en Filosofía (UNR, en curso)');
    expect(ethics?.description).toContain('cada comprobante pasa por validación humana antes de emitirse');
    expect(ethics?.quote).toBe('Un bot que automatiza sin nadie revisando el resultado no es una solución, es un riesgo nuevo.');
  });

  test('renders human rows before five open technology columns', () => {
    expect(skillsComponent.indexOf('human-rows')).toBeLessThan(skillsComponent.indexOf('skills-grid'));
    expect(skillsComponent).toContain('human-row');
    expect(skillsComponent).toContain('skill-column');
    expect(skillsComponent).toContain('FUERA DEL CÓDIGO');
    expect(skillsComponent).toContain('Stack Tecnológico & Filosofía de Trabajo');
    expect(skillsData.es.categories).toHaveLength(5);
  });

  test('renders a dark editorial contact panel and retains localized outbound links', () => {
    expect(contactComponent).toContain('contact-section');
    expect(contactComponent).toContain('contact-row');
    expect(contactComponent).toContain('CONVERSAR POR WHATSAPP');
    for (const lang of ['es', 'en', 'pt'] as const) {
      expect(contactData[lang].channels).toHaveLength(5);
      expect(contactData[lang].channels.every(({ url }) => url.length > 0)).toBe(true);
    }
    expect(contactComponent).toContain('CV_URL');
  });

  test('uses the compact location/copyright footer without a role claim', () => {
    expect(contactComponent).toContain('© 2026 Juan Manuel Puccio');
    expect(layout).not.toContain('Desarrollador Full Stack & Fundador de NodoSur');
  });
});
