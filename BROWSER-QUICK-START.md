# wiremd Browser - Quick Start Guide

Get wiremd working in your browser in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Build for Browser

```bash
npm run build:browser
```

This creates two files in the `dist/` folder:
- `wiremd.es.js` - Modern ES module (recommended)
- `wiremd.umd.js` - Universal Module Definition (for older setups)

## Step 3: Choose Your Setup

### Option A: Open the Interactive Editor (Easiest)

```bash
# Build the library
npm run build:browser

# Then just open in your browser:
examples/browser-editor.html
```

The full-featured editor includes:
- ✅ Live markdown-to-wireframe preview
- ✅ Multiple output formats (HTML, JSON, React/JSX)
- ✅ Style selector (7 different styles)
- ✅ Copy to clipboard
- ✅ Template library

### Option B: Create Your Own HTML File

Create `my-app.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Wireframes</title>
</head>
<body>
  <iframe id="preview" style="width:100%;height:500px;border:1px solid #ddd;"></iframe>

  <script type="module">
    import { parse, renderToHTML } from './dist/wiremd.es.js';

    const markdown = `
# Contact Form

Email
[_____________________]

[Subscribe]{.primary}
`;

    const ast = parse(markdown);
    const html = renderToHTML(ast, { style: 'clean', inlineStyles: true });
    document.getElementById('preview').srcdoc = html;
  </script>
</body>
</html>
```

Why iframe? `renderToHTML` returns a full HTML document (`<html><head><style>...`).
Using `srcdoc` preserves generated CSS and body classes so themes render correctly.

### Option C: Use with a Bundler

If you're using Vite, webpack, or similar:

```typescript
import { parse, renderToHTML } from 'wiremd';

const ast = parse('# Hello\n[Button]{.primary}');
const html = renderToHTML(ast, { style: 'clean' });
```

## Step 4: Change Styles (Optional)

wiremd comes with 7 built-in styles:

```typescript
const html = renderToHTML(ast, {
  style: 'sketch'      // hand-drawn look (default)
  // or 'clean'        // modern minimal
  // or 'wireframe'    // traditional grayscale
  // or 'tailwind'     // utility-first design
  // or 'material'     // Google Material Design
  // or 'brutal'       // bold, playful
  // or 'none'         // unstyled HTML
});
```

## Step 5: Export Different Formats

wiremd can export to multiple formats:

```typescript
import { 
  parse, 
  renderToHTML, 
  renderToJSON, 
  renderToReact,
  renderToTailwind 
} from 'wiremd';

const ast = parse(markdown);

// HTML
const html = renderToHTML(ast);

// JSON (for data processing)
const json = renderToJSON(ast);

// React/JSX (for React apps)
const jsx = renderToReact(ast);

// Tailwind (for Tailwind styling)
const tailwind = renderToTailwind(ast);
```

## Development Workflow

While developing, use watch mode to automatically rebuild:

```bash
npm run dev:browser
```

This watches for changes and rebuilds the browser bundle automatically.

## Deploying Your App

1. Build the library:
   ```bash
   npm run build:browser
   ```

2. Copy `dist/wiremd.es.js` to your public folder

3. Link it in your HTML:
   ```html
   <script type="module" src="/wiremd.es.js"></script>
   ```

## Common Questions

### Q: Can I use wiremd without building?
A: The editor and examples need the library to be built first. Run `npm run build:browser`.

### Q: What's the difference between `wiremd.es.js` and `wiremd.umd.js`?
A: 
- `wiremd.es.js` - Modern JavaScript (recommended for most apps)
- `wiremd.umd.js` - Works in older browsers and script tags

### Q: How big is the bundle?
A: About 150KB gzipped. The all the markdown parsing dependencies are included.

### Q: Can I use it on a CDN?
A: Yes! You can host `dist/wiremd.umd.js` or `dist/wiremd.es.js` on any CDN and use it directly.

### Q: Does it work offline?
A: Yes! wiremd works completely offline. Everything runs in your browser.

### Q: Can I use it in production?
A: Absolutely! wiremd is MIT licensed and production-ready.

## Next Steps

- 📖 Read [BROWSER-USAGE.md](../BROWSER-USAGE.md) for complete API docs
- 🎨 Try [browser-editor.html](./browser-editor.html) for interactive experimenting
- 📝 Check [browser-examples.html](./browser-examples.html) for code snippets
- 💬 Visit [GitHub](https://github.com/akonan/wiremd) for more help

## Troubleshooting

### "wiremd is not defined"
Make sure you've built first: `npm run build:browser`

### Import errors
Make sure your script tag has `type="module"` when using ES imports

### CSS not showing up
Try adding `inlineStyles: true` to renderToHTML options:
```typescript
renderToHTML(ast, { inlineStyles: true })
```

### Theme looks broken in preview
If you render into a `div` with `innerHTML`, the generated `<style>` and `<body class="...">`
context can be lost. Use an iframe preview instead:
```typescript
const html = renderToHTML(ast, { style: 'clean', inlineStyles: true });
previewFrame.srcdoc = html;
```

---

Enjoy prototyping with wiremd! 🎨
