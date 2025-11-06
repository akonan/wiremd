# wiremd

> Text-first UI design tool - Create wireframes and mockups using Markdown syntax

**Status:** 🚧 Under Development (Phase 1)

wiremd is a markdown-based UI wireframing tool that lets you create wireframes and mockups using familiar markdown syntax with intuitive extensions. Write your UI designs as text, render them as beautiful wireframes.

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
# Not yet published to npm
# Coming soon: npm install markdown-mockup
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

This project is in early development. Contributions welcome once Phase 1 is complete.

## License

MIT License - See [LICENSE](./LICENSE) for details.

## Credits

Created by [akonan](https://github.com/akonan)

Inspired by:
- [Balsamiq](https://balsamiq.com) - Pioneering rapid wireframing
- [Mermaid](https://mermaid.js.org) - Markdown-inspired diagramming
- [PlantUML Salt](https://plantuml.com/salt) - Text-based GUI mockups
- [Markdown-UI](https://github.com/jjuliano/markdown-ui) - Markdown to UI components

---

**Status:** Under active development | **Version:** 0.1.0-alpha | **Node:** ≥18.0.0
