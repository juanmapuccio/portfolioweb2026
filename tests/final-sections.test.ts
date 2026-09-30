import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { contactData } from '../src/data/contact';
import { BELTS, martialExperienceData } from '../src/data/martialExperience';
import { skillsData } from '../src/data/skills';

const skillsComponent = await readFile(new URL('../src/components/SkillsPhilosophySection.astro', import.meta.url), 'utf8');
const contactComponent = await readFile(new URL('../src/components/ContactSection.astro', import.meta.url), 'utf8');
const homePage = await readFile(new URL('../src/components/HomePage.astro', import.meta.url), 'utf8');
const belt3d = await readFile(new URL('../src/components/Belt3D.astro', import.meta.url), 'utf8');
const martialTimeline = await readFile(new URL('../src/components/MartialExperienceTimeline.astro', import.meta.url), 'utf8');
const layout = await readFile(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf8');

describe('final portfolio sections', () => {
  test('binds black-stage metadata from the current locale data before threshold synchronization', () => {
    expect(martialTimeline).toContain("const blackStage = data.stages.find((stage) => stage.beltKey === 'negro');");
    for (const binding of [
      'data-belt-key={BELTS.negro.key}',
      'data-gup={BELTS.negro.gup}',
      'data-years={blackStage?.years}',
      'data-belt-name={BELTS.negro.beltName[lang]}',
      'data-belt-color={BELTS.negro.color}',
      'data-belt-line={BELTS.negro.line}',
    ]) {
      expect(martialTimeline).toContain(binding);
    }

    for (const field of ['beltKey', 'gup', 'years', 'beltName', 'beltColor', 'beltLine']) {
      expect(martialTimeline).toContain(`blackScene.dataset.${field}`);
    }
  });

  test('tracks the active belt rail and black-scene threshold in both scroll directions', () => {
    expect(homePage).toContain('data-belt-key={stage.beltKey}');
    expect(homePage).toContain("aria-current={stage.beltKey === beltStages[0]?.beltKey ? 'step' : undefined}");
    expect(homePage).toContain('.belt-stage-link.is-active');

    expect(martialTimeline).toContain('function setActiveRailStage(key: string)');
    expect(martialTimeline).toContain('link.dataset.beltKey === key');
    expect(martialTimeline).toContain("link.setAttribute('aria-current', 'step')");
    expect(martialTimeline).toContain("link.removeAttribute('aria-current')");
    expect(martialTimeline).toContain('setActiveRailStage(key);');
    expect(martialTimeline).toContain('onEnter: () => updateMonitor(beltKey, gup, years, beltName, beltColor, beltLine, index)');
    expect(martialTimeline).toContain('onEnterBack: () => updateMonitor(beltKey, gup, years, beltName, beltColor, beltLine, index)');

    expect(martialTimeline).toContain('if (shouldShowBlackBelt !== blackBeltActive)');
    expect(martialTimeline).toContain('data-belt-key={BELTS.negro.key}');
    expect(martialTimeline).toContain('lastNonBlackStage.key,');
    expect(belt3d).not.toContain("document.querySelector<HTMLElement>('[data-black-belt-scene]')");
  });

  test('keeps the belt monitor label outside the page heading hierarchy', () => {
    expect(homePage).not.toContain('<h2 class="belt-display-name" id="monitor-belt-name">');
    expect(homePage).toContain('<p class="belt-display-name" id="monitor-belt-name">{BELTS.blanco.beltName[lang]}</p>');
  });

  test('places the existing page flow between a belt-stage rail and sticky desktop viewer', () => {
    expect(homePage).toContain('class="portfolio-shell"');
    expect(homePage).toContain('class="belt-stage-rail"');
    expect(homePage).toContain('class="portfolio-main-column"');
    expect(homePage).toContain('class="belt-viewer-column"');
    expect(homePage.indexOf('<div class="portfolio-shell">')).toBeLessThan(homePage.indexOf('<main class="portfolio-main-column">'));
    expect(homePage.indexOf('<main class="portfolio-main-column">')).toBeLessThan(homePage.indexOf('<aside class="belt-viewer-column"'));
    expect(homePage).toContain('<div class="belt-viewer-sticky">\n        <Belt3D />\n      </div>');
    expect(/\.belt-viewer-sticky\s*\{[^}]*position:\s*sticky/s.test(homePage)).toBe(true);

    for (const stage of martialExperienceData.es.stages) {
      expect(homePage).toContain('const target = stage.beltKey === \'negro\' ? \'black-belt-transition\' : `stage-${stage.beltKey}`;');
      expect(homePage).toContain('href={`#${target}`}');
      expect(martialTimeline.includes(stage.beltKey === 'negro' ? 'id="black-belt-transition"' : 'id={`stage-${stage.beltKey}`}')).toBe(true);
      expect(Boolean(BELTS[stage.beltKey].beltName.es)).toBe(true);
    }

    expect(/\.belt3d-root\s*\{[^}]*position:\s*absolute/s.test(belt3d)).toBe(true);
    expect(/\.belt3d-root\s*\{[^}]*position:\s*fixed/s.test(belt3d)).toBe(false);
    expect(belt3d).not.toContain('document.getElementById(\'trayectoria\')');
    expect(belt3d).not.toContain('trigger: section');
    expect(belt3d).not.toContain('const show =');
    expect(belt3d).not.toContain('const hide =');
    expect(homePage).toContain('Los grados del Taekwondo ITF, del blanco al negro, como mapa de cada etapa.');
    expect(homePage).toContain('Taekwondo ITF belt ranks, from white to black, as a blueprint of each milestone.');
    expect(homePage).toContain('As graduações do Taekwondo ITF, da branca à preta, como mapa de cada etapa.');
  });

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
    expect(contactComponent).toContain('ctaButtonText');
    expect(contactComponent).toContain("t('hero.btn.cv')");
    expect(contactComponent).not.toContain('wa.me');
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
