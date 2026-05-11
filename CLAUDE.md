# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**wiremd** converts Markdown with extended wireframing syntax into visual wireframes. It ships as an npm library, a CLI tool, and a VS Code extension. Input is `.md` files with wiremd syntax; output is HTML (7 styles), React/JSX, Tailwind, or JSON.

## Commands

```bash
npm run build        # TypeScript + Vite → dist/
npm test             # Run all tests (vitest)
npm test -- tests/parser.test.ts              # Single test file
npm test -- tests/parser.test.ts -t "Button"  # Single test by name
npm run test:coverage
npm run typecheck    # Strict TypeScript check
npm run lint         # ESLint on src/
npm run docs:dev     # VitePress docs dev server
```

CLI usage (after build):
```bash
wiremd input.md --style clean --serve 3001 --watch
wiremd input.md -o output.html -f html -s sketch
```

## Architecture

The pipeline: `Markdown string → parse() → WiremdAST → render*() → HTML/React/JSON/Tailwind`

```
src/
├── types.ts                        # ~40 discriminated-union AST node types
├── index.ts                        # Public exports
├── parser/
│   ├── index.ts                    # parse() + validate(); calls resolveIncludes()
│   ├── transformer.ts              # MDAST → wiremd AST (the bulk of parsing logic)
│   ├── remark-containers.ts        # ::: block syntax plugin (supports nesting)
│   └── remark-inline-containers.ts # [[ ... ]] nav/inline syntax plugin
└── renderer/
    ├── index.ts                    # renderToHTML(), renderToReact(), renderToJSON(), renderToTailwind()
    ├── html-renderer.ts            # Component → HTML string (handles all node types)
    ├── react-renderer.ts           # Component → React/JSX string
    ├── tailwind-renderer.ts        # Component → Tailwind-classed HTML
    └── styles.ts                   # 7 CSS style systems (sketch, clean, wireframe, material, brutal, tailwind, none)
```

**Parser flow**: unified/remark parses standard Markdown into MDAST, then `remark-containers` and `remark-inline-containers` handle wiremd-specific syntax (`::: card`, `[[ nav ]]`, buttons `[Label]*`, inputs `[_____]`). The transformer walks the MDAST and emits wiremd AST nodes.

**Styles**: Each visual style is a self-contained CSS string in `styles.ts`. The `sketch` style uses Comic Sans / hand-drawn look; `clean` is modern minimal; `wireframe` is traditional grayscale. Passed as `{ style: 'clean' }` to render functions.

**CLI** (`src/cli/index.ts`): arg parsing → calls parse()+render() → optionally starts a chokidar watcher + WebSocket live-reload server (`src/cli/server.ts`). The `bin/wiremd.js` wrapper loads the ESM CLI module.

**VS Code extension** (`vscode-extension/`): `src/extension.ts` registers commands; `src/preview-provider.ts` is the WebView that embeds the rendered HTML and refreshes on save. Depends on the parent package via `"wiremd": "file:.."`.

**VS Code extension local development**: uninstall any installed Wiremd extension, then launch VS Code with the dev build loaded into your current window:
```bash
code --extensionDevelopmentPath=$(pwd)/vscode-extension .
```
Run both watchers in parallel terminals:
```bash
npm run dev                              # root: rebuilds dist/ on src/ changes
cd vscode-extension && npm run dev       # extension: rebuilds dist/ on changes
```
After edits rebuild: `Cmd+Shift+P` → "Developer: Reload Window".

## Testing

Tests live in `tests/`. 515 tests across 14 files. Key files: `parser.test.ts` (29 tests), `renderer.test.ts`, `react-renderer.test.ts`, `tailwind-renderer.test.ts`, `integration.test.ts`, `cli.test.ts`, `cli-unit.test.ts`, `server.test.ts`, `error-handling.test.ts`, `validation.test.ts`, `api-examples.test.ts`. Vitest with node environment; globals enabled. Assert on `renderToHTML(parse(md), { style: 'sketch' })` for renderer tests.

## Build output

`vite.config.ts` emits both ESM (`dist/index.mjs`) and CJS (`dist/index.cjs`) with TypeScript declarations. The CLI entry is excluded from the library bundle and built separately.
