import { faNum } from '../lib/format';

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initRawView(root: HTMLElement) {
  const button = root.querySelector<HTMLButtonElement>('[data-raw-toggle]');
  if (!button) return;
  button.addEventListener('click', () => {
    const on = root.classList.toggle('is-raw');
    button.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function initPredict(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-predict]').forEach((predict) => {
    const buttons = Array.from(
      predict.querySelectorAll<HTMLButtonElement>('[data-predict-option]'),
    );
    const answer = predict.querySelector<HTMLElement>('[data-predict-answer]');
    if (!answer) return;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        if (predict.classList.contains('is-answered')) return;
        predict.classList.add('is-answered');
        const correct = button.dataset.correct === 'true';
        const why = button.dataset.why ?? '';
        const correctButton = buttons.find((b) => b.dataset.correct === 'true');
        buttons.forEach((b) => {
          b.disabled = true;
        });
        const live = root.querySelector<HTMLElement>('[data-ctx-live]');
        if (correct) {
          answer.innerHTML = `<p><strong>درست.</strong> ${escapeHtml(why)}</p>`;
          if (live) live.textContent = `درست. ${why}`;
        } else {
          const correctText = correctButton?.textContent?.trim() ?? '';
          const correctWhy = correctButton?.dataset.why ?? '';
          answer.innerHTML = `<p><strong>نه، چون…</strong> ${escapeHtml(why)}</p><p><strong>پاسخ درست:</strong> ${escapeHtml(
            correctText,
          )} — ${escapeHtml(correctWhy)}</p>`;
          if (live) live.textContent = `نه، چون… ${why} پاسخ درست: ${correctText}`;
        }
      });
    });
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function typeOutput(frame: HTMLElement, timers: number[]) {
  const el = frame.querySelector<HTMLElement>('[data-typed="true"]');
  if (!el || el.dataset.typedDone === 'true') return;
  if (reduceMotion()) {
    el.dataset.typedDone = 'true';
    return;
  }
  const text = el.textContent ?? '';
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return;
  el.dataset.typedDone = 'true';
  el.textContent = '';
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'ctx-word';
    span.textContent = word;
    el.appendChild(span);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    const delay = 320 + i * 70;
    const timer = window.setTimeout(() => span.classList.add('is-on'), delay);
    timers.push(timer);
  });
}

function initStepper(root: HTMLElement) {
  const frames = Array.from(root.querySelectorAll<HTMLElement>('.ctx-frame'));
  const stepper = root.querySelector<HTMLElement>('[data-stepper]');
  if (frames.length === 0 || !stepper) return;

  const prev = stepper.querySelector<HTMLButtonElement>('[data-prev]');
  const next = stepper.querySelector<HTMLButtonElement>('[data-next]');
  const label = stepper.querySelector<HTMLElement>('[data-step-label]');
  const live = root.querySelector<HTMLElement>('[data-ctx-live]');
  const staticMode = reduceMotion();
  let current = 0;
  let timers: number[] = [];

  const show = (index: number, announce: boolean) => {
    current = Math.max(0, Math.min(frames.length - 1, index));
    timers.forEach((t) => window.clearTimeout(t));
    timers = [];
    frames.forEach((frame, i) => {
      const active = i === current;
      frame.classList.toggle('is-active', active);
      if (staticMode) frame.removeAttribute('aria-hidden');
      else if (active) frame.removeAttribute('aria-hidden');
      else frame.setAttribute('aria-hidden', 'true');
      if (active) typeOutput(frame, timers);
    });
    if (label) label.textContent = `گام ${faNum(current + 1)} از ${faNum(frames.length)}`;
    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current === frames.length - 1;
    if (announce && live) {
      const narration = frames[current].querySelector('.ctx-frame__head p')?.textContent ?? '';
      const title = frames[current].querySelector('.ctx-frame__head h4')?.textContent ?? '';
      live.textContent = `گام ${faNum(current + 1)} از ${faNum(frames.length)}: ${title}. ${narration}`;
    }
  };

  prev?.addEventListener('click', () => show(current - 1, true));
  next?.addEventListener('click', () => show(current + 1, true));
  show(0, false);
}

function init() {
  document.querySelectorAll<HTMLElement>('[data-context-lens]').forEach((root) => {
    initRawView(root);
    initPredict(root);
    initStepper(root);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
