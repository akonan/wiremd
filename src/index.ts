/**
 * wiremd - Text-first UI design tool
 * Parse markdown-based UI mockup syntax and render to HTML/JSON
 *
 * Copyright (c) 2025 wiremd
 * Licensed under MIT License
 * https://github.com/akonan/wiremd/blob/main/LICENSE
 * 
 * @packageDocumentation
 */

// Export types
export * from './types.js';

// Export parser
export * from './parser/index.js';

// Export renderer
export * from './renderer/index.js';

/**
 * Package version
 */
export const VERSION = '0.1.0';

/**
 * Syntax version
 */
export const SYNTAX_VERSION = '0.1';
