# Using wiremd with Claude

Claude understands wiremd syntax natively. You can describe a screen in plain English and Claude will generate the wiremd Markdown for it — then render it in VS Code or the CLI.

There are two modes depending on which Claude tool you're using.

---

## Claude Code (CLI)

Claude Code uses a **skill** to generate and render wireframes automatically. Once the skill is installed, you just ask — Claude handles writing the `.md` file, running the renderer, and telling you where to open the preview.

### Install the skill

**Via the VS Code extension (recommended):**
Install the [VS Code extension](./vscode.md), then accept the prompt on first launch: "Want Claude Code to generate wireframes for you? Install the Claude skill." The skill is copied into `.claude/skills/wireframe/` in your workspace.

**Manually:**
Copy `skills/wireframe/` from the wiremd repo into `.claude/skills/wireframe/` in your project root. Claude Code picks it up automatically.

### What you can ask

The skill triggers automatically on wireframing requests — you don't need to invoke it by name:

- "Wireframe a login screen with email, password, and a forgot password link"
- "Sketch the settings page for this app"
- "Draw what the dashboard would look like — nav, a metrics row, a table below"
- "Mockup a confirmation modal for deleting an account"
- "Document this component as a wireframe" *(with a React/JSX file open)*

Claude will generate a `.md` file, render it with `wiremd <file>.md --style clean --serve 3001 --watch`, and give you the URL (`http://localhost:3001`) to open in your browser. The VS Code preview also updates live if you have it open.

### Iterating

Just keep talking:

- "Add a sidebar with navigation links on the left"
- "Replace the table with a card grid"
- "Show the empty state — no items yet, with an Add button"
- "What does the mobile layout look like?"

Claude edits the `.md` file and re-renders. No manual steps needed.

---

## Claude in a product or chat context

If you're using Claude conversationally — in claude.ai, in a product with Claude embedded, or in any chat interface — Claude can generate wiremd syntax from a description even without a skill installed.

Ask Claude to write wiremd Markdown for the screen you want, then:

1. Copy the Markdown Claude generates into a `.md` file
2. Open it in VS Code to preview with the extension, or run `wiremd file.md --serve 3001` in the terminal

**Example prompt:**
> "Write wiremd Markdown for a product registration form — company name, contact email, plan selection (Free/Pro/Enterprise radio buttons), and a Submit button. Use wiremd syntax."

Claude will return a complete `.md` file ready to paste and render.

### Iterating

Paste the current `.md` content back into the chat and ask for changes:

> "Here's the current wireframe. Add a step indicator at the top showing 3 steps, and move the submit button to the right."

---

## Tips

- **Be specific about layout.** "Two-column grid, nav on the left, content on the right" works better than "a typical dashboard layout."
- **Name the states you need.** "Show the loading state for the Submit button" or "Add an error message under the email field."
- **You don't need to know wiremd syntax.** Describe what you want visually — Claude translates it.
