---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/en/index.astro","src/pages/pt/index.astro"]
---

# Surface brief: home (es/en/pt)

Mode: Experience. Scope: the full landing page, plus the `/cv` quick-scan route.

**Audience and job:**
- Recruiters arrive by QR on a phone and need a verdict in seconds.
- Tech leads arrive on desktop and dig into production systems.
- The goal is to get them to contact Juan.

**Proof:** real production systems (NodoSur, NodoFit, Satori Dojo, Don Pizza) and the real CV trajectory, 2011 to today.

**Memorable moment:** the black flood at 1st dan. The page is white from the white belt to the red one. At the red to black passage the belt unties, ties again turning black with gold stitches, and ink floods out of its knot until the whole page is black, which it stays to the end. On desktop a 3D belt is the thread of the whole journey: it lands on the hero floor, travels every chapter in a reserved side column, and unties, changes colour and ties again in every spacer. On mobile a detailed drawn belt does the same in each spacer. The final line returns to the starting point at contact.

**Unresolved decisions:**
- Whether the missing roles get added to the CV PDF.

**Revised 2026-10-06 (user, ink):** the sumi-e brush returns as a stroke language and as scroll passages between chapters. No hangul or Korean text anywhere in the interface.

**Revised 2026-10-06 (user):** belt colours never fill the screen. The field is always white, colour lives in drawn details, and immersion comes from a hybrid 3D: a CSS perspective floor everywhere plus a desktop-only WebGL belt at two moments.

**Revised 2026-10-06 (user, black field and belt as thread):** this supersedes the always-white field, the full-screen ink passages and the two-moment belt above.
- The field is white from the white belt to the red one and black from 1st dan to the end. The change is one flood that starts at the belt's knot.
- Sumi-e ink survives only as a mark under each chapter title. It never covers the screen.
- The 3D belt is the thread of the journey on desktop (T11d). The detailed drawn belt (T11c) plays that role on mobile and is the poster whenever 3D is off.

**Revised 2026-10-07 (user, tatami and detail panel):**
- The trajectory shows only the summary of each belt stage (T12a). The detail of each position opens on demand in a panel (T12a) and, on desktop, from a post of the 3D tatami (T12c).
- The CSS perspective floor becomes a 3D tatami on desktop (T12c), and on a phone only when the person taps "Ver en 3D" (T12d). The CSS floor stays the fallback everywhere else.

**Revised 2026-10-07 (user, one underline, isometric tatami, sticky zones):** this supersedes the CSS perspective floor, the six title marks and the "CSS floor is the fallback" lines above.
- One underline for every title (T13a): a dry brush stroke in the chapter's `--belt-line`. No drop, drip, ensō or vertical stroke, no MorphSVG.
- The floor has no CSS 3D plane any more (T13b). The fallback is a build-time isometric SVG (`TatamiIso`) projected from the same route and stops as the 3D tatami.
- Sticky rule (T13c): while a section is pinned, scrolling moves the 3D; when it is not pinned the 3D does not switch off halfway.

## Direction contract

**THESIS.** The career is a form performed on a floor plan. Each stage is a tul and each movement a milestone. It refuses the vertical card timeline and the dark terminal developer portfolio.

**OWN-WORLD.** The language is ITF manual notation:
- a thin line of movement, numbered footprints, direction arrows, dimension marks and a legend;
- Restrained colour: a white field with dark ink from the white belt to the red one, and a black field with light ink from 1st dan on. The field changes once, by the flood at the knot (`html[data-field="dark"]`, with its own measured contrast). Belt colours never fill a surface. They are the only chromatic inks and appear ONLY as drawn details:
  - the line of movement, stops and footprints;
  - the active row marker and the title-cut rule;
  - a drawn tied-belt mark per chapter, filled with the belt colour and outlined in ink;
  - the belt itself, drawn in 3D on desktop and as a detailed drawing on mobile.
  - Strokes use an accessible `--belt-line` (yellow becomes ochre; on black it is a warm light grey).
- Sumi-e ink only under the chapter titles:
  - Every title carries the same single mark: one dry-brush underline (four streaks of variable width, drawn left to right) in the chapter's `--belt-line`. SplitText reveals the letters from a mask while DrawSVG draws the streaks. There is no per-belt variant.
  - No ink crosses the screen. The spacers between chapters are empty, in flow and carry no text.
  - Brush detail on the white field: the chapter seal has an ink ensō behind the belt (a seal detail, not a title mark), and the route line of the floor diagram has bristle texture.
  - With reduced motion or without JS the marks are finished and static, and the spacers are a plain 12rem gap.
  - No paper grain: it would be decoration.
- The belt is the thread of the journey:
  - Desktop (1024 px and up, motion allowed, WebGL): one fixed procedural 3D belt.
    - It lands on the hero floor.
    - It travels each chapter in a side column the layout reserves, so it never lies over text. It turns slowly with the scroll and its tails lean toward the route.
    - In each spacer it rides to the middle of the screen, unties, changes colour through a noise mask and ties again.
    - At 1st dan it ties red to black with gold stitches. Its knot is the centre of the black flood.
    - On black it takes a rim light so it reads, and it fades out before the close.
  - Mobile and no-3D: the detailed drawn belt (stitching, weave, knot folds, frayed tails, gold embroidery at 1st dan) unties and ties in every spacer, scrubbed by scroll. With reduced motion it is complete and static.
- Depth through projection, not decoration:
  - the floor diagram is an isometric tatami drawn as an SVG at build time (`TatamiIso`, geometry in `tatamiIso.ts`): mats with a top face and two side faces for the thickness, seams, the route on the top face and the stops as prisms with the number on the front face. Every face is one flat tone mixed from `--field` and `--ink`, so it works on white and on black. No gradient, no shadow, no rotated text;
  - the 3D belt is a real procedural object lit like cloth, never a glow or a shadow.
- The tatami (T12c, desktop; phone on demand, T12d) is the 3D version of that floor, drawn in the same scene and the same fixed canvas as the belt:
  - Floor: ten tatami mats in one instanced mesh, with seams and a faint canvas-drawn rush weave. Pale straw on the white field, charcoal on the black one. No image, no shadow, no glow.
  - Route and posts: the tul's line is a thin tube in `--belt-line`, drawn by `--draw`. Each milestone is a post with its number in a disc, at the same coordinates as the isometric floor.
  - Camera: it tilts 58 to 44 degrees with a dolly of 0.96 to 1.04 over the scene progress, and the mouse moves it by 3 degrees at most, eased. With reduced motion there is no parallax.
  - Pointer: hovering a post lights it and shows a small label with the role; clicking it (or tapping it on a phone) opens the detail panel of that position. The HTML rows and their "Ver detalle" buttons stay the accessible path; the tatami is `aria-hidden`.
  - The belt lands on the hero tatami and then travels the chapters in its column as before; its poses do not change.
  - While a scene's tatami is drawn, its isometric SVG is hidden (`[data-tatami-live]`, with no opacity threshold, so the two are never drawn together). Without WebGL, with reduced motion, without JS or below 1024 px the isometric SVG is the floor, complete and static.
- Sticky coherence (T13c):
  - Desktop: the tatami belongs to the stage that is on screen, from its entry to its exit, and travels with that stage (exact scroll progress, no fade), with the route already drawn at both ends. The belt keeps its column.
  - Red belt: the automation block is a tatami beat. The camera drops to floor level and travels the red route, cut to the figure box under the steps.
  - Black outro: its pinned closing line moves the resting belt (it rises, turns slowly and fades). It keeps its pin because it now has something to scrub.
  - Kyong-ye: the return loop is drawn in 3D on the dark tatami while the section is pinned.
  - Below 62rem nothing is pinned and no block scrolls inside the page. Only the isometric figure sticks (45svh at most, under the header) while the copy flows with the normal scroll; the scene's `--p` still draws the route and lights the rows. With "Ver en 3D" on a phone the hero belt rides up with its floor and hands over to the chapters instead of hanging over the first one.
- Detail panel (T12a): one dialog per page, a 32rem slide-over from the right (a bottom sheet on a phone), with a link of its own (`#exp-<id>`), the page scroll locked without a jump, and no motion under reduced motion.
- On a phone, "Ver en 3D" in the hero (es, en, pt) loads the same scene chunk on a tap, after checking WebGL and data saving. It shows the hero tatami with the belt resting on it and every post, no mouse parallax; "Ver en 2D" tears it down and the isometric floor and the portrait come back. Three never loads on a phone by default, nor with reduced motion unless the person taps.
- Variable type whose weight and width grow with grade.
- No shadows, cards, glow or gradients. Brush edges come from static SVG masks and filters; only transform, opacity, clip-path and stroke-dashoffset animate (the 3D canvas covers the viewport, never takes pointer events and fades by opacity).

**STORY.** Within seconds the visitor knows who Juan is: "Audito procesos de empresas y los resuelvo con código". They walk six forms of rising complexity and reach 1st dan with real production systems. The line then returns to its origin, which is contact.

**FIRST VIEWPORT.** A white field.
- Top-left: a large name, then the one-line hook.
- Primary CTA "Contactame" and secondary "Ver CV" (opens the Drive file), visible without scrolling.
- Right on desktop, below on mobile: the portrait plate inside the measuring frame, labelled `10º gup · 2011`.
- On scroll, the portrait gives way to the isometric floor. On desktop that floor is the 3D tatami and the white 3D belt falls and lands on it at the Joon-bi ready point (it can be dragged to turn), and the line starts tracing.
- A persistent grade indicator in one corner.

**FORM.** "Tul diagram", position 1 on the grounded list (the pick card, chosen by the user). Seed key `050d9965`.

**Raises:**
- Riso: belt inks are the only colour, as strokes and fills on white, then on black.
- Split-flap: fixed date, role and org columns on every milestone.
- Cephalopod: type weight tracks grade.
- Broadcast: a persistent grade indicator.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
