# Plugin API

Create custom renderers and extend wiremd's functionality.

## Overview

While wiremd provides built-in renderers for HTML, JSON, React, and Tailwind, you can create custom renderers for other frameworks, formats, or use cases.

## Custom Renderer Architecture

A custom renderer is a function that traverses the wiremd AST and produces output in your desired format.

### Basic Structure

```typescript
import type { DocumentNode, WiremdNode } from 'wiremd';

interface CustomRenderContext {
  // Your custom options
  [key: string]: any;
}

function renderNode(node: WiremdNode, context: CustomRenderContext): string {
  // Handle different node types
  switch (node.type) {
    case 'button':
      return renderButton(node, context);
    case 'input':
      return renderInput(node, context);
    case 'heading':
      return renderHeading(node, context);
    // ... handle all node types
    default:
      return '';
  }
}

export function renderToCustomFormat(
  ast: DocumentNode,
  options: CustomRenderContext = {}
): string {
  const context = { ...options };

  // Render all children
  const content = ast.children
    .map(child => renderNode(child, context))
    .join('\n');

  // Wrap in document structure
  return wrapDocument(content, context);
}
```

## Example: Vue Renderer

Create a custom renderer for Vue components:

```typescript
import type { DocumentNode, WiremdNode, ButtonNode, InputNode } from 'wiremd';

interface VueRenderContext {
  componentName?: string;
  typescript?: boolean;
  composition?: boolean; // Composition API vs Options API
}

function renderButton(node: ButtonNode, context: VueRenderContext): string {
  const classes = node.props.classes?.join(' ') || '';
  const variant = node.props.variant || 'default';

  return `    <button class="${classes}" :variant="${variant}">
      ${node.content || ''}
    </button>`;
}

function renderInput(node: InputNode, context: VueRenderContext): string {
  const type = node.props.inputType || 'text';
  const placeholder = node.props.placeholder || '';
  const required = node.props.required ? 'required' : '';

  return `    <input
      type="${type}"
      placeholder="${placeholder}"
      ${required}
      v-model="formData.${node.props.name || 'input'}"
    />`;
}

function renderHeading(node: any, context: VueRenderContext): string {
  const tag = `h${node.level}`;
  return `    <${tag}>${node.content || ''}</${tag}>`;
}

function renderNode(node: WiremdNode, context: VueRenderContext, indent: number = 2): string {
  const spaces = ' '.repeat(indent);

  switch (node.type) {
    case 'button':
      return renderButton(node, context);
    case 'input':
      return renderInput(node, context);
    case 'heading':
      return renderHeading(node, context);
    case 'container':
      const children = node.children
        .map(child => renderNode(child, context, indent + 2))
        .join('\n');
      return `${spaces}<div class="container ${node.containerType}">\n${children}\n${spaces}</div>`;
    default:
      if ('children' in node && node.children) {
        return node.children.map(child => renderNode(child, context, indent)).join('\n');
      }
      return '';
  }
}

export function renderToVue(
  ast: DocumentNode,
  options: VueRenderContext = {}
): string {
  const {
    componentName = 'WiremdComponent',
    typescript = true,
    composition = true
  } = options;

  const content = ast.children
    .map(child => renderNode(child, options))
    .join('\n');

  if (composition) {
    // Composition API
    const tsAnnotation = typescript ? '<{}, {}>' : '';
    return `<template>
  <div class="wiremd-root">
${content}
  </div>
</template>

<script setup${typescript ? ' lang="ts"' : ''}>
import { reactive } from 'vue';

const formData = reactive({
  // Form data here
});
</script>

<style scoped>
/* Component styles */
</style>`;
  } else {
    // Options API
    return `<template>
  <div class="wiremd-root">
${content}
  </div>
</template>

<script${typescript ? ' lang="ts"' : ''}>
export default {
  name: '${componentName}',
  data() {
    return {
      formData: {}
    };
  }
};
</script>`;
  }
}
```

### Usage

```typescript
import { parse } from 'wiremd';
import { renderToVue } from './vue-renderer';

const ast = parse(`
## Contact Form

Name
[_____________________________]{name:name}

Email
[_____________________________]{type:email name:email}

[Submit]{.primary}
`);

const vueComponent = renderToVue(ast, {
  componentName: 'ContactForm',
  typescript: true,
  composition: true
});

console.log(vueComponent);
```

## Example: Svelte Renderer

```typescript
import type { DocumentNode, WiremdNode } from 'wiremd';

interface SvelteRenderContext {
  componentName?: string;
  typescript?: boolean;
}

function renderNodeToSvelte(node: WiremdNode, context: SvelteRenderContext): string {
  switch (node.type) {
    case 'button':
      const onClick = node.props.onClick || '';
      return `  <button class="${node.props.classes?.join(' ') || ''}" on:click={${onClick}}>
    ${node.content || ''}
  </button>`;

    case 'input':
      const name = node.props.name || 'input';
      return `  <input
    type="${node.props.inputType || 'text'}"
    placeholder="${node.props.placeholder || ''}"
    bind:value={${name}}
  />`;

    case 'heading':
      return `  <h${node.level}>${node.content || ''}</h${node.level}>`;

    case 'container':
      const children = node.children
        .map(child => renderNodeToSvelte(child, context))
        .join('\n');
      return `  <div class="container ${node.containerType}">
${children}
  </div>`;

    default:
      return '';
  }
}

export function renderToSvelte(
  ast: DocumentNode,
  options: SvelteRenderContext = {}
): string {
  const { typescript = false } = options;

  const content = ast.children
    .map(child => renderNodeToSvelte(child, options))
    .join('\n');

  return `${typescript ? '<script lang="ts">' : '<script>'}
  let formData = {
    name: '',
    email: ''
  };

  function handleSubmit() {
    console.log('Form submitted:', formData);
  }
</script>

${content}

<style>
  /* Component styles */
</style>`;
}
```

## Example: Markdown Renderer

Convert the AST back to markdown (useful for transformations):

```typescript
import type { DocumentNode, WiremdNode } from 'wiremd';

function nodeToMarkdown(node: WiremdNode, indent: string = ''): string {
  switch (node.type) {
    case 'heading':
      const hashes = '#'.repeat(node.level);
      return `${indent}${hashes} ${node.content || ''}`;

    case 'paragraph':
      return `${indent}${node.content || ''}`;

    case 'button':
      const classes = node.props.classes?.length
        ? `{.${node.props.classes.join('.')}}`
        : '';
      return `${indent}[${node.content || ''}]${classes}`;

    case 'input':
      const width = node.props.width || 30;
      const underscores = '_'.repeat(width);
      const attrs = [];
      if (node.props.inputType && node.props.inputType !== 'text') {
        attrs.push(`type:${node.props.inputType}`);
      }
      if (node.props.required) attrs.push('required');
      const attrStr = attrs.length ? `{${attrs.join(' ')}}` : '';
      return `${indent}[${underscores}]${attrStr}`;

    case 'container':
      const containerHeader = `${indent}> ${node.containerType}`;
      const children = node.children
        .map(child => nodeToMarkdown(child, indent))
        .join('\n');
      return `${containerHeader}\n${children}`;

    case 'grid':
      const gridHeader = `${indent}> Grid(${node.columns})`;
      const gridChildren = node.children
        .map(child => nodeToMarkdown(child, indent))
        .join('\n');
      return `${gridHeader}\n${gridChildren}`;

    case 'list':
      const bullet = node.ordered ? '1.' : '-';
      return node.children
        .map((child, i) => {
          if (child.type === 'list-item') {
            return `${indent}${node.ordered ? `${i + 1}.` : bullet} ${child.content || ''}`;
          }
          return '';
        })
        .join('\n');

    default:
      if ('children' in node && node.children) {
        return node.children.map(child => nodeToMarkdown(child, indent)).join('\n');
      }
      return '';
  }
}

export function renderToMarkdown(ast: DocumentNode): string {
  return ast.children.map(child => nodeToMarkdown(child)).join('\n\n');
}
```

### Usage

```typescript
import { parse } from 'wiremd';
import { renderToMarkdown } from './markdown-renderer';

// Parse and transform
const ast = parse('## Title\n[Button]');

// Modify AST
ast.children.push({
  type: 'paragraph',
  content: 'Added programmatically',
  props: {}
});

// Convert back to markdown
const markdown = renderToMarkdown(ast);
console.log(markdown);
```

## Example: JSON Schema Renderer

Generate JSON Schema from wiremd AST:

```typescript
import type { DocumentNode, WiremdNode } from 'wiremd';

interface JSONSchemaProperty {
  type: string;
  description?: string;
  required?: boolean;
  enum?: string[];
  properties?: Record<string, JSONSchemaProperty>;
}

function extractFormSchema(node: WiremdNode): Record<string, JSONSchemaProperty> {
  const properties: Record<string, JSONSchemaProperty> = {};

  function traverse(n: WiremdNode) {
    if (n.type === 'input') {
      const name = n.props.name as string || 'unnamed';
      properties[name] = {
        type: 'string',
        description: n.props.placeholder as string,
        required: n.props.required as boolean
      };

      if (n.props.inputType === 'email') {
        properties[name].format = 'email';
      } else if (n.props.inputType === 'number') {
        properties[name].type = 'number';
      }
    } else if (n.type === 'select') {
      const name = n.props.name as string || 'select';
      properties[name] = {
        type: 'string',
        enum: n.options.map(opt => opt.value)
      };
    }

    if ('children' in n && n.children) {
      n.children.forEach(traverse);
    }
  }

  traverse(node);
  return properties;
}

export function renderToJSONSchema(ast: DocumentNode): string {
  const properties: Record<string, JSONSchemaProperty> = {};
  const required: string[] = [];

  ast.children.forEach(child => {
    const childProps = extractFormSchema(child);
    Object.assign(properties, childProps);

    Object.entries(childProps).forEach(([key, value]) => {
      if (value.required) {
        required.push(key);
      }
    });
  });

  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined
  };

  return JSON.stringify(schema, null, 2);
}
```

## Custom Renderer Best Practices

### 1. Handle All Node Types

Always provide a default case for unknown node types:

```typescript
function renderNode(node: WiremdNode, context: any): string {
  switch (node.type) {
    case 'button':
      return renderButton(node, context);
    // ... other cases
    default:
      console.warn(`Unhandled node type: ${node.type}`);
      return '';
  }
}
```

### 2. Preserve Type Safety

Use TypeScript's type narrowing:

```typescript
import type { WiremdNode, ButtonNode } from 'wiremd';

function renderNode(node: WiremdNode): string {
  if (node.type === 'button') {
    // TypeScript knows node is ButtonNode here
    return `<button>${node.content}</button>`;
  }
  // ...
}
```

### 3. Make Context Configurable

Allow users to configure the renderer:

```typescript
interface CustomContext {
  indentSize?: number;
  lineEnding?: '\n' | '\r\n';
  quote?: '"' | "'";
  // ... other options
}

function renderToCustom(
  ast: DocumentNode,
  options: CustomContext = {}
): string {
  const context: Required<CustomContext> = {
    indentSize: 2,
    lineEnding: '\n',
    quote: '"',
    ...options
  };

  // Use context values
}
```

### 4. Handle Children Recursively

```typescript
function renderWithChildren(
  node: WiremdNode,
  context: any,
  depth: number = 0
): string {
  const indent = ' '.repeat(depth * 2);

  if ('children' in node && node.children) {
    const childrenHTML = node.children
      .map(child => renderWithChildren(child, context, depth + 1))
      .join('\n');

    return `${indent}<div>\n${childrenHTML}\n${indent}</div>`;
  }

  return `${indent}<div />`;
}
```

### 5. Provide Error Handling

```typescript
export function renderToCustom(ast: DocumentNode): string {
  try {
    validate(ast); // Validate before rendering

    return ast.children.map(renderNode).join('\n');
  } catch (error) {
    console.error('Rendering failed:', error);
    throw new Error(`Failed to render: ${error.message}`);
  }
}
```

## Testing Custom Renderers

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { parse } from 'wiremd';
import { renderToCustom } from './custom-renderer';

describe('Custom Renderer', () => {
  it('should render buttons', () => {
    const ast = parse('[Submit]');
    const output = renderToCustom(ast);

    expect(output).toContain('button');
    expect(output).toContain('Submit');
  });

  it('should handle empty AST', () => {
    const ast = parse('');
    const output = renderToCustom(ast);

    expect(output).toBeDefined();
  });

  it('should preserve classes', () => {
    const ast = parse('[Button]{.primary .large}');
    const output = renderToCustom(ast);

    expect(output).toContain('primary');
    expect(output).toContain('large');
  });
});
```

### Snapshot Tests

```typescript
import { test, expect } from 'vitest';
import { parse } from 'wiremd';
import { renderToCustom } from './custom-renderer';

test('renders complex form correctly', () => {
  const markdown = `
## Login Form

Username
[_____________________________]

Password
[_____________________________]{type:password}

[Login]{.primary} [Cancel]
  `;

  const ast = parse(markdown);
  const output = renderToCustom(ast);

  expect(output).toMatchSnapshot();
});
```

## Publishing Custom Renderers

### Package Structure

```
my-wiremd-renderer/
├── src/
│   ├── index.ts
│   └── renderer.ts
├── dist/
├── package.json
├── README.md
└── tsconfig.json
```

### package.json

```json
{
  "name": "wiremd-vue-renderer",
  "version": "1.0.0",
  "description": "Vue renderer for wiremd",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "peerDependencies": {
    "wiremd": "^0.1.0"
  },
  "keywords": [
    "wiremd",
    "renderer",
    "vue",
    "plugin"
  ]
}
```

### Usage in Projects

```typescript
import { parse } from 'wiremd';
import { renderToVue } from 'wiremd-vue-renderer';

const ast = parse('## Form\n[Submit]');
const vue = renderToVue(ast);
```

## See Also

- [Parser API](/api/parser) - Understanding the AST
- [Type Definitions](/api/types) - Complete type reference
- [Renderer APIs](/api/renderer) - Built-in renderers
- [Examples](https://github.com/akonan/wiremd/tree/main/examples) - Example renderers
