import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { ui } from '../src/i18n/ui';
import { projectsContent } from '../src/data/projects';

// P3 of the black-belt critique: the four equal project cards become one lead case (NodoFit: problem, system,
// result) with a scroll-drawn system flow, and a compact index of the other three.

const BLACK = 'src/components/tul/BlackBeltWork.astro';
const FLOW = 'src/components/tul/LeadCaseFlow.astro';
const read = (p: string) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
const noComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');
const styleOf = (src: string) => noComments(src.slice(src.indexOf('<style>')));
const markupOf = (src: string) => src.slice(0, src.indexOf('<style>'));
const MOTION = '@media (prefers-reduced-motion: no-preference)';

describe('the lead case is NodoFit, in three beats', () => {
  const src = read(BLACK);

  test('the lead is picked by id, the data flags are untouched and the source order stays', () => {
    expect(src).toContain("const LEAD_ID = 'nodofit'");
    expect(src).toContain("['nodosur', 'nodofit', 'satori', 'donpizza']");
    expect(src).not.toContain('featured');
    for (const lang of ['es', 'en', 'pt'] as const) {
      expect(projectsContent[lang].find((p) => p.id === 'nodofit')?.featured).toBe(false);
    }
  });

  test('problem, system and result are labelled beats fed verbatim from the data', () => {
    const html = markupOf(src);
    expect(html).toMatch(/<dl class="bw__case">/);
    const order = ['problem', 'system', 'result'].map((k) => html.indexOf(`t('tul.black.${k}')`));
    expect(order.every((i) => i > 0)).toBe(true);
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(html).toContain('{lead.problem}');
    expect(html).toContain('{lead.solution}');
    expect(html).toContain('{lead.impact}');
    expect(html).toContain('{lead.badge}');
    expect(html).toContain('{lead.role}');
    expect(html).toContain('<LeadCaseFlow');
  });

  test('one primary link to the live system, in a new tab, and it says so', () => {
    const html = markupOf(src);
    expect(html).toMatch(/<a class="bw__cta" href=\{lead\.url\} target="_blank" rel="noopener noreferrer">/);
    const cta = html.slice(html.indexOf('class="bw__cta"'), html.indexOf('</a>', html.indexOf('class="bw__cta"')));
    expect(cta).toContain("t('tul.cv.newTab')");
  });
});

describe('the other three are a compact index, not cards', () => {
  const src = read(BLACK);

  test('a list of the projects that are not the lead, with name, badge, impact and a new-tab link', () => {
    const html = markupOf(src);
    expect(src).toMatch(/const others = projects\.filter\(\(p\) => p\.id !== LEAD_ID\)/);
    expect(html).toMatch(/<ul class="bw__index"[^>]*>\s*\{others\.map\(/);
    const row = html.slice(html.indexOf('<ul class="bw__index"'), html.indexOf('</ul>', html.indexOf('<ul class="bw__index"')));
    for (const field of ['{p.name}', '{p.badge}', '{p.impact}', 'href={p.url}']) expect(row).toContain(field);
    expect(row).toContain('target="_blank" rel="noopener noreferrer"');
    expect(row).toContain("t('tul.cv.newTab')");
    expect(row).not.toContain('{p.description}');
  });

  test('the index is a single column of rows on every viewport (no grid of equal tiles)', () => {
    const css = styleOf(src);
    expect(css).not.toContain('.bw__projects');
    const index = [...css.matchAll(/\.bw__index[^{]*\{([^}]*)\}/g)].map((m) => m[1]).join('\n');
    expect(index).not.toMatch(/grid-template-columns:\s*repeat/);
    expect(css).not.toContain('auto-fit');
  });
});

describe('the system flow (LeadCaseFlow)', () => {
  const src = read(FLOW);
  const html = markupOf(src);

  test('four manual inputs converge into one real-time hub that emits alerts and metrics', () => {
    expect(src).toContain("const INPUTS = ['payments', 'dues', 'access', 'bookings'] as const");
    expect(src).toContain("const OUTPUTS = ['alerts', 'metrics'] as const");
    expect(html).toMatch(/\{INPUTS\.map\(/);
    expect(html).toMatch(/\{OUTPUTS\.map\(/);
    expect(html).toContain('class="lf__hub"');
    expect(html).toContain("t('tul.black.flow.hub')");
    expect(html).toContain("t('tul.black.flow.hubNote')");
  });

  test('labels are real SVG text from i18n, and the figure has an accessible title and description', () => {
    expect(html).toMatch(/<svg[^>]*role="img"[^>]*aria-labelledby=/);
    expect(html).toMatch(/<title id=/);
    expect(html).toMatch(/<desc id=/);
    expect(html).toMatch(/<text[^>]*class="lf__label/);
    expect(html).toMatch(/t\(`tul\.black\.flow\.\$\{/);
    expect(html).not.toMatch(/<image|<img|<foreignObject/);
  });

  test('the lines draw with the scroll: a scrubbed scene writes --draw, CSS turns it into stroke-dashoffset', () => {
    expect(html).toMatch(/data-tul-scene data-scene-span="settle"/);
    expect(html).toContain('pathLength="1"');
    const css = styleOf(src);
    const motion = css.slice(css.indexOf(MOTION));
    expect(css.indexOf(MOTION)).toBeGreaterThan(0);
    expect(motion).toMatch(/:global\(html\.js\)[^{]*\.lf__line[^{]*\{[^}]*stroke-dashoffset: calc\([^;]*var\(--draw/);
  });

  test('reduced motion and no JS: the flow is complete and static (nothing hides it outside the motion block)', () => {
    const css = styleOf(src);
    const base = css.slice(0, css.indexOf(MOTION));
    expect(base).not.toContain('stroke-dashoffset');
    expect(base).not.toContain('opacity: 0');
    expect(base).not.toContain('--draw');
  });

  test('no raw animation loop and no smooth-scroll library', () => {
    for (const file of [FLOW, BLACK]) {
      expect(read(file)).not.toContain('requestAnimationFrame');
      expect(read(file)).not.toContain('lenis');
    }
  });
});

describe('P4 polish: flow pacing and colour token', () => {
  const engine = read('src/scripts/tul.ts');
  const tokens = read('src/styles/tul/tokens.css');

  test('the engine has an opt-in "settle" span: from the top entering to the centre past mid-view', () => {
    expect(engine).toMatch(/sceneSpan === 'settle'/);
    expect(engine).toMatch(/end: settle \? 'center 55%' : 'bottom bottom'/);
    // "enter" scenes (the close) keep their span.
    expect(engine).toMatch(/start: enter \|\| settle \? 'top bottom' : 'top top'/);
  });

  test('the flow uses the settle span (a calmer draw than the figure height)', () => {
    expect(markupOf(read(FLOW))).toContain('data-scene-span="settle"');
    expect(markupOf(read(FLOW))).not.toContain('data-scene-span="enter"');
  });

  test('the gold is a token, not a literal: LeadCaseFlow has no hex colour', () => {
    const css = styleOf(read(FLOW));
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).toContain('var(--dan-gold)');
    // Same gold as the 1st dan embroidery of BeltDrawing (tests/tul-beltdrawing.test.ts keeps that literal).
    expect(tokens).toMatch(/--dan-gold:\s*#c9a227;/);
  });
});

describe('banned surface habits', () => {
  for (const file of [BLACK, FLOW]) {
    test(`${file.split('/').pop()}: no gradients, shadows, blend modes or screenshots`, () => {
      const css = styleOf(read(file));
      expect(css).not.toMatch(/gradient\(/);
      expect(css).not.toContain('box-shadow');
      expect(css).not.toContain('drop-shadow');
      expect(css).not.toContain('mix-blend-mode');
      expect(markupOf(read(file))).not.toMatch(/<img|<picture/);
    });
  }
});

describe('lead case i18n', () => {
  const keys = [
    'tul.black.problem',
    'tul.black.system',
    'tul.black.result',
    'tul.black.flow.payments',
    'tul.black.flow.dues',
    'tul.black.flow.access',
    'tul.black.flow.bookings',
    'tul.black.flow.hub',
    'tul.black.flow.hubNote',
    'tul.black.flow.alerts',
    'tul.black.flow.metrics'
  ];
  for (const lang of ['es', 'en', 'pt'] as const) {
    test(`${lang} has every lead-case label, short and with no em-dash`, () => {
      const dict = ui[lang] as Record<string, string>;
      for (const key of keys) {
        expect(dict[key]?.length).toBeGreaterThan(0);
        expect(dict[key].length).toBeLessThanOrEqual(16);
        expect(dict[key]).not.toContain('—');
      }
    });
  }
});
