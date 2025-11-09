# Debugging Style/Viewport Button Issues

## Quick Debug Steps

### 1. Check Browser Console

The preview runs in a webview (basically a browser), so we need to check its console:

**In the Extension Development Host window** (where the preview is open):

1. **Open Developer Tools**:
   - `Help` → `Toggle Developer Tools`
   - Or press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)

2. **Go to the Console tab**

3. **Click the Style or Viewport button**

4. **Look for logs**:
   - You should see: `[Wiremd] Style button clicked, requesting style change`
   - OR: `[Wiremd] Viewport button clicked, requesting viewport change`

### What the logs tell you:

**If you see the log messages:**
- ✅ Buttons are working
- ✅ Click events are firing
- ✅ Messages are being sent

**If you DON'T see log messages:**
- ❌ Buttons aren't getting clicked (CSS or HTML issue)
- Check if buttons are visible and not covered by something

### 2. Check Extension Host Output

This shows if the extension received the messages:

1. In Extension Development Host, open **Output panel**:
   - `View` → `Output` (or `Ctrl+Shift+U`)

2. **Select "Extension Host"** from dropdown

3. **Click a button** in the preview

4. **Look for**:
   - `[Wiremd] Received requestStyleChange, executing command`
   - OR: `[Wiremd] Received requestViewportChange, executing command`

### What this tells you:

**If you see these messages:**
- ✅ Messages sent from webview
- ✅ Extension received them
- ✅ Commands being executed

**If you don't see these:**
- ❌ Messages not reaching the extension
- Webview security might be blocking communication

## Complete Debug Flow

Here's what should happen when you click "Style: Sketch ▾":

1. **Browser Console**: `[Wiremd] Style button clicked, requesting style change`
2. **Extension Host**: `[Wiremd] Received requestStyleChange, executing command`
3. **VS Code UI**: QuickPick menu appears with style options
4. **You select**: Choose a style (e.g., "clean")
5. **Preview**: Updates with new style

## Common Issues

### Issue: No console logs at all

**Problem**: Buttons not clickable

**Check**:
```
1. Open Developer Tools → Elements tab
2. Find the button: <button id="style-btn">
3. Check if it has pointer-events: none or similar CSS
4. Check z-index - maybe something is covering it
```

**Fix**: The toolbar should have `z-index: 1000`. Make sure nothing is covering it.

### Issue: Console logs but no Extension Host logs

**Problem**: Messages not reaching extension

**Check**:
- Extension Host output for any errors
- WebView security errors in console

**Fix**: Try reloading the Extension Development Host (`Ctrl+R`)

### Issue: Extension Host logs but no QuickPick

**Problem**: Command not registered or failing

**Check**:
1. Extension Host output for command errors
2. Try running command manually:
   - `Ctrl+Shift+P` → Type "Wiremd: Change Preview Style"
   - Does it appear? Does it work?

**Fix**: If command works manually but not from button, there's a message passing issue.

### Issue: Everything logs but still doesn't work

**Problem**: Command executes but doesn't update preview

**Check**:
- Do you see "Wiremd extension activated" in Extension Host?
- Try the refresh button first
- Check if there are any errors in Extension Host output

## Manual Testing

### Test the buttons directly in browser console:

Open Developer Tools → Console, then run:

```javascript
// Test style button
document.getElementById('style-btn').click();

// Test viewport button
document.getElementById('viewport-btn').click();
```

This bypasses any CSS issues.

### Test message passing:

```javascript
// Test sending message directly
const vscode = acquireVsCodeApi();
vscode.postMessage({ type: 'requestStyleChange' });
```

Check if Extension Host receives it.

## Current Setup

**Expected behavior:**
1. Click button → Browser console log → Extension receives → Command executes → QuickPick shows → You select → Preview updates

**If broken:**
- Find where in the chain it breaks
- Check that step's logs/errors
- Report what you see

## Getting Help

Please provide:
1. **Browser console output** (screenshot or text)
2. **Extension Host output** (full text)
3. **Which step fails** (button click, message, command, update)
4. **Any error messages**

## Quick Test Commands

You can also test the commands directly:

1. Press `Ctrl+Shift+P` (Command Palette)
2. Type: "Wiremd: Change Preview Style"
3. Select it
4. Choose a style

If this works, the commands are fine - it's just the button communication that needs fixing.
