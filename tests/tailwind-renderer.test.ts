/**
 * Tests for Tailwind Renderer
 */

import { describe, it, expect } from 'vitest';
import { parse } from '../src/parser/index.js';
import { renderToTailwind } from '../src/renderer/index.js';

describe('Tailwind Renderer', () => {
  describe('Basic Components', () => {
    it('should render a button with Tailwind classes', () => {
      const ast = parse('[Submit]');
      const html = renderToTailwind(ast);

      expect(html).toContain('class="px-4 py-2 rounded-md font-medium transition-colors');
      expect(html).toContain('bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300');
      expect(html).toContain('Submit');
    });

    it('should render a primary button with * syntax', () => {
      const ast = parse('[Submit]*');
      const html = renderToTailwind(ast);

      expect(html).toContain('bg-indigo-600 text-white hover:bg-indigo-700');
      expect(html).toContain('Submit');
    });

    it('should render a primary button with .primary class', () => {
      const ast = parse('[Submit]{.primary}');
      const html = renderToTailwind(ast);

      // Should have indigo primary colors (either from variant or class)
      expect(html).toContain('Submit');
      expect(html.includes('bg-indigo-600') || html.includes('wmd-primary')).toBe(true);
    });

    it('should render a danger button with .danger class', () => {
      const ast = parse('[Delete]{.danger}');
      const html = renderToTailwind(ast);

      expect(html).toContain('Delete');
      expect(html.includes('bg-red-600') || html.includes('wmd-danger')).toBe(true);
    });

    it('should render a disabled button', () => {
      const ast = parse('[Submit]{state:disabled}');
      const html = renderToTailwind(ast);

      expect(html).toContain('opacity-50 cursor-not-allowed');
      expect(html).toContain('disabled');
    });

    it('should render an input with Tailwind classes', () => {
      const ast = parse('[___________]{type:email required}');
      const html = renderToTailwind(ast);

      expect(html).toContain('class="w-full px-3 py-2 border border-gray-300 rounded-md');
      expect(html).toContain('focus:outline-none focus:ring-2 focus:ring-indigo-500');
      expect(html).toContain('type="email"');
      expect(html).toContain('required');
    });


    it('should render a select with options', () => {
      const markdown = `[Choose option___________v]
- Option 1
- Option 2
- Option 3`;
      const ast = parse(markdown);
      const html = renderToTailwind(ast);

      expect(html).toContain('<select');
      expect(html).toContain('focus:ring-2 focus:ring-indigo-500');
      expect(html).toContain('<option value="Option 1">Option 1</option>');
    });

    it('should render a checkbox', () => {
      const ast = parse('- [x] Accept terms');
      const html = renderToTailwind(ast);

      expect(html).toContain('<input type="checkbox"');
      expect(html).toContain('class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"');
      expect(html).toContain('checked');
      expect(html).toContain('Accept terms');
    });

    it('should render radio buttons', () => {
      const ast = parse('( ) Option A\n(x) Option B');
      const html = renderToTailwind(ast);

      expect(html).toContain('<input type="radio"');
      expect(html).toContain('class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"');
      expect(html).toContain('Option A');
      expect(html).toContain('Option B');
      expect(html).toContain('checked');
    });

    it('should render inline radio group', () => {
      const ast = parse('::: radio-group-inline\n( ) Small\n( ) Medium\n(x) Large\n:::');
      const html = renderToTailwind(ast);

      expect(html).toContain('class="flex flex-wrap gap-4"');
      expect(html).toContain('Small');
      expect(html).toContain('Medium');
      expect(html).toContain('Large');
    });
  });

  describe('Typography', () => {
    it('should render h1 heading', () => {
      const ast = parse('# Main Title');
      const html = renderToTailwind(ast);

      expect(html).toContain('<h1 class="text-4xl font-extrabold text-gray-900 mb-4 mt-8">');
      expect(html).toContain('Main Title');
    });

    it('should render h2 heading', () => {
      const ast = parse('## Section Title');
      const html = renderToTailwind(ast);

      expect(html).toContain('<h2 class="text-3xl font-bold text-gray-900 mb-3 mt-6">');
      expect(html).toContain('Section Title');
    });

    it('should render paragraphs', () => {
      const ast = parse('This is a paragraph of text.');
      const html = renderToTailwind(ast);

      expect(html).toContain('<p class="text-gray-700 my-3">');
      expect(html).toContain('This is a paragraph of text.');
    });
  });

  describe('Containers', () => {
    it('should render a hero container', () => {
      const ast = parse('::: hero\n# Welcome\nGet started today\n:::');
      const html = renderToTailwind(ast);

      expect(html).toContain('class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-12 text-center my-8 shadow-lg"');
      expect(html).toContain('Welcome');
    });

    it('should render a card container', () => {
      const ast = parse('::: card\n### Feature\nDescription here\n:::');
      const html = renderToTailwind(ast);

      expect(html).toContain('class="bg-white rounded-lg p-6 shadow-md border border-gray-200 my-4"');
      expect(html).toContain('Feature');
    });

    it('should render a modal container', () => {
      const ast = parse('::: modal\n### Modal Title\nModal content\n:::');
      const html = renderToTailwind(ast);

      expect(html).toContain('class="bg-white rounded-lg p-8 shadow-2xl max-w-md mx-auto my-8"');
      expect(html).toContain('Modal Title');
    });

    it('should render an alert container with error state', () => {
      const ast = parse('::: alert {state:error}\nSomething went wrong!\n:::');
      const html = renderToTailwind(ast);

      expect(html).toContain('bg-red-50 border-red-500 text-red-900');
      expect(html).toContain('Something went wrong!');
    });

    it('should render an alert container with success state', () => {
      const ast = parse('::: alert {state:success}\nSuccess!\n:::');
      const html = renderToTailwind(ast);

      expect(html).toContain('bg-green-50 border-green-500 text-green-900');
      expect(html).toContain('Success!');
    });

    it('should render a footer container', () => {
      const ast = parse('::: footer\n© 2025 Company\n:::');
      const html = renderToTailwind(ast);

      expect(html).toContain('class="bg-gray-900 text-gray-300 p-8 rounded-lg mt-12"');
    });
  });

  describe('Navigation', () => {
    it('should render navigation with Tailwind classes', () => {
      const ast = parse('[[ :logo: Logo | Home | Products | About ]]');
      const html = renderToTailwind(ast);

      expect(html).toContain('<nav class="bg-white shadow-sm rounded-lg p-4 mb-8">');
      expect(html).toContain('class="flex items-center gap-6 flex-wrap"');
      expect(html).toContain('class="font-bold text-xl text-gray-900 mr-auto flex items-center gap-2"');
      expect(html).toContain('Logo');
      expect(html).toContain('class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium"');
      expect(html).toContain('Home');
    });
  });

  describe('Grid Layout', () => {
    it('should render a 2-column grid', () => {
      const ast = parse('## Features {.grid-2}\n### Item 1\n### Item 2');
      const html = renderToTailwind(ast);

      expect(html).toContain('class="grid gap-6 my-8 grid-cols-1 md:grid-cols-2"');
    });

    it('should render a 3-column grid', () => {
      const ast = parse('## Features {.grid-3}\n### Item 1\n### Item 2\n### Item 3');
      const html = renderToTailwind(ast);

      expect(html).toContain('class="grid gap-6 my-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"');
    });

    it('should render a 4-column grid', () => {
      const ast = parse('## Features {.grid-4}\n### A\n### B\n### C\n### D');
      const html = renderToTailwind(ast);

      expect(html).toContain('class="grid gap-6 my-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"');
    });

    it('should render grid items', () => {
      const ast = parse('## Features {.grid-2}\n### Item 1\nDescription');
      const html = renderToTailwind(ast);

      expect(html).toContain('class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"');
    });
  });


  describe('Document Structure', () => {
    it('should include Tailwind CDN script', () => {
      const ast = parse('## Hello');
      const html = renderToTailwind(ast);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<script src="https://cdn.tailwindcss.com"></script>');
    });

    it('should wrap content in body with Tailwind classes', () => {
      const ast = parse('## Hello');
      const html = renderToTailwind(ast);

      expect(html).toContain('<body class="bg-gray-50 p-6">');
    });

    it('should have proper meta tags', () => {
      const ast = parse('## Hello');
      const html = renderToTailwind(ast);

      expect(html).toContain('<meta charset="UTF-8">');
      expect(html).toContain('<meta name="viewport"');
    });
  });

  describe('Complex Forms', () => {
    it('should render a complete contact form with Tailwind classes', () => {
      const markdown = `
## Contact Form

Name

[_____________________________]{required}

Email

[_____________________________]{type:email required}

[Submit]* [Cancel]
      `;

      const ast = parse(markdown);
      const html = renderToTailwind(ast);

      expect(html).toContain('Contact Form');
      expect(html).toContain('w-full px-3 py-2 border border-gray-300 rounded-md');
      expect(html).toContain('type="email"');
      expect(html).toContain('required');
      expect(html).toContain('bg-indigo-600 text-white hover:bg-indigo-700');
      expect(html).toContain('Submit');
      expect(html).toContain('Cancel');
    });
  });

  describe('Icons', () => {
    it('should render icons', () => {
      const ast = parse('[[ :home: Home | :user: Profile ]]');
      const html = renderToTailwind(ast);

      expect(html).toContain('data-icon="home"');
      expect(html).toContain('data-icon="user"');
      expect(html).toContain('🏠');
      expect(html).toContain('👤');
    });
  });

  describe('Blockquotes and Separators', () => {
    it('should render blockquotes', () => {
      const ast = parse('> This is a quote\n> Multiple lines');
      const html = renderToTailwind(ast);

      expect(html).toContain('<blockquote class="border-l-4 border-indigo-500 pl-4 my-4 text-gray-700 italic">');
      expect(html).toContain('This is a quote');
    });

    it('should render separators', () => {
      const ast = parse('---');
      const html = renderToTailwind(ast);

      expect(html).toContain('<hr class="border-t border-gray-300 my-8" />');
    });
  });


  describe('Responsive Design', () => {
    it('should include responsive grid classes', () => {
      const ast = parse('## Features {.grid-3}\n### A\n### B\n### C');
      const html = renderToTailwind(ast);

      // Should be mobile-first: 1 column on mobile, 2 on md, 3 on lg
      expect(html).toContain('grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
    });
  });

  describe('Color System', () => {
    it('should use consistent indigo primary color', () => {
      const ast = parse('[Submit]*\n\n[___________]{type:text}');
      const html = renderToTailwind(ast);

      expect(html).toContain('bg-indigo-600');
      expect(html).toContain('focus:ring-indigo-500');
    });

    it('should use gray for secondary elements', () => {
      const ast = parse('[Cancel]');
      const html = renderToTailwind(ast);

      expect(html).toContain('bg-gray-100');
      expect(html).toContain('text-gray-900');
    });
  });
});
