# Wiremd LSP Architecture (MVP)

## Goal

Add a language server to power wiremd IntelliSense inside Markdown files while keeping instant TextMate highlighting.

## Components

1. VS Code extension host client (`src/extension.ts`)
- Starts/stops the language client.
- Keeps existing preview features unchanged.

2. Language server (`src/lsp/server.ts`)
- Parses markdown text and wiremd syntax context.
- Provides completion, hover, signature help, diagnostics, and semantic tokens.

3. Shared syntax catalog (`src/lsp/catalog.ts`)
- Canonical lists for container types, input types, attributes, states, class shorthands, and snippets.

4. Cursor context extraction (`src/lsp/context.ts`)
- Lightweight parser to detect local editing context (`:::` declaration, `{...}` attributes, inline containers, button/input/link ambiguity).

## Capability Scope (MVP)

- `textDocument/completion`
- `textDocument/hover`
- `textDocument/signatureHelp`
- `textDocument/publishDiagnostics`
- `textDocument/semanticTokens/full`

## Highlighting Strategy

1. TextMate grammar does immediate lexical highlighting for wiremd patterns in markdown.
2. LSP semantic tokens provide additional precision for component/type/attribute semantics.

## Diagnostics Strategy

1. Primary parse validation: run `wiremd.parse` with validation options.
2. Lightweight line diagnostics for common mistakes (unknown container type, unknown input `type:` values).

## Non-Goals (MVP)

- Full AST-aware refactors and code actions.
- Workspace-wide symbol indexing.
- Dedicated `.wiremd` language id (we keep markdown compatibility first).
