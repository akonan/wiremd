/**
 * Custom remark plugin to parse container directives (:::)
 * Handles syntax like:
 * ::: container-type {.class attr="value"}
 * content
 * :::
 */

import type { Plugin } from 'unified';

/**
 * Remark plugin to parse wiremd container directives
 */
export const remarkWiremdContainers: Plugin = () => {
  return (tree: any) => {
    const newChildren: any[] = [];
    let i = 0;

    while (i < tree.children.length) {
      const node = tree.children[i];

      // Check if this is a container start (paragraph starting with :::)
      if (
        node.type === 'paragraph' &&
        node.children &&
        node.children.length > 0 &&
        node.children[0].type === 'text' &&
        node.children[0].value.startsWith(':::')
      ) {
        const fullText = node.children[0].value;
        const lines = fullText.split('\n');
        const firstLine = lines[0].trim();

        // Match ::: followed by optional type and optional attributes
        const match = firstLine.match(/^:::\s*(\S+)?\s*(\{[^}]+\})?$/);

        if (match) {
          // Found container start
          const containerType = match[1] || 'section';
          const attrs = match[2] ? match[2].trim() : '';

          // Check if this is a complete container within a single paragraph
          // This happens when the paragraph has multiple children or ends with :::
          let isCompleteContainer = false;

          // Check if the last text child ends with :::
          for (let j = node.children.length - 1; j >= 0; j--) {
            const child = node.children[j];
            if (child.type === 'text') {
              if (child.value.includes(':::')) {
                // Check if it ends with ::: (might have newline after)
                const trimmed = child.value.trim();
                if (trimmed.endsWith(':::') || child.value.includes('\n:::')) {
                  isCompleteContainer = true;
                }
              }
              break;
            }
          }

          if (isCompleteContainer) {
            // This paragraph contains a complete container
            const contentChildren: any[] = [];

            // Process the content
            if (node.children.length === 1 && node.children[0].type === 'text') {
              // Simple case: all content in one text node
              const lines = node.children[0].value.split('\n');
              // Find closing :::
              let closingIndex = -1;
              for (let j = lines.length - 1; j >= 1; j--) {
                if (lines[j].trim() === ':::') {
                  closingIndex = j;
                  break;
                }
              }

              if (closingIndex > 0) {
                const contentLines = lines.slice(1, closingIndex);
                const contentText = contentLines.join('\n');
                if (contentText.trim()) {
                  contentChildren.push({
                    type: 'paragraph',
                    children: [{
                      type: 'text',
                      value: contentText.trim()
                    }]
                  });
                }
              }
            } else {
              // Complex case: content spread across multiple children
              const processedChildren: any[] = [];

              // Skip the first text node if it only contains the opening :::
              let startIdx = 0;
              if (node.children[0].type === 'text') {
                const firstLines = node.children[0].value.split('\n');
                if (firstLines.length > 1 && firstLines[1].trim()) {
                  // First text node has content after the opening
                  processedChildren.push({
                    type: 'text',
                    value: firstLines.slice(1).join('\n').trim()
                  });
                }
                startIdx = 1;
              }

              // Process middle children
              for (let j = startIdx; j < node.children.length; j++) {
                const child = node.children[j];
                if (j === node.children.length - 1 && child.type === 'text') {
                  // Last child - remove closing :::
                  const value = child.value.replace(/\n?:::$/, '').trim();
                  if (value) {
                    processedChildren.push({
                      ...child,
                      value
                    });
                  }
                } else {
                  processedChildren.push(child);
                }
              }

              if (processedChildren.length > 0) {
                contentChildren.push({
                  type: 'paragraph',
                  children: processedChildren
                });
              }
            }

            // Create container node
            newChildren.push({
              type: 'wiremdContainer',
              containerType,
              attributes: attrs,
              children: contentChildren,
              data: {
                hName: 'div',
                hProperties: {
                  className: ['wiremd-container', `wiremd-${containerType}`],
                },
              },
            });

            i++;
            continue;
          }

          // Collect children until closing :::
          const containerChildren: any[] = [];
          i++; // Move past the opening line

          while (i < tree.children.length) {
            const child = tree.children[i];

            // Check for closing :::
            if (
              child.type === 'paragraph' &&
              child.children &&
              child.children.length > 0 &&
              child.children[0].type === 'text'
            ) {
              const text = child.children[0].value;

              // Check if the text contains closing ::: marker
              const lines = text.split('\n');
              let foundClosing = false;
              const newLines: string[] = [];

              for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed === ':::') {
                  foundClosing = true;
                  break;
                } else if (trimmed.startsWith(':::')) {
                  // Check if this is a new container start (has content after :::)
                  const afterMarker = trimmed.substring(3).trim();
                  if (afterMarker) {
                    // This looks like a new container start, not a closing marker
                    // Treat the current line as the last line before this new container
                    foundClosing = true;
                    // Add the current line back to the tree for processing
                    const remainingLines = lines.slice(lines.indexOf(line));
                    if (remainingLines.length > 0) {
                      // Insert this as a new paragraph node that will be processed next
                      tree.children.splice(i + 1, 0, {
                        type: 'paragraph',
                        children: [{
                          type: 'text',
                          value: remainingLines.join('\n')
                        }]
                      });
                    }
                    break;
                  }
                } else if (line.includes(':::')) {
                  // Check if ::: is at the end of the line
                  if (trimmed.endsWith(':::')) {
                    const beforeClosing = line.substring(0, line.lastIndexOf(':::'));
                    if (beforeClosing.trim()) {
                      newLines.push(beforeClosing);
                    }
                    foundClosing = true;
                    break;
                  } else {
                    newLines.push(line);
                  }
                } else {
                  newLines.push(line);
                }
              }

              if (foundClosing) {
                // Add any content before the closing marker
                if (newLines.length > 0) {
                  const newText = newLines.join('\n');
                  if (newText.trim()) {
                    const newChild = {
                      ...child,
                      children: [{
                        ...child.children[0],
                        value: newText
                      }, ...child.children.slice(1)]
                    };
                    containerChildren.push(newChild);
                  }
                }
                i++;
                break;
              }
            }

            // For list nodes, check if the last item contains closing :::
            if (child.type === 'list' && child.children) {
              const lastItem = child.children[child.children.length - 1];
              if (lastItem && lastItem.children && lastItem.children.length > 0) {
                const lastChild = lastItem.children[lastItem.children.length - 1];
                if (lastChild.type === 'paragraph' && lastChild.children && lastChild.children.length > 0) {
                  const textNode = lastChild.children[0];
                  if (textNode.type === 'text') {
                    const lines = textNode.value.split('\n');
                    const lastLine = lines[lines.length - 1].trim();

                    if (lastLine === ':::') {
                      // Remove the closing ::: from the list item
                      textNode.value = lines.slice(0, -1).join('\n').trim();
                      containerChildren.push(child);
                      i++;
                      break;
                    }
                  }
                }
              }
            }

            containerChildren.push(child);
            i++;
          }

          // Create container node
          newChildren.push({
            type: 'wiremdContainer',
            containerType,
            attributes: attrs,
            children: containerChildren,
            data: {
              hName: 'div',
              hProperties: {
                className: ['wiremd-container', `wiremd-${containerType}`],
              },
            },
          });

          continue;
        }
      }

      // Not a container, keep as is
      newChildren.push(node);
      i++;
    }

    tree.children = newChildren;
  };
};
