import { requireTerm } from './glossary';
import type { ZoneId } from './lessons';

export interface MapNode {
  id: string;
  label: string;
  shortLabel?: string;
  lesson: string;
  zone: ZoneId;
  def: string;
  kind: 'term' | 'concept';
}

export interface MapZone {
  id: ZoneId;
  label: string;
  part: number;
  color: string;
  nodes: MapNode[];
}

export interface MapEdge {
  from: string;
  to: string;
  label?: string;
}

const termNode = (zone: ZoneId, id: string): MapNode => {
  const t = requireTerm(id);
  return {
    id,
    label: t.short,
    shortLabel: t.short.length > 14 ? t.short : undefined,
    lesson: t.not_before,
    zone,
    def: t.def_fa,
    kind: 'term',
  };
};

const conceptNode = (
  zone: ZoneId,
  id: string,
  label: string,
  lesson: string,
  def: string,
): MapNode => ({ id, label, lesson, zone, def, kind: 'concept' });

export const mapZones: MapZone[] = [
  {
    id: 'agents',
    label: 'ایجنت‌ها',
    part: 2,
    color: 'var(--part-2)',
    nodes: [
      'agent',
      'chatbot',
      'tool-calling',
      'function-calling',
      'mcp',
      'skill',
      'memory',
      'stateless',
      'workflow',
      'harness',
    ].map((id) => termNode('agents', id)),
  },
  {
    id: 'model',
    label: 'مدل',
    part: 3,
    color: 'var(--part-3)',
    nodes: [
      'llm',
      'model',
      'inference',
      'token',
      'context',
      'turn',
      'context-window',
      'system-prompt',
      'training',
      'pretraining',
      'fine-tuning',
      'alignment',
      'rlhf',
      'hallucination',
      'reasoning',
      'benchmark',
    ].map((id) => termNode('model', id)),
  },
  {
    id: 'build',
    label: 'ساختن',
    part: 4,
    color: 'var(--part-4)',
    nodes: [
      'api',
      'temperature',
      'prompt',
      'few-shot',
      'context-engineering',
      'rag',
      'embedding',
      'chunking',
      'vector-database',
      'semantic-search',
      'eval',
      'regression',
    ].map((id) => termNode('build', id)),
  },
  {
    id: 'run',
    label: 'اجرا',
    part: 5,
    color: 'var(--part-5)',
    nodes: [
      'orchestrator',
      'gateway',
      'cost',
      'caching',
      'prompt-injection',
      'guardrail',
      'data-leakage',
      'least-privilege',
      'observability',
      'tracing',
      'latency',
      'non-determinism',
    ].map((id) => termNode('run', id)),
  },
  {
    id: 'decide',
    label: 'تصمیم',
    part: 6,
    color: 'var(--part-6)',
    nodes: [
      conceptNode('decide', 'value', 'ارزش و اولویت', '6.1', 'انتخاب اولین کاربرد بر پایهٔ حجم کار تکراری و تحمل خطا.'),
      conceptNode('decide', 'build-or-buy', 'ساخت یا خرید', '6.2', 'چهار پرسش برای انتخاب بین خرید، ترکیب و ساخت.'),
      conceptNode('decide', 'team', 'تیم و مهارت', '6.3', 'چهار نقشی که یک قابلیت هوش مصنوعی لازم دارد.'),
      conceptNode('decide', 'map', 'نقشهٔ کامل', '6.4', 'همین نقشه، این بار با معنای همهٔ واژه‌ها.'),
    ],
  },
];

export const mapNodes: MapNode[] = mapZones.flatMap((z) => z.nodes);
export const mapNodeById = new Map(mapNodes.map((n) => [n.id, n]));

export const mapEdges: MapEdge[] = [
  { from: 'agent', to: 'tool-calling', label: 'می‌خواند' },
  { from: 'agent', to: 'memory', label: 'می‌نویسد' },
  { from: 'agent', to: 'skill', label: 'بارگذاری می‌کند' },
  { from: 'orchestrator', to: 'agent', label: 'می‌گرداند' },
  { from: 'rag', to: 'embedding', label: 'می‌سازد' },
  { from: 'rag', to: 'vector-database', label: 'می‌گردد' },
  { from: 'rag', to: 'context-window', label: 'پر می‌کند' },
  { from: 'system-prompt', to: 'context', label: 'بالای متن' },
  { from: 'tool-calling', to: 'context', label: 'متن ابزار' },
  { from: 'skill', to: 'context', label: 'دستورالعمل' },
  { from: 'memory', to: 'context', label: 'واقعیت‌ها' },
  { from: 'rag', to: 'context', label: 'سند' },
  { from: 'context', to: 'llm', label: 'می‌بیند' },
  { from: 'guardrail', to: 'prompt-injection', label: 'مهار می‌کند' },
  { from: 'eval', to: 'regression', label: 'پیدا می‌کند' },
  { from: 'caching', to: 'cost', label: 'کم می‌کند' },
];

export const zoneById = new Map(mapZones.map((z) => [z.id, z]));
