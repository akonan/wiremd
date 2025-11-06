/**
 * MDAST to wiremd AST Transformer
 * Converts remark's MDAST into wiremd-specific AST nodes
 */

import type { Root as MdastRoot } from 'mdast';
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

  // Visit all nodes in the MDAST with context for dropdown options and grid layouts
  let i = 0;
  while (i < mdast.children.length) {
    const node = mdast.children[i];
    const nextNode = mdast.children[i + 1];

    // Check if this is a heading with grid class
    if (node.type === 'heading') {
      const content = extractTextContent(node);
      const gridMatch = content.match(/\{[^}]*\.grid-(\d+)[^}]*\}/);

      if (gridMatch) {
        const columns = parseInt(gridMatch[1], 10);
        const gridHeadingLevel = node.depth;

        // This is a grid container - collect grid items
        const gridItems: WiremdNode[] = [];
        const headingTransformed = transformHeading(node, options);

        i++; // Move to next node

        // Collect child headings as grid items
        while (i < mdast.children.length) {
          const childNode = mdast.children[i];

          // Grid items are headings one level deeper
          if (
            childNode.type === 'heading' &&
            childNode.depth === gridHeadingLevel + 1
          ) {
            const gridItem: WiremdNode[] = [];

            // Add the heading
            const childNextNode = mdast.children[i + 1];
            const headingNode = transformNode(childNode, options, childNextNode);
            if (headingNode) {
              gridItem.push(headingNode);
            }

            i++;

            // Collect content until next heading at same or higher level
            while (i < mdast.children.length) {
              const contentNode = mdast.children[i];

              if (
                contentNode.type === 'heading' &&
                contentNode.depth <= gridHeadingLevel + 1
              ) {
                break; // Stop at next grid item or parent level
              }

              const contentNextNode = mdast.children[i + 1];
              const contentTransformed = transformNode(contentNode, options, contentNextNode);
              if (contentTransformed) {
                gridItem.push(contentTransformed);

                // Skip consumed nodes
                if (contentTransformed.type === 'select' && contentNextNode?.type === 'list') {
                  i++;
                }
              }

              i++;
            }

            // Add as grid item
            gridItems.push({
              type: 'grid-item',
              props: {},
              children: gridItem,
            });
          } else {
            // Not a grid item heading, stop collecting
            break;
          }
        }

        // Create grid node
        children.push({
          type: 'grid',
          columns,
          props: (headingTransformed as any).props || {},
          children: gridItems,
        });

        continue;
      }
    }

    const transformed = transformNode(node, options, nextNode);
    if (transformed) {
      children.push(transformed);

      // If this was a select node and we consumed the next list, skip it
      if (transformed.type === 'select' && nextNode && nextNode.type === 'list') {
        i++; // Skip the next node (list) as it was consumed
      }
    }

    i++;
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
  node: any,
  options: ParseOptions,
  nextNode?: any
): WiremdNode | null {
  switch (node.type) {
    case 'wiremdContainer':
      return transformContainer(node, options);

    case 'wiremdInlineContainer':
      return transformInlineContainer(node, options);

    case 'heading':
      return transformHeading(node, options);

    case 'paragraph':
      return transformParagraph(node, options, nextNode);

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
  const nodeChildren = node.children || [];

  for (let i = 0; i < nodeChildren.length; i++) {
    const child = nodeChildren[i];
    const nextChild = nodeChildren[i + 1];
    const transformed = transformNode(child, options, nextChild);

    if (transformed) {
      children.push(transformed);

      // Skip next node if it was consumed (dropdown options)
      if (transformed.type === 'select' && nextChild && nextChild.type === 'list') {
        i++;
      }
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
function transformInlineContainer(node: any, _options: ParseOptions): WiremdNode {
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
function transformHeading(node: any, _options: ParseOptions): WiremdNode {
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
function transformParagraph(node: any, _options: ParseOptions, nextNode?: any): WiremdNode {
  const content = extractTextContent(node);

  // Check if this is a dropdown (ends with 'v]'): [Select option___v]
  const dropdownMatch = content.match(/^\[([^\]]+)v\](\{[^}]+\})?$/);
  if (dropdownMatch) {
    const [, text, attrs] = dropdownMatch;
    const props = parseAttributes(attrs || '');
    const options: any[] = [];

    // Check if next node is a list - if so, use list items as options
    if (nextNode && nextNode.type === 'list') {
      for (const item of nextNode.children || []) {
        const itemText = extractTextContent(item);
        options.push({
          type: 'option',
          value: itemText,
          label: itemText,
          selected: false,
        });
      }
    }

    return {
      type: 'select',
      props: {
        ...props,
        placeholder: text.replace(/[_\s]+$/, '').trim() || undefined,
      },
      options,
    };
  }

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
function transformListItem(node: any, _options: ParseOptions): WiremdNode {
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
function transformTable(_node: any, _options: ParseOptions): WiremdNode {
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
