# Troubleshooting: "Cannot find command" Error

## Quick Fixes

### 1. Check Extension Host Output

In the **Extension Development Host** window:

1. Open **Output** panel: `View` → `Output` (or `Ctrl+Shift+U`)
2. Select **Extension Host** from the dropdown
3. Look for errors or warnings

You should see:
```
Wiremd extension activated
```

If you don't see this, the extension isn't loading.

### 2. Reload the Extension Development Host

1. In Extension Development Host window
2. Press `Ctrl+R` (or `Cmd+R` on Mac)
3. Or: `Ctrl+Shift+P` → "Developer: Reload Window"

### 3. Verify Extension is Compiled

From the `vscode-extension` directory:

```bash
# Check dist files exist
ls -la dist/

# Should show:
# extension.js
# extension.js.map
# preview-provider.js
# preview-provider.js.map

# If missing, recompile:
npm run compile
```

### 4. Check for TypeScript Errors

```bash
cd vscode-extension
npm run compile
```

If there are errors, fix them before testing.

### 5. Verify Wiremd is Built

```bash
cd /home/user/wiremd  # or your root directory
npm run build

# Check it created files:
ls -la dist/index.js
ls -la dist/parser.js
ls -la dist/renderer.js
```

### 6. Reinstall Extension Dependencies

```bash
cd vscode-extension
rm -rf node_modules
npm install
npm run compile
```

## Detailed Debugging

### Check VS Code Extension Host Logs

1. In **main VS Code window** (not Extension Development Host)
2. Open **Developer Tools**: `Help` → `Toggle Developer Tools`
3. Go to **Console** tab
4. Look for errors related to wiremd

### Verify Commands are Registered

In Extension Development Host:

1. Press `Ctrl+Shift+P` (Command Palette)
2. Type "Wiremd"
3. You should see:
   - `Wiremd: Open Preview`
   - `Wiremd: Open Preview to the Side`
   - `Wiremd: Refresh Preview`
   - `Wiremd: Change Preview Style`
   - `Wiremd: Change Preview Viewport`

If you don't see these commands, the extension didn't activate.

### Check Activation Events

Look at Extension Host output when you:
1. Open a markdown file
2. Run a Wiremd command

The extension should activate on:
- Opening any markdown file
- Running any `wiremd.*` command

### Common Issues

**Issue: "Command 'wiremd.openPreviewToSide' not found"**

**Cause**: Extension not activated

**Fix**:
1. Check Extension Host output for errors
2. Ensure you're in a markdown file
3. Reload Extension Development Host window
4. Recompile extension: `npm run compile`

---

**Issue: Extension activates but preview shows blank/error**

**Cause**: Wiremd not properly linked

**Fix**:
```bash
cd vscode-extension
ls -la node_modules/wiremd  # Should show symlink to ../..
npm install  # Recreate symlink
```

---

**Issue: TypeScript compilation errors**

**Cause**: Missing types or syntax errors

**Fix**:
```bash
cd vscode-extension
npm install  # Ensure all deps installed
npm run compile  # Check for errors
```

---

**Issue: "Cannot find module 'wiremd'"**

**Cause**: Wiremd not built or not linked

**Fix**:
```bash
# Build wiremd
cd /home/user/wiremd
npm run build

# Link to extension
cd vscode-extension
npm install
npm run compile
```

## Manual Testing Steps

### Step-by-Step Verification

1. **Build wiremd**:
   ```bash
   cd /home/user/wiremd
   npm run build
   ls dist/index.js  # Verify exists
   ```

2. **Install extension deps**:
   ```bash
   cd vscode-extension
   npm install
   ls -la node_modules/wiremd  # Verify symlink
   ```

3. **Compile extension**:
   ```bash
   npm run compile
   ls dist/extension.js  # Verify exists
   ```

4. **Launch Extension Development Host**:
   ```bash
   code .  # Open vscode-extension in VS Code
   # Press F5 to launch
   ```

5. **Verify activation**:
   - Check Extension Host output
   - Should see: "Wiremd extension activated"

6. **Open markdown file**:
   - Open `test-wireframe.md`
   - Status bar should show: "👁 Wiremd"

7. **Open preview**:
   - Press `Ctrl+K V`
   - Or click status bar item
   - Or Command Palette → "Wiremd: Open Preview to the Side"

## Getting More Help

If still not working, check:

1. **Extension Host output** - Full error messages
2. **Developer Console** - JavaScript errors
3. **TypeScript compilation** - Build errors

Provide these details when asking for help:
- Extension Host output
- Any error messages
- TypeScript compilation output
- Node/npm versions: `node -v && npm -v`
- VS Code version: Check Help → About
