# Wiremd VS Code Extension - Development Guide

## Architecture

The Wiremd VS Code extension is built using the VS Code Extension API and provides a live preview of markdown mockups.

### Key Components

1. **Extension Entry Point** (`src/extension.ts`)
   - Activates the extension
   - Registers commands
   - Sets up status bar
   - Manages extension lifecycle

2. **Preview Provider** (`src/preview-provider.ts`)
   - Manages webview panels
   - Handles document changes
   - Renders wiremd content
   - Manages viewport and style switching

3. **WebView Content**
   - HTML/CSS/JavaScript injected into the preview panel
   - Communicates with extension via message passing
   - Handles user interactions (style/viewport switching)

## Development Setup

### Prerequisites

- Node.js 18+
- VS Code 1.75+
- TypeScript 5.0+

### Installation

```bash
cd vscode-extension
npm install
```

### Development Workflow

1. **Uninstall any installed Wiremd extension** from the Extensions sidebar (to avoid conflicts with the dev build)

2. **Launch VS Code with the dev extension loaded** (run from repo root):
   ```bash
   code --extensionDevelopmentPath=$(pwd)/vscode-extension .
   ```
   This loads the dev build into your current window — no second window needed.

3. **Start both watchers** in two terminals:
   ```bash
   # Terminal 1 (repo root) — rebuilds wiremd dist/ on src/ changes
   npm run dev

   # Terminal 2 (vscode-extension/) — rebundles extension whenever wiremd dist/ changes
   cd vscode-extension && npm run dev
   ```
   The extension watcher (`scripts/watch.mjs`) watches `../dist/index.cjs` and triggers `npm run bundle` only after vite finishes — no race condition.

4. **Reload the window**: `Cmd+Shift+P` → "Developer: Reload Window"

### Building

```bash
# Bundle extension (one-shot, minified)
npm run bundle

# Package extension as .vsix
npm run package
```

This creates a `.vsix` file in the project root.

### Installing Locally

```bash
code --install-extension wiremd-preview-0.1.0.vsix
```

## Architecture Details

### Message Passing

The extension communicates with the webview using message passing:

**Extension → Webview:**
```typescript
panel.webview.postMessage({
  type: 'error',
  message: 'Error message here'
});
```

**Webview → Extension:**
```typescript
vscode.postMessage({
  type: 'changeStyle',
  style: 'clean'
});
```

### State Management

The webview can persist state across reloads:

```typescript
// Save state
vscode.setState({ style: 'clean', viewport: 'mobile' });

// Restore state
const state = vscode.getState();
```

### Rendering Pipeline

1. User edits markdown file
2. `onDidChangeTextDocument` event fires
3. Debounce timer waits for more changes
4. `refresh()` method is called
5. Markdown is parsed using wiremd
6. HTML is generated and injected into webview
7. WebView updates preview

## Testing

### Manual Testing

1. Create test markdown files in `examples/`
2. Open in Extension Development Host
3. Test all commands and features
4. Verify error handling

### Test Cases

- [ ] Open preview for markdown file
- [ ] Close and reopen preview
- [ ] Switch between markdown files
- [ ] Change styles in toolbar
- [ ] Change viewport sizes
- [ ] Test with invalid markdown
- [ ] Test with wiremd not installed
- [ ] Test auto-refresh on/off
- [ ] Test configuration changes

## Code Structure

```
vscode-extension/
├── src/
│   ├── extension.ts          # Main entry point
│   └── preview-provider.ts   # Preview logic
├── dist/                      # Compiled JavaScript
├── package.json              # Extension manifest
├── tsconfig.json             # TypeScript config
└── README.md                 # User documentation
```

## Extension Manifest

Key parts of `package.json`:

- **activationEvents**: When to activate the extension
- **contributes**: Commands, menus, configuration
- **main**: Entry point file
- **engines**: VS Code version requirement

## WebView Security

The webview uses Content Security Policy (CSP) to prevent XSS:

```typescript
webview.options = {
  enableScripts: true,
  localResourceRoots: [context.extensionUri]
};
```

## Performance Considerations

1. **Debouncing**: Updates are debounced to avoid excessive rendering
2. **Lazy Loading**: Only render when webview is visible
3. **Resource Disposal**: Clean up resources when panel closes

## Common Issues

### Webview Not Updating

- Check if auto-refresh is enabled
- Verify debounce delay setting
- Check for JavaScript errors in DevTools

### Styles Not Loading

- Ensure wiremd is installed in workspace
- Check inline styles are enabled
- Verify HTML injection is correct

### Extension Not Activating

- Check activation events in package.json
- Verify file is actually markdown
- Check extension host logs

## Publishing

### Prepare for Publishing

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Test thoroughly
4. Create icon.png (128x128)

### Publish to Marketplace

```bash
# Install vsce
npm install -g @vscode/vsce

# Create publisher account at https://marketplace.visualstudio.com/

# Login
vsce login <publisher>

# Publish
vsce publish
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [WebView API Guide](https://code.visualstudio.com/api/extension-guides/webview)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Extension Samples](https://github.com/microsoft/vscode-extension-samples)
