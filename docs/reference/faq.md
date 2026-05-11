# FAQ & Troubleshooting

## Table of Contents

- [Getting Started](#getting-started)
- [Syntax Questions](#syntax-questions)
- [Components](#components)
- [Layout & Styling](#layout--styling)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### What is wiremd?

wiremd is a text-first UI design tool that converts Markdown with extended wireframing syntax into visual wireframes. Write your UI in plain text; render it as HTML with various visual styles, as a React component, as Tailwind-classed HTML, or as JSON.

### What Markdown flavor does wiremd use?

wiremd is built on standard CommonMark Markdown (via unified/remark) with custom extensions for UI components. All standard Markdown syntax works as expected:

| Syntax | Example |
|--------|---------|
| Headings | `# H1`, `## H2`, `### H3` … `###### H6` |
| Bold | `**bold**` |
| Italic | `*italic*` |
| Code (inline) | `` `code` `` |
| Link | `[text](url)` |
| Image | `![alt](image.jpg)` |
| Unordered list | `- item` |
| Ordered list | `1. item` |
| Blockquote | `> quoted text` |
| Table | `\| col \| col \|` with `---` separator row |
| Horizontal rule | `---` |
| Fenced code block | ` ``` ` … ` ``` ` |

The extensions add three things on top: `:::` container blocks for layout and component grouping, `[[ ]]` inline containers for navigation bars, and inline button/input shorthand such as `[Label]*` and `[_____]`.

### Can I use wiremd without installing anything?

wiremd requires Node.js. Install it as a library (`npm install wiremd`) for programmatic use, or install it globally (`npm install -g wiremd`) to use the `wiremd` CLI command. There is no web-based playground at this time.

### Where can I find a quick lookup of all syntax?

See the [Components reference](../components/) for all syntax and components.

---

## Syntax Questions

### How does wiremd distinguish a button from a link?

A button uses square brackets with no URL: `[Label]`. A standard Markdown link uses square brackets followed by a URL in parentheses: `[Label](https://example.com)`. wiremd sees any bare `[Label]` (or `[Label]*` for primary, `[Label]{variant:danger}` for variants) as a button node, and any `[Label](url)` as a link node.

### How does label association work for inputs?

A line of plain text immediately above an input line — with no blank line between them — is treated as that input's label. A blank line breaks the association and the text is rendered as a paragraph instead.

### What is the `![[path.md]]` syntax for?

`![[path.md]]` is the file-include syntax. When wiremd parses a file it first runs `resolveIncludes`, which finds every `![[relative/path.md]]` pattern outside of fenced code blocks and replaces it with the contents of the referenced file. This lets you split large wireframes into reusable partials. Includes inside code fences are left untouched.

### Are attribute curly braces part of standard Markdown?

No. The `{key:value}` and `{.class}` attribute syntax is a wiremd extension. Attributes must appear immediately after the element they modify (one space is acceptable). They apply to the directly preceding element — a button, input, heading, or container.

---

## Components

### What input types are supported?

All standard HTML5 input types can be specified via the `type` attribute:

```markdown
[_____________________________]{type:text}
[_____________________________]{type:email}
[_____________________________]{type:password}
[_____________________________]{type:tel}
[_____________________________]{type:url}
[_____________________________]{type:number}
[_____________________________]{type:date}
[_____________________________]{type:search}
[_____________________________]{type:file}
```

### How do radio buttons and checkboxes work?

Checkboxes use standard Markdown task list syntax — `- [x]` for checked, `- [ ]` for unchecked. Radio buttons use a parenthesis variant — `- (*)` for selected, `- ( )` for unselected. wiremd maps these to the appropriate input types in the rendered HTML.

### Are tabs supported?

Yes. Use `::: tabs` with `::: tab Label` children:

```markdown
::: tabs

::: tab Overview
Content for first tab.
:::

::: tab Settings
Content for second tab.
:::

:::
```

### What about accordions?

Accordion syntax (`::: accordion`) parses correctly but is **not yet rendered** — the renderer has no implementation for it. It falls back to unstyled output. See the [Not Implemented](/components/not-implemented-components) page for the planned syntax.

### What button variants are available?

Three: `primary`, `secondary`, and `danger`. Use the asterisk shorthand for primary (`[Submit]*`), or the `variant` key-value attribute for any variant:

```markdown
[Submit]*                   # Primary — preferred shorthand
[Submit]{variant:primary}   # Primary — explicit form
[Cancel]{variant:secondary} # Secondary
[Delete]{variant:danger}    # Danger/destructive
```

**Note:** `{.primary}`, `{.secondary}`, and `{.danger}` (dot-prefix class syntax) add raw CSS classes, not variant classes. They have no built-in style definitions and will not produce styled buttons. Use `*` or `{variant:name}` instead.

### Can I create disabled or loading button states?

Yes, using the `state` attribute:

```markdown
[Submit]{state:disabled}
[Processing...]{state:loading}
[Saved]{state:success}
[Error]{state:error}
```

**Note:** `{disabled}` (boolean syntax without `state:`) works on inputs, textareas, and selects, but is silently ignored on buttons. Always use `{state:disabled}` for buttons.

---

## Layout & Styling

### What grid sizes are available?

`grid-2` through `grid-5` (2, 3, 4, or 5 equal columns). Add `card` to get card chrome on each cell. On small viewports the columns collapse to a single column via CSS media queries.

### Can containers be nested?

Yes. The `:::` container syntax supports arbitrary nesting. The remark-containers plugin tracks depth so an inner `:::` closes only its own block, not the outer one.

### What visual styles does the CLI support?

Seven styles, passed with `--style`:

| Style | Description |
|---|---|
| `sketch` | Balsamiq-inspired hand-drawn look (default) |
| `clean` | Modern minimal design |
| `wireframe` | Traditional grayscale with hatching |
| `material` | Google Material Design with elevation |
| `brutal` | Neo-brutalist with bold colors and thick borders |
| `tailwind` | Utility-first design with purple accents |
| `none` | Unstyled semantic HTML |

### What output formats are available?

The CLI supports `--format html` (default) and `--format json`. The Node.js API additionally exposes `renderToReact()` for JSX/TSX output and `renderToTailwind()` for Tailwind-classed HTML — these are not available as CLI flags and must be called programmatically.

### How are custom CSS classes applied?

Use the `{.classname}` attribute syntax on any element. Multiple classes can be space-separated within the same braces:

```markdown
[Button]{.btn .btn-lg .custom}

::: card {.highlight-card}
Content
:::
```

Classes are passed through to the rendered HTML element unchanged.

### Does wiremd generate JavaScript interactions?

No. wiremd generates static HTML (or JSX/JSON). Components such as tabs, accordions, and modals produce the correct semantic markup and ARIA-friendly structure, but client-side behaviour (switching tabs, expanding accordion items) must be provided by your own CSS and JavaScript, or by the framework you use with the React output.

---

## Getting Help

### Where is the complete syntax specification?

See the [Components reference](../components/) for all syntax and components, and [JSON Schema](../api/json-schema.md) for the JSON output schema.

### How do I report a bug or request a feature?

Search existing issues first at [github.com/teezeit/wiremd/issues](https://github.com/teezeit/wiremd/issues). If your issue is not there, open a new one with a minimal reproduction (the smallest wiremd source that demonstrates the problem), the expected output, and the actual output. For feature requests, include a description, your use case, and an example of what the syntax might look like.

---

## Troubleshooting

### `wiremd: command not found`

Install globally or use npx:

```bash
npm install -g wiremd   # then: wiremd file.md
# or without installing:
npx wiremd file.md
```

### Port already in use (`EADDRINUSE`)

`--serve` requires an explicit port. If it's taken, pick another:

```bash
wiremd file.md --serve 3001
```

### Buttons appear as plain text

Check for extra spaces or missing brackets:

```markdown
[Submit]*        ✓
[ Submit ]       ✗ extra spaces
[Submit          ✗ missing closing bracket
```

### Input fields not recognised

The input must have enough underscores (at least 3) and no blank line between the label and the field:

```markdown
Username              ✓ label directly above
[_____________________________]

Username              ✗ blank line breaks association

[_____________________________]
```

### Grid columns not appearing

Each column needs a `###` heading inside the container:

```markdown
::: grid-3 card

### Column 1
Content

### Column 2
Content

:::
```
