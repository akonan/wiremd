---
name: wireframe
description: >-
  Create and render wireframes using wiremd — a text-first tool that converts Markdown into visual
  HTML mockups. Use this skill whenever the user wants to wireframe, mockup, prototype, or sketch
  a UI screen — from a description, Jira ticket, PRD, existing React/JSX, or rough idea. Also
  trigger on: "draw a login page", "show what this would look like", "create a mockup", "design
  a screen for X", "sketch the UI", "prototype this flow", "document this component as a
  wireframe", or any request to render or preview a .md wireframe file. When in doubt, use this
  skill — it's better to invoke it unnecessarily than to miss it.
---

# Wireframe Skill

Write a wiremd `.md` file, render it, and iterate. wiremd converts plain Markdown with extended
syntax into visual wireframes — 7 styles, no design tools needed.

## Workflows

### 1. Create from a description or spec
1. Understand the screen's purpose — what does the user accomplish here?
2. Sketch structure top-to-bottom: nav → layout → content sections → forms/data → off-screen elements (modals)
3. Write the wiremd file using the quick reference below
4. Render and tell the user where to open it

### 2. Document an existing component or screen
1. Read the JSX/TSX component tree — focus on structure, not logic
2. Map components to wiremd equivalents (see `references/syntax.md` → Component mapping table)
3. Write top-to-bottom following visual flow
4. **Capture:** layout, navigation, form fields/labels, button labels, table columns, states
5. **Skip:** exact colors, event handlers, API calls, business logic

---

## Before you render

Answer three questions up front — they determine what you build and how you hand it back.

**1. What wiremd version is available?** Run `wiremd --version`. Require **≥ 0.1.7** for:

- `::: layout {.sidebar-main}` — proper sidebar CSS (stock 0.1.5 stacks vertically)
- `[[ [Label](./page.md) | ... ]]` — cross-page hrefs in nav (stock 0.1.5 drops them silently)
- `![[file.md]]` — shared partial includes

If older, build from source: `git clone https://github.com/teezeit/wiremd && cd wiremd && npm install && npm run build`, then invoke via `node path/to/wiremd-fork/bin/wiremd.js`.

**2. Single page or multi-page?** Ask the user up front. For multi-page, scaffold from the start — don't bolt on later:

- `_nav.md` shared across all pages via `![[_nav.md]]`
- `_sidebar.md` if using sidebar layout
- one `.md` per page at top level

See `references/multi-page.md` for folder layout, cross-page link syntax, and the rebuild recipe.

**3. Which render route does this environment support?** Triage by the tools Claude actually has — not by product name. See `references/rendering-modes.md` for the full table.

- **Write files + run shell** (Claude Code, VS Code+terminal, Cowork/Desktop with filesystem + code-execution tools) → **files in folder** is the default. Render `.html` into the user's folder; they open via `file://` or double-click.
- **User is on their own local terminal** → `--serve PORT --watch` for live iteration.
- **Chat only (no filesystem, no exec)** → hand off the `.md` and direct the user to `https://tobiashoelzer.com/wiremd/editor` to paste and render.
- **Never hand out a sandbox `localhost:PORT` URL** — it binds to Claude's host, not the user's. When in doubt, write HTML to the folder.

---

## Rendering

```bash
# Live preview in browser with hot reload
wiremd my-screen.md --style clean --serve 3001 --watch

# Build to a static HTML file
wiremd my-screen.md -o output.html -s clean

# VS Code: Cmd+Shift+P → "wiremd: Open Preview" (live preview while editing)
# See references/vscode.md for extension install steps
```

Tell the user: open `http://localhost:3001` for live preview, or the HTML path for a static file.

To screenshot and verify from the CLI:
```bash
npx playwright screenshot --browser chromium --full-page "file://$(pwd)/output.html" /tmp/wf-check.png
```
Then read the PNG with the Read tool.

---

## Style picker

Default to `clean` unless the user specifies otherwise. See `references/styles.md` for full descriptions.

| Style | Best for |
|-------|----------|
| `sketch` | Early ideation, lo-fi client presentations |
| `clean` | Stakeholder review, internal handoff (default) |
| `wireframe` | Low-fidelity explorations, documentation |
| `material` | Material Design apps |
| `tailwind` | Tailwind-based products, indigo/purple palette |
| `brutal` | Bold, high-contrast concepts |
| `none` | Custom CSS, embedding elsewhere |

---

## Quick reference

For the full syntax including all attributes, edge cases, and disambiguation rules, read `references/syntax.md`.

```markdown
# Navigation & breadcrumbs
[[ :logo: Brand | Home | *Active* | :user: Profile | [Sign Up]* ]]
[[ Home > Section > Current Page ]]

# Sidebar-main layout
::: layout {.sidebar-main}

::: sidebar

[[Dashboard](#)]
[[Reports](#)]

:::

::: main
### Page Title
:::

:::

# In-page tabs — use a button group, * marks the active tab
[Overview]* [Details] [Raw Data]

# Buttons
[Primary]* [Secondary]{.secondary} [Outline]{.outline}
[Danger]{variant:danger} [Disabled]{state:disabled} [Saving...]{state:loading}

# Inputs — label must be on the line DIRECTLY above (no blank line)
Email
[_____________________________]{type:email required}

Password
[*****************************]{type:password required}

Notes
[Your message here...]{rows:4}

Role
[Select role_____________v]
- Admin
- Editor
- Viewer

- [ ] Unchecked   - [x] Checked
- ( ) Option A    - (*) Option B (selected)

# Row — horizontal group of inputs, filters, or actions
::: row
[Search_______________]{type:search}
[All Teams___________v]
- All Teams
- Team A
:::

# Row, right-aligned
::: row {.right}
[+ New Item]*
:::

# Section header with right-aligned action — VERY COMMON PATTERN
::: grid-2
### Section Title

### {.right}

[+ Add Item]*

:::

# KPI metric card
::: grid-3
### Total Revenue
**$124,500**
↑ 8% vs last period

### Active Users
**3,842**
↑ 12% vs last period

### Conversion
**4.2%**
↓ 0.3% vs last period

:::

# Grid — layout only, equal columns, no card chrome
::: grid-3
### Revenue
$124,500
### Users
3,842
### Conversion
4.2%
:::

# Grid of cards — each item gets card styling
::: grid-3 card
### :rocket: Organic
42% of traffic
:::

# Table
| Name  | Role  | Status  | Actions         |
|-------|-------|---------|-----------------|
| Alice | Admin | Active  | [Edit] [Remove] |

# Icons — use anywhere in text, headings, nav, buttons
:home: :user: :gear: :chart: :bell: :shield: :rocket: :check: :x: :search: :edit: :trash: :plus:

# Badges / pills — inline status labels and counts
|Active|{.success}  |Pending|{.warning}  |Failed|{.error}  |New|{.primary}  |Draft|

# Card, alert
::: card
Content here
:::

::: alert success
Changes saved.
:::

# Annotations for states and design notes
> **Loading state:** spinner + "Loading..."
> **Empty state:** "No items yet" + [Add Item]*
> **Design note:** Only visible to Admin users.

# Modals go after --- at the bottom of the file
---
## Modals & Dialogs
> Not visible on page load.
::: modal
## Confirm Delete
Are you sure?

[Delete]{variant:danger} [Cancel]

:::
```

---

## Composite example

A dashboard with sidebar, in-page tabs, a metrics grid, a grid of cards, and a data table.
See the renderable version at `references/examples/dashboard.md`.

```markdown
[[ :logo: AppName | Dashboard | *Reports* | :gear: Settings | :user: Account ]]
[[ Dashboard > Reports ]]

::: layout {.sidebar-main}

::: sidebar

#### Navigation

[[Overview](#)]
[[Reports](#)]
[[Analytics](#)]
[[Users](#)]

---

#### Filters

[Jan 2025____________v]
- Last 7 days
- Last 30 days
- This quarter

[Apply Filters]*

:::

::: main

### Monthly Reports

[Summary]* [Details] [Raw Data]

---

::: grid-3

### Total Revenue
$124,500

### Active Users
3,842

### Conversion Rate
4.2%

:::

---

::: grid-3 card

### :rocket: Organic Search
**42%** of traffic
↑ 12% vs last month

### :chart: Paid Ads
**31%** of traffic
↓ 3% vs last month

### :bell: Email
**27%** of traffic
↑ 8% vs last month

:::

---

## Recent Transactions

| Date   | Customer   | Amount | Status  |
|--------|------------|--------|---------|
| Jan 15 | Acme Corp  | $4,200 | Paid    |
| Jan 14 | Globex Inc | $1,850 | Pending |
| Jan 13 | Initech    | $3,100 | Paid    |

[Export CSV] [View All Transactions]*

:::

---

## Modals & Dialogs

> Not visible on page load.

::: modal
## Export Report

Format
[CSV_________v]
- CSV
- Excel
- PDF

[Export]* [Cancel]

:::
```

---

## Gotchas

1. **Label directly above input.** No blank line between label text and `[_____]` — it breaks the association.
2. **Blank line before `:::` when last line has inline elements.** Buttons, backtick code, bold, links, or list items on the final line of a container — add an empty line before `:::`.
3. **`[[ ]]` nav hrefs require wiremd ≥ 0.1.7.** Earlier versions silently drop the URL and every item renders as `href="#"`. Mixed static + clickable works in 0.1.7+: `[[ *Home* | [About](./about.md) | [Contact](./contact.md) ]]`.
4. **`:::accordion` doesn't exist.** Use `::: tabs` with `::: tab Label` children for tabbed panels. For a simple button-group switcher, use `[Tab]*  [Other]`.
5. **Use `![[file.md]]` for includes, not `:::display`.** `:::display` is obsolete. `![[path/to/file.md]]` works in both the CLI and VS Code preview — path resolves relative to the current file.
6. **Sandbox `--serve` is unreachable from the user's browser.** `wiremd --serve PORT` binds to `localhost` on Claude's host, not the user's. When Claude is running in Cowork/Desktop and the user is elsewhere, write HTML to a shared folder instead. See `references/rendering-modes.md`.
7. **Static HTML keeps `.md` hrefs — rewrite after build.** `wiremd x.md -o x.html` preserves `./page.md` link targets. For `file://` double-click delivery, rewrite with: `sed -i -E 's|href="\./([A-Za-z0-9_-]+)\.md"|href="./\1.html"|g' *.html`. On macOS without GNU sed, use `sed -i ''`.

---

## Reference files

- `references/quick-reference.md` — one-page cheat sheet for all components (copied from QUICK-REFERENCE.md at build time)
- `references/syntax.md` — full syntax, all attributes, disambiguation rules, component mapping, gotchas
- `references/styles.md` — style guide with visual descriptions and use cases
- `references/multi-page.md` — folder layout, shared `_nav.md`, cross-page links, rebuild recipe for `.md`→`.html` handoff
- `references/rendering-modes.md` — decision table: files-in-folder, dev server, screenshot, web-editor handoff
- `references/vscode.md` — VS Code extension install and live-preview workflow
- `references/examples/dashboard.md` — renderable dashboard wireframe (point user to this path)
- `references/examples/settings-form.md` — renderable settings/form wireframe (point user to this path)
- `references/examples/multi-page/` — minimal 2-page prototype (`_nav.md` + `index.md` + `detail.md`) demonstrating shared nav, cross-page links, and the render-and-open-html flow
