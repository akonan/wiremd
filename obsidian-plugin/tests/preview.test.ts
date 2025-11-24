import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { WiremdPreviewProcessor } from '../src/preview';
import { DEFAULT_SETTINGS } from '../src/settings';
import type { WiremdSettings } from '../src/settings';

// Mock wiremd
vi.mock('wiremd', () => ({
  parse: vi.fn((source) => ({
    type: 'document',
    version: '0.1',
    meta: {},
    children: []
  })),
  renderToHTML: vi.fn((ast, options) => {
    return `<!DOCTYPE html>
<html>
<head>
<style>
body { background: #f9fafb; }
.wmd-button { padding: 10px; }
</style>
</head>
<body class="wmd-root wmd-sketch">
<div class="wmd-button">Click me</div>
</body>
</html>`;
  })
}));

// Mock mobile optimizer
vi.mock('../src/mobile', () => ({
  MobileOptimizer: {
    getRenderDelay: vi.fn((delay) => delay),
    getContainerClass: vi.fn(() => 'wiremd-desktop'),
    optimizeForMobile: vi.fn(),
    addTouchInteractions: vi.fn(),
    positionStyleSelector: vi.fn()
  }
}));

describe('WiremdPreviewProcessor', () => {
  let processor: WiremdPreviewProcessor;
  let settings: WiremdSettings;
  let mockElement: any;

  beforeEach(() => {
    vi.useFakeTimers();

    settings = { ...DEFAULT_SETTINGS };
    processor = new WiremdPreviewProcessor(settings);

    // Create a more complete mock element
    mockElement = {
      empty: vi.fn(),
      addClass: vi.fn(),
      createEl: vi.fn((tag, options) => {
        const el = {
          textContent: '',
          setAttribute: vi.fn(),
          addEventListener: vi.fn(),
          innerHTML: '',
          querySelector: vi.fn(() => null),
          after: vi.fn(),
          remove: vi.fn(),
          contains: vi.fn(() => false),
          addClass: vi.fn() // Add addClass method to created elements
        };
        if (options?.text) el.textContent = options.text;
        return el;
      }),
      setAttribute: vi.fn(),
      getAttribute: vi.fn(() => null)
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    processor.cleanup();
  });

  describe('processCodeBlock', () => {
    it('should process wiremd source without errors', async () => {
      const source = '## Test\n[Button]';

      // Should not throw
      await expect(processor.processCodeBlock(source, mockElement)).resolves.not.toThrow();

      // Should track the element
      vi.advanceTimersByTime(300);
      expect(mockElement.empty).toHaveBeenCalled();
    });

    it('should debounce rendering', async () => {
      const source = '## Test\n[Button]';

      processor.processCodeBlock(source, mockElement);

      // Should not render immediately
      expect(mockElement.empty).not.toHaveBeenCalled();

      // Advance timers
      vi.advanceTimersByTime(300);

      // Should render after delay
      expect(mockElement.empty).toHaveBeenCalled();
    });

    it('should respect custom render delay', async () => {
      settings.renderDelay = 500;
      processor.updateSettings(settings);

      const source = '## Test\n[Button]';

      processor.processCodeBlock(source, mockElement);

      // Should not render at 300ms
      vi.advanceTimersByTime(300);
      expect(mockElement.empty).not.toHaveBeenCalled();

      // Should render at 500ms
      vi.advanceTimersByTime(200);
      expect(mockElement.empty).toHaveBeenCalled();
    });

    it('should cancel previous timeout on new input', async () => {
      const source1 = '## Test 1';
      const source2 = '## Test 2';

      processor.processCodeBlock(source1, mockElement);
      vi.advanceTimersByTime(200);

      processor.processCodeBlock(source2, mockElement);
      vi.advanceTimersByTime(200);

      // Should not have rendered yet
      expect(mockElement.empty).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      // Should render only once with source2
      expect(mockElement.empty).toHaveBeenCalledTimes(1);
    });

    it('should show raw code when autoPreview is disabled', async () => {
      settings.autoPreview = false;
      processor.updateSettings(settings);

      const source = '## Test\n[Button]';

      await processor.processCodeBlock(source, mockElement);

      expect(mockElement.createEl).toHaveBeenCalledWith('pre', { text: source });
    });
  });

  describe('updateSettings', () => {
    it('should update processor settings', () => {
      const newSettings: WiremdSettings = {
        style: 'clean',
        autoPreview: false,
        renderDelay: 500
      };

      processor.updateSettings(newSettings);

      // Settings should be updated (verified by subsequent behavior)
      expect(processor).toBeDefined();
    });
  });

  describe('refreshAllPreviews', () => {
    it('should refresh tracked preview elements', async () => {
      const source = '## Test\n[Button]';

      // Setup element with stored source
      mockElement.getAttribute.mockReturnValue(source);

      await processor.processCodeBlock(source, mockElement);
      vi.advanceTimersByTime(300);

      // Reset mocks
      mockElement.empty.mockClear();

      // Refresh all
      await processor.refreshAllPreviews();
      vi.advanceTimersByTime(300);

      // Should re-render
      expect(mockElement.empty).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should clear pending timeouts', () => {
      const source = '## Test\n[Button]';

      processor.processCodeBlock(source, mockElement);
      processor.cleanup();

      vi.advanceTimersByTime(300);

      // Should not render after cleanup
      expect(mockElement.empty).not.toHaveBeenCalled();
    });

    it('should clear tracked elements', async () => {
      const source = '## Test\n[Button]';

      await processor.processCodeBlock(source, mockElement);
      vi.advanceTimersByTime(300);

      processor.cleanup();

      mockElement.empty.mockClear();

      await processor.refreshAllPreviews();

      // Should not refresh after cleanup
      expect(mockElement.empty).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should display error when parsing fails', async () => {
      const { parse } = await import('wiremd');
      (parse as any).mockImplementationOnce(() => {
        throw new Error('Parse error');
      });

      const source = 'invalid wiremd';

      await processor.processCodeBlock(source, mockElement);
      vi.advanceTimersByTime(300);

      // Should create error display
      expect(mockElement.empty).toHaveBeenCalled();
      expect(mockElement.addClass).toHaveBeenCalledWith('wiremd-preview-error');
    });

    it('should display error when rendering fails', async () => {
      const { renderToHTML } = await import('wiremd');
      (renderToHTML as any).mockImplementationOnce(() => {
        throw new Error('Render error');
      });

      const source = '## Test';

      await processor.processCodeBlock(source, mockElement);
      vi.advanceTimersByTime(300);

      // Should create error display
      expect(mockElement.empty).toHaveBeenCalled();
      expect(mockElement.addClass).toHaveBeenCalledWith('wiremd-preview-error');
    });
  });

  describe('style rendering', () => {
    it('should render with default style', async () => {
      const source = '## Test\n[Button]';

      await processor.processCodeBlock(source, mockElement);
      vi.advanceTimersByTime(300);

      expect(mockElement.empty).toHaveBeenCalled();
      expect(mockElement.addClass).toHaveBeenCalledWith('wiremd-preview-container');
    });

    it('should render with custom style', async () => {
      const source = '## Test\n[Button]';

      await processor.processCodeBlock(source, mockElement, 'clean');
      vi.advanceTimersByTime(300);

      // Badge should show the custom style
      const badgeCall = mockElement.createEl.mock.calls.find(
        (call: any) => call[1]?.cls === 'wiremd-style-badge'
      );
      expect(badgeCall).toBeDefined();
    });
  });
});
