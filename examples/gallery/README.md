# wiremd Examples Gallery

> **Comprehensive showcase of wiremd capabilities across forms, landing pages, dashboards, and components.**

Welcome to the wiremd examples gallery! This collection demonstrates the full range of wiremd's capabilities through 20 real-world examples across 4 categories.

---

## 🎯 What's in the Gallery?

This gallery contains **20 production-ready examples** designed to help you:
- Learn wiremd syntax by example
- Copy and customize for your own projects
- Understand best practices for wireframing
- See all 7 visual styles in action

---

## 📚 Example Categories

### 📋 Forms (5 Examples)

Real-world form layouts for user input and data collection.

| Example | Description | Key Features | View |
|---------|-------------|--------------|------|
| **Contact Form** | Standard contact/inquiry form | Text inputs, email validation, textarea, button groups | [View →](forms/contact-form.md) |
| **Login Form** | User authentication page | Password fields, remember me, social login, links | [View →](forms/login-form.md) |
| **Registration Form** | Multi-section signup form | Multi-column layout, plan selection, validation | [View →](forms/registration-form.md) |
| **Search Form** | Advanced search with filters | Filters, checkboxes, range inputs, results display | [View →](forms/search-form.md) |
| **Multi-Step Form** | Wizard/onboarding flow | Progress indicator, step navigation, data persistence | [View →](forms/multi-step-form.md) |

---

### 🚀 Landing Pages (5 Examples)

Complete landing page layouts for various products and services.

| Example | Description | Key Features | View |
|---------|-------------|--------------|------|
| **SaaS Product** | Software-as-a-Service landing page | Hero, features, pricing tiers, testimonials, footer | [View →](landing-pages/saas-product.md) |
| **Portfolio Site** | Personal portfolio for creatives | Project gallery, skills showcase, about section | [View →](landing-pages/portfolio.md) |
| **App Landing Page** | Mobile/web app marketing page | App screenshots, download CTAs, feature highlights | [View →](landing-pages/app-landing.md) |
| **E-Commerce Homepage** | Online store homepage | Product grids, categories, promotions, newsletter | [View →](landing-pages/ecommerce-home.md) |
| **Agency Website** | Creative agency/consultancy site | Services, case studies, team showcase, contact form | [View →](landing-pages/agency-site.md) |

---

### 📊 Dashboards (5 Examples)

Application dashboards for data visualization and management.

| Example | Description | Key Features | View |
|---------|-------------|--------------|------|
| **Analytics Dashboard** | Web analytics platform | KPI cards, charts, real-time stats, data tables | [View →](dashboards/analytics-dashboard.md) |
| **Admin Panel** | Application administration | User management, CRUD operations, system stats | [View →](dashboards/admin-panel.md) |
| **E-Commerce Dashboard** | Online store management | Sales metrics, inventory, order management | [View →](dashboards/ecommerce-dashboard.md) |
| **Project Management** | Team collaboration dashboard | Task boards, sprint tracking, team activity, timeline | [View →](dashboards/project-management.md) |
| **Social Media Dashboard** | Social platform management | Post scheduling, engagement metrics, analytics | [View →](dashboards/social-media-dashboard.md) |

---

### 🧩 Components (5 Examples)

Reusable UI component patterns and layouts.

| Example | Description | Key Features | View |
|---------|-------------|--------------|------|
| **Navigation Patterns** | Navigation component showcase | Top nav, breadcrumbs, sidebar, tabs, footer | [View →](components/navigation-patterns.md) |
| **Card Layouts** | Card components and grids | Feature cards, pricing cards, product cards, blog cards | [View →](components/card-layouts.md) |
| **Tables & Data Grids** | Table layouts for structured data | Sortable tables, filters, pagination, data grids | [View →](components/tables-data-grids.md) |
| **Modals & Dialogs** | Modal windows and overlays | Confirmations, forms, alerts, multi-step modals | [View →](components/modals-dialogs.md) |
| **Form Controls** | Comprehensive form inputs | All input types, validation states, layouts | [View →](components/form-controls.md) |

---

## 🎨 Visual Styles

Each example can be rendered in **7 different visual styles**:

| Style | Description | Best For |
|-------|-------------|----------|
| `sketch` | Balsamiq-inspired hand-drawn look | Quick prototypes, brainstorming, stakeholder reviews |
| `clean` | Modern minimal design | Professional presentations, client deliverables |
| `wireframe` | Traditional grayscale | Specifications, developer handoff, focus on structure |
| `tailwind` | Utility-first with purple accents | Contemporary web apps, modern aesthetics |
| `material` | Google Material Design | Android apps, Google-style interfaces |
| `brutal` | Neo-brutalism with bold colors | Distinctive branding, artistic projects |
| `none` | Unstyled semantic HTML | Custom CSS frameworks, complete control |

---

## 🚀 Quick Start

### 1. View Pre-Rendered Examples

All 140 wireframe variations (20 examples × 7 styles) are **already generated** and available in the `rendered/` directory:

```
examples/gallery/rendered/
├── forms/
│   ├── contact-form-sketch.html
│   ├── contact-form-clean.html
│   ├── contact-form-wireframe.html
│   ├── contact-form-tailwind.html
│   ├── contact-form-material.html
│   ├── contact-form-brutal.html
│   ├── contact-form-none.html
│   └── ... (all 5 forms × 7 styles = 35 files)
├── landing-pages/
│   └── ... (5 landing pages × 7 styles = 35 files)
├── dashboards/
│   └── ... (5 dashboards × 7 styles = 35 files)
└── components/
    └── ... (5 components × 7 styles = 35 files)
```

**Quick View:** Open any HTML file in your browser to instantly see the wireframe in action.

### 2. Browse Examples

Navigate to any category above and explore the examples. Each example includes:
- Complete markdown source
- Description and use case
- Key features demonstrated
- Generation commands for all styles
- Pre-rendered HTML files in all 7 styles

### 3. Generate Your Own Wireframes

Want to modify examples or create your own? Generate wireframes from markdown:

```bash
# Generate with default sketch style
wiremd examples/gallery/forms/contact-form.md

# Generate with specific style
wiremd examples/gallery/forms/contact-form.md --style clean

# Generate all styles
for style in sketch clean wireframe tailwind material brutal none; do
  wiremd examples/gallery/forms/contact-form.md --style $style -o contact-$style.html
done
```

### 4. Customize for Your Needs

All examples are designed to be:
- **Easy to modify** - Change text, labels, and structure
- **Copy-paste ready** - Use sections in your own wireframes
- **Production-ready** - Based on real-world patterns

---

## 📖 Learning Path

### For Beginners

1. Start with **Form Controls** to learn basic syntax
2. Explore **Contact Form** for a simple complete example
3. Try **Navigation Patterns** for layout components
4. Build a **Card Layouts** page to practice grids

### For Intermediate Users

1. Study **Landing Pages** for complete page structure
2. Explore **Dashboards** for complex data layouts
3. Experiment with different visual styles
4. Combine components to create custom designs

### For Advanced Users

1. Analyze **Multi-Step Form** for complex flows
2. Study **Project Management Dashboard** for data-heavy UIs
3. Build custom components using patterns from examples
4. Contribute your own examples to the gallery!

---

## 💡 Tips & Best Practices

### Content Organization

- **Use descriptive headings** - Clear hierarchy improves readability
- **Group related content** - Use cards and sections
- **Leverage grids** - `.grid-2`, `.grid-3`, `.grid-4` for responsive layouts

### Form Design

- **Label placement** - Labels must directly precede inputs (no blank line)
- **Input types** - Use appropriate types (email, tel, date, etc.)
- **Validation** - Mark required fields, show error states
- **Button hierarchy** - Primary actions with `*`, secondary without

### Navigation

- **Top nav** - Use `[[ Item1 | Item2 | Item3 ]]`
- **Active states** - Use `*Item*` for current page
- **Breadcrumbs** - Use `>` separator: `[[ Home > Products > Item ]]`
- **Icons** - Add with `:icon:` syntax

### Tables

- **Headers** - Always include clear column headers
- **Alignment** - Use `:---` (left), `:---:` (center), `---:` (right)
- **Actions** - Place in rightmost column
- **Status** - Use emojis or colored indicators

---

## 🔄 Generate All Examples

### Bash Script

```bash
#!/bin/bash

# Generate all gallery examples in all styles

STYLES=("sketch" "clean" "wireframe" "tailwind" "material" "brutal" "none")
CATEGORIES=("forms" "landing-pages" "dashboards" "components")

for category in "${CATEGORIES[@]}"; do
  for file in examples/gallery/$category/*.md; do
    filename=$(basename "$file" .md)

    for style in "${STYLES[@]}"; do
      echo "Generating $filename with $style style..."
      wiremd "$file" --style "$style" -o "output/$category-$filename-$style.html"
    done
  done
done

echo "All examples generated!"
```

### One-Liner for Specific Example

```bash
# Generate contact form in all styles
for style in sketch clean wireframe tailwind material brutal none; do \
  wiremd examples/gallery/forms/contact-form.md --style $style -o contact-$style.html; \
done
```

---

## 📦 What You'll Learn

By exploring this gallery, you'll master:

✅ **Core Syntax**
- Headings, text formatting, lists
- Links, images, blockquotes
- Code blocks, tables

✅ **Form Elements**
- Text inputs with labels
- Checkboxes and radio buttons
- Dropdowns and selects
- Textareas and buttons
- Input types and validation

✅ **Layout Components**
- Navigation bars and breadcrumbs
- Grid layouts (2, 3, 4+ columns)
- Cards and containers
- Sidebars and footers
- Hero sections and alerts

✅ **Advanced Patterns**
- Multi-step wizards
- Data tables with actions
- Modal dialogs
- Dashboard layouts
- Responsive grids

✅ **Best Practices**
- Accessibility considerations
- Mobile-friendly layouts
- Clear visual hierarchy
- Consistent spacing
- Action-oriented design

---

## 🤝 Contributing

Want to add your own examples to the gallery?

1. **Create a new example** following the existing format
2. **Include description and use case** at the top
3. **List key features** demonstrated
4. **Add generation commands** for all styles
5. **Submit a pull request** with your example

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

---

## 📚 Additional Resources

- **[Syntax Showcase](../showcase.md)** - Complete syntax reference
- **[Quick Reference](../../QUICK-REFERENCE.md)** - One-page cheat sheet
- **[Syntax Guide](../../docs/guide/syntax.md)** - User-friendly tutorial
- **[FAQ](../../FAQ.md)** - Common questions and troubleshooting

---

## 🎯 Example Index

### By Complexity

**Beginner** (Simple, focused examples)
- Contact Form
- Login Form
- Navigation Patterns
- Card Layouts
- Form Controls

**Intermediate** (More components and features)
- Registration Form
- Portfolio Site
- App Landing Page
- Tables & Data Grids
- Modals & Dialogs

**Advanced** (Complex, data-heavy layouts)
- Multi-Step Form
- Search Form
- SaaS Product Landing
- E-Commerce Homepage
- Agency Website
- Analytics Dashboard
- Admin Panel
- E-Commerce Dashboard
- Project Management Dashboard
- Social Media Dashboard

---

## 🏆 Gallery Stats

- **Total Examples:** 20
- **Categories:** 4
- **Visual Styles:** 7
- **Total Variations:** 140 (20 examples × 7 styles)
- **Lines of Code:** ~8,000+
- **Real-world Patterns:** 100+

---

## 💬 Feedback

Found a bug? Have a suggestion? Want to request a new example?

- **Issues:** [GitHub Issues](https://github.com/akonan/wiremd/issues)
- **Discussions:** [GitHub Discussions](https://github.com/akonan/wiremd/discussions)
- **Email:** [Contact Us](mailto:[email protected])

---

**Happy wireframing! 🎨**

*This gallery is part of the [wiremd](https://github.com/akonan/wiremd) project - an open-source MIT-licensed tool for creating wireframes and mockups using Markdown syntax.*
