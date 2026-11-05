const FA = '۰۱۲۳۴۵۶۷۸۹';

export const faNum = (value: string | number): string =>
  String(value).replace(/[0-9]/g, (d) => FA[Number(d)]);

export const lessonAnchor = (id: string): string => `lesson-${id.replace('.', '-')}`;

export const figNum = (id: string): string => id.replace(/^fig-/, '').replace('-', '.');

export const partVar = (part: number): string => `var(--part-${part})`;
