# wiremd Figma Plugin

Import wiremd markdown mockups as fully editable Figma designs with native components, auto-layout, and professional styling.

## Features

✨ **Native Figma Elements** - Creates real Figma frames, text nodes, and components (not just images)
🎨 **Multiple Themes** - Sketch (hand-drawn), Clean (modern), Wireframe (grayscale), or Minimal
📐 **Auto-Layout** - Responsive designs with proper constraints and spacing
🔧 **Fully Editable** - Every element can be customized after import
⚡ **Fast** - Imports complete mockups in seconds

## Supported Components

### Layout
- Containers (hero, card, modal, alert, section)
- Navigation bars
- Grid layouts (2, 3, 4+ columns)
- Brand headers

### Forms
- Buttons (primary, secondary, danger variants)
- Text inputs
- Textareas
- Select dropdowns
- Checkboxes
- Radio buttons and groups

### Content
- Headings (H1-H6)
- Paragraphs
- Images (as placeholders)
- Icons (Unicode symbols)
- Links
- Lists (ordered/unordered)
- Tables
- Blockquotes
- Code blocks

## Installation

### Option 1: Install from Figma Community (Recommended)
1. Open Figma
2. Go to Plugins → Browse plugins in Community
3. Search for "wiremd Importer"
4. Click "Install"

### Option 2: Development Installation
1. Clone this repository
2. In Figma: Menu → Plugins → Development → Import plugin from manifest
3. Select the `manifest.json` file from `figma-plugin/` directory
4. Plugin will appear in Plugins → Development → wiremd Importer

## Usage

### Step 1: Generate wiremd JSON

Use the wiremd CLI to convert your markdown mockup to JSON:

```bash
mdmock your-mockup.md --format json -o mockup.json
```

Example markdown:
```markdown
## Navigation Bar {.nav}
[[ Logo | Home | Products | About | [Sign In] ]]

## Hero Section {.hero}
> # Welcome to Our Product
> Transform your workflow with powerful tools
> [Get Started] [Learn More]{.outline}

## Features Grid {.grid-3}
### Fast Performance
Lightning-quick load times

### Secure
Enterprise-grade security

### Scalable
Grows with your needs
```

### Step 2: Open Plugin in Figma

1. Open Figma
2. Menu → Plugins → wiremd Importer
3. Select your preferred visual theme:
   - **Sketch** - Balsamiq-style hand-drawn look
   - **Clean** - Modern minimal design
   - **Wireframe** - Traditional grayscale
   - **Minimal** - Unstyled for custom CSS

### Step 3: Import JSON

1. Copy the contents of `mockup.json`
2. Paste into the text area
3. Click "Import to Figma"
4. Your design appears as a new page with editable components!

## Visual Themes

### Sketch Theme
- Hand-drawn, Balsamiq-inspired aesthetic
- Chalkboard font (or Comic Sans fallback)
- Rotated elements with shadows
- Perfect for brainstorming and early concepts

### Clean Theme
- Modern, polished design
- Inter font family
- Smooth rounded corners
- Professional drop shadows
- Great for client presentations

### Wireframe Theme
- Traditional grayscale
- Helvetica font
- Sharp corners, minimal styling
- Ideal for technical specifications

### Minimal Theme
- Bare-bones semantic HTML
- Basic borders and spacing
- Perfect starting point for custom styling

## Keyboard Shortcuts

- `Cmd/Ctrl + Enter` - Import (when textarea is focused)

## Tips & Tricks

### Auto-Layout Best Practices
The plugin uses Figma's auto-layout extensively. Imported designs will:
- Resize automatically when content changes
- Maintain proper spacing between elements
- Support responsive design patterns

### Editing After Import
All elements are fully editable:
- Text: Double-click any text to edit
- Colors: Select element and change fill/stroke
- Spacing: Adjust padding and gaps in auto-layout properties
- Layout: Drag elements to reorder

### Component Creation
Convert repeated elements to components:
1. Select an imported button or card
2. Create Component (Cmd/Ctrl + Alt + K)
3. Reuse across your design

### Working with Grids
Imported grids use horizontal frames with columns:
- Adjust `itemSpacing` to change gaps
- Resize columns independently
- Add/remove columns as needed

## Troubleshooting

### "Invalid wiremd JSON" error
- Ensure you're using `--format json` flag with mdmock CLI
- Validate JSON syntax (use jsonlint.com)
- Check that root object has `"type": "document"`

### Missing fonts
The plugin will attempt to load these fonts in order:
1. Theme-specific fonts (Chalkboard, Inter, Helvetica)
2. Roboto (fallback)

If fonts are missing, install them from Google Fonts or use a different theme.

### Large imports are slow
For very large mockups (100+ components):
- Consider breaking into multiple pages
- Import will show progress indicator
- Plugin won't freeze, but may take 10-30 seconds

### Elements look wrong
- Check that your wiremd markdown uses correct syntax
- Try different theme to see if it's theme-specific
- Verify JSON structure matches wiremd spec

## Development

### Building from Source

```bash
cd figma-plugin
npm install
npm run build
```

### Development Mode

```bash
npm run watch
```

Then in Figma:
1. Plugins → Development → Import plugin from manifest
2. Select `manifest.json`
3. Plugin updates automatically on file changes

### Project Structure

```
figma-plugin/
├── src/
│   ├── code.ts              # Main plugin logic
│   ├── ui.html              # Plugin UI
│   └── lib/
│       ├── ast-to-figma.ts  # Core converter
│       ├── types.ts         # TypeScript types
│       ├── style-mapper.ts  # Theme styling
│       ├── form-components.ts    # Form converters
│       └── content-components.ts # Content converters
├── dist/                    # Compiled output
├── manifest.json            # Figma plugin manifest
├── package.json
└── tsconfig.json
```

### Testing

Test with example wiremd files:

```bash
# In wiremd root directory
cd examples
mdmock navigation.md --format json -o nav.json
mdmock form.md --format json -o form.json
mdmock landing-page.md --format json -o landing.json
```

Then import each JSON file through the plugin.

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](../LICENSE) for details.

## Support

- 📖 [Documentation](https://wiremd.dev/docs)
- 💬 [GitHub Discussions](https://github.com/your-org/wiremd/discussions)
- 🐛 [Issue Tracker](https://github.com/your-org/wiremd/issues)
- 💡 [Feature Requests](https://github.com/your-org/wiremd/issues/new?template=feature_request.md)

## Roadmap

### v0.2 (Planned)
- [ ] Bi-directional sync (Figma → wiremd)
- [ ] Component variants support
- [ ] Custom color themes
- [ ] Image loading from URLs
- [ ] Style export (Figma styles → wiremd)

### v0.3 (Future)
- [ ] Batch import (multiple files)
- [ ] Live preview mode
- [ ] Plugin settings/preferences
- [ ] Export to wiremd from Figma
- [ ] Template library

## Credits

Built with ❤️ by the wiremd team

- Uses Figma Plugin API
- Inspired by html.to.design and other design tools
- Special thanks to the Figma developer community

---

**Made with wiremd** - Text-first UI design for developers
