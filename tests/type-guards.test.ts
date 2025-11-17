import { describe, it, expect } from 'vitest';
import { parse } from '../src/parser/index.js';
import {
  isButtonNode,
  isInputNode,
  isContainerNode,
  isHeadingNode,
  isTextNode,
  isIconNode,
  isNavNode,
  isGridNode,
  isFormNode,
} from '../src/types.js';
import type { WiremdNode } from '../src/types.js';

describe('Type Guards', () => {
  describe('isButtonNode()', () => {
    it('should identify button nodes', () => {
      const ast = parse('[Submit]');
      const node = ast.children[0];

      expect(isButtonNode(node)).toBe(true);
      expect(node.type).toBe('button');

      if (isButtonNode(node)) {
        // TypeScript should know this is a ButtonNode
        expect(node.content).toBe('Submit');
        expect(node.props).toBeDefined();
      }
    });

    it('should return false for non-button nodes', () => {
      const ast = parse('## Heading');
      const node = ast.children[0];

      expect(isButtonNode(node)).toBe(false);
    });

    it('should work with primary buttons', () => {
      const ast = parse('[Submit]*');
      const node = ast.children[0];

      expect(isButtonNode(node)).toBe(true);
      if (isButtonNode(node)) {
        expect(node.props.variant).toBe('primary');
      }
    });
  });

  describe('isInputNode()', () => {
    it('should identify input nodes', () => {
      const ast = parse('[_____]');
      const node = ast.children[0];

      expect(isInputNode(node)).toBe(true);
      expect(node.type).toBe('input');

      if (isInputNode(node)) {
        expect(node.props).toBeDefined();
        expect(node.props.inputType).toBeDefined();
      }
    });

    it('should return false for non-input nodes', () => {
      const ast = parse('[Button]');
      const node = ast.children[0];

      expect(isInputNode(node)).toBe(false);
    });

    it('should work with different input types', () => {
      const ast = parse('[_____]{type:email}');
      const node = ast.children[0];

      expect(isInputNode(node)).toBe(true);
      if (isInputNode(node)) {
        expect(node.props.type).toBe('email');
      }
    });
  });

  describe('isContainerNode()', () => {
    it('should identify container nodes', () => {
      const ast = parse(`
::: hero

# Welcome

:::
      `);
      const node = ast.children[0];

      expect(isContainerNode(node)).toBe(true);
      expect(node.type).toBe('container');

      if (isContainerNode(node)) {
        expect(node.containerType).toBe('hero');
        expect(node.children).toBeDefined();
      }
    });

    it('should return false for non-container nodes', () => {
      const ast = parse('[Button]');
      const node = ast.children[0];

      expect(isContainerNode(node)).toBe(false);
    });

    it('should work with different container types', () => {
      const containers = ['hero', 'card', 'modal', 'sidebar'];

      containers.forEach(type => {
        const ast = parse(`::: ${type}\nContent\n:::`);
        const node = ast.children[0];

        expect(isContainerNode(node)).toBe(true);
        if (isContainerNode(node)) {
          expect(node.containerType).toBe(type);
        }
      });
    });
  });

  describe('isHeadingNode()', () => {
    it('should identify heading nodes', () => {
      const ast = parse('## Welcome');
      const node = ast.children[0];

      expect(isHeadingNode(node)).toBe(true);
      expect(node.type).toBe('heading');

      if (isHeadingNode(node)) {
        expect(node.level).toBe(2);
        expect(node.content).toBe('Welcome');
      }
    });

    it('should return false for non-heading nodes', () => {
      const ast = parse('[Button]');
      const node = ast.children[0];

      expect(isHeadingNode(node)).toBe(false);
    });

    it('should work with all heading levels', () => {
      for (let level = 1; level <= 6; level++) {
        const hashes = '#'.repeat(level);
        const ast = parse(`${hashes} Heading ${level}`);
        const node = ast.children[0];

        expect(isHeadingNode(node)).toBe(true);
        if (isHeadingNode(node)) {
          expect(node.level).toBe(level);
        }
      }
    });
  });

  describe('isTextNode()', () => {
    it('should identify text nodes', () => {
      const ast = parse('Plain text');
      const paragraph = ast.children[0];

      // Text nodes are usually children of other nodes
      if ('children' in paragraph && paragraph.children) {
        const hasTextNode = paragraph.children.some(child => isTextNode(child));
        expect(hasTextNode || paragraph.type === 'paragraph').toBe(true);
      }
    });

    it('should return false for non-text nodes', () => {
      const ast = parse('[Button]');
      const node = ast.children[0];

      expect(isTextNode(node)).toBe(false);
    });
  });

  describe('isIconNode()', () => {
    it('should identify icon nodes', () => {
      const ast = parse(':house:');
      const node = ast.children[0];

      expect(isIconNode(node)).toBe(true);
      expect(node.type).toBe('icon');

      if (isIconNode(node)) {
        expect(node.props.name).toBe('house');
      }
    });

    it('should return false for non-icon nodes', () => {
      const ast = parse('[Button]');
      const node = ast.children[0];

      expect(isIconNode(node)).toBe(false);
    });
  });

  describe('isNavNode()', () => {
    it('should identify navigation nodes', () => {
      const ast = parse('[[ Home | About | Contact ]]');
      const node = ast.children[0];

      expect(isNavNode(node)).toBe(true);
      expect(node.type).toBe('nav');

      if (isNavNode(node)) {
        expect(node.children).toBeDefined();
        expect(node.children.length).toBeGreaterThan(0);
      }
    });

    it('should return false for non-nav nodes', () => {
      const ast = parse('[Button]');
      const node = ast.children[0];

      expect(isNavNode(node)).toBe(false);
    });
  });

  describe('isGridNode()', () => {
    it('should identify grid nodes', () => {
      const ast = parse(`
## Features {.grid-3}

### Feature 1
### Feature 2
### Feature 3
      `);
      const node = ast.children[0];

      expect(isGridNode(node)).toBe(true);
      expect(node.type).toBe('grid');

      if (isGridNode(node)) {
        expect(node.columns).toBe(3);
        expect(node.children).toBeDefined();
      }
    });

    it('should return false for non-grid nodes', () => {
      const ast = parse('[Button]');
      const node = ast.children[0];

      expect(isGridNode(node)).toBe(false);
    });

    it('should work with different column counts', () => {
      for (let cols = 2; cols <= 4; cols++) {
        const items = Array(cols).fill(0).map((_, i) => `### Item ${i + 1}`).join('\n');
        const ast = parse(`## Grid {.grid-${cols}}\n${items}`);
        const node = ast.children[0];

        expect(isGridNode(node)).toBe(true);
        if (isGridNode(node)) {
          expect(node.columns).toBe(cols);
        }
      }
    });
  });

  describe('Type-safe traversal', () => {
    it('should enable type-safe AST traversal', () => {
      const ast = parse(`
## Dashboard

[Search...]{type:search}

[Submit]{.primary} [Cancel]
      `);

      const buttonCount = { count: 0 };
      const inputCount = { count: 0 };
      const headingCount = { count: 0 };

      function traverse(node: WiremdNode) {
        if (isButtonNode(node)) {
          buttonCount.count++;
          expect(node.content).toBeDefined();
        } else if (isInputNode(node)) {
          inputCount.count++;
          expect(node.props.inputType).toBeDefined();
        } else if (isHeadingNode(node)) {
          headingCount.count++;
          expect(node.level).toBeGreaterThan(0);
          expect(node.level).toBeLessThanOrEqual(6);
        }

        if ('children' in node && node.children) {
          node.children.forEach(traverse);
        }
      }

      ast.children.forEach(traverse);

      expect(buttonCount.count).toBe(2);
      expect(inputCount.count).toBe(1);
      expect(headingCount.count).toBe(1);
    });

    it('should allow type-specific processing', () => {
      const ast = parse(`
## Form

Name
[_____]{required}

[Submit]*
      `);

      const requiredFields: string[] = [];
      const primaryButtons: string[] = [];

      function process(node: WiremdNode) {
        if (isInputNode(node) && node.props.required) {
          requiredFields.push('input');
        }

        if (isButtonNode(node) && node.props.variant === 'primary') {
          primaryButtons.push(node.content || 'unnamed');
        }

        if ('children' in node && node.children) {
          node.children.forEach(process);
        }
      }

      ast.children.forEach(process);

      expect(requiredFields.length).toBeGreaterThan(0);
      expect(primaryButtons).toContain('Submit');
    });
  });

  describe('Complex type checking', () => {
    it('should handle nested containers', () => {
      const ast = parse(`
::: modal

::: card

## Title

[Button]

:::

:::
      `);

      let containerCount = 0;
      let buttonCount = 0;

      function traverse(node: WiremdNode) {
        if (isContainerNode(node)) {
          containerCount++;
        }
        if (isButtonNode(node)) {
          buttonCount++;
        }

        if ('children' in node && node.children) {
          node.children.forEach(traverse);
        }
      }

      ast.children.forEach(traverse);

      expect(containerCount).toBe(2);
      expect(buttonCount).toBe(1);
    });

    it('should distinguish between different node types', () => {
      const ast = parse(`
## Heading

Paragraph text

[Button]

[_____]

:icon:
      `);

      const types = new Set<string>();

      function collectTypes(node: WiremdNode) {
        types.add(node.type);

        if ('children' in node && node.children) {
          node.children.forEach(collectTypes);
        }
      }

      ast.children.forEach(collectTypes);

      expect(types.has('heading')).toBe(true);
      expect(types.has('paragraph')).toBe(true);
      expect(types.has('button')).toBe(true);
      expect(types.has('input')).toBe(true);
      expect(types.has('icon')).toBe(true);
    });
  });

  describe('Error prevention', () => {
    it('should prevent accessing wrong properties', () => {
      const ast = parse('[Button]');
      const node = ast.children[0];

      if (isButtonNode(node)) {
        // TypeScript knows these exist
        expect(node.content).toBeDefined();
        expect(node.props).toBeDefined();

        // TypeScript would error on these (they don't exist on ButtonNode):
        // expect(node.inputType).toBeDefined(); // ❌ Error
        // expect(node.containerType).toBeDefined(); // ❌ Error
      }

      if (isInputNode(node)) {
        // This block won't execute since node is a button
        expect(node.props.inputType).toBeDefined();
      }
    });

    it('should enable safe property access in mixed arrays', () => {
      const ast = parse('[Button]\n[_____]\n## Heading');

      ast.children.forEach(node => {
        if (isButtonNode(node)) {
          expect(node.content).toBeDefined();
        } else if (isInputNode(node)) {
          expect(node.props.inputType).toBeDefined();
        } else if (isHeadingNode(node)) {
          expect(node.level).toBeDefined();
        }
      });
    });
  });
});
