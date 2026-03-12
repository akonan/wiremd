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

interface SvelteOptions extends RenderOptions {
  componentName?: string;
  typescript?: boolean;
}

interface SvelteContext {
  classPrefix: string;
  analysis: ReturnType<typeof analyzeFrameworkState>;
  helpers: RenderHelpers;
}

export function renderSvelteComponent(
  ast: DocumentNode,
  options: SvelteOptions = {},
  helpers: RenderHelpers,
): RenderResult {
  const classPrefix = options.classPrefix || 'wmd-';
  const componentName = options.componentName || 'WiremdComponent';
  const typescript = options.typescript !== false;
  const analysis = analyzeFrameworkState(ast, helpers);
  const context: SvelteContext = {
    classPrefix,
    analysis,
    helpers,
  };
  const markup = ast.children.map((child) => renderSvelteNode(child, context, 0)).join('\n');
  const script = renderSvelteScript(analysis, typescript);
  const styles = getStyleCSS(options.style || 'sketch', classPrefix);

  return {
    format: 'svelte',
    artifacts: [{
      filename: `${componentName}.svelte`,
      content: `${script}\n\n<div class="${classPrefix}root ${classPrefix}${options.style || 'sketch'}">\n${markup}\n</div>\n\n<style>\n${styles}\n</style>`,
    }],
  };
}

function renderSvelteScript(analysis: ReturnType<typeof analyzeFrameworkState>, typescript: boolean): string {
  const lang = typescript ? ' lang="ts"' : '';
  const fieldDeclarations = analysis.fields
    .map((field) => `let ${field.key} = ${renderSvelteValue(field.initialValue)};`)
    .join('\n');
  const reactiveObject = analysis.fields.length === 0
    ? '$: formState = {};'
    : `$: formState = { ${analysis.fields.map((field) => field.key).join(', ')} };`;

  return `<script${lang}>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  ${fieldDeclarations || ''}
  ${reactiveObject}

  function handleSubmit() {
    dispatch('submit', formState);
  }

  function handleButtonClick(label${typescript ? ': string' : ''}) {
    dispatch('button-click', label);
  }
</script>`;
}

function renderSvelteNode(node: WiremdNode, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);

  switch (node.type) {
    case 'button':
      return renderSvelteButton(node, context, indent);
    case 'input':
      return renderSvelteInput(node, context, indent);
    case 'textarea':
      return renderSvelteTextarea(node, context, indent);
    case 'select':
      return renderSvelteSelect(node, context, indent);
    case 'checkbox':
      return renderSvelteCheckbox(node, context, indent);
    case 'radio':
      return renderSvelteRadio(node, context, indent);
    case 'radio-group':
      return renderSvelteWrapper('div', 'radio-group', node.children, node.props, context, indent);
    case 'icon':
      return `${spaces}<span class="${buildPrefixedClasses(context.classPrefix, 'icon', node.props)}" data-icon="${escapeHtml(node.props.name)}" aria-label="${escapeHtml(node.props.name)}">${getIconGlyph(node.props.name)}</span>`;
    case 'container':
      return renderSvelteWrapper('div', `container-${node.containerType}`, node.children, node.props, context, indent);
    case 'nav':
      return renderSvelteWrapper('nav', 'nav', node.children, node.props, context, indent);
    case 'nav-item':
      return renderSvelteNavItem(node, context, indent);
    case 'brand':
      return renderSvelteWrapper('div', 'brand', node.children, node.props, context, indent);
    case 'grid':
      return renderSvelteGrid(node, context, indent);
    case 'grid-item':
      return renderSvelteWrapper('div', 'grid-item', node.children, node.props, context, indent);
    case 'form':
      return renderSvelteForm(node, context, indent);
    case 'heading':
      return renderSvelteHeading(node, context, indent);
    case 'paragraph':
      return renderSvelteParagraph(node, context, indent);
    case 'text':
      return `${spaces}${escapeHtml(node.content)}`;
    case 'image':
      return renderSvelteImage(node, context, indent);
    case 'link':
      return renderSvelteLink(node, context, indent);
    case 'list':
      return renderSvelteList(node, context, indent);
    case 'list-item':
      return renderSvelteListItem(node, context, indent);
    case 'table':
      return renderSvelteTable(node, context, indent);
    case 'table-header':
      return renderSvelteTableHeader(node, context, indent);
    case 'table-row':
      return renderSvelteTableRow(node, context, indent);
    case 'table-cell':
      return renderSvelteTableCell(node, context, indent);
    case 'blockquote':
      return renderSvelteWrapper('blockquote', 'blockquote', node.children, node.props, context, indent);
    case 'code':
      return renderSvelteCode(node, context, indent);
    case 'separator':
      return `${spaces}<hr class="${buildPrefixedClasses(context.classPrefix, 'separator', node.props)}" />`;
    case 'alert':
      return renderSvelteWrapper('div', `state-${node.alertType}`, node.children, node.props, context, indent);
    case 'badge':
      return `${spaces}<span class="${buildPrefixedClasses(context.classPrefix, 'badge', node.props)}">${escapeHtml(node.content)}</span>`;
    default:
      return `${spaces}<!-- Unsupported node type: ${(node as { type: string }).type} -->`;
  }
}

function renderSvelteButton(node: NodeOf<'button'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'button', node.props);
  const buttonType = node.props.type || (node.props.variant === 'primary' ? 'submit' : 'button');
  const clickHandler = buttonType === 'submit' ? '' : ` on:click={() => handleButtonClick('${escapeJsString(node.content || 'button')}')}`;
  const content = node.children
    ? node.children.map((child) => renderSvelteNode(child, context, -1)).join('')
    : escapeHtml(node.content || '');

  return `${spaces}<button class="${classes}" type="${buttonType}"${clickHandler}>${content}</button>`;
}

function renderSvelteInput(node: NodeOf<'input'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'input', node.props);
  const field = context.analysis.nodeBindings.get(node) || context.helpers.toIdentifier(node.props.placeholder as string || 'field', 'field');
  const placeholder = node.props.placeholder ? ` placeholder="${escapeHtml(node.props.placeholder)}"` : '';
  return `${spaces}<input bind:value={${field}} type="${node.props.inputType || 'text'}" class="${classes}"${placeholder} />`;
}

function renderSvelteTextarea(node: NodeOf<'textarea'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'textarea', node.props);
  const field = context.analysis.nodeBindings.get(node) || context.helpers.toIdentifier(node.props.placeholder as string || 'field', 'field');
  const rows = node.props.rows || 4;
  return `${spaces}<textarea bind:value={${field}} class="${classes}" rows="${rows}"></textarea>`;
}

function renderSvelteSelect(node: NodeOf<'select'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'select', node.props);
  const field = context.analysis.nodeBindings.get(node) || context.helpers.toIdentifier(node.props.placeholder as string || 'select', 'select');
  const options = node.options
    .map((option) => `${spaces}  <option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`)
    .join('\n');
  return `${spaces}<select bind:value={${field}} class="${classes}">\n${options}\n${spaces}</select>`;
}

function renderSvelteCheckbox(node: NodeOf<'checkbox'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'checkbox', node.props);
  const field = context.analysis.nodeBindings.get(node) || context.helpers.toIdentifier(node.label || 'checkbox', 'checkbox');
  const label = node.children
    ? node.children.map((child) => renderSvelteNode(child, context, -1)).join('')
    : escapeHtml(node.label || '');
  return `${spaces}<label class="${classes}"><input bind:checked={${field}} type="checkbox" /> <span>${label}</span></label>`;
}

function renderSvelteRadio(node: NodeOf<'radio'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'radio', node.props);
  const field = context.analysis.nodeBindings.get(node) || context.helpers.toIdentifier(node.label, 'radioGroup');
  const value = escapeHtml(typeof node.props.value === 'string' ? node.props.value : node.label);
  return `${spaces}<label class="${classes}"><input bind:group={${field}} type="radio" value="${value}" /> <span>${escapeHtml(node.label)}</span></label>`;
}

function renderSvelteForm(node: NodeOf<'form'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'form', node.props);
  const children = node.children.map((child) => renderSvelteNode(child, context, indent + 1)).join('\n');
  return `${spaces}<form class="${classes}" on:submit|preventDefault={handleSubmit}>\n${children}\n${spaces}</form>`;
}

function renderSvelteHeading(node: NodeOf<'heading'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, `h${node.level}`, node.props);
  const content = node.children
    ? node.children.map((child) => renderSvelteNode(child, context, -1)).join('')
    : escapeHtml(node.content || '');
  return `${spaces}<h${node.level} class="${classes}">${content}</h${node.level}>`;
}

function renderSvelteParagraph(node: NodeOf<'paragraph'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'paragraph', node.props);
  const content = node.children
    ? node.children.map((child) => renderSvelteNode(child, context, -1)).join('')
    : escapeHtml(node.content || '');
  return `${spaces}<p class="${classes}">${content}</p>`;
}

function renderSvelteImage(node: NodeOf<'image'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'image', node.props);
  return `${spaces}<img src="${escapeHtml(node.src)}" alt="${escapeHtml(node.alt)}" class="${classes}" />`;
}

function renderSvelteLink(node: NodeOf<'link'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'link', node.props);
  const content = node.children
    ? node.children.map((child) => renderSvelteNode(child, context, -1)).join('')
    : escapeHtml(node.content || '');
  return `${spaces}<a href="${escapeHtml(node.href)}" class="${classes}">${content}</a>`;
}

function renderSvelteList(node: NodeOf<'list'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const tag = node.ordered ? 'ol' : 'ul';
  const classes = buildPrefixedClasses(context.classPrefix, 'list', node.props);
  const children = node.children.map((child) => renderSvelteNode(child, context, indent + 1)).join('\n');
  return `${spaces}<${tag} class="${classes}">\n${children}\n${spaces}</${tag}>`;
}

function renderSvelteListItem(node: NodeOf<'list-item'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'list-item', node.props);
  const content = node.children
    ? node.children.map((child) => renderSvelteNode(child, context, -1)).join('')
    : escapeHtml(node.content || '');
  return `${spaces}<li class="${classes}">${content}</li>`;
}

function renderSvelteTable(node: NodeOf<'table'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'table', node.props);
  const children = node.children.map((child) => renderSvelteNode(child, context, indent + 1)).join('\n');
  return `${spaces}<table class="${classes}">\n${children}\n${spaces}</table>`;
}

function renderSvelteTableHeader(node: NodeOf<'table-header'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const children = node.children.map((child) => renderSvelteNode(child, context, indent + 2)).join('\n');
  return `${spaces}<thead>\n${spaces}  <tr>\n${children}\n${spaces}  </tr>\n${spaces}</thead>`;
}

function renderSvelteTableRow(node: NodeOf<'table-row'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const children = node.children.map((child) => renderSvelteNode(child, context, indent + 1)).join('\n');
  return `${spaces}<tr>\n${children}\n${spaces}</tr>`;
}

function renderSvelteTableCell(node: NodeOf<'table-cell'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const tag = node.header ? 'th' : 'td';
  const classes = buildPrefixedClasses(context.classPrefix, `table-cell ${context.classPrefix}align-${node.align || 'left'}`, {});
  const content = node.children && node.children.length > 0
    ? node.children.map((child) => renderSvelteNode(child, context, -1)).join('')
    : escapeHtml(node.content || '');
  return `${spaces}<${tag} class="${classes}">${content}</${tag}>`;
}

function renderSvelteCode(node: NodeOf<'code'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  if (node.inline !== false) {
    return `${spaces}<code class="${buildPrefixedClasses(context.classPrefix, 'code-inline', {})}">${escapeHtml(node.value)}</code>`;
  }

  return `${spaces}<pre class="${buildPrefixedClasses(context.classPrefix, 'code-block', {})}"><code>${escapeHtml(node.value)}</code></pre>`;
}

function renderSvelteGrid(node: NodeOf<'grid'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = `${buildPrefixedClasses(context.classPrefix, 'grid', node.props)} ${context.classPrefix}grid-${node.columns}`;
  const children = node.children.map((child) => renderSvelteNode(child, context, indent + 1)).join('\n');
  return `${spaces}<div class="${classes}" style="--grid-columns: ${node.columns}">\n${children}\n${spaces}</div>`;
}

function renderSvelteNavItem(node: NodeOf<'nav-item'>, context: SvelteContext, indent: number): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, 'nav-item', node.props);
  const content = node.children
    ? node.children.map((child) => renderSvelteNode(child, context, -1)).join('')
    : escapeHtml(node.content || '');
  return `${spaces}<a href="${escapeHtml(node.href || '#')}" class="${classes}">${content}</a>`;
}

function renderSvelteWrapper(
  tag: string,
  baseClass: string,
  children: WiremdNode[],
  props: Record<string, unknown>,
  context: SvelteContext,
  indent: number,
): string {
  const spaces = repeatString('  ', indent + 1);
  const classes = buildPrefixedClasses(context.classPrefix, baseClass, props);
  const content = children.map((child) => renderSvelteNode(child, context, indent + 1)).join('\n');
  return `${spaces}<${tag} class="${classes}">\n${content}\n${spaces}</${tag}>`;
}

function renderSvelteValue(value: string | boolean | string[]): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => `'${escapeJsString(entry)}'`).join(', ')}]`;
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return `'${escapeJsString(value)}'`;
}
