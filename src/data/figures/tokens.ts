// Precomputed illustrative tokenizations. These are teaching fixtures, not the
// output of a specific tokenizer. The relative cost is the point.
export const tokenSamples = {
  fa: {
    lang: 'fa' as const,
    text: 'می‌خواهم سفارشم را لغو کنم',
    tokens: ['می', 'خواهم', ' سفارش', 'م', ' را', ' لغو', ' کنم'],
    flow: 'rtl' as const,
  },
  en: {
    lang: 'en' as const,
    text: 'Cancel my order',
    tokens: ['Cancel', ' my', ' order'],
    flow: 'ltr' as const,
  },
};
