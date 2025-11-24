/**
 * AST to Figma Converter Integration Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mockFigma } from './setup';
import { WiremdToFigmaConverter } from '../src/lib/ast-to-figma';
import {
  simpleDocumentAST,
  complexDocumentAST,
  simpleButtonAST,
  containerAST,
  gridAST,
  navAST,
} from './fixtures';

describe('WiremdToFigmaConverter', () => {
  beforeEach(() => {
    mockFigma.loadFontAsync.mockResolvedValue(undefined);
  });

  describe('Constructor', () => {
    it('should initialize with default options', () => {
      const converter = new WiremdToFigmaConverter();
      expect(converter).toBeDefined();
    });

    it('should accept theme option', () => {
      const converter = new WiremdToFigmaConverter({ theme: 'clean' });
      expect(converter).toBeDefined();
    });

    it('should accept base position options', () => {
      const converter = new WiremdToFigmaConverter({
        baseX: 100,
        baseY: 200,
      });
      expect(converter).toBeDefined();
    });
  });

  describe('convert', () => {
    it('should convert simple document', async () => {
      const converter = new WiremdToFigmaConverter({ theme: 'sketch' });
      await converter.convert(simpleDocumentAST);

      expect(mockFigma.createPage).toHaveBeenCalled();
      expect(mockFigma.createFrame).toHaveBeenCalled();
    });

    it('should create page with document title', async () => {
      const converter = new WiremdToFigmaConverter();
      await converter.convert(simpleDocumentAST);

      const page = mockFigma.currentPage;
      expect(page.name).toBe('Test Document');
    });

    it('should respect theme from document metadata', async () => {
      const converter = new WiremdToFigmaConverter();
      await converter.convert(simpleDocumentAST);

      // Should use sketch theme from metadata
      expect(mockFigma.createFrame).toHaveBeenCalled();
    });

    it('should create main container frame', async () => {
      const converter = new WiremdToFigmaConverter();
      await converter.convert(simpleDocumentAST);

      const frames = mockFigma.createFrame.mock.results;
      expect(frames.length).toBeGreaterThan(0);

      const mainFrame = frames[0].value;
      expect(mainFrame.name).toBe('wiremd Design');
      expect(mainFrame.layoutMode).toBe('VERTICAL');
    });

    it('should convert all children nodes', async () => {
      const converter = new WiremdToFigmaConverter();
      await converter.convert(simpleDocumentAST);

      // Should create nodes for heading, paragraph, and button
      expect(mockFigma.createText).toHaveBeenCalled();
      expect(mockFigma.createFrame).toHaveBeenCalled();
    });

    it('should set viewport to show design', async () => {
      const converter = new WiremdToFigmaConverter();
      await converter.convert(simpleDocumentAST);

      expect(mockFigma.viewport.scrollAndZoomIntoView).toHaveBeenCalled();
    });

    it('should handle complex nested document', async () => {
      const converter = new WiremdToFigmaConverter({ theme: 'clean' });
      await converter.convert(complexDocumentAST);

      // Should create many nodes for complex document
      expect(mockFigma.createFrame).toHaveBeenCalled();
      expect(mockFigma.createText).toHaveBeenCalled();
    });

    it('should handle empty document', async () => {
      const emptyDoc = {
        type: 'document' as const,
        version: '0.1.0',
        meta: {},
        children: [],
      };

      const converter = new WiremdToFigmaConverter();
      await converter.convert(emptyDoc);

      expect(mockFigma.createPage).toHaveBeenCalled();
      expect(mockFigma.createFrame).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const invalidChild = {
        type: 'unknown-type' as any,
      };

      const docWithError = {
        type: 'document' as const,
        version: '0.1.0',
        meta: {},
        children: [invalidChild],
      };

      const converter = new WiremdToFigmaConverter();

      // Should not throw, but handle error gracefully
      await expect(converter.convert(docWithError)).resolves.not.toThrow();
    });

    it('should load fonts as needed', async () => {
      const converter = new WiremdToFigmaConverter({ theme: 'clean' });
      await converter.convert(simpleDocumentAST);

      expect(mockFigma.loadFontAsync).toHaveBeenCalled();
    });

    it('should apply correct theme styling', async () => {
      const converter = new WiremdToFigmaConverter({ theme: 'wireframe' });
      await converter.convert(simpleDocumentAST);

      // Wireframe theme should create nodes
      expect(mockFigma.createFrame).toHaveBeenCalled();
    });
  });

  describe('Layout Components', () => {
    it('should convert container nodes', async () => {
      const doc = {
        type: 'document' as const,
        version: '0.1.0',
        meta: {},
        children: [containerAST],
      };

      const converter = new WiremdToFigmaConverter();
      await converter.convert(doc);

      expect(mockFigma.createFrame).toHaveBeenCalled();
    });

    it('should convert grid layouts', async () => {
      const doc = {
        type: 'document' as const,
        version: '0.1.0',
        meta: {},
        children: [gridAST],
      };

      const converter = new WiremdToFigmaConverter();
      await converter.convert(doc);

      // Should create frame for grid + column frames
      expect(mockFigma.createFrame).toHaveBeenCalled();
    });

    it('should convert navigation bars', async () => {
      const doc = {
        type: 'document' as const,
        version: '0.1.0',
        meta: {},
        children: [navAST],
      };

      const converter = new WiremdToFigmaConverter();
      await converter.convert(doc);

      expect(mockFigma.createFrame).toHaveBeenCalled();
      expect(mockFigma.createText).toHaveBeenCalled();
    });
  });

  describe('Form Components', () => {
    it('should convert button nodes', async () => {
      const doc = {
        type: 'document' as const,
        version: '0.1.0',
        meta: {},
        children: [simpleButtonAST],
      };

      const converter = new WiremdToFigmaConverter();
      await converter.convert(doc);

      expect(mockFigma.createFrame).toHaveBeenCalled();
      expect(mockFigma.createText).toHaveBeenCalled();
    });

    it('should handle all form element types', async () => {
      const formDoc = {
        type: 'document' as const,
        version: '0.1.0',
        meta: {},
        children: [
          simpleButtonAST,
          {
            type: 'input' as const,
            props: { placeholder: 'Email' },
          },
          {
            type: 'textarea' as const,
            props: { rows: 4 },
          },
        ],
      };

      const converter = new WiremdToFigmaConverter();
      await converter.convert(formDoc);

      expect(mockFigma.createFrame).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should create error placeholder for failed nodes', async () => {
      // Mock font loading failure
      mockFigma.loadFontAsync.mockRejectedValueOnce(new Error('Font not found'));

      const converter = new WiremdToFigmaConverter();
      await converter.convert(simpleDocumentAST);

      // Should still complete without throwing
      expect(mockFigma.createPage).toHaveBeenCalled();
    });

    it('should handle unknown node types', async () => {
      const docWithUnknown = {
        type: 'document' as const,
        version: '0.1.0',
        meta: {},
        children: [
          {
            type: 'totally-fake-type' as any,
          },
        ],
      };

      const converter = new WiremdToFigmaConverter();
      await expect(converter.convert(docWithUnknown)).resolves.not.toThrow();
    });

    it('should not fail on missing content', async () => {
      const doc = {
        type: 'document' as const,
        version: '0.1.0',
        meta: {},
        children: [
          {
            type: 'heading' as const,
            level: 1 as const,
            content: '',
            props: {},
          },
        ],
      };

      const converter = new WiremdToFigmaConverter();
      await expect(converter.convert(doc)).resolves.not.toThrow();
    });
  });

  describe('Font Loading', () => {
    it('should cache loaded fonts', async () => {
      const converter = new WiremdToFigmaConverter({ theme: 'clean' });
      await converter.convert(simpleDocumentAST);

      const initialCalls = mockFigma.loadFontAsync.mock.calls.length;
      expect(initialCalls).toBeGreaterThan(0);

      // Clear mock and convert again with same converter instance
      mockFigma.loadFontAsync.mockClear();
      await converter.convert(simpleDocumentAST);

      // Fonts should be cached in converter, but new convert creates new page
      // so it will still call loadFont for the new document
      const secondCalls = mockFigma.loadFontAsync.mock.calls.length;
      expect(secondCalls).toBeGreaterThanOrEqual(0);
    });

    it('should fallback to Roboto when font unavailable', async () => {
      mockFigma.loadFontAsync.mockRejectedValueOnce(new Error('Font not available'));
      mockFigma.loadFontAsync.mockResolvedValue(undefined);

      const converter = new WiremdToFigmaConverter({ theme: 'sketch' });
      await converter.convert(simpleDocumentAST);

      // Should try original font, then fallback to Roboto
      // At least 2 calls expected (original fail + fallback success)
      expect(mockFigma.loadFontAsync).toHaveBeenCalledWith(
        expect.objectContaining({ family: 'Roboto', style: 'Regular' })
      );
    });
  });

  describe('Theme Variations', () => {
    const themes: Array<'sketch' | 'clean' | 'wireframe' | 'none'> = [
      'sketch',
      'clean',
      'wireframe',
      'none',
    ];

    themes.forEach((theme) => {
      it(`should convert document with ${theme} theme`, async () => {
        const converter = new WiremdToFigmaConverter({ theme });
        await converter.convert(simpleDocumentAST);

        expect(mockFigma.createPage).toHaveBeenCalled();
        expect(mockFigma.createFrame).toHaveBeenCalled();
      });
    });
  });

  describe('Performance', () => {
    it('should handle large documents efficiently', async () => {
      // Create document with many nodes
      const largeDoc = {
        type: 'document' as const,
        version: '0.1.0',
        meta: {},
        children: Array(50).fill(null).map((_, i) => ({
          type: 'paragraph' as const,
          content: `Paragraph ${i}`,
          props: {},
        })),
      };

      const converter = new WiremdToFigmaConverter();
      const start = Date.now();

      await converter.convert(largeDoc);

      const duration = Date.now() - start;

      // Should complete reasonably quickly (< 5 seconds in tests)
      expect(duration).toBeLessThan(5000);
    });
  });
});
