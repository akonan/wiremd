/** wiremd Playground - Example snippets */

export interface Example {
  name: string;
  description: string;
  code: string;
}

export const examples: Example[] = [
  {
    name: 'Login Form',
    description: 'Simple authentication page',
    code: `## Login Form

Username
[_____________________________]{required}

Password
[*****************************]{required}

- [ ] Remember me

[Sign In]*
[Forgot Password?]
`,
  },
  {
    name: 'Dashboard',
    description: 'Stats cards with navigation',
    code: `[[ Logo | Dashboard | Analytics | Settings | [Profile] ]]

## Dashboard Overview

::: grid-3
::: card
### Total Users
# 12,847
+14.5% from last month
:::

::: card
### Revenue
# $45,230
+8.2% from last month
:::

::: card
### Active Sessions
# 1,429
-3.1% from last hour
:::
:::

## Recent Activity

| Time | User | Action | Status |
|------|------|--------|--------|
| 2 min ago | Alice | Uploaded file | Success |
| 5 min ago | Bob | Created project | Pending |
| 12 min ago | Carol | Updated settings | Success |
`,
  },
  {
    name: 'Contact Form',
    description: 'Multi-field form with validation',
    code: `## Contact Us

> We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.

First Name
[_____________________________]{required}

Last Name
[_____________________________]{required}

Email
[_____________________________]{type:email required}

Subject
{choose one v}

Message
[_____________________________|
|                             |
|                             |
|_____________________________|]{required}

- [x] Subscribe to newsletter

[Send Message]*
[Cancel]
`,
  },
  {
    name: 'E-commerce Product',
    description: 'Product detail page layout',
    code: `[[ Store | Products | Categories | Cart (3) | [Account] ]]

> / Home / Products / Headphones

::: grid-2

::: card
![Product Image]
:::

::: card
### Premium Wireless Headphones
# $299.99

⭐⭐⭐⭐⭐ (128 reviews)

Available in:
- (x) Midnight Black
- ( ) Arctic White
- ( ) Ocean Blue

Quantity
{1 v}

[Add to Cart]*
[Add to Wishlist]

---

**Free shipping** on orders over $50
:::

:::

## Customer Reviews

| Rating | Review | Author |
|--------|--------|--------|
| ⭐⭐⭐⭐⭐ | Amazing sound quality! | John D. |
| ⭐⭐⭐⭐ | Great battery life | Sarah M. |
| ⭐⭐⭐⭐⭐ | Best headphones I've owned | Mike R. |
`,
  },
  {
    name: 'Settings Page',
    description: 'User settings with toggles',
    code: `[[ App | Dashboard | Settings ]]

## Account Settings

### Profile Information

Display Name
[_____________________________]

Email
[user@example.com_____________]{type:email}

Bio
[_____________________________|
|_____________________________|]

### Notifications

- [x] Email notifications
- [x] Push notifications
- [ ] SMS notifications
- [x] Weekly digest

### Privacy

- [x] Show profile publicly
- [ ] Allow search engines to index
- [x] Two-factor authentication

---

[Save Changes]*
[Discard]
`,
  },
  {
    name: 'Landing Page',
    description: 'Marketing hero with features',
    code: `[[ wiremd | Features | Pricing | Docs | [Get Started] ]]

::: hero
# Design UI with Markdown
### The fastest way to create wireframes and mockups

> Write markdown. Get wireframes. Ship faster.

[Get Started — Free]*
[View Documentation]
:::

---

::: grid-3

::: card
### ⚡ Lightning Fast
Write your UI in markdown and see it rendered instantly. No drag and drop needed.
:::

::: card
### 🎨 Multiple Styles
Choose from Sketch, Clean, Material, Tailwind, Brutal, and more visual styles.
:::

::: card
### 🔧 Developer First
CLI tool, VS Code extension, and npm package. Fits your existing workflow.
:::

:::

---

## What developers are saying

> "wiremd changed how our team communicates about UI. We sketch ideas in markdown during standup and everyone gets it."
> 
> — **Sarah Chen**, Staff Engineer at Acme Corp
`,
  },
];
