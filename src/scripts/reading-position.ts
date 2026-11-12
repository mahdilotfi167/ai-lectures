import { parseReadingPosition, readingHash, type ReadingPosition } from '../lib/reading-position';

function init() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>(
    '.book > .cover, .book > .part-divider, .book > .lesson',
  ));
  if (!sections.length) return;

  const storageKey = `ai-interactive:reading-position:v2:${window.location.pathname}`;
  const legacyKey = `ai-interactive:reading-position:v1:${window.location.pathname}`;
  let ready = false;
  let printing = false;
  let saveTimer: number | undefined;
  let latest: ReadingPosition | null = null;

  const read = (): ReadingPosition | null => {
    try {
      return parseReadingPosition(localStorage.getItem(storageKey)) ??
        parseReadingPosition(localStorage.getItem(legacyKey));
    } catch {
      // Storage can be unavailable for local files or when privacy settings block it.
      return null;
    }
  };

  const top = (element: HTMLElement) => element.getBoundingClientRect().top + window.scrollY;
  const points = (section: HTMLElement): HTMLElement[] => [
    section,
    ...Array.from(section.querySelector('.lesson__body')?.children ?? [])
      .filter((element): element is HTMLElement =>
        element instanceof HTMLElement && element.getClientRects().length > 0),
  ];
  const sectionEnd = (index: number) => sections[index + 1]
    ? top(sections[index + 1]) : document.documentElement.scrollHeight;

  const save = () => {
    window.clearTimeout(saveTimer);
    if (!ready || printing || window.matchMedia('print').matches) return;

    const y = Math.max(0, window.scrollY);
    let sectionIndex = 0;
    for (let i = 0; i < sections.length; i++) {
      if (top(sections[i]) > y + 1) break;
      sectionIndex = i;
    }
    const section = sections[sectionIndex];
    const stops = points(section);
    let point = 0;
    for (let i = 1; i < stops.length; i++) {
      if (top(stops[i]) > y + 1) break;
      point = i;
    }
    const start = top(stops[point]);
    const end = stops[point + 1] ? top(stops[point + 1]) : sectionEnd(sectionIndex);
    const position: ReadingPosition = {
      version: 2,
      section: section.id || null,
      point,
      fraction: Math.max(0, Math.min(1, (y - start) / Math.max(1, end - start))),
      scrollY: y,
      hash: readingHash(window.location.hash),
    };
    latest = position;
    try {
      localStorage.setItem(storageKey, JSON.stringify(position));
    } catch {
      // Reading and navigation must continue normally without persistent storage.
    }
  };

  const restore = (position: ReadingPosition) => {
    const sectionIndex = position.section === null ? 0 :
      sections.findIndex((section) => section.id === position.section);
    let y = 0;
    if (sectionIndex >= 0) {
      const stops = points(sections[sectionIndex]);
      const point = Math.min(position.point, stops.length - 1);
      const start = top(stops[point]);
      const end = stops[point + 1] ? top(stops[point + 1]) : sectionEnd(sectionIndex);
      y = start + position.fraction * Math.max(1, end - start);
    }
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: Math.min(maxY, Math.max(0, y)), behavior: 'instant' });
  };

  // Keep the same content point as responsive figures and text reflow. Saving
  // the old absolute scroll offset during resize would capture a different lesson.
  let resizeFrame = 0;
  let resizePosition: ReadingPosition | null = null;
  window.addEventListener('resize', () => {
    if (printing || window.matchMedia('print').matches || !latest) return;
    resizePosition ??= latest;
    ready = false;
    window.clearTimeout(saveTimer);
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = window.requestAnimationFrame(() => {
        if (resizePosition && readingHash(window.location.hash) === resizePosition.hash) restore(resizePosition);
        resizePosition = null;
        ready = true;
        save();
      });
    });
  });

  window.addEventListener('scroll', () => {
    if (!ready || printing) return;
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(save, 250);
  }, { passive: true });
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') save();
  });
  window.addEventListener('beforeprint', () => {
    save();
    printing = true;
  });
  window.addEventListener('afterprint', () => {
    window.requestAnimationFrame(() => { printing = false; });
  });

  const saved = read();
  const initialHash = window.location.hash;
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  // New links take priority. Refreshing the same link resumes the exact reading point.
  const resume = saved && (!initialHash ||
    (navigation?.type === 'reload' && readingHash(initialHash) === saved.hash));
  let interrupted = false;
  const pending = new AbortController();
  const interrupt = () => { interrupted = true; };
  for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown', 'hashchange']) {
    window.addEventListener(event, interrupt, { passive: true, signal: pending.signal });
  }

  const loaded = document.readyState === 'complete' ? Promise.resolve() :
    new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
  void Promise.all([loaded, document.fonts?.ready]).then(() => {
    // Wait for fonts and the interactive figures' initial layout before measuring.
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      pending.abort();
      if (resume && !interrupted && window.location.hash === initialHash) {
        restore(saved);
      }
      ready = true;
      save();
    }));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
