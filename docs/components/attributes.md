::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Attributes & Classes

Any wiremd element accepts `{...}` after it to add classes, attributes, and modifiers.

## CSS Classes

Add `.classname` to attach a CSS class:

::: demo
[Primary]* [Primary]{variant:primary} [Danger]{variant:danger} [Large]{.large}
:::

> **Note:** `{.primary}` and `{.danger}` on buttons add raw CSS classes (`wmd-primary`, `wmd-danger`), not variant classes (`wmd-button-primary`, `wmd-button-danger`). These classes have no built-in CSS definitions and produce unstyled buttons. Use `[Button]*` or `{variant:primary}` / `{variant:danger}` instead. Custom classes like `.large` are passed through but also have no built-in CSS definition.

## Key-value Attributes

Add `key:value` pairs for HTML attributes:

::: demo
Email
[_____________________________]{type:email required}
:::

## Combining Classes and Attributes

::: demo
[Submit]{variant:primary state:disabled}
:::

> **Note:** `{type:submit}` on buttons is **not implemented** — the `type` property is defined in the AST but never parsed from attributes or rendered to HTML. `{disabled}` on buttons is also silently ignored; use `{state:disabled}` instead. The example above does not fully render as intended.

## On Containers

Attributes on `:::` containers add classes to the wrapper element:

::: demo

::: card {.featured}
### Featured Plan
The most popular choice for growing teams.
[Get Started]*
:::

:::

## On Headings

::: demo
## Section Title {.muted}
:::

## On Grid Items

Use `{.col-span-N}` on `###` headings inside a grid:

::: demo

::: grid-3 card

### Starter {.col-span-1}
$9/mo

### Pro {.col-span-2}
$29/mo — spans two columns

:::

:::

## Common Modifiers

| Modifier | Effect |
|----------|--------|
| `{variant:primary}` | Primary variant (blue) — use this or `[Button]*` for styled primary buttons |
| `{variant:secondary}` | Secondary variant |
| `{variant:danger}` | Danger / destructive variant |
| `{.primary}` / `{.danger}` | Raw CSS class passthrough — **not a styled variant**; no built-in CSS definition |
| `{state:disabled}` | Disabled state on buttons and form elements (buttons: adds `disabled` attr + state class) |
| `{disabled}` | Disabled state on inputs, textarea, and select — **ignored on buttons**; use `{state:disabled}` for buttons |
| `{required}` | Required field marker (inputs and textarea only) |
| `{.col-span-N}` | Grid column span |
| `{.left}` / `{.right}` / `{.center}` | Alignment in row/grid |
| `{type:email}` | Input type |
| `{rows:N}` | Textarea row count |
| `{placeholder:"..."}` | Input placeholder text (**TODO:** quoted values with spaces may not parse correctly — prefer `{placeholder:hint}` without quotes for single words) |

## Syntax

```
[Button]{.classname}
[Button]{.class1 .class2}
[Input]{type:email required}
[Input]{.primary type:submit disabled}
::: container {.classname}
## Heading {.muted}
### Grid item {.col-span-2}
```

## Disambiguation rules

### Button vs. link

```
[Text](url)    link — has (url) after the brackets
[Text]         button — no (url)
```

### Input vs. button

```
[___________]  input — contains underscores
[***********]  password input — contains asterisks
[Text]         button — plain text, no underscores/asterisks
```

### Dropdown vs. input

```
[Select...v]   dropdown — ends with `v` after underscores
[___________]  text input
```

### Badge vs. table cell

```
|Active|{.success}   badge — pipe delimiters with no spaces
| Active |            table cell — spaces and alignment dashes context
```

Inside a table cell, escape badge pipes: `\|Active\|{.success}`

### Container vs. raw HTML

```
::: card        wiremd container — processed by parser
:::

<div>           raw HTML — passed through unchanged
</div>
```

### Attribute placement

```
[Button]{.class}     immediately after element (preferred)
[Button] {.class}    one space is also valid
                     blank line before {}: NOT applied to element
```

:::

:::
