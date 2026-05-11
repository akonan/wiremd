::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Button Links

Wrap a Markdown link inside button brackets to create a clickable button that navigates to another `.md` file.

## Basic

::: demo
[[Go to Dashboard](./index.md)]
[[View Components](./buttons.md)]*
:::

## In Context

::: demo

::: card

### Getting Started
Install wiremd and create your first wireframe in minutes.

[[Read the Guide](./index.md)]* [[View Examples](./grid.md)]

:::

:::

## With Attributes

::: demo
[[Sign Up](./index.md)]{.secondary}
[[Cancel](./index.md)]{.danger}
:::

## Navigation Use Case

Button links are the primary way to wire up multi-page prototypes. In `--serve` mode, clicking a button link renders the target `.md` file in the same browser tab.

::: demo
[[ wiremd | [Home](./index.md) | [Components](./buttons.md) | [Layout](./grid.md) | [Get Started](./index.md)* ]]
:::

## Syntax

```
[[Label](./path.md)]        link button, default style
[[Label](./path.md)]*       primary link button
[[Label](./path.md)]{.secondary}
```

:::

:::
