/**
 * wiremd Renderer
 * Converts wiremd AST to HTML, JSON, React, or Tailwind
 *
 * Copyright (c) 2025 wiremd
 * Licensed under MIT License
 * https://github.com/akonan/wiremd/blob/main/LICENSE
 */

import type { DocumentNode, RenderOptions } from '../types.js';
import { renderNode } from './html-renderer.js';
import { getStyleCSS } from './styles.js';
import * as ReactRenderer from './react-renderer.js';
import * as TailwindRenderer from './tailwind-renderer.js';

/**
 * Render wiremd AST to HTML
 *
 * @param ast - wiremd AST (DocumentNode)
 * @param options - Render options
 * @returns HTML string
 *
 * @example
 * ```ts
 * import { parse } from 'markdown-mockup/parser';
 * import { renderToHTML } from 'markdown-mockup/renderer';
 *
 * const ast = parse('## Title\n[Button]*');
 * const html = renderToHTML(ast, { style: 'sketch' });
 * ```
 */
export function renderToHTML(
  ast: DocumentNode,
  options: RenderOptions = {}
): string {
  const {
    style = 'sketch',
    inlineStyles = true,
    pretty = true,
    classPrefix = 'wmd-',
  } = options;

  const context = {
    style,
    classPrefix,
    inlineStyles,
    pretty,
  };

  // Render all children
  const childrenHTML = ast.children.map((child) => renderNode(child, context)).join('\n');

  // Build complete HTML document
  const css = inlineStyles ? getStyleCSS(style, classPrefix) : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>wiremd Mockup</title>
  ${css ? `<style>\n${css}\n  </style>` : ''}
</head>
<body class="${classPrefix}root ${classPrefix}${style}">
  ${childrenHTML}
</body>
</html>`;

  return pretty ? html : html.replace(/\n\s*/g, '');
}

/**
 * Render wiremd AST to JSON
 *
 * @param ast - wiremd AST (DocumentNode)
 * @param options - Render options
 * @returns JSON string
 */
export function renderToJSON(
  ast: DocumentNode,
  options: RenderOptions = {}
): string {
  const { pretty = true } = options;

  return JSON.stringify(ast, null, pretty ? 2 : 0);
}

/**
 * Render wiremd AST to React/JSX components
 *
 * @param ast - wiremd AST (DocumentNode)
 * @param options - Render options
 * @returns React component as JSX string
 *
 * @example
 * ```ts
 * import { parse } from 'wiremd/parser';
 * import { renderToReact } from 'wiremd/renderer';
 *
 * const ast = parse('## Title\n[Button]{.primary}');
 * const jsx = renderToReact(ast, { typescript: true });
 * ```
 */
export function renderToReact(
  ast: DocumentNode,
  options: RenderOptions & { typescript?: boolean; componentName?: string } = {}
): string {
  const {
    classPrefix = 'wmd-',
    typescript = true,
    componentName = 'WiremdComponent',
  } = options;

  const context: ReactRenderer.ReactRenderContext = {
    classPrefix,
    typescript,
    useClassName: true,
    componentName,
  };

  // Render all children
  const childrenJSX = ast.children.map((child) => ReactRenderer.renderNode(child, context, 1)).join('\n');

  // Build React component
  const typeAnnotation = typescript ? ': React.FC' : '';
  const importStatement = typescript
    ? "import React from 'react';\n\n"
    : "import React from 'react';\n\n";

  const component = `${importStatement}export const ${componentName}${typeAnnotation} = () => {
  return (
    <div className="${classPrefix}root">
${childrenJSX}
    </div>
  );
};`;

  return component;
}

/**
 * Render wiremd AST to HTML with Tailwind CSS classes
 *
 * @param ast - wiremd AST (DocumentNode)
 * @param options - Render options
 * @returns HTML string with Tailwind classes
 *
 * @example
 * ```ts
 * import { parse } from 'wiremd/parser';
 * import { renderToTailwind } from 'wiremd/renderer';
 *
 * const ast = parse('## Title\n[Button]{.primary}');
 * const html = renderToTailwind(ast);
 * ```
 */
export function renderToTailwind(
  ast: DocumentNode,
  options: RenderOptions = {}
): string {
  const { pretty = true } = options;

  const context: TailwindRenderer.TailwindRenderContext = {
    pretty,
  };

  // Render all children
  const childrenHTML = ast.children.map((child) => TailwindRenderer.renderNode(child, context)).join('\n  ');

  // Build complete HTML document
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>wiremd Mockup - Tailwind</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-6">
  ${childrenHTML}
</body>
</html>`;

  return pretty ? html : html.replace(/\n\s*/g, '');
}

/**
 * Render wiremd AST based on format option
 *
 * @param ast - wiremd AST (DocumentNode)
 * @param options - Render options
 * @returns Rendered output (HTML, JSON, React, or Tailwind string)
 */
export function render(ast: DocumentNode, options: RenderOptions = {}): string {
  const { format = 'html' } = options;

  if (format === 'json') {
    return renderToJSON(ast, options);
  }

  if (format === 'react') {
    return renderToReact(ast, options);
  }

  if (format === 'tailwind') {
    return renderToTailwind(ast, options);
  }

  return renderToHTML(ast, options);
}
