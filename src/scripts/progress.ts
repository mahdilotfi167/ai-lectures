interface PartRange {
  part: number;
  top: number;
  bottom: number;
  segment: HTMLElement | null;
}

let ranges: PartRange[] = [];
let lessonTops: { id: string; top: number }[] = [];
let ticking = false;

function measure() {
  const parts = Array.from(document.querySelectorAll<HTMLElement>('[id^="part-"]')).filter(
    (el) => /^part-\d+$/.test(el.id),
  );
  ranges = parts.map((el, index) => {
    const next = parts[index + 1];
    return {
      part: Number(el.id.replace('part-', '')),
      top: el.getBoundingClientRect().top + window.scrollY,
      bottom: next
        ? next.getBoundingClientRect().top + window.scrollY
        : document.documentElement.scrollHeight,
      segment: document.querySelector<HTMLElement>(`.rail__seg[data-part="${el.id.replace('part-', '')}"]`),
    };
  });

  lessonTops = Array.from(document.querySelectorAll<HTMLElement>('.lesson')).map((el) => ({
    id: el.id.replace('lesson-', '').replace('-', '.'),
    top: el.getBoundingClientRect().top + window.scrollY,
  }));
}

function update() {
  ticking = false;
  const y = window.scrollY + window.innerHeight * 0.28;

  for (const range of ranges) {
    const span = Math.max(1, range.bottom - range.top);
    const progress = Math.max(0, Math.min(1, (y - range.top) / span));
    range.segment?.style.setProperty('--fill', `${(progress * 100).toFixed(1)}%`);
  }

  let current: string | null = null;
  for (const lesson of lessonTops) {
    if (lesson.top <= y) current = lesson.id;
    else break;
  }

  const links = document.querySelectorAll<HTMLElement>('[data-toc-lesson]');
  for (const link of links) {
    if (link.dataset.tocLesson === current) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  }
}

function onScroll() {
  if (!ticking) {
    ticking = true;
    window.requestAnimationFrame(update);
  }
}

function init() {
  measure();
  update();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    measure();
    update();
  });

  for (const button of document.querySelectorAll<HTMLButtonElement>('.rail__seg')) {
    button.addEventListener('click', () => {
      const part = button.dataset.part;
      const target = document.getElementById(`part-${part}`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      measure();
      update();
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
