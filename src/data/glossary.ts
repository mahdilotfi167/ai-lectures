import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';

export interface Term {
  id: string;
  en: string;
  fa: string;
  style: 'translate' | 'transliterate' | 'keep-latin' | 'translate-plus-latin';
  first_use: string;
  short: string;
  not_before: string;
  def_fa: string;
  def_en: string;
  status: 'proposed' | 'confirmed';
  aliases: string[];
  zone: string;
}

const file = new URL('../../glossary.yml', import.meta.url);
const parsed = load(readFileSync(file, 'utf8')) as { terms: Term[] };

export const terms: Term[] = parsed.terms;
export const termById = new Map(terms.map((t) => [t.id, t]));

export function requireTerm(id: string): Term {
  const t = termById.get(id);
  if (!t) throw new Error(`Unknown glossary term: ${id}`);
  return t;
}
