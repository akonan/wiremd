# Renderer APIs

wiremd provides multiple rendering targets for converting ASTs into usable output formats.

## Overview

Available renderers:

- **renderToHTML()** - Generate standalone HTML with styles
- **renderToJSON()** - Export AST as JSON
- **renderToReact()** - Generate React/JSX components
- **renderToTailwind()** - Generate HTML with Tailwind CSS classes
- **render()** - Universal renderer with format option

## renderToHTML()

Render wiremd AST to HTML with embedded styles.

### Signature

```typescript
function renderToHTML(ast: DocumentNode, options?: RenderOptions): string
```

### Parameters

#### `ast: DocumentNode`

The wiremd AST from `parse()`.

#### `options?: RenderOptions`

```typescript
interface RenderOptions {
  // Visual style (default: 'sketch')
  style?: 'sketch' | 'clean' | 'wireframe' | 'material' | 'tailwind' | 'brutal' | 'none';

  // Inline styles in HTML (default: true)
  inlineStyles?: boolean;

  // Pretty-print output (default: true)
  pretty?: boolean;

  // CSS class prefix (default: 'wmd-')
  classPrefix?: string;
}
```

### Return Value

Returns a complete HTML document string with `<!DOCTYPE html>` and embedded styles.

### Examples

#### Basic Usage

```typescript
import { parse, renderToHTML } from 'wiremd';

const ast = parse(`
## Contact Form

Name
[_____________________________]

Email
[_____________________________]{type:email}

[Submit]{.primary} [Cancel]
`);

const html = renderToHTML(ast);
// Returns complete HTML document with sketch style
```

#### Different Styles

wiremd supports multiple visual styles:

```typescript
import { parse, renderToHTML } from 'wiremd';

const ast = parse(`## Dashboard\n[Login]`);

// Balsamiq-style hand-drawn wireframe
const sketch = renderToHTML(ast, { style: 'sketch' });

// Clean, modern design
const clean = renderToHTML(ast, { style: 'clean' });

// Simple black-and-white wireframe
const wireframe = renderToHTML(ast, { style: 'wireframe' });

// Material Design style
const material = renderToHTML(ast, { style: 'material' });

// Brutalist style
const brutal = renderToHTML(ast, { style: 'brutal' });

// No styles, semantic HTML only
const none = renderToHTML(ast, { style: 'none' });
```

#### Custom Class Prefix

```typescript
import { parse, renderToHTML } from 'wiremd';

const ast = parse(`## Form\n[Button]`);

// Use custom class prefix for CSS isolation
const html = renderToHTML(ast, {
  classPrefix: 'my-app-',
  style: 'clean'
});

// Generated classes: my-app-root, my-app-button, etc.
```

#### Minified Output

```typescript
import { parse, renderToHTML } from 'wiremd';

const ast = parse(`## Title\n[Button]`);

// Minified HTML (no whitespace)
const html = renderToHTML(ast, {
  pretty: false,
  style: 'sketch'
});

// Perfect for production builds
```

#### External Styles

```typescript
import { parse, renderToHTML } from 'wiremd';
import { writeFileSync } from 'fs';

const ast = parse(`## Dashboard\n[Button]`);

// Generate HTML without inline styles
const html = renderToHTML(ast, {
  inlineStyles: false,
  classPrefix: 'wmd-'
});

// You'll need to include wiremd.css separately
// <link rel="stylesheet" href="wiremd.css">
```

#### Batch Processing

```typescript
import { parse, renderToHTML } from 'wiremd';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const inputDir = './wireframes';
const outputDir = './output';

const files = readdirSync(inputDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const markdown = readFileSync(join(inputDir, file), 'utf-8');
  const ast = parse(markdown);
  const html = renderToHTML(ast, { style: 'clean' });

  const outputFile = file.replace('.md', '.html');
  writeFileSync(join(outputDir, outputFile), html);

  console.log(`Rendered ${file} -> ${outputFile}`);
});
```

## renderToJSON()

Export wiremd AST as JSON string.

### Signature

```typescript
function renderToJSON(ast: DocumentNode, options?: RenderOptions): string
```

### Parameters

#### `ast: DocumentNode`

The wiremd AST from `parse()`.

#### `options?: RenderOptions`

```typescript
interface RenderOptions {
  // Pretty-print JSON (default: true)
  pretty?: boolean;
}
```

### Return Value

Returns a JSON string representation of the AST.

### Examples

#### Basic Usage

```typescript
import { parse, renderToJSON } from 'wiremd';

const ast = parse(`## Login\n[Button]`);

const json = renderToJSON(ast);
console.log(json);
```

#### Pretty vs Minified

```typescript
import { parse, renderToJSON } from 'wiremd';

const ast = parse(`## Form\n[Submit]`);

// Pretty-printed JSON (default)
const pretty = renderToJSON(ast, { pretty: true });
/*
{
  "type": "document",
  "version": "0.1",
  "meta": {},
  "children": [...]
}
*/

// Minified JSON
const minified = renderToJSON(ast, { pretty: false });
// {"type":"document","version":"0.1","meta":{},"children":[...]}
```

#### Save to File

```typescript
import { parse, renderToJSON } from 'wiremd';
import { writeFileSync } from 'fs';

const ast = parse(`
## Dashboard
[Search...]
[Button]
`);

const json = renderToJSON(ast, { pretty: true });
writeFileSync('wireframe.json', json);
```

#### API Response

```typescript
import { parse, renderToJSON } from 'wiremd';
import express from 'express';

const app = express();

app.post('/parse', express.text(), (req, res) => {
  try {
    const ast = parse(req.body);
    const json = renderToJSON(ast);

    res.type('application/json').send(json);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000);
```

## renderToReact()

Generate React/JSX components from wiremd AST.

### Signature

```typescript
function renderToReact(
  ast: DocumentNode,
  options?: RenderOptions & {
    typescript?: boolean;
    componentName?: string;
  }
): string
```

### Parameters

#### `ast: DocumentNode`

The wiremd AST from `parse()`.

#### `options?: RenderOptions`

```typescript
interface RenderOptions {
  // CSS class prefix (default: 'wmd-')
  classPrefix?: string;

  // Generate TypeScript (default: true)
  typescript?: boolean;

  // Component name (default: 'WiremdComponent')
  componentName?: string;
}
```

### Return Value

Returns a string containing a complete React component definition.

### Examples

#### Basic Usage

```typescript
import { parse, renderToReact } from 'wiremd';

const ast = parse(`
## Login Form

Username
[_____________________________]

Password
[_____________________________]{type:password}

[Login]{.primary}
`);

const component = renderToReact(ast);
console.log(component);
/*
import React from 'react';

export const WiremdComponent: React.FC = () => {
  return (
    <div className="wmd-root">
      <h2 className="wmd-heading">Login Form</h2>
      ...
    </div>
  );
};
*/
```

#### TypeScript vs JavaScript

```typescript
import { parse, renderToReact } from 'wiremd';

const ast = parse(`## Form\n[Button]`);

// TypeScript component (default)
const tsComponent = renderToReact(ast, {
  typescript: true,
  componentName: 'LoginForm'
});

// JavaScript component
const jsComponent = renderToReact(ast, {
  typescript: false,
  componentName: 'LoginForm'
});
```

#### Custom Component Name

```typescript
import { parse, renderToReact } from 'wiremd';
import { writeFileSync } from 'fs';

const ast = parse(`
## Contact Form
[Submit]
`);

const component = renderToReact(ast, {
  componentName: 'ContactForm',
  typescript: true
});

writeFileSync('ContactForm.tsx', component);
```

#### Multiple Components

```typescript
import { parse, renderToReact } from 'wiremd';
import { writeFileSync } from 'fs';

const wireframes = [
  { name: 'Header', md: `## Navigation\n[Home] [About] [Contact]` },
  { name: 'Footer', md: `## Footer\n© 2024 Company` },
  { name: 'Sidebar', md: `## Menu\n[Dashboard]\n[Settings]` }
];

wireframes.forEach(({ name, md }) => {
  const ast = parse(md);
  const component = renderToReact(ast, {
    componentName: name,
    typescript: true
  });

  writeFileSync(`components/${name}.tsx`, component);
  console.log(`Generated ${name}.tsx`);
});
```

#### Integration with Build Pipeline

```typescript
import { parse, renderToReact } from 'wiremd';
import { readFileSync, writeFileSync } from 'fs';

// Read wireframe
const markdown = readFileSync('src/wireframes/LoginForm.md', 'utf-8');

// Parse and generate React component
const ast = parse(markdown);
const component = renderToReact(ast, {
  componentName: 'LoginForm',
  typescript: true,
  classPrefix: 'login-'
});

// Write to src directory
writeFileSync('src/components/LoginForm.tsx', component);
```

## renderToTailwind()

Generate HTML with Tailwind CSS utility classes.

### Signature

```typescript
function renderToTailwind(ast: DocumentNode, options?: RenderOptions): string
```

### Parameters

#### `ast: DocumentNode`

The wiremd AST from `parse()`.

#### `options?: RenderOptions`

```typescript
interface RenderOptions {
  // Pretty-print output (default: true)
  pretty?: boolean;
}
```

### Return Value

Returns a complete HTML document with Tailwind CSS classes and CDN link.

### Examples

#### Basic Usage

```typescript
import { parse, renderToTailwind } from 'wiremd';

const ast = parse(`
## Dashboard

> Card
### Analytics
Page views: 1,234
[View Details]
`);

const html = renderToTailwind(ast);
// Returns HTML with Tailwind classes like:
// <div class="bg-white rounded-lg shadow-md p-6">...</div>
```

#### Complete Example

```typescript
import { parse, renderToTailwind } from 'wiremd';
import { writeFileSync } from 'fs';

const ast = parse(`
## E-commerce Product Page

> Grid(2)
> Left Column
![Product Image](placeholder)

> Right Column
### Premium Widget
$99.99

Color: [Red] [Blue] [Green]

[Add to Cart]{.primary}
[Add to Wishlist]
`);

const html = renderToTailwind(ast, { pretty: true });
writeFileSync('product-page.html', html);
```

#### Minified for Production

```typescript
import { parse, renderToTailwind } from 'wiremd';

const ast = parse(`## Form\n[Submit]`);

const html = renderToTailwind(ast, {
  pretty: false
});

// Minified output for production
```

#### Custom Tailwind Configuration

The generated HTML includes the Tailwind CDN by default. For custom configurations:

```typescript
import { parse, renderToTailwind } from 'wiremd';
import { readFileSync, writeFileSync } from 'fs';

const ast = parse(`## Dashboard\n[Button]`);
let html = renderToTailwind(ast);

// Replace CDN with custom build
html = html.replace(
  '<script src="https://cdn.tailwindcss.com"></script>',
  '<link href="/css/tailwind.css" rel="stylesheet">'
);

writeFileSync('output.html', html);
```

## render()

Universal renderer that selects the appropriate rendering function based on format option.

### Signature

```typescript
function render(ast: DocumentNode, options?: RenderOptions): string
```

### Parameters

#### `ast: DocumentNode`

The wiremd AST from `parse()`.

#### `options?: RenderOptions`

```typescript
interface RenderOptions {
  // Output format (default: 'html')
  format?: 'html' | 'json' | 'react' | 'tailwind';

  // All other options from specific renderers
  style?: string;
  pretty?: boolean;
  // ... etc
}
```

### Return Value

Returns the rendered output in the specified format.

### Examples

#### Format Selection

```typescript
import { parse, render } from 'wiremd';

const ast = parse(`## Form\n[Submit]`);

// HTML output
const html = render(ast, { format: 'html', style: 'sketch' });

// JSON output
const json = render(ast, { format: 'json', pretty: true });

// React component
const react = render(ast, { format: 'react', typescript: true });

// Tailwind HTML
const tailwind = render(ast, { format: 'tailwind' });
```

#### Dynamic Format Selection

```typescript
import { parse, render } from 'wiremd';

function renderWireframe(markdown: string, format: string): string {
  const ast = parse(markdown);

  switch (format) {
    case 'html':
      return render(ast, { format: 'html', style: 'clean' });
    case 'json':
      return render(ast, { format: 'json', pretty: true });
    case 'react':
      return render(ast, { format: 'react', typescript: true });
    case 'tailwind':
      return render(ast, { format: 'tailwind' });
    default:
      return render(ast); // defaults to HTML
  }
}

const output = renderWireframe('## Title\n[Button]', 'react');
```

#### CLI-style Usage

```typescript
import { parse, render } from 'wiremd';
import { readFileSync, writeFileSync } from 'fs';

interface CLIOptions {
  input: string;
  output: string;
  format: 'html' | 'json' | 'react' | 'tailwind';
  style?: string;
}

function processWireframe(options: CLIOptions): void {
  const markdown = readFileSync(options.input, 'utf-8');
  const ast = parse(markdown);

  const output = render(ast, {
    format: options.format,
    style: options.style || 'sketch',
    pretty: true
  });

  writeFileSync(options.output, output);
  console.log(`Rendered ${options.input} -> ${options.output} (${options.format})`);
}

processWireframe({
  input: 'wireframe.md',
  output: 'output.html',
  format: 'html',
  style: 'clean'
});
```

## Style Options

### Available Styles

wiremd includes several built-in visual styles:

| Style | Description | Use Case |
|-------|-------------|----------|
| `sketch` | Hand-drawn, Balsamiq-style | Low-fidelity wireframes, brainstorming |
| `clean` | Modern, minimal design | High-fidelity mockups, presentations |
| `wireframe` | Black and white boxes | Traditional wireframes, developer handoff |
| `material` | Material Design inspired | Android apps, Google-style designs |
| `brutal` | Brutalist style | Bold, statement designs |
| `tailwind` | Tailwind CSS styling | Rapid prototyping with Tailwind |
| `none` | No styling, semantic HTML | Custom styling, CSS frameworks |

### Style Examples

```typescript
import { parse, renderToHTML } from 'wiremd';

const md = `
## Login Page

Username
[_____________________________]

Password
[_____________________________]{type:password}

[Login]{.primary} [Forgot Password?]
`;

const ast = parse(md);

// Try different styles
const styles = ['sketch', 'clean', 'wireframe', 'material', 'brutal', 'none'];

styles.forEach(style => {
  const html = renderToHTML(ast, { style });
  writeFileSync(`output-${style}.html`, html);
});
```

## Performance Tips

### Reuse Parsed ASTs

```typescript
import { parse, renderToHTML, renderToJSON, renderToReact } from 'wiremd';

const markdown = `## Dashboard\n[Button]`;

// Parse once
const ast = parse(markdown);

// Render multiple times
const html = renderToHTML(ast, { style: 'sketch' });
const json = renderToJSON(ast);
const react = renderToReact(ast);
```

### Streaming Large Documents

For very large documents, consider rendering in chunks:

```typescript
import { parse, renderToHTML } from 'wiremd';

function* renderChunks(markdown: string, chunkSize: number = 1000) {
  const sections = markdown.split(/(?=^## )/gm);

  for (const section of sections) {
    const ast = parse(section);
    yield renderToHTML(ast);
  }
}

// Use the generator
for (const chunk of renderChunks(largeMarkdown)) {
  // Process or stream each chunk
  process.stdout.write(chunk);
}
```

## See Also

- [Parser API](/api/parser) - Parsing markdown to AST
- [Type Definitions](/api/types) - Complete type reference
- [Plugin API](/api/plugins) - Creating custom renderers
- [Error Handling](/api/errors) - Error handling guide
