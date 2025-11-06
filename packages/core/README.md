# markdown-mockup

> Parse markdown-based UI mockup syntax and render to HTML/JSON

**Status:** 🚧 Under Development

The core parsing and rendering library for wiremd. Parse markdown with wireframe syntax into a structured AST, then render to HTML or JSON.

## Installation

```bash
# Not yet published
# npm install markdown-mockup
```

## Usage

```typescript
import { parse } from 'markdown-mockup/parser';
import { renderToHTML } from 'markdown-mockup/renderer';

// Parse markdown with wireframe syntax
const ast = parse(`
  ## Contact Form

  Name
  [_____________________________]{required}

  Email
  [_____________________________]{type:email required}

  [Submit]{.primary}
`);

// Render to HTML
const html = renderToHTML(ast, {
  style: 'sketch',
  inlineStyles: true,
});
```

## Features

### Parser
- Converts markdown + wireframe syntax to AST
- Based on unified/remark for robust markdown parsing
- Detects buttons, inputs, forms, layouts, and more
- Preserves position information for error reporting

### Renderer
- HTML output with multiple visual styles
- JSON output for framework integration
- Customizable class prefixes
- Inline or external CSS

## API

### Parser

```typescript
import { parse } from 'markdown-mockup/parser';

const ast = parse(markdownString, {
  position: true,      // Include position info
  validate: true,      // Validate AST
  strict: false,       // Throw on errors
});
```

### Renderer

```typescript
import { renderToHTML, renderToJSON } from 'markdown-mockup/renderer';

// HTML output
const html = renderToHTML(ast, {
  style: 'sketch',     // 'sketch' | 'clean' | 'wireframe' | 'none'
  inlineStyles: true,  // Include inline styles
  pretty: true,        // Pretty-print HTML
  classPrefix: 'wmd-', // CSS class prefix
});

// JSON output
const json = renderToJSON(ast, {
  pretty: true,        // Pretty-print JSON
});
```

## Syntax Overview

wiremd uses a hybrid approach combining visual patterns with markdown:

### Buttons
```markdown
[Click Me]              # Basic button
[Submit]*               # Primary button
[Cancel]{.secondary}    # Button with class
```

### Inputs
```markdown
[_____________________]              # Text input
[***********************]            # Password input
[Email___]{type:email required}      # Input with attributes
```

### Checkboxes & Radios
```markdown
- [ ] Unchecked
- [x] Checked

- ( ) Unselected
- (•) Selected
```

### Icons
```markdown
:house: :user: :gear:
```

### Containers
```markdown
::: hero
# Welcome
[Get Started]{.primary}
:::
```

### Grids
```markdown
## Features {.grid-3}
### Fast
### Secure
### Powerful
```

See [full syntax specification](../../SYNTAX-SPEC-v0.1.md) for complete reference.

## TypeScript Support

Fully typed with TypeScript. All AST nodes and options have complete type definitions.

```typescript
import type { DocumentNode, ButtonNode, InputNode } from 'markdown-mockup';
```

## Development

```bash
# Install dependencies
npm install

# Build library
npm run build

# Run tests
npm test

# Watch mode
npm run test:watch

# Type checking
npm run typecheck
```

## Architecture

```
Input Markdown
  ↓
Lexer (Tokenization)
  ↓
Parser (MDAST → wiremd AST)
  ↓
Transformer (Custom nodes)
  ↓
Validator
  ↓
Renderer (HTML/JSON)
```

## Performance

Target benchmarks:
- Parse time: <100ms for typical documents
- Render time: <200ms for HTML
- Memory: <50MB for large documents

## Browser Support

- Node.js: ≥18.0.0
- Browsers: Modern evergreen (ES2020+)

## License

MIT License - see [LICENSE](./LICENSE) file

## Related

- [wiremd](https://github.com/akonan/wiremd) - Parent project
- [Syntax Specification](../../SYNTAX-SPEC-v0.1.md)
- [Examples](../../examples/)

---

Part of the [wiremd](https://github.com/akonan/wiremd) project
