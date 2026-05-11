::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Badges

Pipe delimiters create inline badges. Add a variant class to control colour.

## Variants

::: demo
|Default| |Primary|{.primary} |Success|{.success} |Warning|{.warning} |Error|{.error}
:::

## Inline with Text

::: demo
Status: |Active|{.success}

Plan: |Pro|{.primary}

Build: |Failing|{.error}

Review: |Pending|{.warning}
:::

## In a Table

> **TODO:** badges inside table cells do not render — escaped `\|Label\|` syntax is not parsed within table cell content

Escape pipes inside table cells with `\|`.

::: demo
| Feature | Status |
|---------|--------|
| Auth | \|Done\|{.success} |
| API | \|In Progress\|{.warning} |
| Docs | \|Planned\| |

:::

## Count Badges

::: demo
Inbox |12|{.primary}

Alerts |3|{.error}

Updates |New|{.success}
:::

## Syntax

```
|Label|               neutral grey
|Label|{.primary}     blue
|Label|{.success}     green
|Label|{.warning}     yellow
|Label|{.error}       red

\|Label\|{.success}   escaped inside table cell
```

:::

:::
