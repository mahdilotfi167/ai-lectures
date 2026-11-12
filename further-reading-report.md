# Further-reading index — AI Lectures

**Snapshot:** `master` at `cc7b87b4ee26825731a98af651cbae9955b7536d` (fetched November 11, 2026). Based on `docs/curriculum.md`, `src/data/lessons.ts`, and the 33 current MDX lessons. **Scope:** six parts, 33 lessons, 146 curated resource placements (119 distinct indexed destinations, plus two verification companions). This is a separate research report; the lecture content has not been edited.

**How to use:** Start at your lesson number. Each reading or video is tagged with publisher, format, difficulty and the precise concept it helps explain. The links are direct destinations; numbered references at the end provide an auditable source index. An optional video or advanced paper is not a prerequisite. For actual API implementation, check the living provider documentation again; examples and pricing can change.

**Editorial checks before using the readings to revise the course:**

- Lesson 1.1's categorical “no real novelty” claim needs qualification: a first-party case report describes a novel, testable biological finding, but it does not prove autonomous end-to-end discovery.[4]
- Lesson 3.3's illustration of old context falling away describes one application strategy, not an automatic rule of every API; long requests can be rejected, truncated, cleared, or compacted differently.[51][52]
- Lesson 3.2's Persian/English token comparison is model- and tokenizer-dependent; measure your own equivalent text before asserting a multiplier.[46][50]
- Lesson 4.7's 20/80 split is an illustration rather than a measured industry ratio; Part 6's quadrant/branch/four-role devices are the course's syntheses, not standardized decision rules.[111]
- For 5.3, tool permissions and human review must be enforced outside the model; layered controls reduce exposure without guaranteeing injection prevention.[91]

---
## Part 1 — تصویر کلی — The Picture

### 1.1 — هوش مصنوعی امروز واقعاً چه کاری می‌کند

*Lesson match: the four bright cards (drafting/summarizing, answering from supplied documents, coding, multi-step work) and three dim cards (no guaranteed correctness, novelty claims, unsupervised consequential action). Read the cards as task- and system-dependent tendencies, not categorical limits of every model.*

1. **Technical Performance, AI Index Report 2026, chapter 2** — Stanford HAI; research report/PDF; **level: accessible overview, with deeper benchmark tables**.[1]
   https://hai.stanford.edu/assets/files/ai_index_report_2026_chapter_2_technical.pdf — Its language, coding, reasoning and agent sections let readers test the capability/limitation cards against actual evaluations rather than hype; benchmark saturation and remaining agent failures complicate any timeless verdict.[1]
2. **File search** — OpenAI API documentation; technical tutorial; **level: beginner-intermediate developer**.[2]
   https://developers.openai.com/api/docs/guides/tools-file-search — Precisely matches “answer from documents”: a model's answer is supplemented by a retrieval tool over uploaded files, rather than the model independently knowing or reading every repository document.[2]
3. **OpenAI o1 System Card, “Hallucination Evaluations”** — OpenAI; evaluation/system card; **level: intermediate**.[3]
   https://openai.com/index/openai-o1-system-card/ — Its explicit accuracy and hallucination-rate measures ground the “not guaranteed correct” card while making clear that rates vary by model and evaluation, not that every answer is wrong.[3]
4. **Claude discovers a novel enzyme system with CRISPR-like repeats** — Anthropic; first-party research report/article; **level: intermediate, optional**.[4]
   https://www.anthropic.com/research/claude-discovers-novel-enzyme-system — Directly challenges the lesson's categorical “cannot produce real novelty” wording: it reports an agent identifying a previously uncharacterized biological system, with human lab work and an as-yet-unknown function; distinguish a novel, testable finding from a proven end-to-end autonomous discovery.[4]
5. **How I use LLMs** — Andrej Karpathy (creator's YouTube channel); practical talk/video; **level: beginner, long-form (~2 hours)**.[5]
   https://www.youtube.com/watch?v=EWvNQjAaOHw — Real demonstrations of everyday LLM use and tool-enabled workflows are a useful visual complement to the four cards; its specific apps/models are examples rather than guarantees of performance today.[5]

### 1.2 — سه لایه: مدل، چارچوب اجرا، محصول

*Lesson match: the LayerStack distinction between a model and its surrounding orchestration/product, and the ContextLens `text-loop` showing `system → user → assistant → user → assistant`, where the next request includes earlier messages but not a response that has not yet been produced.*

1. **Text generation, “Message roles and instruction following”** — OpenAI API documentation; guide; **level: beginner-intermediate developer**.[6]
   https://developers.openai.com/api/docs/guides/text — Shows role-tagged messages and model output, mapping to the lesson's system/user/assistant labels; modern APIs may also have `developer` messages and non-text output items, so the five-message lesson is a teaching example rather than the entire protocol.[6]
2. **Conversation state, “Manually manage conversation state”** — OpenAI API documentation; guide with code; **level: intermediate**.[7]
   https://developers.openai.com/api/docs/guides/conversation-state — Direct match for the two-turn ContextLens: prior user and assistant messages can be sent back as next-turn input; also notes provider-managed conversation state, an alternative to manually resending the transcript.[7]
3. **Function calling, “The tool calling flow”** — OpenAI API documentation; implementation guide; **level: intermediate**.[8]
   https://developers.openai.com/api/docs/guides/function-calling — Separates the model's proposed tool call from application-side execution and returned result, which is the concrete boundary between the model and the harness; hosted built-in tools have a different execution owner.[8]
4. **Building effective agents, especially “Building blocks, workflows, and agents”** — Anthropic Engineering; architecture article; **level: intermediate**.[9]
   https://www.anthropic.com/research/building-effective-agents — Pictures an augmented LLM plus retrieval/tools/memory and the loop around it, clarifying why the model alone is not the agent/product; the article itself warns that parts of its December 2024 tooling landscape have changed.[9]
5. **How We Build Effective Agents (Barry Zhang)** — AI Engineer Summit / AI Engineer YouTube, speaker from Anthropic; recorded talk with event-hosted transcript; **level: intermediate, 15 minutes**.[10]
   https://www.youtube.com/watch?v=D7_ipDqhtwk — The environment + tools + system prompt + model-driven loop gives a compact audiovisual counterpart to LayerStack; event-hosted title, chapters and transcript were also checked at https://ai.engineer/talks/D7_ipDqhtwk-effective-ai-agents (verification companion, not an additional indexed resource).[10][11]

### 1.3 — مثالی که تا آخر همراه ماست

*Lesson match: the recurring real coding-assistant-in-a-repository scenario, with separate slots for user request, files read, edits/commands/tests, project instructions, and permissions/review; these are product-specific illustrations, not a tutorial to install either product.*

1. **Intro (CLI)** — OpenCode; official product documentation; **level: beginner**.[12]
   https://opencode.ai/docs/cli — Shows starting an assistant inside a project directory or pointing it at another project, matching the lesson's “assistant + repository + everyday request” scene without inventing a sample bug.[12]
2. **Tools** — OpenCode; official product documentation; **level: beginner-intermediate**.[13]
   https://opencode.ai/docs/tools/ — Its example traces locating files, reading them, editing and running relevant tests with distinct tools, exactly the three actions the lesson asks readers not to conflate; tool inventory and permissions may evolve.[13]
3. **Instructions** — OpenCode; official product documentation; **level: intermediate**.[14]
   https://opencode.ai/docs/instructions — Explains `AGENTS.md` project guidance for architecture, build commands, conventions and verification; maps to the “project guide” slot rather than implying all repository files are automatically model context.[14]
4. **Permissions** — OpenCode; official product documentation; **level: intermediate**.[15]
   https://opencode.ai/docs/permissions/ — Shows explicit ask/allow/deny rules for actions and resources, matching the “safe execution/review” slot; do not infer that merely opening a project guarantees every write or shell command will prompt for approval, since defaults and policies matter.[15]
5. **Learning Path, “I want a CLI coding assistant”** — Hermes Agent / Nous Research; official use-case guide; **level: beginner**.[16]
   https://hermes-agent.nousresearch.com/docs/getting-started/learning-path — Confirms Hermes as another actual assistant that can read, edit and run code in projects, while sending a new reader to the appropriate quickstart, tool and context-file documentation rather than treating OpenCode-specific commands as generic.[16]

### Cross-part foundations (optional; not counted in the per-lesson lists)

1. **Deep Dive into LLMs like ChatGPT** — Andrej Karpathy (creator's YouTube channel); lecture/video; **level: motivated beginner → intermediate, ~3.5 hours**.[17]
   https://www.youtube.com/watch?v=7xTGNNLPyMI — Builds the intuition beneath the Part 1 model layer (tokens, training and assistant behavior) for readers heading to Part 3; too long and technical to replace the concise opening lessons.[17]
2. **Context Files** — Hermes Agent / Nous Research; official documentation; **level: intermediate**.[18]
   https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files — The Hermes-side counterpart to OpenCode's project-instruction guide, showing how project instructions are discovered/loaded; bridges the Part 1 repository scene to later lessons on context engineering and safety without claiming every file is continuously visible.[18]

### Editorial caveats and coverage gaps

- The 1.1 prose says models cannot create anything truly new. That categorical sentence is not supported by the current evidence: distinguish originality/novel findings from independently validated science, and describe novelty as difficult to establish and variable by task, rather than impossible. The Anthropic enzyme example is first-party and preliminary, with its function unknown; it is a counterexample to the absolute wording, not a blanket claim of reliable autonomous science.
- The 1.1/1.2 “only text in, text out” framing is pedagogically useful for this text-only diagram, but current systems can accept/output multimodal content and structured tool calls. A model does not itself open a local project file merely because it can request a tool; a host runtime or hosted tool executes and returns observations.
- A saved five-message `system/user/assistant/user/assistant` transcript is one simple convention; APIs differ on developer roles, tool messages, reasoning items, server-managed state and whether previous instructions carry over. A “turn” is defined by this curriculum, not a universal API unit.
- Verified videos: Karpathy's practical talk (1.1), Zhang's event talk (1.2), and Karpathy's deep dive (cross-part). I did **not** identify a suitably focused, independently verified *official* OpenCode-or-Hermes coding-assistant walkthrough that adds more than the five current primary documentation pages for 1.3; do not invent a YouTube URL or imply this index includes one. The 1.1 practical video is long, and no concise verified capability/limitation-specific official talk was included.
- Vendor docs are living pages and tool names/defaults can change; the links are for conceptual alignment, not a frozen specification. Research/evaluation examples are not guarantees for a particular user's model or workflow.

**Count: 17 distinct indexed resources: 5 for 1.1, 5 for 1.2, 5 for 1.3, and 2 cross-part foundations.** The AI Engineer transcript URL is a verification companion to the YouTube talk, not an additional resource.

---

## Part 2 — ایجنت‌ها: لایهٔ رویی — Agents

### 2.1 — از چت‌بات به ایجنت

1. **Building effective AI agents** — https://www.anthropic.com/engineering/building-effective-agents — **Anthropic; engineering article; intermediate.** Its distinction between predefined workflows and model-directed agent actions sharpens the lesson’s “answer versus act” contrast.[19]
   Read as a design framework, not a universal definition; Anthropic flags its December 2024 tooling examples as dated.[19]
2. **Agent SDK overview** — https://platform.claude.com/docs/en/agent-sdk/overview — **Anthropic / Claude Code Docs; product documentation; beginner–intermediate.** Defines an agent as an application that plans steps and calls file, command, and edit tools; makes the surrounding application, not just the model, visible.[20]
3. **Tools** — https://opencode.ai/docs/tools — **OpenCode; product documentation; beginner.** Concrete coding-assistant example of reading and editing the codebase with tool access and approvals, rather than merely describing a fix.[13]
   Product-specific, not a definition of every agent.[13]
4. **How We Build Effective Agents: Barry Zhang, Anthropic** — https://www.youtube.com/watch?v=D7_ipDqhtwk — **AI Engineer channel; conference talk (15:09); beginner–intermediate.** An Anthropic practitioner argues for simple agent loops rather than reflexively adding autonomy; useful oral companion to the comparison.[10]
   YouTube title, destination and channel were checked (the AI Engineer event page also identifies the speaker).[10]

### 2.2 — ابزارها: چطور مدل کاری انجام می‌دهد

1. **Tool use with Claude** — https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview — **Anthropic / Claude Platform Docs; API guide; intermediate.** Shows the tool definition, model tool-use request, application/tool result and subsequent model turn: the sequence behind the lesson’s illustrative `readFile` trace.[21]
   Distinguish client-run tools from provider-hosted tools.[21]
2. **Function calling** — https://developers.openai.com/api/docs/guides/function-calling — **OpenAI; API guide; intermediate.** A second provider’s concrete request–execute–return pattern; explains why a structured tool call is not itself execution or the final answer.[8]
3. **How the agent loop works** — https://platform.claude.com/docs/en/agent-sdk/agent-loop — **Anthropic / Claude Code Docs; SDK documentation; intermediate.** Locates tool execution and repeated model calls in an agent runtime, matching the lesson’s one user turn containing multiple calls.[22]
4. **Tools & Toolsets** — https://hermes-agent.nousresearch.com/docs/user-guide/features/tools — **Nous Research / Hermes Agent; product documentation; intermediate.** A real tool surface in the course’s running example; compare available operations and their controls with the made-up `readFile` label, which is not a claim about Hermes’s API.[23]

### 2.3 — MCP: پریز استاندارد ابزارها

1. **What is the Model Context Protocol (MCP)?** — https://modelcontextprotocol.io/docs/getting-started/intro — **MCP project; official introductory documentation; beginner.** Why a shared connector protocol helps applications reach external systems; supports the N×M versus N+M *adapter-design illustration*, not a guarantee of zero integration work.[24]
2. **Architecture overview** — https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture — **MCP project; official architecture guide; intermediate.** Names host, client, server and protocol layers so the lesson’s single hub icon is not mistaken for one mandatory central MCP service.[25]
3. **Tools (MCP specification, version 2026-07-28)** — https://modelcontextprotocol.io/specification/2026-07-28/server/tools — **MCP project; normative specification; advanced.** `tools/list` discovery and `tools/call` invocation are distinct operations; the security guidance also makes clear that standardization is not permission or trust.[26]
   MCP also defines resources and prompts, not only tools.[26]
4. **Why we built—and donated—the Model Context Protocol (MCP)** — https://www.youtube.com/watch?v=PLyCki2K0Lg — **Anthropic channel; interview/video (35:32); beginner–intermediate.** Stuart Ritchie and co-creator David Soria Parra discuss the connector problem and MCP’s origins; a human-scale motivation before reading protocol methods.[27]
   YouTube title, destination and channel were checked.[27]

### 2.4 — مهارت‌ها: دستورهای بسته‌بندی‌شده

1. **Agent Skills Specification** — https://agentskills.io/specification — **Agent Skills / LF Projects; open-format specification; intermediate.** Defines `SKILL.md`, metadata, optional scripts/references/assets and progressive disclosure: catalog metadata, loaded instructions and later resource reads are different stages.[28]
2. **Equipping agents with Agent Skills** — https://www.anthropic.com/research/equipping-agents-for-the-real-world-with-agent-skills — **Anthropic; research/engineering article; beginner–intermediate.** Motivates reusable procedural knowledge and distinguishes instructions and bundled materials from the tools that actually perform work.[29]
   Anthropic notes the format became an open standard.[29]
3. **Skills** — https://opencode.ai/docs/skills — **OpenCode; product documentation/tutorial; beginner–intermediate.** A concrete on-demand skill-loading path using a `skill` tool; demonstrates a product-specific alternative to the lesson’s illustrative file-read path.[30]
4. **Skills System** — https://hermes-agent.nousresearch.com/docs/user-guide/features/skills — **Nous Research / Hermes Agent; product documentation; intermediate.** Shows discovery and progressive loading in the other running-example assistant.[31]
   Neither discovery nor reading a skill proves that its suggested test or edit was executed.[31]

### 2.5 — حافظه: چرا مدل شما را یادش نمی‌آید

1. **Conversation state** — https://developers.openai.com/api/docs/guides/conversation-state — **OpenAI; API guide; intermediate.** Compares passing prior messages with provider-managed conversation state.[7]
   Those are mechanisms for supplying past context, not evidence that model weights remember previous calls or that a separate long-term note exists.[7]
2. **Persistent Memory** — https://hermes-agent.nousresearch.com/docs/user-guide/features/memory — **Nous Research / Hermes Agent; product documentation; beginner–intermediate.** Concrete persisted notes (`MEMORY.md` and `USER.md`) alongside conversation history; matches the lesson’s separately saved file-path note without conflating it with the transcript.[32]
3. **Effective context engineering for AI agents** — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents — **Anthropic; engineering article; intermediate.** Discusses selecting and managing context rather than indiscriminately replaying everything, useful for the lesson’s cost and relevance trade-offs.[33]
4. **Persistence** — https://docs.langchain.com/oss/python/langgraph/persistence — **LangChain / LangGraph; framework documentation; advanced.** Contrasts checkpointed thread state with longer-term memory stores; helps separate replay, application state and retrieved facts in a specific implementation.[34]

### 2.6 — ورک‌فلو یا ایجنت؟

1. **Building effective AI agents** — https://www.anthropic.com/engineering/building-effective-agents — **Anthropic; engineering article; intermediate.** Explicitly separates predetermined workflows from agent-directed paths and argues for the simplest adequate design.[19]
   Its tooling examples are historical, as the page itself warns.[19]
2. **Workflows and agents** — https://docs.langchain.com/oss/python/langgraph/workflows-agents — **LangChain / LangGraph; illustrated tutorial; intermediate.** Side-by-side implementations make the fixed-step versus dynamic-path decision concrete; framework code is optional for a non-programmer.[35]
3. **How the agent loop works** — https://platform.claude.com/docs/en/agent-sdk/agent-loop — **Anthropic / Claude Code Docs; SDK guide; intermediate.** Shows where repeated tool decisions and stop conditions add flexibility and variable cost beyond a fixed pipeline.[22]
4. **How We Build Effective Agents: Barry Zhang, Anthropic** — https://www.youtube.com/watch?v=D7_ipDqhtwk — **AI Engineer channel; conference talk (15:09); beginner–intermediate.** Reinforces the “do not agentify every task” decision criterion.[10]
   An agent can still sit *inside* a gated workflow; expensive errors call for controls and review, not a categorical ban on agents.[10]

### 2.7 — ایجنت‌های برنامه‌نویسی

1. **Best practices for Claude Code** — https://code.claude.com/docs/en/best-practices — **Anthropic / Claude Code Docs; product guide; intermediate.** Pairs coding-agent changes with tests, typechecks, CI and review, matching read → edit → test → inspect failure → retry.[36]
   Passing tests are feedback, not proof that requirements are complete.[36]
2. **Tools** — https://opencode.ai/docs/tools — **OpenCode; product documentation; beginner–intermediate.** Real coding-agent read/edit/command operations ground the lesson’s trace; inspect actual output before reporting success.[13]
3. **Review output from Copilot** — https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output — **GitHub Docs; product review guide; beginner–intermediate.** A separate product’s reminder that human review of agent-produced code remains necessary even when automated checks run.[37]
4. **How we Claude Code** — https://www.youtube.com/watch?v=IlqJqcl8ONE — **Claude channel; hands-on workshop (31:43); intermediate.** Demonstrates project context and verification practices on a real repository, rather than treating a green test as the whole task.[38]
   YouTube title, destination and channel were checked.[38]

### 2.8 — یک ایجنت از چه ساخته شده

1. **Agent SDK overview** — https://platform.claude.com/docs/en/agent-sdk/overview — **Anthropic / Claude Code Docs; SDK overview; beginner–intermediate.** Reassembles the model-facing application, tools, loop and context management as one working agent architecture.[20]
2. **Agent Loop Internals** — https://hermes-agent.nousresearch.com/docs/developer-guide/agent-loop — **Nous Research / Hermes Agent; architecture documentation; advanced.** Shows how a real runtime orchestrates repeated model calls and tools; maps the lesson’s exploded-view “loop” to implementation rather than treating it as a model feature.[39]
3. **Features Overview** — https://hermes-agent.nousresearch.com/docs/user-guide/features/overview — **Nous Research / Hermes Agent; product overview; beginner.** Browse tools, skills and memory as separable features in the course’s recurring assistant, then locate their orchestration in the loop reference above.[40]
4. **How Claude Code works** — https://code.claude.com/docs/en/how-claude-code-works — **Anthropic / Claude Code Docs; product explainer; beginner–intermediate.** A second end-to-end coding-assistant example for checking which parts belong to model, environment, context and runtime.[41]
   The lesson’s five-part anatomy is a teaching model, not a mandatory component list for every agent.[41]

#### Editorial gaps and cautions

- No verified single beginner video was found that cleanly distinguishes *replayed transcript*, *persistent memory note*, *skill instructions*, *tool invocation* and *MCP discovery* in one accurate trace. Prefer the linked primary docs and the lesson’s context lenses over a misleading all-in-one video.
- The N×M → N+M MCP diagram counts conceptual adapter implementations under shared protocol assumptions; authentication, capabilities, versions and maintenance still need attention.
- Client-side function/tool calling is the lesson’s mechanism. Provider-hosted tools and product-specific skill loaders change *where* execution occurs, not the distinction between a model’s request and external action. Skill files may bundle executable scripts, but instructions alone do not run them.
- Tests make software-agent feedback relatively cheap and reproducible; they do not establish that all behavior is correct or that coding was literally the first successful domain. Keep the course’s historical shorthand qualified in any accompanying commentary.

---

## Part 3 — جعبه را باز کنیم — Opening the Box

### 3.1 — مدل زبانی چه کار می‌کند: حدس کلمهٔ بعدی

1. **What are LLMs?** — Hugging Face Agents Course; interactive tutorial; **beginner**.[42] [Direct URL](https://huggingface.co/learn/agents-course/en/unit1/what-are-llms). Its next-token visualizer shows the distribution, selection, autoregressive loop, and stopping token behind `ProbabilityBars`; useful corrective to the lesson's word-sized illustration: the actual unit is a *token*, and the highest-probability candidate need not always be selected.[42]
2. **The Illustrated GPT-2** — Jay Alammar; illustrated technical blog; **beginner → intermediate**.[43] [Direct URL](https://jalammar.github.io/illustrated-gpt2/). Trace how an emitted token becomes input at the next step, rather than picturing the model as retrieving a prewritten sentence; GPT-2 is an explanatory example, not a specification of every contemporary model.[43]
3. **Generation strategies** — Hugging Face Transformers documentation; official docs; **intermediate**.[44] [Direct URL](https://huggingface.co/docs/transformers/generation_strategies). Compare greedy choice with sampling and beam search for the lesson's diversity-control claim: next-token *scores* and the decoding *choice* are separate operations.[44]
4. **Large Language Models explained briefly** — 3Blue1Brown; verified channel YouTube video; **beginner**.[45] [Direct URL](https://www.youtube.com/watch?v=LPZh9BOjkQs). Visual bridge from text prediction to pretraining and transformer internals without treating “just autocomplete” as a full account of learned capabilities.[45]

### 3.2 — توکن: واحد کار مدل

1. **Tokenizer** — OpenAI; interactive tokenizer demo; **beginner**.[46] [Direct URL](https://platform.openai.com/tokenizer). Paste the same Persian and English requests and inspect actual boundaries/counts for the selected OpenAI tokenizer; the MDX chips are explicitly pedagogical, not a measured segmentation.[46]
2. **Byte-Pair Encoding tokenization** — Hugging Face LLM Course; hands-on tutorial; **intermediate**.[47] [Direct URL](https://huggingface.co/learn/llm-course/chapter6/5). Explains why one word can become multiple subword or byte-level pieces and why whitespace and punctuation matter.[47]
3. **Counting tokens** — OpenAI API documentation; official docs; **beginner → intermediate**.[48] [Direct URL](https://developers.openai.com/api/docs/guides/token-counting). Distinguishes estimated text counts from a model/request-specific input count and reported output usage; pertinent to context and billing rather than treating the figure's illustrative counts as invoices.[48]
4. **Let's build the GPT Tokenizer** — Andrej Karpathy; author-linked YouTube lecture; **advanced / optional coding**.[49] [Direct URL](https://www.youtube.com/watch?v=zduSFxRajkE). Walks through BPE, encoding/decoding, and tokenization artifacts; the long implementation section is optional.[49]
5. **Tokenizer Choice For LLM Training: Negligible or Crucial?** — researchers via arXiv; paper; **advanced**.[50] [Direct URL](https://arxiv.org/abs/2310.08754). Establishes that tokenizer choice changes multilingual efficiency, while simple fertility/parity metrics do not always predict downstream quality.[50] **Do not generalize its European-language measurements to a universal Persian-vs-English multiplier**: measure equivalent Persian/English samples with the actual deployed model's tokenizer, spelling, and task.[50]

### 3.3 — کانتکست: هر چیزی که مدل می‌بیند

1. **Conversation state — Managing the context window** — OpenAI; official API guide; **beginner → intermediate**.[7] [Direct URL](https://developers.openai.com/api/docs/guides/conversation-state). Documents the per-request token ceiling including input, output, and reasoning, and the need to manage multi-turn state; supports the stacked system/history/documents/question budget.[7]
2. **Context windows** — Anthropic / Claude Platform; official docs; **intermediate**.[51] [Direct URL](https://platform.claude.com/docs/en/build-with-claude/context-windows). Explicitly counts both user and assistant turns; read its model-dependent treatment of prior thinking blocks and overflow rather than assuming every product preserves or drops identical material.[51]
3. **Effective context engineering for AI agents** — Anthropic; engineering article; **intermediate**.[52] [Direct URL](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents). Shows deliberate pruning, tool-result clearing, and compaction as ways to preserve high-signal context.[52] **The lesson's “oldest history falls out” is one possible application policy, not automatic behavior of all model APIs**; some reject oversized requests, others truncate or summarize by configuration.[52]
4. **Lost in the Middle: How Language Models Use Long Contexts** — Liu et al.; research paper; **advanced**.[53] [Direct URL](https://arxiv.org/abs/2307.03172). A separate failure mode from exceeding the hard window: relevant text can *fit* yet be used less reliably when placed in the middle in the studied models/tasks; do not read this as a universal bound for all newer systems.[53]

### 3.4 — مدل چطور ساخته می‌شود: سه مرحله

1. **LLMs: Fine-tuning, distillation, and prompt engineering** — Google Machine Learning Crash Course; official tutorial; **beginner**.[54] [Direct URL](https://developers.google.com/machine-learning/crash-course/llm/tuning). Separates a pretrained base model from task-specific weight updates and from prompting (which does not change weights), clarifying the lesson's learned-vs-given lens.[54]
2. **Supervised Fine-Tuning** — Hugging Face LLM Course; official tutorial; **intermediate**.[55] [Direct URL](https://huggingface.co/docs/course/chapter11/1). Shows that SFT may target broad instruction following as well as narrow formatting tasks; alignment is not always a cleanly separate third chronological step.[55]
3. **Aligning language models to follow instructions** — OpenAI; primary technical/research article on InstructGPT; **intermediate**.[56] [Direct URL](https://openai.com/index/instruction-following/). Concrete demonstrations → human preference comparisons → RLHF pipeline; ties training stages to a more helpful response, while noting whose preferences shape “alignment.”[56]
4. **LIMA: Less Is More for Alignment** — Zhou et al.; paper; **advanced**.[57] [Direct URL](https://arxiv.org/abs/2305.11206). Controlled example of a pretrained model adapted with a small curated instruction set and no RLHF: **SFT, preference training, and RLHF are alternative/overlapping post-training choices, not mandatory fixed stages in every model**.[57]
   None supplies the live contents of a private repository by itself.[57]

### 3.5 — توهم: چرا مدل چیزی از خودش می‌سازد

1. **Why language models hallucinate** — OpenAI; primary research explainer; **beginner → intermediate**.[58] [Direct URL](https://openai.com/index/why-language-models-hallucinate/). Explains why training/evaluation can reward guessing and why abstention matters; corrects the MDX's stronger claim that a model *cannot* say “I don't know” unless explicitly taught, and avoids attributing every hallucination to next-token prediction alone.[58]
2. **Why we open sourced our MCP server, and what it means for you** — GitHub Blog; technical article; **beginner**.[59] [Direct URL](https://github.blog/open-source/maintainers/why-we-open-sourced-our-mcp-server-and-what-it-means-for-you/). Opens with a hypothetical coding assistant guessing PR #72’s status instead of fetching it from GitHub; analogous to guessing `project-helper.ts` instead of inspecting the repository for `src/utils.ts`.[59]
3. **Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks** — Lewis et al.; original RAG paper; **advanced**.[60] [Direct URL](https://arxiv.org/abs/2005.11401). Contrasts knowledge in model parameters with retrieved external evidence and reports improved factual generation in its experiments; retrieval helps but does **not** guarantee truth or correct citation.[60]
4. **Check grounding with RAG** — Google Cloud / Agent Search; official documentation; **intermediate**.[61] [Direct URL](https://docs.cloud.google.com/generative-ai-app-builder/docs/check-grounding). Tests candidate claims against supplied reference facts and exposes supporting citations; applies the lesson's practical rule to verify a claimed file/path against the actual repository, not the model's confident tone.[61]

### 3.6 — مدل‌ها در چه چیزهایی ضعیف‌اند

1. **CharBench: Evaluating the Role of Tokenization in Character-Level Tasks** — Uzan & Pinter; paper; **advanced**.[62] [Direct URL](https://arxiv.org/abs/2508.02591). Tests counting and locating characters and finds task-dependent effects; more precise than saying models never count or that tokenization alone explains every counting error.[62]
2. **Toolformer: Language Models Can Teach Themselves to Use Tools** — Schick et al.; paper; **advanced**.[63] [Direct URL](https://arxiv.org/abs/2302.04761). Calculator, search, and other tool calls illustrate the design response to exact arithmetic and changing external facts; tool use is possible and should be verified, not dismissed as an intrinsic inability of every model.[63]
3. **Language Models (Mostly) Know What They Know** — Kadavath et al.; paper; **advanced**.[64] [Direct URL](https://arxiv.org/abs/2207.05221). Separates calibrated confidence estimates from a confident-sounding answer: some models can estimate correctness under studied conditions, yet calibration can fail on new tasks.[64]
   Avoid the categorical “models cannot assess confidence.”[64]
4. **Using tools with Gemini API** — Google AI Studio; official docs; **beginner → intermediate**.[65] [Direct URL](https://aistudio.google.com/docs/tools). Shows that current search, code execution, and other external tools can be incorporated at inference time.[65] **Training cutoff constrains parametric knowledge, not what a connected assistant can learn now**; count and arithmetic still warrant executable checks.[65]

### 3.7 — استدلال، و چرا مدل‌ها متفاوتند

1. **Learning to reason with LLMs** — OpenAI; primary research/technical article; **intermediate**.[66] [Direct URL](https://openai.com/index/learning-to-reason-with-llms/). Separates reinforcement-learning *train-time* compute from longer *test-time* thinking; compare a reasoning-heavy task with a natural-language task where extra thinking is not necessarily preferred.[66]
2. **Claude's extended thinking** — Anthropic; primary technical article; **beginner → intermediate**.[67] [Direct URL](https://www.anthropic.com/news/visible-extended-thinking). Same-model thinking mode/budget example: increasing answer-time work is not always simply selecting a different larger model.[67]
   The lesson's “thinking text” figure is a teaching device, not a guarantee that any displayed reasoning transcript faithfully exposes internal computation.[67]
3. **DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning** — DeepSeek-AI; paper; **advanced**.[68] [Direct URL](https://arxiv.org/abs/2501.12948). Illustrates post-training for reasoning and distillation into differently sized models; distinctions in model training and inference effort both affect the quality/speed/cost choice.[68]
4. **SWE-bench overview** — SWE-bench authors; benchmark documentation; **intermediate**.[69] [Direct URL](https://www.swebench.com/SWE-bench/). Real GitHub issues, generated patches, and reproducible tests make a concrete benchmark example for the coding lens; leaderboard rank is not a substitute for tests on *your* repository, workload, latency, and budget.[69]

---

## Part 4 — ساختن با LLM — Building

### 4.1 — یک فراخوانی API از نزدیک (An API call up close)

1. **Create a Message** — Anthropic / Claude API Reference · API reference · Intermediate · [Direct URL](https://platform.claude.com/docs/en/api/messages/create).[70] **Focus:** `model`, `messages`, top-level `system`, response content blocks, `stop_reason`, and `usage`.[70]
   Compare the MDX's deliberately simplified `finish_reason` and system-as-message illustration with a real provider schema; `temperature` is not supported by every model.[70]
2. **Using the Messages API** — Anthropic / Claude Platform Docs · illustrated guide · Beginner · [Direct URL](https://platform.claude.com/docs/en/build-with-claude/working-with-messages).[71] **Focus:** single-turn vs stateless multi-turn requests and appending the preceding assistant reply to the next input; a saved transcript is not an extra call.[71]
3. **Create a model response** — OpenAI / API Reference · API reference · Intermediate · [Direct URL](https://developers.openai.com/api/reference/resources/responses/methods/create).[72] **Focus:** `input` items, `output` items, `usage`, and optional sampling controls in the Responses API.[72]
   Contrast this schema with Anthropic's rather than teaching the MDX's example fields as universal.[72]
4. **Conversation state** — OpenAI / API Docs · implementation guide · Intermediate · [Direct URL](https://developers.openai.com/api/docs/guides/conversation-state).[7] **Focus:** manually replaying prior input/output versus provider-managed continuation; distinguish model calls, conversation turns, and retained application history.[7]

### 4.2 — پرامپت: دستور دادن مؤثر (Effective instructions)

1. **Prompt engineering** — OpenAI / API Docs · guide with examples · Beginner–Intermediate · [Direct URL](https://developers.openai.com/api/docs/guides/prompt-engineering).[73] **Focus:** separating identity/instructions/examples/context, few-shot examples, and testing prompt versions; map to role, task, constraints, and evidence-based sample reports.[73]
2. **Prompting best practices** — Anthropic / Claude Platform Docs · practical guide · Beginner–Intermediate · [Direct URL](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices).[74] **Focus:** clear and direct task boundaries, role, relevant examples, and marking instructions versus document context; provider-specific tactics are not universal laws.[74]
3. **Interactive Prompt Engineering Tutorial** — Anthropic / GitHub · hands-on notebooks, older course · Beginner · [Direct URL](https://github.com/anthropics/prompt-eng-interactive-tutorial).[75] **Focus:** chapters 1–3 (structure, clarity, roles) and 7 (using examples); try both a test-passed and a test-not-run reporting example.[75]
   Exercises use older models, so adapt API/model names.[75]
4. **Language Models are Few-Shot Learners** — Brown et al.[76] / arXiv · foundational research paper · Advanced · [Direct URL](https://arxiv.org/abs/2005.14165).[76] **Focus:** the in-context examples/zero-, one-, and few-shot evaluation idea; historical research background, not a guarantee that adding examples always helps.[76]

### 4.3 — کانتکست: مهم‌تر از پرامپت (Context engineering)

1. **Effective context engineering for AI agents** — Anthropic Applied AI / Anthropic · engineering article · Intermediate · [Direct URL](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents).[52] **Focus:** choosing a small, relevant working set; tool results as context; up-front project notes versus just-in-time file discovery.[52]
   Especially useful for the MDX lab's distinction between having a tool and actually receiving file/test evidence.[52]
2. **Context windows** — Anthropic / Claude Platform Docs · technical guide · Intermediate · [Direct URL](https://platform.claude.com/docs/en/build-with-claude/context-windows).[51] **Focus:** finite input/output budget and why history, document excerpts, and results compete for space; model capacities vary over time.[51]
3. **Writing effective tools for AI agents** — Anthropic / engineering article · implementation guide · Intermediate · [Direct URL](https://www.anthropic.com/research/writing-tools-for-agents).[77] **Focus:** concise, relevant tool responses and unambiguous tool descriptions; contrast tool availability with actual execution output entering context.[77]
4. **Lost in the Middle: How Language Models Use Long Contexts** — Liu et al.[53] / arXiv · research paper · Advanced · [Direct URL](https://arxiv.org/abs/2307.03172).[53] **Focus:** placement of relevant evidence within long prompts; more context alone does not ensure it is used.[53]

### 4.4 — RAG: پاسخ از اسناد شما (Answering from your documents)

1. **Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks** — Lewis et al.[60] / arXiv · foundational paper · Advanced · [Direct URL](https://arxiv.org/abs/2005.11401).[60] **Focus:** parametric model knowledge plus retrieved non-parametric passages; connect the lesson's index/retrieve/generate phases to the original research, while noting the paper's specific architecture is not the only RAG implementation.[60]
2. **Question answering using embeddings** — OpenAI Cookbook / GitHub · hands-on notebook · Intermediate · [Direct URL](https://github.com/openai/openai-cookbook/blob/main/examples/Question_answering_using_embeddings.ipynb).[78] **Focus:** split documents, index chunk embeddings, retrieve relevant sections for each query, then pass evidence into a question-answering prompt; the example code and model names may require updating.[78]
3. **Query and search** — Weaviate Documentation · comparison/reference · Beginner–Intermediate · [Direct URL](https://docs.weaviate.io/weaviate/search).[79] **Focus:** keyword/BM25 for exact file names or error strings versus vector search for semantic similarity and hybrid search for both.[79]
   Directly reading a known guide or grepping a repository need not invoke a vector database.[79]
4. **Contextual retrieval in AI systems** — Anthropic / research article · engineering explanation · Intermediate · [Direct URL](https://www.anthropic.com/research/contextual-retrieval).[80] **Focus:** chunk context, BM25 plus embedding retrieval, reranking, and retrieval failures; compare relevant contribution/testing guidance against an unrelated document before citing an answer.[80]

### 4.5 — چه زمانی فاین‌تیون، چه زمانی RAG (Fine-tuning or RAG?)

1. **Comparing Retrieval Augmented Generation and fine-tuning** — AWS Prescriptive Guidance · decision comparison · Beginner–Intermediate · [Direct URL](https://docs.aws.amazon.com/prescriptive-guidance/latest/retrieval-augmented-generation-options/rag-vs-fine-tuning.html).[81] **Focus:** changing source documents, provenance, latency/effort, and behavior adaptation; use to interrogate the lesson's knowledge-versus-behavior ladder.[81]
2. **To tune or not to tune?[82]
   A guide to leveraging your data with LLMs** — Google Cloud Blog · decision guide · Beginner–Intermediate · [Direct URL](https://cloud.google.com/blog/products/ai-machine-learning/to-tune-or-not-to-tune-a-guide-to-leveraging-your-data-with-llms).[82] **Focus:** choose in-context examples, retrieval, tuning, or a combination for brand voice plus document-grounded answers; do not present RAG and tuning as mutually exclusive.[82]
3. **Mastering Model Adaptation: A Guide to Fine-Tuning on Google Cloud** — Google Cloud Blog · practical overview with linked labs · Intermediate · [Direct URL](https://cloud.google.com/blog/topics/developers-practitioners/mastering-model-adaptation-a-guide-to-fine-tuning-on-google-cloud).[83] **Focus:** repeatable style/output-format behavior, training examples, and associated hands-on labs after trying prompting and in-context examples.[83]
4. **RAFT: Adapting Language Model to Domain Specific RAG** — Zhang et al.[84] / arXiv · research paper · Advanced · [Direct URL](https://arxiv.org/abs/2403.10131).[84] **Focus:** fine-tuning a model to use retrieved evidence and ignore distractors; important nuance to the lesson's simplified separation.[84]
   Fresh, changing facts still need a maintained source, and any chosen approach needs evaluation.[84]

### 4.6 — ارزیابی: چطور بفهمیم بهتر شد (Knowing whether it improved)

1. **Define success criteria and build evaluations** — Anthropic / Claude Platform Docs · eval design guide · Beginner–Intermediate · [Direct URL](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests).[85] **Focus:** task-specific cases, edge cases, measurable rubrics, code/human/model graders; turn the MDX's missing file, unchanged tests, no release, no secrets, and honest report cases into explicit checks.[85]
2. **Evaluation best practices** — OpenAI / API Docs · methodology guide (legacy platform caveat) · Intermediate · [Direct URL](https://developers.openai.com/api/docs/guides/evaluation-best-practices).[86] **Focus:** representative datasets, continuous regression checks, per-category inspection, and refreshing the set from real failures; an average score is not a safety gate.[86]
   Its linked Evals platform was read-only as of October 31, 2026, with shutdown scheduled for November 30, 2026; use the methodology, not the retiring platform walkthrough.[86]
3. **Building evals** — Anthropic / Claude Cookbook · hands-on tutorial · Intermediate · [Direct URL](https://platform.claude.com/cookbook/misc-building-evals).[87] **Focus:** input fixtures, prompt variants, grading criteria, and offline comparison; adapt its example implementation to the currently supported SDK/model.[87]
4. **Demystifying evals for AI agents** — Anthropic Engineering / Anthropic · deep-dive article · Advanced · [Direct URL](https://www.anthropic.com/research/demystifying-evals-for-ai-agents).[88] **Focus:** coding-agent tasks, end-state versus trajectory grading, and failure analysis; measure real file diffs and test outputs rather than treating plausible prose as execution evidence.[88]

### 4.7 — از نمونه به محصول (From demo to product)

1. **Building effective agents** — Anthropic / engineering article (December 2024; tooling has changed) · architecture guide · Intermediate · [Direct URL](https://www.anthropic.com/research/building-effective-agents).[9] **Focus:** simple workflow first, ground-truth tool feedback, stopping conditions, sandbox tests, and human checkpoints before increasing autonomy.[9]
2. **OpenTelemetry tracing for the Claude API** — Anthropic / Claude Platform Docs · observability guide (beta) · Intermediate · [Direct URL](https://platform.claude.com/docs/en/manage-claude/opentelemetry).[89] **Focus:** request/tool traces, operational debugging, latency, and turning production failures into eval cases; balance trace detail with privacy.[89]
3. **Claude API errors** — Anthropic / Claude Platform Docs · error-handling reference · Intermediate · [Direct URL](https://platform.claude.com/docs/en/api/errors).[90] **Focus:** 429/rate and spend limits, transient 5xx/overload, retry/backoff, and mid-stream failures; failure paths belong to the product, not the demo.[90]
4. **LLM01:2025 Prompt Injection** — OWASP Gen AI Security Project · security guidance · Intermediate · [Direct URL](https://genai.owasp.org/llmrisk/llm01-prompt-injection/).[91] **Focus:** untrusted repository files, least privilege, output validation, and human approval for consequential tool actions; prompting or RAG alone do not eliminate injection risk.[91]
5. **Andrej Karpathy: Software Is Changing (Again)** — Y Combinator / Andrej Karpathy · verified YouTube keynote · General–Intermediate · [Direct URL](https://www.youtube.com/watch?v=LCEmiRjPEtQ&t=1420s).[92] **Focus:** the human–AI collaboration loop (23:40), reviewable diffs and partial autonomy, then the prototype-to-deployment gap (29:06 onward); not a proof of any particular demo-to-production percentage.[92]

**Editorial caution:** The lesson's “20% demo / 80% rest” is an illustrative iceberg metaphor, not a measured industry statistic. API parameters and stop/usage field names belong to their respective providers and models; verify current support before implementing. The lesson's “knowledge vs behavior” rule is a useful first-pass decision, not a theorem: retrieval and fine-tuning can be combined, and neither replaces task-specific evals.

---

## Part 5 — در عمل — Production

### 5.1 — معماری یک سیستم واقعی (Production architecture)

1. **[Agents layer](https://docs.aws.amazon.com/prescriptive-guidance/latest/govern-architect-agentic-ai/agents-layer.html)** — AWS Prescriptive Guidance; illustrated architecture guide; **intermediate**.[93]
   The closest box-by-box match to the lesson's orchestrator, model, tool/runtime, knowledge, memory, and operational layers; compare the AWS diagram with `fig-5-1` rather than assuming every system needs every service.[93]
2. **[OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)** — OpenAI; official architecture/API overview; **intermediate**.[94]
   Shows a concrete agent runner, tools, sessions, handoffs, guardrails, and tracing, making the orchestrator's ownership of the loop distinguishable from model inference.[94]
3. **[Throttle requests to your REST APIs for better throughput in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html)** — Amazon API Gateway; operations documentation; **intermediate**.[95]
   Grounds the gateway box's rate-limit role in actual request/burst handling; throttles are best-effort targets, not authorization or hard safety ceilings.[95]
4. **[Memory-augmented agents](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-patterns/memory-augmented-agents.html)** — AWS Prescriptive Guidance; architecture pattern; **intermediate**.[96]
   Separates recent conversation state from long-term structured/semantic memory and shows how retrieval feeds the orchestrator's context assembly.[96]
5. **[Sandbox agents: Quickstart](https://openai.github.io/openai-agents-python/sandbox_agents/)** — OpenAI Agents SDK; hands-on code tutorial; **advanced**.[97]
   Maps the coding-agent file/command-tool box to a workspace manifest and execution backend.[97]
   Read its explicit warning: the Unix-local client does not provide Linux OS confinement; use properly configured isolation for untrusted commands.[97]

### 5.2 — هزینه: پول کجا می‌رود (Cost and caching)

1. **[Pricing](https://developers.openai.com/api/docs/pricing)** — OpenAI API; live pricing reference; **beginner–intermediate**.[98]
   Read the current input, output, cached-input, and tool charges before filling in the lesson's `CostCalculator`; do not copy its rates into a permanent lesson.[98]
2. **[Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)** — OpenAI API; implementation guide; **intermediate**.[99]
   Directly addresses `cache-prefix`: stable instructions/reference material before changing content, prefix reuse and cached-token diagnostics.[99]
   A shared prefix alone does not guarantee a cache hit; model, minimum length, routing, and retention rules matter.[99]
3. **[Cost optimization](https://developers.openai.com/api/docs/guides/cost-optimization)** — OpenAI API; production guide; **beginner–intermediate**.[100]
   Matches the three levers in the lesson: fewer calls, fewer input/output tokens, and an appropriately smaller model; useful for counting *all* turns in a coding-agent loop rather than one user request.[100]
4. **[Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)** — Anthropic / Claude Platform; provider-specific implementation guide; **intermediate**.[101]
   Compare explicit/automatic cache breakpoints and cache lifetime with OpenAI's mechanism; the `cache-prefix` principle is portable, but exact billing and eligibility are provider-specific.[101]
5. **[Pricing](https://platform.claude.com/docs/en/about-claude/pricing)** — Anthropic / Claude Platform; live pricing reference; **beginner–intermediate**.[102]
   Cross-check model-tier input/output charges and cache write/read rules for a second provider; use current provider tables whenever estimating a real session.[102]

### 5.3 — امنیت: تزریق پرامپت و نشت داده (Prompt injection and data leakage)

1. **[LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)** — OWASP Gen AI Security Project; threat-and-mitigation reference; **beginner–intermediate**.[91]
   Names direct/indirect injection, exfiltration, least privilege, human approval, and layered controls for the poisoned-guide scenario.[91]
   OWASP explicitly does **not** claim foolproof prevention.[91]
2. **[Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile (NIST AI 600-1)](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)** — NIST; risk-management report; **intermediate**.[103]
   Provides a cross-sectoral framework for assessing generative-AI risks across design, deployment, and evaluation; useful for production sign-off beyond a single prompt or classifier.[103]
3. **[Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection](https://arxiv.org/abs/2302.12173)** — Kai Greshake et al.; original research paper; **advanced**.[104]
   Demonstrates the trust-boundary failure when attacker-controlled retrieved text steers tool/API use; closest original evidence for the lesson's malicious project guide.[104]
4. **[Guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)** — OpenAI API; implementation documentation; **intermediate**.[105]
   Locates argument checks at the *tool boundary* and approval before side effects: a model request for `/private/secrets.env` should be rejected **before** file access, and the rejection returned as a tool outcome.[105]
   Agent-level input/output guardrails alone do not cover every tool call.[105]
5. **[Sandbox agents: Quickstart](https://openai.github.io/openai-agents-python/sandbox_agents/)** — OpenAI Agents SDK; hands-on tutorial and security warning; **advanced**.[97]
   Contrasts tool access in a workspace with real OS isolation; relevant to project-only file permissions and test execution in a confined environment.[97]
   Do not equate its Unix-local example with a secure sandbox.[97]

**Security reading rule:** Separate *model persuasion* from *enforced authorization*. Prompt instructions, content filters, guardrails, narrow filesystem/network/tool capabilities, secret minimization, trace redaction, and human approval are complementary layers, **not guarantees** against prompt injection. Blocking one file read establishes only that this attempted read did not happen; it does not prove the model cannot be influenced or that every exfiltration path is closed.

### 5.4 — اتکاپذیری و مشاهده‌پذیری (Reliability and observability)

1. **[Tracing](https://openai.github.io/openai-agents-python/tracing/)** — OpenAI Agents SDK; implementation/reference guide; **intermediate**.[106]
   Maps a request to spans for model generations, function calls, handoffs, and guardrails, with trace IDs and timing.[106]
   It also warns that default trace payloads may contain sensitive inputs/outputs; configure capture/redaction deliberately.[106]
2. **[Tracing quickstart](https://docs.langchain.com/langsmith/observability-quickstart)** — LangChain / LangSmith; hands-on tutorial; **beginner–intermediate**.[107]
   Instrument an agent, open its request trace, and inspect individual operations instead of inferring why a final answer was poor; good exercise after reading `fig-5-4`.[107]
3. **[OpenTelemetry GenAI Semantic Conventions](https://github.com/open-telemetry/semantic-conventions-genai)** — OpenTelemetry; open-standard specification repository; **advanced**.[108]
   Vendor-neutral vocabulary for generative-AI spans, metrics, and events, including inference and tool execution; follow its `docs` directory to relate the lesson's latency/token/tool columns to actual telemetry fields.[108]
4. **[Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices)** — OpenAI API; methodology guide; **intermediate**.[86]
   Explains representative datasets, grading, repeated evaluation, and regression monitoring when one model run is not evidence of reliability; complements trace inspection with outcome scores.[86]
5. **[Latency optimization](https://developers.openai.com/api/docs/guides/latency-optimization)** — OpenAI API; production performance guide; **intermediate**.[109]
   Diagnose the slow retrieval/model steps and accumulated sequential calls in the lesson's sample trace before optimizing; offers reducing requests and parallelizing independent operations.[109]
6. **[Build an Agent Improvement Loop with Traces, Evals, and Codex](https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop)** — OpenAI Cookbook; runnable notebook; **advanced**.[110]
   Hands-on bridge from agent traces and feedback to reusable evals and reviewed changes.[110]
   Uses synthetic example data and live API calls (including mock human feedback); an optional deeper lab, not a claim that traces alone establish correctness.[110]

---

## Part 6 — رهبری — Leading

### 6.1 — کجا ارزش واقعی هست (Where the real value is)

1. **NIST — AI Risk Management Framework 1.0, Core (Map 1.4–1.5, 3.1–3.5, 5.1).** Format: voluntary risk-management framework; level: intermediate, decision-makers.[111]
   Direct URL: https://airc.nist.gov/airmf-resources/airmf/5-sec-core/ .[111] **Match:** Map expected business benefit and the cost/likelihood of errors against organizational risk tolerance; supplies a defensible *error-tolerance* half of the lesson's 2×2, especially why auto-deploy and access changes need different controls from reviewed drafts.[111]
   NIST does **not** prescribe this particular matrix.[111]
2. **UK Government — “Assessing if artificial intelligence is the right solution,” §§Assessing if AI is the right solution for your users’ needs / Getting approval to spend.** Format: official adoption guidance; level: introductory–intermediate, product leaders.[112]
   Direct URL: https://www.gov.uk/guidance/assessing-if-artificial-intelligence-is-the-right-solution .[112] **Match:** Asks whether work is large-scale and repetitive, whether data/use is safe, and whether a small proof of concept tests the benefit; directly underpins the *work-volume* axis and the choice to start with a bounded use case.[112]
   Its 2019 examples are broader ML, not a generative-AI-specific ranking.[112]
3. **Brynjolfsson, Li & Raymond — “Generative AI at Work,” *Quarterly Journal of Economics* (2025).** Format: peer-reviewed primary field study/case study; level: intermediate.[113]
   Direct URL: https://academic.oup.com/qje/article/140/2/889/7990658 .[113] **Match:** A human-reviewed customer-support-assistant deployment with measurable issues resolved per hour and heterogeneous worker effects; a concrete high-volume, recoverable-output candidate.[113]
   It is evidence for *that workflow*, not proof every support triage application succeeds.[113]
4. **METR — “Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity.”** Format: primary randomized field experiment + methods/limitations; level: intermediate.[114]
   Direct URL: https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ .[114] **Match:** A reality check for coding-related points in the matrix: evaluate time and quality against a baseline instead of assuming all reviewed code changes save time.[114]
   The 19% slowdown is specific to experienced developers, their repositories, and early-2025 tools—not a current universal productivity estimate.[114]
   For the later-study selection-bias caveat, see https://metr.org/blog/2026-02-24-uplift-update/ (companion context, **not** an additional curated entry).[114][115]

### 6.2 — بسازیم یا بخریم (Build, buy, or combine)

1. **UK Government Digital Service and Central Digital and Data Office — “Define your purchasing strategy,” §§Discover your requirements and capabilities / Choosing to build technology / Choosing to buy technology.** Format: official technology purchasing guidance; level: introductory–intermediate, managers.[116]
   Direct URL: https://www.gov.uk/guidance/define-your-purchasing-strategy .[116] **Match:** Frames build, buy, and combined approaches through unique user need, existing capability, lifecycle cost, market options, and ownership.[116]
   This most closely supports the lesson's four-question branch; the four prompts themselves are the course's synthesis.[116]
2. **UK Government — “Guidelines for AI procurement.”** Format: official procurement guidance; level: intermediate, procurement/product leaders.[117]
   Direct URL: https://www.gov.uk/government/publications/guidelines-for-ai-procurement/guidelines-for-ai-procurement .[117] **Match:** The *buy* branch still needs evaluation of supplier, data, contract, interoperability and lock-in; buying a coding-agent core does not transfer all accountability.[117]
   Public-sector and 2020-era guidance: do not portray as contemporary vendor comparison or legal advice.[117]
3. **Anthropic Engineering — “Building effective agents,” §§When (and when not) / Building blocks / Combining and customizing.** Format: first-party engineering tutorial; level: intermediate, technical leads.[9]
   Direct URL: https://www.anthropic.com/research/building-effective-agents .[9] **Match:** Explains how to compose simple agent/workflow building blocks, tools and task-specific instructions; supports the *combine* branch conceptually, but does **not** establish that purchasing an agent harness is best.[9]
   Vendor-authored experience, **not neutral comparative evidence**, and the page flags changes to the tooling landscape since its 2024 publication.[9]
4. **OpenCode — “Instructions” (project `AGENTS.md`).** Format: official product documentation/tutorial; level: hands-on intermediate.[14]
   Direct URL: https://opencode.ai/docs/instructions/ .[14] **Match:** An executable example of combining an existing coding agent with project-specific architecture notes, rules, test commands and verification criteria.[14]
   Treat as an implementation example, not independent evidence that OpenCode is superior or that all agent products expose identical controls.[14]

### 6.3 — تیم و مهارت‌ها (Team and skills)

1. **NIST — AI RMF 1.0, Appendix A: “Descriptions of AI Actor Tasks.”** Format: voluntary framework appendix / role taxonomy; level: intermediate, team leads.[118]
   Direct URL: https://airc.nist.gov/airmf-resources/airmf/appendices/app-a-descriptions-of-ai-actor-tasks/ .[118] **Match:** Places product managers and domain experts beside developers, evaluators, operators and governance/security functions across the lifecycle.[118]
   Supports the card grid's responsibilities, but NIST lists **more than four actor categories**; the lesson compresses them pedagogically.[118]
2. **UK Government — “Assessing if artificial intelligence is the right solution,” §§Working with the right skills to assess AI / Allocating responsibility and governance for AI projects.** Format: official adoption guidance; level: introductory, product owners.[112]
   Direct URL: https://www.gov.uk/guidance/assessing-if-artificial-intelligence-is-the-right-solution .[112] **Match:** Explicitly requires problem/data specialists and at least one domain expert, then a responsibility record for testing, monitoring and deployment.[112]
   Grounds the assertion that existing product/domain roles remain essential; not evidence that engineering/security requires wholly new hires.[112]
3. **Anthropic Engineering — “Demystifying evals for AI agents.”** Format: first-party technical tutorial/case study; level: intermediate–advanced, AI engineers and evaluators.[88]
   Direct URL: https://www.anthropic.com/research/demystifying-evals-for-ai-agents .[88] **Match:** Makes the AI-engineer card concrete: create representative tasks, grading criteria, clean test environments and failure reviews; domain/product experts help define success.[88]
   Vendor-authored practice, not independent evidence for a universal staffing ratio.[88]
4. **OWASP Gen AI Security Project — “LLM01:2025 Prompt Injection.”** Format: community security guidance; level: intermediate, platform/security teams.[91]
   Direct URL: https://genai.owasp.org/llmrisk/llm01-prompt-injection/ .[91] **Match:** Platform/security card: segregate untrusted input, enforce least privilege outside the model and require human approval for high-risk tool actions.[91]
   This security responsibility cannot be replaced by a clever prompt.[91]
5. **Australian National AI Centre — “Redesign your workflow.”** Format: official adoption guidance with workflow examples; level: introductory–intermediate, product and domain leads.[119]
   Direct URL: https://www.ai.gov.au/planning-ai/prepare-your-business/redesign-your-workflow .[119] **Match:** Assign who approves, escalates, monitors and stops an AI-assisted workflow; gives operational language for sharing work among existing people and new AI-specific checks.[119]
   Its example benefits are illustrative targets, not verified general ROI.[119]

### 6.4 — نقشه، یک بار دیگر (The map, once more)

1. **Brown et al. — “Language Models are Few-Shot Learners” (GPT-3).** Format: primary research paper; level: intermediate–advanced.[76]
   Direct URL: https://arxiv.org/abs/2005.14165 .[76] **Match:** Return to the opening idea: an autoregressive language model is conditioned on preceding text; distinguish that *model mechanism* from the agent's tools and the organization's decision-making.[76]
   This is one influential model, not an exhaustive account of every AI system.[76]
2. **Yao et al. — “ReAct: Synergizing Reasoning and Acting in Language Models.”** Format: primary research paper; level: intermediate–advanced.[120]
   Direct URL: https://arxiv.org/abs/2210.03629 .[120] **Match:** Links the model's generated next step to an external action and observation—the agent loop illustrated by the recap's read-file/edit/run-tests sequence.[120]
   It is a research architecture, not a guarantee that every agent verifies its own claims.[120]
3. **Lewis et al. — “Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks.”** Format: primary research paper; level: intermediate–advanced.[60]
   Direct URL: https://arxiv.org/abs/2005.11401 .[60] **Match:** Revisits RAG as retrieved external information conditioning generation, rather than treating the model's parameters as a live repository of project facts.[60]
   The original paper studies particular retrieval/generation implementations, not every contemporary RAG pipeline.[60]
4. **NIST — AI RMF Playbook, “Measure.”** Format: official voluntary implementation playbook; level: intermediate, evaluators and product owners.[121]
   Direct URL: https://airc.nist.gov/airmf-resources/playbook/measure/ .[121] **Match:** Revisits evaluation as use-case-specific tests, metrics and evidence in deployment-like conditions; connects measured improvement back to the leader's choice of use case.[121]
   NIST notes the 1.0 framework and playbook are under revision.[121]
5. **OWASP Gen AI Security Project — “LLM01:2025 Prompt Injection.”** Format: community security guidance; level: intermediate, technical leads.[91]
   Direct URL: https://genai.owasp.org/llmrisk/llm01-prompt-injection/ .[91] **Match:** Completes the map's guardrail/least-privilege strand: retrieved pages and files can contain adversarial instructions; application authorization and human approvals must bound the tool loop.[91]
   RAG alone does not remove prompt-injection risk.[91]

**Coverage and limitations:** 18 lesson placements, 16 distinct primary pages (two cross-listed: UK assessment and OWASP). The METR 2026 link is contextual follow-up, not a nineteenth reading. No source here establishes the course's exact ten-point quadrant placements, the four-question branch as a validated decision algorithm, or the four roles as an exhaustive staffing blueprint. Some 2019–2020 government materials predate modern coding agents; recent product documentation can change. No video was included because the verified primary papers, standards, official guides and hands-on docs are closer to these specific lessons.

## Sources

[1] https://hai.stanford.edu/assets/files/ai_index_report_2026_chapter_2_technical.pdf
[2] https://developers.openai.com/api/docs/guides/tools-file-search
[3] https://openai.com/index/openai-o1-system-card
[4] https://www.anthropic.com/research/claude-discovers-novel-enzyme-system
[5] https://www.youtube.com/watch?v=EWvNQjAaOHw
[6] https://developers.openai.com/api/docs/guides/text
[7] https://developers.openai.com/api/docs/guides/conversation-state
[8] https://developers.openai.com/api/docs/guides/function-calling
[9] https://www.anthropic.com/research/building-effective-agents
[10] https://www.youtube.com/watch?v=D7_ipDqhtwk
[11] https://ai.engineer/talks/D7_ipDqhtwk-effective-ai-agents
[12] https://opencode.ai/docs/cli
[13] https://opencode.ai/docs/tools
[14] https://opencode.ai/docs/instructions
[15] https://opencode.ai/docs/permissions
[16] https://hermes-agent.nousresearch.com/docs/getting-started/learning-path
[17] https://www.youtube.com/watch?v=7xTGNNLPyMI
[18] https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files
[19] https://www.anthropic.com/engineering/building-effective-agents
[20] https://platform.claude.com/docs/en/agent-sdk/overview
[21] https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
[22] https://platform.claude.com/docs/en/agent-sdk/agent-loop
[23] https://hermes-agent.nousresearch.com/docs/user-guide/features/tools
[24] https://modelcontextprotocol.io/docs/getting-started/intro
[25] https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture
[26] https://modelcontextprotocol.io/specification/2026-07-28/server/tools
[27] https://www.youtube.com/watch?v=PLyCki2K0Lg
[28] https://agentskills.io/specification
[29] https://www.anthropic.com/research/equipping-agents-for-the-real-world-with-agent-skills
[30] https://opencode.ai/docs/skills
[31] https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
[32] https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
[33] https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
[34] https://docs.langchain.com/oss/python/langgraph/persistence
[35] https://docs.langchain.com/oss/python/langgraph/workflows-agents
[36] https://code.claude.com/docs/en/best-practices
[37] https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output
[38] https://www.youtube.com/watch?v=IlqJqcl8ONE
[39] https://hermes-agent.nousresearch.com/docs/developer-guide/agent-loop
[40] https://hermes-agent.nousresearch.com/docs/user-guide/features/overview
[41] https://code.claude.com/docs/en/how-claude-code-works
[42] https://huggingface.co/learn/agents-course/en/unit1/what-are-llms
[43] https://jalammar.github.io/illustrated-gpt2
[44] https://huggingface.co/docs/transformers/generation_strategies
[45] https://www.youtube.com/watch?v=LPZh9BOjkQs
[46] https://platform.openai.com/tokenizer
[47] https://huggingface.co/learn/llm-course/chapter6/5
[48] https://developers.openai.com/api/docs/guides/token-counting
[49] https://www.youtube.com/watch?v=zduSFxRajkE
[50] https://arxiv.org/abs/2310.08754
[51] https://platform.claude.com/docs/en/build-with-claude/context-windows
[52] https://www.anthropic.com/research/effective-context-engineering-for-ai-agents
[53] https://arxiv.org/abs/2307.03172
[54] https://developers.google.com/machine-learning/crash-course/llm/tuning
[55] https://huggingface.co/docs/course/chapter11/1
[56] https://openai.com/index/instruction-following
[57] https://arxiv.org/abs/2305.11206
[58] https://openai.com/index/why-language-models-hallucinate
[59] https://github.blog/open-source/maintainers/why-we-open-sourced-our-mcp-server-and-what-it-means-for-you
[60] https://arxiv.org/abs/2005.11401
[61] https://docs.cloud.google.com/generative-ai-app-builder/docs/check-grounding
[62] https://arxiv.org/abs/2508.02591
[63] https://arxiv.org/abs/2302.04761
[64] https://arxiv.org/abs/2207.05221
[65] https://aistudio.google.com/docs/tools
[66] https://openai.com/index/learning-to-reason-with-llms
[67] https://www.anthropic.com/news/visible-extended-thinking
[68] https://arxiv.org/abs/2501.12948
[69] https://www.swebench.com/SWE-bench
[70] https://platform.claude.com/docs/en/api/messages/create
[71] https://platform.claude.com/docs/en/build-with-claude/working-with-messages
[72] https://developers.openai.com/api/reference/resources/responses/methods/create
[73] https://developers.openai.com/api/docs/guides/prompt-engineering
[74] https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
[75] https://github.com/anthropics/prompt-eng-interactive-tutorial
[76] https://arxiv.org/abs/2005.14165
[77] https://www.anthropic.com/research/writing-tools-for-agents
[78] https://github.com/openai/openai-cookbook/blob/main/examples/Question_answering_using_embeddings.ipynb
[79] https://docs.weaviate.io/weaviate/search
[80] https://www.anthropic.com/research/contextual-retrieval
[81] https://docs.aws.amazon.com/prescriptive-guidance/latest/retrieval-augmented-generation-options/rag-vs-fine-tuning.html
[82] https://cloud.google.com/blog/products/ai-machine-learning/to-tune-or-not-to-tune-a-guide-to-leveraging-your-data-with-llms
[83] https://cloud.google.com/blog/topics/developers-practitioners/mastering-model-adaptation-a-guide-to-fine-tuning-on-google-cloud
[84] https://arxiv.org/abs/2403.10131
[85] https://platform.claude.com/docs/en/test-and-evaluate/develop-tests
[86] https://developers.openai.com/api/docs/guides/evaluation-best-practices
[87] https://platform.claude.com/cookbook/misc-building-evals
[88] https://www.anthropic.com/research/demystifying-evals-for-ai-agents
[89] https://platform.claude.com/docs/en/manage-claude/opentelemetry
[90] https://platform.claude.com/docs/en/api/errors
[91] https://genai.owasp.org/llmrisk/llm01-prompt-injection
[92] https://www.youtube.com/watch?v=LCEmiRjPEtQ&t=1420s
[93] https://docs.aws.amazon.com/prescriptive-guidance/latest/govern-architect-agentic-ai/agents-layer.html
[94] https://openai.github.io/openai-agents-python
[95] https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html
[96] https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-patterns/memory-augmented-agents.html
[97] https://openai.github.io/openai-agents-python/sandbox_agents
[98] https://developers.openai.com/api/docs/pricing
[99] https://developers.openai.com/api/docs/guides/prompt-caching
[100] https://developers.openai.com/api/docs/guides/cost-optimization
[101] https://platform.claude.com/docs/en/build-with-claude/prompt-caching
[102] https://platform.claude.com/docs/en/about-claude/pricing
[103] https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence
[104] https://arxiv.org/abs/2302.12173
[105] https://developers.openai.com/api/docs/guides/agents/guardrails-approvals
[106] https://openai.github.io/openai-agents-python/tracing
[107] https://docs.langchain.com/langsmith/observability-quickstart
[108] https://github.com/open-telemetry/semantic-conventions-genai
[109] https://developers.openai.com/api/docs/guides/latency-optimization
[110] https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop
[111] https://airc.nist.gov/airmf-resources/airmf/5-sec-core
[112] https://www.gov.uk/guidance/assessing-if-artificial-intelligence-is-the-right-solution
[113] https://academic.oup.com/qje/article/140/2/889/7990658
[114] https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study
[115] https://metr.org/blog/2026-02-24-uplift-update
[116] https://www.gov.uk/guidance/define-your-purchasing-strategy
[117] https://www.gov.uk/government/publications/guidelines-for-ai-procurement/guidelines-for-ai-procurement
[118] https://airc.nist.gov/airmf-resources/airmf/appendices/app-a-descriptions-of-ai-actor-tasks
[119] https://www.ai.gov.au/planning-ai/prepare-your-business/redesign-your-workflow
[120] https://arxiv.org/abs/2210.03629
[121] https://airc.nist.gov/airmf-resources/playbook/measure
