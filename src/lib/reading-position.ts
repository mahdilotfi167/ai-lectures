import { canonicalAnchor } from '../data/curriculum-migration.ts';

export interface ReadingPosition {
  version: 2;
  section: string | null;
  point: number;
  fraction: number;
  scrollY: number;
  hash: string;
}

/** Keep fragment identity stable while still accepting published numeric URLs. */
export const readingHash = (hash: string): string => hash.startsWith('#')
  ? `#${canonicalAnchor(hash.slice(1))}` : hash;

/** A rewritten lesson's child index is not a safe resume destination. */
export function parseReadingPosition(raw: string | null): ReadingPosition | null {
  try {
    const value = JSON.parse(raw ?? 'null');
    if (!value || ![1, 2].includes(value.version) ||
        !(value.section === null || typeof value.section === 'string') ||
        !Number.isInteger(value.point) || value.point < 0 ||
        !Number.isFinite(value.fraction) || value.fraction < 0 || value.fraction > 1 ||
        !Number.isFinite(value.scrollY) || value.scrollY < 0 || typeof value.hash !== 'string') return null;
    if (value.version === 2) return value;
    return {
      version: 2,
      section: value.section === null ? null : canonicalAnchor(value.section),
      point: 0, fraction: 0, scrollY: 0,
      hash: readingHash(value.hash),
    };
  } catch {
    return null;
  }
}
