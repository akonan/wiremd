import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeElement } from './helpers/fake-dom.js';

const previewMocks = vi.hoisted(() => {
  const state = {
    renderMarkup: vi.fn(),
    ensureSetup: vi.fn(),
    getOptions: vi.fn(() => ({ theme: 'wiremd-dark' })),
    htmlEditor: {
      setValue: vi.fn(),
      layout: vi.fn(),
    },
    create: vi.fn(() => state.htmlEditor),
  };

  return state;
});

vi.mock('../src/renderMarkup.js', () => ({
  renderMarkup: previewMocks.renderMarkup,
}));

vi.mock('../src/monaco.js', () => ({
  ensurePlaygroundMonacoSetup: previewMocks.ensureSetup,
  getSharedMonacoOptions: previewMocks.getOptions,
}));

vi.mock('monaco-editor/esm/vs/editor/editor.api.js', () => ({
  editor: {
    create: previewMocks.create,
  },
}));

vi.mock('monaco-editor/esm/vs/basic-languages/html/html.contribution.js', () => ({}));

describe('playground preview', () => {
  beforeEach(() => {
    vi.resetModules();
    previewMocks.renderMarkup.mockReset();
    previewMocks.ensureSetup.mockClear();
    previewMocks.getOptions.mockClear();
    previewMocks.create.mockClear();
    previewMocks.htmlEditor.setValue.mockClear();
    previewMocks.htmlEditor.layout.mockClear();
  });

  function createElements() {
    return {
      iframe: new FakeElement('iframe') as unknown as HTMLIFrameElement,
      htmlOutputContainer: new FakeElement('div') as unknown as HTMLElement,
      errorBar: new FakeElement('div') as unknown as HTMLElement,
      errorMessage: new FakeElement('span') as unknown as HTMLElement,
    };
  }

  it('renders successful HTML into the iframe and state', async () => {
    const { createPreview } = await import('../src/preview.js');
    previewMocks.renderMarkup.mockReturnValue({
      html: '<!DOCTYPE html><body>ok</body>',
      error: null,
    });

    const elements = createElements();
    const preview = createPreview(elements);
    preview.render('# Heading');

    expect(elements.iframe.srcdoc).toBe('<!DOCTYPE html><body>ok</body>');
    expect(preview.getHTML()).toBe('<!DOCTYPE html><body>ok</body>');
    expect(preview.state.lastError).toBeNull();
    expect(elements.errorBar.classList.contains('pg-error--visible')).toBe(false);
  });

  it('shows errors and clears previous HTML when rendering fails', async () => {
    const { createPreview } = await import('../src/preview.js');
    previewMocks.renderMarkup
      .mockReturnValueOnce({
        html: '<!DOCTYPE html><body>ok</body>',
        error: null,
      })
      .mockReturnValueOnce({
        html: '',
        error: 'Parse failed',
      });

    const elements = createElements();
    const preview = createPreview(elements);

    preview.render('ok');
    preview.render('bad');

    expect(preview.getHTML()).toBe('');
    expect(preview.state.lastError).toBe('Parse failed');
    expect(elements.iframe.srcdoc).toBe('');
    expect(elements.errorMessage.textContent).toBe('Parse failed');
    expect(elements.errorBar.classList.contains('pg-error--visible')).toBe(true);
  });

  it('creates the HTML monaco editor lazily and reuses it', async () => {
    const { createPreview } = await import('../src/preview.js');
    previewMocks.renderMarkup.mockReturnValue({
      html: '<!DOCTYPE html><body>lazy</body>',
      error: null,
    });

    const elements = createElements();
    const preview = createPreview(elements);

    preview.render('content');
    preview.setTab('html');
    preview.setTab('html');
    await vi.dynamicImportSettled();

    expect(previewMocks.ensureSetup).toHaveBeenCalledTimes(1);
    expect(previewMocks.create).toHaveBeenCalledTimes(1);
    expect(previewMocks.create).toHaveBeenCalledWith(
      elements.htmlOutputContainer,
      expect.objectContaining({
        value: '<!DOCTYPE html><body>lazy</body>',
        language: 'html',
        readOnly: true,
      }),
    );
    expect(previewMocks.htmlEditor.layout).toHaveBeenCalledTimes(2);

    preview.render('updated');
    expect(previewMocks.htmlEditor.setValue).toHaveBeenCalledWith('<!DOCTYPE html><body>lazy</body>');
  });

  it('toggles between preview and HTML tabs', async () => {
    const { createPreview } = await import('../src/preview.js');
    previewMocks.renderMarkup.mockReturnValue({
      html: '<!DOCTYPE html><body>ok</body>',
      error: null,
    });

    const elements = createElements();
    const preview = createPreview(elements);

    preview.setTab('html');
    await vi.dynamicImportSettled();

    expect(elements.iframe.style.display).toBe('none');
    expect(elements.htmlOutputContainer.style.display).toBe('block');

    preview.setTab('preview');
    expect(elements.iframe.style.display).toBe('block');
    expect(elements.htmlOutputContainer.style.display).toBe('none');
  });
});
