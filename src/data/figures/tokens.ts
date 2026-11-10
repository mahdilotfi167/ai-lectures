// Precomputed illustrative tokenizations. These are teaching fixtures, not the
// output of a specific tokenizer. The relative cost is the point.
export const tokenSamples = {
  fa: {
    lang: 'fa' as const,
    text: 'می‌خواهم فایل‌هایم را بررسی کنم',
    tokens: ['می', 'خواهم', ' فایل', 'ها', 'یم', ' را', ' بررسی', ' کنم'],
    flow: 'rtl' as const,
  },
  en: {
    lang: 'en' as const,
    text: 'Review my project files',
    tokens: ['Review', ' my', ' project', ' files'],
    flow: 'ltr' as const,
  },
};
