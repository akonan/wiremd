::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Demo Blocks

`::: demo` renders wiremd content as a split pane — rendered output on the left, raw source on the right. Write once, no duplication.

## Basic Usage

::: demo
[Primary]* [Secondary] [Danger]{variant:danger}
:::

## With a Form

::: demo

Email
[_____________________________]{type:email required}

Password
[_____________________________]{type:password required}

[Sign In]* [Forgot password?]

:::

## With a Grid

::: demo

::: grid-3 card

### Free
$0/mo
[Get Started]

### Pro
$12/mo
[Start Trial]*

### Enterprise
Custom
[Contact Sales]

:::

:::

## Syntax

```
::: demo
...any wiremd content...
:::
```

Works with any wiremd component: buttons, inputs, grids, tabs, badges, navigation, cards. The source pane always shows exactly what you typed.

> **Note:** `::: demo` is rendered by the wiremd CLI and VS Code extension. It is not rendered by VitePress — this page itself is served via `wiremd --serve`.

:::

:::
