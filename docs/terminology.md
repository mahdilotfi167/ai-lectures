# Persian content rules and terminology

Binding rules for every lesson. `glossary.yml` is the machine-readable companion; `scripts/check-glossary.ts` enforces most of what follows.

---

## 1. Write natively

**Do not translate.** The skeleton (lesson order, figure, section shape, word budget) is fixed; the *prose is authored in Persian from the objective*.

Working method per lesson:

1. Read `objective_fa` and the figure spec in `docs/curriculum.md`.
2. Read the previous lesson's `◆ در یک جمله` so the opening connects.
3. Write the hook: 2–3 sentences posing the problem the figure answers.
4. Write the body explaining the figure's mechanism.
5. Write the one-line takeaway.

**Prohibited**: English-syntax calques. Specifically watch for:

| Avoid | Prefer |
|---|---|
| «این به شما اجازه می‌دهد که...» (allows you to) | «با این کار می‌توانید...» |
| «در پایان روز...» (at the end of the day) | «در نهایت...» |
| «ما نیاز داریم که مطمئن شویم...» | «باید مطمئن شویم...» |
| long chained relative clauses | two short sentences |
| passive voice by default | active voice |

Examples may be localized where it carries meaning (5.2's illustrative Persian token boundaries). Keep general coding assistants such as OpenCode/Hermes as the recurring mechanics example; writing, learning, research and document examples supplement it. Do not substitute shopping support or one obligatory fictional project bug.

---

## 2. Sentence and paragraph rules

- **Sentence length ≤ 22 words.** Persian tolerates longer sentences than English, but this audience does not.
- **One idea per paragraph**, 2–4 sentences.
- **Concrete before abstract**: example → name → definition. Never the reverse.
- **Analogies must be cashed out.** Every analogy is followed by one literal sentence. Pattern: «مثل یک کتابدار است که ... . در عمل، سیستم ابتدا در میان اسناد جست‌وجو می‌کند و نتایج را به مدل می‌دهد.»
- **No undefined jargon.** Mechanically enforced by `not_before`.
- **No hype**: avoid «انقلابی», «جادو», «به‌زودی همه‌چیز را تغییر می‌دهد». Contested claims are labeled: «در این مورد اتفاق‌نظر نیست».
- **Address the reader as «شما»**, consistently. Never «کاربر» for the reader.
- **No rhetorical questions in the body.** The hook may ask one; the body answers.

---

## 3. Glossary schema

```yaml
- id: context-window                 # kebab-case, stable, referenced by <Term id="...">
  en: Context window
  fa: ظرفیت کانتکست
  style: translate-plus-latin        # translate | transliterate | keep-latin | translate-plus-latin
  first_use: ظرفیت کانتکست (Context Window)
  short: ظرفیت کانتکست
  not_before: "5.3"
  def_fa: حداکثر اندازهٔ کانتکست؛ مدل در یک فراخوانی بیشتر از این نمی‌بیند.
  def_en: The maximum amount of context a model can consider in a single pass.
  status: confirmed                  # proposed | confirmed
  aliases: [context length]
  zone: model                        # concept-map zone
```

Field notes:

- **`style`** — `keep-latin` keeps the Latin acronym as the running form (LLM, MCP, RAG, API). `translate-plus-latin` uses Persian with a Latin gloss on first use. `transliterate` writes the English word in Persian script (توکن, پرامپت).
- **`first_use`** — the exact string at the term's first appearance. Rendered by `<Term>`.
- **Presentation punctuation** — do not wrap terms or labels in quotation marks. Use one pair of parentheses for a first-use gloss, never nested parentheses around `<Term>`. Reserve quotation marks for actual quoted speech or sample text.
- **`short`** — every later appearance.
- **`not_before`** — the current display lesson number where the term is introduced. Appearing earlier is a build failure. Introduce a minimal practical meaning when needed; deepen it later without re-glossing.
- **`def_fa`** — concise and understandable standalone. Used in the shared navigation map, so it must read well out of context.
- **`aliases`** — surface forms the validator should also catch (including the ZWNJ-less spelling).

---

## 4. Validator rules — `check-glossary.ts`

All four fail the build.

### Rule 1 — `not_before`

For each term, scan lessons in order. If `fa`, `en`, `short`, or any alias appears in a lesson with `id < not_before` → **fail**.

The prose and Context validators share `scripts/lib/persian-term.ts`. For `training`'s Persian form «آموزش» only, the bounded phrases «آموزش یک محصول», «شکل آموزشی», and «مرزها آموزشی‌اند» describe teaching material and do not count as model training. Other occurrences in the same text, bare «آموزش», training compounds, technical «داده‌های آموزشی», and Latin `Training` remain checked. These are phrase-level exceptions, not lesson-level exemptions. Regression cases run with `node --test scripts/persian-term.test.ts`.

> *Exception*: `src/data/concept-map.ts` is exempt. The shared navigation map deliberately shows words the reader does not know yet so they can find the introducing lesson (`PLAN §6.2`). The exemption is scoped to that file only, never to lesson prose.

The short temperature noun «دما» uses word boundaries plus ordinary suffixes (دمای، دماها، دماهای), not embedded substring matching in unrelated words such as «چیدمان» and «خدمات». Actual temperature mentions and its Latin form remain gated. Regression tests cover both positive and negative cases; no lesson exemption is involved.

### Rule 2 — first use

The first occurrence at or after `not_before` must be `<Term id="..." />` (which renders `first_use`). Every later occurrence must be `short`. Catches both never-glossing and re-glossing.

### Rule 3 — unknown Latin

Any Latin-script token of ≥3 characters appearing in Persian prose that is **not**:

- a glossary `en` / `first_use` fragment, or
- listed in `allowed-latin.txt`, or
- inside `<Ltr>`, `<Code>`, or a fenced code block

→ **fail**. This forces every acronym and product name through the glossary or an explicit allowlist.

`allowed-latin.txt` seeds with product names including `OpenCode` and `Hermes`, common protocols/formats, and teaching identifiers such as `readFile`, `editFile`, `runCommand`, `getIssue`, `messages`, `FAIL`, `PASS`, `src/utils.ts`, and `utils.test.ts`. The illustrative tool names are not the actual API contract of either product.

### Rule 4 — unconfirmed terms

Any term with `status: proposed` → fails the **release** build (Phase 5) but not dev builds. Lets authoring proceed while keeping the gate honest.

### Warnings (non-blocking)

- Known compound written without ZWNJ (`میشود`, `ورکفلو`).
- A term defined in the glossary but never used in any lesson — dead vocabulary, probably should be cut.
- Sentences over 22 words.
- Latin digits in prose outside an LTR island.

---

## 5. The `<Term>` component

```mdx
<Term id="context-window" />        {/* first_use or short, chosen automatically */}
<Term id="rag" form="short" />      {/* force short — rare, e.g. inside a heading */}
```

The component renders `first_use` by default. Later calls must specify `form="short"`, or use ordinary short-form prose. The validator catches missing introductions and re-glossing; authors must keep metadata and actual first use aligned.

It also sets `data-term="<id>"`. Concept destinations come from the glossary introduction, not a term's historical technical classification.

---

## 6. Term decisions

### 6.1 Confirmed from the brief

All 23 terms from the brief are seeded in `glossary.yml` with the proposed Persian forms and styles.

### 6.2 The two "decide" terms

Resolved in Phase 0 by the native technical reader. Recommendations:

**Harness** → `چارچوب اجرا (Harness)`, `translate-plus-latin`.
Rationale: no established Persian term exists. "چارچوب اجرا" is descriptive and accurate, and the Latin gloss anchors it because readers will encounter "harness" in English tooling and documentation. Rejected: «محیط اجرا» (collides with *runtime environment*), «مهار» (literal but opaque).

**Guardrail** → `گاردریل (Guardrail)`, `transliterate` with first-use gloss.
Rationale: transliteration is already current in Persian technical speech. «حفاظ» is understandable but reads as physical safety equipment, which misleads in a security lesson. Rejected: «ریل محافظ» (clumsy), «محدودکننده» (too generic).

### 6.3 Additional terms the curriculum needs

All 50 current terms are confirmed. The complete introduction ledger is `glossary.yml`; selected practical-to-technical dependencies follow:

| EN | FA | Style | `not_before` |
|---|---|---|---|
| Model | مدل | translate | 1.2 |
| Chatbot | چت‌بات | transliterate | 2.1 |
| Function calling | فراخوانی تابع | translate | 2.2 |
| Stateless | بی‌حافظه / بدون وضعیت | translate | 2.4 |
| Context | کانتکست | transliterate | 1.2 |
| Turn | نوبت | translate | 1.2 |
| System prompt | دستور سیستم | translate | 1.2 |
| Training | آموزش | translate | 3.3 |
| Pre-training | پیش‌آموزش | translate | 5.4 |
| Alignment | هم‌راستاسازی (Alignment) | translate-plus-latin | 5.4 |
| RLHF | RLHF | keep-latin + gloss | 5.4 |
| Reasoning | استدلال | translate | 3.2 |
| Temperature | دما (Temperature) | translate-plus-latin | 6.1 |
| Few-shot | چند-نمونه (Few-shot) | translate-plus-latin | 3.4 |
| Context engineering | چیدمان کانتکست | translate | 6.2 |
| Chunking | تکه‌تکه‌کردن (Chunking) | translate-plus-latin | 6.4 |
| Vector database | پایگاه دادهٔ برداری | translate | 6.4 |
| Semantic search | جست‌وجوی معنایی | translate | 6.4 |
| Regression | پس‌رفت (Regression) | translate-plus-latin | 6.6 |
| Orchestrator | هماهنگ‌کننده (Orchestrator) | translate-plus-latin | 6.10 |
| Gateway | دروازه (Gateway) | translate-plus-latin | 6.10 |
| Caching | کش‌کردن | transliterate | 6.7 |
| Data leakage | نشت داده | translate | 3.3 |
| Least privilege | کمترین دسترسی | translate-plus-latin | 4.2 |
| Tracing | ردگیری (Tracing) | translate-plus-latin | 6.9 |
| Latency | تأخیر (Latency) | translate-plus-latin | 6.9 |
| Non-determinism | غیرقطعی‌بودن | translate | 6.9 |
| Cost | هزینه | translate | 3.1 |
| API | API | keep-latin + gloss | 6.1 |

**`context` vs `context-window`.** `context` (کانتکست, 1.2) is the input of one call. `context-window` (ظرفیت کانتکست, 5.3) is its size limit. The practical stage teaches supplying relevant material and recovering omitted constraints without token mechanics. The technical eviction example is one program policy, not universal behavior.

**Privacy before training mechanics.** The reader must understand possible training use before sharing in 3.3. Define it minimally as changing the model, then deepen it in 5.4. Cost begins with time/review/money in 3.1; evaluation begins personally in 4.5. Do not bypass glossary gates or pull an entire technical lesson forward.

**Preferred vocabulary.** Use ایجنت، ورک‌فلو، کانتکست، ظرفیت کانتکست، چیدمان کانتکست، دارک مود، کامند، نوبت and ترمینال. Keep source text distinct from authorization and permissions distinct from written requests.

**Turn convention.** In this book, «نوبت» runs from a fresh user message to the assistant's final reply. A turn can contain multiple model calls and tool executions; do not use «نوبت» as a synonym for a model call. A `system` instruction is outside the user/assistant turn pairs. `assistant` is a message role, not a fourth participant beside the user, agent, and model. The simple two-turn example has five stored messages (`system → user → assistant → user → assistant`), but only four input messages before the second answer is generated.

**History vs saved memory.** History includes both user messages and assistant replies. A separate memory note stores selected facts; it is not necessary if the relevant earlier messages are already in context. Neither mechanism requires the model itself to retain state between calls.

---

## 7. Numbers

- Persian digits in prose, headings, lesson numbers, figure labels.
- Latin digits in code, JSON, API fields, and measurement tables (per-column `digits="latin"`).
- Large numbers in prose get a Persian thousands separator: `۱۰٬۰۰۰`.
- Prices and technical token counts in 6.7 use Latin digits in measurement columns, with a visible note that prices are illustrative and change.
- Percentages: `۳۰٪` with the Persian percent sign.

---

## 8. Code in lesson prose

- Illustrative only. **Never required** to follow the main track.
- Always Latin, always LTR, always in `<Code>` or `<AnnotatedCode>`.
- Always ≤ 15 lines.
- Always followed or annotated in Persian. Code is never left to speak for itself.
- Hand-written fixtures, never live API output. Any "response" is labeled «نمونه» (sample) — the document makes no live calls (PLAN §9).

---

## 9. Review checklist (native reader, per lesson)

- [ ] Reads as originally-written Persian, not as a translation.
- [ ] No sentence over 22 words.
- [ ] Every term's first use is glossed via `<Term>`; later uses are short.
- [ ] No term used before its `not_before`.
- [ ] ZWNJ correct in all compounds.
- [ ] `«»` for quotes; `،` `؛` `؟` for punctuation.
- [ ] Latin identifiers inside prose are isolated with `<Ltr inline>`.
- [ ] Persian digits in prose; Latin digits only inside LTR islands.
- [ ] Figure `desc` is a genuine description, not a repeat of the caption.
- [ ] Caption states the takeaway, not the figure's contents.
- [ ] Main track is complete and coherent with all asides collapsed.
- [ ] Opening sentence connects to the previous lesson's takeaway.
