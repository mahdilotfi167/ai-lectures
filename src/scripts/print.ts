let closed: HTMLDetailsElement[] = [];

window.addEventListener('beforeprint', () => {
  closed = Array.from(document.querySelectorAll<HTMLDetailsElement>('details:not([open])'));
  for (const details of closed) details.open = true;
});

window.addEventListener('afterprint', () => {
  for (const details of closed) details.open = false;
  closed = [];
});
