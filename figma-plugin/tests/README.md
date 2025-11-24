# wiremd Figma Plugin Tests

Comprehensive test suite for the wiremd Figma plugin.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Type check without running tests
npm run typecheck
```

## Test Structure

### Unit Tests

**style-mapper.test.ts**
- Theme style configurations
- Color palette validation
- Paint and shadow creation
- Font style generation
- Theme consistency checks

**form-components.test.ts**
- Button variants and states
- Input field rendering
- Textarea dimensions
- Select dropdowns
- Checkbox and radio buttons
- Radio group layouts

**content-components.test.ts**
- Heading levels and fonts
- Paragraph line heights
- Image placeholders
- Icon mappings and sizes
- Links with underlines
- Lists and list items
- Blockquotes with accents
- Code blocks (inline and block)
- Tables and separators

### Integration Tests

**ast-to-figma.test.ts**
- Full document conversion
- Page and frame creation
- Theme application
- Nested component handling
- Error handling and recovery
- Font loading and caching
- Layout components
- Form components
- Performance benchmarks

### Test Fixtures

**fixtures.ts**
- Sample AST nodes for all component types
- Simple and complex document examples
- Reusable test data

### Test Setup

**setup.ts**
- Figma API mocks
- Mock node classes (FrameNode, TextNode, etc.)
- Global test configuration
- Mock reset before each test

## Coverage Goals

- **Overall**: 80%+ code coverage
- **Critical paths**: 90%+ coverage
- **Edge cases**: All error scenarios tested
- **Integration**: Full conversion pipeline tested

## Current Coverage

Run `npm run test:coverage` to see detailed coverage report.

## Writing New Tests

### Adding Component Tests

1. Create test file in `tests/` directory
2. Import component function and fixtures
3. Mock Figma API calls
4. Test happy path, edge cases, and errors

Example:

```typescript
import { describe, it, expect } from 'vitest';
import { mockFigma } from './setup';
import { createButton } from '../src/lib/form-components';
import { simpleButtonAST } from './fixtures';

describe('createButton', () => {
  it('should create button with correct layout', async () => {
    const button = await createButton(
      simpleButtonAST,
      'clean',
      mockLoadFont,
      mockConvertNode
    );

    expect(button.name).toBe('Button');
    expect(button.layoutMode).toBe('HORIZONTAL');
  });
});
```

### Adding Integration Tests

Test full conversion pipeline:

```typescript
it('should convert complete document', async () => {
  const converter = new WiremdToFigmaConverter({ theme: 'sketch' });
  await converter.convert(documentAST);

  expect(mockFigma.createPage).toHaveBeenCalled();
  expect(mockFigma.createFrame).toHaveBeenCalled();
});
```

### Adding Fixtures

Add reusable test data to `fixtures.ts`:

```typescript
export const myComponentAST: Extract<WiremdNode, { type: 'my-component' }> = {
  type: 'my-component',
  props: {},
  children: [],
};
```

## Mocking Strategy

### Figma API Mocks

All Figma global functions are mocked in `setup.ts`:

- `figma.createFrame()` → MockFrameNode
- `figma.createText()` → MockTextNode
- `figma.createRectangle()` → MockRectangleNode
- `figma.loadFontAsync()` → Resolved promise
- `figma.notify()` → No-op
- etc.

### Font Loading

```typescript
mockFigma.loadFontAsync.mockResolvedValue(undefined);
```

### Node Creation

Mock nodes have realistic properties:

```typescript
const frame = mockFigma.createFrame();
frame.layoutMode = 'VERTICAL';
frame.appendChild(textNode);
```

## Continuous Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Before releases

## Debugging Tests

### Run Single Test File

```bash
npm test -- ast-to-figma.test.ts
```

### Run Single Test

```bash
npm test -- -t "should create button"
```

### Verbose Output

```bash
npm test -- --reporter=verbose
```

### Debug Mode

```bash
node --inspect-brk node_modules/.bin/vitest run
```

## Best Practices

1. **Test behavior, not implementation**
   - Focus on what the function does, not how
   - Mock external dependencies only

2. **Use descriptive test names**
   - `it('should create button with primary variant')`
   - Not: `it('test button')`

3. **Arrange-Act-Assert pattern**
   ```typescript
   // Arrange
   const node = { type: 'button', ... };

   // Act
   const result = await createButton(node, 'clean', ...);

   // Assert
   expect(result.name).toBe('Button');
   ```

4. **Test edge cases**
   - Empty inputs
   - Invalid data
   - Error conditions
   - Boundary values

5. **Keep tests independent**
   - Don't rely on test execution order
   - Clean up after each test
   - Use `beforeEach` for setup

## Troubleshooting

### Tests Failing After Code Changes

1. Check if mocks need updating
2. Verify fixture data matches new schema
3. Update assertions for new behavior

### Type Errors

```bash
npm run typecheck
```

### Mock Not Working

Ensure `setupFiles` in `vitest.config.ts` includes `'./tests/setup.ts'`

### Coverage Too Low

Focus on:
1. Error handling paths
2. Edge cases
3. Complex logic branches
4. Integration scenarios

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Figma Plugin API](https://www.figma.com/plugin-docs/)
- [Testing Best Practices](https://testingjavascript.com/)
