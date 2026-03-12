import { describe, expect, it } from 'vitest';
import { renderToHTML, renderToReact, renderToTailwind } from '../src/index.js';
import { renderNode as renderHtmlNode } from '../src/renderer/html-renderer.js';
import { renderNode as renderReactNode } from '../src/renderer/react-renderer.js';
import { renderNode as renderTailwindNode } from '../src/renderer/tailwind-renderer.js';
import { createLegacyRendererAst } from './fixtures/render-fixtures.js';

describe('Renderer Branch Coverage', () => {
  it('covers advanced branches in the HTML renderer', () => {
    const html = renderToHTML(createLegacyRendererAst());

    expect(html).toContain('Paragraph with <strong>rich</strong> content');
    expect(html).toContain('width="320"');
    expect(html).toContain('height="180"');
    expect(html).toContain('title="Read docs"');
    expect(html).toContain('style="font-family: monospace; font-weight: bold; font-style: normal;"');
    expect(html).toContain('<ol class="wmd-list">');
    expect(html).toContain('<tbody>');
    expect(html).toContain('wmd-align-right');
    expect(html).toContain('<blockquote class="wmd-blockquote">');
    expect(html).toContain('<code class="wmd-code-inline">npm test</code>');
    expect(html).toContain('<pre class="wmd-code-block"><code data-lang="ts">const ready = true;</code></pre>');
    expect(html).toContain('<hr class="wmd-separator" />');
    expect(html).toContain('Weekly digest');
  });

  it('covers the alternate class attribute branch and fallback comment in the React renderer', () => {
    const react = renderToReact(createLegacyRendererAst(), {
      typescript: false,
    });
    const jsx = renderReactNode(
      {
        type: 'link',
        href: '/plain-html',
        title: 'Plain HTML mode',
        props: {},
        children: [
          {
            type: 'text',
            content: 'Docs',
          },
        ],
      },
      {
        classPrefix: 'wmd-',
        typescript: false,
        useClassName: false,
        nextId: (prefix = 'id') => `${prefix}-1`,
      },
      0,
    );
    const unknown = renderReactNode(
      {
        type: 'tabs',
        props: {},
        children: [],
      },
      {
        classPrefix: 'wmd-',
        typescript: false,
        useClassName: false,
        nextId: (prefix = 'id') => `${prefix}-1`,
      },
      0,
    );

    expect(react).toContain('<img src="/hero.png" alt="Hero image" className="wmd-image" width="320" height="180" />');
    expect(react).toContain('<blockquote className="wmd-blockquote">');
    expect(react).toContain('<pre className="wmd-code-block"><code data-lang="ts">const ready = true;</code></pre>');
    expect(react).toContain('<hr className="wmd-separator" />');
    expect(jsx).toContain('class="wmd-link"');
    expect(unknown).toContain('{/* Unknown node type: tabs */}');
  });

  it('covers alternate branches in the Tailwind renderer', () => {
    const html = renderToTailwind(createLegacyRendererAst());
    const warningAlert = renderTailwindNode(
      {
        type: 'container',
        containerType: 'alert',
        props: {
          state: 'warning',
        },
        children: [
          {
            type: 'paragraph',
            content: 'Warning state',
            props: {},
          },
        ],
      },
      {
        pretty: true,
        nextId: (prefix = 'id') => `${prefix}-1`,
      },
    );
    const unknown = renderTailwindNode(
      {
        type: 'tabs',
        props: {},
        children: [],
      },
      {
        pretty: true,
        nextId: (prefix = 'id') => `${prefix}-1`,
      },
    );

    expect(html).toContain('max-w-full h-auto rounded-lg shadow-md');
    expect(html).toContain('title="Read docs"');
    expect(html).toContain('list-decimal');
    expect(html).toContain('divide-y divide-gray-200');
    expect(html).toContain('text-right');
    expect(html).toContain('border-l-4 border-indigo-500');
    expect(html).toContain('bg-gray-900 text-gray-100 rounded-lg p-4 my-4 overflow-x-auto');
    expect(html).toContain('<hr class="border-t border-gray-300 my-8" />');
    expect(warningAlert).toContain('bg-yellow-50 border-yellow-500 text-yellow-900');
    expect(unknown).toContain('<!-- Unknown node type: tabs -->');
  });

  it('covers loading and variant branches in Tailwind buttons', () => {
    const secondaryButton = renderTailwindNode(
      {
        type: 'button',
        content: 'Secondary',
        props: {
          variant: 'secondary',
          state: 'loading',
        },
      },
      {
        pretty: true,
        nextId: (prefix = 'id') => `${prefix}-1`,
      },
    );
    const fallbackButton = renderTailwindNode(
      {
        type: 'button',
        content: 'Fallback',
        props: {},
      },
      {
        pretty: true,
        nextId: (prefix = 'id') => `${prefix}-1`,
      },
    );

    expect(secondaryButton).toContain('bg-gray-200 text-gray-900 hover:bg-gray-300');
    expect(secondaryButton).toContain('opacity-75 cursor-wait');
    expect(fallbackButton).toContain('bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300');
  });
});
