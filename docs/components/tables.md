::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Tables

Standard Markdown table syntax renders as a styled data table.

## Basic Table

::: demo
| Name | Role | Status |
|------|------|--------|
| Alice M. | Admin | Active |
| Bob K. | Editor | Active |
| Clara T. | Viewer | Inactive |

:::

## With Badges

Escape pipe characters inside cells with `\|`.

::: demo
| Feature | Basic | Pro | Enterprise |
|---------|-------|-----|------------|
| Users | 1 | 10 | Unlimited |
| Storage | 1 GB | 50 GB | Custom |
| Support | \|Community\| | \|Email\|{.warning} | \|SLA\|{.success} |
| API Access | — | \|Yes\|{.success} | \|Yes\|{.success} |

:::

## Data Table with Actions

::: demo
| Project | Owner | Due | Status |
|---------|-------|-----|--------|
| Website redesign | Alice | Dec 15 | \|In Progress\|{.warning} |
| Mobile app v2 | Bob | Jan 10 | \|In Progress\|{.warning} |
| API migration | Clara | Dec 20 | \|Review\|{.primary} |
| Design system | Dan | Feb 1 | \|Planning\| |

[+ New Project]*

:::

## Column Alignment

Use `:---`, `:---:`, and `---:` in the separator row.

::: demo
| Left | Center | Right |
|:-----|:------:|------:|
| Text | Text | 100 |
| Text | Text | 2,500 |

:::

## Syntax

```
| Col 1 | Col 2 | Col 3 |
|-------|-------|-------|
| A     | B     | C     |

| Left  | Center | Right |
|:------|:------:|------:|

\|Badge\|{.success}   escaped badge inside cell
```

:::

:::
