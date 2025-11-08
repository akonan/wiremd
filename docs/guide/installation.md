# Installation

## Requirements

- Node.js >= 18.0.0
- npm, yarn, or pnpm

## Package Installation

### npm

```bash
npm install wiremd
```

### yarn

```bash
yarn add wiremd
```

### pnpm

```bash
pnpm add wiremd
```

## Global CLI Installation

To use the `mdmock` command globally:

```bash
npm install -g wiremd
```

Verify installation:

```bash
mdmock --version
```

## Development Installation

To contribute to wiremd or run from source:

```bash
# Clone the repository
git clone https://github.com/akonan/wiremd.git
cd wiremd

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Link globally for development
npm link
```

## Verify Installation

### Using the CLI

```bash
# Create a test file
echo "## Test\n[Button]" > test.md

# Render it
mdmock test.md

# Should create test.html
```

### Using the API

Create a test script `test.js`:

```javascript
import { parse, renderToHTML } from 'wiremd';

const ast = parse('## Test\n[Button]');
const html = renderToHTML(ast);
console.log('Success! wiremd is installed.');
```

Run it:

```bash
node test.js
```

## TypeScript Support

wiremd is written in TypeScript and includes type definitions. No additional `@types` package is needed.

```typescript
import type { DocumentNode, WiremdNode } from 'wiremd';
```

## Troubleshooting

### Module not found

If you see "Cannot find module 'wiremd'":

1. Ensure you're in the correct directory
2. Run `npm install` again
3. Check that `node_modules/wiremd` exists

### Permission errors (global install)

On macOS/Linux, you may need sudo:

```bash
sudo npm install -g wiremd
```

Or configure npm to use a different directory:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Node version issues

Check your Node version:

```bash
node --version
```

If it's less than 18.0.0, upgrade Node.js.

## Next Steps

- [Getting Started Guide](./getting-started.md)
- [Learn the Syntax](./syntax.md)
- [Explore Examples](../examples/README.md)
