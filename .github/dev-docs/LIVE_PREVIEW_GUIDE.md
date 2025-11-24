# Wiremd Live Preview Guide

Wiremd now includes powerful live preview capabilities, available both as a **CLI dev server** and a **VS Code extension**!

## 🚀 Quick Start

### CLI Live Preview

The CLI includes an enhanced dev server with live-reload and responsive viewport testing:

```bash
# Basic watch mode with live preview
mdmock wireframe.md --watch --serve 3000

# Use different style
mdmock wireframe.md --watch --serve 3000 --style clean

# Just watch mode (no server)
mdmock wireframe.md --watch
```

Then open your browser to `http://localhost:3000` to see the live preview!

### VS Code Extension

1. Install the extension (from `vscode-extension/` directory)
2. Open any markdown file
3. Press `Ctrl+K V` (or `Cmd+K V` on Mac) to open preview to the side

## 📺 CLI Live Preview Features

### Visual Toolbar

The CLI preview includes a beautiful gradient toolbar with:
- **Connection Status** - Shows when connected to the live-reload server
- **Viewport Switcher** - Test responsive designs at different sizes
- **Live Status Indicator** - Animated pulse shows connection health

### Responsive Viewports

Switch between viewport sizes with one click:
- **Full** - Full browser width
- **💻 Laptop** - 1024px (common laptop size)
- **📱 Tablet** - 768px (iPad, Android tablets)
- **📱 Mobile** - 375px (iPhone, Android phones)

### Error Overlay

When there's a parsing or rendering error:
- Red overlay appears at the top of the preview
- Shows clear error message
- Auto-dismisses after 8 seconds
- Can be manually closed

### Reload Indicator

Small notification appears in bottom-right corner when preview is reloading.

### Visual Styles

All wiremd styles are supported in live preview:
```bash
# Balsamiq-style hand-drawn (default)
mdmock app.md --watch --serve 3000 --style sketch

# Modern minimal
mdmock app.md --watch --serve 3000 --style clean

# Traditional wireframe
mdmock app.md --watch --serve 3000 --style wireframe

# Material Design
mdmock app.md --watch --serve 3000 --style material

# Tailwind CSS
mdmock app.md --watch --serve 3000 --style tailwind

# Neo-brutalism
mdmock app.md --watch --serve 3000 --style brutal
```

## 🔌 VS Code Extension Features

### Live Preview Panel

- **Auto-sync** - Preview updates as you type
- **Side-by-side** - Edit and preview simultaneously
- **Configurable delay** - Debounce updates to avoid lag

### Toolbar Controls

The preview panel includes an integrated toolbar:
- **Refresh Button** - Manual refresh
- **Style Selector** - Switch between all 7 styles
- **Viewport Selector** - Test responsive layouts
- **Size Indicator** - Shows current viewport width

### Error Handling

- Graceful fallback when wiremd is not installed
- Clear error messages with helpful suggestions
- Error overlay can be configured off

### Configuration

Add to your VS Code `settings.json`:

```json
{
  "wiremd.defaultStyle": "sketch",
  "wiremd.autoRefresh": true,
  "wiremd.refreshDelay": 300,
  "wiremd.showErrorOverlay": true
}
```

## 🎨 Usage Examples

### Example 1: Basic App Mockup

Create `app.md`:
```markdown
# My App

## Navigation
[[ Logo | Home | Features | Pricing | [Sign In] ]]

## Hero Section
> # Welcome to My App
> The best way to manage your work
> [Get Started] [Learn More]{.outline}

## Features
::: grid-3
### Fast
Lightning quick performance

### Secure
Bank-level encryption

### Simple
Easy to use interface
:::
```

Preview with live-reload:
```bash
mdmock app.md --watch --serve 3000
```

### Example 2: Multi-viewport Testing

```bash
# Start dev server
mdmock landing.md --watch --serve 3000

# Open http://localhost:3000
# Use toolbar to switch between mobile/tablet/desktop views
# Edit landing.md and see changes instantly across all viewports
```

### Example 3: Style Comparison

```bash
# Terminal 1: Sketch style
mdmock design.md --watch --serve 3001 --style sketch

# Terminal 2: Clean style
mdmock design.md --watch --serve 3002 --style clean

# Terminal 3: Material style
mdmock design.md --watch --serve 3003 --style material

# Open all three in browser tabs to compare
```

## 🔧 Advanced Usage

### Custom Port

```bash
mdmock wireframe.md --watch --serve 8080
```

### Watch Without Server

Generate files on change but don't start a server:
```bash
mdmock wireframe.md --watch -o output.html
```

### Output JSON While Watching

```bash
mdmock wireframe.md --watch --format json -o output.json
```

## 🐛 Troubleshooting

### Preview Not Updating

**Issue**: Changes don't appear in preview

**Solutions**:
1. Check the connection status in the toolbar (should show "Connected")
2. Try refreshing the browser manually
3. Check terminal for error messages
4. Verify the markdown file is saved

### Connection Errors

**Issue**: "Disconnected" status in toolbar

**Solutions**:
1. Ensure the dev server is still running
2. Check if the port is blocked by firewall
3. Try a different port: `--serve 3001`
4. Look for error messages in terminal

### Slow Performance

**Issue**: Preview updates are laggy

**Solutions**:
1. Large files may take longer to parse
2. Reduce refresh delay (default is 100ms)
3. Close other resource-intensive applications
4. Use simpler styles (wireframe is fastest)

### Port Already in Use

**Issue**: Error: "Port 3000 already in use"

**Solutions**:
1. Use a different port: `--serve 3001`
2. Kill the process using port 3000
3. Check if another wiremd instance is running

## 📱 Mobile Testing Tips

Use the viewport switcher to test mobile layouts:

1. **Start with Mobile** - Design mobile-first
2. **Test Interactions** - Ensure buttons are large enough
3. **Check Spacing** - Verify padding works on small screens
4. **Test Typography** - Ensure text is readable

## 🎯 Best Practices

### 1. Use Watch Mode for Development

Always use `--watch --serve` during active development:
```bash
mdmock project.md --watch --serve 3000
```

### 2. Test Multiple Viewports

Don't just design for desktop - test all sizes:
- Full width (desktop monitors)
- Laptop (1024px)
- Tablet (768px)
- Mobile (375px)

### 3. Monitor Errors

Keep an eye on the terminal and error overlay for parsing issues.

### 4. Version Control

Commit your `.md` files but not the generated HTML:
```bash
# .gitignore
*.html
!examples/**/*.html
```

### 5. Use VS Code Extension for Quick Edits

For small changes, the VS Code extension is faster than switching to browser.

## 🚀 Performance Tips

### Optimize Large Files

For large mockups:
1. Split into multiple files
2. Use simpler styles (wireframe is fastest)
3. Limit nested components

### Reduce Refresh Delay

Edit VS Code settings:
```json
{
  "wiremd.refreshDelay": 150  // Faster, but may be laggy
}
```

### Disable Auto-Refresh

For very large files, disable auto-refresh:
```json
{
  "wiremd.autoRefresh": false  // Manual refresh only
}
```

## 📚 Additional Resources

- [Wiremd Documentation](https://github.com/akonan/wiremd)
- [VS Code Extension Guide](./vscode-extension/README.md)
- [CLI Reference](./README.md)
- [Examples](./examples/)

## 🎉 What's Next?

Future improvements planned:
- [ ] Split-screen comparison mode
- [ ] Export screenshots
- [ ] Collaborative editing
- [ ] Custom style themes
- [ ] Performance profiling
- [ ] Accessibility checker

---

**Happy wireframing with live preview!** ⚡
