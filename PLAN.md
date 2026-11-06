# هوش مصنوعی، از بالا به پایین — Master Plan

> **Product**: one self-contained, interactive, Persian (RTL) HTML document that teaches AI top-down to a mixed audience led by non-technical business readers.
> **Deliverable**: `dist/index.html` — a single file, no network needed, openable from a USB stick or an email attachment.
> **Source**: modular. 35 lesson files + a reusable figure component library + a build that inlines everything.

This file is the master plan. Four companion documents hold the detail:

| Doc | Contents |
|---|---|
| [`docs/curriculum.md`](docs/curriculum.md) | The 35-lesson skeleton. One row per lesson: objective, figure, terms, budget. **The authoring contract.** |
| [`docs/figures.md`](docs/figures.md) | The figure component library. Props, animation behavior, RTL rules. |
| [`docs/design-system.md`](docs/design-system.md) | Tokens, typography, RTL/LTR handling, motion, a11y, print. |
| [`docs/terminology.md`](docs/terminology.md) | Persian content rules, glossary schema, validator rules. |
| [`docs/implementation-tasks.md`](docs/implementation-tasks.md) | Ordered, agent-sized tasks with acceptance criteria. |
| [`glossary.yml`](glossary.yml) | Seeded machine-readable glossary (50 terms). Drives the validator and the `<Term>` component. |

---

## 1. Goal and audience

### 1.1 The one-sentence goal

A manager who knows nothing about AI should be able to scroll this document once, end to end, and afterwards (a) understand what the words mean, (b) understand how the pieces fit, and (c) ask their engineers good questions.

### 1.2 Audience

**Primary**: Persian-speaking business readers — executives, product managers, team leads, founders. No code literacy assumed. They read the main scroll and nothing else.

**Secondary**: senior engineers and architects new to LLMs. They read the main scroll *plus* the collapsed `<Aside variant="eng">` blocks.

**Consequence — the two-track rule**: the main scroll must be 100% complete and coherent with every engineering aside collapsed. An aside may *deepen* a point but may never *carry* one. If a reader must open an aside to follow the next lesson, the lesson is wrong.

### 1.3 Tone

- Short sentences. One idea per paragraph.
- Concrete before abstract. Always: example → name → definition. Never: definition → example.
- No undefined jargon, ever. Enforced mechanically (see `not_before` in §6).
- Analogies are allowed but must be *cashed out* — every analogy is followed by the literal mechanism in one sentence.
- No hype, no fear. No "revolutionary", no "will replace everyone". Claims that are contested are labeled as contested.

---

## 2. The pedagogical spine

Four devices carry continuity across 35 lessons. They are the reason this reads as one document and not as 35 slides. **All four are mandatory.**

### 2.1 The recurring map

Lesson **1.2** presents one master concept map: every term in the document, as a labeled node, grouped into zones (Agent layer / Model layer / Build layer / Run layer / Decide layer).

That *same* SVG is re-rendered six more times:

- once at the opening of each Part, with that Part's zone lit and the rest dimmed to 20% opacity ("you are here"),
- once at the very end (lesson 6.4) with everything lit.

Implementation: a single `<ConceptMap>` component with a `highlight` prop taking a zone id. One source of truth, eight appearances. This is the single most important continuity device in the document.

### 2.2 The running example

One scenario threads through all six parts: **a customer-support assistant for an online retail store** (`فروشگاه آنلاین`). It is introduced in lesson 1.4 and revisited in every part:

| Part | How the example appears |
|---|---|
| 1 | A customer asks "where is my order?" — the assistant answers. |
| 2 | The assistant becomes an agent: it calls an order-lookup tool, then issues a refund. |
| 3 | It invents an order number that does not exist. Why? |
| 4 | We ground it in the real return-policy documents with RAG, then measure whether it got better. |
| 5 | It is handling 10,000 chats a day. What does it cost, how does it fail, how is it attacked. |
| 6 | Build it or buy it. Who is on the team. |

Every lesson that uses the example tags itself `example: retail` in frontmatter. The validator warns if a Part has zero `example: retail` lessons.

### 2.3 The text-loop spine (Context Lens)

Every concept in Parts 2–5 is a way of putting text into one box. A recurring **Context Lens** — a secondary figure — shows the actual text the model receives, who wrote each block, and what the model writes next. It appears in 20 lessons plus one Lab in 4.3. The full spec is `PLAN-CONTEXT.md`; it is implemented.

The spine sentence closes every lens: «مدل فقط ادامهٔ متنی را می‌نویسد که جلویش گذاشته‌اند.» From 3.2 on, the cursor says «توکن بعدی» instead of «کلمهٔ بعدی».

Rules: at most one lens per lesson; every frame is server-rendered; every lens is complete without interaction; the Lab is the only place the reader builds a context. Lenses are secondary figures and do not count against the eight primary interactive figures.

### 2.4 Progressive zoom

The document is strictly top-down and never forward-references. Part 1 is the whole system at 10,000 feet. Part 2 opens the outermost layer users actually touch (agents). Part 3 zooms into the component inside it (the model). Part 4 zooms out to building. Part 5 to running. Part 6 to deciding.

A reader who stops after any Part has a complete, if shallower, mental model. Parts are not cliffhangers.

---

## 3. Reading experience

The constraint from the brief: *smooth and continuous, not many buttons.* This is a design constraint with teeth.

### 3.1 One scroll

The document is a **single continuous vertical scroll**. No tabs. No pagination. No "next lesson" button. No routing. The reader's only required input is scrolling.

### 3.2 The interaction budget — hard rules

1. **Animations auto-play.** When a figure scrolls into view, it animates once, on its own. The reader never presses "play".
2. **At most one optional control per figure**, and only when exploration genuinely teaches something a passive animation cannot (e.g. the cost calculator in 5.2, the tokenizer in 3.2). Target: **no more than 8 of the 35 primary figures have any control at all.** `docs/curriculum.md` marks which ones; adding a ninth requires removing one. The 20 Context Lenses are secondary figures with their own bounded controls (stepper, raw-view toggle, at most two predict lenses, one Lab) and do not count against this cap.
3. **A control is always a slider, a two-way toggle, or a text input.** Never a dropdown, never a modal, never a multi-step wizard. The Context Lens adds steppers and Lab checkboxes as the only exceptions; both are bounded and keyboard-native.
4. **Every figure is complete without touching it.** Controls refine; they never reveal required information.
5. **Nothing is hidden behind a click in the main track.** The only collapsible elements in the entire document are the engineering asides, and they are decorative by definition (§1.2).

### 3.3 Chrome

Deliberately minimal — three elements only:

- **Progress rail**: a 3px vertical bar pinned to the viewport edge (right edge, since RTL), filling as the reader descends. Six segments, one per Part. Purely informational; also clickable as a coarse jump.
- **TOC drawer**: one icon, fixed, top-start corner. Opens a flat list of the six Parts with their lessons. Closes on selection. This is the only modal surface in the document.
- **Part dividers**: full-viewport-height "breathing" sections between Parts — big Part number, Part title, one orienting sentence, and the recurring map with this Part's zone lit. These are the document's punctuation; they tell the reader they have finished something.

### 3.4 Lesson rhythm

Every lesson follows the identical shape. Repetition is the point — the reader learns the rhythm in Part 1 and then coasts.

```
┌─────────────────────────────────────────┐
│ ۲.۳                      ← lesson number │
│ MCP: پریز استاندارد ابزارها  ← title      │
│                                          │
│ یک پاراگراف کوتاه که مسئله را می‌سازد.    │ ← the hook: 2–3 sentences, the problem
│                                          │
│   ╭──────────────────────────────╮      │
│   │                              │      │
│   │      THE FIGURE              │      │ ← animates on scroll-in
│   │                              │      │
│   ╰──────────────────────────────╯      │
│   شکل ۲.۳ — تکـ‌نکتهٔ این شکل.            │ ← caption = the takeaway, not a description
│                                          │
│ دو یا سه پاراگراف توضیح.                  │ ← the mechanism, in plain words
│                                          │
│ ▸ برای مهندسان: ...                      │ ← optional, collapsed, skippable
│                                          │
│ ◆ در یک جمله: ...                        │ ← the one-line takeaway, visually distinct
└─────────────────────────────────────────┘
```

**The figure comes before the long prose.** Non-technical readers orient visually first. The hook poses a problem, the figure answers it, the prose explains the answer. Lessons with a Context Lens insert it after the explanatory prose and before the aside: hook → figure → prose → lens → aside → takeaway.

**The caption states the lesson's point, not the figure's contents.** Bad: «نمودار ترتیبی فراخوانی ابزار». Good: «مدل خودش ابزار را اجرا نمی‌کند؛ فقط می‌گوید کدام ابزار را صدا بزن».

**Every lesson ends with `◆ در یک جمله`.** A reader skimming only these 35 sentences gets the entire document. This is the compressed edition and it must stand alone — review the 35 sentences as a single artifact in Phase 4.

---

## 4. Technical architecture

### 4.1 Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Astro 5**, `output: 'static'` | Content-first, ships zero JS by default, MDX content collections, and it *prerenders*. The single file contains real HTML — searchable with Ctrl+F, printable, readable with JS off. |
| Content | **MDX** per lesson | Persian prose with inline figure components. Authors edit text, not markup. |
| Language | **TypeScript**, `strict: true` | |
| Bundling to one file | **`vite-plugin-singlefile`** + `build.assetsInlineLimit: Infinity` + `build.inlineStylesheets: 'always'` | Standard, well-trodden path to a single HTML artifact. |
| Diagrams | **Hand-authored SVG** in Astro components | See §4.3. |
| Animation | **CSS transitions/keyframes + Web Animations API** | No animation library in the bundle. ~200 lines of orchestration total. |
| Code highlighting | **Shiki** (Astro built-in, build-time) | Zero runtime JS, zero runtime cost. |
| Fonts | **Vazirmatn** (variable, subset) + **JetBrains Mono** (regular, subset), base64-inlined | §4.4. |
| Validation | Node scripts in `scripts/`, run in CI and as a `prebuild` hook | §6. |

Node modules and build tooling are unrestricted — the constraint is only on the *output*.

### 4.2 Why not Mermaid

It was considered and rejected. Three reasons, recorded so this is not relitigated:

1. **RTL is unsupported.** Mermaid lays out sequence and flow diagrams LTR. Mirroring them for Persian means fighting the renderer on all 35 figures.
2. **Weight.** Bundled Mermaid is ~1 MB minified — a third of our entire size budget, for layouts we can hand-author more precisely.
3. **No animation.** Mermaid produces static SVG. Animation is this document's core teaching mechanism, not a decoration.

Hand-authored SVG costs more authoring time per figure but is recovered by the shared primitive library (§4.3) — the 35 figures are built from ~18 reusable components, not from scratch.

### 4.3 The figure library is the architecture

The central technical decision: **lessons do not author SVG.** They call a parameterized component with data.

```mdx
<SequenceFlow
  actors={[
    { id: 'user',  label: 'کاربر' },
    { id: 'agent', label: 'ایجنت' },
    { id: 'tool',  label: 'ابزار سفارش' },
  ]}
  steps={[
    { from: 'user',  to: 'agent', label: 'سفارشم کجاست؟' },
    { from: 'agent', to: 'tool',  label: 'getOrder("۱۲۳")', mono: true },
    { from: 'tool',  to: 'agent', label: 'در حال ارسال', dashed: true },
    { from: 'agent', to: 'user',  label: 'سفارش شما فردا می‌رسد' },
  ]}
/>
```

This buys three things that matter at 35 figures:

- **Visual consistency** — every sequence diagram in the document looks and behaves identically. The reader learns to read one diagram type, once.
- **RTL correctness in one place** — mirroring, arrowhead direction, and bidi label isolation are solved inside `SequenceFlow.astro` and are then correct everywhere. Solving it per-figure would mean 35 chances to get it wrong.
- **Parallel authoring** — content agents write MDX and data; figure agents build components. The two streams barely touch.

~18 primitives cover all 35 figures. Full specification in `docs/figures.md`.

### 4.4 Size budget

| Item | Target |
|---|---|
| Vazirmatn variable, subset to Arabic + Latin + both digit sets | ≤ 110 KB |
| JetBrains Mono regular, subset to ASCII | ≤ 30 KB |
| CSS (inlined) | ≤ 80 KB |
| JS (inlined) | ≤ 60 KB |
| SVG + HTML content | ≤ 900 KB |
| **Total `dist/index.html`** | **≤ 1.5 MB target / 3 MB hard cap** |

`scripts/check-budget.ts` fails the build above the hard cap and warns above target. **No raster images anywhere** — this is what keeps the budget achievable. If a figure seems to need a photo, it needs a better diagram.

### 4.5 Repository layout

```
ai-interactive/
├─ PLAN.md
├─ glossary.yml
├─ docs/
│  ├─ curriculum.md
│  ├─ figures.md
│  ├─ design-system.md
│  ├─ terminology.md
│  └─ implementation-tasks.md
├─ astro.config.mjs
├─ package.json
├─ tsconfig.json
├─ scripts/
│  ├─ check-glossary.ts        # terminology + not_before enforcement
│  ├─ check-skeleton.ts        # 35 lessons, ids, order, required fields
│  ├─ check-budget.ts          # word counts + output file size
│  └─ subset-fonts.ts          # pyftsubset/fonttools wrapper → base64 CSS
├─ src/
│  ├─ content.config.ts        # Zod schema for lesson frontmatter
│  ├─ content/lessons/
│  │  ├─ 1-1-what-ai-does-today.mdx
│  │  ├─ 1-2-the-map.mdx
│  │  └─ ... 35 files
│  ├─ data/
│  │  ├─ concept-map.ts        # master map nodes/edges/zones (single source of truth)
│  │  └─ figures/*.ts          # heavy figure datasets, kept out of MDX
│  ├─ pages/index.astro        # assembles parts + lessons in order
│  ├─ layouts/Book.astro
│  ├─ components/
│  │  ├─ shell/                # Cover, PartDivider, Lesson, Figure, Caption,
│  │  │                        # Takeaway, Aside, ProgressRail, TocDrawer,
│  │  │                        # Term, Num, Ltr, Code
│  │  └─ figures/              # the ~18 primitives
│  ├─ scripts/
│  │  ├─ reveal.ts             # IntersectionObserver → data-visible
│  │  ├─ progress.ts
│  │  ├─ toc.ts
│  │  └─ figures/*.ts          # per-figure behavior, lazy-attached
│  ├─ styles/
│  │  ├─ tokens.css  base.css  rtl.css  figures.css  print.css
│  └─ assets/fonts/
└─ dist/index.html             # ← the deliverable
```

### 4.6 Animation orchestration

One mechanism, used by every figure. No per-figure invention.

1. `reveal.ts` registers a single `IntersectionObserver` over all `[data-reveal]` elements, threshold `0.35`.
2. On intersection it sets `data-visible="true"` and unobserves (animations play **once** — re-animating on scroll-back is nauseating in a long document).
3. CSS does the work: `[data-reveal] { opacity: 0 } [data-visible="true"] { opacity: 1; transition: ... }`.
4. Figures needing staged choreography (sequence diagrams, pipelines) expose `data-figure="sequence"`; a small per-type module attaches a WAAPI timeline keyed off `data-visible`.
5. Staggering uses `--i` custom properties set at build time, not JS loops.

**`prefers-reduced-motion: reduce` is honored globally**: all transitions collapse to `0.01ms`, all figures render in their *final* state immediately, step-through figures show all steps at once. Never a blank figure. A reduced-motion reader must lose zero information.

### 4.7 Browser support

Last two versions of Chrome, Firefox, Safari, Edge. No IE, no polyfills. Must work from `file://` — this forbids ES modules with CORS restrictions, `fetch`, and service workers. All JS ships as one classic inlined `<script>`. **`file://` is a first-class test target, checked in every phase gate.**

---

## 5. Persian / RTL engineering

Full rules in `docs/terminology.md` and `docs/design-system.md`. The load-bearing decisions:

### 5.1 Direction

`<html lang="fa" dir="rtl">`. All layout uses **CSS logical properties** (`margin-inline-start`, `padding-block`, `inset-inline-end`) — never `left`/`right`. A `left: 0` in a reviewed diff is a bug.

### 5.2 LTR islands

Code, JSON, URLs, API field names, product identifiers, and file paths stay Latin and LTR:

```css
.ltr { direction: ltr; text-align: left; unicode-bidi: isolate; }
```

- Block-level: `<Ltr>` wrapper / the `<Code>` component.
- Inline inside Persian prose: `<bdi>` via the `<Ltr inline>` component. **Mandatory** — bare Latin identifiers in RTL prose produce scrambled punctuation. This is the single most common bug class in RTL documents; reviewers check for it explicitly.

### 5.3 SVG mirroring

SVG does not inherit `dir`. Every figure primitive handles direction **internally and explicitly**:

- Coordinates are authored LTR, then the content group gets `transform="scale(-1,1)"` plus a counter-flip on each text node — **or** (preferred, and the default for new primitives) the component computes RTL coordinates directly from its data. Mirroring transforms are banned in primitives that contain text, because the counter-flips are fragile.
- Arrowheads must point the correct way: in RTL a "forward" arrow points **left**.
- Reading order of sequence actors: **first actor is rightmost**.
- `<text>` nodes get `direction="rtl"` + `text-anchor="end"` for Persian, `direction="ltr"` + `text-anchor="start"` for Latin. Mixed labels are split into separate `<tspan>`s, never relying on bidi inside SVG text.

### 5.4 Digits

Persian digits (`۰۱۲۳۴۵۶۷۸۹`) in running text, headings, lesson numbers, and figure labels. Latin digits inside code, JSON, and measurement tables.

Implementation: a remark plugin converts Latin→Persian digits in MDX prose, skipping `code`, `inlineCode`, `<Ltr>`, and any element carrying `digits="latin"`. A `<Num>` component gives explicit control where the plugin must not guess. Per-table opt-out via `digits="latin"` on the table.

### 5.5 Line length and overflow

Persian text at the same point size runs **≈10–15% longer** than English and has taller line boxes (ascenders/descenders in Arabic script). Measure column: `68ch`. Every lesson has a Persian word budget in `docs/curriculum.md`, enforced by `check-budget.ts`.

**When a lesson overflows: cut prose, never the figure.** Prose is compressible; the figure is the lesson.

---

## 6. Terminology control

The mechanism that prevents the #1 failure mode of AI explainers — using a word before defining it.

### 6.1 `glossary.yml`

```yaml
- id: context-window
  en: Context window
  fa: ظرفیت کانتکست
  style: translate-plus-latin        # translate | transliterate | keep-latin | translate-plus-latin
  first_use: ظرفیت کانتکست (Context Window)
  short: ظرفیت کانتکست
  not_before: "3.3"
  def_fa: حداکثر اندازهٔ کانتکست؛ مدل در یک نوبت بیشتر از این نمی‌بیند.
  def_en: The maximum amount of context a model can consider in a single pass.
  status: confirmed                  # proposed | confirmed
  aliases: [context length]
```

### 6.2 `check-glossary.ts` — four rules, all build-failing

1. **`not_before`** — if a term's Persian or English surface form appears in a lesson earlier than its `not_before`, fail. Exception: lesson 1.2, the master map, may show any term as a bare node label (maps are allowed to contain words you do not understand yet — that is their purpose). Exception is scoped to `src/data/concept-map.ts` only.
2. **First use** — the first occurrence of a term at or after `not_before` must use the `first_use` form. Every later occurrence must use `short`. Catches both "never glossed" and "glossed four times".
3. **Unknown Latin** — any Latin-script token ≥3 chars in Persian prose that is not in the glossary, not in `allowed-latin.txt`, and not inside `<Ltr>`/code → fail. Forces every acronym through the glossary.
4. **Unconfirmed terms** — any term with `status: proposed` blocks the Phase 5 release build (but not dev builds).

### 6.3 `<Term>` component

```mdx
<Term id="context-window" /> {/* renders first_use or short automatically, based on position */}
```

The component knows the lesson's position in the reading order and renders the correct form. Authors never hand-type a glossed form. This makes rule 2 structurally unbreakable rather than merely checked.

### 6.4 Terms needing a decision in Phase 0

The brief marks two as "decide". Both are resolved by a native technical reader in Phase 0, recorded in `glossary.yml`, and then frozen:

| EN | Option A | Option B | Recommendation |
|---|---|---|---|
| Harness | چارچوب اجرا (Harness) | «محیط اجرا» | **A** — "چارچوب اجرا" is descriptive and the Latin gloss anchors it for readers who will meet the English word in tooling. |
| Guardrail | حفاظ | گاردریل | **گاردریل (Guardrail)** — transliteration with gloss. "حفاظ" is understandable but reads as physical safety equipment; the transliteration is already current in Persian technical speech. |

All 23 terms from the brief are seeded into `glossary.yml` as `status: proposed`, plus ~27 more the curriculum needs. Phase 0 flips them to `confirmed`.

---

## 7. Phases and gates

Each phase ends at a gate. **A gate is binary** — the next phase does not start until it passes. Gate checks are scripts where possible, a named human where not.

### Phase 0 — Terminology freeze `[blocking, human]`

Deliverable: `glossary.yml` with all ~50 terms at `status: confirmed`, the two "decide" terms resolved, `allowed-latin.txt` seeded.

> **Gate 0**: a native Persian technical reader has reviewed and signed off every entry. `check-glossary.ts --require-confirmed` exits 0.

Do this first. Every later phase depends on it, and renaming a term across 35 authored lessons is far more expensive than deciding it now.

### Phase 1 — Scaffold and shell

Astro + MDX + TS + singlefile build. Design tokens, fonts subset and inlined, RTL base styles. `Book.astro`, all `shell/` components. Progress rail, TOC drawer, Part dividers. All 35 MDX files created as **stubs** — correct frontmatter, title, placeholder body, placeholder figure. Validators written and wired to `prebuild`.

> **Gate 1**: `npm run build` produces a single `dist/index.html` that opens from `file://` and scrolls through 6 Parts and 35 titled stub lessons. All three validators exit 0. No network requests in DevTools. Document is navigable with keyboard alone.

This gate is important: it proves the *whole pipeline* end to end while there is nothing to lose. The riskiest technical assumptions (singlefile + inlined fonts + `file://`) are validated on day one, not discovered in Phase 4.

### Phase 2 — Figure library

All ~18 primitives in `docs/figures.md`, each with: RTL-correct rendering, scroll-triggered animation, a reduced-motion final state, and a `src/pages/_figures-gallery.astro` dev page rendering every primitive with sample data.

> **Gate 2**: gallery page reviewed in all four browsers and at 360px / 768px / 1440px widths. Every primitive is RTL-correct (arrow directions, actor order, text anchoring). Every primitive renders fully and correctly with `prefers-reduced-motion: reduce`. No primitive uses `left`/`right` CSS or a mirroring transform around text.

### Phase 3 — Content authoring

35 lessons written, in order, 1.1 → 6.4. Natively authored Persian per `docs/terminology.md` — **not translated**. Each lesson's figure gets real data.

Authoring runs in Part-sized batches. After each Part: validators, a read-through for continuity with the previous Part, and a check that the running example appears.

> **Gate 3**, per Part: all validators exit 0. Word budgets within +10%. No RTL overflow at 360px. Native reader signs off on the Part. The `◆ در یک جمله` lines of that Part read as a coherent summary.
> **Gate 3 final**: all 35 signed off. All 35 takeaway lines reviewed together as a standalone artifact.

### Phase 4 — Polish

Accessibility audit (axe, keyboard-only pass, screen-reader pass with Persian voice). Performance (size budget, scroll jank on a mid-range laptop). Print stylesheet → clean PDF. Cross-browser. `file://` re-verified. Full read-through at 360px.

> **Gate 4**: zero axe violations. `dist/index.html` ≤ 3 MB. Smooth scroll on a 2019-class laptop. PDF export is readable, with figures in their final state and asides expanded. Entire document usable with JS disabled (static content visible, figures in final state).

### Phase 5 — Release

`status: confirmed` on every glossary term, every lesson. Tagged build. `README.md` with how to open and how to rebuild.

> **Gate 5**: `check-glossary.ts --require-confirmed` exits 0. Someone from the target audience who has not seen the document reads it end to end and can afterwards explain, unprompted: what an agent is, what a token is, why models hallucinate, and what RAG is for. **This is the real acceptance test.**

---

## 8. Definition of done, per lesson

A lesson is done when **all** of these hold:

- [ ] Frontmatter validates against the Zod schema; `id`, `part`, `objective_fa`, `figure`, `terms_introduced` present.
- [ ] Skeleton parity: hook → figure → prose → optional aside → `◆ در یک جمله`, in that order.
- [ ] Persian word count within the budget in `docs/curriculum.md` (+10% tolerance).
- [ ] Exactly one figure, from the primitive library, with real data (no placeholders).
- [ ] Caption states the **takeaway**, not the figure's contents.
- [ ] `check-glossary.ts` passes: `not_before` respected, first-use glossed via `<Term>`, no un-glossed Latin.
- [ ] Figure animates on scroll-in, and renders complete under reduced motion.
- [ ] Main track is coherent with all asides collapsed.
- [ ] No horizontal scroll at 360px.
- [ ] Native Persian technical reader has signed off.

## 9. Non-goals

Recorded to prevent scope drift:

- No multi-page site, no router, no build-time i18n. One file, one language.
- No English edition in this project. Structure stays language-neutral (ids, component props) so one *could* be generated later, but it is not planned, budgeted, or gated.
- No live LLM calls, no API keys, no backend. All "API responses" in the document are hand-written illustrative fixtures and are visibly labeled as such.
- No user accounts, no progress persistence, no analytics, no telemetry. Zero network, by design.
- No video, no audio, no raster images.
- No exhaustive reference coverage. This is a *map*, not an encyclopedia. If a term is not needed to understand the whole, it is cut.
