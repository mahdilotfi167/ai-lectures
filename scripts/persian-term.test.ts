import assert from 'node:assert/strict';
import { test } from 'node:test';
import { containsPersianTerm } from './lib/persian-term.ts';

for (const text of [
  'موضوع، سازوکار مشترک آن‌هاست؛ نه آموزش یک محصول یا رفع یک خطای خاص.',
  'نام ابزار در این شکل آموزشی است؛ نام واقعی ابزارها بین محصولات فرق دارد.',
  'این مرزها آموزشی‌اند، نه خروجی یک توکن‌ساز مشخص.',
]) {
  test(`does not treat teaching material as training: ${text}`, () => {
    assert.equal(containsPersianTerm(text, 'آموزش', 'training'), false);
  });
}

for (const text of [
  'آموزش مدل روی داده‌های تازه انجام می‌شود.',
  'آموزش‌دادن مدل هزینه دارد.',
  'پیش‌آموزش و آموزش بیشتر مدل دو مرحله‌اند.',
  'داده‌های آموزشی مدل را بررسی کنید.',
  'این شکل آموزشی است؛ آموزش مدل را هم توضیح می‌دهیم.',
  'نه آموزش یک محصول؛ آموزش مدل موضوع دیگری است.',
  'این شکل آموزشی است و این مرزها آموزشی‌اند؛ آموزش مدل جداست.',
  'این شکل آموزشی‌سازی نام دیگری دارد.',
  'بازآموزش یک محصول',
]) {
  test(`keeps the training gate for other occurrences: ${text}`, () => {
    assert.equal(containsPersianTerm(text, 'آموزش', 'training'), true);
  });
}

test('exceptions do not affect other terms or matching forms', () => {
  assert.equal(containsPersianTerm('نام مهارت‌ها در فهرست است.', 'مهارت', 'skill'), true);
  assert.equal(containsPersianTerm('این شکل آموزشی است.', 'آموزش', 'another-term'), true);
  assert.equal(containsPersianTerm('این شکل آموزشی است.', 'شکل آموزشی', 'training'), true);
  assert.equal(containsPersianTerm('این شکل آموزشی است.', 'فاین‌تیونینگ', 'fine-tuning'), false);
  assert.equal(containsPersianTerm('متن', '', 'training'), false);
});
