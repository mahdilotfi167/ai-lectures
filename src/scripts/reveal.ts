const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

if (prefersReduced) {
  for (const el of elements) el.setAttribute('data-visible', 'true');
} else if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-visible', 'true');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.25, rootMargin: '0px 0px -8% 0px' },
  );
  for (const el of elements) observer.observe(el);
} else {
  for (const el of elements) el.setAttribute('data-visible', 'true');
}
