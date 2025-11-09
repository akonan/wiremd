# Wiremd Live Preview - VS Code Extension

Live preview for Wiremd markdown mockups directly in VS Code.

![Wiremd Logo](https://via.placeholder.com/728x90.png?text=Wiremd+Live+Preview)

## Features

- **Live Preview** - See your wireframe mockups update in real-time as you type
- **Multiple Styles** - Switch between sketch, clean, wireframe, material, tailwind, and brutal styles
- **Responsive Preview** - Test your designs at different viewport sizes (desktop, laptop, tablet, mobile)
- **Side-by-Side Editing** - Preview panel syncs with your active markdown file
- **Error Overlay** - Clear error messages when syntax issues occur
- **Auto-Refresh** - Configurable auto-refresh with debouncing

## Installation

### From Marketplace (Coming Soon)

Search for "Wiremd Live Preview" in VS Code Extensions marketplace.

### Manual Installation

1. Clone the repository
2. Navigate to `vscode-extension` directory
3. Run `npm install`
4. Run `npm run compile`
5. Press F5 to launch Extension Development Host

## Usage

### Opening Preview

There are multiple ways to open the Wiremd preview:

1. **Command Palette**: `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) → "Wiremd: Open Preview to the Side"
2. **Keyboard Shortcut**: `Ctrl+K V` (or `Cmd+K V` on Mac) when editing a markdown file
3. **Editor Title Menu**: Click the preview icon when viewing a markdown file
4. **Status Bar**: Click "Wiremd" in the status bar (shown when editing markdown files)

### Changing Styles

- Click the style dropdown in the preview toolbar, or
- Use command palette: "Wiremd: Change Preview Style"

Available styles:
- **Sketch** - Balsamiq-inspired hand-drawn look (default)
- **Clean** - Modern minimal design
- **Wireframe** - Traditional grayscale with hatching
- **None** - Unstyled semantic HTML
- **Tailwind** - Modern utility-first design with purple accents
- **Material** - Google Material Design with elevation system
- **Brutal** - Neo-brutalism with bold colors and thick borders

### Responsive Preview

Switch between viewport sizes using the toolbar buttons:
- **Full** - Full width preview
- **Desktop** - 1440px width
- **Laptop** - 1024px width
- **Tablet** - 768px width
- **Mobile** - 375px width

Or use command palette: "Wiremd: Change Preview Viewport"

## Configuration

Configure the extension through VS Code settings:

```json
{
  "wiremd.defaultStyle": "sketch",
  "wiremd.autoRefresh": true,
  "wiremd.refreshDelay": 300,
  "wiremd.showErrorOverlay": true
}
```

### Settings

- `wiremd.defaultStyle` - Default visual style for previews (default: "sketch")
- `wiremd.autoRefresh` - Automatically refresh preview on file changes (default: true)
- `wiremd.refreshDelay` - Delay in milliseconds before refreshing (default: 300)
- `wiremd.showErrorOverlay` - Show error overlay when rendering fails (default: true)

## Requirements

This extension requires the `wiremd` package to be installed in your project:

```bash
npm install wiremd
```

If wiremd is not installed, the extension will show a fallback view with installation instructions.

## Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| `wiremd.openPreview` | Open preview in current column | - |
| `wiremd.openPreviewToSide` | Open preview to the side | `Ctrl+K V` / `Cmd+K V` |
| `wiremd.refreshPreview` | Manually refresh preview | - |
| `wiremd.changeStyle` | Change preview style | - |
| `wiremd.changeViewport` | Change viewport size | - |

## Extension Development

### Building

```bash
npm install
npm run compile
```

### Watch Mode

```bash
npm run watch
```

### Packaging

```bash
npm run package
```

This creates a `.vsix` file that can be installed in VS Code.

## Known Issues

- Preview may not work if wiremd is not installed locally
- Large markdown files may cause performance issues
- Some complex nested structures might not render perfectly

## Release Notes

### 0.1.0

Initial release:
- Live preview support
- Multiple style options
- Responsive viewport switcher
- Error overlay
- Auto-refresh with debouncing

## Contributing

Contributions are welcome! Please see the main [Wiremd repository](https://github.com/akonan/wiremd) for contribution guidelines.

## License

MIT License - see LICENSE file for details

## Links

- [Wiremd Documentation](https://github.com/akonan/wiremd)
- [Report Issues](https://github.com/akonan/wiremd/issues)
- [VS Code Extension API](https://code.visualstudio.com/api)

---

**Enjoy creating wireframes with Wiremd!** ⚡
