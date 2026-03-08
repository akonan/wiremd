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

    it('should render inline state classes', () => {
      const ast = parse('[Submit]{:focus}');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-state-focus');
    });

    it('should apply state blocks to child components', () => {
      const input = `
::: state=disabled
[Submit]
:::
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-state-disabled');
      expect(html).toContain('<button');
      expect(html).toContain('disabled');
    });

    it('should resolve placeholders in HTML output by default', () => {
      const ast = parse('## Hello {{user.name}}');
      const html = renderToHTML(ast, {
        style: 'sketch',
        placeholderSeed: 'renderer-seed',
      });

      expect(html).not.toContain('{{user.name}}');
      expect(html).toMatch(/Hello [A-Za-z]+ [A-Za-z]+/);
    });

    it('should keep placeholders when resolvePlaceholders is false', () => {
      const ast = parse('## Hello {{user.name}}');
      const html = renderToHTML(ast, {
        style: 'sketch',
        resolvePlaceholders: false,
      });

      expect(html).toContain('Hello {{user.name}}');
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

    it('should render navigation items with button styling', () => {
      const input = `[[ Logo | Sign In | Help ]]`;
      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      // Check that nav items are rendered as links with proper classes
      expect(html).toContain('class="wmd-nav-item"');
      expect(html).toContain('Logo');
      expect(html).toContain('Sign In');
      expect(html).toContain('Help');

      // Check that the CSS includes button-like styling for nav items
      expect(html).toContain('.wmd-nav-item');
      expect(html).toMatch(/\.wmd-nav-item\s*\{[^}]*display:\s*inline-block/);
      expect(html).toMatch(/\.wmd-nav-item\s*\{[^}]*background:\s*#fff/);
      expect(html).toMatch(/\.wmd-nav-item\s*\{[^}]*border:\s*2px solid/);
      expect(html).toMatch(/\.wmd-nav-item\s*\{[^}]*box-shadow/);
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

    it('should render responsive breakpoint classes for grids', () => {
      const input = `
## Features {.grid-3 .md:grid-2 .sm:grid-1}

### Feature One
Fast

### Feature Two
Secure

### Feature Three
Powerful
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-grid-md-2');
      expect(html).toContain('wmd-grid-sm-1');
    });

    it('should render viewport block classes', () => {
      const input = `
::: mobile
[Submit]
:::
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-viewport-mobile');
      expect(html).toContain('@media (max-width: 767px)');
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

  describe('Annotation Rendering', () => {
    it('should hide inline comment annotations by default', () => {
      const ast = parse('[Submit] <!-- ANNOTATION-COMMENT-XYZ -->');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).not.toContain('ANNOTATION-COMMENT-XYZ');
    });

    it('should render inline comment annotations when showAnnotations is enabled', () => {
      const ast = parse('[Submit] <!-- ANNOTATION-COMMENT-XYZ -->');
      const html = renderToHTML(ast, { style: 'sketch', showAnnotations: true });

      expect(html).toContain('ANNOTATION-COMMENT-XYZ');
      expect(html).toContain('wmd-annotation-callout');
    });

    it('should hide ::: note blocks by default and show them with showAnnotations', () => {
      const ast = parse('::: note\nANNOTATION-NOTE-XYZ\n:::');
      const hiddenHtml = renderToHTML(ast, { style: 'sketch' });
      const visibleHtml = renderToHTML(ast, { style: 'sketch', showAnnotations: true });

      expect(hiddenHtml).not.toContain('ANNOTATION-NOTE-XYZ');
      expect(visibleHtml).toContain('ANNOTATION-NOTE-XYZ');
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

    it('should include annotations in JSON output regardless of showAnnotations rendering mode', () => {
      const ast = parse('[Submit] <!-- JSON-ANNOTATION-XYZ -->');
      const json = renderToJSON(ast);

      expect(json).toContain('JSON-ANNOTATION-XYZ');
      expect(json).toContain('"annotations"');
    });

    it('should resolve placeholders in JSON output by default', () => {
      const ast = parse('## Welcome {{user.name}}');
      const json = renderToJSON(ast, { placeholderSeed: 'json-seed' });

      expect(json).not.toContain('{{user.name}}');
    });

    it('should render compact JSON', () => {
      const ast = parse('[Button]');
      const json = renderToJSON(ast, { pretty: false });

      expect(json).not.toContain('\n');
      expect(json).toContain('"type":"document"');
    });
  });
});
