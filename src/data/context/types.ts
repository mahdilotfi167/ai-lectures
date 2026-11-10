/** Shared types for the Context Lens data layer. */

export type Author = 'developer' | 'user' | 'model' | 'tool' | 'store' | 'attacker';

export type BlockState =
  | 'same'
  | 'new'
  | 'changed'
  | 'gone'
  | 'dim'
  | 'evicted'
  | 'danger'
  | 'ghost';

export type KindId =
  | 'system'
  | 'user'
  | 'assistant'
  | 'tools'
  | 'tool_call'
  | 'tool_result'
  | 'skill_menu'
  | 'skill'
  | 'memory'
  | 'history'
  | 'summary'
  | 'thinking'
  | 'retrieved'
  | 'injected';

export type LensMode = 'steps' | 'compare' | 'static' | 'mapping' | 'lab';

export interface BlockRef {
  /** id from blocks.ts */
  id: string;
  state?: BlockState;
  /** per-frame override; the canonical block text is used when omitted */
  text?: string;
  /** short callout under the block */
  note?: string;
  /** draw an edge divider labelled this BEFORE the block */
  edge?: string;
  /** small back-reference badge, e.g. "2.2" */
  lessonRef?: string;
  /** reusable-prefix marker, used by the caching lens */
  cached?: boolean;
  /** server-rendered hidden state, used by the Lab's default view */
  hidden?: boolean;
  /** Start a conversational turn before this user message, not a model call. */
  turnStart?: number;
}

export interface FrameOutput {
  text: string;
  /** Optional teaching label; otherwise the shared model-continuation label. */
  label?: string;
  tone?: 'normal' | 'ok' | 'danger';
  note?: string;
}

export interface Outside {
  icon: string;
  label: string;
  detail?: string;
  /** block id this outside action feeds */
  feeds?: string;
  tone?: 'normal' | 'ok' | 'danger';
}

export interface Frame {
  id: string;
  title: string;
  /** one sentence, <= 22 words, always visible */
  narration: string;
  actor?: 'harness' | 'model' | 'tool' | 'store';
  blocks: BlockRef[];
  /** Opt-in role names for the lessons explicitly teaching message order. */
  showMessageRoles?: boolean;
  /** Distinguish model input from a stored transcript after an answer. */
  tapeLabel?: string;
  output?: FrameOutput;
  outside?: Outside;
  meter?: { used: number; capacity?: number };
  /** edge divider AFTER all blocks */
  edge?: string;
  /** Mapping mode: JSON request messages or an explicitly labelled transcript. */
  messages?: string;
  messagesNote?: string;
  /** Mapping may show a saved transcript, not just an outgoing request. */
  messagesLabel?: string;
}

export interface Panel {
  label: string;
  blocks: BlockRef[];
  output?: FrameOutput;
  note?: string;
  /** number of leading blocks that form a reusable cached prefix */
  cachedPrefix?: number;
  /** shown as a chip above the tape when the comparison is about the model itself */
  modelLabel?: string;
}

export interface Slot {
  label: string;
  badge?: string;
}

export interface LensDef {
  key: string;
  lesson: string;
  mode: LensMode;
  title?: string;
  /** compare / static summary sentence */
  narration?: string;
  frames?: Frame[];
  panels?: [Panel, Panel];
  slots?: Slot[];
  compareNote?: string;
}
