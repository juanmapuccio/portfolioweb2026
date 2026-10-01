import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { contactData } from '../src/data/contact';
import { BELTS, martialExperienceData } from '../src/data/martialExperience';
import { skillsData } from '../src/data/skills';

const skillsComponent = await readFile(new URL('../src/components/SkillsPhilosophySection.astro', import.meta.url), 'utf8');
const contactComponent = await readFile(new URL('../src/components/ContactSection.astro', import.meta.url), 'utf8');
const homePage = await readFile(new URL('../src/components/HomePage.astro', import.meta.url), 'utf8');
const beltKnot = await readFile(new URL('../src/components/BeltKnot.astro', import.meta.url), 'utf8');
const belt3d = await readFile(new URL('../src/components/Belt3D.astro', import.meta.url), 'utf8');
const martialTimeline = await readFile(new URL('../src/components/MartialExperienceTimeline.astro', import.meta.url), 'utf8');
const layout = await readFile(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf8');

describe('final portfolio sections', () => {
  test('unifies the model, current stage console, and native navigation in one square desktop zone', () => {
    const beltConsole = homePage.match(/<aside class="belt-console-column"[\s\S]*?<\/aside>/)?.[0] ?? '';
    const shellStyles = homePage.match(/\.portfolio-shell\s*\{([^}]+)\}/)?.[1] ?? '';

    expect(beltConsole).toContain('class="belt-console"');
    expect(beltConsole).toContain('id="belt-sticky-monitor"');
    expect(beltConsole).toContain('id="monitor-gup"');
    expect(beltConsole).toContain('id="monitor-years"');
    expect(beltConsole).toContain('id="monitor-belt-name"');
    expect(beltConsole).toContain('id="monitor-strap"');
    expect(beltConsole).toContain('<Belt3D />');
    expect(beltConsole).toContain('<BeltKnot class="belt-console-fallback" />');
    expect(homePage).toContain('const initialBelt = BELTS[initialBeltStage?.beltKey ?? \'blanco\'];');
    expect(homePage).toContain('--knot-fill: var(--active-belt-color, #f8f6f0)');
    expect(homePage).toContain('--knot-stroke: #1c1a17');
    expect(beltConsole).toContain('class="belt-stage-navigation"');
    expect(beltConsole).toContain('href={`#${target}`}');
    expect(beltConsole).toContain('Los grados del Taekwondo ITF, del blanco al negro, como mapa de cada etapa.');
    expect(beltConsole).toContain('Taekwondo ITF belt ranks, from white to black, as a blueprint of each milestone.');
    expect(beltConsole).toContain('As graduações do Taekwondo ITF, da branca à preta, como mapa de cada etapa.');
    expect((shellStyles.match(/minmax\(/g) ?? []).length).toBe(2);
    expect(shellStyles).toContain('align-items: stretch;');
    expect(homePage).toContain('aspect-ratio: 1;');
    expect(homePage).not.toContain('class="belt-stage-rail"');
    expect(homePage).not.toContain('class="belt-viewer-column"');

    const glbLoadIndex = belt3d.indexOf('new GLTFLoader().load(');
    const viewerRevealIndex = belt3d.indexOf('root.hidden = false;', glbLoadIndex);
    expect(belt3d).toContain('<div id="belt3d-root" class="belt3d-root" aria-hidden="true" hidden>');
    expect(glbLoadIndex >= 0).toBe(true);
    expect(viewerRevealIndex > glbLoadIndex).toBe(true);
  });

  test('keeps the compact header knot stroke stable without changing the mobile header geometry', () => {
    expect(layout).toContain('--knot-stroke: #1c1a17');
    expect(layout).toContain('height: 60px;');
    expect(layout).toContain('flex-wrap: nowrap;');
    expect(layout).toContain('min-height: 44px;');
    const mobileHeaderStyles = layout.slice(layout.indexOf('@media (max-width: 767px)'), layout.indexOf('@media (max-width: 640px)'));
    expect(mobileHeaderStyles).toContain('.lang-min-link {\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      min-width: 32px;\n      min-height: 44px;');
    expect(mobileHeaderStyles).toContain('.header-cv-btn {\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      min-width: 44px;\n      min-height: 44px;');
  });

  test('renders a static active-color belt knot on the compact header without weakening the 3D gate', () => {
    expect(layout).toContain("import BeltKnot from '../components/BeltKnot.astro';");
    expect(layout).toContain('<BeltKnot class="header-belt-knot" />');
    expect(layout).toContain("dataset.activeBeltColor");
    expect(layout).toContain("window.addEventListener('belt:change', syncHeaderBeltColor)");
    expect(layout).toContain("setProperty('--active-belt-color', color)");
    expect(layout).toContain("document.documentElement.style.setProperty('--active-belt-color', color)");
    expect(layout).toContain('.header-grade-pill');
    const tabletHeaderStyles = layout.slice(layout.indexOf('@media (max-width: 1023px)'), layout.indexOf('/* Mobile:'));
    expect(tabletHeaderStyles).toContain('.header-belt-swatch {\n      display: none;');
    expect(tabletHeaderStyles).toContain(':global(.header-belt-knot) {\n      display: block;');
    expect(layout).toContain('--knot-fill: var(--active-belt-color, #f8f6f0)');
    expect(layout).toContain('--knot-stroke: #1c1a17');
    expect(beltKnot).toContain("aria-hidden={label ? undefined : 'true'}");
    expect(beltKnot).toContain('focusable="false"');
    expect(beltKnot).not.toContain('<script');
    expect(beltKnot).not.toContain('<animate');

    const eligibilityGuardIndex = belt3d.indexOf('if (dispose || starting || !root || !canvas || !eligible()) return;');
    const threeImportIndex = belt3d.indexOf("import('three')");
    const glbRequestIndex = belt3d.indexOf("new GLTFLoader().load(");
    expect(belt3d).toContain('return desktopMq.matches && !reducedMq.matches && hasWebGL();');
    expect(eligibilityGuardIndex >= 0).toBe(true);
    expect(eligibilityGuardIndex).toBeLessThan(threeImportIndex);
    expect(threeImportIndex).toBeLessThan(glbRequestIndex);
    expect(belt3d).toContain("'/models/cinturon-itf.glb'");
  });

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

  test('drives black scene, model tint, and grade metadata from one scrubbed progress signal', () => {
    // One signal: the existing black-belt ScrollTrigger's scrubbed progress.
    expect(martialTimeline).toContain('scrub: true,');
    expect(martialTimeline).toContain('const BLACK_GRADE_FLIP = 0.4;');
    expect(martialTimeline).toContain('const shouldShowBlackBelt = p > BLACK_GRADE_FLIP;');
    expect(martialTimeline).not.toContain('p > 0.4');
    expect(martialTimeline).toContain(
      'const tintMix = Math.max(0, Math.min(1, (p - (BLACK_GRADE_FLIP - TINT_HALF_WIDTH)) / (TINT_HALF_WIDTH * 2)));'
    );
    expect(martialTimeline).toContain("window.dispatchEvent(new CustomEvent('belt:black-progress'");
    expect(martialTimeline).toContain('progress: p,');
    expect(martialTimeline).toContain('mix: tintMix,');
    expect(martialTimeline).toContain('from: lastNonBlackStage?.color ?? blackScene.dataset.beltColor');
    expect(martialTimeline).toContain('to: blackScene.dataset.beltColor');

    // The progress dispatch lands after the metadata flip in the same update,
    // so the tint has the last word at the threshold.
    const flipIndex = martialTimeline.indexOf('if (shouldShowBlackBelt !== blackBeltActive)');
    const progressIndex = martialTimeline.indexOf("new CustomEvent('belt:black-progress'");
    expect(flipIndex >= 0).toBe(true);
    expect(progressIndex > flipIndex).toBe(true);

    // Belt3D consumes that progress; the wall-clock tint/spin tweens are gone.
    expect(belt3d).toContain("window.addEventListener('belt:black-progress', onBlackProgress)");
    expect(belt3d).toContain('cur.copy(scrubFrom).lerp(scrubTo, d.mix);');
    expect(belt3d).toContain("window.removeEventListener('belt:black-progress', onBlackProgress)");
    expect(belt3d).not.toContain('duration: 0.6');
    expect(/gsap\.to\(state,\s*\{\s*mix/.test(belt3d)).toBe(false);
    expect(/gsap\.to\(state,\s*\{\s*spin/.test(belt3d)).toBe(false);
  });

  test('keeps the belt monitor label outside the page heading hierarchy', () => {
    expect(homePage).not.toContain('<h2 class="belt-display-name" id="monitor-belt-name">');
    expect(homePage).toContain('<p class="belt-display-name" id="monitor-belt-name">{BELTS.blanco.beltName[lang]}</p>');
  });

  test('places the existing page flow beside a single sticky belt console', () => {
    expect(homePage).toContain('class="portfolio-shell"');
    expect(homePage).toContain('class="portfolio-main-column"');
    expect(homePage).toContain('class="belt-console-column"');
    expect(homePage).toContain('class="belt-console"');
    expect(homePage.indexOf('<div class="portfolio-shell">')).toBeLessThan(homePage.indexOf('<main class="portfolio-main-column">'));
    expect(homePage.indexOf('<main class="portfolio-main-column">')).toBeLessThan(homePage.indexOf('<aside class="belt-console-column"'));
    expect(/\.belt-console\s*\{[^}]*position:\s*sticky/s.test(homePage)).toBe(true);

    for (const stage of martialExperienceData.es.stages) {
      expect(homePage).toContain('const target = stage.beltKey === \'negro\' ? \'black-belt-transition\' : `stage-${stage.beltKey}`;');
      expect(homePage).toContain('href={`#${target}`}');
      expect(homePage).toContain('data-belt-key={stage.beltKey}');
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
