import { describe, it, expect } from 'vitest';
import { parse } from '../src/parser/index.js';
import { renderToHTML, renderToJSON } from '../src/renderer/index.js';

describe('HTML Renderer', () => {
  describe('Basic Components', () => {
    it('should render a button', () => {
      const ast = parse('[Click Me]');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('<button');
      expect(html).toContain('Click Me');
      expect(html).toContain('wmd-button');
    });

    it('should render a primary button', () => {
      const ast = parse('[Submit]*');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-button-primary');
      expect(html).toContain('Submit');
    });

    it('should render a text input', () => {
      const ast = parse('[Email_______________________]');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('<input');
      expect(html).toContain('type="text"');
      expect(html).toContain('wmd-input');
    });

    it('should render an email input with attributes', () => {
      const ast = parse('[Email___]{type:email required}');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('type="email"');
      expect(html).toContain('required');
    });

    it('should render a checkbox', () => {
      const ast = parse('- [x] Checked item');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('type="checkbox"');
      expect(html).toContain('checked');
      expect(html).toContain('Checked item');
    });

    it('should render a radio button', () => {
      const ast = parse('- (•) Selected option');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('type="radio"');
      expect(html).toContain('checked');
      expect(html).toContain('Selected option');
    });

    it('should render an icon', () => {
      const ast = parse(':house:');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-icon');
      expect(html).toContain('data-icon="house"');
    });
  });

  describe('Containers', () => {
    it('should render a hero container', () => {
      const input = `
::: hero

# Welcome

[Get Started]*

:::
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-container-hero');
      expect(html).toContain('<h1');
      expect(html).toContain('Welcome');
      expect(html).toContain('Get Started');
    });

    it('should render a card container with attributes', () => {
      const input = `
::: card {.featured}

## Card Title

Content

:::
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-container-card');
      expect(html).toContain('wmd-featured');
      expect(html).toContain('Card Title');
    });
  });

  describe('Navigation', () => {
    it('should render a navigation bar', () => {
      const input = `[[ :logo: MyApp | Home | Products | [Sign In] ]]`;
      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('<nav');
      expect(html).toContain('wmd-nav');
      expect(html).toContain('wmd-brand');
      expect(html).toContain('MyApp');
      expect(html).toContain('wmd-nav-item');
      expect(html).toContain('Home');
      expect(html).toContain('Sign In');
    });
  });

  describe('Grid Layout', () => {
    it('should render a 3-column grid', () => {
      const input = `
## Features {.grid-3}

### Feature One
Fast

### Feature Two
Secure

### Feature Three
Powerful
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-grid');
      expect(html).toContain('wmd-grid-3');
      expect(html).toContain('--grid-columns: 3');
      expect(html).toContain('wmd-grid-item');
      expect(html).toContain('Feature One');
      expect(html).toContain('Feature Two');
      expect(html).toContain('Feature Three');
    });
  });

  describe('Dropdowns', () => {
    it('should render a dropdown with options', () => {
      const input = `
[Select topic___v]
- Sales
- Support
- Other
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('<select');
      expect(html).toContain('wmd-select');
      expect(html).toContain('<option');
      expect(html).toContain('Sales');
      expect(html).toContain('Support');
      expect(html).toContain('Other');
    });
  });

  describe('Complete Form', () => {
    it('should render a complete contact form', () => {
      const input = `
## Contact Form

Name

[_____________________________]{required}

Email

[_____________________________]{type:email required}

[Submit]*
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('<h2');
      expect(html).toContain('Contact Form');
      expect(html).toContain('type="text"');
      expect(html).toContain('type="email"');
      expect(html).toContain('required');
      expect(html).toContain('wmd-button-primary');
      expect(html).toContain('Submit');
    });
  });

  describe('Styles', () => {
    it('should render with sketch style', () => {
      const ast = parse('[Button]');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-sketch');
      expect(html).toContain('Comic Sans');
    });

    it('should render with clean style', () => {
      const ast = parse('[Button]');
      const html = renderToHTML(ast, { style: 'clean' });

      expect(html).toContain('wmd-clean');
      expect(html).toContain('Segoe UI');
    });

    it('should render with wireframe style', () => {
      const ast = parse('[Button]');
      const html = renderToHTML(ast, { style: 'wireframe' });

      expect(html).toContain('wmd-wireframe');
      expect(html).toContain('repeating-linear-gradient');
    });

    it('should render with none style', () => {
      const ast = parse('[Button]');
      const html = renderToHTML(ast, { style: 'none' });

      expect(html).toContain('wmd-none');
      expect(html).toContain('<button');
    });
  });

  describe('JSON Renderer', () => {
    it('should render to JSON', () => {
      const ast = parse('[Button]');
      const json = renderToJSON(ast);

      expect(json).toContain('"type": "document"');
      expect(json).toContain('"type": "button"');
      expect(json).toContain('"content": "Button"');
    });

    it('should render compact JSON', () => {
      const ast = parse('[Button]');
      const json = renderToJSON(ast, { pretty: false });

      expect(json).not.toContain('\n');
      expect(json).toContain('"type":"document"');
    });
  });
});
