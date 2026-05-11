/** wiremd Editor - Toolbar & Controls */

import { examples, type Example } from './examples.js';

const toastTimers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();

export function initToolbar(opts: {
  examplesContainer: HTMLElement;
  styleSelect: HTMLSelectElement;
  tabs: HTMLElement;
  copyBtn: HTMLButtonElement;
  copyLinkBtn: HTMLButtonElement;
  onExampleSelect: (example: Example) => void;
  onStyleChange: (style: string) => void;
  onTabChange: (tab: 'preview' | 'html') => void;
  onCopy: () => void;
  onCopyLink: () => void;
}) {
  // --- Examples dropdown ---
  const dropdownBtn = document.createElement('button');
  dropdownBtn.className = 'ed-btn';
  dropdownBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
    Examples
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:10px;height:10px;">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  `;
  opts.examplesContainer.appendChild(dropdownBtn);

  const menu = document.createElement('div');
  menu.className = 'ed-dropdown__menu';

  examples.forEach((ex) => {
    const item = document.createElement('button');
    item.className = 'ed-dropdown__item';
    item.innerHTML = `${ex.name}<span class="ed-dropdown__item-desc">${ex.description}</span>`;
    item.addEventListener('click', () => {
      opts.onExampleSelect(ex);
      menu.classList.remove('ed-dropdown__menu--open');
    });
    menu.appendChild(item);
  });

  opts.examplesContainer.appendChild(menu);

  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('ed-dropdown__menu--open');
  });

  document.addEventListener('click', () => {
    menu.classList.remove('ed-dropdown__menu--open');
  });

  // --- Style selector ---
  opts.styleSelect.addEventListener('change', () => {
    opts.onStyleChange(opts.styleSelect.value);
  });

  // --- Tabs ---
  const tabButtons = opts.tabs.querySelectorAll<HTMLButtonElement>('.ed-tab');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('ed-tab--active'));
      btn.classList.add('ed-tab--active');
      const tab = btn.dataset.tab as 'preview' | 'html';
      opts.onTabChange(tab);
    });
  });

  // --- Copy button ---
  opts.copyBtn.addEventListener('click', () => {
    opts.onCopy();
  });

  // --- Copy link button ---
  opts.copyLinkBtn.addEventListener('click', () => {
    opts.onCopyLink();
  });
}

/** Show a toast notification */
export function showToast(toastEl: HTMLElement, message?: string) {
  if (message) toastEl.textContent = message;
  const activeTimer = toastTimers.get(toastEl);
  if (activeTimer) clearTimeout(activeTimer);
  toastEl.classList.add('ed-toast--visible');
  const timer = setTimeout(() => {
    toastEl.classList.remove('ed-toast--visible');
  }, 2000);
  toastTimers.set(toastEl, timer);
}
