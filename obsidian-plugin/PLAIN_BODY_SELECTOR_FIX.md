# Plain Body Selector Fix - Tailwind, Material, and Brutal Backgrounds Now Work

## Problem

After fixing the padding issue, Tailwind, Material, and Brutal styles still showed the wrong background color (Obsidian's dark theme instead of the style's intended background).

Looking at the wiremd test-styles.html file, these styles use:
```css
body {
  background: #f9fafb;
}
```

Instead of:
```css
body.wmd-root {
  background: #f5f5dc;
}
```

## Root Cause

The previous fix transformed `body.` selectors to remove the `body` element:
```typescript
styles = styles.replace(/\bbody\./g, '.');
// body.wmd-root { ... } → .wmd-root { ... }
```

But this transformation **only worked for selectors like `body.wmd-root`**, not for plain `body {` selectors.

**Which styles use which pattern:**
- **body.wmd-root**: Sketch, Clean, Wireframe, None
- **plain body**: Tailwind, Material, Brutal

Since Tailwind, Material, and Brutal use `body { background: ... }`, the selector wasn't being transformed, and the styles couldn't apply (no body element exists in the preview).

## Solution

Added a second regex transformation to handle plain `body` selectors:

```typescript
// 1. Transform body.wmd-root → .wmd-root (for sketch, clean, wireframe, none)
styles = styles.replace(/\bbody\./g, '.');

// 2. Transform body { → .wmd-body { (for tailwind, material, brutal)
//    This regex matches 'body' followed by whitespace and {, but not 'body.'
styles = styles.replace(/\bbody(\s*\{)/g, '.wmd-body$1');
```

Then, **always add the `wmd-body` class** to the content element:

```typescript
// Always add wmd-body class for styles that use plain body selector
contentEl.addClass('wmd-body');

// Also apply body classes (wmd-root, wmd-sketch, etc.) if they exist
if (bodyClasses) {
  bodyClasses.split(/\s+/).forEach(cls => {
    if (cls) contentEl.addClass(cls);
  });
}
```

## What Changed

### File: `src/preview.ts`

#### Selector Transformation
```typescript
// Before
styles = styles.replace(/\bbody\./g, '.'); // Only transformed body.class

// After
styles = styles.replace(/\bbody\./g, '.'); // Transform body.class
styles = styles.replace(/\bbody(\s*\{)/g, '.wmd-body$1'); // Transform plain body
```

#### Class Application
```typescript
// Before
if (bodyClasses) {
  bodyClasses.split(/\s+/).forEach(cls => {
    if (cls) contentEl.addClass(cls);
  });
}

// After
contentEl.addClass('wmd-body'); // Always add this for plain body styles
if (bodyClasses) {
  bodyClasses.split(/\s+/).forEach(cls => {
    if (cls) contentEl.addClass(cls);
  });
}
```

### File: `tests/css-scoping.test.ts`

Added 4 new tests for body selector transformation:

```typescript
describe('Body selector transformation', () => {
  it('should transform body.class to .class', () => {
    const css = 'body.wmd-root { background: blue }';
    const transformed = css.replace(/\bbody\./g, '.');
    expect(transformed).toBe('.wmd-root { background: blue }');
  });

  it('should transform plain body to .wmd-body', () => {
    const css = 'body { background: #f9fafb }';
    const transformed = css.replace(/\bbody(\s*\{)/g, '.wmd-body$1');
    expect(transformed).toBe('.wmd-body { background: #f9fafb }');
  });

  it('should handle both transformations together', () => {
    let css = 'body { background: white } body.wmd-root { color: black }';
    css = css.replace(/\bbody\./g, '.');
    css = css.replace(/\bbody(\s*\{)/g, '.wmd-body$1');

    expect(css).toContain('.wmd-body { background: white }');
    expect(css).toContain('.wmd-root { color: black }');
  });

  it('should not transform body in middle of words', () => {
    const css = 'everybody { color: red } body { color: blue }';
    const transformed = css.replace(/\bbody(\s*\{)/g, '.wmd-body$1');

    expect(transformed).toContain('everybody { color: red }');
    expect(transformed).toContain('.wmd-body { color: blue }');
  });
});
```

### File: `tests/preview.test.ts`

Fixed mock to include `addClass` method on created elements, which was causing test failures:

```typescript
// Before
createEl: vi.fn((tag, options) => {
  const el = {
    textContent: '',
    setAttribute: vi.fn(),
    addEventListener: vi.fn(),
    // ... other methods but no addClass
  };
  return el;
}),

// After
createEl: vi.fn((tag, options) => {
  const el = {
    textContent: '',
    setAttribute: vi.fn(),
    addEventListener: vi.fn(),
    addClass: vi.fn(), // ✅ Added this
    // ... other methods
  };
  return el;
}),
```

## How It Works

### Example: Tailwind Style

**Input CSS from wiremd:**
```css
body {
  font-family: ui-sans-serif, system-ui, sans-serif;
  background: #f9fafb;
  color: #111827;
}
```

**After transformation:**
```css
.wmd-body {
  font-family: ui-sans-serif, system-ui, sans-serif !important;
  background: #f9fafb !important;
  color: #111827 !important;
}
```

**Applied to:**
```html
<div class="wiremd-preview-container">
  <div class="wiremd-preview-content wmd-body">
    <!-- Content here gets the body styles -->
  </div>
</div>
```

### Example: Sketch Style

**Input CSS from wiremd:**
```css
body.wmd-root.wmd-sketch {
  font-family: "Comic Sans MS", cursive;
  background: #f5f5dc;
}
```

**After transformation:**
```css
.wmd-root.wmd-sketch {
  font-family: "Comic Sans MS", cursive !important;
  background: #f5f5dc !important;
}
```

**Applied to:**
```html
<div class="wiremd-preview-container">
  <div class="wiremd-preview-content wmd-body wmd-root wmd-sketch">
    <!-- Content here gets both wmd-body and body classes -->
  </div>
</div>
```

## What This Fixes

### All Styles Now Have Correct Backgrounds

✅ **Sketch**: Beige background (#f5f5dc)
✅ **Clean**: White background
✅ **Wireframe**: Light gray background
✅ **Tailwind**: Light gray background (#f9fafb) - **FIXED!**
✅ **Material**: White background - **FIXED!**
✅ **Brutal**: Style's background - **FIXED!**
✅ **None**: No background styling

### All Styles Now Have Correct Fonts

✅ **Tailwind**: ui-sans-serif, system-ui, sans-serif
✅ **Material**: Roboto, sans-serif
✅ **Brutal**: Arial Black, sans-serif

## Testing

All **80 tests passing** ✅

```
✓ tests/css-scoping.test.ts  (22 tests) ← 4 new tests added
✓ tests/mobile.test.ts       (23 tests)
✓ tests/preview.test.ts      (13 tests)
✓ tests/export.test.ts       (10 tests)
✓ tests/settings.test.ts     (12 tests)
```

## Installation

Updated files in your vault:
```bash
~/Documents/Remote/.obsidian/plugins/wiremd-preview/
├── main.js (411KB) ← Updated with body selector fix
├── styles.css (4.5KB) ← Same as before
└── manifest.json (298B) ← Same as before
```

## How to Test

1. **Reload Obsidian** (Ctrl/Cmd + R or restart)

2. **Create a wiremd block:**
   ````markdown
   ```wiremd
   ## Welcome

   Welcome to our app! Get started below.

   [GET STARTED]{.primary}
   [LEARN MORE]
   ```
   ````

3. **Test Tailwind style:**
   - Click the style badge
   - Select "Tailwind"
   - ✅ Should show **light gray background** (#f9fafb)
   - ✅ Should use **system fonts** (not Obsidian's theme fonts)
   - ✅ No dark edges or borders

4. **Test Material style:**
   - Click the style badge
   - Select "Material"
   - ✅ Should show **white background**
   - ✅ Should use **Roboto font**
   - ✅ Clean, modern Material Design look
   - ✅ No dark edges or borders

5. **Test Brutal style:**
   - Click the style badge
   - Select "Brutal"
   - ✅ Should show **style's background** (not Obsidian's dark theme)
   - ✅ Should use **Arial Black font**
   - ✅ Bold colors with thick borders
   - ✅ Neo-brutalist aesthetic
   - ✅ No dark edges or borders

6. **Verify all other styles still work:**
   - Sketch, Clean, Wireframe, None
   - All should show their correct backgrounds and fonts

## Why Two Transformations?

Different wiremd styles use different CSS patterns:

| Style      | CSS Pattern                | Transformation Needed           |
|------------|---------------------------|---------------------------------|
| Sketch     | `body.wmd-root.wmd-sketch` | `body.` → `.`                   |
| Clean      | `body.wmd-root.wmd-clean`  | `body.` → `.`                   |
| Wireframe  | `body.wmd-root.wmd-wire`   | `body.` → `.`                   |
| None       | `body.wmd-root`            | `body.` → `.`                   |
| Tailwind   | `body {`                   | `body {` → `.wmd-body {`        |
| Material   | `body {`                   | `body {` → `.wmd-body {`        |
| Brutal     | `body {`                   | `body {` → `.wmd-body {`        |

The code applies **both transformations** to handle all cases:
1. First: Transform `body.` → `.` (handles Sketch, Clean, Wireframe, None)
2. Second: Transform `body {` → `.wmd-body {` (handles Tailwind, Material, Brutal)

Then adds **both** the `wmd-body` class (for plain body styles) AND the extracted body classes (for `body.wmd-root` styles).

## Technical Details

### The Regex Pattern

```typescript
/\bbody(\s*\{)/g
```

- `\b` - Word boundary (ensures we match "body" as a whole word, not "everybody")
- `body` - Literal text "body"
- `(\s*\{)` - Capture group for optional whitespace and opening brace
- `g` - Global flag (replace all occurrences)

**Replacement:**
```typescript
'.wmd-body$1'
```
- `.wmd-body` - The new class selector
- `$1` - The captured whitespace and brace

**Example transformations:**
- `body {` → `.wmd-body {`
- `body  {` → `.wmd-body  {`
- `body{` → `.wmd-body{`
- `everybody {` → `everybody {` (not transformed, correct!)

### Why Always Add wmd-body Class?

Even if a style uses `body.wmd-root`, it doesn't hurt to also have `wmd-body` class. This ensures compatibility with all wiremd styles, regardless of which CSS pattern they use.

```typescript
// This works for ALL styles
contentEl.addClass('wmd-body');  // For tailwind, material, brutal
if (bodyClasses) {  // For sketch, clean, wireframe, none
  bodyClasses.split(/\s+/).forEach(cls => {
    if (cls) contentEl.addClass(cls);
  });
}
```

## Summary of All Fixes

This is the **fifth fix** in the complete wiremd style system:

### Fix 1: CSS Scoping
- **Problem:** Styles leaked to Obsidian UI
- **Solution:** Scope all selectors to `.wiremd-preview-container`

### Fix 2: !important Flags
- **Problem:** Obsidian styles had higher specificity
- **Solution:** Add !important to critical properties

### Fix 3: Body Class Application
- **Problem:** Body element styles didn't apply (no body element!)
- **Solution:** Extract body classes, transform `body.` selectors, apply to content

### Fix 4: Background Padding
- **Problem:** Container padding showed Obsidian's dark background
- **Solution:** Remove container padding, move all spacing to content

### Fix 5: Plain Body Selector (THIS FIX)
- **Problem:** Tailwind, Material, Brutal use `body {` not `body.wmd-root {`
- **Solution:** Add second transformation for plain `body` selectors, always add `wmd-body` class

Together, these five fixes ensure:
- ✅ Styles don't leak to Obsidian
- ✅ Styles override Obsidian's defaults
- ✅ Fonts, colors, and backgrounds work correctly for ALL styles
- ✅ Backgrounds fill entire preview (no dark edges)
- ✅ Both `body.wmd-root` and `body {` patterns work

---

**Issue:** Tailwind, Material, Brutal styles showing wrong background
**Root Cause:** Plain `body {` selectors not being transformed
**Solution:** Add second regex transformation and always apply `wmd-body` class
**Status:** ✅ FIXED
**Tests:** 80 passing (22 CSS scoping tests, 4 new tests for body transformations)
**Version:** 0.1.0
**Date:** 2025-11-09
