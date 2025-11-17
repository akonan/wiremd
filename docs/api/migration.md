# Migration Guides

Guide for migrating between wiremd versions and adapting to syntax changes.

## Current Version

wiremd is currently at version **0.1.0** with syntax version **0.1**.

## Future Migration Strategy

When breaking changes are introduced in future versions, this guide will help you migrate your wireframes and code.

## Version History

### v0.1.0 (Current)

Initial release with core features:

- Parser API (`parse()`, `validate()`)
- Renderer APIs (`renderToHTML()`, `renderToJSON()`, `renderToReact()`, `renderToTailwind()`)
- Complete type definitions
- Support for all UI components
- Multiple visual styles

## Preparing for Future Migrations

### 1. Version Your Wireframes

Add version metadata to your wireframes:

```markdown
<!-- wiremd version: 0.1 -->
## My Wireframe

[Button]
```

Or in code:

```typescript
import { parse } from 'wiremd';

const ast = parse(markdown);
console.log('Syntax version:', ast.version); // '0.1'
```

### 2. Use TypeScript

TypeScript will catch breaking changes at compile time:

```typescript
import type { DocumentNode, WiremdNode } from 'wiremd';

// Types will show errors if the API changes
function processNode(node: WiremdNode) {
  // ...
}
```

### 3. Pin Versions in Production

Use exact versions in `package.json`:

```json
{
  "dependencies": {
    "wiremd": "0.1.0"
  }
}
```

### 4. Write Tests

Test your wireframe parsing and rendering:

```typescript
import { describe, it, expect } from 'vitest';
import { parse, renderToHTML } from 'wiremd';

describe('My Wireframes', () => {
  it('should parse login form', () => {
    const markdown = `
## Login Form
[Submit]
    `;

    const ast = parse(markdown);
    expect(ast.children).toHaveLength(2);
  });

  it('should render consistently', () => {
    const markdown = '[Button]{.primary}';
    const ast = parse(markdown);
    const html = renderToHTML(ast);

    expect(html).toContain('button');
    expect(html).toContain('primary');
  });
});
```

## Automated Migration Tools

### Future Migration Script Template

When a new version is released, migration scripts will be provided:

```typescript
// migrate-0.1-to-0.2.ts (example for future use)
import { parse } from 'wiremd@0.1.0';
import { renderToMarkdown } from 'wiremd@0.2.0';

function migrateWireframe(oldMarkdown: string): string {
  // Parse with old version
  const ast = parse(oldMarkdown);

  // Transform AST if needed
  const newAST = transformAST(ast);

  // Render with new version
  return renderToMarkdown(newAST);
}
```

### Syntax Validator

Check if your wireframes use deprecated syntax:

```typescript
import { parse, validate } from 'wiremd';

function checkForDeprecations(markdown: string): string[] {
  const warnings: string[] = [];
  const ast = parse(markdown);

  function traverse(node: WiremdNode) {
    // Future: Check for deprecated patterns
    // Example:
    // if (node.type === 'deprecated-type') {
    //   warnings.push('Use of deprecated type');
    // }

    if ('children' in node && node.children) {
      node.children.forEach(traverse);
    }
  }

  ast.children.forEach(traverse);
  return warnings;
}

const warnings = checkForDeprecations(markdown);
if (warnings.length > 0) {
  console.warn('Deprecation warnings:', warnings);
}
```

## Breaking Change Policy

wiremd follows semantic versioning:

- **Major versions (1.0, 2.0)**: Breaking changes to API or syntax
- **Minor versions (0.1, 0.2)**: New features, backward compatible
- **Patch versions (0.1.1)**: Bug fixes, backward compatible

### What Constitutes a Breaking Change

**Breaking changes:**

- Removing or renaming exported functions
- Changing function signatures
- Removing or renaming node types
- Changing AST structure
- Removing support for syntax patterns

**Non-breaking changes:**

- Adding new node types
- Adding optional parameters
- Adding new syntax patterns
- Performance improvements
- Bug fixes

## API Stability

### Stable APIs (v0.1.0)

These APIs are stable and will maintain backward compatibility:

- `parse(markdown, options?)`
- `validate(ast)`
- `renderToHTML(ast, options?)`
- `renderToJSON(ast, options?)`
- `renderToReact(ast, options?)`
- `renderToTailwind(ast, options?)`

### Core Types

Core type definitions are stable:

- `DocumentNode`
- `WiremdNode`
- `ParseOptions`
- `RenderOptions`
- `ComponentProps`

## Compatibility Utilities

### Version Detection

```typescript
import { VERSION, SYNTAX_VERSION } from 'wiremd';

console.log('wiremd version:', VERSION); // '0.1.0'
console.log('Syntax version:', SYNTAX_VERSION); // '0.1'

function checkCompatibility() {
  const [major, minor] = VERSION.split('.').map(Number);

  if (major === 0 && minor >= 1) {
    return true;
  }

  console.warn('wiremd version may be incompatible');
  return false;
}
```

### Multi-Version Support

Support multiple wiremd versions in your app:

```typescript
import { parse as parseV1 } from 'wiremd@0.1.0';
import { parse as parseV2 } from 'wiremd@0.2.0'; // Future

function parseAny(markdown: string, version?: string) {
  const syntaxVersion = version || detectVersion(markdown);

  switch (syntaxVersion) {
    case '0.1':
      return parseV1(markdown);
    case '0.2':
      return parseV2(markdown);
    default:
      throw new Error(`Unsupported version: ${syntaxVersion}`);
  }
}

function detectVersion(markdown: string): string {
  // Check for version comment
  const match = markdown.match(/<!-- wiremd version: ([\d.]+) -->/);
  return match ? match[1] : '0.1'; // Default to current
}
```

## Example Migration Scenarios

### Scenario: Syntax Change (Hypothetical)

If a future version changes button syntax from `[Button]` to `<Button>`:

**Before (v0.1):**

```markdown
## Form
[Submit]{.primary}
[Cancel]
```

**After (v0.2, hypothetical):**

```markdown
## Form
<Submit .primary>
<Cancel>
```

**Migration script:**

```typescript
function migrateSyntax(markdown: string): string {
  // Replace [text]{.class} with <text .class>
  return markdown.replace(/\[([^\]]+)\]\{\.([^}]+)\}/g, '<$1 .$2>');
}

const newMarkdown = migrateSyntax(oldMarkdown);
```

### Scenario: API Change (Hypothetical)

If a future version changes the render API:

**Before (v0.1):**

```typescript
import { renderToHTML } from 'wiremd';

const html = renderToHTML(ast, { style: 'sketch' });
```

**After (v0.2, hypothetical):**

```typescript
import { render } from 'wiremd';

const html = render(ast, { format: 'html', theme: 'sketch' });
```

**Compatibility wrapper:**

```typescript
// v0.2 wrapper for v0.1 API
export function renderToHTML(ast: DocumentNode, options: any = {}) {
  return render(ast, {
    format: 'html',
    theme: options.style, // Map old option to new
    ...options
  });
}
```

### Scenario: Type Changes (Hypothetical)

If node types are restructured:

**Before (v0.1):**

```typescript
interface ButtonNode {
  type: 'button';
  content?: string;
  props: ComponentProps;
}
```

**After (v0.2, hypothetical):**

```typescript
interface ButtonNode {
  type: 'button';
  label: string; // Renamed from content
  attributes: ComponentProps; // Renamed from props
}
```

**Migration:**

```typescript
function migrateButtonNode(oldNode: OldButtonNode): NewButtonNode {
  return {
    type: 'button',
    label: oldNode.content || '',
    attributes: oldNode.props
  };
}
```

## Staying Updated

### Check for Updates

```bash
npm outdated wiremd
```

### Read Changelogs

Always read the [CHANGELOG.md](https://github.com/akonan/wiremd/blob/main/CHANGELOG.md) before upgrading:

```bash
npm info wiremd versions
npm info wiremd@latest
```

### Test Before Upgrading

Create a test branch:

```bash
git checkout -b test-wiremd-upgrade
npm install wiremd@latest
npm test
```

If tests pass and everything works:

```bash
git checkout main
git merge test-wiremd-upgrade
```

## Deprecation Warnings

Future versions may include deprecation warnings:

```typescript
// Future example
import { parse } from 'wiremd@0.2.0';

const ast = parse('[Button]'); // Hypothetical warning:
// DeprecationWarning: [Button] syntax is deprecated, use <Button> instead
```

### Handling Warnings

```typescript
// Suppress warnings in tests
process.env.WIREMD_SUPPRESS_WARNINGS = 'true';

// Or handle them explicitly
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning') {
    console.log('Please update syntax:', warning.message);
  }
});
```

## Migration Checklist

When a new version is released:

- [ ] Read the CHANGELOG and migration guide
- [ ] Check for breaking changes
- [ ] Update package.json
- [ ] Run tests
- [ ] Update wireframe syntax if needed
- [ ] Update type definitions
- [ ] Update documentation
- [ ] Deploy to staging
- [ ] Test thoroughly
- [ ] Deploy to production

## Getting Help

If you encounter migration issues:

1. Check the [documentation](https://github.com/akonan/wiremd)
2. Search [GitHub issues](https://github.com/akonan/wiremd/issues)
3. Ask in [GitHub Discussions](https://github.com/akonan/wiremd/discussions)
4. File a [bug report](https://github.com/akonan/wiremd/issues/new)

## See Also

- [CHANGELOG](https://github.com/akonan/wiremd/blob/main/CHANGELOG.md) - Version history
- [Parser API](/api/parser) - Current API reference
- [Type Definitions](/api/types) - Current type definitions
- [GitHub Releases](https://github.com/akonan/wiremd/releases) - Release notes
