import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

export const PLAYGROUND_MONACO_THEME = 'wiremd-dark';
export const PLAYGROUND_MONACO_FONT_FAMILY =
  "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace";

let hasConfiguredMonaco = false;

function configureMonacoWorkers() {
  (
    self as typeof globalThis & {
      MonacoEnvironment?: {
        getWorker: (_workerId: string, _label: string) => Worker;
      };
    }
  ).MonacoEnvironment = {
    getWorker(_workerId: string, _label: string) {
      return new Worker(
        new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
        { type: 'module' }
      );
    },
  };
}

function definePlaygroundTheme() {
  monaco.editor.defineTheme(PLAYGROUND_MONACO_THEME, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '818cf8', fontStyle: 'bold' },
      { token: 'type.identifier', foreground: '6366f1' },
      { token: 'string', foreground: '22c55e' },
      { token: 'variable', foreground: '38bdf8' },
      { token: 'number', foreground: 'f59e0b' },
      { token: 'annotation', foreground: '94a3b8' },
      { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
      { token: 'delimiter', foreground: '475569' },
      { token: 'keyword.control', foreground: 'a78bfa', fontStyle: 'bold' },
      { token: 'strong', foreground: 'e2e8f0', fontStyle: 'bold' },
      { token: 'emphasis', foreground: 'cbd5e1', fontStyle: 'italic' },
      { token: 'tag', foreground: 'fb923c' },
    ],
    colors: {
      'editor.background': '#0d1017',
      'editor.foreground': '#cbd5e1',
      'editor.lineHighlightBackground': '#1a1d2640',
      'editor.selectionBackground': '#6366f130',
      'editorCursor.foreground': '#818cf8',
      'editorLineNumber.foreground': '#334155',
      'editorLineNumber.activeForeground': '#6366f1',
      'editor.selectionHighlightBackground': '#6366f115',
      'editorIndentGuide.background': '#1e293b',
      'editorIndentGuide.activeBackground': '#334155',
      'editorWidget.background': '#12151c',
      'editorWidget.border': '#1e293b',
      'editorSuggestWidget.background': '#12151c',
      'scrollbarSlider.background': '#ffffff10',
      'scrollbarSlider.hoverBackground': '#ffffff20',
    },
  });
}

export function ensurePlaygroundMonacoSetup() {
  if (hasConfiguredMonaco) {
    return;
  }

  configureMonacoWorkers();
  definePlaygroundTheme();
  hasConfiguredMonaco = true;
}

export function getSharedMonacoOptions(): monaco.editor.IStandaloneEditorConstructionOptions {
  return {
    theme: PLAYGROUND_MONACO_THEME,
    fontFamily: PLAYGROUND_MONACO_FONT_FAMILY,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    padding: { top: 12, bottom: 12 },
    smoothScrolling: true,
    wordWrap: 'on',
    lineNumbers: 'on',
    glyphMargin: false,
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
  };
}
