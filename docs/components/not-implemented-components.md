::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Not Implemented Components

Components not yet in wiremd, with proposed syntax aligned to wiremd's design principles. All proposals follow the existing patterns: `{key:value}` attributes for progressive enhancement, `:::` containers for block components, and visually intuitive ASCII-like syntax.

> **Already supported but easy to miss:** file upload (`[_____]{type:file}`), color input (`[_____]{type:color}`).

::: grid-3 card

### UI Components
Accordion
[[Jump →](#ui-components)]

### Inputs
Switch, Slider, Rating, Autocomplete, Toggle Button Group, Chip Input
[[Jump →](#inputs)]

### Feedback
Snackbar, Linear Progress, Skeleton, Tooltip, Backdrop
[[Jump →](#feedback)]

### Navigation
Drawer, Menu, Pagination, Stepper, Bottom Navigation, Tree View
[[Jump →](#navigation)]

### Data Display
Avatar, Chip, Timeline, DataGrid
[[Jump →](#data-display)]

### Surfaces
Paper, Speed Dial
[[Jump →](#surfaces)]

:::

---

## UI Components

::: grid-2

### Accordion

Collapsible content sections. Used for FAQs, settings panels, and expandable detail rows.

The syntax parses correctly — `::: accordion` with `###` items — but the renderer has no implementation and produces unstyled output:

```
::: accordion
### Frequently Asked
Answer text here.

### Another Question
Answer text here.
:::
```

Each `###` heading inside `::: accordion` would become a collapsible item.

:::

---

## Inputs

::: grid-2

### Switch / Toggle

On/off toggle. Appears in settings panels, feature flags, and forms.

Extends input `{type:...}` pattern — consistent with how `{type:email}` and `{type:password}` change input behavior:

```
[_]{type:switch}            <!-- off -->
[_]{type:switch :checked}   <!-- on -->
```

### Slider / Range

Drag-to-select a value within a range. Used for price filters, volume, brightness.

ASCII track with thumb position — visually shows where the value sits:

```
[--------●--]{min:0 max:100 value:70}
[●-----------]{min:0 max:100 value:0}
```

### Rating

Star rating. Used in reviews, feedback forms, dashboards.

Unicode stars inside brackets — follows the same pattern as emoji in buttons (`[:heart: Like]`):

```
[★★★☆☆]
[★★★★☆]{max:5}
```

### Autocomplete

Text input with a filtered dropdown of suggestions. Common in search, address, and tagging flows.

Same as `[Select___v]` + list — the `v` suffix and following list already express this:

```
[_____v]{autocomplete}
- Option A
- Option B
- Option C
```

### Toggle Button Group

Segmented control. Used for view-mode switches (list/grid), alignment, and filters.

A `::: row` with a class modifier — row already creates a flex button container, `.toggle-group` styles it as a segmented control:

```
::: row {.toggle-group}
[List]* [Grid] [Map]
:::
```

### Chip Input

Multi-value input where each value renders as a removable chip. Used for tags, recipients, filters.

Extends the badge `|...|` syntax — chips are badges with a `×` and the trailing input is a regular text input:

```
|Design ×|{.chip} |React ×|{.chip} [_____]
```

:::

---

## Feedback

::: grid-2

### Snackbar / Toast

Temporary bottom-screen notification. Used for success/error confirmations after actions.

New container type — follows the same `{.variant}` pattern as `::: alert`:

```
::: snackbar {.success}
Changes saved
:::

::: snackbar {.error}
Something went wrong. [Retry]
:::
```

### Linear Progress

Horizontal progress bar. Used for upload progress, form completion, loading states.

ASCII track is visually intuitive — `=` characters show completion, `-` shows remainder:

```
[=========>----------]{progress:45}
[==========>{.indeterminate}]
```

### Skeleton

Shimmer placeholders that match the shape of real content. Used during async loading.

Container wrapping underscore placeholders — `___` already means "blank" in wiremd:

```
::: skeleton
### _______________
__________________________________________
__________________________________________
[________]{.btn}
:::
```

### Tooltip

A small label that appears on hover. Describes icons, truncated text, and disabled elements.

Attribute on any existing element — follows the `{key:value}` progressive enhancement principle:

```
[:info:]{tooltip:"Passwords must be 8+ characters"}
[Delete]{.danger tooltip:"This cannot be undone"}
[?]{tooltip:"More information"}
```

### Backdrop

Dimmed full-screen overlay behind modals and drawers. Currently implied by `:::modal` but not independently expressible.

Wrapper container — nests around existing modal/drawer containers:

```
::: backdrop
::: modal
### Confirm action
Are you sure?
[Confirm]* [Cancel]
:::
:::
```

:::

---

## Navigation

::: grid-2

### Drawer

Slide-in side panel for secondary navigation or detail views. Common in mobile and dashboard layouts.

New container type with positional class modifier — mirrors how `::: sidebar` works but as an overlay:

```
::: drawer {.left}
[[Home](./index.md)]
[[Settings](./settings.md)]
[Logout]{.danger}
:::
```

### Menu

Dropdown context menu — distinct from `[Select___v]`. Used for action menus, kebab menus, right-click menus.

Icon or button + following list — mirrors the dropdown pattern (element + list = options):

```
[:more-vertical:]{menu}
- Edit
- Duplicate
- Delete{.danger}
```

### Pagination

Page-navigation controls. Used in tables, search results, feeds.

Button group — `[< Prev]` and `[Next >]` parse as plain buttons (no URL), `*` marks the current page:

```
[< Prev] [1] [2]* [3] [4] [Next >]
[< Prev]{disabled} [1]* [2] [3] [Next >]
```

### Stepper

Multi-step progress indicator. Used in checkout flows, onboarding, multi-page forms.

New container using `###` items — same boundary convention as `::: grid-N`:

```
::: stepper
### Account {.active}
### Profile
### Confirm
:::
```

### Bottom Navigation

Mobile tab bar fixed to the bottom. Used in mobile-first apps.

New container type — button links with icons follow the existing `[[:icon: Label]]` pattern:

```
::: bottom-nav
[[:home: Home]*]
[[:search: Explore]]
[[:bell: Alerts]]
[[:user: Profile]]
:::
```

### Tree View

Collapsible hierarchical list. Used in file browsers, org charts, nested category navigation.

Container wrapping native Markdown nested lists — no new syntax for content, just a styled wrapper:

```
::: tree
- ▶ src/
  - ▶ components/
    - Button.tsx
    - Input.tsx
  - index.ts
- package.json
:::
```

:::

---

## Data Display

::: grid-2

### Avatar / AvatarGroup

User photo or initials placeholder. Used in comments, lists, headers, and assignments.

Extends image syntax — `![alt](src)` already works; avatar is an image with a class. Initials use `#` as a placeholder src:

```
![JD](#){.avatar}             <!-- initials -->
![](photo.jpg){.avatar}       <!-- photo -->
![JD](#){.avatar} ![AB](#){.avatar} [+3]{.avatar}  <!-- group -->
```

### Chip

Compact, optionally removable label. Distinct from badge — chips are interactive and can be dismissed. Used for tags, filters, selections.

Extends badge `|...|` syntax — static chip is a badge with `.chip` class; removable adds `×`:

```
|React|{.chip}      <!-- static chip -->
|Design ×|{.chip}   <!-- removable chip -->
```

### Timeline

Vertical sequence of events with connectors. Used in activity feeds, changelogs, order tracking.

New container using `###` items — same heading-as-item convention as `::: stepper` and `::: grid-N`:

```
::: timeline
### 10:00 AM {.completed}
Meeting with design team

### 2:00 PM {.active}
Code review

### 4:00 PM
Deploy to staging
:::
```

### DataGrid

Table with sort/filter/row-select state indicators. Basic tables already work; DataGrid adds interactive markers.

Extends native Markdown table syntax — sort arrows and checkboxes are rendered inline, badges show status:

```
| ☐ | Name ↑ | Status |
|----|--------|--------|
| ☑ | Alice  | |Active|{.success} |
| ☐ | Bob    | |Pending|{.warning} |
```

:::

---

## Surfaces

::: grid-2

### Paper

A plain elevated surface with shadow — no semantic type, used as a base for custom compositions.

New container type with elevation modifier via attribute:

```
::: paper {.elevation-2}
Any content here
:::
```

### Speed Dial

Floating action button that expands into a set of actions. Used in mobile and canvas UIs.

Container with a primary button trigger and a list of action buttons — mirrors the menu pattern:

```
::: speed-dial
[+]*
- [:edit: Edit]
- [:share: Share]
- [:delete: Delete]{.danger}
:::
```

:::

:::

:::
