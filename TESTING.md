# Testing Guide

Wiremd includes comprehensive test coverage for all features, including the live preview functionality.

## Test Overview

**Total Tests: 537**

**Total Test Files: 20**

### Test Files

1. **api-examples.test.ts** (26 tests)
  - API examples coverage
  - Parsing and rendering expectations

2. **cli-file-not-found.test.ts** (3 tests)
  - Missing file handling
  - Exit behavior

3. **cli-unit.test.ts** (40 tests)
  - CLI unit behaviors
  - Option handling and validation

4. **cli.test.ts** (38 tests)
  - CLI command parsing
  - File generation
  - Style and format options
  - Watch mode
  - Error handling
  - Server integration

5. **edge-cases.test.ts** (63 tests)
  - Parser robustness
  - Nested container regressions
  - Stress and malformed inputs

6. **error-handling.test.ts** (29 tests)
  - Error paths
  - Messaging and resilience

7. **integration.test.ts** (35 tests)
  - End-to-end live preview flow
  - CLI and server integration
  - WebSocket message handling
  - UI component integration
  - Feature coverage verification

8. **parser.test.ts** (35 tests)
   - Markdown parsing
   - AST transformation
   - Custom syntax handling

9. **react-renderer.test.ts** (23 tests)
  - React renderer output
  - Component mapping

10. **renderer.test.ts** (20 tests)
   - HTML rendering
   - Style application
   - Component rendering

11. **server.test.ts** (31 tests)
   - Dev server functionality
   - WebSocket communication
   - Live-reload injection
   - Error overlay
   - Viewport switcher
   - Connection status

12. **tailwind-renderer.test.ts** (34 tests)
  - Tailwind-specific rendering
  - Utility class behavior

13. **type-guards.test.ts** (27 tests)
  - Runtime type checks
  - Contract safety

14. **validation.test.ts** (77 tests)
  - AST validation rules
  - Error reporting behavior

15. **tests/conformance/01-document-structure.test.ts** (5 tests)
  - Document contract conformance

16. **tests/conformance/02-components.test.ts** (22 tests)
  - Component conformance
  - Ambiguity resolution rules

17. **tests/conformance/03-containers.test.ts** (6 tests)
  - Container and nesting conformance

18. **tests/conformance/04-layouts.test.ts** (4 tests)
  - Layout conformance

19. **tests/conformance/05-attributes.test.ts** (10 tests)
  - Attribute parsing conformance

20. **tests/conformance/06-special-patterns.test.ts** (9 tests)
  - Special pattern and state conformance

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- tests/server.test.ts
```

### Run conformance suite (spec contract)
```bash
npx vitest run tests/conformance
```

### Run one conformance file
```bash
npx vitest run tests/conformance/03-containers.test.ts
```

## Test Coverage

### Dev Server Tests (server.test.ts)

Tests the enhanced dev server with live preview features:

- ✅ Server startup and configuration
- ✅ HTML file serving with script injection
- ✅ Live-reload script injection
- ✅ WebSocket connection handling
- ✅ Error notification system
- ✅ Reload notification system
- ✅ Viewport switcher UI
- ✅ Error overlay styling and behavior
- ✅ Connection status indicator
- ✅ Reconnection logic
- ✅ Toolbar UI components
- ✅ Preview wrapper functionality

### CLI Tests (cli.test.ts)

Tests the command-line interface:

- ✅ Help command display
- ✅ Version command
- ✅ File generation (HTML/JSON)
- ✅ All style options (sketch, clean, wireframe, material, tailwind, brutal, none)
- ✅ Format options validation
- ✅ Error handling and messages
- ✅ Output path handling
- ✅ Server integration
- ✅ Watch mode functionality
- ✅ Error notification integration
- ✅ Live reload integration
- ✅ Signal handling (SIGINT)
- ✅ Console output formatting

### Integration Tests (integration.test.ts)

Tests the complete live preview flow:

- ✅ CLI and server function imports
- ✅ Complete reload flow (file change → regenerate → notify)
- ✅ Complete error flow (file change → error → notify error)
- ✅ WebSocket message formatting
- ✅ Client-side message handling
- ✅ UI component injection order
- ✅ Content wrapping logic
- ✅ Viewport switcher integration
- ✅ Connection status updates
- ✅ Error overlay behavior
- ✅ TypeScript configuration
- ✅ Documentation completeness
- ✅ Package dependencies
- ✅ Feature coverage verification

### Conformance Tests (`tests/conformance/`)

Conformance tests validate that parser behavior matches `SYNTAX-SPEC-v0.1.md`, not accidental implementation details.

- ✅ Document contract (`01-document-structure.test.ts`)
- ✅ Components and ambiguity rules (`02-components.test.ts`)
- ✅ Containers and nesting (`03-containers.test.ts`)
- ✅ Layout semantics (`04-layouts.test.ts`)
- ✅ Attribute parsing rules (`05-attributes.test.ts`)
- ✅ Special patterns and states (`06-special-patterns.test.ts`)

Use these tests as a release gate for syntax/AST changes:

```bash
npx vitest run tests/conformance
```

## Test Structure

### Unit Tests

Each component is tested in isolation:

```typescript
describe('Component', () => {
  it('should do something', () => {
    // Test implementation
  });
});
```

### Integration Tests

Tests verify that components work together:

```typescript
describe('Feature Integration', () => {
  it('should complete full workflow', () => {
    // Test end-to-end flow
  });
});
```

## Writing Tests

### Test Naming

Use descriptive test names:

```typescript
// ✅ Good
it('should inject viewport switcher buttons', () => {});

// ❌ Bad
it('test viewport', () => {});
```

### Test Structure

Follow Arrange-Act-Assert pattern:

```typescript
it('should handle error messages', () => {
  // Arrange
  const errorMessage = 'Parse failed';

  // Act
  notifyError(errorMessage);

  // Assert
  expect(/* result */).toBe(/* expected */);
});
```

### Async Tests

For async operations, use async/await:

```typescript
it('should start server', async () => {
  const result = await startServer({ port: 3000 });
  expect(result).toBeDefined();
});
```

## Continuous Integration

Tests run automatically on:
- Every commit
- Pull requests
- Before publishing

### CI Configuration

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm test

- name: Run conformance
  run: npx vitest run tests/conformance

- name: Upload coverage
  run: npm run test:coverage
```

## Coverage Goals

Current coverage targets:

- **Overall**: 80%+
- **Critical paths**: 100%
- **UI components**: 90%+
- **Error handling**: 100%

View coverage report:
```bash
npm run test:coverage
```

## Common Test Patterns

### Testing File Operations

```typescript
beforeEach(() => {
  writeFileSync('test.md', '# Test');
});

afterEach(() => {
  unlinkSync('test.md');
});
```

### Testing CLI Commands

```typescript
it('should generate output', () => {
  const result = execSync('node dist/cli/index.js input.md', {
    encoding: 'utf-8'
  });
  expect(result).toContain('Generated');
});
```

### Testing Source Code

For features that inject code, test the source:

```typescript
it('should include feature code', () => {
  const source = readFileSync('./src/file.ts', 'utf-8');
  expect(source).toContain('featureCode');
});
```

## Debugging Tests

### Run single test

```bash
npm test -- -t "test name"
```

### Run with verbose output

```bash
npm test -- --reporter=verbose
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run"],
  "console": "integratedTerminal"
}
```

## Test Utilities

### Mock Server

For testing server functionality without actual network:

```typescript
import { vi } from 'vitest';

vi.mock('http', () => ({
  createServer: vi.fn()
}));
```

### Temporary Files

Always clean up test files:

```typescript
afterEach(() => {
  try {
    unlinkSync(testFile);
  } catch (e) {
    // File may not exist
  }
});
```

## Performance Tests

Monitor test performance:

```bash
npm test -- --reporter=verbose
```

Slow tests (>1s) should be optimized or moved to integration suite.

## Future Test Plans

- [ ] E2E browser tests for live preview UI
- [ ] Performance benchmarks
- [ ] Stress tests for WebSocket connections
- [ ] Visual regression tests for rendered output
- [ ] Accessibility tests
- [ ] Cross-browser testing

## Contributing

When adding features:

1. Write tests first (TDD)
2. Ensure all tests pass
3. Add integration tests for new flows
4. Update this document
5. Maintain >80% coverage

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Test Coverage Guide](https://istanbul.js.org/)

---

**All tests passing!** ✅ 537/537
