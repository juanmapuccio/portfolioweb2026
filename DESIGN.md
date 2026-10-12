---
name: Juan Manuel Puccio · Tul Diagram
description: A career told as an ITF Taekwon-Do form, drawn as manual notation on one field that turns black at 1st dan.
colors:
  field: "#f3f8fd"
  ink: "#0b1a2b"
  ink-soft: "#41546b"
  field-dark: "#0a0d11"
  ink-dark: "#f1eee8"
  ink-soft-dark: "#aab0b8"
  line-dark: "#c8c1b6"
  dan-gold: "#c9a227"
  belt-blanco: "#ffffff"
  belt-amarillo: "#f4c62b"
  belt-amarillo-line: "#8a6700"
  belt-verde: "#1d6a44"
  belt-azul: "#1d4a99"
  belt-rojo: "#b3312a"
  belt-negro: "#111418"
  belt-negro-key: "#cfd6de"
typography:
  display:
    fontFamily: "Archivo Variable, Archivo Fallback, system-ui, sans-serif"
    fontSize: "clamp(3.25rem, 2rem + 6vw, 6rem)"
    lineHeight: 1.02
    letterSpacing: "-0.03em"
    fontVariation: "'wght' calc(400 + 400 * var(--grade)), 'wdth' calc(112 - 37 * var(--grade))"
  headline:
    fontFamily: "Archivo Variable, Archivo Fallback, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 2rem + 3.75vw, 4.75rem)"
    lineHeight: 1.02
  title:
    fontFamily: "Archivo Variable, Archivo Fallback, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)"
    lineHeight: 1.02
  body:
    fontFamily: "Atkinson Hyperlegible Next Variable, Atkinson Fallback, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)"
    lineHeight: 1.55
    fontFeature: "'tnum' 1, 'lnum' 1"
  label:
    fontFamily: "Atkinson Hyperlegible Next Variable, Atkinson Fallback, system-ui, sans-serif"
    fontSize: "clamp(0.8125rem, 0.78rem + 0.15vw, 0.9rem)"
    fontWeight: 600
rounded:
  none: "0px"
spacing:
  3xs: "0.25rem"
  2xs: "0.5rem"
  xs: "0.75rem"
  s: "1rem"
  m: "1.5rem"
  l: "2.5rem"
  xl: "4rem"
  2xl: "6rem"
  3xl: "10rem"
  gutter: "clamp(1rem, 0.5rem + 2.5vw, 2.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.field}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "3rem"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.field}"
---

# Design System: Juan Manuel Puccio · Tul Diagram

## Overview

**Creative North Star: "The Tul Diagram"**

The career is a form performed on a floor plan. Each stage is a tul (a Taekwon-Do ITF pattern) and each job a numbered milestone on its line of movement. The visual language is the notation of an ITF manual: a thin line of movement, numbered footprints, direction arrows, dimension marks and a legend, drawn in dark ink on a pale field. It refuses the vertical card timeline and the dark terminal developer portfolio.

The page has one field and one change of field. From the white belt to the red one it is a pale blue-white sheet with near-black ink. At 1st dan a black ink flood leaves the knot of the belt, covers the view, and flips the whole page to a black field with light ink (`html[data-field="dark"]`). Everything after that point (the black-belt work, principles, sheet and the close) lives on black. The flood is the one authored moment of the page; everything else is quiet, precise linework that draws with the scroll.

Depth comes from projection, never decoration: an isometric tatami drawn as SVG at build time, and on desktop a real procedural 3D belt and tatami (three.js) lit like cloth. There are no shadows, cards, glows or gradients.

**Key Characteristics:**
- One pale field, one black field, one flip (at 1st dan), driven by the scroll.
- Belt colours are inks for drawn details only, never surfaces.
- Line work scrubbed by native scroll (GSAP ScrollTrigger), complete and static under reduced motion or without JS.
- Hard corners everywhere (0px radius); rules and outlines instead of containers.
- Type weight and width grow with the grade.

## Colors

A restrained two-field palette of ink and paper, with the six belt colours used only as drawn ink.

### Primary
- **Notation Ink** (`ink`): text, rules, diagram lines and the solid CTA block on the pale field. About 17:1 on the field.
- **Paper Field** (`field`): the page surface from the white belt to the red one. It is the only background; no section paints its own.

### Secondary
- **Black Field** (`field-dark`): the surface after the flood, from 1st dan to the end of the page.
- **Bone Ink** (`ink-dark`): text and the solid CTA on black.
- **Warm Line** (`line-dark`): strokes and title ink on black (3:1 and up); it is also the black belt's `--belt-line`.

### Tertiary
- **Dan Gold** (`dan-gold`): the gold of the 1st dan embroidery. It only appears as drawn detail on black (about 8:1 there): the embroidery of the drawn belt and the lines and nodes of the lead-case system flow. Its 3D counterpart (the stitches of the belt) is `STITCH_GOLD` in `src/scripts/belt3d/colors.ts`.
- **Belt inks** (`belt-*`): white, yellow, green, blue, red, black. Each chapter sets `data-belt="<key>"`, which exposes `--belt-fill` (the real colour, always outlined in ink), `--belt-line` (a stroke that holds 3:1 on the field: yellow becomes the ochre `belt-amarillo-line`, black uses `line-dark`) and `--belt-key` (an inner keyline, light only on the black belt).

### Neutral
- **Slate Ink** (`ink-soft`) and **Ash Ink** (`ink-soft-dark`): secondary text, metadata, captions and the scrollbar thumb, on the pale and the black field.

### Named Rules
**The Ink-Not-Paint Rule.** A belt colour never fills a surface. It appears only as a stroke, a footprint, a stop, the active row marker, the title-cut rule, a tied-belt mark outlined in ink, or the belt itself.

**The One Flip Rule.** The field changes exactly once, at 1st dan, by the flood. `[data-field="dark"]` re-points only `field`, `ink`, `ink-soft` and `belt-line`; no belt tints anything. Without JS or with reduced motion, `base.css` paints the black chapter and what follows with the same tokens directly.

**The Measured Hex Rule.** Every colour token is a 6-digit hex in `src/styles/tul/tokens.css`, so tests can parse it and assert contrast (text 4.5:1, strokes 3:1 on both fields). A component never carries its own hex: new colours become tokens. The drawn belt's gold literal is the one documented exception, kept in sync with `dan-gold`.

## Typography

**Display Font:** Archivo Variable (width axis), with a metric-matched Arial fallback
**Body Font:** Atkinson Hyperlegible Next Variable, with a metric-matched Arial fallback

**Character:** A condensing grotesque for the forms and a hyper-legible humanist sans for everything a recruiter reads on a phone. Both are self-hosted (Fontsource) and preloaded; the fallbacks are size-adjusted so the swap does not shift layout.

### Hierarchy
- **Display** (grade-driven weight and width, `--step-display`, 1.02): the hero name and chapter titles. Tracking `-0.03em`.
- **Headline** (`--step-4` / `--step-3`): chapter and section titles, the close title, the lead-case name.
- **Title** (`--step-1`): index rows, stack title, lede lines.
- **Body** (`--step-0`, 1.55): running text, the lead-case beats, captions and index impacts (line-height 1.4 in those dense blocks). Measure tops out at 68ch, most blocks at 46-60ch.
- **Label** (`--step--1`, 600): metadata, badges, dates, beat labels (uppercase, `0.08em` tracking for the Problem / System / Result labels only).

### Named Rules
**The Grade Weight Rule.** The display face tracks rank: `.grade-type` maps `--grade` (0 at white, 1 at black) to `wght` 400 to 800 and `wdth` 112 to 75. A 1st dan title is already condensed, so it takes no extra negative tracking.

**The Tabular Rule.** Dates, numbers and data use tabular lining numerals (`.num`, `time`, `[data-num]`); the body inherits them too.

**The Readable Phone Rule.** Anything a recruiter needs to read (captions, impacts, beats) is body size on a phone. `--step--1` is for labels and metadata only.

## Layout

Mobile first, one column, generous section padding (`--space-2xl` + 2rem on top, `--space-xl` below, `--gutter` at the sides). Every chapter is a `main > section[data-belt]` at least one viewport tall. Content blocks cap at 72rem; reading blocks cap at 46-68ch.

- **Breakpoints:** 48rem (index rows and stack read across a 16rem label column), 56rem (the lead case splits text | system flow), 62rem (pinned scenes; below it nothing pins and only the isometric figure sticks, at most 45svh), 64rem / 1024px (the 3D belt and its reserved right column, `--belt-col`, which the chapters pad so the belt never lies over text).
- **Passages:** between chapters an empty, in-flow spacer (about 50svh desktop, 40svh phone; a plain 12rem gap under reduced motion) holds the drawn belt that unties and ties again. The red-to-black passage is `--pass-h` tall (140svh, 120svh on phones) and overlaps the end of the sprint track.
- **The close** is exactly one viewport (`100svh`) on every size, including 375x667: pitch, CTA, floor, ink rule, a 2x2 grid of channels on phones (four in a row from 48rem) and the colophon.
- **Rhythm:** tight inside a group (`--space-2xs` to `--space-s`), generous between groups (`--space-l` on phones, `--space-xl` from 48rem). Index rows and stack rows share one left edge (16rem column + `--space-m` gap).

## Elevation & Depth

Flat. There are no shadows, no glows, no blurs and no gradients on any surface. Depth is projection: the isometric tatami (`TatamiIso`, one flat tone per face mixed from `field` and `ink`, so it works on both fields), and on desktop a procedural 3D belt and tatami in one fixed, pointer-transparent canvas (z-index 11, above the flood and below the header). On black the belt takes a rim light so it reads; it is lit like cloth, never haloed.

### Named Rules
**The Projection-Not-Decoration Rule.** If something looks deep, it is because it is drawn in projection or is a real 3D object. Never fake depth with `box-shadow`, `drop-shadow`, blend modes or gradients (tests enforce this in the close and the black-belt work).

## Shapes

Hard corners (0px) on everything: buttons, panels, the tatami tooltip, the detail sheet. Containers are rules, not boxes: a 2px `--belt-line` rule tops the lead case, 1px rules separate index rows, stack and channels. Lines use square caps and miter joins. The only organic shapes are sumi-e ink: the flood's seep edge, the ensō behind the chapter seal, the bristle texture of the route line, and the gooey beads of the close's ink rule.

## Components

### Buttons
- **Shape:** square block (0px), at least 3rem tall, `--space-m` inline padding, weight 700.
- **Primary:** an ink block with field-coloured text and a 2px ink border ("Contactame", "Escribime por email", "Ver en producción").
- **Hover / Focus:** inverts to an outline (field background, ink text), the arrow nudges (4px right, or 2px up-right for a new-tab arrow), and it presses 1px on `:active`. Transitions use `--dur-fast` (160ms) and the one ease-out curve.
- **Outline:** WhatsApp in the close: transparent with an ink border, inverts to the ink block on hover.
- **Close CTA detail:** a drop of ink hangs from the CTA's lower edge, hidden at rest and dripping on hover or focus (gooey filter, decorative layer only).

### Links
Underlined with a 1px rule offset `0.22em`; the rule thickens to 2px on hover. External links open in a new tab and carry a visually hidden "(opens in a new tab)" in the page language. Targets are at least 44px tall: language codes are 44x44, the colophon links get a 44px hit area without growing the row.

### Focus
One ring everywhere: a 2px solid outline in the current `ink`, offset 3px (the skip link inverts it). In the project index the whole row is the target, so the ring draws around the row, not just the name.

### Lead case (black belt)
NodoFit told in three labelled beats (a definition list): Problem, System, Result, then one primary link to the live system. The System beat is `LeadCaseFlow`: an authored SVG line diagram (four inputs converge on a trunk into a real-time dashboard that emits alerts and metrics), labels as real SVG text from i18n, `role="img"` with a title and description. Lines and nodes are Dan Gold. On a phone the beats stack; from 56rem the text sits left and the flow right.

### Project index
The other systems as rows of one list, never tiles: name (stretched link over the whole row), badge, and impact. From 48rem a row reads across the 16rem label column, name and badge together at the top.

### Channels (close)
Four items (WhatsApp, LinkedIn, GitHub, CV): a drawn 24px icon in one stroke weight, the name, and the value in tabular numerals; a 1px rule below. On hover a bead of ink runs along the rule.

### Motion conventions
- **One engine.** `src/scripts/tul.ts` is the only scroll engine: native scroll, GSAP ScrollTrigger with `scrub`, frames scheduled only by GSAP's ticker. No Lenis or other smooth-scroll library and no raw `requestAnimationFrame` (tests enforce both).
- **Custom properties, CSS reacts.** The engine writes progress as custom properties and CSS turns them into transform, opacity, clip-path or `stroke-dashoffset`: `--p` / `--draw` on scenes (`[data-tul-scene]`), `--fill` / `--d` on the sprint and passages, `--bp` / `--e` for the 3D belt beats. Lines use `pathLength="1"` so `--draw` maps straight to the dash offset.
- **Scene spans.** Default: from the scene's top at the viewport top to its bottom at the bottom. `data-scene-span="enter"`: from the top entering at the bottom (one-screen scenes like the close). `data-scene-span="settle"`: the same start, ending when the centre reaches 55% of the view, so a short figure such as the lead-case flow draws over about half a screen of scroll and is complete a little past mid-view.
- **The flood.** The red-to-black passage is the one authored moment: the belt turns black from its knot, the ink seeps from that knot over the view, and at full cover the root flips to the dark field. Chapter titles are revealed by SplitText from a mask; nothing else enters with a flourish.
- **Ease.** One exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`), 160ms for state changes, 420-700ms for reveals.
- **Reduced motion and no JS.** Nothing scrubs: `--p` and `--draw` are 1, every line and belt is drawn and static, the passages are plain gaps with a frozen ink edge, the black chapter is black by CSS, and transitions are effectively off. The 3D never loads with reduced motion unless the person taps "Ver en 3D".

## Do's and Don'ts

### Do:
- **Do** take every colour from `src/styles/tul/tokens.css`; add a 6-digit hex token (with a contrast test) before using a new colour.
- **Do** use belt colours only as drawn ink (`--belt-line` for strokes, `--belt-fill` for outlined fills).
- **Do** drive any scroll motion through `tul.ts` custom properties (`--p`, `--draw`, `--fill`, `--d`) and make the static state the complete one.
- **Do** keep corners at 0px and separate groups with 1-2px rules instead of boxes.
- **Do** keep text a recruiter reads at body size on a phone, and every control at least 44px tall.
- **Do** keep all copy in the i18n sources (es, en, pt).

### Don't:
- **Don't** fill a surface with a belt colour, or add a second field change.
- **Don't** use shadows, glows, gradients, blend modes, glass or paper grain.
- **Don't** add Lenis, a raw `requestAnimationFrame` loop, or animate layout properties.
- **Don't** put ink or marks under chapter titles or across the screen outside the flood.
- **Don't** turn the project list into a grid of equal cards.
- **Don't** hard-code a hex colour in a component.
