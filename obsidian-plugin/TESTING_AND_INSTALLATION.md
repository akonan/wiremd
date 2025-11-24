# Testing and Installation Guide

## ✅ Test Results

All **76 tests** are passing! The plugin has comprehensive test coverage:

```
✓ tests/css-scoping.test.ts (18 tests) - CSS scoping & !important
✓ tests/mobile.test.ts      (23 tests) - Mobile optimizations
✓ tests/export.test.ts      (10 tests) - Export functionality
✓ tests/preview.test.ts     (13 tests) - Preview processor
✓ tests/settings.test.ts    (12 tests) - Settings module
```

### Recent Fixes Applied

Three critical fixes have been applied to ensure full wiremd style support:

1. **CSS Scoping** - Prevents wiremd styles from leaking to Obsidian UI
2. **!important Flags** - Ensures wiremd styles override Obsidian's theme
3. **Body Class Application** - Applies font-family and background correctly

See `CSS_SCOPING_FIX.md`, `STYLE_OVERRIDE_FIX.md`, and `BODY_CLASS_FIX.md` for details.

## Installation to Your Obsidian Vault

Your Obsidian vault is located at: `~/Documents/Remote`

### Step 1: Copy Plugin Files

```bash
# Create plugin directory
mkdir -p ~/Documents/Remote/.obsidian/plugins/wiremd-preview

# Copy required files
cp /home/akonan/Work/wiremd-obsidian/main.js ~/Documents/Remote/.obsidian/plugins/wiremd-preview/
cp /home/akonan/Work/wiremd-obsidian/manifest.json ~/Documents/Remote/.obsidian/plugins/wiremd-preview/
cp /home/akonan/Work/wiremd-obsidian/styles.css ~/Documents/Remote/.obsidian/plugins/wiremd-preview/

# Verify files were copied
ls -lh ~/Documents/Remote/.obsidian/plugins/wiremd-preview/
```

You should see:
- `main.js` (~409KB)
- `manifest.json` (~200 bytes)
- `styles.css` (~7KB)

### Step 2: Enable Plugin in Obsidian

1. **Open Obsidian** with your vault at `~/Documents/Remote`
2. Go to **Settings** (click the gear icon in the left sidebar)
3. Navigate to **Community plugins** section
4. If you see a message about restricted mode:
   - Click **Turn off restricted mode**
   - This allows you to use community plugins
5. Click **Reload plugins** button
6. Look for **"Wiremd Preview"** in the installed plugins list
7. Toggle it **ON** ✅

### Step 3: Test the Plugin

1. **Create a new note** or open an existing one
2. Add this test wiremd code block:

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

3. **Switch to Reading mode** or stay in **Live Preview mode**
4. You should see a rendered wireframe preview!
5. **Click the style badge** in the top-right corner to try different styles

### Step 4: Explore Features

#### Try Different Styles

Click the badge and select:
- **Sketch** - Hand-drawn Balsamiq style (default)
- **Clean** - Modern minimal design
- **Wireframe** - Traditional grayscale
- **Tailwind** - Utility-first inspired
- **Material** - Material Design
- **Brutal** - Neo-brutalism
- **None** - Unstyled HTML

#### Test Export

1. Place cursor inside a wiremd code block
2. Open **Command Palette** (Ctrl/Cmd + P)
3. Type "Wiremd: Export"
4. Try:
   - **Export selected wiremd as HTML**
   - **Copy selected wiremd HTML to clipboard**

#### Configure Settings

1. Go to **Settings → Wiremd Preview**
2. Adjust:
   - Default visual style
   - Auto-preview toggle
   - Render delay (0-1000ms)

## Example Wiremd Code Blocks

Copy the test file for more examples:

```bash
cp /home/akonan/Work/wiremd-obsidian/test-wiremd.md ~/Documents/Remote/
```

Then open `test-wiremd.md` in Obsidian to see:
- Navigation bars
- Hero sections
- Grid layouts
- Forms with states
- And more!

## Troubleshooting

### Plugin not showing up?
```bash
# Check if files are in the right place
ls ~/Documents/Remote/.obsidian/plugins/wiremd-preview/
```

Should output:
```
main.js
manifest.json
styles.css
```

### Preview not rendering?

1. **Check Settings:** Settings → Wiremd Preview → Auto Preview (should be ON)
2. **Check syntax:** Make sure you're using ` ```wiremd ` (three backticks)
3. **Check mode:** Switch to Reading mode or Live Preview mode
4. **Check console:** Press Ctrl/Cmd + Shift + I to open developer tools and check for errors

### Need to rebuild?

```bash
cd /home/akonan/Work/wiremd-obsidian
npm run build
```

Then copy the updated `main.js` to your vault:

```bash
cp main.js ~/Documents/Remote/.obsidian/plugins/wiremd-preview/
```

Reload Obsidian (Ctrl/Cmd + R) or restart the app.

## Running Tests Locally

If you want to run the tests yourself:

```bash
cd /home/akonan/Work/wiremd-obsidian

# Run all tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Visual UI for tests
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Development Mode

For active development with hot reload:

```bash
cd /home/akonan/Work/wiremd-obsidian

# Start development mode
npm run dev

# In another terminal, copy files on save:
# (Or set up a watch script to auto-copy)
while true; do
  cp main.js ~/Documents/Remote/.obsidian/plugins/wiremd-preview/
  sleep 2
done
```

Then reload Obsidian (Ctrl/Cmd + R) after changes.

## Quick Copy Command

For convenience, you can use this one-liner to copy all files:

```bash
cp /home/akonan/Work/wiremd-obsidian/{main.js,manifest.json,styles.css} ~/Documents/Remote/.obsidian/plugins/wiremd-preview/
```

## What's Next?

1. ✅ **Open Obsidian** and enable the plugin
2. ✅ **Test basic functionality** with a simple wiremd block
3. ✅ **Try all 7 styles** by clicking the badge
4. ✅ **Test export** functionality via command palette
5. ✅ **Adjust settings** to your preference
6. ✅ **Create your first wireframe!**

---

## Summary

✅ **58 tests passing** - All functionality verified
✅ **Plugin built successfully** - Ready to install
✅ **Installation path ready** - `~/Documents/Remote/.obsidian/plugins/wiremd-preview/`
✅ **Documentation complete** - Full guide and examples provided

**Enjoy using Wiremd Preview in Obsidian!** 🎉
