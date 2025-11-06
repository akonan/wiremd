# Test Corpus v3: Hybrid Approach

**Version:** 1.0
**Date:** November 6, 2025
**Approach:** Pragmatic hybrid - visual patterns + markdown + attributes
**Philosophy:** Use the best syntax for each use case, optimizing for readability and speed

---

## Pattern 1: Login Form

```markdown
## Welcome Back

Email
[_____________________________]{type:email required}

Password
[*****************************]{type:password required}

- [ ] Remember me

[Sign In]{.primary}

[Forgot password?](#forgot) | Don't have an account? [Sign up](#signup)
```

**Rationale:**
- Visual input width indicators (`___` and `***`) are intuitive
- Attributes in `{}` for type and validation
- Native markdown for checkbox
- Button is `[Text]` with `.primary` class
- Links use standard markdown

---

## Pattern 2: Navigation Bar

```markdown
[[ :logo: MyApp | Home | Products | Pricing | About | Contact | [Sign In] [Get Started]{.primary} ]]{.nav .sticky}
```

**Alternative with explicit structure:**
```markdown
## Navigation {.nav .sticky .top}

:logo: **MyApp**

Home | Products | Pricing | About | Contact

[Sign In] [Get Started]{.primary}
```

**Rationale:**
- `[[ ... ]]` is compact for simple navbars
- `|` separators are visual and intuitive
- Standard `{.class}` for styling
- Icons use `:name:` syntax (familiar from Slack/GitHub)

---

## Pattern 3: Hero Section

```markdown
## Hero Section {.hero}

# Build Amazing Products

The fastest way to create wireframes and mockups using pure markdown.

[Get Started]{.primary} [Learn More]{.secondary}

![Hero Screenshot](hero.png){.hero-image}
```

**Rationale:**
- Native markdown headings for hierarchy
- `{.class}` for semantic styling
- Buttons use `[Text]{.class}` pattern
- Standard markdown image syntax

---

## Pattern 4: Feature Grid (3 columns)

```markdown
## Features {.grid-3}

### :rocket: Fast
Lightning quick rendering and real-time preview.

### :shield: Secure
Enterprise grade security built in from the ground up.

### :zap: Powerful
Advanced features without the complexity.
```

**Rationale:**
- H2 with `.grid-3` class defines layout
- H3 items become grid children automatically
- Icons inline with headings
- Pure markdown content

---

## Pattern 5: Contact Form

```markdown
## Contact Us

Name*
[_____________________________]{required}

Email*
[_____________________________]{type:email required}

Phone
[_____________________________]{type:tel}

Subject
[Choose a topic_______________v]{required}
- General inquiry
- Sales
- Support
- Partnership

Message*
[                             ]
[                             ]
[                             ]
[_____________________________]{rows:5 required}

- [ ] Subscribe to newsletter

[Send Message]{.primary}
```

**Rationale:**
- Visual field widths with underscores
- `v` suffix on dropdowns (visual indicator)
- List items after dropdown define options
- Textarea shown with vertical brackets
- Native markdown checkbox
- Attributes in `{}`

---

## Pattern 6: Search Bar

```markdown
:magnifying-glass: [Search products, articles, help..._______________] [Search]
```

**With autocomplete:**
```markdown
:magnifying-glass: [Search products..._______________]
::: autocomplete
Recent searches:
- Product A
- Documentation
- Support
:::
```

**Rationale:**
- Icon prefix is visual and semantic
- Input field with underscore width
- `:::` container for dropdown (markdown-it style)

---

## Pattern 7: User Profile Card

```markdown
::: card {.profile}

![:user:](avatar.jpg){.avatar}

## John Doe
**Product Designer**
San Francisco, CA

[Edit Profile] :gear:

| Posts | Followers | Following |
|:-----:|:---------:|:---------:|
| 1,234 |    567    |    89     |

:::
```

**Rationale:**
- `:::` container for card boundary
- Image with alt text as icon (fallback)
- Standard markdown for content
- Native markdown table for stats

---

## Pattern 8: Settings Page

```markdown
# Settings

## Account Settings

Display Name
[John Doe_____________________]

Email
-john@example.com- [Change Email]{.link}

## Preferences

Theme
( ) Light mode
(•) Dark mode
( ) Auto

Notifications
- [x] Email notifications
- [x] Push notifications
- [ ] SMS notifications

## Privacy

Profile visibility
( ) Public profile
(•) Friends only
( ) Private

[Save Changes]{.primary} [Cancel]
```

**Rationale:**
- Radio buttons: `( )` unselected, `(•)` selected (visual)
- Disabled text: `-text-` (strike-through style)
- Native markdown checkboxes
- Standard headings for sections

---

## Pattern 9: Data Table

```markdown
| Select | Name        | Email              | Role    | Actions |
|:------:|-------------|--------------------|---------|---------|
|  [x]   | John Doe    | john@example.com   | Admin   | :pencil:|
|  [ ]   | Jane Smith  | jane@example.com   | User    | :pencil:|
|  [ ]   | Bob Wilson  | bob@example.com    | User    | :pencil:|
|  [ ]   | Alice Chen  | alice@example.com  | Manager | :pencil:|
{.data-table .selectable}

[< Previous] 1 **2** 3 ... 10 [Next >]
```

**Rationale:**
- Native markdown table
- Checkboxes in cells
- Icons for actions
- Attributes below table
- Button syntax for pagination

---

## Pattern 10: Modal/Dialog

```markdown
::: modal
## Confirm Delete {:close:}

Are you sure you want to delete this item? This action cannot be undone.

[Cancel] [Delete]{.danger}
:::
```

**Alternative inline:**
```markdown
!!! modal "Confirm Delete"
    Are you sure you want to delete this item?
    This action cannot be undone.

    [Cancel] [Delete]{.danger}
```

**Rationale:**
- `:::` container defines modal boundary
- Close icon in heading
- Standard markdown content
- Button classes for styling

---

## Pattern 11: Sidebar Navigation

```markdown
::: sidebar

- :house: **Home**
- :inbox: Messages
- :bell: Alerts `3`
- :user: Profile
- :gear: Settings

---

- :help: Help
- :logout: Logout

:::
```

**Rationale:**
- `:::` defines sidebar container
- List items with icons
- Bold for active item
- Backticks for badge (inline code)
- Horizontal rule for separator

---

## Pattern 12: Footer

```markdown
## Footer {.site-footer}

::: grid-4

### Product
- Features
- Pricing
- Updates
- Roadmap

### Company
- About
- Team
- Careers
- Press

### Resources
- Docs
- Blog
- Support
- API

### Legal
- Terms
- Privacy
- Cookies

:::

---

© 2025 Company Name. All rights reserved.

:twitter: :linkedin: :github: :facebook:
```

**Rationale:**
- Semantic heading with class
- Grid container with column count
- Standard markdown lists
- Icons for social links

---

## Pattern 13: Breadcrumbs

```markdown
Home > Products > Electronics > Laptop Pro
```

**With icons:**
```markdown
:house: Home > :folder: Products > :folder: Electronics > Laptop Pro
{.breadcrumbs}
```

**Rationale:**
- Simple text with `>` separator (universal convention)
- Optional icons for visual clarity
- Optional class for styling

---

## Pattern 14: Tabs

```markdown
::: tabs
[Overview]* | Details | Reviews | FAQ

## Overview
This is the overview content...

- Feature 1
- Feature 2
- Feature 3
:::
```

**Alternative:**
```markdown
## [Overview]* | Details | Reviews | FAQ

This is the overview content...

- Feature 1
- Feature 2
- Feature 3
```

**Rationale:**
- Pipe-separated tab labels
- `*` suffix for active tab
- Content follows in sections
- Container `:::` for explicit grouping (optional)

---

## Pattern 15: Accordion/Collapsible

```markdown
<details open>
<summary>Question 1: What is your refund policy?</summary>

Our refund policy allows returns within 30 days of purchase for a full refund.
</details>

<details open>
<summary>Question 2: Do you offer support?</summary>

Yes, we offer 24/7 email support and live chat during business hours.
</details>

<details>
<summary>Question 3: What payment methods do you accept?</summary>

We accept all major credit cards, PayPal, and bank transfers.
</details>
```

**Alternative with symbols:**
```markdown
▼ **Question 1: What is your refund policy?**

Our refund policy allows returns within 30 days of purchase for a full refund.

▼ **Question 2: Do you offer support?**

Yes, we offer 24/7 email support and live chat during business hours.

▶ **Question 3: What payment methods do you accept?**
```

**Rationale:**
- Native HTML `<details>` is most compatible
- Alternative uses visual symbols (▼/▶) for expanded/collapsed
- Works without special parser

---

## Pattern 16: Alert/Notification

```markdown
::: alert success
:check-circle: **Success** — Your changes have been saved!
:::

::: alert info
:info-circle: **Information** — System maintenance scheduled for 10 PM
:::

::: alert warning
:warning: **Warning** — Your trial expires in 3 days
:::

::: alert error
:x-circle: **Error** — Failed to save changes. Please retry.
:::
```

**Compact inline:**
```markdown
> :check-circle: **Success:** Your changes have been saved!
{.alert .success}

> :warning: **Warning:** Your trial expires in 3 days
{.alert .warning}
```

**Rationale:**
- `:::` container with type
- Icon + bold label + message
- Alternative uses blockquote with class
- Em-dash separator is semantic

---

## Pattern 17: Loading State

```markdown
::: loading
:spinner: Loading...

Please wait while we process your request
:::
```

**Inline:**
```markdown
[Loading...]{.loading}

Processing... {:spinner:}
```

**Rationale:**
- Simple container with class
- Spinner icon for visual feedback
- Inline version for buttons/small areas

---

## Pattern 18: Empty State

```markdown
::: empty-state

:empty-box:

## No items found

Get started by creating your first item

[Create Item]{.primary}

:::
```

**Rationale:**
- Centered container
- Large icon
- Heading + description + CTA
- Standard markdown throughout

---

## Pattern 19: Error State

```markdown
::: error-state

:warning:

## Something went wrong

We couldn't load this page. Please try again.

[Retry]{.primary} [Go Back]

:::
```

**Rationale:**
- Similar structure to empty state
- Warning icon
- Action buttons for recovery

---

## Pattern 20: Dashboard Layout

```markdown
# Dashboard

[[ **Dashboard** | :bell: :user: ]]{.header}

::: layout {.sidebar-main}

## Sidebar {.sidebar}
- **Dashboard**
- Users
- Posts
- Files
---
- Help
- Exit

## Main Content {.main}

### Welcome back, John!

::: grid-3

#### :users: 1,234
Users

#### :chart-up: +12%
Growth

#### :dollar: $45,678
Revenue

:::

### Recent Activity

| Name   | Status  | Date       | Action  |
|--------|---------|------------|---------|
| Item 1 | Active  | Today      | :pencil:|
| Item 2 | Pending | Yesterday  | :pencil:|
| Item 3 | Active  | 2 days ago | :pencil:|

:::

:::
```

**Rationale:**
- Compact header navbar with `[[...]]`
- Layout container with explicit class
- Sidebar + Main as H2 sections with classes
- Grid for metrics
- Standard table for data

---

## Syntax Summary

### Core Principles

1. **Use visual patterns for common inputs**
   - `[Text]` = Button
   - `[___]` = Text input (width indicator)
   - `[***]` = Password input
   - `[...v]` = Dropdown
   - `( )` / `(•)` = Radio buttons
   - `[ ]` / `[x]` = Checkboxes (native markdown)

2. **Use attributes for configuration**
   - `{.class}` = CSS class
   - `{type:email}` = Input type
   - `{required}` = Boolean attribute
   - `{rows:5}` = Numeric attribute

3. **Use containers for layout**
   - `:::` = Generic container with type
   - `[[...]]` = Compact inline container (nav, etc.)
   - Native HTML when appropriate (`<details>`, etc.)

4. **Use markdown natively**
   - Headings for hierarchy
   - Lists for navigation/menus
   - Tables for data
   - Blockquotes for callouts
   - Horizontal rules for separators

5. **Use symbols strategically**
   - `:icon:` = Icons (Slack/GitHub style)
   - `|` = Separators
   - `*` = Primary/active state suffix
   - `>` = Breadcrumb separator
   - `-text-` = Disabled/strike-through

### Component Reference

#### Buttons
```markdown
[Button Text]                    Basic button
[Button Text]{.primary}          Primary button
[Button Text]{.secondary}        Secondary button
[Button Text]{.danger}           Danger button
[Button Text]*                   Primary (shorthand)
[Button Text]{:disabled}         Disabled state
```

#### Form Inputs
```markdown
[___________________]            Text input
[*********************]          Password input
[email@example.com____]          Input with placeholder
[___]{type:email required}       Input with attributes
[Select option________v]         Dropdown
[                     ]
[_____________________]{rows:5}  Textarea
```

#### Radio & Checkboxes
```markdown
( ) Unselected radio
(•) Selected radio
[ ] Unchecked (markdown)
[x] Checked (markdown)
```

#### Containers
```markdown
::: container-type {.class}      Block container
Content here
:::

[[ compact | content | here ]]  Inline container

## Section {.class}              Section with class
```

#### Icons
```markdown
:icon-name:                      Icon reference
:house: :user: :gear:            Common icons
```

#### States
```markdown
{.active}                        Active state
{.disabled}                      Disabled state
{.loading}                       Loading state
{:state-name}                    Custom state
*suffix                          Active/primary shorthand
```

#### Layout
```markdown
{.grid-3}                        3-column grid
{.grid-4}                        4-column grid
{.sidebar-main}                  Sidebar + main layout
{.flex}                          Flexbox layout
```

---

## Design Philosophy

### When to Use Visual Patterns

✓ **DO use visual patterns when:**
- The symbol naturally resembles the output (`[Button]`, `[___]`)
- The pattern is universally understood (`( )` for radio)
- It reduces typing significantly (`|` vs `<separator>`)
- Visual scanning is important (forms, navbars)

✗ **DON'T use visual patterns when:**
- It's ambiguous or requires explanation
- Standard markdown works just as well
- It creates accessibility issues
- It's harder to type than the alternative

### When to Use Attributes

✓ **DO use attributes when:**
- Configuring component behavior (`type:email`)
- Adding CSS classes (`.primary`)
- Setting validation rules (`required`)
- The alternative would be more verbose

✗ **DON'T use attributes when:**
- Visual shorthand is clearer (`*` vs `{.primary}`)
- Standard markdown achieves the same thing
- It clutters simple content

### When to Use Containers

✓ **DO use containers when:**
- Grouping related content
- Defining layout boundaries
- Semantic structure is important
- Styling context is needed

✗ **DON'T use containers when:**
- Native markdown structure works (lists, tables)
- It adds unnecessary nesting
- Content is simple and flat

---

## Comparison with Other Versions

### vs. Version 1 (Balsamiq-Style)
- **Keep:** Visual input patterns, button syntax, icon syntax
- **Improve:** Remove tedious ASCII boxes, add attributes for config
- **Balance:** Visual clarity + extensibility

### vs. Version 2 (Markdown-First)
- **Keep:** Container directives, attribute syntax, semantic structure
- **Improve:** Reduce verbosity, use visual shortcuts where intuitive
- **Balance:** Markdown compatibility + ease of writing

### Unique Advantages
1. **Fast to write** - Visual shortcuts for common patterns
2. **Easy to read** - Looks similar to output
3. **Extensible** - Attributes when you need them
4. **Compatible** - Graceful markdown fallback
5. **Pragmatic** - Right tool for each job

---

## Real-World Examples

### Example 1: Simple Landing Page
```markdown
# Landing Page

[[ :logo: MyApp | Home | Features | Pricing | [Sign In] [Start Free]{.primary} ]]{.nav}

## Hero {.hero}

# Transform Your Workflow
The fastest way to build amazing products

[Get Started]{.primary} [Watch Demo]

![Hero Image](hero.png)

## Features {.grid-3}

### :rocket: Fast
Lightning quick performance

### :shield: Secure
Enterprise-grade security

### :zap: Powerful
Advanced features included

## Testimonials {.grid-2}

> "This tool changed everything for us"
> — **John Doe**, CEO at TechCo

> "Incredible productivity boost"
> — **Jane Smith**, Designer at StartupXYZ

## Footer {.footer}

::: grid-4
### Product
- Features
- Pricing
- Updates

### Company
- About
- Careers
- Press

### Resources
- Docs
- Blog
- Support

### Legal
- Terms
- Privacy
:::

© 2025 MyApp. :twitter: :github: :linkedin:
```

### Example 2: User Settings Form
```markdown
# Account Settings

## Profile

Avatar
![:user:](avatar.jpg){.avatar} [Change Photo]

Name
[John Doe_____________________]

Email
[john@example.com_____________]{type:email required}

Bio
[                             ]
[                             ]
[_____________________________]{rows:4}

## Preferences

Theme
( ) Light
(•) Dark
( ) Auto

Notifications
- [x] Email updates
- [ ] SMS alerts
- [x] Push notifications

## Privacy

Profile Visibility
(•) Public
( ) Friends only
( ) Private

## Danger Zone {.danger}

[Delete Account]{.danger} [Download Data]

[Save Changes]{.primary} [Cancel]
```

---

## Migration Path

### Phase 1: MVP
Start with these patterns:
- Buttons: `[Text]` and `[Text]{.class}`
- Inputs: `[___]` with attributes
- Icons: `:icon-name:`
- Containers: `:::` directives
- Native markdown: headings, lists, tables

### Phase 2: Enhanced
Add these patterns:
- Navbars: `[[ ... ]]` syntax
- Radio/checkbox shortcuts
- State indicators
- Grid layouts

### Phase 3: Advanced
Add these patterns:
- Complex forms
- Modals and overlays
- Dashboard layouts
- Responsive attributes

---

## Best Practices

### 1. Progressive Enhancement
```markdown
## Good - Works without parser
[Sign In]{.primary}

## Also Good - Still readable
[Sign In]
```

### 2. Visual Clarity
```markdown
## Good - Width is obvious
Email
[_____________________________]

## Less Good - Width unclear
Email
{input type="email"}
```

### 3. Semantic Structure
```markdown
## Good - Clear hierarchy
## Features {.grid-3}
### Feature One
### Feature Two

## Less Good - Flat structure
[Feature One] | [Feature Two]
```

### 4. Minimal Nesting
```markdown
## Good - Flat when possible
::: alert success
Message here
:::

## Less Good - Unnecessary nesting
::: container
::: alert
::: content
Message here
:::
:::
:::
```

---

**Status:** Draft for evaluation
**Recommendation:** This hybrid approach offers the best balance of speed, readability, and extensibility
**Next Steps:** User testing and refinement based on real-world usage
