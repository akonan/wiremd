# wiremd

> Text-first UI design tool - Create wireframes and mockups using Markdown syntax

[![CI](https://github.com/akonan/wiremd/workflows/CI/badge.svg)](https://github.com/akonan/wiremd/actions)
[![npm version](https://img.shields.io/npm/v/wiremd.svg)](https://www.npmjs.com/package/wiremd)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18.0.0-green)](https://nodejs.org/)

**Status:** 🚧 Under Development (Phase 1) | **Version:** 0.1.0-alpha

wiremd is a markdown-based UI wireframing tool that lets you create wireframes and mockups using familiar markdown syntax with intuitive extensions. Write your UI designs as text, render them as beautiful wireframes.

## Why wiremd?

- **Designer-friendly syntax** - No complex DSL to learn, just extended Markdown
- **Version control ready** - Store your wireframes as plain text in Git
- **Fast iteration** - Update designs as quickly as you can type
- **Collaboration** - Review wireframe changes in pull requests
- **Developer handoff** - Export to HTML or framework components
- **No vendor lock-in** - Open source MIT license, runs anywhere

## Quick Example

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

This renders into a styled wireframe with a form, inputs, and buttons.

## Features

- ✅ **Markdown-first** - Valid markdown that degrades gracefully
- ✅ **Visual syntax** - Looks like what it renders
- ✅ **Fast to write** - Intuitive shortcuts for common patterns
- ✅ **Extensible** - Add classes and attributes as needed
- ✅ **Balsamiq-style rendering** - Hand-drawn aesthetic by default
- ✅ **Multiple outputs** - HTML, JSON
- ✅ **Alternative styles** - Clean, wireframe, and minimal themes (examples included)
- 🚧 **CLI tool** - Generate wireframes with live-reload (in development)
- 🚧 **Framework renderers** - React, Vue components (coming soon)

## Project Structure

This is an open-source MIT-licensed project containing:

- **`src/`** - Core parser and renderer library
- **`tests/`** - Comprehensive test suite (48 tests)
- **`docs/`** - Documentation site (coming soon)
- **`examples/`** - Example wireframes

## Installation

```bash
# npm
npm install wiremd

# yarn
yarn add wiremd

# pnpm
pnpm add wiremd
```

### CLI Usage

```bash
# Install globally
npm install -g wiremd

# Parse and render mockup (uses Balsamiq-style by default)
mdmock input.md

# Output to file
mdmock input.md -o output.html

# JSON output
mdmock input.md --format json

# Watch mode with dev server and live-reload
mdmock input.md --watch --serve 3000

# Use alternative visual styles
mdmock input.md --style clean      # Modern minimal
mdmock input.md --style wireframe  # Traditional grayscale
mdmock input.md --style material   # Material Design
mdmock input.md --style tailwind   # Tailwind-inspired
mdmock input.md --style brutal     # Brutalist
```

### Programmatic API

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
- [x] HTML renderer (Balsamiq-style default, 3 alternative examples)
- [x] JSON output
- [x] 48 passing tests

### 🚧 In Progress
- CLI tool development
- Demo site with examples
- Documentation site

### 📋 Coming Soon
- Framework-specific renderers (React, Vue, Svelte)
- VS Code extension
- Interactive playground

See [Project Plan](./markdown-mockup-project-plan.md) for full roadmap.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) to get started.

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

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) and [Security Policy](./SECURITY.md) before contributing.

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

Made with ❤️ for designers and developers who love plain text
