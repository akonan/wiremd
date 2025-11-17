import { describe, it, expect } from 'vitest';
import { parse, validate } from '../src/parser/index.js';
import type { DocumentNode, WiremdNode } from '../src/types.js';

describe('Validation', () => {
  describe('validate() function', () => {
    it('should validate a valid AST', () => {
      const ast = parse('## Title\n[Button]');
      const errors = validate(ast);

      expect(errors).toEqual([]);
      expect(errors.length).toBe(0);
    });

    it('should validate empty document', () => {
      const ast = parse('');
      const errors = validate(ast);

      expect(errors).toEqual([]);
    });

    it('should validate complex form', () => {
      const ast = parse(`
## Contact Form

Name
[_____________________________]{required}

Email
[_____________________________]{type:email required}

[Submit]{.primary} [Cancel]
      `);

      const errors = validate(ast);
      expect(errors).toEqual([]);
    });

    it('should detect invalid root type', () => {
      const invalidAST = {
        type: 'invalid',
        meta: {},
        children: []
      } as any;

      const errors = validate(invalidAST);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toContain('Root node must be of type "document"');
      expect(errors[0].code).toBe('INVALID_ROOT_TYPE');
    });

    it('should detect missing metadata', () => {
      const invalidAST = {
        type: 'document',
        version: '0.1',
        children: []
      } as any;

      const errors = validate(invalidAST);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toContain('Document must have metadata');
      expect(errors[0].code).toBe('MISSING_META');
    });

    it('should detect invalid children type', () => {
      const invalidAST = {
        type: 'document',
        version: '0.1',
        meta: {},
        children: 'not an array'
      } as any;

      const errors = validate(invalidAST);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toContain('Document children must be an array');
      expect(errors[0].code).toBe('INVALID_CHILDREN');
    });

    it('should detect nodes without type', () => {
      const invalidAST = {
        type: 'document',
        version: '0.1',
        meta: {},
        children: [
          { content: 'Hello' } as any
        ]
      } as any;

      const errors = validate(invalidAST);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toContain('Node must have a type');
      expect(errors[0].code).toBe('MISSING_NODE_TYPE');
    });

    it('should validate nested children recursively', () => {
      const ast = parse(`
::: hero

## Welcome

[Get Started]*

:::
      `);

      const errors = validate(ast);
      expect(errors).toEqual([]);
    });

    it('should detect errors in nested structures', () => {
      const invalidAST = {
        type: 'document',
        version: '0.1',
        meta: {},
        children: [
          {
            type: 'container',
            containerType: 'card',
            props: {},
            children: [
              { content: 'No type' } as any
            ]
          }
        ]
      } as any;

      const errors = validate(invalidAST);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].path).toBeDefined();
    });
  });

  describe('Custom validation', () => {
    it('should allow custom validation rules', () => {
      const ast = parse('[Button]\n![](image.jpg)');
      const warnings: string[] = [];

      function traverseAndValidate(node: WiremdNode) {
        // Check for buttons without labels
        if (node.type === 'button' && !node.content && !node.children?.length) {
          warnings.push('Button without label');
        }

        // Check for images without alt text
        if (node.type === 'image' && !node.alt) {
          warnings.push('Image without alt text');
        }

        if ('children' in node && node.children) {
          node.children.forEach(traverseAndValidate);
        }
      }

      ast.children.forEach(traverseAndValidate);
      expect(warnings).toContain('Image without alt text');
    });

    it('should detect accessibility issues', () => {
      const ast = parse('[Button]\n![](missing-alt.png)');
      const a11yErrors: string[] = [];

      function checkAccessibility(node: WiremdNode) {
        if (node.type === 'image' && !node.alt) {
          a11yErrors.push('Image missing alt text');
        }

        if (node.type === 'button' && !node.content && !node.children?.length) {
          a11yErrors.push('Button missing label');
        }

        if ('children' in node && node.children) {
          node.children.forEach(checkAccessibility);
        }
      }

      ast.children.forEach(checkAccessibility);
      expect(a11yErrors.length).toBeGreaterThan(0);
      expect(a11yErrors).toContain('Image missing alt text');
    });

    it('should validate with pre-render checks', () => {
      const markdown = `
## Dashboard
[Search...]
[Button]
      `;

      const ast = parse(markdown);
      const errors = validate(ast);

      expect(errors.length).toBe(0);
      expect(() => {
        if (errors.length > 0) {
          throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
        }
      }).not.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('should handle deeply nested structures', () => {
      const ast = parse(`
::: modal
::: card
::: section
## Title
[Button]
:::
:::
:::
      `);

      const errors = validate(ast);
      expect(errors).toEqual([]);
    });

    it('should handle mixed content', () => {
      const ast = parse(`
## Heading

Paragraph text

[Button]

- [x] Checkbox
- ( ) Radio

![Image](image.jpg)

:icon:
      `);

      const errors = validate(ast);
      expect(errors).toEqual([]);
    });

    it('should validate with position information', () => {
      const ast = parse('## Title\n[Button]', { position: true });
      const errors = validate(ast);

      expect(errors).toEqual([]);
      expect(ast.children[0].position).toBeDefined();
    });
  });

  describe('Error path tracking', () => {
    it('should provide path information for nested errors', () => {
      const invalidAST = {
        type: 'document',
        version: '0.1',
        meta: {},
        children: [
          {
            type: 'container',
            containerType: 'card',
            props: {},
            children: [
              {
                type: 'container',
                containerType: 'section',
                props: {},
                children: [
                  { invalid: true } as any
                ]
              }
            ]
          }
        ]
      } as any;

      const errors = validate(invalidAST);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].path).toBeDefined();
      expect(errors[0].path?.length).toBeGreaterThan(0);
    });
  });

  describe('Integration with parse()', () => {
    it('should validate during parsing when option is set', () => {
      expect(() => {
        parse('## Title\n[Button]', { validate: true });
      }).not.toThrow();
    });

    it('should work with all parse options', () => {
      const ast = parse('## Title\n[Button]', {
        position: true,
        validate: true,
        strict: false
      });

      const errors = validate(ast);
      expect(errors).toEqual([]);
    });
  });
});
