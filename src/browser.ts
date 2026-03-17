/**
 * wiremd Browser Entry Point
 * Browser-friendly export without Node.js dependencies
 *
 * Copyright (c) 2025 wiremd
 * Licensed under MIT License
 * https://github.com/akomd/wiremd/blob/main/LICENSE
 */

// Export core functionality (browser compatible)
export * from './types.js';
export { parse, validate } from './parser/index.js';
export {
  renderToHTML,
  renderToJSON,
  renderToReact,
  renderToTailwind,
} from './renderer/index.js';

export const VERSION = '0.1.0';
export const SYNTAX_VERSION = '0.1';
