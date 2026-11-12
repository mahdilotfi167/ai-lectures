/** Published v1 identities. Never reinterpret these numbers as the current syllabus. */
export const legacyLessons: Record<string, string> = {
  '1.1': 'what-ai-does-today', '1.2': 'three-layers', '1.3': 'the-running-example',
  '2.1': 'from-chatbot-to-agent', '2.2': 'tools', '2.3': 'mcp-standard-socket',
  '2.4': 'skills', '2.5': 'memory', '2.6': 'workflow-or-agent',
  '2.7': 'coding-agents', '2.8': 'agent-anatomy',
  '3.1': 'next-word-prediction', '3.2': 'tokens', '3.3': 'context-window',
  '3.4': 'how-models-are-built', '3.5': 'hallucination', '3.6': 'model-weaknesses',
  '3.7': 'reasoning-and-tradeoffs', '4.1': 'api-call-anatomy', '4.2': 'prompts',
  '4.3': 'context-engineering', '4.4': 'rag', '4.5': 'finetune-or-rag', '4.6': 'evaluation',
  '4.7': 'production-architecture', '5.1': 'production-architecture', '5.2': 'cost',
  '5.3': 'security', '5.4': 'reliability', '6.1': 'where-value-is',
  '6.2': 'build-or-buy', '6.3': 'build-or-buy', '6.4': 'the-map-again',
};

export const legacyLensHosts: Record<string, string> = {
  'text-loop': '1.2', slots: '1.3', 'tool-call': '2.2', 'mcp-fills-tools': '2.3',
  'skill-loading': '2.4', 'memory-facts': '2.5', 'tests-as-text': '2.7',
  'anatomy-recap': '2.8', 'context-fills': '3.3', 'learned-vs-given': '3.4',
  'no-fact-fluent-guess': '3.5', 'thinking-text': '3.7', 'messages-array': '4.1',
  lab: '4.3', 'rag-paste': '4.4', 'where-it-changes': '4.5',
  'who-writes-what': '5.1', 'cache-prefix': '5.2', injection: '5.3',
  'read-the-trace': '5.4', recap: '6.4',
};

export const legacyParts: Record<string, string> = {
  'part-1': 'part-overview', 'part-2': 'part-agents', 'part-3': 'part-model',
  'part-4': 'part-systems', 'part-5': 'part-systems', 'part-6': 'part-practice',
};

export const legacyAnchors: Record<string, string> = { ...legacyParts };
for (const [number, slug] of Object.entries(legacyLessons)) {
  const suffix = number.replace('.', '-');
  legacyAnchors[`lesson-${suffix}`] = `lesson-${slug}`;
  // Consolidated primary figures resolve to the surviving lesson's figure.
  if (number !== '6.4') legacyAnchors[`fig-${suffix}`] = `fig-${slug}`;
}
for (const number of Object.values(legacyLensHosts)) {
  legacyAnchors[`fig-${number.replace('.', '-')}-ctx`] = `fig-${legacyLessons[number]}-ctx`;
}

export const aliasesFor = (canonical: string): string[] =>
  Object.entries(legacyAnchors).filter(([, target]) => target === canonical).map(([alias]) => alias);

export const canonicalAnchor = (anchor: string): string =>
  Object.hasOwn(legacyAnchors, anchor) ? legacyAnchors[anchor] : anchor;
