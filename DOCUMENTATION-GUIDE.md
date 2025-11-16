# wiremd Documentation Guide

> **Not sure which documentation to read?** This guide helps you find the right resource for your needs.

## Quick Start: Choose Your Path

### 🆕 I'm brand new to wiremd
**Start here:** [Syntax Showcase](examples/showcase.md)

The Syntax Showcase is a comprehensive, interactive tutorial with live examples. It's designed for learning by example and covers every component type with rendered output.

---

### ⚡ I need quick syntax lookup
**Go to:** [Quick Reference](QUICK-REFERENCE.md)

One-page cheat sheet with all syntax in table format. Perfect for experienced users who just need a quick reminder.

---

### ❓ Something isn't working
**Check:** [FAQ](FAQ.md)

Common questions, troubleshooting tips, and known issues. If your wiremd isn't rendering as expected, start here.

---

### 📚 I want a guided tutorial
**Read:** [Syntax Guide](docs/guide/syntax.md)

User-friendly walkthrough with best practices, tips, and tricks. Less comprehensive than the showcase, but more structured for learning.

---

### 🔧 I'm implementing a parser/renderer
**Study:** [Syntax Specification](SYNTAX-SPEC-v0.1.md)

Formal technical specification with parser rules, JSON schema, AST structure, and implementation notes.

---

### 📦 I want to install and use wiremd
**Follow:** [Installation Guide](docs/guide/installation.md) → [Getting Started](docs/guide/getting-started.md)

Step-by-step setup and first steps with the CLI tool.

---

## Documentation Overview

### User Documentation

| Document | Purpose | Best For | Length |
|----------|---------|----------|--------|
| **[Syntax Showcase](examples/showcase.md)** | Interactive examples of all components | Learning, reference, copying examples | Long (900+ lines) |
| **[Quick Reference](QUICK-REFERENCE.md)** | One-page syntax cheat sheet | Quick lookups, experienced users | Short (1 page) |
| **[Syntax Guide](docs/guide/syntax.md)** | Guided tutorial with best practices | Learning fundamentals | Medium (250 lines) |
| **[FAQ](FAQ.md)** | Common questions and troubleshooting | Solving problems | Medium (400+ lines) |
| **[Getting Started](docs/guide/getting-started.md)** | First steps with wiremd | New installations | Short |
| **[Installation](docs/guide/installation.md)** | Setup instructions | Installing wiremd | Short |

### Developer Documentation

| Document | Purpose | Best For |
|----------|---------|----------|
| **[SYNTAX-SPEC-v0.1.md](SYNTAX-SPEC-v0.1.md)** | Formal specification | Parser implementation |
| **[CLAUDE.md](CLAUDE.md)** | Project overview for AI assistants | Understanding architecture |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | Contribution guidelines | Contributing code |
| **[TESTING.md](TESTING.md)** | Testing strategy and guidelines | Writing tests |
| **[API Documentation](docs/api/README.md)** | API reference | Using the library programmatically |

### Project Documentation

| Document | Purpose |
|----------|---------|
| **[README.md](README.md)** | Project overview and quick start |
| **[CHANGELOG.md](CHANGELOG.md)** | Version history and changes |
| **[Project Plan](markdown-mockup-project-plan.md)** | Development roadmap |
| **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** | Community guidelines |
| **[SECURITY.md](SECURITY.md)** | Security policy |

---

## Common Scenarios

### Scenario: "I want to create my first wireframe"

1. Read the introduction in [Syntax Showcase](examples/showcase.md)
2. Copy an example that's similar to what you need
3. Modify it for your use case
4. Refer to [Quick Reference](QUICK-REFERENCE.md) for syntax you don't remember

### Scenario: "My wireframe isn't rendering correctly"

1. Check [FAQ](FAQ.md) for common issues
2. Review your syntax against [Quick Reference](QUICK-REFERENCE.md)
3. Compare to working examples in [Syntax Showcase](examples/showcase.md)
4. If still stuck, open a GitHub issue

### Scenario: "I want to learn all features"

1. Start with [Syntax Guide](docs/guide/syntax.md) for basics
2. Read through [Syntax Showcase](examples/showcase.md) for comprehensive examples
3. Keep [Quick Reference](QUICK-REFERENCE.md) handy for lookups

### Scenario: "I'm building a parser for wiremd"

1. Read [SYNTAX-SPEC-v0.1.md](SYNTAX-SPEC-v0.1.md) thoroughly
2. Study the parser implementation in `src/parser/`
3. Review test cases in `tests/`
4. Check [CLAUDE.md](CLAUDE.md) for architecture overview

### Scenario: "I want to contribute to wiremd"

1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Review [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
3. Check [Project Plan](markdown-mockup-project-plan.md) for roadmap
4. Look at [TESTING.md](TESTING.md) for testing requirements

---

## Documentation Principles

Our documentation follows these principles:

### Progressive Disclosure
Start simple, reveal complexity as needed. The Showcase starts with basic buttons before showing complex layouts.

### Learn by Example
Every feature has a working example. Copy, paste, and modify to learn.

### Multiple Formats
Some people learn by reading (Guide), others by doing (Showcase), others by reference (Quick Reference).

### Just-in-Time Help
FAQ answers questions when you're stuck. Quick Reference helps when you forget syntax.

### Searchability
All docs are markdown and searchable. Use Ctrl+F / Cmd+F to find what you need.

---

## Tips for Using Documentation

### Bookmark These Three
1. [Syntax Showcase](examples/showcase.md) - Your main reference
2. [Quick Reference](QUICK-REFERENCE.md) - Fast syntax lookups
3. [FAQ](FAQ.md) - When things go wrong

### Use Browser Search
All documentation is text-based. Use your browser's search (Ctrl+F / Cmd+F) to quickly find specific components or syntax.

### Keep Examples Handy
The [examples/](examples/) folder has working wiremd files you can:
- Copy as starting templates
- Modify for your needs
- Use to test different visual styles

### Start with Working Code
When stuck, start with a working example from the Showcase and modify it incrementally until it matches your needs.

### Read the Error Messages
The parser provides helpful error messages. Read them carefully - they often tell you exactly what's wrong.

---

## Documentation Feedback

Found an error in the docs? Something unclear? Have a suggestion?

1. **Quick typos/fixes:** Open a pull request
2. **Unclear explanations:** Open an issue describing what's confusing
3. **Missing examples:** Open an issue requesting an example
4. **General feedback:** Open a discussion on GitHub

Good documentation is a community effort. Your feedback helps everyone!

---

## What's Next?

Based on your role:

- **Designer/User:** Start with [Syntax Showcase](examples/showcase.md)
- **Developer/Integrator:** Read [Getting Started](docs/guide/getting-started.md), then [API Docs](docs/api/README.md)
- **Contributor:** Read [CONTRIBUTING.md](CONTRIBUTING.md)
- **Parser Developer:** Study [SYNTAX-SPEC-v0.1.md](SYNTAX-SPEC-v0.1.md)

---

*This guide last updated: 2025-11-15*
