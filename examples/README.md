# wiremd Examples

This directory contains example wireframes and outputs in different styles.

## 🎨 Examples Gallery

**NEW!** Check out our comprehensive [Examples Gallery](gallery/README.md) with **20 production-ready examples** across 4 categories:

- **📋 Forms** (5 examples) - Contact, login, registration, search, multi-step
- **🚀 Landing Pages** (5 examples) - SaaS, portfolio, app, e-commerce, agency
- **📊 Dashboards** (5 examples) - Analytics, admin, e-commerce, project management, social media
- **🧩 Components** (5 examples) - Navigation, cards, tables, modals, form controls

Each example demonstrates real-world patterns and can be rendered in all 7 visual styles!

**→ [Explore the Gallery](gallery/README.md)**

---

## Quick Start Files

- `hello.md` - Simple login form example
- `hello.html` - Generated with default sketch (Balsamiq) style
- `hello-clean.html` - Generated with clean style
- `hello.json` - JSON AST output
- `showcase.md` - Complete syntax reference and component showcase

## Generate Examples

```bash
# Default Balsamiq-style
wiremd hello.md

# Alternative styles
wiremd hello.md --style clean -o hello-clean.html
wiremd hello.md --style wireframe -o hello-wireframe.html
wiremd hello.md --style none -o hello-none.html

# JSON output
wiremd hello.md --format json
```

## Watch Mode

```bash
# Watch for changes and regenerate
wiremd hello.md --watch

# Watch + live-reload dev server
wiremd hello.md --watch --serve 3000
# Open http://localhost:3000 in browser
```
