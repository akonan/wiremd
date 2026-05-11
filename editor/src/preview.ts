/** wiremd Editor - Preview Panel */

import type * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api.js';
import { ensureEditorMonacoSetup, getSharedMonacoOptions } from './monaco.js';
import { renderMarkup, type StyleName } from './renderMarkup.js';

export interface PreviewState {
  style: StyleName;
  activeTab: 'preview' | 'html';
  lastHTML: string;
  lastError: string | null;
}

export function createPreview(elements: {
  iframe: HTMLIFrameElement;
  htmlOutputContainer: HTMLElement;
  errorBar: HTMLElement;
  errorMessage: HTMLElement;
}) {
  const state: PreviewState = {
    style: 'sketch',
    activeTab: 'preview',
    lastHTML: '',
    lastError: null,
  };
  let htmlEditor: MonacoEditor.editor.IStandaloneCodeEditor | null = null;
  let htmlEditorPromise: Promise<MonacoEditor.editor.IStandaloneCodeEditor> | null = null;

  function render(markdown: string) {
    const result = renderMarkup(markdown, state.style);

    if (result.error === null) {
      const { html } = result;
      state.lastHTML = html;
      state.lastError = null;

      updateIframe(html);
      htmlEditor?.setValue(html);
      elements.errorBar.classList.remove('ed-error--visible');
      return;
    }

    state.lastHTML = '';
    state.lastError = result.error;
    updateIframe('');
    htmlEditor?.setValue('');
    elements.errorMessage.textContent = result.error;
    elements.errorBar.classList.add('ed-error--visible');
  }

  function updateIframe(html: string) {
    elements.iframe.srcdoc = html;
  }

  async function ensureHtmlEditor() {
    if (htmlEditor) {
      return htmlEditor;
    }

    if (htmlEditorPromise) {
      return htmlEditorPromise;
    }

    htmlEditorPromise = (async () => {
      const [monaco] = await Promise.all([
        import('monaco-editor/esm/vs/editor/editor.api.js'),
        import('monaco-editor/esm/vs/basic-languages/html/html.contribution.js'),
      ]);

      ensureEditorMonacoSetup();

      htmlEditor = monaco.editor.create(elements.htmlOutputContainer, {
        ...getSharedMonacoOptions(),
        value: state.lastHTML,
        language: 'html',
        readOnly: true,
        fontSize: 12,
        lineHeight: 20,
        renderLineHighlight: 'none',
        folding: true,
      });

      return htmlEditor;
    })();

    try {
      return await htmlEditorPromise;
    } finally {
      htmlEditorPromise = null;
    }
  }

  function setStyle(style: StyleName) {
    state.style = style;
  }

  function setTab(tab: 'preview' | 'html') {
    state.activeTab = tab;
    if (tab === 'preview') {
      elements.iframe.style.display = 'block';
      elements.htmlOutputContainer.style.display = 'none';
    } else {
      elements.iframe.style.display = 'none';
      elements.htmlOutputContainer.style.display = 'block';
      void ensureHtmlEditor().then((editor) => {
        if (state.activeTab === 'html') {
          editor.layout();
        }
      });
    }
  }

  function getHTML(): string {
    return state.lastHTML;
  }

  return { render, setStyle, setTab, getHTML, state };
}
