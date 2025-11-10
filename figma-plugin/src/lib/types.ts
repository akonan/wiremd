/**
 * wiremd Type Definitions for Figma Plugin
 * Mirrors the types from wiremd core library
 */

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
  | { type: 'input'; props: ComponentProps & { inputType?: string; placeholder?: string; value?: string; required?: boolean; disabled?: boolean }; position?: Location }
  | { type: 'textarea'; props: ComponentProps & { placeholder?: string; rows?: number; cols?: number; required?: boolean; disabled?: boolean; value?: string }; position?: Location }
  | { type: 'select'; props: ComponentProps & { placeholder?: string; required?: boolean; disabled?: boolean; multiple?: boolean; value?: string }; options: Array<{ type: 'option'; value: string; label: string; selected?: boolean; position?: Location }>; position?: Location }
  | { type: 'checkbox'; label?: string; children?: WiremdNode[]; checked: boolean; props: ComponentProps; position?: Location }
  | { type: 'radio'; label: string; selected: boolean; props: ComponentProps; position?: Location }
  | { type: 'radio-group'; name?: string; props: ComponentProps; children: WiremdNode[]; position?: Location }

  // Content
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; content?: string; children?: WiremdNode[]; props: ComponentProps; position?: Location }
  | { type: 'paragraph'; content?: string; children?: WiremdNode[]; props: ComponentProps; position?: Location }
  | { type: 'text'; content: string; props?: ComponentProps; position?: Location }
  | { type: 'image'; src: string; alt: string; props: ComponentProps; position?: Location }
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
  | { type: 'separator'; props: ComponentProps; position?: Location };

export interface ConversionOptions {
  theme?: 'sketch' | 'clean' | 'wireframe' | 'none';
  baseX?: number;
  baseY?: number;
  spacing?: number;
}
