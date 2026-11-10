import { conversation } from '../context/conversation';

export const apiRequest = `POST /v1/chat/completions
{
  "model": "chat-standard",
  "messages": [
    { "role": "system", "content": "${conversation.system}" },
    { "role": "user", "content": "${conversation.firstUser}" }
  ],
  "temperature": 0.2
}`;

export const apiResponse = `{
  "content": "${conversation.firstAssistant}",
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
      { line: 4, label: 'پیام‌ها', detail: 'دو پیام ورودی نوبت اول، از همان مثال درس ۱.۲: دستور سیستم و پیام کاربر.' },
      { line: 8, label: 'دما', detail: 'عدد کم یعنی پاسخ قابل‌پیش‌بینی‌تر.' },
    ],
  },
  {
    title: 'پاسخ',
    lang: 'json' as const,
    code: apiResponse,
    annotations: [
      { line: 2, label: 'متن پاسخ', detail: 'خروجی تازه؛ برنامه آن را با نقش دستیار به تاریخچه اضافه می‌کند.' },
      { line: 3, label: 'دلیل پایان', detail: 'اینجا مدل خودش تمام کرده است.' },
      { line: 4, label: 'مصرف', detail: 'تعداد توکن ورودی و خروجی؛ پایهٔ محاسبهٔ صورت‌حساب.' },
    ],
  },
];
