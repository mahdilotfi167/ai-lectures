# Curriculum — the 33-lesson skeleton

This is the **authoring contract**. One row per lesson. An agent authoring a lesson needs this file, `terminology.md`, `glossary.yml`, and `figures.md` — nothing else.

Column meanings:

- **Objective** — what the reader can do afterwards. Written as a capability, not a topic.
- **Figure** — the primary primitive from `figures.md` plus what it shows. Lesson 6.4 links to the shared navigation map instead of rendering a primary figure; a Context Lens may be a secondary figure.
- **Terms** — terms whose `not_before` equals this lesson. First use here, glossed via `<Term>`.
- **Words** — Persian word budget for prose (hook + body + takeaway, excluding figure labels and asides). ±10%.
- **✋** — marked lessons have an optional primary-figure control. Current total: 7. The shared navigation map and lens controls are separate.
- **🛠** — the coding-agent running example appears in this lesson.
- **🔎** — this lesson has a Context Lens (a secondary figure; see `PLAN-CONTEXT.md` and the table below). The **Lens** column names its key.

Lesson files: `src/content/lessons/{part}-{n}-{slug}.mdx`.

The separate map and reading-guide lessons were removed as redundant. Part 1 is numbered consecutively from 1.1 to 1.3; figure IDs, links, and terminology introduction points use the updated numbers. Other Parts are unchanged.

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
example: coding                  # coding | none
words: 230                       # budget
has_aside: true
status: draft                    # draft | reviewed | confirmed
---
```

---

# Part 1 — تصویر کلی (The Picture)

**Zone**: `overview`. **Lessons**: 3. **Purpose**: by the end, the reader knows what AI does today, understands the three layers, and knows the one example we will follow. The shared فهرست provides the map of lessons and concepts.

| # | Lesson | Objective | Figure | Terms | Words | Flags | Lens |
|---|---|---|---|---|---|---|---|
| 1.1 | هوش مصنوعی امروز واقعاً چه کاری می‌کند | Name the four things today's AI is actually good at, and three it is not. Deflates both hype and dismissal before any vocabulary arrives. | `CardGrid` — 4 capability cards (writing/summarizing, answering from documents, writing code, ordering multi-step work) each with a concrete one-line example; then 3 dimmed "not yet" cards (guaranteed accuracy, true novelty, acting unsupervised). Cards fade in staggered. | — | 240 | | — |
| 1.2 | سه لایه: مدل، چارچوب اجرا، محصول | Distinguish the model from the surrounding program and product; introduce message roles and a conversational turn. | `LayerStack` — product (OpenCode, Hermes) / harness / model. The existing Context Lens then shows a two-turn conversation, its growing input, and the completed five-message transcript. | harness, llm, model, context, system-prompt, turn | 380 | 🔎 | text-loop |
| 1.3 | **مثالی که تا آخر همراه ماست** | Introduce the recurring example: a coding assistant like OpenCode or Hermes, not a fictional project or one bug. | `CardGrid` — assistant, repository, everyday request; then file reading, edits/commands, project guides, permissions/review, and choosing an existing assistant. | — | 220 | 🛠 🔎 | slots |

---

# Part 2 — ایجنت‌ها: لایهٔ رویی (Agents: the top layer)

**Zone**: `agents`. **Lessons**: 8. **Purpose**: the layer the reader actually touches. Deliberately placed *before* the model — top-down means starting where their experience already is.

| # | Lesson | Objective | Figure | Terms | Words | Flags | Lens |
|---|---|---|---|---|---|---|---|
| 2.1 | از چت‌بات به ایجنت | State the one difference: a chatbot answers, an agent *acts*. | `SplitCompare` — a chatbot suggests a fix; the coding agent reads files, edits, tests, and responds based on observed results. | agent, chatbot | 240 | 🛠 | — |
| 2.2 | ابزارها: چطور مدل کاری انجام می‌دهد | Explain that the model never executes anything — it only *requests*. | `SequenceFlow` — user, agent, model. The model returns `readFile("src/utils.ts")` to the agent; a local action checks permissions and reads the file. The agent calls the model again with the result and presents its reply to the user. The harness belongs inside the agent lane; tool names are illustrative, not the actual OpenCode/Hermes API. | tool-calling, function-calling | 280 | 🛠 🔎 | tool-call |
| 2.3 | MCP: پریز استاندارد ابزارها | Explain why a standard was needed: N tools × M apps = N×M adapters, versus N+M with a protocol. | `GraphMorph` — tangled N×M mesh morphs into a hub-and-spoke through a single MCP node. One animated morph, no controls. | mcp | 250 | 🔎 | mcp-fills-tools |
| 2.4 | مهارت‌ها: دستورهای بسته‌بندی‌شده | Distinguish skill instructions from tool execution and show on-demand loading rather than immediate injection. | `SplitCompare` — catalog metadata → model's read request → agent execution → returned instructions in the next context → next action. The lens shows a file-read path; dedicated skill tools and explicit user activation are alternatives. | skill | 360 | 🔎 | skill-loading |
| 2.5 | حافظه: چرا مدل شما را یادش نمی‌آید | Explain that the model is stateless; distinguish replayed conversation history from separately saved memory. | `LoopTrace` — the second-turn request "edit that file" is ambiguous only when both history and memory are omitted. The lens compares replaying the earlier user/assistant pair with including a separately saved file-path note. | memory, stateless | 270 | 🛠 🔎 | memory-facts |
| 2.6 | ورک‌فلو یا ایجنت؟ | Choose between a fixed pipeline and a free-running agent, by criterion not by fashion. Prevents the expensive default of "make everything an agent". | `BranchDiagram` — fixed workflow (predictable steps, cheap, auditable) vs agent loop (flexible, costly, variable). A decision node lists the three criteria: does the path vary? / is a mistake expensive? / is review needed? | workflow | 290 | ✋ | — |
| 2.7 | ایجنت‌های برنامه‌نویسی | Explain why coding was the first domain agents genuinely worked in: cheap verification. Tests pass or fail — an unambiguous reward signal most domains lack. | `LoopTrace` — a real-shaped trace: read file → edit → run tests → fail → read error → edit → tests pass. Steps appear one per beat. | — | 260 | 🔎 | tests-as-text |
| 2.8 | یک ایجنت از چه ساخته شده | Assemble the five pieces from 2.1–2.7 into one anatomy the reader can hold. **Part 2's synthesis.** | `ExplodedView` — model / file-and-test tools / repair skill / project notes / loop, each linked to its introducing lesson. | — | 230 | 🛠 🔎 | anatomy-recap |

---

# Part 3 — جعبه را باز کنیم (Opening the box)

**Zone**: `model`. **Lessons**: 7. **Purpose**: now that the reader knows what the model is *used for*, explain what it *is*. Enough mechanism to reason about failure — no mathematics.

| # | Lesson | Objective | Figure | Terms | Words | Flags | Lens |
|---|---|---|---|---|---|---|---|
| 3.1 | مدل زبانی چه کار می‌کند: حدس کلمهٔ بعدی | Internalize the single mechanism underneath everything: next-token prediction. | `ProbabilityBars` — a Persian sentence builds word by word; at each step a bar chart of candidate next tokens with probabilities, the top one chosen, sentence extends. Loops twice then rests. | inference | 270 | ✋ | — |
| 3.2 | توکن: واحد کار مدل | Explain tokens as the billing and limit unit, and why Persian costs more per sentence than English. | `TokenStrip` — the same sentence in Persian and English, split into colored token chips, counts compared. Persian-specific and genuinely useful here. | token | 260 | ✋ | — |
| 3.3 | کانتکست: هر چیزی که مدل می‌بیند | Explain that context has a size limit per model call; both earlier user messages and assistant replies occupy it. | `StackedBar` — a bar filling with stacked colored segments (دستور سیستم / تاریخچه / اسناد / پرسش). Fills past the edge; the oldest history visibly falls out. | context-window | 280 | ✋ 🔎 | context-fills |
| 3.4 | مدل چطور ساخته می‌شود: سه مرحله | Separate pre-training / fine-tuning / alignment, and connect each to an observable behavior. | `FlowPipeline` — three stages with input, what changes, and cost order of magnitude. Flows right to left. | training, pretraining, fine-tuning, alignment, rlhf | 300 | 🔎 | learned-vs-given |
| 3.5 | **توهم: چرا مدل چیزی از خودش می‌سازد** | Explain a fluent claim without project evidence. | `ProbabilityBars` — a fictional `project-helper.ts` is proposed without reading the repository; the correct sample path `src/utils.ts` is available only when supplied. | hallucination | 300 | 🛠 🔎 | no-fact-fluent-guess |
| 3.6 | مدل‌ها در چه چیزهایی ضعیف‌اند | Predict where a model will fail before deploying it: counting, arithmetic, recent events, long chains of reasoning, its own confidence. | `CardGrid` — five failure modes, each with a one-line example of the wrong output and the one-line reason. Reveals staggered. | — | 290 | | — |
| 3.7 | استدلال، و چرا مدل‌ها متفاوتند | Explain "reasoning" models as spending more compute at answer time, and why three models differ in cost, speed, and quality. | `TradeoffTriangle` — کیفیت / سرعت / هزینه with three model archetypes plotted. A travelling marker shows you cannot optimize all three. | reasoning, benchmark | 280 | 🔎 | thinking-text |

---

# Part 4 — ساختن با LLM (Building with LLMs)

**Zone**: `build`. **Lessons**: 7. **Purpose**: how a team actually goes from a model to a working feature. Code appears here, always illustrative and always explained in prose.

| # | Lesson | Objective | Figure | Terms | Words | Flags | Lens |
|---|---|---|---|---|---|---|---|
| 4.1 | یک فراخوانی API از نزدیک | Demystify a model call and distinguish calls from conversational turns. | `AnnotatedCode` — request (model, messages, temperature) and simplified response (content, `finish_reason`, usage). Reuses lesson 1.2's conversation; the lens shows two request/output pairs followed by the saved five-message transcript, not a third call. | api, temperature | 270 | 🔎 | messages-array |
| 4.2 | پرامپت: دستور دادن مؤثر | Apply role, task, constraints, and examples. | `LayerStack` — vague improve this → coding role → add dark mode → preserve unrelated behavior/no release → examples of evidence-based reports. | prompt, few-shot | 290 | 🛠 | — |
| 4.3 | کانتکست: مهم‌تر از پرامپت | Assemble the code, test evidence, project notes, and task. | `StackedBar` + Lab — five toggles change the authored plan. File/test evidence appears only with tools and the remembered target path; no real execution or fabricated test success. | context-engineering | 280 | 🛠 🔎 | lab (Lab) |
| 4.4 | **RAG: پاسخ از اسناد شما** | Retrieve the actual project rule before answering. | `FlowPipeline` — retrieve the contribution/testing guide and include it in context. Contrast relevant review instructions with unrelated color documentation. Direct reading or exact file search does not require vector retrieval; this pipeline is one option, not a universal product implementation. | rag, embedding, chunking, vector-database, semantic-search | 320 | 🛠 🔎 | rag-paste |
| 4.5 | چه زمانی فاین‌تیون، چه زمانی RAG | Choose between prompting, RAG, and fine-tuning using the real criterion: knowledge vs behavior. Prevents the most expensive common mistake. | `Ladder` — four rungs by cost and effort: prompt → context → RAG → fine-tune. Each rung states what it fixes and what it does not. A marker climbs. | — (فاین‌تیونینگ در ۳.۴ معرفی شده) | 300 | ✋ 🔎 | where-it-changes |
| 4.6 | ارزیابی: چطور بفهمیم بهتر شد | Explain why "it looks better" is not evidence, and what a minimum eval set looks like. | `DataTable` — varied coding tasks: add a feature, missing file, preserve tests, follow guides, no release, block secrets, honest test report, avoid unrelated edits. | eval, regression | 300 | 🛠 | — |
| 4.7 | از نمونه به محصول | Set expectations: the demo is ~20% of the work. Names the remaining 80% concretely. | `Ladder` — above water: the demo. Below: evals, guardrails, observability, cost control, error handling, data plumbing, review. Reveals downward. | — | 250 | | — |

---

# Part 5 — در عمل (Production)

**Zone**: `run`. **Lessons**: 4. **Purpose**: what breaks, what it costs, how it is attacked. Written for the person who must sign off, not the person on call.

| # | Lesson | Objective | Figure | Terms | Words | Flags | Lens |
|---|---|---|---|---|---|---|---|
| 5.1 | معماری یک سیستم واقعی | Read a real coding-agent system diagram and name each box. | `FlowPipeline` — programmer/editor → gateway → orchestrator → model, project guides, sandboxed file/test tools, memory → logging/evals. | orchestrator, gateway | 300 | 🛠 🔎 | who-writes-what |
| 5.2 | هزینه: پول کجا می‌رود | Estimate a coding session's repeated model calls, context, and output. | `CostCalculator` — model calls/day × context tokens × price, tier, and cache. The lens contrasts stable project instructions first with a variable clock breaking the prefix. | cost, caching | 300 | 🛠 ✋ 🔎 | cache-prefix |
| 5.3 | امنیت: تزریق پرامپت و نشت داده | Contain injected instructions with actual tool restrictions. | `SequenceFlow` — user, agent, model. The agent reads an untrusted guide; the model returns a request for `/private/secrets.env` to the agent. A local permission check rejects it before reading; the rejection returns to the model, and the agent presents the report. | prompt-injection, guardrail, data-leakage, least-privilege | 320 | 🛠 🔎 | injection |
| 5.4 | اتکاپذیری و مشاهده‌پذیری | Name the four non-deterministic failure modes and the minimum instrumentation for each. | `DataTable` — a trace of one request with latency, tokens, tool calls, and score; one failing request highlighted. Static-but-animated, no controls. | observability, tracing, latency, non-determinism | 290 | 🔎 | read-the-trace |

---

# Part 6 — رهبری (Leading)

**Zone**: `decide`. **Lessons**: 4. **Purpose**: the decisions the primary audience actually owns. Ends by revisiting the shared navigation map.

| # | Lesson | Objective | Figure | Terms | Words | Flags | Lens |
|---|---|---|---|---|---|---|---|
| 6.1 | کجا ارزش واقعی هست | Pick a first use case using two axes: tolerance for error × volume of repetitive work. | `Matrix2x2` — 2×2 with ~10 real use cases plotted (support triage, document search, code review, contract review, forecasting…). Quadrants labeled «از اینجا شروع کنید» / «بعداً» / «نه». Points fade in by quadrant. | — | 290 | | — |
| 6.2 | بسازیم یا بخریم | Apply a four-question test instead of defaulting to either answer. | `BranchDiagram` — buy a coding-agent core, combine it with the project's architecture/rules/tests, or build when differentiated control justifies the cost. | — | 280 | 🛠 ✋ | — |
| 6.3 | تیم و مهارت‌ها | Name the four roles an AI feature needs and which ones are genuinely new. Reassuring and specific: most of the team already exists. | `CardGrid` — four roles with responsibilities; the genuinely new parts highlighted against the existing ones. | — | 270 | | — |
| 6.4 | **نقشه، یک بار دیگر** | Revisit the shared map with every term now meaningful. Closes the loop. | No inline primary figure. Links back to the shared فهرست; keeps the `recap` Context Lens. Concept links navigate to the introducing lesson. | — | 240 | 🔎 | recap |

---

## Context Lenses (secondary figures)

Twenty lessons carry one Context Lens, plus the Lab in 4.3. A lens is **not** the lesson's primary figure; it is a second, text-level view placed after the explanatory prose. Every lens is complete without interaction. Lesson 1.2 places its conversation lens immediately after introducing context, message roles, and turns, before a short explanation of the completed transcript.

| Lesson | Key | Mode | Control | The one "aha" |
|---|---|---|---|---|
| 1.2 | `text-loop` | steps (5) | stepper | Two turns, five stored messages: system outside the turns, each user/assistant pair grouped, and each new answer separate from its input. |
| 1.3 | `slots` | static | — | The five requirements are five places in one text. |
| 2.2 | `tool-call` | steps (5) | stepper | The model returns a tool request; the agent runs it through its harness, then calls the model again with the result. |
| 2.3 | `mcp-fills-tools` | steps (3) | stepper | MCP only changes who fills the tools block. |
| 2.4 | `skill-loading` | steps (5) | stepper | Catalog metadata is not full instructions: the model requests `readFile(SKILL.md)`, the agent executes, and the returned text enters the next call before further decisions. |
| 2.5 | `memory-facts` | steps (5) | stepper | Earlier user/assistant messages or a saved note can supply the missing file path; a separate memory note is not required when history already contains it. |
| 2.7 | `tests-as-text` | steps (8) | stepper | Reading, testing, editing, and retesting each have a visible model request, agent execution, and result. Failed and successful test runs are separate exchanges. |
| 2.8 | `anatomy-recap` | static | — | An agent assembles this text and appends to it. |
| 3.3 | `context-fills` | steps (3) | stepper | The window's edge cuts text; what falls out is forgotten. |
| 3.4 | `learned-vs-given` | compare | — | Training is frozen; today's status can only come from the text. |
| 3.5 | `no-fact-fluent-guess` | compare | — | No fact in the text → a fluent invention. |
| 3.7 | `thinking-text` | compare | — | Reasoning is more text the model writes and then continues from. |
| 4.1 | `messages-array` | mapping (3) | stepper | The same conversation: two messages in request 1, four in request 2, five saved after response 2; saving the last response is not another call. |
| 4.3 | `lab` | lab | checkboxes + presets | Build the context; watch the answer change. |
| 4.4 | `rag-paste` | steps (4) | stepper | This example is program-driven retrieval before a model call, not an omitted model tool request; the retrieved text enters the prepared input. |
| 4.5 | `where-it-changes` | compare | — | Prompt/RAG change the text; fine-tuning changes the model. |
| 5.1 | `who-writes-what` | static | — | Every architecture box fills one block. |
| 5.2 | `cache-prefix` | compare | — | A stable beginning can be cached; order matters. |
| 5.3 | `injection` | steps (5) | stepper | The agent rejects the dangerous request and returns an error result; the request remains in history and no secret-file contents enter context. |
| 5.4 | `read-the-trace` | static | — | To debug, read the text the model saw. |
| 6.4 | `recap` | static | — | The whole document, as one text. |

**Counts**: 20 lenses + 1 Lab = 21 secondary pieces. Step-by-step and mapping lenses use a stepper, one piece is the Lab, and the rest are static/compare. There are no quizzes or answer-gated outputs. There are 32 primary figures, 7 interactive; the map is now navigation, not a lesson figure.

---

## Totals

| Part | Lessons | Words | Interactive (✋) | Coding example (🛠) | Lenses (🔎) |
|---|---|---|---|---|---|
| 1 | 3 | 840 | 0 | 1 | 2 |
| 2 | 8 | 2,180 | 1 | 4 | 6 |
| 3 | 7 | 1,980 | 3 | 1 | 4 |
| 4 | 7 | 2,010 | 1 | 4 | 4 |
| 5 | 4 | 1,210 | 1 | 3 | 4 |
| 6 | 4 | 1,080 | 1 | 1 | 1 |
| **Total** | **33** | **≈9,200** | **7** | **14** | 21 |

The prose has been rewritten around the coding-agent example. The per-lesson numbers above are ceilings, not quotas; figure/lens reading adds time beyond prose. Appropriate for one sitting by a motivated reader, or six sittings by a busy one.

The interaction budget holds with **7** primary interactive figures; **every Part** carries the running example (PLAN §2.2). The 21 Context Lenses are secondary and bounded by `PLAN-CONTEXT.md`.

## Authoring order

Strictly 1.1 → 6.4. Lessons build on each other and `not_before` makes that mechanical. Authoring out of order will produce glossary failures and forward references.

## Reused figures — honor these

Four deliberate visual callbacks. They are a primary teaching mechanism, not a shortcut, and must survive review:

| Later lesson | Reuses | Why it matters |
|---|---|---|
| 3.1 مدل زبانی | 1.2's Context Lens visual language | The sentence is framed as the model's input: author underlines (کاربر / مدل) and a caret at the end. |
| 3.5 توهم | 3.1's `ProbabilityBars` visual language | Hallucination must *look like* next-token prediction, because it is. |
| 4.3 کانتکست | 3.3's `StackedBar` | Context engineering is literally filling that bar. |
| 5.1 معماری | Boxes from 2.2, 2.5, 4.4 | The architecture is assembled from parts the reader already owns. |
| 6.4 نقشه | The shared فهرست | Closes the document's frame without repeating the diagram. |
