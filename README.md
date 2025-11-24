# wiremd

> Text-first UI design tool - Create wireframes and mockups using Markdown syntax

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18.0.0-green)](https://nodejs.org/)

wiremd is a markdown-based UI wireframing tool that lets you create wireframes and mockups using familiar markdown syntax with intuitive extensions. Write your UI designs as text, render them as beautiful wireframes.

## Why wiremd?

- **Designer-friendly syntax** - No complex DSL to learn, just extended Markdown
- **Version control ready** - Store your wireframes as plain text in Git
- **Fast iteration** - Update designs as quickly as you can type
- **Collaboration** - Review wireframe changes in pull requests
- **Developer handoff** - Export to HTML or framework components
- **No vendor lock-in** - Open source MIT license, runs anywhere

## Quick Example

### Contact Form

Create a `contact.md` file:

```markdown
## Contact Form

Name
[_____________________________]{required}

Email
[_____________________________]{type:email required}

Message
[_____________________________]{rows:5}

[Submit]* [Cancel]
```

Generate a wireframe:

```bash
wiremd contact.md --style sketch
```

This renders into a styled HTML wireframe with a form, inputs, and buttons.

### Grid Layout

Create a `features.md` file:

```markdown
## Product Features {.grid-3}

### :rocket: Fast
Lightning quick performance

### :shield: Secure
Bank-level security

### :gear: Flexible
Fully customizable
```

Generate a wireframe:

```bash
wiremd features.md --style sketch
```

This creates a responsive 3-column grid layout with icons and descriptions.

## Features

- ✅ **Markdown-first** - Valid markdown that degrades gracefully
- ✅ **Full markdown support** - Headings, text formatting, lists, links, images, blockquotes, code blocks, tables
- ✅ **Grid layouts** - Responsive multi-column grids (2, 3, 4+ columns) with simple `.grid-N` syntax
- ✅ **Visual syntax** - Looks like what it renders
- ✅ **Fast to write** - Intuitive shortcuts for common patterns
- ✅ **Extensible** - Add classes and attributes as needed
- ✅ **Multiple outputs** - HTML, JSON, React (JSX/TSX), Tailwind CSS, Figma (via plugin)
- ✅ **7 visual styles** - sketch (Balsamiq-inspired), clean, wireframe, tailwind, material, brutal, none
- ✅ **Full CLI tool** - Watch mode, live-reload dev server, style switching
- ✅ **Rich examples** - Showcase files demonstrating all styles
- ✅ **Framework renderers** - React, Tailwind CSS classes (Vue, Svelte coming soon)
- ✅ **VS Code extension** - Live preview with real-time updates and style switching

## Project Structure

This is an open-source MIT-licensed project containing:

- **`src/`** - Core parser and renderer library
- **`tests/`** - Comprehensive test suite (48 tests)
- **`docs/`** - Documentation site ([**Live at akonan.github.io/wiremd**](https://akonan.github.io/wiremd))
- **`examples/`** - Example wireframes
- **`figma-plugin/`** - Figma plugin for importing wiremd designs
- **`obsidian-plugin/`** - Obsidian plugin for live wireframe previews
- **`vscode-extension/`** - VS Code extension with live preview and style switching

## Installation

```bash
# Clone and build locally (not yet published to npm)
git clone https://github.com/akonan/wiremd.git
cd wiremd
npm install
npm run build

# Use the CLI
npm link
wiremd --help
```

> Coming soon: `npm install -g wiremd`

## CLI Usage

```bash
# Generate HTML with default sketch style
wiremd wireframe.md

# Output to specific file
wiremd wireframe.md -o output.html

# Use alternative styles
wiremd wireframe.md --style clean      # Modern minimal
wiremd wireframe.md --style wireframe  # Traditional grayscale
wiremd wireframe.md --style tailwind   # Utility-first with purple accents
wiremd wireframe.md --style material   # Google Material Design
wiremd wireframe.md --style brutal     # Neo-brutalism style
wiremd wireframe.md --style none       # Unstyled semantic HTML

# Watch mode with live-reload dev server
wiremd wireframe.md --watch --serve 3000

# Generate different output formats
wiremd wireframe.md --format json      # JSON AST output
wiremd wireframe.md --format react     # React/JSX component
wiremd wireframe.md --format tailwind  # HTML with Tailwind CSS classes
```

## Exporting to Figma

wiremd designs can be imported into Figma as fully editable, native Figma designs using the **wiremd Figma Plugin**.

### Quick Start

1. **Generate JSON from your wiremd file:**
   ```bash
   wiremd your-mockup.md --format json -o mockup.json
   ```

2. **Install the Figma Plugin:**
   - Open Figma → Plugins → Browse plugins
   - Search for "wiremd Importer"
   - Click Install

3. **Import to Figma:**
   - Open the wiremd Importer plugin
   - Paste your JSON
   - Choose a visual theme (Sketch, Clean, Wireframe, or Minimal)
   - Click "Import to Figma"

Your wiremd design will appear as a new Figma page with:
- Native Figma frames and text nodes
- Auto-layout for responsive designs
- Fully editable components
- Professional styling based on your chosen theme

### Visual Themes

- **Sketch** - Balsamiq-style hand-drawn look (perfect for brainstorming)
- **Clean** - Modern, polished design (great for presentations)
- **Wireframe** - Traditional grayscale (ideal for specifications)
- **Minimal** - Bare-bones styling (customize yourself)

### What Gets Imported

✅ All layout components (containers, grids, navigation)
✅ Form elements (buttons, inputs, selects, checkboxes, radios)
✅ Content (headings, paragraphs, lists, tables, code blocks)
✅ Proper spacing, padding, and auto-layout constraints
✅ Theme-specific styling (colors, fonts, shadows)

See [figma-plugin/README.md](./figma-plugin/README.md) for complete documentation.

## Using in Obsidian

wiremd has a native **Obsidian plugin** that brings live wireframe previews directly into your notes.

### Features

- **Live Preview**: Automatically render wiremd code blocks as interactive previews in Obsidian
- **7 Visual Styles**: Switch between sketch, clean, wireframe, tailwind, material, brutal, or none
- **Quick Style Switching**: Click the style badge to instantly change preview styles
- **Export Functionality**: Export wiremd previews as standalone HTML files
- **Mobile Optimized**: Touch-friendly interface with responsive design
- **Command Palette Integration**: Access all features via Obsidian commands

### Quick Start

1. **Install the plugin** in your Obsidian vault:
   ```bash
   cd /path/to/your/vault/.obsidian/plugins/
   git clone https://github.com/akonan/wiremd.git
   cd wiremd/obsidian-plugin
   npm install
   npm run build
   ```

2. **Enable the plugin** in Obsidian:
   - Open Obsidian Settings → Community Plugins
   - Reload plugins
   - Enable "Wiremd Preview"

3. **Create wiremd blocks** in your notes:
   ````markdown
   ```wiremd
   ## Login Form

   Username
   [____________________________]

   Password
   [****************************]

   [Sign In]{.primary} [Cancel]
   ```
   ````

The plugin will automatically render a live preview with your chosen style!

### Available Commands

- **Set style** - Change the rendering style (7 commands for each style)
- **Toggle auto-preview** - Enable/disable automatic rendering
- **Refresh previews** - Manually refresh all wiremd previews
- **Export as HTML** - Export current wiremd block as standalone HTML
- **Export all styles** - Export in all 7 styles at once
- **Copy to clipboard** - Copy rendered HTML to clipboard

See [obsidian-plugin/README.md](./obsidian-plugin/README.md) for complete documentation.

## Programmatic API

```typescript
import { parse, renderToHTML, renderToJSON, renderToReact, renderToTailwind } from 'wiremd';

// Parse markdown to AST
const ast = parse(`
  ## Contact Form

  ![Logo](logo.png)

  Name
  [_____________________________]
  [Submit]{.primary}
`);

// Render to HTML with visual style
const html = renderToHTML(ast, { style: 'sketch' });

// Render to JSON
const json = renderToJSON(ast, { pretty: true });

// Render to React component (TypeScript)
const reactComponent = renderToReact(ast, {
  typescript: true,
  componentName: 'ContactForm'
});

// Render to HTML with Tailwind CSS classes
const tailwindHTML = renderToTailwind(ast, { pretty: true });
```

## Documentation

**Not sure where to start?** → [Documentation Guide](./DOCUMENTATION-GUIDE.md)

### 📖 Learning & Reference

| Document | Description | Best For |
|----------|-------------|----------|
| **[Syntax Showcase](./examples/showcase.md)** | Comprehensive interactive guide with live examples | Learning by example, copying patterns |
| **[Quick Reference](./QUICK-REFERENCE.md)** | One-page syntax cheat sheet | Quick lookups, experienced users |
| **[Syntax Guide](./docs/guide/syntax.md)** | User-friendly tutorial with best practices | Structured learning |
| **[FAQ](./FAQ.md)** | Common questions and troubleshooting | Solving problems, known issues |

📖 **[📚 View Full Documentation →](https://akonan.github.io/wiremd)** - Complete documentation site with interactive examples

### 🚀 Getting Started

| Document | Description |
|----------|-------------|
| **[🌐 Live Documentation Site](https://akonan.github.io/wiremd)** | Full docs with interactive examples |
| **[🚀 Getting Started](https://akonan.github.io/wiremd/guide/getting-started)** | Installation and first steps |
| **[📝 Syntax Reference](https://akonan.github.io/wiremd/guide/syntax)** | Complete syntax guide |
| **[🎮 Interactive Playground](https://akonan.github.io/wiremd/playground)** | Try wiremd in your browser |
| **[⚙️ API Documentation](https://akonan.github.io/wiremd/api/)** | Programmatic API reference |
| **[🔌 Framework Integrations](https://akonan.github.io/wiremd/guide/integrations)** | Next.js, React, Vite, Express |
| **[🔧 Troubleshooting](https://akonan.github.io/wiremd/guide/troubleshooting)** | Common issues and solutions |
| **[🎨 Live Showcases](https://akonan.github.io/wiremd/showcases/)** | Examples in all 7 styles |
| **[📂 Example Files](./examples/)** | Local wiremd files to explore |

### 🔧 Technical Documentation

| Document | Description |
|----------|-------------|
| **[Syntax Specification](./SYNTAX-SPEC-v0.1.md)** | Formal specification with parser rules |
| **[API Documentation (Local)](./docs/api/index.md)** | Local API reference |
| **[Project Plan](./.github/dev-docs/markdown-mockup-project-plan.md)** | Development roadmap |
| **[CLAUDE.md](./.github/dev-docs/CLAUDE.md)** | Project overview for AI assistants |

### 🤝 Contributing

| Document | Description |
|----------|-------------|
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | Contribution guidelines |
| **[TESTING.md](./TESTING.md)** | Testing strategy and guidelines |
| **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** | Community guidelines |
| **[SECURITY.md](./SECURITY.md)** | Security policy |

## Development Status

### ✅ Completed (Phase 1-2)
- [x] Research existing solutions
- [x] Create test corpus with 20 UI patterns
- [x] Lock v0.1 syntax specification
- [x] Complete TypeScript implementation
- [x] Parser with full syntax support
- [x] AST transformer with 40+ node types
- [x] HTML renderer with 7 visual styles
- [x] JSON output
- [x] 48+ passing tests
- [x] Full-featured CLI tool with watch mode and live-reload
- [x] Rich example showcase demonstrating all styles
- [x] React component renderer (JSX/TSX output)
- [x] Tailwind CSS class renderer

### 🚧 In Progress (Phase 3)
- [x] Documentation site ✅ **[Live Now!](https://akonan.github.io/wiremd)**
- npm package publishing

### 📋 Coming Soon (Phase 4+)
- Framework-specific renderers (Vue, Svelte)
- Interactive web playground with live editor

See [Project Plan](./markdown-mockup-project-plan.md) for full roadmap.

## Contributing

Contributions are welcome! Phase 1-2 are complete with a working parser, renderer, and CLI. Feel free to:

- Report bugs or request features via [GitHub Issues](https://github.com/akonan/wiremd/issues)
- Submit pull requests for improvements
- Add new visual styles or examples
- Improve documentation

Please check the [Project Plan](./markdown-mockup-project-plan.md) for upcoming features.

### Quick Start for Contributors

```bash
# Clone the repository
git clone https://github.com/akonan/wiremd.git
cd wiremd

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Run type check
npm run typecheck
```

## License

MIT License - See [LICENSE](./LICENSE) for details.

## Community & Support

- **Issues & Bugs** - [GitHub Issues](https://github.com/akonan/wiremd/issues)
- **Discussions** - [GitHub Discussions](https://github.com/akonan/wiremd/discussions)
- **Security** - See [SECURITY.md](./SECURITY.md)
- **Changelog** - [CHANGELOG.md](./CHANGELOG.md)

## Credits

Created by [akonan](https://github.com/akonan)

Inspired by:
- [Balsamiq](https://balsamiq.com) - Pioneering rapid wireframing
- [Mermaid](https://mermaid.js.org) - Markdown-inspired diagramming
- [PlantUML Salt](https://plantuml.com/salt) - Text-based GUI mockups
- [Markdown-UI](https://github.com/jjuliano/markdown-ui) - Markdown to UI components

---

**Status:** Phase 1-2 Complete (Core + CLI) | **Version:** 0.1.0 | **Node:** ≥18.0.0

Made with ❤️ for designers and developers who love plain text
