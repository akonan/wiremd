::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Textarea & Select

## Textarea

Use `{rows:N}` to create a multi-line text area.

::: demo
Message
[Write your message here...]{rows:4}
:::

## Textarea — Required

::: demo
Bio
[Tell us about yourself...]{rows:3 required}
:::

## Select / Dropdown

A bracket line followed by a list creates a dropdown. The bracket content is the placeholder label.

::: demo
Country
[Select country            v]
- United States
- United Kingdom
- Germany
- France

:::

## Select — Required

::: demo
Role
[Select a role             v]{required}
- Admin
- Editor
- Viewer

:::

## Combined Example

::: demo

## Feedback

Category
[Select category           v]
- Bug report
- Feature request
- General feedback

Description
[Describe the issue...]{rows:5 required}

[Submit Feedback]* [Cancel]

:::

## Syntax

```
[Placeholder...]{rows:4}           textarea
[Placeholder...]{rows:4 required}  required textarea

[Select label              v]      dropdown opener
- Option 1                         followed by list
- Option 2
```

:::

:::
