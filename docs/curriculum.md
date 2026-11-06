# Curriculum — the 35-lesson skeleton

This is the **authoring contract**. One row per lesson. An agent authoring a lesson needs this file, `terminology.md`, `glossary.yml`, and `figures.md` — nothing else.

Column meanings:

- **Objective** — what the reader can do afterwards. Written as a capability, not a topic.
- **Figure** — the primary primitive from `figures.md` plus what it shows. Exactly one primary figure per lesson; a Context Lens may be a second, secondary figure.
- **Terms** — terms whose `not_before` equals this lesson. First use here, glossed via `<Term>`.
- **Words** — Persian word budget for prose (hook + body + takeaway, excluding figure labels and asides). ±10%.
- **✋** — marked lessons may carry **one** optional control on the primary figure. Total: 8 of 35. Adding a ninth requires removing one. Lens controls are separate and bounded.
- **🛍** — the retail running example appears in this lesson.
- **🔎** — this lesson has a Context Lens (a secondary figure; see `PLAN-CONTEXT.md` and the table below). The **Lens** column names its key.

Lesson files: `src/content/lessons/{part}-{n}-{slug}.mdx`.

---

## Frontmatter schema

Validated by `src/content.config.ts` (Zod) and `scripts/check-skeleton.ts`.

```yaml
---
id: "2.3"                        # string, "P.N", unique, ordered
part: 2                          # 1..6
slug: mcp-standard-socket
title_fa: "MCP: پریز استاندارد ابزارها"
objective_fa: "خواننده می‌تواند توضیح دهد چرا MCP لازم شد."
figure:
  component: SequenceFlow        # must exist in src/components/figures/
  id: fig-2-3
  caption_fa: "..."              # the takeaway, not a description
  interactive: false             # true only for the 8 ✋ lessons
terms_introduced: [mcp]          # ids from glossary.yml
example: retail                  # retail | none
words: 230                       # budget
has_aside: true
status: draft                    # draft | reviewed | confirmed
---
```

---

# Part 1 — تصویر کلی (The Picture)

**Zone**: `overview`. **Lessons**: 5. **Purpose**: by the end, the reader knows what AI does today, owns a map of every word in the document, and knows the one example we will follow.

| # | Lesson | Objective | Figure | Terms | Words | Flags | Lens |
|---|---|---|---|---|---|---|---|
| 1.1 | هوش مصنوعی امروز واقعاً چه کاری می‌کند | Name the four things today's AI is actually good at, and three it is not. Deflates both hype and dismissal before any vocabulary arrives. | `CardGrid` — 4 capability cards (writing/summarizing, answering from documents, writing code, ordering multi-step work) each with a concrete one-line example; then 3 dimmed "not yet" cards (guaranteed accuracy, true novelty, acting unsupervised). Cards fade in staggered. | — | 240 | | — |
| 1.2 | **یک نقشه برای همهٔ واژه‌ها** | Locate any term in the document on a single map. **The spine of the whole document (PLAN §2.1).** | `ConceptMap` — the master map. 53 nodes in 5 zones: ایجنت‌ها / مدل / ساختن / اجرا / تصمیم (49 glossary terms + 4 concepts). Zones draw in sequence, right to left, then edges fade in. This exact SVG reappears 7 more times. | — (map node labels are exempt from `not_before`) | 200 | | — |
| 1.3 | سه لایه: مدل، چارچوب اجرا، محصول | Distinguish "the model" from "the thing you use". The single most common confusion among non-technical readers, cleared early. | `LayerStack` — three stacked bands: محصول (ChatGPT, Copilot) / چارچوب اجرا / مدل. Animated top-down. A pointer shows "when people say 'AI', they usually mean the top band". | harness, llm, model | 260 | 🔎 | text-loop |
| 1.4 | **مثالی که تا آخر همراه ماست** | Hold one concrete scenario to attach everything else to. Introduces the retail assistant (PLAN §2.2). | `CardGrid` — the online store, the customer, the question «سفارش من کجاست؟», and the five things a good answer requires. Each requirement fades in and is tagged with the Part that will cover it. | — | 220 | 🛍 🔎 | slots |
| 1.5 | این سند چطور خوانده می‌شود | Know the route and that scrolling is the only required action. | `RoadStrip` — six Part markers along a path with a one-line promise each. Fills as it reveals; visually echoes the progress rail. | — | 150 | | — |

---

# Part 2 — ایجنت‌ها: لایهٔ رویی (Agents: the top layer)

**Zone**: `agents`. **Lessons**: 8. **Purpose**: the layer the reader actually touches. Deliberately placed *before* the model — top-down means starting where their experience already is.

| # | Lesson | Objective | Figure | Terms | Words | Flags | Lens |
|---|---|---|---|---|---|---|---|
| 2.1 | از چت‌بات به ایجنت | State the one difference: a chatbot answers, an agent *acts*. | `SplitCompare` — left: chatbot (one question → one answer). Right: agent (question → think → act → observe → repeat → answer). Both animate simultaneously so the asymmetry is visible, not described. | agent, chatbot | 240 | 🛍 | — |
| 2.2 | ابزارها: چطور مدل کاری انجام می‌دهد | Explain that the model never executes anything — it only *requests*. Kills the "the AI did it itself" misconception. | `SequenceFlow` — user → agent → model ("call `getOrder`") → harness executes → tool → result back → answer. The model's box visibly *stops* while the harness runs the tool. | tool-calling, function-calling | 280 | 🛍 🔎 | tool-call |
| 2.3 | MCP: پریز استاندارد ابزارها | Explain why a standard was needed: N tools × M apps = N×M adapters, versus N+M with a protocol. | `GraphMorph` — tangled N×M mesh morphs into a hub-and-spoke through a single MCP node. One animated morph, no controls. | mcp | 250 | 🔎 | mcp-fills-tools |
| 2.4 | مهارت‌ها: دستورهای بسته‌بندی‌شده | Distinguish a skill (instructions, loaded on demand) from a tool (code that runs). | `SplitCompare` — tool = «کاری انجام می‌دهد» (a running function) vs skill = «می‌گوید چطور انجام شود» (a folder of instructions). Same scenario, two mechanisms. | skill | 230 | 🔎 | skill-loading |
| 2.5 | حافظه: چرا مدل شما را یادش نمی‌آید | Explain that the model is stateless and "memory" is something the surrounding system does. | `LoopTrace` — two passes side by side. Without memory: each turn starts empty. With memory: a store is read before and written after each turn. The *same* model box in both. | memory, stateless | 270 | 🛍 🔎 | memory-facts |
| 2.6 | ورک‌فلو یا ایجنت؟ | Choose between a fixed pipeline and a free-running agent, by criterion not by fashion. Prevents the expensive default of "make everything an agent". | `BranchDiagram` — fixed workflow (predictable steps, cheap, auditable) vs agent loop (flexible, costly, variable). A decision node lists the three criteria: does the path vary? / is a mistake expensive? / is review needed? | workflow | 290 | ✋ | — |
| 2.7 | ایجنت‌های برنامه‌نویسی | Explain why coding was the first domain agents genuinely worked in: cheap verification. Tests pass or fail — an unambiguous reward signal most domains lack. | `LoopTrace` — a real-shaped trace: read file → edit → run tests → fail → read error → edit → tests pass. Steps appear one per beat. | — | 260 | 🔎 | tests-as-text |
| 2.8 | یک ایجنت از چه ساخته شده | Assemble the five pieces from 2.1–2.7 into one anatomy the reader can hold. **Part 2's synthesis.** | `ExplodedView` — an agent opened up: model / tools / skills / memory / loop, each labeled and linked back to its lesson number. Assembles piece by piece into the whole. | — | 230 | 🛍 🔎 | anatomy-recap |

---

# Part 3 — جعبه را باز کنیم (Opening the box)

**Zone**: `model`. **Lessons**: 7. **Purpose**: now that the reader knows what the model is *used for*, explain what it *is*. Enough mechanism to reason about failure — no mathematics.

| # | Lesson | Objective | Figure | Terms | Words | Flags | Lens |
|---|---|---|---|---|---|---|---|
| 3.1 | مدل زبانی چه کار می‌کند: حدس کلمهٔ بعدی | Internalize the single mechanism underneath everything: next-token prediction. | `ProbabilityBars` — a Persian sentence builds word by word; at each step a bar chart of candidate next tokens with probabilities, the top one chosen, sentence extends. Loops twice then rests. | inference | 270 | ✋ | — |
| 3.2 | توکن: واحد کار مدل | Explain tokens as the billing and limit unit, and why Persian costs more per sentence than English. | `TokenStrip` — the same sentence in Persian and English, split into colored token chips, counts compared. Persian-specific and genuinely useful here. | token | 260 | ✋ | — |
| 3.3 | کانتکست: هر چیزی که مدل می‌بیند | Explain that the model sees one bag of text per call — system prompt, history, documents, question — and that the bag has a hard edge. | `StackedBar` — a bar filling with stacked colored segments (دستور سیستم / تاریخچه / اسناد / پرسش). Fills past the edge; the oldest history visibly falls out. | context-window, system-prompt | 280 | ✋ 🔎 | context-fills |
| 3.4 | مدل چطور ساخته می‌شود: سه مرحله | Separate pre-training / fine-tuning / alignment, and connect each to an observable behavior. | `FlowPipeline` — three stages with input, what changes, and cost order of magnitude. Flows right to left. | training, pretraining, fine-tuning, alignment, rlhf | 300 | 🔎 | learned-vs-given |
| 3.5 | **توهم: چرا مدل چیزی از خودش می‌سازد** | Explain hallucination as a *direct consequence* of 3.1, not a bug to be patched. The most important lesson in Part 3. | `ProbabilityBars` — the retail assistant invents order «۸۸۴۳۲۱». The next-token view from 3.1 replays, showing a *fluent* continuation chosen with no fact behind it. Deliberately reuses 3.1's visual language. | hallucination | 300 | 🛍 🔎 | no-fact-fluent-guess |
| 3.6 | مدل‌ها در چه چیزهایی ضعیف‌اند | Predict where a model will fail before deploying it: counting, arithmetic, recent events, long chains of reasoning, its own confidence. | `CardGrid` — five failure modes, each with a one-line example of the wrong output and the one-line reason. Reveals staggered. | — | 290 | | — |
| 3.7 | استدلال، و چرا مدل‌ها متفاوتند | Explain "reasoning" models as spending more compute at answer time, and why three models differ in cost, speed, and quality. | `TradeoffTriangle` — کیفیت / سرعت / هزینه with three model archetypes plotted. A travelling marker shows you cannot optimize all three. | reasoning, benchmark | 280 | 🔎 | thinking-text |

---

# Part 4 — ساختن با LLM (Building with LLMs)

**Zone**: `build`. **Lessons**: 7. **Purpose**: how a team actually goes from a model to a working feature. Code appears here, always illustrative and always explained in prose.

| # | Lesson | Objective | Figure | Terms | Words | Flags | Lens |
|---|---|---|---|---|---|---|---|
| 4.1 | یک فراخوانی API از نزدیک | Demystify "calling an AI": one HTTP request in, one response out, stateless. | `AnnotatedCode` — an annotated request (model, messages, temperature) and response (content, `finish_reason`, usage). LTR/Latin code island, Persian annotation arrows pointing in. | api, temperature | 270 | 🔎 | messages-array |
| 4.2 | پرامپت: دستور دادن مؤثر | Apply four levers — role, task, constraints, examples — and see each one change the output. | `LayerStack` — a weak prompt gains four layers, with the output visibly improving at each. Same request, four versions. | prompt, few-shot | 290 | 🛍 | — |
| 4.3 | کانتکست: مهم‌تر از پرامپت | Reframe the real job as *assembling the right context*, not writing clever prose. The conceptual hinge of Part 4. | `StackedBar` — four sources (دستور سیستم / تاریخچه / اسناد بازیابی‌شده / پرسش) packed into one context window. Explicitly reuses 3.3's bar. | context-engineering | 280 | 🛍 🔎 | lab (Lab) |
| 4.4 | **RAG: پاسخ از اسناد شما** | Explain RAG end to end: index once, then retrieve → augment → generate per question. Directly answers the hallucination problem from 3.5. | `FlowPipeline` — two phases. Offline: documents → chunks → embeddings → vector store. Online: question → embed → top-k → context → answer. Animates offline first, then online. | rag, embedding, chunking, vector-database, semantic-search | 320 | 🛍 🔎 | rag-paste |
| 4.5 | چه زمانی فاین‌تیون، چه زمانی RAG | Choose between prompting, RAG, and fine-tuning using the real criterion: knowledge vs behavior. Prevents the most expensive common mistake. | `Ladder` — four rungs by cost and effort: prompt → context → RAG → fine-tune. Each rung states what it fixes and what it does not. A marker climbs. | — (فاین‌تیونینگ در ۳.۴ معرفی شده) | 300 | ✋ 🔎 | where-it-changes |
| 4.6 | ارزیابی: چطور بفهمیم بهتر شد | Explain why "it looks better" is not evidence, and what a minimum eval set looks like. | `DataTable` — a 20-case test set runs against two prompt versions; a scorecard fills in; one regression is highlighted in red despite a higher average. | eval, regression | 300 | 🛍 | — |
| 4.7 | از نمونه به محصول | Set expectations: the demo is ~20% of the work. Names the remaining 80% concretely. | `Ladder` — above water: the demo. Below: evals, guardrails, observability, cost control, error handling, data plumbing, review. Reveals downward. | — | 250 | | — |

---

# Part 5 — در عمل (Production)

**Zone**: `run`. **Lessons**: 4. **Purpose**: what breaks, what it costs, how it is attacked. Written for the person who must sign off, not the person on call.

| # | Lesson | Objective | Figure | Terms | Words | Flags | Lens |
|---|---|---|---|---|---|---|---|
| 5.1 | معماری یک سیستم واقعی | Read a real system diagram and name each box. Assembles everything from Parts 2–4 into one picture. | `FlowPipeline` — client → gateway (auth, rate limit) → orchestrator → {model provider, vector store, tools/APIs, memory} → logging/evals. Builds up layer by layer, each box labeled with the lesson that introduced it. | orchestrator, gateway | 300 | 🛍 🔎 | who-writes-what |
| 5.2 | هزینه: پول کجا می‌رود | Estimate the cost of a feature before building it, and name the three levers that cut it. | `CostCalculator` — tokens per request × requests per day × price, with model tier, context size, and caching as sliders. Live total. **The document's one real calculator** — numbers are the point here, and a static figure cannot teach cost sensitivity. | cost, caching | 300 | 🛍 ✋ 🔎 | cache-prefix |
| 5.3 | امنیت: تزریق پرامپت و نشت داده | Explain why prompt injection cannot be fully fixed, only contained, and name the three containments. | `SequenceFlow` — a malicious instruction hidden in a retrieved document reaches the context and is obeyed. Then three guardrails are added and the attack is shown failing. Two-pass animation. | prompt-injection, guardrail, data-leakage, least-privilege | 320 | 🛍 🔎 | injection |
| 5.4 | اتکاپذیری و مشاهده‌پذیری | Name the four non-deterministic failure modes and the minimum instrumentation for each. | `DataTable` — a trace of one request with latency, tokens, tool calls, and score; one failing request highlighted. Static-but-animated, no controls. | observability, tracing, latency, non-determinism | 290 | 🔎 | read-the-trace |

---

# Part 6 — رهبری (Leading)

**Zone**: `decide`. **Lessons**: 4. **Purpose**: the decisions the primary audience actually owns. Ends by closing the map opened in 1.2.

| # | Lesson | Objective | Figure | Terms | Words | Flags | Lens |
|---|---|---|---|---|---|---|---|
| 6.1 | کجا ارزش واقعی هست | Pick a first use case using two axes: tolerance for error × volume of repetitive work. | `Matrix2x2` — 2×2 with ~10 real use cases plotted (support triage, document search, code review, contract review, forecasting…). Quadrants labeled «از اینجا شروع کنید» / «بعداً» / «نه». Points fade in by quadrant. | — | 290 | | — |
| 6.2 | بسازیم یا بخریم | Apply a four-question test instead of defaulting to either answer. | `BranchDiagram` — four questions (is it differentiating? is our data unique? do we have the skills? how fast?) routing to buy / assemble / build. The retail assistant is run through the test as the worked case. | — | 280 | 🛍 ✋ | — |
| 6.3 | تیم و مهارت‌ها | Name the four roles an AI feature needs and which ones are genuinely new. Reassuring and specific: most of the team already exists. | `CardGrid` — four roles with responsibilities; the genuinely new parts highlighted against the existing ones. | — | 270 | | — |
| 6.4 | **نقشه، یک بار دیگر** | Read the full map from 1.2 with every term now meaningful. Closes the loop. **The final figure of the document.** | `ConceptMap` with `highlight="all"` — the master map, fully lit, every node now clickable to reveal its one-line definition and lesson number. The one place where the whole vocabulary is reviewable at once. | — | 240 | ✋ 🔎 | recap |

---

## Context Lenses (secondary figures)

Twenty lessons carry one Context Lens, plus the Lab in 4.3. A lens is **not** the lesson's primary figure; it is a second, text-level view placed after the explanatory prose. Every lens is complete without interaction.

| Lesson | Key | Mode | Control | The one "aha" |
|---|---|---|---|---|
| 1.3 | `text-loop` | steps (4) | stepper + raw | The model continues a text; change the text, the answer changes. |
| 1.4 | `slots` | static | — | The five requirements are five places in one text. |
| 2.2 | `tool-call` | steps (5) | stepper + raw + predict | A tool call is the model writing JSON; the harness runs it outside. |
| 2.3 | `mcp-fills-tools` | steps (3) | stepper + raw | MCP only changes who fills the tools block. |
| 2.4 | `skill-loading` | steps (3) | stepper + raw | A skill is instructions pasted in only when needed. |
| 2.5 | `memory-facts` | steps (4) | stepper + raw | Memory is three lines of text placed before the question. |
| 2.7 | `tests-as-text` | steps (3) | stepper + raw | Test output is text the model reads next. |
| 2.8 | `anatomy-recap` | static | raw | An agent assembles this text and appends to it. |
| 3.3 | `context-fills` | steps (3) | stepper + raw | The window's edge cuts text; what falls out is forgotten. |
| 3.4 | `learned-vs-given` | compare | raw | Training is frozen; today's status can only come from the text. |
| 3.5 | `no-fact-fluent-guess` | compare | raw | No fact in the text → a fluent invention. |
| 3.7 | `thinking-text` | compare | raw | Reasoning is more text the model writes and then continues from. |
| 4.1 | `messages-array` | mapping (3) | stepper | Every call re-sends the whole text; the API remembers nothing. |
| 4.3 | `lab` | lab | checkboxes + presets | Build the context; watch the answer change. |
| 4.4 | `rag-paste` | steps (4) | stepper + raw | RAG is search plus copy-paste into the text. |
| 4.5 | `where-it-changes` | compare | raw | Prompt/RAG change the text; fine-tuning changes the model. |
| 5.1 | `who-writes-what` | static | raw | Every architecture box fills one block. |
| 5.2 | `cache-prefix` | compare | raw | A stable beginning can be cached; order matters. |
| 5.3 | `injection` | steps (3) | stepper + raw + predict | The model sees one flat text; containment happens outside it. |
| 5.4 | `read-the-trace` | static | raw | To debug, read the text the model saw. |
| 6.4 | `recap` | static | raw | The whole document, as one text. |

**Counts**: 20 lenses + 1 Lab = 21 secondary pieces. Of these, 9 use a stepper, 2 use predict, 1 is the Lab, and the rest are static/compare. The primary interactive figure count remains exactly 8.

---

## Totals

| Part | Lessons | Words | Interactive (✋) | Retail example (🛍) | Lenses (🔎) |
|---|---|---|---|---|---|
| 1 | 5 | 1,070 | 0 | 1 | 2 |
| 2 | 8 | 2,050 | 1 | 4 | 6 |
| 3 | 7 | 1,980 | 3 | 1 | 4 |
| 4 | 7 | 2,010 | 1 | 4 | 4 |
| 5 | 4 | 1,210 | 1 | 3 | 4 |
| 6 | 4 | 1,080 | 2 | 1 | 1 |
| **Total** | **35** | **≈9,400** | **8** | **14** | 21 |

**Authored**: 6,381 Persian words (≈55 minutes), plus figure time. The per-lesson numbers above are ceilings; the draft sits below most of them. Appropriate for one sitting by a motivated reader, or six sittings by a busy one.

Both caps hold: **exactly 8** primary interactive figures (PLAN §3.2) and **every Part** carries the running example (PLAN §2.2). The 21 Context Lenses are secondary and bounded by `PLAN-CONTEXT.md`.

## Authoring order

Strictly 1.1 → 6.4. Lessons build on each other and `not_before` makes that mechanical. Authoring out of order will produce glossary failures and forward references.

## Reused figures — honor these

Four deliberate visual callbacks. They are a primary teaching mechanism, not a shortcut, and must survive review:

| Later lesson | Reuses | Why it matters |
|---|---|---|
| 3.1 مدل زبانی | 1.3's Context Lens visual language | The sentence is framed as the model's input: author underlines (کاربر / مدل) and a caret at the end. |
| 3.5 توهم | 3.1's `ProbabilityBars` visual language | Hallucination must *look like* next-token prediction, because it is. |
| 4.3 کانتکست | 3.3's `StackedBar` | Context engineering is literally filling that bar. |
| 5.1 معماری | Boxes from 2.2, 2.5, 4.4 | The architecture is assembled from parts the reader already owns. |
| 6.4 نقشه | 1.2's `ConceptMap` | Closes the document's frame. |
