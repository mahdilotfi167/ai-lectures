# Curriculum — the 41-lesson user-first contract

The primary outcome is to **choose, ask, supply, steer, verify, and authorize**, not to build an AI application. No code literacy, paid account, live model, or network connection is required.

| Stage | Parts | Outcome |
|---|---|---|
| 1 — شناخت اولیه | 1–2 | Distinguish product/model/agent, turns, tools, skills, history, and memory. |
| 2 — کارکردن مؤثر | 3–4 | Complete a bounded task with useful material, feedback, evidence, and limited authority. **4.6 is a complete stopping point.** |
| 3 — بازکردن جعبه | 5–6 | Understand the mechanisms and tradeoffs behind the interface; implementation is not a prerequisite. |

Canonical metadata: `src/data/lessons.ts`. Binding vocabulary: `glossary.yml` and `docs/terminology.md`. Detailed practical acceptance contracts: `PLAN-USER-FIRST.md` §4. This document supersedes the original top-down/33-lesson sequence.

## Identity and authoring rules

- Files: `src/content/lessons/{part}-{n}-{slug}.mdx`; `id` is current display order, `slug` is stable content identity.
- Canonical lesson anchor: `lesson-{slug}`. Primary figure: `fig-{slug}`. Secondary Lens/Lab: `fig-{slug}-ctx`.
- Caption numbers come from current metadata, not the anchor. Numbers such as 6.10 and 6.12 are supported.
- `src/data/curriculum-migration.ts` preserves all 33 published numeric lesson links, primary figure links, Lens links, and Part links. Consolidated content has multiple aliases. **Do not reuse an old numeric anchor for a new topic.**
- Saved position v1 migrates to the destination lesson's beginning; child indices from rewritten prose are unsafe. v2 retains exact relative positions. Explicit new navigation takes priority.
- Each lesson has one primary figure, except 6.12, which links to the shared فهرست. At most one Context widget per lesson.
- 40 primary figures, **7 with optional controls**; **20 Context Lenses and one prepared-input Lab**. No new required interactions, engineering asides, quizzes, raw-view switches, or typing animations.
- Word values below are ceilings with a +10% allowance, not padding targets. Figure labels/transcripts add reading time. The whole-book prose target is approximately 10,000 Persian words, excluding figure data and transcripts.
- Read in numeric order. Use `<Term id="…" />` at the introduction, then the short form. Do not pull technical mechanisms into the practical stage merely because a basic term has been introduced.

## Part 1 — تصویر کلی

| ID / stable slug | Title and capability | Primary figure | Introductions | Ceiling | Lens | Source |
|---|---|---|---|---|---|---|
| 1.1 `what-ai-does-today` | هوش مصنوعی امروز چه کمکی می‌کند؟ — distinguish useful help from guaranteed truth and unlimited authority. | CardGrid | — | 260 | — | old 1.1 |
| 1.2 `three-layers` | سه لایه: مدل، چارچوب اجرا، محصول — distinguish layers, roles, calls and turns. | LayerStack | harness, llm, model, context, system-prompt, turn | 420 | text-loop | old 1.2 |
| 1.3 `the-running-example` | مثالی که همراه ماست — follow request, project and evidence without needing code literacy. | CardGrid | — | 220 | slots | old 1.3 |

## Part 2 — ایجنت‌ها و مفاهیم پایه

| ID / stable slug | Title and capability | Primary figure | Introductions | Ceiling | Lens | Source |
|---|---|---|---|---|---|---|
| 2.1 `from-chatbot-to-agent` | از گفت‌وگو تا ایجنت — distinguish answering from a decision/action loop, not by interface appearance. | SplitCompare | agent, chatbot | 260 | — | old 2.1 |
| 2.2 `tools` | ابزارها: درخواست مدل، اجرای ایجنت — separate request, execution and returned result. | SequenceFlow | tool-calling, function-calling | 280 | tool-call | old 2.2 |
| 2.3 `skills` | مهارت‌ها: روش کاری که هنگام نیاز خوانده می‌شود — distinguish reusable instructions from execution. | SplitCompare | skill | 360 | skill-loading | old 2.4 |
| 2.4 `memory` | تاریخچه و حافظه: دستیار چه چیزی را به یاد می‌آورد؟ — distinguish history, stored notes and the current input. | LoopTrace | memory, stateless | 290 | memory-facts | old 2.5 |
| 2.5 `workflow-or-agent` | مسیر ثابت یا ایجنت؟ — choose a conventional tool, fixed procedure or adaptive path. | BranchDiagram ✋ | workflow | 290 | — | old 2.6 |
| 2.6 `coding-agents` | یک دستیار برنامه‌نویسی چطور کار را پیش می‌برد؟ — follow read/test/edit/retest and bounded stopping. | LoopTrace | — | 300 | tests-as-text | old 2.7 |
| 2.7 `agent-anatomy` | یک ایجنت از چه ساخته شده؟ — identify model/tools/loop and optional supporting skills/memory. | ExplodedView | — | 250 | anatomy-recap | old 2.8 |

MCP moves to 6.3. Token accounting, connector internals and APIs are not prerequisites for starting to use an assistant.

## Part 3 — شروع درست و گفت‌وگوی مؤثر

| ID / stable slug | Title and capability | Primary figure | Introductions | Ceiling | Source |
|---|---|---|---|---|---|
| 3.1 `where-value-is` | کدام بخش کارم را به هوش مصنوعی بسپارم؟ — choose a bounded, verifiable, recoverable task and consider a simpler alternative. | Matrix2x2 | cost | 300 | old 6.1, reframed |
| 3.2 `choose-capabilities` | کدام دستیار و کدام حالت را انتخاب کنم؟ — distinguish capability, current information/access and permission. | CardGrid | reasoning | 310 | new |
| 3.3 `share-safely` | چه اطلاعاتی را در اختیار دستیار بگذارم؟ — check classification, authority, destinations, retention and applicable terms before sharing. | FlowPipeline | data-leakage, training | 320 | new; practical security |
| 3.4 `prompts` | از خواستهٔ مبهم تا درخواست قابل‌انجام — state goal, materials, limits, deliverable and acceptance criteria; allow clarification. | LayerStack | prompt, few-shot | 320 | old 4.2, rewritten |
| 3.5 `what-the-assistant-saw` | دستیار واقعاً چه چیزی را دیده است؟ — distinguish access, reading/extraction, relevant evidence and interpretation; make a clean handoff. | SplitCompare | — | 320 | user-facing split from old 3.3/4.3 |
| 3.6 `collaborate-in-turns` | یک گفت‌وگوی مؤثر از درخواست تا نتیجه — correct an assumption while preserving scope and original requirements. | ConversationExample | — | 330 | new |

Privacy precedes upload examples. Modes are described by capabilities, not fast-aging product rankings. The dialogue shows clarification and a specific correction **before editing**, not a fictional applied change without evidence.

## Part 4 — بررسی نتیجه و واگذاری امن

| ID / stable slug | Title and capability | Primary figure | Introductions | Ceiling | Source |
|---|---|---|---|---|---|
| 4.1 `verify-results` | چطور جواب را بررسی کنم، نه فقط دریافت کنم؟ — match facts, summaries, interpretations, calculations and actions to evidence. | DataTable | hallucination | 330 | new; practical counterpart |
| 4.2 `delegate-authority` | چه کاری را واگذار کنم و کجا تأیید بدهم؟ — inspect action, target, scope, destination and reversibility before granting limited authority. | Ladder | least-privilege | 300 | new |
| 4.3 `stop-and-recover` | چه زمانی ادامه بدهم، سؤال بپرسم یا متوقف کنم؟ — set stopping conditions and inspect state before retrying uncertain actions. | BranchDiagram | — | 300 | new |
| 4.4 `reusable-routines` | چطور یک روش موفق را دوباره استفاده کنم؟ — choose templates, instructions, memory or a skill; separate preferences from dated facts. | CardGrid | — | 310 | new |
| 4.5 `personal-value` | آیا واقعاً در وقت، کیفیت و هزینه صرفه‌جویی کردم؟ — compare acceptable completed work against total time/money and the non-AI baseline. | DataTable | eval | 300 | new |
| 4.6 `a-complete-task` | یک کار واقعی، از انتخاب تا نتیجه — synthesize bounded selection, sharing, correction, approval, evidence and value. | LoopTrace | — | 420 | new synthesis |

Required distinctions: suggested edit ≠ applied edit ≠ tested edit ≠ all requirements met; confidence/citations/assistant agreement ≠ independent verification; cancellation ≠ rollback; written requests ≠ enforced permissions or hard budgets. A blocked or handed-back task can be the correct outcome. The final reference card completes the primary practical course.

## Part 5 — درون مدل چه می‌گذرد؟

| ID / stable slug | Title and capability | Primary figure | Introductions | Ceiling | Lens | Source |
|---|---|---|---|---|---|---|
| 5.1 `next-word-prediction` | مدل زبانی چه کار می‌کند؟ — distinguish continuation from factual or execution evidence. | ProbabilityBars ✋ | inference | 280 | — | old 3.1 |
| 5.2 `tokens` | توکن: واحد اندازه و مصرف — understand tokenizer-dependent sizes, not a universal Persian/English price ratio. | TokenStrip ✋ | token | 260 | — | old 3.2 |
| 5.3 `context-window` | ظرفیت کانتکست و انتخاب آنچه می‌ماند — distinguish capacity, output headroom, selection and lossy compaction. | StackedBar ✋ | context-window | 330 | context-fills | old 3.3 |
| 5.4 `how-models-are-built` | مدل چطور ساخته و سازگار می‌شود؟ — distinguish parameter changes from supplying today's sources; stages vary. | FlowPipeline | pretraining, fine-tuning, alignment, rlhf | 320 | learned-vs-given | old 3.4 |
| 5.5 `hallucination` | توهم چرا رخ می‌دهد؟ — explain possible contributors and limits of mitigation, referring back to 4.1. | ProbabilityBars | — | 300 | no-fact-fluent-guess | old 3.5 |
| 5.6 `model-weaknesses` | مدل‌ها کجا به کمک ابزار یا انسان نیاز دارند؟ — choose checks for task/model-dependent failure modes. | CardGrid | — | 290 | — | old 3.6 |
| 5.7 `reasoning-and-tradeoffs` | استدلال و انتخاب مدل: کیفیت، سرعت، هزینه — test extra computation on real tasks; visible explanations are not guaranteed internal traces. | TradeoffTriangle | benchmark | 300 | thinking-text | old 3.7 |

Training, reasoning and hallucination already have minimal practical definitions; deepen them here without re-glossing. Context eviction is an **example program policy**, not universal model behavior.

## Part 6 — پشت‌صحنهٔ دستیار و تصمیم‌های فنی

### ورودی و اتصال‌ها

| ID / stable slug | Title and capability | Primary figure | Introductions | Ceiling | Lens | Source |
|---|---|---|---|---|---|---|
| 6.1 `api-call-anatomy` | یک فراخوانی مدل از نزدیک — inspect illustrative request/response and the familiar two-turn conversation. | AnnotatedCode | api, temperature | 290 | messages-array | old 4.1 |
| 6.2 `context-engineering` | چیدمان کانتکست در پشت‌صحنه — separate assembly and format validity from truth/authority. | StackedBar | context-engineering | 310 | lab | old 4.3 technical half |
| 6.3 `mcp-standard-socket` | MCP: اتصال استاندارد، نه اجازهٔ نامحدود — distinguish connection, discovery and authorized execution. | GraphMorph | mcp | 290 | mcp-fills-tools | old 2.3 |

### منبع، سازگارسازی و سنجش

| ID / stable slug | Title and capability | Primary figure | Introductions | Ceiling | Lens | Source |
|---|---|---|---|---|---|---|
| 6.4 `rag` | RAG: پاسخ با کمک منابع — understand retrieval, freshness, permissions and conflicting versions; vector search is one implementation. | FlowPipeline | rag, embedding, chunking, vector-database, semantic-search | 360 | rag-paste | old 4.4 |
| 6.5 `finetune-or-rag` | تنظیم دستور، اتصال داده یا تغییر مدل؟ — choose the simplest adequate intervention; fine-tuning can affect knowledge too. | Ladder ✋ | — | 300 | where-it-changes | old 4.5 |
| 6.6 `evaluation` | ارزیابی منظم و پس‌رفت — use representative cases, outcome criteria, repeated runs and cases held apart from tuning. | DataTable | regression | 330 | — | old 4.6 |

### بهره‌برداری و تصمیم

| ID / stable slug | Title and capability | Primary figure | Introductions | Ceiling | Lens | Source |
|---|---|---|---|---|---|---|
| 6.7 `cost` | هزینهٔ فنی: فراخوانی‌ها، توکن‌ها و کش — sum calls; distinguish conditional prefix caching from whole-answer reuse. | CostCalculator ✋ | caching | 320 | cache-prefix | old 5.2 |
| 6.8 `security` | تزریق پرامپت و مرزهای واقعی دسترسی — enforce outside the model and return denial evidence. | SequenceFlow | prompt-injection, guardrail | 340 | injection | old 5.3 |
| 6.9 `reliability` | خرابی، بازیابی و ردگیری — handle partial/uncertain work with bounded retries, evidence and privacy-aware traces. | DataTable | observability, tracing, latency, non-determinism | 340 | read-the-trace | old 5.4 |
| 6.10 `production-architecture` | پشت یک دستیار قابل‌اعتماد چه می‌گذرد؟ — understand one possible architecture and integration, review and maintenance beyond a demo. | FlowPipeline | orchestrator, gateway | 360 | who-writes-what | old 5.1 + 4.7 |
| 6.11 `build-or-buy` | استفاده، تنظیم، اتصال یا ساخت اختصاصی؟ — choose customization and name outcome, domain-review, access and support owners. | BranchDiagram ✋ | — | 350 | — | old 6.2 + 6.3 |
| 6.12 `the-map-again` | نقشه، یک بار دیگر: از استفاده تا فهم — connect practical choices to mechanisms and revisit the shared navigator. | no primary figure | — | 270 | recap | old 6.4 |

## Context and continuity contracts

- Keep all 20 Lens keys and one `lab`, each hosted exactly once. `lenses.ts` holds the host numbers; `legacyLensHosts` records published v1 locations.
- Preserve five skill-loading frames, eight read/test/edit/retest frames, five denial frames, and the complete static recap.
- Every claimed action has a preceding request and returned result; a denied request stays with its error. Tool definitions and skill metadata are not execution evidence.
- Explicitly distinguish program-driven preparation (MCP discovery, automatic retrieval, Lab snapshots) from model-requested action.
- Context message order (`system → user → assistant → user → assistant`) differs from communication among user/agent/model. Harness and execution belong inside the agent.
- New practical figures are static and fully readable. ConversationExample is an ordered, labelled dialogue, not another context runtime.
- Use general coding assistants such as OpenCode/Hermes as the recurring mechanics example. Supplement with learning, writing, document and research patterns. No shopping-support replacement or one obligatory fictional bug.

## Verification

After substantive content changes, run the batch: `npm test` then `npm run build`. Build includes skeleton, glossary, Context, prose/size budgets and output-link/ID checks. Do not bypass validation with direct Astro builds for acceptance.

Manually check desktop/mobile, local file, incoming current/legacy hashes, v1/v2 resume, explicit-link priority, blocked storage, no-JS, keyboard focus, print and reduced motion. The complete output remains one offline `dist/index.html` under the existing 1.5 MB target / 3 MB hard cap.
