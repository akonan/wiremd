import type { DocumentNode, NodeOf, RenderHelpers, RenderOptions, RenderResult, WiremdNode } from '../types.js';
import { getStyleCSS } from './styles.js';
import {
  analyzeFrameworkState,
  buildPrefixedClasses,
  escapeHtml,
  escapeJsString,
  getIconGlyph,
  repeatString,
} from './plugin-utils.js';

interface AngularOptions extends RenderOptions {
  componentName?: string;
  selector?: string;
  standalone?: boolean;
  inlineStyles?: boolean;
}

interface AngularContext {
  classPrefix: string;
  analysis: ReturnType<typeof analyzeFrameworkState>;
  helpers: RenderHelpers;
}

export function renderAngularArtifacts(
  ast: DocumentNode,
  options: AngularOptions = {},
  helpers: RenderHelpers,
): RenderResult {
  const classPrefix = options.classPrefix || 'wmd-';
  const componentName = options.componentName || 'WiremdComponent';
  const selector = options.selector || `app-${helpers.toKebabCase(componentName, 'wiremd')}`;
  const standalone = options.standalone !== false;
  const analysis = analyzeFrameworkState(ast, helpers);
  const context: AngularContext = {
    classPrefix,
    analysis,
    helpers,
  };
  const baseName = `${helpers.toKebabCase(componentName, 'wiremd')}.component`;
  const template = `<div class="${classPrefix}root ${classPrefix}${options.style || 'sketch'}">\n${ast.children.map((child) => renderAngularNode(child, context, 0)).join('\n')}\n</div>`;
  const styles = getStyleCSS(options.style || 'sketch', classPrefix);
  const componentTs = renderAngularComponentTs(componentName, selector, baseName, analysis, styles, standalone, Boolean(options.inlineStyles));

  const artifacts = [
    { filename: `${baseName}.ts`, content: componentTs },
    { filename: `${baseName}.html`, content: template },
  ];

  if (!options.inlineStyles) {
    artifacts.push({ filename: `${baseName}.css`, content: styles });
  }

  return {
    format: 'angular',
    artifacts,
  };
}

function renderAngularComponentTs(
  componentName: string,
  selector: string,
  baseName: string,
  analysis: ReturnType<typeof analyzeFrameworkState>,
  styles: string,
  standalone: boolean,
  inlineStyles: boolean,
): string {
  const controls = analysis.fields.length === 0
    ? '    placeholder: this.fb.control(\'\'),'
    : analysis.fields.map((field) => `    ${field.key}: this.fb.control(${renderAngularValue(field.initialValue)}),`).join('\n');
  const styleMetadata = inlineStyles
    ? `styles: [\`${styles.replace(/`/g, '\\`')}\`]`
    : `styleUrls: ['./${baseName}.css']`;
  const standaloneMetadata = standalone ? '  standalone: true,\n  imports: [CommonModule, ReactiveFormsModule],\n' : '';

  return `import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: '${selector}',
${standaloneMetadata}  templateUrl: './${baseName}.html',
  ${styleMetadata},
})
export class ${componentName} {
  @Output() submitted = new EventEmitter<Record<string, unknown>>();
  @Output() buttonClick = new EventEmitter<string>();

  readonly form = this.fb.group({
${controls}
  });

  constructor(private readonly fb: FormBuilder) {}

  handleSubmit(): void {
    this.submitted.emit(this.form.getRawValue() as Record<string, unknown>);
  }

  handleButtonClick(label: string): void {
    this.buttonClick.emit(label);
  }
}`;
}

function renderAngularNode(node: WiremdNode, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);

  switch (node.type) {
    case 'button':
      return renderAngularButton(node, context, indent);
    case 'input':
      return renderAngularInput(node, context, indent);
    case 'textarea':
      return renderAngularTextarea(node, context, indent);
    case 'select':
      return renderAngularSelect(node, context, indent);
    case 'checkbox':
      return renderAngularCheckbox(node, context, indent);
    case 'radio':
      return renderAngularRadio(node, context, indent);
    case 'radio-group':
      return renderAngularWrapper('div', 'radio-group', node.children, node.props, context, indent);
    case 'icon':
      return `${spaces}<span class="${buildPrefixedClasses(context.classPrefix, 'icon', node.props)}" data-icon="${escapeHtml(node.props.name)}" aria-label="${escapeHtml(node.props.name)}">${getIconGlyph(node.props.name)}</span>`;
    case 'container':
      return renderAngularWrapper('div', `container-${node.containerType}`, node.children, node.props, context, indent);
    case 'nav':
      return renderAngularWrapper('nav', 'nav', node.children, node.props, context, indent);
    case 'nav-item':
      return renderAngularNavItem(node, context, indent);
    case 'brand':
      return renderAngularWrapper('div', 'brand', node.children, node.props, context, indent);
    case 'grid':
      return renderAngularGrid(node, context, indent);
    case 'grid-item':
      return renderAngularWrapper('div', 'grid-item', node.children, node.props, context, indent);
    case 'form':
      return renderAngularForm(node, context, indent);
    case 'heading':
      return renderAngularHeading(node, context, indent);
    case 'paragraph':
      return renderAngularParagraph(node, context, indent);
    case 'text':
      return `${spaces}${escapeHtml(node.content)}`;
    case 'image':
      return renderAngularImage(node, context, indent);
    case 'link':
      return renderAngularLink(node, context, indent);
    case 'list':
      return renderAngularList(node, context, indent);
    case 'list-item':
      return renderAngularListItem(node, context, indent);
    case 'table':
      return renderAngularTable(node, context, indent);
    case 'table-header':
      return renderAngularTableHeader(node, context, indent);
    case 'table-row':
      return renderAngularTableRow(node, context, indent);
    case 'table-cell':
      return renderAngularTableCell(node, context, indent);
    case 'blockquote':
      return renderAngularWrapper('blockquote', 'blockquote', node.children, node.props, context, indent);
    case 'code':
      return renderAngularCode(node, context, indent);
    case 'separator':
      return `${spaces}<hr class="${buildPrefixedClasses(context.classPrefix, 'separator', node.props)}" />`;
    case 'alert':
      return renderAngularWrapper('div', `state-${node.alertType}`, node.children, node.props, context, indent);
    case 'badge':
      return `${spaces}<span class="${buildPrefixedClasses(context.classPrefix, 'badge', node.props)}">${escapeHtml(node.content)}</span>`;
    default:
      return `${spaces}<!-- Unsupported node type: ${(node as { type: string }).type} -->`;
  }
}

function renderAngularButton(node: NodeOf<'button'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'button', node.props);
  const buttonType = node.props.type || (node.props.variant === 'primary' ? 'submit' : 'button');
  const clickHandler = buttonType === 'submit' ? '' : ` (click)="handleButtonClick('${escapeHtml(node.content || 'button')}')"`;
  const content = node.children
    ? node.children.map((child) => renderAngularNode(child, context, -1)).join('')
    : escapeHtml(node.content || '');
  return `${spaces}<button class="${classes}" type="${buttonType}"${clickHandler}>${content}</button>`;
}

function renderAngularInput(node: NodeOf<'input'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'input', node.props);
  const field = context.analysis.nodeBindings.get(node) || context.helpers.toIdentifier(node.props.placeholder as string || 'field', 'field');
  const placeholder = node.props.placeholder ? ` placeholder="${escapeHtml(node.props.placeholder)}"` : '';
  return `${spaces}<input [formControl]="form.controls.${field}" type="${node.props.inputType || 'text'}" class="${classes}"${placeholder} />`;
}

function renderAngularTextarea(node: NodeOf<'textarea'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'textarea', node.props);
  const field = context.analysis.nodeBindings.get(node) || context.helpers.toIdentifier(node.props.placeholder as string || 'field', 'field');
  return `${spaces}<textarea [formControl]="form.controls.${field}" class="${classes}"></textarea>`;
}

function renderAngularSelect(node: NodeOf<'select'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'select', node.props);
  const field = context.analysis.nodeBindings.get(node) || context.helpers.toIdentifier(node.props.placeholder as string || 'select', 'select');
  const options = node.options
    .map((option) => `${spaces}  <option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`)
    .join('\n');
  return `${spaces}<select [formControl]="form.controls.${field}" class="${classes}">\n${options}\n${spaces}</select>`;
}

function renderAngularCheckbox(node: NodeOf<'checkbox'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'checkbox', node.props);
  const field = context.analysis.nodeBindings.get(node) || context.helpers.toIdentifier(node.label || 'checkbox', 'checkbox');
  const label = node.children
    ? node.children.map((child) => renderAngularNode(child, context, -1)).join('')
    : escapeHtml(node.label || '');
  return `${spaces}<label class="${classes}"><input [formControl]="form.controls.${field}" type="checkbox" /> <span>${label}</span></label>`;
}

function renderAngularRadio(node: NodeOf<'radio'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'radio', node.props);
  const field = context.analysis.nodeBindings.get(node) || context.helpers.toIdentifier(node.label, 'radioGroup');
  const value = escapeHtml(typeof node.props.value === 'string' ? node.props.value : node.label);
  return `${spaces}<label class="${classes}"><input [formControl]="form.controls.${field}" type="radio" value="${value}" /> <span>${escapeHtml(node.label)}</span></label>`;
}

function renderAngularForm(node: NodeOf<'form'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'form', node.props);
  const children = node.children.map((child) => renderAngularNode(child, context, indent + 1)).join('\n');
  return `${spaces}<form [formGroup]="form" class="${classes}" (ngSubmit)="handleSubmit()">\n${children}\n${spaces}</form>`;
}

function renderAngularHeading(node: NodeOf<'heading'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, `h${node.level}`, node.props);
  const content = node.children
    ? node.children.map((child) => renderAngularNode(child, context, -1)).join('')
    : escapeHtml(node.content || '');
  return `${spaces}<h${node.level} class="${classes}">${content}</h${node.level}>`;
}

function renderAngularParagraph(node: NodeOf<'paragraph'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'paragraph', node.props);
  const content = node.children
    ? node.children.map((child) => renderAngularNode(child, context, -1)).join('')
    : escapeHtml(node.content || '');
  return `${spaces}<p class="${classes}">${content}</p>`;
}

function renderAngularImage(node: NodeOf<'image'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'image', node.props);
  return `${spaces}<img src="${escapeHtml(node.src)}" alt="${escapeHtml(node.alt)}" class="${classes}" />`;
}

function renderAngularLink(node: NodeOf<'link'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'link', node.props);
  const content = node.children
    ? node.children.map((child) => renderAngularNode(child, context, -1)).join('')
    : escapeHtml(node.content || '');
  return `${spaces}<a href="${escapeHtml(node.href)}" class="${classes}">${content}</a>`;
}

function renderAngularList(node: NodeOf<'list'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const tag = node.ordered ? 'ol' : 'ul';
  const classes = buildPrefixedClasses(context.classPrefix, 'list', node.props);
  const children = node.children.map((child) => renderAngularNode(child, context, indent + 1)).join('\n');
  return `${spaces}<${tag} class="${classes}">\n${children}\n${spaces}</${tag}>`;
}

function renderAngularListItem(node: NodeOf<'list-item'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'list-item', node.props);
  const content = node.children
    ? node.children.map((child) => renderAngularNode(child, context, -1)).join('')
    : escapeHtml(node.content || '');
  return `${spaces}<li class="${classes}">${content}</li>`;
}

function renderAngularTable(node: NodeOf<'table'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'table', node.props);
  const children = node.children.map((child) => renderAngularNode(child, context, indent + 1)).join('\n');
  return `${spaces}<table class="${classes}">\n${children}\n${spaces}</table>`;
}

function renderAngularTableHeader(node: NodeOf<'table-header'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const children = node.children.map((child) => renderAngularNode(child, context, indent + 2)).join('\n');
  return `${spaces}<thead>\n${spaces}  <tr>\n${children}\n${spaces}  </tr>\n${spaces}</thead>`;
}

function renderAngularTableRow(node: NodeOf<'table-row'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const children = node.children.map((child) => renderAngularNode(child, context, indent + 1)).join('\n');
  return `${spaces}<tr>\n${children}\n${spaces}</tr>`;
}

function renderAngularTableCell(node: NodeOf<'table-cell'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const tag = node.header ? 'th' : 'td';
  const classes = buildPrefixedClasses(context.classPrefix, `table-cell ${context.classPrefix}align-${node.align || 'left'}`, {});
  const content = node.children && node.children.length > 0
    ? node.children.map((child) => renderAngularNode(child, context, -1)).join('')
    : escapeHtml(node.content || '');
  return `${spaces}<${tag} class="${classes}">${content}</${tag}>`;
}

function renderAngularCode(node: NodeOf<'code'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  if (node.inline !== false) {
    return `${spaces}<code class="${buildPrefixedClasses(context.classPrefix, 'code-inline', {})}">${escapeHtml(node.value)}</code>`;
  }

  return `${spaces}<pre class="${buildPrefixedClasses(context.classPrefix, 'code-block', {})}"><code>${escapeHtml(node.value)}</code></pre>`;
}

function renderAngularGrid(node: NodeOf<'grid'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = `${buildPrefixedClasses(context.classPrefix, 'grid', node.props)} ${context.classPrefix}grid-${node.columns}`;
  const children = node.children.map((child) => renderAngularNode(child, context, indent + 1)).join('\n');
  return `${spaces}<div class="${classes}" style="--grid-columns: ${node.columns}">\n${children}\n${spaces}</div>`;
}

function renderAngularNavItem(node: NodeOf<'nav-item'>, context: AngularContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'nav-item', node.props);
  const content = node.children
    ? node.children.map((child) => renderAngularNode(child, context, -1)).join('')
    : escapeHtml(node.content || '');
  return `${spaces}<a href="${escapeHtml(node.href || '#')}" class="${classes}">${content}</a>`;
}

function renderAngularWrapper(
  tag: string,
  baseClass: string,
  children: WiremdNode[],
  props: Record<string, unknown>,
  context: AngularContext,
  indent: number,
): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, baseClass, props);
  const content = children.map((child) => renderAngularNode(child, context, indent + 1)).join('\n');
  return `${spaces}<${tag} class="${classes}">\n${content}\n${spaces}</${tag}>`;
}

function renderAngularValue(value: string | boolean | string[]): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => `'${escapeJsString(entry)}'`).join(', ')}]`;
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return `'${escapeJsString(value)}'`;
}
