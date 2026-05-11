import { beforeEach, describe, expect, it, vi } from 'vitest';

const editorMocks = vi.hoisted(() => {
  const state = {
    value: '',
    changeListener: undefined as undefined | (() => void),
    editor: {
      onDidChangeModelContent: vi.fn((listener: () => void) => {
        state.changeListener = listener;
      }),
      getValue: vi.fn(() => state.value),
      setValue: vi.fn((value: string) => {
        state.value = value;
      }),
      layout: vi.fn(),
    },
    create: vi.fn(() => state.editor),
    getLanguages: vi.fn(() => [] as Array<{ id: string }>),
    register: vi.fn(),
    setMonarchTokensProvider: vi.fn(),
    ensureSetup: vi.fn(),
    getOptions: vi.fn(() => ({
      theme: 'wiremd-dark',
      automaticLayout: true,
    })),
  };

  return state;
});

vi.mock('monaco-editor/esm/vs/editor/editor.api.js', () => ({
  editor: {
    create: editorMocks.create,
  },
  languages: {
    getLanguages: editorMocks.getLanguages,
    register: editorMocks.register,
    setMonarchTokensProvider: editorMocks.setMonarchTokensProvider,
  },
}));

vi.mock('../src/monaco.js', () => ({
  ensureEditorMonacoSetup: editorMocks.ensureSetup,
  getSharedMonacoOptions: editorMocks.getOptions,
}));

describe('editor editor', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    editorMocks.value = '';
    editorMocks.changeListener = undefined;
    editorMocks.create.mockClear();
    editorMocks.getLanguages.mockClear();
    editorMocks.register.mockClear();
    editorMocks.setMonarchTokensProvider.mockClear();
    editorMocks.ensureSetup.mockClear();
    editorMocks.getOptions.mockClear();
    editorMocks.editor.onDidChangeModelContent.mockClear();
    editorMocks.editor.getValue.mockClear();
    editorMocks.editor.setValue.mockClear();
    editorMocks.editor.layout.mockClear();
  });

  it('initializes monaco with the wiremd language', async () => {
    const { initEditor } = await import('../src/editor.js');
    const onChange = vi.fn();
    const container = {} as HTMLElement;

    initEditor({
      container,
      onChange,
      initialValue: 'Initial value',
    });

    expect(editorMocks.ensureSetup).toHaveBeenCalledTimes(1);
    expect(editorMocks.register).toHaveBeenCalledWith({ id: 'wiremd' });
    expect(editorMocks.setMonarchTokensProvider).toHaveBeenCalledTimes(1);
    expect(editorMocks.create).toHaveBeenCalledWith(
      container,
      expect.objectContaining({
        value: 'Initial value',
        language: 'wiremd',
        fontSize: 13,
      }),
    );
  });

  it('debounces editor changes before notifying the preview', async () => {
    const { initEditor } = await import('../src/editor.js');
    const onChange = vi.fn();

    initEditor({
      container: {} as HTMLElement,
      onChange,
    });

    editorMocks.value = 'Draft value';
    editorMocks.changeListener?.();

    vi.advanceTimersByTime(199);
    expect(onChange).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onChange).toHaveBeenCalledWith('Draft value');
  });

  it('setValue cancels pending debounced work and avoids duplicate change events', async () => {
    const { initEditor } = await import('../src/editor.js');
    const onChange = vi.fn();

    const editor = initEditor({
      container: {} as HTMLElement,
      onChange,
    });

    editorMocks.value = 'Pending value';
    editorMocks.changeListener?.();

    editor.setValue('Manual update');
    editorMocks.changeListener?.();
    vi.advanceTimersByTime(200);

    expect(editorMocks.editor.setValue).toHaveBeenCalledWith('Manual update');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('Manual update');
  });

  it('flushes pending changes and proxies layout/getValue', async () => {
    const { initEditor } = await import('../src/editor.js');
    const onChange = vi.fn();

    const editor = initEditor({
      container: {} as HTMLElement,
      onChange,
    });

    editorMocks.value = 'Pending value';
    editorMocks.changeListener?.();
    editor.flushPendingChange();

    expect(onChange).toHaveBeenCalledWith('Pending value');

    editorMocks.value = 'Current value';
    expect(editor.getValue()).toBe('Current value');

    editor.layout();
    expect(editorMocks.editor.layout).toHaveBeenCalledTimes(1);
  });
});
