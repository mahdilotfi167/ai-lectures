import type { KindId } from './types';

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
    hint: 'بدون دستور، لحن و نقش مشخص نیست.',
    blockId: 'sys',
    tokens: 58,
    defaultOn: true,
  },
  {
    id: 'mem',
    label: 'حافظه',
    hint: 'بدون حافظه، شمارهٔ سفارش و ترجیح مشتری معلوم نیست.',
    blockId: 'mem',
    tokens: 40,
    defaultOn: true,
  },
  {
    id: 'tools',
    label: 'ابزارها',
    hint: 'بدون ابزار، وضعیت واقعی سفارش در متن نیست.',
    blockId: 'tools',
    tokens: 120,
    defaultOn: true,
  },
  {
    id: 'skill',
    label: 'مهارت «مرجوعی»',
    hint: 'بدون مهارت، روش مرجوعی و قاعدهٔ تأیید مدیر در متن نیست.',
    blockId: 'skill.full',
    tokens: 95,
    defaultOn: false,
  },
  {
    id: 'doc',
    label: 'سند سیاست مرجوعی',
    hint: 'بدون سند، سیاست واقعی مرجوعی در متن نیست.',
    blockId: 'doc.refund',
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
        text: 'سارا، سلام؛ از فروشگاه «بازار».',
        status: 'ok',
        sources: ['sys', 'mem'],
      },
      {
        when: { sys: true },
        text: 'سلام؛ از فروشگاه «بازار».',
        status: 'ok',
        sources: ['sys'],
      },
      {
        when: {},
        text: 'به‌عنوان یک مدل زبانی می‌توانم کمک کنم، اما چند سؤال عمومی دارم.',
        status: 'warn',
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
        text: 'سفارش ۱۲۳ شما ارسال شده و فردا می‌رسد.',
        status: 'ok',
        sources: ['tools', 'mem'],
      },
      {
        when: { tools: true },
        text: 'شمارهٔ سفارش را بفرمایید تا بررسی کنم.',
        status: 'ask',
        sources: ['tools'],
      },
      {
        when: {},
        text: 'سفارش شما در انبار آماده می‌شود و تا ۳ روز دیگر می‌رسد.',
        status: 'warn',
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
        text: 'اگر تا ۷ روز پس از تحویل بخواهید، مرجوعی ممکن است.',
        status: 'ok',
        sources: ['doc'],
      },
      {
        when: {},
        text: 'بله، تا ۳۰ روز می‌توانید مرجوع کنید.',
        status: 'warn',
        sources: [],
        note: 'با سیاست واقعی نمی‌خواند؛ سند در متن نیست.',
      },
    ],
  },
  {
    id: 's4',
    variants: [
      {
        when: { skill: true },
        text: 'اگر مبلغ بالای ۱٬۰۰۰٬۰۰۰ تومان باشد، اول تأیید مدیر می‌گیرم؛ می‌خواهید ثبت کنم؟',
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
        text: 'جزئیات را برایتان پیامک می‌کنم.',
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

export const labBlockOrder = ['sys', 'mem', 'tools', 'skill.full', 'doc.refund', 'hist.lab', 'u.lab'];

export const labAlwaysBlocks: { id: string; kind: KindId }[] = [
  { id: 'hist.lab', kind: 'history' },
  { id: 'u.lab', kind: 'user' },
];
