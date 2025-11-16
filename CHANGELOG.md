# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

No unreleased changes yet.

## [0.1.0] - TBD

### Added
- Initial release of wiremd
- Core parser with full markdown + wiremd syntax support
- AST transformer with 40+ node types
- HTML renderer with Balsamiq-style default theme
- Alternative visual styles: clean, wireframe, none, material, tailwind, brutal
- JSON output format
- CLI tool with watch mode and live-reload dev server
- React component renderer (JSX/TSX output)
- Tailwind CSS class renderer
- VS Code extension with live preview
- Figma plugin for design import
- 48+ passing tests
- TypeScript strict mode implementation
- Community health files (CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md)
- GitHub Actions CI workflow
- .npmignore for clean package distribution
- Support for:
  - Forms (inputs, textareas, selects, buttons)
  - Layout containers (sections, grids, headers, footers)
  - Navigation components
  - Content elements (headings, paragraphs, images, icons)
  - Inline containers `[[...]]`
  - Block containers `:::`
  - Component attributes and modifiers
  - Custom classes and IDs

### Documentation
- Complete syntax specification (SYNTAX-SPEC-v0.1.md)
- Comprehensive README with examples
- Project plan and roadmap (moved to .github/dev-docs)
- Syntax research documentation (moved to .github/dev-docs)
- Example wireframes and outputs
- API documentation

### Changed
- Package name from `markdown-mockup` to `wiremd`
- Enabled parser and renderer exports in main index
- Moved internal documentation to .github/dev-docs/
- Moved screenshot files to docs/screenshots/
- Organized development files for cleaner repository structure

### Fixed
- LICENSE file cleanup (removed incorrect monorepo references)
- Removed debug console.log statements from production code
- Fixed broken documentation links
- Cleaned up .gitignore to exclude build artifacts and temporary files

## Version History

- **0.1.0** - Initial public release

---

For full release notes and migration guides, see the [releases page](https://github.com/akonan/wiremd/releases).
