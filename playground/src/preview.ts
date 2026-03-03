/** wiremd Playground - Preview Panel */

import * as monaco from 'monaco-editor';
import { parse, renderToHTML } from 'wiremd';
import type { RenderOptions } from 'wiremd';

export type StyleName = 'sketch' | 'clean' | 'wireframe' | 'none' | 'tailwind' | 'material' | 'brutal';

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

  // Create a read-only Monaco editor for the HTML output
  const htmlEditor = monaco.editor.create(elements.htmlOutputContainer, {
    value: '',
    language: 'html',
    theme: 'wiremd-dark',
    readOnly: true,
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    padding: { top: 12, bottom: 12 },
    renderLineHighlight: 'none',
    smoothScrolling: true,
    wordWrap: 'on',
    lineNumbers: 'on',
    glyphMargin: false,
    folding: true,
    lineDecorationsWidth: 8,
    lineNumbersMinChars: 3,
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    scrollbar: {
      verticalScrollbarSize: 6,
      horizontalScrollbarSize: 6,
      useShadows: false,
    },
    automaticLayout: true,
  });

  function render(markdown: string) {
    try {
      const ast = parse(markdown);
      const options: RenderOptions = {
        style: state.style,
        inlineStyles: true,
        pretty: true,
      };
      const html = renderToHTML(ast, options);
      state.lastHTML = html;
      state.lastError = null;

      // Update iframe
      updateIframe(html);

      // Update HTML Monaco editor
      htmlEditor.setValue(html);

      // Hide error
      elements.errorBar.classList.remove('pg-error--visible');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      state.lastError = message;
      elements.errorMessage.textContent = message;
      elements.errorBar.classList.add('pg-error--visible');
    }
  }

  function updateIframe(html: string) {
    const doc = elements.iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
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
      // Trigger layout so Monaco renders correctly when shown
      htmlEditor.layout();
    }
  }

  function getHTML(): string {
    return state.lastHTML;
  }

  return { render, setStyle, setTab, getHTML, state };
}
