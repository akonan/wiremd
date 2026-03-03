/** wiremd Playground - Monaco Editor Panel */

import * as monaco from 'monaco-editor';

// Configure Monaco workers
self.MonacoEnvironment = {
  getWorker(_workerId: string, _label: string) {
    return new Worker(
      new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
      { type: 'module' }
    );
  },
};

/** Register a custom wiremd language for basic syntax highlighting */
function registerWiremdLanguage() {
  // Only register once
  if (monaco.languages.getLanguages().some((l) => l.id === 'wiremd')) return;

  monaco.languages.register({ id: 'wiremd' });

  monaco.languages.setMonarchTokensProvider('wiremd', {
    tokenizer: {
      root: [
        // Headings
        [/^#{1,6}\s.*$/, 'keyword'],
        // Containers ::: name
        [/^:::.*$/, 'type.identifier'],
        // Navigation bar [[ ... ]]
        [/\[\[.*?\]\]/, 'string'],
        // Buttons [Text]* or [Text]
        [/\[.*?\]\*/, 'keyword.control'],
        [/\[.*?\](\{[^}]*\})?/, 'variable'],
        // Input fields with underscores or asterisks
        [/\[[\*_|]+\]/, 'number'],
        // Attributes {key:value}
        [/\{[^}]*\}/, 'annotation'],
        // Blockquotes
        [/^>.*$/, 'comment'],
        // Table separators
        [/\|/, 'delimiter'],
        // Checkbox / radio
        [/- \[[ x]\]/, 'keyword'],
        [/- \([ x]\)/, 'keyword'],
        // Horizontal rule
        [/^---+$/, 'delimiter'],
        // Bold
        [/\*\*[^*]+\*\*/, 'strong'],
        // Italic
        [/\*[^*]+\*/, 'emphasis'],
        // Images
        [/!\[.*?\]/, 'string'],
        // Icons
        [/:[a-z-]+:/, 'tag'],
      ],
    },
  });

  // Dark theme matching our playground design
  monaco.editor.defineTheme('wiremd-dark', {
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

export interface EditorInstance {
  getValue: () => string;
  setValue: (v: string) => void;
  getEditor: () => monaco.editor.IStandaloneCodeEditor;
  layout: () => void;
}

export function initEditor(opts: {
  container: HTMLElement;
  onChange: (value: string) => void;
  initialValue?: string;
}): EditorInstance {
  registerWiremdLanguage();

  const monacoEditor = monaco.editor.create(opts.container, {
    value: opts.initialValue ?? '',
    language: 'wiremd',
    theme: 'wiremd-dark',
    fontSize: 13,
    lineHeight: 22,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    fontLigatures: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    padding: { top: 12, bottom: 12 },
    renderLineHighlight: 'line',
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    bracketPairColorization: { enabled: false },
    wordWrap: 'on',
    lineNumbers: 'on',
    glyphMargin: false,
    folding: false,
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
    tabSize: 2,
    insertSpaces: true,
    automaticLayout: true,
  });

  // Debounced onChange
  let debounceTimer: ReturnType<typeof setTimeout>;
  monacoEditor.onDidChangeModelContent(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      opts.onChange(monacoEditor.getValue());
    }, 200);
  });

  return {
    getValue: () => monacoEditor.getValue(),
    setValue: (v: string) => {
      monacoEditor.setValue(v);
      opts.onChange(v);
    },
    getEditor: () => monacoEditor,
    layout: () => monacoEditor.layout(),
  };
}
