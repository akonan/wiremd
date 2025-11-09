/**
 * Tests for React Renderer
 */

import { describe, it, expect } from 'vitest';
import { parse } from '../src/parser/index.js';
import { renderToReact } from '../src/renderer/index.js';

describe('React Renderer', () => {
  describe('Basic Components', () => {
    it('should render a button', () => {
      const ast = parse('[Submit]');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('import React from \'react\'');
      expect(jsx).toContain('<button className="wmd-button">');
      expect(jsx).toContain('Submit');
      expect(jsx).toContain('</button>');
    });

    it('should render a primary button', () => {
      const ast = parse('[Submit]{.primary}');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('className="wmd-button wmd-button-primary"');
    });

    it('should render a disabled button', () => {
      const ast = parse('[Submit]{state:disabled}');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('disabled');
    });

    it('should render an input', () => {
      const ast = parse('[_______]{type:email required}');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('<input type="email"');
      expect(jsx).toContain('className="wmd-input"');
      expect(jsx).toContain('required');
    });

    it('should render a textarea', () => {
      const ast = parse('[       ]{rows:5}');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('<textarea');
      expect(jsx).toContain('rows={5}');
      expect(jsx).toContain('</textarea>');
    });

    it('should render a select with options', () => {
      const ast = parse('[Select one|Option 1|Option 2|Option 3]');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('<select');
      expect(jsx).toContain('<option value="" disabled defaultSelected>Select one</option>');
      expect(jsx).toContain('<option value="Option 1">Option 1</option>');
      expect(jsx).toContain('</select>');
    });

    it('should render a checkbox', () => {
      const ast = parse('[x] Accept terms');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('<input type="checkbox"');
      expect(jsx).toContain('defaultChecked');
      expect(jsx).toContain('Accept terms');
    });

    it('should render radio buttons', () => {
      const ast = parse('( ) Option A\n(x) Option B');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('<input type="radio"');
      expect(jsx).toContain('Option A');
      expect(jsx).toContain('Option B');
      expect(jsx).toContain('defaultChecked');
    });
  });

  describe('Typography', () => {
    it('should render headings', () => {
      const ast = parse('## Contact Form');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('<h2 className="wmd-h2">Contact Form</h2>');
    });

    it('should render paragraphs', () => {
      const ast = parse('This is a paragraph of text.');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('<p className="wmd-paragraph">');
      expect(jsx).toContain('This is a paragraph of text.');
    });

    it('should render links', () => {
      const ast = parse('[Learn more](https://example.com)');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('<a href="https://example.com"');
      expect(jsx).toContain('Learn more');
    });

    it('should render lists', () => {
      const ast = parse('- Item 1\n- Item 2\n- Item 3');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('<ul');
      expect(jsx).toContain('<li');
      expect(jsx).toContain('Item 1');
      expect(jsx).toContain('Item 2');
      expect(jsx).toContain('Item 3');
    });
  });

  describe('Containers', () => {
    it('should render a hero container', () => {
      const ast = parse('::: hero\n# Welcome\nGet started today\n:::');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('className="wmd-container-hero"');
      expect(jsx).toContain('<h1');
      expect(jsx).toContain('Welcome');
    });

    it('should render a card container', () => {
      const ast = parse('::: card\n### Feature\nDescription here\n:::');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('className="wmd-container-card"');
      expect(jsx).toContain('<h3');
      expect(jsx).toContain('Feature');
    });
  });

  describe('Navigation', () => {
    it('should render navigation', () => {
      const ast = parse('[[Logo | Home | Products | About]]');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('<nav className="wmd-nav">');
      expect(jsx).toContain('className="wmd-nav-content"');
      expect(jsx).toContain('className="wmd-brand"');
      expect(jsx).toContain('Logo');
      expect(jsx).toContain('className="wmd-nav-item"');
      expect(jsx).toContain('Home');
      expect(jsx).toContain('Products');
    });
  });

  describe('Grid Layout', () => {
    it('should render a grid', () => {
      const ast = parse('::: grid-3\n### Item 1\n### Item 2\n### Item 3\n:::');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('className="wmd-grid wmd-grid-3"');
      expect(jsx).toContain("style={{ '--grid-columns': 3 }");
      expect(jsx).toContain('as React.CSSProperties');
    });
  });

  describe('Tables', () => {
    it('should render a table', () => {
      const ast = parse('| Name | Email |\n|------|-------|\n| John | john@example.com |');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('<table');
      expect(jsx).toContain('<thead>');
      expect(jsx).toContain('<tbody>');
      expect(jsx).toContain('<th');
      expect(jsx).toContain('<td');
      expect(jsx).toContain('Name');
      expect(jsx).toContain('Email');
      expect(jsx).toContain('John');
      expect(jsx).toContain('john@example.com');
    });
  });

  describe('Code', () => {
    it('should render inline code', () => {
      const ast = parse('Use `npm install` to install');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('<code className="wmd-code-inline">npm install</code>');
    });

    it('should render code blocks', () => {
      const ast = parse('```js\nconst x = 1;\n```');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('<pre className="wmd-code-block">');
      expect(jsx).toContain('data-lang="js"');
      expect(jsx).toContain('const x = 1;');
    });
  });

  describe('Component Options', () => {
    it('should use custom component name', () => {
      const ast = parse('## Hello');
      const jsx = renderToReact(ast, { componentName: 'MyForm' });

      expect(jsx).toContain('export const MyForm');
    });

    it('should generate TypeScript by default', () => {
      const ast = parse('## Hello');
      const jsx = renderToReact(ast);

      expect(jsx).toContain(': React.FC');
    });

    it('should generate plain JSX when typescript is false', () => {
      const ast = parse('## Hello');
      const jsx = renderToReact(ast, { typescript: false });

      expect(jsx).not.toContain(': React.FC');
      expect(jsx).toContain('import React from \'react\'');
    });

    it('should use custom class prefix', () => {
      const ast = parse('[Submit]');
      const jsx = renderToReact(ast, { classPrefix: 'custom-' });

      expect(jsx).toContain('className="custom-button"');
      expect(jsx).toContain('className="custom-root"');
    });
  });

  describe('Complex Forms', () => {
    it('should render a complete contact form', () => {
      const markdown = `
## Contact Form

Name
[_____________________________]{required}

Email
[_____________________________]{type:email required}

Message
[                             ]
[                             ]
[_____________________________]{rows:5}

[Submit]{.primary} [Cancel]
      `;

      const ast = parse(markdown);
      const jsx = renderToReact(ast);

      expect(jsx).toContain('Contact Form');
      expect(jsx).toContain('type="email"');
      expect(jsx).toContain('rows={5}');
      expect(jsx).toContain('required');
      expect(jsx).toContain('className="wmd-button wmd-button-primary"');
      expect(jsx).toContain('Submit');
      expect(jsx).toContain('Cancel');
    });
  });

  describe('Escaping', () => {
    it('should escape JSX special characters', () => {
      const ast = parse('Text with {braces} and <tags>');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('&#123;');
      expect(jsx).toContain('&#125;');
      expect(jsx).toContain('&lt;');
      expect(jsx).toContain('&gt;');
    });

    it('should escape quotes in attributes', () => {
      const ast = parse('[Text "with" quotes]');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('&quot;');
    });
  });

  describe('Icons', () => {
    it('should render icons', () => {
      const ast = parse('[[{icon:home} Home | {icon:user} Profile]]');
      const jsx = renderToReact(ast);

      expect(jsx).toContain('data-icon="home"');
      expect(jsx).toContain('data-icon="user"');
      expect(jsx).toContain('🏠');
      expect(jsx).toContain('👤');
    });
  });

  describe('Component Structure', () => {
    it('should wrap output in React component', () => {
      const ast = parse('## Title');
      const jsx = renderToReact(ast);

      expect(jsx).toMatch(/import React from 'react';/);
      expect(jsx).toMatch(/export const \w+: React\.FC = \(\) => \{/);
      expect(jsx).toMatch(/return \(/);
      expect(jsx).toMatch(/className="wmd-root"/);
      expect(jsx).toMatch(/\};/);
    });
  });
});
