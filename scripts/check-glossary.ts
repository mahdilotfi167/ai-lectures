import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { terms } from '../src/data/glossary.ts';
import { compareLessonId } from '../src/data/lessons.ts';
import { containsPersianTerm } from './lib/persian-term.ts';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const lessonsDir = join(root, 'src/content/lessons');
const requireConfirmed = process.argv.includes('--require-confirmed');

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

const errors: string[] = [];
const warnings: string[] = [];

const files = readdirSync(lessonsDir).filter((f) => f.endsWith('.mdx')).sort();
const parsed = files.map((file) => {
  const raw = readFileSync(join(lessonsDir, file), 'utf8');
  const fm = matter(raw);
  return { file, data: fm.data as Record<string, any>, body: fm.content };
});
parsed.sort((a, b) => compareLessonId(a.data.id, b.data.id));

function cleanBody(body: string): string {
  return body
    .replace(/^import\s+.*$/gm, '')
    .replace(/^export\s+.*$/gm, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<(Ltr|Code)\b[^>]*>[\s\S]*?<\/\1>/g, ' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ');
}

const TEXT_ATTRS =
  'caption|desc|title|label|body|example|badge|note|promise|role|fixes|doesNotFix|cost|source|hint|outcome|value|text|token|hub|sublabel|content|shortLabel|labelShort';

function textForTerms(body: string): string {
  const values: string[] = [];
  const attrRe = new RegExp(`\\b(${TEXT_ATTRS})\\s*=\\s*"([^"]*)"`, 'g');
  for (const m of body.matchAll(attrRe)) values.push(m[2]);
  const keyRe = new RegExp(`\\b(${TEXT_ATTRS})\\s*:\\s*['"]([^'"]*)['"]`, 'g');
  for (const m of body.matchAll(keyRe)) values.push(m[2]);
  for (const m of body.matchAll(/\b(traits|apps|tools|reads|writes)\s*:\s*\[([^\]]*)\]/g)) {
    for (const s of m[2].matchAll(/['"]([^'"]*)['"]/g)) values.push(s[1]);
  }
  let text = cleanBody(body).replace(/<[^>]+>/g, ' ');
  text = text.replace(/\{[^{}]*\}/g, ' ');
  text += ' ' + values.join(' ');
  return text.replace(/\s+/g, ' ').trim();
}

function latinOnly(body: string): string {
  let text = cleanBody(body);
  text = text.replace(/<[^>]+>/g, ' ');
  text = text.replace(/\{[^{}]*\}/g, ' ');
  return text.replace(/\s+/g, ' ').trim();
}

const containsLatin = (text: string, form: string): boolean => {
  if (!form) return false;
  const escaped = form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![A-Za-z])${escaped}(?![A-Za-z])`, 'i').test(text);
};

/* Rule 1 — not_before */
for (const term of terms) {
  const persianForms = [term.fa, term.short, ...(term.aliases ?? [])].filter(
    (s) => s && !/^[A-Za-z]/.test(s),
  );
  const latinForms = [term.en, ...(term.aliases ?? [])].filter((s) => s && /^[A-Za-z]/.test(s));

  for (const lesson of parsed) {
    if (compareLessonId(lesson.data.id, term.not_before) >= 0) continue;
    const text = textForTerms(lesson.body);
    for (const form of persianForms) {
      if (containsPersianTerm(text, form, term.id)) {
        errors.push(
          `not_before: "${form}" (${term.id}) appears in ${lesson.data.id}, before ${term.not_before}`,
        );
        break;
      }
    }
    for (const form of latinForms) {
      if (containsLatin(text, form)) {
        errors.push(
          `not_before: "${form}" (${term.id}) appears in ${lesson.data.id}, before ${term.not_before}`,
        );
        break;
      }
    }
  }
}

/* Rule 2 — first use */
for (const term of terms) {
  const intro = parsed.find((p) => p.data.id === term.not_before);
  if (!intro) {
    errors.push(`first-use: no lesson ${term.not_before} for ${term.id}`);
    continue;
  }
  if (!intro.body.includes(`<Term id="${term.id}"`)) {
    errors.push(`first-use: ${term.id} not introduced via <Term> in ${term.not_before}`);
  }
  for (const lesson of parsed) {
    if (compareLessonId(lesson.data.id, term.not_before) <= 0) continue;
    const repeatedFirstUse = [...lesson.body.matchAll(/<Term\b[^>]*\/>/g)].some(([tag]) => {
      const id = tag.match(/\bid\s*=\s*["']([^"']+)["']/)?.[1];
      const form = tag.match(/\bform\s*=\s*["']([^"']+)["']/)?.[1];
      return id === term.id && form !== 'short';
    });
    const repeatedGloss = term.first_use !== term.short && lesson.body.includes(term.first_use);
    if (repeatedFirstUse || repeatedGloss) {
      errors.push(`first-use: ${term.id} re-glossed in ${lesson.data.id}`);
    }
    if (term.style !== 'keep-latin') {
      const text = textForTerms(lesson.body);
      if (containsLatin(text, term.en)) {
        errors.push(`first-use: English form "${term.en}" used in ${lesson.data.id} instead of "${term.short}"`);
      }
    }
  }
}

/* Rule 3 — unknown Latin in prose */
for (const lesson of parsed) {
  const text = latinOnly(lesson.body);
  const tokens = [...text.matchAll(/[A-Za-z][A-Za-z0-9._+-]{2,}/g)].map((m) =>
    m[0].replace(/[._+-]+$/, ''),
  );
  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (allowedLatin.has(lower) || glossaryLatin.has(lower)) continue;
    errors.push(`unknown-latin: "${token}" in ${lesson.data.id}`);
  }
}

/* Rule 4 — unconfirmed terms */
if (requireConfirmed) {
  for (const term of terms) {
    if (term.status !== 'confirmed') errors.push(`unconfirmed: ${term.id} is ${term.status}`);
  }
}

/* Warnings */
const zwnjless = [
  'میشود',
  'میکند',
  'میدهد',
  'میگیرد',
  'میبیند',
  'میگوید',
  'میآید',
  'میخواهد',
  'ورکفلو',
  'چتبات',
  'همراستاسازی',
  'فاینتیونینگ',
  'تکهتکهکردن',
  'غیرقطعیبودن',
  'چندنمونه',
];
for (const lesson of parsed) {
  const text = textForTerms(lesson.body);
  for (const compound of zwnjless) {
    if (text.includes(compound)) warnings.push(`ZWNJ: "${compound}" in ${lesson.data.id}`);
  }
}

for (const glossaryTerm of terms) {
  const used = parsed.some((p) => {
    if (compareLessonId(p.data.id, glossaryTerm.not_before) < 0) return false;
    if (p.body.includes(`<Term id="${glossaryTerm.id}"`)) return true;
    const text = textForTerms(p.body);
    return (
      containsPersianTerm(text, glossaryTerm.short, glossaryTerm.id) ||
      containsPersianTerm(text, glossaryTerm.fa, glossaryTerm.id) ||
      (glossaryTerm.style === 'keep-latin' && text.includes(glossaryTerm.en))
    );
  });
  if (!used) warnings.push(`unused term: ${glossaryTerm.id}`);
}

for (const lesson of parsed) {
  const text = latinOnly(lesson.body);
  if (/[0-9]/.test(text)) warnings.push(`Latin digits in prose: ${lesson.data.id}`);
  const sentences = text.split(/[.؟!]+/).map((s) => s.trim()).filter(Boolean);
  for (const sentence of sentences) {
    const count = sentence.split(/\s+/).filter(Boolean).length;
    if (count > 22) warnings.push(`long sentence (${count} words): ${lesson.data.id}`);
  }
}

console.log(`glossary: ${terms.length} terms, ${parsed.length} lessons`);
for (const warning of warnings) console.warn(`warning: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}
console.log('glossary: OK');
