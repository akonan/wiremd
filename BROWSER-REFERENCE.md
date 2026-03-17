# wiremd Browser - Quick Reference Card

## 🚀 Get Started in 30 Seconds

```bash
npm run build:browser
# Open: examples/browser-editor.html
# Done! ✨
```

## 📦 Build Commands

```bash
npm run build:browser          # Build once
npm run dev:browser            # Watch mode
npm run build && npm run build:browser  # Build everything
```

## 💻 Simple Usage

```html
<script type="module">
  import { parse, renderToHTML } from './dist/wiremd.es.js';
  
  const html = renderToHTML(
    parse('# Hello\n[Button]'),
    { style: 'clean' }
  );
</script>
```

## 📚 API Cheat Sheet

```typescript
// Parse markdown → AST
parse(markdown, options?)

// Validate AST
validate(ast)

// Render outputs
renderToHTML(ast, options?)
renderToJSON(ast, options?)
renderToReact(ast, options?) 
renderToTailwind(ast, options?)
```

## 🎨 Style Options

```typescript
renderToHTML(ast, {
  style: 'sketch',      // Hand-drawn (default)
  // 'clean', 'wireframe', 'material', 'tailwind', 'brutal', 'none'
  
  inlineStyles: true,   // Include CSS
  pretty: true,         // Pretty print
  classPrefix: 'wmd-'   // CSS prefix
})
```

## 📁 Output Files

```
dist/
├── wiremd.es.js       ← Use this (recommended)
├── wiremd.umd.js      ← Or this (compatibility)
└── browser.d.ts       ← TypeScript types
```

## 🧪 Test It

```bash
npm run build:browser
# Open: examples/browser-test.html
# All tests should pass ✅
```

## 📖 Documentation

| File | Purpose |
|------|---------|
| **BROWSER-START-HERE.md** | This guide |
| **BROWSER-QUICK-START.md** | 5-min setup |
| **BROWSER-USAGE.md** | Full API docs |
| **ARCHITECTURE.md** | How it works |

## 🎯 Common Tasks

### Real-time Preview

```html
<textarea id="md"></textarea>
<div id="out"></div>

<script type="module">
  import { parse, renderToHTML } from './dist/wiremd.es.js';
  
  document.getElementById('md').oninput = (e) => {
    const html = renderToHTML(parse(e.target.value));
    document.getElementById('out').innerHTML = html;
  };
</script>
```

### Copy to Clipboard

```javascript
navigator.clipboard.writeText(html);
```

### Style Switcher

```javascript
const style = document.getElementById('style').value;
const html = renderToHTML(ast, { style });
```

### JSON Export

```javascript
const json = renderToJSON(ast);
const text = JSON.stringify(JSON.parse(json), null, 2);
```

### React Export

```javascript
const jsx = renderToReact(ast);
console.log(jsx); // React component code
```

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Not defined | Run `npm run build:browser` |
| Import error | Use `type="module"` on script |
| CSS missing | Add `inlineStyles: true` |
| Build fails | Run `npm run clean` then rebuild |

## 📊 Browser Support

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  

## 💾 File Sizes (gzipped)

- `wiremd.es.js`: ~150KB
- `wiremd.umd.js`: ~150KB

Includes all dependencies (remark, unified, etc.)

## 🎉 Ready?

```bash
npm run build:browser
# Then open examples/browser-editor.html
```

---

Need more? See **[BROWSER-START-HERE.md](BROWSER-START-HERE.md)**
