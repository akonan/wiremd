# How to Properly Reload the Extension

## The Problem
VS Code Extension Development Host caches the extension code. After making changes, you MUST reload properly.

## Step-by-Step Reload Process

### 1. Close Everything

**In the Extension Development Host window** (the one with your test markdown file):
- Close it completely (don't just minimize)
- Or use: `File` → `Close Window`

### 2. Back in Main VS Code Window

(The one where you have `vscode-extension` folder open):

**Option A: Use Command Palette** (Recommended)
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: "Developer: Reload Window"
3. Select it
4. Wait for VS Code to reload
5. Then press `F5` to launch fresh Extension Development Host

**Option B: Completely Restart VS Code**
1. Close VS Code completely
2. Reopen: `code /home/user/wiremd/vscode-extension`
3. Press `F5` to launch Extension Development Host

### 3. In the New Extension Development Host Window

1. **Open Output Panel**:
   - `View` → `Output` (or `Ctrl+Shift+U`)
   - Select **"Extension Host"** from dropdown

2. **Open a markdown file**:
   - Open `test-wireframe.md`
   - Or create any `.md` file

3. **Check for activation message**:
   ```
   Wiremd extension activated
   ```

   If you see this, the extension loaded! ✅

4. **Try opening preview**:
   - Press `Ctrl+K V` (or `Cmd+K V`)
   - Or Command Palette → "Wiremd: Open Preview to the Side"

## If Commands Still Not Found

### Check Developer Console

In Extension Development Host window:
1. `Help` → `Toggle Developer Tools`
2. Go to **Console** tab
3. Look for red errors (especially during extension load)
4. Check for errors related to:
   - `wiremd` module
   - `Cannot find module`
   - Import/require errors

### Common Errors

**"Cannot find module 'wiremd'"**
```bash
cd /home/user/wiremd/vscode-extension
ls -la node_modules/wiremd  # Should show: wiremd -> ../..
npm install  # Recreate symlink
npm run compile
```

**"Extension activation failed"**
- Check Extension Host output for full error
- Look in Developer Console for stack trace
- Verify parent wiremd is built: `cd .. && npm run build`

**"Command not found" but extension activates**
- This shouldn't happen - commands are registered in activate()
- Check Extension Host output for command registration errors

## Verification Checklist

Before testing, verify:

```bash
# Run from vscode-extension directory
./debug-extension.sh
```

This checks:
- ✅ All files exist
- ✅ Wiremd is linked
- ✅ Extension is compiled
- ✅ Activation events configured

## Nuclear Option: Complete Clean Rebuild

If nothing works:

```bash
# From vscode-extension directory

# 1. Clean everything
rm -rf node_modules dist

# 2. Rebuild parent wiremd
cd /home/user/wiremd
npm run build

# 3. Reinstall extension
cd vscode-extension
npm install
npm run compile

# 4. Verify
./debug-extension.sh

# 5. Close ALL VS Code windows

# 6. Reopen
code .

# 7. Press F5
```

## What Should Happen

When everything works correctly:

1. **Main VS Code window**: Press `F5`
2. **Extension Development Host opens** (new window)
3. **Open any markdown file**
4. **Extension Host output shows**: `Wiremd extension activated`
5. **Status bar shows**: `👁 Wiremd` (bottom right)
6. **Press `Ctrl+K V`**: Preview opens to the side!

## Getting Help

If still broken, provide:

1. **Extension Host output** (full text)
2. **Developer Console errors** (screenshots)
3. **Result of**: `./debug-extension.sh`
4. **VS Code version**: `code --version`
5. **Node version**: `node -v`

---

**The key is: Always reload VS Code or the Extension Development Host after compiling!**
