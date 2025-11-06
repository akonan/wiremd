/**
 * wiremd Renderer
 * Converts wiremd AST to HTML or JSON
 */

import type { DocumentNode, RenderOptions, WiremdNode } from '../types.js';
import { renderNode } from './html-renderer.js';
import { getStyleCSS } from './styles.js';

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
 * Render wiremd AST based on format option
 *
 * @param ast - wiremd AST (DocumentNode)
 * @param options - Render options
 * @returns Rendered output (HTML or JSON string)
 */
export function render(ast: DocumentNode, options: RenderOptions = {}): string {
  const { format = 'html' } = options;

  if (format === 'json') {
    return renderToJSON(ast, options);
  }

  return renderToHTML(ast, options);
}
