/**
 * wiremd Parser
 * Converts markdown with wiremd syntax into AST
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { DocumentNode, ParseOptions } from '../types.js';
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
  const processed = processor.runSync(mdast) as any;

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
  const errors: ValidationError[] = [];

  // Validate document structure
  if (!ast.type || ast.type !== 'document') {
    errors.push({
      message: 'Root node must be of type "document"',
      code: 'INVALID_ROOT_TYPE',
    });
  }

  if (!ast.meta) {
    errors.push({
      message: 'Document must have metadata',
      code: 'MISSING_META',
    });
  }

  if (!Array.isArray(ast.children)) {
    errors.push({
      message: 'Document children must be an array',
      code: 'INVALID_CHILDREN',
    });
  }

  // Validate children recursively
  function validateNode(node: any, path: string[] = []): void {
    if (!node.type) {
      errors.push({
        message: 'Node must have a type',
        path,
        code: 'MISSING_NODE_TYPE',
      });
      return;
    }

    // Recursively validate children
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child: any, index: number) => {
        validateNode(child, [...path, node.type, `child[${index}]`]);
      });
    }
  }

  if (ast.children) {
    ast.children.forEach((child, index) => {
      validateNode(child, [`root.children[${index}]`]);
    });
  }

  return errors;
}

interface ValidationError {
  message: string;
  path?: string[];
  code?: string;
}
