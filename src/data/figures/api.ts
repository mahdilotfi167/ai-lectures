export const apiRequest = `POST /v1/chat/completions
{
  "model": "chat-standard",
  "messages": [
    { "role": "system", "content": "دستیار فروشگاه؛ کوتاه و دقیق." },
    { "role": "user", "content": "سفارش 123 کجاست؟" }
  ],
  "temperature": 0.2
}`;

export const apiResponse = `{
  "content": "سفارش شما فردا می‌رسد.",
  "finish_reason": "stop",
  "usage": {
    "input_tokens": 812,
    "output_tokens": 24
  }
}`;

export const apiBlocks = [
  {
    title: 'درخواست',
    lang: 'http' as const,
    code: apiRequest,
    annotations: [
      { line: 3, label: 'مدل', detail: 'کدام مدل پاسخ بدهد؛ اینجا یک مدل میانی.' },
      { line: 4, label: 'پیام‌ها', detail: 'دستور سیستم و پرسش کاربر، به‌ترتیب.' },
      { line: 8, label: 'دما', detail: 'عدد کم یعنی پاسخ قابل‌پیش‌بینی‌تر.' },
    ],
  },
  {
    title: 'پاسخ',
    lang: 'json' as const,
    code: apiResponse,
    annotations: [
      { line: 2, label: 'متن پاسخ', detail: 'چیزی که کاربر می‌بیند.' },
      { line: 3, label: 'دلیل پایان', detail: 'اینجا مدل خودش تمام کرده است.' },
      { line: 4, label: 'مصرف', detail: 'تعداد توکن ورودی و خروجی؛ پایهٔ محاسبهٔ صورت‌حساب.' },
    ],
  },
];
