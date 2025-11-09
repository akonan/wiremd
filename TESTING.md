# Testing Guide

Wiremd includes comprehensive test coverage for all features, including the live preview functionality.

## Test Overview

**Total Tests: 152**

### Test Files

1. **parser.test.ts** (29 tests)
   - Markdown parsing
   - AST transformation
   - Custom syntax handling

2. **renderer.test.ts** (19 tests)
   - HTML rendering
   - Style application
   - Component rendering

3. **server.test.ts** (31 tests)
   - Dev server functionality
   - WebSocket communication
   - Live-reload injection
   - Error overlay
   - Viewport switcher
   - Connection status

4. **cli.test.ts** (38 tests)
   - CLI command parsing
   - File generation
   - Style and format options
   - Watch mode
   - Error handling
   - Server integration

5. **integration.test.ts** (35 tests)
   - End-to-end live preview flow
   - CLI and server integration
   - WebSocket message handling
   - UI component integration
   - Feature coverage verification

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

**All tests passing!** ✅ 152/152
