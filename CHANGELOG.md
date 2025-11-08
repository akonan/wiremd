# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Open source release preparation
- Community health files (CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md)
- GitHub issue and PR templates
- GitHub Actions CI workflow
- Comprehensive documentation improvements

### Changed
- Package name from `markdown-mockup` to `wiremd`
- Enabled parser and renderer exports in main index

### Fixed
- LICENSE file cleanup (removed incorrect monorepo references)

## [0.1.0] - 2025-01-XX (Upcoming)

### Added
- Initial release of wiremd
- Core parser with full markdown + wiremd syntax support
- AST transformer with 40+ node types
- HTML renderer with Balsamiq-style default theme
- Alternative visual styles: clean, wireframe, none, material, tailwind, brutal
- JSON output format
- CLI tool with watch mode and live-reload dev server
- 48 passing tests
- TypeScript strict mode implementation
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
- Project plan and roadmap
- Syntax research documentation
- Example wireframes and outputs

## Version History

- **0.1.0** - Initial public release

---

For full release notes and migration guides, see the [releases page](https://github.com/akonan/wiremd/releases).
