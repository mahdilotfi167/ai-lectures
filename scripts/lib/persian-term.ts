// These phrases describe the book's teaching material, not model training.
// Keep the exceptions phrase-scoped: bare «آموزش», training compounds, and
// technical uses of «آموزشی» elsewhere must still pass through the term gate.
const teachingPhrases = /(?<![\p{L}\p{M}\p{N}\u200c])(?:آموزش یک محصول|شکل آموزشی|مرزها آموزشی‌اند)(?![\p{L}\p{M}\p{N}\u200c])/gu;

export function containsPersianTerm(text: string, form: string, termId: string): boolean {
  if (!form) return false;
  // «چیدمان» and «خدمات» are not the temperature parameter. Keep the actual
  // noun and its ordinary suffixes gated, e.g. «دمای» and «دماهای».
  if (termId === 'temperature' && form === 'دما') {
    return /(?<![\p{L}\p{M}\p{N}\u200c])دما(?:ی|\u200c?ها(?:ی)?)?(?![\p{L}\p{M}\p{N}\u200c])/u.test(text);
  }
  const termText = termId === 'training' && form === 'آموزش'
    ? text.replace(teachingPhrases, ' ')
    : text;
  return termText.includes(form);
}
