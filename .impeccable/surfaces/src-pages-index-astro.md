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

**Memorable moment:** scrolling performs the tul on a floor seen in perspective. A 3D white belt lands on the floor at the start, and the belt is tied red to black at 1st dan. Between the belt chapters, sumi-e ink passages (a drop, a dry brush sweep, a drip curtain, an ensō, one vertical stroke) cross the screen as you scroll and recede to the white field. The final line returns to the starting point at contact.

**Unresolved decisions:**
- Whether the missing roles get added to the CV PDF.

**Revised 2026-10-06 (user, ink):** the sumi-e brush returns as a stroke language and as scroll passages between chapters. No hangul or Korean text anywhere in the interface.

**Revised 2026-10-06 (user):** belt colours never fill the screen. The field is always white, colour lives in drawn details, and immersion comes from a hybrid 3D: a CSS perspective floor everywhere plus a desktop-only WebGL belt at two moments.

## Direction contract

**THESIS.** The career is a form performed on a floor plan. Each stage is a tul and each movement a milestone. It refuses the vertical card timeline and the dark terminal developer portfolio.

**OWN-WORLD.** The language is ITF manual notation:
- a thin line of movement, numbered footprints, direction arrows, dimension marks and a legend;
- Restrained colour: one white field and dark ink everywhere. The belt colours (white, yellow, green, blue, red, black) are the only chromatic inks and appear ONLY as drawn details:
  - the line of movement, stops and footprints;
  - the active row marker and the title-cut rule;
  - a drawn tied-belt mark per chapter, filled with the belt colour and outlined in ink.
  - Strokes use an accessible `--belt-line` (yellow becomes ochre).
- Sumi-e ink: strokes are brush, not ruler lines.
  - Five ink passages sit in flow between the chapters, scrubbed by scroll. The ink may cover the viewport at its peak and must recede to the white field before the next chapter. They use the colour of the belt they arrive at, and they never carry text.
  - Brush detail on the white field: the title-cut rule is a dry brush stroke in `--belt-line`, the chapter seal has an ink ensō behind the belt, and the route line of the floor diagram has bristle texture.
  - With reduced motion or without JS, each passage is a static 8rem brush divider.
  - No paper grain: it would be decoration.
- Depth through perspective, not decoration:
  - the floor diagram is a tilted plane, and its numbered stops stand up as posts;
  - a procedural WebGL belt appears on desktop only; everywhere else the drawn belt is the poster.
- Variable type whose weight and width grow with grade.
- No shadows, cards, glow or gradients. Brush edges come from static SVG masks and filters; only transform, opacity, clip-path and stroke-dashoffset animate.

**STORY.** Within seconds the visitor knows who Juan is: "Audito procesos de empresas y los resuelvo con código". They walk six forms of rising complexity and reach 1st dan with real production systems. The line then returns to its origin, which is contact.

**FIRST VIEWPORT.** A white field.
- Top-left: a large name, then the one-line hook.
- Primary CTA "Contactame" and secondary "Ver CV" (opens the Drive file), visible without scrolling.
- Right on desktop, below on mobile: the portrait plate inside the measuring frame, labelled `10º gup · 2011`.
- On scroll, the portrait gives way to the floor tilting into perspective. The white 3D belt lands at the Joon-bi ready point on desktop, and the line starts tracing.
- A persistent grade indicator in one corner.

**FORM.** "Tul diagram", position 1 on the grounded list (the pick card, chosen by the user). Seed key `050d9965`.

**Raises:**
- Riso: belt inks are the only colour, now as strokes and fills on white.
- Split-flap: fixed date, role and org columns on every milestone.
- Cephalopod: type weight tracks grade.
- Broadcast: a persistent grade indicator.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
