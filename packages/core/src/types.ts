/**
 * wiremd AST and JSON Schema Type Definitions
 * Version: 0.1
 */

// ============================================================================
// Position and Location
// ============================================================================

export interface Position {
  line: number;
  column: number;
  offset?: number;
}

export interface Location {
  start: Position;
  end: Position;
}

// ============================================================================
// Base Node Interface
// ============================================================================

export interface BaseNode {
  type: string;
  position?: Location;
}

// ============================================================================
// Component Props
// ============================================================================

export interface ComponentProps {
  classes?: string[];
  state?: ComponentState;
  [key: string]: unknown;
}

export type ComponentState =
  | 'disabled'
  | 'loading'
  | 'active'
  | 'error'
  | 'success'
  | 'warning';

// ============================================================================
// Layout Components
// ============================================================================

export interface ContainerNode extends BaseNode {
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
    | 'section';
  props: ComponentProps;
  children: WiremdNode[];
}

export interface NavNode extends BaseNode {
  type: 'nav';
  props: ComponentProps;
  children: (NavItemNode | BrandNode | ButtonNode | TextNode)[];
}

export interface NavItemNode extends BaseNode {
  type: 'nav-item';
  content: string;
  href?: string;
  props: ComponentProps;
}

export interface BrandNode extends BaseNode {
  type: 'brand';
  children: (IconNode | TextNode)[];
  props: ComponentProps;
}

export interface GridNode extends BaseNode {
  type: 'grid';
  columns: number;
  props: ComponentProps;
  children: GridItemNode[];
}

export interface GridItemNode extends BaseNode {
  type: 'grid-item';
  props: ComponentProps;
  children: WiremdNode[];
}

// ============================================================================
// Form Components
// ============================================================================

export interface ButtonNode extends BaseNode {
  type: 'button';
  content: string;
  props: ComponentProps & {
    variant?: 'primary' | 'secondary' | 'danger';
    type?: 'button' | 'submit' | 'reset';
  };
}

export interface InputNode extends BaseNode {
  type: 'input';
  props: ComponentProps & {
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
    placeholder?: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    pattern?: string;
    min?: number | string;
    max?: number | string;
    step?: number | string;
  };
}

export interface TextareaNode extends BaseNode {
  type: 'textarea';
  props: ComponentProps & {
    placeholder?: string;
    rows?: number;
    cols?: number;
    required?: boolean;
    disabled?: boolean;
    value?: string;
  };
}

export interface SelectNode extends BaseNode {
  type: 'select';
  props: ComponentProps & {
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    value?: string;
  };
  options: SelectOptionNode[];
}

export interface SelectOptionNode extends BaseNode {
  type: 'option';
  value: string;
  label: string;
  selected?: boolean;
}

export interface CheckboxNode extends BaseNode {
  type: 'checkbox';
  label: string;
  checked: boolean;
  props: ComponentProps & {
    required?: boolean;
    disabled?: boolean;
    value?: string;
  };
}

export interface RadioNode extends BaseNode {
  type: 'radio';
  label: string;
  selected: boolean;
  props: ComponentProps & {
    name?: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
  };
}

export interface RadioGroupNode extends BaseNode {
  type: 'radio-group';
  name?: string;
  props: ComponentProps;
  children: RadioNode[];
}

export interface FormNode extends BaseNode {
  type: 'form';
  props: ComponentProps & {
    action?: string;
    method?: 'get' | 'post';
  };
  children: WiremdNode[];
}

// ============================================================================
// Content Components
// ============================================================================

export interface HeadingNode extends BaseNode {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content?: string;
  children?: (TextNode | IconNode)[];
  props: ComponentProps;
}

export interface ParagraphNode extends BaseNode {
  type: 'paragraph';
  content?: string;
  children?: WiremdNode[];
  props: ComponentProps;
}

export interface TextNode extends BaseNode {
  type: 'text';
  content: string;
  props?: ComponentProps;
}

export interface ImageNode extends BaseNode {
  type: 'image';
  src: string;
  alt: string;
  props: ComponentProps & {
    width?: number | string;
    height?: number | string;
    loading?: 'lazy' | 'eager';
  };
}

export interface IconNode extends BaseNode {
  type: 'icon';
  props: ComponentProps & {
    name: string;
    size?: 'small' | 'medium' | 'large';
  };
}

export interface LinkNode extends BaseNode {
  type: 'link';
  href: string;
  title?: string;
  content?: string;
  children?: WiremdNode[];
  props: ComponentProps;
}

export interface ListNode extends BaseNode {
  type: 'list';
  ordered: boolean;
  props: ComponentProps;
  children: ListItemNode[];
}

export interface ListItemNode extends BaseNode {
  type: 'list-item';
  content?: string;
  children?: WiremdNode[];
  props: ComponentProps;
}

export interface TableNode extends BaseNode {
  type: 'table';
  props: ComponentProps;
  children: (TableHeaderNode | TableRowNode)[];
}

export interface TableHeaderNode extends BaseNode {
  type: 'table-header';
  children: TableCellNode[];
}

export interface TableRowNode extends BaseNode {
  type: 'table-row';
  children: TableCellNode[];
}

export interface TableCellNode extends BaseNode {
  type: 'table-cell';
  content?: string;
  children?: WiremdNode[];
  align?: 'left' | 'center' | 'right';
  header?: boolean;
}

export interface BlockquoteNode extends BaseNode {
  type: 'blockquote';
  props: ComponentProps;
  children: WiremdNode[];
}

export interface CodeNode extends BaseNode {
  type: 'code';
  value: string;
  lang?: string;
  inline?: boolean;
}

// ============================================================================
// UI Components
// ============================================================================

export interface TabsNode extends BaseNode {
  type: 'tabs';
  props: ComponentProps;
  children: TabNode[];
}

export interface TabNode extends BaseNode {
  type: 'tab';
  label: string;
  active: boolean;
  props: ComponentProps;
  children: WiremdNode[];
}

export interface AccordionNode extends BaseNode {
  type: 'accordion';
  props: ComponentProps;
  children: AccordionItemNode[];
}

export interface AccordionItemNode extends BaseNode {
  type: 'accordion-item';
  summary: string;
  expanded: boolean;
  props: ComponentProps;
  children: WiremdNode[];
}

export interface BreadcrumbsNode extends BaseNode {
  type: 'breadcrumbs';
  props: ComponentProps;
  children: BreadcrumbItemNode[];
}

export interface BreadcrumbItemNode extends BaseNode {
  type: 'breadcrumb-item';
  content?: string;
  children?: (TextNode | IconNode)[];
  href?: string;
  current?: boolean;
}

export interface AlertNode extends BaseNode {
  type: 'alert';
  alertType: 'success' | 'info' | 'warning' | 'error';
  props: ComponentProps;
  children: WiremdNode[];
}

export interface BadgeNode extends BaseNode {
  type: 'badge';
  content: string;
  props: ComponentProps & {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  };
}

export interface SeparatorNode extends BaseNode {
  type: 'separator';
  props: ComponentProps;
}

// ============================================================================
// State Components
// ============================================================================

export interface LoadingStateNode extends BaseNode {
  type: 'loading-state';
  message?: string;
  props: ComponentProps;
  children?: WiremdNode[];
}

export interface EmptyStateNode extends BaseNode {
  type: 'empty-state';
  icon?: string;
  title?: string;
  props: ComponentProps;
  children: WiremdNode[];
}

export interface ErrorStateNode extends BaseNode {
  type: 'error-state';
  icon?: string;
  title?: string;
  props: ComponentProps;
  children: WiremdNode[];
}

// ============================================================================
// Document Root
// ============================================================================

export interface DocumentMeta {
  title?: string;
  description?: string;
  viewport?: 'mobile' | 'tablet' | 'desktop' | 'auto';
  theme?: 'sketch' | 'clean' | 'wireframe' | 'none';
  version?: string;
}

export interface DocumentNode extends BaseNode {
  type: 'document';
  version: string;
  meta: DocumentMeta;
  children: WiremdNode[];
}

// ============================================================================
// Union Types
// ============================================================================

export type WiremdNode =
  // Layout
  | ContainerNode
  | NavNode
  | NavItemNode
  | BrandNode
  | GridNode
  | GridItemNode
  // Forms
  | ButtonNode
  | InputNode
  | TextareaNode
  | SelectNode
  | SelectOptionNode
  | CheckboxNode
  | RadioNode
  | RadioGroupNode
  | FormNode
  // Content
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
  // UI
  | TabsNode
  | TabNode
  | AccordionNode
  | AccordionItemNode
  | BreadcrumbsNode
  | BreadcrumbItemNode
  | AlertNode
  | BadgeNode
  | SeparatorNode
  // State
  | LoadingStateNode
  | EmptyStateNode
  | ErrorStateNode
  // Document
  | DocumentNode;

// ============================================================================
// Type Guards
// ============================================================================

export function isButtonNode(node: WiremdNode): node is ButtonNode {
  return node.type === 'button';
}

export function isInputNode(node: WiremdNode): node is InputNode {
  return node.type === 'input';
}

export function isContainerNode(node: WiremdNode): node is ContainerNode {
  return node.type === 'container';
}

export function isHeadingNode(node: WiremdNode): node is HeadingNode {
  return node.type === 'heading';
}

export function isTextNode(node: WiremdNode): node is TextNode {
  return node.type === 'text';
}

export function isIconNode(node: WiremdNode): node is IconNode {
  return node.type === 'icon';
}

export function isNavNode(node: WiremdNode): node is NavNode {
  return node.type === 'nav';
}

export function isGridNode(node: WiremdNode): node is GridNode {
  return node.type === 'grid';
}

export function isFormNode(node: WiremdNode): node is FormNode {
  return node.type === 'form';
}

// ============================================================================
// Parser Options
// ============================================================================

export interface ParseOptions {
  /** Include position information in the AST */
  position?: boolean;
  /** Validate the AST after parsing */
  validate?: boolean;
  /** Strict mode - throw errors on invalid syntax */
  strict?: boolean;
  /** Custom icon set */
  icons?: Record<string, string>;
}

// ============================================================================
// Renderer Options
// ============================================================================

export interface RenderOptions {
  /** Output format */
  format?: 'html' | 'json';
  /** Visual style for HTML output */
  style?: 'sketch' | 'clean' | 'wireframe' | 'none';
  /** Include inline styles */
  inlineStyles?: boolean;
  /** Pretty print output */
  pretty?: boolean;
  /** Custom class prefix */
  classPrefix?: string;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ParseError extends Error {
  position?: Location;
  code?: string;
  severity?: 'error' | 'warning';
}

export interface ValidationError extends Error {
  node?: WiremdNode;
  path?: string[];
  code?: string;
}
