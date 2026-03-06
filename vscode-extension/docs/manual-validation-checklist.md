# Manual Validation Checklist (Extension Development Host)

## Setup

1. From `vscode-extension/`, run `npm run compile`.
2. Open the repository in VS Code and press `F5` to launch Extension Development Host.
3. In the host window, open:
   - `vscode-extension/fixtures/wiremd-syntax-fixture.md`

## 1) TextMate Highlighting (#27)

Validate these visual expectations in the editor:

1. Button syntax `[Primary Action]*` has button token color and `*` primary marker highlighted.
2. Input syntax `[Email___]` and `[***]` has input token color different from button tokens.
3. Container delimiters `:::` are highlighted as container punctuation.
4. Container types (`hero`, `card`, `unknown-type`) have type scopes.
5. Inline container `[[ ... ]]` has opening/closing delimiters and separators (`|`, `>`) highlighted.
6. Attribute blocks `{...}` highlight:
   - class tokens `.nav`, `.primary`
   - keys (`type`, `rows`, `state`)
   - separators (`:`)
   - values (`email`, numbers, quoted values)
7. Markdown link `[Documentation](...)` remains highlighted as a link, not button syntax.

## 2) IntelliSense via LSP (#28)

Use cursor positions and confirm:

1. After typing `::: `, completion suggests container types (`hero`, `card`, etc.).
2. Inside `{...}`, completion suggests attribute keys and class shorthands.
3. After `type:`, completion suggests valid input types.
4. At start of an empty line, snippet completions appear (`wiremd.hero`, `wiremd.card`, etc.).
5. Hover on wiremd tokens shows short documentation.
6. Signature help appears inside attribute block and updates active parameter.

## 3) Diagnostics

1. `::: unknown-type` generates a warning diagnostic.
2. Invalid input type (`{type:not-real}`) generates a warning diagnostic.
3. Problems panel shows source `wiremd-lsp`.

## 4) Semantic Tokens + Scope Adjustments

This is the pass used to refine color scopes by component type.

1. Open `Developer: Inspect Editor Tokens and Scopes`.
2. Click each token class and verify scope intent:
   - container delimiters: `punctuation.definition.container.wiremd`
   - container type by kind: `entity.name.type.container.<type>.wiremd`
   - generic container type: `entity.name.type.container.generic.wiremd`
   - button/input cores: `meta.button.wiremd`, `meta.input.wiremd`
   - attributes: `meta.attributes.wiremd` + class/key/value scopes
3. Confirm semantic tokens from LSP are present for:
   - container type names
   - attribute keys/values
   - button/input bracket tokens
4. If two types look identical in your active theme, tune scopes (or semantic token mapping) until
   `hero`, `card`, `alert`, and `grid` are visibly distinguishable.

## 5) Snippets (package contribution)

1. Type each prefix and insert once:
   - `wiremd-hero`
   - `wiremd-card`
   - `wiremd-nav`
   - `wiremd-alert`
   - `wiremd-form`
2. Validate placeholders/tabstops work correctly.

## 6) Regression checks

1. Existing preview commands still work (`Wiremd: Open Preview`, style/viewport switching).
2. Markdown preview replacement for fenced `wiremd` blocks still works.
3. No activation errors in Extension Host output.
