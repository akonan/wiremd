import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { WiremdExporter } from '../src/export';

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
<head><style>.test { color: red; }</style></head>
<body><div>Rendered content</div></body>
</html>`;
  })
}));

describe('WiremdExporter', () => {
  let mockCreateElement: any;
  let mockAppendChild: any;
  let mockRemoveChild: any;
  let mockClick: any;

  beforeEach(() => {
    // Mock DOM APIs for file download
    mockClick = vi.fn();
    mockCreateElement = vi.spyOn(document, 'createElement').mockReturnValue({
      click: mockClick,
      href: '',
      download: '',
      style: {}
    } as any);

    mockAppendChild = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
    mockRemoveChild = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);

    // Mock URL APIs
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    // Mock Blob
    global.Blob = vi.fn((parts, options) => ({
      parts,
      options
    })) as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('exportAsHTML', () => {
    it('should export wiremd as HTML file', async () => {
      const source = '## Test\n[Button]';

      await WiremdExporter.exportAsHTML(source, 'sketch', 'test.html');

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockClick).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('should use provided filename', async () => {
      const source = '## Test\n[Button]';
      const filename = 'my-wireframe.html';

      const linkElement = { click: mockClick, href: '', download: '', style: {} };
      mockCreateElement.mockReturnValue(linkElement);

      await WiremdExporter.exportAsHTML(source, 'sketch', filename);

      expect(linkElement.download).toBe(filename);
    });

    it('should generate filename if not provided', async () => {
      const source = '## Test\n[Button]';

      const linkElement = { click: mockClick, href: '', download: '', style: {} };
      mockCreateElement.mockReturnValue(linkElement);

      await WiremdExporter.exportAsHTML(source, 'sketch');

      expect(linkElement.download).toMatch(/^wiremd-export-\d+\.html$/);
    });

    it('should handle different styles', async () => {
      const source = '## Test\n[Button]';
      const styles = ['sketch', 'clean', 'wireframe'] as const;

      for (const style of styles) {
        await WiremdExporter.exportAsHTML(source, style);
        expect(mockClick).toHaveBeenCalled();
        mockClick.mockClear();
      }
    });
  });

  describe('exportAllStyles', () => {
    it('should export wiremd with all 7 styles', async () => {
      const source = '## Test\n[Button]';

      await WiremdExporter.exportAllStyles(source, 'test');

      // Should create 7 files (one for each style)
      expect(mockClick).toHaveBeenCalledTimes(7);
    });

    it('should use base filename for each export', async () => {
      const source = '## Test\n[Button]';
      const baseFilename = 'my-wireframe';

      const linkElements: any[] = [];
      mockCreateElement.mockImplementation(() => {
        const el = { click: mockClick, href: '', download: '', style: {} };
        linkElements.push(el);
        return el;
      });

      await WiremdExporter.exportAllStyles(source, baseFilename);

      // Check that each file has the correct naming pattern
      const downloads = linkElements.map(el => el.download);
      expect(downloads).toContain(`${baseFilename}-sketch.html`);
      expect(downloads).toContain(`${baseFilename}-clean.html`);
      expect(downloads).toContain(`${baseFilename}-wireframe.html`);
      expect(downloads).toContain(`${baseFilename}-tailwind.html`);
      expect(downloads).toContain(`${baseFilename}-material.html`);
      expect(downloads).toContain(`${baseFilename}-brutal.html`);
      expect(downloads).toContain(`${baseFilename}-none.html`);
    });
  });

  describe('copyToClipboard', () => {
    beforeEach(() => {
      // Mock clipboard API
      global.navigator.clipboard = {
        writeText: vi.fn().mockResolvedValue(undefined)
      } as any;
    });

    it('should copy HTML to clipboard', async () => {
      const source = '## Test\n[Button]';

      await WiremdExporter.copyToClipboard(source, 'sketch');

      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      const copiedText = (navigator.clipboard.writeText as any).mock.calls[0][0];
      expect(copiedText).toContain('<!DOCTYPE html>');
      expect(copiedText).toContain('<body>');
    });

    it('should handle different styles', async () => {
      const source = '## Test\n[Button]';

      await WiremdExporter.copyToClipboard(source, 'clean');

      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle export errors gracefully', async () => {
      const { parse } = await import('wiremd');
      (parse as any).mockImplementationOnce(() => {
        throw new Error('Parse error');
      });

      await expect(
        WiremdExporter.exportAsHTML('invalid', 'sketch')
      ).rejects.toThrow('Parse error');
    });

    it('should handle clipboard errors gracefully', async () => {
      global.navigator.clipboard = {
        writeText: vi.fn().mockRejectedValue(new Error('Clipboard error'))
      } as any;

      await expect(
        WiremdExporter.copyToClipboard('## Test', 'sketch')
      ).rejects.toThrow('Clipboard error');
    });
  });
});
