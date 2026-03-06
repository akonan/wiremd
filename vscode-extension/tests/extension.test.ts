import { beforeEach, describe, expect, it, vi } from 'vitest';

const createDisposable = () => ({ dispose: vi.fn() });
const mockOutputChannel = { appendLine: vi.fn(), dispose: vi.fn() };
const mockStatusBarItem = { text: '', tooltip: '', command: '', show: vi.fn(), hide: vi.fn(), dispose: vi.fn() };
const mockConfiguration = {
  get: vi.fn((_key: string, defaultValue?: unknown) => defaultValue)
};

const mockVscode = {
  window: {
    createOutputChannel: vi.fn(() => mockOutputChannel),
    registerWebviewPanelSerializer: vi.fn(() => createDisposable()),
    createStatusBarItem: vi.fn(() => mockStatusBarItem),
    onDidChangeActiveTextEditor: vi.fn(() => createDisposable()),
    showQuickPick: vi.fn(),
    showErrorMessage: vi.fn(),
    showWarningMessage: vi.fn(),
    showInformationMessage: vi.fn(),
    activeTextEditor: undefined as undefined | { document: { languageId: string }; viewColumn?: number }
  },
  commands: {
    executeCommand: vi.fn(),
    registerCommand: vi.fn(() => createDisposable())
  },
  workspace: {
    onDidChangeTextDocument: vi.fn(() => createDisposable()),
    onDidChangeConfiguration: vi.fn(() => createDisposable()),
    getConfiguration: vi.fn(() => mockConfiguration)
  },
  StatusBarAlignment: { Right: 2 },
  ViewColumn: { Active: 1, Two: 2 }
};

vi.mock('vscode', () => mockVscode);

describe('extension activation', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mockVscode.window.activeTextEditor = undefined;
  });

  it('activates with preview commands and markdown-it hook', async () => {
    const extension = await import('../src/extension');

    const context = { subscriptions: [] as Array<{ dispose(): void }>, extensionPath: '/tmp/ext' };
    const api = extension.activate(context as never) as {
      extendMarkdownIt?: (md: unknown) => unknown;
    };

    expect(context.subscriptions.length).toBeGreaterThan(6);
    expect(mockVscode.window.registerWebviewPanelSerializer).toHaveBeenCalledTimes(1);
    expect(mockVscode.commands.registerCommand).toHaveBeenCalledTimes(5);
    expect(mockVscode.window.createStatusBarItem).toHaveBeenCalledTimes(1);
    expect(typeof api.extendMarkdownIt).toBe('function');
  });

  it('disposes output channel on deactivate', async () => {
    const extension = await import('../src/extension');

    const context = { subscriptions: [] as Array<{ dispose(): void }>, extensionPath: '/tmp/ext' };
    extension.activate(context as never);
    extension.deactivate();

    expect(mockVscode.window.createOutputChannel).toHaveBeenCalledTimes(1);
    expect(mockOutputChannel.dispose).toHaveBeenCalled();
  });

  it('exports extendMarkdownIt and registers markdown-it rule', async () => {
    const extension = await import('../src/extension');

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

    const extended = extension.extendMarkdownIt(md);
    const state = {
      src: '```wiremd\n## Card\n[Click]\n```'
    };
    capturedRule?.(state);

    expect(extended).toBe(md);
    expect(state.src).toContain('wiremd-preview');
  });

  it('replaces all wiremd fences in markdown source', async () => {
    const extension = await import('../src/extension');

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

    extension.extendMarkdownIt(md);
    const source = [
      '# Title',
      '',
      '```wiremd clean',
      '## A',
      '[Save]',
      '```',
      '',
      'Texto normal',
      '',
      '```wiremd material',
      '## B',
      '[Continue]',
      '```'
    ].join('\n');

    const state = { src: source };
    capturedRule?.(state);

    expect(state.src).not.toContain('```wiremd');
    expect(state.src).toContain('wiremd-preview-1');
    expect(state.src).toContain('wiremd-preview-2');
  });

  it('renders DocumentNode as json for wiremd json fences', async () => {
    const extension = await import('../src/extension');

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

    extension.extendMarkdownIt(md);
    const source = [
      '```wiremd json',
      '## AST',
      '[Button]',
      '```'
    ].join('\n');

    const state = { src: source };
    capturedRule?.(state);

    expect(state.src).toContain('```json');
    expect(state.src).toContain('"type": "document"');
  });

  it('scopes material styles to each block without global body leakage', async () => {
    const extension = await import('../src/extension');

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

    extension.extendMarkdownIt(md);
    const source = [
      '```wiremd material',
      '## Material Card',
      '[Continue]{.primary}',
      '```',
      '',
      '```wiremd clean',
      '## Clean Card',
      '[Save]{.primary}',
      '```'
    ].join('\n');

    const state = { src: source };
    capturedRule?.(state);

    expect(state.src).toContain('.wiremd-preview-1.wmd-1-root');
    expect(state.src).toContain('.wiremd-preview-2.wmd-2-root');
    expect(state.src).not.toMatch(/(^|\n)\s*body\s*\{/);
    expect(state.src).not.toContain('<body');
  });

  it('isolates tailwind and material styles when both appear in one markdown document', async () => {
    const extension = await import('../src/extension');

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

    extension.extendMarkdownIt(md);
    const source = [
      '# Before',
      '',
      '```wiremd tailwind',
      '## Tailwind Card',
      '[Action]{.primary}',
      '```',
      '',
      'Texto intermedio',
      '',
      '```wiremd material',
      '## Material Card',
      '[Continue]{.primary}',
      '```',
      '',
      '# After'
    ].join('\n');

    const state = { src: source };
    capturedRule?.(state);

    expect(state.src).toContain('wiremd-preview-1');
    expect(state.src).toContain('wiremd-preview-2');
    expect(state.src).toContain('wmd-1-tailwind');
    expect(state.src).toContain('wmd-2-material');
    expect(state.src).not.toContain('wmd-1-material');
    expect(state.src).not.toContain('wmd-2-tailwind');
    expect(state.src).not.toMatch(/(^|\n)\s*body\s*\{/);
  });

  it('assigns unique prefixes for 3 blocks with the same style', async () => {
    const extension = await import('../src/extension');

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

    extension.extendMarkdownIt(md);
    const source = [
      '```wiremd clean',
      '## One',
      '[Save]',
      '```',
      '',
      '```wiremd clean',
      '## Two',
      '[Save]',
      '```',
      '',
      '```wiremd clean',
      '## Three',
      '[Save]',
      '```'
    ].join('\n');

    const state = { src: source };
    capturedRule?.(state);

    expect(state.src).toContain('wiremd-preview-1');
    expect(state.src).toContain('wiremd-preview-2');
    expect(state.src).toContain('wiremd-preview-3');
    expect(state.src).toContain('wmd-1-clean');
    expect(state.src).toContain('wmd-2-clean');
    expect(state.src).toContain('wmd-3-clean');
    expect(state.src).not.toContain('wmd-4-clean');
  });

  it('does not cross-reference scoped classes between repeated style blocks', async () => {
    const extension = await import('../src/extension');

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

    extension.extendMarkdownIt(md);
    const source = [
      '```wiremd wireframe',
      '## A',
      '[Button]',
      '```',
      '',
      '```wiremd wireframe',
      '## B',
      '[Button]',
      '```',
      '',
      '```wiremd wireframe',
      '## C',
      '[Button]',
      '```'
    ].join('\n');

    const state = { src: source };
    capturedRule?.(state);

    expect(state.src).toContain('wiremd-preview-1 wmd-1-root wmd-1-wireframe');
    expect(state.src).toContain('wiremd-preview-2 wmd-2-root wmd-2-wireframe');
    expect(state.src).toContain('wiremd-preview-3 wmd-3-root wmd-3-wireframe');
    expect(state.src).not.toContain('wmd-1-root wmd-2-wireframe');
    expect(state.src).not.toContain('wmd-2-root wmd-3-wireframe');
    expect(state.src).not.toContain('wmd-1-root wmd-3-wireframe');
  });

  it('supports CRLF line endings for fence matching and rendering (regression)', async () => {
    const extension = await import('../src/extension');

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

    extension.extendMarkdownIt(md);
    const source = [
      '# Windows EOL',
      '',
      '```wiremd material',
      '## Material CRLF',
      '[Continue]{.primary}',
      '```',
      '',
      '```wiremd json',
      '## Json CRLF',
      '[Button]',
      '```'
    ].join('\r\n');

    const state = { src: source };
    capturedRule?.(state);

    expect(state.src).toContain('wiremd-preview-1');
    expect(state.src).toContain('wmd-1-material');
    expect(state.src).toContain('```json');
    expect(state.src).toContain('"type": "document"');
    expect(state.src).not.toContain('```wiremd');
  });
});
