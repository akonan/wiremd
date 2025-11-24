import { describe, it, expect } from 'vitest';
import { parse, validate } from '../src/parser/index.js';
import type { DocumentNode } from '../src/types.js';

describe('Enhanced AST Validation', () => {
  describe('Enhanced Error Messages', () => {
    it('should provide actionable error messages with suggestions', () => {
      const ast = parse('');
      ast.children.push({ type: 'buton', content: 'Click', props: {} } as any);
      const errors = validate(ast, { enhanced: true });

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toContain('Did you mean: button');
    });

    it('should provide helpful context in error messages', () => {
      const ast = parse('');
      ast.children.push({
        type: 'container',
        props: {},
        children: [],
      } as any);
      const errors = validate(ast, { enhanced: true });

      const containerTypeError = errors.find(e => e.code === 'MISSING_CONTAINER_TYPE');
      expect(containerTypeError?.message).toContain('e.g., "hero", "card", "modal"');
    });

    it('should suggest alternatives for invalid enum values', () => {
      const ast = parse('[Submit]');
      (ast.children[0] as any).props.variant = 'invalid';
      const errors = validate(ast, { enhanced: true });

      const variantError = errors.find(e => e.code === 'INVALID_BUTTON_VARIANT');
      expect(variantError?.message).toContain('Must be one of: primary, secondary, danger');
    });
  });

  describe('Additional Validation Rules', () => {
    it('should validate that tables start with a header', () => {
      const ast = parse('');
      ast.children.push({
        type: 'table',
        props: {},
        children: [
          {
            type: 'table-row',
            children: [
              { type: 'table-cell', content: 'Data' },
            ],
          },
        ],
      } as any);
      const errors = validate(ast, { enhanced: true });

      expect(errors.some(e => e.code === 'MISSING_TABLE_HEADER')).toBe(true);
      expect(errors.some(e => e.message.includes('accessibility'))).toBe(true);
    });

    it('should validate grid columns are within range', () => {
      const ast = parse('');
      ast.children.push({
        type: 'grid',
        columns: 15,
        props: {},
        children: [],
      } as any);
      const errors = validate(ast, { enhanced: true });

      expect(errors.some(e => e.code === 'INVALID_GRID_COLUMNS')).toBe(true);
      expect(errors.some(e => e.message.includes('between 1 and 12'))).toBe(true);
    });

    it('should detect duplicate radio group names', () => {
      const ast = parse('');
      ast.children.push(
        {
          type: 'radio-group',
          name: 'color',
          props: {},
          children: [
            { type: 'radio', label: 'Red', selected: false, props: {} },
          ],
        } as any,
        {
          type: 'radio-group',
          name: 'color',
          props: {},
          children: [
            { type: 'radio', label: 'Blue', selected: false, props: {} },
          ],
        } as any
      );
      const errors = validate(ast, { enhanced: true });

      expect(errors.some(e => e.code === 'DUPLICATE_RADIO_GROUP')).toBe(true);
    });

    it('should validate only one radio is selected in a group', () => {
      const ast = parse('');
      ast.children.push({
        type: 'radio-group',
        props: {},
        children: [
          { type: 'radio', label: 'Option 1', selected: true, props: {} },
          { type: 'radio', label: 'Option 2', selected: true, props: {} },
        ],
      } as any);
      const errors = validate(ast, { enhanced: true });

      expect(errors.some(e => e.code === 'MULTIPLE_RADIO_SELECTED')).toBe(true);
    });

    it('should validate links do not contain interactive elements', () => {
      const ast = parse('');
      // Create a proper link node
      ast.children.push({
        type: 'link',
        href: 'https://example.com',
        props: {},
        children: [
          { type: 'button', content: 'Click', props: {} },
        ],
      } as any);
      const errors = validate(ast, { enhanced: true });

      expect(errors.some(e => e.code === 'INVALID_LINK_CONTENT')).toBe(true);
    });

    it('should validate form method values', () => {
      const ast = parse('');
      ast.children.push({
        type: 'form',
        props: { method: 'delete' },
        children: [],
      } as any);
      const errors = validate(ast, { enhanced: true });

      expect(errors.some(e => e.code === 'INVALID_FORM_METHOD')).toBe(true);
    });
  });

  describe('Position Information', () => {
    it('should include position information in errors when available', () => {
      const ast = parse('# Test');
      const heading = ast.children[0] as any;
      heading.position = {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 7, offset: 6 },
      };
      heading.level = 10; // Invalid level

      const errors = validate(ast, { enhanced: true });
      const levelError = errors.find(e => e.code === 'INVALID_HEADING_LEVEL');

      expect(levelError?.message).toContain('at line 1, column 1');
    });

    it('should include node reference in errors', () => {
      const ast = parse('[Button]');
      const button = ast.children[0];
      (button as any).props.variant = 'invalid';

      const errors = validate(ast, { enhanced: true });
      const variantError = errors.find(e => e.code === 'INVALID_BUTTON_VARIANT');

      expect(variantError?.node).toBe(button);
    });
  });

  describe('Complex Validation Scenarios', () => {
    it('should validate deeply nested structures', () => {
      const ast = parse('');
      ast.children.push({
        type: 'container',
        containerType: 'card',
        props: {},
        children: [
          {
            type: 'grid',
            columns: 2,
            props: {},
            children: [
              {
                type: 'grid-item',
                props: {},
                children: [
                  {
                    type: 'button',
                    props: {},
                    children: [
                      { type: 'button', content: 'Nested', props: {} }, // Invalid nesting
                    ],
                  },
                ],
              },
            ],
          },
        ],
      } as any);
      const errors = validate(ast, { enhanced: true });

      expect(errors.some(e => e.code === 'INVALID_NESTING')).toBe(true);
      expect(errors.some(e => e.message.includes('button-group container'))).toBe(true);
    });

    it('should validate components with requiresOneOf', () => {
      const ast = parse('');
      ast.children.push({
        type: 'heading',
        level: 1,
        props: {},
        // Missing both content and children
      } as any);
      const errors = validate(ast, { enhanced: true });

      expect(errors.some(e => e.code === 'MISSING_CONTENT')).toBe(true);
      expect(errors.some(e => e.message.includes('content or children'))).toBe(true);
    });

    it('should validate minimum children requirements', () => {
      const ast = parse('');
      ast.children.push(
        {
          type: 'radio-group',
          props: {},
          children: [],
        } as any,
        {
          type: 'tabs',
          props: {},
          children: [],
        } as any,
        {
          type: 'table',
          props: {},
          children: [],
        } as any
      );
      const errors = validate(ast, { enhanced: true });

      expect(errors.some(e => e.code === 'EMPTY_RADIO_GROUP')).toBe(true);
      expect(errors.some(e => e.code === 'EMPTY_TABS')).toBe(true);
      expect(errors.some(e => e.code === 'EMPTY_TABLE')).toBe(true);
    });

    it('should handle multiple validation errors on same node', () => {
      const ast = parse('');
      ast.children.push({
        type: 'container',
        // Missing containerType
        // Missing props
        // Missing children
      } as any);
      const errors = validate(ast, { enhanced: true });

      expect(errors.filter(e => e.path[0] === 'children[0]').length).toBeGreaterThanOrEqual(3);
      expect(errors.some(e => e.code === 'MISSING_CONTAINER_TYPE')).toBe(true);
      expect(errors.some(e => e.code === 'MISSING_PROPS')).toBe(true);
      expect(errors.some(e => e.code === 'MISSING_CHILDREN')).toBe(true);
    });
  });

  describe('Backward Compatibility', () => {
    it('should use original validation when enhanced option is not provided', () => {
      const ast = parse('');
      ast.children.push({
        type: 'button',
        props: { variant: 'invalid' },
        content: 'Test',
      } as any);

      const errors = validate(ast); // No options
      const variantError = errors.find(e => e.code === 'INVALID_BUTTON_VARIANT');

      expect(variantError).toBeDefined();
      // Original validation has different message format
      expect(variantError?.message).not.toContain('at line');
    });

    it('should pass all original validation tests', () => {
      // Test a few key scenarios from original tests
      const input = `
# Heading
This is a paragraph.
[Button]
[_____]
      `.trim();
      const ast = parse(input);
      const errors = validate(ast);

      expect(errors).toEqual([]);
    });
  });
});