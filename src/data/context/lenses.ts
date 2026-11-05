import { requireBlock } from './blocks.ts';
import type { LensDef } from './types';

const t = (id: string) => requireBlock(id).text;

/**
 * The 20 Context Lenses. Every lens is referenced from exactly one lesson via
 * its `key`. Frame narrations are one sentence, <= 22 words, and obey the
 * glossary gate for the host lesson (checked by scripts/check-context.ts).
 */
export const lenses: LensDef[] = [
  // ── 1.3 ────────────────────────────────────────────────────────────────
  {
    key: 'text-loop',
    lesson: '1.3',
    mode: 'steps',
    rawView: true,
    frames: [
      {
        id: 'f1',
        title: 'متن ورودی',
        actor: 'harness',
        narration: 'مدل فقط یک تکه متن می‌بیند: دستور برنامه‌نویس و پیام شما، پشت سر هم.',
        blocks: [
          { id: 'sys', state: 'new' },
          { id: 'u.hours', state: 'new' },
        ],
      },
      {
        id: 'f2',
        title: 'ادامهٔ متن',
        actor: 'model',
        narration: 'کار مدل همین است: ادامهٔ این متن را می‌نویسد، یک کلمه پشت کلمهٔ دیگر.',
        blocks: [{ id: 'sys' }, { id: 'u.hours' }],
        output: { text: t('a.hours18'), typed: true },
      },
      {
        id: 'f3',
        title: 'چسباندن پاسخ',
        actor: 'harness',
        narration: 'چارچوب اجرا پاسخ را به شما نشان می‌دهد و به انتهای متن می‌چسباند.',
        blocks: [{ id: 'sys' }, { id: 'u.hours' }, { id: 'a.hours18', state: 'new' }],
      },
      {
        id: 'f4',
        title: 'همان مدل، متن تازه',
        actor: 'model',
        narration: 'همان مدل، همان پرسش؛ فقط متن عوض شد، پاسخ هم عوض شد. جادویی در کار نیست.',
        blocks: [{ id: 'sys.late', state: 'changed' }, { id: 'u.hours' }],
        output: { text: t('a.hours22'), typed: true },
      },
    ],
  },

  // ── 1.4 ────────────────────────────────────────────────────────────────
  {
    key: 'slots',
    lesson: '1.4',
    mode: 'static',
    rawView: false,
    narration: 'پنج چیز برای یک پاسخ خوب لازم است؛ هر پنج، جای مشخصی در یک متن دارند.',
    frames: [
      {
        id: 'f1',
        title: 'یک متن، چند جای خالی',
        actor: 'harness',
        narration: 'پنج چیز برای یک پاسخ خوب لازم است؛ هر پنج، جای مشخصی در یک متن دارند.',
        blocks: [{ id: 'sys', state: 'new' }, { id: 'u.where', state: 'new' }],
      },
    ],
    slots: [
      { label: 'فهمیدن پرسش', badge: 'بخش ۲' },
      { label: 'پیدا کردن سفارش', badge: 'بخش ۲' },
      { label: 'پاسخ از سند رسمی', badge: 'بخش ۴' },
      { label: 'سرعت و بار سیستم', badge: 'بخش ۵' },
    ],
  },

  // ── 2.2 ────────────────────────────────────────────────────────────────
  {
    key: 'tool-call',
    lesson: '2.2',
    mode: 'steps',
    rawView: true,
    frames: [
      {
        id: 'f1',
        title: 'فهرست ابزارها',
        actor: 'harness',
        narration: 'فهرست ابزارها فقط یک متن است. مدل از وجود getOrder از همین متن باخبر می‌شود.',
        blocks: [
          { id: 'sys' },
          { id: 'tools', state: 'new' },
          { id: 'u.where123', state: 'new' },
        ],
      },
      {
        id: 'f2',
        title: 'نوشتن درخواست',
        actor: 'model',
        narration: 'مدل چیزی را اجرا نکرد؛ فقط متنی نوشت که شکل یک درخواست دارد.',
        blocks: [{ id: 'sys' }, { id: 'tools' }, { id: 'u.where123' }],
        predict: {
          question: 'مدل بعد از این متن چه می‌نویسد؟',
          options: [
            {
              text: 'سفارش ۱۲۳ شما فردا می‌رسد.',
              why: 'وضعیت سفارش در متن نیست؛ مدل آن را نمی‌داند.',
            },
            {
              text: 'یک درخواست ابزار به شکل JSON',
              correct: true,
              why: 'متن فهرست ابزار را دارد و پرسش با آن جور است.',
            },
            {
              text: 'چیزی نمی‌نویسد.',
              why: 'مدل همیشه ادامه‌ای می‌نویسد.',
            },
          ],
        },
        output: {
          text: t('a.call'),
          note: 'مدل اینجا می‌ایستد؛ اجرا بیرون از متن است.',
          typed: true,
        },
      },
      {
        id: 'f3',
        title: 'اجرا، بیرون از متن',
        actor: 'tool',
        narration: 'اجرای واقعی بیرون از متن اتفاق می‌افتد، نه داخل مدل.',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'u.where123' },
          { id: 'a.call', state: 'new' },
        ],
        outside: {
          icon: 'tool',
          label: 'چارچوب اجرا getOrder را اجرا می‌کند',
          detail: 'مدل در این مدت منتظر است.',
          feeds: 'r.order',
        },
      },
      {
        id: 'f4',
        title: 'نتیجه، یک متن دیگر',
        actor: 'harness',
        narration: 'نتیجه فقط یک متن دیگر است که به انتهای متن چسبانده می‌شود.',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'u.where123' },
          { id: 'a.call' },
          { id: 'r.order', state: 'new' },
        ],
      },
      {
        id: 'f5',
        title: 'پاسخ نهایی',
        actor: 'model',
        narration: 'حالا پاسخ، ادامهٔ طبیعی همین متن است. کل متن دوباره به مدل داده شده.',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'u.where123' },
          { id: 'a.call' },
          { id: 'r.order' },
        ],
        output: { text: t('a.final'), typed: true },
      },
    ],
  },

  // ── 2.3 ────────────────────────────────────────────────────────────────
  {
    key: 'mcp-fills-tools',
    lesson: '2.3',
    mode: 'steps',
    rawView: true,
    frames: [
      {
        id: 'f1',
        title: 'ابزارها، بدون اتصال',
        actor: 'harness',
        narration: 'ابزارها فقط یک فهرست متنی‌اند؛ هنوز چیزی وصل نیست.',
        blocks: [{ id: 'sys' }, { id: 'tools', state: 'new' }],
        outside: {
          icon: 'database',
          label: 'سرور MCP — هنوز وصل نشده',
          detail: 'فهرست ابزارها دستی نوشته شده است.',
        },
      },
      {
        id: 'f2',
        title: 'پرسیدن از سرور',
        actor: 'harness',
        narration: 'چارچوب اجرا از سرور MCP می‌پرسد چه ابزاری دارد.',
        blocks: [{ id: 'sys' }, { id: 'tools' }],
        outside: {
          icon: 'tool',
          label: 'چارچوب اجرا می‌پرسد: چه ابزارهایی داری؟',
          detail: '[{"name": "trackShipment", "parameters": {"order_id": "string"}}]',
          feeds: 'tools.mcp',
        },
      },
      {
        id: 'f3',
        title: 'یک خط تازه',
        actor: 'harness',
        narration: 'مدل نمی‌داند MCP وجود دارد؛ فقط یک خط تازه در فهرست می‌بیند.',
        blocks: [{ id: 'sys' }, { id: 'tools.mcp', state: 'changed' }],
        outside: {
          icon: 'document',
          label: 'ابزار بیشتر، متن بیشتر',
          detail: 'هر ابزار تازه، چند خط به فهرست اضافه می‌کند.',
        },
      },
    ],
  },

  // ── 2.4 ────────────────────────────────────────────────────────────────
  {
    key: 'skill-loading',
    lesson: '2.4',
    mode: 'steps',
    rawView: true,
    frames: [
      {
        id: 'f1',
        title: 'فقط فهرست',
        actor: 'harness',
        narration: 'اول فقط یک خط از مهارت در متن است، مثل فهرست یک کتاب.',
        blocks: [
          { id: 'sys' },
          { id: 'skill.menu', state: 'new' },
          { id: 'u.refund', state: 'new' },
        ],
      },
      {
        id: 'f2',
        title: 'بارگذاری مهارت',
        actor: 'harness',
        narration: 'فقط حالا که لازم شد، کل دستورالعمل به متن چسبید.',
        blocks: [
          { id: 'sys' },
          { id: 'skill.menu' },
          { id: 'skill.full', state: 'new' },
          { id: 'u.refund' },
        ],
        outside: {
          icon: 'document',
          label: 'چارچوب اجرا فایل مهارت «مرجوعی» را باز می‌کند',
          detail: 'مهارت خودش کدی اجرا نمی‌کند.',
          feeds: 'skill.full',
        },
      },
      {
        id: 'f3',
        title: 'ادامهٔ مطابق دستور',
        actor: 'model',
        narration: 'مهارت کدی اجرا نکرد؛ فقط متنی بود که مدل حالا ادامه‌اش را مطابق آن می‌نویسد.',
        blocks: [
          { id: 'sys' },
          { id: 'skill.menu' },
          { id: 'skill.full' },
          { id: 'u.refund' },
        ],
        output: { text: t('a.refund'), typed: true },
      },
    ],
  },

  // ── 2.5 ────────────────────────────────────────────────────────────────
  {
    key: 'memory-facts',
    lesson: '2.5',
    mode: 'steps',
    rawView: true,
    frames: [
      {
        id: 'f1',
        title: 'نوبت اول',
        actor: 'model',
        narration: 'نوبت اول تمام شد. مدل از آن چیزی نگه نمی‌دارد.',
        blocks: [{ id: 'sys' }, { id: 'hist.early', state: 'new' }],
      },
      {
        id: 'f2',
        title: 'نوشتن یادداشت',
        actor: 'store',
        narration: 'ذخیره‌کردن کار برنامه است، نه مدل.',
        blocks: [{ id: 'sys' }, { id: 'hist.early' }],
        outside: {
          icon: 'database',
          label: 'چارچوب اجرا یک یادداشت می‌نویسد',
          detail: 'آخرین سفارش: ۱۲۳',
          tone: 'ok',
        },
      },
      {
        id: 'f3',
        title: 'نوبت دوم، بدون حافظه',
        actor: 'model',
        narration: 'نوبت دوم از صفر شروع می‌شود؛ «همان» در متن معنایی ندارد.',
        blocks: [{ id: 'sys' }, { id: 'u.cancel', state: 'new' }],
        output: { text: t('a.nomem'), tone: 'danger' },
      },
      {
        id: 'f4',
        title: 'نوبت دوم، با حافظه',
        actor: 'model',
        narration: 'حافظه یعنی چند خط متن که پیش از پرسش شما کنار آن گذاشته می‌شود.',
        blocks: [{ id: 'sys' }, { id: 'mem', state: 'new' }, { id: 'u.cancel' }],
        outside: {
          icon: 'database',
          label: 'انبار حافظه خوانده می‌شود',
          detail: 'سه واقعیت کوتاه به متن می‌آید.',
          feeds: 'mem',
          tone: 'ok',
        },
        output: { text: t('a.mem'), tone: 'ok', typed: true },
      },
    ],
  },

  // ── 2.7 ────────────────────────────────────────────────────────────────
  {
    key: 'tests-as-text',
    lesson: '2.7',
    mode: 'steps',
    rawView: true,
    frames: [
      {
        id: 'f1',
        title: 'خواندن فایل',
        actor: 'tool',
        narration: 'عامل فایل را می‌خواند؛ خروجی فقط متن است.',
        blocks: [{ id: 'sys' }, { id: 'u.task', state: 'new' }],
        outside: {
          icon: 'document',
          label: 'ابزار، فایل auth.ts را می‌خواند',
          detail: 'یک خط خلاصه به متن برمی‌گردد.',
          feeds: 'test.fail',
        },
      },
      {
        id: 'f2',
        title: 'تست شکست می‌خورد',
        actor: 'model',
        narration: 'تست خطا داد. مدل همین متن را در گام بعد می‌خواند.',
        blocks: [
          { id: 'sys' },
          { id: 'u.task' },
          { id: 'test.fail', state: 'new' },
        ],
        output: { text: t('a.edit'), typed: true },
      },
      {
        id: 'f3',
        title: 'تست سبز می‌شود',
        actor: 'model',
        narration: 'تست سبز شد. تغییر بعدی ادامهٔ همین متن است.',
        blocks: [
          { id: 'sys' },
          { id: 'u.task' },
          { id: 'test.fail' },
          { id: 'test.pass', state: 'new' },
        ],
        output: { text: t('a.done'), tone: 'ok' },
      },
    ],
  },

  // ── 2.8 ────────────────────────────────────────────────────────────────
  {
    key: 'anatomy-recap',
    lesson: '2.8',
    mode: 'static',
    rawView: true,
    narration: 'عامل برنامه‌ای است که این متن را می‌چیند، به مدل می‌دهد و پاسخ را به آن اضافه می‌کند.',
    frames: [
      {
        id: 'f1',
        title: 'همهٔ قطعه‌ها در یک متن',
        actor: 'harness',
        narration: 'عامل برنامه‌ای است که این متن را می‌چیند، به مدل می‌دهد و پاسخ را به آن اضافه می‌کند.',
        blocks: [
          { id: 'sys', lessonRef: '1.3' },
          { id: 'tools', lessonRef: '2.2' },
          { id: 'skill.menu', lessonRef: '2.4' },
          { id: 'mem', lessonRef: '2.5' },
          { id: 'u.where', lessonRef: '2.5' },
          { id: 'a.call', lessonRef: '2.2' },
          { id: 'r.order', lessonRef: '2.2' },
        ],
      },
    ],
  },

  // ── 3.1 is a restyle of ProbabilityBars, not a lens. ────────────────────

  // ── 3.3 ────────────────────────────────────────────────────────────────
  {
    key: 'context-fills',
    lesson: '3.3',
    mode: 'steps',
    rawView: true,
    frames: [
      {
        id: 'f1',
        title: 'همه‌چیز جا می‌شود',
        actor: 'model',
        narration: 'همه‌چیز جا می‌شود و مدل هر چه لازم دارد می‌بیند.',
        blocks: [
          { id: 'sys' },
          { id: 'hist.early', state: 'new' },
          { id: 'u.cancel', state: 'new' },
        ],
        edge: 'لبهٔ پنجرهٔ زمینه',
        meter: { used: 4200, capacity: 8000 },
        output: { text: t('a.cancel123'), tone: 'ok' },
      },
      {
        id: 'f2',
        title: 'لبه، چیزی را بیرون می‌اندازد',
        actor: 'model',
        narration: 'گفت‌وگو بلند شد. قدیمی‌ترین متن از لبه بیرون افتاد و با آن شمارهٔ سفارش.',
        blocks: [
          { id: 'sys' },
          { id: 'hist.early', state: 'evicted' },
          { id: 'hist.mid', state: 'new' },
          { id: 'hist.late', state: 'new' },
          { id: 'u.cancel' },
        ],
        edge: 'لبهٔ پنجرهٔ زمینه',
        meter: { used: 8600, capacity: 8000 },
        output: { text: t('a.nomem'), tone: 'danger' },
      },
      {
        id: 'f3',
        title: 'حافظه، چیزی که نباید فراموش شود',
        actor: 'model',
        narration: 'چیزی که نباید فراموش شود را در حافظه بگذارید؛ آن را هر بار دوباره به متن می‌آورند.',
        blocks: [
          { id: 'sys' },
          { id: 'mem', state: 'new' },
          { id: 'hist.mid' },
          { id: 'hist.late' },
          { id: 'u.cancel' },
        ],
        edge: 'لبهٔ پنجرهٔ زمینه',
        meter: { used: 7900, capacity: 8000 },
        output: { text: t('a.mem'), tone: 'ok' },
      },
    ],
  },

  // ── 3.4 ────────────────────────────────────────────────────────────────
  {
    key: 'learned-vs-given',
    lesson: '3.4',
    mode: 'compare',
    rawView: true,
    narration: 'دانش آموزش‌دیده در مدل است، نه در متن؛ وضعیت امروز فقط از متن می‌آید.',
    panels: [
      {
        label: 'آنچه در آموزش یاد گرفته',
        modelLabel: 'مدل، بدون متن تازه',
        blocks: [
          { id: 'train.fixed', state: 'new' },
          { id: 'u.where123', state: 'new' },
        ],
        output: { text: t('a.dontknow'), tone: 'danger' },
        note: 'این دانش در فایل‌های مدل است و با هر پرسش عوض نمی‌شود.',
      },
      {
        label: 'آنچه در متن همین نوبت آمده',
        modelLabel: 'همان مدل، با متن تازه',
        blocks: [
          { id: 'sys' },
          { id: 'r.order', state: 'new' },
          { id: 'u.where123' },
        ],
        output: { text: t('a.final'), tone: 'ok' },
        note: 'وضعیت سفارش از ابزار آمده و فقط در همین متن است.',
      },
    ],
    compareNote: 'مدل برای دانستن وضعیت امروز باید آن را در متن ببیند؛ آموزش به‌تنهایی کافی نیست.',
  },

  // ── 3.5 ────────────────────────────────────────────────────────────────
  {
    key: 'no-fact-fluent-guess',
    lesson: '3.5',
    mode: 'compare',
    rawView: true,
    narration: 'مدل مجبور است متن را ادامه بدهد؛ اگر واقعیت در متن نباشد، ادامهٔ روان می‌سازد.',
    panels: [
      {
        label: 'بدون واقعیت در متن',
        blocks: [{ id: 'sys' }, { id: 'u.orderno' }],
        output: {
          text: t('a.hallucinated'),
          tone: 'danger',
          note: 'روان است، اما هیچ واقعیتی پشتش نیست.',
        },
      },
      {
        label: 'با واقعیت در متن',
        blocks: [{ id: 'sys' }, { id: 'mem', state: 'new' }, { id: 'u.orderno' }],
        output: { text: t('a.true'), tone: 'ok' },
      },
    ],
    compareNote: 'همان مدل، همان پرسش؛ تنها تفاوت، بودن یا نبودن واقعیت در متن است.',
  },

  // ── 3.7 ────────────────────────────────────────────────────────────────
  {
    key: 'thinking-text',
    lesson: '3.7',
    mode: 'compare',
    rawView: true,
    narration: 'استدلال یعنی متن بیشتر: مدل اول می‌نویسد و بعد از روی همان ادامه می‌دهد.',
    panels: [
      {
        label: 'بدون متن استدلال',
        blocks: [{ id: 'sys' }, { id: 'u.math' }],
        output: { text: t('a.math.wrong'), tone: 'danger', note: 'پاسخ سریع، اما نادرست.' },
      },
      {
        label: 'با متن استدلال',
        blocks: [{ id: 'sys' }, { id: 'u.math' }, { id: 'thinking.math', state: 'new' }],
        output: { text: t('a.math.right'), tone: 'ok' },
        note: 'متن بیشتر، زمان بیشتر.',
      },
    ],
    compareNote: 'مدل اول متن بیشتری می‌نویسد و بعد از روی همان می‌نویسد؛ استدلال، متن بیشتر است.',
  },

  // ── 4.1 ────────────────────────────────────────────────────────────────
  {
    key: 'messages-array',
    lesson: '4.1',
    mode: 'mapping',
    rawView: false,
    frames: [
      {
        id: 'f1',
        title: 'فراخوانی اول',
        actor: 'harness',
        narration: 'درخواست اول فقط دو پیام دارد: دستور سیستم و پرسش شما.',
        blocks: [{ id: 'sys', state: 'new' }, { id: 'u.where123', state: 'new' }],
        messages:
          '[\n  {"role": "system", "content": "تو دستیار فروشگاه «بازار» هستی."},\n  {"role": "user", "content": "سفارش ۱۲۳ کجاست؟"}\n]',
        messagesNote: 'برای خوانایی، متن دستور کوتاه شده است.',
      },
      {
        id: 'f2',
        title: 'فراخوانی دوم',
        actor: 'harness',
        narration: 'API چیزی به یاد نمی‌آورد؛ شما هر بار همهٔ متن را از نو می‌فرستید.',
        blocks: [
          { id: 'sys', state: 'changed' },
          { id: 'u.where123', state: 'changed' },
          { id: 'a.final', state: 'new' },
          { id: 'u.followup', state: 'new' },
        ],
        messages:
          '[\n  {"role": "system", "content": "تو دستیار فروشگاه «بازار» هستی."},\n  {"role": "user", "content": "سفارش ۱۲۳ کجاست؟"},\n  {"role": "assistant", "content": "سفارش ۱۲۳ شما ارسال شده و فردا می‌رسد."},\n  {"role": "user", "content": "پس چرا هنوز نرسیده؟"}\n]',
        messagesNote: 'همان متن قبلی، به‌علاوهٔ پاسخ و پرسش تازه.',
      },
      {
        id: 'f3',
        title: 'فراخوانی سوم',
        actor: 'harness',
        narration: 'هر نوبت، متن بلندتر می‌شود، اما مدل همچنان فقط ادامهٔ همین متن را می‌بیند.',
        blocks: [
          { id: 'sys', state: 'changed' },
          { id: 'u.where123', state: 'changed' },
          { id: 'a.final', state: 'changed' },
          { id: 'u.followup', state: 'changed' },
          { id: 'a.followup', state: 'new' },
          { id: 'u.return', state: 'new' },
        ],
        messages:
          '[\n  {"role": "system", "content": "تو دستیار فروشگاه «بازار» هستی."},\n  {"role": "user", "content": "سفارش ۱۲۳ کجاست؟"},\n  {"role": "assistant", "content": "سفارش ۱۲۳ شما ارسال شده و فردا می‌رسد."},\n  {"role": "user", "content": "پس چرا هنوز نرسیده؟"},\n  {"role": "assistant", "content": "چون هنوز در مسیر است و فردا می‌رسد."},\n  {"role": "user", "content": "پس مرجوعش کن."}\n]',
        messagesNote: 'شش پیام. مدل هیچ‌کدام را «به یاد ندارد»؛ همه در این درخواست هستند.',
      },
    ],
  },

  // ── 4.3 lab: the interactive build-your-context piece ───────────────────
  {
    key: 'lab',
    lesson: '4.3',
    mode: 'lab',
    rawView: false,
    title: 'آزمایشگاه زمینه',
    narration: 'متن را خودتان بچینید و ببینید پاسخ چطور عوض می‌شود.',
  },

  // ── 4.4 ────────────────────────────────────────────────────────────────
  {
    key: 'rag-paste',
    lesson: '4.4',
    mode: 'steps',
    rawView: true,
    frames: [
      {
        id: 'f1',
        title: 'جست‌وجو، بیرون از متن',
        actor: 'harness',
        narration: 'پیش از مدل، بیرون از متن، برنامه سند مناسب را پیدا می‌کند.',
        blocks: [{ id: 'sys' }, { id: 'u.policy', state: 'new' }],
        outside: {
          icon: 'database',
          label: 'چارچوب اجرا در اسناد جست‌وجو می‌کند',
          detail: '۱ تکهٔ مرتبط پیدا شد.',
          feeds: 'doc.refund',
        },
      },
      {
        id: 'f2',
        title: 'کپی در متن',
        actor: 'harness',
        narration: 'تکهٔ پیداشده فقط کپی می‌شود و بالای پرسش می‌نشیند.',
        blocks: [
          { id: 'sys' },
          { id: 'doc.refund', state: 'new' },
          { id: 'u.policy' },
        ],
        outside: {
          icon: 'document',
          label: 'تکهٔ سند به متن چسبانده شد',
          detail: 'پرسش + سند، کنار هم.',
          feeds: 'doc.refund',
        },
      },
      {
        id: 'f3',
        title: 'پاسخ از متن',
        actor: 'model',
        narration: 'مدل از متنی که جلویش بود نقل کرد؛ از حافظهٔ خودش نه.',
        blocks: [
          { id: 'sys' },
          { id: 'doc.refund' },
          { id: 'u.policy' },
        ],
        output: { text: t('a.policy'), tone: 'ok', typed: true },
      },
      {
        id: 'f4',
        title: 'تکهٔ اشتباه',
        actor: 'model',
        narration: 'اگر تکهٔ اشتباه پیدا شود، پاسخ هم اشتباه است؛ RAG تضمین نیست.',
        blocks: [
          { id: 'sys' },
          { id: 'doc.shipping', state: 'new' },
          { id: 'u.policy' },
        ],
        output: { text: t('a.shipping'), tone: 'danger', typed: true },
      },
    ],
  },

  // ── 4.5 ────────────────────────────────────────────────────────────────
  {
    key: 'where-it-changes',
    lesson: '4.5',
    mode: 'compare',
    rawView: true,
    narration: 'پرامپت و RAG متن را عوض می‌کنند؛ فاین‌تیون خود مدل را.',
    panels: [
      {
        label: 'تغییر متن: پرامپت، زمینه، RAG',
        modelLabel: 'همان مدل',
        blocks: [{ id: 'sys' }, { id: 'doc.refund', state: 'new' }, { id: 'u.policy' }],
        output: { text: t('a.policy'), tone: 'ok' },
        note: 'سند در متن است؛ مدل همان مدل قبلی است.',
      },
      {
        label: 'تغییر مدل: فاین‌تیون',
        modelLabel: 'مدل فاین‌تیون‌شده',
        blocks: [{ id: 'sys' }, { id: 'u.policy' }],
        output: { text: t('a.policy'), tone: 'ok' },
        note: 'متن عوض نشده؛ رفتار مدل عوض شده است.',
      },
    ],
    compareNote: 'اگر مشکل دانش است، متن را عوض کنید؛ اگر مشکل رفتار است، مدل را.',
  },

  // ── 5.1 ────────────────────────────────────────────────────────────────
  {
    key: 'who-writes-what',
    lesson: '5.1',
    mode: 'static',
    rawView: true,
    narration: 'هر جعبه در معماری، یک تکه از این متن را می‌سازد.',
    frames: [
      {
        id: 'f1',
        title: 'هر جعبه، یک تکه متن',
        actor: 'harness',
        narration: 'هر جعبه در معماری، یک تکه از این متن را می‌سازد.',
        blocks: [
          { id: 'sys', note: 'از برنامه‌ریز', lessonRef: '1.3' },
          { id: 'tools', note: 'از فهرست ابزارها', lessonRef: '2.2' },
          { id: 'skill.menu', note: 'از مهارت‌ها', lessonRef: '2.4' },
          { id: 'mem', note: 'از انبار حافظه', lessonRef: '2.5' },
          { id: 'u.where', note: 'از دروازه', lessonRef: '2.5' },
          { id: 'a.call', note: 'نوشتهٔ مدل', lessonRef: '2.2' },
          { id: 'r.order', note: 'از API ابزار', lessonRef: '2.2' },
          { id: 'a.final', note: 'نوشتهٔ مدل', lessonRef: '1.3' },
        ],
      },
    ],
  },

  // ── 5.2 ────────────────────────────────────────────────────────────────
  {
    key: 'cache-prefix',
    lesson: '5.2',
    mode: 'compare',
    rawView: true,
    narration: 'متن ثابت را اول بگذارید تا کش شود؛ هر چیز متغیر، کش را می‌شکند.',
    panels: [
      {
        label: 'ترتیب خوب: ثابت‌ها اول',
        cachedPrefix: 3,
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'skill.menu' },
          { id: 'mem', state: 'changed' },
          { id: 'hist.mid', state: 'changed' },
          { id: 'u.where', state: 'changed' },
        ],
        output: { text: t('a.final'), tone: 'ok' },
        note: 'سه بلوک اول در هر نوبت یکسان‌اند؛ فقط انتهای متن عوض می‌شود.',
      },
      {
        label: 'ترتیب بد: متغیرها اول',
        blocks: [
          { id: 'sys' },
          { id: 'sys.clock', state: 'new' },
          { id: 'tools' },
          { id: 'skill.menu' },
          { id: 'mem', state: 'changed' },
          { id: 'hist.mid', state: 'changed' },
          { id: 'u.where', state: 'changed' },
        ],
        output: { text: t('a.final'), tone: 'ok' },
        note: 'ساعت در ابتدا عوض شده؛ هیچ‌چیز بعد از آن قابل کش نیست.',
      },
    ],
    compareNote: 'ترتیب، هزینه را عوض می‌کند: هر چیزی که زودتر بیاید و ثابت بماند، بیشتر کش می‌شود.',
  },

  // ── 5.3 ────────────────────────────────────────────────────────────────
  {
    key: 'injection',
    lesson: '5.3',
    mode: 'steps',
    rawView: true,
    frames: [
      {
        id: 'f1',
        title: 'دستور مخفی در سند',
        actor: 'harness',
        narration: 'سندی که بازیابی شد یک دستور مخفی داشت و حالا کنار بقیهٔ متن نشسته است.',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'u.where123' },
          { id: 'doc.injected', state: 'new' },
        ],
      },
      {
        id: 'f2',
        title: 'یک متن، بدون مرز',
        actor: 'model',
        narration: 'مدل در متن مرزی بین «داده» و «دستور» نمی‌بیند؛ همه‌اش یک متن است.',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'u.where123' },
          { id: 'doc.injected', state: 'danger' },
        ],
        predict: {
          question: 'مدل با این متن چه می‌کند؟',
          options: [
            {
              text: 'متن مخفی را نادیده می‌گیرد.',
              why: 'هیچ تضمینی نیست؛ برای مدل همه‌چیز متن است.',
            },
            {
              text: 'ممکن است از آن اطاعت کند.',
              correct: true,
              why: 'مرزی بین داده و دستور وجود ندارد.',
            },
            {
              text: 'فقط اگر مهاجم اجازه داشته باشد اطاعت می‌کند.',
              why: 'مدل اجازه‌ها را نمی‌بیند.',
            },
          ],
        },
        output: { text: t('a.badcall'), tone: 'danger', typed: true },
      },
      {
        id: 'f3',
        title: 'مهار، بیرون از متن',
        actor: 'harness',
        narration: 'مهار در بیرون از متن اتفاق می‌افتد: کمترین دسترسی و گاردریل.',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'u.where123' },
          { id: 'doc.injected', state: 'danger' },
          { id: 'a.badcall', state: 'gone' },
        ],
        outside: {
          icon: 'shield',
          label: 'چارچوب اجرا درخواست را بررسی کرد',
          detail: 'این کاربر به سفارش ۹۹۹ دسترسی ندارد. رد شد.',
          tone: 'ok',
        },
      },
    ],
  },

  // ── 5.4 ────────────────────────────────────────────────────────────────
  {
    key: 'read-the-trace',
    lesson: '5.4',
    mode: 'static',
    rawView: true,
    narration: 'برای فهمیدن چرا مدل اشتباه کرد، متنی را بخوانید که دیده است.',
    frames: [
      {
        id: 'f1',
        title: 'یک پاسخ غلط، یک متن قدیمی',
        actor: 'model',
        narration: 'برای فهمیدن چرا مدل اشتباه کرد، متنی را بخوانید که دیده است.',
        blocks: [
          { id: 'sys' },
          {
            id: 'mem.stale',
            state: 'danger',
            note: 'خط آخر قدیمی است: مشتری آدرس را عوض کرده، اما حافظه به‌روز نشده.',
          },
          { id: 'u.address', state: 'new' },
        ],
        output: {
          text: t('a.stale'),
          tone: 'danger',
          note: 'علت: یادداشت قدیمی در حافظه.',
        },
      },
    ],
  },

  // ── 6.4 ────────────────────────────────────────────────────────────────
  {
    key: 'recap',
    lesson: '6.4',
    mode: 'static',
    rawView: true,
    narration: 'همهٔ این سند، یک ایده: مدل فقط ادامهٔ متنی را می‌نویسد که جلویش گذاشته‌اند.',
    frames: [
      {
        id: 'f1',
        title: 'کل سند، یک متن',
        actor: 'harness',
        narration: 'همهٔ این سند، یک ایده: مدل فقط ادامهٔ متنی را می‌نویسد که جلویش گذاشته‌اند.',
        blocks: [
          { id: 'sys', lessonRef: '1.3' },
          { id: 'tools', lessonRef: '2.2' },
          { id: 'skill.menu', lessonRef: '2.4' },
          { id: 'mem', lessonRef: '2.5' },
          { id: 'u.where', lessonRef: '2.5' },
          { id: 'a.call', lessonRef: '2.2' },
          { id: 'r.order', lessonRef: '2.2' },
          { id: 'a.final', lessonRef: '1.3' },
        ],
      },
    ],
  },
];

export const lensByKey = new Map(lenses.map((l) => [l.key, l]));

export function requireLens(key: string): LensDef {
  const lens = lensByKey.get(key);
  if (!lens) throw new Error(`Unknown context lens: ${key}`);
  return lens;
}
