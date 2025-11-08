# API Documentation

wiremd provides a simple programmatic API for parsing and rendering wireframes.

## Installation

```bash
npm install wiremd
```

## Quick Example

```typescript
import { parse, renderToHTML, renderToJSON } from 'wiremd';

// Parse markdown to AST
const ast = parse(`
  ## Contact Form
  Name
  [_____________________________]
  [Submit]{.primary}
`);

// Render to HTML
const html = renderToHTML(ast, { style: 'sketch' });

// Render to JSON
const json = renderToJSON(ast, { pretty: true });
```

## Core Functions

### `parse(input, options?)`

Parse markdown with wiremd syntax into an AST.

**Parameters:**
- `input: string` - Markdown string with wiremd syntax
- `options?: ParseOptions` - Optional parsing options

**Returns:** `DocumentNode` - wiremd AST

**Example:**

```typescript
import { parse } from 'wiremd';

const ast = parse('## Heading\n[Button]');
```

### `renderToHTML(ast, options?)`

Render wiremd AST to HTML.

**Parameters:**
- `ast: DocumentNode` - wiremd AST from `parse()`
- `options?: RenderOptions` - Optional render options
  - `style?: string` - Visual style: 'sketch', 'clean', 'wireframe', etc.
  - `pretty?: boolean` - Pretty-print HTML (default: true)

**Returns:** `string` - HTML string

**Example:**

```typescript
import { parse, renderToHTML } from 'wiremd';

const ast = parse('## Heading\n[Button]');
const html = renderToHTML(ast, { style: 'clean', pretty: true });
```

### `renderToJSON(ast, options?)`

Render wiremd AST to JSON string.

**Parameters:**
- `ast: DocumentNode` - wiremd AST from `parse()`
- `options?: { pretty?: boolean }` - Optional formatting options

**Returns:** `string` - JSON string

**Example:**

```typescript
import { parse, renderToJSON } from 'wiremd';

const ast = parse('## Heading\n[Button]');
const json = renderToJSON(ast, { pretty: true });
```

### `validate(ast)`

Validate a wiremd AST for structural correctness.

**Parameters:**
- `ast: DocumentNode` - wiremd AST to validate

**Returns:** `ValidationError[]` - Array of validation errors (empty if valid)

**Example:**

```typescript
import { parse, validate } from 'wiremd';

const ast = parse('## Heading\n[Button]');
const errors = validate(ast);

if (errors.length > 0) {
  console.error('Validation errors:', errors);
}
```

## Types

### `DocumentNode`

The root AST node representing a wiremd document.

```typescript
interface DocumentNode {
  type: 'document';
  meta: DocumentMeta;
  children: WiremdNode[];
}
```

### `WiremdNode`

Union type representing all possible wiremd AST nodes.

Includes: `button`, `input`, `textarea`, `select`, `heading`, `paragraph`, `container`, `grid`, and more.

### `ParseOptions`

Options for parsing markdown.

```typescript
interface ParseOptions {
  // Future options will be added here
}
```

### `RenderOptions`

Options for rendering HTML.

```typescript
interface RenderOptions {
  style?: 'sketch' | 'clean' | 'wireframe' | 'material' | 'tailwind' | 'brutal' | 'none';
  pretty?: boolean;
}
```

## Advanced Usage

### Custom Rendering Pipeline

```typescript
import { parse, renderToHTML } from 'wiremd';
import { readFileSync, writeFileSync } from 'fs';

// Read input
const input = readFileSync('wireframe.md', 'utf-8');

// Parse
const ast = parse(input);

// Validate (optional)
const errors = validate(ast);
if (errors.length > 0) {
  throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
}

// Render with custom style
const html = renderToHTML(ast, { style: 'material' });

// Write output
writeFileSync('output.html', html);
```

### Batch Processing

```typescript
import { parse, renderToHTML } from 'wiremd';
import { readdirSync, readFileSync, writeFileSync } from 'fs';

const files = readdirSync('./wireframes').filter(f => f.endsWith('.md'));

for (const file of files) {
  const input = readFileSync(`./wireframes/${file}`, 'utf-8');
  const ast = parse(input);
  const html = renderToHTML(ast);
  const outputFile = file.replace('.md', '.html');
  writeFileSync(`./output/${outputFile}`, html);
}
```

### AST Manipulation

```typescript
import { parse, renderToHTML } from 'wiremd';

const ast = parse('## Heading\n[Button]');

// Modify the AST
ast.meta.theme = 'dark';

// Add a new node
ast.children.push({
  type: 'paragraph',
  props: {},
  children: [{ type: 'text', content: 'Added programmatically', props: {} }]
});

const html = renderToHTML(ast);
```

## Next Steps

- [Getting Started Guide](../guide/getting-started.md)
- [Syntax Reference](../guide/syntax.md)
- [Type Definitions](../../src/types.ts)
