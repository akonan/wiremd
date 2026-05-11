::: layout {.sidebar-main}

![[_sidebar.md]]

::: main

# wiremd Components

::: demo

## Sign In

Email
[_____________________________]{type:email required}

Password
[_____________________________]{type:password required}

- [ ] Remember me

[Sign In]* [Forgot password?]

:::

wiremd converts Markdown with extended syntax into visual wireframes. Use these components to prototype UIs directly in your editor.

## Standard Markdown

All standard CommonMark Markdown works inside wiremd files:

| Syntax | Example |
|--------|---------|
| Headings | `# H1`, `## H2`, `### H3` … `###### H6` |
| Bold | `**bold**` |
| Italic | `*italic*` |
| Inline code | `` `code` `` |
| Link | `[text](url)` |
| Image | `![alt](image.jpg)` |
| Unordered list | `- item` |
| Ordered list | `1. item` |
| Blockquote | `> quoted text` |
| Table | `\| col \| col \|` with `---` separator row |
| Horizontal rule | `---` |
| Fenced code block | ` ``` ` … ` ``` ` |

wiremd extends this with UI components — nothing above is broken or overridden.

## Best Practices

1. **Label inputs** — put label text on the line directly above the input, no blank line between them
2. **Use semantic headings** — `#` for page title, `##` for sections, `###` for grid/tab items
3. **Use `{variant:primary}` not `{.primary}`** — dot-class syntax adds raw CSS classes with no built-in styling
4. **Use `{state:disabled}` on buttons** — `{disabled}` is silently ignored on buttons; use `{state:disabled}` instead
5. **Group related items with containers** — `:::card`, `:::grid-N`, `:::row` to organise content
6. **One `:::` container can nest inside another** — track depth; the inner `:::` closes its own block only

:::

:::
