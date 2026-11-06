import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { lessons } from '../src/data/lessons.ts';

const dir = join(process.cwd(), 'src/content/lessons');
mkdirSync(dir, { recursive: true });

for (const lesson of lessons) {
  const n = lesson.id.split('.')[1];
  const file = join(dir, `${lesson.part}-${n}-${lesson.slug}.mdx`);
  if (existsSync(file)) continue;
  const terms = lesson.terms.length ? `[${lesson.terms.join(', ')}]` : '[]';
  const frontmatter = `---
id: "${lesson.id}"
part: ${lesson.part}
slug: ${lesson.slug}
title_fa: "${lesson.title}"
objective_fa: "${lesson.objective}"
${lesson.figure ? `figure:
  component: ${lesson.figure.component}
  id: ${lesson.figure.id}
  caption_fa: "${lesson.figure.caption}"
  interactive: ${lesson.figure.interactive}
` : ''}terms_introduced: ${terms}
example: ${lesson.example}
words: ${lesson.words}
has_aside: ${lesson.hasAside}
status: confirmed
---
`;
  const body = `
یک پاراگراف مقدماتی که مسئله را می‌سازد.

${lesson.figure ? '<div class="figure-placeholder">شکل این درس در حال ساخت است.</div>' : ''}

<Takeaway>جملهٔ پایانی این درس.</Takeaway>
`;
  writeFileSync(file, frontmatter + body, 'utf8');
  console.log('created', file);
}
