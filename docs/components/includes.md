::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Reuse Components

`![[path.md]]` inlines another file before parsing — the included content becomes part of the page as if you'd typed it there. This is wiremd's component system: define a piece of UI once, reuse it everywhere.

## Reusable Components

Define a card or list item in its own file, then include it multiple times to simulate a real list.

**`_sprint-card.md`**
```
::: card

### Sprint 12
[In Progress]{.warning} 8 tasks · due Friday

[View Sprint]* [Edit]

:::
```

**`sprints.md`**
```
![[_sprint-card.md]]
![[_sprint-card.md]]
![[_sprint-card.md]]
```

This renders three identical sprint cards — a realistic list without repeating markup. Here it is live:

::: demo

![[_sprint-card.md]]

![[_sprint-card.md]]

![[_sprint-card.md]]

:::

## Shared Navigation

Extract a topnav, sidebar, or header into a shared file and include it on every page. When you update the file, all pages update automatically.

**`_topnav.md`**
```
::: row
[⚡ App]* [Dashboard] [Projects] [Team] [Settings]
:::
```

**`dashboard.md`**
```
![[_topnav.md]]

### Dashboard
Welcome back.
```

**`projects.md`**
```
![[_topnav.md]]

### Projects
All projects listed here.
```

Here it is live — the same nav component on two different pages:

::: demo

![[_demo-topnav.md]]

### Dashboard

Welcome back. Here's what's happening today.

:::

::: demo

![[_demo-topnav.md]]

### Projects

| Name | Status | Owner |
|------|--------|-------|
| Alpha | Active | Alice |
| Beta | Draft | Bob |

:::

## Multi-page Prototypes

Combine includes with button links to wire up a full clickable prototype. Each page shares the same nav and uses `[[Label](./page.md)]` buttons to navigate between pages.

**`dashboard.md`**
```
![[_topnav.md]]

### Dashboard

[[View Projects](./projects.md)]* [[Settings](./settings.md)]
```

**`projects.md`**
```
![[_topnav.md]]

### Projects

[[+ New Project](./new-project.md)]*

[[Back to Dashboard](./dashboard.md)]
```

Here it is live — a two-screen prototype with shared nav and navigation buttons:

::: demo

![[_demo-topnav.md]]

### Dashboard

[[View Projects](./button-links.md)]* [[Settings](./button-links.md)]

:::

::: demo

![[_demo-topnav.md]]

### Projects

[[+ New Project](./button-links.md)]*

[[Back to Dashboard](./button-links.md)]

:::

## Missing File

If the referenced file doesn't exist, a warning is rendered and the rest of the page continues normally.

> ⚠️ Could not include: missing-file.md

## Syntax

```
![[relative/path.md]]       inline another file
![[_shared/component.md]]   convention: _ prefix for shared files
```

> **Note:** Paths resolve relative to the including file, not the project root.

:::

:::
