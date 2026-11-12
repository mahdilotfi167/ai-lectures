import { terms } from './glossary';
import { parts, type ZoneId } from './lessons';

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

const termNode = (zone: ZoneId, t: (typeof terms)[number]): MapNode => {
  return {
    id: t.id,
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

const practicalNodes: MapNode[] = [
  conceptNode('practice', 'value', 'انتخاب کار', '3.1', 'کار محدود با نتیجهٔ قابل‌بررسی و اشتباه قابل‌جبران.'),
  conceptNode('practice', 'capability', 'انتخاب قابلیت', '3.2', 'قابلیت، دسترسی و اجازهٔ اجرا را جدا انتخاب کنید.'),
  conceptNode('practice', 'evidence', 'دیده‌ها و شواهد', '3.5', 'دسترسی به فایل، با خواندن و استفادهٔ درست از آن متفاوت است.'),
  conceptNode('practice', 'feedback', 'اصلاح گفت‌وگو', '3.6', 'فرض نادرست و چیزهایی را که نباید عوض شوند مشخص کنید.'),
  conceptNode('judgment', 'verification', 'بررسی نتیجه', '4.1', 'برای هر ادعا شاهدی متناسب با پیامد خطا بخواهید.'),
  conceptNode('judgment', 'recovery', 'توقف و بازیابی', '4.3', 'لغو اجرا لزوماً تغییرهای قبلی را برنمی‌گرداند.'),
  conceptNode('judgment', 'routines', 'روش قابل‌تکرار', '4.4', 'روش پایدار را از واقعیت متغیر جدا نگه دارید.'),
  conceptNode('systems', 'build-or-buy', 'استفاده تا ساخت', '6.11', 'از محصول آماده شروع کنید؛ مسئولیت هر اتصال و تغییر را بشناسید.'),
  conceptNode('systems', 'team', 'مسئولیت نگه‌داری', '6.11', 'مالک نتیجه، بازبین حوزه و مسئول دسترسی و پشتیبانی را مشخص کنید.'),
  conceptNode('systems', 'map', 'نقشهٔ کامل', '6.12', 'تصمیم‌های عملی و سازوکارهای فنی را به هم وصل کنید.'),
];

/** Group by actual introduction, not the historical technical classification. */
export const mapZones: MapZone[] = parts.map((part) => ({
  id: part.zone, label: part.title, part: part.part, color: `var(--part-${part.part})`,
  nodes: [
    ...terms.filter((term) => Number(term.not_before.split('.')[0]) === part.part)
      .map((term) => termNode(part.zone, term)),
    ...practicalNodes.filter((node) => node.zone === part.zone),
  ],
}));

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
