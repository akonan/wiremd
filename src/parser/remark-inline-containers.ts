/**
 * Custom remark plugin to parse inline container directives [[...]]
 * Handles syntax like:
 * [[ Logo | Home | Products | [Sign In] ]]{.nav}
 *
 * Copyright (c) 2025 wiremd
 * Licensed under MIT License
 * https://github.com/akonan/wiremd/blob/main/LICENSE
 */

import type { Plugin } from 'unified';

/**
 * Remark plugin to parse wiremd inline container directives
 */
export const remarkWiremdInlineContainers: Plugin = () => {
  return (tree: any) => {
    const newChildren: any[] = [];

    for (const node of tree.children) {
      // Check if this is a paragraph that might contain [[...]]
      if (
        node.type === 'paragraph' &&
        node.children &&
        node.children.length > 0
      ) {
        const text = node.children.map((c: any) => c.value || '').join('');

        // Check for inline container syntax [[...]]
        const match = text.match(/^\[\[\s*(.+?)\s*\]\](\{[^}]+\})?$/);

        if (match) {
          const content = match[1];
          const attrs = match[2] || '';

          // Parse items separated by |
          const items = content.split('|').map((item: string) => item.trim());

          // Create inline container node (navigation)
          newChildren.push({
            type: 'wiremdInlineContainer',
            content,
            items,
            attributes: attrs.trim(),
            children: node.children,
            data: {
              hName: 'nav',
              hProperties: {
                className: ['wiremd-nav'],
              },
            },
          });

          continue;
        }
      }

      // Not an inline container, keep as is
      newChildren.push(node);
    }

    tree.children = newChildren;
  };
};
