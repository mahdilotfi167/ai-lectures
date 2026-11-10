import { faNum } from '../lib/format';

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  const show = (index: number, announce: boolean) => {
    current = Math.max(0, Math.min(frames.length - 1, index));
    frames.forEach((frame, i) => {
      const active = i === current;
      frame.classList.toggle('is-active', active);
      if (staticMode) frame.removeAttribute('aria-hidden');
      else if (active) frame.removeAttribute('aria-hidden');
      else frame.setAttribute('aria-hidden', 'true');
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
    initStepper(root);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
