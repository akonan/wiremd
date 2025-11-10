# wiremd Syntax Guide & Component Showcase

Welcome to the comprehensive wiremd syntax guide! This document serves as both a reference and tutorial for all supported components and patterns.

> 💡 **Tip:** Use this document as a reference when creating your wireframes. Each section includes syntax examples and best practices.

> 🎨 **Visual Styles:** This showcase is available in 7 different styles:
> - `sketch` - Balsamiq-inspired hand-drawn look (default)
> - `clean` - Modern minimal design with system fonts
> - `wireframe` - Traditional grayscale with hatching patterns
> - `tailwind` - Utility-first design with purple accents
> - `material` - Google Material Design with elevation
> - `brutal` - Neo-brutalism with bold colors and thick borders
> - `none` - Unstyled semantic HTML for custom CSS

---

## 📝 Standard Markdown Support

wiremd supports all standard [Markdown syntax](https://www.markdownguide.org/basic-syntax/) including:

- **Headings** (H1-H6) using `#` syntax
- **Text formatting** - bold (`**bold**`), italic (`*italic*`), code (`` `code` ``)
- **Lists** - ordered, unordered, and nested lists
- **Links** - `[text](url)` and `[text](url "title")`
- **Images** - `![alt](image.jpg)` with optional width/height
- **Blockquotes** - using `>` prefix
- **Code blocks** - fenced with ` ``` ` and optional language
- **Tables** - using standard markdown table syntax
- **Horizontal rules** - using `---`, `***`, or `___`

The sections below focus on **wiremd's unique UI component syntax** for designing wireframes.

---

## 🔘 Buttons

### Button Syntax
```markdown
[Button Text]           # Default button
[Button Text]*          # Primary button (with asterisk)
[Button Text]{.class}   # Button with class
```

### Basic Buttons

```markdown
[Default Button]
[Primary Button]*
[Secondary Button]{.outline}
```

**Rendered:**

[Default Button]
[Primary Button]*
[Secondary Button]{.outline}

### Button States

```markdown
[Normal]
[Disabled]{state:disabled}
[Loading...]{state:loading}
[Active]{state:active}
[Success]{state:success}
```

**Rendered:**

[Normal]
[Disabled]{state:disabled}
[Loading...]{state:loading}
[Active]{state:active}
[Success]{state:success}

### Button Groups (Same Line)

```markdown
[Save] [Cancel] [Reset]
```

**Rendered:**

[Save] [Cancel] [Reset]

### Button Variants

```markdown
[Primary Action]{variant:primary}
[Danger Action]{variant:danger}
[Secondary Action]{variant:secondary}
```

**Rendered:**

[Primary Action]{variant:primary}
[Danger Action]{variant:danger}
[Secondary Action]{variant:secondary}

---

## 📋 Forms & Inputs

### Text Input Syntax
> ⚠️ **Important Rule:** Label must be DIRECTLY above input (no blank line between them)

```markdown
# ✅ Correct - Label touches input
Username
[_____________________________]

# ❌ Wrong - Blank line breaks association
Username

[_____________________________]
```

### Text Inputs with Labels

```markdown
Username
[_____________________________]

Email Address
[_____________________________] {type:email}

Password
[********] {type:password}

Phone Number
[_____________________________] {type:tel}
```

**Rendered:**

Username
[_____________________________]

Email Address
[_____________________________] {type:email}

Password
[********] {type:password}

Phone Number
[_____________________________] {type:tel}

### Input Width Control

```markdown
Age
[___]

Zip Code
[_____]

Full Name
[_____________________________]
```

**Rendered:**

Age
[___]

Zip Code
[_____]

Full Name
[_____________________________]

### Input with Placeholder Text

> ⚠️ **Note:** Placeholder syntax is currently parsed as buttons. This is a known limitation that will be fixed in a future version.

```markdown
[Enter your username___________]
[Search products...___________] {type:search}
[your.email@example.com_______] {type:email}
```

### Input Types & Attributes

```markdown
Date of Birth
[_____________________________] {type:date}

Quantity
[1___] {type:number min:1 max:100}

Website
[https://___________] {type:url}

Time
[_____________________________] {type:time}
```

**Rendered:**

Date of Birth
[_____________________________] {type:date}

Quantity
[1___] {type:number min:1 max:100}

Website
[https://___________] {type:url}

Time
[_____________________________] {type:time}

### Input States

```markdown
Normal Field
[_____________________________]

Disabled Field
[Cannot edit___________] {state:disabled}

Required Field
[_____________________________] {required:true}

Error State
[Invalid input_________] {state:error}
```

**Rendered:**

Normal Field
[_____________________________]

Disabled Field
[Cannot edit___________] {state:disabled}

Required Field
[_____________________________] {required:true}

Error State
[Invalid input_________] {state:error}

### Textarea (Multi-line)

```markdown
Comments
[Share your thoughts...] {rows:4}

Description
[Describe your project in detail...] {rows:6 cols:60}
```

**Rendered:**

Comments
[Share your thoughts...] {rows:4}

Description
[Describe your project in detail...] {rows:6 cols:60}

### Checkboxes

```markdown
Select options:
- [x] Option 1 (selected)
- [ ] Option 2
- [ ] Option 3
- [x] Option 4 (selected)
```

**Rendered:**

- [x] Option 1 (selected)
- [ ] Option 2
- [ ] Option 3
- [x] Option 4 (selected)

### Radio Buttons

```markdown
- (*) Free Plan
- ( ) Pro Plan ($9/mo)
- ( ) Enterprise (Contact us)
```

**Rendered:**

- (*) Free Plan
- ( ) Pro Plan ($9/mo)
- ( ) Enterprise (Contact us)

### Dropdown/Select

```markdown
Country
[Select your country...v]
- United States
- Canada
- United Kingdom
- Australia
- Other
```

**Rendered:**

Country
[Select your country...v]

---

## 🗂️ Navigation

### Navigation Bar Syntax
```markdown
[[ Item1 | Item2 | Item3 ]]         # Basic nav
[[ Logo | Item1 | Item2 | [Button] ]] # With button
[[ :icon: Brand | Item1 | *Active* ]] # With icon & active
```

### Examples

```markdown
[[ Home | Products | Services | About | Contact ]]

[[ :logo: MyApp | Home | Features | Pricing | [Sign In] | [Get Started]* ]]

[[ Logo | Home | *Products* | About | Contact ]]
```

**Rendered:**

[[ Home | Products | Services | About | Contact ]]

[[ :logo: MyApp | Home | Features | Pricing | [Sign In] | [Get Started]* ]]

[[ Logo | Home | *Products* | About | Contact ]]

### Breadcrumbs

```markdown
[[ Home > Products > Electronics > Laptops ]]
```

**Rendered:**

[[ Home > Products > Electronics > Laptops ]]

---

## 📦 Containers

### Container Syntax
```markdown
::: container-type
Content goes here
:::
```

### Card Container

```markdown
::: card
### Card Title
Card content with any components.

[Card Action]
:::
```

**Rendered:**

::: card
### Card Title
Card content with any components.

[Card Action]
:::

### Hero Section

```markdown
::: hero
# Welcome Hero Title
Compelling hero description text.

[Primary CTA]* [Secondary CTA]
:::
```

**Rendered:**

::: hero
# Welcome Hero Title
Compelling hero description text.

[Primary CTA]* [Secondary CTA]
:::

### Alert Types

```markdown
::: alert success
✅ **Success!** Operation completed successfully.
:::

::: alert info
ℹ️ **Info:** Here's some useful information.
:::

::: alert warning
⚠️ **Warning:** Please review before proceeding.
:::

::: alert error
❌ **Error:** Something went wrong. Please try again.
:::
```

**Rendered:**

::: alert success
✅ **Success!** Operation completed successfully.
:::

::: alert info
ℹ️ **Info:** Here's some useful information.
:::

::: alert warning
⚠️ **Warning:** Please review before proceeding.
:::

::: alert error
❌ **Error:** Something went wrong. Please try again.
:::

### Modal Dialog

```markdown
::: modal
### Confirm Delete
Are you sure you want to delete this item?

[Delete]* [Cancel]
:::
```

**Rendered:**

::: modal
### Confirm Delete
Are you sure you want to delete this item?

[Delete]* [Cancel]
:::

### Sidebar

```markdown
::: sidebar
#### Navigation
- Dashboard
- Profile
- Settings
- Logout
:::
```

**Rendered:**

::: sidebar
#### Navigation
- Dashboard
- Profile
- Settings
- Logout
:::

### Footer

```markdown
::: footer
[[ Privacy | Terms | Contact ]]
© 2025 Company. All rights reserved.
:::
```

**Rendered:**

::: footer
[[ Privacy | Terms | Contact ]]
© 2025 Company. All rights reserved.
:::

---

## 🏗️ Grid Layouts

### Grid Syntax
```markdown
## Title {.grid-N}  # Where N is number of columns
### Column 1 content
### Column 2 content
```

### 2-Column Grid

```markdown
## Pricing {.grid-2}

### Free Plan
- 10 GB Storage
- Basic Support
- 5 Users

[Choose Free]

### Pro Plan
- Unlimited Storage
- Priority Support
- Unlimited Users

[Choose Pro]*
```

**Rendered:**

## Pricing {.grid-2}

### Free Plan
- 10 GB Storage
- Basic Support
- 5 Users
[Choose Free]

### Pro Plan
- Unlimited Storage
- Priority Support
- Unlimited Users
[Choose Pro]*

##

### 3-Column Grid

```markdown
## Features {.grid-3}

### :rocket: Fast
Lightning quick performance

### :shield: Secure
Bank-level security

### :gear: Flexible
Fully customizable
```

**Rendered:**

## Features {.grid-3}

### :rocket: Fast
Lightning quick performance

### :shield: Secure
Bank-level security

### :gear: Flexible
Fully customizable

##

### 4-Column Grid

```markdown
## Stats {.grid-4}

### Users
10,000+

### Projects
500+

### Countries
50+

### Uptime
99.9%
```

**Rendered:**

## Stats {.grid-4}

### Users
10,000+

### Projects
500+

### Countries
50+

### Uptime
99.9%

---

## 📊 Tables

### Basic Table

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1-1 | Cell 1-2 | Cell 1-3 |
| Cell 2-1 | Cell 2-2 | Cell 2-3 |
| Cell 3-1 | Cell 3-2 | Cell 3-3 |
```

**Rendered:**

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1-1 | Cell 1-2 | Cell 1-3 |
| Cell 2-1 | Cell 2-2 | Cell 2-3 |
| Cell 3-1 | Cell 3-2 | Cell 3-3 |

### With Alignment

```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| Left | Center | Right |
| Text | Text   | Text  |
```

**Rendered:**

| Left | Center | Right |
|:-----|:------:|------:|
| Left | Center | Right |
| Text | Text   | Text  |

---

## 🎨 Icons

### Icon Syntax
```markdown
:icon-name:       # In text
:icon{name}       # With attributes
```

### Common Icons

```markdown
:home: Home
:user: User
:settings: Settings
:star: Star
:heart: Heart
:search: Search
```

**Rendered:**

:home: Home
:user: User
:settings: Settings
:star: Star
:heart: Heart
:search: Search

### Icons in Headings

```markdown
### :rocket: Launch Features
#### :bulb: Bright Ideas
```

**Rendered:**

### :rocket: Launch Features
#### :bulb: Bright Ideas

---

## 🎯 Component States

### Loading State

```markdown
::: loading-state
Loading your content...
:::
```

**Rendered:**

::: loading-state
Loading your content...
:::

### Empty State

```markdown
::: empty-state
No items found
[Add First Item]
:::
```

**Rendered:**

::: empty-state
No items found
[Add First Item]
:::

### Error State

```markdown
::: error-state
Unable to load data
[Retry]
:::
```

**Rendered:**

::: error-state
Unable to load data
[Retry]
:::

---

## 🎛️ Interactive Components

### Tabs (Syntax Example - Not Yet Implemented)

```markdown
::: tabs
::: tab "Overview" active
Overview content here
:::
::: tab "Details"
Details content here
:::
::: tab "Settings"
Settings content here
:::
:::
```

### Accordion (Syntax Example - Not Yet Implemented)

```markdown
::: accordion
::: accordion-item "Section 1" expanded
First section content
:::
::: accordion-item "Section 2"
Second section content
:::
:::
```

---

## ✅ Common Patterns & Best Practices

### Complete Form Example
::: card
### User Registration

First Name
[_____________________________] {required:true}

Last Name
[_____________________________] {required:true}

Email
[_____________________________] {type:email required:true}

Password
[********] {type:password required:true}

Country
[Select country...v]

Account Type
- (*) Personal
- ( ) Business

Terms
- [x] I accept the terms of service
- [ ] Send me newsletters

[Create Account]* [Cancel]
:::

### Dashboard Layout
## Analytics Dashboard {.hero}

[[ :logo: Dashboard | Overview | *Analytics* | Reports | Settings | :user: User ]]

## Quick Stats {.grid-4}

### Revenue
$45,231

### Orders
1,234

### Customers
892

### Growth
+12.5%

## Recent Activity

| Time | User | Action | Status |
|------|------|--------|--------|
| 2m ago | John | Purchase | Success |
| 5m ago | Jane | Login | Success |
| 10m ago | Bob | Update | Pending |

---

## 🚀 Complete Page Example

# Project Management Dashboard

[[ :logo: TaskFlow | Dashboard | *Projects* | Team | Reports | :user: Jane Doe | [Logout] ]]

[[ Dashboard > Projects > Active ]]

## Active Projects {.hero}
> Manage your team's projects efficiently
> Track progress, assign tasks, collaborate
>
> [New Project]* [Import] [Export]

## Project Stats {.grid-4}
### Total
42

### Active
28

### Completed
12

### On Hold
2

## Current Sprint {.card}

Sprint 23 Progress
[##########________] 60% Complete

### This Week's Tasks

| Task | Assignee | Status | Priority |
|------|----------|--------|----------|
| Design mockups | Alice | In Progress | High |
| API integration | Bob | Complete | Medium |
| Testing | Charlie | Pending | High |
| Documentation | Dana | In Progress | Low |

[View All Tasks]

## Quick Actions {.grid-3}

### :plus: Create
New Task
[_____________________________]

Assign to
[Select team member...v]

[Create Task]*

### :search: Find
Search tasks
[Search...___________] {type:search}

Filter by
- [x] My tasks
- [ ] Unassigned
- [ ] Overdue

### :bell: Notifications
- Task #234 completed
- New comment on #198
- Sprint planning tomorrow

[Mark all read]

## Page Footer

::: footer
[[ Help | API Docs | Privacy | Terms ]]
© 2025 TaskFlow Inc.
:::

---

*This showcase serves as a complete syntax reference for wiremd. Copy and modify these examples to create your own wireframes quickly!*