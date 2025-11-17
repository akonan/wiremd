# Card Layouts

> **Use Case:** Showcase of card components and grid layouts for content organization.
>
> **Key Features:** Basic cards, feature cards, pricing cards, profile cards, product cards, card grids

## Card Component Showcase

Comprehensive examples of card layouts and patterns.

---

## 1. Basic Card

### Simple Card

```markdown
::: card
### Card Title
This is a basic card with title and content.

[Learn More]
:::
```

**Rendered:**

::: card
### Card Title
This is a basic card with title and content.

[Learn More]
:::

---

### Card with Image

```markdown
::: card
![Feature Image](https://via.placeholder.com/400x200)

### Image Card
Cards can include images, text, and buttons for rich content presentation.

[View Details →]
:::
```

**Rendered:**

::: card
![Feature Image](https://via.placeholder.com/400x200)

### Image Card
Cards can include images, text, and buttons for rich content presentation.

[View Details →]
:::

---

## 2. Feature Cards

### Three Column Feature Grid

```markdown
## Our Features {.grid-3}

### :rocket: Fast Performance
Lightning-quick loading times and optimized rendering for the best user experience.

[Learn More →]

### :shield: Secure by Default
Enterprise-grade security with encryption, backups, and compliance certifications.

[Learn More →]

### :gear: Highly Customizable
Flexible configuration options and extensive API for complete control.

[Learn More →]

##
```

**Rendered:**

## Our Features {.grid-3}

### :rocket: Fast Performance
Lightning-quick loading times and optimized rendering for the best user experience.

[Learn More →]

### :shield: Secure by Default
Enterprise-grade security with encryption, backups, and compliance certifications.

[Learn More →]

### :gear: Highly Customizable
Flexible configuration options and extensive API for complete control.

[Learn More →]

##

---

## 3. Pricing Cards

### Pricing Tiers

```markdown
## Choose Your Plan {.grid-3}

### Starter
**$9** /month

Perfect for individuals

- 5 Projects
- 10 GB Storage
- Basic Support
- Email Reports

[Start Free Trial]*

### Professional
**$29** /month

*Most Popular*

For growing teams

- Unlimited Projects
- 100 GB Storage
- Priority Support
- Advanced Analytics
- API Access

[Start Free Trial]*

### Enterprise
**Custom**

For large organizations

- Everything in Pro
- Unlimited Storage
- Dedicated Support
- Custom Integration
- SLA Guarantee

[Contact Sales]*

##
```

**Rendered:**

## Choose Your Plan {.grid-3}

### Starter
**$9** /month

Perfect for individuals

- 5 Projects
- 10 GB Storage
- Basic Support
- Email Reports

[Start Free Trial]*

### Professional
**$29** /month

*Most Popular*

For growing teams

- Unlimited Projects
- 100 GB Storage
- Priority Support
- Advanced Analytics
- API Access

[Start Free Trial]*

### Enterprise
**Custom**

For large organizations

- Everything in Pro
- Unlimited Storage
- Dedicated Support
- Custom Integration
- SLA Guarantee

[Contact Sales]*

##

---

## 4. Product Cards

### Product Grid

```markdown
## Featured Products {.grid-4}

### Wireless Headphones
![Product](https://via.placeholder.com/250x250)

~~$129.99~~ **$89.99**

:star::star::star::star::star: (127 reviews)

[Add to Cart]*

### Smart Watch
![Product](https://via.placeholder.com/250x250)

**$299.99**

:star::star::star::star: (89 reviews)

[Add to Cart]*

### Bluetooth Speaker
![Product](https://via.placeholder.com/250x250)

~~$79.99~~ **$49.99**

:star::star::star::star::star: (203 reviews)

[Add to Cart]*

### Fitness Tracker
![Product](https://via.placeholder.com/250x250)

**$149.99**

:star::star::star::star: (156 reviews)

[Add to Cart]*

##
```

**Rendered:**

## Featured Products {.grid-4}

### Wireless Headphones
![Product](https://via.placeholder.com/250x250)

~~$129.99~~ **$89.99**

:star::star::star::star::star: (127 reviews)

[Add to Cart]*

### Smart Watch
![Product](https://via.placeholder.com/250x250)

**$299.99**

:star::star::star::star: (89 reviews)

[Add to Cart]*

### Bluetooth Speaker
![Product](https://via.placeholder.com/250x250)

~~$79.99~~ **$49.99**

:star::star::star::star::star: (203 reviews)

[Add to Cart]*

### Fitness Tracker
![Product](https://via.placeholder.com/250x250)

**$149.99**

:star::star::star::star: (156 reviews)

[Add to Cart]*

##

---

## 5. Profile/Team Cards

### Team Member Grid

```markdown
## Meet Our Team {.grid-4}

### Sarah Johnson
![Profile](https://via.placeholder.com/200x200)

**CEO & Founder**

"Passionate about building great products"

[LinkedIn] [Twitter] [[email protected]]

### Michael Chen
![Profile](https://via.placeholder.com/200x200)

**CTO**

"Technology enthusiast and problem solver"

[LinkedIn] [GitHub] [[email protected]]

### Emma Rodriguez
![Profile](https://via.placeholder.com/200x200)

**Head of Design**

"Creating beautiful user experiences"

[LinkedIn] [Dribbble] [[email protected]]

### David Kim
![Profile](https://via.placeholder.com/200x200)

**Lead Developer**

"Building scalable solutions"

[LinkedIn] [GitHub] [[email protected]]

##
```

**Rendered:**

## Meet Our Team {.grid-4}

### Sarah Johnson
![Profile](https://via.placeholder.com/200x200)

**CEO & Founder**

"Passionate about building great products"

[LinkedIn] [Twitter] [[email protected]]

### Michael Chen
![Profile](https://via.placeholder.com/200x200)

**CTO**

"Technology enthusiast and problem solver"

[LinkedIn] [GitHub] [[email protected]]

### Emma Rodriguez
![Profile](https://via.placeholder.com/200x200)

**Head of Design**

"Creating beautiful user experiences"

[LinkedIn] [Dribbble] [[email protected]]

### David Kim
![Profile](https://via.placeholder.com/200x200)

**Lead Developer**

"Building scalable solutions"

[LinkedIn] [GitHub] [[email protected]]

##

---

## 6. Blog/Article Cards

### Blog Post Grid

```markdown
## Latest Articles {.grid-3}

### Getting Started with Wireframing
![Blog Post](https://via.placeholder.com/350x200)

Learn the fundamentals of wireframing and how to create effective designs quickly.

**Design** • 5 min read • Mar 15, 2025

[Read More →]

### 10 UI Design Principles
![Blog Post](https://via.placeholder.com/350x200)

Essential principles every designer should know for creating intuitive interfaces.

**UI/UX** • 8 min read • Mar 12, 2025

[Read More →]

### Accessibility Best Practices
![Blog Post](https://via.placeholder.com/350x200)

Make your designs inclusive and accessible to all users with these proven techniques.

**Accessibility** • 6 min read • Mar 10, 2025

[Read More →]

##
```

**Rendered:**

## Latest Articles {.grid-3}

### Getting Started with Wireframing
![Blog Post](https://via.placeholder.com/350x200)

Learn the fundamentals of wireframing and how to create effective designs quickly.

**Design** • 5 min read • Mar 15, 2025

[Read More →]

### 10 UI Design Principles
![Blog Post](https://via.placeholder.com/350x200)

Essential principles every designer should know for creating intuitive interfaces.

**UI/UX** • 8 min read • Mar 12, 2025

[Read More →]

### Accessibility Best Practices
![Blog Post](https://via.placeholder.com/350x200)

Make your designs inclusive and accessible to all users with these proven techniques.

**Accessibility** • 6 min read • Mar 10, 2025

[Read More →]

##

---

## 7. Testimonial Cards

### Customer Testimonials

```markdown
## What Our Customers Say {.grid-3}

### :star::star::star::star::star:
*"This product completely transformed how we work. Best decision we made this year!"*

**Sarah Johnson**
CEO, TechStart Inc.

### :star::star::star::star::star:
*"Outstanding support and incredible features. Highly recommended for any team."*

**Michael Chen**
CTO, DataCorp

### :star::star::star::star::star:
*"Easy to use, powerful features, and great value. We couldn't be happier."*

**Emily Rodriguez**
Operations Director

##
```

**Rendered:**

## What Our Customers Say {.grid-3}

### :star::star::star::star::star:
*"This product completely transformed how we work. Best decision we made this year!"*

**Sarah Johnson**
CEO, TechStart Inc.

### :star::star::star::star::star:
*"Outstanding support and incredible features. Highly recommended for any team."*

**Michael Chen**
CTO, DataCorp

### :star::star::star::star::star:
*"Easy to use, powerful features, and great value. We couldn't be happier."*

**Emily Rodriguez**
Operations Director

##

---

## 8. Stats/Metrics Cards

### Key Metrics Dashboard

```markdown
## Performance Metrics {.grid-4}

### Total Users
**124,567**
:chart: +12.5% this month

### Revenue
**$458,234**
:chart: +18.3% this month

### Conversion Rate
**3.2%**
:chart: +0.8% this month

### Customer Satisfaction
**4.8** / 5.0
:star::star::star::star::star:

##
```

**Rendered:**

## Performance Metrics {.grid-4}

### Total Users
**124,567**
:chart: +12.5% this month

### Revenue
**$458,234**
:chart: +18.3% this month

### Conversion Rate
**3.2%**
:chart: +0.8% this month

### Customer Satisfaction
**4.8** / 5.0
:star::star::star::star::star:

##

---

## 9. Interactive Cards with States

### Card States

```markdown
## Card States {.grid-2}

### Normal Card
::: card
Regular card in default state

[Action Button]
:::

### Highlighted Card
::: card {.highlight}
**Featured!**

This card has special emphasis

[Primary Action]*
:::

##
```

**Rendered:**

## Card States {.grid-2}

### Normal Card
::: card
Regular card in default state

[Action Button]
:::

### Highlighted Card
::: card
**Featured!**

This card has special emphasis

[Primary Action]*
:::

##

---

## 10. Complex Content Cards

### Rich Content Cards

```markdown
::: card
### Project Dashboard Card

**Project:** Mobile App Redesign
**Status:** In Progress
**Due Date:** Mar 25, 2025

---

#### Team Members
- :user: Sarah (Lead Designer)
- :user: Mike (Developer)
- :user: Emma (QA)

#### Progress
[###############___] 75% Complete

---

**Recent Activity:**
- Design mockups approved (2h ago)
- API integration started (5h ago)
- Sprint planning completed (1d ago)

---

[View Project →] [Edit] [Share]
:::
```

**Rendered:**

::: card
### Project Dashboard Card

**Project:** Mobile App Redesign
**Status:** In Progress
**Due Date:** Mar 25, 2025

---

#### Team Members
- :user: Sarah (Lead Designer)
- :user: Mike (Developer)
- :user: Emma (QA)

#### Progress
[###############___] 75% Complete

---

**Recent Activity:**
- Design mockups approved (2h ago)
- API integration started (5h ago)
- Sprint planning completed (1d ago)

---

[View Project →] [Edit] [Share]
:::

---

## 11. Horizontal Cards

### List-Style Cards

```markdown
::: card
**Order #12345** | Status: Shipped | Total: $129.99

![Product Thumbnail](https://via.placeholder.com/80x80)

- Wireless Headphones (Qty: 1)
- USB-C Cable (Qty: 2)

Expected Delivery: Mar 20, 2025

[Track Order →] [View Invoice]
:::
```

**Rendered:**

::: card
**Order #12345** | Status: Shipped | Total: $129.99

![Product Thumbnail](https://via.placeholder.com/80x80)

- Wireless Headphones (Qty: 1)
- USB-C Cable (Qty: 2)

Expected Delivery: Mar 20, 2025

[Track Order →] [View Invoice]
:::

---

## Best Practices

::: card

### Card Design Guidelines

1. **Consistent Spacing**
   - Maintain uniform padding
   - Use consistent card heights in grids
   - Balance content density

2. **Clear Hierarchy**
   - Use heading levels appropriately
   - Primary action should be prominent
   - Group related information

3. **Responsive Design**
   - Use grid layouts (.grid-2, .grid-3, etc.)
   - Cards should stack on mobile
   - Images should scale properly

4. **Content Strategy**
   - Keep card content concise
   - Use clear call-to-action
   - Include relevant imagery

5. **Visual Balance**
   - Don't overcrowd cards
   - Use whitespace effectively
   - Maintain alignment

:::

---

**Style Variations:**
- `sketch` - Hand-drawn card wireframes
- `clean` - Modern minimal cards
- `wireframe` - Structure-focused cards
- `tailwind` - Contemporary card design
- `material` - Elevated Google-style cards
- `brutal` - Bold card layouts
- `none` - Semantic HTML for custom styling

**Generate this example:**
```bash
wiremd card-layouts.md --style sketch
wiremd card-layouts.md --style clean -o cards-clean.html
wiremd card-layouts.md --style material -o cards-material.html
```
