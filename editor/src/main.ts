/** wiremd Editor - Main Entry Point */

import './styles/editor.css';
import { initEditor } from './editor.js';
import { createPreview } from './preview.js';
import type { StyleName } from './renderMarkup.js';
import {
  calculateSplitPercent,
  getEditorPanelStyle,
  getSplitLayout,
} from './splitter.js';
import { initToolbar, showToast } from './toolbar.js';
import { examples } from './examples.js';
import { decodeShareHash, encodeShareHash } from './url-share.js';

// --- DOM Elements ---
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const monacoContainer = $('monaco-container');
const previewIframe = $<HTMLIFrameElement>('preview-iframe');
const htmlOutputContainer = $('html-output');
const errorBar = $('error-bar');
const errorMessage = $('error-message');
const styleSelect = $<HTMLSelectElement>('style-select');
const previewTabs = $('preview-tabs');
const copyBtn = $<HTMLButtonElement>('copy-html-btn');
const copyLinkBtn = $<HTMLButtonElement>('copy-link-btn');
const examplesDropdown = $('examples-dropdown');
const toast = $('toast');
const divider = $('divider');
const editorPanel = $('editor-panel');

function updateCopyButtonState() {
  copyBtn.disabled = preview.getHTML() === '';
}

function renderMarkdown(markdown: string) {
  preview.render(markdown);
  updateCopyButtonState();
}

async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall back to the legacy copy path below.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }

  return copied;
}

let isInitializing = true;

function syncUrlToBuffer(value: string) {
  const hash = encodeShareHash(value);
  const url = window.location.pathname + window.location.search + hash;
  window.history.replaceState(null, '', url);
}
	
// --- Preview ---
const preview = createPreview({
  iframe: previewIframe,
  htmlOutputContainer,
  errorBar,
  errorMessage,
});

// --- Editor ---
const editor = initEditor({
  container: monacoContainer,
  onChange: (value) => {
    renderMarkdown(value);
    if (!isInitializing) {
      syncUrlToBuffer(value);
    }
  },
});

// --- Toolbar ---
initToolbar({
  examplesContainer: examplesDropdown,
  styleSelect,
  tabs: previewTabs,
  copyBtn,
  copyLinkBtn,
  onExampleSelect: (example) => {
    editor.setValue(example.code);
  },
  onStyleChange: (style) => {
    preview.setStyle(style as StyleName);
    renderMarkdown(editor.getValue());
  },
  onTabChange: (tab) => {
    preview.setTab(tab);
  },
  onCopy: async () => {
    editor.flushPendingChange();
    const html = preview.getHTML();

    if (!html) {
      showToast(toast, 'Nothing to copy');
      return;
    }

    const copied = await copyText(html);
    showToast(toast, copied ? 'Copied to clipboard!' : 'Copy failed');
  },
  onCopyLink: async () => {
    editor.flushPendingChange();
    syncUrlToBuffer(editor.getValue());
    const copied = await copyText(window.location.href);
    showToast(toast, copied ? 'Link copied!' : 'Copy failed');
  },
});

// --- Resizable Divider ---
let isDragging = false;
let activePointerId: number | null = null;
let horizontalSplit = 50;
let verticalSplit = 50;

function applySplit() {
  const layout = getSplitLayout(window.innerWidth);
  const editorPanelStyle = getEditorPanelStyle(layout, horizontalSplit, verticalSplit);
  editorPanel.style.width = editorPanelStyle.width;
  editorPanel.style.height = editorPanelStyle.height;
  editor.layout();
}

divider.addEventListener('pointerdown', (e) => {
  isDragging = true;
  activePointerId = e.pointerId;
  divider.setPointerCapture(e.pointerId);
  divider.classList.add('ed-divider--active');
  document.body.style.cursor = getSplitLayout(window.innerWidth) === 'vertical'
    ? 'row-resize'
    : 'col-resize';
  document.body.style.userSelect = 'none';
  document.body.style.touchAction = 'none';
  e.preventDefault();
});

document.addEventListener('pointermove', (e) => {
  if (activePointerId !== null && e.pointerId !== activePointerId) return;
  if (!isDragging) return;

  const main = editorPanel.parentElement;
  if (!main) return;
  const mainRect = main.getBoundingClientRect();
  const layout = getSplitLayout(window.innerWidth);

  if (layout === 'vertical') {
    verticalSplit = calculateSplitPercent(layout, e, mainRect, verticalSplit);
  } else {
    horizontalSplit = calculateSplitPercent(layout, e, mainRect, horizontalSplit);
  }

  applySplit();
});

function stopDragging(e?: PointerEvent) {
  if (!isDragging) return;
  if (e && activePointerId !== null && e.pointerId !== activePointerId) return;

  isDragging = false;
  divider.classList.remove('ed-divider--active');
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
  document.body.style.touchAction = '';
  if (activePointerId !== null && divider.hasPointerCapture(activePointerId)) {
    divider.releasePointerCapture(activePointerId);
  }
  activePointerId = null;
}

document.addEventListener('pointerup', stopDragging);
document.addEventListener('pointercancel', stopDragging);
window.addEventListener('resize', applySplit);

applySplit();
updateCopyButtonState();

// --- Load initial content: from URL hash if present, else first example ---
const rawHash = window.location.hash ?? '';
const sharedContent = decodeShareHash(rawHash);
if (sharedContent !== null) {
  editor.setValue(sharedContent);
} else {
  if (rawHash.length > 1) {
    showToast(toast, 'Could not load shared link — opening default');
  }
  if (examples.length > 0) {
    editor.setValue(examples[0].code);
  }
}

isInitializing = false;
