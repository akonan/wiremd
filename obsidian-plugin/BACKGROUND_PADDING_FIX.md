# Background Padding Fix - Backgrounds Now Show Correctly

## Problem

After fixing fonts and body classes, some styles (Material and Brutal) were still showing Obsidian's dark background instead of the wiremd style's background.

Looking at the screenshots:
- **Material style**: Should have white/light background, but showed dark Obsidian theme
- **Brutal style**: Should have colored background, but showed dark Obsidian theme

## Root Cause

The issue was with the container's padding:

```css
.wiremd-preview-container {
  padding: 0.5em; /* ❌ This padding area showed Obsidian's background */
  /* No background set, so it inherits Obsidian's theme */
}

.wiremd-preview-content {
  margin-top: 2em;
  padding: 1em;
  /* Background applied here, but doesn't fill the container */
}
```

**Visual representation:**

```
┌─────────────────────────────────────┐
│ .wiremd-preview-container           │ ← Obsidian's dark background
│  padding: 0.5em ──┐                 │    shows in this padding area
│                   │                 │
│ ┌─────────────────▼───────────────┐ │
│ │ .wiremd-preview-content         │ │
│ │ background: white (from style)  │ │ ← Style's background only
│ │                                 │ │    covers this inner area
│ │ [Wiremd content here]           │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

The dark edges were the container's padding showing Obsidian's background!

## Solution

Move all padding to the content element and remove it from the container:

```css
.wiremd-preview-container {
  padding: 0; /* ✅ No padding = no Obsidian background showing */
  overflow: hidden; /* Fill rounded corners */
}

.wiremd-preview-content {
  margin-top: 0;
  padding: 1em;
  padding-top: 2.5em; /* Space for badge */
  /* Background now fills entire container */
}
```

**Visual representation after fix:**

```
┌─────────────────────────────────────┐
│ .wiremd-preview-content             │
│ background: white (from style)      │ ← Style's background fills
│ padding: 1em ────────────┐          │    the ENTIRE container!
│                          │          │
│ [Wiremd content here]    │          │
│                          │          │
└──────────────────────────┴──────────┘
```

## What Changed

### File: `src/styles.css` (and `styles.css`)

#### Container
```css
/* Before */
.wiremd-preview-container {
  padding: 0.5em; /* ❌ */
  overflow-x: auto;
}

/* After */
.wiremd-preview-container {
  padding: 0; /* ✅ */
  overflow: hidden; /* ✅ Clips content to rounded border */
}
```

#### Content
```css
/* Before */
.wiremd-preview-content {
  margin-top: 2em;
  padding: 1em;
}

/* After */
.wiremd-preview-content {
  margin-top: 0; /* ✅ No gap at top */
  padding: 1em;
  padding-top: 2.5em; /* ✅ Space for badge */
  min-height: 100px;
}
```

#### Badge Positioning
```css
/* Before */
.wiremd-style-badge {
  top: 8px;
  right: 8px;
}

/* After */
.wiremd-style-badge {
  top: 0.5em; /* ✅ Adjusted for new layout */
  right: 0.5em;
}
```

#### Style Selector
```css
/* Before */
.wiremd-style-selector {
  top: 36px;
  right: 8px;
}

/* After */
.wiremd-style-selector {
  top: 2.5em; /* ✅ Adjusted for new layout */
  right: 0.5em;
}
```

## What This Fixes

### All Styles Now Show Correct Backgrounds

✅ **Sketch**: Beige background (#f5f5dc)
✅ **Clean**: White background
✅ **Wireframe**: Light gray background
✅ **Tailwind**: White background
✅ **Material**: White background (was showing dark before!)
✅ **Brutal**: Correct style background (was showing dark before!)
✅ **None**: No background styling

### Additional Benefits

- ✅ No dark edges around previews
- ✅ Background fills entire container including corners
- ✅ Cleaner visual appearance
- ✅ Badge and selector still positioned correctly

## Testing

All **76 tests still passing** ✅

```
✓ tests/css-scoping.test.ts  (18 tests)
✓ tests/mobile.test.ts       (23 tests)
✓ tests/preview.test.ts      (13 tests)
✓ tests/export.test.ts       (10 tests)
✓ tests/settings.test.ts     (12 tests)
```

## Installation

Updated files in your vault:
```bash
~/Documents/Remote/.obsidian/plugins/wiremd-preview/
├── main.js (411KB) ← Same, no logic changes
└── styles.css (4.5KB) ← Updated!
```

## How to Test

1. **Reload Obsidian** (Ctrl/Cmd + R or restart)

2. **Create a wiremd block:**
   ````markdown
   ```wiremd
   ## Login Form

   Email
   [____________________________]

   Password
   [****************************]

   [LOGIN]{.primary}
   ```
   ````

3. **Click the style badge** and test these styles specifically:

   **Material style:**
   - ✅ Should show **white background** (not dark)
   - ✅ Clean, professional look
   - ✅ No dark edges

   **Brutal style:**
   - ✅ Should show **style's background** (not dark Obsidian theme)
   - ✅ Bold colors with thick borders
   - ✅ Neo-brutalist aesthetic
   - ✅ No dark edges

4. **Verify all styles:**
   - ✅ No dark borders/edges around any preview
   - ✅ Background fills entire preview area
   - ✅ Each style has its correct background color

## Before vs After

### Before (Material & Brutal)
```
┌─[Dark]──────────────────────────┐
│ ┌─[White/Style]────────────┐   │ ← Dark edges visible
│ │                          │   │
│ │  Login Form              │   │
│ │  [Button]                │   │
│ │                          │   │
│ └──────────────────────────┘   │
└────────────────────────────────┘
```

### After (All Styles)
```
┌─[White/Style Background]──────┐
│                                │ ← No dark edges!
│  Login Form                    │
│  [Button]                      │
│                                │
└────────────────────────────────┘
```

## Technical Details

### Why `overflow: hidden`?

```css
.wiremd-preview-container {
  border-radius: 6px;
  overflow: hidden; /* Important! */
}
```

Without `overflow: hidden`, the content's background wouldn't respect the container's rounded corners. With it, the background clips perfectly to the rounded border.

### Why `padding-top: 2.5em`?

```css
.wiremd-preview-content {
  padding-top: 2.5em; /* Space for badge */
}
```

The badge is absolutely positioned at `top: 0.5em`. We need extra padding at the top of the content so it doesn't overlap with the badge.

### Why `min-height: 100px`?

```css
.wiremd-preview-content {
  min-height: 100px;
}
```

Ensures small previews still have a reasonable height and the background is visible even with minimal content.

## Summary of All Fixes

This is the **fourth fix** in the complete wiremd style system:

### Fix 1: CSS Scoping
- **Problem:** Styles leaked to Obsidian UI
- **Solution:** Scope all selectors to `.wiremd-preview-container`
- **File:** `CSS_SCOPING_FIX.md`

### Fix 2: !important Flags
- **Problem:** Obsidian styles had higher specificity
- **Solution:** Add !important to critical properties
- **File:** `STYLE_OVERRIDE_FIX.md`

### Fix 3: Body Class Application
- **Problem:** Body element styles didn't apply (no body element!)
- **Solution:** Extract body classes, transform selectors, apply to content
- **File:** `BODY_CLASS_FIX.md`

### Fix 4: Background Padding (THIS FIX)
- **Problem:** Container padding showed Obsidian's dark background
- **Solution:** Remove container padding, move all spacing to content
- **File:** `BACKGROUND_PADDING_FIX.md` ← YOU ARE HERE

Together, these four fixes ensure:
- ✅ Styles don't leak to Obsidian
- ✅ Styles override Obsidian's defaults
- ✅ Fonts, colors, and backgrounds work correctly
- ✅ Backgrounds fill entire preview (no dark edges)

---

**Issue:** Material and Brutal styles showing dark background
**Root Cause:** Container padding showing Obsidian's background
**Solution:** Move all padding to content element
**Status:** ✅ FIXED
**Tests:** 76 passing
**Version:** 0.1.0
**Date:** 2025-11-09
