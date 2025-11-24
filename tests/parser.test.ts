import { describe, it, expect } from 'vitest';
import { parse } from '../src/parser/index.js';

describe('Parser', () => {
  describe('Basic Parsing', () => {
    it('should parse an empty document', () => {
      const result = parse('');
      expect(result.type).toBe('document');
      expect(result.version).toBe('0.1');
      expect(result.children).toEqual([]);
    });

    it('should parse a simple heading', () => {
      const result = parse('# Hello World');
      expect(result.type).toBe('document');
      expect(result.children).toHaveLength(1);
      expect(result.children[0].type).toBe('heading');
      expect(result.children[0]).toMatchObject({
        type: 'heading',
        level: 1,
        content: 'Hello World',
      });
    });

    it('should parse a paragraph', () => {
      const result = parse('This is a paragraph.');
      expect(result.children).toHaveLength(1);
      expect(result.children[0].type).toBe('paragraph');
      expect(result.children[0]).toMatchObject({
        type: 'paragraph',
        content: 'This is a paragraph.',
      });
    });
  });

  describe('Button Syntax', () => {
    it('should parse a basic button', () => {
      const result = parse('[Click Me]');
      expect(result.children).toHaveLength(1);
      expect(result.children[0]).toMatchObject({
        type: 'button',
        content: 'Click Me',
      });
    });

    it('should parse a primary button with * suffix', () => {
      const result = parse('[Submit]*');
      expect(result.children[0]).toMatchObject({
        type: 'button',
        content: 'Submit',
        props: {
          variant: 'primary',
        },
      });
    });

    it('should parse a button with class attribute', () => {
      const result = parse('[Click Me]{.primary}');
      expect(result.children[0]).toMatchObject({
        type: 'button',
        content: 'Click Me',
        props: {
          classes: ['primary'],
        },
      });
    });

    it('should parse button with text after', () => {
      const result = parse('[Sign In] Forgot password?');
      expect(result.children[0]).toMatchObject({
        type: 'paragraph',
      });
      expect(result.children[0].children).toHaveLength(2);
      expect(result.children[0].children[0]).toMatchObject({
        type: 'button',
        content: 'Sign In',
      });
      expect(result.children[0].children[1]).toMatchObject({
        type: 'text',
        content: ' Forgot password?',
      });
    });

    it('should parse text with button after', () => {
      const result = parse("Don't have an account? [Sign Up]");
      expect(result.children[0]).toMatchObject({
        type: 'paragraph',
      });
      expect(result.children[0].children).toHaveLength(2);
      expect(result.children[0].children[0]).toMatchObject({
        type: 'text',
        content: "Don't have an account? ",
      });
      expect(result.children[0].children[1]).toMatchObject({
        type: 'button',
        content: 'Sign Up',
      });
    });

    it('should parse multiple buttons with text', () => {
      const result = parse('[Save] or [Cancel] this operation');
      expect(result.children[0]).toMatchObject({
        type: 'paragraph',
      });
      expect(result.children[0].children).toHaveLength(4);
      expect(result.children[0].children[0].type).toBe('button');
      expect(result.children[0].children[1].type).toBe('text');
      expect(result.children[0].children[2].type).toBe('button');
      expect(result.children[0].children[3].type).toBe('text');
    });
  });

  describe('Input Syntax', () => {
    it('should parse a basic text input', () => {
      const result = parse('[_____]');
      expect(result.children[0]).toMatchObject({
        type: 'input',
      });
    });

    it('should parse a password input', () => {
      const result = parse('[*****]');
      expect(result.children[0]).toMatchObject({
        type: 'input',
        props: {
          inputType: 'password',
        },
      });
    });

    it('should parse an input with type attribute', () => {
      const result = parse('[Email___]{type:email}');
      expect(result.children[0]).toMatchObject({
        type: 'input',
        props: {
          type: 'email',
        },
      });
    });

    it('should parse an input with required attribute', () => {
      const result = parse('[Name___]{required}');
      expect(result.children[0]).toMatchObject({
        type: 'input',
        props: {
          required: true,
        },
      });
    });
  });

  describe('Checkbox Syntax', () => {
    it('should parse an unchecked checkbox', () => {
      const result = parse('- [ ] Unchecked item');
      expect(result.children[0]).toMatchObject({
        type: 'list',
      });
      expect(result.children[0].children[0]).toMatchObject({
        type: 'checkbox',
        label: 'Unchecked item',
        checked: false,
      });
    });

    it('should parse a checked checkbox', () => {
      const result = parse('- [x] Checked item');
      expect(result.children[0].children[0]).toMatchObject({
        type: 'checkbox',
        label: 'Checked item',
        checked: true,
      });
    });

    it('should parse standalone unchecked checkbox', () => {
      const result = parse('[ ] Remember me');
      expect(result.children[0]).toMatchObject({
        type: 'checkbox',
        label: 'Remember me',
        checked: false,
      });
    });

    it('should parse standalone checked checkbox', () => {
      const result = parse('[x] Keep me logged in');
      expect(result.children[0]).toMatchObject({
        type: 'checkbox',
        label: 'Keep me logged in',
        checked: true,
      });
    });

    it('should parse standalone checkbox with uppercase X', () => {
      const result = parse('[X] Agree to terms');
      expect(result.children[0]).toMatchObject({
        type: 'checkbox',
        label: 'Agree to terms',
        checked: true,
      });
    });
  });

  describe('Radio Button Syntax', () => {
    it('should parse unselected radio button', () => {
      const result = parse('- ( ) Option 1');
      expect(result.children[0].children[0]).toMatchObject({
        type: 'radio',
        label: 'Option 1',
        selected: false,
      });
    });

    it('should parse selected radio button with •', () => {
      const result = parse('- (•) Option 2');
      expect(result.children[0].children[0]).toMatchObject({
        type: 'radio',
        label: 'Option 2',
        selected: true,
      });
    });

    it('should parse selected radio button with x', () => {
      const result = parse('- (x) Option 3');
      expect(result.children[0].children[0]).toMatchObject({
        type: 'radio',
        label: 'Option 3',
        selected: true,
      });
    });
  });

  describe('Icon Syntax', () => {
    it('should parse an icon', () => {
      const result = parse(':house:');
      expect(result.children[0]).toMatchObject({
        type: 'icon',
        props: {
          name: 'house',
        },
      });
    });
  });

  describe('Complex Forms', () => {
    it('should parse a simple contact form', () => {
      const input = `
## Contact Form

Name

[_____________________]{required}

Email

[_____________________]{type:email required}

[Submit]*
      `.trim();

      const result = parse(input);
      expect(result.children).toHaveLength(6);
      expect(result.children[0].type).toBe('heading');
      expect(result.children[1].type).toBe('paragraph');
      expect(result.children[2].type).toBe('input');
      expect(result.children[3].type).toBe('paragraph');
      expect(result.children[4].type).toBe('input');
      expect(result.children[5].type).toBe('button');
    });
  });

  describe('Container Syntax', () => {
    it('should parse a hero container', () => {
      const input = `
::: hero

# Welcome to Our Product

[Get Started]*

:::
      `.trim();

      const result = parse(input);
      expect(result.children).toHaveLength(1);
      expect(result.children[0]).toMatchObject({
        type: 'container',
        containerType: 'hero',
      });
      expect(result.children[0].children).toHaveLength(2);
      expect(result.children[0].children[0].type).toBe('heading');
      expect(result.children[0].children[1].type).toBe('button');
    });

    it('should parse a container with attributes', () => {
      const input = `
::: card {.featured}

## Card Title

Content here

:::
      `.trim();

      const result = parse(input);
      expect(result.children[0]).toMatchObject({
        type: 'container',
        containerType: 'card',
        props: {
          classes: ['featured'],
        },
      });
    });

    it('should parse nested containers', () => {
      const input = `
::: modal

## Confirm Delete

Are you sure?

[Cancel] [Delete]{.danger}

:::
      `.trim();

      const result = parse(input);
      expect(result.children[0].type).toBe('container');
      expect(result.children[0].children).toHaveLength(3);
    });
  });

  describe('Inline Container Syntax (Navigation)', () => {
    it('should parse a simple navigation bar', () => {
      const input = `[[ Home | Products | About | Contact ]]`;

      const result = parse(input);
      expect(result.children).toHaveLength(1);
      expect(result.children[0]).toMatchObject({
        type: 'nav',
      });
      expect(result.children[0].children).toHaveLength(4);
      expect(result.children[0].children[0]).toMatchObject({
        type: 'nav-item',
        content: 'Home',
      });
    });

    it('should parse navigation with brand (icon + text)', () => {
      const input = `[[ :logo: MyApp | Home | Products ]]`;

      const result = parse(input);
      expect(result.children[0].type).toBe('nav');
      expect(result.children[0].children[0]).toMatchObject({
        type: 'brand',
      });
      expect(result.children[0].children[0].children).toHaveLength(2);
      expect(result.children[0].children[0].children[0].type).toBe('icon');
      expect(result.children[0].children[0].children[1].type).toBe('text');
    });

    it('should parse navigation with buttons', () => {
      const input = `[[ Home | Products | [Sign In] | [Get Started] ]]{.nav}`;

      const result = parse(input);
      expect(result.children[0].type).toBe('nav');
      expect(result.children[0].props.classes).toContain('nav');

      // Should have 4 children: 2 nav-items and 2 buttons
      const children = result.children[0].children;
      expect(children).toHaveLength(4);
      expect(children[2].type).toBe('button');
      expect(children[2].content).toBe('Sign In');
      expect(children[3].type).toBe('button');
      expect(children[3].content).toBe('Get Started');
    });
  });

  describe('Dropdown/Select Syntax', () => {
    it('should parse a basic dropdown', () => {
      const input = `[Select option___________v]`;

      const result = parse(input);
      expect(result.children).toHaveLength(1);
      expect(result.children[0]).toMatchObject({
        type: 'select',
        props: {
          placeholder: 'Select option',
        },
      });
    });

    it('should parse dropdown with options', () => {
      const input = `
[Choose a topic___________v]
- General inquiry
- Sales
- Support
- Partnership
      `.trim();

      const result = parse(input);
      expect(result.children).toHaveLength(1);
      expect(result.children[0].type).toBe('select');
      expect(result.children[0].options).toHaveLength(4);
      expect(result.children[0].options[0]).toMatchObject({
        type: 'option',
        value: 'General inquiry',
        label: 'General inquiry',
      });
    });

    it('should parse dropdown with attributes', () => {
      const input = `[Select___v]{required}`;

      const result = parse(input);
      expect(result.children[0].props.required).toBe(true);
    });
  });

  describe('Grid Layout Detection', () => {
    it('should parse a 3-column grid', () => {
      const input = `
## Features {.grid-3}

### Feature One
Fast and reliable

### Feature Two
Secure and safe

### Feature Three
Powerful tools
      `.trim();

      const result = parse(input);
      expect(result.children).toHaveLength(1);
      expect(result.children[0]).toMatchObject({
        type: 'grid',
        columns: 3,
      });
      expect(result.children[0].children).toHaveLength(3);
      expect(result.children[0].children[0].type).toBe('grid-item');
    });

    it('should parse grid items with icons', () => {
      const input = `
## Features {.grid-3}

### :rocket: Fast
Lightning quick rendering

### :shield: Secure
Enterprise grade security

### :zap: Powerful
Advanced features included
      `.trim();

      const result = parse(input);
      expect(result.children[0].type).toBe('grid');
      expect(result.children[0].children).toHaveLength(3);

      // First grid item should have heading and paragraph
      const firstItem = result.children[0].children[0];
      expect(firstItem.children).toHaveLength(2);
      expect(firstItem.children[0].type).toBe('heading');
      expect(firstItem.children[1].type).toBe('paragraph');
    });

    it('should parse grid with different column counts', () => {
      const input = `
## Layout {.grid-4}

### Col 1
### Col 2
### Col 3
### Col 4
      `.trim();

      const result = parse(input);
      expect(result.children[0]).toMatchObject({
        type: 'grid',
        columns: 4,
      });
      expect(result.children[0].children).toHaveLength(4);
    });
  });
});
