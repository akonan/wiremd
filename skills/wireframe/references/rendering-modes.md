# Rendering Modes

Triage by the tools Claude actually has in the current session — not by product
name. The same skill runs in Claude Code, Claude CLI inside VS Code, Claude
Desktop with filesystem + exec tools (e.g. Cowork), and chat-only Desktop, and
each supports a different subset of these routes.

## Decision table

| Claude can… | Render route | Command / action |
|---|---|---|
| Write files **and** run shell | **Files in folder** *(default)* — render `.html` into the user's folder; they open via `file://` or double-click | `wiremd x.md -o x.html --style sketch` (+ `.md`→`.html` sed rewrite if multi-page; see `multi-page.md`) |
| Write + shell, **and user runs Claude locally** on their own machine | **Dev server** — live reload while iterating. Only works when the user can reach `localhost` on the Claude host. | `wiremd x.md --style sketch --serve 3001 --watch --watch-pattern "*.md"` |
| Shell but no shared folder with user | **Screenshot for self-verification** — can't deliver to user this way, but useful to confirm Claude's own output renders correctly | `npx playwright screenshot --browser chromium --full-page "file://$(pwd)/out.html" /tmp/wf.png` (then read the PNG) |
| Chat only (no filesystem, no exec) | **Hand off to the web editor** — Claude writes the `.md`; user pastes it into the hosted editor for rendering | Share `https://tobiashoelzer.com/wiremd/editor` + the `.md` content |

## Files-in-folder (the default)

Works anywhere Claude can both write files and invoke `wiremd`: Claude Code,
VS Code+terminal, Cowork with filesystem + code-execution tools. Claude renders
`.html` alongside the `.md` sources; the user opens them in their browser
(`open index.html`, double-click, or `file://` URL).

This is the safest default because it doesn't rely on the user being on the
same machine as Claude.

## Sandbox caveat for `--serve`

`wiremd --serve PORT` binds to `localhost:PORT` *on the machine Claude is
running on*. In Claude Code running on the user's own laptop, that's their
localhost — fine. In Cowork/Desktop when the Claude process is remote or
sandboxed, the URL is **unreachable from the user's browser**. Symptoms:
"connection refused", "site can't be reached", or a blank page.

Rules:

- Default to **Files-in-folder**.
- Only use `--serve` when the user is running the same Claude process locally
  and can reach its localhost.
- Never hand the user a `localhost:PORT` URL without first confirming they can
  actually reach it.

## Screenshot verification (any mode)

Useful for Claude to check its own output before replying:

```bash
npx playwright screenshot --browser chromium --full-page \
  "file://$(pwd)/out.html" /tmp/wf-check.png
```

Then read the PNG with the Read tool. Handy when iterating on a design the
user can't see directly (chat-only mode).
