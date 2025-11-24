# Parser API

The wiremd parser converts markdown with wiremd syntax into an Abstract Syntax Tree (AST) that can be rendered or manipulated programmatically.

## parse()

Parse markdown with wiremd syntax into an AST.

### Signature

```typescript
function parse(input: string, options?: ParseOptions): DocumentNode
```

### Parameters

#### `input: string`

The markdown string to parse. Can include standard markdown syntax plus wiremd extensions for UI components.

#### `options?: ParseOptions`

Optional configuration for the parser:

```typescript
interface ParseOptions {
  // Include position information in AST nodes (default: false)
  position?: boolean;

  // Validate the AST during parsing (default: false)
  validate?: boolean;

  // Enable strict mode (stricter syntax rules) (default: false)
  strict?: boolean;

  // Custom icon mappings for icon syntax
  icons?: Record<string, string>;
}
```

### Return Value

Returns a `DocumentNode` representing the parsed wiremd document:

```typescript
interface DocumentNode {
  type: 'document';
  version: string;
  meta: DocumentMeta;
  children: WiremdNode[];
  position?: Location;
}
```

### Examples

#### Basic Usage

```typescript
import { parse } from 'wiremd';

const ast = parse(`
## Contact Form

Name
[_____________________________]{required}

Email
[_____________________________]{type:email required}

[Submit]{.primary} [Cancel]
`);

console.log(ast.type); // 'document'
console.log(ast.children.length); // Number of top-level nodes
```

#### With Position Information

Position information is useful for error reporting and source mapping:

```typescript
import { parse } from 'wiremd';

const ast = parse(`
## Login Form
[Button]
`, { position: true });

// Each node will include position information
ast.children.forEach(node => {
  if (node.position) {
    console.log(`${node.type} at line ${node.position.start.line}`);
  }
});
```

#### With Validation

Enable validation to catch structural errors during parsing:

```typescript
import { parse } from 'wiremd';

try {
  const ast = parse(`
  ## My Wireframe
  [Button]
  `, { validate: true });

  console.log('AST is valid');
} catch (error) {
  console.error('Validation error:', error.message);
}
```

#### With Custom Icons

Define custom icon mappings:

```typescript
import { parse } from 'wiremd';

const ast = parse(`
## Header
[home-icon] Home
[user-icon] Profile
`, {
  icons: {
    'home-icon': 'fa-home',
    'user-icon': 'fa-user'
  }
});
```

#### Strict Mode

Enable strict mode for stricter syntax validation:

```typescript
import { parse } from 'wiremd';

// Strict mode enforces additional syntax rules
const ast = parse(`
## Title
[Button]
`, { strict: true });
```

### Advanced Examples

#### Processing Multiple Files

```typescript
import { parse } from 'wiremd';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const wireframesDir = './wireframes';
const files = readdirSync(wireframesDir).filter(f => f.endsWith('.md'));

const asts = files.map(file => {
  const content = readFileSync(join(wireframesDir, file), 'utf-8');
  return {
    filename: file,
    ast: parse(content, { position: true })
  };
});

console.log(`Parsed ${asts.length} wireframe files`);
```

#### Extract Metadata

```typescript
import { parse } from 'wiremd';

const ast = parse(`
## My Wireframe
This is a description
`);

// Access document metadata
console.log('Title:', ast.meta.title);
console.log('Description:', ast.meta.description);
console.log('Theme:', ast.meta.theme);
console.log('Viewport:', ast.meta.viewport);
```

#### Parse and Analyze

```typescript
import { parse } from 'wiremd';

const ast = parse(`
## Dashboard

[Search...]{type:search}

> Grid(3)
[Card 1]
[Card 2]
[Card 3]
`);

// Count different node types
function countNodeTypes(nodes: WiremdNode[]): Record<string, number> {
  const counts: Record<string, number> = {};

  function traverse(node: WiremdNode) {
    counts[node.type] = (counts[node.type] || 0) + 1;

    if ('children' in node && Array.isArray(node.children)) {
      node.children.forEach(traverse);
    }
  }

  nodes.forEach(traverse);
  return counts;
}

const counts = countNodeTypes(ast.children);
console.log('Node type counts:', counts);
// Output: { heading: 1, input: 1, grid: 1, container: 3, ... }
```

## validate()

Validate a wiremd AST for structural correctness.

### Signature

```typescript
function validate(ast: DocumentNode): ValidationError[]
```

### Parameters

#### `ast: DocumentNode`

The wiremd AST to validate.

### Return Value

Returns an array of `ValidationError` objects. An empty array indicates the AST is valid.

```typescript
interface ValidationError {
  message: string;
  path?: string[];
  code?: string;
}
```

### Examples

#### Basic Validation

```typescript
import { parse, validate } from 'wiremd';

const ast = parse(`
## Contact Form
[Submit]
`);

const errors = validate(ast);

if (errors.length === 0) {
  console.log('AST is valid');
} else {
  errors.forEach(error => {
    console.error(`Error: ${error.message}`);
    if (error.code) {
      console.error(`  Code: ${error.code}`);
    }
    if (error.path) {
      console.error(`  Path: ${error.path.join(' > ')}`);
    }
  });
}
```

#### Pre-render Validation

```typescript
import { parse, validate, renderToHTML } from 'wiremd';

const markdown = `
## My Wireframe
[Button]
`;

const ast = parse(markdown);
const errors = validate(ast);

if (errors.length > 0) {
  throw new Error(`Cannot render invalid AST: ${errors[0].message}`);
}

const html = renderToHTML(ast);
```

#### Custom Validation Rules

```typescript
import { parse, validate } from 'wiremd';

function validateCustomRules(ast: DocumentNode): string[] {
  const warnings: string[] = [];

  // First run standard validation
  const errors = validate(ast);
  if (errors.length > 0) {
    return errors.map(e => e.message);
  }

  // Add custom validation rules
  function traverse(node: WiremdNode, depth: number = 0) {
    // Example: Warn about deeply nested structures
    if (depth > 5) {
      warnings.push(`Deep nesting detected at ${node.type} (depth: ${depth})`);
    }

    // Example: Warn about missing button labels
    if (node.type === 'button' && !node.content && !node.children) {
      warnings.push('Button without label detected');
    }

    if ('children' in node && Array.isArray(node.children)) {
      node.children.forEach(child => traverse(child, depth + 1));
    }
  }

  ast.children.forEach(child => traverse(child));
  return warnings;
}

const ast = parse(`## Form\n[Button]`);
const warnings = validateCustomRules(ast);
warnings.forEach(w => console.warn(w));
```

## Error Handling

The parser may throw errors for malformed input. Always wrap parse calls in try-catch blocks when dealing with user input:

```typescript
import { parse } from 'wiremd';

function parseUserInput(input: string): DocumentNode | null {
  try {
    return parse(input, { validate: true });
  } catch (error) {
    console.error('Parse error:', error.message);

    // Handle specific error types
    if (error.code === 'INVALID_SYNTAX') {
      console.error('Invalid wiremd syntax');
    }

    // Log position if available
    if (error.position) {
      console.error(`At line ${error.position.start.line}, column ${error.position.start.column}`);
    }

    return null;
  }
}

const ast = parseUserInput('[Invalid syntax...');
```

## Performance Considerations

### Caching Parsed ASTs

For frequently used wireframes, consider caching parsed ASTs:

```typescript
import { parse } from 'wiremd';

const astCache = new Map<string, DocumentNode>();

function getCachedAST(markdown: string): DocumentNode {
  const cacheKey = markdown; // Or use a hash for large documents

  if (!astCache.has(cacheKey)) {
    astCache.set(cacheKey, parse(markdown));
  }

  return astCache.get(cacheKey)!;
}

// First call parses
const ast1 = getCachedAST('## Form\n[Button]');

// Second call returns cached result
const ast2 = getCachedAST('## Form\n[Button]');

console.log(ast1 === ast2); // true
```

### Incremental Parsing

For large documents, consider splitting into sections:

```typescript
import { parse } from 'wiremd';

function parseInSections(markdown: string): DocumentNode[] {
  // Split by top-level headings
  const sections = markdown.split(/(?=^## )/gm).filter(s => s.trim());

  return sections.map(section => parse(section));
}

const largeMd = `
## Section 1
Content...

## Section 2
More content...
`;

const sectionASTs = parseInSections(largeMd);
console.log(`Parsed ${sectionASTs.length} sections`);
```

## Interactive Examples

Try these examples in your browser:

- [**Parse and Render Example**](https://stackblitz.com/edit/wiremd-parse-example) - Parse markdown and render to HTML
- [**AST Manipulation**](https://stackblitz.com/edit/wiremd-ast-manipulation) - Modify the AST programmatically
- [**Validation Example**](https://stackblitz.com/edit/wiremd-validation) - Validate wiremd documents

::: tip
You can fork these examples and experiment with your own wiremd syntax!
:::

## See Also

- [Type Definitions](/api/types) - Complete type reference
- [Renderer APIs](/api/renderer) - Rendering ASTs to various formats
- [Error Handling](/api/errors) - Error handling guide
- [Syntax Reference](/guide/syntax) - wiremd syntax documentation
