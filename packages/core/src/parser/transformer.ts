/**
 * MDAST to wiremd AST Transformer
 * Converts remark's MDAST into wiremd-specific AST nodes
 */

import type { Root as MdastRoot, Content as MdastContent } from 'mdast';
import { visit } from 'unist-util-visit';
import type {
  DocumentNode,
  WiremdNode,
  ParseOptions,
  DocumentMeta,
} from '../types.js';
import { SYNTAX_VERSION } from '../index.js';

/**
 * Transform MDAST to wiremd AST
 */
export function transformToWiremdAST(
  mdast: MdastRoot,
  options: ParseOptions = {}
): DocumentNode {
  const meta: DocumentMeta = {
    version: SYNTAX_VERSION,
    viewport: 'desktop',
    theme: 'sketch',
  };

  const children: WiremdNode[] = [];

  // Visit all nodes in the MDAST
  for (const node of mdast.children) {
    const transformed = transformNode(node, options);
    if (transformed) {
      children.push(transformed);
    }
  }

  return {
    type: 'document',
    version: SYNTAX_VERSION,
    meta,
    children,
  };
}

/**
 * Transform a single MDAST node to wiremd node
 */
function transformNode(
  node: MdastContent | any,
  options: ParseOptions
): WiremdNode | null {
  switch (node.type) {
    case 'wiremdContainer':
      return transformContainer(node, options);

    case 'wiremdInlineContainer':
      return transformInlineContainer(node, options);

    case 'heading':
      return transformHeading(node, options);

    case 'paragraph':
      return transformParagraph(node, options);

    case 'text':
      return {
        type: 'text',
        content: node.value,
      };

    case 'list':
      return transformList(node, options);

    case 'listItem':
      return transformListItem(node, options);

    case 'table':
      return transformTable(node, options);

    case 'blockquote':
      return transformBlockquote(node, options);

    case 'code':
      return {
        type: 'code',
        value: node.value,
        lang: node.lang || undefined,
        inline: false,
      };

    case 'inlineCode':
      return {
        type: 'code',
        value: node.value,
        inline: true,
      };

    case 'thematicBreak':
      return {
        type: 'separator',
        props: {},
      };

    default:
      // For now, skip unknown nodes
      // TODO: Add warnings for unsupported nodes
      return null;
  }
}

/**
 * Transform container node (:::)
 */
function transformContainer(node: any, options: ParseOptions): WiremdNode {
  const children: WiremdNode[] = [];

  for (const child of node.children || []) {
    const transformed = transformNode(child, options);
    if (transformed) {
      children.push(transformed);
    }
  }

  const props = parseAttributes(node.attributes || '');

  return {
    type: 'container',
    containerType: node.containerType as any,
    props,
    children,
  };
}

/**
 * Transform inline container node ([[...]])
 */
function transformInlineContainer(node: any, options: ParseOptions): WiremdNode {
  const props = parseAttributes(node.attributes || '');
  const items = node.items || [];
  const children: WiremdNode[] = [];

  // Parse each item - could be text, icon, or button
  for (const item of items) {
    const trimmed = item.trim();

    // Check if it's a button: [Text]
    const buttonMatch = trimmed.match(/^\[([^\]]+)\]$/);
    if (buttonMatch) {
      children.push({
        type: 'button',
        content: buttonMatch[1],
        props: {},
      });
      continue;
    }

    // Check if it's an icon: :icon:
    const iconMatch = trimmed.match(/^:([a-z-]+):$/);
    if (iconMatch) {
      children.push({
        type: 'icon',
        props: { name: iconMatch[1] },
      });
      continue;
    }

    // Check if it starts with icon: :icon: Text
    const iconTextMatch = trimmed.match(/^:([a-z-]+):\s*(.+)$/);
    if (iconTextMatch) {
      // Create a brand node with icon + text
      children.push({
        type: 'brand',
        children: [
          { type: 'icon', props: { name: iconTextMatch[1] } },
          { type: 'text', content: iconTextMatch[2] },
        ],
        props: {},
      });
      continue;
    }

    // Otherwise, it's a nav item (text)
    children.push({
      type: 'nav-item',
      content: trimmed,
      props: {},
    });
  }

  return {
    type: 'nav',
    props,
    children: children as any,
  };
}

/**
 * Transform heading node
 */
function transformHeading(node: any, options: ParseOptions): WiremdNode {
  // Extract attributes from heading text
  // TODO: Parse {.class} syntax
  const content = extractTextContent(node);
  const props = parseAttributes(content);

  return {
    type: 'heading',
    level: node.depth as 1 | 2 | 3 | 4 | 5 | 6,
    content: content.replace(/\{[^}]+\}$/, '').trim(),
    props,
  };
}

/**
 * Transform paragraph node
 * This is where we'll detect buttons, inputs, etc.
 */
function transformParagraph(node: any, options: ParseOptions): WiremdNode {
  const content = extractTextContent(node);

  // Check if this is an input FIRST: [___] or [***] or [Email___]
  // Input must contain at least one underscore or asterisk
  // This matches: [_____], [*****], [Email___], [Name_______], etc.
  if (/\[[^\]]*[_*][^\]]*\]/.test(content)) {
    const match = content.match(/^\[([^\]]+)\](\{[^}]+\})?$/);
    if (match) {
      const [, pattern, attrs] = match;
      const props = parseAttributes(attrs || '');

      // Determine input type from pattern
      if (pattern.includes('*') && pattern.startsWith('*')) {
        props.inputType = 'password';
      }

      return {
        type: 'input',
        props,
      };
    }
  }

  // Check if this is a button: [Text] or [Text]*
  // Button should NOT be just underscores or asterisks
  const buttonMatch = content.match(/^\[([^\]]+)\](\*)?(\{[^}]+\})?$/);
  if (buttonMatch) {
    const [, text, isPrimary, attrs] = buttonMatch;

    // Skip if text is only underscores or asterisks (should be input)
    if (/^[_*]+$/.test(text)) {
      // This should have been caught by input regex, treat as input
      return {
        type: 'input',
        props: parseAttributes(attrs || ''),
      };
    }

    const props = parseAttributes(attrs || '');

    if (isPrimary) {
      props.variant = 'primary';
    }

    return {
      type: 'button',
      content: text,
      props,
    };
  }

  // Check for icon syntax: :icon-name:
  const iconMatch = content.match(/^:([a-z-]+):$/);
  if (iconMatch) {
    return {
      type: 'icon',
      props: {
        name: iconMatch[1],
      },
    };
  }

  // Default: return as paragraph
  return {
    type: 'paragraph',
    content,
    props: {},
  };
}

/**
 * Transform list node
 */
function transformList(node: any, options: ParseOptions): WiremdNode {
  const children: WiremdNode[] = [];

  for (const item of node.children) {
    const transformed = transformNode(item, options);
    if (transformed) {
      children.push(transformed);
    }
  }

  return {
    type: 'list',
    ordered: node.ordered || false,
    props: {},
    children: children as any,
  };
}

/**
 * Transform list item node
 */
function transformListItem(node: any, options: ParseOptions): WiremdNode {
  const content = extractTextContent(node);

  // Check for task list checkbox: remark-gfm sets checked property
  // node.checked will be true, false, or null (for non-task-list items)
  if (node.checked !== null && node.checked !== undefined) {
    return {
      type: 'checkbox',
      label: content,
      checked: node.checked === true,
      props: {},
    };
  }

  // Check for radio button: ( ) or (•) or (x)
  const radioMatch = content.match(/^\(([•x ])\)\s*(.+)$/);
  if (radioMatch) {
    return {
      type: 'radio',
      label: radioMatch[2],
      selected: radioMatch[1] !== ' ',
      props: {},
    };
  }

  return {
    type: 'list-item',
    content,
    props: {},
  };
}

/**
 * Transform table node
 */
function transformTable(node: any, options: ParseOptions): WiremdNode {
  // TODO: Implement table transformation
  return {
    type: 'table',
    props: {},
    children: [],
  };
}

/**
 * Transform blockquote node
 */
function transformBlockquote(node: any, options: ParseOptions): WiremdNode {
  const children: WiremdNode[] = [];

  for (const child of node.children) {
    const transformed = transformNode(child, options);
    if (transformed) {
      children.push(transformed);
    }
  }

  return {
    type: 'blockquote',
    props: {},
    children,
  };
}

/**
 * Extract text content from a node and its children
 */
function extractTextContent(node: any): string {
  if (typeof node === 'string') {
    return node;
  }

  if (node.value) {
    return node.value;
  }

  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractTextContent).join('');
  }

  return '';
}

/**
 * Parse attributes from string like {.class key:value}
 */
function parseAttributes(attrString: string): any {
  const props: any = {
    classes: [],
  };

  if (!attrString) {
    return props;
  }

  // Remove outer braces
  const inner = attrString.replace(/^\{|\}$/g, '').trim();

  if (!inner) {
    return props;
  }

  // Split by spaces (simple parser for now)
  const parts = inner.split(/\s+/);

  for (const part of parts) {
    // Class: .classname
    if (part.startsWith('.')) {
      props.classes.push(part.slice(1));
    }
    // State: :state
    else if (part.startsWith(':')) {
      props.state = part.slice(1);
    }
    // Key-value: key:value
    else if (part.includes(':')) {
      const [key, value] = part.split(':', 2);
      props[key] = value || true;
    }
    // Boolean: required, disabled, etc.
    else {
      props[part] = true;
    }
  }

  return props;
}
