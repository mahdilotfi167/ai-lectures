const FA = '۰۱۲۳۴۵۶۷۸۹';
const toFa = (value: string | number) => String(value).replace(/[0-9]/g, (d) => FA[Number(d)]);

/* ---------- Concept map: click / keyboard ---------- */
function initConceptMap() {
  document.querySelectorAll<HTMLElement>('[data-map-clickable="true"]').forEach((root) => {
    const detail = root.querySelector<HTMLElement>('[data-map-detail]');
    if (!detail) return;

    const show = (el: HTMLElement) => {
      const label = el.dataset.label ?? el.textContent?.trim() ?? '';
      const def = el.dataset.def ?? '';
      const lesson = el.dataset.lesson ?? '';
      detail.textContent = '';
      const strong = document.createElement('strong');
      strong.textContent = label;
      detail.append(strong, document.createTextNode(` — ${def} `));
      const badge = document.createElement('span');
      badge.className = 'fig-badge';
      badge.textContent = `درس ${toFa(lesson)}`;
      detail.append(badge);
    };

    root.querySelectorAll<HTMLElement>('[data-node]').forEach((el) => {
      el.addEventListener('click', () => show(el));
      el.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          show(el);
        }
      });
    });
  });
}

/* ---------- Probability bars: temperature ---------- */
function initProbability() {
  document.querySelectorAll<HTMLElement>('[data-role="prob-temp"]').forEach((slider) => {
    const figure = slider.closest<HTMLElement>('.figure');
    const live = figure?.querySelector<HTMLElement>('[data-role="prob-live"]');
    if (!live) return;
    const rows = Array.from(live.querySelectorAll<HTMLElement>('[data-p]'));
    const choice = figure?.querySelector<HTMLElement>('[data-role="prob-choice"]');
    const output = figure?.querySelector<HTMLElement>('[data-role="prob-temp-output"]');
    const liveText = figure?.querySelector<HTMLElement>('[data-role="prob-live-text"]');

    const update = () => {
      const t = Number((slider as HTMLInputElement).value);
      const probs = rows.map((row) => Number(row.dataset.p ?? 0) ** (1 / Math.max(0.1, t)));
      const sum = probs.reduce((a, b) => a + b, 0) || 1;
      const normalized = probs.map((p) => p / sum);
      const chosen =
        t < 0.9 ? 0 : t < 1.3 ? Math.min(1, rows.length - 1) : Math.min(2, rows.length - 1);

      rows.forEach((row, i) => {
        const fill = row.querySelector<HTMLElement>('.fig-prob__fill');
        if (fill) fill.style.width = `${Math.max(2, Math.round(normalized[i] * 100))}%`;
        row.classList.toggle('is-chosen', i === chosen);
      });

      if (choice) choice.textContent = rows[chosen]?.dataset.token?.trim() || '—';
      if (output) output.textContent = toFa(t.toFixed(1)).replace('.', '٫');
      if (liveText) {
        liveText.textContent =
          t < 0.9
            ? 'تنوع کم: مدل تقریباً همیشه محتمل‌ترین گزینه را انتخاب می‌کند.'
            : t < 1.3
              ? 'تنوع متوسط: گزینه‌های نزدیک هم شانس بیشتری می‌گیرند.'
              : 'تنوع زیاد: گزینه‌های کم‌احتمال‌تر هم انتخاب می‌شوند؛ خروجی غیرقابل‌پیش‌بینی‌تر می‌شود.';
      }
    };

    slider.addEventListener('input', update);
    update();
  });
}

/* ---------- Stacked bar: document size ---------- */
function initStackedBar() {
  document.querySelectorAll<HTMLElement>('[data-stacked-bar]').forEach((root) => {
    const figure = root.closest<HTMLElement>('.figure');
    const slider = figure?.querySelector<HTMLInputElement>('[data-role="docs-slider"]');
    if (!slider) return;
    const bar = root.querySelector<HTMLElement>('[data-role="bar"]');
    const barOuter = root.querySelector<HTMLElement>('[data-role="bar-outer"]');
    const ghost = root.querySelector<HTMLElement>('[data-role="ghost"]');
    const usedOut = root.querySelector<HTMLElement>('[data-role="used"]');
    const overflowOut = root.querySelector<HTMLElement>('[data-role="overflow"]');
    const docsOut = figure?.querySelector<HTMLElement>('[data-role="docs-output"]');
    const live = figure?.querySelector<HTMLElement>('[data-role="live"]');
    const capacity = Number(root.dataset.capacity ?? 8000);

    const segments = Array.from(root.querySelectorAll<HTMLElement>('[data-kind]'));
    const base = new Map<string, number>();
    for (const segment of segments) {
      base.set(segment.dataset.kind ?? '', Number(segment.dataset.tokens ?? 0));
    }

    const update = () => {
      const docsWanted = Number(slider.value);
      let system = base.get('system') ?? 0;
      let history = base.get('history') ?? 0;
      let question = base.get('question') ?? 0;
      let docs = docsWanted;

      const total = system + history + docs + question;
      let overflow = Math.max(0, total - capacity);
      const cutHistory = Math.min(history, overflow);
      history -= cutHistory;
      overflow -= cutHistory;
      const cutDocs = Math.min(docs, overflow);
      docs -= cutDocs;
      overflow -= cutDocs;
      const used = system + history + docs + question;
      const outside = Math.max(0, total - capacity);

      const values: Record<string, number> = { system, history, docs, question };
      for (const segment of segments) {
        const kind = segment.dataset.kind ?? '';
        segment.style.width = `${Math.min(100, (values[kind] ?? 0) / capacity * 100)}%`;
      }

      if (bar && ghost) {
        const outer = capacity + outside;
        bar.style.width = `${(capacity / outer) * 100}%`;
        ghost.style.width = `${(outside / outer) * 100}%`;
        ghost.hidden = outside === 0;
        ghost.textContent = outside > 0 ? `بیرون‌افتاده · ${toFa(outside)}` : '';
      }

      if (usedOut) usedOut.textContent = toFa(used);
      if (docsOut) docsOut.textContent = `${toFa(docsWanted)} توکن`;
      if (overflowOut) {
        overflowOut.textContent =
          outside > 0 ? `بیرون‌افتاده: ${toFa(outside)}` : 'همه‌چیز جا می‌شود';
        overflowOut.classList.toggle('is-over', outside > 0);
      }
      if (live) {
        live.textContent =
          cutHistory > 0
            ? 'قدیمی‌ترین بخش تاریخچه از پنجره بیرون افتاد؛ مدل دیگر آن را نمی‌بیند.'
            : 'هنوز جا هست؛ با بزرگ‌ترکردن اسناد، تاریخچه کمکم از پنجره بیرون می‌رود.';
      }
    };

    slider.addEventListener('input', update);
    update();
  });
}

/* ---------- Token strip: approximate tokenizer ---------- */
function initTokenStrip() {
  document.querySelectorAll<HTMLElement>('[data-token-strip]').forEach((root) => {
    const figure = root.closest<HTMLElement>('.figure');
    const input = figure?.querySelector<HTMLInputElement>('[data-role="token-input"]');
    const chips = root.querySelector<HTMLElement>('[data-role="live-chips"]');
    const count = root.querySelector<HTMLElement>('[data-role="live-count"]');
    if (!input || !chips || !count) return;

    const tokenize = (text: string): string[] => {
      const parts = text.split(/(\s+|[.,!?؟،؛:«»()\[\]{}"']+)/).filter(Boolean);
      const tokens: string[] = [];
      const prefixes = ['نمی', 'می', 'بی', 'هم'];
      const suffixes = ['هایم', 'هایت', 'هایش', 'هایمان', 'هایتان', 'هایشان', 'های', 'ها', 'ام', 'ات', 'اش', 'مان', 'تان', 'شان', 'یم', 'ید', 'ند', 'م', 'ی', 'د'];
      for (const part of parts) {
        if (/^\s+$/.test(part)) {
          tokens.push(' ');
          continue;
        }
        if (/^[.,!?؟،؛:«»()\[\]{}"']+$/.test(part)) {
          tokens.push(part);
          continue;
        }
        let word = part;
        for (const prefix of prefixes) {
          if (word.startsWith(prefix) && word.length > prefix.length + 1) {
            tokens.push(prefix);
            word = word.slice(prefix.length);
            break;
          }
        }
        let changed = true;
        while (changed) {
          changed = false;
          for (const suffix of suffixes) {
            if (word.endsWith(suffix) && word.length > suffix.length + 2) {
              tokens.push(word.slice(0, -suffix.length));
              tokens.push(suffix);
              word = '';
              changed = false;
              break;
            }
          }
        }
        if (word) tokens.push(word);
      }
      return tokens;
    };

    const update = () => {
      const text = input.value.slice(0, 80);
      const tokens = tokenize(text);
      chips.textContent = '';
      if (!tokens.length) {
        const empty = document.createElement('span');
        empty.className = 'fig-token';
        empty.textContent = 'اینجا تایپ کنید…';
        chips.append(empty);
        count.textContent = '۰ توکن';
        return;
      }
      for (const token of tokens) {
        const span = document.createElement('span');
        span.className = token === ' ' ? 'fig-token fig-token--space' : 'fig-token';
        span.textContent = token === ' ' ? '·' : token;
        chips.append(span);
      }
      const real = tokens.filter((t) => t.trim() !== '').length;
      count.textContent = `${toFa(real)} توکن`;
    };

    input.addEventListener('input', update);
    update();
  });
}

/* ---------- Branch diagram ---------- */
function initBranch() {
  document.querySelectorAll<HTMLElement>('[data-branch-diagram]').forEach((root) => {
    const figure = root.closest<HTMLElement>('.figure');
    const variant = root.dataset.variant ?? 'workflow';
    const toggles = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-criterion]'));
    const branches = Array.from(root.querySelectorAll<HTMLElement>('[data-branch]'));
    const reset = figure?.querySelector<HTMLButtonElement>('[data-role="branch-reset"]');
    const readout = figure?.querySelector<HTMLElement>('[data-role="branch-readout"]');
    if (!toggles.length || !branches.length) return;

    const state = new Array(toggles.length).fill(false);

    const apply = () => {
      let active = 0;
      if (variant === 'workflow') {
        active = state.some(Boolean) ? 0 : 1;
      } else {
        const fast = state[3];
        const differentiating = state[0];
        const uniqueData = state[1];
        const skills = state[2];
        if (fast || !differentiating) active = 0;
        else if (uniqueData && skills) active = 2;
        else active = 1;
      }

      branches.forEach((branch, i) => {
        branch.classList.toggle('is-active', i === active);
        branch.classList.toggle('is-dim', i !== active);
      });
      toggles.forEach((toggle, i) => {
        toggle.setAttribute('aria-pressed', state[i] ? 'true' : 'false');
      });
      if (readout) {
        readout.textContent = `گزینهٔ مناسب: ${branches[active]?.querySelector('.fig-outcome__label')?.textContent ?? ''}`;
      }
    };

    toggles.forEach((toggle, i) => {
      toggle.addEventListener('click', () => {
        state[i] = !state[i];
        apply();
      });
    });
    reset?.addEventListener('click', () => {
      state.fill(false);
      apply();
    });
    apply();
  });
}

/* ---------- Ladder ---------- */
function initLadder() {
  document.querySelectorAll<HTMLElement>('[data-ladder]').forEach((root) => {
    const figure = root.closest<HTMLElement>('.figure');
    const knowledge = figure?.querySelector<HTMLButtonElement>('[data-role="ladder-knowledge"]');
    const behavior = figure?.querySelector<HTMLButtonElement>('[data-role="ladder-behavior"]');
    const readout = figure?.querySelector<HTMLElement>('[data-role="ladder-readout"]');
    const rungs = Array.from(root.querySelectorAll<HTMLElement>('[data-rung]'));
    if (!knowledge || !behavior || !rungs.length) return;

    const apply = (index: number, message: string) => {
      rungs.forEach((rung, i) => {
        rung.classList.toggle('is-active', i === index);
        rung.classList.toggle('is-dim', i !== index);
        rung.querySelector('.fig-rung__marker')?.remove();
      });
      const target = rungs[index]?.querySelector('.fig-rung__label');
      if (target) {
        const marker = document.createElement('span');
        marker.className = 'fig-rung__marker';
        marker.textContent = 'شما اینجا';
        target.append(marker);
      }
      knowledge.setAttribute('aria-pressed', index === 2 ? 'true' : 'false');
      behavior.setAttribute('aria-pressed', index === 3 ? 'true' : 'false');
      if (readout) readout.textContent = message;
    };

    knowledge.addEventListener('click', () =>
      apply(2, 'برای دانش تازه یا متغیر، RAG مناسب‌تر است: سند درست را در زمینه بگذارید.'),
    );
    behavior.addEventListener('click', () =>
      apply(3, 'برای رفتار یا سبک ثابت، فاین‌تیونینگ می‌تواند کمک کند؛ اما اول ارزان‌ترین پله‌ها را امتحان کنید.'),
    );
  });
}

/* ---------- Cost calculator ---------- */
function initCost() {
  document.querySelectorAll<HTMLElement>('[data-cost-calculator]').forEach((root) => {
    const figure = root.closest<HTMLElement>('.figure');
    const requests = figure?.querySelector<HTMLInputElement>('[data-role="cost-requests"]');
    const tokens = figure?.querySelector<HTMLInputElement>('[data-role="cost-tokens"]');
    const cache = figure?.querySelector<HTMLInputElement>('[data-role="cost-cache"]');
    const tierButtons = Array.from(figure?.querySelectorAll<HTMLButtonElement>('[data-role="cost-tier"]') ?? []);
    if (!requests || !tokens || !cache) return;

    let inputPrice = 1;
    let outputPrice = 3;
    let tierId = root.dataset.tier ?? 'balanced';
    for (const button of tierButtons) {
      if (button.dataset.tier === tierId) {
        inputPrice = Number(button.dataset.inputPrice ?? 1);
        outputPrice = Number(button.dataset.outputPrice ?? 3);
      }
    }

    const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
    const set = (role: string, value: string) => {
      const el = figure?.querySelector<HTMLElement>(`[data-role="${role}"]`);
      if (el) el.textContent = value;
    };

    const update = () => {
      const req = Number(requests.value);
      const ctx = Number(tokens.value);
      const hit = Number(cache.value) / 100;
      const monthly = req * 30;
      const outputTokens = Math.round(ctx * 0.25);
      const inputCost = (monthly * ctx * (1 - hit * 0.8) * inputPrice) / 1_000_000;
      const outputCost = (monthly * outputTokens * outputPrice) / 1_000_000;
      const total = inputCost + outputCost;
      const saved = (monthly * ctx * hit * 0.8 * inputPrice) / 1_000_000;

      set('cost-total', money(total));
      set('cost-input', money(inputCost));
      set('cost-output', money(outputCost));
      set('cost-saved', money(saved));
      set('cost-requests-out', toFa(req));
      set('cost-tokens-out', toFa(ctx));
      set('cost-cache-out', `${toFa(cache.value)}٪`);

      const barInput = figure?.querySelector<HTMLElement>('[data-role="cost-bar-input"]');
      const barOutput = figure?.querySelector<HTMLElement>('[data-role="cost-bar-output"]');
      if (barInput && barOutput && total > 0) {
        barInput.style.width = `${(inputCost / total) * 100}%`;
        barOutput.style.width = `${(outputCost / total) * 100}%`;
      }
      tierButtons.forEach((button) => {
        button.setAttribute('aria-pressed', button.dataset.tier === tierId ? 'true' : 'false');
      });
    };

    requests.addEventListener('input', update);
    tokens.addEventListener('input', update);
    cache.addEventListener('input', update);
    tierButtons.forEach((button) => {
      button.addEventListener('click', () => {
        tierId = button.dataset.tier ?? tierId;
        inputPrice = Number(button.dataset.inputPrice ?? inputPrice);
        outputPrice = Number(button.dataset.outputPrice ?? outputPrice);
        update();
      });
    });
    update();
  });
}

function init() {
  initConceptMap();
  initProbability();
  initStackedBar();
  initTokenStrip();
  initBranch();
  initLadder();
  initCost();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
