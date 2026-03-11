import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeDocument, FakeElement, FakeWindow } from './helpers/fake-dom.js';

const mainMocks = vi.hoisted(() => ({
  initEditor: vi.fn(),
  createPreview: vi.fn(),
  initToolbar: vi.fn(),
  showToast: vi.fn(),
}));

vi.mock('../src/editor.js', () => ({
  initEditor: mainMocks.initEditor,
}));

vi.mock('../src/preview.js', () => ({
  createPreview: mainMocks.createPreview,
}));

vi.mock('../src/toolbar.js', () => ({
  initToolbar: mainMocks.initToolbar,
  showToast: mainMocks.showToast,
}));

vi.mock('../src/styles/playground.css', () => ({}));

describe('playground main bootstrap', () => {
  beforeEach(() => {
    vi.resetModules();
    mainMocks.initEditor.mockReset();
    mainMocks.createPreview.mockReset();
    mainMocks.initToolbar.mockReset();
    mainMocks.showToast.mockReset();
  });

  function setupDom() {
    const document = new FakeDocument();
    const window = new FakeWindow();

    const requiredIds = [
      'monaco-container',
      'preview-iframe',
      'html-output',
      'error-bar',
      'error-message',
      'style-select',
      'preview-tabs',
      'copy-html-btn',
      'examples-dropdown',
      'toast',
      'divider',
      'editor-panel',
    ] as const;

    const elements = Object.fromEntries(
      requiredIds.map((id) => [id, document.registerElement(id, document.createElement('div'))]),
    ) as Record<(typeof requiredIds)[number], FakeElement>;

    const mainContainer = document.createElement('main');
    mainContainer.setBoundingClientRect({ left: 0, top: 0, width: 1000, height: 800 });
    mainContainer.appendChild(elements['editor-panel']);
    mainContainer.appendChild(elements['divider']);
    elements['editor-panel'].parentElement = mainContainer;

    elements['preview-tabs'].appendChild(document.createElement('button'));
    elements['copy-html-btn'].tagName;

    document.body.appendChild(mainContainer);
    vi.stubGlobal('document', document);
    vi.stubGlobal('window', window);
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    return { document, window, elements };
  }

  it('boots the playground and wires toolbar callbacks', async () => {
    const { document, window, elements } = setupDom();
    const editor = {
      setValue: vi.fn(),
      getValue: vi.fn(() => 'Current markdown'),
      layout: vi.fn(),
      flushPendingChange: vi.fn(),
    };
    const preview = {
      render: vi.fn(),
      setStyle: vi.fn(),
      setTab: vi.fn(),
      getHTML: vi.fn(() => ''),
      state: {},
    };

    mainMocks.initEditor.mockReturnValue(editor);
    mainMocks.createPreview.mockReturnValue(preview);

    await import('../src/main.js');

    expect(mainMocks.createPreview).toHaveBeenCalledTimes(1);
    expect(mainMocks.initEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        container: elements['monaco-container'],
      }),
    );
    expect(mainMocks.initToolbar).toHaveBeenCalledTimes(1);
    expect(editor.layout).toHaveBeenCalledTimes(1);
    expect(elements['editor-panel'].style.width).toBe('50%');
    expect(elements['copy-html-btn'].disabled).toBe(true);
    expect(editor.setValue).toHaveBeenCalledTimes(1);

    const toolbarOptions = mainMocks.initToolbar.mock.calls[0][0];
    toolbarOptions.onStyleChange('clean');
    expect(preview.setStyle).toHaveBeenCalledWith('clean');
    expect(preview.render).toHaveBeenCalledWith('Current markdown');

    toolbarOptions.onTabChange('html');
    expect(preview.setTab).toHaveBeenCalledWith('html');

    await toolbarOptions.onCopy();
    expect(editor.flushPendingChange).toHaveBeenCalledTimes(1);
    expect(mainMocks.showToast).toHaveBeenCalledWith(elements['toast'], 'Nothing to copy');

    preview.getHTML.mockReturnValue('<div>copied</div>');
    await toolbarOptions.onCopy();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('<div>copied</div>');
    expect(mainMocks.showToast).toHaveBeenCalledWith(elements['toast'], 'Copied to clipboard!');

    elements['divider'].dispatchEvent('pointerdown', { pointerId: 1 });
    document.dispatchEvent('pointermove', { pointerId: 1, clientX: 700, clientY: 0 });
    document.dispatchEvent('pointerup', { pointerId: 1 });

    expect(elements['editor-panel'].style.width).toBe('70%');
    expect(editor.layout).toHaveBeenCalledTimes(2);
    expect(elements['divider'].classList.contains('pg-divider--active')).toBe(false);

    window.innerWidth = 600;
    window.dispatchEvent('resize');
    expect(elements['editor-panel'].style.width).toBe('100%');
    expect(elements['editor-panel'].style.height).toBe('50%');
  });
});
