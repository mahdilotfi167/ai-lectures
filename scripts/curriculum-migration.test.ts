import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { lessons, parts, stages, lessonBySlug, compareLessonId } from '../src/data/lessons.ts';
import { aliasesFor, canonicalAnchor, legacyAnchors, legacyLessons, legacyLensHosts } from '../src/data/curriculum-migration.ts';
import { lessonAnchor, figNum, partAnchor } from '../src/lib/format.ts';
import { parseReadingPosition, readingHash } from '../src/lib/reading-position.ts';
import { lenses } from '../src/data/context/lenses.ts';
import { terms } from '../src/data/glossary.ts';
import { traceRefs } from '../src/data/context/traces.ts';

test('the three-stage syllabus contains 41 lessons in six consecutive Parts', () => {
  assert.equal(lessons.length, 41);
  assert.deepEqual(stages.map((stage) => stage.parts), [[1, 2], [3, 4], [5, 6]]);
  assert.deepEqual(parts.map((part) => lessons.filter((lesson) => lesson.part === part.part).length), [3, 7, 6, 6, 7, 12]);
  assert.deepEqual([...lessons].sort((a, b) => compareLessonId(a.id, b.id)), lessons);
  assert.equal(lessons.filter((lesson) => lesson.figure?.interactive).length, 7);
  assert.equal(new Set(lessons.map((lesson) => lesson.slug)).size, lessons.length);
});

test('published numeric links keep their content, not the newly reused display number', () => {
  assert.equal(Object.keys(legacyLessons).length, 33);
  for (const [number, slug] of Object.entries(legacyLessons)) {
    const current = lessonBySlug.get(slug);
    assert.ok(current, `missing destination for old lesson ${number}`);
    const alias = `lesson-${number.replace('.', '-')}`;
    assert.equal(canonicalAnchor(alias), lessonAnchor(current.id));
    assert.ok(aliasesFor(lessonAnchor(current.id)).includes(alias));
  }
  assert.equal(canonicalAnchor('lesson-3-1'), 'lesson-next-word-prediction');
  assert.equal(lessonAnchor('3.1'), 'lesson-where-value-is');
  assert.equal(canonicalAnchor('lesson-6-3'), lessonAnchor('6.11'));
  assert.equal(canonicalAnchor('fig-4-7'), 'fig-production-architecture');
});

test('primary and secondary figure numbers come from current metadata', () => {
  for (const lesson of lessons) {
    if (lesson.figure) assert.equal(figNum(lesson.figure.id), lesson.id);
    assert.equal(figNum(`fig-${lesson.slug}-ctx`), lesson.id);
  }
  assert.equal(figNum('fig-production-architecture'), '6.10');
  assert.equal(figNum('fig-the-map-again-ctx'), '6.12');
});

test('legacy aliases have existing, collision-free canonical destinations', () => {
  const anchors = new Set([
    ...lessons.map((lesson) => lessonAnchor(lesson.id)),
    ...lessons.flatMap((lesson) => lesson.figure ? [lesson.figure.id] : []),
    ...lenses.map((lens) => `fig-${lessons.find((lesson) => lesson.id === lens.lesson)!.slug}-ctx`),
    ...parts.map((part) => partAnchor(part.part)),
  ]);
  for (const [alias, target] of Object.entries(legacyAnchors)) {
    assert.ok(!anchors.has(alias), `${alias} collides`);
    assert.ok(anchors.has(target), `${alias} -> ${target} is missing`);
  }
});

test('20 Lens identities and the one prepared-input Lab survive migration', () => {
  assert.equal(lenses.filter((lens) => lens.mode !== 'lab').length, 20);
  assert.equal(lenses.filter((lens) => lens.mode === 'lab').length, 1);
  assert.deepEqual(Object.keys(legacyLensHosts).sort(), lenses.map((lens) => lens.key).sort());
  assert.equal(lenses.find((lens) => lens.key === 'lab')?.lesson, '6.2');
  assert.equal(lenses.find((lens) => lens.key === 'skill-loading')?.frames?.length, 5);
  assert.equal(lenses.find((lens) => lens.key === 'tests-as-text')?.frames?.length, 8);
  assert.equal(lenses.find((lens) => lens.key === 'injection')?.frames?.length, 5);
});

test('skill, failed test, retest and denial keep distinct ordered evidence', () => {
  assert.deepEqual(traceRefs('skill').map((ref) => ref.id), ['a.skill.read', 'skill.full']);
  assert.deepEqual(traceRefs('testFail', 'testPass').map((ref) => ref.id), ['a.test', 'test.fail', 'a.test.again', 'test.pass']);
  assert.deepEqual(traceRefs('denied').map((ref) => ref.id), ['a.badcall', 'r.denied']);
});

test('practical training/privacy and verification precede technical explanations', () => {
  const intro = Object.fromEntries(terms.map((term) => [term.id, term.not_before]));
  assert.equal(intro.training, '3.3');
  assert.equal(intro.hallucination, '4.1');
  assert.equal(intro['least-privilege'], '4.2');
  for (const term of ['api', 'rag', 'mcp', 'context-engineering']) assert.equal(Number(intro[term].split('.')[0]), 6);
  for (const lesson of lessons.filter((lesson) => lesson.part === 3 || lesson.part === 4)) {
    const body = readFileSync(new URL(`../src/content/lessons/${lesson.id.replace('.', '-')}-${lesson.slug}.mdx`, import.meta.url), 'utf8');
    assert.ok(!/<Aside\b|<ContextLab\b|<AnnotatedCode\b/.test(body), `${lesson.id} requires technical material`);
  }
});

const oldPosition = { version: 1, section: 'lesson-3-1', point: 7, fraction: 0.65, scrollY: 12345, hash: '#lesson-3-1' };

test('v1 saved position migrates to the same lesson beginning, not an unsafe child offset', () => {
  assert.deepEqual(parseReadingPosition(JSON.stringify(oldPosition)), {
    version: 2, section: 'lesson-next-word-prediction', point: 0, fraction: 0, scrollY: 0, hash: '#lesson-next-word-prediction',
  });
  assert.equal(parseReadingPosition(JSON.stringify({ ...oldPosition, section: 'part-3' }))?.section, 'part-model');
});

test('saved fragment identities migrate without changing incoming URL priority', () => {
  assert.equal(readingHash('#lesson-3-1'), '#lesson-next-word-prediction');
  assert.equal(readingHash('#fig-4-7'), '#fig-production-architecture');
  assert.equal(readingHash('#lesson-a-complete-task'), '#lesson-a-complete-task');
  assert.equal(readingHash(''), '');
  assert.notEqual(readingHash('#lesson-3-1'), readingHash('#lesson-share-safely'));
});

test('v2 saved positions retain exact offsets and malformed storage is ignored', () => {
  const value = { ...oldPosition, version: 2, section: 'lesson-next-word-prediction' };
  assert.deepEqual(parseReadingPosition(JSON.stringify(value)), value);
  for (const raw of [null, '', 'not json', '{}', JSON.stringify({ ...value, fraction: 2 }), JSON.stringify({ ...value, point: -1 }), JSON.stringify({ ...value, version: 3 })]) {
    assert.equal(parseReadingPosition(raw), null);
  }
});

test('the standalone takeaway collection matches every current lesson', () => {
  const takeaways = readFileSync(new URL('../docs/takeaways.md', import.meta.url), 'utf8');
  for (const lesson of lessons) {
    const body = readFileSync(new URL(`../src/content/lessons/${lesson.id.replace('.', '-')}-${lesson.slug}.mdx`, import.meta.url), 'utf8');
    const takeaway = body.match(/<Takeaway>([\s\S]*?)<\/Takeaway>/)?.[1];
    assert.ok(takeaway && takeaways.includes(takeaway), `stale takeaway for ${lesson.id}`);
    assert.ok(takeaways.includes(lesson.title), `stale title for ${lesson.id}`);
  }
});
