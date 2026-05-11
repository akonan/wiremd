::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Row

`::: row` creates a horizontal flex row. Use it to align buttons, filters, or any inline elements.

## Basic Row

::: demo

::: row
[All]* [Active] [Archived]
:::

:::

## Row with Alignment

Add `{.right}` or `{.center}` to align all content.

::: demo

::: row {.right}
[Export] [+ New Item]*
:::

:::

::: demo

::: row {.center}
Page 1 of 12   [← Prev] [Next →]
:::

:::

## Explicit Items with Per-item Alignment

Use `###` headings inside `::: row` to control each item's alignment independently.

::: demo

::: row

### {.left}
[All]* [Active] [Archived]

### {.right}
[+ New Item]*

:::

:::

## Mixed Content

Text, badges, icons, and buttons can be combined freely in a row.

::: demo

::: row
Inbox |24|{.primary}
:::

:::

::: demo

::: row
:check:

All systems operational |Live|{.success}
:::

:::

::: demo

::: row
:user:

John Doe |Admin|{.warning}

[Edit] [Remove]{.danger}
:::

:::

## Search and Filters

::: demo

::: row
[Search___________]{type:search} [All Teams_______] [This Week_______]
:::

:::

## Toolbar Pattern

::: demo

::: row

### {.left}
**Projects** |12|{.primary}

### {.right}
[Filter] [Sort] [+ New Project]*

:::

:::

## Syntax

```
::: row
[A] [B] [C]           implicit items, left-aligned
:::

::: row {.right}      right-align all content
::: row {.center}     center all content

::: row
### {.left}           explicit items with per-item alignment
content
### {.right}
content
:::
```

:::

:::
