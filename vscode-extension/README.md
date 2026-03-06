# Wiremd Preview Extension

VS Code extension with two complementary preview modes:
- Custom Wiremd Webview panel (commands + toolbar + viewport/style controls)
- Built-in Markdown preview integration for `wiremd` fenced blocks
- Direct support for `*.wmd` files (associated to Markdown)
- Wiremd syntax highlighting injected into Markdown
- Wiremd Language Server support (completion, hover, signature hints, diagnostics, semantic tokens)

## Built-in Markdown preview mode

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

## Syntax Highlighting

The extension injects a TextMate grammar into Markdown for wiremd-specific syntax:

- Button syntax: `[Text]`
- Input syntax: `[___]`, `[***]`
- Container syntax: `::: type ... :::`
- Inline container syntax: `[[ ... ]]`
- Attributes: `{.class}`, `{key:value}`, boolean attributes

Container types use dedicated scopes (`hero`, `card`, `modal`, etc.) so themes can color them differently.

## Language Server Features

The bundled wiremd LSP server currently provides:

- Context-aware autocompletion for container types and attributes
- Input type suggestions after `type:`
- Snippet completions for common patterns
- Hover docs for wiremd syntax
- Signature help inside attribute blocks
- Diagnostics for common syntax/typing issues
- Semantic tokens for richer highlighting

Manual QA checklist (including scope inspection): `docs/manual-validation-checklist.md`.

## Notes

- Markdown preview integration is done through `contributes.markdown.markdownItPlugins` + `extendMarkdownIt`.
- HTML rendering is isolated per fence block (scoped CSS + unique class prefix), so styles from one `wiremd` block do not leak into the rest of the Markdown preview.
- Fence option syntax is order-independent; examples:
	- `wiremd material`
	- `wiremd html wireframe`
	- `wiremd json`
- Custom Webview panel commands:
	- `Wiremd: Open Preview`
	- `Wiremd: Open Preview to the Side`
	- `Wiremd: Refresh Wiremd Preview`
	- `Wiremd: Change Preview Style`
	- `Wiremd: Change Preview Viewport`
