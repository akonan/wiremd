# CLI Reference

## Usage

```
wiremd <input> [options]
```

`<input>` is a path to a `.md` file or a directory. Directory mode requires `--serve` or `--watch`.

## Flags

| Flag | Alias | Type | Default | Description |
|------|-------|------|---------|-------------|
| `--output <file>` | `-o` | string | `<input>.html` (or `.json`) | Output file path |
| `--format <format>` | `-f` | `html` \| `json` | `html` | Output format |
| `--style <style>` | `-s` | see below | `sketch` | Visual style applied to the HTML output |
| `--watch` | `-w` | boolean | — | Watch for file changes and regenerate |
| `--serve <port>` | — | number | — | Start a dev server with live-reload on the given port |
| `--watch-pattern <glob>` | — | string | — | Override the glob pattern of files to watch |
| `--ignore <glob>` | — | string | — | Additional glob pattern to exclude from watching |
| `--pretty` | `-p` | boolean | `true` | Pretty-print output |
| `--help` | `-h` | — | — | Print help and exit |
| `--version` | `-v` | — | — | Print version and exit |

### `--style` values

| Value | Description |
|-------|-------------|
| `sketch` | Balsamiq-inspired hand-drawn look (default) |
| `clean` | Modern minimal design |
| `wireframe` | Traditional grayscale with hatching |
| `none` | Unstyled semantic HTML |
| `tailwind` | Utility-first design with purple accents |
| `material` | Google Material Design with elevation |
| `brutal` | Neo-brutalism with bold colors and thick borders |

### `--format` values

Only `html` and `json` are supported by the CLI. (`react` and `tailwind` are available via the [programmatic API](/api/renderer) but not as CLI output formats.)

## Examples

```bash
# One-shot render with default settings (sketch style, HTML output)
wiremd wireframe.md

# Write to a specific file
wiremd wireframe.md -o dist/wireframe.html

# Use the clean style
wiremd wireframe.md --style clean

# Serve with live-reload on port 3000, watching for changes
wiremd wireframe.md --serve 3000 --watch

# Output JSON AST
wiremd wireframe.md --format json -o wireframe.json

# Directory mode: serve an entire folder of .md files
wiremd ./screens --serve 3001
```

## Flag interactions

**`--serve` starts a server but does not auto-enable `--watch`.** The server will reflect regenerated output only when `--watch` is also set (or when the input is a directory, which implicitly watches).

**`--watch` without `--serve`** regenerates the output file on disk but does not start a server.

**Default output path**: when `-o` is omitted, wiremd writes `<input>.html` (or `<input>.json` when `--format json`). The input `.md` extension is replaced.

**Directory mode**: passing a directory as `<input>` requires at least `--serve` or `--watch`. wiremd watches all `**/*.md` files under the directory. If an `index.md` exists it is used as the default page for `--serve`. Single-file output flags (`-o`) are ignored in directory mode.

**`--watch-pattern`** replaces the default watch glob entirely. Use it to watch files outside the input directory, or to narrow the scope (e.g. `"src/**/*.md"`).

**`--ignore`** appends to the built-in ignore list (`**/node_modules/**`, `**/.git/**`, `**/dist/**`, `**/build/**`). It does not replace it.
