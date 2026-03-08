/**
 * HTML Renderer for wiremd AST nodes
 * Converts each AST node type to HTML
 *
 * Copyright (c) 2025 wiremd
 * Licensed under MIT License
 * https://github.com/akonan/wiremd/blob/main/LICENSE
 */

import type { WiremdNode } from '../types.js';

export interface RenderContext {
  style: string;
  classPrefix: string;
  inlineStyles: boolean;
  pretty: boolean;
  showAnnotations?: boolean;
}

/**
 * Render a wiremd AST node to HTML
 */
export function renderNode(node: WiremdNode, context: RenderContext): string {
  if (isAnnotationOnlyNode(node) && !context.showAnnotations) {
    return '';
  }

  let rendered = '';

  switch (node.type) {
    case 'button':
      rendered = renderButton(node, context);
      break;

    case 'input':
      rendered = renderInput(node, context);
      break;

    case 'textarea':
      rendered = renderTextarea(node, context);
      break;

    case 'select':
      rendered = renderSelect(node, context);
      break;

    case 'checkbox':
      rendered = renderCheckbox(node, context);
      break;

    case 'radio':
      rendered = renderRadio(node, context);
      break;

    case 'radio-group':
      rendered = renderRadioGroup(node, context);
      break;

    case 'icon':
      rendered = renderIcon(node, context);
      break;

    case 'container':
      rendered = renderContainer(node, context);
      break;

    case 'nav':
      rendered = renderNav(node, context);
      break;

    case 'nav-item':
      rendered = renderNavItem(node, context);
      break;

    case 'brand':
      rendered = renderBrand(node, context);
      break;

    case 'grid':
      rendered = renderGrid(node, context);
      break;

    case 'grid-item':
      rendered = renderGridItem(node, context);
      break;

    case 'heading':
      rendered = renderHeading(node, context);
      break;

    case 'paragraph':
      rendered = renderParagraph(node, context);
      break;

    case 'text':
      rendered = renderText(node, context);
      break;

    case 'image':
      rendered = renderImage(node, context);
      break;

    case 'link':
      rendered = renderLink(node, context);
      break;

    case 'list':
      rendered = renderList(node, context);
      break;

    case 'list-item':
      rendered = renderListItem(node, context);
      break;

    case 'table':
      rendered = renderTable(node, context);
      break;

    case 'table-header':
      rendered = renderTableHeader(node, context);
      break;

    case 'table-row':
      rendered = renderTableRow(node, context);
      break;

    case 'table-cell':
      rendered = renderTableCell(node, context);
      break;

    case 'blockquote':
      rendered = renderBlockquote(node, context);
      break;

    case 'code':
      rendered = renderCode(node, context);
      break;

    case 'separator':
      rendered = renderSeparator(node, context);
      break;

    default:
      rendered = `<!-- Unknown node type: ${(node as any).type} -->`;
      break;
  }

  return appendAnnotationMarkup(rendered, node, context);
}

function renderButton(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'button', node.props);
  const disabled = hasState(node.props, 'disabled') || node.props.disabled ? ' disabled' : '';
  const loading = hasState(node.props, 'loading') ? ` ${prefix}loading` : '';

  // Handle children (like icons in buttons)
  const contentHTML = node.children
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : escapeHtml(node.content);

  return `<button class="${classes}${loading}"${disabled}>${contentHTML}</button>`;
}

function renderInput(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'input', node.props);
  const type = node.props.inputType || node.props.type || 'text';
  const required = node.props.required ? ' required' : '';
  const disabled = (node.props.disabled || hasState(node.props, 'disabled')) ? ' disabled' : '';
  const placeholder = node.props.placeholder ? ` placeholder="${escapeHtml(node.props.placeholder)}"` : '';
  const value = node.props.value ? ` value="${escapeHtml(node.props.value)}"` : '';

  // Apply width based on underscore count (each underscore ~= 1ch width)
  const style = node.props.width ? ` style="width: ${node.props.width}ch; max-width: ${node.props.width}ch;"` : '';

  return `<input type="${type}" class="${classes}"${placeholder}${value}${required}${disabled}${style} />`;
}

function renderTextarea(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'textarea', node.props);
  const rows = node.props.rows || 4;
  const required = node.props.required ? ' required' : '';
  const disabled = (node.props.disabled || hasState(node.props, 'disabled')) ? ' disabled' : '';
  const placeholder = node.props.placeholder ? ` placeholder="${escapeHtml(node.props.placeholder)}"` : '';
  const value = node.props.value || '';

  return `<textarea class="${classes}" rows="${rows}"${placeholder}${required}${disabled}>${escapeHtml(value)}</textarea>`;
}

function renderSelect(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'select', node.props);
  const required = node.props.required ? ' required' : '';
  const disabled = (node.props.disabled || hasState(node.props, 'disabled')) ? ' disabled' : '';
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

function renderCheckbox(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'checkbox', node.props);
  const checked = node.checked ? ' checked' : '';
  const disabled = (node.props.disabled || hasState(node.props, 'disabled')) ? ' disabled' : '';
  const value = node.props.value ? ` value="${escapeHtml(node.props.value)}"` : '';

  // Separate inline children (icons/text) from nested children (lists)
  let labelHTML = escapeHtml(node.label || '');
  let nestedHTML = '';

  if (node.children) {
    const inlineChildren: any[] = [];
    const nestedChildren: any[] = [];

    for (const child of node.children) {
      if (child.type === 'list') {
        nestedChildren.push(child);
      } else {
        inlineChildren.push(child);
      }
    }

    if (inlineChildren.length > 0) {
      labelHTML = inlineChildren.map((child: any) => renderNode(child, context)).join('');
    }

    if (nestedChildren.length > 0) {
      nestedHTML = nestedChildren.map((child: any) => renderNode(child, context)).join('');
    }
  }

  return `<label class="${classes}">
    <input type="checkbox"${checked}${disabled}${value} />
    <span>${labelHTML}</span>
  </label>${nestedHTML}`;
}

function renderRadio(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'radio', node.props);
  const checked = node.selected ? ' checked' : '';
  const disabled = (node.props.disabled || hasState(node.props, 'disabled')) ? ' disabled' : '';
  const name = node.props.name ? ` name="${escapeHtml(node.props.name)}"` : '';
  const value = node.props.value ? ` value="${escapeHtml(node.props.value)}"` : '';

  // Handle children (nested lists or other content)
  const labelHTML = escapeHtml(node.label);
  const childrenHTML = node.children
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : '';

  return `<label class="${classes}">
    <input type="radio"${checked}${disabled}${name}${value} />
    <span>${labelHTML}</span>
  </label>${childrenHTML}`;
}

function renderRadioGroup(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const isInline = node.props?.inline;
  const classes = buildClasses(prefix, 'radio-group', node.props);
  const inlineClass = isInline ? ` ${prefix}radio-group-inline` : '';

  // Generate a unique name for this radio group
  const groupName = `radio-${Math.random().toString(36).substr(2, 9)}`;

  const radios = (node.children || []).map((child: any) => {
    // Add the group name to each radio button
    if (child.type === 'radio') {
      const modifiedChild = { ...child, props: { ...child.props, name: groupName } };
      return renderNode(modifiedChild, context);
    }
    return renderNode(child, context);
  }).join('\n    ');

  return `<div class="${classes}${inlineClass}">
    ${radios}
</div>`;
}

function renderIcon(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'icon', node.props);
  const iconName = node.props.name || 'default';

  // Icon mapping - using Unicode symbols and emoji
  const iconMap: Record<string, string> = {
    // Social media
    'twitter': '𝕏', // Twitter/X logo approximation
    'github': '⊙', // GitHub-like symbol
    'linkedin': 'in', // LinkedIn text representation
    'facebook': 'f',
    'instagram': '◉',
    'youtube': '▶',

    // Common UI icons
    'home': '🏠',
    'user': '👤',
    'settings': '⚙️',
    'search': '🔍',
    'star': '⭐',
    'heart': '❤️',
    'mail': '✉️',
    'phone': '📞',
    'calendar': '📅',
    'clock': '🕐',
    'location': '📍',
    'link': '🔗',
    'download': '⬇️',
    'upload': '⬆️',
    'edit': '✏️',
    'delete': '🗑️',
    'plus': '➕',
    'minus': '➖',
    'check': '✓',
    'close': '✕',
    'menu': '☰',
    'more': '⋯',
    'info': 'ℹ️',
    'warning': '⚠️',
    'error': '❌',
    'success': '✅',

    // Arrows
    'arrow-up': '↑',
    'arrow-down': '↓',
    'arrow-left': '←',
    'arrow-right': '→',

    // Business/Finance
    'chart': '📊',
    'dollar': '$',
    'euro': '€',
    'pound': '£',

    // Tech
    'code': '</>',
    'database': '🗄️',
    'cloud': '☁️',
    'wifi': '📶',

    // Communication
    'chat': '💬',
    'video': '🎥',
    'microphone': '🎤',
    'bell': '🔔',

    // Files
    'file': '📄',
    'folder': '📁',
    'image': '🖼️',
    'document': '📃',
    'pdf': '📑',

    // Brand placeholders
    'logo': '◈',
    'brand': '◆',

    // Activities
    'rocket': '🚀',
    'bulb': '💡',
    'shield': '🛡️',
    'lock': '🔒',
    'unlock': '🔓',
    'key': '🔑',
    'gift': '🎁',
    'trophy': '🏆',
    'flag': '🚩',
    'bookmark': '🔖',
    'tag': '🏷️',
    'cart': '🛒',
    'credit-card': '💳',

    // Default
    'default': '●'
  };

  const iconContent = iconMap[iconName] || iconMap['default'];

  // For social media icons, wrap in a styled span to make them look more icon-like
  const socialIcons = ['twitter', 'github', 'linkedin', 'facebook', 'instagram', 'youtube'];
  if (socialIcons.includes(iconName)) {
    return `<span class="${classes}" data-icon="${iconName}" aria-label="${iconName}" style="font-family: monospace; font-weight: bold; font-style: normal;">${iconContent}</span>`;
  }

  return `<span class="${classes}" data-icon="${iconName}" aria-label="${iconName}">${iconContent}</span>`;
}

function renderContainer(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, `container-${node.containerType}`, node.props);
  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n  ');

  return `<div class="${classes}">
  ${childrenHTML}
</div>`;
}

function renderNav(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'nav', node.props);
  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n    ');

  return `<nav class="${classes}">
  <div class="${prefix}nav-content">
    ${childrenHTML}
  </div>
</nav>`;
}

function renderNavItem(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'nav-item', node.props);
  const href = node.href || '#';

  // Handle both content (string) and children (array of nodes)
  const contentHTML = node.children
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : escapeHtml(node.content);

  return `<a href="${href}" class="${classes}">${contentHTML}</a>`;
}

function renderBrand(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'brand', node.props);
  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('');

  return `<div class="${classes}">${childrenHTML}</div>`;
}

function renderGrid(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'grid', node.props);
  const columns = node.columns || 3;
  const responsiveClass = buildResponsiveGridClasses(prefix, node.props?.responsive?.gridColumns);
  const gridClass = `${classes} ${prefix}grid-${columns}${responsiveClass ? ` ${responsiveClass}` : ''}`;
  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n  ');

  return `<div class="${gridClass}" style="--grid-columns: ${columns}">
  ${childrenHTML}
</div>`;
}

function renderGridItem(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'grid-item', node.props);
  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n    ');

  return `<div class="${classes}">
    ${childrenHTML}
  </div>`;
}

function renderHeading(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const level = node.level || 1;
  const classes = buildClasses(prefix, `h${level}`, node.props);
  const content = node.content || '';

  // Handle children (like icons in headings)
  const childrenHTML = node.children
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : escapeHtml(content);

  return `<h${level} class="${classes}">${childrenHTML}</h${level}>`;
}

function renderParagraph(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'paragraph', node.props);

  let childrenHTML: string;
  if (node.children) {
    childrenHTML = node.children.map((child: any) => renderNode(child, context)).join('');
  } else if (node.content) {
    // Check if content contains HTML tags (rich content)
    const hasHtmlTags = /<[^>]+>/.test(node.content);
    childrenHTML = hasHtmlTags ? node.content : escapeHtml(node.content);
  } else {
    childrenHTML = '';
  }

  return `<p class="${classes}">${childrenHTML}</p>`;
}

function renderText(node: any, _context: RenderContext): string {
  const content = node.content || '';
  // Check if content contains HTML tags (rich content)
  const hasHtmlTags = /<[^>]+>/.test(content);
  return hasHtmlTags ? content : escapeHtml(content);
}

function renderImage(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'image', node.props);
  const src = node.src || '';
  const alt = node.alt || '';
  const width = node.props.width ? ` width="${node.props.width}"` : '';
  const height = node.props.height ? ` height="${node.props.height}"` : '';

  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="${classes}"${width}${height} />`;
}

function renderLink(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'link', node.props);
  const href = node.href || '#';
  const title = node.title ? ` title="${escapeHtml(node.title)}"` : '';

  const childrenHTML = node.children
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : escapeHtml(node.content || '');

  return `<a href="${escapeHtml(href)}" class="${classes}"${title}>${childrenHTML}</a>`;
}

function renderList(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'list', node.props);
  const tag = node.ordered ? 'ol' : 'ul';
  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n  ');

  return `<${tag} class="${classes}">
  ${childrenHTML}
</${tag}>`;
}

function renderListItem(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'list-item', node.props);

  // Handle both content and children (for nested lists)
  let html = '';

  // Add the immediate text content if present
  if (node.content) {
    html = escapeHtml(node.content);
  }

  // Add children (like nested lists or icons)
  if (node.children) {
    const childrenHTML = node.children.map((child: any) => renderNode(child, context)).join('');
    html += childrenHTML;
  }

  return `<li class="${classes}">${html}</li>`;
}

function renderTable(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'table', node.props);

  // Separate header from rows
  const headerNode = node.children?.find((child: any) => child.type === 'table-header');
  const rowNodes = node.children?.filter((child: any) => child.type === 'table-row') || [];

  const headerHTML = headerNode ? renderNode(headerNode, context) : '';
  const rowsHTML = rowNodes.map((child: any) => renderNode(child, context)).join('\n    ');
  const bodyHTML = rowsHTML ? `\n  <tbody>\n    ${rowsHTML}\n  </tbody>` : '';

  return `<table class="${classes}">
  ${headerHTML}${bodyHTML}
</table>`;
}

function renderTableHeader(node: any, context: RenderContext): string {
  const cellsHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n    ');
  return `<thead>
    <tr>
      ${cellsHTML}
    </tr>
  </thead>`;
}

function renderTableRow(node: any, context: RenderContext): string {
  const cellsHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n    ');
  return `<tr>
    ${cellsHTML}
  </tr>`;
}

function renderTableCell(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const tag = node.header ? 'th' : 'td';
  const align = node.align || 'left';
  const classes = buildClasses(prefix, `table-cell ${prefix}align-${align}`, {});

  // Use children if available, otherwise use content
  const contentHTML = node.children && node.children.length > 0
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : escapeHtml(node.content || '');

  return `<${tag} class="${classes}">${contentHTML}</${tag}>`;
}

function renderBlockquote(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'blockquote', node.props);
  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n  ');

  return `<blockquote class="${classes}">
  ${childrenHTML}
</blockquote>`;
}

function renderCode(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const inline = node.inline !== false;

  if (inline) {
    const classes = buildClasses(prefix, 'code-inline', {});
    return `<code class="${classes}">${escapeHtml(node.value)}</code>`;
  } else {
    const classes = buildClasses(prefix, 'code-block', {});
    const lang = node.lang ? ` data-lang="${escapeHtml(node.lang)}"` : '';
    return `<pre class="${classes}"><code${lang}>${escapeHtml(node.value)}</code></pre>`;
  }
}

function renderSeparator(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'separator', node.props);

  return `<hr class="${classes}" />`;
}

/**
 * Build CSS classes string from prefix, base class, and props
 */
function buildClasses(prefix: string, baseClass: string, props: any): string {
  const classes = [`${prefix}${baseClass}`];

  // Add custom classes
  if (props.classes && Array.isArray(props.classes)) {
    props.classes.forEach((cls: string) => {
      classes.push(`${prefix}${cls}`);
    });
  }

  // Add variant class
  if (props.variant) {
    classes.push(`${prefix}${baseClass}-${props.variant}`);
  }

  const states = getStates(props);
  states.forEach((state) => {
    classes.push(`${prefix}state-${state}`);
  });

  return classes.join(' ');
}

function getStates(props: any): string[] {
  if (!props || typeof props !== 'object') {
    return [];
  }

  const states: string[] = [];

  if (typeof props.state === 'string' && props.state.trim()) {
    states.push(props.state.trim());
  }

  if (Array.isArray(props.states)) {
    props.states.forEach((state: unknown) => {
      if (typeof state === 'string' && state.trim() && !states.includes(state.trim())) {
        states.push(state.trim());
      }
    });
  }

  return states;
}

function hasState(props: any, state: string): boolean {
  return getStates(props).includes(state);
}

function buildResponsiveGridClasses(prefix: string, gridColumns?: Record<string, number>): string {
  if (!gridColumns || typeof gridColumns !== 'object') {
    return '';
  }

  const classes: string[] = [];
  Object.entries(gridColumns).forEach(([breakpoint, columns]) => {
    if (typeof columns === 'number' && columns > 0) {
      classes.push(`${prefix}grid-${breakpoint}-${columns}`);
    }
  });

  return classes.join(' ');
}

function appendAnnotationMarkup(rendered: string, node: WiremdNode, context: RenderContext): string {
  if (!context.showAnnotations) {
    return rendered;
  }

  const annotationText = buildAnnotationText((node as any).props);
  if (!annotationText) {
    return rendered;
  }

  const prefix = context.classPrefix;
  return `${rendered}\n<div class="${prefix}annotation-callout">${escapeHtml(annotationText)}</div>`;
}

function isAnnotationOnlyNode(node: WiremdNode): boolean {
  if (node.type !== 'container') {
    return false;
  }

  const props: any = (node as any).props;
  if (!props || typeof props !== 'object') {
    return false;
  }

  if (props.annotationRole === 'note') {
    return true;
  }

  return Array.isArray(props.classes) && props.classes.includes('annotation-note');
}

function buildAnnotationText(props: any): string {
  if (!props || typeof props !== 'object') {
    return '';
  }

  const entries: string[] = [];
  const seen = new Set<string>();

  const push = (prefix: string, value: unknown): void => {
    if (typeof value !== 'string' || !value.trim()) {
      return;
    }
    const text = prefix ? `${prefix}: ${value.trim()}` : value.trim();
    if (!seen.has(text)) {
      seen.add(text);
      entries.push(text);
    }
  };

  push('Annotation', props.annotation);
  push('TODO', props.todo);
  push('Version', props.versionNote);

  if (Array.isArray(props.annotations)) {
    props.annotations.forEach((annotation: any) => {
      if (!annotation || typeof annotation !== 'object') {
        return;
      }

      if (typeof annotation.todo === 'string' && annotation.todo.trim()) {
        push('TODO', annotation.todo);
      } else if (typeof annotation.version === 'string' && annotation.version.trim()) {
        push('Version', annotation.version);
      } else if (typeof annotation.note === 'string' && annotation.note.trim()) {
        push('Note', annotation.note);
      } else if (typeof annotation.text === 'string' && annotation.text.trim()) {
        push('Annotation', annotation.text);
      }
    });
  }

  return entries.join(' | ');
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
