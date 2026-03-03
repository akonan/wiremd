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

divider.addEventListener('mousedown', (e) => {
  isDragging = true;
  divider.classList.add('pg-divider--active');
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const mainRect = editorPanel.parentElement!.getBoundingClientRect();
  const percent = ((e.clientX - mainRect.left) / mainRect.width) * 100;
  const clamped = Math.min(Math.max(percent, 20), 80);
  editorPanel.style.width = `${clamped}%`;
  editor.layout();
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    divider.classList.remove('pg-divider--active');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }
});

// --- Load first example on start ---
if (examples.length > 0) {
  editor.setValue(examples[0].code);
}
