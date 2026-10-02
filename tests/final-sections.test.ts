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
const projectsSection = await readFile(new URL('../src/components/ProjectsSection.astro', import.meta.url), 'utf8');
const manifestoSection = await readFile(new URL('../src/components/ManifestoScrollytelling.astro', import.meta.url), 'utf8');
const layout = await readFile(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf8');
// Scroll-engine consolidation (T1+): the journey registry owns the belt math,
// the --p writes and the belt:* dispatches that used to live in the timeline's
// private rAF engine. Assertions about that behavior target this source.
const journey = await readFile(new URL('../src/scripts/journey.ts', import.meta.url), 'utf8');
const archDiagram = await readFile(new URL('../src/components/ArchitectureDiagram.astro', import.meta.url), 'utf8');
const globalCss = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');

describe('final portfolio sections', () => {
  test('mounts one 3D belt for the page and reveals it only after the model loads', () => {
    // One model, one mount: the belt is a viewport overlay that travels between
    // per-zone landing slots. The old sticky side console (belt-console-column,
    // monitor ids, stage rail) was deliberately replaced by the curtain+track
    // pattern, so its markup must not come back.
    expect((homePage.match(/<Belt3D/g) ?? []).length).toBe(1);
    expect(homePage).toContain('class="portfolio-shell"');
    expect(homePage).toContain('class="portfolio-main-column"');
    expect(homePage).not.toContain('class="belt-stage-rail"');
    expect(homePage).not.toContain('class="belt-viewer-column"');
    expect(homePage).not.toContain('class="belt-console-column"');

    // Every zone the belt visits exposes a data-slot landing target.
    expect(martialTimeline).toContain('<div data-slot="1" class="curtain-slot"></div>');
    expect(martialTimeline).toContain('<div data-slot="1" class="h-intro-slot"></div>');
    expect(martialTimeline).toContain('<div data-slot="1" class="black-slot"></div>');
    expect(contactComponent).toContain('<div data-slot="1" class="contact-belt-slot" aria-hidden="true"></div>');
    expect(belt3d).toContain("activeZone.querySelector<HTMLElement>('[data-slot]')");

    // Boot sequence: the root ships hidden, the reveal happens inside the GLTF
    // load callback, and a failed load re-hides it instead of showing a blank canvas.
    const glbLoadIndex = belt3d.indexOf('new GLTFLoader().load(');
    const viewerRevealIndex = belt3d.indexOf('root.hidden = false;', glbLoadIndex);
    expect(belt3d).toContain('<div id="belt3d-root" class="belt3d-root" aria-hidden="true" hidden>');
    expect(glbLoadIndex >= 0).toBe(true);
    expect(viewerRevealIndex > glbLoadIndex).toBe(true);
    expect(belt3d).toContain('if (root) root.hidden = true;');
  });

  test('keeps the compact header geometry and 44px touch targets unchanged', () => {
    expect(layout).toContain('height: 60px;');
    expect(layout).toContain('flex-wrap: nowrap;');
    expect(layout).toContain('min-height: 44px;');
    // Slice to the next media query after the 767px block: a smaller breakpoint
    // (640px, the QR label) appears earlier in the sheet, so anchoring the end on
    // the FIRST 640px match would yield an empty window. Sources are CRLF, so
    // normalize before matching multi-line declarations.
    const start = layout.indexOf('@media (max-width: 767px)');
    expect(start).toBeGreaterThan(-1);
    const next = layout.indexOf('@media', start + 1);
    const mobileHeaderStyles = layout
      .slice(start, next > -1 ? next : layout.length)
      .replace(/\r\n/g, '\n');
    expect(mobileHeaderStyles).toContain('.lang-min-link {\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      min-width: 32px;\n      min-height: 44px;');
    expect(mobileHeaderStyles).toContain('.header-cv-btn {\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      min-width: 44px;\n      min-height: 44px;');
  });

  test('keeps the 3D belt behind its desktop, motion, and WebGL gate', () => {
    // The gate decides before any three.js code is fetched, and the request for
    // the GLTF only happens after the dynamic imports resolve.
    const eligibilityGuardIndex = belt3d.indexOf('if (dispose || starting || !root || !canvas || !eligible()) return;');
    const threeImportIndex = belt3d.indexOf("import('three')");
    const glbRequestIndex = belt3d.indexOf('new GLTFLoader().load(');
    expect(belt3d).toContain('return desktopMq.matches && !reducedMq.matches && hasWebGL();');
    expect(eligibilityGuardIndex >= 0).toBe(true);
    expect(eligibilityGuardIndex).toBeLessThan(threeImportIndex);
    expect(threeImportIndex).toBeLessThan(glbRequestIndex);
    expect(belt3d).toContain("'/models/cinturon-itfv2.glb'");
    // The stylesheet hard-hides the canvas on phones and reduced motion too.
    expect(belt3d).toContain('@media (max-width: 1023px), (prefers-reduced-motion: reduce)');
    expect(belt3d).toContain('display: none !important;');
    // The header still reacts to the same belt:change signal that drives the model
    // (nav ticks + dark mode), and both sides register the listener explicitly.
    expect(layout).toContain("window.addEventListener('belt:change', syncHeaderBeltColor)");
    expect(layout).toContain('updateActiveBelt(detail.beltKey)');
    expect(belt3d).toContain("window.addEventListener('belt:change', onBelt)");
  });

  test('binds the black chapter metadata from the locale data before the threshold synchronization', () => {
    // The chapters resolve their stage from the current locale's data...
    expect(martialTimeline).toContain('const stage = data.stages.find((s) => s.beltKey === cfg.key);');
    expect(martialTimeline).toContain('{stage.lede}');
    // ...and the black chapter binds the negro belt metadata statically from BELTS.
    expect(martialTimeline).toContain('BELTS.negro.beltName[lang]');
    expect(martialTimeline).toContain('BELTS.negro.philosophicalTitle[lang]');

    // Threshold synchronization lives in the journey registry since the scroll
    // engine consolidation: the promotion to "negro" only lands once the
    // expanding circle covers the viewport corners (pure geometry, direction-free).
    expect(journey).toContain('const BLACK_CIRCLE_MAX_RADIUS_FALLBACK = 2000;');
    expect(journey).toContain('if (!blackCircleCoversViewport(curtainProgress(zone))) return CHAPTER_KEYS[5];');
    expect(journey).toContain('return radius >= corner;');

    // The markup bindings come first in the component; the registry wiring that
    // applies the threshold runs after (module script below the template).
    const bindingsIndex = martialTimeline.indexOf('BELTS.negro.beltName[lang]');
    const thresholdIndex = martialTimeline.indexOf('registerZone(');
    expect(bindingsIndex >= 0).toBe(true);
    expect(thresholdIndex).toBeGreaterThan(bindingsIndex);

    // The registry publishes the resolved chapter color on <html> for consumers
    // that boot after the first frame (Belt3D's getInitialColor on reload).
    expect(journey).toContain('document.documentElement.dataset.activeBeltColor = color;');
  });

  test('tracks the active chapter rail and the black-scene threshold in both scroll directions', () => {
    // The header ticks are the rail (one tick per chapter). One function
    // recomputes the whole state from the belt key, so direction never matters:
    // forward marks passed, backward clears it — the same class ops either way.
    expect((layout.match(/class="tick-link/g) ?? []).length).toBe(6);
    expect(layout).toContain('function updateActiveBelt(beltKey: string)');
    expect(layout).toContain("tick.classList.add('is-active')");
    expect(layout).toContain("tick.classList.remove('is-passed')");
    expect(layout).toContain("tick.classList.add('is-passed')");
    expect(layout).toContain("tick.classList.remove('is-active', 'is-passed')");
    expect(layout).toContain('updateActiveBelt(detail.beltKey)');

    // The journey registry is the only dispatcher, throttled to actual belt
    // changes; the timeline component no longer dispatches anything itself.
    expect(journey).toContain('if (beltKey !== lastBeltKey)');
    expect(journey).toContain("new CustomEvent('belt:change'");
    expect(journey).toContain('detail: { beltKey, color }');
    expect(martialTimeline).not.toContain("new CustomEvent('belt:change'");

    // The black threshold is pure geometry: the same scroll position resolves to
    // the same belt key up or down (red until the circle swallows the corners).
    expect(journey).toContain('const radius = Math.min(1, Math.max(0, (p - 0.14) * 4)) * blackCircleMaxRadius;');
    expect(journey).toContain('const corner = Math.hypot(window.innerWidth / 2, window.innerHeight / 2);');
    expect(journey).toContain('return CHAPTER_KEYS[5]');

    // The model never reaches into a legacy black-scene node.
    expect(belt3d).not.toContain("document.querySelector<HTMLElement>('[data-black-belt-scene]')");
  });

  test('drives black scene, model tint, and grade metadata from one scrubbed progress signal', () => {
    // One signal: the journey registry derives every output from the same
    // scroll progress, in a fixed source order — color on <html>, then the
    // header event (applyBelt), then the tint scrub (dispatchBlackProgress).
    // On flip frames the two can land in either runtime order, which is safe:
    // mix = 1 exactly at the flip, so the scrub endpoint equals the belt:change
    // color and both converge on the same tint.
    const colorIndex = journey.indexOf('document.documentElement.dataset.activeBeltColor = color;');
    const changeIndex = journey.indexOf("new CustomEvent('belt:change'");
    const progressIndex = journey.indexOf("new CustomEvent('belt:black-progress'");
    expect(colorIndex).toBeGreaterThan(-1);
    expect(changeIndex).toBeGreaterThan(colorIndex);
    expect(progressIndex).toBeGreaterThan(changeIndex);

    // The scrub mix mirrors the expanding circle the scene paints: radius/corner,
    // clamped, with a degenerate-viewport guard instead of a divide by zero.
    expect(journey).toContain('const radius = Math.min(1, Math.max(0, (p - 0.14) * 4)) * blackCircleMaxRadius;');
    expect(journey).toContain('const corner = Math.hypot(window.innerWidth / 2, window.innerHeight / 2);');
    expect(journey).toContain('const mix = corner > 0 ? Math.min(1, radius / corner) : 1;');
    expect(journey).toContain('progress: p, mix, from: CHAPTER_COLORS.rojo, to: CHAPTER_COLORS.negro');

    // Belt3D consumes that progress by lerp; the wall-clock tint/spin tweens are gone.
    expect(belt3d).toContain("window.addEventListener('belt:black-progress', onBlackProgress)");
    expect(belt3d).toContain('cur.copy(scrubFrom).lerp(scrubTo, d.mix);');
    expect(belt3d).toContain("window.removeEventListener('belt:black-progress', onBlackProgress)");
    expect(belt3d).not.toContain('duration: 0.6');
    expect(/gsap\.to\(state,\s*\{\s*mix/.test(belt3d)).toBe(false);
    expect(/gsap\.to\(state,\s*\{\s*spin/.test(belt3d)).toBe(false);
  });

  test('keeps the oversized chapter display titles outside the page heading hierarchy', () => {
    // The curtain and black titles are display art, not headings: they ship as
    // divs so the document keeps a clean outline (single h1 in the hero, the
    // timeline's intro as h2, the modal/skills headings below it).
    expect(martialTimeline).toContain('<div class="curtain-title">');
    expect(martialTimeline).toContain('<div class="black-title">');
    expect(martialTimeline).not.toContain('<h1');
    expect(martialTimeline).not.toContain('<h2 class="curtain-title"');
    expect(martialTimeline).not.toContain('<h2 class="black-title"');
    expect(homePage).toContain('<h1 class="hero-headline-name">Juan Manuel Puccio</h1>');
    expect((homePage.match(/<h1/g) ?? []).length).toBe(1);
  });

  test('keeps the page flow as a single column with every chapter reachable from the native nav', () => {
    expect(homePage).toContain('class="portfolio-shell"');
    expect(homePage).toContain('class="portfolio-main-column"');
    expect(homePage.indexOf('<div class="portfolio-shell">')).toBeLessThan(homePage.indexOf('<main class="portfolio-main-column">'));
    // The sticky side console was deliberately removed: one full-width column,
    // with the model as a viewport overlay instead of a second grid track.
    expect(homePage).not.toContain('class="belt-console-column"');

    // Every stage has a native anchor target and a header tick pointing at it.
    for (const stage of martialExperienceData.es.stages) {
      expect(layout).toContain(`href="#${stage.beltKey}"`);
      expect(Boolean(BELTS[stage.beltKey].beltName.es)).toBe(true);
    }
    expect(martialTimeline).toContain('<div id={cfg.key} class="chapter-block">');
    expect(martialTimeline).toContain('<div id="negro" class="chapter-black-wrapper">');

    // Landing contract: the 5 belt chapters share the loop's 0.7 curtain target
    // (rendered once per chapter) and the black curtain pins its own at 0.97.
    expect(martialTimeline).toContain('CHAPTER_CONFIG.map((cfg, idx)');
    expect(martialTimeline).toContain('data-nav-target="0.7"');
    expect(martialTimeline).toContain('data-nav-target="0.97"');

    // The model is a fixed viewport overlay driven into slots by transform,
    // never part of the document flow, and it never hijacks the scroll driver.
    expect(/\.belt3d-root\s*\{[^}]*position:\s*fixed/s.test(belt3d)).toBe(true);
    expect(belt3d).not.toContain('document.getElementById(\'trayectoria\')');
    expect(belt3d).not.toContain('trigger: section');
    expect(belt3d).not.toContain('const show =');
    expect(belt3d).not.toContain('const hide =');
  });

  test('moves directly from the technology stack to contact', () => {
    expect(homePage).not.toContain('EducationSection');
  });

  test('keeps both Spanish human-dimension entries with their exact copy and quotes', () => {
    const { philosophy } = skillsData.es;
    expect(philosophy).toHaveLength(2);
    const martial = philosophy.find(({ title }) => title === 'Liderazgo, Disciplina y Templanza Marcial');
    const ethics = philosophy.find(({ title }) => title === 'Pensamiento Crítico y Ética de Sistemas');
    // Subtitles/descriptions carry the user-approved copy as of bfe1f8d; the
    // quotes and titles are untouched original copy.
    expect(martial?.subtitle).toBe('Profesor Internacional de Taekwondo ITF (+10 años) · 1º Dan en Producción');
    expect(martial?.description).toContain('Más de diez años al frente de clases para niños, jóvenes y adultos');
    expect(martial?.quote).toBe('La constancia vence a la improvisación; la templanza resuelve la urgencia.');
    expect(ethics?.subtitle).toBe('Licenciatura en Filosofía (UNR, en curso) · Criterio Humano en el Loop');
    expect(ethics?.description).toContain('la última palabra siempre la tiene una persona');
    expect(ethics?.quote).toBe('Un bot que automatiza sin nadie revisando el resultado no es una solución, es un riesgo nuevo.');
  });

  test('renders the technology stack before the human-dimension block with five open columns', () => {
    // Sticky stack column scrolls first, the human-dimension act follows below it.
    const stackIndex = skillsComponent.indexOf('skills-categories-list');
    const humanIndex = skillsComponent.indexOf('human-dimension-section');
    expect(stackIndex).toBeGreaterThanOrEqual(0);
    expect(humanIndex).toBeGreaterThan(stackIndex);
    expect(skillsComponent).toContain('skill-category-card');
    expect(skillsComponent).toContain('philosophy-manifesto-card');
    expect(skillsComponent).toContain('FUERA DEL CÓDIGO');
    expect(skillsComponent).toContain('Stack Tecnológico & Filosofía de Trabajo');
    expect(skillsData.es.categories).toHaveLength(5);
  });

  test('renders a dark editorial contact footer and retains localized outbound links', () => {
    expect(contactComponent).toContain('cinematic-contact-footer');
    expect(contactComponent).toContain('contact-channel-card');
    expect(contactComponent).toContain('contact-actions-row');
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
    // The journey registry is the single dispatcher of the scrub signal since
    // the scroll engine consolidation; the timeline component dispatches none.
    const dispatches = journey.match(/new CustomEvent\('belt:black-progress'/g) ?? [];
    expect(dispatches.length).toBe(1);
    expect(journey).toContain("window.dispatchEvent(new CustomEvent('belt:black-progress'");
    expect(martialTimeline).not.toContain("new CustomEvent('belt:black-progress'");

    // mix mirrors the expanding circle: radius / corner distance, no div by zero.
    expect(journey).toContain('Math.hypot(window.innerWidth / 2, window.innerHeight / 2)');
    expect(journey).toContain('Math.min(1, radius / corner)');
    expect(journey).toContain('corner > 0');
    // The circle formula itself is shared with resolveBeltKey's flip radius.
    expect(journey).toContain('(p - 0.14) * 4');
    expect(journey).toContain('BLACK_CIRCLE_MAX_RADIUS');

    // Scrub endpoints are the palette actually used by the chapter map.
    expect(journey).toContain("rojo: '#ef4444'");
    expect(journey).toContain("negro: '#1c1a17'");
    expect(journey).toContain('from: CHAPTER_COLORS.rojo');
    expect(journey).toContain('to: CHAPTER_COLORS.negro');

    // The scrub only runs while the black curtain zone is the registered
    // center-crossing zone. In source, belt:change is defined before the scrub;
    // on flip frames mix = 1, so the two signals converge on the same tint
    // regardless of runtime dispatch order.
    expect(journey).toContain("zone.classList.contains('black-curtain-scene')");
    const changeIdx = journey.indexOf("new CustomEvent('belt:change'");
    const scrubIdx = journey.indexOf("new CustomEvent('belt:black-progress'");
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

describe('scroll engine consolidation T1: journey registry', () => {
  // Lazy optional read: while src/scripts/journey.ts does not exist yet, only
  // the assertions in this block fail (RED); the baseline suite is untouched.
  const readJourney = async (): Promise<string> => {
    try {
      return await readFile(new URL('../src/scripts/journey.ts', import.meta.url), 'utf8');
    } catch {
      return '';
    }
  };

  test('creates the journey module with the registry API', async () => {
    const journey = await readJourney();
    expect(journey.length).toBeGreaterThan(0);
    expect(journey).toMatch(/export function registerFx\(el: HTMLElement/);
    expect(journey).toMatch(/export function registerZone\(el: HTMLElement/);
    // Typed options bag for JS subscribers (manifesto onProgress).
    expect(journey).toMatch(/onProgress\?:\s*\(p: number\) => void/);
    // ScrollTrigger is the single engine; the plugin registration lives here.
    expect(journey).toContain("import { gsap } from 'gsap'");
    expect(journey).toContain("import { ScrollTrigger } from 'gsap/ScrollTrigger'");
    expect(journey).toContain('gsap.registerPlugin(ScrollTrigger)');
    // SSR safety: Astro prerenders pages, so the module must no-op without a
    // window.
    expect(journey).toContain("typeof window === 'undefined'");
    // No Lenis ownership here: Layout keeps the smooth-scroll wiring.
    expect(journey).not.toMatch(/from ['"]lenis/);
    expect(journey).not.toContain('new Lenis');
  });

  test('guards double registration with a module-level WeakSet', async () => {
    const journey = await readJourney();
    // Future-proofing for ClientRouter / astro:page-load re-registration:
    // a WeakSet per kind (fx and zone) makes registerFx/registerZone idempotent.
    expect(journey).toContain('new WeakSet<HTMLElement>');
    expect((journey.match(/new WeakSet<HTMLElement>/g) ?? []).length).toBe(2);
    expect(journey).toMatch(/\.has\(el\)/);
    expect(journey).toMatch(/\.add\(el\)/);
  });

  test('creates one ScrollTrigger per fx node with the curtain range', async () => {
    const journey = await readJourney();
    // registerFx: start 'top top', end 'bottom bottom' — the exact range the
    // rAF engine computed as -rect.top / (height - innerHeight). Since T3 the
    // range is an ADDITIVE option; these assertions keep the DEFAULTS pinned.
    expect(journey).toMatch(/start:\s*opts\?\.start \?\? 'top top'/);
    expect(journey).toMatch(/end:\s*opts\?\.end \?\? 'bottom bottom'/);
    expect(journey).toMatch(/onUpdate:\s*\(self: ScrollTrigger\) => \{\s*\n?\s*applyFxProgress\(entry, self\.progress\)/);
  });

  test('writes --p with a 4-decimal dirty-check like the engine lastP logic', async () => {
    const journey = await readJourney();
    expect(journey).toContain('p.toFixed(4)');
    expect(journey).toMatch(/if \(pStr !== entry\.lastP\)/);
    expect(journey).toContain("setProperty('--p', pStr)");
    expect(journey).toMatch(/entry\.lastP = pStr/);
  });

  test('translates the horizontal track with the ported shift formula and cached width', async () => {
    const journey = await readJourney();
    // shift = -p * max(0, trackWidth - innerWidth), dirty-checked by the
    // transform string (port of engine lines 303-310).
    expect(journey).toMatch(/const shift = -p \* Math\.max\(0, entry\.trackWidth - window\.innerWidth\)/);
    expect(journey).toContain('translate3d(${shift.toFixed(1)}px, 0, 0)');
    expect(journey).toMatch(/if \(transform !== entry\.lastTransform\)/);
    expect(journey).toMatch(/entry\.track\.style\.transform = transform/);
    // trackWidth is cached from track.scrollWidth and invalidated on the
    // trigger's own refresh (resize/layout changes re-measure exactly once).
    expect(journey).toMatch(/trackWidth = entry\.track\.scrollWidth/);
    expect(journey).toMatch(/onRefresh:/);
    // The onProgress subscriber runs unconditionally, after the dirty write.
    expect(journey).toMatch(/entry\.onProgress\?\.\(p\)/);
  });

  test('honors prefers-reduced-motion: --p 1 once on non-h nodes, scrub elsewhere', async () => {
    const journey = await readJourney();
    expect(journey).toContain("matchMedia('(prefers-reduced-motion: reduce)')");
    // Non-horizontal fx nodes freeze at p = 1 without a trigger; horizontal
    // nodes and zones keep scrubbing (port of engine line 295 + guards).
    expect(journey).toMatch(/el\.dataset\.fx !== 'h'/);
    expect(journey).toMatch(/setProperty\('--p', '1'\)/);
    // The frozen subscriber still receives its single callback.
    expect(journey).toMatch(/onProgress\?\.\(1\)/);
    // No ScrollTrigger is created on that path: the reduced branch returns
    // before the create call inside registerFx.
    const registerFxBody = journey.slice(journey.indexOf('export function registerFx'));
    const beforeCreate = registerFxBody.slice(0, registerFxBody.indexOf('ScrollTrigger.create'));
    expect(beforeCreate).toContain('return');
  });

  test('creates one ScrollTrigger per zone with the center-crossing range', async () => {
    const journey = await readJourney();
    expect(journey).toMatch(/start:\s*'top center'/);
    expect(journey).toMatch(/end:\s*'bottom center'/);
    expect(journey).toMatch(/onEnter:\s*\(\) => activateZone\(entry\)/);
    expect(journey).toMatch(/onEnterBack:\s*\(\) => activateZone\(entry\)/);
  });

  test('dedupes belt:change through lastBeltKey and ports the activation write', async () => {
    const journey = await readJourney();
    // Engine lines 313-326: dataset write on every activation, belt:change only
    // when the key differs from the module-level lastBeltKey (starts '').
    expect(journey).toMatch(/let lastBeltKey = ''/);
    expect(journey).toContain('document.documentElement.dataset.activeBeltColor = color');
    expect(journey).toMatch(/if \(beltKey !== lastBeltKey\)/);
    expect(journey).toMatch(/lastBeltKey = beltKey/);
    expect(journey).toContain("new CustomEvent('belt:change', { detail: { beltKey, color } })");
  });

  test('ports resolveBeltKey: the black zone stays rojo until the circle covers the corners', async () => {
    const journey = await readJourney();
    // Engine lines 262-270: while the black curtain is the active zone, the
    // belt key stays CHAPTER_KEYS[5] ('rojo') until radius >= corner distance.
    expect(journey).toMatch(/function resolveBeltKey\(zone: HTMLElement\): string/);
    expect(journey).toMatch(/zone\.classList\.contains\('black-curtain-scene'\) && !isReduced/);
    expect(journey).toMatch(/Math\.min\(1, Math\.max\(0, \(p - 0\.14\) \* 4\)\)/);
    expect(journey).toMatch(/return CHAPTER_KEYS\[5\]/);
    expect(journey).toMatch(/return CHAPTER_KEYS\[ch\] \|\| 'blanco'/);
    // The curtain scrub formula (top top -> bottom bottom) is reused for the
    // belt math, matching the engine's -rect.top / (height - H).
    expect(journey).toMatch(/-rect\.top \/ Math\.max\(1, rect\.height - H\)/);
  });

  test('dispatches belt:black-progress with the byte-compatible payload', async () => {
    const journey = await readJourney();
    // Engine lines 339-350: while the black zone is active, scrub the 3D tint
    // on every update with { progress, mix, from, to }.
    expect(journey).toContain("new CustomEvent('belt:black-progress'");
    expect(journey).toMatch(/detail: \{ progress: p, mix, from: CHAPTER_COLORS\.rojo, to: CHAPTER_COLORS\.negro \}/);
    // mix = radius / corner distance (hypot), with the degenerate-viewport guard.
    expect(journey).toMatch(/const corner = Math\.hypot\(window\.innerWidth \/ 2, window\.innerHeight \/ 2\)/);
    expect(journey).toMatch(/const mix = corner > 0 \? Math\.min\(1, radius \/ corner\) : 1/);
    // Reduced motion mirrors the engine: the black scrub lands on its final
    // frame (p = 1) instead of tracking the raw progress.
    expect(journey).toMatch(/isReduced \? 1 :/);
  });

  test('reads the black circle radius from CSS with a 2000 fallback, once per refresh', async () => {
    const journey = await readJourney();
    // Single source of truth: --black-circle-max-radius on :root (added to
    // global.css in T5). Until then the fallback keeps today's exact behavior.
    expect(journey).toContain('--black-circle-max-radius');
    expect(journey).toContain('getComputedStyle(document.documentElement)');
    expect(journey).toMatch(/2000/);
    // Re-read on every ScrollTrigger refresh via the global refresh event, so
    // resize/font changes pick up a new CSS value.
    expect(journey).toMatch(/ScrollTrigger\.addEventListener\('refresh'/);
  });

  test('keeps CHAPTER_KEYS and CHAPTER_COLORS as the single copy of the constants', async () => {
    const journey = await readJourney();
    // Verbatim port of engine lines 233-241.
    expect(journey).toContain("const CHAPTER_KEYS = ['blanco', 'blanco', 'amarillo', 'verde', 'azul', 'rojo', 'negro'];");
    expect(journey).toMatch(/const CHAPTER_COLORS: Record<string, string> = \{/);
    for (const [key, hex] of [
      ['blanco', '#ffffff'],
      ['amarillo', '#fbbf24'],
      ['verde', '#10b981'],
      ['azul', '#0284c7'],
      ['rojo', '#ef4444'],
      ['negro', '#1c1a17'],
    ] as const) {
      expect(journey).toMatch(new RegExp(`${key}: '${hex}'`));
    }
  });

  test('refreshes on web fonts and boots an initial pass after DOM ready', async () => {
    const journey = await readJourney();
    // Fonts change text metrics; re-measure trigger positions once.
    expect(journey).toMatch(/document\.fonts\?\.ready\.then\(\(\) => ScrollTrigger\.refresh\(\)\)/);
    // Bootstrap: kick() runs ScrollTrigger.refresh() plus a manual initial pass
    // (fx --p / track writes and the center-zone activation) so belt:change
    // fires on load exactly like the engine's single init frame (line 369).
    expect(journey).toMatch(/function kick\(\): void/);
    expect(journey).toMatch(/ScrollTrigger\.refresh\(\)/);
    expect(journey).toMatch(/DOMContentLoaded/);
    // Late registrations (post-kick) apply their own initial pass so the
    // queue-or-direct bootstrap stays order-independent.
    expect(journey).toMatch(/booted/);
  });
});

describe('scroll engine consolidation T2: timeline migration', () => {
  test('drives the timeline beats through the journey registry instead of a private rAF engine', () => {
    // Wiring: the component imports the registry and registers ONLY its own
    // nodes, scoped to the timeline container (Projects/Contact/Hero/Skills
    // register theirs in T3 — no document-wide queries come back).
    expect(martialTimeline).toContain("import { registerFx, registerZone } from '../scripts/journey'");
    expect(martialTimeline).toContain("document.querySelector<HTMLElement>('.martial-timeline-container')");
    expect(martialTimeline).toMatch(/querySelectorAll<HTMLElement>\('\[data-fx\]'\)\.forEach\(\(el\) => registerFx\(el\)\)/);
    expect(martialTimeline).toMatch(/querySelectorAll<HTMLElement>\('\[data-zone\]'\)\.forEach\(\(el\) => registerZone\(el\)\)/);

    // The private engine is gone: no rAF loop, no belt dispatch, no duplicated
    // radius constant, no init function.
    expect(martialTimeline).not.toContain('requestAnimationFrame');
    expect(martialTimeline).not.toContain("new CustomEvent('belt:change'");
    expect(martialTimeline).not.toContain('BLACK_CIRCLE_MAX_RADIUS');
    expect(martialTimeline).not.toContain('initScrollytelling');
  });
});

describe('scroll engine consolidation T3: component registrations', () => {
  test('projects registers its own horizontal fx and its three belt zones via the registry', () => {
    // The component owns its nodes now (no silent dependency on a foreign
    // loop). ProjectsSection renders three sibling sections and no wrapper,
    // so registration targets each owned node by its stable id/class instead
    // of a container-subtree sweep.
    expect(projectsSection).toContain("import { registerFx, registerZone } from '../scripts/journey'");
    expect(projectsSection).toContain("document.querySelector<HTMLElement>('#proyectos')");
    expect(projectsSection).toContain('registerFx(projectsFx)');
    expect(projectsSection).toContain("document.querySelector<HTMLElement>('.automations-section')");
    expect(projectsSection).toContain('registerZone(automationsZone)');
    expect(projectsSection).toContain("document.querySelector<HTMLElement>('.architecture-section')");
    expect(projectsSection).toContain('registerZone(architectureZone)');
    // No document-wide [data-fx]/[data-zone] sweeps may come back.
    expect(projectsSection).not.toContain("querySelectorAll<HTMLElement>('[data-fx]')");
    expect(projectsSection).not.toContain("querySelectorAll<HTMLElement>('[data-zone]')");
    // The markup contract that drives the CSS --p formulas is untouched.
    expect(projectsSection).toContain('data-fx="h"');
    expect(projectsSection).toContain('data-zone="h"');
    expect((projectsSection.match(/data-zone="dark" data-ch="6"/g) ?? []).length).toBe(2);
  });

  test('contact registers its footer fx+curtain zone via the registry', () => {
    // The footer is one node carrying BOTH roles (data-fx="c" and
    // data-zone="curtain"), so it takes both registrations.
    expect(contactComponent).toContain("import { registerFx, registerZone } from '../scripts/journey'");
    expect(contactComponent).toContain("document.querySelector<HTMLElement>('#contacto')");
    expect(contactComponent).toContain('registerFx(contactRoot)');
    expect(contactComponent).toContain('registerZone(contactRoot)');
    expect(contactComponent).toContain('data-fx="c"');
    expect(contactComponent).toContain('data-zone="curtain"');
  });

  test('skills registers its dark zone via the registry', () => {
    expect(skillsComponent).toContain("import { registerZone } from '../scripts/journey'");
    expect(skillsComponent).toContain("document.querySelector<HTMLElement>('#stack-filosofia')");
    expect(skillsComponent).toContain('registerZone(skillsRoot)');
    expect(skillsComponent).toContain('data-zone="dark"');
  });

  test('hero zone is registered by a HomePage script so belt:change fires on load', () => {
    // HomePage had no client script before T3; the hero zone (data-ch="0")
    // must be registered there or the initial pass finds no center zone and
    // the header/belt boot state goes silent.
    expect(homePage).toContain("import { registerZone } from '../scripts/journey'");
    expect(homePage).toContain("document.querySelector<HTMLElement>('#top')");
    expect(homePage).toContain('registerZone(heroZone)');
    // Markup untouched: the hero zone attributes stay exactly as they were.
    expect(homePage).toContain('data-zone="hero" data-ch="0"');
  });

  test('manifesto migrates to the registry and drops its direct engine wiring', () => {
    expect(manifestoSection).toContain("import { registerFx } from '../scripts/journey'");
    expect(manifestoSection).toContain('registerFx(section, {');
    // The word-opacity formula is preserved verbatim.
    expect(manifestoSection).toContain('Math.min(1, Math.max(0.12, (p * 1.15 - t) * 12))');
    // The mobile range rides on the additive start/end options (same matchMedia check).
    expect(manifestoSection).toContain("'top 80%'");
    expect(manifestoSection).toContain("'bottom 45%'");
    expect(manifestoSection).toContain("matchMedia('(max-width: 767px)')");
    // Reduced motion: nothing registers and manifestoReady stays unset, so
    // the CSS base opacity keeps the text fully readable.
    expect(manifestoSection).toContain("matchMedia('(prefers-reduced-motion: reduce)')");
    expect(manifestoSection).toContain("section.dataset.manifestoReady = 'true'");
    // The direct ScrollTrigger/gsap wiring is gone from this component.
    expect(manifestoSection).not.toContain('ScrollTrigger');
    expect(manifestoSection).not.toContain('gsap.registerPlugin');
    expect(manifestoSection).not.toContain("from 'gsap'");
  });

  test('journey registerFx accepts a purely additive start/end range option', () => {
    expect(journey).toMatch(/start\?:\s*string/);
    expect(journey).toMatch(/end\?:\s*string/);
    // Defaults preserved — the curtain range stays authoritative when no
    // option is passed (also asserted by the T1 suite above).
    expect(journey).toMatch(/start:\s*opts\?\.start \?\? 'top top'/);
    expect(journey).toMatch(/end:\s*opts\?\.end \?\? 'bottom bottom'/);
    // The addition is documented in the module header.
    expect(journey).toContain('additive');
  });
});

describe('scroll engine consolidation T4: belt3d single loop', () => {
  test('rides the gsap ticker instead of a private requestAnimationFrame loop', () => {
    // One rAF drives all scroll-linked motion: gsap.ticker (Lenis + ScrollTrigger
    // in Layout). Belt3D joins it and must not keep its own loop.
    expect(belt3d).toContain('gsap.ticker.add(');
    expect(belt3d).toContain('gsap.ticker.remove(');
    expect(belt3d).not.toContain('requestAnimationFrame(');
    expect(belt3d).not.toContain('cancelAnimationFrame(');
    // The ticker callback receives ms since the last tick; dt keeps the 50ms
    // clamp so a backgrounded tab does not teleport the belt on resume.
    expect(belt3d).toMatch(/Math\.min\(0\.05,\s*deltaTime \/ 1000\)/);
  });

  test('skips the WebGL draw while the belt is effectively invisible', () => {
    // Acceptance criterion: renderer.render() is the expensive part; the
    // position math still runs every tick (cheap, tracks re-entry), but the
    // draw is gated on the slot opacity.
    const gate = /curSlot\s*===\s*null\s*\|\|\s*curSlot\.o\s*<\s*0\.01/.exec(belt3d);
    expect(gate).not.toBeNull();
    const renderIdx = belt3d.indexOf('renderer.render(scene, camera)');
    expect(renderIdx).toBeGreaterThan(-1);
    expect(gate!.index).toBeLessThan(renderIdx);
    // updateBeltPosition runs BEFORE the gate, so tracking never freezes.
    const updateIdx = belt3d.indexOf('updateBeltPosition(dt)');
    expect(updateIdx).toBeGreaterThan(-1);
    expect(updateIdx).toBeLessThan(gate!.index);
  });

  test('caches the zone list at start instead of querying the document per frame', () => {
    // The per-frame document-wide [data-zone] sweep is gone; zones are static
    // markup and deferred module scripts run after full parse.
    const start = belt3d.indexOf('function updateBeltPosition');
    const end = belt3d.indexOf('gsap.ticker.add(', start);
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    const body = belt3d.slice(start, end);
    expect(body).not.toContain('querySelectorAll');
    // The cache itself is built once inside start().
    expect(belt3d).toMatch(/Array\.from\(document\.querySelectorAll<HTMLElement>\('\[data-zone\]'\)\)/);
  });

  test('keeps a visibilitychange handler only for sway continuity on resume', () => {
    // gsap.ticker rides rAF and auto-pauses on hidden tabs; the handler just
    // rebases the wall-clock origin so sin(t) resumes where it left off.
    expect(belt3d).toContain("document.addEventListener('visibilitychange', onVis)");
    expect(belt3d).toContain('t0 = performance.now() - lastT * 1000');
    // No cancel/restart machinery left.
    expect(belt3d).not.toContain('let raf');
  });
});

describe('scroll engine consolidation T5: lenis hygiene + single-source radius', () => {
  test('drops allowNestedScroll for an axis-aware virtualScroll on real scrollers', () => {
    expect(layout).not.toContain('allowNestedScroll');
    // T5's prevent callback was axis-blind and killed smoothing across the dark
    // tail (pipeline-track always overflows horizontally) — replaced in D1.
    expect(layout).not.toContain('prevent: (node)');
    expect(layout).toContain('virtualScroll: ({ deltaX, deltaY, event })');
    expect(layout).toContain('[data-nested-scroll]');
    expect(projectsSection).toContain('data-nested-scroll');
    expect(archDiagram).toContain('data-nested-scroll');
  });

  test('the black circle radius has one source of truth in CSS', () => {
    expect(globalCss).toContain('--black-circle-max-radius: 2000');
    expect(martialTimeline).toContain('var(--black-circle-max-radius) / 5');
    expect(martialTimeline).not.toContain('* 400)');
    expect(journey).toContain('--black-circle-max-radius');
  });
});
