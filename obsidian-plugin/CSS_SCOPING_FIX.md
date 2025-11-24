# CSS Scoping Fix - Style Leak Issue Resolved

## Problem

When changing wiremd styles, the CSS was leaking out and affecting all of Obsidian's interface, not just the wiremd preview. This happened because wiremd's generated styles were being injected as global CSS rules.

## Solution

Added **CSS scoping** to ensure all wiremd styles only apply within the `.wiremd-preview-container` element.

### What Was Changed

**File:** `src/preview.ts`

1. **Added `scopeCSS()` function** (lines 6-55)
   - Parses CSS rules
   - Prefixes every selector with `.wiremd-preview-container`
   - Preserves at-rules and :root pseudo-class
   - Prevents double-scoping

2. **Updated style injection** (line 153)
   - Before: `styleEl.textContent = styles;`
   - After: `styleEl.textContent = scopeCSS(styles, '.wiremd-preview-container');`

### How It Works

Original CSS from wiremd:
```css
.wmd-button {
  padding: 10px;
  background: blue;
}
.wmd-input {
  border: 1px solid #ccc;
}
```

Scoped CSS (after transformation):
```css
.wiremd-preview-container .wmd-button {
  padding: 10px;
  background: blue;
}
.wiremd-preview-container .wmd-input {
  border: 1px solid #ccc;
}
```

This ensures the styles **only** apply to elements inside the wiremd preview container, not to Obsidian's UI.

## Testing

Added **15 new tests** for CSS scoping (`tests/css-scoping.test.ts`):

✅ Simple selector scoping
✅ Multiple selectors
✅ Multiple rules
✅ At-rules preservation
✅ :root pseudo-class preservation
✅ Empty CSS handling
✅ No double-scoping
✅ Complex selectors (pseudo-classes, pseudo-elements)
✅ Descendant combinators
✅ Element selectors
✅ Universal selector
✅ Real wiremd CSS
✅ CSS isolation between containers

**Total: 73 tests passing** (was 58, added 15)

```
✓ tests/mobile.test.ts       (23 tests)
✓ tests/export.test.ts       (10 tests)
✓ tests/preview.test.ts      (13 tests)
✓ tests/settings.test.ts     (12 tests)
✓ tests/css-scoping.test.ts  (15 tests) ← NEW!
```

## Installation

The fixed version has been copied to your vault:

```bash
~/Documents/Remote/.obsidian/plugins/wiremd-preview/
├── main.js (410KB) ← Updated with CSS scoping
├── manifest.json
└── styles.css
```

## How to Test the Fix

1. **Reload Obsidian** (Ctrl/Cmd + R) or restart the app
2. Create a wiremd block with any style:
   ````markdown
   ```wiremd
   ## Test
   [Button]{.primary}
   ```
   ````
3. **Click the style badge** and change between different styles
4. **Verify**: Obsidian's UI colors and fonts should NOT change
5. **Only the wiremd preview** should update with new styles

## Before vs After

### Before (Broken)
- ❌ Changing style affected all Obsidian text
- ❌ Obsidian sidebar colors changed
- ❌ Editor font styles changed
- ❌ Settings UI affected

### After (Fixed)
- ✅ Only wiremd preview updates
- ✅ Obsidian UI remains unchanged
- ✅ Multiple previews can have different styles
- ✅ Styles are isolated per preview

## Technical Details

### Scoping Rules

1. **Regular selectors**: Prefixed with container class
   - `.button` → `.wiremd-preview-container .button`

2. **Multiple selectors**: Each is individually scoped
   - `.button, .link` → `.wiremd-preview-container .button, .wiremd-preview-container .link`

3. **Pseudo-classes/elements**: Preserved correctly
   - `.button:hover` → `.wiremd-preview-container .button:hover`
   - `.button::before` → `.wiremd-preview-container .button::before`

4. **Already scoped**: Not double-scoped
   - `.wiremd-preview-container .button` → `.wiremd-preview-container .button` (unchanged)

5. **At-rules**: Passed through as-is
   - `@charset`, `@font-face`, etc. preserved

6. **:root**: Not scoped (global CSS variables)
   - `:root { --color: blue }` → unchanged

### Performance Impact

- ✅ Minimal: CSS scoping happens once during render
- ✅ No runtime overhead after initial processing
- ✅ Scoped styles are cached in the preview element

## Related Files

- `src/preview.ts` - Main implementation
- `tests/css-scoping.test.ts` - Test coverage
- `README.md` - Updated with test count (73 tests)

## Verification

Run tests to verify the fix:
```bash
cd /home/akonan/Work/wiremd-obsidian
npm test
```

All tests should pass! ✅

---

**Issue:** CSS leaking to Obsidian UI
**Status:** ✅ FIXED
**Version:** 0.1.0
**Date:** 2025-11-09
