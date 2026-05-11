::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Alerts

> **Not yet implemented.** The `::: alert` container parses correctly but has no dedicated renderer — it falls back to a generic `<div>`. Variants (`.success`, `.warning`, `.error`) are not visually distinguished. This page documents the intended syntax for when it is implemented.

`::: alert` renders a highlighted message block. Add a variant class to control the tone.

## Default

::: demo

::: alert
Your session will expire in 10 minutes.
:::

:::

## Variants

::: demo

::: alert {.success}
Profile updated successfully.
:::

:::

::: demo

::: alert {.warning}
You are approaching your storage limit.
:::

:::

::: demo

::: alert {.error}
Payment failed. Please check your card details.
:::

:::

## With Inline Content on Opener

Place content directly on the opener line to use it as a title/heading.

::: demo

::: alert {.warning} Storage limit reached

Upgrade your plan to continue uploading files.

[Upgrade Now]* [Dismiss]

:::

:::

## Syntax

```
::: alert
Message text.
:::

::: alert {.success}
::: alert {.warning}
::: alert {.error}

::: alert {.warning} Title text
Body content.
:::
```

:::

:::
