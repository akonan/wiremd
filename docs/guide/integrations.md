# Framework Integrations

Learn how to integrate wiremd into your favorite frameworks and build tools.

## Node.js / JavaScript

### Basic Integration

```javascript
const { parse, renderToHTML } = require('wiremd');
const fs = require('fs');

// Read wireframe
const markdown = fs.readFileSync('wireframe.md', 'utf-8');

// Parse and render
const ast = parse(markdown);
const html = renderToHTML(ast, { style: 'clean' });

// Save output
fs.writeFileSync('output.html', html);
```

### ES Modules

```javascript
import { parse, renderToHTML } from 'wiremd';
import { readFileSync, writeFileSync } from 'fs';

const markdown = readFileSync('wireframe.md', 'utf-8');
const ast = parse(markdown);
const html = renderToHTML(ast, { style: 'sketch' });
writeFileSync('output.html', html);
```

## Next.js

### App Router (Next.js 13+)

Create a wireframe preview component:

```typescript
// app/wireframe/[slug]/page.tsx
import { parse, renderToReact } from 'wiremd';
import { readFileSync } from 'fs';
import { join } from 'path';

interface Props {
  params: { slug: string };
}

export default function WireframePage({ params }: Props) {
  // Read wireframe file
  const filePath = join(process.cwd(), 'wireframes', `${params.slug}.md`);
  const markdown = readFileSync(filePath, 'utf-8');

  // Parse to AST
  const ast = parse(markdown);

  // Get metadata
  const { title, description } = ast.meta;

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {/* Render wireframe */}
      <WireframeRenderer ast={ast} />
    </div>
  );
}

// Component to render the wireframe
function WireframeRenderer({ ast }) {
  // You can either use React renderer or HTML renderer
  // Option 1: Server-side HTML rendering
  const html = renderToHTML(ast, { style: 'clean' });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;

  // Option 2: Convert to React components (see Plugin API)
}
```

### Pages Router (Next.js 12)

```typescript
// pages/wireframe/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import { parse, renderToHTML } from 'wiremd';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface Props {
  html: string;
  title: string;
}

export default function WireframePage({ html, title }: Props) {
  return (
    <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const filePath = join(process.cwd(), 'wireframes', `${params.slug}.md`);
  const markdown = readFileSync(filePath, 'utf-8');

  const ast = parse(markdown);
  const html = renderToHTML(ast, { style: 'clean' });

  return {
    props: {
      html,
      title: ast.meta.title || 'Wireframe'
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const wireframesDir = join(process.cwd(), 'wireframes');
  const files = readdirSync(wireframesDir).filter(f => f.endsWith('.md'));

  const paths = files.map(file => ({
    params: { slug: file.replace('.md', '') }
  }));

  return { paths, fallback: false };
};
```

### API Route

Create an API endpoint for parsing wireframes:

```typescript
// pages/api/parse.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { parse, renderToHTML, renderToJSON } from 'wiremd';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { markdown, format = 'html', style = 'clean' } = req.body;

    const ast = parse(markdown);

    let output: string;
    if (format === 'json') {
      output = renderToJSON(ast);
      res.setHeader('Content-Type', 'application/json');
    } else {
      output = renderToHTML(ast, { style });
      res.setHeader('Content-Type', 'text/html');
    }

    res.status(200).send(output);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
```

## React

### Create React App

```typescript
// src/components/WireframeViewer.tsx
import React, { useState, useEffect } from 'react';
import { parse, renderToHTML } from 'wiremd';

interface Props {
  markdown: string;
  style?: 'sketch' | 'clean' | 'wireframe' | 'material' | 'brutal';
}

export const WireframeViewer: React.FC<Props> = ({ markdown, style = 'clean' }) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    try {
      const ast = parse(markdown);
      const rendered = renderToHTML(ast, { style });
      setHtml(rendered);
    } catch (error) {
      console.error('Failed to render wireframe:', error);
    }
  }, [markdown, style]);

  return (
    <div
      className="wireframe-viewer"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
```

### With Editor

```typescript
// src/components/WireframeEditor.tsx
import React, { useState } from 'react';
import { parse, renderToHTML } from 'wiremd';

export const WireframeEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState('## Contact Form\n[Button]');
  const [html, setHtml] = useState('');

  const handleRender = () => {
    try {
      const ast = parse(markdown);
      const rendered = renderToHTML(ast, { style: 'sketch' });
      setHtml(rendered);
    } catch (error) {
      console.error('Parse error:', error);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <h3>Editor</h3>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          style={{ width: '100%', height: '400px' }}
        />
        <button onClick={handleRender}>Render</button>
      </div>
      <div style={{ flex: 1 }}>
        <h3>Preview</h3>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};
```

## Vite

### Basic Setup

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['wiremd']
  }
});
```

### Custom Plugin

Create a Vite plugin to process `.wmd` files:

```typescript
// vite-plugin-wiremd.ts
import { Plugin } from 'vite';
import { parse, renderToHTML } from 'wiremd';
import { readFileSync } from 'fs';

export function wiremdPlugin(): Plugin {
  return {
    name: 'vite-plugin-wiremd',
    transform(code, id) {
      if (id.endsWith('.wmd')) {
        const ast = parse(code);
        const html = renderToHTML(ast, { style: 'clean' });

        return {
          code: `export default ${JSON.stringify(html)}`,
          map: null
        };
      }
    }
  };
}

// Usage in vite.config.ts
import { wiremdPlugin } from './vite-plugin-wiremd';

export default defineConfig({
  plugins: [react(), wiremdPlugin()]
});

// Now you can import .wmd files:
// import wireframe from './wireframe.wmd';
```

## Express.js

### REST API

```typescript
// server.ts
import express from 'express';
import { parse, renderToHTML, renderToJSON } from 'wiremd';

const app = express();

app.use(express.json());
app.use(express.text());

// Parse endpoint
app.post('/api/parse', (req, res) => {
  try {
    const ast = parse(req.body);
    res.json(ast);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Render to HTML endpoint
app.post('/api/render/html', express.text(), (req, res) => {
  try {
    const ast = parse(req.body);
    const html = renderToHTML(ast, {
      style: req.query.style as any || 'clean'
    });
    res.type('html').send(html);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Render to JSON endpoint
app.post('/api/render/json', express.text(), (req, res) => {
  try {
    const ast = parse(req.body);
    const json = renderToJSON(ast);
    res.type('json').send(json);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### File Watcher

Watch and auto-render wireframe files:

```typescript
// watcher.ts
import { watch } from 'chokidar';
import { parse, renderToHTML } from 'wiremd';
import { readFileSync, writeFileSync } from 'fs';

const watcher = watch('./wireframes/*.md', {
  persistent: true
});

watcher.on('change', (path) => {
  console.log(`File ${path} changed, re-rendering...`);

  const markdown = readFileSync(path, 'utf-8');
  const ast = parse(markdown);
  const html = renderToHTML(ast, { style: 'clean' });

  const outputPath = path.replace('.md', '.html').replace('wireframes', 'output');
  writeFileSync(outputPath, html);

  console.log(`Rendered to ${outputPath}`);
});

console.log('Watching for changes...');
```

## Webpack

### Custom Loader

Create a webpack loader for `.wmd` files:

```javascript
// wiremd-loader.js
const { parse, renderToHTML } = require('wiremd');

module.exports = function(source) {
  const ast = parse(source);
  const html = renderToHTML(ast, { style: 'clean' });

  return `module.exports = ${JSON.stringify(html)}`;
};

// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.wmd$/,
        use: './wiremd-loader.js'
      }
    ]
  }
};
```

## Gatsby

### Source Plugin

```typescript
// gatsby-node.ts
import { GatsbyNode } from 'gatsby';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { parse } from 'wiremd';

export const sourceNodes: GatsbyNode['sourceNodes'] = async ({
  actions,
  createNodeId,
  createContentDigest
}) => {
  const { createNode } = actions;

  const wireframesDir = join(__dirname, 'wireframes');
  const files = readdirSync(wireframesDir).filter(f => f.endsWith('.md'));

  files.forEach(file => {
    const filePath = join(wireframesDir, file);
    const markdown = readFileSync(filePath, 'utf-8');
    const ast = parse(markdown);

    createNode({
      id: createNodeId(`wireframe-${file}`),
      parent: null,
      children: [],
      internal: {
        type: 'Wireframe',
        content: markdown,
        contentDigest: createContentDigest(markdown)
      },
      slug: file.replace('.md', ''),
      title: ast.meta.title,
      ast: ast
    });
  });
};

// Create pages
export const createPages: GatsbyNode['createPages'] = async ({
  graphql,
  actions
}) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      allWireframe {
        nodes {
          slug
        }
      }
    }
  `);

  result.data.allWireframe.nodes.forEach(node => {
    createPage({
      path: `/wireframe/${node.slug}`,
      component: require.resolve('./src/templates/wireframe.tsx'),
      context: {
        slug: node.slug
      }
    });
  });
};
```

## Troubleshooting

### ESM vs CommonJS

If you encounter module resolution issues:

```typescript
// CommonJS (require)
const wiremd = require('wiremd');
const { parse, renderToHTML } = wiremd;

// ES Modules (import) - Recommended
import { parse, renderToHTML } from 'wiremd';
```

### TypeScript Types

Ensure types are properly imported:

```typescript
import type { DocumentNode, WiremdNode, ParseOptions, RenderOptions } from 'wiremd';

const options: ParseOptions = {
  position: true,
  validate: true
};
```

### Webpack 5 Issues

If you see polyfill errors:

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    fallback: {
      fs: false,
      path: false
    }
  }
};
```

### Browser Usage

wiremd is designed for Node.js environments. For browser usage:

1. **Pre-render**: Parse and render on the server, send HTML to browser
2. **Bundle**: Use a bundler (Webpack, Vite) to handle Node.js dependencies
3. **API**: Create an API endpoint for parsing/rendering

## Best Practices

### 1. Cache Parsed ASTs

```typescript
const astCache = new Map<string, DocumentNode>();

function parseWithCache(markdown: string): DocumentNode {
  if (!astCache.has(markdown)) {
    astCache.set(markdown, parse(markdown));
  }
  return astCache.get(markdown)!;
}
```

### 2. Validate User Input

```typescript
import { parse, validate } from 'wiremd';

function safeRender(userInput: string) {
  try {
    const ast = parse(userInput, { validate: true });
    const errors = validate(ast);

    if (errors.length > 0) {
      return { success: false, errors };
    }

    const html = renderToHTML(ast);
    return { success: true, html };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### 3. Handle Errors Gracefully

```typescript
function renderWithFallback(markdown: string): string {
  try {
    const ast = parse(markdown);
    return renderToHTML(ast, { style: 'clean' });
  } catch (error) {
    console.error('Render failed:', error);
    return '<div>Failed to render wireframe</div>';
  }
}
```

### 4. Use Environment-Specific Builds

```typescript
// development
const ast = parse(markdown, {
  position: true,  // Include position for debugging
  validate: true   // Validate during development
});

// production
const ast = parse(markdown, {
  position: false,  // Skip position for smaller AST
  validate: false   // Skip validation for performance
});
```

## See Also

- [Getting Started](/guide/getting-started) - Basic usage guide
- [API Reference](../api/) - Complete API documentation
- [Examples](/examples/) - Example wireframes and outputs
