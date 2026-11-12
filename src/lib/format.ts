import { lessonById, lessons, parts } from '../data/lessons.ts';

const FA = '۰۱۲۳۴۵۶۷۸۹';

export const faNum = (value: string | number): string =>
  String(value).replace(/[0-9]/g, (d) => FA[Number(d)]);

export const lessonAnchor = (id: string): string => `lesson-${lessonById.get(id)?.slug ?? id}`;

export const figNum = (id: string): string => {
  const base = id.replace(/-ctx$/, '');
  return lessons.find((lesson) => lesson.figure?.id === base || `fig-${lesson.slug}` === base)?.id ?? id;
};

export const partAnchor = (part: number): string => `part-${parts.find((item) => item.part === part)?.zone ?? part}`;

export const partVar = (part: number): string => `var(--part-${part})`;
