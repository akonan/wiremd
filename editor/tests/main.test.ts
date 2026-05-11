import { beforeEach, describe, expect, it, vi } from 'vitest';
import { encodeShareHash } from '../src/url-share.js';
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

vi.mock('../src/styles/editor.css', () => ({}));

describe('editor main bootstrap', () => {
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
      'copy-link-btn',
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

  it('boots the editor and wires toolbar callbacks', async () => {
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
    expect(elements['divider'].classList.contains('ed-divider--active')).toBe(false);

    window.innerWidth = 600;
    window.dispatchEvent('resize');
    expect(elements['editor-panel'].style.width).toBe('100%');
    expect(elements['editor-panel'].style.height).toBe('50%');
  });

  it('loads content from the URL hash when present', async () => {
    const { window } = setupDom();
    const sharedMd = '# Shared from URL\n\n[Click me]*';
    window.location.hash = encodeShareHash(sharedMd);

    const editor = {
      setValue: vi.fn(),
      getValue: vi.fn(() => sharedMd),
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

    expect(editor.setValue).toHaveBeenCalledTimes(1);
    expect(editor.setValue).toHaveBeenCalledWith(sharedMd);
    expect(mainMocks.showToast).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining('Could not load'),
    );
  });

  it('falls back to the default example and warns when the hash is malformed', async () => {
    const { window, elements } = setupDom();
    window.location.hash = '#code=!!garbage!!';

    const editor = {
      setValue: vi.fn(),
      getValue: vi.fn(() => ''),
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

    expect(editor.setValue).toHaveBeenCalledTimes(1);
    expect(editor.setValue.mock.calls[0][0]).not.toBe('');
    expect(mainMocks.showToast).toHaveBeenCalledWith(
      elements['toast'],
      'Could not load shared link — opening default',
    );
  });

  it('syncs the URL hash when the buffer changes after boot', async () => {
    const { window } = setupDom();

    let onChange: (value: string) => void = () => {};
    const editor = {
      setValue: vi.fn(),
      getValue: vi.fn(() => ''),
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

    mainMocks.initEditor.mockImplementation((opts: { onChange: (v: string) => void }) => {
      onChange = opts.onChange;
      return editor;
    });
    mainMocks.createPreview.mockReturnValue(preview);

    await import('../src/main.js');

    // Boot-time setValue → onChange fires but should NOT write hash (isInitializing).
    expect(window.history.calls.length).toBe(0);

    // Simulate a user edit after boot.
    onChange('# Typed after boot');
    expect(window.history.calls.length).toBe(1);
    expect(window.history.calls[0].url).toContain('#code=');

    // Clearing the buffer should clear the hash.
    onChange('');
    expect(window.history.calls.length).toBe(2);
    expect(window.history.calls[1].url).not.toContain('#');
  });

  it('onCopyLink flushes pending changes, syncs URL and copies location.href', async () => {
    const { window, elements } = setupDom();

    const editor = {
      setValue: vi.fn(),
      getValue: vi.fn(() => '# Title'),
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

    const toolbarOptions = mainMocks.initToolbar.mock.calls[0][0];
    expect(typeof toolbarOptions.onCopyLink).toBe('function');
    expect(toolbarOptions.copyLinkBtn).toBe(elements['copy-link-btn']);

    await toolbarOptions.onCopyLink();

    expect(editor.flushPendingChange).toHaveBeenCalledTimes(1);
    expect(window.history.calls.length).toBe(1);
    expect(window.history.calls[0].url).toContain('#code=');
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);
    expect(mainMocks.showToast).toHaveBeenCalledWith(elements['toast'], 'Link copied!');
  });
});
