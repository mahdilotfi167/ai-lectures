import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { lessons, compareLessonId } from '../src/data/lessons.ts';
import { terms } from '../src/data/glossary.ts';
import { lenses, lensByKey } from '../src/data/context/lenses.ts';
import { kinds, type KindDef } from '../src/data/context/kinds.ts';
import { blockById } from '../src/data/context/blocks.ts';
import { story } from '../src/data/context/story.ts';
import { labToggles, labSentences, labPresets, composeLab, labDefaultState } from '../src/data/context/lab.ts';
import type { BlockRef, LensDef } from '../src/data/context/types.ts';
import { containsPersianTerm } from './lib/persian-term.ts';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const lessonsDir = join(root, 'src/content/lessons');
const errors: string[] = [];
const warnings: string[] = [];

const lessonIds = new Set(lessons.map((l) => l.id));
const labLesson = lenses.find((lens) => lens.mode === 'lab')?.lesson;
const allowedLatin = new Set(
  readFileSync(join(root, 'allowed-latin.txt'), 'utf8')
    .split('\n')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
);
const glossaryLatin = new Set<string>();
for (const term of terms) {
  glossaryLatin.add(term.en.toLowerCase());
  for (const alias of term.aliases ?? []) {
    if (/^[A-Za-z]/.test(alias)) glossaryLatin.add(alias.toLowerCase());
  }
}

const containsLatin = (text: string, form: string): boolean => {
  if (!form) return false;
  const escaped = form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![A-Za-z])${escaped}(?![A-Za-z])`, 'i').test(text);
};

const persianForms = (term: (typeof terms)[number]) =>
  [term.fa, term.short, ...(term.aliases ?? [])].filter((s) => s && !/^[A-Za-z]/.test(s));
const latinForms = (term: (typeof terms)[number]) =>
  [term.en, ...(term.aliases ?? [])].filter((s) => s && /^[A-Za-z]/.test(s));

const isJsonKind = (kind: KindDef, text: string) =>
  kind.format === 'json' || (kind.format === 'auto' && /^[[{]/.test(text.trim()));

const isProseKind = (kind: KindDef) =>
  ['prose', 'list'].includes(kind.format) && kind.id !== 'tool_result';

const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

function collectTextFromBlockRef(ref: BlockRef, out: string[], outProse: string[]) {
  const block = blockById.get(ref.id);
  if (!block) return;
  const kind = kinds[block.kind];
  const text = ref.text ?? block.text;
  out.push(ref.note ?? '', ref.edge ?? '', ref.text ?? '');
  if (isJsonKind(kind, text)) return;
  if (isProseKind(kind)) {
    out.push(text);
    outProse.push(text);
  }
  out.push(kind.label);
}

function collectLensText(lens: LensDef) {
  const out: string[] = [lens.title ?? '', lens.narration ?? '', lens.compareNote ?? ''];
  const prose: string[] = [];
  for (const frame of lens.frames ?? []) {
    out.push(frame.title, frame.narration, frame.tapeLabel ?? '', frame.output?.text ?? '', frame.output?.label ?? '', frame.output?.note ?? '');
    out.push(frame.outside?.label ?? '', frame.outside?.detail ?? '');
    out.push(frame.messages ?? '', frame.messagesNote ?? '', frame.messagesLabel ?? '');
    for (const ref of frame.blocks) collectTextFromBlockRef(ref, out, prose);
  }
  for (const panel of lens.panels ?? []) {
    out.push(panel.label, panel.note ?? '', panel.modelLabel ?? '', panel.output?.text ?? '', panel.output?.note ?? '');
    for (const ref of panel.blocks) collectTextFromBlockRef(ref, out, prose);
  }
  for (const slot of lens.slots ?? []) out.push(slot.label, slot.badge ?? '');
  return { all: out.join(' '), prose: prose.join(' ') };
}

/* 1 — lens integrity + one lens per lesson */
const used = new Map<string, string>();
for (const lens of lenses) {
  if (!lessonIds.has(lens.lesson)) errors.push(`lens ${lens.key}: unknown lesson ${lens.lesson}`);
  if (used.has(lens.lesson)) errors.push(`lens ${lens.key}: lesson ${lens.lesson} already has ${used.get(lens.lesson)}`);
  used.set(lens.lesson, lens.key);
  if (lens.mode === 'steps' || lens.mode === 'mapping') {
    if ((lens.frames ?? []).length < 3) errors.push(`lens ${lens.key}: steps needs >= 3 frames`);
  }
  if (lens.mode === 'compare') {
    if (!lens.panels || lens.panels.length !== 2) errors.push(`lens ${lens.key}: compare needs 2 panels`);
    if (!lens.compareNote) warnings.push(`lens ${lens.key}: compare has no compareNote`);
  }
  if (lens.mode === 'static' && (lens.frames ?? []).length !== 1) {
    errors.push(`lens ${lens.key}: static needs exactly 1 frame`);
  }
  if (lens.mode === 'lab' && lens.lesson !== lessons.find((lesson) => lesson.slug === 'context-engineering')?.id) errors.push(`lens ${lens.key}: lab must accompany context assembly`);
}

const labLenses = lenses.filter((l) => l.mode === 'lab');
if (labLenses.length !== 1) errors.push(`expected exactly 1 lab lens, found ${labLenses.length}`);

/* 2 — frame schema and narration */
for (const lens of lenses) {
  for (const frame of lens.frames ?? []) {
    if (!frame.title || !frame.narration) errors.push(`lens ${lens.key}/${frame.id}: title or narration missing`);
    if (wordCount(frame.narration) > 22) {
      errors.push(`lens ${lens.key}/${frame.id}: narration ${wordCount(frame.narration)} words (max 22)`);
    }
  }
}

/* 3 — kind gate */
for (const lens of lenses) {
  const checkRef = (ref: BlockRef) => {
    const block = blockById.get(ref.id);
    if (!block) {
      errors.push(`lens ${lens.key}: unknown block ${ref.id}`);
      return;
    }
    const kind = kinds[block.kind];
    if (ref.lessonRef && !lessonIds.has(ref.lessonRef)) errors.push(`lens ${lens.key}: unknown reference ${ref.lessonRef}`);
    if (compareLessonId(kind.introducedIn, lens.lesson) > 0) {
      errors.push(
        `lens ${lens.key}: block ${ref.id} kind "${kind.id}" introduced in ${kind.introducedIn}, lens is ${lens.lesson}`,
      );
    }
  };
  for (const frame of lens.frames ?? []) frame.blocks.forEach(checkRef);
  for (const panel of lens.panels ?? []) panel.blocks.forEach(checkRef);
}

/* 4 — glossary gate for lens prose */
for (const lens of lenses) {
  const { all, prose } = collectLensText(lens);
  for (const term of terms) {
    if (compareLessonId(lens.lesson, term.not_before) >= 0) continue;
    const hit = persianForms(term).find((form) => containsPersianTerm(all, form, term.id));
    if (hit) {
      errors.push(`lens ${lens.key}: "${hit}" (${term.id}) before ${term.not_before}`);
      continue;
    }
    const latinHit = latinForms(term).find((form) => containsLatin(all, form));
    if (latinHit) errors.push(`lens ${lens.key}: "${latinHit}" (${term.id}) before ${term.not_before}`);
  }

  // unknown Latin in prose-ish lens text (not code/JSON)
  const tokens = [...prose.matchAll(/[A-Za-z][A-Za-z0-9._+-]{2,}/g)].map((m) =>
    m[0].replace(/[._+-]+$/, ''),
  );
  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (allowedLatin.has(lower) || glossaryLatin.has(lower)) continue;
    errors.push(`lens ${lens.key}: unknown Latin "${token}"`);
  }
}

/* 5 — JSON blocks + Latin digits */
for (const block of blockById.values()) {
  const kind = kinds[block.kind];
  if (isJsonKind(kind, block.text)) {
    try {
      JSON.parse(block.text);
    } catch {
      errors.push(`block ${block.id}: invalid JSON`);
    }
    if (/[^\x00-\x7F]/.test(block.text)) errors.push(`block ${block.id}: JSON is not ASCII`);
  } else if (isProseKind(kind) && /[0-9]/.test(block.text.replace(/\b[A-Za-z][A-Za-z0-9_./:-]*\b/g, ''))) {
    errors.push(`block ${block.id}: Latin digits in prose`);
  }
}
for (const lens of lenses) {
  for (const frame of lens.frames ?? []) {
    if (frame.messages) {
      try {
        JSON.parse(frame.messages);
      } catch {
        errors.push(`lens ${lens.key}/${frame.id}: invalid messages JSON`);
      }
    }
  }
}

/* 6 — story invariants */
const must = (id: string, needle: string, label: string) => {
  const b = blockById.get(id);
  if (!b || !b.text.includes(needle)) errors.push(`story: ${id} must include ${label}`);
};
must('sys', 'دستیار برنامه‌نویسی', 'the coding-assistant role');
must('mem', story.file, 'the source file');
must('mem', story.testCommand, 'the current test command');
must('mem.stale', story.staleTestCommand, 'the intentional stale command');
must('r.file', story.originalCode, 'the illustrative source text');
must('a.editcall', story.fixedCode, 'the proposed edit');
must('r.edited', story.fixedCode, 'the applied edit');
must('doc.guide', 'تفاوت فایل‌ها', 'the project review rule');
must('test.fail', 'empty input: expected 0', 'the illustrative test failure');
must('test.pass', `${story.passedTests} tests passed`, 'the successful test count');
must('a.hallucinated', story.inventedFile, 'the intentionally invented file');
must('a.badcall', story.privateFile, 'the blocked secrets-file request');
must('a.skill.read', story.skillFile, 'the explicit skill-file read request');
must('skill.menu', story.skillFile, 'the discoverable skill path');
must('r.denied', 'Permission denied', 'the returned permission error');
must('a.test.again', story.testCommand, 'the distinct post-edit test request');

/* 7 — Lab sanity + glossary gate at its actual host */
const labText = [
  ...labToggles.flatMap((t) => [t.label, t.hint]),
  ...labSentences.flatMap((s) => s.variants.flatMap((v) => [v.text, ...v.sources])),
  ...labPresets.map((p) => p.label),
].join(' ');
for (const term of terms) {
  if (!labLesson || compareLessonId(labLesson, term.not_before) >= 0) continue;
  const hit = persianForms(term).find((form) => containsPersianTerm(labText, form, term.id));
  if (hit) errors.push(`lab: "${hit}" (${term.id}) before ${term.not_before}`);
}
const allPresets = labPresets.map((p) => p.state);
for (const state of [{ ...labDefaultState }, ...allPresets]) {
  const answers = composeLab(state);
  if (answers.length < 3) errors.push('lab: every state must produce at least S1-S3');
  for (const answer of answers) {
    if (!answer.text) errors.push('lab: empty sentence');
  }
}
for (const sentence of labSentences) {
  if (!sentence.variants.length) errors.push(`lab: ${sentence.id} has no variants`);
}
if (labToggles.length !== 5) errors.push(`lab: expected 5 toggles, found ${labToggles.length}`);

/* 8 — MDX calls match frontmatter */
const parsed = readdirSync(lessonsDir)
  .filter((f) => f.endsWith('.mdx'))
  .map((file) => {
    const raw = readFileSync(join(lessonsDir, file), 'utf8');
    const fm = matter(raw);
    return { file, data: fm.data as Record<string, any>, body: fm.content };
  });

for (const entry of parsed) {
  const meta = entry.data.context_lens;
  if (!meta) continue;
  const lens = lensByKey.get(meta.lens);
  if (!lens) {
    errors.push(`${entry.data.id}: unknown context lens "${meta.lens}"`);
    continue;
  }
  if (lens.lesson !== entry.data.id) {
    errors.push(`${entry.data.id}: lens ${meta.lens} belongs to ${lens.lesson}`);
  }
  if (meta.id !== `fig-${entry.data.slug}-ctx`) {
    errors.push(`${entry.data.id}: context lens id ${meta.id} does not follow fig-SLUG-ctx`);
  }
  const tag = entry.body.match(/<Context(Lens|Lab)\b[\s\S]*?\/>/)?.[0];
  if (!tag) {
    errors.push(`${entry.data.id}: no <ContextLens>/<ContextLab> call`);
    continue;
  }
  if (!tag.includes(`id="${meta.id}"`)) errors.push(`${entry.data.id}: lens call id mismatch`);
  if (!tag.includes(`caption="${meta.caption_fa}"`)) {
    errors.push(`${entry.data.id}: lens caption does not match frontmatter`);
  }
  const desc = tag.match(/desc="([^"]*)"/)?.[1] ?? '';
  if (desc.length < 25) errors.push(`${entry.data.id}: lens desc missing or too short`);
  if (tag.startsWith('<ContextLens') && !tag.includes(`lens="${meta.lens}"`)) {
    errors.push(`${entry.data.id}: lens call missing lens="${meta.lens}"`);
  }
}

const mdxLensCount = parsed.filter((p) => p.data.context_lens).length;
if (mdxLensCount !== lenses.length) {
  errors.push(`expected ${lenses.length} lens lessons, found ${mdxLensCount}`);
}

console.log(`context: ${lenses.length - 1} lenses + 1 lab`);
for (const warning of warnings) console.warn(`warning: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}
console.log('context: OK');
