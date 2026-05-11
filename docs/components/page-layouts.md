::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Page Layouts

wiremd supports three common page structure patterns: top nav, sidebar + main, and the combined navbar + sidebar + main used in most dashboards.

---

## Top Nav Layout

Place a `[[ ... ]]` navbar above your content. No wrapper container needed — the navbar sits at the top of the page.

::: demo

[[ Acme | [Home](./index.md) | Products | Pricing | [Login] | [Sign Up]* ]]

## Welcome to Acme

Build faster with our platform.

::: grid-3 card

### Feature One
Description of the first feature goes here.

### Feature Two
Description of the second feature goes here.

### Feature Three
Description of the third feature goes here.

:::

:::

## Top Nav with Right-aligned Actions

Use a `::: row` with `{.right}` to push actions to the right inside a card or section:

::: demo

[[ App | [Dashboard] | [Projects] | [Team] | [Settings] | [Logout] ]]

::: row {.right}
[+ New Project]*
:::

## Projects

| Name | Status | Updated |
|------|--------|---------|
| Alpha | |Active|{.success} | Today |
| Beta | |Review|{.warning} | Yesterday |
| Gamma | |Draft|{} | 3 days ago |

:::

---

## Sidebar Layout

`::: layout {.sidebar-main}` creates a two-column layout with a fixed sidebar and a main content area.

::: demo

::: layout {.sidebar-main}

::: sidebar

**App**

[Dashboard]*
[Projects]
[Settings]

:::

::: main

## Dashboard

Welcome back! Here's what's happening.

:::

:::

:::

## Sidebar with Sections

::: demo

::: layout {.sidebar-main}

::: sidebar

**Acme Co.**

#### Workspace
[Overview]*
[Projects]
[Tasks]
[Calendar]

#### Team
[Members]
[Roles]

---

[Logout]

:::

::: main

## Overview

::: grid-3 card

### Tasks Done
**48** this week

### In Progress
**12** open

### Upcoming
**5** due today

:::

:::

:::

:::

---

## Navbar + Sidebar Layout

The most common dashboard pattern: combine a top navbar with a `::: layout {.sidebar-main}` below it.

::: demo

[[ App | [Dashboard] | [Notifications] | [Settings] | [JD] ]]

::: layout {.sidebar-main}

::: sidebar

#### Main
[Dashboard]*
[Projects]
[Tasks]

#### Admin
[Users]
[Billing]

---

[Logout]

:::

::: main

## Dashboard

::: grid-3 card

### Revenue
**$12,400**
+8% this month

### Users
**1,240**
+23 this week

### Open Tasks
**34**
5 due today

:::

:::

:::

:::

---

## Reusing Layouts

For multi-page wireframes, extract the sidebar to a shared file and include it on every page:

```
![[_sidebar.md]]
```

Full page pattern:

```
::: layout {.sidebar-main}
![[_sidebar.md]]
::: main
Page content here.
:::
:::
```

---

## Syntax Reference

```
[[ Brand | Link | Link | [Action]* ]]    top navbar

::: layout {.sidebar-main}              sidebar + main
::: sidebar
nav content
:::
::: main
page content
:::
:::

[[ Brand | Nav | [Action]* ]]           navbar + sidebar + main
::: layout {.sidebar-main}
::: sidebar
nav content
:::
::: main
page content
:::
:::
```

:::

:::
