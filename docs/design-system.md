# Design system

Visual language, RTL mechanics, motion, accessibility, print. Implemented in `src/styles/`.

**Design intent**: a calm, readable long-form document — closer to a well-set book than to a dashboard. The figures are the only places that attract attention. Everything else gets out of the way.

---

## 1. Typography

### 1.1 Fonts

| Role | Family | Weights | Subset |
|---|---|---|---|
| Persian text & UI | **Vazirmatn** (variable) | 300–800 axis | Arabic + Persian presentation forms, Latin basic, both digit sets, general punctuation |
| Code & Latin identifiers | **JetBrains Mono** | 400 only | ASCII printable |

Both are SIL OFL / Apache-2.0 — redistributable in a single file. Subset with `pyftsubset` via `scripts/subset-fonts.ts`, output as base64 `@font-face` in `src/styles/fonts.generated.css`.

```
--font-fa: 'Vazirmatn', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, monospace;
```

**Use the variable font's weight axis** rather than shipping separate weight files — one file covers 300–800 and is the difference between fitting the font budget (≤110 KB) and blowing it.

`font-display: block` for Persian. A flash of fallback Persian text in a Latin fallback font is worse than a brief blank — the fonts are inlined, so the block is sub-frame anyway.

### 1.2 Scale

Base `18px` — the primary audience skews older and reads on laptops; Persian script also benefits from a larger base.

```css
--text-xs:   0.78rem;   /* figure labels, badges */
--text-sm:   0.88rem;   /* captions, asides */
--text-base: 1rem;      /* body: 18px */
--text-lg:   1.22rem;   /* lesson hook, takeaway */
--text-xl:   1.55rem;   /* lesson title */
--text-2xl:  2.1rem;    /* part title */
--text-3xl:  3.2rem;    /* part number, cover */
```

### 1.3 Line height and measure

Persian script has taller ascenders/descenders and needs more leading than Latin:

```css
--leading-body: 1.95;    /* generous; the single biggest readability lever for Persian */
--leading-tight: 1.45;   /* headings */
--measure: 68ch;         /* ≈ 75–80 Persian chars */
```

`text-align: start` for body text. **No `justify`** — justified Persian produces either large word gaps or kashida stretching, both bad without a proper justification engine.

`word-spacing: 0.02em` on body text; Vazirmatn's default spacing is slightly tight for long-form reading at 1.95 leading.

---

## 2. Color

Single light theme. **No dark mode** — it would double figure-color review across 35 figures for no pedagogical gain, and this document is read once, not lived in.

```css
/* surfaces */
--bg:            #fbfaf8;   /* warm off-white; less harsh than pure white for long reading */
--bg-raised:     #ffffff;
--bg-sunken:     #f3f1ed;
--bg-code:       #1e1e2a;   /* code islands are dark: a clear visual signal of "this is code" */

/* text */
--fg:            #1a1a22;
--fg-muted:      #5a5a68;
--fg-faint:      #8a8a96;
--fg-on-dark:    #e8e8f0;

/* accents */
--accent:        #2563a8;   /* primary: links, emphasis, progress */
--accent-soft:   #e3edf8;
--ok:            #1f7a52;
--ok-soft:       #e2f2ea;
--danger:        #b03a30;
--danger-soft:   #fbe8e5;
--warn:          #9a6a12;
--warn-soft:     #fbf1dc;

/* lines */
--stroke:        #d8d4cc;
--stroke-strong: #b0aba1;

/* figure semantics — used ONLY inside figures */
--fig-primary:   var(--accent);
--fig-accent:    #7b4fa8;
--fig-muted:     #9a9aa6;
--fig-danger:    var(--danger);
--fig-ok:        var(--ok);
--fig-surface:   var(--bg-raised);
--fig-stroke:    var(--stroke-strong);
```

### 2.1 Part colors

Each Part has one hue, used in the progress rail, the Part divider, and the `ConceptMap` zone:

```css
--part-1: #2563a8;   /* blue    — the picture */
--part-2: #7b4fa8;   /* purple  — agents */
--part-3: #b5632a;   /* amber   — the model */
--part-4: #1f7a52;   /* green   — building */
--part-5: #b03a30;   /* red     — production */
--part-6: #3a6b80;   /* teal    — leading */
```

Used sparingly — as accents on headings, rails, and zone fills, never as large background washes.

### 2.2 Contrast and color-blindness

- Body text ≥ 7:1 (AAA). All other text ≥ 4.5:1 (AA). Figure strokes ≥ 3:1 against their background.
- **Color never carries meaning alone** (figures.md, shared contract). Every colored state also has a label, icon, or line style. Verified at Gate 4 with a deuteranopia simulation pass over every figure.

---

## 3. Space and layout

```css
--space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
--space-4: 1rem;     --space-6: 1.5rem;   --space-8: 2rem;
--space-12: 3rem;    --space-16: 4rem;    --space-24: 6rem;
```

### 3.1 Page grid

```css
.book {
  --gutter: var(--space-6);
  display: grid;
  grid-template-columns: 1fr min(var(--measure), 100% - 2*var(--gutter)) 1fr;
}
.book > * { grid-column: 2; }
.book > .wide { grid-column: 1 / -1; max-width: 1100px; margin-inline: auto; }  /* figures */
```

Prose sits at `68ch`; figures may break out to `1100px`. Figures are the document's wide moments and must be allowed to breathe.

### 3.2 Vertical rhythm

| Between | Space |
|---|---|
| Paragraphs | `--space-4` |
| Prose ↔ figure | `--space-8` |
| Lessons | `--space-24` |
| Parts | full viewport (the Part divider) |

Generous lesson spacing is a pedagogical device: it signals "one idea finished, breathe" and prevents the wall-of-content feeling that makes long documents abandoned.

---

## 4. RTL mechanics

### 4.1 Logical properties only

`<html lang="fa" dir="rtl">`. **`left` and `right` are banned in CSS.** Use `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `border-inline-start`, `text-align: start|end`.

Enforced by stylelint (`csstools/use-logical`) in CI. A physical property in a diff is a build failure, not a review comment.

### 4.2 LTR islands

```css
.ltr {
  direction: ltr;
  text-align: left;
  unicode-bidi: isolate;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
.ltr-inline { unicode-bidi: isolate; }   /* renders as <bdi> */
```

**Every** Latin identifier inside Persian prose goes through `<Ltr inline>` → `<bdi>`. Without isolation, trailing punctuation jumps to the wrong side of the token. This is the most frequent RTL bug class; it is checked explicitly in every lesson review.

### 4.3 Digits

Persian digits in prose, headings, lesson numbers, figure labels. Latin digits in code, JSON, and measurement tables.

A remark plugin converts Latin→Persian digits in MDX text nodes, skipping `code`, `inlineCode`, JSX children of `<Ltr>`/`<Code>`, and anything under `digits="latin"`. `<Num value={42} digits="latin" />` for explicit control.

```css
.tabular { font-variant-numeric: tabular-nums; }   /* all numeric table columns */
```

### 4.4 Punctuation and shaping

- Persian comma `،` and semicolon `؛`. Persian question mark `؟`. ZWNJ (`\u200C`) in compounds: `می‌شود`, `ورک‌فلو`, `پنجرهٔ`.
- Persian quotation marks `«»`. Latin `""` only inside code.
- Authors type ZWNJ directly. `check-glossary.ts` flags known compounds written without it (`میشود` → warn), since this is both a correctness and a search issue.
- `text-rendering: optimizeLegibility`. No letter-spacing on Persian — it breaks cursive joining.

### 4.5 SVG

SVG does not inherit `dir`. Handled inside each primitive (figures.md §Direction). Summary: coordinates computed RTL from data; mirroring transforms banned around text; arrowheads point left for "forward"; `text-anchor` and `direction` set explicitly per text node.

---

## 5. Component styling

### 5.1 Lesson

```
.lesson            scroll-margin-block-start: var(--space-8)
.lesson__num       --text-sm, var(--part-N), tabular, Persian digits
.lesson__title     --text-xl, weight 700, --leading-tight
.lesson__hook      --text-lg, --fg-muted — visually lighter than body; it is a question, not content
.lesson__body      --text-base, --leading-body
.lesson__takeaway  --bg-sunken, border-inline-start: 3px solid var(--part-N),
                   padding var(--space-4), ◆ marker, weight 500
```

### 5.2 Figure

```
.figure            grid-column: 1/-1, max-width 1100px, margin-block var(--space-8)
.figure__frame     --bg-raised, 1px --stroke, radius 12px, padding var(--space-6)
.figure__caption   --text-sm, --fg-muted, margin-block-start var(--space-3),
                   prefixed «شکل ۲.۳ — », max-width 60ch
.figure__controls  margin-block-start var(--space-4), top border, --bg-sunken
```

Controls are visually subordinate to the figure — a quiet strip below it, never a toolbar above it. The figure is the content; controls are an afterthought by design (PLAN §3.2).

### 5.3 Aside (engineering detail)

```html
<details class="aside">
  <summary>برای مهندسان: چطور این فراخوانی ساخته می‌شود</summary>
  ...
</details>
```

- `--bg-sunken`, `border-inline-start: 2px dashed --stroke-strong`, `--text-sm`.
- Closed by default. Summary always begins «برای مهندسان:» so the primary audience learns in Part 1 that these are skippable, and skips them with confidence.
- Native `<details>`: keyboard accessible, Ctrl+F-findable in modern browsers, prints expanded, works without JS.

### 5.4 Progress rail

```
position: fixed; inset-inline-end: 0; inset-block: 0; width: 3px;
```

Six stacked segments in Part colors, filled portion at full opacity, unfilled at 0.15. Updated from a scroll listener (rAF-throttled). Each segment is a `<button>` with a Persian `aria-label` jumping to its Part. Hidden below 600px (`inset-inline-end` collides with thumbs) and in print.

### 5.5 TOC drawer

One fixed icon button, top inline-start. Opens a wide `<dialog>` containing six color-coded Part bands, all 35 lesson links, and 53 concept links from the map data. A search field filters Persian/English names and lesson numbers; the current lesson is marked. On mobile the bands stack and lesson cards become a single column. Selection closes the map and focuses the destination. Escape, the close button, and backdrop clicks restore opener focus. Native `<dialog>` traps focus; a native `<details>` version provides no-JavaScript navigation. Hidden in print. The map is not repeated inside the book.

### 5.6 Part divider

```
min-height: 45vh; display: grid; place-content: center;
```

Part number at `--text-3xl` in the Part color, title at `--text-2xl`, and orienting text. No inline map. A subtle Part-color gradient wash is the only large color area in the document. Printed dividers introduce the next lesson rather than occupying a dedicated map page.

---

## 6. Motion

```css
--dur-fast: 180ms;  --dur-base: 320ms;  --dur-slow: 600ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

Rules:

1. **Reveal is uniform**: `opacity 0→1` + `translateY(12px)→0`, `--dur-base`, `--ease-out`. Every element, every figure.
2. **Once only.** Animations do not replay on scroll-back.
3. **Figures ≤ 3.5 s** total.
4. **Stagger ≤ 100 ms** per item, capped at 800 ms total for a group. Longer and the reader waits.
5. **No parallax, no scroll-scrubbing, no scroll-hijacking.** Native scrolling, always. Scroll-jacking is the fastest way to make a long document feel hostile.
6. **No looping animation** except `ProbabilityBars` in 3.1 (loops twice, then rests) and `GraphMorph`'s single morph.
7. Animate only `transform`, `opacity`, `stroke-dashoffset`, `clip-path`. Never layout properties.

### 6.1 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Plus, per figure: render the **final** state immediately; multi-step figures show all steps simultaneously. **A reduced-motion reader must lose zero information.** Tested per-primitive at Gate 2 — not as a blanket CSS rule assumed to work.

---

## 7. Accessibility

- **Landmarks**: `<main>` wrapping the book; each Part a `<section aria-labelledby>`; each lesson an `<article aria-labelledby>`.
- **Headings**: one `<h1>` (document title), `<h2>` per Part, `<h3>` per lesson. No skipped levels.
- **Figures**: `<figure>` + `<figcaption>`; SVG `role="img"` with `<title>` and `<desc>`.
- **Keyboard**: everything reachable in DOM order. Visible focus (`outline: 2px solid var(--accent); outline-offset: 2px`). Skip link to the first Part.
- **Controls**: real form elements, Persian `aria-label`, values announced via `aria-live="polite"`.
- **Screen reader**: tested with NVDA + a Persian voice. Figure `desc` text is the non-visual substitute for the figure and is written, not generated (figures.md).
- **Zoom**: usable at 200% without horizontal scroll.
- **No-JS**: full static content; figures render in their final state. The document is readable with JS entirely disabled — this is a hard requirement, verified at Gate 4.
- Target: **zero axe-core violations**.

---

## 8. Print

`print.css`, targeting A4:

- Hide: progress rail, TOC button, all figure controls.
- Expand: all `<details>` asides.
- Figures: final animation state, `break-inside: avoid`.
- Interactive figures: a static fallback (`.print-fallback`, hidden on screen) — e.g. 5.2's calculator prints as its scenario table.
- Part dividers: `break-before: page`, but not full-height.
- Lesson titles: `break-after: avoid`.
- Dark code blocks invert to a light background with a border; dark fills waste toner and print poorly.
- `@page { margin: 18mm; }` with Part/lesson in a running header.

The printed PDF is a legitimate second deliverable — many in the primary audience will print it or read it as a PDF. Checked at Gate 4.

---

## 9. Performance

| Metric | Target |
|---|---|
| `dist/index.html` | ≤ 1.5 MB target, 3 MB hard cap |
| First paint (local file) | < 400 ms |
| JS execution on load | < 50 ms |
| Scroll | 60 fps on 2019-class hardware |

- One `IntersectionObserver` for all reveals; unobserve after firing.
- Scroll listener rAF-throttled, `{ passive: true }`.
- `content-visibility: auto` + `contain-intrinsic-size` on off-screen lessons — the main lever for a 35-lesson single-page document.
- No layout thrash: never read geometry in a scroll handler.
- Heavy figure data imported statically so it is tree-shaken and minified at build time.

---

## 10. Context Lens visual language

The Context Lens is a secondary figure (20 lessons + one Lab). Its full spec is `PLAN-CONTEXT.md`; this section records the visual rules implemented in `src/styles/context.css`.

### 10.1 Author colors

Six aliases of existing hues — no new hex values:

```css
--ctx-developer: var(--part-1);   /* blue   — system prompt, tools, skills */
--ctx-user:      var(--part-4);   /* green  — the person */
--ctx-model:     var(--part-2);   /* purple — the only author the model controls */
--ctx-tool:      var(--part-6);   /* teal   — tool results */
--ctx-store:     var(--part-3);   /* amber  — memory and retrieved documents */
--ctx-attacker:  var(--danger);   /* red    — 5.3 only */
```

Color is never the only signal. Every block also carries a text author label, an icon, and a distinct rail pattern:

| Author | Rail pattern |
|---|---|
| developer | solid |
| user | dotted |
| model | long dashes |
| tool | short dashes |
| store | double line |
| attacker | dashed + outline |

### 10.2 Tape

- A bordered card holds the ordered blocks. The author rail is 4 px on the inline-start edge.
- Blocks carry a kind chip, a mono role tag (`system`, `user`, …), a state badge, and optional lesson link.
- JSON is `dir="ltr"`, ASCII-only, light code block. On < 600 px it wraps instead of scrolling horizontally.
- The output area is dashed off from the input: «ادامهٔ متن (نوشتهٔ مدل)» plus «کلمهٔ بعدی» (or «توکن بعدی» from 3.2).
- The outside lane is a dashed card labelled «بیرون از متن»; on ≥ 900 px it sits inline-end of the tape, on narrower screens above it.
- States: `new` (accent), `changed` (dashed amber), `gone`/`evicted` (struck through + label), `danger` (red outline + ⚠), `dim`.
- The footer is the spine sentence, plus the authored-output disclaimer.

### 10.3 Raw view

`نمای خام` hides author rails, kind chips, badges, the actor strip, the outside lane and the meter, leaving one continuous text with mono role prefixes. The CSS is a single `.is-raw` class on the lens root. This is the "no magic, just text" moment.

### 10.4 Modes and controls

| Mode | Layout | Controls |
|---|---|---|
| `steps` | one tape, frames stacked with a stepper | prev/next, raw |
| `compare` | two tapes side by side (stacked < 900 px) | raw |
| `static` | one tape, optional slot cards | raw |
| `mapping` | JSON `messages` panel + tape | prev/next |
| `lab` | toggles + tape + answer | checkboxes, presets, reset |

All controls are native `<button>`/`<input>` elements outside any SVG, min 44 px tap targets, Persian labels. No auto-play. No dropdowns, no free text.

### 10.5 Fallbacks

- **No-JS**: all frames render stacked with their step headings and final outputs; steppers, predict options and Lab toggles are hidden; the Lab shows its default state and the three-preset table.
- **Reduced motion**: all frames visible, no typing animation, no transitions; the stepper is hidden.
- **Print**: all frames expanded, controls hidden, outputs and predict answers visible, code light, rails kept for greyscale.
