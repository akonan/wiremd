::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Grid

`::: grid-N` creates an N-column layout. `###` headings inside become column items.

## Layout Grid (no card chrome)

Useful for multi-column forms or content — no visual borders on items.

::: demo

::: grid-2

### Billing address
First name
[_____________________________]{required}

Last name
[_____________________________]{required}

### Shipping address
First name
[_____________________________]{required}

Last name
[_____________________________]{required}

:::

:::

## Card Grid

Add `card` after the column count to give each item card styling.

::: demo

::: grid-3 card

### Fast
Renders in milliseconds. Works in any editor.

### Simple
Plain Markdown syntax. No new tools to learn.

### Flexible
7 styles. Outputs HTML, React, JSON, or Tailwind.

:::

:::

## Column Spanning

Add `{.col-span-N}` to a `###` heading to span multiple columns.

::: demo

::: grid-3 card

### Starter {.col-span-1}
$9 / month

### Pro {.col-span-2}
$29 / month — most popular, spans two columns

:::

:::

## Two-column Grid

::: demo

::: grid-2 card

### What you get
- Unlimited wireframes
- 7 visual styles
- VS Code extension
- CLI tool

### What you don't need
- Figma licence
- Design skills
- Build step

:::

:::

## Alignment

Add `{.left}`, `{.right}`, or `{.center}` to a `###` heading to align its column. The heading text can be empty — it just defines the column boundary and alignment. Useful for action bars: filters on the left, primary action on the right.

::: demo

::: grid-2

###

[reset] [Search___________]{type:search}

### {.right}

[+ New Sprint]*

:::

:::

## Syntax

```
::: grid-2          two columns, no card chrome
::: grid-3          three columns
::: grid-3 card     three columns with card borders

### Item title {.col-span-2}   span 2 columns
###                            column (no heading text needed)
### {.right}                   shrink column and push to right edge
### {.left}                    push to left edge
### {.center}                  center
```

:::

:::
