import { describe, it, expect } from 'vitest';
import { parse, validate } from '../src/parser/index.js';
import type { DocumentNode, WiremdNode } from '../src/types.js';

describe('AST Validation', () => {
  describe('Document Structure', () => {
    it('should validate a valid empty document', () => {
      const ast = parse('');
      const errors = validate(ast);
      expect(errors).toEqual([]);
    });

    it('should reject invalid root type', () => {
      const invalidAst = { type: 'invalid', meta: {}, children: [] } as any;
      const errors = validate(invalidAst);
      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('INVALID_ROOT_TYPE');
    });

    it('should reject missing meta', () => {
      const invalidAst = { type: 'document', version: '0.1', children: [] } as any;
      const errors = validate(invalidAst);
      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('MISSING_META');
    });

    it('should reject non-array children', () => {
      const invalidAst = { type: 'document', version: '0.1', meta: {}, children: 'invalid' } as any;
      const errors = validate(invalidAst);
      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('INVALID_CHILDREN');
    });
  });

  describe('Component Type Validation', () => {
    it('should accept all valid component types', () => {
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

    it('should reject unknown component type', () => {
      const ast = parse('');
      ast.children.push({ type: 'unknown-type', props: {} } as any);
      const errors = validate(ast);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].code).toBe('INVALID_COMPONENT_TYPE');
      expect(errors[0].message).toContain('unknown-type');
    });

    it('should reject node without type', () => {
      const ast = parse('');
      ast.children.push({ content: 'test' } as any);
      const errors = validate(ast);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].code).toBe('MISSING_NODE_TYPE');
    });
  });

  describe('Required Properties Validation', () => {
    describe('Container', () => {
      it('should validate container with required properties', () => {
        const input = `
::: hero
# Welcome
:::
        `.trim();
        const ast = parse(input);
        const errors = validate(ast);
        expect(errors).toEqual([]);
      });

      it('should reject container without containerType', () => {
        const ast = parse('');
        ast.children.push({
          type: 'container',
          props: {},
          children: [],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_CONTAINER_TYPE')).toBe(true);
      });

      it('should reject container with invalid containerType', () => {
        const ast = parse('');
        ast.children.push({
          type: 'container',
          containerType: 'invalid-type',
          props: {},
          children: [],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'INVALID_CONTAINER_TYPE')).toBe(true);
      });

      it('should reject container without props', () => {
        const ast = parse('');
        ast.children.push({
          type: 'container',
          containerType: 'card',
          children: [],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_PROPS')).toBe(true);
      });
    });

    describe('Heading', () => {
      it('should validate heading with valid level', () => {
        const ast = parse('# Title');
        const errors = validate(ast);
        expect(errors).toEqual([]);
      });

      it('should reject heading with invalid level', () => {
        const ast = parse('# Title');
        ast.children[0] = { ...ast.children[0], level: 7 } as any;
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'INVALID_HEADING_LEVEL')).toBe(true);
      });

      it('should reject heading without content or children', () => {
        const ast = parse('');
        ast.children.push({
          type: 'heading',
          level: 1,
          props: {},
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_CONTENT')).toBe(true);
      });
    });

    describe('Button', () => {
      it('should validate button with content', () => {
        const ast = parse('[Click Me]');
        const errors = validate(ast);
        expect(errors).toEqual([]);
      });

      it('should validate button with children', () => {
        const ast = parse('[Click Me]');
        const button = ast.children[0] as any;
        button.content = '';
        button.children = [{ type: 'text', content: 'Click' }];
        const errors = validate(ast);
        expect(errors).toEqual([]);
      });

      it('should reject button without content or children', () => {
        const ast = parse('');
        ast.children.push({
          type: 'button',
          props: {},
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_CONTENT')).toBe(true);
      });

      it('should reject button with invalid variant', () => {
        const ast = parse('[Submit]');
        (ast.children[0] as any).props.variant = 'invalid';
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'INVALID_BUTTON_VARIANT')).toBe(true);
      });
    });

    describe('Input', () => {
      it('should validate input with props', () => {
        const ast = parse('[_____]');
        const errors = validate(ast);
        expect(errors).toEqual([]);
      });

      it('should reject input without props', () => {
        const ast = parse('');
        ast.children.push({ type: 'input' } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_PROPS')).toBe(true);
      });

      it('should reject input with invalid inputType', () => {
        const ast = parse('[_____]');
        (ast.children[0] as any).props.inputType = 'invalid';
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'INVALID_INPUT_TYPE')).toBe(true);
      });

      it('should reject input with children', () => {
        const ast = parse('[_____]');
        (ast.children[0] as any).children = [{ type: 'text', content: 'invalid' }];
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'INVALID_CHILDREN')).toBe(true);
      });
    });

    describe('Select', () => {
      it('should validate select with options', () => {
        const input = `
[Choose option___v]
- Option 1
- Option 2
        `.trim();
        const ast = parse(input);
        const errors = validate(ast);
        expect(errors).toEqual([]);
      });

      it('should reject select without options array', () => {
        const ast = parse('');
        ast.children.push({
          type: 'select',
          props: {},
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_OPTIONS')).toBe(true);
      });

      it('should reject select option without value', () => {
        const ast = parse('[Select___v]');
        (ast.children[0] as any).options = [
          { type: 'option', label: 'Test' },
        ];
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_OPTION_VALUE')).toBe(true);
      });

      it('should reject select option without label', () => {
        const ast = parse('[Select___v]');
        (ast.children[0] as any).options = [
          { type: 'option', value: 'test' },
        ];
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_OPTION_LABEL')).toBe(true);
      });
    });

    describe('Checkbox', () => {
      it('should validate checkbox with checked property', () => {
        const ast = parse('- [x] Checked');
        const errors = validate(ast);
        expect(errors).toEqual([]);
      });

      it('should reject checkbox without checked property', () => {
        const ast = parse('');
        ast.children.push({
          type: 'list',
          ordered: false,
          props: {},
          children: [{
            type: 'checkbox',
            label: 'Test',
            props: {},
          }],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_CHECKED')).toBe(true);
      });
    });

    describe('Radio', () => {
      it('should validate radio with required properties', () => {
        const ast = parse('- (x) Selected');
        const errors = validate(ast);
        expect(errors).toEqual([]);
      });

      it('should reject radio without selected property', () => {
        const ast = parse('');
        ast.children.push({
          type: 'list',
          ordered: false,
          props: {},
          children: [{
            type: 'radio',
            label: 'Test',
            props: {},
          }],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_SELECTED')).toBe(true);
      });

      it('should reject radio without label', () => {
        const ast = parse('');
        ast.children.push({
          type: 'list',
          ordered: false,
          props: {},
          children: [{
            type: 'radio',
            selected: true,
            props: {},
          }],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_LABEL')).toBe(true);
      });
    });

    describe('Icon', () => {
      it('should validate icon with name', () => {
        const ast = parse(':house:');
        const errors = validate(ast);
        expect(errors).toEqual([]);
      });

      it('should reject icon without name', () => {
        const ast = parse('');
        ast.children.push({
          type: 'icon',
          props: {},
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_ICON_NAME')).toBe(true);
      });

      it('should reject icon with children', () => {
        const ast = parse(':house:');
        (ast.children[0] as any).children = [{ type: 'text', content: 'invalid' }];
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'INVALID_CHILDREN')).toBe(true);
      });
    });

    describe('Image', () => {
      it('should validate image with src and alt', () => {
        const ast = parse('![Alt text](image.jpg)');
        const errors = validate(ast);
        expect(errors).toEqual([]);
      });

      it('should reject image without src', () => {
        const ast = parse('');
        ast.children.push({
          type: 'image',
          alt: 'Test',
          props: {},
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_IMAGE_SRC')).toBe(true);
      });

      it('should reject image without alt', () => {
        const ast = parse('');
        ast.children.push({
          type: 'image',
          src: 'test.jpg',
          props: {},
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_IMAGE_ALT')).toBe(true);
      });
    });

    describe('Link', () => {
      it('should validate link with href', () => {
        const ast = parse('[Link text](https://example.com)');
        const errors = validate(ast);
        expect(errors).toEqual([]);
      });

      it('should reject link without href', () => {
        const ast = parse('');
        ast.children.push({
          type: 'link',
          children: [],
          props: {},
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_LINK_HREF')).toBe(true);
      });
    });

    describe('Grid', () => {
      it('should validate grid with columns', () => {
        const input = `
## Features {.grid-3}

### Feature 1
Content

### Feature 2
Content

### Feature 3
Content
        `.trim();
        const ast = parse(input);
        const errors = validate(ast);
        expect(errors).toEqual([]);
      });

      it('should reject grid without columns', () => {
        const ast = parse('');
        ast.children.push({
          type: 'grid',
          props: {},
          children: [],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'INVALID_GRID_COLUMNS')).toBe(true);
      });

      it('should reject grid with invalid columns', () => {
        const ast = parse('');
        ast.children.push({
          type: 'grid',
          columns: 0,
          props: {},
          children: [],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'INVALID_GRID_COLUMNS')).toBe(true);
      });
    });

    describe('Text', () => {
      it('should reject text without content', () => {
        const ast = parse('');
        ast.children.push({
          type: 'text',
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_TEXT_CONTENT')).toBe(true);
      });

      it('should reject text with children', () => {
        const ast = parse('');
        ast.children.push({
          type: 'text',
          content: 'test',
          children: [{ type: 'text', content: 'nested' }],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'INVALID_CHILDREN')).toBe(true);
      });
    });

    describe('Code', () => {
      it('should reject code without value', () => {
        const ast = parse('');
        ast.children.push({
          type: 'code',
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_CODE_VALUE')).toBe(true);
      });
    });

    describe('Table', () => {
      it('should validate valid table', () => {
        const input = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
        `.trim();
        const ast = parse(input);
        const errors = validate(ast);
        expect(errors).toEqual([]);
      });

      it('should reject empty table', () => {
        const ast = parse('');
        ast.children.push({
          type: 'table',
          props: {},
          children: [],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'EMPTY_TABLE')).toBe(true);
      });

      it('should reject table cell with invalid alignment', () => {
        const ast = parse('| Test |\n|------|');
        const table = ast.children[0] as any;
        table.children[0].children[0].align = 'invalid';
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'INVALID_CELL_ALIGNMENT')).toBe(true);
      });
    });

    describe('List', () => {
      it('should validate list with ordered property', () => {
        const ast = parse('- Item 1\n- Item 2');
        const errors = validate(ast);
        expect(errors).toEqual([]);
      });

      it('should reject list without ordered property', () => {
        const ast = parse('');
        ast.children.push({
          type: 'list',
          props: {},
          children: [],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_ORDERED')).toBe(true);
      });
    });

    describe('Alert', () => {
      it('should reject alert without alertType', () => {
        const ast = parse('');
        ast.children.push({
          type: 'alert',
          props: {},
          children: [],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_ALERT_TYPE')).toBe(true);
      });

      it('should reject alert with invalid alertType', () => {
        const ast = parse('');
        ast.children.push({
          type: 'alert',
          alertType: 'invalid',
          props: {},
          children: [],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'INVALID_ALERT_TYPE')).toBe(true);
      });
    });

    describe('Badge', () => {
      it('should reject badge without content', () => {
        const ast = parse('');
        ast.children.push({
          type: 'badge',
          props: {},
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_CONTENT')).toBe(true);
      });

      it('should reject badge with invalid variant', () => {
        const ast = parse('');
        ast.children.push({
          type: 'badge',
          content: 'Test',
          props: { variant: 'invalid' },
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'INVALID_BADGE_VARIANT')).toBe(true);
      });
    });

    describe('Tab', () => {
      it('should reject tab without label', () => {
        const ast = parse('');
        ast.children.push({
          type: 'tab',
          active: false,
          props: {},
          children: [],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_LABEL')).toBe(true);
      });

      it('should reject tab without active property', () => {
        const ast = parse('');
        ast.children.push({
          type: 'tab',
          label: 'Test',
          props: {},
          children: [],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_ACTIVE')).toBe(true);
      });
    });

    describe('Accordion Item', () => {
      it('should reject accordion-item without summary', () => {
        const ast = parse('');
        ast.children.push({
          type: 'accordion-item',
          expanded: false,
          props: {},
          children: [],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_SUMMARY')).toBe(true);
      });

      it('should reject accordion-item without expanded property', () => {
        const ast = parse('');
        ast.children.push({
          type: 'accordion-item',
          summary: 'Test',
          props: {},
          children: [],
        } as any);
        const errors = validate(ast);
        expect(errors.some(e => e.code === 'MISSING_EXPANDED')).toBe(true);
      });
    });
  });

  describe('Nested Structure Validation', () => {
    it('should reject buttons containing buttons', () => {
      const ast = parse('[Outer Button]');
      (ast.children[0] as any).children = [
        { type: 'button', content: 'Inner Button', props: {} },
      ];
      const errors = validate(ast);
      expect(errors.some(e => e.code === 'INVALID_NESTING')).toBe(true);
      expect(errors.some(e => e.message.includes('Buttons cannot contain other buttons'))).toBe(true);
    });

    it('should reject grid with non-grid-item children', () => {
      const ast = parse('## Grid {.grid-2}');
      const grid = ast.children[0] as any;
      grid.children = [
        { type: 'paragraph', content: 'Invalid', props: {} },
      ];
      const errors = validate(ast);
      expect(errors.some(e => e.code === 'INVALID_GRID_CHILDREN')).toBe(true);
    });

    it('should reject radio-group with non-radio children', () => {
      const ast = parse('');
      ast.children.push({
        type: 'radio-group',
        props: {},
        children: [
          { type: 'button', content: 'Invalid', props: {} },
        ],
      } as any);
      const errors = validate(ast);
      expect(errors.some(e => e.code === 'INVALID_RADIO_GROUP_CHILDREN')).toBe(true);
    });

    it('should reject empty radio-group', () => {
      const ast = parse('');
      ast.children.push({
        type: 'radio-group',
        props: {},
        children: [],
      } as any);
      const errors = validate(ast);
      expect(errors.some(e => e.code === 'EMPTY_RADIO_GROUP')).toBe(true);
    });

    it('should reject table with invalid children', () => {
      const ast = parse('| Test |\n|------|');
      const table = ast.children[0] as any;
      table.children.push({ type: 'paragraph', content: 'Invalid', props: {} });
      const errors = validate(ast);
      expect(errors.some(e => e.code === 'INVALID_TABLE_CHILDREN')).toBe(true);
    });

    it('should reject table without header', () => {
      const ast = parse('');
      ast.children.push({
        type: 'table',
        props: {},
        children: [
          {
            type: 'table-row',
            children: [
              { type: 'table-cell', content: 'Cell', align: 'left' },
            ],
          },
        ],
      } as any);
      const errors = validate(ast);
      expect(errors.some(e => e.code === 'MISSING_TABLE_HEADER')).toBe(true);
    });

    it('should reject table-row with non-cell children', () => {
      const ast = parse('| Test |\n|------|');
      const table = ast.children[0] as any;
      table.children[0].children.push({ type: 'paragraph', content: 'Invalid', props: {} });
      const errors = validate(ast);
      expect(errors.some(e => e.code === 'INVALID_TABLE_ROW_CHILDREN')).toBe(true);
    });

    it('should reject nav with invalid children', () => {
      const ast = parse('[[ Home | About ]]');
      const nav = ast.children[0] as any;
      nav.children.push({ type: 'paragraph', content: 'Invalid', props: {} });
      const errors = validate(ast);
      expect(errors.some(e => e.code === 'INVALID_NAV_CHILDREN')).toBe(true);
    });

    it('should reject tabs with non-tab children', () => {
      const ast = parse('');
      ast.children.push({
        type: 'tabs',
        props: {},
        children: [
          { type: 'paragraph', content: 'Invalid', props: {} },
        ],
      } as any);
      const errors = validate(ast);
      expect(errors.some(e => e.code === 'INVALID_TABS_CHILDREN')).toBe(true);
    });

    it('should reject accordion with non-accordion-item children', () => {
      const ast = parse('');
      ast.children.push({
        type: 'accordion',
        props: {},
        children: [
          { type: 'paragraph', content: 'Invalid', props: {} },
        ],
      } as any);
      const errors = validate(ast);
      expect(errors.some(e => e.code === 'INVALID_ACCORDION_CHILDREN')).toBe(true);
    });

    it('should reject breadcrumbs with non-breadcrumb-item children', () => {
      const ast = parse('');
      ast.children.push({
        type: 'breadcrumbs',
        props: {},
        children: [
          { type: 'paragraph', content: 'Invalid', props: {} },
        ],
      } as any);
      const errors = validate(ast);
      expect(errors.some(e => e.code === 'INVALID_BREADCRUMBS_CHILDREN')).toBe(true);
    });

    it('should reject list with invalid children', () => {
      const ast = parse('- Item 1');
      const list = ast.children[0] as any;
      list.children.push({ type: 'paragraph', content: 'Invalid', props: {} });
      const errors = validate(ast);
      expect(errors.some(e => e.code === 'INVALID_LIST_CHILDREN')).toBe(true);
    });
  });

  describe('Error Messages', () => {
    it('should provide clear error message with path', () => {
      const ast = parse('[Button]');
      (ast.children[0] as any).children = [
        { type: 'button', content: 'Nested', props: {} },
      ];
      const errors = validate(ast);
      expect(errors[0].message).toBeTruthy();
      expect(errors[0].path).toBeTruthy();
      expect(errors[0].code).toBeTruthy();
    });

    it('should provide actionable error messages', () => {
      const ast = parse('');
      ast.children.push({
        type: 'button',
        props: { variant: 'invalid' },
        content: 'Test',
      } as any);
      const errors = validate(ast);
      const variantError = errors.find(e => e.code === 'INVALID_BUTTON_VARIANT');
      expect(variantError?.message).toContain('primary, secondary, danger');
    });

    it('should track path through nested structure', () => {
      const ast = parse('');
      ast.children.push({
        type: 'container',
        containerType: 'card',
        props: {},
        children: [
          {
            type: 'button',
            props: {},
          },
        ],
      } as any);
      const errors = validate(ast);
      const error = errors.find(e => e.code === 'MISSING_CONTENT');
      expect(error?.path).toBeTruthy();
      expect(error?.path?.join('.')).toContain('container.children');
    });
  });

  describe('Complex Validation Scenarios', () => {
    it('should validate complex form structure', () => {
      const input = `
::: card

## Contact Form

Name
[_____________________]{required}

Email
[_____________________]{type:email required}

Message
[Your message here...]{rows:5}

[Cancel] [Submit]*

:::
      `.trim();
      const ast = parse(input);
      const errors = validate(ast);
      expect(errors).toEqual([]);
    });

    it('should validate navigation with mixed children', () => {
      const input = `[[ :logo: MyApp | Home | Products | [Sign In] | [Get Started]* ]]`;
      const ast = parse(input);
      const errors = validate(ast);
      expect(errors).toEqual([]);
    });

    it('should validate grid layout', () => {
      const input = `
## Features {.grid-3}

### :rocket: Fast
Lightning quick

### :shield: Secure
Enterprise grade

### :zap: Powerful
Advanced features
      `.trim();
      const ast = parse(input);
      const errors = validate(ast);
      expect(errors).toEqual([]);
    });

    it('should detect multiple validation errors', () => {
      const ast = parse('');
      ast.children.push(
        {
          type: 'button',
          props: { variant: 'invalid' },
        } as any,
        {
          type: 'heading',
          level: 10,
        } as any,
        {
          type: 'unknown-type',
        } as any
      );
      const errors = validate(ast);
      expect(errors.length).toBeGreaterThan(2);
    });
  });
});
