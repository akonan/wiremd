::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Navigation

## Navbar

`[[ ... ]]` creates an inline container. Separate sections with `|`. The first item becomes the brand/logo.

::: demo
[[ Logo | [Home](./index.md) | Products | Pricing | Login | [Sign Up]* ]]
:::

## Active state

Wrap an item in `*asterisks*` to mark it as the active/current page:

::: demo
[[ Logo | Home | *Products* | About | Contact ]]
:::

## With icon and buttons

Use `:icon:` for the brand logo and embed `[Button]` items for actions:

::: demo
[[ :logo: Brand | Home | Features | Pricing | [Sign In] | [Get Started]* ]]
:::

## Breadcrumbs

Use `[[ ... ]]` with `>` separators for breadcrumb trails.

> **TODO:** crumb items render as `<ahref="#">` — real URLs not supported yet; see `[Text](url)` syntax proposal in renderer 

::: demo
[[ Home > Settings > Profile ]]
:::



## Sidebar Nav

`::: sidebar` creates a vertical nav panel, typically used inside `::: layout {.sidebar-main}`.

::: demo

::: sidebar

**App**

#### Main
[Dashboard]*
[Projects]
[Tasks]
[Calendar]

#### Account
[Settings]
[Billing]

---

[Logout]

:::

:::

## Pagination

::: demo
[← Prev] [1]* [2] [3] [4] [Next →]
:::

## Syntax

```
[[ Brand | Link | Link | [Action]* ]]    navbar

[[ Home > Section > Page ]]              breadcrumb

::: sidebar                              sidebar nav
[Link]*
[Link]
:::
```

:::

:::
