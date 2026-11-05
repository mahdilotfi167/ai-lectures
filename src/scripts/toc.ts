const dialog = document.getElementById('toc-dialog') as HTMLDialogElement | null;
const openButton = document.getElementById('toc-open');
const closeButton = document.getElementById('toc-close');

let lastFocus: HTMLElement | null = null;

function open() {
  if (!dialog) return;
  lastFocus = document.activeElement as HTMLElement | null;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  closeButton?.focus();
}

function close() {
  if (!dialog) return;
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
  lastFocus?.focus();
}

openButton?.addEventListener('click', open);
closeButton?.addEventListener('click', close);

dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) close();
});

dialog?.addEventListener('close', () => {
  lastFocus?.focus();
});

dialog?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    close();
  });
});
