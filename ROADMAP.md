# wiremd Roadmap: Ruthless MVP

> **Goal:** A rock-solid CLI that takes markdown and renders HTML wireframes.
> **Philosophy:** Adopt proven syntax (PlantUML Salt), keep markdown structure, fix the foundation.

---

## The Pivot: Hybrid Syntax

Instead of inventing new syntax, we adopt **PlantUML Salt conventions** for components while keeping **Markdown for structure**. This gives us:

1. **LLM-friendly** - Salt syntax is in training data
2. **Human-readable** - Markdown structure is universal
3. **Proven patterns** - Salt has been used since ~2009
4. **HTML output** - Our unique value (Salt outputs images)

---

## Syntax Specification v0.2 (Hybrid)

### Complete Example

```markdown
# Login Page

nav: Brand | Home | About | [Sign In]

card:
  ## Welcome Back

  Email    | "email@example.com    "
  Password | "****************     "

  [x] Remember me
  ( )�Light mode  (x) Dark mode

  ^Select role^
  - Admin
  - Editor
  - Viewer

  [Cancel] | [Submit]*

  !!! Invalid credentials {.error .hidden}

card:
  ## Quick Stats

  Users: `1,234`  Active: `892`  New: `47`

  table:
    | Name  | Role   | Status   |
    |-------|--------|----------|
    | Alice | Admin  | `active` |
    | Bob   | Editor | `away`   |
```

### Component Syntax Reference

#### Text & Structure (Markdown)

| Component | Syntax | Notes |
|-----------|--------|-------|
| Heading 1 | `# Title` | Page title |
| Heading 2 | `## Section` | Section title |
| Heading 3 | `### Subsection` | Subsection |
| Paragraph | Plain text | Regular text content |
| List | `- item` | Unordered list |
| Ordered List | `1. item` | Numbered list |
| Link | `[text](url)` | Standard markdown link |
| Image | `![alt](src)` | Image placeholder |
| Separator | `---` | Horizontal rule |

#### Buttons (Salt Style)

| Component | Syntax | Example |
|-----------|--------|---------|
| Button | `[Text]` | `[Cancel]` |
| Primary Button | `[Text]*` | `[Submit]*` |
| Disabled Button | `[Text] {disabled}` | `[Save] {disabled}` |
| Icon Button | `[:icon: Text]` | `[:search: Find]` |

#### Form Inputs (Salt Style)

| Component | Syntax | Example |
|-----------|--------|---------|
| Text Input | `"placeholder    "` | `"Enter name      "` |
| Email Input | `"email         " {type:email}` | With validation |
| Password | `"****          "` | Asterisks = password |
| Textarea | `"""multi-line..."""` | Triple quotes |
| With Label | `Label \| "input"` | Pipe separates |

#### Selection (Salt Style)

| Component | Syntax | Example |
|-----------|--------|---------|
| Dropdown | `^placeholder^` | `^Select country^` |
| Dropdown Options | `- option` after `^` | Listed below dropdown |
| Checkbox Unchecked | `[ ] label` | `[ ] Subscribe` |
| Checkbox Checked | `[x] label` | `[x] Agree to terms` |
| Radio Unchecked | `( ) label` | `( ) Option A` |
| Radio Selected | `(x) label` | `(x) Option B` |

#### Containers (wiremd Style)

| Component | Syntax | Example |
|-----------|--------|---------|
| Card | `card:` + indent | Content block |
| Form | `form:` + indent | Form grouping |
| Nav | `nav:` + indent or inline | Navigation bar |
| Section | `section:` + indent | Generic section |
| Modal | `modal:` + indent | Dialog/popup |
| Sidebar | `sidebar:` + indent | Side panel |
| Footer | `footer:` + indent | Page footer |
| Custom | `@name:` + indent | User-defined |

#### Feedback & Status

| Component | Syntax | Example |
|-----------|--------|---------|
| Alert | `!!! message` | `!!! Error occurred` |
| Alert Success | `!!! message {.success}` | Green alert |
| Alert Warning | `!!! message {.warning}` | Yellow alert |
| Alert Error | `!!! message {.error}` | Red alert |
| Badge | `` `text` `` | `` Status: `active` `` |
| Icon | `:name:` | `:user: :home: :gear:` |

#### Layout

| Component | Syntax | Example |
|-----------|--------|---------|
| Column Layout | `\|` separator | `Left \| Right` |
| Grid | `{.grid-3}` on heading | `## Features {.grid-3}` |
| Inline Nav | `nav: A \| B \| C` | Horizontal items |

#### Tables (Markdown)

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | `badge`  |
| Cell 4   | Cell 5   | Cell 6   |
```

#### Attributes

| Syntax | Meaning | Example |
|--------|---------|---------|
| `{.class}` | CSS class | `{.primary}` |
| `{.a .b}` | Multiple classes | `{.large .rounded}` |
| `{key:value}` | Property | `{type:email}` |
| `{disabled}` | Boolean | Disabled state |
| `{required}` | Boolean | Required field |
| `{style:"..."}` | Inline CSS | Custom styling |

### Nesting Rules

**Maximum 2 levels:**
```
Document (implicit)
└── Container (card: / form: / nav: / etc.)
    └── Components (buttons, inputs, text, etc.)
```

**Valid:**
```markdown
card:
  ## Title
  "input field    "
  [Submit]*
```

**Invalid (3+ levels):**
```markdown
card:
  section:           ← Level 2
    form:            ← Level 3 - NOT ALLOWED
      "input"
```

---

## Phase 1: Foundation

### Week 1: Syntax Lock & Parser Prep

- [ ] **Finalize SYNTAX.md** - This document, cleaned up
- [ ] **Create test corpus** - 20 example files covering all components
- [ ] **Audit parser gaps** - List exactly what's broken vs working
- [ ] **Design AST schema** - Node types for new syntax

**Owner:** Architecture
**Deliverable:** Locked syntax spec, test files, gap analysis

### Week 2: Input Syntax Migration

- [ ] **Add `"input"` parsing** - Salt-style quoted inputs
- [ ] **Add `"****"` password detection** - Asterisks in quotes
- [ ] **Add `"""textarea"""` parsing** - Triple quotes
- [ ] **Add `^dropdown^` parsing** - Caret-wrapped selects
- [ ] **Deprecate `[___]` syntax** - Keep working but warn
- [ ] **Update tests** - All input types covered

**Owner:** Parser
**Deliverable:** All Salt-style inputs work

### Week 3: Container & Nesting Fix

- [ ] **Rewrite container parser** - Recursive descent, not regex
- [ ] **Implement indentation tracking** - For `card:` style containers
- [ ] **Test 2-level nesting** - card → components works
- [ ] **Block 3+ level nesting** - Clear error message
- [ ] **Keep `:::` syntax working** - Backwards compat
- [ ] **Add container type validation** - Known types only

**Owner:** Parser
**Deliverable:** Nesting works correctly

### Week 4: Missing Components

- [ ] **Implement alert `!!!` syntax** - Parser + renderer
- [ ] **Add alert CSS** - success/warning/error/info styles
- [ ] **Implement badge rendering** - Backticks → styled badge
- [ ] **Add badge CSS** - Inline pill styling
- [ ] **Fix radio button parsing** - `(x)` and `( )` work
- [ ] **Add layout `|` separator** - For label | input patterns

**Owner:** Parser + Renderer
**Deliverable:** All components in spec work

### Week 5: Renderer Cleanup

- [ ] **Delete react-renderer.ts** - 574 lines removed
- [ ] **Delete tailwind-renderer.ts** - 544 lines removed
- [ ] **Delete 6 styles from styles.ts** - Keep only sketch
- [ ] **Clean up HTML renderer** - Remove dead code paths
- [ ] **Verify sketch style** - All components styled correctly
- [ ] **Add custom style support** - `{style:"..."}` works

**Owner:** Renderer
**Deliverable:** Clean, single-style renderer

### Week 6: CLI & Dev Server

- [ ] **Keep dev server** - `--serve` flag works
- [ ] **Add watch mode** - `--watch` recompiles on change
- [ ] **Improve error messages** - Line numbers, expected syntax
- [ ] **Add `--validate` flag** - Check syntax without rendering
- [ ] **Remove unused CLI options** - No `--format react` etc.
- [ ] **Test full workflow** - `wiremd file.md --serve` works perfectly

**Owner:** CLI
**Deliverable:** Polished CLI experience

### Week 7: Documentation & Polish

- [ ] **Delete SYNTAX-SPEC-v0.1.md** - Outdated
- [ ] **Create SYNTAX.md** - From this roadmap's spec
- [ ] **Rewrite README.md** - Ruthless, matches reality
- [ ] **Delete obsolete docs** - Figma, Obsidian, VS Code refs
- [ ] **Add EXAMPLES.md** - Working examples for each component
- [ ] **Update CHANGELOG.md** - Document breaking changes
- [ ] **Final test pass** - All tests green

**Owner:** Documentation
**Deliverable:** Honest, accurate docs

---

## Phase 1 Completion Checklist

```
SYNTAX
[ ] "input" quoted input works
[ ] "****" password works
[ ] """textarea""" works
[ ] ^dropdown^ works with options
[ ] [x] [ ] checkboxes work
[ ] (x) ( ) radio buttons work
[ ] [Button] [Button]* buttons work
[ ] !!! alerts work with classes
[ ] `badge` backticks work
[ ] :icon: icons work
[ ] | layout separator works
[ ] {.class key:value} attributes work
[ ] {style:"..."} custom styles work

CONTAINERS
[ ] card: works with indentation
[ ] form: works with indentation
[ ] nav: works inline and block
[ ] section: works
[ ] 2-level nesting works
[ ] 3+ level nesting blocked with error
[ ] :::container still works (compat)

RENDERER
[ ] Sketch style only
[ ] All components have CSS
[ ] Alerts styled (success/warning/error/info)
[ ] Badges styled (inline pills)
[ ] Custom {style:""} renders inline

CLI
[ ] wiremd file.md works
[ ] wiremd file.md -o out.html works
[ ] wiremd file.md --serve works
[ ] wiremd file.md --watch works
[ ] Error messages show line numbers
[ ] --validate flag exists

DOCS
[ ] README.md matches reality
[ ] SYNTAX.md is complete
[ ] EXAMPLES.md has all components
[ ] No false promises
[ ] No references to removed features

CODE
[ ] react-renderer.ts deleted
[ ] tailwind-renderer.ts deleted
[ ] 6 styles deleted from styles.ts
[ ] No dead code in src/
[ ] All tests pass
```

---

## Phase 2: Expansion (After Phase 1)

- [ ] Add second style (clean or wireframe)
- [ ] Add JSON AST output (`--format json`)
- [ ] Expand icon library
- [ ] Consider React output
- [ ] Consider Figma export
- [ ] Community feedback integration

---

## Phase 3: Ecosystem

- [ ] npm package 1.0.0 stable release
- [ ] VS Code extension (separate repo)
- [ ] Figma plugin (separate repo)
- [ ] Documentation website
- [ ] LLM prompt templates for generation

---

## Expert Panel Guidance

**Rich Hickey:**
> "You're composing, not inventing. Salt solves components. Markdown solves structure. Take both."

**Martin Fowler:**
> "Strangler Fig Pattern. Add new handlers alongside old. Deprecate gradually. Never big-bang rewrite."

**Linus Torvalds:**
> "Your container parser is garbage. Use recursion. Make it boring. Boring code ships."

**Shreyas Doshi:**
> "One command that works perfectly: `wiremd mockup.md --serve`. That's your MVP. Ship the wedge."

---

## Success Criteria

Phase 1 is **DONE** when:

1. ✅ `wiremd input.md` produces correct HTML 100% of the time
2. ✅ All syntax in spec parses correctly
3. ✅ Nesting works (2 levels)
4. ✅ Sketch style renders all components
5. ✅ Error messages show line numbers
6. ✅ README matches implementation
7. ✅ New user can learn syntax in 10 minutes
8. ✅ Claude Code can generate valid wiremd files

---

## Upstream Issues

- **Nesting support:** https://github.com/akonan/wiremd/issues
  - Container nesting completely broken
  - Children escape parent containers
  - Root cause: Non-recursive parser

---

*Last updated: 2026-01-02*
*Status: Phase 1 - Foundation*
*Syntax: v0.2 Hybrid (Salt + Markdown)*
