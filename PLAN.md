# هوش مصنوعی؛ از شناخت تا کاربرد — Master Plan

> **Product**: one self-contained, interactive, Persian (RTL) HTML document for people who want to use and understand AI.
> **Deliverable**: `dist/index.html` — a single file, no network needed, openable from a USB stick or an email attachment.
> **Source**: modular. 41 lesson files + a reusable figure component library + a build that inlines everything.
>
> **Current contract (user-first revision)**: overview/agents/basics (Parts 1–2) → effective use (Parts 3–4) → internals (Parts 5–6). 41 lessons, six Parts, three stages, 40 primary figures (seven interactive), 20 Lenses and one Lab in 6.2. The practical course is complete at 4.6. `PLAN-USER-FIRST.md` and `docs/curriculum.md` supersede the historical phase/order/aside requirements below; old 35-lesson counts and tasks are archival, not current authoring instructions. Numeric v1 links and reading positions migrate through stable content slugs.

This file is the master plan. Four companion documents hold the detail:

| Doc | Contents |
|---|---|
| [`docs/curriculum.md`](docs/curriculum.md) | The 41-lesson syllabus, outcomes, figures, terms, budgets, and provenance. **The authoring contract.** |
| [`docs/figures.md`](docs/figures.md) | The figure component library. Props, animation behavior, RTL rules. |
| [`docs/design-system.md`](docs/design-system.md) | Tokens, typography, RTL/LTR handling, motion, a11y, print. |
| [`docs/terminology.md`](docs/terminology.md) | Persian content rules, glossary schema, validator rules. |
| [`docs/implementation-tasks.md`](docs/implementation-tasks.md) | Ordered, agent-sized tasks with acceptance criteria. |
| [`glossary.yml`](glossary.yml) | Seeded machine-readable glossary (50 terms). Drives the validator and the `<Term>` component. |

---

## 1. Goal and audience

### 1.1 The one-sentence goal

A reader can choose a suitable task and capability, share useful material safely, collaborate, verify results, control authority and understand the mechanisms behind the interface.

### 1.2 Audience

**Primary**: Persian-speaking people who want to use and understand AI; no code literacy or application-building goal is assumed.

**Secondary**: readers curious about deeper technical explanations in Parts 5–6. Engineering asides are retired.

**Consequence**: one continuous course. The first two stages stand alone; advanced APIs and system design are not prerequisites for effective use. Essential learning never depends on clicking a control.

### 1.3 Tone

- Short sentences. One idea per paragraph.
- Concrete before abstract. Always: example → name → definition. Never: definition → example.
- No undefined jargon, ever. Enforced mechanically (see `not_before` in §6).
- Analogies are allowed but must be *cashed out* — every analogy is followed by the literal mechanism in one sentence.
- No hype, no fear. No "revolutionary", no "will replace everyone". Claims that are contested are labeled as contested.

---

## 2. The pedagogical spine

Four devices carry continuity across 35 lessons. They are the reason this reads as one document and not as 35 slides. **All four are mandatory.**

### 2.1 The shared navigation map

The fixed **فهرست** button opens six color-coded Part bands labelled with three stages, all 41 lessons, and concepts grouped by actual introduction from `src/data/concept-map.ts`. Search supports Persian/English names and lesson numbers; the current reading location is highlighted.

Lesson **6.12** revisits this navigator without an inline primary figure. No map is repeated in the reading flow. The old `ConceptMap` SVG remains available to the development gallery, not the production book.

Implementation: `shell/TocMap.astro` renders the map-style links; `TocDrawer.astro` hosts the accessible dialog and a native no-JavaScript fallback. The book has 40 primary figures (7 interactive), plus 21 Context Lens/Lab pieces.

### 2.2 The running example

The recurring example is **a general-purpose coding agent like OpenCode or Hermes**, not a fictional project's single bug. Introduced in lesson 1.3, it illustrates everyday work: understanding a repository, finding relevant files, adding a feature, fixing a test, running commands, and reviewing changes. Small independent fixtures make each mechanism concrete; no code literacy or knowledge of one domain is required.

| Part | How the example appears |
|---|---|
| 1 | Meet the coding assistant, the project folder, the request, and the difference between product, harness, and model. |
| 2 | Read a file, edit it, run a command, use project instructions, and review actual results; add dark mode as a feature example. |
| 3 | Choose a bounded task/capability, share safely, supply a clear brief and material, and correct a proposed change. |
| 4 | Verify evidence, grant limited authority, stop/recover, reuse routines and compare total value. |
| 5 | Explain invented file names, capacity/selection, trained parameters, and computation tradeoffs behind those practices. |
| 6 | Inspect calls, prepared input, connectors, retrieval, traces and access enforcement; choose use/configure/connect/build responsibly. |

Every tagged lesson uses `example: coding` in frontmatter. The validator warns if a Part has zero `example: coding` lessons. `src/data/context/story.ts` holds a few consistent illustrative paths, commands, and outputs; it is not a narrative every example must follow. Tool definitions are not evidence: claims of reading, edits, or test success require result blocks. Names such as `readFile`, `editFile`, and `runCommand` are teaching shorthand, not product-specific tool APIs.

### 2.3 The text-loop spine (Context Lens)

A recurring **Context Lens** shows the sample input of a call, its sources and the model's new output. There are 20 Lens hosts plus one prepared-input Lab in 6.2. The practical lessons use static worked examples; the retained technical widgets deepen them later. Current hosts are in `docs/curriculum.md`; historical designs are recorded in `PLAN-CONTEXT.md`.

The spine sentence closes every lens: «مدل فقط ادامهٔ متنی را می‌نویسد که جلویش گذاشته‌اند.» Lenses use one quiet reading view: short Persian block labels, actual input text, compact outside-action notes, and a separate complete model response. There is no labeled/raw switch, actor strip, per-block token counter, or typing animation; capacity meters and the Lab total remain.

Rules: at most one lens per lesson; every frame is server-rendered; every lens is complete without interaction; the Lab is the only place the reader builds a context. Lenses are secondary figures and do not count against the seven primary interactive figures.

### 2.4 Progressive zoom

The current progression is user-first: overview and agent basics → task selection, sharing, dialogue, verification and authority → model and system mechanisms. Terms arrive when practically needed, then deepen later. Part 6 has three clusters: input/connections; sources/adaptation/evaluation; operation/decisions.

A reader who stops after any Part has a complete, if shallower, mental model. Parts are not cliffhangers.

---

## 3. Reading experience

The constraint from the brief: *smooth and continuous, not many buttons.* This is a design constraint with teeth.

### 3.1 One scroll

The document is a **single continuous vertical scroll**. No tabs. No pagination. No "next lesson" button. No routing. The reader's only required input is scrolling.

### 3.2 The interaction budget — hard rules

1. **Animations auto-play.** When a figure scrolls into view, it animates once, on its own. The reader never presses "play".
2. **At most one optional control per figure**, and only when exploration genuinely teaches something a passive animation cannot (e.g. the cost calculator in 5.2, the tokenizer in 3.2). Target: **no more than 8 primary figures have any control at all.** `docs/curriculum.md` marks which ones; adding a ninth requires removing one. The 20 Context Lenses are secondary figures with their own bounded controls (steppers and one Lab) and do not count against this cap. There are no reader quizzes or answer-gated outputs.
3. **A control is always a slider, a two-way toggle, or a text input.** Never a dropdown, never a modal, never a multi-step wizard. The Context Lens adds steppers and Lab checkboxes as the only exceptions; both are bounded and keyboard-native.
4. **Every lesson is complete without touching a control.** Required learning is visible in prose and static figures; retained Lens steppers offer deeper traces with all frames present in no-JS, print and reduced motion.
5. **No engineering asides or gated answers.** The shared navigator is optional, not a learning prerequisite.

### 3.3 Chrome

Deliberately minimal — three elements only:

- **Progress rail**: a 3px vertical bar pinned to the viewport edge (right edge, since RTL), filling as the reader descends. Six segments, one per Part. Purely informational; also clickable as a coarse jump.
- **TOC drawer**: one icon, fixed, top-start corner. Opens a flat list of the six Parts with their lessons. Closes on selection. This is the only modal surface in the document.
- **Part dividers**: compact "breathing" sections between Parts — big Part number, Part title, and orienting text. The map lives only in the shared فهرست, not in the dividers.

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
    { id: 'user',  label: 'کاربر', kind: 'user' },
    { id: 'agent', label: 'ایجنت', sublabel: 'چارچوب اجرا و ابزارها', kind: 'system' },
    { id: 'model', label: 'مدل', kind: 'model' },
  ]}
  steps={[
    { from: 'user',  to: 'agent', label: 'این فایل را توضیح بده.' },
    { from: 'agent', to: 'model', label: 'درخواست و فهرست ابزارها' },
    { from: 'model', to: 'agent', label: 'readFile("src/utils.ts")', mono: true, dashed: true },
    { from: 'agent', to: 'agent', label: 'بررسی مجوز و خواندن فایل' },
    { from: 'agent', to: 'model', label: 'فراخوانی دوباره، همراه متن فایل' },
    { from: 'model', to: 'agent', label: 'توضیح فایل', dashed: true },
    { from: 'agent', to: 'user',  label: 'نمایش توضیح', dashed: true },
  ]}
/>
```

Sequence diagrams use the user, agent, and model as their three participants. The agent lane includes its harness and tool execution; file reads and permission checks are local actions, not separate participants. Model outputs always return to the agent before anything is presented to the user.

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
│  │  ├─ 1-2-three-layers.mdx
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

1. **`not_before`** — if a term's Persian or English surface form appears in a lesson earlier than its `not_before`, fail. Exception: the shared navigation map may show any term as a bare node label so readers can find its introducing lesson. Exception is scoped to `src/data/concept-map.ts` only.
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
