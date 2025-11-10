/**
 * Form Component Converters
 * Methods for converting form-related wiremd nodes to Figma
 */

import type { WiremdNode } from './types';
import { getThemeStyles, createSolidPaint, getTextStyle } from './style-mapper';

export async function createButton(
  node: Extract<WiremdNode, { type: 'button' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  loadFont: (family: string, style: string) => Promise<void>,
  convertNode?: (node: WiremdNode) => Promise<SceneNode | null>
): Promise<FrameNode> {
  const frame = figma.createFrame();
  const styles = getThemeStyles(theme);

  frame.name = 'Button';
  frame.layoutMode = 'HORIZONTAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.paddingLeft = 24;
  frame.paddingRight = 24;
  frame.paddingTop = 12;
  frame.paddingBottom = 12;
  frame.itemSpacing = 8;
  frame.cornerRadius = styles.cornerRadius;

  // Determine button variant styling
  const variant = node.props.variant || 'secondary';
  const state = node.props.state;

  let bgColor = styles.secondary;
  let textColor = styles.text;

  if (variant === 'primary') {
    bgColor = styles.primary;
    textColor = { r: 1, g: 1, b: 1 };
  } else if (variant === 'danger') {
    bgColor = styles.danger;
    textColor = { r: 1, g: 1, b: 1 };
  }

  // Apply state styling
  if (state === 'disabled') {
    bgColor = { r: 0.9, g: 0.9, b: 0.9 };
    textColor = { r: 0.6, g: 0.6, b: 0.6 };
  }

  frame.fills = [createSolidPaint(bgColor)];

  // Add text content
  let content = node.content || 'Button';

  // If has children, render them (e.g., icons)
  if (node.children && node.children.length > 0 && convertNode) {
    for (const child of node.children) {
      const childNode = await convertNode(child);
      if (childNode) {
        frame.appendChild(childNode);
      }
    }
  } else {
    const text = figma.createText();
    const textStyle = getTextStyle(theme, 16, false);
    await loadFont(textStyle.fontFamily, textStyle.fontStyle);
    text.characters = content;
    text.fontSize = textStyle.fontSize;
    text.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
    text.fills = [createSolidPaint(textColor)];
    frame.appendChild(text);
  }

  return frame;
}

export async function createInput(
  node: Extract<WiremdNode, { type: 'input' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  loadFont: (family: string, style: string) => Promise<void>
): Promise<FrameNode> {
  const frame = figma.createFrame();
  const styles = getThemeStyles(theme);

  frame.name = 'Input';
  frame.layoutMode = 'HORIZONTAL';
  frame.primaryAxisSizingMode = 'FIXED';
  frame.counterAxisSizingMode = 'AUTO';
  frame.resize(320, 44);
  frame.paddingLeft = 12;
  frame.paddingRight = 12;
  frame.paddingTop = 12;
  frame.paddingBottom = 12;
  frame.cornerRadius = styles.cornerRadius;

  frame.fills = [createSolidPaint(styles.surface)];
  frame.strokes = [createSolidPaint(styles.border)];
  frame.strokeWeight = styles.borderWidth;

  // Add placeholder text
  const placeholder = node.props.placeholder || 'Enter text...';
  const text = figma.createText();
  const textStyle = getTextStyle(theme, 16, false);
  await loadFont(textStyle.fontFamily, textStyle.fontStyle);
  text.characters = placeholder;
  text.fontSize = textStyle.fontSize;
  text.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
  text.fills = [createSolidPaint(styles.textSecondary, 0.6)];

  frame.appendChild(text);

  return frame;
}

export async function createTextarea(
  node: Extract<WiremdNode, { type: 'textarea' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  loadFont: (family: string, style: string) => Promise<void>
): Promise<FrameNode> {
  const frame = figma.createFrame();
  const styles = getThemeStyles(theme);

  const rows = node.props.rows || 4;
  const height = rows * 20 + 24; // Approximate line height

  frame.name = 'Textarea';
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'FIXED';
  frame.counterAxisSizingMode = 'FIXED';
  frame.resize(400, height);
  frame.paddingLeft = 12;
  frame.paddingRight = 12;
  frame.paddingTop = 12;
  frame.paddingBottom = 12;
  frame.cornerRadius = styles.cornerRadius;

  frame.fills = [createSolidPaint(styles.surface)];
  frame.strokes = [createSolidPaint(styles.border)];
  frame.strokeWeight = styles.borderWidth;

  // Add placeholder text
  const placeholder = node.props.placeholder || 'Enter text...';
  const text = figma.createText();
  const textStyle = getTextStyle(theme, 16, false);
  await loadFont(textStyle.fontFamily, textStyle.fontStyle);
  text.characters = placeholder;
  text.fontSize = textStyle.fontSize;
  text.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
  text.fills = [createSolidPaint(styles.textSecondary, 0.6)];

  frame.appendChild(text);

  return frame;
}

export async function createSelect(
  node: Extract<WiremdNode, { type: 'select' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  loadFont: (family: string, style: string) => Promise<void>
): Promise<FrameNode> {
  const frame = figma.createFrame();
  const styles = getThemeStyles(theme);

  frame.name = 'Select';
  frame.layoutMode = 'HORIZONTAL';
  frame.primaryAxisSizingMode = 'FIXED';
  frame.counterAxisSizingMode = 'AUTO';
  frame.resize(320, 44);
  frame.paddingLeft = 12;
  frame.paddingRight = 12;
  frame.paddingTop = 12;
  frame.paddingBottom = 12;
  frame.cornerRadius = styles.cornerRadius;

  frame.fills = [createSolidPaint(styles.surface)];
  frame.strokes = [createSolidPaint(styles.border)];
  frame.strokeWeight = styles.borderWidth;

  // Find selected option or use placeholder
  const selectedOption = node.options.find(opt => opt.selected);
  const displayText = selectedOption?.label || node.props.placeholder || 'Select...';

  const text = figma.createText();
  const textStyle = getTextStyle(theme, 16, false);
  await loadFont(textStyle.fontFamily, textStyle.fontStyle);
  text.characters = displayText;
  text.fontSize = textStyle.fontSize;
  text.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
  text.fills = [createSolidPaint(selectedOption ? styles.text : styles.textSecondary)];
  text.layoutGrow = 1;

  frame.appendChild(text);

  // Add dropdown arrow
  const arrow = figma.createText();
  await loadFont(textStyle.fontFamily, textStyle.fontStyle);
  arrow.characters = '▼';
  arrow.fontSize = 12;
  arrow.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
  arrow.fills = [createSolidPaint(styles.textSecondary)];

  frame.appendChild(arrow);

  return frame;
}

export async function createCheckbox(
  node: Extract<WiremdNode, { type: 'checkbox' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  loadFont: (family: string, style: string) => Promise<void>,
  convertNode?: (node: WiremdNode) => Promise<SceneNode | null>
): Promise<FrameNode> {
  const frame = figma.createFrame();
  const styles = getThemeStyles(theme);

  frame.name = 'Checkbox';
  frame.layoutMode = 'HORIZONTAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = 8;
  frame.fills = [];

  // Create checkbox box
  const box = figma.createRectangle();
  box.resize(20, 20);
  box.cornerRadius = styles.cornerRadius / 2;
  box.fills = [createSolidPaint(node.checked ? styles.primary : styles.surface)];
  box.strokes = [createSolidPaint(styles.border)];
  box.strokeWeight = styles.borderWidth;

  frame.appendChild(box);

  // Add checkmark if checked
  if (node.checked) {
    const check = figma.createText();
    const textStyle = getTextStyle(theme, 16, true);
    await loadFont(textStyle.fontFamily, textStyle.fontStyle);
    check.characters = '✓';
    check.fontSize = 14;
    check.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
    check.fills = [createSolidPaint({ r: 1, g: 1, b: 1 })];

    // Position checkmark over box
    const checkWrapper = figma.createFrame();
    checkWrapper.resize(20, 20);
    checkWrapper.fills = [];
    checkWrapper.appendChild(check);
    check.x = 3;
    check.y = 1;

    // Replace box with wrapper containing box and check
    frame.insertChild(1, checkWrapper);
    box.remove();
    checkWrapper.appendChild(box);
    box.x = 0;
    box.y = 0;
  }

  // Add label
  const label = node.label || '';
  if (label || (node.children && node.children.length > 0)) {
    if (node.children && node.children.length > 0 && convertNode) {
      for (const child of node.children) {
        const childNode = await convertNode(child);
        if (childNode) {
          frame.appendChild(childNode);
        }
      }
    } else {
      const text = figma.createText();
      const textStyle = getTextStyle(theme, 16, false);
      await loadFont(textStyle.fontFamily, textStyle.fontStyle);
      text.characters = label;
      text.fontSize = textStyle.fontSize;
      text.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
      text.fills = [createSolidPaint(styles.text)];
      frame.appendChild(text);
    }
  }

  return frame;
}

export async function createRadio(
  node: Extract<WiremdNode, { type: 'radio' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  loadFont: (family: string, style: string) => Promise<void>
): Promise<FrameNode> {
  const frame = figma.createFrame();
  const styles = getThemeStyles(theme);

  frame.name = 'Radio';
  frame.layoutMode = 'HORIZONTAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = 8;
  frame.fills = [];

  // Create radio circle
  const circle = figma.createEllipse();
  circle.resize(20, 20);
  circle.fills = [createSolidPaint(styles.surface)];
  circle.strokes = [createSolidPaint(styles.border)];
  circle.strokeWeight = styles.borderWidth;

  frame.appendChild(circle);

  // Add inner circle if selected
  if (node.selected) {
    const inner = figma.createEllipse();
    inner.resize(10, 10);
    inner.fills = [createSolidPaint(styles.primary)];

    const circleWrapper = figma.createFrame();
    circleWrapper.resize(20, 20);
    circleWrapper.fills = [];
    circleWrapper.appendChild(circle);
    circleWrapper.appendChild(inner);
    circle.x = 0;
    circle.y = 0;
    inner.x = 5;
    inner.y = 5;

    frame.insertChild(1, circleWrapper);
    circle.remove();
  }

  // Add label
  const text = figma.createText();
  const textStyle = getTextStyle(theme, 16, false);
  await loadFont(textStyle.fontFamily, textStyle.fontStyle);
  text.characters = node.label;
  text.fontSize = textStyle.fontSize;
  text.fontName = { family: textStyle.fontFamily, style: textStyle.fontStyle };
  text.fills = [createSolidPaint(styles.text)];
  frame.appendChild(text);

  return frame;
}

export async function createRadioGroup(
  node: Extract<WiremdNode, { type: 'radio-group' }>,
  theme: 'sketch' | 'clean' | 'wireframe' | 'none',
  convertNode: (node: WiremdNode) => Promise<SceneNode | null>
): Promise<FrameNode> {
  const frame = figma.createFrame();
  const styles = getThemeStyles(theme);

  const isInline = node.props?.inline;

  frame.name = 'Radio Group';
  frame.layoutMode = isInline ? 'HORIZONTAL' : 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = styles.spacing;
  frame.fills = [];

  for (const child of node.children) {
    const childNode = await convertNode(child);
    if (childNode) {
      frame.appendChild(childNode);
    }
  }

  return frame;
}
