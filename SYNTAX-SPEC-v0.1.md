# wiremd Syntax Specification v0.1

**Status:** Locked for implementation
**Date:** November 6, 2025
**Approach:** Hybrid model (visual patterns + markdown + attributes)

---

## 1. Core Philosophy

wiremd syntax is designed to be:

1. **Markdown-first** - Valid markdown should render reasonably without a parser
2. **Visually intuitive** - Syntax should resemble the output where possible
3. **Progressively enhanced** - Add features via attributes, not entirely new syntax
4. **Fast to write** - Common patterns should be quick and obvious
5. **Extensible** - Support future additions without breaking changes

---

## 2. Component Syntax

### 2.1 Buttons

```markdown
[Button Text]                    # Basic button
[Button Text]{.primary}          # Primary button with class
[Button Text]{.secondary}        # Secondary button
[Button Text]{.danger}           # Danger/destructive button
[Button Text]*                   # Primary button (shorthand)
[Button Text]{:disabled}         # Disabled state
```

**Parser Rules:**
- `[Text]` where Text does not contain `]` and is not a markdown link
- Optional `*` suffix indicates primary/active state
- Optional `{...}` attributes after closing bracket
- Distinguishing from links: buttons have no `(url)` following

### 2.2 Text Inputs

```markdown
[_____________________________]            # Basic text input
[Email_________________________]           # Input with placeholder
[_____________________________]{type:email required}  # With attributes
[*****************************]            # Password input (visual indicator)
```

**Parser Rules:**
- `[` followed by underscore characters `_` and/or text, ending with `]`
- Asterisks `*` instead of underscores indicate password type
- Number of `_` or `*` characters suggests visual width (not enforced)
- Attributes in `{key:value}` format after closing bracket

**Supported Input Attributes:**
- `type` - text, email, password, tel, url, number, date, etc.
- `placeholder` - Placeholder text
- `required` - Boolean, field is required
- `disabled` - Boolean, field is disabled
- `value` - Pre-filled value
- `pattern` - Validation pattern

### 2.3 Textareas

```markdown
[                             ]
[                             ]
[                             ]
[_____________________________]{rows:5}
```

**Alternative compact:**
```markdown
[Message...]{rows:5}
```

**Parser Rules:**
- Multiple lines of `[` + spaces/content + `]` OR
- Single line with `{rows:N}` attribute
- `rows` attribute determines height

### 2.4 Select/Dropdown

```markdown
[Choose option________________v]
[Choose option________________v]{required}

# With options defined below:
[Select topic_________________v]
- Option 1
- Option 2
- Option 3
```

**Parser Rules:**
- `[` + text/underscores + `v]` - the `v` suffix indicates dropdown
- Following unordered list items (if present) define options
- List items are children of the select until a non-list-item is encountered

### 2.5 Radio Buttons

```markdown
( ) Unselected option
(•) Selected option
(x) Selected option (alternative)
```

**Parser Rules:**
- Line starts with `(` + space or `•` or `x` + `)` + space + text
- `( )` = unselected
- `(•)` or `(x)` = selected
- Can be in a group (consecutive radio items)

### 2.6 Checkboxes

```markdown
- [ ] Unchecked item
- [x] Checked item
```

**Parser Rules:**
- Standard markdown task list syntax
- Native markdown parser handles this

### 2.7 Icons

```markdown
:icon-name:
:house: :user: :gear: :magnifying-glass:
```

**Parser Rules:**
- `:` + alphanumeric/hyphens + `:`
- Similar to Slack/GitHub emoji syntax
- Icon names use kebab-case

**Common Icons (initial set):**
- Navigation: `house`, `folder`, `file`, `arrow-left`, `arrow-right`
- Actions: `edit`, `trash`, `plus`, `minus`, `check`, `x`
- UI: `gear`, `bell`, `user`, `magnifying-glass`, `filter`
- Status: `check-circle`, `x-circle`, `info-circle`, `warning`, `spinner`
- Social: `twitter`, `linkedin`, `github`, `facebook`
- Business: `dollar`, `chart-up`, `users`, `inbox`

---

## 3. Container Syntax

### 3.1 Generic Containers

```markdown
::: container-type {.class attr="value"}
Content goes here
:::
```

**Parser Rules:**
- Line starts with `:::` + space + type name
- Optional attributes in `{...}` on same line
- Content until closing `:::`
- Supports nesting

**Common Container Types:**
- `hero` - Hero section
- `card` - Card component
- `modal` - Modal/dialog
- `sidebar` - Sidebar navigation
- `footer` - Footer section
- `alert` - Alert/notification with type (success, info, warning, error)
- `grid` - Grid layout container
- `layout` - Generic layout container

### 3.2 Compact Inline Containers

```markdown
[[ item 1 | item 2 | item 3 ]]
[[ :logo: Brand | Home | Products | [Sign In] ]]{.nav}
```

**Parser Rules:**
- `[[` + content with `|` separators + `]]`
- Pipe `|` separates items
- Items can contain text, icons, buttons
- Primary use: navigation bars
- Optional attributes after closing `]]`

---

## 4. Layout Syntax

### 4.1 Grid Layouts

```markdown
## Features {.grid-3}

### Feature One
Content

### Feature Two
Content

### Feature Three
Content
```

**Parser Rules:**
- Heading with `.grid-N` class where N is column count
- Direct child headings become grid items
- Supports: `.grid-2`, `.grid-3`, `.grid-4`, `.grid-auto`

### 4.2 Sidebar + Main Layout

```markdown
::: layout {.sidebar-main}

## Sidebar {.sidebar}
Sidebar content

## Main {.main}
Main content

:::
```

**Parser Rules:**
- Container with layout type
- Child sections with `.sidebar` and `.main` classes
- Sections defined by headings with classes

---

## 5. Attributes Syntax

### 5.1 Class Attributes

```markdown
{.class-name}
{.class-one .class-two}
```

**Parser Rules:**
- Curly braces with `.` prefix for classes
- Multiple classes separated by spaces
- Applied to preceding element

### 5.2 Key-Value Attributes

```markdown
{type:email}
{rows:5}
{required}
{type:email required placeholder:"Enter email"}
```

**Parser Rules:**
- Curly braces with `key:value` pairs
- Boolean attributes can omit value (presence = true)
- Multiple attributes separated by spaces
- Values with spaces must be quoted

### 5.3 State Attributes

```markdown
{:disabled}
{:loading}
{:active}
{:error}
```

**Parser Rules:**
- Curly braces with `:` prefix for states
- Represents component state
- Single state per element (primary state)

### 5.4 Combined Attributes

```markdown
{.primary type:submit :disabled}
```

**Parser Rules:**
- Can combine classes, key-values, and states in single `{...}` block
- Space-separated
- Order doesn't matter

---

## 6. Markdown Native Elements

### 6.1 Headings

```markdown
# Heading 1
## Heading 2
### Heading 3
```

**Usage:**
- Define hierarchy and structure
- Can have classes: `## Heading {.class}`
- Sections are defined by headings

### 6.2 Lists

```markdown
- Item 1
- Item 2
- Item 3

1. Numbered item
2. Numbered item
```

**Usage:**
- Navigation menus (unordered)
- Feature lists
- Dropdown options
- Task lists with `- [ ]` syntax

### 6.3 Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
{.data-table}
```

**Usage:**
- Data tables
- Can include checkboxes, icons, buttons in cells
- Attributes apply to entire table

### 6.4 Blockquotes

```markdown
> Quoted or callout text
> Can be multiple lines
```

**Usage:**
- Callouts
- Alternative for simple alerts
- Can have classes for alert types

### 6.5 Horizontal Rules

```markdown
---
```

**Usage:**
- Section separators
- Footer dividers
- Visual breaks

### 6.6 Images

```markdown
![Alt text](image.png)
![Alt text](image.png){.hero-image}
```

**Usage:**
- Image placeholders
- Avatar images
- Hero images
- Can have classes for styling

---

## 7. Special Patterns

### 7.1 Navigation Bars

```markdown
[[ :logo: Brand | Link 1 | Link 2 | [Button] [Button]{.primary} ]]{.nav}
```

**Components:**
- Logo/brand (icon + text)
- Pipe-separated links
- Buttons (typically at end)
- Nav class for styling

### 7.2 Breadcrumbs

```markdown
Home > Products > Category > Current Page
:house: Home > :folder: Products > Category
{.breadcrumbs}
```

**Parser Rules:**
- Text with `>` separator
- Optional icons
- Optional `.breadcrumbs` class

### 7.3 Tabs

```markdown
[Overview]* | Details | Reviews | FAQ

Content for Overview tab...
```

**Parser Rules:**
- Pipe-separated button-like elements
- `*` suffix indicates active tab
- Following content belongs to active tab
- Each H2 can start a new tab content section

### 7.4 Badges/Pills

```markdown
Status `active`
Notifications `3`
```

**Parser Rules:**
- Inline code backticks for badge/pill indicators
- Typically numbers or status text

---

## 8. State Representation

### 8.1 Component States

```markdown
[Button]{:disabled}      # Disabled state
[Loading...]{:loading}   # Loading state
[Success]{:success}      # Success state
[Error]{:error}          # Error state
```

### 8.2 Loading States

```markdown
::: loading
:spinner: Loading...
Please wait while we process your request
:::

[Submit]{:loading}
```

### 8.3 Empty States

```markdown
::: empty-state
:empty-box:
## No items found
Get started by creating your first item
[Create Item]{.primary}
:::
```

### 8.4 Error States

```markdown
::: error-state
:warning:
## Something went wrong
We couldn't load this page
[Retry]{.primary}
:::
```

---

## 9. Complete Component Reference

| Component | Syntax | Example |
|-----------|--------|---------|
| Button | `[Text]` | `[Click Me]` |
| Primary Button | `[Text]*` or `[Text]{.primary}` | `[Submit]*` |
| Text Input | `[___]` | `[Enter name___]` |
| Email Input | `[___]{type:email}` | `[Email___]{type:email required}` |
| Password | `[***]` | `[*********]` |
| Textarea | `[...]{rows:N}` | `[Message...]{rows:5}` |
| Dropdown | `[Text___v]` | `[Select option___v]` |
| Checkbox | `- [ ]` / `- [x]` | `- [x] Agree` |
| Radio | `( )` / `(•)` | `(•) Selected` |
| Icon | `:name:` | `:house: :user:` |
| Container | `::: type ... :::` | `::: hero ... :::` |
| Inline Container | `[[ ... ]]` | `[[ A \| B \| C ]]` |
| Class | `{.class}` | `{.primary}` |
| Attribute | `{key:value}` | `{type:email}` |
| State | `{:state}` | `{:disabled}` |
| Grid | `{.grid-N}` | `{.grid-3}` |

---

## 10. Parsing Priority and Ambiguity Resolution

### 10.1 Button vs. Link

```markdown
[Text](url)          # Link - has (url) following
[Text]               # Button - no (url) following
[Text]{.class}(url)  # Link with attributes
```

**Rule:** Presence of `(url)` determines link vs. button

### 10.2 Input vs. Code

```markdown
[___]                # Input - contains underscores or asterisks
[text]               # Could be button, depends on context
`code`               # Code - uses backticks
```

**Rule:** Square brackets with underscore/asterisk patterns = input

### 10.3 Container vs. HTML

```markdown
::: container        # wiremd container
:::

<div>                # Pass-through HTML
</div>
```

**Rule:** `:::` syntax is wiremd-specific, HTML is preserved

### 10.4 Attribute Placement

```markdown
[Button]{.class}     # Preferred - immediately after element
[Button] {.class}    # Also valid - space allowed
{.class}             # Applied to preceding block element
```

**Rule:** Attributes apply to immediately preceding element

---

## 11. JSON Output Schema

### 11.1 Document Structure

```json
{
  "type": "document",
  "version": "0.1",
  "meta": {
    "title": "Document Title",
    "viewport": "desktop"
  },
  "children": [...]
}
```

### 11.2 Component Node Structure

```json
{
  "type": "component-type",
  "props": {
    "key": "value",
    "classes": ["class1", "class2"],
    "state": "state-name"
  },
  "children": [...],
  "content": "text content",
  "position": {
    "start": { "line": 1, "column": 1 },
    "end": { "line": 1, "column": 10 }
  }
}
```

### 11.3 Component Types

**Layout:**
- `container` (generic)
- `hero`
- `card`
- `modal`
- `sidebar`
- `nav`
- `footer`
- `grid`
- `section`

**Form:**
- `button`
- `input`
- `textarea`
- `select`
- `checkbox`
- `radio`
- `form`

**Content:**
- `heading`
- `paragraph`
- `text`
- `image`
- `icon`
- `list`
- `table`

**UI:**
- `tabs`
- `accordion`
- `breadcrumbs`
- `alert`
- `badge`

**State:**
- `loading`
- `empty-state`
- `error-state`

---

## 12. Examples

### 12.1 Simple Form

**Input:**
```markdown
## Contact Us

Name
[_____________________________]{required}

Email
[_____________________________]{type:email required}

[Submit]{.primary}
```

**Output (JSON):**
```json
{
  "type": "section",
  "children": [
    {
      "type": "heading",
      "level": 2,
      "content": "Contact Us"
    },
    {
      "type": "paragraph",
      "content": "Name"
    },
    {
      "type": "input",
      "props": {
        "type": "text",
        "required": true
      }
    },
    {
      "type": "paragraph",
      "content": "Email"
    },
    {
      "type": "input",
      "props": {
        "type": "email",
        "required": true
      }
    },
    {
      "type": "button",
      "props": {
        "classes": ["primary"]
      },
      "content": "Submit"
    }
  ]
}
```

### 12.2 Navigation Bar

**Input:**
```markdown
[[ :logo: MyApp | Home | Products | [Sign In] ]]{.nav}
```

**Output (JSON):**
```json
{
  "type": "nav",
  "props": {
    "classes": ["nav"]
  },
  "children": [
    {
      "type": "brand",
      "children": [
        { "type": "icon", "props": { "name": "logo" } },
        { "type": "text", "content": "MyApp" }
      ]
    },
    { "type": "nav-item", "content": "Home" },
    { "type": "nav-item", "content": "Products" },
    {
      "type": "button",
      "content": "Sign In"
    }
  ]
}
```

### 12.3 Grid Layout

**Input:**
```markdown
## Features {.grid-3}

### :rocket: Fast
Quick rendering

### :shield: Secure
Enterprise security

### :zap: Powerful
Advanced features
```

**Output (JSON):**
```json
{
  "type": "section",
  "props": {
    "classes": ["grid-3"]
  },
  "children": [
    {
      "type": "heading",
      "level": 2,
      "content": "Features"
    },
    {
      "type": "grid",
      "props": { "columns": 3 },
      "children": [
        {
          "type": "grid-item",
          "children": [
            {
              "type": "heading",
              "level": 3,
              "children": [
                { "type": "icon", "props": { "name": "rocket" } },
                { "type": "text", "content": " Fast" }
              ]
            },
            {
              "type": "paragraph",
              "content": "Quick rendering"
            }
          ]
        },
        // ... more items
      ]
    }
  ]
}
```

---

## 13. Parser Implementation Notes

### 13.1 Parsing Pipeline

```
Markdown Input
  ↓
Lexer (Tokenization)
  ↓
Parser (AST)
  ↓
Transformer (wiremd-specific nodes)
  ↓
Validator
  ↓
JSON Output
```

### 13.2 Base Parser

- Use `unified` + `remark` for base markdown parsing
- Plugin architecture for wiremd extensions
- AST transformation for custom components

### 13.3 Custom Tokens

Components that need custom tokenization:
- Button syntax `[Text]`
- Input syntax `[___]`
- Dropdown suffix `v]`
- Radio buttons `( )` / `(•)`
- Inline containers `[[ ]]`
- Icons `:name:`
- Attributes `{...}`

### 13.4 Context-Aware Parsing

- Button vs. Link distinction requires lookahead for `(url)`
- Dropdown options require looking ahead for list items
- Grid children determined by heading level
- Container nesting requires stack tracking

---

## 14. Validation Rules

### 14.1 Component Validation

- Required attributes must be present
- Attribute values must match expected types
- Children must be valid for parent type
- State combinations must be valid

### 14.2 Accessibility Validation

- Form inputs should have labels
- Buttons should have text or aria-label
- Images should have alt text
- Tables should have headers

### 14.3 Semantic Validation

- Grid columns should be reasonable (2-6)
- Nesting depth should be limited
- Radio groups should have at least 2 options
- Select should have options

---

## 15. Extension Points

### 15.1 Custom Components

Future syntax for custom components:
```markdown
{my-component prop="value"}
Content
{/my-component}
```

### 15.2 Custom Attributes

- Framework-specific attributes (React props, Vue directives)
- Data attributes
- ARIA attributes
- Custom validation rules

### 15.3 Themes and Styles

- Visual style selection (`sketch`, `clean`, `wireframe`)
- Color schemes
- Component style variants

---

## 16. Version 0.1 Scope

### 16.1 Included

✓ Basic components (buttons, inputs, selects)
✓ Containers (hero, card, modal)
✓ Layout (grid, sidebar-main)
✓ Navigation (navbar, breadcrumbs)
✓ Forms (inputs, textareas, checkboxes, radios)
✓ Icons (common set)
✓ Tables (basic)
✓ State (loading, empty, error)
✓ Attributes (classes, key-value, states)

### 16.2 Deferred to v0.2+

⏳ Advanced form elements (multi-select, date pickers, file uploads)
⏳ Responsive attributes and breakpoints
⏳ Animations and transitions
⏳ Component library system
⏳ Template/partial includes
⏳ Variables and theming system
⏳ Conditional rendering
⏳ Data binding expressions

---

## 17. Migration and Compatibility

### 17.1 Markdown Compatibility

All wiremd syntax should degrade gracefully when rendered as plain markdown:
- Buttons appear as `[Text]`
- Inputs appear as `[___]`
- Icons appear as `:icon:`
- Containers appear as text blocks
- Attributes are ignored

### 17.2 Future Versions

Breaking changes will increment major version (0.x → 1.x)
New features will increment minor version (0.1 → 0.2)
Syntax additions should be backwards compatible where possible

---

**Specification Status:** LOCKED for v0.1 implementation
**Last Updated:** November 6, 2025
**Next Steps:** Implement parser following this specification
