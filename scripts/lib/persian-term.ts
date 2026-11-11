// These phrases describe the book's teaching material, not model training.
// Keep the exceptions phrase-scoped: bare «آموزش», training compounds, and
// technical uses of «آموزشی» elsewhere must still pass through the term gate.
const teachingPhrases = /(?<![\p{L}\p{M}\p{N}\u200c])(?:آموزش یک محصول|شکل آموزشی|مرزها آموزشی‌اند)(?![\p{L}\p{M}\p{N}\u200c])/gu;

export function containsPersianTerm(text: string, form: string, termId: string): boolean {
  if (!form) return false;
  const termText = termId === 'training' && form === 'آموزش'
    ? text.replace(teachingPhrases, ' ')
    : text;
  return termText.includes(form);
}
