# Implementation tasks

Ordered, agent-sized tasks. Each is independently verifiable. Phase gates from `PLAN.md` §7 are blocking — **do not start a phase before its predecessor's gate passes.**

Legend: `[H]` requires a human (native Persian technical reader). `[P]` parallelizable with its siblings.

---

## Phase 0 — Terminology freeze `[H, blocking]`

### T0.1 `[H]` Review the glossary
Review all 50 entries in `glossary.yml`. For each: is `fa` natural? Is `style` right? Is `first_use` the form a Persian technical reader expects? Is `def_fa` ≤25 words and standalone-clear?

Resolve the two open decisions (`harness`, `guardrail`) per `docs/terminology.md` §6.2. Flip every reviewed entry to `status: confirmed`.

### T0.2 Seed `allowed-latin.txt`
Product and protocol names allowed in Persian prose without a glossary entry. Seed list in `docs/terminology.md` §4 Rule 3.

> **Gate 0**: every entry `status: confirmed`. Both "decide" terms resolved and recorded. `allowed-latin.txt` exists.

---

## Phase 1 — Scaffold and shell

### T1.1 Project init
Astro 5 + MDX + TypeScript (`strict`). `astro.config.mjs` with `output: 'static'`, `vite-plugin-singlefile`, `build.assetsInlineLimit: Infinity`, `build.inlineStylesheets: 'always'`. Shiki configured for build-time highlighting.

**Verify**: `npm run build` emits exactly one `dist/index.html` with no sibling assets.

### T1.2 Fonts `[P]`
`scripts/subset-fonts.ts`: subset Vazirmatn (variable, 300–800) and JetBrains Mono (400) per `design-system.md` §1.1, emit base64 `@font-face` into `src/styles/fonts.generated.css`.

**Verify**: both subsets within budget (≤110 KB / ≤30 KB). Persian renders correctly offline with the system font cache cleared.

### T1.3 Design tokens and base styles `[P]`
`tokens.css`, `base.css`, `rtl.css` from `design-system.md` §1–4. Install stylelint with `csstools/use-logical` set to error.

**Verify**: stylelint passes. No `left`/`right` in any stylesheet.

### T1.4 Content collection schema
`src/content.config.ts` — Zod schema for the frontmatter in `curriculum.md`. `scripts/check-skeleton.ts`: exactly 35 lessons, ids match `curriculum.md`, ordering correct, every `figure.component` resolves to a real file, every `terms_introduced` id exists in `glossary.yml`.

**Verify**: script fails on a deliberately broken stub, passes on a correct one.

### T1.5 Shell components
`src/components/shell/`: `Book`, `Cover`, `PartDivider`, `Lesson`, `Figure`, `Caption`, `Takeaway`, `Aside`, `Term`, `Num`, `Ltr`, `Code`.

`Term` must resolve `first_use` vs `short` from the lesson's reading position (`terminology.md` §5).

**Verify**: a stub lesson renders in the correct rhythm (`PLAN` §3.4). `Term` renders `first_use` on first occurrence and `short` after.

### T1.6 Digit plugin `[P]`
Remark plugin: Latin→Persian digits in MDX text nodes, skipping `code`, `inlineCode`, `<Ltr>`, `<Code>`, and `digits="latin"` subtrees.

**Verify**: unit tests covering prose, inline code, fenced code, and an opted-out table.

### T1.7 Navigation and reveal
`ProgressRail` (6 segments, Part colors, rAF-throttled, `<button>` per segment), `TocDrawer` (`<dialog>`, focus trap, Escape), `reveal.ts` (one `IntersectionObserver`, threshold 0.35, unobserve after firing).

**Verify**: keyboard-only navigation works. Rail tracks scroll. One observer in DevTools, not 35.

### T1.8 Glossary validator
`scripts/check-glossary.ts` — all four rules plus the warnings in `terminology.md` §4. Wire all three validators into `prebuild`.

**Verify**: each rule fails on a purpose-built fixture violating only that rule.

### T1.9 35 stubs
All 35 MDX files with correct frontmatter, real titles from `curriculum.md`, placeholder body, placeholder figure. `src/pages/index.astro` assembles Cover → (PartDivider → lessons) × 6.

### T1.10 `concept-map.ts` layout `[risk]`
Layout for ~53 nodes in 5 zones, labels pulled from `glossary.yml` `short`. Include the `stacked` (<600px) variant: zones as vertical chip groups, no edges.

**Do this early.** It is the hardest legibility problem in the document (`figures.md` §1) and it blocks all 6 Part dividers.

> **Gate 1**: single `dist/index.html` opens from `file://` and scrolls through 6 Parts and 35 titled stubs. All three validators exit 0. Zero network requests in DevTools. Keyboard-navigable. `prefers-reduced-motion` honored.

---

## Phase 2 — Figure library

Build in the order in `figures.md` §Build order — highest reuse first, so Phase 3 can start on Parts 1–2 before the library finishes.

### T2.1 Figure primitives base
`src/components/figures/_base/`: shared SVG wrapper (viewBox, `role="img"`, `<title>`/`<desc>`), icon sprite (~14 symbols), arrow/elbow path helpers, the RTL coordinate helper, `figures.css`.

The RTL coordinate helper is the load-bearing piece: every primitive computes positions through it, so direction is solved once (`PLAN` §5.3).

### T2.2 Gallery page
`src/pages/_figures-gallery.astro` — every primitive with sample data, at all three breakpoints, with a reduced-motion toggle. Excluded from the production build.

Build this **second**, before any primitive. It is the test harness for everything that follows.

### T2.3–T2.14 Shared primitives `[P after T2.1/T2.2]`
One task each: `CardGrid`, `FlowPipeline`, `SequenceFlow`, `SplitCompare`, `LayerStack`, `StackedBar`, `ProbabilityBars`, `LoopTrace`, `BranchDiagram`, `Ladder`, `DataTable`, `ConceptMap`.

Each must satisfy the full shared contract in `figures.md`: props as specified, RTL-correct, animated on reveal, complete under reduced motion, three breakpoints, no horizontal scroll at 360px, `desc` surfaced.

`ConceptMap` is last among the shared primitives and is the largest single task.

### T2.15–T2.20 Single-use primitives `[P]`
`TokenStrip`, `GraphMorph`, `ExplodedView`, `Matrix2x2`, `AnnotatedCode`, `TradeoffTriangle`, `RoadStrip`, `CostCalculator`.

`AnnotatedCode` and `CostCalculator` are HTML-based, not SVG — see `figures.md` §16 and §20. `CostCalculator` needs its committed price fixture with a visible date stamp.

> **Gate 2**: gallery reviewed in Chrome, Firefox, Safari, Edge at 360 / 768 / 1440px. Every primitive RTL-correct (arrow direction, actor order, text anchoring, RTL axis origin in `Matrix2x2`). Every primitive complete under reduced motion. No primitive uses physical CSS properties or a mirroring transform around text.

---

## Phase 3 — Content authoring

Strictly in order, 1.1 → 6.4, in Part-sized batches. Each lesson: author the Persian prose natively from `objective_fa`, then supply real figure data.

Read before starting: `docs/terminology.md` in full, plus the previous lesson's takeaway.

### T3.1 Part 1 (1.1–1.5)
Includes the master `ConceptMap` data (1.2) and the retail scenario (1.4) — both are referenced by every later Part, so get them reviewed carefully.

### T3.2 Part 2 (2.1–2.8)
### T3.3 Part 3 (3.1–3.7)
3.5 must reuse 3.1's visual language. Verify explicitly.

### T3.4 Part 4 (4.1–4.7)
4.3 must reuse 3.3's `StackedBar`. Verify explicitly.

### T3.5 Part 5 (5.1–5.4)
5.1's `lessonRef` badges must point at the lessons that actually introduced each box.

### T3.6 Part 6 (6.1–6.4)
6.4 closes the frame with `ConceptMap highlight="all"`, clickable.

### T3.7 The 35 takeaways `[H]`
Extract all 35 `◆ در یک جمله` lines into one document and read them as a standalone artifact. They must form a coherent summary of the whole (`PLAN` §3.4). Revise individual lessons where the chain breaks.

> **Gate 3** (per Part): all validators exit 0. Word budgets within +10%. No horizontal scroll at 360px. `[H]` native reader signs off. That Part's takeaway lines cohere.
> **Gate 3 final**: all 35 at `status: confirmed`. T3.7 complete.

---

## Phase 4 — Polish

### T4.1 Accessibility audit
axe-core over the built file. Keyboard-only pass. NVDA + Persian voice pass, with attention to figure `desc` text. Verify 200% zoom and the no-JS path.

**Target**: zero axe violations.

### T4.2 Performance `[P]`
`scripts/check-budget.ts` for word counts and output size. Add `content-visibility: auto` + `contain-intrinsic-size` to off-screen lessons. Profile scroll on 2019-class hardware.

**Target**: ≤1.5 MB, 60 fps scroll, <50 ms load JS.

### T4.3 Print stylesheet `[P]`
`print.css` per `design-system.md` §8. Static print fallbacks for all 8 interactive figures.

**Verify**: A4 PDF export is readable, figures are in final state, asides are expanded, no clipped figures.

### T4.4 Cross-browser and `file://`
All four browsers, from `file://` as well as over HTTP. Verify after a fresh `npm run build` on a machine with no font cache.

### T4.5 Colour-blindness pass `[P]`
Deuteranopia/protanopia simulation over all 35 figures. Every meaning-bearing colour must have a non-colour partner.

### T4.6 Full read-through at 360px `[H]`
Read the entire document on a phone. Note every overflow, every cramped figure, every too-long line.

> **Gate 4**: zero axe violations. ≤3 MB. Smooth scroll. Clean PDF. Usable with JS disabled.

---

## Phase 5 — Release

### T5.1 Confirm everything
`check-glossary.ts --require-confirmed` exits 0. Every lesson `status: confirmed`.

### T5.2 README
How to open `dist/index.html`, how to rebuild, how to author a lesson, how the validators work.

### T5.3 `[H]` Audience acceptance test
A person from the primary audience who has not seen the document reads it end to end. Afterwards, unprompted, they explain: what an agent is, what a token is, why models hallucinate, what RAG is for.

**This is the real acceptance test.** Failure here means revising content, not shipping with a caveat.

> **Gate 5**: T5.1–T5.3 pass. Tagged build.

---

## Risk register

| Risk | Impact | Mitigation |
|---|---|---|
| `ConceptMap` illegible at 53 nodes, especially on mobile | High — it is the document's spine | T1.10 prototypes it in Phase 1, before content. A dedicated stacked variant. Cut nodes if needed: the map must be readable even if that means fewer terms. |
| Single-file + inlined fonts breaks on `file://` | High — kills the deliverable | Validated at Gate 1 on day one, re-verified at Gate 4. |
| Terminology churn after authoring | High — rework across 35 lessons | Phase 0 is blocking. `<Term>` centralizes forms so a late rename is a glossary edit, not 35 prose edits. |
| Persian prose overflows word budgets | Medium | Budgets in `curriculum.md`, enforced by script. Rule: cut prose, never the figure. |
| Interaction creep past 8 controls | Medium — breaks the "smooth, not many buttons" constraint | Hard cap. Adding a control requires removing one. Reviewed at each Gate 3. |
| Output exceeds 3 MB | Medium | No raster images, ever. Budget script fails the build. |
| Figures become decorative rather than load-bearing | Medium — defeats the document's purpose | Every caption must state a takeaway; a caption that merely describes fails review. |
| Asides drift into carrying required content | Medium | Gate 3 check: the main track must be coherent with every aside collapsed. |

## Agent assignment

| Stream | Tasks | Notes |
|---|---|---|
| Infrastructure | T1.1–T1.8, T4.2 | One agent, sequential. |
| Figure library | T2.1–T2.20 | One agent for the base + gallery, then parallel per primitive. |
| Content | T3.1–T3.6 | **Sequential, one agent.** Voice consistency across 35 lessons matters more than speed. Do not parallelize. |
| Review | Gates 0, 3, 4.6, 5.3 | Native Persian technical reader. Human, non-negotiable. |

Content is the long pole and cannot be parallelized without losing the single voice the document depends on. Infrastructure and figures should run ahead so content is never blocked.

---

## Phase C — Context Lenses (implemented)

Executed from `PLAN-CONTEXT.md`. The full spec, frame scripts and acceptance criteria live there; this is the task record.

### C0 — Decisions

- [x] C0.1 D1–D5 resolved (context term added; system-prompt moved to 1.3; 8 primary + bounded lens controls; raw view off by default; 1.3 enriched, no new lesson).
- [x] C0.2 Glossary diff applied: `context` at 1.3, `system-prompt` moved to 1.3, `context-window` redefined as the size limit.
- [x] C0.3 Spine sentence and core narrations authored. **Native-reader sign-off still pending.**

### C1 — Data and validators

- [x] C1.1 `PLAN.md`, `curriculum.md`, `figures.md`, `design-system.md`, `terminology.md`, `README.md` updated.
- [x] C1.2 `src/data/context/types.ts`, `kinds.ts`, `blocks.ts`, `story.ts`, `lab.ts`.
- [x] C1.3 Glossary, `terms_introduced`, `allowed-latin.txt`.
- [x] C1.4 `check-context.ts` wired into `prebuild` and `npm run check`; skeleton and budget checks extended.
- [x] C1.5 `lenses.ts` with all 20 lenses plus the Lab entry.

### C2 — Components

- [x] C2.1 `ContextText`, `ContextBlock`, `ContextTape`.
- [x] C2.2 `ContextLens` in `steps`, `static`, `compare`, `mapping` modes; `FigureShell` suffix.
- [x] C2.3 `scripts/context-lens.ts` (stepper, raw view, predict, typing, live region); `scripts/context-lab.ts`.
- [x] C2.4 `styles/context.css`, author tokens, print rules.
- [x] C2.5 `src/pages/_context-gallery.astro` (dev only).

### C3 — Tier A (9 lenses)

- [x] 1.3 `text-loop`, 2.2 `tool-call`, 2.4 `skill-loading`, 2.5 `memory-facts`.
- [x] 3.3 `context-fills`, 3.5 `no-fact-fluent-guess`, 4.1 `messages-array`, 4.4 `rag-paste`.
- [x] 5.3 `injection`.

### C4 — Context Lab

- [x] 4.3 Lab: five checkboxes, three presets, deterministic answer table, no-JS preset table.

### C5 — Tier B (8 lenses)

- [x] 1.4 `slots`, 2.3 `mcp-fills-tools`, 2.7 `tests-as-text`, 2.8 `anatomy-recap`.
- [x] 3.7 `thinking-text`, 5.2 `cache-prefix`, 5.4 `read-the-trace`, 6.4 `recap`.

### C6 — Tier C (3 lenses)

- [x] 3.4 `learned-vs-given`, 4.5 `where-it-changes`, 5.1 `who-writes-what`.

### C7 — QA

- [x] `npm run build` green: skeleton, glossary, context, budget.
- [x] axe-core: 0 violations on the whole document; Lab default / all-on / all-off; predict answered.
- [x] No-JS: all frames stacked, controls hidden, Lab default + preset table.
- [x] Reduced motion: all frames visible, stepper and typing removed.
- [x] 360 px: no page overflow; JSON wraps.
- [x] Print: all frames expanded, controls hidden, ~100 A4 pages.
- [x] `dist/` contains exactly `index.html`; size ≈ 0.92 MB.
- [ ] `[H]` Native-reader review of all Persian lens narrations, predicts and Lab sentences.
