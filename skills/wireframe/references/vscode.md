# VS Code Extension — Setup & Workflow

The wiremd VS Code extension gives a live side-by-side preview of any `.md` wireframe as you type.
This is the recommended authoring environment — no terminal required.

---

## Install the extension

Install from the VS Code Marketplace: search **wiremd preview** in the Extensions panel, or open the
[marketplace page](https://marketplace.visualstudio.com/items?itemName=eclectic-ai.wiremd-preview) directly.

---

## Open the preview

With any `.md` file open:

- Status bar → **Wiremd**
- `Cmd+K V` (Mac) / `Ctrl+K V` (Windows/Linux)
- Command Palette → **wiremd: Open Preview to the Side**

The preview updates live as you type.

---

## Change the preview style

Click the style dropdown in the preview toolbar, or set a workspace default:

```json
// .vscode/settings.json
{
  "wiremd.defaultStyle": "clean"
}
```

Available styles: `sketch` (default), `clean`, `wireframe`, `material`, `tailwind`, `brutal`, `none`

---

## Component reference

The **?** button in the preview toolbar opens the component docs rendered inside VS Code — a quick reference for all wiremd syntax and components.

