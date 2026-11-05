import { faNum } from '../lib/format';

type LabKey = 'sys' | 'mem' | 'tools' | 'skill' | 'doc';
type LabState = Record<LabKey, boolean>;

interface Preset {
  id: string;
  label: string;
  state: LabState;
}

function matches(when: Partial<LabState>, state: LabState): boolean {
  return Object.entries(when).every(([key, value]) => state[key as LabKey] === value);
}

function initLab(root: HTMLElement) {
  const toggles = Array.from(
    root.querySelectorAll<HTMLInputElement>('input[data-lab-toggle]'),
  );
  if (toggles.length === 0) return;

  const blocks = new Map<string, HTMLElement>();
  root.querySelectorAll<HTMLElement>('[data-block]').forEach((el) => {
    if (el.dataset.block) blocks.set(el.dataset.block, el);
  });

  const sentences = Array.from(
    root.querySelectorAll<HTMLElement>('[data-lab-sentence]'),
  );
  const tokenCount = root.querySelector<HTMLElement>('[data-lab-token-count]');
  const live = root.querySelector<HTMLElement>('[data-lab-live]');
  const defaultState = JSON.parse(root.dataset.labDefault ?? '{}') as LabState;
  const presets = JSON.parse(root.dataset.labPresets ?? '[]') as Preset[];

  const readState = (): LabState => {
    const state = { ...defaultState };
    toggles.forEach((toggle) => {
      const key = toggle.dataset.labToggle as LabKey;
      if (key) state[key] = toggle.checked;
    });
    return state;
  };

  const apply = (announce?: string) => {
    const state = readState();

    toggles.forEach((toggle) => {
      const blockId = toggle.dataset.labBlockId;
      if (!blockId) return;
      const block = blocks.get(blockId);
      if (block) block.hidden = !toggle.checked;
    });

    let total = 0;
    blocks.forEach((block) => {
      if (!block.hidden) total += Number(block.dataset.tokens ?? 0);
    });
    if (tokenCount) tokenCount.textContent = faNum(total);

    sentences.forEach((group) => {
      const variants = Array.from(
        group.querySelectorAll<HTMLElement>('[data-lab-variant]'),
      );
      let shown = false;
      variants.forEach((variant) => {
        if (shown) {
          variant.hidden = true;
          return;
        }
        let when: Partial<LabState> = {};
        try {
          when = JSON.parse(variant.dataset.when ?? '{}') as Partial<LabState>;
        } catch {
          when = {};
        }
        const match = matches(when, state);
        variant.hidden = !match;
        if (match) shown = true;
      });
      group.hidden = !shown;
      group.classList.toggle('is-off', !shown);
    });

    if (announce && live) live.textContent = announce;
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener('change', () => {
      const label =
        toggle.closest('.ctx-lab__toggle')?.querySelector('.ctx-lab__toggle-label')
          ?.textContent ?? '';
      apply(`${label} ${toggle.checked ? 'روشن' : 'خاموش'} شد. متن و پاسخ نمونه به‌روز شد.`);
    });
  });

  root.querySelectorAll<HTMLButtonElement>('[data-lab-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = presets.find((p) => p.id === button.dataset.labPreset);
      if (!preset) return;
      toggles.forEach((toggle) => {
        const key = toggle.dataset.labToggle as LabKey;
        if (key) toggle.checked = preset.state[key];
      });
      apply(`حالت «${button.textContent?.trim() ?? ''}» اعمال شد.`);
    });
  });

  root.querySelector<HTMLButtonElement>('[data-lab-reset]')?.addEventListener('click', () => {
    toggles.forEach((toggle) => {
      const key = toggle.dataset.labToggle as LabKey;
      if (key) toggle.checked = defaultState[key];
    });
    apply('به حالت اول بازگشت.');
  });

  apply();
}

function init() {
  document.querySelectorAll<HTMLElement>('[data-context-lab]').forEach(initLab);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
