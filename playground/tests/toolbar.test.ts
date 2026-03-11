import { beforeEach, describe, expect, it, vi } from 'vitest';
import { examples } from '../src/examples.js';
import { initToolbar, showToast } from '../src/toolbar.js';
import { FakeDocument, FakeElement } from './helpers/fake-dom.js';

describe('playground toolbar', () => {
  let document: FakeDocument;

  beforeEach(() => {
    document = new FakeDocument();
    vi.stubGlobal('document', document);
    vi.useFakeTimers();
  });

  it('wires the examples dropdown, style selector, tabs and copy button', () => {
    const examplesContainer = document.createElement('div');
    const styleSelect = document.createElement('select');
    const tabs = document.createElement('div');
    const previewTab = document.createElement('button');
    const htmlTab = document.createElement('button');
    const copyBtn = document.createElement('button');

    previewTab.className = 'pg-tab pg-tab--active';
    previewTab.dataset.tab = 'preview';
    htmlTab.className = 'pg-tab';
    htmlTab.dataset.tab = 'html';
    tabs.appendChild(previewTab);
    tabs.appendChild(htmlTab);

    const onExampleSelect = vi.fn();
    const onStyleChange = vi.fn();
    const onTabChange = vi.fn();
    const onCopy = vi.fn();

    initToolbar({
      examplesContainer: examplesContainer as unknown as HTMLElement,
      styleSelect: styleSelect as unknown as HTMLSelectElement,
      tabs: tabs as unknown as HTMLElement,
      copyBtn: copyBtn as unknown as HTMLButtonElement,
      onExampleSelect,
      onStyleChange,
      onTabChange,
      onCopy,
    });

    const dropdownBtn = examplesContainer.children[0];
    const menu = examplesContainer.children[1];
    expect(menu.children).toHaveLength(examples.length);

    dropdownBtn.click();
    expect(menu.classList.contains('pg-dropdown__menu--open')).toBe(true);

    menu.children[0].click();
    expect(onExampleSelect).toHaveBeenCalledWith(examples[0]);
    expect(menu.classList.contains('pg-dropdown__menu--open')).toBe(false);

    styleSelect.value = 'clean';
    styleSelect.dispatchEvent('change');
    expect(onStyleChange).toHaveBeenCalledWith('clean');

    htmlTab.click();
    expect(onTabChange).toHaveBeenCalledWith('html');
    expect(htmlTab.classList.contains('pg-tab--active')).toBe(true);
    expect(previewTab.classList.contains('pg-tab--active')).toBe(false);

    copyBtn.click();
    expect(onCopy).toHaveBeenCalledTimes(1);

    dropdownBtn.click();
    document.dispatchEvent('click');
    expect(menu.classList.contains('pg-dropdown__menu--open')).toBe(false);
  });

  it('shows and hides toast messages with the latest timer', () => {
    const toast = new FakeElement('div');

    showToast(toast as unknown as HTMLElement, 'First');
    showToast(toast as unknown as HTMLElement, 'Second');

    expect(toast.textContent).toBe('Second');
    expect(toast.classList.contains('pg-toast--visible')).toBe(true);

    vi.advanceTimersByTime(1999);
    expect(toast.classList.contains('pg-toast--visible')).toBe(true);

    vi.advanceTimersByTime(1);
    expect(toast.classList.contains('pg-toast--visible')).toBe(false);
  });
});
