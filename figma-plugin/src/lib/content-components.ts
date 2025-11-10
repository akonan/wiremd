/**
 * Content Component Converters
 * Methods for converting content-related wiremd nodes to Figma
 */

import type { WiremdNode } from './types';
import { getThemeStyles, createSolidPaint, getTextStyle } from './style-mapper';

export async function createHeading(
  node: Extract<WiremdNode, { type: 'heading' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  loadFont: (family: string, style: string) => Promise<void>,
  convertNode?: (node: WiremdNode) => Promise<SceneNode | null>
): Promise<TextNode | FrameNode> {
  const styles = getThemeStyles(theme);

  // Font sizes for heading levels
  const fontSizes = [48, 36, 28, 24, 20, 18];
  const fontSize = fontSizes[node.level - 1] || 16;

  // If has children (e.g., icons), create a frame container
  if (node.children && node.children.length > 0 && convertNode) {
    const frame = figma.createFrame();
    frame.name = `Heading ${node.level}`;
    frame.layoutMode = 'HORIZONTAL';
    frame.primaryAxisSizingMode = 'AUTO';
    frame.counterAxisSizingMode = 'AUTO';
    frame.itemSpacing = 8;
    frame.fills = [];

    for (const child of node.children) {
      const childNode = await convertNode(child);
      if (childNode) {
        frame.appendChild(childNode);
      }
    }

    return frame;
  }

  // Simple text heading
  const text = figma.createText();
  const textStyle = getTextStyle(theme, fontSize, true);
  await loadFont(textStyle.fontFamily, textStyle.fontStyle);

  text.characters = node.content || '';
  text.fontSize = fontSize;
  text.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
  text.fills = [createSolidPaint(styles.text)];

  return text;
}

export async function createParagraph(
  node: Extract<WiremdNode, { type: 'paragraph' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  loadFont: (family: string, style: string) => Promise<void>,
  convertNode?: (node: WiremdNode) => Promise<SceneNode | null>
): Promise<TextNode | FrameNode> {
  const styles = getThemeStyles(theme);

  // If has children, create a frame container
  if (node.children && node.children.length > 0 && convertNode) {
    const frame = figma.createFrame();
    frame.name = 'Paragraph';
    frame.layoutMode = 'HORIZONTAL';
    frame.primaryAxisSizingMode = 'AUTO';
    frame.counterAxisSizingMode = 'AUTO';
    frame.itemSpacing = 4;
    frame.fills = [];

    for (const child of node.children) {
      const childNode = await convertNode(child);
      if (childNode) {
        frame.appendChild(childNode);
      }
    }

    return frame;
  }

  // Simple text paragraph
  const text = figma.createText();
  const textStyle = getTextStyle(theme, 16, false);
  await loadFont(textStyle.fontFamily, textStyle.fontStyle);

  text.characters = node.content || '';
  text.fontSize = 16;
  text.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
  text.fills = [createSolidPaint(styles.text)];
  text.lineHeight = { value: 150, unit: 'PERCENT' };

  return text;
}

export async function createText(
  node: Extract<WiremdNode, { type: 'text' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  loadFont: (family: string, style: string) => Promise<void>
): Promise<TextNode> {
  const styles = getThemeStyles(theme);

  const text = figma.createText();
  const textStyle = getTextStyle(theme, 16, false);
  await loadFont(textStyle.fontFamily, textStyle.fontStyle);

  text.characters = node.content || '';
  text.fontSize = 16;
  text.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
  text.fills = [createSolidPaint(styles.text)];

  return text;
}

export async function createImage(
  node: Extract<WiremdNode, { type: 'image' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none'
): Promise<RectangleNode> {
  const styles = getThemeStyles(theme);

  const rect = figma.createRectangle();
  rect.name = `Image: ${node.alt}`;

  // Default size or use provided dimensions
  const width = 400;
  const height = 300;
  rect.resize(width, height);

  // Gray placeholder with border
  rect.fills = [createSolidPaint({ r: 0.93, g: 0.93, b: 0.93 })];
  rect.strokes = [createSolidPaint(styles.border)];
  rect.strokeWeight = 1;
  rect.cornerRadius = styles.cornerRadius;

  // Note: In a real implementation, we could try to fetch and load the image
  // For now, we just create a placeholder

  return rect;
}

export async function createIcon(
  node: Extract<WiremdNode, { type: 'icon' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  loadFont: (family: string, style: string) => Promise<void>
): Promise<TextNode> {
  const styles = getThemeStyles(theme);

  // Icon mapping - using Unicode symbols and emoji
  const iconMap: Record<string, string> = {
    'home': '🏠', 'user': '👤', 'settings': '⚙️', 'search': '🔍',
    'star': '⭐', 'heart': '❤️', 'mail': '✉️', 'phone': '📞',
    'calendar': '📅', 'clock': '🕐', 'location': '📍', 'link': '🔗',
    'download': '⬇️', 'upload': '⬆️', 'edit': '✏️', 'delete': '🗑️',
    'plus': '➕', 'minus': '➖', 'check': '✓', 'close': '✕',
    'menu': '☰', 'more': '⋯', 'info': 'ℹ️', 'warning': '⚠️',
    'error': '❌', 'success': '✅',
    'arrow-up': '↑', 'arrow-down': '↓', 'arrow-left': '←', 'arrow-right': '→',
    'twitter': '𝕏', 'github': '⊙', 'linkedin': 'in',
    'default': '●'
  };

  const iconName = node.props.name || 'default';
  const iconContent = iconMap[iconName] || iconMap['default'];

  const text = figma.createText();
  const textStyle = getTextStyle(theme, 20, false);
  await loadFont(textStyle.fontFamily, textStyle.fontStyle);

  text.characters = iconContent;
  text.fontSize = node.props.size === 'small' ? 16 : node.props.size === 'large' ? 28 : 20;
  text.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
  text.fills = [createSolidPaint(styles.text)];

  return text;
}

export async function createLink(
  node: Extract<WiremdNode, { type: 'link' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  loadFont: (family: string, style: string) => Promise<void>,
  convertNode?: (node: WiremdNode) => Promise<SceneNode | null>
): Promise<TextNode | FrameNode> {
  const styles = getThemeStyles(theme);

  // If has children, create a frame container
  if (node.children && node.children.length > 0 && convertNode) {
    const frame = figma.createFrame();
    frame.name = 'Link';
    frame.layoutMode = 'HORIZONTAL';
    frame.primaryAxisSizingMode = 'AUTO';
    frame.counterAxisSizingMode = 'AUTO';
    frame.itemSpacing = 4;
    frame.fills = [];

    for (const child of node.children) {
      const childNode = await convertNode(child);
      if (childNode) {
        frame.appendChild(childNode);
      }
    }

    return frame;
  }

  // Simple text link
  const text = figma.createText();
  const textStyle = getTextStyle(theme, 16, false);
  await loadFont(textStyle.fontFamily, textStyle.fontStyle);

  text.characters = node.content || node.href;
  text.fontSize = 16;
  text.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
  text.fills = [createSolidPaint(styles.primary)];
  text.textDecoration = 'UNDERLINE';

  return text;
}

export async function createList(
  node: Extract<WiremdNode, { type: 'list' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  convertNode: (node: WiremdNode) => Promise<SceneNode | null>
): Promise<FrameNode> {
  const frame = figma.createFrame();
  const styles = getThemeStyles(theme);

  frame.name = node.ordered ? 'Ordered List' : 'Unordered List';
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = 8;
  frame.fills = [];

  for (const child of node.children) {
    const childNode = await convertNode(child);
    if (childNode) {
      frame.appendChild(childNode);
    }
  }

  return frame;
}

export async function createListItem(
  node: Extract<WiremdNode, { type: 'list-item' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  loadFont: (family: string, style: string) => Promise<void>,
  convertNode?: (node: WiremdNode) => Promise<SceneNode | null>
): Promise<FrameNode> {
  const frame = figma.createFrame();
  const styles = getThemeStyles(theme);

  frame.name = 'List Item';
  frame.layoutMode = 'HORIZONTAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = 8;
  frame.fills = [];

  // Add bullet
  const bullet = figma.createText();
  const textStyle = getTextStyle(theme, 16, false);
  await loadFont(textStyle.fontFamily, textStyle.fontStyle);
  bullet.characters = '•';
  bullet.fontSize = 16;
  bullet.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
  bullet.fills = [createSolidPaint(styles.text)];
  frame.appendChild(bullet);

  // Add content
  if (node.children && node.children.length > 0 && convertNode) {
    for (const child of node.children) {
      const childNode = await convertNode(child);
      if (childNode) {
        frame.appendChild(childNode);
      }
    }
  } else if (node.content) {
    const text = figma.createText();
    await loadFont(textStyle.fontFamily, textStyle.fontStyle);
    text.characters = node.content;
    text.fontSize = 16;
    text.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
    text.fills = [createSolidPaint(styles.text)];
    frame.appendChild(text);
  }

  return frame;
}

export async function createBlockquote(
  node: Extract<WiremdNode, { type: 'blockquote' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  convertNode: (node: WiremdNode) => Promise<SceneNode | null>
): Promise<FrameNode> {
  const frame = figma.createFrame();
  const styles = getThemeStyles(theme);

  frame.name = 'Blockquote';
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = styles.spacing;
  frame.paddingLeft = styles.paddingLarge;
  frame.paddingRight = styles.paddingMedium;
  frame.paddingTop = styles.paddingMedium;
  frame.paddingBottom = styles.paddingMedium;
  frame.fills = [createSolidPaint(styles.surface)];

  // Add left border accent
  frame.strokes = [createSolidPaint(styles.primary)];
  frame.strokeWeight = 4;
  frame.strokeAlign = 'INSIDE';

  for (const child of node.children) {
    const childNode = await convertNode(child);
    if (childNode) {
      frame.appendChild(childNode);
    }
  }

  return frame;
}

export async function createCode(
  node: Extract<WiremdNode, { type: 'code' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  loadFont: (family: string, style: string) => Promise<void>
): Promise<TextNode | FrameNode> {
  const styles = getThemeStyles(theme);

  if (node.inline) {
    // Inline code
    const text = figma.createText();
    await loadFont('Roboto Mono', 'Regular');
    text.characters = node.value;
    text.fontSize = 14;
    text.fontName = { family: 'Roboto Mono', style: 'Regular' };
    text.fills = [createSolidPaint(styles.primary)];
    return text;
  } else {
    // Code block
    const frame = figma.createFrame();
    frame.name = 'Code Block';
    frame.layoutMode = 'VERTICAL';
    frame.primaryAxisSizingMode = 'AUTO';
    frame.counterAxisSizingMode = 'AUTO';
    frame.paddingLeft = 16;
    frame.paddingRight = 16;
    frame.paddingTop = 16;
    frame.paddingBottom = 16;
    frame.cornerRadius = styles.cornerRadius;
    frame.fills = [createSolidPaint({ r: 0.95, g: 0.95, b: 0.95 })];

    const text = figma.createText();
    await loadFont('Roboto Mono', 'Regular');
    text.characters = node.value;
    text.fontSize = 14;
    text.fontName = { family: 'Roboto Mono', style: 'Regular' };
    text.fills = [createSolidPaint(styles.text)];

    frame.appendChild(text);
    return frame;
  }
}

export async function createSeparator(
  theme: 'sketch' | 'clean' | 'wireframe' | 'none'
): Promise<RectangleNode> {
  const styles = getThemeStyles(theme);

  const line = figma.createRectangle();
  line.name = 'Separator';
  line.resize(800, 1);
  line.fills = [createSolidPaint(styles.border)];

  return line;
}

export async function createTable(
  node: Extract<WiremdNode, { type: 'table' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  loadFont: (family: string, style: string) => Promise<void>,
  convertNode: (node: WiremdNode) => Promise<SceneNode | null>
): Promise<FrameNode> {
  const frame = figma.createFrame();
  const styles = getThemeStyles(theme);

  frame.name = 'Table';
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = 0;
  frame.fills = [createSolidPaint(styles.surface)];
  frame.strokes = [createSolidPaint(styles.border)];
  frame.strokeWeight = 1;
  frame.cornerRadius = styles.cornerRadius;

  // Convert header and rows
  for (const child of node.children) {
    const childNode = await convertNode(child);
    if (childNode) {
      frame.appendChild(childNode);
    }
  }

  return frame;
}
