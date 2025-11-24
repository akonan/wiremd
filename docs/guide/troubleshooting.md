# Troubleshooting

Common issues and solutions when working with wiremd.

## Installation Issues

### npm install fails

**Problem**: Installation fails with permission errors

```bash
npm ERR! Error: EACCES: permission denied
```

**Solution**: Use one of these approaches:

```bash
# Option 1: Use npx (recommended)
npx wiremd input.md

# Option 2: Install globally with sudo (not recommended)
sudo npm install -g wiremd

# Option 3: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g wiremd
```

### Module not found errors

**Problem**: Cannot find module 'wiremd'

```bash
Error: Cannot find module 'wiremd'
```

**Solution**: Ensure wiremd is installed in your project:

```bash
# Check if installed
npm list wiremd

# Install if missing
npm install wiremd

# Or install globally for CLI usage
npm install -g wiremd
```

## Parsing Issues

### Syntax errors

**Problem**: Unexpected parsing results or errors

```typescript
const ast = parse('[Button');  // Missing closing bracket
```

**Solution**: Check your markdown syntax:

```typescript
// Use validate option to catch errors
try {
  const ast = parse(markdown, { validate: true });
} catch (error) {
  console.error('Parse error:', error.message);
  if (error.position) {
    console.error(`At line ${error.position.start.line}, column ${error.position.start.column}`);
  }
}
```

### Grid layouts not working

**Problem**: Grid syntax doesn't create columns

```markdown
## Features {.grid-3}
Content here...
```

**Solution**: Ensure proper structure with level-3 headings:

```markdown
## Features {.grid-3}

### Column 1
Content for column 1

### Column 2
Content for column 2

### Column 3
Content for column 3
```

### Buttons not rendering

**Problem**: Buttons appear as plain text

```markdown
[Button]  <!-- Might not work if spacing is wrong -->
```

**Solution**: Check button syntax:

```markdown
## Correct button syntax
[Submit]           <!-- ✓ Basic button -->
[Submit]{.primary} <!-- ✓ Primary button -->
[Submit]*          <!-- ✓ Primary button (shorthand) -->

## Incorrect syntax
[ Submit ]         <!-- ✗ Extra spaces -->
[Submit           <!-- ✗ Missing closing bracket -->
Submit]            <!-- ✗ Missing opening bracket -->
```

### Input fields not recognized

**Problem**: Input syntax doesn't create form fields

**Solution**: Use the correct underscore pattern:

```markdown
## Correct input syntax
[_____________________________]                    <!-- ✓ Text input -->
[_____________________________]{type:email}        <!-- ✓ Email input -->
[_____________________________]{required}          <!-- ✓ Required input -->

## Incorrect syntax
[____]                                             <!-- ✗ Too short -->
[                             ]                    <!-- ✗ Spaces instead of underscores -->
[_]                                                <!-- ✗ Only one underscore -->
```

## Rendering Issues

### HTML output has no styling

**Problem**: Generated HTML is unstyled

```typescript
const html = renderToHTML(ast, { style: 'none' });
```

**Solution**: Specify a style or check `inlineStyles` option:

```typescript
// Use a built-in style
const html = renderToHTML(ast, { style: 'sketch' });

// Or ensure inline styles are enabled (default)
const html = renderToHTML(ast, {
  style: 'clean',
  inlineStyles: true  // default: true
});
```

### React components not working

**Problem**: Generated React code has errors

**Solution**: Check your import statements and component usage:

```typescript
// Generate TypeScript component
const component = renderToReact(ast, {
  typescript: true,
  componentName: 'MyWireframe'
});

// Save as .tsx file
writeFileSync('MyWireframe.tsx', component);

// Import and use in your React app
import { MyWireframe } from './MyWireframe';
```

### Tailwind classes not applying

**Problem**: Tailwind output doesn't show styles

**Solution**: Ensure Tailwind CSS is included:

```html
<!-- The renderer includes Tailwind CDN by default -->
<!-- But for custom builds, configure Tailwind properly -->

<!-- tailwind.config.js -->
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './wireframes/**/*.html'
  ]
};
```

### Memory issues with large documents

**Problem**: Out of memory errors with large wireframes

```bash
FATAL ERROR: Reached heap limit Allocation failed
```

**Solution**: Process in chunks or increase Node.js memory:

```bash
# Increase Node.js heap size
node --max-old-space-size=4096 your-script.js

# Or process in sections
const sections = markdown.split(/(?=^## )/gm);
sections.forEach(section => {
  const ast = parse(section);
  const html = renderToHTML(ast);
  // Process each section
});
```

## TypeScript Issues

### Type errors

**Problem**: TypeScript can't find types

```typescript
import { parse } from 'wiremd';  // Cannot find module or its declarations
```

**Solution**: Check your TypeScript configuration:

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
```

### Type imports

**Problem**: Can't import types

**Solution**: Use `type` imports:

```typescript
// Correct
import type { DocumentNode, WiremdNode, ParseOptions } from 'wiremd';
import { parse, renderToHTML } from 'wiremd';

// Also correct
import { parse, renderToHTML, type DocumentNode } from 'wiremd';
```

## CLI Issues

### Command not found

**Problem**: `wiremd` command not available

```bash
bash: wiremd: command not found
```

**Solution**: Install globally or use npx:

```bash
# Option 1: Install globally
npm install -g wiremd
wiremd input.md

# Option 2: Use npx
npx wiremd input.md

# Option 3: Use local installation
npm install wiremd
npx wiremd input.md
```

### Watch mode not working

**Problem**: Files not being watched or auto-reloaded

```bash
wiremd input.md --watch
# Changes not detected
```

**Solution**: Check file patterns and permissions:

```bash
# Use explicit patterns
wiremd input.md --watch --watch-pattern "**/*.md"

# Check file permissions
ls -la input.md

# Try with specific ignore patterns
wiremd input.md --watch --ignore-pattern "node_modules/**"
```

### Live server won't start

**Problem**: Dev server fails to start

```bash
wiremd input.md --serve 3000
# Error: EADDRINUSE
```

**Solution**: Port is already in use, try a different port:

```bash
# Try different port
wiremd input.md --serve 3001

# Or find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

## Framework Integration Issues

### Next.js: Module not found

**Problem**: Can't import wiremd in Next.js

```bash
Module not found: Can't resolve 'fs'
```

**Solution**: wiremd uses Node.js APIs, use it in server-side code only:

```typescript
// ✓ Works: Server Component (Next.js 13+)
import { parse, renderToHTML } from 'wiremd';

export default async function Page() {
  const ast = parse('## Form\n[Button]');
  const html = renderToHTML(ast);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// ✗ Doesn't work: Client Component
'use client';
import { parse } from 'wiremd';  // Will fail in browser
```

### Vite: Dependency optimization failed

**Problem**: Vite fails to optimize wiremd

```bash
Error: Failed to resolve entry for package "wiremd"
```

**Solution**: Add to `optimizeDeps`:

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['wiremd']
  }
});
```

### Webpack: Can't resolve 'fs'

**Problem**: Webpack can't bundle wiremd for browser

**Solution**: Configure Webpack fallbacks:

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    fallback: {
      fs: false,
      path: false,
      stream: false
    }
  }
};
```

## Validation Errors

### Understanding validation errors

**Problem**: Validation fails but unsure why

```typescript
const errors = validate(ast);
// [{ message: 'Invalid node type', code: 'UNKNOWN_NODE_TYPE' }]
```

**Solution**: Check error details:

```typescript
import { parse, validate } from 'wiremd';

const ast = parse(markdown);
const errors = validate(ast);

if (errors.length > 0) {
  errors.forEach(error => {
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Path:', error.path?.join(' > '));

    // Common error codes:
    // - INVALID_ROOT_TYPE: Document root is invalid
    // - MISSING_META: Missing document metadata
    // - INVALID_CHILDREN: Children array is malformed
    // - UNKNOWN_NODE_TYPE: Unrecognized node type
    // - INVALID_NESTING: Invalid component nesting
  });
}
```

### Fixing validation errors

Common validation errors and fixes:

```typescript
// Error: INVALID_BUTTON_VARIANT
// Fix: Use valid button variant
[Submit]{.primary}   // ✓ Valid
[Submit]{.invalid}   // ✗ Invalid variant

// Error: INVALID_INPUT_TYPE
// Fix: Use valid input type
[___]{type:email}    // ✓ Valid
[___]{type:invalid}  // ✗ Invalid type

// Error: INVALID_HEADING_LEVEL
// Fix: Use heading levels 1-6
# Heading 1           // ✓ Valid
####### Heading 7     // ✗ Invalid level

// Error: INVALID_GRID_COLUMNS
// Fix: Use 1 or more columns
{.grid-3}            // ✓ Valid
{.grid-0}            // ✗ Invalid
```

## Performance Issues

### Slow parsing

**Problem**: Large documents take too long to parse

**Solution**: Use caching and chunking:

```typescript
// Cache parsed ASTs
const cache = new Map<string, DocumentNode>();

function parseWithCache(markdown: string): DocumentNode {
  if (!cache.has(markdown)) {
    cache.set(markdown, parse(markdown, {
      position: false,  // Skip position tracking
      validate: false   // Skip validation in production
    }));
  }
  return cache.get(markdown)!;
}

// Or split into sections
function parseLarge(markdown: string): DocumentNode[] {
  return markdown
    .split(/(?=^## )/gm)
    .filter(s => s.trim())
    .map(section => parse(section));
}
```

### Slow rendering

**Problem**: HTML rendering is slow

**Solution**: Optimize render options:

```typescript
// For production
const html = renderToHTML(ast, {
  pretty: false,        // Disable pretty-print
  inlineStyles: true    // Keep styles inline (faster than external)
});

// Reuse parsed AST for multiple formats
const ast = parse(markdown);
const html = renderToHTML(ast);
const json = renderToJSON(ast);
const react = renderToReact(ast);
```

## Browser Compatibility

### Browser bundle issues

**Problem**: Can't use wiremd in browser

**Solution**: wiremd is designed for Node.js. For browser usage:

1. **Pre-render on server**: Parse/render server-side, send HTML to client
2. **Use API endpoint**: Create API for parsing/rendering
3. **Bundle with Webpack/Vite**: Let bundler handle Node.js dependencies

```typescript
// Example: Server-side rendering
// server.ts
app.get('/wireframe/:id', (req, res) => {
  const markdown = getWireframe(req.params.id);
  const ast = parse(markdown);
  const html = renderToHTML(ast);
  res.send(html);
});
```

## Getting Help

If you're still experiencing issues:

1. **Check the documentation**: [API Reference](../api/), [Syntax Guide](./syntax.md)
2. **Search existing issues**: [GitHub Issues](https://github.com/akonan/wiremd/issues)
3. **Create a new issue**: Include:
   - wiremd version (`npm list wiremd`)
   - Node.js version (`node --version`)
   - Minimal reproduction example
   - Error messages and stack traces
4. **Join discussions**: [GitHub Discussions](https://github.com/akonan/wiremd/discussions)

## Debug Mode

Enable verbose logging for debugging:

```typescript
// Set environment variable
process.env.WIREMD_DEBUG = 'true';

// Or use position tracking
const ast = parse(markdown, {
  position: true  // Track source positions
});

// Each node will have position information
console.log(ast.children[0].position);
// { start: { line: 1, column: 1 }, end: { line: 1, column: 10 } }
```

## Common Mistakes

### 1. Forgetting to parse before rendering

```typescript
// ✗ Wrong
const html = renderToHTML(markdown);  // markdown is string, not AST

// ✓ Correct
const ast = parse(markdown);
const html = renderToHTML(ast);
```

### 2. Using browser APIs in Node.js

```typescript
// ✗ Wrong (in Node.js)
const markdown = document.getElementById('input').value;

// ✓ Correct
import { readFileSync } from 'fs';
const markdown = readFileSync('input.md', 'utf-8');
```

### 3. Not handling errors

```typescript
// ✗ Wrong
const ast = parse(userInput);  // What if parsing fails?

// ✓ Correct
try {
  const ast = parse(userInput, { validate: true });
  const html = renderToHTML(ast);
} catch (error) {
  console.error('Failed to render:', error.message);
}
```

### 4. Modifying AST incorrectly

```typescript
// ✗ Wrong
ast.children.push('new item');  // Wrong type

// ✓ Correct
ast.children.push({
  type: 'button',
  content: 'New Button',
  props: {},
  children: []
});
```

## See Also

- [Getting Started](/guide/getting-started) - Basic usage
- [API Reference](../api/) - Complete API docs
- [Framework Integrations](/guide/integrations) - Framework-specific guides
- [GitHub Issues](https://github.com/akonan/wiremd/issues) - Report bugs
