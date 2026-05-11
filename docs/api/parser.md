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

> **Note:** `ParseOptions` fields are defined in the type but are **not yet implemented** in the current version. Passing any of these options has no effect — `parse()` ignores them. In particular:
> - `{ validate: true }` does **not** cause `parse()` to throw on invalid input.
> - `{ position: true }` does **not** add position data to AST nodes.
>
> To validate an AST, call `validate(ast)` separately after `parse()`. See the [`validate()`](#validate) section below.

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

> **Note:** The `position` option is not yet implemented. Passing `{ position: true }` currently has no effect and nodes will not include position data.

Position information would be useful for error reporting and source mapping once implemented:

```typescript
import { parse } from 'wiremd';

const ast = parse(`
## Login Form
[Button]
`);

// Position data is not yet populated by the parser
ast.children.forEach(node => {
  if (node.position) {
    console.log(`${node.type} at line ${node.position.start.line}`);
  }
});
```

#### With Validation

To validate an AST for structural errors, call `validate()` separately after `parse()`. The `validate` option on `ParseOptions` is not yet implemented and has no effect.

```typescript
import { parse, validate } from 'wiremd';

const ast = parse(`
## My Wireframe
[Button]
`);

const errors = validate(ast);
if (errors.length > 0) {
  errors.forEach(error => console.error('Validation error:', error.message));
} else {
  console.log('AST is valid');
}
```

#### With Custom Icons

> **Note:** The `icons` option is not yet implemented and has no effect.

```typescript
import { parse } from 'wiremd';

const ast = parse(`
## Header
[home-icon] Home
[user-icon] Profile
`);
```

#### Strict Mode

> **Note:** The `strict` option is not yet implemented and has no effect.

```typescript
import { parse } from 'wiremd';

const ast = parse(`
## Title
[Button]
`);
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
    ast: parse(content)
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

## resolveIncludes()

Resolve `![[file.md]]` include references in a Markdown string before parsing.

### Signature

```typescript
function resolveIncludes(markdown: string, basePath: string): string
```

### Parameters

#### `markdown: string`

The Markdown source string, which may contain `![[relative/path.md]]` include syntax.

#### `basePath: string`

The base path used to resolve relative include paths. Pass the directory of the file being processed (e.g. `path.dirname(filePath)`).

### Return Value

Returns the Markdown string with every `![[relative/path.md]]` reference replaced by the contents of the referenced file. Include patterns inside fenced code blocks or inline code spans are left untouched. If a referenced file cannot be found or read, the include is replaced with a blockquote warning comment.

### When You Need It

If your input Markdown uses `![[file.md]]` include syntax **and** you are calling `parse()` directly (not via the CLI), you must call `resolveIncludes()` first. The CLI runs `resolveIncludes()` automatically; the `parse()` library function does not.

### Example

```typescript
import { resolveIncludes, parse, renderToHTML } from 'wiremd';
import { readFileSync } from 'fs';
import path from 'path';

const filePath = './wireframes/dashboard.md';
const markdown = readFileSync(filePath, 'utf-8');

// Resolve includes before parsing
const resolved = resolveIncludes(markdown, path.dirname(filePath));
const ast = parse(resolved);
const html = renderToHTML(ast);
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

`parse()` is resilient and does not throw on most malformed input — it parses what it can and returns an AST. To check whether the result is structurally valid, call `validate(ast)` after parsing. The `validate` option on `ParseOptions` is not yet implemented and has no effect.

```typescript
import { parse, validate } from 'wiremd';

function parseUserInput(input: string): DocumentNode | null {
  // parse() itself rarely throws; validate() checks structural correctness
  const ast = parse(input);

  const errors = validate(ast);
  if (errors.length > 0) {
    console.error('Validation errors:');
    errors.forEach(error => console.error(`  - ${error.message}`));
    return null;
  }

  return ast;
}

const ast = parseUserInput('## My Wireframe\n[Button]');
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
- [Syntax Reference](/components/) - wiremd syntax documentation
