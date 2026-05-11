# Multi-Page Prototypes

Requires wiremd ≥ 0.1.7. Stock npm 0.1.5 silently drops hrefs inside `[[ ]]` nav and doesn't resolve `![[...]]` includes reliably.

## Folder layout

One `.md` per page at the top level. Files prefixed with `_` are treated as
partials (not pages) — convention, not enforced:

```
prototype/
├── _nav.md          # shared top nav
├── _sidebar.md      # (optional) shared sidebar
├── index.md         # landing
├── about.md
└── detail.md
```

## Shared nav via `![[...]]`

Drop the include at the top of every page — edit once, all pages update:

```markdown
![[_nav.md]]
```

The include path is resolved relative to the file doing the including. Includes
compose: `_sidebar.md` can itself include `_user-menu.md`.

## Cross-page navigation

Mix clickable links with static text inside a `[[ ]]` nav bar. Active page is
marked with `*text*`:

```markdown
[[ :logo: MyApp | *Home* | [About](./about.md) | [Contact](./contact.md) ]]
```

For calls-to-action, use button-style links:

```markdown
[[Get Started](./signup.md)]*        # primary CTA
[[View Details](./detail.md)]        # secondary
[[Back to Home](./index.md)]
```

## Rendering for handoff

When the user will open the files directly from disk (double-click
`index.html`), the `.md` hrefs need rewriting to `.html` after build — wiremd
preserves the original link targets:

```bash
# Render each page
for p in index about detail; do
  wiremd $p.md --style sketch -o $p.html
done

# Rewrite ./x.md → ./x.html in every generated file
for f in *.html; do
  sed -i -E 's|href="\./([A-Za-z0-9_-]+)\.md"|href="./\1.html"|g' "$f"
done
```

On macOS without GNU sed, substitute `sed -i ''` for `sed -i`.

For live iteration (user runs wiremd themselves), the dev server handles link
rewriting automatically:

```bash
wiremd index.md --style sketch --serve 3001 --watch --watch-pattern "*.md"
```

See `rendering-modes.md` for when to use each.

## Worked example

A minimal list → detail → back flow lives at
`examples/multi-page/`:

- `_nav.md` — `[[ :logo: MyApp | [Home](./index.md) | [Detail](./detail.md) ]]`
- `index.md` — landing, card grid, activity table, CTA link to detail
- `detail.md` — breadcrumb, form, back link

Render the whole folder:

```bash
cd examples/multi-page
for p in index detail; do wiremd $p.md --style sketch -o $p.html; done
for f in *.html; do sed -i -E 's|href="\./([A-Za-z0-9_-]+)\.md"|href="./\1.html"|g' "$f"; done
open index.html   # or: double-click
```
