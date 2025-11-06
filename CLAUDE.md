# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**wiremd** is a text-first UI design tool that allows developers to create wireframes and mockups using Markdown syntax. The project consists of:

1. **Core Library** (`markdown-mockup` or `mdmock`) - MIT-licensed parser and renderer
2. **Obsidian Plugin** ("Mockup Designer for Obsidian") - Commercial plugin

**Current Status:** Planning phase - no implementation yet. See `markdown-mockup-project-plan.md` for full roadmap.

## Project Architecture

### Planned Technology Stack

**Core Library:**
- TypeScript (strict mode)
- Build: Vite
- Parser: Unified/Remark + Custom tokenizer
- Testing: Vitest
- Documentation: VitePress
- CI/CD: GitHub Actions

**Obsidian Plugin:**
- Obsidian API
- UI: Svelte (Obsidian standard)
- Build: esbuild
- Testing: Playwright

### Intended Project Structure

```
markdown-mockup/
├── packages/
│   ├── core/               # MIT licensed parser & renderer
│   │   ├── src/
│   │   │   ├── parser/     # Markdown + mockup syntax parser
│   │   │   ├── renderer/   # HTML/JSON renderer
│   │   │   └── cli/        # CLI tool
│   │   └── tests/
│   └── obsidian-plugin/    # Commercial plugin
│       ├── src/
│       └── styles/
├── docs/                   # Documentation site (VitePress)
└── examples/               # Example mockup files
```

## Key Design Principles

### Parser Architecture
The parser will follow this pipeline:
```
Markdown Input → Lexer (Tokenization) → Parser (AST) →
Transformer (AST → JSON) → Validator → Output (JSON/HTML/Framework)
```

### Syntax Philosophy
1. Feel like native Markdown where possible
2. Progressive enhancement - basic Markdown should still work
3. Custom syntax only when necessary
4. Clear ambiguity resolution rules

### JSON Output Schema
The parser will output a structured JSON format with:
- Document metadata (version, viewport, annotations)
- Component tree with types, props, children, layout
- Style definitions
- State representations (hover, active, disabled, loading, etc.)

### Component Types
Supported UI components will include:
- Layout: container, section, header, footer, grid
- Forms: button, input, textarea, select, form
- Content: text, heading, paragraph, image, icon
- Navigation: nav, nav-item
- Complex: card, modal, table

### Styling System
HTML renderer will support multiple visual styles:
- `sketch` - Balsamiq-inspired hand-drawn look (default)
- `clean` - Minimal wireframe style
- `wireframe` - Traditional wireframe appearance
- `none` - Unstyled semantic HTML

## Development Commands

### Core Library (when implemented)
```bash
# Install dependencies
npm install

# Build library
npm run build

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- path/to/test.spec.ts

# Lint code
npm run lint

# Type check
npm run typecheck

# Start documentation dev server
npm run docs:dev
```

### CLI Tool Usage (planned)
```bash
# Parse and render mockup
mdmock input.md

# Output to file
mdmock input.md -o output.html

# JSON output
mdmock input.md --format json

# Watch mode with dev server
mdmock watch input.md --serve 3000

# Different visual style
mdmock input.md --style clean
```

## Testing Strategy

### Unit Tests
- Each component type must have comprehensive unit tests
- Parser tokenization and transformation tests
- Renderer output tests for all styles

### Integration Tests
- Full document parsing end-to-end
- Complex nested component scenarios
- Edge cases and error conditions

### Quality Standards
- Minimum 50% test coverage (target: 80%+)
- All exported functions must be tested
- Error messages must be clear and actionable
- Performance: <100ms parse time for typical documents

## Obsidian Plugin Specifics

### Plugin Architecture
- Live preview with auto-refresh
- Split view, tab view, inline, or hover modes
- Component library system with reusable components
- Annotation system for design notes
- State representation (empty, loading, error, etc.)
- Responsive preview modes

### Component Library
Components stored in:
- `.obsidian/plugins/mockup-designer/components/` (global)
- `mockups/components/` (project-specific)

### Export Formats (planned)
- HTML with inline styles
- HTML with external CSS
- React components
- Vue components
- Figma plugin format (JSON)
- PDF wireframes

## Important Constraints

### License Split
- **Core library** (packages/core/): MIT License - fully open source
- **Obsidian plugin** (packages/obsidian-plugin/): Commercial - proprietary

Keep these strictly separated. Core library must have zero dependencies on plugin code.

### Performance Targets
- Parse time: <100ms for typical document
- Render time: <200ms for HTML generation
- Memory: <50MB for large documents

### Browser/Environment Support
- Node.js: 18+
- Browsers: Modern evergreen (ES2020+)
- Obsidian: Latest stable version

## Example Syntax (Proposed v0.1)

```markdown
## Navigation Bar {.sticky .top}
[[ Logo | Home | Products | About | [Sign In] ]]

## Hero Section {.hero}
> # Welcome to Our Product
> Transform your workflow
> [Get Started] [Learn More]{.outline}

## Features Grid {.grid-3}
### Feature One
![icon](feature1.svg)
Fast and reliable service.

## Contact Form
[Name___________]
[Email__________] {type:email required}
[Your message...] {rows:5}
[Submit]
```

## Development Phases

### Phase 1: Syntax Definition (Weeks 1-2)
- Research existing solutions
- Build test corpus with 20 common UI patterns
- Lock v0.1 syntax specification

### Phase 2: Parser & JSON Output (Weeks 3-4)
- Implement lexer, parser, AST transformer
- Create JSON schema
- Add validation layer

### Phase 3: HTML Renderer (Weeks 5-6)
- Build Balsamiq-style CSS framework
- Implement HTML generator
- Support multiple visual styles

### Phase 4: CLI Tool (Week 7)
- Basic commands
- Watch mode and dev server
- Config file support

### Phase 5: Obsidian Plugin (Weeks 8-13)
- Core preview functionality
- Component library system
- Advanced features (states, annotations, responsive)

## Decision Points

The following key decisions need to be made during implementation:

### Syntax Choices
- Layout system: CSS Grid vs. Table-like vs. Flexbox hints
- Component syntax: Which style for buttons, inputs, images
- Modifier syntax: How to express classes, IDs, properties
- State representation: Syntax for hover, active, disabled states
- Responsive syntax: Inline modifiers vs. viewport blocks

### Technical Choices
- Tokenization strategy
- AST structure
- Error recovery approach
- Plugin API integration points

See `markdown-mockup-project-plan.md` section 1.2 for detailed syntax options under consideration.

## When Starting Implementation

Before writing any code:
1. Review the full project plan in `markdown-mockup-project-plan.md`
2. Confirm syntax decisions with the user
3. Set up monorepo structure with proper tooling
4. Establish testing framework first
5. Create initial TypeScript types for AST and JSON schema
6. Build minimal parser before adding features

## Success Metrics

### Core Library
- 100 GitHub stars in first month
- 1,000 npm downloads in first month
- <100ms parse time for typical documents
- 50%+ test coverage

### Code Quality
- All TypeScript strict mode checks passing
- Zero ESLint errors
- Comprehensive JSDoc for public APIs
- Clear error messages with suggestions
