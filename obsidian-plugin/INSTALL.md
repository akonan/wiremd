# Quick Installation & Testing Guide

## Installation Steps

### 1. Copy Plugin Files to Obsidian

Create the plugin directory in your Obsidian vault:

```bash
# Replace with your vault path
VAULT_PATH="/path/to/your/obsidian/vault"

# Create plugin directory
mkdir -p "$VAULT_PATH/.obsidian/plugins/wiremd-preview"

# Copy required files
cp main.js "$VAULT_PATH/.obsidian/plugins/wiremd-preview/"
cp manifest.json "$VAULT_PATH/.obsidian/plugins/wiremd-preview/"
cp styles.css "$VAULT_PATH/.obsidian/plugins/wiremd-preview/"
```

### 2. Enable the Plugin in Obsidian

1. Open Obsidian
2. Go to **Settings** (gear icon)
3. Navigate to **Community plugins**
4. Click **Reload plugins** (if needed)
5. Find "Wiremd Preview" in the list
6. Toggle it **ON**

### 3. Test the Plugin

1. Create a new note in Obsidian
2. Add a wiremd code block:

````markdown
```wiremd
## Quick Test

Username
[____________________________]

Password
[****************************]

[Sign In]{.primary} [Cancel]
```
````

3. Switch to **Reading mode** or **Live Preview mode**
4. You should see the rendered wiremd preview!

## Testing All Features

### Test Different Styles

1. Click the **style badge** in the top-right corner of a preview
2. Select different styles from the dropdown
3. The preview will update immediately

### Test Export

1. Open **Command Palette** (Ctrl/Cmd + P)
2. Type "Wiremd: Export"
3. Try:
   - "Export selected wiremd as HTML"
   - "Export selected wiremd with all styles"
   - "Copy selected wiremd HTML to clipboard"

### Test Settings

1. Go to **Settings** → **Wiremd Preview**
2. Try changing:
   - Default visual style
   - Auto-preview toggle
   - Render delay slider

### Test Mobile (if applicable)

1. Open Obsidian mobile app
2. Create a wiremd code block
3. Test touch interactions on the style badge
4. Verify larger touch targets and responsive layout

## Troubleshooting

### Plugin doesn't appear
- Make sure all three files (main.js, manifest.json, styles.css) are in the correct folder
- Restart Obsidian
- Check console for errors (Ctrl/Cmd + Shift + I)

### Previews show raw code
- Verify you're using ` ```wiremd ` (three backticks)
- Check that Auto Preview is enabled in settings
- Switch to Reading mode or Live Preview mode

### Build Issues
- Make sure wiremd is built: `cd ../wiremd && npm run build`
- Rebuild this plugin: `npm run build`
- Check that wiremd is linked: `npm link wiremd`

## Development Mode

For development with hot reload:

```bash
# In plugin directory
npm run dev

# This will watch for changes and rebuild automatically
# Reload Obsidian after changes (Ctrl/Cmd + R)
```

## Common Vault Locations

**Linux**:
- `~/.config/obsidian/`
- Or in your vault: `/path/to/vault/.obsidian/plugins/`

**macOS**:
- `~/Library/Application Support/obsidian/`
- Or in your vault: `/path/to/vault/.obsidian/plugins/`

**Windows**:
- `%APPDATA%\Obsidian\`
- Or in your vault: `C:\path\to\vault\.obsidian\plugins\`

## Next Steps

1. Check out `test-wiremd.md` for more examples
2. Read `OBSIDIAN_PLUGIN_GUIDE.md` for detailed documentation
3. Explore the wiremd syntax at https://github.com/akonan/wiremd
4. Customize settings to your preference
5. Try all 7 visual styles!

Enjoy using Wiremd Preview! 🎉
