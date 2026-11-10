import type { BlockRef } from './types';

/** Teaching traces, not any product's API. A request always precedes its result.
 * Result notes identify the agent's execution rather than implying model I/O.
 */
const exchanges = {
  skill: ['a.skill.read', 'skill.full', 'نتیجهٔ خواندن فایل مهارت توسط ایجنت؛ دریافت دستورالعمل، مدرک ویرایش یا اجرای تست نیست.'],
  file: ['a.read', 'r.file', 'ایجنت درخواست خواندن را اجرا کرده؛ این متن واقعیِ فایل نمونه است.'],
  testFail: ['a.test', 'test.fail', 'ایجنت کامند درخواستی را اجرا کرده؛ این خروجی تست ناموفق است.'],
  edit: ['a.editcall', 'r.edited', 'ایجنت درخواست ویرایش را اعمال کرده؛ موفقیت تست هنوز معلوم نیست.'],
  testPass: ['a.test.again', 'test.pass', 'ایجنت دوباره کامند تست را اجرا کرده؛ گزارش موفقیت پس از این نتیجه می‌آید.'],
  denied: ['a.badcall', 'r.denied', 'ایجنت درخواست را رد کرده و نتیجهٔ خطا را برگردانده؛ فایل خوانده نشده است.'],
} as const;

export type ExchangeId = keyof typeof exchanges;

export function traceRefs(...ids: ExchangeId[]): BlockRef[] {
  return ids.flatMap((id) => {
    const [request, result, note] = exchanges[id];
    return [{ id: request }, { id: result, note }];
  });
}
