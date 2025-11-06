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
- 🚧 **Multiple outputs** - HTML, JSON, React, Vue (coming soon)
- 🚧 **Beautiful styles** - Sketch, clean, wireframe themes
- 🚧 **CLI tool** - Generate wireframes from the command line
- 🚧 **Obsidian plugin** - Live preview in Obsidian

## Project Structure

This is a monorepo containing:

- **`packages/core`** - MIT-licensed parser and renderer library
- **`packages/obsidian-plugin`** - Commercial Obsidian plugin (coming soon)
- **`docs`** - Documentation site (coming soon)
- **`examples`** - Example wireframes

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

### Phase 1: Syntax Definition (Current)
- [x] Research existing solutions
- [x] Create test corpus with 20 UI patterns
- [x] Lock v0.1 syntax specification
- [x] Set up monorepo structure
- [x] Define TypeScript types
- [ ] Complete parser implementation

### Phase 2: Parser & JSON Output (Next)
- [ ] Implement lexer
- [ ] Complete AST transformer
- [ ] Add validation layer
- [ ] Comprehensive test coverage

### Phase 3-5: Coming Soon
- HTML Renderer with Balsamiq-style CSS
- CLI Tool
- Obsidian Plugin

See [Project Plan](./markdown-mockup-project-plan.md) for full roadmap.

## Contributing

This project is in early development. Contributions welcome once Phase 1 is complete.

## License

- **Core library** (`packages/core`): MIT License
- **Obsidian plugin** (`packages/obsidian-plugin`): Commercial (proprietary)

See individual package LICENSE files for details.

## Credits

Created by [akonan](https://github.com/akonan)

Inspired by:
- [Balsamiq](https://balsamiq.com) - Pioneering rapid wireframing
- [Mermaid](https://mermaid.js.org) - Markdown-inspired diagramming
- [PlantUML Salt](https://plantuml.com/salt) - Text-based GUI mockups
- [Markdown-UI](https://github.com/jjuliano/markdown-ui) - Markdown to UI components

---

**Status:** Under active development | **Version:** 0.1.0-alpha | **Node:** ≥18.0.0
