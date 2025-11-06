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
});
