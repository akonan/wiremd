# How wiremd Works

This page explains wiremd's internal architecture — not how to use it, but why it is built the way it is. It is useful if you are debugging unexpected output, building tooling on top of wiremd, or extending the library.

## The Pipeline

wiremd converts Markdown text to visual output in two distinct stages:

```
Markdown string  →  parse()  →  WiremdAST  →  render*()  →  HTML / React / JSON / Tailwind
```

**Stage 1 — Parsing.** The `parse()` function hands your Markdown string to [unified](https://unifiedjs.com/)/remark, which produces a standard Markdown AST (MDAST). Two wiremd-specific remark plugins then enrich that tree before it reaches the transformer:

- `remark-containers` handles fenced block syntax (`::: card`, `::: grid`, etc.), including nested containers.
- `remark-inline-containers` handles inline and nav syntax (`[[ nav ]]`, `[[ breadcrumb ]]`).

Standard inline shorthand — buttons (`[Label]*`), inputs (`[_____]`) — are recognised as specially-shaped Markdown link and text nodes, so no additional plugin is needed for them.

The transformer then walks the enriched MDAST and emits a **WiremdAST**: a tree of discriminated-union node types defined in `src/types.ts`. There are roughly 40 node types (Button, Input, Card, Grid, Nav, …). This is the canonical representation of a wireframe.

**Stage 2 — Rendering.** A renderer takes a WiremdAST and serialises it to a target format. Four renderers ship out of the box: HTML, React/JSX, Tailwind-classed HTML, and JSON. Each renderer maps node types to its own output idiom independently.

## Why Markdown?

Markdown is the format of least friction for text-first authoring. It works in any editor, is version-controllable, renders readably as plain text, and requires no proprietary tooling to open or edit. Treating the wireframe source as ordinary Markdown also means that existing Markdown tooling — syntax highlighting, diff views, linters — applies for free.

The wiremd extensions (`::: containers`, button shorthand, etc.) are chosen to sit within Markdown's extension points so that a file remains valid Markdown even when viewed by a renderer that does not understand wiremd syntax. The blocks degrade to blockquotes and paragraphs; the intent is still legible.

## Why an Intermediate AST?

The separation between `parse()` and `render*()` is load-bearing. Without it, every output format would need its own parser, and any validation or analysis would have to be repeated per format. The AST makes several things straightforward:

- **Multiple output formats.** HTML, React, Tailwind, and JSON all consume the same WiremdAST. Adding a new renderer does not touch the parser.
- **Validation.** `validate()` inspects the AST before rendering and reports structural problems (unknown node types, missing required children) without needing to re-parse.
- **Tooling and editor integration.** The VS Code extension and any future language server can operate on the AST rather than raw Markdown strings.
- **Composability.** `parse()` and `render*()` are separate exports, so a caller can intercept or modify the AST between stages — useful for custom transformations.

## The Style System

The HTML and Tailwind renderers support visual style variants. Each style is a self-contained CSS string stored in `src/renderer/styles.ts`. At render time, the chosen style string is injected into the output document; there is no external stylesheet dependency.

Because each style is independent, they can diverge arbitrarily in their CSS without one affecting another. The `sketch` style uses Comic Sans and rough box-shadow values to produce a hand-drawn aesthetic. The `wireframe` style uses a greyscale palette with dashed borders. The `clean` style is a modern minimal layout. Styles are passed as a plain option:

```ts
renderToHTML(ast, { style: 'sketch' })
```

The `none` style emits no CSS at all, useful when you are injecting wiremd output into a document that already has its own stylesheet.

## The VS Code Extension

The VS Code extension (`vscode-extension/`) is a thin WebView wrapper around the same `parse()` + `renderToHTML()` pipeline. When you open a `.md` file and trigger the preview command, the extension reads the file contents, calls the wiremd library, and renders the result into a VS Code WebView panel. The panel refreshes on every file save.

There is no separate rendering engine in the extension — it imports wiremd as a local file dependency. This means any behaviour you observe in the CLI or the library should be identical in the preview panel.
