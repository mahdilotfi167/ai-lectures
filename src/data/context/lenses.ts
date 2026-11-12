import { requireBlock } from './blocks.ts';
import { story } from './story.ts';
import type { BlockRef, LensDef } from './types';
import { traceRefs } from './traces.ts';

const t = (id: string) => requireBlock(id).text;
const codingInput = (): BlockRef[] => [
  { id: 'sys' },
  { id: 'tools' },
  { id: 'mem' },
  { id: 'u.fix', turnStart: 1 },
];

/**
 * The 20 Context Lenses. Every lens is referenced from exactly one lesson via
 * its `key`. Frame narrations are one sentence, <= 22 words, and obey the
 * glossary gate for the host lesson (checked by scripts/check-context.ts).
 */
export const lenses: LensDef[] = [
  // ── 1.2 ────────────────────────────────────────────────────────────────
  {
    key: 'text-loop',
    lesson: '1.2',
    mode: 'steps',
    frames: [
      {
        id: 'f1',
        title: 'نوبت اول: ورودی مدل',
        actor: 'harness',
        narration: 'دستور سیستم و پیام اول شما ورودی مدل‌اند؛ هنوز پاسخی ساخته نشده است.',
        showMessageRoles: true,
        tapeLabel: 'کانتکست پیش از پاسخ اول',
        blocks: [
          { id: 'sys.conversation', state: 'new', note: 'دستور ثابت؛ بیرون از نوبت‌های گفت‌وگو' },
          { id: 'u.conversation.first', state: 'new', turnStart: 1 },
        ],
      },
      {
        id: 'f2',
        title: 'نوبت اول: پاسخ دستیار',
        actor: 'model',
        narration: 'مدل پاسخ تازه را می‌نویسد؛ برنامه آن را با نقش دستیار به شما نشان می‌دهد و نوبت اول تمام می‌شود.',
        showMessageRoles: true,
        tapeLabel: 'کانتکست پیش از پاسخ اول',
        blocks: [{ id: 'sys.conversation' }, { id: 'u.conversation.first', turnStart: 1 }],
        output: {
          text: t('a.conversation.first'),
          label: 'پاسخ تازهٔ دستیار — پایان نوبت ۱',
          note: 'این پاسخ خروجی است؛ پس از تولید به تاریخچه اضافه می‌شود.',
        },
      },
      {
        id: 'f3',
        title: 'نوبت دوم: تاریخچه و پیام تازه',
        actor: 'harness',
        narration: 'برنامه دستور سیستم، دو پیام نوبت اول و درخواست تازهٔ شما را دوباره به مدل می‌دهد.',
        showMessageRoles: true,
        tapeLabel: 'کانتکست پیش از پاسخ دوم',
        blocks: [
          { id: 'sys.conversation' },
          { id: 'u.conversation.first', turnStart: 1 },
          { id: 'a.conversation.first', state: 'new', note: 'پاسخ قبلی، حالا بخشی از ورودی است.' },
          { id: 'u.conversation.second', state: 'new', turnStart: 2 },
        ],
      },
      {
        id: 'f4',
        title: 'نوبت دوم: پاسخ تازه',
        actor: 'model',
        narration: 'مدل با دیدن پاسخ قبلی و درخواست کوتاه‌کردن، پاسخ تازه‌ای می‌نویسد؛ همان مدل است، اما کانتکست عوض شده است.',
        showMessageRoles: true,
        tapeLabel: 'کانتکست پیش از پاسخ دوم',
        blocks: [
          { id: 'sys.conversation' },
          { id: 'u.conversation.first', turnStart: 1 },
          { id: 'a.conversation.first' },
          { id: 'u.conversation.second', turnStart: 2 },
        ],
        output: {
          text: t('a.conversation.second'),
          label: 'پاسخ تازهٔ دستیار — پایان نوبت ۲',
          note: 'این پاسخ هنوز در ورودی همین فراخوانی نبود؛ تازه تولید شده است.',
        },
      },
      {
        id: 'f5',
        title: 'دو نوبت کامل، پنج پیام',
        actor: 'harness',
        narration: 'پاسخ دوم هم به تاریخچه اضافه شد؛ این نمای گفت‌وگوی کامل است، نه ورودی پیش از پاسخ دوم.',
        showMessageRoles: true,
        tapeLabel: 'گفت‌وگوی ذخیره‌شده، پس از پایان نوبت دوم',
        blocks: [
          { id: 'sys.conversation', note: 'دستور سیستم، نوبت جداگانه نیست.' },
          { id: 'u.conversation.first', turnStart: 1 },
          { id: 'a.conversation.first' },
          { id: 'u.conversation.second', turnStart: 2 },
          { id: 'a.conversation.second', state: 'new' },
        ],
      },
    ],
  },

  // ── 1.3 ────────────────────────────────────────────────────────────────
  {
    key: 'slots',
    lesson: '1.3',
    mode: 'static',
    narration: 'پنج چیز برای یک پاسخ خوب لازم است؛ هر پنج، جای مشخصی در یک متن دارند.',
    frames: [
      {
        id: 'f1',
        title: 'یک متن، چند جای خالی',
        actor: 'harness',
        narration: 'پنج چیز برای یک پاسخ خوب لازم است؛ هر پنج، جای مشخصی در یک متن دارند.',
        blocks: [{ id: 'sys', state: 'new' }, { id: 'u.task', state: 'new' }],
      },
    ],
    slots: [
      { label: 'خواندن فایل و تغییر کد', badge: 'بخش ۲' },
      { label: 'اجرای تست و دیدن نتیجه', badge: 'بخش ۲' },
      { label: 'یافتن قاعده در راهنمای پروژه', badge: 'بخش ۳' },
      { label: 'دسترسی محدود و اجرای قابل‌پیگیری', badge: 'بخش ۴' },
    ],
  },

  // ── 2.2 ────────────────────────────────────────────────────────────────
  {
    key: 'tool-call',
    lesson: '2.2',
    mode: 'steps',
    frames: [
      {
        id: 'f1',
        title: 'فهرست ابزارها',
        actor: 'harness',
        narration: 'ایجنت درخواست کاربر و فهرست ابزارها را به مدل می‌دهد؛ متن فایل هنوز در کانتکست نیست.',
        blocks: [
          { id: 'sys' },
          { id: 'tools', state: 'new' },
          { id: 'u.file', state: 'new' },
        ],
      },
      {
        id: 'f2',
        title: 'نوشتن درخواست',
        actor: 'model',
        narration: 'مدل چیزی را اجرا نکرد؛ فقط متنی نوشت که شکل یک درخواست دارد.',
        blocks: [{ id: 'sys' }, { id: 'tools' }, { id: 'u.file' }],
        output: {
          text: t('a.read'),
          note: 'این فراخوانی تمام می‌شود؛ ایجنت باید ابزار را اجرا کند.',
        },
      },
      {
        id: 'f3',
        title: 'خواندن فایل در ایجنت',
        actor: 'harness',
        narration: 'ایجنت مجوز را بررسی می‌کند و فایل را می‌خواند؛ مدل در این فاصله فراخوانی نمی‌شود.',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'u.file' },
          { id: 'a.read', state: 'new' },
        ],
        outside: {
          icon: 'tool',
          label: 'ایجنت ابزار readFile را اجرا می‌کند',
          detail: 'خواندن واقعی فایل در چارچوب اجرای ایجنت انجام می‌شود.',
          feeds: 'r.file',
        },
      },
      {
        id: 'f4',
        title: 'نتیجه، یک متن دیگر',
        actor: 'harness',
        narration: 'ایجنت نتیجهٔ خواندن فایل را به کانتکست اضافه می‌کند و مدل را دوباره فراخوانی می‌کند.',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'u.file' },
          { id: 'a.read' },
          { id: 'r.file', state: 'new' },
        ],
      },
      {
        id: 'f5',
        title: 'پاسخ مدل به ایجنت',
        actor: 'model',
        narration: 'مدل بر پایهٔ متن واقعی فایل توضیح می‌نویسد؛ ایجنت آن را به کاربر نشان می‌دهد.',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'u.file' },
          { id: 'a.read' },
          { id: 'r.file' },
        ],
        output: { text: t('a.final') },
      },
    ],
  },

  // ── 6.3 ────────────────────────────────────────────────────────────────
  {
    key: 'mcp-fills-tools',
    lesson: '6.3',
    mode: 'steps',
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
        title: 'کشف ابزارها هنگام اتصال',
        actor: 'harness',
        narration: 'ایجنت هنگام اتصال از سرور فهرست ابزارها را می‌گیرد؛ این آماده‌سازی برنامه است، نه درخواست تولیدشدهٔ مدل.',
        tapeLabel: 'آماده‌سازی فهرست پیش از فراخوانی مدل',
        blocks: [{ id: 'sys' }, { id: 'tools' }],
        outside: {
          icon: 'tool',
          label: 'چارچوب اجرا می‌پرسد: چه ابزارهایی داری؟',
          detail: '[{"name": "getIssue", "parameters": {"id": "string"}}]',
          feeds: 'tools.mcp',
        },
      },
      {
        id: 'f3',
        title: 'یک قابلیت تازه در فهرست',
        actor: 'harness',
        narration: 'در این مثال، مدل تعریف ابزار تازه را دریافت می‌کند؛ این تعریف هنوز نتیجهٔ اجرای ابزار نیست.',
        blocks: [{ id: 'sys' }, { id: 'tools.mcp', state: 'changed' }],
        outside: {
          icon: 'document',
          label: 'ابزار بیشتر، متن بیشتر',
          detail: 'هر ابزار تازه، چند خط به فهرست اضافه می‌کند.',
        },
      },
    ],
  },

  // ── 2.3 ────────────────────────────────────────────────────────────────
  {
    key: 'skill-loading',
    lesson: '2.3',
    mode: 'steps',
    frames: [
      {
        id: 'f1',
        title: 'فهرست مهارت، نه متن کامل',
        actor: 'harness',
        narration: 'مدل نام، توضیح و مسیر مهارت را می‌بیند؛ ابزار خواندن موجود است، اما متن کامل هنوز در کانتکست نیست.',
        tapeLabel: 'ورودی فراخوانی اول — پیش از خواندن مهارت',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'skill.menu', state: 'new' },
          { id: 'u.fix', state: 'new', turnStart: 1 },
        ],
      },
      {
        id: 'f2',
        title: 'مدل درخواست خواندن مهارت را می‌نویسد',
        actor: 'model',
        narration: 'مدل مهارت مرتبط را انتخاب می‌کند و درخواست خواندن فایل آن را می‌نویسد؛ هنوز چیزی خوانده نشده است.',
        tapeLabel: 'همان ورودی؛ درخواست خواندن، خروجی تازه است',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'skill.menu' },
          { id: 'u.fix', turnStart: 1 },
        ],
        output: {
          text: t('a.skill.read'),
          label: 'درخواست ابزار از مدل به ایجنت',
          note: 'درخواست، نه اجرا؛ این فراخوانی مدل پایان می‌یابد.',
        },
      },
      {
        id: 'f3',
        title: 'ایجنت فایل مهارت را می‌خواند',
        actor: 'harness',
        narration: 'ایجنت مسیر و دسترسی را بررسی و فایل مهارت را می‌خواند؛ در این فاصله مدل فراخوانی نمی‌شود.',
        tapeLabel: 'درخواست ثبت‌شده؛ نتیجه هنوز به مدل داده نشده است',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'skill.menu' },
          { id: 'u.fix', turnStart: 1 },
          { id: 'a.skill.read', state: 'new' },
        ],
        outside: {
          icon: 'document',
          label: 'ایجنت readFile را برای فایل مهارت اجرا می‌کند',
          detail: 'این کار فقط دستورالعمل را می‌خواند؛ تست یا ویرایش کد نیست.',
          feeds: 'skill.full',
        },
      },
      {
        id: 'f4',
        title: 'نتیجهٔ خواندن در کانتکست بعدی',
        actor: 'harness',
        narration: 'ایجنت درخواست قبلی و متن برگشتی مهارت را به کانتکست اضافه می‌کند و مدل را دوباره فراخوانی می‌کند.',
        tapeLabel: 'ورودی فراخوانی دوم — اکنون متن مهارت حاضر است',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'skill.menu' },
          { id: 'u.fix', turnStart: 1 },
          { id: 'a.skill.read' },
          { id: 'skill.full', state: 'new', note: 'نتیجهٔ ابزار خواندن فایل مهارت، نه دستورالعملی که خودبه‌خود ظاهر شده باشد.' },
        ],
      },
      {
        id: 'f5',
        title: 'مدل گام بعد را درخواست می‌کند',
        actor: 'model',
        narration: 'مدل طبق مهارت، خواندن کد را درخواست می‌کند؛ اجرای این درخواست و تست‌ها هنوز بر عهدهٔ ایجنت است.',
        tapeLabel: 'همان ورودی فراخوانی دوم',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'skill.menu' },
          { id: 'u.fix', turnStart: 1 },
          ...traceRefs('skill'),
        ],
        output: {
          text: t('a.read'),
          label: 'درخواست تازهٔ مدل: حالا فایل کد را بخوان',
          note: 'مهارت خوانده شده، اما این درخواست تازه هنوز اجرا نشده؛ ویرایش و تست هم انجام نشده‌اند.',
        },
      },
    ],
  },

  // ── 2.4 ────────────────────────────────────────────────────────────────
  {
    key: 'memory-facts',
    lesson: '2.4',
    mode: 'steps',
    frames: [
      {
        id: 'f1',
        title: 'نوبت اول',
        actor: 'model',
        narration: 'شما مسیر فایل را می‌گویید و دستیار پاسخ می‌دهد؛ برنامه می‌تواند این دو پیام را برای نوبت بعد نگه دارد.',
        blocks: [{ id: 'sys' }, { id: 'u.memory.first', turnStart: 1 }],
        output: { text: t('a.memory.first'), label: 'پاسخ دستیار — پایان نوبت ۱' },
      },
      {
        id: 'f2',
        title: 'نوشتن یادداشت',
        actor: 'store',
        narration: 'برنامه علاوه بر تاریخچهٔ گفت‌وگو، می‌تواند نکته‌های لازم را در یادداشت جداگانه‌ای ذخیره کند.',
        tapeLabel: 'تاریخچهٔ ذخیره‌شده پس از نوبت اول',
        blocks: [{ id: 'sys' }, { id: 'u.memory.first', turnStart: 1 }, { id: 'a.memory.first' }],
        outside: {
          icon: 'database',
          label: 'ایجنت یک یادداشت جداگانه می‌نویسد',
          detail: `فایل موردنظر: ${story.file}`,
          tone: 'ok',
        },
      },
      {
        id: 'f3',
        title: 'نوبت دوم، بدون تاریخچه یا یادداشت',
        actor: 'model',
        narration: 'اگر نه تاریخچه و نه یادداشت وارد کانتکست شود، مدل مرجع «همان فایل» را نمی‌بیند.',
        blocks: [{ id: 'sys' }, { id: 'u.again', state: 'new', turnStart: 2 }],
        output: { text: t('a.nomem'), tone: 'danger' },
      },
      {
        id: 'f4',
        title: 'نوبت دوم، با تاریخچهٔ گفت‌وگو',
        actor: 'model',
        narration: 'با فرستادن دوبارهٔ پیام شما و پاسخ قبلی دستیار، مسیر فایل در کانتکست نوبت دوم حاضر است.',
        blocks: [
          { id: 'sys' },
          { id: 'u.memory.first', state: 'new', turnStart: 1 },
          { id: 'a.memory.first', state: 'new' },
          { id: 'u.again', turnStart: 2 },
        ],
        output: { text: t('a.mem'), tone: 'ok' },
      },
      {
        id: 'f5',
        title: 'نوبت دوم، با یادداشت ذخیره‌شده',
        actor: 'model',
        narration: 'حتی بدون متن کامل گفت‌وگوی قبلی، یادداشت مرتبط می‌تواند مسیر فایل را به کانتکست برگرداند.',
        blocks: [{ id: 'sys' }, { id: 'mem.file', state: 'new' }, { id: 'u.again', turnStart: 2 }],
        outside: {
          icon: 'database',
          label: 'انبار حافظه خوانده می‌شود',
          detail: 'مسیر فایل از یادداشت جداگانه به کانتکست برمی‌گردد.',
          feeds: 'mem.file',
          tone: 'ok',
        },
        output: { text: t('a.mem'), tone: 'ok' },
      },
    ],
  },

  // ── 2.6 ────────────────────────────────────────────────────────────────
  {
    key: 'tests-as-text',
    lesson: '2.6',
    mode: 'steps',
    frames: [
      {
        id: 'f1',
        title: 'درخواست خواندن کد',
        actor: 'model',
        narration: 'مدل پیش از پیشنهاد تغییر، درخواست خواندن فایل را می‌نویسد؛ داشتن ابزار به‌معنی خوانده‌شدن فایل نیست.',
        blocks: codingInput(),
        output: { text: t('a.read'), label: 'درخواست مدل — نه اجرای فایل' },
      },
      {
        id: 'f2',
        title: 'اجرای خواندن در ایجنت',
        actor: 'harness',
        narration: 'ایجنت درخواست خواندن را اجرا می‌کند؛ مدل تا رسیدن نتیجه، متن کد را ندارد.',
        blocks: [...codingInput(), { id: 'a.read', state: 'new' }],
        outside: {
          icon: 'document',
          label: 'ایجنت فایل درخواست‌شده را می‌خواند',
          detail: 'نتیجه در گام بعد به کانتکست برمی‌گردد؛ هنوز تستی اجرا نشده است.',
          feeds: 'r.file',
        },
      },
      {
        id: 'f3',
        title: 'متن کد و درخواست اجرای تست',
        actor: 'model',
        narration: 'ایجنت متن کد را برگردانده است؛ مدل اکنون درخواست اجرای تست را می‌نویسد، نه نتیجهٔ آن را.',
        blocks: [...codingInput(), ...traceRefs('file')],
        output: { text: t('a.test'), label: 'درخواست اجرای کامند تست' },
      },
      {
        id: 'f4',
        title: 'تست ناموفق و پیشنهاد ویرایش',
        actor: 'model',
        narration: 'ایجنت تست درخواستی را اجرا کرده و خطا برگشته است؛ مدل بر پایهٔ کد و خطا درخواست ویرایش می‌دهد.',
        blocks: [...codingInput(), ...traceRefs('file', 'testFail')],
        outside: {
          icon: 'tool',
          label: 'ایجنت کامند تست را اجرا کرده است',
          detail: 'خروجی ناموفق پیش از پیشنهاد ویرایش به مدل رسیده است.',
          feeds: 'test.fail',
        },
        output: { text: t('a.editcall'), label: 'درخواست ویرایش — هنوز اعمال نشده است' },
      },
      {
        id: 'f5',
        title: 'اعمال ویرایش در ایجنت',
        actor: 'harness',
        narration: 'ایجنت ویرایش درخواست‌شده را اعمال می‌کند؛ سبزشدن تست هنوز معلوم نیست.',
        blocks: [...codingInput(), ...traceRefs('file', 'testFail'), { id: 'a.editcall', state: 'new' }],
        outside: {
          icon: 'tool',
          label: 'ایجنت ابزار ویرایش را اجرا می‌کند',
          detail: 'اجرای ویرایش، جای اجرای دوبارهٔ تست را نمی‌گیرد.',
          feeds: 'r.edited',
        },
      },
      {
        id: 'f6',
        title: 'نتیجهٔ ویرایش و درخواست تست دوباره',
        actor: 'model',
        narration: 'نتیجهٔ ویرایش به کانتکست برگشته است؛ مدل اکنون اجرای دوبارهٔ تست را درخواست می‌کند.',
        blocks: [...codingInput(), ...traceRefs('file', 'testFail', 'edit')],
        output: { text: t('a.test.again'), label: 'درخواست تازهٔ اجرای تست، پس از ویرایش' },
      },
      {
        id: 'f7',
        title: 'ایجنت دوباره تست می‌گیرد',
        actor: 'harness',
        narration: 'ایجنت کامند تست را پس از ویرایش دوباره اجرا می‌کند؛ مدل تا برگشتن نتیجه، موفقیت را نمی‌داند.',
        blocks: [...codingInput(), ...traceRefs('file', 'testFail', 'edit'), { id: 'a.test.again', state: 'new' }],
        outside: {
          icon: 'tool',
          label: 'اجرای دوم کامند تست توسط ایجنت',
          detail: 'این اجرای جدید است، نه استفادهٔ دوباره از نتیجهٔ قبلی.',
          feeds: 'test.pass',
        },
      },
      {
        id: 'f8',
        title: 'نتیجهٔ موفق و گزارش نهایی',
        actor: 'model',
        narration: 'نتیجهٔ موفق تست برگشته است؛ فقط حالا مدل می‌تواند موفقیت بررسی نمونه را گزارش کند.',
        blocks: [...codingInput(), ...traceRefs('file', 'testFail', 'edit', 'testPass')],
        output: { text: t('a.done'), label: 'پاسخ نهایی دستیار — پایان همین نوبت', tone: 'ok' },
      },
    ],
  },

  // ── 2.7 ────────────────────────────────────────────────────────────────
  {
    key: 'anatomy-recap',
    lesson: '2.7',
    mode: 'static',
    narration: 'ایجنت برنامه‌ای است که این متن را می‌چیند، به مدل می‌دهد و پاسخ را به آن اضافه می‌کند.',
    frames: [
      {
        id: 'f1',
        title: 'همهٔ قطعه‌ها در یک متن',
        actor: 'harness',
        narration: 'ایجنت برنامه‌ای است که این متن را می‌چیند، به مدل می‌دهد و پاسخ را به آن اضافه می‌کند.',
        tapeLabel: 'ورودی آماده، پس از خواندن مهارت و فایل توسط ایجنت',
        blocks: [
          { id: 'sys', lessonRef: '1.2' },
          { id: 'tools', lessonRef: '2.2' },
          { id: 'skill.menu', lessonRef: '2.3' },
          { id: 'mem', lessonRef: '2.4' },
          { id: 'u.task', lessonRef: '2.4' },
          ...traceRefs('skill').map((ref) => ({ ...ref, lessonRef: '2.3' })),
          ...traceRefs('file').map((ref) => ({ ...ref, lessonRef: '2.2' })),
        ],
      },
    ],
  },

  // ── 5.1 uses ProbabilityBars, not a lens. ──────────────────────────────

  // ── 5.3 ────────────────────────────────────────────────────────────────
  {
    key: 'context-fills',
    lesson: '5.3',
    mode: 'steps',
    frames: [
      {
        id: 'f1',
        title: 'همه‌چیز جا می‌شود',
        actor: 'model',
        narration: 'پیام قبلی شما و پاسخ دستیار هر دو در تاریخچه‌اند؛ این بار همهٔ متن لازم جا می‌شود.',
        blocks: [
          { id: 'sys' },
          { id: 'hist.early', state: 'new' },
          { id: 'u.again', state: 'new' },
        ],
        edge: 'لبهٔ کانتکست',
        meter: { used: 4200, capacity: 8000 },
        output: { text: t('a.target'), tone: 'ok' },
      },
      {
        id: 'f2',
        title: 'انتخاب نمونهٔ برنامه: حذف تاریخچهٔ قدیمی',
        actor: 'harness',
        narration: 'در این نمونه، برنامه تاریخچهٔ قدیمی را حذف کرد؛ مسیر فایل هم از ورودی بعدی کنار رفت.',
        blocks: [
          { id: 'sys' },
          { id: 'hist.early', state: 'evicted' },
          { id: 'hist.mid', state: 'new' },
          { id: 'hist.late', state: 'new' },
          { id: 'u.again' },
        ],
        edge: 'لبهٔ کانتکست',
        meter: { used: 7600, capacity: 8000 },
        output: { text: t('a.nomem'), tone: 'danger' },
      },
      {
        id: 'f3',
        title: 'بازگرداندن یادداشت مرتبط به ورودی',
        actor: 'model',
        narration: 'برنامه یادداشت مرتبط را دوباره انتخاب کرده است؛ ذخیره‌شدن به‌تنهایی تضمین ورود آن در هر فراخوانی نیست.',
        blocks: [
          { id: 'sys' },
          { id: 'mem', state: 'new' },
          { id: 'hist.mid' },
          { id: 'hist.late' },
          { id: 'u.again' },
        ],
        edge: 'لبهٔ کانتکست',
        meter: { used: 7900, capacity: 8000 },
        output: { text: t('a.mem'), tone: 'ok' },
      },
    ],
  },

  // ── 5.4 ────────────────────────────────────────────────────────────────
  {
    key: 'learned-vs-given',
    lesson: '5.4',
    mode: 'compare',
    narration: 'دانش زبان در مدل است؛ محتوای امروزِ پروژه فقط از متن این نوبت می‌آید.',
    panels: [
      {
        label: 'آنچه در آموزش یاد گرفته',
        modelLabel: 'مدل، بدون متن تازه',
        blocks: [
          { id: 'train.fixed', state: 'new' },
          { id: 'u.file', state: 'new' },
        ],
        output: { text: t('a.dontknow'), tone: 'danger' },
        note: 'این دانش در فایل‌های مدل است و با هر پرسش عوض نمی‌شود.',
      },
      {
        label: 'آنچه در متن همین نوبت آمده',
        modelLabel: 'همان مدل، با متن تازه',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'u.file' },
          ...traceRefs('file'),
        ],
        output: { text: t('a.final'), tone: 'ok' },
        note: 'نمای پس از اجرای خواندن: درخواست مدل و نتیجهٔ ایجنت هر دو حاضرند؛ مدل آموزش دوباره ندیده است.',
      },
    ],
    compareNote: 'مدل برای دیدن کد امروزِ پروژه باید متن فایل را بگیرد؛ آموزش به‌تنهایی کافی نیست.',
  },

  // ── 5.5 ────────────────────────────────────────────────────────────────
  {
    key: 'no-fact-fluent-guess',
    lesson: '5.5',
    mode: 'compare',
    narration: 'بدون اطلاعات کافی، مدل ممکن است پاسخ بی‌پشتوانه بسازد؛ سؤال‌پرسیدن یا پاسخ‌ندادن هم ممکن است.',
    panels: [
      {
        label: 'بدون واقعیت در متن',
        blocks: [{ id: 'sys' }, { id: 'u.filename' }],
        output: {
          text: t('a.hallucinated'),
          tone: 'danger',
          note: 'روان است، اما هیچ واقعیتی پشتش نیست.',
        },
      },
      {
        label: 'با واقعیت در متن',
        blocks: [{ id: 'sys' }, { id: 'mem', state: 'new' }, { id: 'u.filename' }],
        output: { text: t('a.true'), tone: 'ok' },
      },
    ],
    compareNote: 'اطلاعات مرتبط در این مثال کمک کرده است؛ وجود منبع در همهٔ اجراها صحت را تضمین نمی‌کند.',
  },

  // ── 5.7 ────────────────────────────────────────────────────────────────
  {
    key: 'thinking-text',
    lesson: '5.7',
    mode: 'compare',
    narration: 'دو برنامهٔ توضیحی را مقایسه کنید؛ متن بیشتر به‌تنهایی شاهد محاسبهٔ بهتر یا پاسخ درست نیست.',
    panels: [
      {
        label: 'برنامهٔ عجولانه',
        blocks: [{ id: 'sys' }, { id: 'u.reason' }],
        output: { text: t('a.reason.wrong'), tone: 'danger', note: 'اقدام سریع، بدون بررسی وابستگی فایل‌ها.' },
      },
      {
        label: 'برنامهٔ مرحله‌ای',
        blocks: [{ id: 'sys' }, { id: 'u.reason' }, { id: 'thinking.plan', state: 'new' }],
        output: { text: t('a.reason.right'), tone: 'ok' },
        note: 'این مراحل، توضیح آموزشی مسئله‌اند؛ نه متن درونیِ ثبت‌شده از یک مدل واقعی.',
      },
    ],
    compareNote: 'این متن‌ها برنامهٔ توضیحی‌اند، نه رونوشت فرایند درونی مدل. نتیجه را با شواهد کار بسنجید.',
  },

  // ── 6.1 ────────────────────────────────────────────────────────────────
  {
    key: 'messages-array',
    lesson: '6.1',
    mode: 'mapping',
    frames: [
      {
        id: 'f1',
        title: 'نوبت اول: درخواست و پاسخ',
        actor: 'harness',
        narration: 'همان مثال درس ۱.۲ است؛ دو پیام ورودی فرستاده می‌شود و پاسخ دستیار خروجی تازهٔ مدل است.',
        showMessageRoles: true,
        tapeLabel: 'کانتکست پیش از پاسخ اول',
        blocks: [{ id: 'sys.conversation', state: 'new' }, { id: 'u.conversation.first', state: 'new', turnStart: 1 }],
        messages:
          JSON.stringify([{ role: 'system', content: t('sys.conversation') }, { role: 'user', content: t('u.conversation.first') }], null, 2),
        messagesNote: 'دو پیام در درخواست؛ پاسخ دستیار هنوز در این آرایه نیست.',
        output: { text: t('a.conversation.first'), label: 'پاسخ تازهٔ دستیار — پایان نوبت ۱' },
      },
      {
        id: 'f2',
        title: 'نوبت دوم: چهار پیام در درخواست',
        actor: 'harness',
        narration: 'پاسخ قبلی با نقش دستیار وارد درخواست دوم می‌شود؛ پاسخ جدید هنوز خروجی است، نه بخشی از ورودی.',
        showMessageRoles: true,
        tapeLabel: 'کانتکست پیش از پاسخ دوم',
        blocks: [
          { id: 'sys.conversation' },
          { id: 'u.conversation.first', turnStart: 1 },
          { id: 'a.conversation.first', state: 'new' },
          { id: 'u.conversation.second', state: 'new', turnStart: 2 },
        ],
        messages:
          JSON.stringify([{ role: 'system', content: t('sys.conversation') }, { role: 'user', content: t('u.conversation.first') }, { role: 'assistant', content: t('a.conversation.first') }, { role: 'user', content: t('u.conversation.second') }], null, 2),
        messagesNote: 'چهار پیام در درخواست؛ پاسخ دوم جداگانه تولید می‌شود.',
        output: { text: t('a.conversation.second'), label: 'پاسخ تازهٔ دستیار — پایان نوبت ۲' },
      },
      {
        id: 'f3',
        title: 'پس از پاسخ دوم: پنج پیام ذخیره‌شده',
        actor: 'harness',
        narration: 'پاسخ دوم هم ذخیره شد؛ این آرایه تاریخچهٔ کامل دو نوبت است، نه درخواست سومی به مدل.',
        showMessageRoles: true,
        tapeLabel: 'گفت‌وگوی ذخیره‌شده پس از دو نوبت',
        messagesLabel: 'پیام‌های ذخیره‌شده، نه درخواست تازه:',
        blocks: [
          { id: 'sys.conversation' },
          { id: 'u.conversation.first', turnStart: 1 },
          { id: 'a.conversation.first' },
          { id: 'u.conversation.second', turnStart: 2 },
          { id: 'a.conversation.second', state: 'new' },
        ],
        messages:
          JSON.stringify([{ role: 'system', content: t('sys.conversation') }, { role: 'user', content: t('u.conversation.first') }, { role: 'assistant', content: t('a.conversation.first') }, { role: 'user', content: t('u.conversation.second') }, { role: 'assistant', content: t('a.conversation.second') }], null, 2),
        messagesNote: 'دستور سیستم و دو جفت پیام کاربر و دستیار؛ برای ادامه، پیام تازهٔ کاربر اضافه می‌شود.',
      },
    ],
  },

  // ── 6.2 lab: prepared-input comparison ────────────────────────────────
  {
    key: 'lab',
    lesson: '6.2',
    mode: 'lab',
    title: 'آزمایشگاه کانتکست',
    narration: 'متن را خودتان بچینید و ببینید پاسخ چطور عوض می‌شود.',
  },

  // ── 6.4 ────────────────────────────────────────────────────────────────
  {
    key: 'rag-paste',
    lesson: '6.4',
    mode: 'steps',
    frames: [
      {
        id: 'f1',
        title: 'بازیابی خودکار پیش از مدل',
        actor: 'harness',
        narration: 'در این مسیر، برنامه برای هر پرسش خودکار بازیابی می‌کند؛ مدل هنوز درخواست ابزاری ننوشته و فراخوانی نشده است.',
        tapeLabel: 'آماده‌سازی ورودی توسط برنامه، پیش از تولید پاسخ',
        blocks: [{ id: 'sys' }, { id: 'u.policy', state: 'new' }],
        outside: {
          icon: 'database',
          label: 'چارچوب اجرا در اسناد جست‌وجو می‌کند',
          detail: '۱ تکهٔ مرتبط پیدا شد.',
          feeds: 'doc.guide',
        },
      },
      {
        id: 'f2',
        title: 'کپی در متن',
        actor: 'harness',
        narration: 'برنامه قطعهٔ برگشتی را همراه پرسش به ورودی اضافه می‌کند؛ فقط حالا مدل آن سند را می‌بیند.',
        blocks: [
          { id: 'sys' },
          { id: 'doc.guide', state: 'new' },
          { id: 'u.policy' },
        ],
        outside: {
          icon: 'document',
          label: 'تکهٔ سند به متن چسبانده شد',
          detail: 'پرسش + سند، کنار هم.',
          feeds: 'doc.guide',
        },
      },
      {
        id: 'f3',
        title: 'پاسخ از متن',
        actor: 'model',
        narration: 'مدل از متنی که جلویش بود نقل کرد؛ از حافظهٔ خودش نه.',
        blocks: [
          { id: 'sys' },
          { id: 'doc.guide' },
          { id: 'u.policy' },
        ],
        output: { text: t('a.policy'), tone: 'ok' },
      },
      {
        id: 'f4',
        title: 'تکهٔ اشتباه',
        actor: 'model',
        narration: 'تکهٔ نامرتبط می‌تواند پاسخ را منحرف کند؛ بازیابی تضمین صحت نیست.',
        blocks: [
          { id: 'sys' },
          { id: 'doc.ui', state: 'new' },
          { id: 'u.policy' },
        ],
        output: { text: t('a.ui'), tone: 'danger' },
      },
    ],
  },

  // ── 6.5 ────────────────────────────────────────────────────────────────
  {
    key: 'where-it-changes',
    lesson: '6.5',
    mode: 'compare',
    narration: 'پرامپت و RAG متن را عوض می‌کنند؛ فاین‌تیون خود مدل را.',
    panels: [
      {
        label: 'تغییر متن: پرامپت، کانتکست، RAG',
        modelLabel: 'همان مدل',
        blocks: [{ id: 'sys' }, { id: 'doc.guide', state: 'new' }, { id: 'u.policy' }],
        output: { text: t('a.policy'), tone: 'ok' },
        note: 'سند در متن است؛ مدل همان مدل قبلی است.',
      },
      {
        label: 'تغییر مدل: فاین‌تیون',
        modelLabel: 'مدل فاین‌تیون‌شده',
        blocks: [{ id: 'sys' }, { id: 'doc.guide' }, { id: 'u.policy' }],
        output: { text: 'تغییر: محدود به درخواست. بررسی: تست مرتبط و تفاوت فایل‌ها. گزارش: نتیجهٔ واقعی و بررسی‌های اجرا‌نشده.', tone: 'ok' },
        note: 'سند در هر دو یکسان است؛ این بار فقط قالب پاسخ با آموزش تغییر کرده است.',
      },
    ],
    compareNote: 'در این مثال، منبع در ورودی و قالب در آموزش تغییر کرده‌اند؛ این تقسیم، قانون انحصاری دانش و رفتار نیست.',
  },

  // ── 6.10 ───────────────────────────────────────────────────────────────
  {
    key: 'who-writes-what',
    lesson: '6.10',
    mode: 'static',
    narration: 'هر جعبه در معماری، یک تکه از این متن را می‌سازد.',
    frames: [
      {
        id: 'f1',
        title: 'هر جعبه، یک تکه متن',
        actor: 'harness',
        narration: 'هر جعبه در معماری، یک تکه از این متن را می‌سازد.',
        tapeLabel: 'تاریخچهٔ ثبت‌شده، پس از خواندن مهارت و فایل و تولید پاسخ',
        blocks: [
          { id: 'sys', note: 'از برنامه‌ریز', lessonRef: '1.2' },
          { id: 'tools', note: 'از فهرست ابزارها', lessonRef: '2.2' },
          { id: 'skill.menu', note: 'از مهارت‌ها', lessonRef: '2.3' },
          { id: 'mem', note: 'از انبار حافظه', lessonRef: '2.4' },
          { id: 'u.task', note: 'از دروازه', lessonRef: '6.10' },
          ...traceRefs('skill').map((ref) => ({ ...ref, lessonRef: '2.3' })),
          { id: 'a.read', note: 'نوشتهٔ مدل', lessonRef: '2.2' },
          { id: 'r.file', note: 'از ابزار خواندن فایل', lessonRef: '2.2' },
          { id: 'a.final', note: 'نوشتهٔ مدل', lessonRef: '1.2' },
        ],
      },
    ],
  },

  // ── 6.7 ────────────────────────────────────────────────────────────────
  {
    key: 'cache-prefix',
    lesson: '6.7',
    mode: 'compare',
    narration: 'در کش پیشوندی، ابتدای مشترک می‌تواند دوباره استفاده شود؛ پشتیبانی و شرایط به سرویس وابسته‌اند.',
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
          { id: 'u.file', state: 'changed' },
        ],
        output: { text: t('a.read') },
        note: 'سه بلوک اول مشترک‌اند؛ استفاده از کش به حد طول، مدت و شرایط سرویس بستگی دارد.',
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
          { id: 'u.file', state: 'changed' },
        ],
        output: { text: t('a.read') },
        note: 'در این مثال، ساعت پیشوند مشترک را کوتاه کرده است؛ بخش‌های بعدی به‌تنهایی کش پیشوندی نمی‌سازند.',
      },
    ],
    compareNote: 'ترتیب، هزینه را عوض می‌کند: هر چیزی که زودتر بیاید و ثابت بماند، بیشتر کش می‌شود.',
  },

  // ── 6.8 ────────────────────────────────────────────────────────────────
  {
    key: 'injection',
    lesson: '6.8',
    mode: 'steps',
    frames: [
      {
        id: 'f1',
        title: 'دستور مخفی در سند',
        actor: 'harness',
        narration: 'برنامه راهنما را پیش از پاسخ آماده کرده است؛ متن مخرب در کانتکست است، اما هنوز درخواست خطرناکی اجرا نشده است.',
        outside: {
          icon: 'document',
          label: 'آماده‌سازی خودکار راهنما توسط برنامه',
          detail: 'این مرحله درخواست مدل نیست؛ خطای بعدی هنگام تصمیم مدل و اجرای ابزار بررسی می‌شود.',
          feeds: 'doc.injected',
        },
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'u.file' },
          { id: 'doc.injected', state: 'new' },
        ],
      },
      {
        id: 'f2',
        title: 'پیروی اشتباه از متن منبع',
        actor: 'model',
        narration: 'مدل در این نمونه از متن مخرب پیروی کرده است؛ برچسب منبع و نقش، کنترل اجرایی مجوز نیست.',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'u.file' },
          { id: 'doc.injected', state: 'danger' },
        ],
        output: {
          text: t('a.badcall'),
          tone: 'danger',
          note: 'نمونه‌ای از پیروی از متن مخرب؛ بررسی مجوز باید بیرون از مدل انجام شود.',
        },
      },
      {
        id: 'f3',
        title: 'بررسی و رد درخواست در ایجنت',
        actor: 'harness',
        narration: 'ایجنت درخواست را بررسی و رد می‌کند؛ خود درخواست در تاریخچه می‌ماند، اما فایل اسرار خوانده نمی‌شود.',
        tapeLabel: 'درخواست ثبت‌شده؛ هنوز نتیجهٔ رد به مدل داده نشده است',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'u.file' },
          { id: 'doc.injected', state: 'danger' },
          { id: 'a.badcall', state: 'danger' },
        ],
        outside: {
          icon: 'shield',
          label: 'چارچوب اجرای ایجنت درخواست را بررسی کرد',
          detail: 'فایل اسرار بیرون از محدودهٔ مجاز پروژه است؛ درخواست رد شد.',
          feeds: 'r.denied',
          tone: 'ok',
        },
      },
      {
        id: 'f4',
        title: 'نتیجهٔ رد در فراخوانی بعدی',
        actor: 'harness',
        narration: 'ایجنت نتیجهٔ خطای دسترسی را کنار درخواست قبلی به مدل می‌دهد؛ محتوای فایل اسرار در کانتکست نیست.',
        tapeLabel: 'ورودی فراخوانی بعدی — همراه نتیجهٔ ناموفق ابزار',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'u.file' },
          { id: 'doc.injected', state: 'danger' },
          ...traceRefs('denied'),
        ],
      },
      {
        id: 'f5',
        title: 'گزارش محدودیت به‌جای ادعای خواندن',
        actor: 'model',
        narration: 'مدل نتیجهٔ رد را می‌بیند و محدودیت را گزارش می‌کند؛ رد این درخواست، تضمین مصونیت کامل از حمله نیست.',
        blocks: [
          { id: 'sys' },
          { id: 'tools' },
          { id: 'u.file' },
          { id: 'doc.injected', state: 'danger' },
          ...traceRefs('denied'),
        ],
        output: { text: t('a.blocked'), label: 'پاسخ دستیار پس از دیدن نتیجهٔ رد' },
      },
    ],
  },

  // ── 6.9 ────────────────────────────────────────────────────────────────
  {
    key: 'read-the-trace',
    lesson: '6.9',
    mode: 'static',
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
            note: 'کامند تست عوض شده، اما یادداشتِ ذخیره‌شده هنوز نسخهٔ قدیمی را دارد.',
          },
          { id: 'u.command', state: 'new' },
        ],
        output: {
          text: t('a.stale'),
          tone: 'danger',
          note: 'علت: یادداشت قدیمی در حافظه.',
        },
      },
    ],
  },

  // ── 6.12 ───────────────────────────────────────────────────────────────
  {
    key: 'recap',
    lesson: '6.12',
    mode: 'static',
    narration: 'همهٔ این سند، یک ایده: مدل فقط ادامهٔ متنی را می‌نویسد که جلویش گذاشته‌اند.',
    frames: [
      {
        id: 'f1',
        title: 'کل سند، یک متن',
        actor: 'harness',
        narration: 'همهٔ این سند، یک ایده: مدل فقط ادامهٔ متنی را می‌نویسد که جلویش گذاشته‌اند.',
        tapeLabel: 'رد ذخیره‌شده پس از پایان کار؛ نه ورودی پیش از پاسخ نهایی',
        blocks: [
          { id: 'sys', lessonRef: '1.2' },
          { id: 'tools', lessonRef: '2.2' },
          { id: 'skill.menu', lessonRef: '2.3' },
          { id: 'mem', lessonRef: '2.4' },
          { id: 'u.task', lessonRef: '2.4' },
          ...traceRefs('skill').map((ref) => ({ ...ref, lessonRef: '2.3' })),
          ...traceRefs('file').map((ref) => ({ ...ref, lessonRef: '2.2' })),
          ...traceRefs('testFail', 'edit', 'testPass').map((ref) => ({ ...ref, lessonRef: '2.6' })),
          { id: 'a.done', lessonRef: '1.2' },
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
