# Wiremd Preview - Obsidian Plugin

Live preview wiremd mockup files with multiple visual styles directly in Obsidian.

## Features

- **Live Preview**: Automatically render wiremd code blocks as interactive previews
- **7 Visual Styles**: Choose from sketch, clean, wireframe, tailwind, material, brutal, or none
- **Quick Style Switching**: Click the style badge to quickly change preview styles
- **Export Functionality**: Export wiremd previews as standalone HTML files
- **Mobile Optimized**: Touch-friendly interface with responsive design
- **Debounced Rendering**: Smooth performance with configurable render delays
- **Command Palette Integration**: Quick access to all features via Obsidian commands

## Installation

### Development Installation

1. **Clone this repository** into your Obsidian vault's plugins folder:
   ```bash
   cd /path/to/your/vault/.obsidian/plugins/
   git clone https://github.com/yourusername/wiremd-obsidian.git wiremd-preview
   cd wiremd-preview
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Link local wiremd** (if not using published version):
   ```bash
   cd ../../../wiremd  # Navigate to wiremd project
   npm link

   cd -  # Back to plugin directory
   npm link wiremd
   ```

4. **Build the plugin**:
   ```bash
   npm run build
   ```

5. **Enable the plugin** in Obsidian:
   - Open Obsidian Settings
   - Navigate to Community Plugins
   - Reload plugins
   - Enable "Wiremd Preview"

### Manual Installation

1. Download the latest release
2. Extract `main.js`, `manifest.json`, and `styles.css` to your vault's `.obsidian/plugins/wiremd-preview/` folder
3. Reload Obsidian
4. Enable the plugin in Settings → Community Plugins

## Usage

### Basic Syntax

Create a wiremd code block in your markdown file:

````markdown
```wiremd
## Login Form

Username
[____________________________]

Password
[****************************]

[Sign In]{.primary} [Cancel]
```
````

The plugin will automatically render it as an interactive preview!

### Available Styles

The plugin supports 7 distinct visual styles:

1. **Sketch** (default): Hand-drawn Balsamiq-inspired look
2. **Clean**: Modern minimal design
3. **Wireframe**: Traditional grayscale with hatching
4. **Tailwind**: Utility-first design inspired
5. **Material**: Material Design inspired
6. **Brutal**: Neo-brutalism with bold colors
7. **None**: Unstyled semantic HTML

### Changing Styles

**Quick Method**: Click the style badge in the top-right corner of any preview

**Settings Method**:
- Open Settings → Wiremd Preview
- Select your preferred default style

**Command Palette**:
- Press `Ctrl/Cmd + P`
- Type "Wiremd: Set style to..."
- Choose your desired style

### Wiremd Syntax Examples

#### Buttons
```wiremd
[Button Text]              # Basic button
[Button Text]{.primary}    # Primary button
[Button Text]*             # Primary (shorthand)
[Button Text]{:disabled}   # Disabled state
```

#### Text Inputs
```wiremd
[_____________________________]                    # Text input
[Email_________________________]                   # With placeholder
[_____________________________]{type:email}        # With type
[*****************************]                    # Password input
```

#### Navigation
```wiremd
## Navigation Bar {.nav}
[[ Logo | Home | Products | About | [Sign In] ]]
```

#### Grids
```wiremd
## Features {.grid-3}

### Feature One
Description here

### Feature Two
Description here

### Feature Three
Description here
```

#### Hero Section
```wiremd
## Hero Section {.hero}

> # Welcome to Our Product
> Transform your workflow with our amazing tool
> [Get Started]{.primary} [Learn More]
```

For complete syntax documentation, visit [wiremd documentation](https://github.com/akonan/wiremd).

## Commands

The plugin adds the following commands to Obsidian:

- **Wiremd: Set style to [style]** - Change the default style (7 commands, one per style)
- **Wiremd: Toggle auto-preview** - Enable/disable automatic preview rendering
- **Wiremd: Refresh all wiremd previews** - Manually refresh all previews
- **Wiremd: Export selected wiremd as HTML** - Export current wiremd block as standalone HTML
- **Wiremd: Export selected wiremd with all styles** - Export current wiremd block in all 7 styles
- **Wiremd: Copy selected wiremd HTML to clipboard** - Copy HTML to clipboard

## Settings

Access settings via Settings → Wiremd Preview:

- **Visual Style**: Choose default rendering style
- **Auto Preview**: Toggle automatic preview rendering
- **Render Delay**: Adjust debounce delay (0-1000ms, default: 300ms)

## Export Features

### Export Current Wiremd Block

1. Place your cursor inside a wiremd code block
2. Open Command Palette (`Ctrl/Cmd + P`)
3. Run "Wiremd: Export selected wiremd as HTML"
4. File will be downloaded automatically

### Export All Styles

Export the current wiremd block in all 7 styles at once:
1. Place cursor in wiremd block
2. Run "Wiremd: Export selected wiremd with all styles"
3. Seven HTML files will be downloaded

### Copy to Clipboard

Quickly copy the rendered HTML:
1. Place cursor in wiremd block
2. Run "Wiremd: Copy selected wiremd HTML to clipboard"
3. Paste anywhere!

## Mobile Support

The plugin is fully optimized for Obsidian mobile:

- **Touch-Friendly**: Larger touch targets (44x44px minimum)
- **Responsive Layout**: Adapts to phone and tablet screens
- **Optimized Performance**: Increased render delays on mobile to reduce resource usage
- **Smart Positioning**: Style selector adapts to available screen space
- **Smooth Scrolling**: Momentum scrolling for wide previews

## Development

### Project Structure

```
wiremd-obsidian/
├── src/
│   ├── main.ts          # Plugin entry point
│   ├── settings.ts      # Settings interface and tab
│   ├── preview.ts       # Preview processor
│   ├── export.ts        # Export functionality
│   ├── mobile.ts        # Mobile optimizations
│   └── styles.css       # Plugin styles
├── manifest.json        # Plugin metadata
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── esbuild.config.mjs   # Build config
└── README.md           # Documentation
```

### Build Commands

```bash
# Development mode with watch
npm run dev

# Production build
npm run build

# The build command runs:
# 1. TypeScript type checking
# 2. esbuild bundling
```

### Dependencies

- **wiremd**: Core library for parsing and rendering
- **obsidian**: Obsidian API types
- **typescript**: Type checking
- **esbuild**: Fast bundling

### Testing

The plugin includes comprehensive test coverage with **58 tests** using Vitest:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

**Test Coverage:**
- ✅ Mobile optimizer (23 tests)
- ✅ Settings module (12 tests)
- ✅ Export functionality (10 tests)
- ✅ Preview processor (13 tests)

Tests include:
- Unit tests for all core modules
- Mocked Obsidian API for isolated testing
- DOM manipulation testing with happy-dom
- Async operations and debouncing tests
- Error handling scenarios

## Troubleshooting

### Plugin not loading
- Ensure `main.js`, `manifest.json`, and `styles.css` are in `.obsidian/plugins/wiremd-preview/`
- Check Obsidian console (Ctrl/Cmd + Shift + I) for errors
- Try disabling and re-enabling the plugin

### Previews not rendering
- Check that Auto Preview is enabled in settings
- Verify code block uses ` ```wiremd ` (with three backticks)
- Look for syntax errors in your wiremd code

### Performance issues
- Increase Render Delay in settings (try 500-1000ms)
- Disable Auto Preview for large documents
- Use Command Palette to manually refresh when needed

### Export not working
- Ensure your cursor is inside a wiremd code block
- Check browser console for errors
- Try copying to clipboard instead

## License

MIT License - See LICENSE file for details

## Credits

- Built with [wiremd](https://github.com/akonan/wiremd) by akonan
- Inspired by Obsidian's amazing plugin ecosystem

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

- Report issues: [GitHub Issues](https://github.com/yourusername/wiremd-obsidian/issues)
- Documentation: See [OBSIDIAN_PLUGIN_GUIDE.md](./OBSIDIAN_PLUGIN_GUIDE.md)
- Wiremd docs: [wiremd repository](https://github.com/akonan/wiremd)

## Changelog

### Version 0.1.0 (Initial Release)

- ✨ Live preview for wiremd code blocks
- 🎨 7 visual styles (sketch, clean, wireframe, tailwind, material, brutal, none)
- 📱 Full mobile support with touch optimizations
- 💾 Export functionality (single file or all styles)
- ⚙️ Configurable settings (style, auto-preview, render delay)
- 🎯 Command palette integration
- 🎭 Quick style switching via badge
- 📋 Copy to clipboard support
- ⚡ Debounced rendering for performance

---

Made with ❤️ for the Obsidian community
