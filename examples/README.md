# wiremd Examples

This directory contains example wireframes and outputs in different styles.

## Files

- `hello.md` - Simple login form example
- `hello.html` - Generated with default sketch (Balsamiq) style
- `hello-clean.html` - Generated with clean style
- `hello.json` - JSON AST output

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
