/**
 * Tailwind CSS Renderer for wiremd AST nodes
 * Converts AST nodes to HTML with Tailwind utility classes
 */

import type { WiremdNode } from '../types.js';

export interface TailwindRenderContext {
  pretty: boolean;
}

/**
 * Render a wiremd AST node to HTML with Tailwind classes
 */
export function renderNode(node: WiremdNode, context: TailwindRenderContext): string {
  switch (node.type) {
    case 'button':
      return renderButton(node, context);

    case 'input':
      return renderInput(node, context);

    case 'textarea':
      return renderTextarea(node, context);

    case 'select':
      return renderSelect(node, context);

    case 'checkbox':
      return renderCheckbox(node, context);

    case 'radio':
      return renderRadio(node, context);

    case 'radio-group':
      return renderRadioGroup(node, context);

    case 'icon':
      return renderIcon(node, context);

    case 'container':
      return renderContainer(node, context);

    case 'nav':
      return renderNav(node, context);

    case 'nav-item':
      return renderNavItem(node, context);

    case 'brand':
      return renderBrand(node, context);

    case 'grid':
      return renderGrid(node, context);

    case 'grid-item':
      return renderGridItem(node, context);

    case 'heading':
      return renderHeading(node, context);

    case 'paragraph':
      return renderParagraph(node, context);

    case 'text':
      return renderText(node);

    case 'image':
      return renderImage(node, context);

    case 'link':
      return renderLink(node, context);

    case 'list':
      return renderList(node, context);

    case 'list-item':
      return renderListItem(node, context);

    case 'table':
      return renderTable(node, context);

    case 'table-header':
      return renderTableHeader(node, context);

    case 'table-row':
      return renderTableRow(node, context);

    case 'table-cell':
      return renderTableCell(node, context);

    case 'blockquote':
      return renderBlockquote(node, context);

    case 'code':
      return renderCode(node, context);

    case 'separator':
      return renderSeparator(node, context);

    default:
      return `<!-- Unknown node type: ${(node as any).type} -->`;
  }
}

function renderButton(node: any, context: TailwindRenderContext): string {
  let classes = 'px-4 py-2 rounded-md font-medium transition-colors';

  // Variant-specific styles
  if (node.props.variant === 'primary') {
    classes += ' bg-indigo-600 text-white hover:bg-indigo-700';
  } else if (node.props.variant === 'secondary') {
    classes += ' bg-gray-200 text-gray-900 hover:bg-gray-300';
  } else if (node.props.variant === 'danger') {
    classes += ' bg-red-600 text-white hover:bg-red-700';
  } else {
    classes += ' bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300';
  }

  // State styles
  if (node.props.state === 'disabled') {
    classes += ' opacity-50 cursor-not-allowed';
  } else if (node.props.state === 'loading') {
    classes += ' opacity-75 cursor-wait';
  }

  const disabled = node.props.state === 'disabled' ? ' disabled' : '';

  const contentHTML = node.children
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : escapeHtml(node.content);

  return `<button class="${classes}"${disabled}>${contentHTML}</button>`;
}

function renderInput(node: any, _context: TailwindRenderContext): string {
  const classes = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';
  const type = node.props.inputType || node.props.type || 'text';
  const required = node.props.required ? ' required' : '';
  const disabled = node.props.disabled ? ' disabled' : '';
  const placeholder = node.props.placeholder ? ` placeholder="${escapeHtml(node.props.placeholder)}"` : '';
  const value = node.props.value ? ` value="${escapeHtml(node.props.value)}"` : '';

  return `<input type="${type}" class="${classes}"${placeholder}${value}${required}${disabled} />`;
}

function renderTextarea(node: any, _context: TailwindRenderContext): string {
  const classes = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical';
  const rows = node.props.rows || 4;
  const required = node.props.required ? ' required' : '';
  const disabled = node.props.disabled ? ' disabled' : '';
  const placeholder = node.props.placeholder ? ` placeholder="${escapeHtml(node.props.placeholder)}"` : '';
  const value = node.props.value || '';

  return `<textarea class="${classes}" rows="${rows}"${placeholder}${required}${disabled}>${escapeHtml(value)}</textarea>`;
}

function renderSelect(node: any, _context: TailwindRenderContext): string {
  const classes = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';
  const required = node.props.required ? ' required' : '';
  const disabled = node.props.disabled ? ' disabled' : '';
  const multiple = node.props.multiple ? ' multiple' : '';

  const optionsHTML = (node.options || []).map((opt: any) => {
    const selected = opt.selected ? ' selected' : '';
    return `<option value="${escapeHtml(opt.value)}"${selected}>${escapeHtml(opt.label)}</option>`;
  }).join('\n    ');

  const placeholder = node.props.placeholder;
  const placeholderOption = placeholder
    ? `<option value="" disabled selected>${escapeHtml(placeholder)}</option>\n    `
    : '';

  return `<select class="${classes}"${required}${disabled}${multiple}>
    ${placeholderOption}${optionsHTML}
  </select>`;
}

function renderCheckbox(node: any, context: TailwindRenderContext): string {
  const classes = 'flex items-center gap-2 cursor-pointer';
  const checked = node.checked ? ' checked' : '';
  const disabled = node.props.disabled ? ' disabled' : '';
  const value = node.props.value ? ` value="${escapeHtml(node.props.value)}"` : '';

  const labelHTML = node.children
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : escapeHtml(node.label);

  return `<label class="${classes}">
    <input type="checkbox" class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"${checked}${disabled}${value} />
    <span class="text-gray-900">${labelHTML}</span>
  </label>`;
}

function renderRadio(node: any, _context: TailwindRenderContext): string {
  const classes = 'flex items-center gap-2 cursor-pointer';
  const checked = node.selected ? ' checked' : '';
  const disabled = node.props.disabled ? ' disabled' : '';
  const name = node.props.name ? ` name="${escapeHtml(node.props.name)}"` : '';
  const value = node.props.value ? ` value="${escapeHtml(node.props.value)}"` : '';

  return `<label class="${classes}">
    <input type="radio" class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"${checked}${disabled}${name}${value} />
    <span class="text-gray-900">${escapeHtml(node.label)}</span>
  </label>`;
}

function renderRadioGroup(node: any, context: TailwindRenderContext): string {
  const isInline = node.props?.inline;
  const classes = isInline ? 'flex flex-wrap gap-4' : 'flex flex-col gap-2';

  const groupName = `radio-${Math.random().toString(36).substr(2, 9)}`;

  const radios = (node.children || []).map((child: any) => {
    if (child.type === 'radio') {
      const modifiedChild = { ...child, props: { ...child.props, name: groupName } };
      return renderNode(modifiedChild, context);
    }
    return renderNode(child, context);
  }).join('\n    ');

  return `<div class="${classes}">
    ${radios}
</div>`;
}

function renderIcon(node: any, _context: TailwindRenderContext): string {
  const classes = 'inline-block align-middle';
  const iconName = node.props.name || 'default';

  const iconMap: Record<string, string> = {
    'home': '🏠', 'user': '👤', 'settings': '⚙️', 'search': '🔍',
    'star': '⭐', 'heart': '❤️', 'mail': '✉️', 'phone': '📞',
    'check': '✓', 'close': '✕', 'menu': '☰', 'more': '⋯',
    'default': '●'
  };

  const iconContent = iconMap[iconName] || iconMap['default'];

  return `<span class="${classes}" data-icon="${iconName}" aria-label="${iconName}">${iconContent}</span>`;
}

function renderContainer(node: any, context: TailwindRenderContext): string {
  let classes = '';

  switch (node.containerType) {
    case 'hero':
      classes = 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-12 text-center my-8 shadow-lg';
      break;
    case 'card':
      classes = 'bg-white rounded-lg p-6 shadow-md border border-gray-200 my-4';
      break;
    case 'modal':
      classes = 'bg-white rounded-lg p-8 shadow-2xl max-w-md mx-auto my-8';
      break;
    case 'footer':
      classes = 'bg-gray-900 text-gray-300 p-8 rounded-lg mt-12';
      break;
    case 'alert':
      classes = 'border-l-4 p-4 my-4 rounded';
      if (node.props.state === 'error') {
        classes += ' bg-red-50 border-red-500 text-red-900';
      } else if (node.props.state === 'success') {
        classes += ' bg-green-50 border-green-500 text-green-900';
      } else if (node.props.state === 'warning') {
        classes += ' bg-yellow-50 border-yellow-500 text-yellow-900';
      } else {
        classes += ' bg-blue-50 border-blue-500 text-blue-900';
      }
      break;
    case 'section':
      classes = 'py-6 border-b border-gray-200 last:border-b-0';
      break;
    case 'form-group':
      classes = 'mb-4';
      break;
    case 'button-group':
      classes = 'flex flex-wrap gap-2 my-4';
      break;
    default:
      classes = 'p-4 my-4';
  }

  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n  ');

  return `<div class="${classes}">
  ${childrenHTML}
</div>`;
}

function renderNav(node: any, context: TailwindRenderContext): string {
  const classes = 'bg-white shadow-sm rounded-lg p-4 mb-8';
  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n    ');

  return `<nav class="${classes}">
  <div class="flex items-center gap-6 flex-wrap">
    ${childrenHTML}
  </div>
</nav>`;
}

function renderNavItem(node: any, context: TailwindRenderContext): string {
  const classes = 'text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium';
  const href = node.href || '#';

  const contentHTML = node.children
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : escapeHtml(node.content);

  return `<a href="${href}" class="${classes}">${contentHTML}</a>`;
}

function renderBrand(node: any, context: TailwindRenderContext): string {
  const classes = 'font-bold text-xl text-gray-900 mr-auto flex items-center gap-2';
  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('');

  return `<div class="${classes}">${childrenHTML}</div>`;
}

function renderGrid(node: any, context: TailwindRenderContext): string {
  const columns = node.columns || 3;
  let gridClasses = 'grid gap-6 my-8';

  if (columns === 2) {
    gridClasses += ' grid-cols-1 md:grid-cols-2';
  } else if (columns === 3) {
    gridClasses += ' grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  } else if (columns === 4) {
    gridClasses += ' grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  } else {
    gridClasses += ` grid-cols-1 md:grid-cols-${Math.min(columns, 4)}`;
  }

  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n  ');

  return `<div class="${gridClasses}">
  ${childrenHTML}
</div>`;
}

function renderGridItem(node: any, context: TailwindRenderContext): string {
  const classes = 'bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow';
  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n    ');

  return `<div class="${classes}">
    ${childrenHTML}
  </div>`;
}

function renderHeading(node: any, context: TailwindRenderContext): string {
  const level = node.level || 1;
  let classes = 'font-bold text-gray-900 my-4';

  switch (level) {
    case 1:
      classes = 'text-4xl font-extrabold text-gray-900 mb-4 mt-8';
      break;
    case 2:
      classes = 'text-3xl font-bold text-gray-900 mb-3 mt-6';
      break;
    case 3:
      classes = 'text-2xl font-semibold text-gray-900 mb-2 mt-4';
      break;
    case 4:
      classes = 'text-xl font-semibold text-gray-800 mb-2 mt-4';
      break;
    case 5:
      classes = 'text-lg font-medium text-gray-800 mb-2 mt-3';
      break;
    case 6:
      classes = 'text-base font-medium text-gray-700 mb-2 mt-2';
      break;
  }

  const childrenHTML = node.children
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : escapeHtml(node.content || '');

  return `<h${level} class="${classes}">${childrenHTML}</h${level}>`;
}

function renderParagraph(node: any, context: TailwindRenderContext): string {
  const classes = 'text-gray-700 my-3';

  const childrenHTML = node.children
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : (node.content ? escapeHtml(node.content) : '');

  return `<p class="${classes}">${childrenHTML}</p>`;
}

function renderText(node: any): string {
  return escapeHtml(node.content || '');
}

function renderImage(node: any, _context: TailwindRenderContext): string {
  const classes = 'max-w-full h-auto rounded-lg shadow-md';
  const src = node.src || '';
  const alt = node.alt || '';

  const attrs: string[] = [];
  if (node.props.width) attrs.push(`width="${node.props.width}"`);
  if (node.props.height) attrs.push(`height="${node.props.height}"`);

  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="${classes}" ${attrs.join(' ')} />`;
}

function renderLink(node: any, context: TailwindRenderContext): string {
  const classes = 'text-indigo-600 hover:text-indigo-800 underline';
  const href = node.href || '#';
  const title = node.title ? ` title="${escapeHtml(node.title)}"` : '';

  const childrenHTML = node.children
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : escapeHtml(node.content || '');

  return `<a href="${escapeHtml(href)}" class="${classes}"${title}>${childrenHTML}</a>`;
}

function renderList(node: any, context: TailwindRenderContext): string {
  const classes = 'my-4 pl-6 space-y-2';
  const tag = node.ordered ? 'ol' : 'ul';
  const listStyle = node.ordered ? ' list-decimal' : ' list-disc';
  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n  ');

  return `<${tag} class="${classes}${listStyle}">
  ${childrenHTML}
</${tag}>`;
}

function renderListItem(node: any, context: TailwindRenderContext): string {
  const classes = 'text-gray-700';

  const childrenHTML = node.children
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : escapeHtml(node.content || '');

  return `<li class="${classes}">${childrenHTML}</li>`;
}

function renderTable(node: any, context: TailwindRenderContext): string {
  const classes = 'min-w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden my-6';

  const headerNode = node.children?.find((child: any) => child.type === 'table-header');
  const rowNodes = node.children?.filter((child: any) => child.type === 'table-row') || [];

  const headerHTML = headerNode ? renderNode(headerNode, context) : '';
  const rowsHTML = rowNodes.map((child: any) => renderNode(child, context)).join('\n    ');
  const bodyHTML = rowsHTML ? `\n  <tbody class="divide-y divide-gray-200">\n    ${rowsHTML}\n  </tbody>` : '';

  return `<table class="${classes}">
  ${headerHTML}${bodyHTML}
</table>`;
}

function renderTableHeader(node: any, context: TailwindRenderContext): string {
  const cellsHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n    ');

  return `<thead class="bg-gray-50">
    <tr>
      ${cellsHTML}
    </tr>
  </thead>`;
}

function renderTableRow(node: any, context: TailwindRenderContext): string {
  const cellsHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n    ');

  return `<tr class="hover:bg-gray-50">
    ${cellsHTML}
  </tr>`;
}

function renderTableCell(node: any, context: TailwindRenderContext): string {
  const tag = node.header ? 'th' : 'td';
  const align = node.align || 'left';
  let classes = 'px-6 py-3 text-gray-900';

  if (node.header) {
    classes = 'px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider';
  } else {
    if (align === 'center') classes += ' text-center';
    if (align === 'right') classes += ' text-right';
  }

  const contentHTML = node.children && node.children.length > 0
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : escapeHtml(node.content || '');

  return `<${tag} class="${classes}">${contentHTML}</${tag}>`;
}

function renderBlockquote(node: any, context: TailwindRenderContext): string {
  const classes = 'border-l-4 border-indigo-500 pl-4 my-4 text-gray-700 italic';
  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n  ');

  return `<blockquote class="${classes}">
  ${childrenHTML}
</blockquote>`;
}

function renderCode(node: any, context: TailwindRenderContext): string {
  const inline = node.inline !== false;

  if (inline) {
    const classes = 'bg-gray-100 text-indigo-600 rounded px-2 py-1 font-mono text-sm';
    return `<code class="${classes}">${escapeHtml(node.value)}</code>`;
  } else {
    const classes = 'bg-gray-900 text-gray-100 rounded-lg p-4 my-4 overflow-x-auto';
    const dataLang = node.lang ? ` data-lang="${escapeHtml(node.lang)}"` : '';
    return `<pre class="${classes}"><code class="font-mono text-sm"${dataLang}>${escapeHtml(node.value)}</code></pre>`;
  }
}

function renderSeparator(node: any, context: TailwindRenderContext): string {
  const classes = 'border-t border-gray-300 my-8';

  return `<hr class="${classes}" />`;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  if (!text) return '';

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
