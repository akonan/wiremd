# Wiremd Validation - All In One

This single file is intended to validate:
- TextMate highlighting
- LSP completion
- LSP hover
- LSP signature help
- LSP diagnostics
- LSP semantic tokens
- Markdown disambiguation compatibility

Use this file in Extension Development Host.

---

## 1) Button vs Input vs Link disambiguation

[Save]
[Delete]{.danger}
[Primary Action]*

[Email_________________________]
[Password**********************]
[Email_________________________]{type:email required}
[Budget__________]{type:number min:1 max:999 step:1}

[Wiremd Docs](https://github.com/akonan/wiremd)
[Wiremd Docs] (https://github.com/akonan/wiremd)

Expected:
- Buttons highlighted as button syntax.
- Inputs highlighted as input syntax.
- Markdown links stay as links (not buttons).

---

## 2) Block containers (color by type scopes)

::: hero {.landing state:active}
# Welcome
[Get Started]{.primary}
:::

::: card {.elevated}
### Plan
[Upgrade]{.primary}
:::

::: alert {.notice}
Warning message
:::

::: grid {.grid-3}
### A
One
### B
Two
### C
Three
:::

::: layout {.sidebar-main}
## Sidebar {.sidebar}
[[ Home | Settings | Billing ]]
## Main {.main}
### Dashboard
[Open Report]
:::

Expected:
- `:::` delimiter highlighted as container punctuation.
- `hero`, `card`, `alert`, `grid`, `layout` each with their own type scope.

---

## 3) Inline containers + separators

[[ :logo: Brand | Home | Products | [Sign In] | [Get Started]* ]]{.nav}
[[ Home > Products > Analytics > Report ]]{.breadcrumb}

Expected:
- `[[` and `]]` highlighted as inline container delimiters.
- `|` and `>` separators highlighted.

---

## 4) Attribute highlighting and hints

[Send]{.primary .large type:submit state:loading disabled}
[Message...]{rows:5 placeholder:"Write your message"}

Expected:
- Classes `.primary`, `.large` highlighted as class attributes.
- Keys (`type`, `state`, `rows`, `placeholder`) highlighted as keys.
- Values highlighted as values.
- Boolean attrs (`disabled`) highlighted as booleans.

---

## 5) Completion checkpoints (place cursor at markers)

### 5.1 Container completion

::: 
# cursor-container

At the line above after `::: `:
- Completion should suggest: hero, card, modal, sidebar, footer, alert, grid, layout, section, form-group, button-group.

### 5.2 Attribute completion

[Input___________]{
# cursor-attributes

At the line above inside `{...}`:
- Completion should suggest attribute keys and class shorthands.

### 5.3 Input type value completion

[Input___________]{type:}
# cursor-type

After `type:`:
- Completion should suggest: text, email, password, tel, url, number, date, time, datetime-local, search.

### 5.4 Snippet completion

# cursor-snippets

At this empty line, trigger completion:
- Should include wiremd snippets (hero/card/nav/alert/form).

---

## 6) Hover checkpoints

Hover over each token below:
- `hero`
- `type`
- `email`
- `[Save]`
- `[Email____]`
- `[[ Home | Products ]]`

::: hero
[Save]
[Email________]{type:email}
[[ Home | Products ]]
:::

Expected:
- Hover docs appear for container/button/input/inline container/attributes.

---

## 7) Signature help checkpoints

[Email________]{type:email required state:}
# cursor-signature

Inside the attribute block above:
- Signature help should appear.
- Active parameter should change when moving across `.class`, `type:`, `required`, `state:`.

---

## 8) Diagnostics checkpoints

::: unknown-type
This should produce warning diagnostic (unknown container type)
:::

[Input________]{type:not-real}

Expected:
- Problems panel contains warnings with source `wiremd-lsp`.

---

## 9) Semantic token inspection targets

Use `Developer: Inspect Editor Tokens and Scopes` on these tokens:
- `:::`
- `hero`
- `[Save]`
- `[Email________]`
- `.primary`
- `type`
- `email`

Expected scope/tokens intent:
- Container delimiters: punctuation definition scopes.
- Container type names: `entity.name.type.container.<type>.wiremd`.
- Attribute keys/values/classes semantically differentiated.

---

## 10) Preview regression quick check

```wiremd clean
## Quick Preview
[Preview Button]{.primary}
```

Expected:
- Built-in markdown preview still renders wiremd fence.
- Existing extension preview commands still work.
