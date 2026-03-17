# wiremd Browser vs CLI Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          wiremd Application                              │
│                                                                          │
│  Core Parsing & Rendering (Shared Codebase)                             │
│  ┌────────────────────────────────────────────────────────┐              │
│  │                    Parser Module                        │              │
│  │  • Read markdown input                                 │              │
│  │  • Parse to AST using remark, unified                  │              │
│  │  • Validate structure                                  │              │
│  └────────────────────────────────────────────────────────┘              │
│  ┌────────────────────────────────────────────────────────┐              │
│  │                   Renderer Module                       │              │
│  │  • HTML renderer (with 7 styles)                        │              │
│  │  • JSON exporter                                        │              │
│  │  • React/JSX generator                                  │              │
│  │  • Tailwind CSS renderer                                │              │
│  └────────────────────────────────────────────────────────┘              │
│                                                                          │
│  ┌──────────────────────────────────┐   ┌──────────────────────────────┐ │
│  │     CLI Version (Node.js)        │   │  Browser Version             │ │
│  │  ────────────────────────────     │   │  ─────────────────────       │ │
│  │                                  │   │                              │ │
│  │  Input Sources:                  │   │  Input Sources:              │ │
│  │  • Files (readFileSync)          │   │  • textarea                  │ │
│  │  • Stdin                         │   │  • Text input                │ │
│  │                                  │   │  • Programmatic strings      │ │ │  Processing:                 │   │  Processing:                 │ │
│  │  • Parse markdown               │   │  • Parse markdown            │ │
│  │  • Validate                     │   │  • Validate                  │ │
│  │  • Render                       │   │  • Render                    │ │
│                                  │   │                              │ │
│  │  Features:                       │   │  Features:                   │ │
│  │  ✅ File watching (chokidar)    │   │  ✅ Real-time preview        │ │
│  │  ✅ Dev server                  │   │  ✅ Copy to clipboard        │ │
│  │  ✅ Multiple input files        │   │  ✅ Multiple outputs         │ │
│  │  ✅ Batch processing            │   │  ✅ Style selector           │ │
│                                  │   │  ✅ No server needed         │ │
│  │  Command:                       │   │                              │ │
│  │  wiremd input.md --style clean  │   │  Launch: browser-editor.html │ │
│  │                                  │   │                              │ │
│  └──────────────────────────────────┘   └──────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Detailed Browser Architecture

```
User Browser
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  HTML Interface                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │  Markdown Input  │    │  Style Selector  │                   │
│  │  (textarea)      │    │  (dropdown)      │                   │
│  └────────┬─────────┘    └─────────┬────────┘                   │
│           │                        │                            │
│           └────────────────────────┘                            │
│                      │                                          │
│                      ▼                                          │
│        ┌─────────────────────────────┐                          │
│        │  Event Listener (input)     │                          │
│        └────────────┬────────────────┘                          │
│                     │                                           │
│                     ▼                                           │
│    ┌────────────────────────────────────┐                       │
│    │   wiremd.parse(markdown)           │                       │
│    │   Returns: DocumentNode (AST)      │                       │
│    └────────────┬─────────────────────┘                         │
│                 │                                               │
│        ┌────────┴─────────────┬──────────────┐                  │
│        │                      │              │                  │
│        ▼                      ▼              ▼                  │
│   ┌─────────────┐  ┌──────────────┐  ┌────────────┐           │
│   │ renderToHTML│  │renderToJSON  │  │renderToReact
│   │   Displays  │  │ For export   │  │ For React  │           │
│   └──────┬──────┘  └──────┬───────┘  └─────┬──────┘           │
│          │                │                │                   │
│          └────────────────┼────────────────┘                   │
│                           │                                     │
│                      ┌────▼──────┐                              │
│                      │  Display   │                             │
│                      │   Output   │                             │
│                      └───────────┘                              │
│                                                                 │
│  Bundled Dependencies (included in dist/wiremd.es.js):         │
│  • unified - Text processing framework                         │
│  • remark - Markdown processor                                 │
│  • mdast-util-* - AST utilities                                │
│  • unist-util-visit - Tree traversal                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Dependency Differences

### CLI Build Includes
```
✅ fs, path - File system access
✅ chokidar - File watcher
✅ chalk - Terminal colors
✅ Express.js - Dev server
✅ All parsing dependencies (bundled)
❌ NO browser APIs
```

### Browser Build Includes
```
✅ All parsing dependencies (bundled)
✅ Browser APIs
❌ No file system access
❌ No file watcher
❌ No terminal colors
❌ No server
```

## File Flow

### CLI Version
```
Terminal
  ↓
wiremd CLI
  ↓
File System (readFileSync)
  ↓
Parser (parse markdown)
  ↓
Renderer (renderToHTML)
  ↓
File System (writeFileSync)
  ↓
HTML File
```

### Browser Version
```
User Input
  ↓
Text Area / Text Input
  ↓
JavaScript (in memory)
  ↓
Parser (parse markdown)
  ↓
Renderer (renderToHTML)
  ↓
DOM / Clipboard / Export
```

## Build Process

### CLI Build
```bash
npm run build
    ↓
TypeScript → JavaScript
    ↓
Vite (vite.config.ts)
    ↓
ESM + CJS outputs
    ↓
dist/index.js, dist/index.cjs
dist/parser.js, dist/parser.cjs
dist/renderer.js, dist/renderer.cjs
dist/cli/index.js, dist/cli/index.cjs
```

### Browser Build
```bash
npm run build:browser
    ↓
TypeScript → JavaScript
    ↓
Vite (vite.config.browser.ts)
    ↓
UMD + ESM outputs
Bundle dependencies
Remove Node.js APIs
    ↓
dist/wiremd.umd.js (150KB gzip)
dist/wiremd.es.js (150KB gzip)
```

## Module Exports

### CLI Version
```typescript
export { parse, validate }        // parser
export { renderToHTML, ... }      // renderer
export { VERSION }                // constants
// CLI not exported from main
```

### Browser Version
```typescript
import { parse, validate } from './parser'        // ✅
import { renderToHTML, renderToJSON, ... } from './renderer' // ✅
export { VERSION, SYNTAX_VERSION }                // ✅
// No CLI imports
// No Node.js imports
```

---

**Key Point:** Both versions share the same **core parser and renderer code**. The build process creates different bundles optimized for each platform by including/excluding platform-specific dependencies.
