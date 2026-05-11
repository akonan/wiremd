import { beforeEach, describe, expect, it, vi } from 'vitest';

const monacoMocks = vi.hoisted(() => ({
  defineTheme: vi.fn(),
}));

vi.mock('monaco-editor/esm/vs/editor/editor.api.js', () => ({
  editor: {
    defineTheme: monacoMocks.defineTheme,
  },
}));

describe('editor monaco setup', () => {
  beforeEach(() => {
    vi.resetModules();
    monacoMocks.defineTheme.mockReset();
    vi.stubGlobal('self', globalThis);
    vi.stubGlobal(
      'Worker',
      vi.fn(function WorkerMock(this: unknown, url: URL, options: { type: string }) {
        return { url, options };
      }),
    );
  });

  it('configures workers and theme only once', async () => {
    const monacoModule = await import('../src/monaco.js');

    monacoModule.ensureEditorMonacoSetup();
    monacoModule.ensureEditorMonacoSetup();

    expect(monacoMocks.defineTheme).toHaveBeenCalledTimes(1);
    expect(monacoMocks.defineTheme).toHaveBeenCalledWith(
      monacoModule.EDITOR_MONACO_THEME,
      expect.objectContaining({
        base: 'vs-dark',
      }),
    );

    const worker = (globalThis as typeof globalThis & {
      MonacoEnvironment: {
        getWorker: (_workerId: string, _label: string) => unknown;
      };
    }).MonacoEnvironment.getWorker('1', 'editor');

    expect(globalThis.Worker).toHaveBeenCalledTimes(1);
    expect(worker).toEqual(
      expect.objectContaining({
        options: { type: 'module' },
      }),
    );
  });

  it('returns the shared editor options', async () => {
    const monacoModule = await import('../src/monaco.js');

    expect(monacoModule.getSharedMonacoOptions()).toEqual(
      expect.objectContaining({
        theme: monacoModule.EDITOR_MONACO_THEME,
        fontFamily: monacoModule.EDITOR_MONACO_FONT_FAMILY,
        automaticLayout: true,
        minimap: { enabled: false },
      }),
    );
  });
});
