/**
 * AST to Figma Converter
 * Converts wiremd AST nodes to Figma design elements
 */

import type { DocumentNode, WiremdNode, ConversionOptions } from './types';
import { getThemeStyles, createSolidPaint, createDropShadow, getTextStyle } from './style-mapper';
import * as FormComponents from './form-components';
import * as ContentComponents from './content-components';

export class WiremdToFigmaConverter {
  private theme: 'sketch' | 'clean' | 'wireframe' | 'none';
  private currentY: number;
  private currentX: number;
  private pageWidth: number = 1440;
  private loadedFonts: Set<string> = new Set();

  constructor(options: ConversionOptions = {}) {
    this.theme = options.theme || 'sketch';
    this.currentX = options.baseX || 0;
    this.currentY = options.baseY || 0;
  }

  async convert(ast: DocumentNode): Promise<void> {
    // Create a new page for the import
    const page = figma.createPage();
    page.name = ast.meta.title || 'wiremd Import';

    // Set theme from metadata if available
    if (ast.meta.theme) {
      this.theme = ast.meta.theme;
    }

    // Create main container frame
    const mainFrame = figma.createFrame();
    mainFrame.name = 'wiremd Design';
    mainFrame.layoutMode = 'VERTICAL';
    mainFrame.primaryAxisSizingMode = 'AUTO';
    mainFrame.counterAxisSizingMode = 'FIXED';
    mainFrame.resize(this.pageWidth, 100);
    mainFrame.itemSpacing = getThemeStyles(this.theme).spacing;
    mainFrame.paddingLeft = 0;
    mainFrame.paddingRight = 0;
    mainFrame.paddingTop = 0;
    mainFrame.paddingBottom = 0;

    const styles = getThemeStyles(this.theme);
    mainFrame.fills = [createSolidPaint(styles.background)];

    // Convert all children
    for (const node of ast.children) {
      try {
        const figmaNode = await this.convertNode(node);
        if (figmaNode) {
          mainFrame.appendChild(figmaNode);
        }
      } catch (error) {
        console.error(`Error converting node:`, error);
        // Create error placeholder
        const errorText = await this.createErrorPlaceholder(`Error: ${error.message}`);
        mainFrame.appendChild(errorText);
      }
    }

    page.appendChild(mainFrame);
    figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView([mainFrame]);
  }

  private async convertNode(node: WiremdNode): Promise<SceneNode | null> {
    switch (node.type) {
      // Layout components
      case 'container':
        return this.createContainer(node);
      case 'grid':
        return this.createGrid(node);
      case 'grid-item':
        return this.createGridItem(node);
      case 'nav':
        return this.createNav(node);
      case 'nav-item':
        return this.createNavItem(node);
      case 'brand':
        return this.createBrand(node);

      // Form components
      case 'button':
        return FormComponents.createButton(node, this.theme, this.loadFont.bind(this), this.convertNode.bind(this));
      case 'input':
        return FormComponents.createInput(node, this.theme, this.loadFont.bind(this));
      case 'textarea':
        return FormComponents.createTextarea(node, this.theme, this.loadFont.bind(this));
      case 'select':
        return FormComponents.createSelect(node, this.theme, this.loadFont.bind(this));
      case 'checkbox':
        return FormComponents.createCheckbox(node, this.theme, this.loadFont.bind(this), this.convertNode.bind(this));
      case 'radio':
        return FormComponents.createRadio(node, this.theme, this.loadFont.bind(this));
      case 'radio-group':
        return FormComponents.createRadioGroup(node, this.theme, this.convertNode.bind(this));

      // Content components
      case 'heading':
        return ContentComponents.createHeading(node, this.theme, this.loadFont.bind(this), this.convertNode.bind(this));
      case 'paragraph':
        return ContentComponents.createParagraph(node, this.theme, this.loadFont.bind(this), this.convertNode.bind(this));
      case 'text':
        return ContentComponents.createText(node, this.theme, this.loadFont.bind(this));
      case 'image':
        return ContentComponents.createImage(node, this.theme);
      case 'icon':
        return ContentComponents.createIcon(node, this.theme, this.loadFont.bind(this));
      case 'link':
        return ContentComponents.createLink(node, this.theme, this.loadFont.bind(this), this.convertNode.bind(this));

      // List components
      case 'list':
        return ContentComponents.createList(node, this.theme, this.convertNode.bind(this));
      case 'list-item':
        return ContentComponents.createListItem(node, this.theme, this.loadFont.bind(this), this.convertNode.bind(this));

      // Table components
      case 'table':
        return ContentComponents.createTable(node, this.theme, this.loadFont.bind(this), this.convertNode.bind(this));

      // Other components
      case 'blockquote':
        return ContentComponents.createBlockquote(node, this.theme, this.convertNode.bind(this));
      case 'code':
        return ContentComponents.createCode(node, this.theme, this.loadFont.bind(this));
      case 'separator':
        return ContentComponents.createSeparator(this.theme);

      default:
        console.warn(`Unknown node type: ${(node as any).type}`);
        return null;
    }
  }

  // ============================================================================
  // Layout Components
  // ============================================================================

  private async createContainer(node: Extract<WiremdNode, { type: 'container' }>): Promise<FrameNode> {
    const frame = figma.createFrame();
    const styles = getThemeStyles(this.theme);

    frame.name = `Container (${node.containerType})`;
    frame.layoutMode = 'VERTICAL';
    frame.primaryAxisSizingMode = 'AUTO';
    frame.counterAxisSizingMode = 'FIXED';
    frame.resize(this.pageWidth, 100);
    frame.itemSpacing = styles.spacing;

    // Apply container-specific styling
    switch (node.containerType) {
      case 'hero':
        frame.paddingLeft = 64;
        frame.paddingRight = 64;
        frame.paddingTop = 80;
        frame.paddingBottom = 80;
        frame.fills = [createSolidPaint(styles.surface)];
        frame.cornerRadius = 0;
        break;

      case 'card':
        frame.counterAxisSizingMode = 'AUTO';
        frame.resize(400, 100);
        frame.cornerRadius = styles.cornerRadius * 1.5;
        frame.paddingLeft = 24;
        frame.paddingRight = 24;
        frame.paddingTop = 24;
        frame.paddingBottom = 24;
        frame.fills = [createSolidPaint(styles.surface)];

        const shadow = createDropShadow(this.theme);
        if (shadow) {
          frame.effects = [shadow];
        }
        break;

      case 'modal':
        frame.counterAxisSizingMode = 'AUTO';
        frame.resize(600, 100);
        frame.cornerRadius = styles.cornerRadius;
        frame.paddingLeft = 32;
        frame.paddingRight = 32;
        frame.paddingTop = 32;
        frame.paddingBottom = 32;
        frame.fills = [createSolidPaint(styles.surface)];

        const modalShadow = createDropShadow(this.theme);
        if (modalShadow) {
          frame.effects = [modalShadow];
        }
        break;

      case 'alert':
        frame.counterAxisSizingMode = 'AUTO';
        frame.resize(this.pageWidth - 128, 100);
        frame.cornerRadius = styles.cornerRadius;
        frame.paddingLeft = 16;
        frame.paddingRight = 16;
        frame.paddingTop = 12;
        frame.paddingBottom = 12;

        // Determine alert color from state
        const alertColor = node.props.state === 'error' ? styles.danger :
                          node.props.state === 'warning' ? { r: 1, g: 0.75, b: 0 } :
                          node.props.state === 'success' ? { r: 0.2, g: 0.8, b: 0.3 } :
                          styles.primary;

        frame.fills = [createSolidPaint(alertColor, 0.1)];
        frame.strokes = [createSolidPaint(alertColor)];
        frame.strokeWeight = 1;
        break;

      case 'section':
      case 'layout':
      default:
        frame.paddingLeft = styles.paddingLarge;
        frame.paddingRight = styles.paddingLarge;
        frame.paddingTop = styles.paddingLarge;
        frame.paddingBottom = styles.paddingLarge;
        frame.fills = [];
        break;
    }

    // Add children
    for (const child of node.children) {
      const childNode = await this.convertNode(child);
      if (childNode) {
        frame.appendChild(childNode);
      }
    }

    return frame;
  }

  private async createGrid(node: Extract<WiremdNode, { type: 'grid' }>): Promise<FrameNode> {
    const frame = figma.createFrame();
    const styles = getThemeStyles(this.theme);

    frame.name = `Grid (${node.columns} columns)`;
    frame.layoutMode = 'HORIZONTAL';
    frame.primaryAxisSizingMode = 'AUTO';
    frame.counterAxisSizingMode = 'AUTO';
    frame.itemSpacing = styles.spacing;
    frame.fills = [];

    const columns = node.columns || 3;
    const itemsPerColumn = Math.ceil(node.children.length / columns);

    // Create column frames
    for (let colIndex = 0; colIndex < columns; colIndex++) {
      const column = figma.createFrame();
      column.name = `Column ${colIndex + 1}`;
      column.layoutMode = 'VERTICAL';
      column.primaryAxisSizingMode = 'AUTO';
      column.counterAxisSizingMode = 'AUTO';
      column.itemSpacing = styles.spacing;
      column.fills = [];

      const startIdx = colIndex * itemsPerColumn;
      const endIdx = Math.min(startIdx + itemsPerColumn, node.children.length);

      for (let i = startIdx; i < endIdx; i++) {
        const childNode = await this.convertNode(node.children[i]);
        if (childNode) {
          column.appendChild(childNode);
        }
      }

      // Only add column if it has children
      if (column.children.length > 0) {
        frame.appendChild(column);
      } else {
        column.remove();
      }
    }

    return frame;
  }

  private async createGridItem(node: Extract<WiremdNode, { type: 'grid-item' }>): Promise<FrameNode> {
    const frame = figma.createFrame();
    const styles = getThemeStyles(this.theme);

    frame.name = 'Grid Item';
    frame.layoutMode = 'VERTICAL';
    frame.primaryAxisSizingMode = 'AUTO';
    frame.counterAxisSizingMode = 'AUTO';
    frame.itemSpacing = styles.spacing;
    frame.fills = [];

    for (const child of node.children) {
      const childNode = await this.convertNode(child);
      if (childNode) {
        frame.appendChild(childNode);
      }
    }

    return frame;
  }

  private async createNav(node: Extract<WiremdNode, { type: 'nav' }>): Promise<FrameNode> {
    const frame = figma.createFrame();
    const styles = getThemeStyles(this.theme);

    frame.name = 'Navigation';
    frame.layoutMode = 'HORIZONTAL';
    frame.primaryAxisSizingMode = 'FIXED';
    frame.counterAxisSizingMode = 'AUTO';
    frame.resize(this.pageWidth, 60);
    frame.itemSpacing = styles.spacing * 2;
    frame.paddingLeft = styles.paddingLarge;
    frame.paddingRight = styles.paddingLarge;
    frame.paddingTop = styles.paddingMedium;
    frame.paddingBottom = styles.paddingMedium;
    frame.fills = [createSolidPaint(styles.surface)];

    // Add subtle bottom border
    frame.strokes = [createSolidPaint(styles.border)];
    frame.strokeWeight = 1;
    frame.strokeAlign = 'INSIDE';

    for (const child of node.children) {
      const childNode = await this.convertNode(child);
      if (childNode) {
        frame.appendChild(childNode);
      }
    }

    return frame;
  }

  private async createNavItem(node: Extract<WiremdNode, { type: 'nav-item' }>): Promise<FrameNode> {
    const frame = figma.createFrame();
    const styles = getThemeStyles(this.theme);

    frame.name = 'Nav Item';
    frame.layoutMode = 'HORIZONTAL';
    frame.primaryAxisSizingMode = 'AUTO';
    frame.counterAxisSizingMode = 'AUTO';
    frame.itemSpacing = 8;
    frame.paddingLeft = styles.paddingSmall;
    frame.paddingRight = styles.paddingSmall;
    frame.paddingTop = styles.paddingSmall;
    frame.paddingBottom = styles.paddingSmall;
    frame.fills = [];

    // Extract content from children or use content prop
    let content = node.content || '';
    if (node.children && node.children.length > 0) {
      // If has children, render them
      for (const child of node.children) {
        const childNode = await this.convertNode(child);
        if (childNode) {
          frame.appendChild(childNode);
        }
      }
    } else {
      // Create text node
      const text = figma.createText();
      const textStyle = getTextStyle(this.theme, 16, false);
      await this.loadFont(textStyle.fontFamily, textStyle.fontStyle);
      text.characters = content;
      text.fontSize = textStyle.fontSize;
      text.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
      text.fills = [createSolidPaint(styles.text)];
      frame.appendChild(text);
    }

    return frame;
  }

  private async createBrand(node: Extract<WiremdNode, { type: 'brand' }>): Promise<FrameNode> {
    const frame = figma.createFrame();
    const styles = getThemeStyles(this.theme);

    frame.name = 'Brand';
    frame.layoutMode = 'HORIZONTAL';
    frame.primaryAxisSizingMode = 'AUTO';
    frame.counterAxisSizingMode = 'AUTO';
    frame.itemSpacing = 8;
    frame.fills = [];

    for (const child of node.children) {
      const childNode = await this.convertNode(child);
      if (childNode) {
        frame.appendChild(childNode);
      }
    }

    return frame;
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private async loadFont(family: string, style: string): Promise<void> {
    const fontKey = `${family}:${style}`;

    if (this.loadedFonts.has(fontKey)) {
      return;
    }

    try {
      await figma.loadFontAsync({ family, style });
      this.loadedFonts.add(fontKey);
    } catch (error) {
      // Fallback to Roboto if font not available
      console.warn(`Font ${family} ${style} not available, using Roboto`);
      try {
        await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
        this.loadedFonts.add('Roboto:Regular');
      } catch (fallbackError) {
        console.error('Failed to load fallback font:', fallbackError);
      }
    }
  }

  private async createErrorPlaceholder(message: string): Promise<TextNode> {
    const text = figma.createText();
    await this.loadFont('Roboto', 'Regular');
    text.characters = `⚠️ ${message}`;
    text.fontSize = 14;
    text.fills = [createSolidPaint({ r: 0.9, g: 0.2, b: 0.2 })];
    return text;
  }

  private extractTextContent(node: WiremdNode): string {
    if ('content' in node && typeof node.content === 'string') {
      return node.content;
    }
    if ('children' in node && Array.isArray(node.children)) {
      return node.children.map(child => this.extractTextContent(child)).join('');
    }
    return '';
  }
}
