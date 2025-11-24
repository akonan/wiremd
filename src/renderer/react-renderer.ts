/**
 * React/JSX Renderer for wiremd AST nodes
 * Converts AST nodes to React functional components with TypeScript
 *
 * Copyright (c) 2025 wiremd
 * Licensed under MIT License
 * https://github.com/akonan/wiremd/blob/main/LICENSE
 */

import type { WiremdNode } from '../types.js';

export interface ReactRenderContext {
  classPrefix: string;
  typescript: boolean;
  useClassName: boolean; // true = className, false = class
  componentName?: string;
}

/**
 * Helper to repeat string (ES5 compatible)
 */
function repeatString(str: string, count: number): string {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += str;
  }
  return result;
}

/**
 * Render a wiremd AST node to React/JSX
 */
export function renderNode(node: WiremdNode, context: ReactRenderContext, indent = 0): string {
  const indentStr = repeatString('  ', indent);

  switch (node.type) {
    case 'button':
      return renderButton(node, context, indent);

    case 'input':
      return renderInput(node, context, indent);

    case 'textarea':
      return renderTextarea(node, context, indent);

    case 'select':
      return renderSelect(node, context, indent);

    case 'checkbox':
      return renderCheckbox(node, context, indent);

    case 'radio':
      return renderRadio(node, context, indent);

    case 'radio-group':
      return renderRadioGroup(node, context, indent);

    case 'icon':
      return renderIcon(node, context, indent);

    case 'container':
      return renderContainer(node, context, indent);

    case 'nav':
      return renderNav(node, context, indent);

    case 'nav-item':
      return renderNavItem(node, context, indent);

    case 'brand':
      return renderBrand(node, context, indent);

    case 'grid':
      return renderGrid(node, context, indent);

    case 'grid-item':
      return renderGridItem(node, context, indent);

    case 'heading':
      return renderHeading(node, context, indent);

    case 'paragraph':
      return renderParagraph(node, context, indent);

    case 'text':
      return renderText(node, context, indent);

    case 'image':
      return renderImage(node, context, indent);

    case 'link':
      return renderLink(node, context, indent);

    case 'list':
      return renderList(node, context, indent);

    case 'list-item':
      return renderListItem(node, context, indent);

    case 'table':
      return renderTable(node, context, indent);

    case 'table-header':
      return renderTableHeader(node, context, indent);

    case 'table-row':
      return renderTableRow(node, context, indent);

    case 'table-cell':
      return renderTableCell(node, context, indent);

    case 'blockquote':
      return renderBlockquote(node, context, indent);

    case 'code':
      return renderCode(node, context, indent);

    case 'separator':
      return renderSeparator(node, context, indent);

    default:
      return `${indentStr}{/* Unknown node type: ${(node as any).type} */}`;
  }
}

function renderButton(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'button', node.props);
  const disabled = node.props.state === 'disabled';
  const classAttr = context.useClassName ? 'className' : 'class';

  const contentJSX = node.children
    ? node.children.map((child: any) => renderNode(child, context, 0)).join('')
    : escapeJSX(node.content);

  return `${indentStr}<button ${classAttr}="${classes}"${disabled ? ' disabled' : ''}>\n${indentStr}  ${contentJSX}\n${indentStr}</button>`;
}

function renderInput(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'input', node.props);
  const type = node.props.inputType || node.props.type || 'text';
  const classAttr = context.useClassName ? 'className' : 'class';

  const attrs: string[] = [];
  if (node.props.placeholder) attrs.push(`placeholder="${escapeJSX(node.props.placeholder)}"`);
  if (node.props.value) attrs.push(`defaultValue="${escapeJSX(node.props.value)}"`);
  if (node.props.required) attrs.push('required');
  if (node.props.disabled) attrs.push('disabled');

  return `${indentStr}<input type="${type}" ${classAttr}="${classes}" ${attrs.join(' ')} />`;
}

function renderTextarea(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'textarea', node.props);
  const rows = node.props.rows || 4;
  const classAttr = context.useClassName ? 'className' : 'class';

  const attrs: string[] = [];
  if (node.props.placeholder) attrs.push(`placeholder="${escapeJSX(node.props.placeholder)}"`);
  if (node.props.required) attrs.push('required');
  if (node.props.disabled) attrs.push('disabled');

  const value = node.props.value || '';

  return `${indentStr}<textarea ${classAttr}="${classes}" rows={${rows}} ${attrs.join(' ')}>\n${indentStr}  ${escapeJSX(value)}\n${indentStr}</textarea>`;
}

function renderSelect(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'select', node.props);
  const classAttr = context.useClassName ? 'className' : 'class';

  const attrs: string[] = [];
  if (node.props.required) attrs.push('required');
  if (node.props.disabled) attrs.push('disabled');
  if (node.props.multiple) attrs.push('multiple');

  const optionsJSX = (node.options || []).map((opt: any) => {
    const selected = opt.selected ? ' defaultSelected' : '';
    return `    <option value="${escapeJSX(opt.value)}"${selected}>${escapeJSX(opt.label)}</option>`;
  }).join('\n');

  const placeholder = node.props.placeholder;
  const placeholderOption = placeholder
    ? `    <option value="" disabled defaultSelected>${escapeJSX(placeholder)}</option>\n`
    : '';

  return `${indentStr}<select ${classAttr}="${classes}" ${attrs.join(' ')}>
${placeholderOption}${optionsJSX}
${indentStr}</select>`;
}

function renderCheckbox(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'checkbox', node.props);
  const checked = node.checked;
  const classAttr = context.useClassName ? 'className' : 'class';

  const attrs: string[] = [];
  if (node.props.value) attrs.push(`value="${escapeJSX(node.props.value)}"`);
  if (node.props.disabled) attrs.push('disabled');

  const labelJSX = node.children
    ? node.children.map((child: any) => renderNode(child, context, 0)).join('')
    : escapeJSX(node.label);

  return `${indentStr}<label ${classAttr}="${classes}">
${indentStr}  <input type="checkbox"${checked ? ' defaultChecked' : ''} ${attrs.join(' ')} />
${indentStr}  <span>${labelJSX}</span>
${indentStr}</label>`;
}

function renderRadio(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'radio', node.props);
  const checked = node.selected;
  const classAttr = context.useClassName ? 'className' : 'class';

  const attrs: string[] = [];
  if (node.props.name) attrs.push(`name="${escapeJSX(node.props.name)}"`);
  if (node.props.value) attrs.push(`value="${escapeJSX(node.props.value)}"`);
  if (node.props.disabled) attrs.push('disabled');

  return `${indentStr}<label ${classAttr}="${classes}">
${indentStr}  <input type="radio"${checked ? ' defaultChecked' : ''} ${attrs.join(' ')} />
${indentStr}  <span>${escapeJSX(node.label)}</span>
${indentStr}</label>`;
}

function renderRadioGroup(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const isInline = node.props?.inline;
  const classes = buildClasses(prefix, 'radio-group', node.props);
  const inlineClass = isInline ? ` ${prefix}radio-group-inline` : '';
  const classAttr = context.useClassName ? 'className' : 'class';

  const groupName = `radio-${Math.random().toString(36).substr(2, 9)}`;

  const radios = (node.children || []).map((child: any) => {
    if (child.type === 'radio') {
      const modifiedChild = { ...child, props: { ...child.props, name: groupName } };
      return renderNode(modifiedChild, context, indent + 1);
    }
    return renderNode(child, context, indent + 1);
  }).join('\n');

  return `${indentStr}<div ${classAttr}="${classes}${inlineClass}">
${radios}
${indentStr}</div>`;
}

function renderIcon(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'icon', node.props);
  const iconName = node.props.name || 'default';
  const classAttr = context.useClassName ? 'className' : 'class';

  // Icon mapping
  const iconMap: Record<string, string> = {
    'home': '🏠', 'user': '👤', 'settings': '⚙️', 'search': '🔍',
    'star': '⭐', 'heart': '❤️', 'mail': '✉️', 'phone': '📞',
    'check': '✓', 'close': '✕', 'menu': '☰', 'more': '⋯',
    'default': '●'
  };

  const iconContent = iconMap[iconName] || iconMap['default'];

  return `${indentStr}<span ${classAttr}="${classes}" data-icon="${iconName}" aria-label="${iconName}">${iconContent}</span>`;
}

function renderContainer(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, `container-${node.containerType}`, node.props);
  const classAttr = context.useClassName ? 'className' : 'class';
  const childrenJSX = (node.children || []).map((child: any) => renderNode(child, context, indent + 1)).join('\n');

  return `${indentStr}<div ${classAttr}="${classes}">
${childrenJSX}
${indentStr}</div>`;
}

function renderNav(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'nav', node.props);
  const classAttr = context.useClassName ? 'className' : 'class';
  const childrenJSX = (node.children || []).map((child: any) => renderNode(child, context, indent + 2)).join('\n');

  return `${indentStr}<nav ${classAttr}="${classes}">
${indentStr}  <div ${classAttr}="${prefix}nav-content">
${childrenJSX}
${indentStr}  </div>
${indentStr}</nav>`;
}

function renderNavItem(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'nav-item', node.props);
  const href = node.href || '#';
  const classAttr = context.useClassName ? 'className' : 'class';

  const contentJSX = node.children
    ? node.children.map((child: any) => renderNode(child, context, 0)).join('')
    : escapeJSX(node.content);

  return `${indentStr}<a href="${href}" ${classAttr}="${classes}">${contentJSX}</a>`;
}

function renderBrand(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'brand', node.props);
  const classAttr = context.useClassName ? 'className' : 'class';
  const childrenJSX = (node.children || []).map((child: any) => renderNode(child, context, 0)).join('');

  return `${indentStr}<div ${classAttr}="${classes}">${childrenJSX}</div>`;
}

function renderGrid(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'grid', node.props);
  const columns = node.columns || 3;
  const gridClass = `${classes} ${prefix}grid-${columns}`;
  const classAttr = context.useClassName ? 'className' : 'class';
  const childrenJSX = (node.children || []).map((child: any) => renderNode(child, context, indent + 1)).join('\n');

  return `${indentStr}<div ${classAttr}="${gridClass}" style={{ '--grid-columns': ${columns} }${context.typescript ? ' as React.CSSProperties' : ''}}>
${childrenJSX}
${indentStr}</div>`;
}

function renderGridItem(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'grid-item', node.props);
  const classAttr = context.useClassName ? 'className' : 'class';
  const childrenJSX = (node.children || []).map((child: any) => renderNode(child, context, indent + 1)).join('\n');

  return `${indentStr}<div ${classAttr}="${classes}">
${childrenJSX}
${indentStr}</div>`;
}

function renderHeading(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const level = node.level || 1;
  const classes = buildClasses(prefix, `h${level}`, node.props);
  const classAttr = context.useClassName ? 'className' : 'class';

  const childrenJSX = node.children
    ? node.children.map((child: any) => renderNode(child, context, 0)).join('')
    : escapeJSX(node.content || '');

  const tag = `h${level}`;
  return `${indentStr}<${tag} ${classAttr}="${classes}">${childrenJSX}</${tag}>`;
}

function renderParagraph(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'paragraph', node.props);
  const classAttr = context.useClassName ? 'className' : 'class';

  const childrenJSX = node.children
    ? node.children.map((child: any) => renderNode(child, context, 0)).join('')
    : (node.content ? escapeJSX(node.content) : '');

  return `${indentStr}<p ${classAttr}="${classes}">${childrenJSX}</p>`;
}

function renderText(node: any, _context: ReactRenderContext, _indent: number): string {
  return escapeJSX(node.content || '');
}

function renderImage(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'image', node.props);
  const src = node.src || '';
  const alt = node.alt || '';
  const classAttr = context.useClassName ? 'className' : 'class';

  const attrs: string[] = [];
  if (node.props.width) attrs.push(`width="${node.props.width}"`);
  if (node.props.height) attrs.push(`height="${node.props.height}"`);

  return `${indentStr}<img src="${escapeJSX(src)}" alt="${escapeJSX(alt)}" ${classAttr}="${classes}" ${attrs.join(' ')} />`;
}

function renderLink(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'link', node.props);
  const href = node.href || '#';
  const classAttr = context.useClassName ? 'className' : 'class';

  const attrs: string[] = [];
  if (node.title) attrs.push(`title="${escapeJSX(node.title)}"`);

  const childrenJSX = node.children
    ? node.children.map((child: any) => renderNode(child, context, 0)).join('')
    : escapeJSX(node.content || '');

  return `${indentStr}<a href="${escapeJSX(href)}" ${classAttr}="${classes}" ${attrs.join(' ')}>${childrenJSX}</a>`;
}

function renderList(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'list', node.props);
  const tag = node.ordered ? 'ol' : 'ul';
  const classAttr = context.useClassName ? 'className' : 'class';
  const childrenJSX = (node.children || []).map((child: any) => renderNode(child, context, indent + 1)).join('\n');

  return `${indentStr}<${tag} ${classAttr}="${classes}">
${childrenJSX}
${indentStr}</${tag}>`;
}

function renderListItem(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'list-item', node.props);
  const classAttr = context.useClassName ? 'className' : 'class';

  const childrenJSX = node.children
    ? node.children.map((child: any) => renderNode(child, context, 0)).join('')
    : escapeJSX(node.content || '');

  return `${indentStr}<li ${classAttr}="${classes}">${childrenJSX}</li>`;
}

function renderTable(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'table', node.props);
  const classAttr = context.useClassName ? 'className' : 'class';

  const headerNode = node.children?.find((child: any) => child.type === 'table-header');
  const rowNodes = node.children?.filter((child: any) => child.type === 'table-row') || [];

  const headerJSX = headerNode ? renderNode(headerNode, context, indent + 1) : '';
  const rowsJSX = rowNodes.map((child: any) => renderNode(child, context, indent + 2)).join('\n');
  const bodyJSX = rowsJSX ? `\n${indentStr}  <tbody>\n${rowsJSX}\n${indentStr}  </tbody>` : '';

  return `${indentStr}<table ${classAttr}="${classes}">
${headerJSX}${bodyJSX}
${indentStr}</table>`;
}

function renderTableHeader(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const cellsJSX = (node.children || []).map((child: any) => renderNode(child, context, indent + 2)).join('\n');

  return `${indentStr}  <thead>
${indentStr}    <tr>
${cellsJSX}
${indentStr}    </tr>
${indentStr}  </thead>`;
}

function renderTableRow(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const cellsJSX = (node.children || []).map((child: any) => renderNode(child, context, indent + 1)).join('\n');

  return `${indentStr}    <tr>
${cellsJSX}
${indentStr}    </tr>`;
}

function renderTableCell(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const tag = node.header ? 'th' : 'td';
  const align = node.align || 'left';
  const classes = buildClasses(prefix, `table-cell ${prefix}align-${align}`, {});
  const classAttr = context.useClassName ? 'className' : 'class';

  const contentJSX = node.children && node.children.length > 0
    ? node.children.map((child: any) => renderNode(child, context, 0)).join('')
    : escapeJSX(node.content || '');

  return `${indentStr}      <${tag} ${classAttr}="${classes}">${contentJSX}</${tag}>`;
}

function renderBlockquote(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'blockquote', node.props);
  const classAttr = context.useClassName ? 'className' : 'class';
  const childrenJSX = (node.children || []).map((child: any) => renderNode(child, context, indent + 1)).join('\n');

  return `${indentStr}<blockquote ${classAttr}="${classes}">
${childrenJSX}
${indentStr}</blockquote>`;
}

function renderCode(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const inline = node.inline !== false;
  const classAttr = context.useClassName ? 'className' : 'class';

  if (inline) {
    const classes = buildClasses(prefix, 'code-inline', {});
    return `${indentStr}<code ${classAttr}="${classes}">${escapeJSX(node.value)}</code>`;
  } else {
    const classes = buildClasses(prefix, 'code-block', {});
    const dataLang = node.lang ? ` data-lang="${escapeJSX(node.lang)}"` : '';
    return `${indentStr}<pre ${classAttr}="${classes}"><code${dataLang}>${escapeJSX(node.value)}</code></pre>`;
  }
}

function renderSeparator(node: any, context: ReactRenderContext, indent: number): string {
  const indentStr = repeatString('  ', indent);
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'separator', node.props);
  const classAttr = context.useClassName ? 'className' : 'class';

  return `${indentStr}<hr ${classAttr}="${classes}" />`;
}

/**
 * Build CSS classes string from prefix, base class, and props
 */
function buildClasses(prefix: string, baseClass: string, props: any): string {
  const classes = [`${prefix}${baseClass}`];

  if (props.classes && Array.isArray(props.classes)) {
    props.classes.forEach((cls: string) => {
      classes.push(`${prefix}${cls}`);
    });
  }

  if (props.variant) {
    classes.push(`${prefix}${baseClass}-${props.variant}`);
  }

  if (props.state) {
    classes.push(`${prefix}state-${props.state}`);
  }

  return classes.join(' ');
}

/**
 * Escape JSX special characters
 */
function escapeJSX(text: string): string {
  if (!text) return '';

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;');
}
