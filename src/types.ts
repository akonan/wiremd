/**
 * wiremd AST and JSON Schema Type Definitions (Simplified)
 * Version: 0.1
 */

// ============================================================================
// Core Types
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

export interface ComponentProps {
  classes?: string[];
  state?: 'disabled' | 'loading' | 'active' | 'error' | 'success' | 'warning';
  [key: string]: unknown;
}

// ============================================================================
// Document & Meta
// ============================================================================

export interface DocumentMeta {
  title?: string;
  description?: string;
  viewport?: 'mobile' | 'tablet' | 'desktop' | 'auto';
  theme?: 'sketch' | 'clean' | 'wireframe' | 'none';
  version?: string;
}

export interface DocumentNode {
  type: 'document';
  version: string;
  meta: DocumentMeta;
  children: WiremdNode[];
  position?: Location;
}

// ============================================================================
// Node Union Type (Discriminated Union)
// ============================================================================

export type WiremdNode =
  // Layout
  | { type: 'container'; containerType: 'hero' | 'card' | 'modal' | 'sidebar' | 'footer' | 'alert' | 'grid' | 'layout' | 'section' | 'form-group' | 'button-group'; props: ComponentProps; children: WiremdNode[]; position?: Location }
  | { type: 'nav'; props: ComponentProps; children: WiremdNode[]; position?: Location }
  | { type: 'nav-item'; content?: string; children?: WiremdNode[]; href?: string; props: ComponentProps; position?: Location }
  | { type: 'brand'; children: WiremdNode[]; props: ComponentProps; position?: Location }
  | { type: 'grid'; columns: number; props: ComponentProps; children: WiremdNode[]; position?: Location }
  | { type: 'grid-item'; props: ComponentProps; children: WiremdNode[]; position?: Location }

  // Forms
  | { type: 'button'; content?: string; children?: WiremdNode[]; props: ComponentProps & { variant?: 'primary' | 'secondary' | 'danger'; type?: 'button' | 'submit' | 'reset' }; position?: Location }
  | { type: 'input'; props: ComponentProps & { inputType?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'date' | 'time' | 'datetime-local' | 'search'; placeholder?: string; value?: string; required?: boolean; disabled?: boolean; pattern?: string; min?: number | string; max?: number | string; step?: number | string; width?: number }; position?: Location }
  | { type: 'textarea'; props: ComponentProps & { placeholder?: string; rows?: number; cols?: number; required?: boolean; disabled?: boolean; value?: string }; position?: Location }
  | { type: 'select'; props: ComponentProps & { placeholder?: string; required?: boolean; disabled?: boolean; multiple?: boolean; value?: string }; options: Array<{ type: 'option'; value: string; label: string; selected?: boolean; position?: Location }>; position?: Location }
  | { type: 'option'; value: string; label: string; selected?: boolean; position?: Location }
  | { type: 'checkbox'; label?: string; children?: WiremdNode[]; checked: boolean; props: ComponentProps & { required?: boolean; disabled?: boolean; value?: string }; position?: Location }
  | { type: 'radio'; label: string; selected: boolean; props: ComponentProps & { name?: string; value?: string; required?: boolean; disabled?: boolean }; children?: WiremdNode[]; position?: Location }
  | { type: 'radio-group'; name?: string; props: ComponentProps; children: WiremdNode[]; position?: Location }
  | { type: 'form'; props: ComponentProps & { action?: string; method?: 'get' | 'post' }; children: WiremdNode[]; position?: Location }

  // Content
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; content?: string; children?: WiremdNode[]; props: ComponentProps; position?: Location }
  | { type: 'paragraph'; content?: string; children?: WiremdNode[]; props: ComponentProps; position?: Location }
  | { type: 'text'; content: string; props?: ComponentProps; position?: Location }
  | { type: 'image'; src: string; alt: string; props: ComponentProps & { width?: number | string; height?: number | string; loading?: 'lazy' | 'eager' }; position?: Location }
  | { type: 'icon'; props: ComponentProps & { name: string; size?: 'small' | 'medium' | 'large' }; position?: Location }
  | { type: 'link'; href: string; title?: string; content?: string; children?: WiremdNode[]; props: ComponentProps; position?: Location }
  | { type: 'list'; ordered: boolean; props: ComponentProps; children: WiremdNode[]; position?: Location }
  | { type: 'list-item'; content?: string; children?: WiremdNode[]; props: ComponentProps; position?: Location }
  | { type: 'table'; props: ComponentProps; children: WiremdNode[]; position?: Location }
  | { type: 'table-header'; children: WiremdNode[]; position?: Location }
  | { type: 'table-row'; children: WiremdNode[]; position?: Location }
  | { type: 'table-cell'; content?: string; children?: WiremdNode[]; align?: 'left' | 'center' | 'right'; header?: boolean; position?: Location }
  | { type: 'blockquote'; props: ComponentProps; children: WiremdNode[]; position?: Location }
  | { type: 'code'; value: string; lang?: string; inline?: boolean; position?: Location }

  // UI Components
  | { type: 'tabs'; props: ComponentProps; children: WiremdNode[]; position?: Location }
  | { type: 'tab'; label: string; active: boolean; props: ComponentProps; children: WiremdNode[]; position?: Location }
  | { type: 'accordion'; props: ComponentProps; children: WiremdNode[]; position?: Location }
  | { type: 'accordion-item'; summary: string; expanded: boolean; props: ComponentProps; children: WiremdNode[]; position?: Location }
  | { type: 'breadcrumbs'; props: ComponentProps; children: WiremdNode[]; position?: Location }
  | { type: 'breadcrumb-item'; content?: string; children?: WiremdNode[]; href?: string; current?: boolean; position?: Location }
  | { type: 'alert'; alertType: 'success' | 'info' | 'warning' | 'error'; props: ComponentProps; children: WiremdNode[]; position?: Location }
  | { type: 'badge'; content: string; props: ComponentProps & { variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' }; position?: Location }
  | { type: 'separator'; props: ComponentProps; position?: Location }

  // State Components
  | { type: 'loading-state'; message?: string; props: ComponentProps; children?: WiremdNode[]; position?: Location }
  | { type: 'empty-state'; icon?: string; title?: string; props: ComponentProps; children: WiremdNode[]; position?: Location }
  | { type: 'error-state'; icon?: string; title?: string; props: ComponentProps; children: WiremdNode[]; position?: Location };

// ============================================================================
// Type Guards
// ============================================================================

export function isButtonNode(node: WiremdNode): node is Extract<WiremdNode, { type: 'button' }> {
  return node.type === 'button';
}

export function isInputNode(node: WiremdNode): node is Extract<WiremdNode, { type: 'input' }> {
  return node.type === 'input';
}

export function isContainerNode(node: WiremdNode): node is Extract<WiremdNode, { type: 'container' }> {
  return node.type === 'container';
}

export function isHeadingNode(node: WiremdNode): node is Extract<WiremdNode, { type: 'heading' }> {
  return node.type === 'heading';
}

export function isTextNode(node: WiremdNode): node is Extract<WiremdNode, { type: 'text' }> {
  return node.type === 'text';
}

export function isIconNode(node: WiremdNode): node is Extract<WiremdNode, { type: 'icon' }> {
  return node.type === 'icon';
}

export function isNavNode(node: WiremdNode): node is Extract<WiremdNode, { type: 'nav' }> {
  return node.type === 'nav';
}

export function isGridNode(node: WiremdNode): node is Extract<WiremdNode, { type: 'grid' }> {
  return node.type === 'grid';
}

export function isFormNode(node: WiremdNode): node is Extract<WiremdNode, { type: 'form' }> {
  return node.type === 'form';
}

// ============================================================================
// Options
// ============================================================================

export interface ParseOptions {
  position?: boolean;
  validate?: boolean;
  strict?: boolean;
  icons?: Record<string, string>;
}

export interface RenderOptions {
  format?: 'html' | 'json' | 'react' | 'tailwind';
  style?: 'sketch' | 'clean' | 'wireframe' | 'none' | 'tailwind' | 'material' | 'brutal';
  inlineStyles?: boolean;
  pretty?: boolean;
  classPrefix?: string;
  typescript?: boolean; // For React renderer
  componentName?: string; // For React renderer
}

// ============================================================================
// Errors
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
