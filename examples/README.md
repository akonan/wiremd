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
mdmock hello.md

# Alternative styles
mdmock hello.md --style clean -o hello-clean.html
mdmock hello.md --style wireframe -o hello-wireframe.html
mdmock hello.md --style none -o hello-none.html

# JSON output
mdmock hello.md --format json
```

## Watch Mode

```bash
# Watch for changes and regenerate
mdmock hello.md --watch

# Watch + live-reload dev server
mdmock hello.md --watch --serve 3000
# Open http://localhost:3000 in browser
```
