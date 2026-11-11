import type { KindId } from './types';
import { traceRefs } from './traces.ts';

export interface LabToggle {
  id: 'sys' | 'mem' | 'tools' | 'skill' | 'doc';
  label: string;
  hint: string;
  blockId: string;
  tokens: number;
  defaultOn: boolean;
}

export const labToggles: LabToggle[] = [
  {
    id: 'sys',
    label: 'دستور سیستم',
    hint: 'نقش دستیار، زبان گزارش و ممنوعیت انتشار را مشخص می‌کند.',
    blockId: 'sys',
    tokens: 58,
    defaultOn: true,
  },
  {
    id: 'mem',
    label: 'حافظه',
    hint: 'مسیر فایل، کامند تست و ترجیح گزارش را از نوبت قبل می‌آورد.',
    blockId: 'mem',
    tokens: 40,
    defaultOn: true,
  },
  {
    id: 'tools',
    label: 'ابزارها',
    hint: 'با داشتن مسیر، درخواست خواندن و تست و نتیجهٔ نمونهٔ هر دو در متن نشان داده می‌شوند.',
    blockId: 'tools',
    tokens: 120,
    defaultOn: true,
  },
  {
    id: 'skill',
    label: 'متن آمادهٔ مهارت',
    hint: 'این کلید متن ازپیش‌خوانده‌شده را انتخاب می‌کند، نه اجرای خواندن؛ مسیر بارگذاری در درس ۲.۴ آمده است.',
    blockId: 'skill.full',
    tokens: 95,
    defaultOn: false,
  },
  {
    id: 'doc',
    label: 'متن آمادهٔ راهنمای پروژه',
    hint: 'برنامه متن راهنما را از قبل آماده کرده است؛ این کلید ادعای خواندن فایل توسط مدل نیست.',
    blockId: 'doc.guide',
    tokens: 40,
    defaultOn: false,
  },
];

export type LabState = Record<LabToggle['id'], boolean>;

export const labDefaultState: LabState = Object.fromEntries(
  labToggles.map((t) => [t.id, t.defaultOn]),
) as LabState;

export interface LabPreset {
  id: string;
  label: string;
  state: LabState;
}

export const labPresets: LabPreset[] = [
  {
    id: 'all',
    label: 'همه‌چیز',
    state: { sys: true, mem: true, tools: true, skill: true, doc: true },
  },
  {
    id: 'sys-only',
    label: 'فقط دستور',
    state: { sys: true, mem: false, tools: false, skill: false, doc: false },
  },
  {
    id: 'no-tools',
    label: 'بدون ابزار',
    state: { sys: true, mem: true, tools: false, skill: true, doc: true },
  },
];

export interface LabSentenceVariant {
  /** all keys must match the state; omitted keys are ignored */
  when: Partial<LabState>;
  text: string;
  status: 'ok' | 'warn' | 'ask';
  sources: string[];
  note?: string;
}

export interface LabSentence {
  id: string;
  variants: LabSentenceVariant[];
  /** omitted entirely when false for the current state */
  always?: boolean;
}

/**
 * Authored, deterministic answer table. There is no model and no randomness:
 * every sentence is chosen by which blocks are on, and names the blocks it
 * relies on.
 */
export const labSentences: LabSentence[] = [
  {
    id: 's1',
    always: true,
    variants: [
      {
        when: { sys: true, mem: true },
        text: 'فایل src/utils.ts را با توجه به درخواست بررسی می‌کنم؛ چیزی را منتشر نمی‌کنم.',
        status: 'ok',
        sources: ['sys', 'mem'],
      },
      {
        when: { sys: true },
        text: 'دستیار برنامه‌نویسی هستم؛ در محدودهٔ پروژه کار می‌کنم و بدون درخواست منتشر نمی‌کنم.',
        status: 'ok',
        sources: ['sys'],
      },
      {
        when: { mem: true },
        text: 'فایل موردنظر src/utils.ts است؛ محدودهٔ مجاز تغییر را هم روشن می‌کنم.',
        status: 'ok',
        sources: ['mem'],
      },
      {
        when: {},
        text: 'برای شروع، محدودهٔ کار و فایل هدف را مشخص کنید.',
        status: 'ask',
        sources: [],
      },
    ],
  },
  {
    id: 's2',
    always: true,
    variants: [
      {
        when: { tools: true, mem: true },
        text: 'متن فایل و خروجی تست را دارم؛ در این نمونه، تستِ ورودی خالی خطا داده است.',
        status: 'ok',
        sources: ['results', 'mem'],
      },
      {
        when: { tools: true },
        text: 'ابزار خواندن و تست در دسترس است؛ مسیر فایل را بفرستید تا نتیجهٔ واقعی بگیرم.',
        status: 'ask',
        sources: ['tools'],
      },
      {
        when: {},
        text: 'بدون متن فایل و نتیجهٔ تست، نمی‌دانم کد فعلی چیست یا تست چه می‌گوید.',
        status: 'ask',
        sources: [],
      },
    ],
  },
  {
    id: 's3',
    always: true,
    variants: [
      {
        when: { doc: true },
        text: 'طبق راهنمای پروژه، تست مرتبط و تفاوت فایل‌ها را بررسی می‌کنم و نتیجهٔ واقعی را می‌گویم.',
        status: 'ok',
        sources: ['doc'],
      },
      {
        when: {},
        text: 'قواعد اختصاصی پروژه را ندارم؛ پیش از تغییر، راهنمای پروژه را می‌خوانم.',
        status: 'ask',
        sources: [],
      },
    ],
  },
  {
    id: 's4',
    variants: [
      {
        when: { skill: true },
        text: 'اول خطا را بازتولید می‌کنم، فقط شرط لازم را عوض می‌کنم و تست قبلی را دوباره اجرا می‌کنم.',
        status: 'ok',
        sources: ['skill'],
      },
    ],
  },
  {
    id: 's5',
    variants: [
      {
        when: { mem: true },
        text: 'کامند تستِ ذخیره‌شده npm test -- utils.test.ts است؛ نتیجه را فارسی و کوتاه گزارش می‌دهم.',
        status: 'ok',
        sources: ['mem'],
      },
    ],
  },
];

const matches = (when: Partial<LabState>, state: LabState): boolean =>
  Object.entries(when).every(([key, value]) => state[key as LabToggle['id']] === value);

export interface LabAnswer {
  id: string;
  text: string;
  status: 'ok' | 'warn' | 'ask';
  sources: string[];
}

export function composeLab(state: LabState): LabAnswer[] {
  const out: LabAnswer[] = [];
  for (const sentence of labSentences) {
    const variant = sentence.variants.find((v) => matches(v.when, state));
    if (!variant) continue;
    out.push({ id: sentence.id, ...variant });
  }
  return out;
}

// A final-input snapshot, not a runtime: each authored result follows its request.
export const labEvidenceRefs = traceRefs('file', 'testFail');
export const labEvidenceBlocks = labEvidenceRefs.map((ref) => ref.id);
export const labBlockOrder = ['sys', 'mem', 'tools', 'skill.full', 'doc.guide', 'hist.lab', 'u.lab', ...labEvidenceBlocks];

export const labAlwaysBlocks: { id: string; kind: KindId }[] = [
  { id: 'hist.lab', kind: 'history' },
  { id: 'u.lab', kind: 'user' },
];
