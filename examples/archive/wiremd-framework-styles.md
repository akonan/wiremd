# WireMD Framework Styles Engine

## Overview
Instead of just "sketch" or "modern" styles, WireMD can generate mockups using actual UI framework components, giving you production-ready HTML that matches your tech stack.

```bash
# Generate with different frameworks
wiremd render dashboard.md --framework tailwind
wiremd render dashboard.md --framework material
wiremd render dashboard.md --framework antd
wiremd render dashboard.md --framework bootstrap
wiremd render dashboard.md --framework shadcn
```

## Framework Configurations

### 1. Tailwind UI Style
```yaml
name: tailwind
version: 3.4.0
cdn:
  - https://cdn.tailwindcss.com
  - https://unpkg.com/@tailwindcss/forms
  - https://unpkg.com/@tailwindcss/typography
components:
  button:
    primary: "bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
    secondary: "bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
    ghost: "text-indigo-600 px-4 py-2 hover:bg-indigo-50 rounded-lg"
  input:
    default: "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
  card:
    container: "bg-white rounded-lg shadow-sm border border-gray-200 p-6"
  navbar:
    container: "bg-white shadow-sm border-b border-gray-200"
```

### 2. Material Design 3 Style
```yaml
name: material
version: 3.0.0
cdn:
  - https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css
  - https://fonts.googleapis.com/icon?family=Material+Icons
components:
  button:
    primary: "mdc-button mdc-button--raised"
    secondary: "mdc-button mdc-button--outlined"
    ghost: "mdc-button"
  input:
    default: "mdc-text-field__input"
    container: "mdc-text-field mdc-text-field--outlined"
  card:
    container: "mdc-card mdc-card--outlined"
  navbar:
    container: "mdc-top-app-bar"
```

### 3. Ant Design Style
```yaml
name: antd
version: 5.0.0
cdn:
  - https://unpkg.com/antd/dist/reset.css
components:
  button:
    primary: "ant-btn ant-btn-primary"
    secondary: "ant-btn ant-btn-default"
    ghost: "ant-btn ant-btn-text"
  input:
    default: "ant-input"
  card:
    container: "ant-card"
  navbar:
    container: "ant-layout-header"
```

### 4. Bootstrap 5 Style
```yaml
name: bootstrap
version: 5.3.0
cdn:
  - https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css
components:
  button:
    primary: "btn btn-primary"
    secondary: "btn btn-outline-primary"
    ghost: "btn btn-link"
  input:
    default: "form-control"
  card:
    container: "card"
    body: "card-body"
  navbar:
    container: "navbar navbar-expand-lg navbar-light bg-light"
```

### 5. shadcn/ui Style
```yaml
name: shadcn
version: latest
dependencies:
  - tailwindcss
  - @radix-ui/themes
components:
  button:
    primary: "inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
    secondary: "inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
    ghost: "inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
  input:
    default: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 focus-visible:outline-none focus-visible:ring-2"
  card:
    container: "rounded-lg border bg-card text-card-foreground shadow-sm"
  navbar:
    container: "border-b"
```

### 6. Chakra UI Style
```yaml
name: chakra
version: 2.0.0
cdn:
  - https://unpkg.com/@chakra-ui/css@2.0.0/dist/styles.min.css
components:
  button:
    primary: "chakra-button css-1qy6o4v"
    secondary: "chakra-button css-ghost"
  input:
    default: "chakra-input css-1cjy4zv"
  card:
    container: "chakra-card css-1t9qlmu"
```

## Implementation Architecture

### Parser Extension
```typescript
interface FrameworkStyle {
  name: string;
  version: string;
  cdn?: string[];
  npm?: string[];
  components: ComponentMap;
  utilities?: UtilityClasses;
  theme?: ThemeConfig;
}

interface ComponentMap {
  button: ButtonVariants;
  input: InputVariants;
  card: CardVariants;
  navbar: NavbarVariants;
  grid: GridVariants;
  [key: string]: ComponentVariants;
}

class FrameworkRenderer extends BaseRenderer {
  constructor(private framework: FrameworkStyle) {
    super();
  }

  renderButton(text: string, variant: 'primary' | 'secondary' | 'ghost') {
    const classes = this.framework.components.button[variant];
    return `<button class="${classes}">${text}</button>`;
  }

  renderWithFramework(ast: MockupAST): string {
    // Include CDN links
    const cdnLinks = this.framework.cdn?.map(url => 
      `<link rel="stylesheet" href="${url}">`
    ).join('\n');

    // Render components with framework classes
    const body = this.renderComponents(ast);

    return this.wrapInTemplate(cdnLinks, body);
  }
}
```

## Usage Examples

### Basic Markdown Input
```markdown
# Dashboard {.container}

[[ logo | Home | Products | Settings | [Profile] ]]

## Analytics Overview {.section-header}

[card-grid]
  - **Revenue** $12,345 {.metric}
  - **Users** 1,234 {.metric}
  - **Growth** +23% {.metric}
  - **Active** 89% {.metric}
[/card-grid]

[View Details] [Export] {.button-group}
```

### Tailwind Output
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <span class="text-xl font-semibold">Logo</span>
        </div>
        <div class="flex items-center space-x-4">
          <a href="#" class="text-gray-700 hover:text-gray-900">Home</a>
          <a href="#" class="text-gray-700 hover:text-gray-900">Products</a>
          <a href="#" class="text-gray-700 hover:text-gray-900">Settings</a>
          <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Profile
          </button>
        </div>
      </div>
    </div>
  </nav>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
    
    <section class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Analytics Overview</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="text-sm text-gray-600">Revenue</div>
          <div class="text-2xl font-bold text-gray-900">$12,345</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="text-sm text-gray-600">Users</div>
          <div class="text-2xl font-bold text-gray-900">1,234</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="text-sm text-gray-600">Growth</div>
          <div class="text-2xl font-bold text-green-600">+23%</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="text-sm text-gray-600">Active</div>
          <div class="text-2xl font-bold text-gray-900">89%</div>
        </div>
      </div>
    </section>

    <div class="flex gap-4">
      <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
        View Details
      </button>
      <button class="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
        Export
      </button>
    </div>
  </main>
</body>
</html>
```

### Material Design Output
```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <header class="mdc-top-app-bar">
    <div class="mdc-top-app-bar__row">
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
        <span class="mdc-top-app-bar__title">Dashboard</span>
      </section>
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end">
        <button class="mdc-button">
          <span class="mdc-button__label">Home</span>
        </button>
        <button class="mdc-button">
          <span class="mdc-button__label">Products</span>
        </button>
        <button class="mdc-button mdc-button--raised">
          <span class="mdc-button__label">Profile</span>
        </button>
      </section>
    </div>
  </header>

  <main class="mdc-top-app-bar--fixed-adjust">
    <div class="mdc-layout-grid">
      <div class="mdc-layout-grid__inner">
        <div class="mdc-layout-grid__cell--span-3">
          <div class="mdc-card">
            <div class="mdc-card__content">
              <h6 class="mdc-typography--headline6">Revenue</h6>
              <h4 class="mdc-typography--headline4">$12,345</h4>
            </div>
          </div>
        </div>
        <!-- More cards... -->
      </div>
    </div>
  </main>
</body>
</html>
```

## CLI Configuration

### Global Config (.wiremdrc)
```json
{
  "defaultFramework": "tailwind",
  "frameworks": {
    "tailwind": {
      "config": "./tailwind.config.js",
      "includeConfig": true
    },
    "material": {
      "theme": "dark",
      "primaryColor": "#6200EE"
    },
    "bootstrap": {
      "includeJS": false,
      "theme": "custom",
      "variables": "./bootstrap-variables.scss"
    }
  },
  "output": {
    "inlineStyles": false,
    "minify": true,
    "responsive": true
  }
}
```

### Project-Level Config
```yaml
# wiremd.config.yaml
framework: shadcn
theme:
  mode: dark
  radius: 0.5rem
  primary: "hsl(222.2 47.4% 11.2%)"
components:
  extend:
    button:
      custom: "my-custom-button-class"
plugins:
  - "@wiremd/plugin-icons"
  - "@wiremd/plugin-charts"
```

## Advanced Features

### 1. Component Variants
```markdown
[button:primary] Primary Action
[button:secondary] Secondary Action
[button:danger] Delete
[button:success] Confirm
[button:ghost] Cancel
```

### 2. Responsive Modifiers
```markdown
[container:sm] // max-width: 640px
[container:md] // max-width: 768px
[container:lg] // max-width: 1024px
[container:xl] // max-width: 1280px
[container:full] // width: 100%
```

### 3. Theme Switching
```bash
# Generate light and dark versions
wiremd render app.md --framework tailwind --theme light,dark

# Output:
# app-light.html
# app-dark.html
```

### 4. Framework Mixing
```markdown
<!-- Use specific framework for certain components -->
[button]{framework:material} Material Button
[card]{framework:tailwind} Tailwind Card
```

### 5. Custom Components
```typescript
// wiremd.components.js
export const customComponents = {
  'data-table': (props) => ({
    framework: 'antd',
    component: 'Table',
    props: {
      columns: props.columns,
      dataSource: props.data,
      pagination: true
    }
  }),
  'chart': (props) => ({
    framework: 'chartjs',
    component: 'Line',
    props: props
  })
};
```

## NPM Packages

### Core Framework Adapters
```json
{
  "@wiremd/tailwind": "^1.0.0",
  "@wiremd/material": "^1.0.0",
  "@wiremd/antd": "^1.0.0",
  "@wiremd/bootstrap": "^1.0.0",
  "@wiremd/shadcn": "^1.0.0",
  "@wiremd/chakra": "^1.0.0",
  "@wiremd/bulma": "^1.0.0",
  "@wiremd/semantic": "^1.0.0"
}
```

### Installation
```bash
# Install specific framework adapter
npm install @wiremd/tailwind

# Or install all frameworks
npm install @wiremd/frameworks

# Use in code
import { TailwindRenderer } from '@wiremd/tailwind';
const renderer = new TailwindRenderer();
const html = renderer.render(markdownContent);
```

## Benefits

1. **Production-Ready**: Generated HTML uses actual framework classes
2. **Consistency**: Mockups match your production UI exactly
3. **Time-Saving**: No need to translate mockups to framework components
4. **Framework-Agnostic**: Support for all major UI frameworks
5. **Customizable**: Extend with your own component definitions
6. **Theme Support**: Respect your existing theme configurations
7. **Responsive**: Framework's responsive utilities included
8. **Interactive**: Framework's JS components work out of the box

## Future Enhancements

1. **React/Vue Export**: Generate actual component files
```bash
wiremd export app.md --framework material --format react
# Outputs: App.jsx with Material-UI components
```

2. **Design Tokens**: Import from design systems
```bash
wiremd render app.md --tokens ./design-tokens.json
```

3. **Live Sync**: Hot reload with framework dev servers
```bash
wiremd watch app.md --framework tailwind --sync
```

4. **AI Suggestions**: Framework-appropriate component recommendations
```bash
wiremd suggest app.md --framework bootstrap
# "Consider using Bootstrap's Alert component for notifications"
```

5. **Framework Migration**: Convert between frameworks
```bash
wiremd migrate app.md --from bootstrap --to tailwind
```
