# User-first AI cookbook — combined curriculum and implementation plan

> Date: 2026-11-12
>
> Status: implemented after approval. The 41-lesson user-first curriculum is in the source and generated offline book. The original proposal is retained below as the design record; completion and validation notes follow.
>
> Combines the two user-first proposals: practical capability selection, task briefs, collaborative conversation, evidence, privacy, delegated authority, reusable routines, and personal value measurement.
>
> Required learning order: **overview, agents, and basics → how to use AI → technical understanding and opening the box**.

### Implementation outcome — 2026-11-12

- The target order is live: Parts 1–2 basics, Parts 3–4 practical use, Parts 5–6 technical understanding. Lesson 4.6 ends the complete practical course.
- 41 lessons, six Parts, three stages, 40 primary figures (seven interactive), 20 retained Context Lenses and one Lab in 6.2. One static `ConversationExample` primitive was added; no new interactive controls or live-model dependency.
- Stable lesson/figure/Part anchors are separate from display numbers. The migration ledger preserves 33 v1 lesson identities and 92 total legacy anchors, including consolidated chapters. v1 reading positions resume at the corresponding lesson's beginning; v2 keeps paragraph-relative position through reload and responsive resizing. Saved hashes are canonicalized without overriding explicit incoming navigation.
- Full `npm run build` passes skeleton, glossary, Context, budget and output-reference audits. `npm test` covers the curriculum, migration, evidence ordering, saved-state parsing and glossary regressions. Output is approximately 0.96 MB, a single offline HTML file; the output audit finds 364 unique IDs and 204 internal destinations with no broken links or collisions.
- Browser checks covered desktop/mobile (including 360px), current/legacy lesson, figure and Part links, search, focus return, v1/v2 reading positions, resize/reload, blocked storage, local-file opening, no-JS navigation, reduced motion, print styles, Lab presets and retained trace frames. A WCAG-tagged axe scan reported no automated violations after contrast/label fixes; SVG contrast and a closed-dialog relation still include manual-review items. This is not a claim of complete accessibility certification.
- Nonblocking build warnings remain for sentence length, lessons below their prose ceilings, and the existing bundler `codeSplitting` option. Standalone `tsc --noEmit` is not clean: Node/`js-yaml` declarations are missing and pre-existing global scripts conflict. The validated production build succeeds without disabling checks.
- Native-reader editorial review remains a human follow-up, not an implied sign-off. The deferred topics in §11 remain deferred. `further-reading-report.md` is unchanged; no commit, push or deployment was performed.

## 1. The primary learning outcome

The reader primarily wants to **use and understand AI**, not build an AI application.

After the core learning path, the reader should be able to say:

> می‌دانم چه کاری به دستیار بسپارم، کدام قابلیت را انتخاب کنم، چه اطلاعاتی بدهم، چطور گفت‌وگو را پیش ببرم و پیش از اعتماد یا اجازهٔ اجرا چه چیزی را بررسی کنم.

In operational terms, the reader can:

1. Select a suitable task and recognize when a simpler tool or a person is preferable.
2. Choose an assistant capability or mode, rather than relying on a product name or ranking.
3. Decide what information is safe and useful to share.
4. Provide a clear goal, material, constraints, deliverable, and completion criteria.
5. Collaborate across several turns and repair a disappointing response.
6. Establish what the assistant actually saw, used, changed, and checked.
7. Grant proportionate authority, recognize a stopping point, and retain a recovery path.
8. Reuse successful routines and assess their real benefit, including review time.

Technical literacy explains these practices afterward; API syntax, retrieval infrastructure, and production architecture are not prerequisites for them.

## 2. Structural decision: three stages, six Parts

The three stages are the learning path, **not a requirement to reduce the book to three numbered Parts**. Keep six Parts to preserve manageable reading sections and the existing six-color visual system.

### Stage 1 — شناخت اولیه: تصویر کلی، ایجنت‌ها و مفاهیم پایه

- **Part 1: تصویر کلی** — three lessons.
- **Part 2: ایجنت‌ها و مفاهیم پایه** — seven lessons.
- Outcome: explain the basic assistant/model/agent relationship, conversation turns, tools, skills, and memory.
- Depth limit: enough mechanism to use an assistant intelligently; no token arithmetic, API schemas, vector databases, or deployment architecture.

### Stage 2 — کارکردن مؤثر با هوش مصنوعی

- **Part 3: شروع درست و گفت‌وگوی مؤثر** — six lessons.
- **Part 4: بررسی نتیجه و واگذاری امن** — six lessons.
- Outcome: complete a bounded task with appropriate context, feedback, evidence, and permissions.
- This is a first-class section, not scattered advice embedded in technical chapters.
- A reader who stops here has completed the primary, practical course.

### Stage 3 — بازکردن جعبه و فهم پشت‌صحنه

- **Part 5: درون مدل چه می‌گذرد؟** — seven lessons.
- **Part 6: پشت‌صحنهٔ دستیار و تصمیم‌های فنی** — twelve short lessons.
- Outcome: explain why the practices work, understand limitations and tradeoffs, and ask informed technical or purchasing questions.
- Part 6 is further depth, not an implied obligation to become an application developer.
- Group its twelve lessons into three visible topic clusters in the syllabus: input and connections; evidence and adaptation; operation and decisions. Do not add a new navigation application or require a separate route.

**Recommended target: 41 lessons**, up from 33, through additions, moves, splits, and two consolidations. This is a rebalanced syllabus, not all 33 old lessons plus every proposal as a new chapter.

Keep all stages in the same continuous offline HTML document. Mark stage transitions using existing Part dividers and the shared فهرست, not tabs, gated tracks, or engineering asides. Do not recreate the removed reading-guide lesson.

### Proposed length and interaction budget

- Stage 1: approximately 2,200 Persian prose words across ten short lessons.
- Stage 2: approximately 3,200 words across twelve lessons; allow room for worked examples instead of additional jargon.
- Stage 3: approximately 4,600 words across nineteen compact lessons.
- Whole-book working ceiling: approximately 10,000 prose words, excluding figure labels and transcripts; recalculate after authoring. These are ceilings, not padding targets.
- Prefer existing figure primitives and static worked examples for new practical lessons.
- Preserve the current seven primary interactive figures unless a justified replacement is agreed. New topics do not each need a new control.
- Preserve the existing 20 Context Lenses and one Lab, remapped to the new hosts. Do not add a second context-building Lab or restore quizzes, raw/labeled toggles, actor strips, or per-block token counters.

## 3. Target syllabus

The IDs below are the implemented display numbers. Throughout the retained migration table, “old” means the pre-migration 33-lesson curriculum. Stable slugs and numeric aliases preserve those published identities.

### Part 1 — تصویر کلی

| New ID | Learner-facing title | Reader outcome and required content | Source / visual |
|---|---|---|---|
| 1.1 | هوش مصنوعی امروز چه کمکی می‌کند؟ | Recognize useful assistance and its limits. State that the book focuses on language-model-based assistants, not all AI. Briefly acknowledge text, image, document, and audio capabilities without implying every assistant supports all of them. Include an early “do not share secrets or approve sensitive actions blindly” caution. | Reframe old 1.1; `CardGrid`. |
| 1.2 | سه لایه: مدل، چارچوب اجرا، محصول | Distinguish the product, its execution program, and the model. Define کانتکست, message roles, and the book's convention for نوبت. Preserve the two-turn example and separation between new output and saved history. | Retain old 1.2 and `text-loop`; `LayerStack`. |
| 1.3 | مثالی که همراه ماست | Meet a general coding assistant such as OpenCode or Hermes. Explain the repository, request, and visible evidence of work. Coding knowledge is unnecessary; this is not one fictional bug or a product tutorial. | Retain old 1.3 and `slots`; `CardGrid`. |

### Part 2 — ایجنت‌ها و مفاهیم پایه

| New ID | Learner-facing title | Reader outcome and required content | Source / visual |
|---|---|---|---|
| 2.1 | از گفت‌وگو تا ایجنت | Distinguish a conversational interface from a system that can act in a loop. Explain that an interface labelled “chat” may also offer tools; the distinction is capability and behavior, not the appearance of the interface. | Reframe old 2.1; `SplitCompare`. |
| 2.2 | ابزارها: درخواست مدل، اجرای ایجنت | Explain user → agent → model interactions and the return path. A definition is not execution evidence. One user turn may contain several model calls and tool executions. | Retain old 2.2, three-participant `SequenceFlow`, and `tool-call`. |
| 2.3 | مهارت‌ها: روش کاری که هنگام نیاز خوانده می‌شود | Distinguish reusable instructions from executable actions. Preserve catalog → model read request → agent read → returned instructions → next model decision. Introduce the user benefit of a reusable method without turning this into a skill-authoring guide. | Move old 2.4; `SplitCompare` and five-frame `skill-loading`. |
| 2.4 | تاریخچه و حافظه: دستیار چه چیزی را به یاد می‌آورد؟ | Distinguish visible conversation history, separately saved notes, and a fresh conversation. Information retained by the product is not information the model necessarily receives on every call. | Move/reframe old 2.5; `LoopTrace` and `memory-facts`. |
| 2.5 | مسیر ثابت یا ایجنت؟ | Recognize when a fixed procedure or conventional tool is sufficient, and when adaptive action helps. Present ورک‌فلو versus agent as a choice of work pattern, not an instruction to build software. | Move/reframe old 2.6; retain interactive `BranchDiagram`. |
| 2.6 | یک دستیار برنامه‌نویسی چطور کار را پیش می‌برد؟ | Follow read → test → change → retest → report, with a distinct request and result for each operation. Explicitly allow “blocked,” “needs clarification,” and “stopped” outcomes; do not teach “repeat until green” as an unbounded policy. | Move old 2.7; `LoopTrace` and eight-frame `tests-as-text`. |
| 2.7 | یک ایجنت از چه ساخته شده؟ | Assemble the model, tools, loop, and optional supporting skills/memory. Frame the anatomy as a common configuration, not a requirement that every agent have all five components. | Move old 2.8; `ExplodedView` and `anatomy-recap`. |

**Move MCP out of this Part.** A user does not need connector-standard internals before learning how to ask, supply material, verify, and authorize.

### Part 3 — شروع درست و گفت‌وگوی مؤثر

Teach the following in order. In particular, the privacy decision comes **before** the document-upload and context-supply examples.

| New ID | Learner-facing title | Reader outcome and required content | Source / visual |
|---|---|---|---|
| 3.1 | کدام بخش کارم را به هوش مصنوعی بسپارم؟ | Choose a bounded task using five questions: can I describe the outcome, supply the material, verify the result, recover from a mistake, and beat a simpler alternative? Include both useful delegation and legitimate “do not use AI here” examples. | Adapt old 6.1 from investment prioritization to today's work; `Matrix2x2`. |
| 3.2 | کدام دستیار و کدام حالت را انتخاب کنم؟ | Choose ordinary conversation, current-source search, document work, additional reasoning effort, or tool-enabled action. Include image/audio inputs as capability options. Stronger reasoning does not imply fresher information, broader access, or permission to act. | New; `CardGrid` or capability-oriented `BranchDiagram`. |
| 3.3 | چه اطلاعاتی را در اختیار دستیار بگذارم؟ | Classify public, internal, confidential, personal, and credential data. Share the minimum needed; redact or replace with synthetic examples when appropriate. Check policy, retention and training-use terms/settings, logs, saved memory, and connected services. A local interface does not imply local inference. | New practical treatment drawing from old 5.3; `FlowPipeline` showing data destinations. |
| 3.4 | از خواستهٔ مبهم تا درخواست قابل‌انجام | Write a task brief: goal, relevant material, constraints, deliverable, and acceptance criteria. Role and examples are supporting tools, not magical prompt syntax. Ask for clarification when necessary instead of making the prompt longer. | Move/rewrite old 4.2; `LayerStack`. |
| 3.5 | دستیار واقعاً چه چیزی را دیده است؟ | Distinguish naming a file, giving access, reading it, extracting it correctly, and using relevant evidence. Cover long files, scanned PDFs, tables, screenshots, and audio extraction errors. Show practical context hygiene: restate constraints, supply missing material, make a handoff summary, or start fresh. | User-facing split from old 3.3/4.3; `SplitCompare` or grouped evidence cards. |
| 3.6 | یک گفت‌وگوی مؤثر از درخواست تا نتیجه | Move through brief → clarification → plan when useful → first result → specific feedback → checked revision. Correct assumptions and identify what must stay unchanged. Explain when to continue a conversation versus restarting with a clean brief. | New; a static, ordered conversation walkthrough using existing HTML figure styles. |

### Part 4 — بررسی نتیجه و واگذاری امن

| New ID | Learner-facing title | Reader outcome and required content | Source / visual |
|---|---|---|---|
| 4.1 | چطور جواب را بررسی کنم، نه فقط دریافت کنم؟ | Match verification to facts, interpretations, recommendations, calculations, summaries, and actions. Explain توهم briefly here so the reader can recognize it before studying its mechanism. Distinguish suggestion, execution, test evidence, and satisfaction of all requirements. Confidence, a citation, “are you sure?”, and agreement between assistants are not independent verification. | New practical counterpart to old 3.5/4.6; `DataTable` or evidence ladder. |
| 4.2 | چه کاری را واگذار کنم و کجا تأیید بدهم؟ | Use an authority ladder: explain → inspect → draft/propose → reversible local change → external or hard-to-reverse action. Separate read, write, کامند execution, install, publish, and delete permissions. Review the actual target and scope, not just an “allow” button. | New practical counterpart to old 2.2/5.3; `Ladder`. |
| 4.3 | چه زمانی ادامه بدهم، سؤال بپرسم یا متوقف کنم؟ | Recognize success, ambiguity, repeated failure, missing permission, exhausted time/spending, and sensitive actions. Set checkpoints and stopping conditions. Interrupt safely, inspect the actual state before retrying, and understand that cancellation is not rollback. | New; `BranchDiagram` with success, clarify, blocked, stop, and hand-back outcomes. |
| 4.4 | چطور یک روش موفق را دوباره استفاده کنم؟ | Save a task template, a short project instruction, useful preferences, or a repeatable skill as appropriate. Separate durable preferences from dated facts. Include four compact patterns: understand/learn, write/revise, research/check sources, inspect/plan/approve/act/check code. Do not repeat the skill-loading internals. | New practical callback to 2.3/2.4; grouped `CardGrid`. |
| 4.5 | آیا واقعاً در وقت، کیفیت و هزینه صرفه‌جویی کردم؟ | Compare briefing + waiting + checking + correction time with the non-AI baseline. Consider subscriptions, quotas, waiting, and the cost per acceptable completed task—not just token billing. Keep a few representative tasks and note recurring failures. | New user-level counterpart to old 4.6/5.2; simple `DataTable`. |
| 4.6 | یک کار واقعی، از انتخاب تا نتیجه | Follow one complete bounded task through the preceding decisions, including a correction and a verification step. Show a legitimate blocked outcome as an alternative. End with an actionable reference card so this is a complete stopping point for the primary audience. | New synthesis; `LoopTrace` plus a short readable checklist, no quiz or answer gating. |

### Part 5 — درون مدل چه می‌گذرد؟

Keep the existing progression, but make its connection to practical lessons explicit.

| New ID | Learner-facing title | Reader outcome and required content | Source / visual |
|---|---|---|---|
| 5.1 | مدل زبانی چه کار می‌کند؟ | Understand next-token generation as a mechanism, not a claim that fluent text establishes truth or successful execution. Connect to checking claims in 4.1. | Move old 3.1; retain `ProbabilityBars`. |
| 5.2 | توکن: واحد اندازه و مصرف | Understand why input/output length affects limits and price. Keep Persian/English boundaries clearly illustrative and tokenizer-dependent; avoid universal language-cost claims. | Move old 3.2; retain `TokenStrip`. |
| 5.3 | ظرفیت کانتکست و انتخاب آنچه می‌ماند | Explain capacity, response headroom, selection, truncation, and compaction. The program chooses how to handle overflow; the model does not universally delete the oldest messages. A summary can lose constraints; fitting information is not a guarantee of using it well. | Move/deepen old 3.3; retain `StackedBar` and `context-fills`, revise their claims. |
| 5.4 | مدل چطور ساخته و سازگار می‌شود؟ | Explain pretraining and post-training/adaptation as a simplified account, not one universal three-step pipeline. Distinguish learned parameters from receiving today's source material. | Move/qualify old 3.4; `FlowPipeline` and `learned-vs-given`. |
| 5.5 | توهم چرا رخ می‌دهد؟ | Explain possible causes and the limits of evidence, retrieval, and abstention. Refer back to practical verification rather than teaching a second verification checklist. | Move/qualify old 3.5; `ProbabilityBars` and `no-fact-fluent-guess`. |
| 5.6 | مدل‌ها کجا به کمک ابزار یا انسان نیاز دارند؟ | Explain typical failure modes in counting, calculation, fresh facts, long dependencies, and confidence. Present performance as task/model-dependent, not a declaration that every model always fails. | Move/reframe old 3.6; `CardGrid`. |
| 5.7 | استدلال و انتخاب مدل: کیفیت، سرعت، هزینه | Explain additional computation and tradeoffs behind the mode choice introduced in 3.2. Longer text is not proof of better reasoning; visible explanations are not a guaranteed faithful internal trace. Explain the limits of public benchmarks. | Move/qualify old 3.7; `TradeoffTriangle` and `thinking-text`. |

### Part 6 — پشت‌صحنهٔ دستیار و تصمیم‌های فنی

The purpose is informed understanding and selection, not an implementation tutorial. Each lesson answers a question a user might ask about the product they use.

#### Cluster A — ورودی و اتصال‌ها

| New ID | Learner-facing title | Reader outcome and required content | Source / visual |
|---|---|---|---|
| 6.1 | یک فراخوانی مدل از نزدیک | See the request/response representation of the familiar two-turn conversation. Distinguish message roles, tool requests, final replies, and calls versus turns. Label API syntax and response fields as illustrative where simplified. | Move old 4.1; `AnnotatedCode` and `messages-array`. |
| 6.2 | چیدمان کانتکست در پشت‌صحنه | Explain how the program selects instructions, history, notes, files, and results. Retain the prepared-input Lab; explicitly distinguish its toggles from live loading. Cover basic validation: valid format does not establish factual correctness or permission. | Technical half of old 4.3; `StackedBar` and the one existing Lab. |
| 6.3 | MCP: اتصال استاندارد، نه اجازهٔ نامحدود | Understand what connecting an external service changes. Retain the adapter analogy, but do not imply MCP is a single central service or limited to one line of tool metadata. Discovery and execution are separate. | Move old 2.3; `GraphMorph` and `mcp-fills-tools`. |

#### Cluster B — منبع، سازگارسازی و سنجش

| New ID | Learner-facing title | Reader outcome and required content | Source / visual |
|---|---|---|---|
| 6.4 | RAG: پاسخ با کمک منابع | Explain retrieval plus generation, with vector retrieval as one implementation. Distinguish automatic preparation from a model-requested search. Cover source dates, source permissions, conflicting versions, and index updates; retrieval is not a guarantee of evidence. | Move/deepen old 4.4; `FlowPipeline` and `rag-paste`. |
| 6.5 | تنظیم دستور، اتصال داده یا تغییر مدل؟ | Distinguish prompting, supplying context, retrieval, and fine-tuning. Fine-tuning can affect knowledge as well as behavior; it is generally not the first solution to keeping changing facts current. | Move/qualify old 4.5; retain `Ladder` and `where-it-changes`. |
| 6.6 | ارزیابی منظم و پس‌رفت | Extend personal checking to repeatable product assessment. Include multiple acceptable answers, task/state outcomes, repeated runs, representative cases, and cases held apart from prompt tuning. A small initial set is not proof of universal safety. | Move/deepen old 4.6; `DataTable`. |

#### Cluster C — بهره‌برداری و تصمیم

| New ID | Learner-facing title | Reader outcome and required content | Source / visual |
|---|---|---|---|
| 6.7 | هزینهٔ فنی: فراخوانی‌ها، توکن‌ها و کش | Explain usage costs behind subscriptions/quotas, repeated calls within one task, output costs, and caching conditions. Distinguish prompt-prefix caching from reusing a complete answer. Keep sample prices labelled, not provider promises. | Move technical material from old 5.2; retain `CostCalculator` and `cache-prefix`. |
| 6.8 | تزریق پرامپت و مرزهای واقعی دسترسی | Explain why retrieved material is not authorization, why role separation is not enforcement, and why external controls are required. Preserve request → denied execution → returned error, without deleting the request or exposing secret contents. | Move/deepen old 5.3; `SequenceFlow` and five-frame `injection`. |
| 6.9 | خرابی، بازیابی و ردگیری | Explain timeouts, bounded retries, partial work, uncertainty about whether an action happened, and safe fallback. Inspect state before repeating a consequential action. Connect user reports to traces, with privacy-aware logging and version information. | Move/deepen old 5.4; `DataTable` and `read-the-trace`. |
| 6.10 | پشت یک دستیار قابل‌اعتماد چه می‌گذرد؟ | Combine the architecture with the difference between a demo and a reliable service. Show the pieces as one possible architecture, not mandatory standalone services. Explain hidden integration/review work without presenting “demo = 20%” as a measured universal rule. | Consolidate old 5.1 + 4.7; `FlowPipeline` and `who-writes-what`. |
| 6.11 | استفاده، تنظیم، اتصال یا ساخت اختصاصی؟ | Broaden buy/build into use an existing product → configure → connect approved tools/data → build only when justified. Include ownership, domain review, support, privacy, and maintenance responsibilities; a normal user does not need an AI engineering team. | Consolidate old 6.2 + 6.3; retain `BranchDiagram`, concise role prose. |
| 6.12 | نقشه، یک بار دیگر: از استفاده تا فهم | Connect practical decisions to mechanisms and point back to the shared فهرست. Preserve the complete request/result recap. No repeated inline map or new “how to read” lesson. | Move old 6.4 and `recap`; no primary inline figure. |

## 4. Detailed acceptance contracts for the practical additions

These are the highest-priority new content. Existing technical text must not substitute for them.

### 3.1 — Task selection

- Include a conventional-tool alternative: exact arithmetic with a calculator, deterministic replacement with a standard editor, or a task requiring a qualified reviewer.
- “Can I verify it?” includes whether the reader has the knowledge or reviewer needed; do not assume a non-programmer can audit code unaided.
- Separate reversible exploration/drafting from execution with real consequences.
- Exit artifact: one bounded task the reader could sensibly try today.

### 3.2 — Assistant and mode selection

- Use capabilities rather than a fast-aging table of product buttons or model rankings.
- Show three independent questions: what can this mode do, what material can it access, and what may it execute?
- Contrast explaining an error, checking current documentation, inspecting a supplied screenshot, and changing the project.
- Discuss more computation as a tradeoff, not “always choose the strongest model.”
- Do not promise that search, uploaded-file support, or memory is enabled in every product/session.

### 3.3 — Sharing information

- Include an explicit path from the user's device to possible model provider, tool service, logs, and saved memory.
- Use a synthetic or redacted example; never include real credentials or personal data in teaching fixtures.
- State that retention/training-use terms depend on the service, account, contract, and settings; verify the applicable terms.
- Treat organization policy and permission as inputs before sharing, not a disclaimer at the end.

### 3.4 — A useful task brief

Use this pattern as a flexible aid, not mandatory incantation:

> هدف: دارک مود اضافه شود، بدون تغییر چیدمان.
>
> ابتدا تعریف رنگ‌ها و فایل‌های مرتبط را بررسی کن. قبل از ویرایش، برنامهٔ تغییر را توضیح بده.
>
> تغییر محدود بماند و تست‌های قبلی حفظ شوند. چیزی را منتشر نکن.
>
> در پایان بگو چه چیزی تغییر کرد، چه بررسی‌هایی اجرا شد و چه چیزی قابل‌بررسی نبود.

- Present the brief as a request, not a security mechanism; actual authority controls remain in 4.2/6.8.
- Include one case where clarification is better than elaborating the prompt.
- Explain how an example output helps specify a deliverable without proving the factual content of a future answer.

### 3.5 — Seen material versus assumed material

- Distinguish access → read/extraction → relevant evidence → interpretation.
- Include one failure where the missing constraint, omitted page, or stale source is the problem—not the prompt's style.
- Show how to ask for relevant excerpts, page references, file paths, timestamps, or test outputs. A self-report of reading is not independent evidence.
- Give a clean-conversation handoff: goal, constraints, material, decisions, verified work, and remaining questions.
- Explain possible summary loss in ordinary language here; explain token limits and compaction mechanics in 5.3.

### 3.6 — Multi-turn collaboration

Show a complete short exchange that contains a correction, for example:

> «تغییر پیشنهادی از درخواست من گسترده‌تر است. چیدمان فعلی بماند؛ فقط دارک مود اضافه شود. برنامه را با همین محدودیت اصلاح کن و هنوز فایل را تغییر نده.»

- Distinguish revising a plan from repairing already-applied changes.
- Keep the original goal and acceptance criteria visible during the revision.
- Prefer a static, labelled conversation over a decorative actor sequence: message order and participant communication are different representations.
- Exit artifact: a usable, specific follow-up message—not “try again.”

### 4.1 — Verification

- Facts: check an appropriate source and date.
- Summaries: trace important statements back to the supplied material and identify omissions.
- Interpretations/recommendations: inspect assumptions, alternatives, and tradeoffs.
- Calculations: recompute using a suitable independent method.
- Actions: inspect actual changed state, not just the final assistant message.
- Explicitly teach: proposed edit ≠ applied edit ≠ tested change ≠ all requirements satisfied.
- Another assistant's agreement can be useful feedback, but shared mistakes are possible; agreement is not verification.
- Scale checking to consequences. If reliable review is unavailable, narrow the task or obtain competent human help.

### 4.2 — Authority

- Read, edit, run a کامند, install dependencies, publish, and delete are separate decisions.
- Before approving, inspect the action, target, affected scope, data destination, and reversibility.
- Include an example that permits reading but requires approval before writing/publishing.
- Model instructions do not enforce access limits; use real product permission controls where available.
- Provide checkpoints without suggesting that clicking every approval automatically makes execution safe.

### 4.3 — Stopping and recovery

- Show legitimate endings: complete, clarify, blocked, hand back, and stop at a defined budget.
- Bound attempts/time/spending according to product support and user oversight; a written request alone may not impose a hard limit.
- Cancellation can stop future work while leaving earlier changes intact; inspect state and use an appropriate backup/version/recovery mechanism.
- A timeout does not establish that nothing happened. Do not blindly retry a consequential action.

### 4.4 — Reusable routines

- Contrast a saved prompt template, project/personal instruction, memory preference, and skill. Tie back to their existing definitions.
- Save stable procedure/preferences separately from facts with sources and dates.
- Include four transfer patterns: learning/understanding, drafting/revision, research/evidence, and coding/delegation.
- No required live accounts, API keys, installation, or new skill-authoring tutorial.

### 4.5 — Personal value

- Count briefing, generation/waiting, verification, correction, subscription/usage costs, and reviewer time.
- Compare acceptable completed work against the baseline, not response speed or volume of generated text.
- Include a case where AI is not beneficial because checking/correction costs exceed the saving.
- Explain a simple repeatable personal comparison before formal product evaluation in 6.6.

### 4.6 — Practical synthesis

- Work through one coherent example: choose task/capability, apply sharing rules, brief, inspect evidence, revise, authorize a bounded action, check the result, and decide whether it helped.
- Use OpenCode/Hermes-style coding assistance for the primary worked trace; make every check understandable without reading source code.
- Include an alternative outcome in which the reader correctly stops because evidence, permission, or qualified review is missing.
- End with a compact reference card: **انتخاب کار → انتخاب قابلیت → اشتراک امن → درخواست روشن → گفت‌وگو → بازبینی پیشنهاد → اجازهٔ محدود و اجرا، اگر لازم است → بررسی نتیجه → سنجش فایده**.
- This is useful content and a stopping point, not a restored reading-instructions section.

## 5. Complete old-to-new migration map

Every current lesson is accounted for. “Split” means distinct user and mechanism treatments, not copied paragraphs in two locations. “Consolidate” retains the useful ideas while removing a redundant lesson boundary.

| Current ID / slug | Proposed destination | Migration decision |
|---|---|---|
| 1.1 `what-ai-does-today` | 1.1 | Reframe scope and qualify limitations. |
| 1.2 `three-layers` | 1.2 | Retain three layers, roles, turn convention, and conversation lens. |
| 1.3 `the-running-example` | 1.3 | Retain the general coding-assistant thread. |
| 2.1 `from-chatbot-to-agent` | 2.1 | Focus on capability/behavior rather than a rigid interface label. |
| 2.2 `tools` | 2.2 | Preserve accurate three-participant sequence and request/result distinction. |
| 2.3 `mcp-standard-socket` | 6.3 | Move connector internals behind the practical course. |
| 2.4 `skills` | 2.3; practical callback 4.4 | Preserve explicit skill loading, teach reuse later without duplication. |
| 2.5 `memory` | 2.4; practical callbacks 3.5/4.4 | Retain distinction between history and saved notes. |
| 2.6 `workflow-or-agent` | 2.5 | Reframe as choosing a work pattern rather than building it. |
| 2.7 `coding-agents` | 2.6 | Preserve the explicit test trace; add bounded stopping language. |
| 2.8 `agent-anatomy` | 2.7 | Retain synthesis, qualify optional components. |
| 3.1 `next-word-prediction` | 5.1 | Move after effective-use material. |
| 3.2 `tokens` | 5.2 | Move; retain model-specific tokenizer caveats. |
| 3.3 `context-window` | 5.3; user actions in 3.5 | Separate capacity/compaction mechanism from daily context habits. |
| 3.4 `how-models-are-built` | 5.4 | Move and qualify the simplified pipeline. |
| 3.5 `hallucination` | 5.5; early practical definition 4.1 | Explain verification before the generative mechanism. |
| 3.6 `model-weaknesses` | 5.6 | Move; brief consequences already inform 3.1/4.1. |
| 3.7 `reasoning-and-tradeoffs` | 5.7; basic mode choice 3.2 | Separate choosing a mode from its computation details. |
| 4.1 `api-call-anatomy` | 6.1 | Keep illustrative syntax and the same two-turn example. |
| 4.2 `prompts` | 3.4 | Rewrite as a task brief, not a role-first recipe. |
| 4.3 `context-engineering` | 3.5 + 6.2 | Split everyday access/evidence habits from technical assembly and the existing Lab. |
| 4.4 `rag` | 6.4 | Move; strengthen source lifecycle, permissions, and retrieval caveats. |
| 4.5 `finetune-or-rag` | 6.5 | Move; correct absolute knowledge-versus-behavior claims. |
| 4.6 `evaluation` | 6.6; practical derivatives 4.1/4.5 | Keep formal comparison late; teach verification/personal benefit earlier. |
| 4.7 `demo-to-product` | 6.10 | Consolidate with architecture; remove the universal 20% claim. |
| 5.1 `production-architecture` | 6.10 | Consolidate; frame as one architecture behind a product. |
| 5.2 `cost` | 6.7; practical derivative 4.5 | Keep token/cache accounting late; total personal cost comes first. |
| 5.3 `security` | 6.8; practical derivatives 3.3/4.2 | Keep injection mechanism late; sharing/authority guidance comes before use. |
| 5.4 `reliability` | 6.9; practical derivative 4.3 | Keep trace analysis late; stopping and recovery habits come first. |
| 6.1 `where-value-is` | 3.1 | Move earlier and adapt from investment quadrants to task selection. |
| 6.2 `build-or-buy` | 6.11 | Broaden to use/configure/connect/build. |
| 6.3 `team-and-skills` | 6.11 | Consolidate as responsibility/ownership, not a team-building prerequisite. |
| 6.4 `the-map-again` | 6.12 | Preserve final recap; practical path gains its own synthesis at 4.6. |

New teaching units not supplied by a simple move: 3.2, 3.3, 3.6, and 4.1–4.6. Several draw on existing ideas but need new worked examples and user-facing outcomes. 3.5 is the user-facing half of the context split, not another capacity lesson.

## 6. Terminology and prerequisite plan

Do not defeat `not_before` by disabling it or using unexplained jargon in the practical section. Introduce a basic concept when the reader first needs it, then deepen it later using the short form.

### Proposed first introductions

- **1.2:** model, LLM, harness, context, system prompt, turn. Preserve `system → user → assistant → user → assistant`; system is not a user turn and `assistant` is a message role. Briefly distinguish application/user instructions from quoted source material: a document's contents are not automatically a new user request or permission. Deepen this boundary in 3.4, 4.2, and 6.8.
- **2.1:** agent and chatbot.
- **2.2:** tool calling and function calling, with simple labels before illustrative requests.
- **2.3:** skill. **2.4:** memory and statelessness. **2.5:** workflow.
- **3.1:** cost at the level of time, review effort, and money, deepened in 4.5 and 6.7. Avoid unnecessarily delaying a common term used in task choice.
- **3.2:** reasoning as additional work/computation for a difficult task; 5.7 then explains computation and benchmarks without re-glossing it.
- **3.3:** data leakage and a minimal practical definition of training, because the reader must understand possible training use of submitted data before deciding to share it. A simple explanation that training changes the model is sufficient here; its stages and mechanics wait until 5.4.
- **3.4:** prompt and few-shot examples, retaining the existing useful glossary concepts without forcing examples into every request.
- **4.1:** hallucination at a practical level. **4.2:** least privilege. **4.5:** a simple definition of evaluation; formal evaluation is deepened in 6.6. Regression remains in 6.6.
- **5.1:** inference. **5.2:** token. **5.3:** context window. **5.4:** pretraining, fine-tuning, alignment, RLHF; deepen the already-introduced training concept. **5.7:** benchmark.
- **6.1:** API and temperature. **6.2:** context engineering. **6.3:** MCP. **6.4:** RAG, chunking, embedding, vector database, semantic search. **6.7:** caching. **6.8:** prompt injection and guardrail. **6.9:** observability, tracing, latency, non-determinism. **6.10:** gateway and orchestrator.

Preserve preferred running vocabulary: **ایجنت، ورک‌فلو، کانتکست، ظرفیت کانتکست، چیدمان کانتکست، دارک مود، کامند، نوبت**. Prefer «ترمینال» to the awkward «خط کامند». No unexplained product-specific command names.

### Context block introduction gates

Recompute `introducedIn` by actual first use after the moves, not by applying one blind numeric substitution:

- `system`, `user`, `assistant`: 1.2.
- `tools`, `tool_call`, `tool_result`: 2.2.
- `skill_menu`, `skill`: 2.3.
- `memory`, `history`: 2.4.
- `summary`: 5.3 unless a new earlier widget genuinely renders a summary block; plain-language handoff examples do not require that block kind.
- `thinking`: 5.7; keep the disclaimer that this is an illustrative plan, not a captured internal trace.
- `retrieved`: 6.2 because the prepared-input Lab already includes source material before the formal RAG lesson. Use a descriptive Persian block label; introducing supplied document text does not require teaching vector retrieval early.
- `injected`: 6.8.

Update `<Term>` calls, frontmatter, `lessons.ts` terms, glossary entries, concept-map destinations, frame narration, and block labels together. Early references to ordinary education should continue using the narrow tested glossary policy; do not add blanket lesson exemptions.

Run a prerequisite audit on the actual authored prose and figure/Lens text. A practical privacy sentence about training must not be blocked simply because the detailed training lesson is later. Conversely, moving a definition earlier is not permission to pull the whole technical treatment into the practical stage. Use the current validator behavior as an implementation constraint, including ordinary-word collisions such as «هزینه» and «آموزش».

## 7. Examples and figures

### Example policy

- Keep OpenCode/Hermes-style coding assistance as the main agent-mechanics thread; do not replace it with shopping support or one mandatory fictional project bug.
- Use small independent fixtures. Their paths and tool names remain illustrative, not claims about either product's actual API.
- Add short transfer examples for learning, writing, source-based research, and document work. They supplement the main thread, not create several competing narratives.
- No requirement for code literacy, a paid account, live internet access, or a real model call to understand the book.
- No provider ranking or price table presented as timeless. Service-specific privacy and mode behavior must be qualified and checked against the applicable product when authored.

### Representations that must remain distinct

1. **Messages in context:** ordered roles and user/assistant turn pairs.
2. **Participants communicating:** user, agent, model; harness and execution belong inside the agent lane.
3. **Process stages:** a user's brief, feedback, approval, and verification actions.
4. **Prepared snapshots:** the Lab's authored input comparison, explicitly not live loading.

Never use an actor sequence to imply a file reads itself or that a model's tool request has already executed. Every claimed read/edit/test has its returned evidence; a denied request stays in history with an error result. Program-driven preparation remains distinct from model-requested execution.

### Reuse rather than multiply widgets

- Retain the 20 existing Lens keys; move hosts as specified in the migration map. The Lab moves from old 4.3 to new 6.2.
- Use normal readable HTML and existing `CardGrid`, `LayerStack`, `SplitCompare`, `Ladder`, `LoopTrace`, `BranchDiagram`, `Matrix2x2`, and `DataTable` for practical lessons.
- Add a shared static conversation-example primitive only if existing components cannot make the targeted feedback exchange clear. No typing animation, hidden answers, or live model dependency.
- Every new main-track lesson is understandable without a control click. A concise static summary must carry essential learning even where a retained stepper offers detail.

## 8. Repository implementation work

### 8.1 Curriculum metadata and content

- Update `docs/curriculum.md` into the 41-lesson authoring contract, including objectives, source provenance, figure choices, term introductions, and realistic word ceilings.
- Update `src/data/lessons.ts`: six revised Part titles/promises, 41 lesson records, new order, objectives, and aligned terms.
- Add explicit three-stage metadata, referencing Parts 1–2, 3–4, and 5–6. Keep stage identity separate from Part number.
- Move/rewrite/add files in `src/content/lessons/` using an explicit migration map and temporary staging names where numeric renames collide. Do not globally replace strings such as `2.4`.
- For consolidations, transfer useful concepts before removing superseded lesson files; keep reusable figure components unless there is an independent reason to remove them.
- Update `glossary.yml`, `src/data/glossary.ts` only if its schema needs adjustment, `src/data/context/kinds.ts`, and `allowed-latin.txt` as necessary.
- Remap `src/data/context/lenses.ts`, `lab.ts`, `blocks.ts`, `conversation.ts`, `traces.ts`, and all `lessonRef` values. Preserve explicit skill loading and the two distinct test-run exchanges.
- Update figures and generated-example data only where their captions, teaching claims, or references change.
- Keep explicit `.ts` extensions for runtime imports used by Node validation scripts. Preserve the recent build fixes and regression tests.

### 8.2 Navigation and reading-position compatibility

Renumbering is not just a text operation: current lesson anchors and saved positions encode numbers. For example, old `lesson-3-1` means next-word prediction, whereas proposed 3.1 is task selection.

Before renumbering:

1. Introduce stable content identities derived from lesson keys/slugs; treat displayed lesson numbers as presentation/order.
2. Prefer stable, nonnumeric canonical lesson anchors. Preserve existing numeric fragments as explicit legacy aliases to the **same content**, not to a different new lesson with the reused number.
3. Apply the same separation to figure identity/display numbering if preserving numeric figure deep links; update caption helpers and validator assumptions deliberately rather than creating duplicate IDs.
4. Migrate saved `ReadingPosition.section` and saved hashes using the old-to-new content map. If rewritten content makes its child index unsafe, resume at that lesson's beginning rather than at an unrelated paragraph.
5. Explicit incoming links still outrank saved position. Do not let aliases or migration scroll logic override a user's newer navigation.
6. Preserve normal refresh, offline reopening, font/layout settling, blocked-storage behavior, and print handling.

Relevant files include `src/lib/format.ts`, `src/components/shell/Lesson.astro`, `FigureShell.astro`, `Caption.astro`, `TocMap.astro`, `TocDrawer.astro`, `PartDivider.astro`, `src/scripts/reading-position.ts`, navigation/progress scripts, and references rendered by Context blocks and figure components.

### 8.3 Stages, Parts, and concept navigation

- Retain six Part colors, the existing searchable فهرست, and the single progress rail.
- Show stage labels in existing Part dividers and group Parts in the فهرست without adding tabs, pagination, new required modals, or repeated maps.
- Replace misleading semantic zones such as `build`/`decide` where necessary. Suggested six zone IDs: `overview`, `agents`, `practice`, `judgment`, `model`, `systems`. Audit all `ZoneId` consumers rather than changing labels alone.
- Concept links should lead to the actual introducing lesson, which may be in the practical stage even when the concept also appears in technical Part 5/6.
- Revisit the current `TocMap.astro` assumption that one concept zone corresponds to one Part; use the new grouping explicitly and avoid dropping concepts introduced earlier.
- Derive cover, lesson, figure, and concept counts from canonical data where practical. Do not leave “33 lessons” or old lesson destinations in the reader-facing output.

### 8.4 Documentation, schemas, and validation

- Update `README.md`, `PLAN.md`, `PLAN-CONTEXT.md`, `docs/takeaways.md`, `docs/terminology.md`, `docs/figures.md`, `docs/design-system.md`, and relevant authoring guidance to reflect the new primary outcome and current counts.
- Mark historical phase counts as historical instead of rewriting unrelated archival instructions wholesale.
- Audit `src/content.config.ts` and ID validation, especially if stable content/figure IDs are separated from display numbering. Keep support for lesson numbers such as 6.12.
- Update `scripts/check-skeleton.ts`, `check-glossary.ts`, `check-context.ts`, and `check-budget.ts` to validate the new contract. Prefer deriving counts from metadata over introducing new hardcoded totals.
- Keep six Part expectations intentional; there are three stages but still six Part dividers.
- Update `_context-gallery.astro` and `_figures-gallery.astro` examples/references affected by the migration.
- Do not touch unrelated work, including the currently untracked `further-reading-report.md`, as part of this plan or curriculum migration.

## 9. Implementation sequence and deliverables

### Phase A — Freeze the target contract

- [x] Confirm the six-Part/three-stage syllabus in this document as the implementation baseline.
- [x] Convert the target syllabus into the canonical curriculum and term-introduction ledger.
- [x] Record a complete machine-readable old identity → new display number/identity map for lessons, figures, and Lens hosts.
- [x] Set prose ceilings and choose one primary figure per lesson, except the final map recap. New practical lessons should not consume new interactive controls by default.

**Deliverable:** one internally consistent target contract before bulk authoring or file renames.

### Phase B — Prepare identity and navigation migration

- [x] Separate stable content identity from displayed numbering and migrate old hashes/saved positions.
- [x] Add stage metadata and minimal existing-shell labels.
- [x] Audit all numeric references and semantic-zone consumers.
- [x] Perform renames with a mapping-aware process, not chained text replacements.

**Deliverable:** the new order can be rendered without silently misdirecting links or reading progress.

### Phase C — Author the practical path first

- [x] Write/rewrite Parts 3 and 4 in reading order, using the detailed acceptance contracts.
- [x] Produce the targeted multi-turn feedback example, evidence comparison, authority ladder, recovery branch, and personal-value comparison.
- [x] Build the 4.6 worked synthesis and practical reference card.
- [x] Check manually that these lessons require no knowledge of tokens, APIs, vector databases, or deployment architecture.

**Deliverable:** a coherent user course ending at 4.6. Do not postpone this to focus on more technical detail.

### Phase D — Adapt the opening and remap technical depth

- [x] Rewrite the opening outcomes and Part promises around informed use.
- [x] Preserve agent basics while moving MCP later.
- [x] Apply the Part 5/6 moves and two consolidations.
- [x] Correct overly categorical claims about innovation, context eviction, training stages, fine-tuning, reasoning, and demo effort.
- [x] Update every retained Context widget's labels, host, term gates, and cross-references.
- [x] Complete current documentation and takeaway updates.

**Deliverable:** one continuous manuscript whose first two stages stand alone, with deeper explanation after them.

### Phase E — Batch verification and release

Run the verification batch after the substantive migration, rather than rebuilding/testing after every small prose edit. The original planning-only task ran no checks; implementation and repair batches are now completed.

- [x] Run `node --test scripts/persian-term.test.ts` and focused new migration/reference tests.
- [x] Run `npm run build` with the full prebuild and post-build checks; do not use direct Astro builds to bypass validation at acceptance.
- [x] Confirm 41 lessons, six Parts, three stages, 20 retained Context Lenses and one Lab, and correct derived counts. If implementation intentionally changes these, update the canonical contract and report the difference.
- [x] Check all internal links, legacy aliases, glossary destinations, Lens references, and figure captions for collisions/misdirection.
- [x] Check local-file opening, current and legacy deep links, reading-position migration/reload, explicit-link priority, viewport changes, and blocked storage.
- [x] Check desktop/mobile, RTL/LTR mixed role sequences, long titles, keyboard navigation, print, no-JS, and reduced motion.
- [x] Verify the single offline `dist/index.html`, no required network assets, and the existing size targets.
- [x] Review the main practical path without opening optional detail or pressing any figure controls.

**Deliverable:** rebuilt offline book plus a concise report of checks, remaining warnings, and any intentionally deferred topics.

## 10. Definition of done

The revision is complete only when:

1. The actual reading order is **overview/agents/basics → effective use → internals**; renaming headings while retaining the old order is insufficient.
2. Task selection, safe sharing, a useful brief, dialogue repair, verification, and authority control are taught before technical APIs and system design.
3. The reader can finish at 4.6 with a useful complete method, not an unfinished prerequisite sequence.
4. Every old lesson has a deliberate destination or consolidation, and no recently corrected mechanism is lost.
5. Verification is distinct from model confidence, sources are checked for support, and actions require execution evidence.
6. Privacy advice arrives before substantial sharing; approval advice distinguishes permissions and does not promise cancellation is rollback.
7. Product capabilities, privacy terms, mode names, and sample prices are qualified instead of presented as universal or timeless.
8. A model call is not a user turn; a tool definition is not a read; skill metadata is not full instructions; a requested action is not a completed one.
9. Navigation, saved progress, offline behavior, and accessibility remain intact through reordering.
10. The full build passes without disabling terminology, evidence, or budget validation.

## 11. Deliberately deferred additions

Do not let these delay the user-first revision:

- Multi-agent/subagent orchestration internals. A short mention may be added later once a single-agent work pattern is clear.
- A dedicated advanced structured-output lesson. Include the essential format/fact/permission distinction in 6.2 first.
- Standalone multimodal internals. Cover capability selection and interpretation/extraction risks in 3.2/3.5 now.
- A provider/model comparison catalog, screenshots of rapidly changing buttons, or step-by-step product setup tutorials.
- A large prompt library, mandatory quizzes, live-model exercises, or a new display-mode system.
- A formal enterprise pilot/governance module. The practical personal-value lesson and late product-assessment material cover the necessary first steps.

The organizing test for future additions is: **does this help the reader choose, ask, supply, steer, verify, authorize, or understand something they actually encounter?** If not, it is secondary to this plan.
