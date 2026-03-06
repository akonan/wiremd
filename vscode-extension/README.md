# Wiremd Markdown Preview Extension

Minimal VS Code extension that customizes built-in Markdown preview rendering.

## What it does

1. Detects and replaces **all** fenced code blocks tagged as `wiremd` in Markdown preview.
2. Parses each block with `wiremd.parse`.
3. Supports per-block output view:
	- `html` (default)
	- `json` (renders the `DocumentNode` as JSON)
4. Supports per-block style selection for HTML view:
	- `sketch` (default), `clean`, `wireframe`, `none`, `tailwind`, `material`, `brutal`

## Example

Input markdown:

````markdown
```wiremd
## Card
[Click me]
```

```wiremd clean
## Hero
[Get Started]*
```

```wiremd json
## Debug AST
[Button]
```
````

Preview behavior:

- `wiremd` block with no options renders as HTML using `sketch` style.
- `wiremd clean` renders as HTML using `clean` style.
- `wiremd json` renders parsed `DocumentNode` in a JSON code block.

## Install (local)

From `vscode-extension/`:

```bash
npm install
npm run compile
npm run package
code --install-extension ./wiremd-preview-0.1.0.vsix
```

## Development

```bash
npm install
npm run compile
npm test
```

## Notes

- This extension intentionally does **not** provide a custom webview preview panel.
- Integration is done through `contributes.markdown.markdownItPlugins` + `extendMarkdownIt`.
- HTML rendering is isolated per fence block (scoped CSS + unique class prefix), so styles from one `wiremd` block do not leak into the rest of the Markdown preview.
- Fence option syntax is order-independent; examples:
	- `wiremd material`
	- `wiremd html wireframe`
	- `wiremd json`
