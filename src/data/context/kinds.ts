import type { Author, KindId } from './types';

export interface AuthorDef {
  label: string;
  icon: string;
}

/** Every author also has a distinct rail pattern; see context.css. */
export const authors: Record<Author, AuthorDef> = {
  developer: { label: 'برنامه‌نویس', icon: 'document' },
  user: { label: 'کاربر', icon: 'user' },
  model: { label: 'مدل', icon: 'model' },
  tool: { label: 'ابزار', icon: 'tool' },
  store: { label: 'انبار', icon: 'database' },
  attacker: { label: 'مهاجم', icon: 'alert' },
};

export interface KindDef {
  id: KindId;
  /** role tag shown in the block header (Latin, LTR) */
  role: string;
  label: string;
  author: Author;
  /** a kind may not appear before this lesson */
  introducedIn: string;
  format: 'prose' | 'json' | 'list' | 'auto';
}

export const kinds: Record<KindId, KindDef> = {
  system: { id: 'system', role: 'system', label: 'دستور سیستم', author: 'developer', introducedIn: '1.3', format: 'prose' },
  user: { id: 'user', role: 'user', label: 'پیام کاربر', author: 'user', introducedIn: '1.3', format: 'prose' },
  assistant: { id: 'assistant', role: 'assistant', label: 'پاسخ مدل', author: 'model', introducedIn: '1.3', format: 'prose' },
  tools: { id: 'tools', role: 'tools', label: 'فهرست ابزارها', author: 'developer', introducedIn: '2.2', format: 'json' },
  tool_call: { id: 'tool_call', role: 'tool_call', label: 'درخواست ابزار', author: 'model', introducedIn: '2.2', format: 'json' },
  tool_result: { id: 'tool_result', role: 'tool_result', label: 'نتیجهٔ ابزار', author: 'tool', introducedIn: '2.2', format: 'auto' },
  skill_menu: { id: 'skill_menu', role: 'skill', label: 'مهارت‌ها (فهرست)', author: 'developer', introducedIn: '2.4', format: 'prose' },
  skill: { id: 'skill', role: 'skill', label: 'مهارت', author: 'developer', introducedIn: '2.4', format: 'list' },
  memory: { id: 'memory', role: 'memory', label: 'حافظه', author: 'store', introducedIn: '2.5', format: 'list' },
  history: { id: 'history', role: 'history', label: 'تاریخچه', author: 'user', introducedIn: '2.5', format: 'prose' },
  summary: { id: 'summary', role: 'summary', label: 'خلاصه', author: 'model', introducedIn: '3.3', format: 'prose' },
  thinking: { id: 'thinking', role: 'thinking', label: 'متن استدلال', author: 'model', introducedIn: '3.7', format: 'prose' },
  retrieved: { id: 'retrieved', role: 'retrieved', label: 'سند بازیابی‌شده', author: 'store', introducedIn: '4.4', format: 'prose' },
  injected: { id: 'injected', role: 'retrieved', label: 'متن مخرب', author: 'attacker', introducedIn: '5.3', format: 'prose' },
};

export const kindById = new Map((Object.values(kinds) as KindDef[]).map((k) => [k.id, k]));
