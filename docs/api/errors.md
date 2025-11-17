# Error Handling

Comprehensive guide to error handling in wiremd.

## Overview

wiremd provides detailed error information to help you debug parsing and rendering issues. Errors include position information, error codes, and helpful messages.

## Error Types

### ParseError

Errors that occur during parsing.

```typescript
interface ParseError extends Error {
  // Human-readable error message
  message: string;

  // Position in source where error occurred
  position?: Location;

  // Machine-readable error code
  code?: string;

  // Error severity
  severity?: 'error' | 'warning';
}
```

### ValidationError

Errors from AST validation.

```typescript
interface ValidationError extends Error {
  // Human-readable error message
  message: string;

  // The invalid node
  node?: WiremdNode;

  // Path to the error in the AST
  path?: string[];

  // Machine-readable error code
  code?: string;
}
```

## Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `INVALID_SYNTAX` | Malformed wiremd syntax | Check syntax against documentation |
| `INVALID_ROOT_TYPE` | Document root must be 'document' | Don't manually create invalid ASTs |
| `MISSING_META` | Document missing metadata | Ensure AST has meta property |
| `INVALID_CHILDREN` | Children must be an array | Fix AST structure |
| `MISSING_NODE_TYPE` | Node missing type property | All nodes must have type |
| `UNKNOWN_NODE_TYPE` | Unrecognized node type | Use valid node types |

## Handling Parse Errors

### Basic Error Handling

```typescript
import { parse } from 'wiremd';

try {
  const ast = parse('[Invalid syntax...');
  console.log('Parsed successfully');
} catch (error) {
  if (error instanceof Error) {
    console.error('Parse error:', error.message);
  }
}
```

### Detailed Error Information

```typescript
import { parse } from 'wiremd';
import type { ParseError } from 'wiremd';

function parseWithErrorHandling(markdown: string) {
  try {
    return parse(markdown, { position: true });
  } catch (error) {
    const parseError = error as ParseError;

    console.error('Parse failed:');
    console.error('  Message:', parseError.message);

    if (parseError.code) {
      console.error('  Code:', parseError.code);
    }

    if (parseError.position) {
      console.error('  Line:', parseError.position.start.line);
      console.error('  Column:', parseError.position.start.column);
    }

    if (parseError.severity) {
      console.error('  Severity:', parseError.severity);
    }

    // Re-throw or return null
    return null;
  }
}

const ast = parseWithErrorHandling('[Button');
```

### User-Friendly Error Messages

```typescript
import { parse } from 'wiremd';

function parseUserInput(input: string) {
  try {
    return {
      success: true,
      ast: parse(input, { position: true }),
      error: null
    };
  } catch (error) {
    const parseError = error as any;

    let userMessage = 'Failed to parse wireframe';

    if (parseError.position) {
      const line = parseError.position.start.line;
      const col = parseError.position.start.column;
      userMessage += ` at line ${line}, column ${col}`;
    }

    if (parseError.message) {
      userMessage += `:\n${parseError.message}`;
    }

    return {
      success: false,
      ast: null,
      error: userMessage
    };
  }
}

// Usage
const result = parseUserInput('[Button');
if (!result.success) {
  console.error(result.error);
  // Show error to user in UI
}
```

## Handling Validation Errors

### Basic Validation

```typescript
import { parse, validate } from 'wiremd';

const ast = parse('## Title\n[Button]');
const errors = validate(ast);

if (errors.length > 0) {
  console.error('Validation errors:');
  errors.forEach(error => {
    console.error(`  - ${error.message}`);
  });
} else {
  console.log('AST is valid');
}
```

### Detailed Validation Errors

```typescript
import { parse, validate } from 'wiremd';

const ast = parse('## Form\n[Submit]');
const errors = validate(ast);

errors.forEach(error => {
  console.error('Validation error:');
  console.error('  Message:', error.message);

  if (error.code) {
    console.error('  Code:', error.code);
  }

  if (error.path) {
    console.error('  Path:', error.path.join(' > '));
  }

  if (error.node) {
    console.error('  Node type:', error.node.type);
  }
});
```

### Pre-Render Validation

```typescript
import { parse, validate, renderToHTML } from 'wiremd';

function safeRender(markdown: string): string | null {
  try {
    const ast = parse(markdown);

    // Validate before rendering
    const errors = validate(ast);
    if (errors.length > 0) {
      console.error('Cannot render invalid AST:');
      errors.forEach(err => console.error(`  - ${err.message}`));
      return null;
    }

    return renderToHTML(ast);
  } catch (error) {
    console.error('Render failed:', error);
    return null;
  }
}

const html = safeRender('## Form\n[Button]');
```

## Error Recovery

### Graceful Degradation

```typescript
import { parse } from 'wiremd';

function parseWithFallback(markdown: string): DocumentNode {
  try {
    return parse(markdown);
  } catch (error) {
    console.warn('Parse failed, returning empty document:', error);

    // Return minimal valid document
    return {
      type: 'document',
      version: '0.1',
      meta: {},
      children: []
    };
  }
}

const ast = parseWithFallback('[Invalid...');
console.log(ast.children.length); // 0
```

### Partial Parsing

```typescript
import { parse } from 'wiremd';

function parseWithRecovery(markdown: string) {
  // Split into sections
  const sections = markdown.split(/\n\n+/);
  const results = [];

  for (const section of sections) {
    try {
      const ast = parse(section);
      results.push({ success: true, ast });
    } catch (error) {
      results.push({
        success: false,
        error: error.message,
        input: section
      });
    }
  }

  return results;
}

const results = parseWithRecovery(`
## Valid Section
[Button]

[Invalid section...

## Another Valid Section
[Input]
`);

// Process successful sections
results
  .filter(r => r.success)
  .forEach(r => console.log('Valid AST:', r.ast));

// Report failed sections
results
  .filter(r => !r.success)
  .forEach(r => console.error('Failed section:', r.error));
```

### Retry with Options

```typescript
import { parse } from 'wiremd';

function parseWithRetry(markdown: string) {
  // Try with default options
  try {
    return parse(markdown);
  } catch (error) {
    console.warn('Parse failed, retrying with lenient mode...');

    // Try with less strict options
    try {
      return parse(markdown, { strict: false });
    } catch (retryError) {
      console.error('Parse failed even in lenient mode');
      throw retryError;
    }
  }
}
```

## Debugging Tips

### Enable Position Information

Always enable position information when debugging:

```typescript
import { parse } from 'wiremd';

const ast = parse(markdown, { position: true });

// Now all nodes include position
ast.children.forEach(node => {
  if (node.position) {
    console.log(`${node.type} at line ${node.position.start.line}`);
  }
});
```

### Inspect AST Structure

```typescript
import { parse, renderToJSON } from 'wiremd';

const ast = parse('## Form\n[Button]');

// Pretty-print AST for debugging
console.log(renderToJSON(ast, { pretty: true }));
```

### Validate During Development

```typescript
import { parse, validate } from 'wiremd';

const ast = parse(markdown, { validate: true }); // Throws on invalid AST

// Or manual validation
const errors = validate(ast);
if (errors.length > 0) {
  console.error('AST has issues:', errors);
}
```

### Create Custom Validators

```typescript
import { parse, validate } from 'wiremd';
import type { WiremdNode, ValidationError } from 'wiremd';

function validateAccessibility(ast: DocumentNode): ValidationError[] {
  const errors: ValidationError[] = [];

  function traverse(node: WiremdNode) {
    // Check images have alt text
    if (node.type === 'image' && !node.alt) {
      errors.push({
        message: 'Image missing alt text',
        code: 'A11Y_IMAGE_ALT',
        node
      } as ValidationError);
    }

    // Check buttons have labels
    if (node.type === 'button' && !node.content && !node.children?.length) {
      errors.push({
        message: 'Button missing label',
        code: 'A11Y_BUTTON_LABEL',
        node
      } as ValidationError);
    }

    // Recursively validate children
    if ('children' in node && node.children) {
      node.children.forEach(traverse);
    }
  }

  ast.children.forEach(traverse);
  return errors;
}

// Usage
const ast = parse('![](image.jpg)\n[Button]');
const a11yErrors = validateAccessibility(ast);

if (a11yErrors.length > 0) {
  console.warn('Accessibility issues:');
  a11yErrors.forEach(err => console.warn(`  - ${err.message}`));
}
```

## Production Error Handling

### Comprehensive Error Handler

```typescript
import { parse, validate, renderToHTML } from 'wiremd';

interface RenderResult {
  success: boolean;
  html?: string;
  error?: {
    type: 'parse' | 'validation' | 'render';
    message: string;
    code?: string;
    position?: any;
  };
}

export function renderSafely(markdown: string): RenderResult {
  try {
    // Parse
    const ast = parse(markdown, { position: true });

    // Validate
    const errors = validate(ast);
    if (errors.length > 0) {
      return {
        success: false,
        error: {
          type: 'validation',
          message: errors.map(e => e.message).join('; '),
          code: errors[0].code
        }
      };
    }

    // Render
    const html = renderToHTML(ast);

    return {
      success: true,
      html
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        type: 'parse',
        message: error.message,
        code: error.code,
        position: error.position
      }
    };
  }
}

// Usage
const result = renderSafely(userInput);

if (result.success) {
  // Use result.html
  document.body.innerHTML = result.html;
} else {
  // Show error to user
  console.error(`${result.error?.type} error: ${result.error?.message}`);
}
```

### Logging Errors

```typescript
import { parse } from 'wiremd';

interface ErrorLog {
  timestamp: Date;
  input: string;
  error: string;
  code?: string;
  position?: any;
}

const errorLogs: ErrorLog[] = [];

function parseAndLog(markdown: string) {
  try {
    return parse(markdown, { position: true });
  } catch (error: any) {
    // Log error
    errorLogs.push({
      timestamp: new Date(),
      input: markdown,
      error: error.message,
      code: error.code,
      position: error.position
    });

    // Send to monitoring service
    if (typeof window !== 'undefined') {
      // Browser environment
      console.error('Parse error:', error);
    } else {
      // Node environment - could send to logging service
      console.error('Parse error:', error);
    }

    throw error;
  }
}

// Review errors
function getErrorStats() {
  const errorCounts: Record<string, number> = {};

  errorLogs.forEach(log => {
    const code = log.code || 'UNKNOWN';
    errorCounts[code] = (errorCounts[code] || 0) + 1;
  });

  return errorCounts;
}
```

## Testing Error Conditions

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { parse, validate } from 'wiremd';

describe('Error Handling', () => {
  it('should throw on invalid syntax', () => {
    expect(() => parse('[Unclosed bracket')).toThrow();
  });

  it('should include position in errors', () => {
    try {
      parse('[Invalid...', { position: true });
    } catch (error: any) {
      expect(error.position).toBeDefined();
      expect(error.position.start.line).toBeGreaterThan(0);
    }
  });

  it('should validate AST structure', () => {
    const invalidAST = {
      type: 'document',
      version: '0.1',
      meta: {},
      children: [
        // @ts-expect-error - Testing invalid node
        { type: 'invalid' }
      ]
    };

    const errors = validate(invalidAST as any);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should handle empty input', () => {
    expect(() => parse('')).not.toThrow();
    const ast = parse('');
    expect(ast.children).toHaveLength(0);
  });
});
```

## Error Messages Reference

### Parse Errors

- **"Unexpected token"** - Invalid syntax, check for typos
- **"Unclosed bracket"** - Missing closing bracket `]`
- **"Invalid attribute syntax"** - Check `{.class}` or `{prop:value}` format
- **"Malformed container"** - Container syntax `> Type` is incorrect

### Validation Errors

- **"Root node must be of type 'document'"** - Don't manually create invalid ASTs
- **"Document must have metadata"** - Ensure `meta` property exists
- **"Node must have a type"** - All nodes require `type` property
- **"Document children must be an array"** - Children must be array, not object

### Rendering Errors

- **"Cannot render undefined node"** - Node is null or undefined
- **"Unknown node type"** - Unrecognized node type in AST
- **"Invalid style option"** - Style must be one of the supported styles

## See Also

- [Parser API](/api/parser) - Parsing and validation
- [Type Definitions](/api/types) - Error type definitions
- [Syntax Reference](/guide/syntax) - Valid wiremd syntax
