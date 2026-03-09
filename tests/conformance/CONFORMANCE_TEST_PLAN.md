# Conformance Test Plan

**Specification Version:** v0.1  
**Scope:** Parser and AST conformance in `tests/conformance/`  
**Primary Goal:** Define why conformance testing exists and how it is implemented and enforced.

## 1. Why Conformance Exists

Conformance testing ensures wiremd behavior follows `SYNTAX-SPEC-v0.1.md` rather than incidental implementation details.

### 1.1 Prevent Spec Drift

Parser behavior can slowly diverge from the spec even when general tests pass.

**Conformance objective:** enforce spec-linked assertions for syntax and AST output.

### 1.2 Preserve AST Contract Stability

Consumers depend on predictable node structure and semantic fields.

**Conformance objective:** validate canonical fields explicitly (for example `type`, `props`, `href`, `children`, `containerType`).

### 1.3 Resolve Ambiguity Deterministically

wiremd has ambiguous patterns such as:

- button vs link,
- input vs code,
- immediate vs standalone attribute placement.

**Conformance objective:** enforce one correct output per ambiguity rule.

### 1.4 Protect Refactors

Parser/transformer refactors are high-risk for semantic regressions.

**Conformance objective:** use the suite as a semantic regression gate.

## 2. How Conformance Is Implemented

### 2.1 Principles

- **Spec-first:** tests assert the behavior defined by the spec, even if implementation currently differs.
- **Strict assertions:** avoid permissive checks that allow incompatible outputs.
- **Traceability:** each suite maps to explicit spec sections.
- **Contract clarity:** check both node type and critical semantic fields.

### 2.2 Coverage Model

Conformance is split by specification domains:

- document contract,
- components,
- containers,
- layouts,
- attributes,
- special patterns and states.

## 3. Detailed Suite Map

| Phase | File | Spec Focus | Main Validation Targets |
|------|------|------------|--------------------------|
| 0 | `tests/conformance/01-document-structure.test.ts` | Sections 1, 11 | root shape (`document`), `version`, `meta`, `children`, baseline node contract |
| 1 | `tests/conformance/02-components.test.ts` | Section 2, 10.1, 10.2 | buttons, links (`href`), inputs (`props.type`), textarea, select/options, radios, checkboxes, icons |
| 2 | `tests/conformance/03-containers.test.ts` | Section 3 | generic containers, attributes, nesting, inline containers (`nav`) |
| 3 | `tests/conformance/04-layouts.test.ts` | Section 4 | grid transforms (`.grid-N`, `.grid-auto`), sidebar/main layout behavior |
| 4 | `tests/conformance/05-attributes.test.ts` | Section 5, 10.4 | class attrs, key-values, states, combined attrs, placement rules |
| 5 | `tests/conformance/06-special-patterns.test.ts` | Sections 7, 8 | breadcrumbs, tabs, badges, loading/empty/error states, state attrs |

## 4. Case Design Rules

Every suite should include:

- at least one positive case,
- at least one ambiguity or boundary case,
- explicit validation of required semantic fields,
- deterministic expected output.

Avoid:

- fallback assertions that hide contract drift,
- parser-shape assumptions that can produce fragile tests,
- assertions that accept multiple incompatible AST forms.

## 5. Quality Gates

A change is conformance-safe only when:

1. `npx vitest run tests/conformance` passes.
2. New syntax behavior includes matching conformance tests.
3. Existing conformance tests are not weakened to preserve compatibility with invalid outputs.
4. Spec changes are reflected by conformance updates in the same PR.

## 6. Execution

Run all conformance suites:

```bash
npx vitest run tests/conformance
```

Run an individual suite:

```bash
npx vitest run tests/conformance/02-components.test.ts
```

## 7. Exit Criteria

This plan is successful when:

- conformance is used as a merge/release gate,
- regressions in parser semantics are caught before release,
- AST contract behavior stays stable and predictable,
- contributors can map spec rules directly to executable tests.

## 8. Detailed Case Matrix

### Phase 0: Document Contract (Sections 1 and 11)

**File:** `tests/conformance/01-document-structure.test.ts`

| Spec ID | Feature | Input Pattern | Validation Criteria |
|---------|---------|---------------|---------------------|
| 11.1 | Document Root | any markdown | Root type is `document` |
| 11.1 | Version | any markdown | `version` exists and is non-empty |
| 11.1 | Meta | any markdown | `meta` object exists |
| 11.1 | Children Array | any markdown | `children` is always array |
| 11.2 | Node Baseline Shape | mixed nodes | each node has a `type` string |

### Phase 1: Core Components (Section 2)

**File:** `tests/conformance/02-components.test.ts`

| Spec ID | Feature | Input Pattern | Validation Criteria |
|---------|---------|---------------|---------------------|
| 2.1 | Buttons | `[Text]` | Type: `button`, Label: `Text` |
| 2.1 | Primary Button | `[Text]*` | `props.classes` includes `primary` |
| 2.1 | Button Classes | `[Text]{.danger}` | Class includes `danger` |
| 2.1 | Button State | `[Text]{:disabled}` | State: `disabled` |
| 10.1 | Button vs Link | `[Text](url)` | Type: `link`, not `button`, `href` set |
| 10.1 | Link with attrs | `[Text]{.class}(url)` | Type: `link`, not `button`, `href` set |
| 2.2 | Text Input | `[___]` | Type: `input`, `props.type`: `text` |
| 2.2 | Placeholder | `[Email___]` | Placeholder: `Email` |
| 2.2 | Password | `[***]` | `props.type`: `password` |
| 2.2 | Input Attributes | `[___]{type:email}` | `props.type`: `email` |
| 2.3 | Textarea | `[Message...]{rows:5}` | Type: `textarea`, `rows: 5` |
| 2.3 | Textarea (Visual) | multiline bracket pattern | Type: `textarea` |
| 2.4 | Select/Dropdown | `[Select___v]` | Type: `select` |
| 2.4 | Select Options | Select followed by list | Children include options |
| 2.5 | Radio Buttons | `( ) Opt`, `(•) Opt`, `(x) Opt` | Type: `radio`, selected mapping |
| 2.5 | Radio Groups | Consecutive radio lines | Group semantics validated |
| 2.6 | Checkboxes | `- [ ]`, `- [x]` | Standard markdown checklist |
| 2.7 | Icons | `:icon-name:` | Type: `icon`, name set |
| 10.2 | Input vs Code | `[___]` vs `` `code` `` | Distinct AST types |

### Phase 2: Containers and Structure (Section 3)

**File:** `tests/conformance/03-containers.test.ts`

| Spec ID | Feature | Input Pattern | Validation Criteria |
|---------|---------|---------------|---------------------|
| 3.1 | Generic Container | `::: hero ... :::` | Type: `container`, `containerType`: `hero` |
| 3.1 | Container Attrs | `::: card {.shadow}` | Classes included |
| 3.1 | Nesting | Container inside container | Correct parent-child structure |
| 3.2 | Inline Container | `[[ A \| B ]]` | Type: inline container (`nav`) |
| 3.2 | Nav Bar | `[[ ... ]]{.nav}` | Class: `nav` |
| 3.2 | Malformed Inline | `[[ A \| B ]` | Must not parse as valid inline container |

### Phase 3: Layouts (Section 4)

**File:** `tests/conformance/04-layouts.test.ts`

| Spec ID | Feature | Input Pattern | Validation Criteria |
|---------|---------|---------------|---------------------|
| 4.1 | Grid Layout | `## Title {.grid-3}` | Grid with H3 item grouping |
| 4.1 | Grid Auto | `## Title {.grid-auto}` | Grid layout recognized |
| 4.2 | Sidebar Layout | `::: layout` + inner headings | Sidebar/main mapping validated |

### Phase 4: Attributes and Parsing Rules (Section 5)

**File:** `tests/conformance/05-attributes.test.ts`

| Spec ID | Feature | Input Pattern | Validation Criteria |
|---------|---------|---------------|---------------------|
| 5.1 | Classes | `{.cls1 .cls2}` | Class list array |
| 5.2 | Key-Value | `{k:v k2:"v 2"}` | Attributes object |
| 5.3 | States | `{:disabled}` | State property |
| 5.4 | Combined | `{.cls key:val :state}` | All properties populated |
| 10.4 | Attr Placement | `[Btn] {.cls}` vs `[Btn]{.cls}` | Both apply correctly |
| 10.4 | Standalone Attr Block | `{.class}` after block | Applies to preceding block |

### Phase 5: Special Patterns (Sections 7 and 8)

**File:** `tests/conformance/06-special-patterns.test.ts`

| Spec ID | Feature | Input Pattern | Validation Criteria |
|---------|---------|---------------|---------------------|
| 7.2 | Breadcrumbs | `Home > Page` | Type: `breadcrumbs` |
| 7.3 | Tabs | `[Tab]* \| Tab2` | Type: `tabs`, selected index correct |
| 7.4 | Badges | Inline code contexts | Type: `badge` |
| 8.x | Loading State | `::: loading` | Type: `loading-state` |
| 8.x | Empty State | `::: empty-state` | Type: `empty-state` |
| 8.x | Error State | `::: error-state` | Type: `error-state` |
| 8.1 | Component state attrs | `[Button]{:loading}` | `props.state=loading` |

## 9. Motivation and Governance Context

Conformance is governed by the following rules:

- Tests are spec-first and intentionally strict.
- Ambiguity rules must resolve to one expected AST output.
- Conformance assertions must protect canonical contracts over convenience.
- Test changes must not weaken behavior guarantees to match implementation shortcuts.
- Spec updates and conformance updates should land together.

Governance expectations for contributors and reviewers:

- Treat conformance failures as contract regressions unless a spec change is approved.
- Require explicit rationale for any changed expected AST shape.
- Keep mappings from spec sections to test cases auditable.
- Prefer adding targeted conformance cases over broad permissive assertions.

## 10. Related Document

- Formal syntax spec: [SYNTAX-SPEC-v0.1.md](../../SYNTAX-SPEC-v0.1.md)
