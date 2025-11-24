# Obsidian Live Preview Plugin Development Guide

## Complete Guide to Building a wiremd Live Preview Plugin for Obsidian

This guide walks you through creating an Obsidian plugin that provides live preview functionality for wiremd mockup files with customizable style selection.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Plugin Architecture Overview](#plugin-architecture-overview)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Integration with wiremd](#integration-with-wiremd)
6. [Style Selection Implementation](#style-selection-implementation)
7. [Testing and Debugging](#testing-and-debugging)
8. [Publishing Your Plugin](#publishing-your-plugin)
9. [Troubleshooting](#troubleshooting)

---

## Introduction

### What is Obsidian?

Obsidian is a powerful knowledge base application built on top of a local folder of plain text Markdown files. It supports extensive customization through plugins.

### What We're Building

An Obsidian plugin that:
- Detects wiremd mockup syntax in Markdown files
- Provides real-time live preview of UI mockups
- Allows users to switch between different visual styles (sketch, clean, wireframe, tailwind, material, brutal, none)
- Renders mockups inline within the Obsidian editor
- Updates preview automatically as you type

---

## Prerequisites

### Required Knowledge

- **JavaScript/TypeScript**: Intermediate level
- **Node.js & npm**: Basic familiarity
- **Obsidian**: Basic usage experience
- **Markdown**: Understanding of Markdown syntax

### Required Software

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Obsidian** desktop application
- **Git** for version control
- **Code Editor** (VS Code recommended)

### Install Obsidian

Download and install Obsidian from: https://obsidian.md/

---

## Plugin Architecture Overview

### Obsidian Plugin Structure

```
obsidian-wiremd-preview/
├── manifest.json          # Plugin metadata
├── package.json           # Node dependencies
├── tsconfig.json          # TypeScript configuration
├── .gitignore
├── .npmrc
├── esbuild.config.mjs     # Build configuration
├── src/
│   ├── main.ts            # Plugin entry point
│   ├── settings.ts        # Settings management
│   ├── preview.ts         # Live preview view
│   └── styles.css         # Plugin-specific styles
└── README.md
```

### Key Components

1. **Main Plugin Class**: Extends Obsidian's `Plugin` class
2. **Preview View**: Custom view for rendering wiremd mockups
3. **Settings Tab**: UI for style selection and configuration
4. **Markdown Processor**: Detects and processes wiremd syntax
5. **Live Preview Integration**: Updates preview in real-time

---

## Step-by-Step Implementation

### Step 1: Create Plugin Scaffold

#### 1.1 Create Project Directory

```bash
# Create your plugin directory
mkdir obsidian-wiremd-preview
cd obsidian-wiremd-preview

# Initialize npm project
npm init -y
```

#### 1.2 Install Dependencies

```bash
# Install Obsidian API
npm install -D obsidian

# Install wiremd library
npm install wiremd

# Install TypeScript and build tools
npm install -D typescript esbuild @types/node

# Install development dependencies
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

#### 1.3 Create `manifest.json`

Create a `manifest.json` file in the root directory:

```json
{
  "id": "wiremd-preview",
  "name": "wiremd Live Preview",
  "version": "1.0.0",
  "minAppVersion": "0.15.0",
  "description": "Live preview for wiremd UI mockups with style selection",
  "author": "Your Name",
  "authorUrl": "https://yourwebsite.com",
  "isDesktopOnly": false
}
```

#### 1.4 Create `package.json`

Update your `package.json`:

```json
{
  "name": "obsidian-wiremd-preview",
  "version": "1.0.0",
  "description": "Obsidian plugin for wiremd mockup live preview",
  "main": "main.js",
  "scripts": {
    "dev": "node esbuild.config.mjs",
    "build": "tsc -noEmit -skipLibCheck && node esbuild.config.mjs production",
    "version": "node version-bump.mjs && git add manifest.json versions.json"
  },
  "keywords": [
    "obsidian",
    "plugin",
    "wiremd",
    "mockup",
    "preview"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "wiremd": "^0.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "@typescript-eslint/parser": "^6.13.0",
    "esbuild": "^0.19.0",
    "obsidian": "latest",
    "typescript": "^5.3.2"
  }
}
```

#### 1.5 Create `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "node",
    "allowJs": true,
    "noImplicitAny": true,
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "obsidian": ["node_modules/obsidian/obsidian.d.ts"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

#### 1.6 Create `esbuild.config.mjs`

```javascript
import esbuild from 'esbuild';
import process from 'process';
import builtins from 'builtin-modules';

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
*/
`;

const prod = process.argv[2] === 'production';

const context = await esbuild.context({
  banner: {
    js: banner,
  },
  entryPoints: ['src/main.ts'],
  bundle: true,
  external: [
    'obsidian',
    'electron',
    '@codemirror/autocomplete',
    '@codemirror/collab',
    '@codemirror/commands',
    '@codemirror/language',
    '@codemirror/lint',
    '@codemirror/search',
    '@codemirror/state',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/highlight',
    '@lezer/lr',
    ...builtins
  ],
  format: 'cjs',
  target: 'es2020',
  logLevel: 'info',
  sourcemap: prod ? false : 'inline',
  treeShaking: true,
  outfile: 'main.js',
});

if (prod) {
  await context.rebuild();
  process.exit(0);
} else {
  await context.watch();
}
```

#### 1.7 Create `.gitignore`

```
# Build outputs
main.js
main.js.map
dist/
*.js.map

# Dependencies
node_modules/

# OS
.DS_Store

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# Logs
*.log
npm-debug.log*

# Test coverage
coverage/
```

### Step 2: Implement Settings

Create `src/settings.ts`:

```typescript
import { App, PluginSettingTab, Setting } from 'obsidian';
import WiremdPreviewPlugin from './main';

export interface WiremdSettings {
  style: 'sketch' | 'clean' | 'wireframe' | 'tailwind' | 'material' | 'brutal' | 'none';
  autoPreview: boolean;
  renderDelay: number;
}

export const DEFAULT_SETTINGS: WiremdSettings = {
  style: 'sketch',
  autoPreview: true,
  renderDelay: 300,
};

export class WiremdSettingTab extends PluginSettingTab {
  plugin: WiremdPreviewPlugin;

  constructor(app: App, plugin: WiremdPreviewPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();
    containerEl.createEl('h2', { text: 'wiremd Preview Settings' });

    // Style selection
    new Setting(containerEl)
      .setName('Visual Style')
      .setDesc('Choose the default visual style for mockup rendering')
      .addDropdown((dropdown) =>
        dropdown
          .addOption('sketch', 'Sketch (Balsamiq-style)')
          .addOption('clean', 'Clean (Modern minimal)')
          .addOption('wireframe', 'Wireframe (Traditional grayscale)')
          .addOption('tailwind', 'Tailwind (Utility-first)')
          .addOption('material', 'Material (Material Design)')
          .addOption('brutal', 'Brutal (Neo-brutalism)')
          .addOption('none', 'None (Unstyled)')
          .setValue(this.plugin.settings.style)
          .onChange(async (value) => {
            this.plugin.settings.style = value as WiremdSettings['style'];
            await this.plugin.saveSettings();
          })
      );

    // Auto-preview toggle
    new Setting(containerEl)
      .setName('Auto Preview')
      .setDesc('Automatically render wiremd blocks in reading mode')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoPreview)
          .onChange(async (value) => {
            this.plugin.settings.autoPreview = value;
            await this.plugin.saveSettings();
          })
      );

    // Render delay
    new Setting(containerEl)
      .setName('Render Delay (ms)')
      .setDesc('Debounce delay for live preview updates (in milliseconds)')
      .addText((text) =>
        text
          .setPlaceholder('300')
          .setValue(String(this.plugin.settings.renderDelay))
          .onChange(async (value) => {
            const delay = parseInt(value);
            if (!isNaN(delay) && delay >= 0) {
              this.plugin.settings.renderDelay = delay;
              await this.plugin.saveSettings();
            }
          })
      );

    // Information section
    containerEl.createEl('h3', { text: 'About wiremd Syntax' });
    containerEl.createEl('p', {
      text: 'wiremd allows you to create UI mockups using Markdown syntax. Use code blocks with the "wiremd" language identifier to create mockups.',
    });

    const exampleContainer = containerEl.createDiv();
    exampleContainer.createEl('h4', { text: 'Example:' });
    const codeBlock = exampleContainer.createEl('pre');
    codeBlock.createEl('code', {
      text: `\`\`\`wiremd
## Hero Section {.hero}
> # Welcome to Our Product
> Transform your workflow
> [Get Started] [Learn More]

## Features Grid {.grid-3}
### Feature One
Fast and reliable

### Feature Two
Easy to use

### Feature Three
Scalable
\`\`\``,
    });
  }
}
```

### Step 3: Implement Main Plugin

Create `src/main.ts`:

```typescript
import { Plugin } from 'obsidian';
import { WiremdSettings, DEFAULT_SETTINGS, WiremdSettingTab } from './settings';
import { WiremdPreviewProcessor } from './preview';

export default class WiremdPreviewPlugin extends Plugin {
  settings: WiremdSettings;
  processor: WiremdPreviewProcessor;

  async onload() {
    console.log('Loading wiremd Preview Plugin');

    // Load settings
    await this.loadSettings();

    // Initialize processor
    this.processor = new WiremdPreviewProcessor(this);

    // Register markdown code block processor
    this.registerMarkdownCodeBlockProcessor(
      'wiremd',
      this.processor.processCodeBlock.bind(this.processor)
    );

    // Add settings tab
    this.addSettingTab(new WiremdSettingTab(this.app, this));

    // Add ribbon icon for opening style selector
    this.addRibbonIcon('layout-dashboard', 'wiremd Preview Style', () => {
      this.openStyleSelector();
    });

    // Add command to change style
    this.addCommand({
      id: 'change-wiremd-style',
      name: 'Change preview style',
      callback: () => {
        this.openStyleSelector();
      },
    });

    // Add commands for each style
    const styles: Array<WiremdSettings['style']> = [
      'sketch',
      'clean',
      'wireframe',
      'tailwind',
      'material',
      'brutal',
      'none',
    ];

    styles.forEach((style) => {
      this.addCommand({
        id: `set-style-${style}`,
        name: `Set style to ${style}`,
        callback: async () => {
          this.settings.style = style;
          await this.saveSettings();
          this.processor.refreshAllPreviews();
        },
      });
    });
  }

  onunload() {
    console.log('Unloading wiremd Preview Plugin');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    // Refresh all previews when settings change
    this.processor?.refreshAllPreviews();
  }

  openStyleSelector() {
    // Open settings tab
    // @ts-ignore - accessing private API
    this.app.setting.open();
    // @ts-ignore - accessing private API
    this.app.setting.openTabById(this.manifest.id);
  }
}
```

### Step 4: Implement Preview Processor

Create `src/preview.ts`:

```typescript
import { MarkdownPostProcessorContext } from 'obsidian';
import { parse } from 'wiremd/parser';
import { renderToHTML } from 'wiremd/renderer';
import WiremdPreviewPlugin from './main';

export class WiremdPreviewProcessor {
  plugin: WiremdPreviewPlugin;
  private previewElements: Set<HTMLElement> = new Set();
  private debounceTimers: Map<HTMLElement, number> = new Map();

  constructor(plugin: WiremdPreviewPlugin) {
    this.plugin = plugin;
  }

  async processCodeBlock(
    source: string,
    el: HTMLElement,
    ctx: MarkdownPostProcessorContext
  ) {
    try {
      // Store reference for refresh capability
      this.previewElements.add(el);

      // Clear previous content
      el.empty();

      // Create container for preview
      const container = el.createDiv({ cls: 'wiremd-preview-container' });

      // Add style indicator badge
      const badge = container.createDiv({ cls: 'wiremd-style-badge' });
      badge.setText(`Style: ${this.plugin.settings.style}`);

      // Parse and render
      const renderPreview = () => {
        try {
          // Parse wiremd markdown
          const ast = parse(source);

          // Render to HTML with selected style
          const html = renderToHTML(ast, {
            style: this.plugin.settings.style,
            inlineStyles: true,
            pretty: false,
          });

          // Extract body content from full HTML document
          const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
          const bodyContent = bodyMatch ? bodyMatch[1] : html;

          // Extract and inject styles
          const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
          if (styleMatch) {
            const styleEl = container.createEl('style');
            styleEl.textContent = styleMatch[1];
          }

          // Create preview wrapper
          const preview = container.createDiv({ cls: 'wiremd-preview-content' });
          preview.innerHTML = bodyContent;

          // Add click handler to allow style switching
          badge.addEventListener('click', () => {
            this.plugin.openStyleSelector();
          });

          badge.style.cursor = 'pointer';
          badge.title = 'Click to change style';

        } catch (renderError) {
          container.empty();
          const errorEl = container.createDiv({ cls: 'wiremd-error' });
          errorEl.createEl('strong', { text: 'Render Error:' });
          errorEl.createEl('p', { text: String(renderError) });
        }
      };

      // Debounce rendering for performance
      const timer = this.debounceTimers.get(el);
      if (timer) {
        window.clearTimeout(timer);
      }

      const newTimer = window.setTimeout(() => {
        renderPreview();
        this.debounceTimers.delete(el);
      }, this.plugin.settings.renderDelay);

      this.debounceTimers.set(el, newTimer);

    } catch (error) {
      el.empty();
      const errorEl = el.createDiv({ cls: 'wiremd-error' });
      errorEl.createEl('strong', { text: 'Parse Error:' });
      errorEl.createEl('p', { text: String(error) });
      console.error('wiremd preview error:', error);
    }
  }

  refreshAllPreviews() {
    // Trigger re-render of all previews
    // This is called when settings change
    this.previewElements.forEach((el) => {
      // Force Obsidian to re-process the markdown
      el.empty();
    });

    // Clear the set as elements will be re-added
    this.previewElements.clear();

    // Request workspace to re-render
    this.plugin.app.workspace.trigger('layout-change');
  }

  cleanup() {
    this.previewElements.clear();
    this.debounceTimers.forEach((timer) => window.clearTimeout(timer));
    this.debounceTimers.clear();
  }
}
```

### Step 5: Add Custom Styles

Create `src/styles.css`:

```css
/* wiremd Preview Plugin Styles */

.wiremd-preview-container {
  margin: 1em 0;
  border: 2px solid var(--background-modifier-border);
  border-radius: 8px;
  padding: 1em;
  background: var(--background-primary);
  position: relative;
}

.wiremd-style-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 12px;
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  border-radius: 4px;
  font-size: 0.75em;
  font-weight: 600;
  z-index: 10;
  transition: all 0.2s ease;
}

.wiremd-style-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.wiremd-preview-content {
  margin-top: 2em;
  overflow-x: auto;
}

.wiremd-error {
  padding: 1em;
  background: var(--background-modifier-error);
  border: 1px solid var(--background-modifier-error-border);
  border-radius: 4px;
  color: var(--text-error);
}

.wiremd-error strong {
  display: block;
  margin-bottom: 0.5em;
  font-size: 1.1em;
}

.wiremd-error p {
  margin: 0;
  font-family: var(--font-monospace);
  font-size: 0.9em;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Ensure wiremd styles don't conflict with Obsidian */
.wiremd-preview-content * {
  box-sizing: border-box;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .wiremd-preview-container {
    padding: 0.5em;
  }

  .wiremd-style-badge {
    position: static;
    display: inline-block;
    margin-bottom: 0.5em;
  }

  .wiremd-preview-content {
    margin-top: 1em;
  }
}
```

### Step 6: Install and Test Plugin

#### 6.1 Build the Plugin

```bash
npm run build
```

This will create a `main.js` file in your project root.

#### 6.2 Install in Obsidian

1. **Find your Obsidian plugins folder:**
   - On Windows: `%APPDATA%\Obsidian\plugins\`
   - On macOS: `~/Library/Application Support/obsidian/plugins/`
   - On Linux: `~/.config/obsidian/plugins/`

   OR use your vault's `.obsidian/plugins/` folder (recommended for testing)

2. **Copy plugin files:**
   ```bash
   # Create plugin directory
   mkdir -p /path/to/your/vault/.obsidian/plugins/wiremd-preview

   # Copy files
   cp main.js manifest.json /path/to/your/vault/.obsidian/plugins/wiremd-preview/
   ```

3. **Enable the plugin:**
   - Open Obsidian
   - Go to Settings → Community plugins
   - Disable "Safe mode" if needed
   - Find "wiremd Live Preview" in the list
   - Toggle it on

#### 6.3 Test the Plugin

Create a new note in Obsidian with wiremd syntax:

````markdown
# Test wiremd Mockup

```wiremd
## Navigation Bar {.nav}
[[ Logo | Home | Products | About | [Sign In] ]]

## Hero Section {.hero}
> # Welcome to Our Product
> Transform your workflow with powerful tools
> [Get Started] [Learn More]

## Features Grid {.grid-3}
### Fast Performance
Built for speed and efficiency

### Easy to Use
Intuitive interface for everyone

### Scalable
Grows with your needs
```
````

You should see a live rendered mockup below the code block!

---

## Integration with wiremd

### Understanding the Integration

The plugin integrates wiremd through three main steps:

1. **Parse**: Convert markdown to wiremd AST
   ```typescript
   import { parse } from 'wiremd/parser';
   const ast = parse(source);
   ```

2. **Render**: Convert AST to HTML
   ```typescript
   import { renderToHTML } from 'wiremd/renderer';
   const html = renderToHTML(ast, { style: 'sketch' });
   ```

3. **Display**: Inject HTML into Obsidian view
   ```typescript
   preview.innerHTML = bodyContent;
   ```

### Available wiremd Styles

The wiremd library provides 7 visual styles:

| Style | Description |
|-------|-------------|
| `sketch` | Balsamiq-inspired hand-drawn look (default) |
| `clean` | Modern minimal design |
| `wireframe` | Traditional grayscale with hatching |
| `tailwind` | Utility-first design inspired |
| `material` | Material Design inspired |
| `brutal` | Neo-brutalism with bold colors |
| `none` | Unstyled semantic HTML |

### Customizing Render Options

You can customize the rendering by modifying the `renderToHTML` call:

```typescript
const html = renderToHTML(ast, {
  style: 'sketch',          // Visual style
  inlineStyles: true,       // Inline CSS vs. external
  pretty: false,            // Pretty-print HTML
  classPrefix: 'wmd-',      // CSS class prefix
});
```

---

## Style Selection Implementation

### Command-Based Style Switching

The plugin provides multiple ways to change styles:

1. **Settings Tab**: Persistent default style
2. **Command Palette**: Quick style changes
3. **Ribbon Icon**: Quick access to settings
4. **Badge Click**: Direct access from preview

### Adding Custom Styles

To add a custom style:

1. **Define the style in wiremd** (modify `wiremd/src/renderer/styles.ts`)
2. **Update TypeScript types** in `settings.ts`:
   ```typescript
   export interface WiremdSettings {
     style: 'sketch' | 'clean' | 'wireframe' | 'custom';
     // ...
   }
   ```

3. **Add to settings dropdown**:
   ```typescript
   .addOption('custom', 'Custom Style')
   ```

---

## Testing and Debugging

### Development Mode

For active development with hot reload:

```bash
# Terminal 1: Watch and build
npm run dev

# Terminal 2: Sync to Obsidian plugins folder
# (On macOS/Linux)
ln -s "$(pwd)" "/path/to/vault/.obsidian/plugins/wiremd-preview"

# (On Windows - use mklink)
mklink /D "C:\path\to\vault\.obsidian\plugins\wiremd-preview" "C:\path\to\plugin"
```

### Debugging Tips

1. **Enable Developer Console**
   - Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS)
   - Check console for errors

2. **Add Debug Logging**
   ```typescript
   console.log('wiremd preview:', { source, style: this.plugin.settings.style });
   ```

3. **Check wiremd Output**
   ```typescript
   console.log('Generated HTML:', html);
   console.log('Parsed AST:', ast);
   ```

4. **Validate Settings**
   ```typescript
   console.log('Current settings:', this.plugin.settings);
   ```

### Common Issues

| Issue | Solution |
|-------|----------|
| Plugin doesn't load | Check manifest.json format and minAppVersion |
| Styles not applying | Verify inlineStyles is true, check CSS conflicts |
| Preview not updating | Check renderDelay setting, verify debounce logic |
| Parse errors | Validate wiremd syntax, check error messages |
| Obsidian crashes | Reduce renderDelay, check for infinite loops |

---

## Publishing Your Plugin

### Preparation

1. **Update Version**
   - Update `manifest.json` version
   - Update `package.json` version
   - Create a git tag: `git tag -a 1.0.0 -m "Release 1.0.0"`

2. **Create Release Build**
   ```bash
   npm run build
   ```

3. **Create README.md**
   Document your plugin features, installation, and usage.

4. **Create LICENSE**
   Use MIT license (matches wiremd).

### Submit to Obsidian Plugin Directory

1. **Fork the Obsidian Releases repo**
   - Go to: https://github.com/obsidianmd/obsidian-releases
   - Click "Fork"

2. **Add your plugin**
   - Add entry to `community-plugins.json`:
     ```json
     {
       "id": "wiremd-preview",
       "name": "wiremd Live Preview",
       "author": "Your Name",
       "description": "Live preview for wiremd UI mockups",
       "repo": "yourusername/obsidian-wiremd-preview"
     }
     ```

3. **Create Pull Request**
   - Submit PR to obsidian-releases
   - Wait for review and approval

### GitHub Release

1. **Create Release on GitHub**
   - Go to your repo → Releases → New Release
   - Tag: `1.0.0`
   - Title: `Release 1.0.0`
   - Attach: `main.js`, `manifest.json`, `styles.css`

2. **Write Release Notes**
   ```markdown
   ## Features
   - Live preview for wiremd mockups
   - 7 visual styles to choose from
   - Real-time rendering as you type
   - Settings tab for customization

   ## Installation
   Install from Obsidian Community Plugins
   ```

---

## Advanced Features (Optional)

### 1. Frontmatter Support

Allow users to set style per-note:

```typescript
// In preview.ts
const frontmatter = ctx.frontmatter;
const style = frontmatter?.wiremdStyle || this.plugin.settings.style;
```

Example note:
```markdown
---
wiremdStyle: material
---

# My Mockup

\`\`\`wiremd
[Button]
\`\`\`
```

### 2. Export to HTML

Add command to export preview as standalone HTML:

```typescript
this.addCommand({
  id: 'export-wiremd-html',
  name: 'Export wiremd as HTML',
  editorCallback: (editor, view) => {
    const selection = editor.getSelection();
    const ast = parse(selection);
    const html = renderToHTML(ast, { style: this.settings.style });

    // Save to file
    this.app.vault.create('mockup-export.html', html);
  },
});
```

### 3. Multiple Mockups per Page

Track each mockup separately for independent style control:

```typescript
// Add data attribute with unique ID
container.setAttribute('data-mockup-id', `mockup-${Date.now()}`);

// Store per-mockup settings
private mockupStyles: Map<string, string> = new Map();
```

### 4. Keyboard Shortcuts

Register hotkeys for quick style switching:

```typescript
this.addCommand({
  id: 'cycle-wiremd-style',
  name: 'Cycle through wiremd styles',
  hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'w' }],
  callback: () => {
    const styles = ['sketch', 'clean', 'wireframe', 'tailwind', 'material', 'brutal', 'none'];
    const currentIndex = styles.indexOf(this.settings.style);
    const nextIndex = (currentIndex + 1) % styles.length;
    this.settings.style = styles[nextIndex];
    this.saveSettings();
  },
});
```

### 5. Preview Mode Detection

Render differently in edit vs. preview mode:

```typescript
const mode = this.app.workspace.getActiveViewOfType(MarkdownView)?.getMode();
if (mode === 'preview') {
  // Full interactive preview
} else {
  // Simplified preview for edit mode
}
```

---

## Troubleshooting

### Plugin Won't Load

**Check console for errors:**
```bash
# Common causes:
- Syntax errors in TypeScript
- Missing dependencies
- Incorrect manifest.json
- Obsidian API version mismatch
```

**Solution:**
1. Run `npm run build` and check for errors
2. Verify `manifest.json` has correct `minAppVersion`
3. Check Obsidian console (Ctrl+Shift+I)

### Styles Not Rendering

**Check:**
1. wiremd library is installed: `npm list wiremd`
2. CSS is being injected: Inspect element in dev tools
3. Style conflicts: Check for CSS specificity issues

**Solution:**
```typescript
// Add !important or increase specificity
preview.addClass('wiremd-isolated-preview');
```

### Performance Issues

**Symptoms:**
- Slow typing
- Laggy preview updates
- Obsidian freezes

**Solution:**
1. Increase `renderDelay` in settings (try 500-1000ms)
2. Debounce more aggressively
3. Use `requestAnimationFrame` for updates
4. Limit preview size for large mockups

### wiremd Parse Errors

**Check:**
1. Syntax is valid wiremd markdown
2. Special characters are escaped
3. Code block language is `wiremd`

**Debug:**
```typescript
try {
  const ast = parse(source);
  console.log('Parsed successfully:', ast);
} catch (e) {
  console.error('Parse error:', e);
  // Show friendly error to user
}
```

---

## Resources

### Documentation

- **Obsidian Plugin API**: https://docs.obsidian.md/
- **wiremd Documentation**: See `/docs` in wiremd repository
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

### Example Plugins

- **Obsidian Sample Plugin**: https://github.com/obsidianmd/obsidian-sample-plugin
- **Dataview**: https://github.com/blacksmithgu/obsidian-dataview
- **Templater**: https://github.com/SilentVoid13/Templater

### Community

- **Obsidian Discord**: https://discord.gg/obsidianmd
- **Obsidian Forum**: https://forum.obsidian.md/
- **GitHub Discussions**: wiremd repository

---

## Next Steps

After implementing the basic plugin:

1. **Add unit tests** using Vitest
2. **Implement error boundaries** for graceful failure
3. **Add accessibility features** (ARIA labels, keyboard nav)
4. **Support mobile** (optimize for Obsidian mobile app)
5. **Add telemetry** (optional, with user consent)
6. **Create documentation site** using VitePress

---

## Complete Example

Here's a minimal working example you can test:

### Test Note in Obsidian

````markdown
---
title: wiremd Preview Test
wiremdStyle: sketch
---

# E-Commerce Mockup

## Navigation

```wiremd
## Navigation Bar {.nav}
[[ 🏪 ShopName | Products | Categories | Cart | [Sign In] ]]
```

## Hero Section

```wiremd
## Hero Section {.hero}
> # Summer Sale! 50% Off
> Limited time offer on all products
> [Shop Now] [View Catalog]{.outline}
```

## Product Grid

```wiremd
## Featured Products {.grid-3}

### Product 1
![Product Image](https://via.placeholder.com/150)
**$29.99** ~~$59.99~~
[Add to Cart]

### Product 2
![Product Image](https://via.placeholder.com/150)
**$39.99** ~~$79.99~~
[Add to Cart]

### Product 3
![Product Image](https://via.placeholder.com/150)
**$19.99** ~~$39.99~~
[Add to Cart]
```

## Contact Form

```wiremd
## Get In Touch

[Name_________________]
[Email________________] {type:email required}
[Message_____________] {rows:5}

[Submit] [Clear]{.secondary}
```
````

---

## Conclusion

You now have a complete guide to building an Obsidian plugin for wiremd live preview! This plugin allows users to:

- **Write mockups in Markdown** using wiremd syntax
- **Preview in real-time** as they type
- **Switch between 7 visual styles** instantly
- **Customize settings** for their workflow

The plugin architecture is extensible, allowing you to add features like:
- Export to various formats
- Collaborative editing
- Template library
- Component snippets
- And more!

Happy coding! 🚀

---

## Appendix: Full File Reference

### File Structure Summary

```
obsidian-wiremd-preview/
├── manifest.json              # Plugin metadata
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── esbuild.config.mjs         # Build config
├── .gitignore                 # Git ignore rules
├── README.md                  # Documentation
├── LICENSE                    # MIT License
└── src/
    ├── main.ts                # Plugin entry (250 lines)
    ├── settings.ts            # Settings management (150 lines)
    ├── preview.ts             # Preview processor (200 lines)
    └── styles.css             # Custom styles (100 lines)
```

### Estimated Development Time

- **Basic Implementation**: 6-8 hours
- **Testing & Debugging**: 4-6 hours
- **Documentation**: 2-3 hours
- **Publishing**: 1-2 hours
- **Total**: ~15-20 hours

### License Compatibility

- **wiremd**: MIT License
- **Obsidian**: Proprietary (free for personal use)
- **Your Plugin**: MIT License (recommended)

All components are compatible for distribution.

---

**End of Guide**

For questions or contributions, please open an issue in the wiremd repository or join the Obsidian community Discord.
