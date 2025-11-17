import { describe, it, expect } from 'vitest';
import { parse, validate, renderToHTML, renderToJSON, renderToReact, renderToTailwind } from '../src/index.js';
import type { WiremdNode } from '../src/types.js';

/**
 * Tests for API examples from the documentation
 * Ensures all documented examples work correctly
 */
describe('API Examples from Documentation', () => {
  describe('Parser API Examples', () => {
    it('should parse basic example from docs', () => {
      const ast = parse(`
## Contact Form

Name
[_____________________________]{required}

Email
[_____________________________]{type:email required}

[Submit]{.primary} [Cancel]
      `);

      expect(ast.type).toBe('document');
      expect(ast.children.length).toBeGreaterThan(0);
    });

    it('should parse with position information', () => {
      const ast = parse(`
## Login Form
[Button]
      `, { position: true });

      ast.children.forEach(node => {
        if (node.position) {
          expect(node.position.start.line).toBeGreaterThan(0);
        }
      });
    });

    it('should parse with validation', () => {
      expect(() => {
        const ast = parse(`
## My Wireframe
[Button]
        `, { validate: true });

        expect(ast).toBeDefined();
      }).not.toThrow();
    });

    it('should extract metadata', () => {
      const ast = parse(`
## My Wireframe
This is a description
      `);

      expect(ast.meta).toBeDefined();
      expect(ast.version).toBe('0.1');
    });

    it('should count node types', () => {
      const ast = parse(`
## Dashboard

[Search...]{type:search}

> Grid(3)
[Card 1]
[Card 2]
[Card 3]
      `);

      function countNodeTypes(nodes: WiremdNode[]): Record<string, number> {
        const counts: Record<string, number> = {};

        function traverse(node: WiremdNode) {
          counts[node.type] = (counts[node.type] || 0) + 1;

          if ('children' in node && Array.isArray(node.children)) {
            node.children.forEach(traverse);
          }
        }

        nodes.forEach(traverse);
        return counts;
      }

      const counts = countNodeTypes(ast.children);
      expect(counts).toBeDefined();
      expect(Object.keys(counts).length).toBeGreaterThan(0);
    });
  });

  describe('Validation API Examples', () => {
    it('should validate basic form', () => {
      const ast = parse(`
## Contact Form
[Submit]
      `);

      const errors = validate(ast);
      expect(errors.length).toBe(0);
    });

    it('should collect validation errors', () => {
      const ast = parse(`
## Contact Form
[Submit]
      `);

      const errors = validate(ast);

      if (errors.length === 0) {
        expect(true).toBe(true); // Valid
      } else {
        errors.forEach(error => {
          expect(error.message).toBeDefined();
          expect(typeof error.message).toBe('string');
        });
      }
    });

    it('should validate before rendering', () => {
      const markdown = `
## Contact Form
[Button]
      `;

      const ast = parse(markdown);
      const errors = validate(ast);

      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
      }

      const html = renderToHTML(ast);
      expect(html).toContain('<!DOCTYPE html>');
    });
  });

  describe('Renderer API Examples', () => {
    it('should render to HTML with different styles', () => {
      const ast = parse(`## Dashboard\n[Login]`);

      const sketch = renderToHTML(ast, { style: 'sketch' });
      expect(sketch).toContain('wmd-sketch');

      const clean = renderToHTML(ast, { style: 'clean' });
      expect(clean).toContain('wmd-clean');

      const wireframe = renderToHTML(ast, { style: 'wireframe' });
      expect(wireframe).toContain('wmd-wireframe');

      const material = renderToHTML(ast, { style: 'material' });
      expect(material).toContain('wmd-material');

      const brutal = renderToHTML(ast, { style: 'brutal' });
      expect(brutal).toContain('wmd-brutal');

      const none = renderToHTML(ast, { style: 'none' });
      expect(none).toContain('wmd-none');
    });

    it('should render with custom class prefix', () => {
      const ast = parse(`## Form\n[Button]`);

      const html = renderToHTML(ast, {
        classPrefix: 'my-app-',
        style: 'clean'
      });

      expect(html).toContain('my-app-');
    });

    it('should render minified HTML', () => {
      const ast = parse(`## Title\n[Button]`);

      const html = renderToHTML(ast, {
        pretty: false,
        style: 'sketch'
      });

      expect(html).not.toMatch(/\n\s+/);
    });

    it('should render to JSON', () => {
      const ast = parse(`## Login\n[Button]`);

      const json = renderToJSON(ast);
      expect(json).toContain('"type"');
      expect(json).toContain('"document"');

      const parsed = JSON.parse(json);
      expect(parsed.type).toBe('document');
    });

    it('should render pretty vs minified JSON', () => {
      const ast = parse(`## Form\n[Submit]`);

      const pretty = renderToJSON(ast, { pretty: true });
      expect(pretty).toContain('\n');
      expect(pretty).toContain('  ');

      const minified = renderToJSON(ast, { pretty: false });
      expect(minified).not.toContain('\n  ');
    });

    it('should render to React component', () => {
      const ast = parse(`
## Login Form

Username
[_____________________________]

Password
[_____________________________]{type:password}

[Login]{.primary}
      `);

      const component = renderToReact(ast);

      expect(component).toContain('import React from');
      expect(component).toContain('export const');
      expect(component).toContain('return (');
      expect(component).toContain('className');
    });

    it('should render React TypeScript vs JavaScript', () => {
      const ast = parse(`## Form\n[Button]`);

      const tsComponent = renderToReact(ast, {
        typescript: true,
        componentName: 'LoginForm'
      });
      expect(tsComponent).toContain(': React.FC');

      const jsComponent = renderToReact(ast, {
        typescript: false,
        componentName: 'LoginForm'
      });
      expect(jsComponent).toContain('LoginForm');
    });

    it('should render to Tailwind', () => {
      const ast = parse(`
## Dashboard

> Card
### Analytics
Page views: 1,234
[View Details]
      `);

      const html = renderToTailwind(ast);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('tailwindcss');
    });
  });

  describe('Complete Workflow Examples', () => {
    it('should complete full parsing and rendering pipeline', () => {
      const markdown = `
## Contact Form

Name
[_____________________________]{required}

Email
[_____________________________]{type:email required}

[Submit]{.primary} [Cancel]
      `;

      // Parse
      const ast = parse(markdown, { position: true });
      expect(ast.type).toBe('document');

      // Validate
      const errors = validate(ast);
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
      }

      // Render
      const html = renderToHTML(ast, {
        style: 'clean',
        pretty: true
      });

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('Contact Form');
      expect(html).toContain('required');
    });

    it('should generate multiple output formats', () => {
      const markdown = '## Login\n[Submit]{.primary}';
      const ast = parse(markdown);

      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toContain('<!DOCTYPE html>');

      const react = renderToReact(ast, { typescript: true });
      expect(react).toContain('import React');

      const json = renderToJSON(ast, { pretty: true });
      expect(json).toContain('"type"');
    });

    it('should manipulate AST', () => {
      const ast = parse('## Form\n[Button]');

      // Modify the AST
      ast.children.push({
        type: 'paragraph',
        content: 'Added programmatically',
        props: {}
      });

      expect(ast.children.length).toBeGreaterThan(2);

      const html = renderToHTML(ast);
      expect(html).toContain('Added programmatically');
    });

    it('should traverse and modify AST', () => {
      const ast = parse('## Form\n[Button]\n[Submit]');

      function addClassToButtons(node: WiremdNode) {
        if (node.type === 'button') {
          node.props.classes = [...(node.props.classes || []), 'custom-class'];
        }

        if ('children' in node && node.children) {
          node.children.forEach(addClassToButtons);
        }
      }

      ast.children.forEach(addClassToButtons);

      // Check that buttons have the custom class
      let buttonCount = 0;
      ast.children.forEach(node => {
        if (node.type === 'button') {
          buttonCount++;
          expect(node.props.classes).toContain('custom-class');
        }
      });

      expect(buttonCount).toBe(2);
    });
  });

  describe('Performance Examples', () => {
    it('should cache parsed ASTs', () => {
      const astCache = new Map<string, ReturnType<typeof parse>>();

      function getCachedAST(markdown: string) {
        if (!astCache.has(markdown)) {
          astCache.set(markdown, parse(markdown));
        }
        return astCache.get(markdown)!;
      }

      const ast1 = getCachedAST('## Form\n[Button]');
      const ast2 = getCachedAST('## Form\n[Button]');

      expect(ast1).toBe(ast2); // Same reference
    });

    it('should reuse parsed ASTs for multiple renderers', () => {
      const markdown = `## Dashboard\n[Button]`;
      const ast = parse(markdown); // Parse once

      // Render multiple times
      const html = renderToHTML(ast, { style: 'sketch' });
      const json = renderToJSON(ast);
      const react = renderToReact(ast);

      expect(html).toContain('<!DOCTYPE html>');
      expect(json).toContain('"type"');
      expect(react).toContain('import React');
    });
  });

  describe('Error Handling Examples', () => {
    it('should handle parse errors gracefully', () => {
      function parseUserInput(input: string) {
        try {
          return {
            success: true,
            ast: parse(input, { position: true }),
            error: null
          };
        } catch (error: any) {
          return {
            success: false,
            ast: null,
            error: error.message
          };
        }
      }

      const result = parseUserInput('## Valid');
      expect(result.success).toBe(true);
      expect(result.ast).not.toBeNull();
    });

    it('should use comprehensive error handler', () => {
      interface RenderResult {
        success: boolean;
        html?: string;
        error?: {
          type: 'parse' | 'validation' | 'render';
          message: string;
          code?: string;
        };
      }

      function renderSafely(markdown: string): RenderResult {
        try {
          const ast = parse(markdown, { position: true });

          const errors = validate(ast);
          if (errors.length > 0) {
            return {
              success: false,
              error: {
                type: 'validation',
                message: errors.map(e => e.message).join('; '),
                code: errors[0].code
              }
            };
          }

          const html = renderToHTML(ast);

          return {
            success: true,
            html
          };
        } catch (error: any) {
          return {
            success: false,
            error: {
              type: 'parse',
              message: error.message
            }
          };
        }
      }

      const result = renderSafely('## Title\n[Button]');
      expect(result.success).toBe(true);
      expect(result.html).toBeDefined();
    });
  });

  describe('Type-safe AST Traversal Examples', () => {
    it('should traverse AST type-safely', () => {
      const ast = parse(`
## Dashboard

[Search...]{type:search}

[Submit]{.primary} [Cancel]
      `);

      const buttonContents: string[] = [];

      function traverse(node: WiremdNode) {
        if (node.type === 'button') {
          if (node.content) {
            buttonContents.push(node.content);
          }
        }

        if ('children' in node && node.children) {
          node.children.forEach(traverse);
        }
      }

      ast.children.forEach(traverse);

      expect(buttonContents).toContain('Submit');
      expect(buttonContents).toContain('Cancel');
    });

    it('should process nodes by type', () => {
      const ast = parse(`
## Form

Name
[_____]{required}

[Submit]*
      `);

      const requiredFields: string[] = [];
      const primaryButtons: string[] = [];

      function process(node: WiremdNode) {
        if (node.type === 'input' && node.props.required) {
          requiredFields.push('input');
        }

        if (node.type === 'button' && node.props.variant === 'primary') {
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
});
