# wiremd JSON Output Schema

This page describes the structure of the JSON output produced by `renderToJSON()` and the AST returned by `parse()`.

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

[Submit]*
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
        "variant": "primary"
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
::: grid-3 card

### :rocket: Fast
Quick rendering

### :shield: Secure
Enterprise security

### :zap: Powerful
Advanced features

:::
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
