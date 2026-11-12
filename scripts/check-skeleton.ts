import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { lessons, parts, stages } from '../src/data/lessons.ts';
import { termById } from '../src/data/glossary.ts';
import { lenses, lensByKey } from '../src/data/context/lenses.ts';
import { legacyAnchors } from '../src/data/curriculum-migration.ts';
import { lessonAnchor, partAnchor } from '../src/lib/format.ts';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dir = join(root, 'src/content/lessons');
const errors: string[] = [];
const warnings: string[] = [];

const files = readdirSync(dir).filter((f) => f.endsWith('.mdx')).sort();
if (files.length !== lessons.length) errors.push(`expected ${lessons.length} lesson files, found ${files.length}`);

const parsed = files.map((file) => {
  const raw = readFileSync(join(dir, file), 'utf8');
  const fm = matter(raw);
  return { file, data: fm.data as Record<string, any>, body: fm.content };
});
const byId = new Map(parsed.map((p) => [p.data.id, p]));

for (const expected of lessons) {
  const p = byId.get(expected.id);
  if (!p) {
    errors.push(`missing lesson ${expected.id}`);
    continue;
  }
  const d = p.data;
  const prefix = `lesson ${expected.id}`;

  if (d.part !== expected.part) errors.push(`${prefix}: part ${d.part} != ${expected.part}`);
  if (d.slug !== expected.slug) errors.push(`${prefix}: slug ${d.slug} != ${expected.slug}`);
  if (d.title_fa !== expected.title) errors.push(`${prefix}: title mismatch`);
  if (d.objective_fa !== expected.objective) errors.push(`${prefix}: objective mismatch`);
  if (d.example !== expected.example) errors.push(`${prefix}: example ${d.example} != ${expected.example}`);
  if (d.words !== expected.words) errors.push(`${prefix}: words ${d.words} != ${expected.words}`);
  if (d.has_aside !== expected.hasAside) errors.push(`${prefix}: has_aside mismatch`);
  if (JSON.stringify(d.terms_introduced) !== JSON.stringify(expected.terms)) errors.push(`${prefix}: terms mismatch`);
  const introduced = expected.terms.slice().sort();
  const glossaryIntroduced = [...termById.values()].filter((term) => term.not_before === expected.id).map((term) => term.id).sort();
  if (JSON.stringify(introduced) !== JSON.stringify(glossaryIntroduced)) errors.push(`${prefix}: terms do not match glossary introductions`);
  for (const termId of introduced) {
    if (termById.get(termId)?.zone !== parts.find((part) => part.part === expected.part)?.zone) errors.push(`${prefix}: ${termId} has a stale concept zone`);
  }
  if (d.status !== 'confirmed') warnings.push(`${prefix}: status is ${d.status}, not confirmed`);

  if (expected.figure) {
    if (d.figure?.component !== expected.figure.component) {
      errors.push(`${prefix}: figure component ${d.figure?.component} != ${expected.figure.component}`);
    }
    if (d.figure?.id !== expected.figure.id) errors.push(`${prefix}: figure id mismatch`);
    if (d.figure?.caption_fa !== expected.figure.caption) errors.push(`${prefix}: figure caption mismatch`);
    if (d.figure?.interactive !== expected.figure.interactive) {
      errors.push(`${prefix}: figure interactive mismatch`);
    }
  } else if (d.figure) {
    errors.push(`${prefix}: unexpected primary figure`);
  }

  const expectedFile = `${expected.part}-${expected.id.split('.')[1]}-${expected.slug}.mdx`;
  if (p.file !== expectedFile) errors.push(`${prefix}: filename ${p.file} != ${expectedFile}`);

  if (expected.figure) {
    const componentPath = join(root, 'src/components/figures', `${expected.figure.component}.astro`);
    if (!existsSync(componentPath)) errors.push(`${prefix}: missing figure component ${expected.figure.component}.astro`);
  }

  const lens = d.context_lens;
  if (lens) {
    const def = lensByKey.get(lens.lens);
    if (!def) {
      errors.push(`${prefix}: unknown context lens ${lens.lens}`);
    } else {
      if (def.lesson !== expected.id) errors.push(`${prefix}: lens ${lens.lens} belongs to ${def.lesson}`);
      const expectedLensId = `fig-${expected.slug}-ctx`;
      if (lens.id !== expectedLensId) errors.push(`${prefix}: lens id ${lens.id} != ${expectedLensId}`);
      if (def.mode === 'lab') {
        if (!p.body.includes('<ContextLab')) errors.push(`${prefix}: lab declared but no <ContextLab>`);
        if (lens.interactive !== 'lab') errors.push(`${prefix}: lab interactive must be lab`);
      } else {
        if (!p.body.includes('<ContextLens')) errors.push(`${prefix}: lens declared but no <ContextLens>`);
        if (def.mode === 'steps' || def.mode === 'mapping') {
          if (lens.interactive !== 'stepper') {
            errors.push(`${prefix}: stepper lens interactive must be stepper`);
          }
        } else if (lens.interactive !== false) {
          errors.push(`${prefix}: static/compare lens interactive must be false`);
        }
      }
      if (!p.body.includes(`id="${lens.id}"`)) errors.push(`${prefix}: lens call missing id`);
      if (!p.body.includes(`caption="${lens.caption_fa}"`)) errors.push(`${prefix}: lens caption mismatch`);
    }
  }

  for (const termId of d.terms_introduced ?? []) {
    if (!termById.has(termId)) errors.push(`${prefix}: unknown term ${termId}`);
  }

  if (expected.figure) {
    const tagRe = new RegExp(`<${expected.figure.component}\\b[\\s\\S]*?/>`);
    const tag = p.body.match(tagRe)?.[0];
    if (!tag) {
      errors.push(`${prefix}: no <${expected.figure.component} ... /> call in body`);
    } else {
      if (!tag.includes(`id="${expected.figure.id}"`)) errors.push(`${prefix}: figure call missing id="${expected.figure.id}"`);
      if (!tag.includes(`caption="${expected.figure.caption}"`)) {
        errors.push(`${prefix}: figure call caption does not match frontmatter`);
      }
      const desc = tag.match(/desc="([^"]*)"/)?.[1] ?? '';
      if (desc.length < 25) errors.push(`${prefix}: figure desc missing or too short`);
    }
  }

  if (!p.body.includes('<Takeaway>')) errors.push(`${prefix}: missing <Takeaway>`);
  if (d.has_aside && !p.body.includes('<Aside')) errors.push(`${prefix}: has_aside true but no <Aside>`);
  if (!d.has_aside && p.body.includes('<Aside')) errors.push(`${prefix}: has_aside false but <Aside> present`);
}

for (const p of parsed) {
  if (!lessons.some((l) => l.id === p.data.id)) errors.push(`unexpected lesson file ${p.file} (id ${p.data.id})`);
}

const interactive = parsed.filter((p) => p.data.figure?.interactive);
const expectedInteractive = lessons.filter((lesson) => lesson.figure?.interactive).length;
if (interactive.length !== expectedInteractive) {
  errors.push(`expected exactly ${expectedInteractive} interactive figures, found ${interactive.length}`);
}

const withLens = parsed.filter((p) => p.data.context_lens);
if (withLens.length !== lenses.length) errors.push(`expected ${lenses.length} lessons with a context lens, found ${withLens.length}`);

const stageParts = stages.flatMap((stage) => stage.parts);
if (new Set(stageParts).size !== stageParts.length ||
    JSON.stringify(stageParts) !== JSON.stringify(parts.map((part) => part.part))) errors.push('stages must cover every Part exactly once, in reading order');
for (const part of parts) {
  const sequence = lessons.filter((lesson) => lesson.part === part.part).map((lesson) => lesson.id);
  if (sequence.some((id, index) => id !== `${part.part}.${index + 1}`)) errors.push(`part ${part.part}: nonconsecutive display numbers`);
}
const anchors = new Set([
  ...lessons.map((lesson) => lessonAnchor(lesson.id)),
  ...lessons.flatMap((lesson) => lesson.figure ? [lesson.figure.id] : []),
  ...withLens.map((entry) => entry.data.context_lens.id),
  ...parts.map((part) => partAnchor(part.part)),
]);
for (const [alias, target] of Object.entries(legacyAnchors)) {
  if (anchors.has(alias)) errors.push(`legacy anchor ${alias} collides with a canonical anchor`);
  if (!anchors.has(target)) errors.push(`legacy anchor ${alias} has no destination ${target}`);
}

for (const part of parts) {
  const coding = parsed.filter((p) => p.data.part === part.part && p.data.example === 'coding');
  if (coding.length === 0) warnings.push(`part ${part.part}: no example: coding lesson`);
}

const ids = parsed.map((p) => p.data.id);
if (new Set(ids).size !== ids.length) errors.push('duplicate lesson ids');
if (new Set(lessons.map((lesson) => lesson.slug)).size !== lessons.length) errors.push('duplicate stable lesson slugs');

console.log(`skeleton: ${parsed.length} lessons, ${interactive.length} interactive figures`);
for (const warning of warnings) console.warn(`warning: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}
console.log('skeleton: OK');
