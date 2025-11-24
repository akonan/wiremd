# API Documentation

wiremd provides a powerful programmatic API for parsing and rendering wireframes.

## Quick Links

- **[Parser API](./parser.md)** - Parse markdown to AST
- **[Renderer APIs](./renderer.md)** - Render to HTML, JSON, React, and Tailwind
- **[Type Definitions](./types.md)** - Complete TypeScript type reference
- **[Plugin API](./plugins.md)** - Create custom renderers
- **[Error Handling](./errors.md)** - Error handling guide
- **[Migration Guides](./migration.md)** - Version migration guides

## Additional Resources

- 🚀 **[Framework Integrations](../guide/integrations.md)** - Next.js, React, Vite, and more
- 🔧 **[Troubleshooting Guide](../guide/troubleshooting.md)** - Common issues and solutions

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

### Parser Functions

- **[parse()](./parser.md#parse)** - Parse markdown with wiremd syntax into an AST
- **[validate()](./parser.md#validate)** - Validate a wiremd AST for correctness

### Renderer Functions

- **[renderToHTML()](./renderer.md#rendertohtml)** - Render AST to HTML with styles
- **[renderToJSON()](./renderer.md#rendertojson)** - Export AST as JSON
- **[renderToReact()](./renderer.md#rendertoreact)** - Generate React/JSX components
- **[renderToTailwind()](./renderer.md#rendertotailwind)** - Generate HTML with Tailwind classes
- **[render()](./renderer.md#render)** - Universal renderer with format option

## API Reference

### Parser API

The parser converts markdown with wiremd syntax into an Abstract Syntax Tree (AST).

```typescript
import { parse } from 'wiremd';

const ast = parse('## Heading\n[Button]', {
  position: true,  // Include position info
  validate: true,  // Validate during parse
  strict: false    // Strict mode
});
```

[Learn more about the Parser API →](./parser.md)

### Renderer APIs

wiremd provides multiple rendering targets:

```typescript
import { renderToHTML, renderToReact, renderToTailwind } from 'wiremd';

// HTML with embedded styles
const html = renderToHTML(ast, { style: 'sketch' });

// React component
const component = renderToReact(ast, { typescript: true });

// Tailwind CSS
const tailwind = renderToTailwind(ast);
```

[Learn more about Renderer APIs →](./renderer.md)

### Type Definitions

wiremd is fully typed with TypeScript:

```typescript
import type {
  DocumentNode,
  WiremdNode,
  ParseOptions,
  RenderOptions,
  ButtonNode,
  InputNode
} from 'wiremd';
```

[Explore all type definitions →](./types.md)

## Examples

### Complete Rendering Pipeline

```typescript
import { parse, validate, renderToHTML } from 'wiremd';
import { readFileSync, writeFileSync } from 'fs';

// Read input
const markdown = readFileSync('wireframe.md', 'utf-8');

// Parse
const ast = parse(markdown, { position: true });

// Validate
const errors = validate(ast);
if (errors.length > 0) {
  throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
}

// Render
const html = renderToHTML(ast, {
  style: 'clean',
  pretty: true
});

// Write output
writeFileSync('output.html', html);
```

### Multiple Output Formats

```typescript
import { parse, renderToHTML, renderToReact, renderToJSON } from 'wiremd';

const markdown = '## Login\n[Submit]{.primary}';
const ast = parse(markdown);

// Generate multiple formats
const html = renderToHTML(ast, { style: 'sketch' });
const react = renderToReact(ast, { typescript: true });
const json = renderToJSON(ast, { pretty: true });

// Save to different files
writeFileSync('output.html', html);
writeFileSync('Component.tsx', react);
writeFileSync('ast.json', json);
```

### AST Manipulation

```typescript
import { parse, renderToHTML } from 'wiremd';

const ast = parse('## Form\n[Button]');

// Modify the AST
ast.children.push({
  type: 'paragraph',
  content: 'Added programmatically',
  props: {}
});

// Traverse and modify
function addClassToButtons(node: WiremdNode) {
  if (node.type === 'button') {
    node.props.classes = [...(node.props.classes || []), 'custom-class'];
  }

  if ('children' in node && node.children) {
    node.children.forEach(addClassToButtons);
  }
}

ast.children.forEach(addClassToButtons);

const html = renderToHTML(ast);
```

## Interactive Examples

Try wiremd online with our [live demo site](https://github.com/akonan/wiremd) to see examples of:

- Different visual styles (sketch, clean, wireframe, material, brutal)
- Form components (buttons, inputs, selects, checkboxes)
- Layout components (grids, containers, navigation)
- Complex wireframes (dashboards, e-commerce, admin panels)

## Advanced Topics

### Custom Renderers

Create custom renderers for other frameworks:

```typescript
import type { DocumentNode, WiremdNode } from 'wiremd';

function renderToVue(ast: DocumentNode): string {
  // Custom Vue renderer implementation
}
```

[Learn how to create plugins →](./plugins.md)

### Error Handling

Handle parsing and validation errors gracefully:

```typescript
import { parse } from 'wiremd';

try {
  const ast = parse(userInput, { validate: true });
} catch (error) {
  console.error('Parse error:', error.message);
  if (error.position) {
    console.error(`At line ${error.position.start.line}`);
  }
}
```

[Read the error handling guide →](./errors.md)

## Next Steps

- **[Parser API Documentation](./parser.md)** - Detailed parser reference
- **[Renderer API Documentation](./renderer.md)** - All rendering options
- **[Type Definitions](./types.md)** - Complete type reference
- **[Plugin API](./plugins.md)** - Create custom renderers
- **[Error Handling](./errors.md)** - Handle errors gracefully
- **[Migration Guides](./migration.md)** - Upgrade between versions

## More Resources

- [Getting Started Guide](../guide/getting-started.md)
- [Syntax Reference](../guide/syntax.md)
- [Examples](../examples/)
- [GitHub Repository](https://github.com/akonan/wiremd)
- [Live Demo](https://github.com/akonan/wiremd)
