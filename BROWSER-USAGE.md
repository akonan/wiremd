# Using wiremd in the Browser

wiremd can now be used entirely in the browser without any server or Node.js dependencies!

## Quick Start

### 1. Build for Browser

```bash
npm run build:browser
```

This creates two browser-compatible bundles in the `dist/` directory:
- **`wiremd.umd.js`** - UMD bundle (works with `<script>` tags)
- **`wiremd.es.js`** - ES module (works with `import` statements)

### 2. Use in HTML

#### Option A: ES Module (Recommended)

```html
<!DOCTYPE html>
<html>
<head>
  <title>wiremd</title>
</head>
<body>
  <textarea id="markdown" placeholder="Enter wiremd markdown..."></textarea>
  <div id="output"></div>

  <script type="module">
    import { parse, renderToHTML } from './wiremd.es.js';

    const markdown = `
# Login Form

Username
[__________________]

Password
[__________________]

[Login]{.primary}
`;

    const ast = parse(markdown);
    const html = renderToHTML(ast);
    document.getElementById('output').innerHTML = html;
  </script>
</body>
</html>
```

#### Option B: UMD Bundle (Works without build step)

```html
<!DOCTYPE html>
<html>
<head>
  <title>wiremd</title>
</head>
<body>
  <div id="output"></div>

  <script src="./wiremd.umd.js"></script>
  <script>
    const { parse, renderToHTML } = wiremd;

    const markdown = `# Hello World\n[Button]`;
    const ast = parse(markdown);
    const html = renderToHTML(ast);
    document.getElementById('output').innerHTML = html;
  </script>
</body>
</html>
```

### 3. Complete Interactive Example

See [examples/browser-editor.html](./examples/browser-editor.html) for a full-featured browser editor with:
- Real-time preview
- Multiple output formats (HTML, JSON, React/JSX)
- Style selector
- Template library
- Copy to clipboard functionality

Just open it in your browser after building:

```bash
npm run build:browser
# Then open examples/browser-editor.html in your browser
```

## API Reference

### `parse(markdown, options?)`

Parse markdown with wiremd syntax into an AST.

```typescript
import { parse } from 'wiremd';

const ast = parse(`
## Form

Name
[_____]

[Submit]{.primary}
`);
```

**Options:**
- `strict?: boolean` - Enable strict parsing mode
- `validateOnParse?: boolean` - Validate AST during parsing

**Returns:** `DocumentNode`

### `renderToHTML(ast, options?)`

Render AST to HTML string.

```typescript
const html = renderToHTML(ast, {
  style: 'clean',        // 'sketch', 'clean', 'wireframe', 'none', 'tailwind', 'material', 'brutal'
  inlineStyles: true,    // Include CSS styles
  pretty: true,          // Pretty print
  classPrefix: 'wmd-'    // CSS class prefix
});
```

**Returns:** `string` - Complete HTML document

### `renderToJSON(ast, options?)`

Render AST to JSON representation.

```typescript
const json = renderToJSON(ast, { pretty: true });
```

**Returns:** `string` - JSON string

### `renderToReact(ast, options?)`

Render AST to React/JSX component code.

```typescript
const jsxCode = renderToReact(ast);
```

**Returns:** `string` - React JSX code

### `renderToTailwind(ast, options?)`

Render AST using Tailwind CSS.

```typescript
const html = renderToTailwind(ast);
```

**Returns:** `string` - HTML with Tailwind classes

### `validate(ast)`

Validate a wiremd AST.

```typescript
import { validate } from 'wiremd';

const errors = validate(ast);
if (errors.length > 0) {
  console.error('Validation errors:', errors);
}
```

**Returns:** `ValidationError[]`

## Examples

### Simple Button

```markdown
[Click Me]{.primary}
```

### Form

```markdown
## Login

Username
[_____________________]

Password
[_____________________]

☑ Remember me

[Sign In]{.primary} [Forgot?]{.link}
```

### Card Layout

```markdown
## Product

[Image placeholder]

Product Name
$99.99

⭐⭐⭐⭐⭐ (124 reviews)

Lorem ipsum dolor sit amet

[Buy Now]{.primary} [Add to Cart]
```

### List

```markdown
## TODO

☑ Complete wiremd browser support
☐ Add more templates
☐ Create documentation
```

## Styles Available

- **sketch** - Sketch-inspired hand-drawn look (default)
- **clean** - Modern minimal design
- **wireframe** - Traditional grayscale
- **none** - Unstyled semantic HTML
- **tailwind** - Tailwind CSS styling
- **material** - Material Design
- **brutal** - Bold, playful style

## Browser Compatibility

wiremd works in all modern browsers that support:
- ES2020+
- ES modules (`type="module"`)

Tested and working in:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## CDN Usage

You can host the browser builds on a CDN:

```html
<script src="https://cdn.example.com/wiremd.umd.js"></script>
<script>
  const { parse, renderToHTML } = wiremd;
  // Use wiremd...
</script>
```

## Development

For development, use the dev server:

```bash
npm run dev
```

This watches for changes and rebuilds automatically.

## TypeScript Support

Full TypeScript support is included. The browser build includes `.d.ts` files:

```typescript
import { parse, renderToHTML, DocumentNode, RenderOptions } from 'wiremd';

const markdown: string = '...';
const ast: DocumentNode = parse(markdown);
const html: string = renderToHTML(ast, { style: 'clean' });
```

## Limitations

When using in the browser, you cannot:
- Watch files for changes (use `npm run build:browser` to rebuild)
- Use the CLI features
- Access the file system

Everything else works exactly the same as the Node.js version.

## Migration from CLI

If you've been using the CLI version, here's how to migrate to browser:

### Before (CLI)
```bash
wiremd input.md --style clean --watch
```

### After (Browser)
1. Build the library: `npm run build:browser`
2. Use the [browser editor](./examples/browser-editor.html) or embed in your app
3. Changes are rendered in real-time

## Troubleshooting

### "wiremd is not defined"
Make sure you've built the library first:
```bash
npm run build:browser
```

### Import errors
If using ES modules, make sure your file is served with `type="module"`:
```html
<script type="module" src="./app.js"></script>
```

### Build size
The UMD bundle includes all dependencies. Gzip'd size is typically ~150KB.

To reduce size, use the ES module version with a bundler like Vite or webpack that can tree-shake unused code.

## Contributing

Found a bug or want to improve browser support? [Open an issue or PR](https://github.com/akonan/wiremd/issues)!

---

Enjoy creating wireframes in your browser! 🎨
