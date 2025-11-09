# VS Code Extension - Testing Guide

## Quick Test Setup

### Prerequisites

The extension uses wiremd from the parent directory, so **you must build wiremd first**:

```bash
# From the root wiremd directory
cd /home/user/wiremd
npm install
npm run build  # This creates dist/ files
```

### 1. Install Extension Dependencies

```bash
cd vscode-extension
npm install  # This links wiremd from parent directory
```

This creates a symlink: `node_modules/wiremd -> ../..`

### 2. Compile the Extension

```bash
npm run compile
```

### 3. Launch Extension Development Host

**Option A: From VS Code**
1. Open the `vscode-extension` folder in VS Code
2. Press `F5` or go to Run → Start Debugging
3. This opens a new "Extension Development Host" window

**Option B: From Command Line**
```bash
code --extensionDevelopmentPath=/home/user/wiremd/vscode-extension
```

### 4. Test the Extension

In the Extension Development Host window:

1. Create a test markdown file (`test.md`):
```markdown
# My Wireframe

## Navigation Bar
[[ Logo | Home | About | Contact | [Sign In] ]]

## Hero Section
> # Welcome to Our App
> The best way to manage your projects
> [Get Started] [Learn More]{.outline}

## Features Grid
::: grid-3
### Fast
⚡ Lightning quick performance

### Secure
🔒 Bank-level security

### Simple
✨ Easy to use interface
:::

## Contact Form
[Name___________]
[Email__________] {type:email}
[Your message...] {rows:5}
[Submit]
```

2. **Open Preview**: Press `Ctrl+K V` (or `Cmd+K V` on Mac)
   - Or: Right-click editor → "Open Wiremd Preview to the Side"
   - Or: Command Palette (`Ctrl+Shift+P`) → "Wiremd: Open Preview to the Side"

3. **Test Live Updates**: Edit the markdown and watch the preview update in real-time

4. **Test Style Switching**: Use the style dropdown in the preview toolbar

5. **Test Viewport Switching**: Click the viewport buttons (Desktop/Laptop/Tablet/Mobile)

## Features to Test

### ✅ Basic Preview
- [ ] Preview opens successfully
- [ ] Content renders correctly
- [ ] Styles are applied (default: sketch)

### ✅ Live Refresh
- [ ] Edit markdown → preview updates automatically
- [ ] Debouncing works (doesn't update on every keystroke)
- [ ] No lag or freezing

### ✅ Style Switching
- [ ] Dropdown shows all 7 styles
- [ ] Switching styles updates preview
- [ ] Each style looks different

### ✅ Viewport Testing
- [ ] Full width works
- [ ] Desktop (1440px) width
- [ ] Laptop (1024px) width
- [ ] Tablet (768px) width
- [ ] Mobile (375px) width

### ✅ Error Handling
- [ ] Invalid markdown shows error
- [ ] Error overlay appears
- [ ] Error can be dismissed

### ✅ Multi-file Support
- [ ] Switch between markdown files
- [ ] Preview updates for active file
- [ ] Multiple previews work

## Debugging the Extension

### Enable Debug Logging

1. In Extension Development Host, open Debug Console
2. You'll see logs like:
```
[Extension Host] Wiremd extension activated
[Extension Host] Preview panel created
```

### Common Issues

**Issue: Preview shows "Wiremd not installed"**
- Solution: Run `npm install` in the main wiremd directory
- The extension needs wiremd to be available in workspace

**Issue: Preview doesn't update**
- Check: Is `wiremd.autoRefresh` enabled? (default: true)
- Check: Extension Development Host console for errors

**Issue: Styles not changing**
- Check: Browser DevTools in preview (Help → Toggle Developer Tools)
- Check: HTML is being regenerated

## Advanced Testing

### Test with Different Projects

Create test projects in different directories:

```bash
# Project 1: Simple wireframe
mkdir ~/test-wiremd-1
cd ~/test-wiremd-1
npm init -y
npm install wiremd

# Create test file
cat > app.md << 'EOF'
# Simple App
[[ Home | About ]]
## Welcome
[Get Started]
EOF

# Open in VS Code
code .
```

### Test Configuration Options

Create `.vscode/settings.json`:

```json
{
  "wiremd.defaultStyle": "clean",
  "wiremd.autoRefresh": true,
  "wiremd.refreshDelay": 500,
  "wiremd.showErrorOverlay": true
}
```

Test each configuration option changes behavior.

### Test Performance

Create a large markdown file (1000+ lines) and test:
- [ ] Initial render time
- [ ] Update speed when editing
- [ ] Memory usage (Task Manager)
- [ ] No crashes or freezes

## Automated Testing

### Unit Tests (Future)

```bash
cd vscode-extension
npm test
```

Note: Extension testing framework not yet set up. Would need:
- `@vscode/test-electron`
- Test fixtures
- Integration test setup

## Packaging for Distribution

### Create VSIX Package

```bash
cd vscode-extension
npm install -g @vscode/vsce
vsce package
```

This creates `wiremd-preview-0.1.0.vsix`

### Install Locally

```bash
code --install-extension wiremd-preview-0.1.0.vsix
```

### Test Installed Extension

1. Restart VS Code
2. Open a markdown file
3. Test all features as production extension

## Recording Demo

### Create GIF Demo

1. Install screen recorder (e.g., Peek on Linux, LICEcap on Mac/Windows)
2. Record:
   - Opening preview
   - Live editing
   - Style switching
   - Viewport testing

### Create Screenshots

For README/documentation:
- Full preview with toolbar
- Different styles comparison
- Viewport sizes
- Error overlay

## CI/CD Testing (Future)

Would need:
- GitHub Actions workflow for extension
- Automated VSIX building
- Extension marketplace publishing

## Troubleshooting

### Extension Won't Load

1. Check `package.json` syntax
2. Verify `main` points to correct file
3. Check TypeScript compilation: `npm run compile`
4. Look for errors in Extension Development Host

### Preview Blank

1. Open Browser DevTools (Help → Toggle Developer Tools)
2. Check Console for errors
3. Verify wiremd is installed in workspace
4. Check `preview-provider.ts` logs

### Performance Issues

1. Disable auto-refresh
2. Increase refresh delay
3. Use simpler styles (wireframe is fastest)
4. Check for memory leaks in DevTools

## Next Steps

Once testing is complete:
- [ ] Fix any bugs found
- [ ] Optimize performance
- [ ] Add more features
- [ ] Publish to VS Code marketplace

---

Happy testing! 🚀
