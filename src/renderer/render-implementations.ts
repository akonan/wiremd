import type { DocumentNode, RenderOptions, RenderResult } from '../types.js';
import { renderNode as renderHTMLNode } from './html-renderer.js';
import { renderNode as renderReactNode } from './react-renderer.js';
import { renderNode as renderTailwindNode } from './tailwind-renderer.js';
import { getStyleCSS } from './styles.js';
import { createRenderHelpers } from './plugin-utils.js';

export function renderHTMLDocument(
  ast: DocumentNode,
  options: RenderOptions = {},
): RenderResult {
  const {
    style = 'sketch',
    inlineStyles = true,
    pretty = true,
    classPrefix = 'wmd-',
  } = options;

  const helpers = createRenderHelpers();
  const context = {
    style,
    classPrefix,
    inlineStyles,
    pretty,
    nextId: helpers.nextId,
  };

  const childrenHTML = ast.children.map((child) => renderHTMLNode(child, context)).join('\n');
  const css = inlineStyles ? getStyleCSS(style, classPrefix) : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${ast.meta.title || 'wiremd Mockup'}</title>
  ${css ? `<style>\n${css}\n  </style>` : ''}
</head>
<body class="${classPrefix}root ${classPrefix}${style}">
  ${childrenHTML}
</body>
</html>`;

  return singleArtifact('html', 'wiremd.html', pretty ? html : html.replace(/\n\s*/g, ''));
}

export function renderJSONDocument(
  ast: DocumentNode,
  options: RenderOptions = {},
): RenderResult {
  const { pretty = true } = options;
  return singleArtifact('json', 'wiremd.json', JSON.stringify(ast, null, pretty ? 2 : 0));
}

export function renderReactComponentDocument(
  ast: DocumentNode,
  options: RenderOptions = {},
): RenderResult {
  const {
    classPrefix = 'wmd-',
    typescript = true,
    componentName = 'WiremdComponent',
  } = options;

  const helpers = createRenderHelpers();
  const context = {
    classPrefix,
    typescript,
    useClassName: true,
    componentName,
    nextId: helpers.nextId,
  };

  const childrenJSX = ast.children.map((child) => renderReactNode(child, context, 1)).join('\n');
  const typeAnnotation = typescript ? ': React.FC' : '';
  const component = `import React from 'react';

export const ${componentName}${typeAnnotation} = () => {
  return (
    <div className="${classPrefix}root">
${childrenJSX}
    </div>
  );
};`;

  return singleArtifact('react', `${componentName}.${typescript ? 'tsx' : 'jsx'}`, component);
}

export function renderTailwindDocument(
  ast: DocumentNode,
  options: RenderOptions = {},
): RenderResult {
  const { pretty = true } = options;
  const helpers = createRenderHelpers();
  const context = {
    pretty,
    nextId: helpers.nextId,
  };

  const childrenHTML = ast.children.map((child) => renderTailwindNode(child, context)).join('\n  ');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${ast.meta.title || 'wiremd Mockup - Tailwind'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-6">
  ${childrenHTML}
</body>
</html>`;

  return singleArtifact('tailwind', 'wiremd-tailwind.html', pretty ? html : html.replace(/\n\s*/g, ''));
}

function singleArtifact(format: string, filename: string, content: string): RenderResult {
  return {
    format,
    artifacts: [{ filename, content }],
  };
}
