# Getting Started with wiremd

This guide will help you get started with wiremd, a text-first UI design tool for creating wireframes using Markdown syntax.

## Installation

Install wiremd using your preferred package manager:

```bash
# npm
npm install wiremd

# yarn
yarn add wiremd

# pnpm
pnpm add wiremd
```

For global CLI access:

```bash
npm install -g wiremd
```

## Your First Wireframe

Create a new file called `my-wireframe.md`:

```markdown
## Login Form

Email
[_____________________________]{type:email}

Password
[_____________________________]{type:password}

[Login]{.primary} [Forgot Password?]{.link}
```

### Render to HTML

Using the CLI:

```bash
wiremd my-wireframe.md -o login.html
```

Using the API:

```typescript
import { parse, renderToHTML } from 'wiremd';
import { readFileSync, writeFileSync } from 'fs';

const markdown = readFileSync('my-wireframe.md', 'utf-8');
const ast = parse(markdown);
const html = renderToHTML(ast);
writeFileSync('login.html', html);
```

## Basic Concepts

### Components

wiremd supports many UI components:

- **Forms**: inputs, textareas, buttons, selects
- **Layout**: sections, containers, grids
- **Navigation**: nav bars, breadcrumbs, tabs
- **Content**: headings, paragraphs, images, icons

### Syntax Elements

1. **Headings** - Define sections and structure
2. **Brackets** - Create inputs and buttons `[...]`
3. **Attributes** - Add properties `{type:email required}`
4. **Classes** - Style components `{.primary}`
5. **Containers** - Group elements `:::`

## Visual Styles

wiremd comes with multiple visual styles:

- `sketch` - Balsamiq-inspired hand-drawn (default)
- `clean` - Modern minimal design
- `wireframe` - Traditional grayscale
- `material` - Material Design
- `tailwind` - Tailwind-inspired
- `brutal` - Brutalist design
- `none` - Unstyled semantic HTML

Change style with the `--style` flag:

```bash
wiremd my-wireframe.md --style clean
```

## Watch Mode

For rapid iteration, use watch mode with live-reload:

```bash
wiremd my-wireframe.md --watch --serve 3000
```

Open http://localhost:3000 in your browser. Changes to your markdown file will automatically reload.

## Next Steps

- [Learn the complete syntax](./syntax.md)
- [Explore examples](../examples/)
- [Read API documentation](../api/)
- [Check the syntax specification](../../SYNTAX-SPEC-v0.1.md)
