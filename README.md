# wiremd

> Text-first UI design tool - Create wireframes and mockups using Markdown syntax

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18.0.0-green)](https://nodejs.org/)

**Status:** ✅ Core Implementation Complete (Phase 1-2) | **Version:** 0.1.0

wiremd is a markdown-based UI wireframing tool that lets you create wireframes and mockups using familiar markdown syntax with intuitive extensions. Write your UI designs as text, render them as beautiful wireframes.

## Why wiremd?

- **Designer-friendly syntax** - No complex DSL to learn, just extended Markdown
- **Version control ready** - Store your wireframes as plain text in Git
- **Fast iteration** - Update designs as quickly as you can type
- **Collaboration** - Review wireframe changes in pull requests
- **Developer handoff** - Export to HTML or framework components
- **No vendor lock-in** - Open source MIT license, runs anywhere

## Quick Example

Create a `contact.md` file:

```markdown
## Contact Form

Name
[_____________________________]{required}

Email
[_____________________________]{type:email required}

Message
[                             ]
[                             ]
[_____________________________]{rows:5}

[Submit]{.primary} [Cancel]
```

Generate a wireframe:

```bash
mdmock contact.md --style sketch
```

This renders into a styled HTML wireframe with a form, inputs, and buttons.

## Features

- ✅ **Markdown-first** - Valid markdown that degrades gracefully
- ✅ **Visual syntax** - Looks like what it renders
- ✅ **Fast to write** - Intuitive shortcuts for common patterns
- ✅ **Extensible** - Add classes and attributes as needed
- ✅ **Multiple outputs** - HTML, JSON
- ✅ **7 visual styles** - sketch (Balsamiq-inspired), clean, wireframe, tailwind, material, brutal, none
- ✅ **Full CLI tool** - Watch mode, live-reload dev server, style switching
- ✅ **Rich examples** - Showcase files demonstrating all styles
- 🚧 **Framework renderers** - React, Vue components (coming soon)
- 🚧 **VS Code extension** - Live preview (planned)

## Project Structure

This is an open-source MIT-licensed project containing:

- **`src/`** - Core parser and renderer library
- **`tests/`** - Comprehensive test suite (48 tests)
- **`docs/`** - Documentation site (coming soon)
- **`examples/`** - Example wireframes

## Installation

```bash
# Clone and build locally (not yet published to npm)
git clone https://github.com/akonan/wiremd.git
cd wiremd
npm install
npm run build

# Use the CLI
npm link
mdmock --help
```

> Coming soon: `npm install -g wiremd`

## CLI Usage

```bash
# Generate HTML with default sketch style
mdmock wireframe.md

# Output to specific file
mdmock wireframe.md -o output.html

# Use alternative styles
mdmock wireframe.md --style clean      # Modern minimal
mdmock wireframe.md --style wireframe  # Traditional grayscale
mdmock wireframe.md --style tailwind   # Utility-first with purple accents
mdmock wireframe.md --style material   # Google Material Design
mdmock wireframe.md --style brutal     # Neo-brutalism style
mdmock wireframe.md --style none       # Unstyled semantic HTML

# Watch mode with live-reload dev server
mdmock wireframe.md --watch --serve 3000

# Generate JSON output
mdmock wireframe.md --format json
```

## Programmatic API

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

## Documentation

- [Syntax Specification v0.1](./SYNTAX-SPEC-v0.1.md) - Complete syntax reference
- [Test Corpus v3 (Hybrid)](./test-corpus-v3-hybrid.md) - Examples of 20 common UI patterns
- [Project Plan](./markdown-mockup-project-plan.md) - Full development roadmap
- [Syntax Research](./syntax-research.md) - Research and design decisions

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
- [x] 48 passing tests
- [x] Full-featured CLI tool with watch mode and live-reload
- [x] Rich example showcase demonstrating all styles

### 🚧 In Progress (Phase 3)
- Documentation site
- npm package publishing

### 📋 Coming Soon (Phase 4+)
- Framework-specific renderers (React, Vue, Svelte)
- VS Code extension with live preview
- Interactive web playground

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
