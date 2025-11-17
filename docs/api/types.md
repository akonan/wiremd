# Type Definitions

Complete TypeScript type reference for wiremd.

## Overview

wiremd is fully typed with TypeScript. All types are exported from the main package:

```typescript
import type {
  DocumentNode,
  WiremdNode,
  ParseOptions,
  RenderOptions,
  ComponentProps,
  // ... and more
} from 'wiremd';
```

## Core Types

### DocumentNode

The root AST node representing a complete wiremd document.

```typescript
interface DocumentNode {
  // Node type identifier
  type: 'document';

  // Syntax version
  version: string;

  // Document metadata
  meta: DocumentMeta;

  // Top-level child nodes
  children: WiremdNode[];

  // Optional position information
  position?: Location;
}
```

#### Example

```typescript
import { parse } from 'wiremd';
import type { DocumentNode } from 'wiremd';

const ast: DocumentNode = parse('## Title\n[Button]');

console.log(ast.type); // 'document'
console.log(ast.version); // '0.1'
console.log(ast.children.length); // 2
```

### DocumentMeta

Metadata for the wiremd document.

```typescript
interface DocumentMeta {
  // Document title (usually from first heading)
  title?: string;

  // Document description
  description?: string;

  // Target viewport size
  viewport?: 'mobile' | 'tablet' | 'desktop' | 'auto';

  // Visual theme
  theme?: 'sketch' | 'clean' | 'wireframe' | 'none';

  // Syntax version
  version?: string;
}
```

#### Example

```typescript
import { parse } from 'wiremd';

const ast = parse('## My Wireframe\nA description');

console.log(ast.meta.title); // 'My Wireframe'
console.log(ast.meta.viewport); // undefined (defaults to 'auto')
```

### WiremdNode

Union type representing all possible AST node types.

```typescript
type WiremdNode =
  // Layout nodes
  | ContainerNode
  | NavNode
  | NavItemNode
  | BrandNode
  | GridNode
  | GridItemNode

  // Form nodes
  | ButtonNode
  | InputNode
  | TextareaNode
  | SelectNode
  | OptionNode
  | CheckboxNode
  | RadioNode
  | RadioGroupNode
  | FormNode

  // Content nodes
  | HeadingNode
  | ParagraphNode
  | TextNode
  | ImageNode
  | IconNode
  | LinkNode
  | ListNode
  | ListItemNode
  | TableNode
  | TableHeaderNode
  | TableRowNode
  | TableCellNode
  | BlockquoteNode
  | CodeNode

  // UI Component nodes
  | TabsNode
  | TabNode
  | AccordionNode
  | AccordionItemNode
  | BreadcrumbsNode
  | BreadcrumbItemNode
  | AlertNode
  | BadgeNode
  | SeparatorNode

  // State nodes
  | LoadingStateNode
  | EmptyStateNode
  | ErrorStateNode;
```

### ComponentProps

Base properties available on all component nodes.

```typescript
interface ComponentProps {
  // CSS classes from markdown syntax
  classes?: string[];

  // Component state
  state?: 'disabled' | 'loading' | 'active' | 'error' | 'success' | 'warning';

  // Additional properties (extensible)
  [key: string]: unknown;
}
```

#### Example

```typescript
import { parse } from 'wiremd';

const ast = parse('[Button]{.primary disabled}');

const button = ast.children[0];
if (button.type === 'button') {
  console.log(button.props.classes); // ['primary']
  console.log(button.props.state); // 'disabled'
}
```

## Layout Nodes

### ContainerNode

Generic container for grouping elements.

```typescript
interface ContainerNode {
  type: 'container';

  containerType:
    | 'hero'
    | 'card'
    | 'modal'
    | 'sidebar'
    | 'footer'
    | 'alert'
    | 'grid'
    | 'layout'
    | 'section'
    | 'form-group'
    | 'button-group';

  props: ComponentProps;
  children: WiremdNode[];
  position?: Location;
}
```

#### Example

```typescript
const cardMarkdown = `
> Card
### Product Title
$99.99
[Buy Now]
`;

const ast = parse(cardMarkdown);
const card = ast.children[0];

if (card.type === 'container' && card.containerType === 'card') {
  console.log('Found a card container');
  console.log('Children:', card.children.length);
}
```

### GridNode

CSS Grid layout container.

```typescript
interface GridNode {
  type: 'grid';

  // Number of columns
  columns: number;

  props: ComponentProps;
  children: WiremdNode[];
  position?: Location;
}
```

#### Example

```typescript
const gridMarkdown = `
> Grid(3)
[Item 1]
[Item 2]
[Item 3]
`;

const ast = parse(gridMarkdown);
const grid = ast.children[0];

if (grid.type === 'grid') {
  console.log('Columns:', grid.columns); // 3
  console.log('Items:', grid.children.length); // 3
}
```

### NavNode

Navigation container.

```typescript
interface NavNode {
  type: 'nav';
  props: ComponentProps;
  children: WiremdNode[];
  position?: Location;
}
```

### NavItemNode

Navigation item/link.

```typescript
interface NavItemNode {
  type: 'nav-item';
  content?: string;
  children?: WiremdNode[];
  href?: string;
  props: ComponentProps;
  position?: Location;
}
```

## Form Nodes

### ButtonNode

Button element.

```typescript
interface ButtonNode {
  type: 'button';

  // Button text content
  content?: string;

  // Child nodes (for complex buttons)
  children?: WiremdNode[];

  props: ComponentProps & {
    // Visual variant
    variant?: 'primary' | 'secondary' | 'danger';

    // Button type
    type?: 'button' | 'submit' | 'reset';
  };

  position?: Location;
}
```

#### Example

```typescript
const ast = parse('[Submit]{.primary type:submit}');

const button = ast.children[0];
if (button.type === 'button') {
  console.log('Content:', button.content); // 'Submit'
  console.log('Variant:', button.props.variant); // 'primary'
  console.log('Type:', button.props.type); // 'submit'
}
```

### InputNode

Text input field.

```typescript
interface InputNode {
  type: 'input';

  props: ComponentProps & {
    // Input type
    inputType?:
      | 'text'
      | 'email'
      | 'password'
      | 'tel'
      | 'url'
      | 'number'
      | 'date'
      | 'time'
      | 'datetime-local'
      | 'search';

    // Placeholder text
    placeholder?: string;

    // Default value
    value?: string;

    // HTML5 validation
    required?: boolean;
    disabled?: boolean;
    pattern?: string;

    // Numeric constraints
    min?: number | string;
    max?: number | string;
    step?: number | string;

    // Visual width (characters)
    width?: number;
  };

  position?: Location;
}
```

#### Example

```typescript
const ast = parse('[_____________________________]{type:email required placeholder:"Enter email"}');

const input = ast.children[0];
if (input.type === 'input') {
  console.log('Type:', input.props.inputType); // 'email'
  console.log('Required:', input.props.required); // true
  console.log('Placeholder:', input.props.placeholder); // 'Enter email'
}
```

### TextareaNode

Multi-line text input.

```typescript
interface TextareaNode {
  type: 'textarea';

  props: ComponentProps & {
    placeholder?: string;
    rows?: number;
    cols?: number;
    required?: boolean;
    disabled?: boolean;
    value?: string;
  };

  position?: Location;
}
```

### SelectNode

Dropdown select menu.

```typescript
interface SelectNode {
  type: 'select';

  props: ComponentProps & {
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    value?: string;
  };

  // Select options
  options: OptionNode[];

  position?: Location;
}

interface OptionNode {
  type: 'option';
  value: string;
  label: string;
  selected?: boolean;
  position?: Location;
}
```

#### Example

```typescript
const selectMarkdown = `
[v] Country
  - United States
  - Canada
  - * Mexico
`;

const ast = parse(selectMarkdown);
const select = ast.children[0];

if (select.type === 'select') {
  console.log('Options:', select.options.length); // 3

  select.options.forEach(opt => {
    console.log(`${opt.label}: ${opt.selected ? 'selected' : 'not selected'}`);
  });
}
```

### CheckboxNode

Checkbox input.

```typescript
interface CheckboxNode {
  type: 'checkbox';

  // Checkbox label
  label?: string;

  // Child nodes (for complex labels)
  children?: WiremdNode[];

  // Checked state
  checked: boolean;

  props: ComponentProps & {
    required?: boolean;
    disabled?: boolean;
    value?: string;
  };

  position?: Location;
}
```

### RadioNode

Radio button input.

```typescript
interface RadioNode {
  type: 'radio';

  // Radio label
  label: string;

  // Selected state
  selected: boolean;

  props: ComponentProps & {
    name?: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
  };

  children?: WiremdNode[];
  position?: Location;
}
```

### FormNode

Form container.

```typescript
interface FormNode {
  type: 'form';

  props: ComponentProps & {
    // Form action URL
    action?: string;

    // HTTP method
    method?: 'get' | 'post';
  };

  children: WiremdNode[];
  position?: Location;
}
```

## Content Nodes

### HeadingNode

Heading element (h1-h6).

```typescript
interface HeadingNode {
  type: 'heading';

  // Heading level (1-6)
  level: 1 | 2 | 3 | 4 | 5 | 6;

  // Text content
  content?: string;

  // Child nodes (for complex headings)
  children?: WiremdNode[];

  props: ComponentProps;
  position?: Location;
}
```

#### Example

```typescript
const ast = parse('## Welcome to wiremd');

const heading = ast.children[0];
if (heading.type === 'heading') {
  console.log('Level:', heading.level); // 2
  console.log('Content:', heading.content); // 'Welcome to wiremd'
}
```

### ParagraphNode

Paragraph element.

```typescript
interface ParagraphNode {
  type: 'paragraph';
  content?: string;
  children?: WiremdNode[];
  props: ComponentProps;
  position?: Location;
}
```

### TextNode

Plain text content.

```typescript
interface TextNode {
  type: 'text';
  content: string;
  props?: ComponentProps;
  position?: Location;
}
```

### ImageNode

Image element.

```typescript
interface ImageNode {
  type: 'image';

  // Image source URL
  src: string;

  // Alt text
  alt: string;

  props: ComponentProps & {
    width?: number | string;
    height?: number | string;
    loading?: 'lazy' | 'eager';
  };

  position?: Location;
}
```

#### Example

```typescript
const ast = parse('![Product](product.jpg){width:300 height:200}');

const image = ast.children[0];
if (image.type === 'image') {
  console.log('Source:', image.src); // 'product.jpg'
  console.log('Alt:', image.alt); // 'Product'
  console.log('Width:', image.props.width); // 300
}
```

### LinkNode

Hyperlink element.

```typescript
interface LinkNode {
  type: 'link';
  href: string;
  title?: string;
  content?: string;
  children?: WiremdNode[];
  props: ComponentProps;
  position?: Location;
}
```

### ListNode

Ordered or unordered list.

```typescript
interface ListNode {
  type: 'list';

  // true for ordered (ol), false for unordered (ul)
  ordered: boolean;

  props: ComponentProps;
  children: WiremdNode[];
  position?: Location;
}
```

### TableNode

Table structure.

```typescript
interface TableNode {
  type: 'table';
  props: ComponentProps;
  children: WiremdNode[]; // TableHeaderNode and TableRowNode
  position?: Location;
}

interface TableRowNode {
  type: 'table-row';
  children: WiremdNode[]; // TableCellNode
  position?: Location;
}

interface TableCellNode {
  type: 'table-cell';
  content?: string;
  children?: WiremdNode[];
  align?: 'left' | 'center' | 'right';
  header?: boolean;
  position?: Location;
}
```

## Options Types

### ParseOptions

Configuration for the parser.

```typescript
interface ParseOptions {
  // Include position information in AST (default: false)
  position?: boolean;

  // Validate AST during parsing (default: false)
  validate?: boolean;

  // Enable strict parsing mode (default: false)
  strict?: boolean;

  // Custom icon mappings
  icons?: Record<string, string>;
}
```

#### Example

```typescript
import { parse } from 'wiremd';
import type { ParseOptions } from 'wiremd';

const options: ParseOptions = {
  position: true,
  validate: true,
  strict: false,
  icons: {
    'home': 'fa-home',
    'user': 'fa-user'
  }
};

const ast = parse('## Title\n[Button]', options);
```

### RenderOptions

Configuration for renderers.

```typescript
interface RenderOptions {
  // Output format (for render() function)
  format?: 'html' | 'json' | 'react' | 'tailwind';

  // Visual style (for HTML renderer)
  style?: 'sketch' | 'clean' | 'wireframe' | 'none' | 'tailwind' | 'material' | 'brutal';

  // Inline CSS in HTML (default: true)
  inlineStyles?: boolean;

  // Pretty-print output (default: true)
  pretty?: boolean;

  // CSS class prefix (default: 'wmd-')
  classPrefix?: string;

  // Generate TypeScript (React renderer, default: true)
  typescript?: boolean;

  // Component name (React renderer, default: 'WiremdComponent')
  componentName?: string;
}
```

#### Example

```typescript
import { renderToHTML } from 'wiremd';
import type { RenderOptions } from 'wiremd';

const options: RenderOptions = {
  style: 'clean',
  pretty: true,
  inlineStyles: true,
  classPrefix: 'my-app-'
};

const html = renderToHTML(ast, options);
```

## Position Types

### Position

Location in source document.

```typescript
interface Position {
  line: number;
  column: number;
  offset?: number;
}
```

### Location

Range in source document.

```typescript
interface Location {
  start: Position;
  end: Position;
}
```

#### Example

```typescript
import { parse } from 'wiremd';

const ast = parse('[Button]', { position: true });

const button = ast.children[0];
if (button.position) {
  console.log('Start:', button.position.start.line, button.position.start.column);
  console.log('End:', button.position.end.line, button.position.end.column);
}
```

## Error Types

### ParseError

Error during parsing.

```typescript
interface ParseError extends Error {
  position?: Location;
  code?: string;
  severity?: 'error' | 'warning';
}
```

### ValidationError

Error during AST validation.

```typescript
interface ValidationError extends Error {
  node?: WiremdNode;
  path?: string[];
  code?: string;
}
```

## Type Guards

wiremd provides type guard functions for narrowing node types:

```typescript
// Check if node is a button
function isButtonNode(node: WiremdNode): node is ButtonNode;

// Check if node is an input
function isInputNode(node: WiremdNode): node is InputNode;

// Check if node is a container
function isContainerNode(node: WiremdNode): node is ContainerNode;

// Check if node is a heading
function isHeadingNode(node: WiremdNode): node is HeadingNode;

// Check if node is a text node
function isTextNode(node: WiremdNode): node is TextNode;

// ... and more
```

### Example

```typescript
import { parse, isButtonNode, isInputNode } from 'wiremd';

const ast = parse('[Submit]\n[_____________________________]');

ast.children.forEach(node => {
  if (isButtonNode(node)) {
    console.log('Button:', node.content);
    console.log('Variant:', node.props.variant);
  } else if (isInputNode(node)) {
    console.log('Input type:', node.props.inputType);
  }
});
```

## Working with Types

### Type-safe AST Traversal

```typescript
import type { WiremdNode, DocumentNode } from 'wiremd';

function traverseAST(
  node: DocumentNode | WiremdNode,
  callback: (node: WiremdNode) => void
): void {
  if (node.type === 'document') {
    node.children.forEach(child => {
      callback(child);
      if ('children' in child && Array.isArray(child.children)) {
        child.children.forEach(n => traverseAST(n, callback));
      }
    });
  } else {
    callback(node);
    if ('children' in node && Array.isArray(node.children)) {
      node.children.forEach(n => traverseAST(n, callback));
    }
  }
}

// Usage
traverseAST(ast, (node) => {
  console.log(`Found ${node.type} node`);
});
```

### Custom Node Processors

```typescript
import type { WiremdNode, ButtonNode, InputNode } from 'wiremd';

type NodeProcessor<T extends WiremdNode> = (node: T) => void;

const buttonProcessor: NodeProcessor<ButtonNode> = (button) => {
  console.log(`Button: ${button.content}, variant: ${button.props.variant}`);
};

const inputProcessor: NodeProcessor<InputNode> = (input) => {
  console.log(`Input: ${input.props.inputType}, required: ${input.props.required}`);
};

function processNode(node: WiremdNode): void {
  if (node.type === 'button') {
    buttonProcessor(node);
  } else if (node.type === 'input') {
    inputProcessor(node);
  }
}
```

## See Also

- [Parser API](/api/parser) - Using types with the parser
- [Renderer APIs](/api/renderer) - Using types with renderers
- [Plugin API](/api/plugins) - Creating type-safe plugins
- [Source Code](https://github.com/akonan/wiremd/blob/main/src/types.ts) - Full type definitions
