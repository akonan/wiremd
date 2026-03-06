import { beforeEach, describe, expect, it, vi } from 'vitest';

const createDisposable = () => ({ dispose: vi.fn() });

const mockOutputChannel = { appendLine: vi.fn(), dispose: vi.fn() };
const mockStatusBarItem = { text: '', tooltip: '', command: '', show: vi.fn(), hide: vi.fn(), dispose: vi.fn() };

const mockParse = vi.fn();
const mockRenderToHTML = vi.fn();
const mockRenderToJSON = vi.fn();

const previewProviderInstances: Array<{
  openPreview: ReturnType<typeof vi.fn>;
  refresh: ReturnType<typeof vi.fn>;
  changeStyle: ReturnType<typeof vi.fn>;
  changeViewport: ReturnType<typeof vi.fn>;
  dispose: ReturnType<typeof vi.fn>;
}> = [];

const mockVscode = {
  window: {
    createOutputChannel: vi.fn(() => mockOutputChannel),
    registerWebviewPanelSerializer: vi.fn(() => createDisposable()),
    createStatusBarItem: vi.fn(() => mockStatusBarItem),
    onDidChangeActiveTextEditor: vi.fn(() => createDisposable()),
    showQuickPick: vi.fn(),
    activeTextEditor: undefined as undefined | { viewColumn?: number; document: { languageId: string } }
  },
  commands: {
    registerCommand: vi.fn(() => createDisposable()),
    executeCommand: vi.fn()
  },
  workspace: {},
  StatusBarAlignment: { Right: 2 },
  ViewColumn: { Active: 1, Two: 2 }
};

vi.mock('vscode', () => mockVscode);
vi.mock('wiremd', () => ({
  parse: mockParse,
  renderToHTML: mockRenderToHTML,
  renderToJSON: mockRenderToJSON
}));
vi.mock('../src/preview-provider', () => {
  class WiremdPreviewProvider {
    static readonly viewType = 'wiremd.preview';

    public openPreview = vi.fn();
    public refresh = vi.fn();
    public changeStyle = vi.fn();
    public changeViewport = vi.fn();
    public dispose = vi.fn();

    constructor(_context: unknown) {
      previewProviderInstances.push(this);
    }
  }

  return { WiremdPreviewProvider };
});

function getCommandHandler(name: string): ((...args: unknown[]) => unknown) {
  const registered = mockVscode.commands.registerCommand.mock.calls.find((call) => call[0] === name);
  if (!registered) {
    throw new Error(`Missing command registration for ${name}`);
  }

  return registered[1] as (...args: unknown[]) => unknown;
}

function createMarkdownItCapture() {
  let capturedRule: ((state: { src?: string }) => void) | undefined;
  const md = {
    core: {
      ruler: {
        after: vi.fn((_before: string, _name: string, fn: (state: { src?: string }) => void) => {
          capturedRule = fn;
        })
      }
    }
  };

  return {
    md,
    run: (state: { src?: string }) => capturedRule?.(state)
  };
}

describe('extension coverage branches', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    previewProviderInstances.length = 0;
    mockVscode.window.activeTextEditor = undefined;
    mockVscode.window.showQuickPick.mockResolvedValue(undefined);

    mockParse.mockReturnValue({ type: 'document' });
    mockRenderToJSON.mockReturnValue('{"type":"document"}');
    mockRenderToHTML.mockReturnValue(
      '<style>body { color: #333; }\n* { box-sizing: border-box; }</style><body><h1>Card</h1></body>'
    );
  });

  it('executes preview commands and side-open branch with and without active column', async () => {
    const extension = await import('../src/extension');
    const context = { subscriptions: [] as Array<{ dispose(): void }>, extensionPath: '/tmp/ext' };
    extension.activate(context as never);

    const provider = previewProviderInstances[0];
    expect(provider).toBeDefined();

    getCommandHandler('wiremd.openPreview')();
    expect(provider.openPreview).toHaveBeenCalledWith(mockVscode.ViewColumn.Active);

    mockVscode.window.activeTextEditor = { viewColumn: 4, document: { languageId: 'markdown' } };
    getCommandHandler('wiremd.openPreviewToSide')();
    expect(provider.openPreview).toHaveBeenCalledWith(5);

    mockVscode.window.activeTextEditor = undefined;
    getCommandHandler('wiremd.openPreviewToSide')();
    expect(provider.openPreview).toHaveBeenCalledWith(mockVscode.ViewColumn.Two);

    getCommandHandler('wiremd.refreshPreview')();
    expect(provider.refresh).toHaveBeenCalled();
  });

  it('handles quick-pick branches for style and viewport changes', async () => {
    const extension = await import('../src/extension');
    const context = { subscriptions: [] as Array<{ dispose(): void }>, extensionPath: '/tmp/ext' };
    extension.activate(context as never);

    const provider = previewProviderInstances[0];

    mockVscode.window.showQuickPick.mockResolvedValue('material');
    await getCommandHandler('wiremd.changeStyle')();
    expect(provider.changeStyle).toHaveBeenCalledWith('material');

    mockVscode.window.showQuickPick.mockResolvedValue(undefined);
    await getCommandHandler('wiremd.changeStyle')();
    expect(provider.changeStyle).toHaveBeenCalledTimes(1);

    mockVscode.window.showQuickPick.mockResolvedValue({ label: 'Mobile (375px)', value: 'mobile' });
    await getCommandHandler('wiremd.changeViewport')();
    expect(provider.changeViewport).toHaveBeenCalledWith('mobile');

    mockVscode.window.showQuickPick.mockResolvedValue(undefined);
    await getCommandHandler('wiremd.changeViewport')();
    expect(provider.changeViewport).toHaveBeenCalledTimes(1);
  });

  it('covers status-bar show/hide branches and deactivate with/without provider', async () => {
    const extension = await import('../src/extension');

    extension.deactivate();
    expect(mockOutputChannel.dispose).toHaveBeenCalledTimes(1);

    mockVscode.window.activeTextEditor = { document: { languageId: 'markdown' } };
    const context = { subscriptions: [] as Array<{ dispose(): void }>, extensionPath: '/tmp/ext' };
    extension.activate(context as never);

    const statusBarCallback = mockVscode.window.onDidChangeActiveTextEditor.mock.calls[0][0] as (
      editor: { document: { languageId: string } } | undefined
    ) => void;
    statusBarCallback({ document: { languageId: 'markdown' } });
    statusBarCallback({ document: { languageId: 'plaintext' } });

    expect(mockStatusBarItem.show).toHaveBeenCalled();
    expect(mockStatusBarItem.hide).toHaveBeenCalled();

    const provider = previewProviderInstances[0];
    extension.deactivate();
    expect(provider.dispose).toHaveBeenCalled();
  });

  it('preserves original wiremd fence when parse throws', async () => {
    const extension = await import('../src/extension');
    const { md, run } = createMarkdownItCapture();
    extension.extendMarkdownIt(md);

    mockParse.mockImplementationOnce(() => {
      throw new Error('parse failed');
    });

    const source = '```wiremd\n## Broken\n[Button]\n```';
    const state = { src: source };
    run(state);

    expect(state.src).toBe(source);
    expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(expect.stringContaining('parse error'));
  });

  it('returns full html when render output does not include style/body tags', async () => {
    const extension = await import('../src/extension');
    const { md, run } = createMarkdownItCapture();
    extension.extendMarkdownIt(md);

    mockRenderToHTML.mockReturnValueOnce('<div class="raw-wiremd">raw</div>');

    const state = { src: '```wiremd\n## Card\n[Button]\n```' };
    run(state);

    expect(state.src).toContain('<div class="raw-wiremd">raw</div>');
  });
});
