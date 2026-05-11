::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Buttons

Square brackets create a button. Add `*` for primary variant.

## Basic

::: demo
[Cancel] [Save]*
:::

## Variants

::: demo
[Default] [Primary]* [Secondary]{variant:secondary} [Danger]{variant:danger}
:::

## Disabled

> **TODO:** `{disabled}` sets `props.disabled` but renderer checks `props.state === 'disabled'` — fix renderer or unify

::: demo
[Submit]{disabled}
:::

## Sizes & Custom Classes

> **TODO:** `{.large}` / `{.small}` classes are applied but no CSS rules exist for them

::: demo
[Small]{.small} [Default] [Large]{.large}
:::

## With Icons

::: demo
[:search: Search] [+ New Item]* [Delete]{.danger}
:::

## Syntax

```
[Label]                      default button
[Label]*                     primary (preferred shorthand)
[Label]{variant:primary}     primary (explicit)
[Label]{variant:secondary}   secondary
[Label]{variant:danger}      danger/destructive
[Label]{state:disabled}      disabled  ← use state:disabled, not {disabled}
[Label]{state:loading}       loading
[A] [B] [C]                  button group (inline)
```

> **Note:** `{.primary}` and `{.danger}` add raw CSS classes with no built-in styling — use `{variant:*}` instead. `{disabled}` (without `state:`) is silently ignored on buttons.

:::

:::
