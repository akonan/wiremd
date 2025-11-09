/**
 * Content Components Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mockFigma } from './setup';
import * as ContentComponents from '../src/lib/content-components';
import {
  headingAST,
  paragraphAST,
  imageAST,
  iconAST,
  listAST,
  codeAST,
} from './fixtures';

describe('Content Components', () => {
  const mockLoadFont = async (family: string, style: string) => {
    await mockFigma.loadFontAsync({ family, style });
  };

  const mockConvertNode = async (node: any) => {
    return mockFigma.createText();
  };

  beforeEach(() => {
    mockFigma.loadFontAsync.mockResolvedValue(undefined);
  });

  describe('createHeading', () => {
    it('should create text node for simple heading', async () => {
      const heading = await ContentComponents.createHeading(
        headingAST,
        'clean',
        mockLoadFont
      );

      expect(mockFigma.createText).toHaveBeenCalled();
    });

    it('should use larger font size for H1', async () => {
      const h1 = await ContentComponents.createHeading(
        { ...headingAST, level: 1 },
        'clean',
        mockLoadFont
      );

      if ('fontSize' in h1) {
        expect(h1.fontSize).toBe(48);
      }
    });

    it('should use smaller font size for H6', async () => {
      const h6 = await ContentComponents.createHeading(
        { ...headingAST, level: 6 },
        'clean',
        mockLoadFont
      );

      if ('fontSize' in h6) {
        expect(h6.fontSize).toBe(18);
      }
    });

    it('should load bold font', async () => {
      await ContentComponents.createHeading(
        headingAST,
        'clean',
        mockLoadFont
      );

      expect(mockFigma.loadFontAsync).toHaveBeenCalledWith({
        family: 'Inter',
        style: 'Bold',
      });
    });

    it('should create frame for heading with children', async () => {
      const headingWithChildren = {
        ...headingAST,
        children: [
          {
            type: 'icon' as const,
            props: { name: 'star' },
          },
        ],
      };

      const heading = await ContentComponents.createHeading(
        headingWithChildren,
        'clean',
        mockLoadFont,
        mockConvertNode
      );

      expect(mockFigma.createFrame).toHaveBeenCalled();
    });
  });

  describe('createParagraph', () => {
    it('should create text node for simple paragraph', async () => {
      const paragraph = await ContentComponents.createParagraph(
        paragraphAST,
        'clean',
        mockLoadFont
      );

      expect(mockFigma.createText).toHaveBeenCalled();
    });

    it('should set line height', async () => {
      const paragraph = await ContentComponents.createParagraph(
        paragraphAST,
        'clean',
        mockLoadFont
      );

      if ('lineHeight' in paragraph) {
        expect(paragraph.lineHeight).toBeDefined();
      }
    });

    it('should create frame for paragraph with children', async () => {
      const paragraphWithChildren = {
        ...paragraphAST,
        content: undefined,
        children: [
          {
            type: 'text' as const,
            content: 'Hello ',
          },
          {
            type: 'text' as const,
            content: 'world',
          },
        ],
      };

      const paragraph = await ContentComponents.createParagraph(
        paragraphWithChildren,
        'clean',
        mockLoadFont,
        mockConvertNode
      );

      expect(mockFigma.createFrame).toHaveBeenCalled();
    });
  });

  describe('createText', () => {
    it('should create text node with content', async () => {
      const textNode = { type: 'text' as const, content: 'Hello' };
      const text = await ContentComponents.createText(
        textNode,
        'clean',
        mockLoadFont
      );

      expect(mockFigma.createText).toHaveBeenCalled();
    });

    it('should load appropriate font', async () => {
      const textNode = { type: 'text' as const, content: 'Test' };
      await ContentComponents.createText(textNode, 'clean', mockLoadFont);

      expect(mockFigma.loadFontAsync).toHaveBeenCalledWith({
        family: 'Inter',
        style: 'Regular',
      });
    });
  });

  describe('createImage', () => {
    it('should create rectangle placeholder for image', async () => {
      const image = await ContentComponents.createImage(imageAST, 'clean');

      expect(mockFigma.createRectangle).toHaveBeenCalled();
      expect(image.name).toContain('Image:');
    });

    it('should have default dimensions', async () => {
      const image = await ContentComponents.createImage(imageAST, 'clean');

      expect(image.width).toBeGreaterThan(0);
      expect(image.height).toBeGreaterThan(0);
    });

    it('should have border', async () => {
      const image = await ContentComponents.createImage(imageAST, 'clean');

      expect(image.strokes).toBeDefined();
      expect(image.strokeWeight).toBe(1);
    });

    it('should apply corner radius', async () => {
      const image = await ContentComponents.createImage(imageAST, 'clean');

      expect(image.cornerRadius).toBeGreaterThanOrEqual(0);
    });
  });

  describe('createIcon', () => {
    it('should create text node for icon', async () => {
      const icon = await ContentComponents.createIcon(
        iconAST,
        'clean',
        mockLoadFont
      );

      expect(mockFigma.createText).toHaveBeenCalled();
    });

    it('should use correct icon mapping', async () => {
      const homeIcon = {
        type: 'icon' as const,
        props: { name: 'home' },
      };

      const icon = await ContentComponents.createIcon(
        homeIcon,
        'clean',
        mockLoadFont
      );

      if ('characters' in icon) {
        expect(icon.characters).toBe('🏠');
      }
    });

    it('should respect size prop', async () => {
      const smallIcon = {
        type: 'icon' as const,
        props: { name: 'star', size: 'small' as const },
      };

      const largeIcon = {
        type: 'icon' as const,
        props: { name: 'star', size: 'large' as const },
      };

      const small = await ContentComponents.createIcon(
        smallIcon,
        'clean',
        mockLoadFont
      );
      const large = await ContentComponents.createIcon(
        largeIcon,
        'clean',
        mockLoadFont
      );

      if ('fontSize' in small && 'fontSize' in large) {
        expect(small.fontSize).toBeLessThan(large.fontSize);
      }
    });
  });

  describe('createLink', () => {
    it('should create text node for link', async () => {
      const linkNode = {
        type: 'link' as const,
        href: '/',
        content: 'Click here',
        props: {},
      };

      const link = await ContentComponents.createLink(
        linkNode,
        'clean',
        mockLoadFont
      );

      expect(mockFigma.createText).toHaveBeenCalled();
    });

    it('should apply underline decoration', async () => {
      const linkNode = {
        type: 'link' as const,
        href: '/',
        content: 'Link',
        props: {},
      };

      const link = await ContentComponents.createLink(
        linkNode,
        'clean',
        mockLoadFont
      );

      if ('textDecoration' in link) {
        expect(link.textDecoration).toBe('UNDERLINE');
      }
    });
  });

  describe('createList', () => {
    it('should create vertical frame for list', async () => {
      const list = await ContentComponents.createList(
        listAST,
        'clean',
        mockConvertNode
      );

      expect(mockFigma.createFrame).toHaveBeenCalled();
      expect(list.layoutMode).toBe('VERTICAL');
    });

    it('should handle ordered lists', async () => {
      const orderedList = { ...listAST, ordered: true };
      const list = await ContentComponents.createList(
        orderedList,
        'clean',
        mockConvertNode
      );

      expect(list.name).toBe('Ordered List');
    });

    it('should handle unordered lists', async () => {
      const list = await ContentComponents.createList(
        listAST,
        'clean',
        mockConvertNode
      );

      expect(list.name).toBe('Unordered List');
    });
  });

  describe('createListItem', () => {
    it('should create horizontal frame with bullet', async () => {
      const listItem = {
        type: 'list-item' as const,
        content: 'Item text',
        props: {},
      };

      const item = await ContentComponents.createListItem(
        listItem,
        'clean',
        mockLoadFont
      );

      expect(mockFigma.createFrame).toHaveBeenCalled();
      expect(item.layoutMode).toBe('HORIZONTAL');
      expect(mockFigma.createText).toHaveBeenCalled();
    });
  });

  describe('createBlockquote', () => {
    it('should create frame with padding', async () => {
      const blockquote = {
        type: 'blockquote' as const,
        props: {},
        children: [paragraphAST],
      };

      const quote = await ContentComponents.createBlockquote(
        blockquote,
        'clean',
        mockConvertNode
      );

      expect(mockFigma.createFrame).toHaveBeenCalled();
      expect(quote.paddingLeft).toBeGreaterThan(0);
    });

    it('should have left border accent', async () => {
      const blockquote = {
        type: 'blockquote' as const,
        props: {},
        children: [paragraphAST],
      };

      const quote = await ContentComponents.createBlockquote(
        blockquote,
        'clean',
        mockConvertNode
      );

      expect(quote.strokes).toBeDefined();
      expect(quote.strokeWeight).toBe(4);
    });
  });

  describe('createCode', () => {
    it('should create inline code as text node', async () => {
      const inlineCode = { ...codeAST, inline: true };
      const code = await ContentComponents.createCode(
        inlineCode,
        'clean',
        mockLoadFont
      );

      expect(mockFigma.createText).toHaveBeenCalled();
    });

    it('should create code block as frame', async () => {
      const code = await ContentComponents.createCode(
        codeAST,
        'clean',
        mockLoadFont
      );

      expect(mockFigma.createFrame).toHaveBeenCalled();
    });

    it('should load monospace font', async () => {
      await ContentComponents.createCode(codeAST, 'clean', mockLoadFont);

      expect(mockFigma.loadFontAsync).toHaveBeenCalledWith({
        family: 'Roboto Mono',
        style: 'Regular',
      });
    });
  });

  describe('createSeparator', () => {
    it('should create thin rectangle', async () => {
      const separator = await ContentComponents.createSeparator('clean');

      expect(mockFigma.createRectangle).toHaveBeenCalled();
      expect(separator.name).toBe('Separator');
    });

    it('should have minimal height', async () => {
      const separator = await ContentComponents.createSeparator('clean');

      expect(separator.height).toBe(1);
    });
  });

  describe('createTable', () => {
    it('should create vertical frame for table', async () => {
      const tableNode = {
        type: 'table' as const,
        props: {},
        children: [],
      };

      const table = await ContentComponents.createTable(
        tableNode,
        'clean',
        mockLoadFont,
        mockConvertNode
      );

      expect(mockFigma.createFrame).toHaveBeenCalled();
      expect(table.layoutMode).toBe('VERTICAL');
    });

    it('should have border styling', async () => {
      const tableNode = {
        type: 'table' as const,
        props: {},
        children: [],
      };

      const table = await ContentComponents.createTable(
        tableNode,
        'clean',
        mockLoadFont,
        mockConvertNode
      );

      expect(table.strokes).toBeDefined();
      expect(table.strokeWeight).toBe(1);
    });
  });
});
