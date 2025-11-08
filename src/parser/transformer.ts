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
      // Also check if it's a container with a select child that has consumed the list
      if (transformed.type === 'container' && nextNode && nextNode.type === 'list') {
        const hasSelectWithOptions = (transformed.children || []).some((child: any) =>
          child.type === 'select' && child.options && child.options.length > 0
        );
        if (hasSelectWithOptions) {
          i++; // Skip the next node (list) as it was consumed by the select
        }
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
      // Warn about unsupported nodes in development
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[wiremd] Unsupported node type: ${node.type}`);
      }
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

    // Check if it's a button: [Text] or [Text]*
    const buttonMatch = trimmed.match(/^\[([^\]]+)\](\*)?$/);
    if (buttonMatch) {
      children.push({
        type: 'button',
        content: buttonMatch[1],
        props: {
          variant: buttonMatch[2] ? 'primary' : undefined,
        },
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
  const content = extractTextContent(node);

  // Check if heading has attributes at the end: "Title {.class}"
  const attrMatch = content.match(/^(.+?)(\{[^}]+\})$/);
  let headingText = content;
  let props: any = { classes: [] };

  if (attrMatch) {
    headingText = attrMatch[1].trim();
    props = parseAttributes(attrMatch[2]);
  }

  return {
    type: 'heading',
    level: node.depth as 1 | 2 | 3 | 4 | 5 | 6,
    content: headingText,
    props,
  };
}

/**
 * Transform paragraph node
 * This is where we'll detect buttons, inputs, etc.
 */
function transformParagraph(node: any, _options: ParseOptions, nextNode?: any): WiremdNode {
  // Check if this paragraph has rich content (strong, emphasis, links, etc.)
  const hasRichContent = node.children && node.children.some((child: any) =>
    child.type === 'strong' || child.type === 'emphasis' || child.type === 'link' || child.type === 'code'
  );

  // If it has rich content and is not a special pattern, return as a rich text paragraph
  if (hasRichContent) {
    const content = extractTextContent(node);

    // Still check for button patterns first
    const buttonMatch = content.match(/^\[([^\]]+)\](\*)?(\{[^}]*\})?$/);
    if (buttonMatch) {
      const attrs = buttonMatch[3] ? parseAttributes(buttonMatch[3]) : {};
      return {
        type: 'button',
        content: buttonMatch[1],
        props: {
          ...attrs,
          variant: buttonMatch[2] ? 'primary' : undefined,
        },
      };
    }

    // For other rich content, check if we have mixed content with buttons
    const processedChildren: WiremdNode[] = [];
    let currentText = '';

    const flushText = () => {
      if (currentText) {
        processedChildren.push({
          type: 'text',
          content: currentText,
          props: {},
        });
        currentText = '';
      }
    };

    for (const child of node.children) {
      if (child.type === 'text') {
        // Check for buttons in text
        const textParts = child.value.split(/(\[[^\]]+\](?:\*)?(?:\{[^}]*\})?)/);
        for (const part of textParts) {
          const buttonMatch = part.match(/^\[([^\]]+)\](\*)?(\{[^}]*\})?$/);
          if (buttonMatch && !/^\[[_*]+\]/.test(part)) {
            // It's a button
            flushText();
            const attrs = buttonMatch[3] ? parseAttributes(buttonMatch[3]) : {};
            processedChildren.push({
              type: 'button',
              content: buttonMatch[1],
              props: {
                ...attrs,
                variant: buttonMatch[2] ? 'primary' : undefined,
              },
            });
          } else if (part) {
            currentText += part;
          }
        }
      } else if (child.type === 'strong') {
        currentText += `<strong>${extractTextContent(child)}</strong>`;
      } else if (child.type === 'emphasis') {
        currentText += `<em>${extractTextContent(child)}</em>`;
      } else if (child.type === 'code') {
        currentText += `<code>${extractTextContent(child)}</code>`;
      } else if (child.type === 'link') {
        currentText += `<a href="${child.url}">${extractTextContent(child)}</a>`;
      } else {
        currentText += extractTextContent(child);
      }
    }
    flushText();

    // If we only have one text child with no buttons, return as paragraph
    if (processedChildren.length === 1 && processedChildren[0].type === 'text') {
      return {
        type: 'paragraph',
        content: processedChildren[0].content,
        props: {},
      };
    }

    // If we have multiple children or buttons, return as container
    return {
      type: 'container',
      containerType: 'form-group',
      children: processedChildren as any,
      props: {},
    };
  }

  const content = extractTextContent(node);

  // Check for inline container syntax [[...]]
  const inlineContainerMatch = content.match(/^\[\[\s*(.+?)\s*\]\](\{[^}]+\})?/);
  if (inlineContainerMatch) {
    const itemsContent = inlineContainerMatch[1];
    const attrs = inlineContainerMatch[2] || '';
    const items = itemsContent.split('|').map((item: string) => item.trim());

    // Create a wiremdInlineContainer-like structure and transform it
    const inlineContainerNode = {
      type: 'wiremdInlineContainer',
      content: itemsContent,
      items,
      attributes: attrs.trim(),
    };

    const transformed = transformInlineContainer(inlineContainerNode, _options);

    // If there's text after the inline container, wrap both in a container
    const remainingText = content.substring(inlineContainerMatch[0].length).trim();
    if (remainingText) {
      return {
        type: 'container',
        containerType: 'section',
        children: [
          transformed,
          {
            type: 'paragraph',
            content: remainingText,
            props: {},
          }
        ] as any,
        props: {},
      };
    }

    return transformed;
  }

  // Handle multi-line paragraphs (e.g., "Username\n[_____]")
  // Split by newlines and check if any line matches our patterns
  const lines = content.split('\n').filter(line => line.trim());

  // If we have multiple lines, check if ALL lines are buttons/form elements
  if (lines.length > 1) {
    // First check if all lines are buttons - if so, parse them all as buttons
    const allButtons = lines.every(line => /^\[([^\]]+)\](\*)?(\{[^}]*\})?$/.test(line.trim()) && !/^\[[_*]+\]/.test(line.trim()));

    if (allButtons) {
      const buttons: WiremdNode[] = [];
      for (const line of lines) {
        const buttonMatch = line.trim().match(/^\[([^\]]+)\](\*)?(\{[^}]*\})?$/);
        if (buttonMatch) {
          const [, text, isPrimary, attrs] = buttonMatch;
          const props = parseAttributes(attrs || '');
          if (isPrimary) {
            props.variant = 'primary';
          }
          buttons.push({
            type: 'button',
            content: text,
            props,
          });
        }
      }

      if (buttons.length > 1) {
        return {
          type: 'container',
          containerType: 'button-group',
          props: {},
          children: buttons as any[],
        };
      } else if (buttons.length === 1) {
        return buttons[0];
      }
    }

    // Otherwise check if the last line is a form element with labels before it
    const lastLine = lines[lines.length - 1].trim();
    const labelLines = lines.slice(0, -1).join('\n');

    // Check if last line is a dropdown
    const dropdownMatch = lastLine.match(/^\[([^\]]+)v\](\{[^}]+\})?$/);
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

      // Create a container with label and select
      return {
        type: 'container',
        containerType: 'form-group',
        props: {},
        children: [
          labelLines ? { type: 'text', content: labelLines } : null,
          {
            type: 'select',
            props: {
              ...props,
              placeholder: text.replace(/[_\s]+$/, '').trim() || undefined,
            },
            options,
          }
        ].filter(Boolean) as WiremdNode[],
      };
    }

    // Check if last line is an input
    if (/\[[^\]]*[_*][^\]]*\]/.test(lastLine)) {
      const match = lastLine.match(/^\[([^\]]+)\](\{[^}]+\})?$/);
      if (match) {
        const [, pattern, attrs] = match;
        const props = parseAttributes(attrs || '');

        // Determine input type and placeholder from pattern
        if (pattern.includes('*') && pattern.replace(/[^*]/g, '').length > 3) {
          props.inputType = 'password';
        } else {
          // Extract placeholder text before underscores
          const placeholderMatch = pattern.match(/^([^_*]+)[_*]/);
          if (placeholderMatch) {
            props.placeholder = placeholderMatch[1].trim();
          }
        }

        // Create a container with label and input
        return {
          type: 'container',
          containerType: 'form-group',
          props: {},
          children: [
            labelLines ? { type: 'text', content: labelLines } : null,
            {
              type: 'input',
              props,
            }
          ].filter(Boolean) as WiremdNode[],
        };
      }
    }

    // Check if last line is a textarea (has rows attribute), button, or multiple buttons
    if (/\[([^\]]+)\]/.test(lastLine)) {
      // First check if it's a textarea (contains rows attribute)
      const textareaMatch = lastLine.match(/^\[([^\]]+)\](\{[^}]*rows:[^}]*\})$/);
      if (textareaMatch) {
        const [, placeholder, attrs] = textareaMatch;
        const props = parseAttributes(attrs || '');

        // Create a container with label and textarea
        return {
          type: 'container',
          containerType: 'form-group',
          props: {},
          children: [
            labelLines ? { type: 'text', content: labelLines } : null,
            {
              type: 'textarea',
              props: {
                ...props,
                placeholder: placeholder.trim(),
              }
            }
          ].filter(Boolean) as WiremdNode[],
        };
      }

      // Otherwise check for buttons
      const buttonPattern = /\[([^\]]+)\](\*)?(\{[^}]*\})?/g;
      const buttons: WiremdNode[] = [];
      let match;

      while ((match = buttonPattern.exec(lastLine)) !== null) {
        const [, text, isPrimary, attrs] = match;

        // Skip if text is only underscores or asterisks (should be input)
        if (!/^[_*]+$/.test(text)) {
          const props = parseAttributes(attrs || '');

          // If it has rows attribute, it's a textarea not a button
          if ('rows' in props) {
            // Already handled above, skip
            continue;
          }

          if (isPrimary) {
            props.variant = 'primary';
          }
          buttons.push({
            type: 'button',
            content: text,
            props,
          });
        }
      }

      if (buttons.length > 0) {
        // If we have label lines and buttons, create a container
        if (labelLines) {
          return {
            type: 'container',
            containerType: 'form-group',
            props: {},
            children: [
              { type: 'text', content: labelLines },
              ...buttons
            ] as WiremdNode[],
          };
        }
        // If just buttons, return them directly (handle multiple later)
        if (buttons.length === 1) {
          return buttons[0];
        }
        // Multiple buttons without label
        return {
          type: 'container',
          containerType: 'button-group',
          props: {},
          children: buttons as any[],
        };
      }
    }
  }

  // Single line content - check all patterns as before

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
  if (/^\[[^\]]*[_*][^\]]*\](\{[^}]+\})?$/.test(content)) {
    const match = content.match(/^\[([^\]]+)\](\{[^}]+\})?$/);
    if (match) {
      const [, pattern, attrs] = match;
      const props = parseAttributes(attrs || '');

      // Determine input type from pattern
      if (pattern.includes('*') && pattern.replace(/[^*]/g, '').length > 3) {
        props.inputType = 'password';
      } else {
        // Extract placeholder text before underscores
        const placeholderMatch = pattern.match(/^([^_*]+)[_*]/);
        if (placeholderMatch) {
          props.placeholder = placeholderMatch[1].trim();
        }
      }

      return {
        type: 'input',
        props,
      };
    }
  }

  // Check for single textarea (has rows attribute)
  const singleTextareaMatch = content.match(/^\[([^\]]+)\](\{[^}]*rows:[^}]*\})$/);
  if (singleTextareaMatch) {
    const [, placeholder, attrs] = singleTextareaMatch;
    const props = parseAttributes(attrs || '');

    return {
      type: 'textarea',
      props: {
        ...props,
        placeholder: placeholder.trim(),
      }
    };
  }

  // Check for multiple buttons on the same line: [Submit] [Cancel]
  if (/\[([^\]]+)\]/.test(content)) {
    const buttonPattern = /\[([^\]]+)\](\*)?(\{[^}]*\})?/g;
    const buttons: WiremdNode[] = [];
    let match;

    while ((match = buttonPattern.exec(content)) !== null) {
      const [, text, isPrimary, attrs] = match;

      // Skip if text is only underscores or asterisks (should be input)
      if (!/^[_*]+$/.test(text)) {
        const props = parseAttributes(attrs || '');

        // Skip if it has rows attribute (it's a textarea)
        if ('rows' in props) {
          continue;
        }

        if (isPrimary) {
          props.variant = 'primary';
        }
        buttons.push({
          type: 'button',
          content: text,
          props,
        });
      }
    }

    if (buttons.length === 1 && content.trim() === content.match(/\[([^\]]+)\](\*)?(\{[^}]*\})?/)![0]) {
      // Single button that is the entire content
      return buttons[0];
    } else if (buttons.length > 0) {
      // Multiple buttons or button with other text
      const remainingText = content.replace(/\[([^\]]+)\](\*)?(\{[^}]*\})?/g, '').trim();
      if (!remainingText && buttons.length > 1) {
        // Multiple buttons only
        return {
          type: 'container',
          containerType: 'button-group',
          props: {},
          children: buttons as any[],
        };
      }
      // Fallthrough to paragraph if there's mixed content
    }
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
    // Extract attributes from label if present
    const attrMatch = content.match(/^(.+?)(\{[^}]+\})$/);
    let label = content;
    let props: any = {};

    if (attrMatch) {
      label = attrMatch[1].trim();
      props = parseAttributes(attrMatch[2]);
    }

    return {
      type: 'checkbox',
      label,
      checked: node.checked === true,
      props,
    };
  }

  // Check for radio button: ( ) or (•) or (x)
  const radioMatch = content.match(/^\(([•x ])\)\s*(.+)$/);
  if (radioMatch) {
    let label = radioMatch[2];

    // Extract attributes from label if present
    const attrMatch = label.match(/^(.+?)(\{[^}]+\})$/);
    let props: any = {};

    if (attrMatch) {
      label = attrMatch[1].trim();
      props = parseAttributes(attrMatch[2]);
    }

    return {
      type: 'radio',
      label,
      selected: radioMatch[1] !== ' ',
      props,
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
  const children: WiremdNode[] = [];

  // Process table rows
  if (node.children && Array.isArray(node.children)) {
    for (const row of node.children) {
      if (row.type === 'tableRow') {
        const cells: WiremdNode[] = [];

        if (row.children && Array.isArray(row.children)) {
          for (const cell of row.children) {
            if (cell.type === 'tableCell') {
              const cellContent: WiremdNode[] = [];

              // Transform cell content
              if (cell.children && Array.isArray(cell.children)) {
                for (const cellChild of cell.children) {
                  const transformed = transformNode(cellChild, options);
                  if (transformed) {
                    cellContent.push(transformed);
                  }
                }
              }

              cells.push({
                type: 'table-cell',
                props: {},
                children: cellContent,
              });
            }
          }
        }

        children.push({
          type: 'table-row',
          props: {},
          children: cells,
        });
      }
    }
  }

  return {
    type: 'table',
    props: {},
    children,
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
