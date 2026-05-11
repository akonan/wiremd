::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# Inputs

Underscores inside brackets create a text input. A label above the input binds to it as a form group.

## Basic

::: demo
Name
[_____________________________]
:::

## Required

::: demo
Email
[_____________________________]{required}
:::

## Label association

> **Critical:** label text must be on the line **directly above** the input — no blank line between them. A blank line breaks the association and the text renders as a paragraph instead.

## Input Types

::: demo
Email
[_____________________________]{type:email}

Password
[_____________________________]{type:password}

Phone
[_____________________________]{type:tel}

Number
[_____________________________]{type:number}

URL
[_____________________________]{type:url}

Date
[_____________________________]{type:date}

Time
[_____________________________]{type:time}

Search
[_____________________________]{type:search}

File upload
[_____________________________]{type:file}

Color
[_____________________________]{type:color}
:::

## With Placeholder

::: demo
Search
[_____________________________]{placeholder:"Search components..."}
:::

## Error state

::: demo
Email
[_____________________________]{type:email state:error}
:::

## Number constraints

::: demo
Quantity
[_____________________________]{type:number min:1 max:100}
:::

## Textarea columns

::: demo
Notes
[_____________________________]{rows:5 cols:40}
:::

## Disabled

::: demo
Username
[_____________________________]{disabled}
:::

## Full Form Example

::: demo

## Create Account

First name
[_____________________________]{required}

Last name
[_____________________________]{required}

Email
[_____________________________]{type:email required}

Password
[_____________________________]{type:password required}

[Create Account]* [Cancel]

:::

## Syntax

```
[_____________________________]               basic input
[_____________________________]{required}     required field
[_____________________________]{type:email}   typed input
[_____________________________]{type:password}
[_____________________________]{placeholder:"hint text"}
[_____________________________]{disabled}
```

:::

:::
