import { faNum } from '../lib/format';

const dialog = document.getElementById('toc-dialog') as HTMLDialogElement | null;
const openButtons = Array.from(document.querySelectorAll<HTMLElement>('[data-toc-open]'));
const closeButton = document.getElementById('toc-close');
const search = dialog?.querySelector<HTMLInputElement>('#toc-search');
const reset = dialog?.querySelector<HTMLButtonElement>('[data-toc-reset]');
const status = dialog?.querySelector<HTMLElement>('[data-toc-status]');
const empty = dialog?.querySelector<HTMLElement>('[data-toc-empty]');
const body = dialog?.querySelector<HTMLElement>('.toc-dialog__body');
const zones = Array.from(dialog?.querySelectorAll<HTMLElement>('[data-toc-zone]') ?? []);

let lastFocus: HTMLElement | null = null;
let restoreFocus = true;

const normalize = (value: string): string =>
  value.normalize('NFKC')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[ًٌٍَُِّْٰـ]/g, '')
    .replace(/\u200c/g, ' ')
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

function filter(announce = true) {
  const query = normalize(search?.value ?? '');
  if (dialog) dialog.dataset.filtered = String(Boolean(query));
  let count = 0;
  for (const zone of zones) {
    const zoneMatches = normalize(zone.dataset.search ?? '').includes(query);
    const entries = Array.from(zone.querySelectorAll<HTMLElement>('[data-toc-entry]'));
    for (const entry of entries) {
      entry.hidden = !zoneMatches && !normalize(entry.dataset.search ?? '').includes(query);
      if (!entry.hidden) count += 1;
    }
    zone.dataset.resultCount = String(entries.filter((entry) => !entry.hidden).length);
    zone.hidden = entries.every((entry) => entry.hidden);
    for (const heading of zone.querySelectorAll<HTMLElement>('[data-toc-cluster]')) {
      heading.hidden = entries.filter((entry) => entry.dataset.cluster === heading.dataset.tocCluster)
        .every((entry) => entry.hidden);
    }
    const concepts = zone.querySelector<HTMLElement>('[data-toc-concepts]');
    if (concepts) {
      concepts.hidden = Array.from(concepts.querySelectorAll<HTMLElement>('[data-toc-entry]'))
        .every((entry) => entry.hidden);
    }
  }
  if (empty) empty.hidden = count !== 0;
  if (reset) reset.hidden = !query;
  if (announce && status) status.textContent = query ? `${faNum(count)} نتیجه پیدا شد.` : '';
  if (body) body.scrollTop = 0;
}

function open() {
  if (!dialog || dialog.open) return;
  lastFocus = document.activeElement as HTMLElement | null;
  restoreFocus = true;
  if (search) search.value = '';
  filter(false);
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  document.documentElement.classList.add('toc-is-open');
  openButtons.forEach((button) => button.setAttribute('aria-expanded', 'true'));
  search?.focus({ preventScroll: true });
  const current = dialog.querySelector<HTMLElement>('.toc-zone[data-current="true"]');
  if (body) body.scrollTop = current ? current.offsetTop - body.offsetTop : 0;
}

function finishClose() {
  document.documentElement.classList.remove('toc-is-open');
  openButtons.forEach((button) => button.setAttribute('aria-expanded', 'false'));
  if (restoreFocus) lastFocus?.focus({ preventScroll: true });
}

function close(restore = true) {
  if (!dialog) return;
  restoreFocus = restore;
  if (typeof dialog.close === 'function') dialog.close();
  else {
    dialog.removeAttribute('open');
    finishClose();
  }
  document.documentElement.classList.remove('toc-is-open');
  openButtons.forEach((button) => button.setAttribute('aria-expanded', 'false'));
}

openButtons.forEach((button) => button.addEventListener('click', (event) => {
  event.preventDefault();
  open();
}));
closeButton?.addEventListener('click', () => close());
search?.addEventListener('input', () => filter());
reset?.addEventListener('click', () => {
  if (search) search.value = '';
  filter();
  search?.focus();
});

dialog?.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom) close();
});

dialog?.addEventListener('close', finishClose);

dialog?.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
    'a[href], button, input, select, textarea, [tabindex]',
  )).filter((element) => element.tabIndex >= 0 && !element.hasAttribute('disabled') &&
    element.getClientRects().length > 0);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

dialog?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.hash.slice(1));
    close(false);
    if (target) {
      if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
      target.focus({ preventScroll: true });
    }
  });
});
