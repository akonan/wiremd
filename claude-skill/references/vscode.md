# VS Code Extension — Setup & Workflow

The wiremd VS Code extension gives a live side-by-side preview of any `.md` wireframe as you type.
This is the recommended authoring environment for PMs — no terminal required.

---

## Install the extension

The extension must be built from source (it's not on the VS Code Marketplace).

```bash
# From the workspace root — only needed once or after source changes
cd external-packages/wiremd/vscode-extension
npm install
npm run bundle
npx @vscode/vsce package

# Install into VS Code
code --install-extension wiremd-preview-0.1.0.vsix
```

After installing: `Cmd+Shift+P` → **Developer: Reload Window**

---

## Daily authoring workflow

1. Open any `.md` file in `packages/wireframes/current/` or `packages/wireframes/future/`
2. `Cmd+Shift+P` → **wiremd: Open Preview** (or click the preview icon in the editor toolbar)
3. A side panel opens with a live rendered preview — it updates as you type

The extension uses the `wiremd` package bundled at build time, so the preview matches what the CLI renders.

---

## Change the preview style

The extension respects the `wiremd.defaultStyle` VS Code setting:

```json
// .vscode/settings.json
{
  "wiremd.defaultStyle": "clean"
}
```

Available styles: `sketch` (default), `clean`, `wireframe`, `material`, `tailwind`, `brutal`, `none`

You can also switch styles from the preview panel toolbar.

---

## Include shared components (:::display)

The VS Code preview supports a special include directive that splices in another `.md` file before parsing:

```markdown
:::display ./shared-nav.md:::
```

Place the include on its own line. The path is relative to the current file. The preview resolves it inline — you'll see the included content rendered as if it were written directly in the file.

**Note:** `:::display` is a VS Code-only feature. The CLI does not resolve it. Don't use it in wireframes you plan to render with `render-all.sh`.

### Example — shared nav component

`packages/wireframes/shared/nav.md`:
```markdown
[[ :logo: JAM | Home | Coaching | Library | :user: Profile | :gear: Settings ]]
```

`packages/wireframes/current/dashboard.md`:
```markdown
:::display ../shared/nav.md:::

[[ Home > Dashboard ]]

---

## Dashboard
...
```

---

## Rebuilding after source changes

If you change anything in `external-packages/wiremd/src/`:

```bash
# 1. Rebuild the wiremd library
cd external-packages/wiremd
npx vite build

# 2. Rebundle the extension (picks up new dist/)
cd vscode-extension
npm run bundle

# 3. Repackage (MUST do this — installing old .vsix installs old code)
npx @vscode/vsce package

# 4. Reinstall
code --install-extension wiremd-preview-0.1.0.vsix

# 5. In VS Code: Cmd+Shift+P → Developer: Reload Window
```

**Key gotcha:** Steps 1–3 must all run in sequence. The `.vsix` is a zip snapshot — skipping `vsce package` installs stale code even if you rebuilt the library.
