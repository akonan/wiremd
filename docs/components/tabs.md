::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Tabs

`::: tabs` creates a tabbed panel. Child `::: tab Label` containers become panels. The first tab is active by default.

## Basic Tabs

::: demo

::: tabs

::: tab Overview
## Product Overview
This is the main overview content shown on the first tab.
[Get Started]*

:::

::: tab Features
- Markdown-based wireframing
- 7 visual styles
- VS Code extension
- Live reload dev server

:::

::: tab Pricing
**Free** — 1 user, 5 projects
**Pro** — $12/mo, unlimited

[View Plans]*
:::

:::

:::

## Settings Pattern

::: demo

::: tabs

::: tab Profile
Name
[_____________________________]{required}

Email
[_____________________________]{type:email required}

Bio
[Tell us about yourself...]{rows:3}

[Save Changes]*
:::

::: tab Security
[Change Password]
[Enable 2FA]*
[View Active Sessions]
:::

::: tab Notifications
- [x] Email alerts
- [ ] SMS alerts
- [x] Weekly digest

[Save Preferences]*
:::

:::

:::

## Syntax

```
::: tabs

::: tab Tab One
Content for tab one
:::

::: tab Tab Two
Content for tab two
:::

:::
```

:::

:::
