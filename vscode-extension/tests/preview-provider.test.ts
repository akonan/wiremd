import { beforeEach, describe, expect, it, vi } from 'vitest';

type DisposableLike = { dispose: ReturnType<typeof vi.fn> };

const createDisposable = (): DisposableLike => ({ dispose: vi.fn() });

const mockParse = vi.fn();
const mockRenderToHTML = vi.fn();

const configValues = new Map<string, unknown>();

let panelFactory: ReturnType<typeof createMockPanel>;
let textDocumentHandlers: Array<(event: { document: unknown }) => void> = [];
let activeEditorHandlers: Array<(
  editor: undefined | { document: { languageId: string; getText?: () => string } }
) => void> = [];
let configurationHandlers: Array<(event: { affectsConfiguration: (section: string) => boolean }) => void> = [];

function createMockPanel() {
  let disposeHandler: (() => void) | undefined;
  let messageHandler: ((message: unknown) => void) | undefined;

  const webview = {
    html: '',
    options: {} as Record<string, unknown>,
    postMessage: vi.fn(),
    onDidReceiveMessage: vi.fn((handler: (message: unknown) => void, _thisArg?: unknown, disposables?: DisposableLike[]) => {
      messageHandler = handler;
      const disposable = createDisposable();
      disposables?.push(disposable);
      return disposable;
    })
  };

  const panel = {
    webview,
    reveal: vi.fn(),
    dispose: vi.fn(),
    onDidDispose: vi.fn((handler: () => void, _thisArg?: unknown, disposables?: DisposableLike[]) => {
      disposeHandler = handler;
      const disposable = createDisposable();
      disposables?.push(disposable);
      return disposable;
    })
  };

  return {
    panel,
    getMessageHandler: () => messageHandler,
    triggerDispose: () => disposeHandler?.()
  };
}

const mockVscode = {
  window: {
    activeTextEditor: undefined as undefined | { document: { languageId: string; getText: () => string } },
    createWebviewPanel: vi.fn(() => panelFactory.panel),
    onDidChangeActiveTextEditor: vi.fn((_handler: unknown, _thisArg?: unknown, disposables?: DisposableLike[]) => {
      activeEditorHandlers.push(
        _handler as (editor: undefined | { document: { languageId: string; getText?: () => string } }) => void
      );
      const disposable = createDisposable();
      disposables?.push(disposable);
      return disposable;
    }),
    showErrorMessage: vi.fn(),
    showWarningMessage: vi.fn(),
    showInformationMessage: vi.fn()
  },
  workspace: {
    onDidChangeTextDocument: vi.fn((_handler: unknown, _thisArg?: unknown, disposables?: DisposableLike[]) => {
      textDocumentHandlers.push(_handler as (event: { document: unknown }) => void);
      const disposable = createDisposable();
      disposables?.push(disposable);
      return disposable;
    }),
    onDidChangeConfiguration: vi.fn((_handler: unknown, _thisArg?: unknown, disposables?: DisposableLike[]) => {
      configurationHandlers.push(
        _handler as (event: { affectsConfiguration: (section: string) => boolean }) => void
      );
      const disposable = createDisposable();
      disposables?.push(disposable);
      return disposable;
    }),
    getConfiguration: vi.fn(() => ({
      get: (key: string, fallback?: unknown) => (configValues.has(key) ? configValues.get(key) : fallback)
    }))
  },
  commands: {
    executeCommand: vi.fn()
  }
};

vi.mock('vscode', () => mockVscode);
vi.mock('wiremd', () => ({
  parse: mockParse,
  renderToHTML: mockRenderToHTML
}));

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

describe('WiremdPreviewProvider', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.useRealTimers();

    configValues.clear();
    configValues.set('defaultStyle', 'sketch');
    configValues.set('showErrorOverlay', true);
    configValues.set('autoRefresh', true);
    configValues.set('refreshDelay', 10);
    textDocumentHandlers = [];
    activeEditorHandlers = [];
    configurationHandlers = [];

    panelFactory = createMockPanel();
    mockVscode.window.activeTextEditor = undefined;
    mockVscode.window.createWebviewPanel.mockImplementation(() => panelFactory.panel);

    mockParse.mockReturnValue({ type: 'document' });
    mockRenderToHTML.mockReturnValue(
      `<style>@import url("https://fonts.googleapis.com/css2?family=Kalam");\nbody { color: #333; }\n.wmd-root { color: #333; }</style><body><h1>Card</h1></body>`
    );
  });

  it('shows an error when trying to open preview without active editor', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const provider = new WiremdPreviewProvider({ extensionUri: { path: '/tmp/ext' } } as never);

    provider.openPreview(1 as never);

    expect(mockVscode.window.showErrorMessage).toHaveBeenCalledWith('No active markdown file');
    expect(mockVscode.window.createWebviewPanel).not.toHaveBeenCalled();
  });

  it('shows a warning when active file is not markdown', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const provider = new WiremdPreviewProvider({ extensionUri: { path: '/tmp/ext' } } as never);

    mockVscode.window.activeTextEditor = {
      document: { languageId: 'typescript', getText: () => 'const x = 1;' }
    };

    provider.openPreview(1 as never);

    expect(mockVscode.window.showWarningMessage).toHaveBeenCalledWith('Active file is not a markdown file');
    expect(mockVscode.window.createWebviewPanel).not.toHaveBeenCalled();
  });

  it('creates a panel, renders content, and reuses the panel on subsequent opens', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const provider = new WiremdPreviewProvider({ extensionUri: { path: '/tmp/ext' } } as never);

    mockVscode.window.activeTextEditor = {
      document: { languageId: 'markdown', getText: () => '## Card' }
    };

    provider.openPreview(2 as never);
    await flushPromises();

    expect(mockVscode.window.createWebviewPanel).toHaveBeenCalledTimes(1);
    expect(mockParse).toHaveBeenCalledWith('## Card');
    expect(mockRenderToHTML).toHaveBeenCalled();
    expect(panelFactory.panel.webview.html).toContain('<h1>Card</h1>');
    expect(panelFactory.panel.webview.html).toContain('https://fonts.googleapis.com/css2?family=Kalam');

    provider.openPreview(3 as never);
    await flushPromises();

    expect(mockVscode.window.createWebviewPanel).toHaveBeenCalledTimes(1);
    expect(panelFactory.panel.reveal).toHaveBeenCalledWith(3);

    panelFactory.triggerDispose();
    expect((provider as any).panel).toBeUndefined();
  });

  it('handles webview messages for commands, style, viewport, and notifications', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const provider = new WiremdPreviewProvider({ extensionUri: { path: '/tmp/ext' } } as never);

    mockVscode.window.activeTextEditor = {
      document: { languageId: 'markdown', getText: () => '# Example' }
    };

    provider.openPreview(1 as never);
    await flushPromises();

    const onMessage = panelFactory.getMessageHandler();
    expect(onMessage).toBeTypeOf('function');

    const refreshSpy = vi.spyOn(provider, 'refresh').mockResolvedValue();
    onMessage?.({ type: 'ready' });
    onMessage?.({ type: 'requestStyleChange' });
    onMessage?.({ type: 'requestViewportChange' });
    onMessage?.({ type: 'changeStyle', style: 'material' });
    onMessage?.({ type: 'changeViewport', viewport: 'mobile' });
    onMessage?.({ type: 'error', message: 'boom' });
    onMessage?.({ type: 'info', message: 'ok' });

    expect(mockVscode.commands.executeCommand).toHaveBeenCalledWith('wiremd.changeStyle');
    expect(mockVscode.commands.executeCommand).toHaveBeenCalledWith('wiremd.changeViewport');
    expect(refreshSpy).toHaveBeenCalled();
    expect((provider as any).currentStyle).toBe('material');
    expect((provider as any).currentViewport).toBe('mobile');
    expect(mockVscode.window.showErrorMessage).toHaveBeenCalledWith('Wiremd: boom');
    expect(mockVscode.window.showInformationMessage).toHaveBeenCalledWith('Wiremd: ok');
  });

  it('restores serialized panel state and configures webview options', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const context = { extensionUri: { path: '/tmp/ext' } };
    const provider = new WiremdPreviewProvider(context as never);
    const restoredPanel = createMockPanel();

    await provider.deserializeWebviewPanel(restoredPanel.panel as never, {
      style: 'clean',
      viewport: 'tablet'
    });

    expect(restoredPanel.panel.webview.options).toEqual({
      enableScripts: true,
      localResourceRoots: [context.extensionUri]
    });
    expect((provider as any).currentStyle).toBe('clean');
    expect((provider as any).currentViewport).toBe('tablet');
  });

  it('uses fallback style/viewport values when deserialized state misses fields', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const provider = new WiremdPreviewProvider({ extensionUri: { path: '/tmp/ext' } } as never);
    const restoredPanel = createMockPanel();
    (provider as any).currentStyle = 'material';
    (provider as any).currentViewport = 'mobile';

    await provider.deserializeWebviewPanel(restoredPanel.panel as never, {});

    expect((provider as any).currentStyle).toBe('sketch');
    expect((provider as any).currentViewport).toBe('full');
  });

  it('debounces document change refreshes when autoRefresh is enabled', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const provider = new WiremdPreviewProvider({ extensionUri: { path: '/tmp/ext' } } as never);
    vi.useFakeTimers();

    const document = { getText: () => '# Debounce', languageId: 'markdown' };
    (provider as any).panel = panelFactory.panel;
    (provider as any).currentEditor = { document };
    const refreshSpy = vi.spyOn(provider, 'refresh').mockResolvedValue();

    (provider as any).onDocumentChanged({ document });
    (provider as any).onDocumentChanged({ document });

    vi.advanceTimersByTime(9);
    expect(refreshSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(refreshSpy).toHaveBeenCalledTimes(1);
  });

  it('returns early on document/active-editor guards and when autoRefresh is disabled', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const provider = new WiremdPreviewProvider({ extensionUri: { path: '/tmp/ext' } } as never);
    const refreshSpy = vi.spyOn(provider, 'refresh').mockResolvedValue();

    (provider as any).onDocumentChanged({ document: { id: 'a' } });
    expect(refreshSpy).not.toHaveBeenCalled();

    const sharedDocument = { getText: () => '# Guard', languageId: 'markdown' };
    (provider as any).panel = panelFactory.panel;
    (provider as any).currentEditor = { document: sharedDocument };
    configValues.set('autoRefresh', false);
    (provider as any).onDocumentChanged({ document: sharedDocument });
    expect(refreshSpy).not.toHaveBeenCalled();
  });

  it('returns early for non-markdown active editor changes and refreshes for markdown', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const provider = new WiremdPreviewProvider({ extensionUri: { path: '/tmp/ext' } } as never);
    const refreshSpy = vi.spyOn(provider, 'refresh').mockResolvedValue();

    (provider as any).onActiveEditorChanged(undefined);
    (provider as any).onActiveEditorChanged({ document: { languageId: 'plaintext' } });
    expect(refreshSpy).not.toHaveBeenCalled();

    const editor = { document: { languageId: 'markdown', getText: () => '# Title' } };
    (provider as any).onActiveEditorChanged(editor);
    expect((provider as any).currentEditor).toBe(editor);
    expect(refreshSpy).toHaveBeenCalledTimes(1);
  });

  it('handles configuration-change callback branches', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const provider = new WiremdPreviewProvider({ extensionUri: { path: '/tmp/ext' } } as never);
    const refreshSpy = vi.spyOn(provider, 'refresh').mockResolvedValue();

    expect(configurationHandlers).toHaveLength(1);

    configurationHandlers[0]({ affectsConfiguration: () => false });
    expect(refreshSpy).not.toHaveBeenCalled();

    configurationHandlers[0]({ affectsConfiguration: () => true });
    expect(refreshSpy).toHaveBeenCalledTimes(1);
  });

  it('skips error overlay postMessage when showErrorOverlay is disabled', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const provider = new WiremdPreviewProvider({ extensionUri: { path: '/tmp/ext' } } as never);

    (provider as any).panel = panelFactory.panel;
    configValues.set('showErrorOverlay', false);
    (provider as any).showError('no overlay');
    expect(panelFactory.panel.webview.postMessage).not.toHaveBeenCalled();

    configValues.set('showErrorOverlay', true);
    (provider as any).showError('show overlay');
    expect(panelFactory.panel.webview.postMessage).toHaveBeenCalledWith({
      type: 'error',
      message: 'show overlay'
    });
  });

  it('returns without posting error when panel is missing', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const provider = new WiremdPreviewProvider({ extensionUri: { path: '/tmp/ext' } } as never);

    (provider as any).showError('no panel');
    expect(panelFactory.panel.webview.postMessage).not.toHaveBeenCalled();
  });

  it('returns escaped error HTML when parsing fails', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const provider = new WiremdPreviewProvider({ extensionUri: { path: '/tmp/ext' } } as never);

    (provider as any).currentEditor = {
      document: { languageId: 'markdown', getText: () => 'broken' }
    };
    mockParse.mockImplementationOnce(() => {
      throw new Error('<invalid & broken>');
    });

    const html = await (provider as any).getWebviewContent();
    expect(html).toContain('&lt;invalid &amp; broken&gt;');
  });

  it('disposes timers, panel, and registered disposables', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const provider = new WiremdPreviewProvider({ extensionUri: { path: '/tmp/ext' } } as never);

    (provider as any).panel = panelFactory.panel;
    (provider as any).updateTimeout = setTimeout(() => undefined, 1000);

    provider.dispose();

    expect((provider as any).disposables).toHaveLength(0);
    expect(panelFactory.panel.dispose).toHaveBeenCalledTimes(1);
  });

  it('returns immediately from refresh without panel and reports thrown render errors', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const provider = new WiremdPreviewProvider({ extensionUri: { path: '/tmp/ext' } } as never);

    await provider.refresh();

    (provider as any).panel = panelFactory.panel;
    vi.spyOn(provider as any, 'getWebviewContent').mockRejectedValueOnce(new Error('refresh failure'));
    await provider.refresh();

    expect(panelFactory.panel.webview.postMessage).toHaveBeenCalledWith({
      type: 'error',
      message: 'refresh failure'
    });
  });

  it('covers HTML extraction fallbacks and unknown viewport width fallback', async () => {
    const { WiremdPreviewProvider } = await import('../src/preview-provider');
    const provider = new WiremdPreviewProvider({ extensionUri: { path: '/tmp/ext' } } as never);

    const extracted = (provider as any).extractHTMLParts('<div>No style/body wrappers</div>');
    expect(extracted.styles).toBe('');
    expect(extracted.fontLinks).toBe('');
    expect(extracted.content).toContain('No style/body wrappers');

    (provider as any).currentViewport = 'unknown';
    const wrapped = (provider as any).wrapHTML('<style>.x{}</style><body><div>Fallback</div></body>');
    expect(wrapped).toContain('100%');
  });
});
