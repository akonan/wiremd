# Test Corpus v2: Markdown-First with Attributes

**Version:** 1.0
**Date:** November 6, 2025
**Approach:** Native markdown with progressive enhancement via attributes
**Philosophy:** Valid markdown first, enhance with attributes, minimal custom syntax

---

## Pattern 1: Login Form

```markdown
## Welcome Back {.login-form}

Email
{input type="email" required}

Password
{input type="password" required}

- [ ] Remember me

{button .primary}Sign In{/button}

[Forgot password?](#forgot)

Don't have an account? [Sign up](#signup)
```

**Alternative using HTML-like syntax:**
```markdown
## Welcome Back

{form}
  {field label="Email" type="email" required /}
  {field label="Password" type="password" required /}
  {checkbox}Remember me{/checkbox}
  {button primary}Sign In{/button}
{/form}

[Forgot password?](#forgot) | [Sign up](#signup)
```

---

## Pattern 2: Navigation Bar

```markdown
{nav .sticky .top}
  {brand}MyApp{/brand}
  {nav-items}
    - Home
    - Products
    - Pricing
    - About
    - Contact
  {/nav-items}
  {nav-actions}
    - [Sign In](#signin)
    - [Get Started](#start){.primary}
  {/nav-actions}
{/nav}
```

**Alternative:**
```markdown
::: nav {sticky top}
**MyApp** | Home | Products | Pricing | About | Contact | [Sign In] [Get Started]{.primary}
:::
```

---

## Pattern 3: Hero Section

```markdown
::: hero
# Build Amazing Products {.hero-title}

The fastest way to create wireframes and mockups using pure markdown.

[Get Started]{.primary} [Learn More]{.secondary}

![Hero Screenshot](hero.png){.hero-image}
:::
```

**Alternative:**
```markdown
> ## Build Amazing Products
>
> The fastest way to create wireframes and mockups using pure markdown.
>
> [Get Started]{.button .primary} [Learn More]{.button .secondary}
>
> ![Hero Screenshot](hero.png)
{.hero}
```

---

## Pattern 4: Feature Grid (3 columns)

```markdown
::: grid {cols=3}

### :rocket: Fast
Lightning quick rendering and real-time preview.

### :shield: Secure
Enterprise grade security built in from the ground up.

### :zap: Powerful
Advanced features without the complexity.

:::
```

**Alternative with explicit items:**
```markdown
## Features {.grid-3}

{card}
### :rocket: Fast
Lightning quick rendering and real-time preview.
{/card}

{card}
### :shield: Secure
Enterprise grade security built in from the ground up.
{/card}

{card}
### :zap: Powerful
Advanced features without the complexity.
{/card}
```

---

## Pattern 5: Contact Form

```markdown
## Contact Us {.contact-form}

{field label="Name" required /}

{field label="Email" type="email" required /}

{field label="Phone" type="tel" /}

{select label="Subject" required}
- General inquiry
- Sales
- Support
- Partnership
{/select}

{textarea label="Message" rows=5 required /}

- [ ] Subscribe to newsletter

{button .primary}Send Message{/button}
```

**Alternative:**
```markdown
## Contact Us

Name*
{input required}

Email*
{input type="email" required}

Phone
{input type="tel"}

Subject
{select required}General inquiry | Sales | Support | Partnership{/select}

Message*
{textarea rows=5 required}

- [ ] Subscribe to newsletter

[Send Message]{.button .primary}
```

---

## Pattern 6: Search Bar

```markdown
{search placeholder="Search products, articles, help..." /}
```

**With autocomplete:**
```markdown
{search placeholder="Search products..."}
  {autocomplete}
    Recent searches:
    - Product A
    - Documentation
    - Support
  {/autocomplete}
{/search}
```

**Alternative:**
```markdown
:magnifying-glass: {input type="search" placeholder="Search products..." .search-bar}
```

---

## Pattern 7: User Profile Card

```markdown
::: card {.profile-card}

![Profile Photo](avatar.jpg){.avatar}

## John Doe
**Product Designer**
San Francisco, CA

[Edit Profile]{.secondary} :gear:

| Posts | Followers | Following |
|:-----:|:---------:|:---------:|
| 1,234 |    567    |    89     |

:::
```

**Alternative:**
```markdown
{profile-card}
  {avatar src="avatar.jpg" /}
  {name}John Doe{/name}
  {title}Product Designer{/title}
  {location}San Francisco, CA{/location}

  [Edit Profile]{.button} {:gear:}

  {stats}
    {stat value="1,234" label="Posts" /}
    {stat value="567" label="Followers" /}
    {stat value="89" label="Following" /}
  {/stats}
{/profile-card}
```

---

## Pattern 8: Settings Page

```markdown
# Settings

## Account Settings {.section}

{field label="Display Name" value="John Doe" /}

{field label="Email" value="john@example.com" disabled /}
_john@example.com_ [Change Email]{.link}

## Preferences {.section}

{radio-group label="Theme"}
- (x) Light mode
- ( ) Dark mode
- ( ) Auto
{/radio-group}

{checkbox-group label="Notifications"}
- [x] Email notifications
- [x] Push notifications
- [ ] SMS notifications
{/checkbox-group}

## Privacy {.section}

{radio-group label="Profile visibility"}
- ( ) Public profile
- (x) Friends only
- ( ) Private
{/radio-group}

[Save Changes]{.primary} [Cancel]{.secondary}
```

---

## Pattern 9: Data Table

```markdown
{table .data-table selectable sortable}

| Select | Name        | Email              | Role    | Actions |
|--------|-------------|--------------------|---------|---------|
| [x]    | John Doe    | john@example.com   | Admin   | :pencil:|
| [ ]    | Jane Smith  | jane@example.com   | User    | :pencil:|
| [ ]    | Bob Wilson  | bob@example.com    | User    | :pencil:|
| [ ]    | Alice Chen  | alice@example.com  | Manager | :pencil:|

{/table}

{pagination}
[< Previous] 1 **2** 3 ... 10 [Next >]
{/pagination}
```

**Alternative:**
```markdown
| Name        | Email              | Role    | Actions     |
|-------------|--------------------|---------|-----------  |
| John Doe    | john@example.com   | Admin   | [Edit]      |
| Jane Smith  | jane@example.com   | User    | [Edit]      |
| Bob Wilson  | bob@example.com    | User    | [Edit]      |
| Alice Chen  | alice@example.com  | Manager | [Edit]      |
{.data-table .striped .hover}

Page 2 of 10 — [Previous](#) [Next](#)
```

---

## Pattern 10: Modal/Dialog

```markdown
{modal id="confirm-delete"}
## Confirm Delete {.modal-title}

Are you sure you want to delete this item? This action cannot be undone.

[Cancel]{.secondary} [Delete]{.danger}
{/modal}
```

**Alternative:**
```markdown
::: modal {title="Confirm Delete"}
Are you sure you want to delete this item?
This action cannot be undone.

[Cancel]{.button} [Delete]{.button .danger}
:::
```

---

## Pattern 11: Sidebar Navigation

```markdown
{sidebar}
- :house: Home {.active}
- :inbox: Messages
- :bell: Alerts {badge="3"}
- :user: Profile
- :gear: Settings
---
- :help: Help
- :logout: Logout
{/sidebar}
```

**Alternative:**
```markdown
::: sidebar

### Navigation
- [:house: Home](#home){.active}
- [:inbox: Messages](#messages)
- [:bell: Alerts](#alerts) `3`
- [:user: Profile](#profile)
- [:gear: Settings](#settings)

### Account
- [:help: Help](#help)
- [:logout: Logout](#logout)

:::
```

---

## Pattern 12: Footer

```markdown
::: footer

::: grid {cols=4}

### Product
- [Features](#features)
- [Pricing](#pricing)
- [Updates](#updates)
- [Roadmap](#roadmap)

### Company
- [About](#about)
- [Team](#team)
- [Careers](#careers)
- [Press](#press)

### Resources
- [Docs](#docs)
- [Blog](#blog)
- [Support](#support)
- [API](#api)

### Legal
- [Terms](#terms)
- [Privacy](#privacy)
- [Cookies](#cookies)

:::

---

© 2025 Company Name. All rights reserved.

:twitter: :linkedin: :github: :facebook:

:::
```

---

## Pattern 13: Breadcrumbs

```markdown
{breadcrumbs}
Home > Products > Electronics > Laptop Pro
{/breadcrumbs}
```

**Alternative:**
```markdown
:house: [Home](#) > :folder: [Products](#) > :folder: [Electronics](#) > Laptop Pro
{.breadcrumbs}
```

---

## Pattern 14: Tabs

```markdown
{tabs}
  {tab label="Overview" active}
    This is the overview content...

    - Feature 1
    - Feature 2
    - Feature 3
  {/tab}

  {tab label="Details"}
    Details content here...
  {/tab}

  {tab label="Reviews"}
    Reviews content here...
  {/tab}

  {tab label="FAQ"}
    FAQ content here...
  {/tab}
{/tabs}
```

**Alternative:**
```markdown
::: tabs

## Overview {.active}
This is the overview content...

- Feature 1
- Feature 2
- Feature 3

## Details
Details content here...

## Reviews
Reviews content here...

## FAQ
FAQ content here...

:::
```

---

## Pattern 15: Accordion/Collapsible

```markdown
{accordion}

{item expanded}
### Question 1: What is your refund policy?
Our refund policy allows returns within 30 days of purchase for a full refund.
{/item}

{item expanded}
### Question 2: Do you offer support?
Yes, we offer 24/7 email support and live chat during business hours.
{/item}

{item}
### Question 3: What payment methods do you accept?
We accept all major credit cards, PayPal, and bank transfers.
{/item}

{item}
### Question 4: Is there a free trial?
Yes, we offer a 14-day free trial with no credit card required.
{/item}

{/accordion}
```

**Alternative:**
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

<details>
<summary>Question 4: Is there a free trial?</summary>
Yes, we offer a 14-day free trial with no credit card required.
</details>
```

---

## Pattern 16: Alert/Notification

```markdown
::: alert {type="success"}
:check-circle: **Success**
Your changes have been saved!
:::

::: alert {type="info"}
:info-circle: **Information**
System maintenance scheduled for 10 PM
:::

::: alert {type="warning"}
:warning: **Warning**
Your trial expires in 3 days
:::

::: alert {type="error"}
:x-circle: **Error**
Failed to save changes. Please retry.
:::
```

**Alternative:**
```markdown
{alert .success}
**Success:** Your changes have been saved!
{/alert}

{alert .info}
**Information:** System maintenance scheduled for 10 PM
{/alert}

{alert .warning}
**Warning:** Your trial expires in 3 days
{/alert}

{alert .error}
**Error:** Failed to save changes. Please retry.
{/alert}
```

---

## Pattern 17: Loading State

```markdown
::: loading
Please wait while we process your request...
:::
```

**Alternative:**
```markdown
{loading message="Processing your request..."}

{spinner}Loading...{/spinner}

Please wait... {.loading}
```

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

**Alternative:**
```markdown
{empty-state icon="empty-box" title="No items found"}
Get started by creating your first item

[Create Item]{.button .primary}
{/empty-state}
```

---

## Pattern 19: Error State

```markdown
::: error-state
:warning:

## Something went wrong

We couldn't load this page. Please try again.

[Retry]{.primary} [Go Back]{.secondary}
:::
```

**Alternative:**
```markdown
{error-state icon="warning" title="Something went wrong"}
We couldn't load this page. Please try again.

[Retry]{.button .primary} [Go Back]{.button}
{/error-state}
```

---

## Pattern 20: Dashboard Layout

```markdown
::: dashboard

{header}
**Dashboard** :bell: :user:
{/header}

::: layout {sidebar main}

{sidebar}
- Dashboard {.active}
- Users
- Posts
- Files
---
- Help
- Exit
{/sidebar}

{main}

## Welcome back, John!

::: grid {cols=3}

{stat icon="users" value="1,234" label="Users" /}
{stat icon="chart" value="+12%" label="Growth" /}
{stat icon="dollar" value="$45,678" label="Revenue" /}

:::

## Recent Activity

| Name   | Status  | Date      | Action  |
|--------|---------|-----------|---------|
| Item 1 | Active  | Today     | [Edit]  |
| Item 2 | Pending | Yesterday | [Edit]  |
| Item 3 | Active  | 2 days ago| [Edit]  |
{.activity-table}

{/main}

:::

:::
```

---

## Syntax Reference

### Custom Components

**Inline Syntax:**
```markdown
{component-name attr="value" .class}
```

**Block Syntax:**
```markdown
{component-name attr="value"}
Content here
{/component-name}
```

**Self-Closing:**
```markdown
{component-name attr="value" /}
```

### Container Directives

**Triple-colon syntax (Markdown-it style):**
```markdown
::: container-name {attr="value" .class}
Content here
:::
```

### Attributes

**Class syntax:**
```markdown
{.class-name}
[Link text](#url){.button .primary}
```

**Key-value attributes:**
```markdown
{key="value" key2="value2"}
{input type="email" placeholder="Email" required}
```

**Combined:**
```markdown
{component .class attr="value" /}
```

### Form Elements

**Input field:**
```markdown
{input type="text" placeholder="Enter text..." required /}
{field label="Email" type="email" required /}
```

**Textarea:**
```markdown
{textarea rows=5 placeholder="Message..." /}
```

**Select/Dropdown:**
```markdown
{select label="Choose option"}
- Option 1
- Option 2
- Option 3
{/select}
```

**Checkboxes (native markdown):**
```markdown
- [x] Checked item
- [ ] Unchecked item
```

**Radio buttons:**
```markdown
- (x) Selected option
- ( ) Unselected option
```

### Buttons

```markdown
[Button Text]{.button}
[Button Text]{.button .primary}
[Button Text]{.button .secondary}
[Button Text]{.button .danger}

{button .primary}Submit{/button}
```

### Icons

```markdown
:icon-name:
:house: :user: :gear: :check-circle: :warning:
```

### States

```markdown
{.loading}
{.disabled}
{.active}
{.error}
{state="loading"}
```

### Layout

```markdown
::: grid {cols=3}
Content
:::

::: layout {sidebar main}
Sidebar | Main content
:::

::: flex {justify="space-between"}
Content
:::
```

---

## Design Notes

### Strengths of This Approach

1. **Valid markdown base** - Degrades gracefully without parser
2. **Progressive enhancement** - Add features via attributes
3. **Familiar syntax** - Uses existing markdown conventions
4. **Semantic** - Components have clear meaning
5. **Extensible** - Easy to add new attributes
6. **Version control friendly** - Readable diffs

### Challenges

1. **More verbose** - Requires more typing than visual shortcuts
2. **Learning curve** - Need to know attribute names
3. **Less visually obvious** - Doesn't look like the output
4. **Attribute syntax** - Multiple competing standards (`::: vs {})

### Best Use Cases

- Documentation that should work without parser
- Projects with version control
- Teams familiar with markdown
- When semantic meaning is important
- Progressive enhancement workflows

### Worst Use Cases

- Quick sketching
- Non-technical users
- When visual layout in source matters
- Rapid prototyping sessions

---

## Alternative Attribute Syntaxes Considered

### Option A: Curly braces (chosen)
```markdown
{component attr="value" .class}
```

### Option B: HTML-style attributes
```markdown
<component attr="value" class="class">
```

### Option C: Markdown-it container directives
```markdown
::: component {attr="value"}
:::
```

### Option D: Front-matter style
```markdown
## Component
---
attr: value
class: class-name
---
Content
```

---

**Status:** Draft for evaluation
**Next Steps:** Compare with v1 (Balsamiq-style) and v3 (Hybrid) approaches
