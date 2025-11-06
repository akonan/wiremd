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
        const firstLine = node.children[0].value.trim();
        // Match ::: followed by optional type and optional attributes
        const match = firstLine.match(/^:::\s*(\S+)?\s*(\{[^}]+\})?$/);

        if (match) {
          // Found container start
          const containerType = match[1] || 'section';
          const attrs = match[2] ? match[2].trim() : '';

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
              child.children[0].type === 'text' &&
              child.children[0].value.trim() === ':::'
            ) {
              // Found closing, break
              i++;
              break;
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
