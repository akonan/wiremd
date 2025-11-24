/**
 * MDAST to wiremd AST Transformer
 * Converts remark's MDAST into wiremd-specific AST nodes
 *
 * Copyright (c) 2025 wiremd
 * Licensed under MIT License
 * https://github.com/akonan/wiremd/blob/main/LICENSE
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

    case 'image':
      return {
        type: 'image',
        src: node.url || '',
        alt: node.alt || '',
        props: {},
      };

    case 'link':
      return {
        type: 'link',
        href: node.url || '#',
        title: node.title,
        children: node.children?.map((child: any) => transformNode(child, options)).filter(Boolean) || [],
        props: {},
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
      const iconName = iconTextMatch[1];
      const text = iconTextMatch[2];

      // Create a brand node for :logo:, otherwise nav-item
      const nodeType = iconName === 'logo' ? 'brand' : 'nav-item';

      children.push({
        type: nodeType,
        children: [
          { type: 'icon', props: { name: iconName } },
          { type: 'text', content: text },
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

  // Parse icons in heading text
  if (/:([a-z-]+):/.test(headingText)) {
    const iconPattern = /:([a-z-]+):/g;
    const parts = headingText.split(iconPattern);
    const children: WiremdNode[] = [];

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        if (parts[i].trim()) {
          children.push({
            type: 'text',
            content: parts[i],
            props: {},
          });
        }
      } else {
        children.push({
          type: 'icon',
          props: { name: parts[i] },
        });
      }
    }

    return {
      type: 'heading',
      level: node.depth as 1 | 2 | 3 | 4 | 5 | 6,
      children: children as any,
      props,
    };
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
  // Check if this paragraph has rich content (strong, emphasis, links, images, etc.)
  const hasRichContent = node.children && node.children.some((child: any) =>
    child.type === 'strong' || child.type === 'emphasis' || child.type === 'link' || child.type === 'code' || child.type === 'image'
  );

  // If it has rich content and is not a special pattern, return as a rich text paragraph
  if (hasRichContent) {
    let content = extractTextContent(node);
    // Clean up trailing ::: from container closing markers
    content = content.replace(/\s*:::\s*$/, '').trim();

    // Still check for button patterns first
    const buttonMatch = content.match(/^\[([^\]]+)\](\*)?(?:\s*(\{[^}]*\}))?$/);
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
        // Check for buttons and icons in text
        // Split on both button patterns and icon patterns
        const textParts = child.value.split(/(\[[^\]]+\](?:\*)?(?:\s*\{[^}]*\})?|:[a-z-]+:)/);
        for (const part of textParts) {
          // Check for button
          const buttonMatch = part.match(/^\[([^\]]+)\](\*)?(?:\s*(\{[^}]*\}))?$/);
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
          } else if (part.match(/^:([a-z-]+):$/)) {
            // It's an icon
            flushText();
            const iconMatch = part.match(/^:([a-z-]+):$/);
            if (iconMatch) {
              processedChildren.push({
                type: 'icon',
                props: { name: iconMatch[1] },
              });
            }
          } else if (part) {
            currentText += part;
          }
        }
      } else if (child.type === 'image') {
        // Flush text before image and add image as separate child
        flushText();
        processedChildren.push({
          type: 'image',
          src: child.url || '',
          alt: child.alt || '',
          props: {},
        });
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

  let content = extractTextContent(node);
  // Clean up trailing ::: from container closing markers
  content = content.replace(/\s*:::\s*$/, '').trim();

  // Check for standalone checkbox: [ ] or [x] or [X]
  const checkboxMatch = content.match(/^\[\s*([xX ])\s*\]\s+(.+)$/);
  if (checkboxMatch) {
    const checked = checkboxMatch[1].toLowerCase() === 'x';
    let label = checkboxMatch[2];

    // Extract attributes from label if present
    const attrMatch = label.match(/^(.+?)(\{[^}]+\})$/);
    let props: any = {};
    if (attrMatch) {
      label = attrMatch[1].trim();
      props = parseAttributes(attrMatch[2]);
    }

    return {
      type: 'checkbox',
      label,
      checked,
      props,
    };
  }

  // Check for inline radio buttons: (*) Option1 ( ) Option2 ( ) Option3
  // Must have at least 2 radio button patterns on the same line
  const radioPattern = /\(([*•x ])\)\s+([^(]+?)(?=\s*\(|$)/g;
  const radioMatches = Array.from(content.matchAll(radioPattern));

  if (radioMatches.length >= 2) {
    const radioButtons: WiremdNode[] = [];

    for (const match of radioMatches) {
      const selected = match[1] !== ' ';
      let label = match[2].trim();

      // Remove trailing attributes if present
      const attrMatch = label.match(/^(.+?)(\{[^}]+\})$/);
      let props: any = {};
      if (attrMatch) {
        label = attrMatch[1].trim();
        props = parseAttributes(attrMatch[2]);
      }

      radioButtons.push({
        type: 'radio',
        label,
        selected,
        props,
      });
    }

    return {
      type: 'radio-group',
      props: { inline: true },
      children: radioButtons as any,
    };
  }

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
    // Check if all lines have icon patterns (e.g., ":star: Star Icon")
    const allWithIcons = lines.every(line => /:([a-z-]+):/.test(line.trim()));

    if (allWithIcons) {
      const iconLines: WiremdNode[] = [];
      for (const line of lines) {
        const trimmed = line.trim();
        const iconPattern = /:([a-z-]+):/g;
        const parts = trimmed.split(iconPattern);
        const lineChildren: WiremdNode[] = [];

        for (let i = 0; i < parts.length; i++) {
          if (i % 2 === 0) {
            if (parts[i].trim()) {
              lineChildren.push({
                type: 'text',
                content: parts[i],
                props: {},
              });
            }
          } else {
            lineChildren.push({
              type: 'icon',
              props: { name: parts[i] },
            });
          }
        }

        if (lineChildren.length > 0) {
          iconLines.push({
            type: 'paragraph',
            children: lineChildren as any,
            props: {},
          });
        }
      }

      if (iconLines.length > 0) {
        return {
          type: 'container',
          containerType: 'section',
          props: {},
          children: iconLines as any,
        };
      }
    }

    // First check if all lines are buttons - if so, parse them all as buttons
    const allButtons = lines.every(line => /^\[([^\]]+)\](\*)?(?:\s*\{[^}]*\})?$/.test(line.trim()) && !/^\[[_*]+\]/.test(line.trim()));

    if (allButtons) {
      const buttons: WiremdNode[] = [];
      for (const line of lines) {
        const buttonMatch = line.trim().match(/^\[([^\]]+)\](\*)?(?:\s*(\{[^}]*\}))?$/);
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
    const dropdownMatch = lastLine.match(/^\[([^\]]+)v\](?:\s*(\{[^}]+\}))?$/);
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
      const match = lastLine.match(/^\[([^\]]+)\](?:\s*(\{[^}]+\}))?$/);
      if (match) {
        const [, pattern, attrs] = match;
        const props = parseAttributes(attrs || '');

        // Determine input type and placeholder from pattern
        let placeholderText = '';
        if (pattern.includes('*') && pattern.replace(/[^*]/g, '').length > 3) {
          props.inputType = 'password';
        } else {
          // Extract placeholder text before underscores
          const placeholderMatch = pattern.match(/^([^_*]+)[_*]/);
          if (placeholderMatch) {
            placeholderText = placeholderMatch[1].trim();
            props.placeholder = placeholderText;
          }
        }

        // Count underscores or asterisks to determine width (each char = ~1 character width)
        const underscoreCount = pattern.replace(/[^_]/g, '').length;
        const asteriskCount = pattern.replace(/[^*]/g, '').length;
        const widthChars = underscoreCount > 0 ? underscoreCount : asteriskCount;

        if (widthChars > 0) {
          // If there's placeholder text, width should be at least as long as placeholder + extra padding
          // Add 6 chars padding to account for Comic Sans variable width and browser padding
          // Otherwise use the underscore/asterisk count
          if (placeholderText) {
            props.width = Math.max(placeholderText.length + 6, widthChars);
          } else {
            props.width = widthChars;
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
      const textareaMatch = lastLine.match(/^\[([^\]]+)\](?:\s*(\{[^}]*rows:[^}]*\}))$/);
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
      const buttonPattern = /\[([^\]]+)\](\*)?(?:\s*(\{[^}]*\}))?/g;
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
  const dropdownMatch = content.match(/^\[([^\]]+)v\](?:\s*(\{[^}]+\}))?$/);
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
  if (/^\[[^\]]*[_*][^\]]*\](?:\s*\{[^}]+\})?$/.test(content)) {
    const match = content.match(/^\[([^\]]+)\](?:\s*(\{[^}]+\}))?$/);
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
  const singleTextareaMatch = content.match(/^\[([^\]]+)\](?:\s*(\{[^}]*rows:[^}]*\}))$/);
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

  // Check for multiple buttons on the same line BEFORE icon check: [Submit] [Cancel]
  if (/\[([^\]]+)\]/.test(content)) {
    const buttonPattern = /\[([^\]]+)\](\*)?(?:\s*(\{[^}]*\}))?/g;
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

        // Parse icons in button text
        if (/:([a-z-]+):/.test(text)) {
          const iconPattern = /:([a-z-]+):/g;
          const parts = text.split(iconPattern);
          const children: WiremdNode[] = [];

          for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
              if (parts[i].trim()) {
                children.push({
                  type: 'text',
                  content: parts[i],
                  props: {},
                });
              }
            } else {
              children.push({
                type: 'icon',
                props: { name: parts[i] },
              });
            }
          }

          buttons.push({
            type: 'button',
            content: '',
            children: children as any,
            props,
          });
        } else {
          buttons.push({
            type: 'button',
            content: text,
            props,
          });
        }
      }
    }

    if (buttons.length === 1 && content.trim() === content.match(/\[([^\]]+)\](\*)?(?:\s*\{[^}]*\})?/)![0]) {
      // Single button that is the entire content
      return buttons[0];
    } else if (buttons.length > 0) {
      // Multiple buttons or button with other text
      const remainingText = content.replace(/\[([^\]]+)\](\*)?(?:\s*\{[^}]*\})?/g, '').trim();
      if (!remainingText && buttons.length > 1) {
        // Multiple buttons only
        return {
          type: 'container',
          containerType: 'button-group',
          props: {},
          children: buttons as any[],
        };
      } else if (remainingText) {
        // Button(s) with text - create paragraph with mixed content
        const children: WiremdNode[] = [];
        let lastIndex = 0;
        const buttonMatches = Array.from(content.matchAll(/\[([^\]]+)\](\*)?(?:\s*(\{[^}]*\}))?/g));

        buttonMatches.forEach((match, idx) => {
          // Add text before button
          const textBefore = content.substring(lastIndex, match.index);
          if (textBefore.trim()) {
            children.push({ type: 'text', content: textBefore, props: {} });
          }

          // Add button
          children.push(buttons[idx]);

          lastIndex = match.index! + match[0].length;
        });

        // Add remaining text after last button
        const textAfter = content.substring(lastIndex);
        if (textAfter.trim()) {
          children.push({ type: 'text', content: textAfter, props: {} });
        }

        return {
          type: 'paragraph',
          children: children as any,
          props: {},
        };
      }
      // Fallthrough to paragraph if there's mixed content
    }
  }

  // Check for icons in content (after button check to avoid conflicts)
  if (/:([a-z-]+):/.test(content)) {
    const iconPattern = /:([a-z-]+):/g;
    const textParts = content.split(iconPattern);
    const children: WiremdNode[] = [];

    for (let i = 0; i < textParts.length; i++) {
      if (i % 2 === 0) {
        // Text part
        if (textParts[i].trim()) {
          children.push({
            type: 'text',
            content: textParts[i],
            props: {},
          });
        }
      } else {
        // Icon name part
        children.push({
          type: 'icon',
          props: { name: textParts[i] },
        });
      }
    }

    if (children.length > 0) {
      // If only one child and it's an icon, return as icon
      if (children.length === 1 && children[0].type === 'icon') {
        return children[0];
      }

      // If only one child and it's text, return as paragraph
      if (children.length === 1 && children[0].type === 'text') {
        return {
          type: 'paragraph',
          content: children[0].content,
          props: {},
        };
      }

      // Mixed content, return as paragraph with children
      // Clean up trailing ::: from the last text child if present
      const cleanedChildren = [...children];
      if (cleanedChildren.length > 0) {
        const lastChild = cleanedChildren[cleanedChildren.length - 1];
        if (lastChild.type === 'text' && lastChild.content) {
          const cleaned = lastChild.content.replace(/\s*:::\s*$/, '').trim();
          if (cleaned) {
            cleanedChildren[cleanedChildren.length - 1] = { ...lastChild, content: cleaned };
          } else {
            // Remove empty text node
            cleanedChildren.pop();
          }
        }
      }

      return {
        type: 'paragraph',
        children: cleanedChildren as any,
        props: {},
      };
    }
  }

  // Check for standalone icon syntax: :icon-name:
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
  // Remove trailing container closing markers (:::) if present
  const cleanedContent = content.replace(/\s*:::\s*$/, '').trim();

  return {
    type: 'paragraph',
    content: cleanedContent,
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
  // Extract immediate text content (from paragraph) and nested children
  let immediateContent = '';
  const nestedChildren: WiremdNode[] = [];

  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      // First paragraph contains the immediate list item text
      if (child.type === 'paragraph' && !immediateContent) {
        immediateContent = extractTextContent(child);
      }
      // Nested lists should be transformed and added as children
      else if (child.type === 'list') {
        const transformed = transformList(child, options);
        if (transformed) {
          nestedChildren.push(transformed);
        }
      }
    }
  }

  const content = immediateContent || extractTextContent(node);

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

    // Parse icons in checkbox label
    if (/:([a-z-]+):/.test(label)) {
      const iconPattern = /:([a-z-]+):/g;
      const parts = label.split(iconPattern);
      const children: WiremdNode[] = [];

      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          if (parts[i].trim()) {
            children.push({
              type: 'text',
              content: parts[i],
              props: {},
            });
          }
        } else {
          children.push({
            type: 'icon',
            props: { name: parts[i] },
          });
        }
      }

      // Add nested children if any
      if (nestedChildren.length > 0) {
        children.push(...nestedChildren);
      }

      return {
        type: 'checkbox',
        label: '', // Will use children instead
        checked: node.checked === true,
        props: { ...props, hasChildren: true },
        children: children as any,
      };
    }

    return {
      type: 'checkbox',
      label,
      checked: node.checked === true,
      props,
      children: nestedChildren.length > 0 ? (nestedChildren as any) : undefined,
    };
  }

  // Check for radio button: ( ) or (•) or (x) or (*)
  const radioMatch = content.match(/^\(([•x* ])\)\s*(.+)$/);
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
      children: nestedChildren.length > 0 ? (nestedChildren as any) : undefined,
    };
  }

  // Parse icons in regular list items
  if (/:([a-z-]+):/.test(content)) {
    const iconPattern = /:([a-z-]+):/g;
    const parts = content.split(iconPattern);
    const children: WiremdNode[] = [];

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        if (parts[i].trim()) {
          children.push({
            type: 'text',
            content: parts[i],
            props: {},
          });
        }
      } else {
        children.push({
          type: 'icon',
          props: { name: parts[i] },
        });
      }
    }

    // Add nested children if any
    if (nestedChildren.length > 0) {
      children.push(...nestedChildren);
    }

    return {
      type: 'list-item',
      children: children as any,
      props: {},
    };
  }

  return {
    type: 'list-item',
    content,
    props: {},
    children: nestedChildren.length > 0 ? (nestedChildren as any) : undefined,
  };
}

/**
 * Transform table node
 */
function transformTable(node: any, options: ParseOptions): WiremdNode {
  const children: WiremdNode[] = [];
  const align = node.align || [];

  // Process each row
  for (let rowIndex = 0; rowIndex < node.children.length; rowIndex++) {
    const row = node.children[rowIndex];
    const isHeader = rowIndex === 0;
    const cells: WiremdNode[] = [];

    // Process each cell in the row
    for (let cellIndex = 0; cellIndex < row.children.length; cellIndex++) {
      const cell = row.children[cellIndex];
      const cellAlign = align[cellIndex] || 'left';
      const cellChildren: WiremdNode[] = [];

      // Transform cell content
      for (const child of cell.children || []) {
        if (child.type === 'text') {
          cellChildren.push({
            type: 'text',
            content: child.value,
            props: {},
          });
        } else if (child.type === 'strong') {
          cellChildren.push({
            type: 'text',
            content: `<strong>${extractTextContent(child)}</strong>`,
            props: {},
          });
        } else if (child.type === 'emphasis') {
          cellChildren.push({
            type: 'text',
            content: `<em>${extractTextContent(child)}</em>`,
            props: {},
          });
        } else if (child.type === 'code') {
          cellChildren.push({
            type: 'text',
            content: `<code>${extractTextContent(child)}</code>`,
            props: {},
          });
        } else {
          const transformed = transformNode(child, options);
          if (transformed) {
            cellChildren.push(transformed);
          }
        }
      }

      cells.push({
        type: 'table-cell',
        content: extractTextContent(cell),
        children: cellChildren.length > 0 ? cellChildren : undefined,
        align: cellAlign as 'left' | 'center' | 'right',
        header: isHeader,
      });
    }

    if (isHeader) {
      children.push({
        type: 'table-header',
        children: cells,
      });
    } else {
      children.push({
        type: 'table-row',
        children: cells,
      });
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
