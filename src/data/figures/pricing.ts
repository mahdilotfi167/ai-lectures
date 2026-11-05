// Illustrative pricing fixture. Not live pricing. Per 1M tokens, USD.
export const pricing = {
  date: 'آبان ۱۴۰۵',
  note: 'قیمت‌ها نمونه‌اند و تغییر می‌کنند؛ این عدد برای آموزش حساسیت هزینه است، نه قیمت‌گذاری.',
  defaults: {
    tokensPerRequest: 1200,
    requestsPerDay: 10000,
    tier: 'balanced',
    cacheHitRate: 40,
  },
  tiers: [
    { id: 'fast', label: 'سریع و ارزان', inputPrice: 0.15, outputPrice: 0.6 },
    { id: 'balanced', label: 'متعادل', inputPrice: 1.0, outputPrice: 3.0 },
    { id: 'deep', label: 'عمیق و گران', inputPrice: 3.0, outputPrice: 15.0 },
  ],
};
