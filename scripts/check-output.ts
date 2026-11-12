import { readFileSync } from 'node:fs';
import { lessons, parts } from '../src/data/lessons.ts';
import { legacyAnchors } from '../src/data/curriculum-migration.ts';
import { lessonAnchor, partAnchor } from '../src/lib/format.ts';

// Only inspect markup, never attribute-looking strings in bundled JS/CSS.
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
const tags = [...html.matchAll(/<[a-z][^>]*>/gi)].map(([tag]) => tag);
const ids = new Map<string, number>();
const references: string[] = [];
const errors: string[] = [];
for (const tag of tags) {
  const id = tag.match(/\sid="([^"]+)"/)?.[1];
  if (id) ids.set(id, (ids.get(id) ?? 0) + 1);
  for (const [, ref] of tag.matchAll(/\s(?:href|xlink:href)="#([^"]+)"/g)) references.push(ref);
  for (const [, refs] of tag.matchAll(/\saria-(?:labelledby|describedby)="([^"]+)"/g)) references.push(...refs.split(/\s+/));
}
for (const [id, count] of ids) if (count !== 1) errors.push(`duplicate id ${id} (${count})`);
for (const ref of new Set(references)) if (!ids.has(ref)) errors.push(`missing internal destination ${ref}`);
for (const lesson of lessons) if (!ids.has(lessonAnchor(lesson.id))) errors.push(`missing lesson ${lesson.id}`);
for (const part of parts) if (!ids.has(partAnchor(part.part))) errors.push(`missing Part ${part.part}`);
for (const [alias, target] of Object.entries(legacyAnchors)) {
  if (!ids.has(alias) || !ids.has(target)) errors.push(`missing compatibility link ${alias} -> ${target}`);
}
if (errors.length) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}
console.log(`output: ${ids.size} unique IDs, ${new Set(references).size} internal destinations, ${Object.keys(legacyAnchors).length} legacy aliases — OK`);
