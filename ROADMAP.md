# wiremd Roadmap: Ruthless MVP

> **Goal:** A rock-solid CLI that takes markdown and renders HTML wireframes with sketch style.
> **Philosophy:** Fix the foundation before adding features. Delete before you add.

---

## The Problem

The current wiremd promises much, delivers little:
- **Nesting is broken** - containers don't nest, children escape parents
- **Badges don't exist** - backticks become plain text
- **Alerts half-work** - classes render but no CSS styles
- **Newline sensitive** - brittle parsing breaks on whitespace
- **7 styles, 4 formats** - sprawl before the core works
- **Docs lie** - syntax spec promises features that don't parse

**Upstream issue:** https://github.com/akonan/wiremd/issues (nesting support)

---

## Phase 1: Foundation (The Ruthless MVP)

### 1.1 Syntax Redesign

New syntax principles (LLM + Human optimized):
- **Two-level nesting:** page → section → components
- **Explicit containers:** `section:` `card:` `form:` `nav:` with indentation
- **Distinct delimiters:** each symbol means ONE thing
- **Custom elements:** `@name:` prefix for user-defined components
- **Custom styles:** `{style: value}` in attributes

#### Core Syntax v0.2

```markdown
# Page Title

nav: Brand | Home | About | [Sign In]

card:
  ## Section Heading

  form:
    label: Email
    <email______> {required}

    label: Password
    <********>

    [x] Remember me
    ( )�Option A  (•) Option B

    [Submit]* [Cancel]

  alert: Success message {.success}
  badge: Status `active`

table:
  | Name | Email | Role |
  |------|-------|------|
  | John | j@x.co | Admin |

@custom-widget:
  Your custom content here
  {style: "border: 2px dashed blue"}
```

#### Delimiter Rules (Unambiguous)

| Syntax | Meaning | Example |
|--------|---------|---------|
| `# ## ###` | Headings | `## Login Form` |
| `[Text]` | Button | `[Submit]` `[Cancel]` |
| `[Text]*` | Primary button | `[Submit]*` |
| `<____>` | Text input | `<username______>` |
| `<****>` | Password input | `<************>` |
| `<...>` | Textarea | `<message...>{rows:5}` |
| `{___v}` | Dropdown | `{Choose___v}` + list |
| `[x] [ ]` | Checkbox | `[x] Agree to terms` |
| `(•) ( )` | Radio | `(•) Yes  ( ) No` |
| `:icon:` | Icon | `:user: :home: :gear:` |
| `:::` / `name:` | Container | `card:` `:::card` |
| `!!!` | Alert | `!!! Warning message` |
| `` `text` `` | Badge | `Status \`active\`` |
| `@name:` | Custom element | `@pricing-card:` |
| `{attrs}` | Attributes | `{.class key:value}` |

#### Nesting Model

```
Document (implicit)
└── Section (card: / form: / nav: / :::name)
    └── Components (inputs, buttons, text, etc.)
```

Two levels only. No deeper nesting. Covers 95% of wireframe needs.

---

### 1.2 Cleanup Tasks

- [ ] **Delete React renderer** (`src/renderer/react-renderer.ts`)
- [ ] **Delete Tailwind renderer** (`src/renderer/tailwind-renderer.ts`)
- [ ] **Delete 6 styles** - keep only `sketch` in `styles.ts`
- [ ] **Delete VS Code extension docs** - separate repo
- [ ] **Delete Figma plugin docs** - separate repo
- [ ] **Delete dev server** (`src/cli/server.ts`) - or keep minimal?
- [ ] **Trim tests** to match reduced feature set
- [ ] **Update package.json** - remove unused exports

---

### 1.3 Parser Fixes

- [ ] **Fix container nesting** - rewrite `remark-containers.ts` with recursion
- [ ] **Fix newline sensitivity** - normalize whitespace before parsing
- [ ] **Implement badge parsing** - backticks → badge node
- [ ] **Implement alert parsing** - `!!!` or `alert:` → alert node with styles
- [ ] **Add custom element support** - `@name:` → custom node type
- [ ] **Fix attribute parsing** - `{.class key:value}` actually works

---

### 1.4 Renderer Fixes

- [ ] **Add alert CSS** - `.wmd-alert`, `.wmd-success`, `.wmd-warning`, `.wmd-error`
- [ ] **Add badge CSS** - `.wmd-badge` inline pill styling
- [ ] **Add custom element rendering** - pass-through with wrapper
- [ ] **Add custom style support** - inline `style=""` from attributes

---

### 1.5 Documentation Rewrite

- [ ] **Delete outdated SYNTAX-SPEC-v0.1.md**
- [ ] **Create SYNTAX.md** - single source of truth, matches parser
- [ ] **Rewrite README.md** - ruthless, no false promises
- [ ] **Delete scattered docs** - one doc per concern max
- [ ] **Add EXAMPLES.md** - working examples for each component

---

### 1.6 CLI Polish

- [ ] **Better error messages** - show line number, expected syntax
- [ ] **Validate before render** - fail fast with clear errors
- [ ] **Single style flag** - `--style sketch` (only option for now)
- [ ] **Watch mode** - keep if useful for iteration

---

## Phase 1 Checklist Summary

```
[ ] Syntax v0.2 spec written and approved
[ ] Container nesting works (2 levels)
[ ] All basic components parse correctly:
    [ ] Buttons [Text] [Text]*
    [ ] Inputs <____> <****>
    [ ] Textarea <...>{rows:N}
    [ ] Dropdown {___v} + options
    [ ] Checkbox [x] [ ]
    [ ] Radio (•) ( )
    [ ] Icons :name:
    [ ] Headings # ## ###
    [ ] Paragraphs
    [ ] Lists - and 1.
    [ ] Tables |---|
    [ ] Alerts !!!
    [ ] Badges `text`
    [ ] Containers card: form: nav: section:
[ ] Custom elements @name: work
[ ] Custom styles {style: "..."} work
[ ] Attributes {.class key:value} work
[ ] Sketch style renders all components correctly
[ ] CLI produces valid HTML
[ ] Error messages show line numbers
[ ] README matches reality
[ ] SYNTAX.md is single source of truth
[ ] No dead code in src/
[ ] Tests pass and cover real cases
```

---

## Phase 2: Expansion (After Foundation)

Only after Phase 1 is complete:

- [ ] Add second style (clean/wireframe)
- [ ] Add JSON output for tooling
- [ ] Add more icons
- [ ] Consider React output
- [ ] Consider dev server with live reload
- [ ] Consider VS Code extension
- [ ] Community feedback integration

---

## Phase 3: Ecosystem

- [ ] npm package stable release (1.0.0)
- [ ] Figma plugin (separate repo)
- [ ] Obsidian plugin (separate repo)
- [ ] VS Code extension (separate repo)
- [ ] Documentation site

---

## Design Decisions Log

| Decision | Rationale |
|----------|-----------|
| Two-level nesting only | Covers 95% cases, simpler parser |
| `<input>` not `[___]` | Unambiguous, no confusion with buttons |
| Indentation for nesting | YAML-style, LLM-native |
| Custom elements `@name:` | Extensible without parser changes |
| One style (sketch) | Focus on one thing working perfectly |
| Delete React/Tailwind | Premature optimization, adds complexity |

---

## Expert Panel Guidance

**Rich Hickey:** "Make it data, not clever ASCII art. Each line declares what it IS."

**Linus Torvalds:** "Nesting should have been the FIRST thing you got right. Rip out the clever detection."

**Martin Fowler:** "Explicit over clever. One syntax per concept. Error recovery matters."

**Shreyas Doshi:** "Pick ONE wedge product. Ship it. Expand later."

---

## Success Criteria

Phase 1 is DONE when:

1. `wiremd input.md` produces correct HTML 100% of the time
2. Syntax is documented and matches implementation exactly
3. Sketch style renders all components correctly
4. Error messages are helpful (line numbers, expected syntax)
5. Zero broken promises in README
6. A new user can learn the syntax in 10 minutes

---

*Last updated: 2026-01-02*
*Status: Phase 1 - Foundation*
