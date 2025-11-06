/**
 * wiremd Parser
 * Converts markdown with wiremd syntax into AST
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { DocumentNode, ParseOptions, WiremdNode } from '../types.js';
import { transformToWiremdAST } from './transformer.js';
import { remarkWiremdContainers } from './remark-containers.js';
import { remarkWiremdInlineContainers } from './remark-inline-containers.js';

/**
 * Parse markdown with wiremd syntax into AST
 *
 * @param input - Markdown string with wiremd syntax
 * @param options - Parse options
 * @returns wiremd AST (DocumentNode)
 *
 * @example
 * ```ts
 * import { parse } from 'markdown-mockup/parser';
 *
 * const ast = parse(`
 *   ## Contact Form
 *   Name
 *   [_____________________________]
 *   [Submit]{.primary}
 * `);
 * ```
 */
export function parse(input: string, options: ParseOptions = {}): DocumentNode {
  // Create unified processor with remark
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkWiremdInlineContainers)
    .use(remarkWiremdContainers);

  // Parse markdown to MDAST
  const mdast = processor.parse(input);

  // Run the processor to apply plugins
  const processed = processor.runSync(mdast);

  // Transform MDAST to wiremd AST
  const wiremdAST = transformToWiremdAST(processed, options);

  return wiremdAST;
}

/**
 * Validate a wiremd AST
 *
 * @param ast - wiremd AST to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validate(ast: DocumentNode): ValidationError[] {
  // TODO: Implement validation
  return [];
}

interface ValidationError {
  message: string;
  path?: string[];
  code?: string;
}
