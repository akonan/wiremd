# wiremd Quick Reference

> **One-page syntax reference for experienced users**
>
> New to wiremd? See the [Syntax Showcase](examples/showcase.md) for detailed examples and tutorials.

## Component Syntax

| Component | Syntax | Example |
|-----------|--------|---------|
| **Button** | `[Text]` | `[Click Me]` |
| **Primary Button** | `[Text]*` or `[Text]{.primary}` | `[Submit]*` |
| **Text Input** | `[___]` | `[Name___________]` |
| **Email Input** | `[___]{type:email}` | `[Email___]{type:email required}` |
| **Password** | `[***]` or `{type:password}` | `[********]{type:password}` |
| **Textarea** | `[...]{rows:N}` | `[Message...]{rows:5}` |
| **Dropdown** | `[Text___v]` + list | `[Select...v]` |
| **Checkbox** | `- [ ]` / `- [x]` | `- [x] Agree` |
| **Radio** | `- ( )` / `- (*)` | `- (*) Option 1` |
| **Icon** | `:name:` | `:home: :user: :gear:` |
| **Nav Bar** | `[[ A \| B \| C ]]` | `[[ Home \| About \| [Login] ]]` |
| **Nav Link** | `[[ [Text](url) \| ... ]]` | `[[ [About](./about.md) \| ... ]]` |
| **Breadcrumbs** | `[[ A > B > C ]]` | `[[ Home > Products > Item ]]` |
| **Button Link** | `[[Text](url)]` | `[[About](./about.md)]` |
| **Primary Button Link** | `[[Text](url)]*` | `[[Get Started](./start.md)]*` |

## Containers

| Container | Syntax | Usage |
|-----------|--------|-------|
| **Generic** | `::: type ... :::` | Any container block |
| **Card** | `::: card ... :::` | Card component |
| **Hero** | `::: hero ... :::` | Hero section |
| **Alert** | `::: alert type ... :::` | `success`, `info`, `warning`, `error` |
| **Modal** | `::: modal ... :::` | Dialog/modal |
| **Sidebar** | `::: sidebar ... :::` | Sidebar navigation |
| **Footer** | `::: footer ... :::` | Footer section |

## Layouts

| Layout | Syntax | Notes |
|--------|--------|-------|
| **Grid (layout only)** | `::: grid-3` … `:::` | Equal columns, no styling on items |
| **Grid (card chrome)** | `::: grid-3 card` … `:::` | Items rendered as styled cards |
| **2-Column Grid** | `::: grid-2` | |
| **3-Column Grid** | `::: grid-3` | |
| **4-Column Grid** | `::: grid-4` | |
| **Row** | `::: row` … `:::` | Horizontal flex row, children auto-wrapped |
| **Row (aligned)** | `::: row {.right}` … `:::` | Right-aligned row |
| **Tabs** | `::: tabs` with `::: tab Label` children | Tabbed panels |
| **Col span** | `### Item {.col-span-2}` | Item spans 2 columns |
| **Item alignment** | `### {.right}` inside `::: row` or `::: grid-N` | Right-aligns that item |

Grid items are defined by `###` headings inside the `::: grid-N` container.

`::: grid-N` is pure layout — use it for form columns, multi-column text, etc. Add `card` when items should have card chrome (features, pricing, team members).

## Attributes

| Attribute Type | Syntax | Example |
|----------------|--------|---------|
| **Class** | `{.classname}` | `{.primary .large}` |
| **Key-Value** | `{key:value}` | `{type:email required}` |
| **State** | `{state:name}` | `{state:disabled}` |
| **Combined** | `{.class key:value state:name}` | `{.primary type:submit state:loading}` |

## Input Types

```markdown
{type:text}      # Default
{type:email}     # Email
{type:password}  # Password
{type:tel}       # Telephone
{type:url}       # URL
{type:number}    # Number
{type:date}      # Date
{type:time}      # Time
{type:search}    # Search
```

## Input Attributes

```markdown
{required}           # Required field
{required:true}      # Also valid
{disabled}           # Disabled
{state:disabled}     # Also valid
{state:error}        # Error state
{min:1 max:100}      # Number constraints
{rows:5}             # Textarea rows
{cols:60}            # Textarea columns
```

## Button Variants

```markdown
[Button]                    # Default
[Button]*                   # Primary (asterisk shorthand)
[Button]{.primary}          # Primary (class)
[Button]{.secondary}        # Secondary
[Button]{.outline}          # Outline
[Button]{variant:danger}    # Danger/destructive
[Button]{state:disabled}    # Disabled
[Button]{state:loading}     # Loading
```

## Form Pattern

**⚠️ Critical Rule:** Label text must be **directly above** input (no blank line)

```markdown
## Contact Form

Name
[_____________________________]{required}

Email
[_____________________________]{type:email required}

Message
[Your message...]{rows:5}

[Submit]* [Cancel]
```

## Navigation Patterns

```markdown
# Simple nav
[[ Home | Products | About | Contact ]]

# Nav with branding and buttons
[[ :logo: Brand | Home | Products | [Sign In] | [Get Started]* ]]

# Nav with active state
[[ Home | *Products* | About ]]

# Breadcrumbs
[[ Home > Products > Category > Item ]]
```

### Multi-file Navigation

When running `wiremd --serve`, clicking a button link navigates to and renders that `.md` file:

```markdown
# Shared navbar (paste in each page)
[[ :logo: MyApp | [Home](./home.md) | [About](./about.md) | [Contact](./contact.md)* ]]
```

The dev server (`--serve <port>`) redirects `/` to the entry file and renders any `.md` on demand — no build step needed between page navigations.

## Grid Pattern

```markdown
::: grid-3 card

### Feature 1
Description here

### Feature 2
Description here

### Feature 3
Description here

:::
```

## Common Examples

### Login Form
```markdown
::: card
### Login

Email
[_____________________________]{type:email required}

Password
[********]{type:password required}

- [x] Remember me

[Log In]* [Forgot Password?]
:::
```

### Dashboard Header
```markdown
[[ :logo: Dashboard | Home | *Analytics* | Reports | :user: User ]]
```

### Alert Messages
```markdown
::: alert success
✅ Changes saved successfully!
:::

::: alert error
❌ Unable to save changes. Please try again.
:::
```

### Stats Grid
```markdown
::: grid-4 card

### Users
10,000+

### Revenue
$45,231

### Orders
1,234

### Growth
+12.5%

:::
```

## Standard Markdown

wiremd supports **all standard Markdown** syntax:

- Headings: `#` through `######`
- **Bold**: `**text**`
- *Italic*: `*text*`
- `Code`: `` `code` ``
- Links: `[text](url)`
- Images: `![alt](image.jpg)`
- Lists: `-` or `1.`
- Blockquotes: `>`
- Tables: `| col | col |`
- Horizontal rules: `---`

## Disambiguation Rules

```markdown
[Text](url)      # Link (has URL)
[Text]           # Button (no URL)
[___]            # Input (has underscores)
[***]            # Password input (has asterisks)
[Text___v]       # Dropdown (has 'v' suffix)
```

## Tips

1. **Input width**: Number of `_` characters suggests visual width
2. **Placeholder text**: Put text before underscores: `[Email___________]`
3. **Button groups**: Put on same line: `[Save] [Cancel] [Reset]`
4. **Icons in text**: Use anywhere: `### :rocket: Fast Performance`
5. **Grid items**: Each `###` heading inside `::: grid-N` is a grid item
6. **Nested containers**: Containers can be nested inside each other

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Input has no label | Put label text directly above (no blank line) |
| Dropdown has no options | Add list items directly after dropdown |
| Grid not working | Use `###` for grid items inside `::: grid-N` |
| Button looks wrong | Check for `(url)` - that makes it a link |
| Attributes ignored | Put `{...}` immediately after element (space OK) |

---

**See Also:**
- [Complete Syntax Showcase](examples/showcase.md) - Interactive examples and tutorials
- [Syntax Guide](docs/guide/syntax.md) - User-friendly guide with best practices
- [FAQ](FAQ.md) - Common questions and troubleshooting
- [Formal Specification](SYNTAX-SPEC-v0.1.md) - Complete technical specification
