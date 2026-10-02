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

describe('immersive journey T1: chapter beats', () => {
  test('renders every belt chapter through the same sticky horizontal track', () => {
    // One mechanism for all 5 chapters: no layout branching, no split section left.
    expect(martialTimeline).not.toContain('cfg.layout');
    expect(martialTimeline).not.toContain("layout: 'split'");
    expect(martialTimeline).not.toContain("layout: 'h'");
    expect(martialTimeline).not.toContain('split-section');
    expect(martialTimeline).not.toContain('split-role-card');
    expect(martialTimeline).not.toContain('data-zone="split"');
    // The track machinery that already powered amarillo/azul now powers every chapter.
    expect(martialTimeline).toContain('data-fx="h"');
    expect(martialTimeline).toContain('data-zone="h"');
    expect(martialTimeline).toContain('data-track="1"');
    expect(martialTimeline).toContain('class="h-role-card"');
    // Beat 1 (curtain) still precedes the track inside each chapter.
    expect(martialTimeline).toContain('class="curtain-scene"');
  });

  test('exposes each job card as a button carrying data-job without the long detail', () => {
    expect(martialTimeline).toContain('<button');
    expect(martialTimeline).toContain('type="button"');
    expect(martialTimeline).toContain('data-job={`');
    expect(martialTimeline).toContain('aria-label={');
    expect(martialTimeline).toContain('{pos.teaser}');
    // Long "qué hice + aprendizaje" stays in data for T2's modal, not on the card.
    expect(martialTimeline).not.toContain('{pos.description}');
    expect(martialTimeline).not.toContain('{pos.transferableCompetency}');
    // No navigation target yet.
    expect(martialTimeline).not.toContain('href=');
  });

  test('keeps the long detail in data and derives a short teaser from existing copy', () => {
    for (const lang of ['es', 'en', 'pt'] as const) {
      for (const stage of martialExperienceData[lang].stages) {
        expect(stage.positions.length).toBeGreaterThan(0);
        for (const pos of stage.positions) {
          // The teaser is a verbatim prefix of the existing description: no new copy.
          expect(pos.description.startsWith(pos.teaser)).toBe(true);
          expect(pos.teaser.length).toBeLessThanOrEqual(160);
        }
      }
    }
  });

  test('marks every curtain with the data-nav-target fraction where the reveal completes', () => {
    const targets = martialTimeline.match(/data-nav-target="[^"]*"/g) ?? [];
    // The 5 belt chapters share the data-driven loop (one attribute in source,
    // rendered once per chapter) + one on the black curtain = 2 occurrences.
    expect(targets.length).toBe(2);
    expect(martialTimeline).toContain('data-nav-target="0.7"');
    expect(martialTimeline).toContain('data-nav-target="0.97"');
    // The representation contract is documented in a code comment for T3.
    expect(martialTimeline).toContain('<!-- data-nav-target');
  });

  test('shortens the curtain and routes the track height through a mobile-aware custom property', () => {
    expect(martialTimeline).toMatch(/\.curtain-scene\s*\{\s*height: 240vh;/);
    expect(martialTimeline).toContain('--h-section-h: ${120 + stage.positions.length * 105}vh;');
    expect(martialTimeline).toMatch(/\.h-section\s*\{[^}]*height: var\(--h-section-h\)/);

    const mobileIdx = martialTimeline.indexOf('@media (max-width: 767px)');
    expect(mobileIdx).toBeGreaterThan(-1);
    const mobileBlock = martialTimeline.slice(mobileIdx);
    expect(mobileBlock).toMatch(/\.curtain-scene\s*\{\s*height: 110vh;/);
    expect(mobileBlock).toContain('calc(var(--h-section-h) * 0.57)');
  });
});

describe('immersive journey T2: job detail modal', () => {
  // Lazy optional read: when JobDetailModal.astro does not exist yet, only the
  // new T2 assertions fail (the baseline suite stays at its known state).
  const readOptionalSource = async (relativePath: string): Promise<string> => {
    try {
      return await readFile(new URL(relativePath, import.meta.url), 'utf8');
    } catch {
      return '';
    }
  };

  test('mounts a single accessible job detail dialog in the timeline', async () => {
    const modal = await readOptionalSource('../src/components/JobDetailModal.astro');
    expect(modal.length).toBeGreaterThan(0);
    expect(modal).toContain('<dialog');
    expect(modal).toContain('aria-modal="true"');
    expect(modal).toContain('data-job-modal');
    // Exactly one mount, inside the timeline (never duplicated per chapter).
    expect(martialTimeline).toContain("import JobDetailModal from './JobDetailModal.astro';");
    const mounts = martialTimeline.match(/<JobDetailModal[^>]*\/>/g) ?? [];
    expect(mounts.length).toBe(1);
  });

  test('opens the matching job detail through delegation on the existing data-job buttons', async () => {
    const modal = await readOptionalSource('../src/components/JobDetailModal.astro');
    expect(modal).toContain("closest<HTMLElement>('[data-job]')");
    expect(modal).toContain('showModal()');
    expect(modal).toContain('data-job-detail');
    // The T1 card contract is the entry point, unchanged.
    expect(martialTimeline).toContain('data-job={`');
  });

  test('closes on Escape, backdrop click, and the close button through one cleanup path', async () => {
    const modal = await readOptionalSource('../src/components/JobDetailModal.astro');
    expect(modal).toContain("event.key === 'Escape'");
    expect(modal).toContain('event.target === dialog');
    expect(modal).toContain('data-modal-close');
    expect(modal).toContain('dialog.close()');
    expect(modal).toContain("addEventListener('close'");
  });

  test('locks background scroll through the Lenis instance with a reduced-motion fallback', async () => {
    const modal = await readOptionalSource('../src/components/JobDetailModal.astro');
    expect(modal).toContain('__lenis');
    expect(modal).toContain('lenis.stop()');
    expect(modal).toContain('lenis.start()');
    // Lenis is absent under prefers-reduced-motion; the overflow lock still holds.
    expect(modal).toContain("root.style.setProperty('overflow', 'hidden')");
    expect(modal).toContain('prefers-reduced-motion');
  });

  test('returns focus to the invoking card and renders detail from existing trilingual data', async () => {
    const modal = await readOptionalSource('../src/components/JobDetailModal.astro');
    expect(modal).toContain('invoker?.focus()');
    // Content comes from the same data the timeline resolves per language.
    expect(modal).toContain('martialExperienceData[lang]');
    expect(modal).toContain('{entry.pos.role}');
    expect(modal).toContain('{entry.pos.org}');
    expect(modal).toContain('{entry.pos.dates}');
    expect(modal).toContain('{entry.pos.description}');
    expect(modal).toContain('{entry.pos.transferableCompetency}');
    expect(modal).toContain('{data.competencyLabel}');
  });
});

describe('immersive journey T3: header nav targets', () => {
  test('owns reveal-gated anchor clicks before Lenis and the native jump see them', () => {
    expect(layout).toContain("document.addEventListener('click'");
    // The native fragment jump must not run: it lands on the raw hash (--p ≈ 0).
    expect(layout).toContain('event.preventDefault()');
    // Lenis listens for clicks on window in the bubble phase and ignores
    // defaultPrevented, so propagation has to stop at document.
    expect(layout).toContain('event.stopPropagation()');
    // Only same-page anchors are intercepted, one element lookup for the whole page.
    expect(layout).toContain(`closest<HTMLAnchorElement>('a[href^="#"]')`);
    // Anchors outside the reveal set keep Lenis's default anchor behavior.
    expect(layout).toContain('anchors: { offset:');
  });

  test('computes the landing pixel from the curtain data-nav-target contract', () => {
    expect(layout).toContain('data-nav-target');
    expect(layout).toContain('curtain.dataset.navTarget');
    // y = curtainTopDoc + fraction * (curtain.offsetHeight - window.innerHeight)
    expect(layout).toContain('getBoundingClientRect().top + window.scrollY');
    expect(layout).toContain('offsetHeight - window.innerHeight');
    expect(layout).toContain('target.fraction * range');
    // Lenis when present, instant native fallback when it is absent (reduced motion).
    expect(layout).toContain('__lenis');
    expect(layout).toContain('lenis.scrollTo(y, { immediate: false, duration: 1 })');
    expect(layout).toContain("window.scrollTo({ top: y, behavior: 'auto' })");
  });

  test('sends the contact link to the frame where its reveal has already resolved', () => {
    // ContactSection: opacity = clamp((p - 0.15) * 3) → open at p ≈ 0.48.
    expect(layout).toContain('contacto: 0.55');
    expect(layout).toContain('REVEAL_FRACTIONS');
  });

  test('re-aligns a chapter deep link after the browser jumps to the raw hash', () => {
    expect(layout).toContain('resolveNavTarget(location.hash)');
    expect(layout).toContain("addEventListener('load'");
    expect(layout).toContain('requestAnimationFrame(alignHashToReveal)');
  });
});

describe('immersive journey T4: lenis responsiveness', () => {
  test('answers a wheel gesture with more travel and a shorter settle time', () => {
    const start = layout.indexOf('new Lenis({');
    expect(start).toBeGreaterThan(-1);
    const config = layout.slice(start, layout.indexOf('});', start));
    const wheelMultiplier = Number(/wheelMultiplier:\s*([0-9.]+)/.exec(config)?.[1]);
    const duration = Number(/duration:\s*([0-9.]+)/.exec(config)?.[1]);
    expect(wheelMultiplier).toBeGreaterThan(1);
    expect(duration).toBeLessThan(1.2);
    // Mobile keeps its native touch scroller; only the wheel is smoothed.
    expect(config).toContain('smoothWheel: true');
    expect(config).not.toContain('syncTouch: true');
  });
});

describe('immersive journey T5: calm 3D motion', () => {
  test('normalizes slot smoothing to elapsed time so high-refresh displays do not race', () => {
    // A per-frame constant applies 4x more often at 240Hz than at 60Hz, making
    // the belt chase its slot (and the scroll) far too fast on capable machines.
    expect(belt3d).toContain('Math.exp(-');
    expect(belt3d).not.toContain('const k = 0.08;');
  });

  test('keeps idle sway and breathing subtle', () => {
    const sway = /Math\.sin\(t \* [0-9.]+\) \* THREE\.MathUtils\.degToRad\(([0-9.]+)\)/.exec(belt3d);
    expect(sway).not.toBeNull();
    expect(Number(sway?.[1])).toBeLessThanOrEqual(6);
    const breathing = /belt\.scale\.setScalar\([0-9.]+ \+ ([0-9.]+) \* Math\.sin/.exec(belt3d);
    expect(breathing).not.toBeNull();
    expect(Number(breathing?.[1])).toBeLessThanOrEqual(0.005);
  });
});

describe('immersive journey T7: hero portrait', () => {
  test('gives the profile photo a right column that actually fills the hero', () => {
    const portrait = homePage.match(/\.hero-portrait-col\s*\{([^}]+)\}/)?.[1] ?? '';
    const clamp = /max-width:\s*clamp\((\d+)px,\s*([0-9.]+)vw,\s*(\d+)px\)/.exec(portrait);
    expect(clamp).not.toBeNull();
    // Was clamp(260px, 22vw, 310px) — the right column wasted ~400px of space.
    expect(Number(clamp?.[3])).toBeGreaterThanOrEqual(440);
    // First .hero-editorial-layout match is the ≤1023 media override; assert the
    // base rule anywhere in the file instead of anchoring on the first block.
    expect(homePage).toContain('grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);');
    expect(homePage).not.toContain('1.35fr');
  });
});

describe('immersive journey T6: scrubbed red-to-black', () => {
  test('scrubs the 3D tint from the black curtain circle instead of hard-switching', () => {
    // The timeline driver is the single dispatcher of the scrub signal.
    const dispatches = martialTimeline.match(/new CustomEvent\('belt:black-progress'/g) ?? [];
    expect(dispatches.length).toBe(1);
    expect(martialTimeline).toContain("window.dispatchEvent(new CustomEvent('belt:black-progress'");

    // mix mirrors the expanding circle: radius / corner distance, no div by zero.
    expect(martialTimeline).toContain('Math.hypot(W / 2, H / 2)');
    expect(martialTimeline).toContain('Math.min(1, radius / corner)');
    expect(martialTimeline).toContain('corner > 0');
    // The circle formula itself is shared with resolveBeltKey's flip radius.
    expect(martialTimeline).toContain('(p - 0.14) * 4');
    expect(martialTimeline).toContain('BLACK_CIRCLE_MAX_RADIUS');

    // Scrub endpoints are the palette actually used by the chapter map.
    expect(martialTimeline).toContain("rojo: '#ef4444'");
    expect(martialTimeline).toContain("negro: '#1c1a17'");
    expect(martialTimeline).toContain('from: CHAPTER_COLORS.rojo');
    expect(martialTimeline).toContain('to: CHAPTER_COLORS.negro');

    // The dispatch only exists while the black curtain zone is active, and it
    // runs after the belt:change block so the scrub has the last word on frames
    // where the header flip fires too.
    expect(martialTimeline).toContain("zone.classList.contains('black-curtain-scene')");
    const changeIdx = martialTimeline.indexOf("new CustomEvent('belt:change'");
    const scrubIdx = martialTimeline.indexOf("new CustomEvent('belt:black-progress'");
    expect(changeIdx).toBeGreaterThan(-1);
    expect(scrubIdx).toBeGreaterThan(changeIdx);
  });

  test('guards getInitialColor against the black zone on reload', () => {
    const initialColor = belt3d.slice(belt3d.indexOf('function getInitialColor'), belt3d.indexOf('let activeColor'));
    // F5 inside the curtain must not tint the model black over a cream page:
    // the same ch < 6 / non-dark rule that updateBeltPosition enforces.
    expect(initialColor).toContain('ch >= 6');
    expect(initialColor).toContain("activeZone.dataset.zone === 'dark'");
    expect(initialColor).toContain('dataset.activeBeltColor');
  });

  test('ties the red flash and glow handoff to the circle growth', () => {
    // Red never dissolves before the circle can swallow the viewport: the fade
    // starts at p = 0.39, exactly when the circle reaches full radius.
    expect(martialTimeline).toMatch(/\.black-red-flash\s*\{[^}]*\(var\(--p, 0\) - 0\.39\) \* 6/);
    // The glow rises during the circle's last growth instead of after it stops.
    expect(martialTimeline).toMatch(/\.black-radial-glow\s*\{[^}]*\(var\(--p, 0\) - 0\.32\) \* 3/);
    // Text beats keep their order and the nav contract stays pinned to them.
    expect(martialTimeline).toContain('data-nav-target="0.97"');
    expect(martialTimeline).toContain('data-nav-target="0.7"');
  });
});

describe('immersive journey T8: mobile direction', () => {
  const readOptionalSource = async (relativePath: string): Promise<string> => {
    try {
      return await readFile(new URL(relativePath, import.meta.url), 'utf8');
    } catch {
      return '';
    }
  };

  test('compacts the header chapter ticks inside the ≤767px block with a 44px touch target', () => {
    // The 6 ticks are the chapter navigation on phones: they get compacted
    // in the existing mobile block, never hidden before 360px.
    const start = layout.indexOf('@media (max-width: 767px)');
    expect(start).toBeGreaterThan(-1);
    const next = layout.indexOf('@media', start + 1);
    const mobile767 = layout.slice(start, next > -1 ? next : layout.length);
    expect(mobile767).toContain('.header-ticks');
    expect(mobile767).toContain('.tick-link');
    // Invisible hit area: expands vertically only (44px tall), so the horizontal
    // pitch of neighbouring ticks never produces overlapping targets.
    expect(mobile767).toContain('.tick-link::after');
    expect(mobile767).toMatch(/height:\s*44px/);
    // Active/passed states keep working off the same classes.
    expect(mobile767).toContain('.tick-link.is-active');
    // No early-hiding fallback: ticks stay down to the 360px floor.
    expect(layout).not.toContain('@media (max-width: 400px)');
  });

  test('tightens the header row to fit a 360px viewport with the math in source', () => {
    // Second tier (≤640px, where the brand collapses to "JMP"): tighter ticks
    // plus a documented worst-case sum proving the nowrap row fits 360px.
    const start = layout.lastIndexOf('@media (max-width: 640px)');
    expect(start).toBeGreaterThan(-1);
    const next = layout.indexOf('@media', start + 1);
    const mobile640 = layout.slice(start, next > -1 ? next : layout.length);
    expect(mobile640).toContain('.header-ticks');
    expect(mobile640).toContain('.header-right-group');
    expect(mobile640).toContain('.brand-initials');
    // Worst-case width computation lives next to the values it explains.
    expect(mobile640).toContain('360');
  });

  test('refines the job detail bottom sheet for phones', async () => {
    const modal = await readOptionalSource('../src/components/JobDetailModal.astro');
    const start = modal.indexOf('@media (max-width: 767px)');
    expect(start).toBeGreaterThan(-1);
    const next = modal.indexOf('@media', start + 1);
    const sheet = modal.slice(start, next > -1 ? next : modal.length);
    expect(sheet).toContain('max-height: 92svh');
    // Home-indicator clearance on notched phones.
    expect(sheet).toContain('env(safe-area-inset-bottom');
    // Full-width sheet with rounded top corners.
    expect(sheet).toContain('width: 100%');
    expect(sheet).toMatch(/border-radius:[^;]*18px[^;]*0 0/);
    // Visible close affordance with a ≥44px touch target...
    expect(sheet).toContain('.job-modal-close');
    expect(sheet).toMatch(/\.job-modal-close\s*\{[^}]*height:\s*44px/);
    // ...while the topbar holding it stays fixed above the scrolling body.
    expect(modal).toMatch(/\.job-modal-topbar\s*\{[^}]*flex:\s*none/);
    expect(modal).toMatch(/\.job-modal-body\s*\{[^}]*overflow-y:\s*auto/);
  });

  test('trims the desktop curtains only on short desktop viewports', () => {
    // One conservative guard for 1366×768-class laptops (~650px inner height):
    // the vh-based curtains dominate scroll length there. Mobile and
    // standard-height desktops keep their original heights.
    expect(martialTimeline).toMatch(/@media \(max-height: 700px\) and \(min-width: 1024px\)/);
    const guardIdx = martialTimeline.indexOf('@media (max-height: 700px)');
    expect(guardIdx).toBeGreaterThan(-1);
    const guard = martialTimeline.slice(guardIdx);
    expect(guard).toMatch(/\.curtain-scene\s*\{[^}]*height:\s*20[0-9]vh/);
    expect(guard).toMatch(/\.black-curtain-scene\s*\{[^}]*height:\s*39[0-9]vh/);
    // The base desktop heights stay authoritative for everyone else.
    expect(martialTimeline).toMatch(/\.curtain-scene\s*\{\s*height: 240vh;/);
    expect(martialTimeline).toMatch(/\.black-curtain-scene\s*\{\s*height: 460vh;/);
  });

  test('keeps the mobile audit invariants after the T8 pass', () => {
    // (a) h-section still compresses through the T1 inline custom property.
    const mobileIdx = martialTimeline.indexOf('@media (max-width: 767px)');
    expect(mobileIdx).toBeGreaterThan(-1);
    const mobile = martialTimeline.slice(mobileIdx);
    expect(mobile).toContain('calc(var(--h-section-h) * 0.57)');
    // (b) curtain heights hold on phones: 110vh / 240vh.
    expect(mobile).toMatch(/\.curtain-scene\s*\{\s*height: 110vh;/);
    expect(mobile).toMatch(/\.black-curtain-scene\s*\{\s*height: 240vh;/);
    // (c) the T7 desktop clamp does not leak: the phone portrait is absolute 96px.
    const heroIdx = homePage.indexOf('@media (max-width: 767px)');
    expect(heroIdx).toBeGreaterThan(-1);
    const hero = homePage.slice(heroIdx);
    expect(hero).toMatch(/\.hero-portrait-col\s*\{[^}]*width:\s*96px/);
    expect(hero).toContain('position: absolute');
  });
});
