import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { lessons } from '../src/data/lessons.ts';
import { lenses } from '../src/data/context/lenses.ts';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const lessonsDir = join(root, 'src/content/lessons');
const post = process.argv.includes('--post');
const errors: string[] = [];
const warnings: string[] = [];

const countWords = (body: string): number => {
  let text = matter(body).content;
  text = text
    .replace(/^import\s+.*$/gm, '')
    .replace(/^export\s+.*$/gm, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<Aside\b[\s\S]*?<\/Aside>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^{}]*\}/g, ' ')
    .replace(/[0-9]/g, ' ');
  const words = text.match(/[\u0600-\u06FF\u200c]+/g) ?? [];
  return words.length;
};

const files = readdirSync(lessonsDir).filter((f) => f.endsWith('.mdx'));
const actual = new Map<string, number>();
for (const file of files) {
  const raw = readFileSync(join(lessonsDir, file), 'utf8');
  const data = matter(raw).data as Record<string, any>;
  actual.set(data.id, countWords(raw));
}

let totalWords = 0;
for (const lesson of lessons) {
  const count = actual.get(lesson.id) ?? 0;
  totalWords += count;
  const low = Math.floor(lesson.words * 0.9);
  const high = Math.ceil(lesson.words * 1.1);
  if (count < low) warnings.push(`lesson ${lesson.id}: ${count} words, below ${low} (budget ${lesson.words})`);
  if (count > high) errors.push(`lesson ${lesson.id}: ${count} words, above ${high} (budget ${lesson.words})`);
}

console.log(`budget: ${totalWords} Persian words across ${files.length} lessons`);

if (post) {
  const dist = join(root, 'dist');
  const entries = readdirSync(dist);
  if (entries.length !== 1 || entries[0] !== 'index.html') {
    errors.push(`dist should contain exactly index.html, found: ${entries.join(', ')}`);
  }
  const file = join(dist, 'index.html');
  const size = statSync(file).size;
  const mb = size / (1024 * 1024);
  console.log(`budget: dist/index.html is ${mb.toFixed(2)} MB`);
  if (size > 3 * 1024 * 1024) errors.push('dist/index.html exceeds the 3 MB hard cap');
  else if (size > 1.5 * 1024 * 1024) warnings.push('dist/index.html exceeds the 1.5 MB target');

  const html = readFileSync(file, 'utf8');
  const external = [...html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)]
    .map((m) => m[1])
    .filter((url) => !url.startsWith('http://www.w3.org/'));
  if (external.length) errors.push(`external asset references: ${external.slice(0, 5).join(', ')}`);
  if (/<img\b/i.test(html)) warnings.push('raster <img> found in output');
  if (!html.includes('lang="fa"') || !html.includes('dir="rtl"')) errors.push('missing lang="fa" or dir="rtl"');
  const lessonCount = (html.match(/class="lesson"/g) ?? []).length;
  const partCount = (html.match(/class="part-divider full"/g) ?? []).length;
  if (lessonCount !== lessons.length) errors.push(`expected ${lessons.length} lesson articles in output, found ${lessonCount}`);
  if (partCount !== 6) errors.push(`expected 6 part dividers in output, found ${partCount}`);

  const lensCount = (html.match(/data-context-lens=/g) ?? []).length;
  const labCount = (html.match(/data-context-lab=/g) ?? []).length;
  const expectedLenses = lenses.filter((l) => l.mode !== 'lab').length;
  if (lensCount !== expectedLenses) {
    errors.push(`expected ${expectedLenses} context lenses in output, found ${lensCount}`);
  }
  if (labCount !== 1) errors.push(`expected 1 context lab in output, found ${labCount}`);
  if (size > 678 * 1024) {
    warnings.push(
      `context lenses added ${Math.round((size - 618 * 1024) / 1024)} KB over the 618 KB baseline (plan estimate: <= 60 KB)`,
    );
  }
}

for (const warning of warnings) console.warn(`warning: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}
console.log('budget: OK');
