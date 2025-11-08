# wiremd Syntax Guide

This guide covers the wiremd syntax for creating UI wireframes. For the complete specification, see [SYNTAX-SPEC-v0.1.md](../../SYNTAX-SPEC-v0.1.md).

## Basic Syntax

### Headings

Headings define sections and structure:

```markdown
# Page Title
## Section Heading
### Subsection
```

### Buttons

Square brackets create buttons:

```markdown
[Click Me]
[Submit]{.primary}
[Cancel]{.secondary}
```

### Text Inputs

Underscores create text inputs:

```markdown
[_____________________________]
[_____________________________]{type:email required}
[_____________________________]{placeholder:"Enter your name"}
```

### Textareas

Stacked brackets create textareas:

```markdown
[                             ]
[                             ]
[_____________________________]{rows:5}
```

### Dropdowns/Select

Bracket followed by a list creates a dropdown:

```markdown
Country
[Select a country___________v]
- United States
- Canada
- United Kingdom
```

## Advanced Features

### Classes and Attributes

Add classes with `.classname`:

```markdown
[Login]{.primary .large}
```

Add attributes with `key:value`:

```markdown
[Email]{type:email required}
```

Combine both:

```markdown
[Submit]{.primary type:submit disabled}
```

### Inline Containers

Group elements inline with `[[...]]`:

```markdown
[[ Logo | Home | Products | About ]]
```

### Block Containers

Group elements in blocks with `:::`:

```markdown
::: hero
# Welcome
Try our product today
[Get Started]{.primary}
:::
```

### Grid Layouts

Create grids with heading modifiers:

```markdown
## Features {.grid-3}

### Fast
Lightning quick performance

### Secure
Enterprise-grade security

### Scalable
Grows with your needs
```

## Component Examples

### Forms

```markdown
## Contact Form

Name
[_____________________________]{required}

Email
[_____________________________]{type:email required}

Message
[                             ]
[                             ]
[_____________________________]{rows:5}

[Send]{.primary} [Cancel]
```

### Navigation

```markdown
[[ Logo | Home | Products | Pricing | About | [Login] ]]
```

### Cards

```markdown
::: card
### Product Name
This is a great product that solves your problems.
**$99/month**
[Buy Now]{.primary}
:::
```

### Tables

```markdown
| Feature | Basic | Pro |
|---------|-------|-----|
| Users   | 10    | Unlimited |
| Storage | 1GB   | 100GB |
```

## Styling

### Visual Styles

wiremd supports multiple visual styles:

```bash
mdmock file.md --style sketch    # Default Balsamiq-style
mdmock file.md --style clean     # Modern minimal
mdmock file.md --style wireframe # Traditional grayscale
mdmock file.md --style material  # Material Design
mdmock file.md --style tailwind  # Tailwind-inspired
mdmock file.md --style brutal    # Brutalist
```

### Custom Classes

Add custom classes to any element:

```markdown
## Header {.sticky .top}
[Button]{.btn .btn-primary .btn-lg}
```

## Best Practices

1. **Use semantic headings** - Maintain proper heading hierarchy
2. **Add labels** - Put text above inputs to label them
3. **Use attributes** - Specify input types and requirements
4. **Group related items** - Use containers to organize content
5. **Be consistent** - Follow the same patterns throughout

## Tips & Tricks

### Quick Buttons

```markdown
[Yes] [No] [Maybe]
```

### Password Input

```markdown
Password
[_____________________________]{type:password}
```

### Disabled State

```markdown
[Submit]{disabled}
```

### Icons (with text)

```markdown
[🔍 Search]
[❤️ Like]
[⚙️ Settings]
```

### Multi-column Layout

```markdown
## Two Columns {.grid-2}

### Left Column
Content here

### Right Column
Content here
```

## Next Steps

- [Complete Syntax Specification](../../SYNTAX-SPEC-v0.1.md)
- [API Documentation](../api/README.md)
- [Examples Gallery](../examples/README.md)
