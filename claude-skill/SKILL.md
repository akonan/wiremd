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
- [Dashboard](#)
- **[Reports](#)**
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
- [Overview](#)
- **[Reports](#)**
- [Analytics](#)
- [Users](#)

---

### Filters

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
3. **`[[ ]]` nav doesn't support hrefs.** Links inside `[[ ]]` silently drop the URL. Use plain markdown links for cross-page navigation.
4. **`:::accordion` doesn't exist.** Use `::: tabs` with `::: tab Label` children for tabbed panels. For a simple button-group switcher, use `[Tab]*  [Other]`.
5. **Use `![[file.md]]` for includes, not `:::display`.** `:::display` is obsolete. `![[path/to/file.md]]` works in both the CLI and VS Code preview — path resolves relative to the current file.

---

## Reference files

- `references/quick-reference.md` — one-page cheat sheet for all components (copied from QUICK-REFERENCE.md at build time)
- `references/syntax.md` — full syntax, all attributes, disambiguation rules, component mapping, gotchas
- `references/styles.md` — style guide with visual descriptions and use cases
- `references/vscode.md` — VS Code extension install and live-preview workflow
- `references/examples/dashboard.md` — renderable dashboard wireframe (point user to this path)
- `references/examples/settings-form.md` — renderable settings/form wireframe (point user to this path)
