/** wiremd Playground - Main Entry Point */

import './styles/playground.css';
import { initEditor } from './editor.js';
import { createPreview, type StyleName } from './preview.js';
import { initToolbar, showToast } from './toolbar.js';
import { examples } from './examples.js';

// --- DOM Elements ---
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const monacoContainer = $('monaco-container');
const previewIframe = $<HTMLIFrameElement>('preview-iframe');
const htmlOutputContainer = $('html-output');
const errorBar = $('error-bar');
const errorMessage = $('error-message');
const styleSelect = $<HTMLSelectElement>('style-select');
const previewTabs = $('preview-tabs');
const copyBtn = $('copy-html-btn');
const headerActions = $('header-actions');
const examplesDropdown = $('examples-dropdown');
const toast = $('toast');
const divider = $('divider');
const editorPanel = $('editor-panel');

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
    preview.render(value);
  },
});

// --- Toolbar ---
initToolbar({
  headerActions,
  examplesContainer: examplesDropdown,
  styleSelect,
  tabs: previewTabs,
  copyBtn,
  onExampleSelect: (example) => {
    editor.setValue(example.code);
  },
  onStyleChange: (style) => {
    preview.setStyle(style as StyleName);
    // Re-render with new style
    preview.render(editor.getValue());
  },
  onTabChange: (tab) => {
    preview.setTab(tab);
  },
  onCopy: () => {
    const html = preview.getHTML();
    if (html) {
      navigator.clipboard.writeText(html).then(() => {
        showToast(toast, 'Copied to clipboard!');
      }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = html;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(toast, 'Copied to clipboard!');
      });
    }
  },
});

// --- Resizable Divider ---
let isDragging = false;
let activePointerId: number | null = null;
let horizontalSplit = 50;
let verticalSplit = 50;

const isVerticalLayout = () => window.matchMedia('(max-width: 768px)').matches;

function applySplit() {
  if (isVerticalLayout()) {
    editorPanel.style.width = '100%';
    editorPanel.style.height = `${verticalSplit}%`;
  } else {
    editorPanel.style.width = `${horizontalSplit}%`;
    editorPanel.style.height = '';
  }
  editor.layout();
}

divider.addEventListener('pointerdown', (e) => {
  isDragging = true;
  activePointerId = e.pointerId;
  divider.setPointerCapture(e.pointerId);
  divider.classList.add('pg-divider--active');
  document.body.style.cursor = isVerticalLayout() ? 'row-resize' : 'col-resize';
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

  if (isVerticalLayout()) {
    const percent = ((e.clientY - mainRect.top) / mainRect.height) * 100;
    verticalSplit = Math.min(Math.max(percent, 20), 80);
  } else {
    const percent = ((e.clientX - mainRect.left) / mainRect.width) * 100;
    horizontalSplit = Math.min(Math.max(percent, 20), 80);
  }

  applySplit();
});

function stopDragging(e?: PointerEvent) {
  if (!isDragging) return;
  if (e && activePointerId !== null && e.pointerId !== activePointerId) return;

  isDragging = false;
  divider.classList.remove('pg-divider--active');
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

// --- Load first example on start ---
if (examples.length > 0) {
  editor.setValue(examples[0].code);
}
