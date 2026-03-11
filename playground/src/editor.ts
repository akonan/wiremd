/** wiremd Playground - Monaco Editor Panel */

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import { createDebouncedChangeController } from './debouncedChange.js';
import { ensurePlaygroundMonacoSetup, getSharedMonacoOptions } from './monaco.js';

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

}

export interface EditorInstance {
  getValue: () => string;
  setValue: (v: string) => void;
  getEditor: () => monaco.editor.IStandaloneCodeEditor;
  layout: () => void;
  flushPendingChange: () => void;
}

export function initEditor(opts: {
  container: HTMLElement;
  onChange: (value: string) => void;
  initialValue?: string;
}): EditorInstance {
  ensurePlaygroundMonacoSetup();
  registerWiremdLanguage();

  const monacoEditor = monaco.editor.create(opts.container, {
    ...getSharedMonacoOptions(),
    value: opts.initialValue ?? '',
    language: 'wiremd',
    fontSize: 13,
    lineHeight: 22,
    fontLigatures: true,
    renderLineHighlight: 'line',
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    bracketPairColorization: { enabled: false },
    folding: false,
    tabSize: 2,
    insertSpaces: true,
  });

  const debouncedChange = createDebouncedChangeController({
    delayMs: 200,
    onChange: opts.onChange,
  });

  let suppressNextChange = false;
  monacoEditor.onDidChangeModelContent(() => {
    if (suppressNextChange) {
      suppressNextChange = false;
      return;
    }
    debouncedChange.schedule(monacoEditor.getValue());
  });

  return {
    getValue: () => monacoEditor.getValue(),
    setValue: (v: string) => {
      suppressNextChange = true;
      debouncedChange.cancel();
      monacoEditor.setValue(v);
      opts.onChange(v);
    },
    getEditor: () => monacoEditor,
    layout: () => monacoEditor.layout(),
    flushPendingChange: () => {
      debouncedChange.flush();
    },
  };
}
