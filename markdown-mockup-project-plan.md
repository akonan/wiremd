# Markdown UI Mockups - Project Plan

## Project Overview

A text-first UI design tool that allows developers to create wireframes and mockups using Markdown syntax. The project consists of a core MIT-licensed library and a commercial Obsidian plugin.

## Current Status (Updated: November 6, 2025)

**Phase:** Month 2, Week 5-6 (HTML Renderer - In Progress)
**Completion:** ~75% of Phase 1

### ✅ Completed
- ✅ **Syntax Research** - Comprehensive analysis of 5 existing solutions (markdown-ui, Balsamiq, ASCII, PlantUML Salt, Mermaid)
- ✅ **Test Corpus** - 3 versions with 20 common UI patterns (hybrid approach selected)
- ✅ **Syntax Specification v0.1** - Locked and documented (SYNTAX-SPEC-v0.1.md)
- ✅ **Project Structure** - Monorepo setup with TypeScript, Vite, Vitest
- ✅ **Type System** - Complete TypeScript definitions for 40+ AST node types
- ✅ **Core Parser** - Full implementation with unified/remark + custom plugins
  - Buttons: `[Text]`, `[Text]*`, `[Text]{.class}`
  - Inputs: `[___]`, `[***]`, `[Email___]{type:email}`
  - Checkboxes: `- [ ]`, `- [x]`
  - Radio buttons: `( )`, `(•)`
  - Icons: `:icon-name:`
  - Containers: `::: type ... :::`
  - Inline Containers: `[[ ... | ... ]]` for navigation
  - Dropdowns: `[Select___v]` with list options
  - Grid Layouts: `## Heading {.grid-3}` with auto item detection
  - Attributes: `{.class}`, `{key:value}`, `{:state}`
- ✅ **JSON Renderer** - JSON output with pretty/compact modes
- ✅ **HTML Renderer** - Complete component rendering (30+ types)
- ✅ **CSS Framework** - 4 visual styles (sketch, clean, wireframe, none)
- ✅ **Test Suite** - 48 tests, all passing (29 parser + 19 renderer)

### 🚧 In Progress
- Demo examples and showcase site
- CLI tool development

### 📋 Next Steps
1. Add validation layer
2. Create demo site with examples
3. Build CLI tool with watch mode
4. Expand documentation
5. Prepare for v0.1 release

---

## Core Library (MIT Licensed)
**Name:** `markdown-mockup` or `mdmock`  
**License:** MIT  
**Repository:** `github.com/[username]/markdown-mockup`

### Phase 1: Syntax Definition (Week 1-2)

#### 1.1 Research & Decision Framework

**Steps to Lock Initial Syntax:**

1. **Analyze existing solutions** (2 days)
   - markdown-ui syntax patterns
   - Balsamiq's text mode capabilities
   - ASCII diagram conventions
   - PlantUML for UI mockups
   - Mermaid diagram syntax

2. **Create syntax principles document** (1 day)
   - Elements that should feel like native Markdown
   - Elements requiring custom syntax
   - Ambiguity resolution rules
   - Progressive enhancement philosophy

3. **Build test corpus** (2 days)
   - 20 common UI patterns (forms, navigation, cards, etc.)
   - Write each pattern in 3 different syntax variants
   - Create comparison matrix
   - Get feedback from 5-10 developers

4. **Lock v0.1 syntax specification** (2 days)
   - Document formal grammar
   - Create quick reference guide
   - Define escape sequences
   - Establish versioning strategy

#### 1.2 Key Syntax Decisions Required

**Layout System:**
- Grid: CSS Grid inspired vs. Table-like vs. Flexbox hints
- Nesting: Indentation-based vs. Explicit containers
- Spacing: How to express margins/padding
- Responsive: Breakpoint syntax

**Components:**
```markdown
# Buttons
Option A: [Click me]
Option B: <button>Click me</button>
Option C: !button[Click me]

# Inputs
Option A: [__placeholder text__]
Option B: [input:text="placeholder"]
Option C: [...placeholder text]

# Images
Option A: ![alt](image.jpg) - standard markdown
Option B: [img:logo]
Option C: {{image:logo}}

# Lists/Menus
Option A: Differentiate with indentation
Option B: Special prefix (=> item)
Option C: Container syntax
```

**Modifiers:**
- CSS Classes: `{.class}` vs `:class` vs `@class`
- IDs: `{#id}` vs `#id` (conflicts with headings?)
- Properties: Inline vs. separate line
- States: How to represent hover, active, disabled

**Special Elements:**
- Forms: Implicit grouping vs explicit containers
- Navigation: Special syntax vs composed from basics
- Cards/Containers: Blockquotes vs custom delimiter
- Tables: Extend MD tables vs new syntax
- Modals/Overlays: How to represent layers

#### 1.3 Initial Syntax Proposal (v0.1)

```markdown
# Example Mockup Syntax

## Navigation Bar {.sticky .top}
[[ Logo | Home | Products | About | [Sign In] ]]

## Hero Section {.hero}
> # Welcome to Our Product
> Transform your workflow with our innovative solution
> [Get Started] [Learn More]{.outline}

## Features Grid {.grid-3}
### Feature One
![icon](feature1.svg)
Fast and reliable service that scales with your needs.

### Feature Two  
![icon](feature2.svg)
Secure by default with enterprise-grade protection.

### Feature Three
![icon](feature3.svg)
24/7 support from our expert team.

## Contact Form
[Name___________]
[Email__________] {type:email required}
[Your message...] {rows:5}
[Submit]
```

### Phase 2: Parser & JSON Output (Week 3-4)

#### 2.1 JSON Schema Design

```typescript
interface MockupDocument {
  version: "0.1.0"
  metadata: {
    title?: string
    created: Date
    modified: Date
    viewport?: "mobile" | "tablet" | "desktop" | "responsive"
    annotations?: Annotation[]
  }
  components: Component[]
  styles?: StyleDefinitions
  states?: StateDefinitions
}

interface Component {
  type: ComponentType
  id?: string
  classes?: string[]
  props: Record<string, any>
  children?: Component[]
  layout?: LayoutProperties
  states?: ComponentStates
  annotation?: string
}

type ComponentType = 
  | "container" | "section" | "header" | "footer"
  | "button" | "input" | "textarea" | "select"
  | "text" | "heading" | "paragraph"
  | "image" | "icon" | "avatar"
  | "list" | "list-item"
  | "nav" | "nav-item"
  | "card" | "modal"
  | "form" | "fieldset"
  | "table" | "grid"

interface LayoutProperties {
  grid?: string
  flex?: string
  width?: string
  height?: string
  position?: string
  margin?: string
  padding?: string
  alignment?: string
}

interface ComponentStates {
  default: Component
  hover?: Component
  active?: Component
  disabled?: Component
  loading?: Component
  empty?: Component
  error?: Component
}
```

#### 2.2 Parser Implementation

**Tech Stack:**
- TypeScript for type safety
- Unified/Remark as MD parsing base
- Custom tokenizer for mockup syntax
- AST transformer pipeline

**Architecture:**
```
Input (Markdown + Mockup Syntax)
    ↓
Lexer (Tokenization)
    ↓
Parser (AST Generation)
    ↓
Transformer (AST → JSON)
    ↓
Validator (Schema Validation)
    ↓
Output (JSON/HTML/Framework)
```

**Testing Strategy:**
- Unit tests for each component type
- Integration tests for full documents
- Error message quality tests
- Performance benchmarks
- Cross-platform compatibility

### Phase 3: HTML Renderer (Week 5-6)

#### 3.1 Balsamiq-Style CSS Framework

```css
/* Core mockup styles */
:root {
  --mdmock-font: "Comic Neue", "Marker Felt", cursive;
  --mdmock-border: 2px solid #333;
  --mdmock-shadow: 2px 2px 0 rgba(0,0,0,0.1);
  --mdmock-bg: #ffffff;
  --mdmock-fg: #333333;
}

.mdmock-container {
  font-family: var(--mdmock-font);
  background: var(--mdmock-bg);
  border: var(--mdmock-border);
  position: relative;
  /* Intentionally imperfect */
  transform: rotate(0.2deg);
}

/* Sketchy border effect using SVG filters */
.mdmock-sketch {
  filter: url(#roughPaper);
}

/* Component styles */
.mdmock-button {
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  border: 2px solid #333;
  padding: 8px 16px;
  cursor: pointer;
  /* Slightly uneven border radius */
  border-radius: 3px 4px 3px 4px;
  font-family: inherit;
  transition: all 0.2s;
}

.mdmock-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.mdmock-input {
  border: none;
  border-bottom: 2px solid #333;
  padding: 8px 4px;
  font-family: inherit;
  background: transparent;
  /* Slightly wavy underline effect */
}

/* Grid system */
.mdmock-grid {
  display: grid;
  gap: 1rem;
}

.mdmock-grid-2 { grid-template-columns: repeat(2, 1fr); }
.mdmock-grid-3 { grid-template-columns: repeat(3, 1fr); }
.mdmock-grid-4 { grid-template-columns: repeat(4, 1fr); }

/* Responsive utilities */
@media (max-width: 768px) {
  .mdmock-grid-2,
  .mdmock-grid-3,
  .mdmock-grid-4 {
    grid-template-columns: 1fr;
  }
}
```

#### 3.2 HTML Generator

```typescript
interface RendererOptions {
  style: "sketch" | "clean" | "wireframe" | "none"
  containerElement: "div" | "section" | "article"
  includeStyles: boolean
  includeScript: boolean
  responsive: boolean
  semanticHTML: boolean
}

class HTMLRenderer {
  render(document: MockupDocument, options: RendererOptions): string
  renderComponent(component: Component): string
  renderStyles(style: string): string
  renderScript(): string
}
```

**Example Output:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mockup: Dashboard</title>
  <style>/* Inline mockup styles */</style>
</head>
<body>
  <main class="mdmock-root" data-style="sketch">
    <header class="mdmock-navbar">
      <div class="mdmock-brand">Logo</div>
      <nav class="mdmock-nav">
        <a href="#" class="mdmock-nav-item">Home</a>
        <a href="#" class="mdmock-nav-item">Products</a>
        <button class="mdmock-button">Sign In</button>
      </nav>
    </header>
    <section class="mdmock-content">
      <!-- Generated content -->
    </section>
  </main>
</body>
</html>
```

### Phase 4: CLI Tool (Week 7)

#### 4.1 CLI Implementation

```bash
# Basic usage
mdmock input.md                        # Outputs to stdout
mdmock input.md -o output.html         # File output
mdmock input.md --format json          # JSON output
mdmock input.md --style clean          # Different style

# Watch mode
mdmock watch input.md --serve 3000     # Dev server
mdmock watch *.md --out-dir ./dist     # Build directory

# Component library
mdmock init                            # Initialize project
mdmock component add button.mdmock     # Add to library
mdmock build --components ./components # Use library

# Config file support
mdmock --config .mdmockrc.json
```

#### 4.2 Configuration Schema

```json
{
  "version": "0.1.0",
  "style": "sketch",
  "output": {
    "format": "html",
    "dir": "./dist",
    "filename": "[name].html"
  },
  "components": {
    "path": "./components",
    "prefix": "c-"
  },
  "renderer": {
    "semantic": true,
    "responsive": true,
    "includeStyles": true
  },
  "watch": {
    "port": 3000,
    "open": true,
    "livereload": true
  }
}
```

---

## Obsidian Plugin (Commercial)
**Name:** "Mockup Designer for Obsidian"  
**Price:** $10-20 (one-time purchase)  
**Marketplace:** Obsidian Community Plugins + Gumroad

### Phase 1: Core Features (Week 8-10)

#### 1.1 Live Preview Implementation

```typescript
interface PluginSettings {
  renderMode: "split" | "tab" | "inline" | "hover"
  autoRefresh: boolean
  refreshDelay: 300 | 500 | 1000
  defaultStyle: "sketch" | "clean" | "wireframe"
  theme: "light" | "dark" | "auto"
  componentLibraryPath: string
  enableAnnotations: boolean
  enableStates: boolean
}

class MockupDesignerPlugin extends Plugin {
  settings: PluginSettings
  previewView: MockupPreviewView
  editorExtension: Extension
  
  async onload() {
    // Register custom view
    this.registerView(
      VIEW_TYPE_MOCKUP_PREVIEW,
      (leaf) => new MockupPreviewView(leaf)
    )
    
    // Register markdown processor
    this.registerMarkdownPostProcessor(
      this.processMockupBlocks
    )
    
    // Add commands
    this.addCommand({
      id: 'toggle-mockup-preview',
      name: 'Toggle Mockup Preview',
      callback: () => this.togglePreview()
    })
    
    // Add syntax highlighting
    this.registerEditorExtension(
      mockupSyntaxHighlighting()
    )
  }
}
```

#### 1.2 Component Library System

**File Structure:**
```
vault/
  .obsidian/
    plugins/
      mockup-designer/
        components/           # Global components
  mockups/
    components/              # Project components
      button.mdmock
      navbar.mdmock
      card.mdmock
    templates/               # Page templates
      dashboard.mdmock
      landing.mdmock
    my-design.md            # Uses {{button}} syntax
```

**Component Definition:**
```markdown
---
name: PrimaryButton
props:
  - text: string
  - size: small | medium | large
  - icon?: string
---

[{{icon}}{{text}}] {.btn .btn-{{size}}}
```

### Phase 2: Advanced Features (Week 11-13)

#### 2.1 Responsive Hints

```markdown
# Responsive Syntax Options

## Option A: Inline modifiers
[Search...] {mobile:full tablet:half desktop:third}

## Option B: Viewport blocks
@mobile {
  [≡] // Hamburger menu
}

@tablet {
  [Home | About | [Search...]]
}

@desktop {
  [Logo | Home | Products | About | Contact | [Search...] | [Sign In]]
}

## Option C: Responsive components
[[responsive
  mobile: [≡]
  tablet: [Home | About]
  desktop: [Full Navigation]
]]
```

#### 2.2 State Representations

```markdown
# State Syntax

## Product List Component
[Product Grid]
  :empty = "No products found. [Add Product]"
  :loading = [spinner] Loading products...
  :error = [!] Failed to load. [Retry]
  :success = 
    - Product A $99
    - Product B $149
    - Product C $199

## Interactive States
[Submit Button]
  :default = "Submit Form"
  :hover = "Submit Form" {.elevated}
  :active = "Submit Form" {.pressed}
  :disabled = "Submit Form" {.muted}
  :loading = [spinner] "Submitting..."
```

#### 2.3 Annotations System

```markdown
# Annotation Syntax

## Inline Annotations
[Login Button] ((Needs A/B testing with different colors))
[User Avatar] ^[Consider lazy loading for performance]

## Block Annotations
## Dashboard Section
<!-- @annotation
- Check with design team about spacing
- Need to add export functionality
- Consider mobile layout
-->

## Numbered References
[Payment Form][1]
[Shipping Address][2]

[1]: Use Stripe Elements for PCI compliance
[2]: Add address autocomplete
```

**Annotation Rendering:**
- Floating sticky notes in preview
- Toggle visibility
- Color coding by type
- Export to comments in HTML

### Phase 3: Polish & Distribution (Week 14-15)

#### 3.1 Plugin Features

**Settings Interface:**
- Visual style picker with live preview
- Component library management
- Hotkey customization
- Export presets manager
- Template gallery browser

**Editor Enhancements:**
- Auto-completion for components
- Snippet insertion
- Quick actions toolbar
- Drag-and-drop components
- Format painter tool

**Export Options:**
- HTML with inline styles
- HTML with external CSS
- React components
- Vue components
- Figma plugin format (JSON)
- PDF wireframes

#### 3.2 Monetization Strategy

**Free Tier:**
- Basic preview functionality
- HTML export
- 5 component limit
- Sketch style only
- Community support

**Pro Tier ($15 one-time):**
- Unlimited components
- All visual styles
- All export formats
- Annotations system
- State representations
- Responsive preview
- Priority support
- Future updates

**Team Tier ($50/year):**
- Shared component libraries
- Sync via Git
- Custom themes editor
- Bulk export
- Commercial license
- Priority feature requests

---

## Development Roadmap

### Month 1: Foundation
**Week 1-2: Syntax & Specification**
- [x] Complete syntax research (done - syntax-research.md)
- [x] Build test corpus (done - test-corpus-v1, v2, v3-hybrid)
- [ ] Get community feedback
- [x] Finalize v0.1 syntax spec (done - SYNTAX-SPEC-v0.1.md)
- [x] Write formal grammar (done - included in syntax spec)

**Week 3-4: Core Parser** ✅ Complete
- [x] Implement lexer (done - using unified/remark)
- [x] Build parser (done - 29 passing tests)
- [x] Create AST transformer (done - transformer.ts with full component support)
- [x] Generate JSON output (done - renderToJSON implemented)
- [x] Complete container syntax parsing (done - remark-containers.ts)
- [x] Complete inline container parsing (done - remark-inline-containers.ts)
- [x] Add dropdown options parsing (done - context-aware list consumption)
- [x] Add grid layout detection (done - heading-based grid system)
- [ ] Add validation layer (skeleton in place, needs implementation)

### Month 2: Implementation
**Week 5-6: HTML Renderer** (In Progress)
- [x] Create CSS framework (done - styles.ts with 4 visual styles)
- [x] Build HTML generator (done - html-renderer.ts with 30+ component types)
- [x] Implement sketch style (done - Balsamiq-inspired hand-drawn look)
- [x] Implement clean style (done - modern minimal design)
- [x] Implement wireframe style (done - traditional grayscale)
- [x] Implement none style (done - minimal semantic HTML)
- [x] Add responsive support (done - mobile media queries)
- [ ] Create demo site

**Week 7: CLI Tool**
- [ ] Basic CLI commands
- [ ] Watch mode
- [ ] Dev server
- [ ] Config file support
- [ ] NPM package setup

**Week 8: Documentation**
- [ ] API documentation
- [ ] User guide
- [ ] Examples gallery
- [ ] Contributing guide
- [ ] Website launch

### Month 3: Obsidian Plugin
**Week 9-10: Basic Plugin**
- [ ] Project setup
- [ ] Live preview
- [ ] Split view
- [ ] Basic settings
- [ ] Submit to community plugins

**Week 11-12: Advanced Features**
- [ ] Component library
- [ ] Responsive preview
- [ ] States system
- [ ] Annotations
- [ ] Polish UI

### Month 4: Launch
**Week 13-14: Beta Testing**
- [ ] Private beta (20 users)
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Feature refinement
- [ ] Documentation updates

**Week 15-16: Public Launch**
- [ ] Payment integration
- [ ] Marketing website
- [ ] Product Hunt launch
- [ ] Blog post
- [ ] Social media campaign

---

## Technical Architecture

### Core Library Stack
```yaml
Language: TypeScript
Build: Vite
Parser: Unified/Remark + Custom
Testing: Vitest
Docs: VitePress
CI/CD: GitHub Actions

Dependencies:
  - unified: Markdown parsing
  - remark: Markdown processing
  - No runtime dependencies for HTML

DevDependencies:
  - typescript
  - vite
  - vitest
  - @types/node
```

### Plugin Stack
```yaml
Framework: Obsidian API
UI: Svelte (Obsidian standard)
Build: esbuild
Testing: Playwright
Distribution: GitHub Releases + Gumroad

Dependencies:
  - obsidian: Plugin API
  - @codemirror/view: Editor extensions
  - svelte: UI components
```

### Project Structure
```
markdown-mockup/
├── packages/
│   ├── core/               # MIT licensed parser
│   │   ├── src/
│   │   │   ├── parser/
│   │   │   ├── renderer/
│   │   │   └── cli/
│   │   ├── tests/
│   │   └── package.json
│   └── obsidian-plugin/    # Commercial plugin
│       ├── src/
│       ├── styles/
│       └── manifest.json
├── docs/                    # Documentation site
├── examples/               # Example mockups
├── LICENSE                 # MIT for core
└── README.md
```

---

## Success Metrics

### Core Library
- 100 GitHub stars in first month
- 1,000 npm downloads in first month
- 10 contributor pull requests
- 50% test coverage minimum
- <100ms parse time for typical document

### Obsidian Plugin
- 50 beta testers sign up
- 10 paying customers first week
- 100 paying customers first month
- 4.5+ star rating
- <5% refund rate

### Community
- 5 community-contributed components
- 3 third-party integrations
- 20 example mockups in gallery
- 100 Discord members
- 1 blog post per month

---

## Risk Mitigation

### Technical Risks
- **Syntax too complex:** Start minimal, expand based on feedback
- **Performance issues:** Profile early, optimize critical paths
- **Obsidian API changes:** Pin API version, maintain compatibility layer

### Market Risks
- **Low adoption:** Focus on solving real pain points
- **Competition:** Differentiate with Obsidian integration
- **Pricing resistance:** Offer strong free tier

### Mitigation Strategies
1. Build in public for early feedback
2. Focus on one use case perfectly
3. Maintain excellent documentation
4. Provide migration paths from other tools
5. Keep core open source for trust

---

## Marketing Strategy

### Pre-Launch (Month 1-2)
- Build in public on Twitter/X
- Weekly dev logs
- Syntax RFC on GitHub
- Engage with Obsidian community

### Beta Launch (Month 3)
- Private beta with influencers
- YouTube demo videos
- Blog post series
- Discord community

### Public Launch (Month 4)
- Product Hunt launch
- Hacker News Show HN
- Reddit (r/ObsidianMD, r/webdev)
- Dev.to article
- Obsidian Roundup submission

### Post-Launch
- Case studies from users
- Template marketplace
- Integration partnerships
- Conference talks
- Comparison guides

---

## Budget Estimate

### Development Costs
- Domain name: $15/year
- Hosting (docs site): $0 (GitHub Pages)
- Code signing certificate: $0 (GitHub)
- Obsidian developer license: $0

### Marketing Costs
- Logo design: $200
- Product Hunt promotion: $0-500
- Ads (optional): $500
- **Total: ~$700-1,200**

### Revenue Projection (Conservative)
- Month 1: 20 sales × $15 = $300
- Month 2: 40 sales × $15 = $600
- Month 3: 60 sales × $15 = $900
- Month 6: 200 total sales = $3,000

---

## Contact & Resources

### Links
- GitHub: [github.com/username/markdown-mockup]
- Documentation: [mdmock.dev]
- Discord: [discord.gg/mdmock]
- Twitter: [@mdmock]

### Get Started
```bash
# Install core library
npm install -g mdmock

# Create your first mockup
echo "[Hello World]" > hello.md
mdmock hello.md --serve

# Install Obsidian plugin
# Available in Community Plugins: "Mockup Designer"
```

---

*Last Updated: [Current Date]*  
*Version: 1.0.0*  
*Status: Planning Phase*
