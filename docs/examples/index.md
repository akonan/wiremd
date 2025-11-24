# wiremd Examples

This directory contains examples of wiremd syntax and outputs.

## Example Files

See the [**live showcases**](https://akonan.github.io/wiremd/showcases/) for rendered HTML outputs in all styles, or view the [source examples on GitHub](https://github.com/akonan/wiremd/tree/main/examples) for the markdown source files.

## Common Patterns

### Login Form

```markdown
## Login

Email
[_____________________________]{type:email required}

Password
[_____________________________]{type:password required}

[x] Remember me

[Login]{.primary} [Forgot password?]{.link}
```

### Navigation Bar

```markdown
[[ Logo | Home | Products | Pricing | About | Contact | [Sign In] ]]
```

### Contact Form

```markdown
## Contact Us

Name
[_____________________________]{required}

Email
[_____________________________]{type:email required}

Subject
[Select a subject____________v]
- General Inquiry
- Support
- Sales
- Partnership

Message
[                             ]
[                             ]
[                             ]
[_____________________________]{rows:5}

[Send Message]{.primary} [Clear]
```

### Dashboard Layout

```markdown
## Dashboard {.grid-3}

### Active Users
**1,234**
+12% from last week

### Revenue
**$45,678**
+8% from last week

### Conversion Rate
**3.2%**
-2% from last week
```

### Product Card

```markdown
::: card
![Product Image](https://placehold.co/400x300)

### Premium Plan

Everything you need to grow your business

- Unlimited users
- 100GB storage
- Priority support
- Advanced analytics

**$99/month**

[Get Started]{.primary} [Learn More]
:::
```

### Settings Page

```markdown
## Settings

### Profile

Full Name
[John Doe_____________________]

Email
[john@example.com_____________]{type:email}

Bio
[                             ]
[                             ]
[_____________________________]{rows:3}

### Notifications

[x] Email notifications
[ ] Push notifications
[x] Weekly digest

### Preferences

Theme
[Select theme________________v]
- Light
- Dark
- Auto

Language
[Select language_____________v]
- English
- Spanish
- French

[Save Changes]{.primary} [Cancel]
```

### Data Table

```markdown
## Users

| Name | Email | Role | Status |
|------|-------|------|--------|
| John Doe | john@example.com | Admin | Active |
| Jane Smith | jane@example.com | User | Active |
| Bob Johnson | bob@example.com | User | Inactive |

[Add User]{.primary} [Export CSV]
```

### Modal Dialog

```markdown
::: modal
## Confirm Delete

Are you sure you want to delete this item? This action cannot be undone.

[Cancel] [Delete]{.danger}
:::
```

### Tabs

```markdown
## Product Details

[[ Overview | Specifications | Reviews | Support ]]

::: tab-content
### Overview

This is an amazing product that will solve all your problems.

**Features:**
- Feature 1
- Feature 2
- Feature 3

[Add to Cart]{.primary}
:::
```

### Hero Section

```markdown
::: hero
# Transform Your Workflow

The best tool for modern teams to collaborate and build amazing products.

[Get Started Free]{.primary} [View Demo]

![Hero Image](https://placehold.co/800x400)
:::
```

### Pricing Table

```markdown
## Pricing {.grid-3}

### Basic
**$9/month**

- 10 users
- 10GB storage
- Email support
- Basic analytics

[Choose Plan]

### Pro
**$29/month**

- Unlimited users
- 100GB storage
- Priority support
- Advanced analytics
- Custom integrations

[Choose Plan]{.primary}

### Enterprise
**Custom**

- Unlimited everything
- Dedicated support
- SLA guarantee
- Custom development

[Contact Sales]
```

## Rendering Examples

View rendered HTML outputs in all 7 styles at the [**Live Showcases**](https://akonan.github.io/wiremd/showcases/):

- **Main Showcase** - Comprehensive syntax guide in all styles
  - [Sketch style](https://akonan.github.io/wiremd/showcases/showcase-sketch.html) - Balsamiq-inspired
  - [Clean style](https://akonan.github.io/wiremd/showcases/showcase-clean.html) - Modern minimal
  - [Wireframe style](https://akonan.github.io/wiremd/showcases/showcase-wireframe.html) - Traditional B&W
  - [Material style](https://akonan.github.io/wiremd/showcases/showcase-material.html) - Material Design
  - [Tailwind style](https://akonan.github.io/wiremd/showcases/showcase-tailwind.html) - Tailwind-inspired
  - [Brutal style](https://akonan.github.io/wiremd/showcases/showcase-brutal.html) - Neo-brutalism
  - [None style](https://akonan.github.io/wiremd/showcases/showcase-none.html) - Unstyled semantic HTML

- **[Form Examples](https://akonan.github.io/wiremd/showcases/form-test-clean.html)** - Various form controls
- **[Icons Demo](https://akonan.github.io/wiremd/showcases/icons-test-sketch.html)** - Icon syntax examples
- **[Radio Buttons](https://akonan.github.io/wiremd/showcases/radio-test-sketch.html)** - Radio button examples

## Next Steps

- [Learn the Syntax](../guide/syntax.md)
- [Getting Started Guide](../guide/getting-started.md)
- [API Documentation](../api/)
