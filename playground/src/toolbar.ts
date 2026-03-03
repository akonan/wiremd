/** wiremd Playground - Toolbar & Controls */

import { examples, type Example } from './examples.js';

export function initToolbar(opts: {
  headerActions: HTMLElement;
  examplesContainer: HTMLElement;
  styleSelect: HTMLSelectElement;
  tabs: HTMLElement;
  copyBtn: HTMLElement;
  onExampleSelect: (example: Example) => void;
  onStyleChange: (style: string) => void;
  onTabChange: (tab: 'preview' | 'html') => void;
  onCopy: () => void;
}) {
  // --- Examples dropdown ---
  const dropdownBtn = document.createElement('button');
  dropdownBtn.className = 'pg-btn';
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
  menu.className = 'pg-dropdown__menu';

  examples.forEach((ex) => {
    const item = document.createElement('button');
    item.className = 'pg-dropdown__item';
    item.innerHTML = `${ex.name}<span class="pg-dropdown__item-desc">${ex.description}</span>`;
    item.addEventListener('click', () => {
      opts.onExampleSelect(ex);
      menu.classList.remove('pg-dropdown__menu--open');
    });
    menu.appendChild(item);
  });

  opts.examplesContainer.appendChild(menu);

  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('pg-dropdown__menu--open');
  });

  document.addEventListener('click', () => {
    menu.classList.remove('pg-dropdown__menu--open');
  });

  // --- Style selector ---
  opts.styleSelect.addEventListener('change', () => {
    opts.onStyleChange(opts.styleSelect.value);
  });

  // --- Tabs ---
  const tabButtons = opts.tabs.querySelectorAll<HTMLButtonElement>('.pg-tab');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('pg-tab--active'));
      btn.classList.add('pg-tab--active');
      const tab = btn.dataset.tab as 'preview' | 'html';
      opts.onTabChange(tab);
    });
  });

  // --- Copy button ---
  opts.copyBtn.addEventListener('click', () => {
    opts.onCopy();
  });
}

/** Show a toast notification */
export function showToast(toastEl: HTMLElement, message?: string) {
  if (message) toastEl.textContent = message;
  toastEl.classList.add('pg-toast--visible');
  setTimeout(() => {
    toastEl.classList.remove('pg-toast--visible');
  }, 2000);
}
