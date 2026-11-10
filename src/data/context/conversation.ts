/** One tool-free, two-turn conversation shared by lessons 1.2 and 4.1.
 * The user supplies the project description; no unseen file reads are implied.
 */
export const conversation = {
  system: 'کوتاه و فارسی پاسخ بده.',
  firstUser: 'این پروژه ابزار مدیریت کارهاست؛ چه کمکی می‌کند؟',
  firstAssistant: 'کمک می‌کند کارها را ثبت کنید، به آن‌ها اولویت بدهید و انجام‌شدنشان را پیگیری کنید.',
  secondUser: 'خلاصه‌تر توضیح بده.',
  secondAssistant: 'کارها را ثبت و پیگیری می‌کند.',
} as const;
