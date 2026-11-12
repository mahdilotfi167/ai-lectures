# Figure library

The current book has **40 primary figures**, seven with optional controls, built from the existing primitives plus the static `ConversationExample`. A further **2 context primitives** (`ContextLens`, `ContextLab`) render 20 Lenses and one Lab. Lessons never author SVG — they pass data to a component.

> Current hosts, counts and stable identities are in `docs/curriculum.md`. Numeric host references in the original component catalogue below are historical. Use `fig-{slug}` / `fig-{slug}-ctx`; display numbers come from metadata. Do not assign a reused numeric identity to different content.

`ConversationExample` takes `{ id, caption, desc, messages: { role: 'کاربر' | 'دستیار', text: string }[] }`. It renders every message in an ordered HTML list, labelled without hidden states, animation or a live model. It represents message order and targeted feedback, not a participant sequence or evidence of execution.

Fifteen primitives are reused across two or more lessons; five are single-use because their lesson genuinely needs a bespoke visual. The two context primitives are shared by 21 lessons. Build them in the order given in `implementation-tasks.md` (shared primitives first).

---

## Shared contract — every primitive obeys all of this

### Props

Every primitive accepts, in addition to its own props:

```ts
interface FigureBase {
  id: string;              // "fig-skills", matches frontmatter
  title?: string;          // <title> inside SVG, for screen readers
  desc: string;            // <desc> — a sentence describing the figure for non-visual readers. REQUIRED.
  interactive?: boolean;   // default false
  height?: number;         // viewBox height; width is always 1000
}
```

`desc` is **required and must be written by the lesson author**, not auto-generated. For a screen-reader user it *is* the figure. A `desc` that merely repeats the caption fails review.

### Geometry

- `viewBox="0 0 1000 H"`. Width is always 1000 user units. Scale via CSS `width: 100%`.
- `preserveAspectRatio="xMidYMid meet"`.
- No fixed pixel sizes anywhere inside SVG. Font sizes in user units, scaled by the viewBox.
- Padding: 24 user units on all sides, inside the viewBox.

### Direction (PLAN §5.3)

- Primitives **compute RTL coordinates from data**. `transform="scale(-1,1)"` is **banned** in any primitive containing text.
- Default flow is **right → left**. "Step 1" is rightmost; arrows point left.
- Persian `<text>`: `direction="rtl"`, `text-anchor="end"` (or `middle` when centered).
- Latin `<text>`: `direction="ltr"`, `text-anchor="start"`, `class="mono"`.
- Mixed labels are split into separate `<tspan>`s with explicit `direction`. Never rely on the bidi algorithm inside SVG text.
- Primitives take `flow?: 'rtl' | 'ltr'` defaulting to `'rtl'`. `'ltr'` exists only for figures showing genuinely LTR artifacts (code, token strips of English text).

### Animation (PLAN §4.6)

- Root `<svg>` carries `data-reveal` and, if staged, `data-figure="<type>"`.
- Animation plays **once** on scroll-in, then stays in its final state.
- Total duration **≤ 3.5 s**. A reader must not wait.
- Stagger via `--i` custom properties set at build time, not JS loops.
- **Reduced motion**: every primitive renders its complete final state with no transitions. Multi-step figures show all steps at once. A reduced-motion reader loses zero information. Tested per-primitive at Gate 2.

### Styling

- Colors from `tokens.css` only. No hard-coded hex in components.
- Semantic roles, not literal colors: `--fig-primary`, `--fig-accent`, `--fig-muted`, `--fig-danger`, `--fig-ok`, `--fig-surface`, `--fig-stroke`.
- Stroke width: 2 user units default, 3 for emphasis.
- Corner radius: 8 user units.
- **Never color alone to carry meaning** — always paired with a label, an icon, or a pattern.

### Responsive

Three breakpoints, handled by the primitive:

- **≥ 900px**: full layout.
- **600–900px**: `compact` — tighter spacing, shorter labels (primitives accept `labelShort` alongside `label`).
- **< 600px**: `stacked` — horizontal flows become vertical; grids become single-column. Multi-column primitives declare a `stackAt` prop.

No figure may cause horizontal scroll at 360px. Checked at Gate 2 and per-lesson.

### Accessibility

- `role="img"` with `aria-labelledby` pointing at `<title>` and `<desc>`.
- Interactive primitives: controls are real `<input>`/`<button>` elements in HTML **outside** the SVG, never SVG-only click targets. Keyboard reachable, visibly focused, `aria-label` in Persian.
- Interactive primitives announce changes via a `aria-live="polite"` region holding the current value in Persian.

---

## The primitives

### 1. `ConceptMap` — the master map

**Used by**: the development gallery. Production navigation uses `shell/TocMap.astro` with the same concept data; the map is not repeated inside lessons or Part dividers.

```ts
interface ConceptMapProps extends FigureBase {
  highlight: 'none' | 'all' | ZoneId;    // ZoneId = 'overview'|'agents'|'model'|'build'|'run'|'decide'
  revealZones?: boolean;                 // draw zones in sequence in the gallery
  clickable?: boolean;                   // node → definition readout
}
```

Nodes, edges, and zones live in `src/data/concept-map.ts` — **one source of truth for navigation and the gallery**. Node labels come from `glossary.yml` (`short` form) so the map can never drift from the glossary.

- `highlight: ZoneId` → that zone at full opacity, others at 0.2, edges crossing the boundary dashed.
- `revealZones`: zones draw right-to-left, then edges fade in. ~3 s.
- `clickable`: selecting a node shows `def_fa` and its lesson number in the readout below the map.
- Layout coordinates are **hand-tuned and committed**, not force-directed at runtime. Determinism matters more than elegance across 8 appearances.

**Risk note**: a 54-node map is the hardest thing to make legible at 360px. The `stacked` variant drops edges and shows zones as a vertical list of grouped chips. Prototype this early — it is on the critical path for Gate 1.

---

### 2. `SequenceFlow` — sequence diagrams

**Used by**: 2.2, 5.3.

```ts
interface SequenceFlowProps extends FigureBase {
  actors: { id: string; label: string; labelShort?: string; sublabel?: string; kind?: 'user'|'system'|'model'|'tool'|'store' }[];
  steps: {
    from: string; to: string;
    label: string;
    mono?: boolean;              // Latin/code label → LTR tspan
    dashed?: boolean;            // return/response
    note?: string;               // annotation beside the arrow
    tone?: 'normal'|'danger'|'ok';
    pause?: string;              // label for a "waiting" bracket on the `from` actor's lifeline
  }[];
  stackAt?: number;
}
```

- **First actor is rightmost.** Arrows travel right→left for "forward" messages.
- Production sequences have three participants: **user, agent, model**. The agent lane represents the assistant program, including its harness and tools. The harness is not a fourth participant, and a file is not an actor.
- Actor heads have a kind-specific icon and an optional role subtitle; lifelines are dashed verticals. The agent lane has a light background to locate execution visually.
- Messages are numbered in chronological order. Both model outputs (tool requests and final text) return to the agent; only the agent presents the reply to the user.
- `from === to` renders a local-action box with a self-loop on that actor's lifeline. Use it for the agent checking permissions, reading a file, or rejecting a request; none of these are model actions.
- Steps reveal in order using the shared reduced-motion-aware styles. Return messages retain their dashed stroke.
- `pause` spans the gap from the outgoing message until the next incoming message on that lifeline. In 2.2 and 5.3, the first model call has ended; the agent finishes its local work before making a new call with the tool result.
- `≤ 800px`: show role headers and numbered message cards rather than shrinking the labels. Local actions say «داخل ایجنت», not «از ایجنت به ایجنت». The desktop version remains the print view.

---

### 3. `FlowPipeline` — staged left/right flows

**Used by**: 3.4 (three training stages), 4.4 (RAG, two phases), 5.1 (system architecture).

```ts
interface FlowPipelineProps extends FigureBase {
  phases?: { id: string; label: string; stages: Stage[] }[];   // 4.4 uses 2 phases
  stages?: Stage[];                                            // single-phase form
  connections?: { from: string; to: string; label?: string; dashed?: boolean }[];
  lanes?: { id: string; label: string }[];                      // 5.1: group stages into lanes
}
interface Stage {
  id: string; label: string; sublabel?: string;
  icon?: IconName;
  tone?: 'normal'|'accent'|'muted';
  lane?: string;
  lessonRef?: string;    // "2.2" → small back-reference badge
}
```

The workhorse — three structurally different figures from one component.

- Flows right→left. Connections are orthogonal elbows, not curves.
- Stages reveal in order, then connections draw.
- `lessonRef` renders a small badge («۲.۲»). Used in 5.1 so every box points back to where the reader met it — this is what makes 5.1 feel like a synthesis rather than a new diagram.
- Phases are stacked vertically with a labeled divider; 4.4 animates phase 1 fully, pauses ~600 ms, then phase 2.
- `< 600px`: vertical flow, connections become short vertical arrows.

---

### 4. `LoopTrace` — iteration and loops

**Used by**: 2.5 (memory), 2.7 (coding agent loop).

```ts
interface LoopTraceProps extends FigureBase {
  mode: 'loop' | 'trace';
  steps: { id: string; label: string; detail?: string; mono?: boolean; outcome?: 'ok'|'fail'|'pending' }[];
  loopBack?: { from: string; to: string; label?: string };
  store?: { label: string; reads: string[]; writes: string[] };   // 2.5
  passes?: { label: string; steps: string[] }[];                  // 2.5: two side-by-side passes
}
```

- `mode: 'loop'` → circular/rounded-rectangle arrangement with a return arrow.
- `mode: 'trace'` → vertical list of executed steps with outcome markers. Used in 2.7 for the read→edit→test→fail→edit→pass trace; the `fail` step is `--fig-danger`, the final `ok` is `--fig-ok`.
- `store` draws a cylinder beside the loop with read/write arrows (2.5).
- `passes` renders two traces side by side sharing one legend — the "without memory / with memory" comparison.

---

### 5. `SplitCompare` — two things, side by side

**Used by**: 2.1 (chatbot vs agent), 2.4 (tool vs skill).

```ts
interface SplitCompareProps extends FigureBase {
  left:  Side;   // = the RIGHT-hand panel in RTL. Named by reading order, not by screen position.
  right: Side;
  sharedInput?: string;   // one input feeding both panels
  verdict?: string;       // one line under the split
}
interface Side {
  label: string;
  steps: { label: string; mono?: boolean }[];
  tone?: 'normal'|'accent';
  badge?: string;
}
```

- **Naming convention**: `left` is first in reading order, so in RTL it renders on the **right**. Documented here because it has already confused people.
- `sharedInput` draws one box at the top branching into both panels — essential for 2.1, where the identical question produces structurally different behavior.
- Both panels animate **simultaneously**, not sequentially. The asymmetry must be *seen*, not remembered.
- `< 600px`: stacks vertically, `left` first, with a «در مقابل» divider.

---

### 6. `CardGrid` — sets of discrete items

**Used by**: 1.1 (capabilities), 1.3 (scenario requirements), 3.6 (failure modes), 6.3 (team roles).

```ts
interface CardGridProps extends FigureBase {
  columns: 2 | 3 | 4;
  cards: {
    label: string; body?: string;
    example?: string;              // rendered in a distinct "for instance" style
    icon?: IconName;
    tone?: 'normal'|'muted'|'danger'|'ok'|'new';
    badge?: string;                // e.g. the Part that covers it (1.3), or «تازه» (6.3)
  }[];
  groups?: { label: string; cardIds: number[] }[];   // 1.1: "can" vs "cannot yet"
  stackAt?: number;
}
```

- **HTML/CSS grid, not SVG.** Text-heavy, no connections — SVG would only hurt text reflow and selectability.
- Cards reveal staggered, 80 ms apart, in reading order (right→left, then down).
- `groups` adds labeled sections — 1.1 uses it for the four "can" cards and three dimmed "not yet" cards.
- `tone: 'new'` (6.3) adds an accent border for genuinely new roles.
- Four lessons, one component: the highest-leverage primitive in the library.

---

### 7. `LayerStack` — stacked bands

**Used by**: 1.2 (product / harness / model), 4.2 (prompt layers).

```ts
interface LayerStackProps extends FigureBase {
  layers: { label: string; sublabel?: string; examples?: string[]; tone?: Tone }[];
  direction: 'top-down' | 'bottom-up';
  pointer?: { layer: number; label: string };
  outputs?: string[];     // 4.2: output quality shown beside each layer
}
```

Neither use is interactive: 4.2's accumulating layers already show the output improving, so a control would add nothing the animation does not.

- 1.2: three bands revealing top-down, with `pointer` on the top band saying «وقتی می‌گوییم هوش مصنوعی، معمولاً منظورمان این است».
- 4.2: four layers accumulating, each with its resulting output in `outputs` — the reader sees output quality improve as layers are added.

---

### 8. `StackedBar` — the context window

**Used by**: 3.3, 4.3. Deliberately reused so 4.3 reads as "filling the bar from 3.3" (PLAN, curriculum §reused figures).

```ts
interface StackedBarProps extends FigureBase {
  capacity: number;                // token budget
  segments: { label: string; tokens: number; tone?: Tone; source?: string }[];
  overflow?: { label: string; tokens: number };   // 3.3: what falls out
  interactive?: boolean;           // 3.3: a slider changing document size
  showCounts?: boolean;
}
```

- A horizontal bar, filling **right→left**, with stacked labeled segments.
- `overflow` renders beyond the capacity edge in `--fig-danger` with a visible break, then the oldest segment detaches and fades — the hard edge made literal.
- 3.3's one control: a slider for document size. Dragging past capacity shows history being evicted. This is the one thing a static figure cannot teach about context windows.
- 4.3 adds `source` labels showing where each segment came from.

---

### 9. `TokenStrip` — text as tokens

**Used by**: 3.2.

```ts
interface TokenStripProps extends FigureBase {
  samples: { lang: 'fa' | 'en'; text: string; tokens: string[]; flow: 'rtl'|'ltr' }[];
  showCounts: boolean;
  interactive?: boolean;        // 3.2: a text input
  compare?: boolean;            // show the two samples' counts against each other
}
```

- Tokens are chips, alternating two tints so boundaries are unmissable.
- Both samples shown with their counts, and a comparison line: «همان جمله، در فارسی ۲.۳ برابر توکن».
- **Tokenization is precomputed at build time** from a committed fixture (`src/data/figures/tokens.ts`). No tokenizer library in the bundle.
- The one control: a short text input. Typed text is tokenized by a **small committed heuristic** (whitespace + punctuation + known Persian affixes), clearly labeled «تقریبی» (approximate). Honesty over precision; the teaching point is relative cost, not exact counts.

---

### 10. `ProbabilityBars` — next-token prediction

**Used by**: 3.1, 3.5. 3.5 reuses 3.1's visual language on purpose — hallucination must *look like* prediction (curriculum §reused figures).

```ts
interface ProbabilityBarsProps extends FigureBase {
  prefix: string;
  steps: {
    candidates: { token: string; p: number }[];
    chosen: number;
    note?: string;
    tone?: 'normal'|'danger';     // 3.5: marks the fluent-but-false choice
  }[];
  interactive?: boolean;          // 3.1: temperature slider
  autoAdvanceMs?: number;
}
```

- Sentence builds above; candidate bars below, sorted by probability, Persian tokens right-aligned.
- Since the Context Lens work, the sentence is framed as the model's input: a «ورودی مدل (تا اینجا)» header, a green underline on the user's prefix, a purple underline on the model's chosen words, and a caret at the end.
- Chosen candidate highlights, then flies up into the sentence. ~500 ms per step.
- 3.1's control: a temperature slider changing the distribution's flatness, with the chosen token changing accordingly. Connects a number in an API call (4.1) to visible behavior.
- 3.5 sets `tone: 'danger'` on the step where the invented order number is chosen, with a `note` reading «این ادامه روان است، اما هیچ واقعیتی پشتش نیست».

---

### 11. `GraphMorph` — before/after topology

**Used by**: 2.3 (N×M mesh → MCP hub).

```ts
interface GraphMorphProps extends FigureBase {
  before: { nodes: Node[]; edges: Edge[]; label: string; caption?: string };
  after:  { nodes: Node[]; edges: Edge[]; label: string; caption?: string };
  hub?: Node;
  morphMs?: number;
}
```

- Renders `before`, holds ~800 ms, then edges retract and reroute through `hub`.
- Edge counts are labeled numerically on both sides (`۱۲ اتصال` → `۷ اتصال`). The number is the argument; without it the morph is just a pretty animation.
- Reduced motion: both states side by side, labeled, with the counts.

---

### 12. `BranchDiagram` — decisions

**Used by**: 2.6 (workflow vs agent), 6.2 (build vs buy).

```ts
interface BranchDiagramProps extends FigureBase {
  question: string;
  criteria: { label: string; hint?: string }[];
  branches: { label: string; outcome: string; traits: string[]; tone?: Tone }[];
  interactive?: boolean;          // 2.6, 6.2: toggle the criteria, highlight the outcome
}
```

- Question at top, criteria as a numbered list, branches below.
- The control (both lessons): two-way toggles for each criterion that light the resulting branch. Genuinely useful — the reader tests their *own* situation. This is the best justification for interactivity in the document.
- Reduced motion / no-JS: all branches shown with their criteria listed statically.

---

### 13. `ExplodedView` — anatomy

**Used by**: 2.8 (what an agent is made of). Part 2's synthesis figure.

```ts
interface ExplodedViewProps extends FigureBase {
  whole: { label: string };
  parts: { id: string; label: string; role: string; lessonRef: string; icon?: IconName }[];
  assembleMs?: number;
}
```

- Parts start scattered, then converge into the labeled whole. Each keeps a leader line to its label and `lessonRef` badge.
- Reduced motion: assembled state with all labels and leader lines.

---

### 14. `Ladder` — ordered options by cost

**Used by**: 4.5 (prompt → context → RAG → fine-tune), 4.7 (iceberg: demo vs the rest).

```ts
interface LadderProps extends FigureBase {
  orientation: 'up' | 'down';          // 4.5 up (cost), 4.7 down (hidden work)
  axisLabel?: string;
  rungs: { label: string; fixes?: string; doesNotFix?: string; cost?: string; tone?: Tone }[];
  waterline?: number;                  // 4.7: index where the iceberg's surface sits
  marker?: { rung: number; label: string };
  interactive?: boolean;               // 4.5: "what is your problem?" toggle moves the marker
}
```

- 4.5: four rungs ascending, each stating what it fixes and what it does not. Both halves are required — "what it does not fix" is the lesson.
- 4.7: `waterline: 1` draws a surface line; the rung above is the demo, everything below reveals downward as the hidden work.

---

### 15. `Matrix2x2` — positioning

**Used by**: 6.1 (value matrix).

```ts
interface Matrix2x2Props extends FigureBase {
  xAxis: { label: string; low: string; high: string };
  yAxis: { label: string; low: string; high: string };
  quadrants: { label: string; tone?: Tone; verdict?: string }[];   // 4, reading order from top-right in RTL
  points: { label: string; x: number; y: number; quadrant: number }[];
}
```

- **In RTL the origin is bottom-right**; the x axis increases leftward. Axis labels and arrowheads must follow. Easy to get wrong — check at Gate 2.
- Points fade in grouped by quadrant, starting with «از اینجا شروع کنید», so the reader's eye lands on the actionable quadrant first.

---

### 16. `AnnotatedCode` — code with Persian annotations

**Used by**: 4.1 (API call anatomy).

```ts
interface AnnotatedCodeProps extends FigureBase {
  blocks: {
    title: string;                      // «درخواست» / «پاسخ»
    lang: 'json' | 'python' | 'http';
    code: string;
    annotations: { line: number; label: string; detail?: string }[];
  }[];
}
```

- HTML + Shiki, **not SVG** — syntax highlighting and text selection matter more than drawing.
- Code block is an LTR island (PLAN §5.2): `direction: ltr`, `unicode-bidi: isolate`, Latin digits, mono font.
- Annotations sit in a Persian RTL column beside the code, connected by CSS-drawn leader lines. Annotations reveal in sequence.
- `< 600px`: annotations move below the code as a numbered list, with matching numbers in the gutter.

---

### 17. `DataTable` — scorecards and traces

**Used by**: 4.6 (eval scorecard), 5.4 (request trace).

```ts
interface DataTableProps extends FigureBase {
  columns: { key: string; label: string; align?: 'start'|'end'|'center'; mono?: boolean; digits?: 'fa'|'latin' }[];
  rows: Record<string, string | number>[];
  rowTone?: (row: Record<string, unknown>) => Tone | undefined;
  summary?: { label: string; value: string; tone?: Tone }[];
  highlightNote?: string;
}
```

- Real `<table>`. Accessible, selectable, printable.
- Per-column `digits` opt-out (PLAN §5.4): measurements use Latin digits.
- Rows fill in staggered, as if a run were in progress.
- 4.6's point lives in `highlightNote`: average score improved, but one case regressed — a red row beside a green summary. The figure must make that contradiction visible, because the lesson is "the average hides the regression".

---

### 18. `TradeoffTriangle` — three-way tradeoffs

**Used by**: 3.7 (quality / speed / cost).

```ts
interface TradeoffTriangleProps extends FigureBase {
  vertices: [string, string, string];
  options: { label: string; weights: [number, number, number]; note?: string }[];
}
```

- Triangle with three labeled vertices; each option is a plotted point with a translucent pull-region toward its strong vertices.
- Options reveal one at a time with their `note`, so each archetype is read before the next appears.

---

### 19. `RoadStrip` — the route

**Used by**: the development gallery only; the separate reading-guide lesson was removed.

```ts
interface RoadStripProps extends FigureBase {
  stops: { label: string; promise: string; zone: ZoneId }[];
}
```

- A path with six markers, filling right→left. Colors match the progress rail's Part segments. Retained as a reusable gallery primitive, not a production lesson figure.

---

### 20. `CostCalculator` — the one real calculator

**Used by**: 5.2.

```ts
interface CostCalculatorProps extends FigureBase {
  defaults: { tokensPerRequest: number; requestsPerDay: number; tier: string; cacheHitRate: number };
  tiers: { id: string; label: string; inputPrice: number; outputPrice: number }[];   // per 1M tokens
  currency: 'usd';
}
```

- Three sliders (requests/day, context size, cache hit rate) + a model-tier toggle. A live monthly total, and a bar showing where the money goes.
- The document's most interactive element, justified: cost *sensitivity* — that context size and caching dominate — cannot be taught by a static number.
- Prices come from a committed fixture with a visible date stamp and an explicit «قیمت‌ها نمونه‌اند و تغییر می‌کنند» note. Never implies live pricing.
- No-JS / reduced motion: a static three-row table of representative scenarios.


---

### 21. `ContextLens` — the text the model sees

**Used by**: 20 lessons (see `PLAN-CONTEXT.md` §6). **Secondary figure**, not the lesson's primary figure.

```ts
interface ContextLensProps {
  id: string;       // fig-P-N-ctx
  lens: string;     // key in src/data/context/lenses.ts
  caption: string;  // the lens's point, not a description
  desc: string;     // author-written, >= 25 chars
}
```

Content lives in `src/data/context/lenses.ts`; blocks in `blocks.ts`; kinds in `kinds.ts`. Layouts: `steps`, `compare`, `static`, `mapping`. All use one reading view, with no labeled/raw toggle. Every frame is server-rendered; no-JS, print and reduced-motion show all frames. Stepper buttons navigate sequences; example outputs are shown directly, with no quizzes or answer gating.

- Blocks: one short Persian kind label and the actual body, with subtle dividers. Source authors remain in assistive text. No actor strip, icon rail, role chips, or per-block token counts. JSON remains LTR and wraps; mapping retains the actual `messages` JSON.
- States: `new`, `changed`, `gone`, `evicted`, `danger`, `dim`.
- Outputs appear immediately in a separate area labelled ادامهٔ مدل; no typing animation. Outside actions use a compact note, separate from the input. Token counts are limited to capacity meters and the Lab total.
- Footer: «مدل فقط ادامهٔ متنی را می‌نویسد که جلویش گذاشته‌اند.» Plus a short simplification/authored-output disclaimer.
- The ConceptMap's `context` hub is the map-level view; the lens is the text-level view.
- Examples use the working environment of a coding assistant like OpenCode or Hermes: project files, requests, guides, changes, command output, and review. Small fixtures are independent illustrations, not one mandatory bug story. `readFile`, `editFile`, and `runCommand` are teaching names; requests are never shown as executed work without actual result blocks.

### 22. `ContextLab` — build a context

**Used by**: 4.3 only. A secondary figure. Five checkboxes plus three presets; a deterministic authored answer table; no model is called. No-JS and print show the default state and a three-preset table.

The toggles represent project instructions, remembered file/test command, tools, a repair skill, and the login guide. With tools and a target path, the authored read/test evidence is explicitly shown. Removing that evidence produces an honest request for information, not fabricated code contents or a claim that tests passed. The output is a proposed repair plan; nothing executes in the document.

Props: `id`, `caption`, `desc`. Data in `src/data/context/lab.ts`.

---

## Icons

One inline `<symbol>` sprite, ~14 icons, defined once in `Book.astro` and referenced with `<use>`. Stroke-only, 24×24, `currentColor`.

`user`, `bot`, `model`, `tool`, `database`, `document`, `memory`, `shield`, `clock`, `coin`, `check`, `x`, `alert`, `arrow`.

Icons are always paired with a text label. No icon-only meaning.

---

## Current primitive → lesson map

| Primitive | Lessons | Count |
|---|---|---|
| `ConceptMap` | Development gallery only; production navigation uses `shell/TocMap.astro` and the same map data | 0 inline |
| `CardGrid` | 1.1, 1.3, 3.2, 4.4, 5.6 | 5 |
| `FlowPipeline` | 3.3, 5.4, 6.4, 6.10 | 4 |
| `SequenceFlow` | 2.2, 6.8 | 2 |
| `LoopTrace` | 2.4, 2.6, 4.6 | 3 |
| `SplitCompare` | 2.1, 2.3, 3.5 | 3 |
| `LayerStack` | 1.2, 3.4 | 2 |
| `StackedBar` | 5.3, 6.2 | 2 |
| `ProbabilityBars` | 5.1, 5.5 | 2 |
| `BranchDiagram` | 2.5, 4.3, 6.11 | 3 |
| `Ladder` | 4.2, 6.5 | 2 |
| `DataTable` | 4.1, 4.5, 6.6, 6.9 | 4 |
| `TokenStrip` | 5.2 | 1 |
| `GraphMorph` | 6.3 | 1 |
| `ExplodedView` | 2.7 | 1 |
| `Matrix2x2` | 3.1 | 1 |
| `AnnotatedCode` | 6.1 | 1 |
| `TradeoffTriangle` | 5.7 | 1 |
| `RoadStrip` | Development gallery only | 0 inline |
| `CostCalculator` | 6.7 | 1 |
| `ConversationExample` | 3.6 | 1 |
| `ContextLens` | Hosts listed in `curriculum.md` and `lenses.ts` | 20 (secondary) |
| `ContextLab` | 6.2 | 1 (secondary) |
| | **Total primary** | **40** |
| | **Total context** | **21** |

Build order: `CardGrid`, `FlowPipeline`, `SequenceFlow`, `SplitCompare`, `LayerStack`, `StackedBar`, `ProbabilityBars`, `LoopTrace`, `BranchDiagram`, `Ladder`, `DataTable`, `ConceptMap`, then the six single-use primitives, then `ContextLens` and `ContextLab`. Highest reuse first, so content authoring on Part 1–2 can begin before the library is finished.
