import { beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => {
  const state: {
    initialize?: (params: unknown) => unknown;
    completion?: (params: unknown) => unknown;
    hover?: (params: unknown) => unknown;
    signature?: (params: unknown) => unknown;
    semantic?: (params: unknown) => unknown;
    onOpen?: (event: { document: { uri: string; getText: () => string } }) => void;
    onChange?: (event: { document: { uri: string; getText: () => string } }) => void;
    onSave?: (event: { document: { uri: string; getText: () => string } }) => void;
    onClose?: (event: { document: { uri: string } }) => void;
  } = {};

  const docs = new Map<string, { uri: string; getText: () => string }>();

  const parse = vi.fn();

  const buildCompletionItems = vi.fn(() => [{ label: 'hero' }]);
  const buildHover = vi.fn(() => ({ contents: { kind: 'markdown', value: 'hover' } }));
  const buildSignatureHelp = vi.fn(() => ({
    signatures: [{ label: 'sig', parameters: [] }],
    activeSignature: 0,
    activeParameter: 0
  }));
  const buildSemanticTokens = vi.fn(() => ({ data: [0, 0, 1, 0, 0] }));
  const collectLightweightDiagnostics = vi.fn(() => [{ message: 'warn' }]);
  const parseErrorToDiagnostic = vi.fn(() => ({ message: 'parse-error' }));

  const connection = {
    onInitialize: vi.fn((fn: (params: unknown) => unknown) => {
      state.initialize = fn;
    }),
    onCompletion: vi.fn((fn: (params: unknown) => unknown) => {
      state.completion = fn;
    }),
    onHover: vi.fn((fn: (params: unknown) => unknown) => {
      state.hover = fn;
    }),
    onSignatureHelp: vi.fn((fn: (params: unknown) => unknown) => {
      state.signature = fn;
    }),
    languages: {
      semanticTokens: {
        on: vi.fn((fn: (params: unknown) => unknown) => {
          state.semantic = fn;
        })
      }
    },
    sendDiagnostics: vi.fn(),
    listen: vi.fn()
  };

  const textDocuments = {
    get: vi.fn((uri: string) => docs.get(uri)),
    onDidOpen: vi.fn((fn: (event: { document: { uri: string; getText: () => string } }) => void) => {
      state.onOpen = fn;
    }),
    onDidChangeContent: vi.fn((fn: (event: { document: { uri: string; getText: () => string } }) => void) => {
      state.onChange = fn;
    }),
    onDidSave: vi.fn((fn: (event: { document: { uri: string; getText: () => string } }) => void) => {
      state.onSave = fn;
    }),
    onDidClose: vi.fn((fn: (event: { document: { uri: string } }) => void) => {
      state.onClose = fn;
    }),
    listen: vi.fn()
  };

  const TextDocuments = vi.fn(() => textDocuments);

  function reset() {
    docs.clear();
    parse.mockReset();

    buildCompletionItems.mockReset().mockReturnValue([{ label: 'hero' }]);
    buildHover.mockReset().mockReturnValue({ contents: { kind: 'markdown', value: 'hover' } });
    buildSignatureHelp.mockReset().mockReturnValue({
      signatures: [{ label: 'sig', parameters: [] }],
      activeSignature: 0,
      activeParameter: 0
    });
    buildSemanticTokens.mockReset().mockReturnValue({ data: [0, 0, 1, 0, 0] });
    collectLightweightDiagnostics.mockReset().mockReturnValue([{ message: 'warn' }]);
    parseErrorToDiagnostic.mockReset().mockReturnValue({ message: 'parse-error' });

    connection.onInitialize.mockClear();
    connection.onCompletion.mockClear();
    connection.onHover.mockClear();
    connection.onSignatureHelp.mockClear();
    connection.languages.semanticTokens.on.mockClear();
    connection.sendDiagnostics.mockClear();
    connection.listen.mockClear();

    textDocuments.get.mockClear();
    textDocuments.onDidOpen.mockClear();
    textDocuments.onDidChangeContent.mockClear();
    textDocuments.onDidSave.mockClear();
    textDocuments.onDidClose.mockClear();
    textDocuments.listen.mockClear();
    TextDocuments.mockClear();

    state.initialize = undefined;
    state.completion = undefined;
    state.hover = undefined;
    state.signature = undefined;
    state.semantic = undefined;
    state.onOpen = undefined;
    state.onChange = undefined;
    state.onSave = undefined;
    state.onClose = undefined;
  }

  return {
    state,
    docs,
    parse,
    buildCompletionItems,
    buildHover,
    buildSignatureHelp,
    buildSemanticTokens,
    collectLightweightDiagnostics,
    parseErrorToDiagnostic,
    connection,
    textDocuments,
    TextDocuments,
    reset
  };
});

vi.mock('vscode-languageserver/node', () => ({
  createConnection: vi.fn(() => h.connection),
  ProposedFeatures: { all: {} },
  TextDocumentSyncKind: { Incremental: 2 },
  TextDocuments: h.TextDocuments
}));

vi.mock('vscode-languageserver-textdocument', () => ({
  TextDocument: class {}
}));

vi.mock('wiremd', () => ({
  parse: h.parse
}));

vi.mock('../src/lsp/engine', () => ({
  semanticTokenTypes: ['keyword', 'type'],
  buildCompletionItems: h.buildCompletionItems,
  buildHover: h.buildHover,
  buildSignatureHelp: h.buildSignatureHelp,
  buildSemanticTokens: h.buildSemanticTokens,
  collectLightweightDiagnostics: h.collectLightweightDiagnostics,
  parseErrorToDiagnostic: h.parseErrorToDiagnostic
}));

describe('lsp server wiring', () => {
  beforeEach(() => {
    vi.resetModules();
    h.reset();
  });

  it('registers handlers, starts listeners, and exposes initialize capabilities', async () => {
    await import('../src/lsp/server');

    expect(h.connection.onInitialize).toHaveBeenCalledTimes(1);
    expect(h.connection.onCompletion).toHaveBeenCalledTimes(1);
    expect(h.connection.onHover).toHaveBeenCalledTimes(1);
    expect(h.connection.onSignatureHelp).toHaveBeenCalledTimes(1);
    expect(h.connection.languages.semanticTokens.on).toHaveBeenCalledTimes(1);
    expect(h.textDocuments.listen).toHaveBeenCalledWith(h.connection);
    expect(h.connection.listen).toHaveBeenCalledTimes(1);

    const initializeResult = h.state.initialize?.({});
    expect(initializeResult).toMatchObject({
      capabilities: {
        textDocumentSync: 2,
        hoverProvider: true
      }
    });
  });

  it('routes completion/hover/signature/semantic through engine only when document exists', async () => {
    await import('../src/lsp/server');

    const missingUri = 'file:///missing.md';
    expect(h.state.completion?.({ textDocument: { uri: missingUri }, position: { line: 0, character: 0 } })).toEqual([]);
    expect(h.state.hover?.({ textDocument: { uri: missingUri }, position: { line: 0, character: 0 } })).toBeNull();
    expect(h.state.signature?.({ textDocument: { uri: missingUri }, position: { line: 0, character: 0 } })).toBeNull();
    expect(h.state.semantic?.({ textDocument: { uri: missingUri } })).toEqual({ data: [] });

    const document = { uri: 'file:///doc.md', getText: () => '[Save]' };
    h.docs.set(document.uri, document);

    expect(h.state.completion?.({ textDocument: { uri: document.uri }, position: { line: 0, character: 1 } })).toEqual([{ label: 'hero' }]);
    expect(h.state.hover?.({ textDocument: { uri: document.uri }, position: { line: 0, character: 1 } })).toEqual({
      contents: { kind: 'markdown', value: 'hover' }
    });
    expect(h.state.signature?.({ textDocument: { uri: document.uri }, position: { line: 0, character: 1 } })).toEqual({
      signatures: [{ label: 'sig', parameters: [] }],
      activeSignature: 0,
      activeParameter: 0
    });
    expect(h.state.semantic?.({ textDocument: { uri: document.uri } })).toEqual({ data: [0, 0, 1, 0, 0] });

    expect(h.buildCompletionItems).toHaveBeenCalledWith(document, { line: 0, character: 1 });
    expect(h.buildHover).toHaveBeenCalledWith(document, { line: 0, character: 1 });
    expect(h.buildSignatureHelp).toHaveBeenCalledWith(document, { line: 0, character: 1 });
    expect(h.buildSemanticTokens).toHaveBeenCalledWith(document);
  });

  it('publishes diagnostics on open/change/save and clears diagnostics on close', async () => {
    await import('../src/lsp/server');

    const document = { uri: 'file:///diag.md', getText: () => '::: hero' };

    h.state.onOpen?.({ document });
    h.state.onChange?.({ document });
    h.state.onSave?.({ document });

    expect(h.collectLightweightDiagnostics).toHaveBeenCalledTimes(3);
    expect(h.parse).toHaveBeenCalledTimes(3);
    expect(h.connection.sendDiagnostics).toHaveBeenNthCalledWith(1, {
      uri: document.uri,
      diagnostics: [{ message: 'warn' }]
    });

    h.state.onClose?.({ document: { uri: document.uri } });
    expect(h.connection.sendDiagnostics).toHaveBeenLastCalledWith({
      uri: document.uri,
      diagnostics: []
    });
  });

  it('prepends parse diagnostic when parser throws', async () => {
    await import('../src/lsp/server');

    const document = { uri: 'file:///parse-error.md', getText: () => 'broken' };
    const error = new Error('parse failed');
    h.parse.mockImplementationOnce(() => {
      throw error;
    });

    h.state.onOpen?.({ document });

    expect(h.parseErrorToDiagnostic).toHaveBeenCalledWith(document, error);
    expect(h.connection.sendDiagnostics).toHaveBeenCalledWith({
      uri: document.uri,
      diagnostics: [{ message: 'parse-error' }, { message: 'warn' }]
    });
  });
});
