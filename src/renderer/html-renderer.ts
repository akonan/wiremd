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
}

/**
 * Render a wiremd AST node to HTML
 */
export function renderNode(node: WiremdNode, context: RenderContext): string {
  if (node == null) return '';
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

    case 'badge':
      return renderBadge(node, context);

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

    case 'row':
      return renderRow(node, context);


    case 'heading':
      return renderHeading(node, context);

    case 'paragraph':
      return renderParagraph(node, context);

    case 'text':
      return renderText(node, context);

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

    case 'tabs':
      return renderTabs(node, context);

    case 'tab':
      return renderTab(node, context);

    case 'breadcrumbs':
      return renderBreadcrumbs(node, context);

    case 'demo':
      return renderDemo(node, context);

    default:
      return `<!-- Unknown node type: ${(node as any).type} -->`;
  }
}

function renderButton(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'button', node.props);
  const disabled = node.props.state === 'disabled' ? ' disabled' : '';
  const loading = node.props.state === 'loading' ? ` ${prefix}loading` : '';

  // Handle children (like icons in buttons)
  const contentHTML = node.children
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : escapeHtml(node.content);

  const href = node.href || node.props?.href;
  if (href) {
    return `<a href="${escapeHtml(href)}" class="${classes}${loading}">${contentHTML}</a>`;
  }

  return `<button class="${classes}${loading}"${disabled}>${contentHTML}</button>`;
}

function renderBadge(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'badge', node.props);
  return `<span class="${classes}">${escapeHtml(node.content)}</span>`;
}

function renderInput(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'input', node.props);
  const type = node.props.inputType || node.props.type || 'text';
  const required = node.props.required ? ' required' : '';
  const disabled = node.props.disabled ? ' disabled' : '';
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
  const disabled = node.props.disabled ? ' disabled' : '';
  const placeholder = node.props.placeholder ? ` placeholder="${escapeHtml(node.props.placeholder)}"` : '';
  const value = node.props.value || '';

  return `<textarea class="${classes}" rows="${rows}"${placeholder}${required}${disabled}>${escapeHtml(value)}</textarea>`;
}

function renderSelect(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'select', node.props);
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

function renderCheckbox(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'checkbox', node.props);
  const checked = node.checked ? ' checked' : '';
  const disabled = node.props.disabled ? ' disabled' : '';
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
  const disabled = node.props.disabled ? ' disabled' : '';
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

  const nodeClasses: string[] = node.props?.classes || [];
  if (node.containerType === 'layout' && nodeClasses.includes('sidebar-main')) {
    return renderSidebarMainLayout(node, context, classes);
  }

  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n  ');

  return `<div class="${classes}">
  ${childrenHTML}
</div>`;
}

function renderSidebarMainLayout(node: any, context: RenderContext, classes: string): string {
  const { classPrefix: prefix } = context;
  const children: any[] = node.children || [];

  const sections: { name: string; nodes: any[] }[] = [];
  let current: { name: string; nodes: any[] } | null = null;

  for (const child of children) {
    if (child.type === 'container' && (child.containerType === 'sidebar' || child.containerType === 'main')) {
      if (current) sections.push(current);
      sections.push({ name: child.containerType, nodes: child.children || [] });
      current = null;
    } else {
      const childClasses: string[] = child.props?.classes || [];
      if (child.type === 'heading' && (childClasses.includes('sidebar') || childClasses.includes('main'))) {
        if (current) sections.push(current);
        current = { name: childClasses.includes('sidebar') ? 'sidebar' : 'main', nodes: [] };
      } else if (current) {
        current.nodes.push(child);
      }
    }
  }
  if (current) sections.push(current);

  const sectionsHTML = sections.map((s) => {
    const contentHTML = s.nodes.map((child: any) => renderNode(child, context)).join('\n    ');
    return `  <div class="${prefix}layout-${s.name}">
    ${contentHTML}
  </div>`;
  }).join('\n');

  return `<div class="${classes}">
${sectionsHTML}
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
  const href = node.href || '#';

  const contentHTML = node.children
    ? node.children.map((child: any) => renderNode(child, context)).join('')
    : escapeHtml(node.content);

  if (node.props?.variant === 'primary') {
    const classes = `${buildClasses(prefix, 'button', node.props)} ${prefix}button-primary`;
    return `<a href="${href}" class="${classes.trim()}" style="text-decoration:none;color:inherit;">${contentHTML}</a>`;
  }

  const classes = buildClasses(prefix, 'nav-item', node.props);
  return `<a href="${href}" class="${classes}">${contentHTML}</a>`;
}

function renderBreadcrumbs(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const items: any[] = node.children || [];
  const crumbsHTML = items.map((crumb: any, i: number) => {
    const isLast = i === items.length - 1;
    const label = escapeHtml(crumb.content || '');
    return isLast
      ? `<span class="${prefix}breadcrumb-item ${prefix}breadcrumb-current" aria-current="page">${label}</span>`
      : `<span class="${prefix}breadcrumb-item"><a href="#">${label}</a></span><span class="${prefix}breadcrumb-sep" aria-hidden="true">›</span>`;
  }).join('');
  return `<nav class="${prefix}breadcrumbs" aria-label="breadcrumb">${crumbsHTML}</nav>`;
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
  const gridClass = `${classes} ${prefix}grid-${columns}`;
  const isCard = !!node.props?.card;
  const childrenHTML = (node.children || []).map((child: any) => renderGridItem(child, context, isCard)).join('\n  ');

  return `<div class="${gridClass}" style="--grid-columns: ${columns}">
  ${childrenHTML}
</div>`;
}

function renderGridItem(node: any, context: RenderContext, isCard = false): string {
  const { classPrefix: prefix } = context;
  const extraClasses = isCard ? [...(node.props?.classes || []), 'grid-item-card'] : (node.props?.classes || []);
  const itemProps = { ...node.props, classes: extraClasses };
  const classes = buildClasses(prefix, 'grid-item', itemProps);
  const childrenHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n    ');

  return `<div class="${classes}">
    ${childrenHTML}
  </div>`;
}

function renderRow(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'row', node.props);
  const childrenHTML = (node.children || []).map((child: any) => renderGridItem(child, context)).join('\n  ');

  return `<div class="${classes}">
  ${childrenHTML}
</div>`;
}

function renderHeading(node: any, context: RenderContext): string {
  if (!node.content && !node.children?.length) return '';

  const { classPrefix: prefix } = context;
  const level = node.level || 1;
  const classes = buildClasses(prefix, `h${level}`, node.props);
  const content = node.content || '';

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

function renderTabs(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const classes = buildClasses(prefix, 'tabs', node.props);
  const tabs: any[] = node.children || [];

  const headers = tabs.map((tab: any, i: number) => {
    const activeClass = tab.active ? ` ${prefix}active` : '';
    return `<button type="button" role="tab" class="${prefix}tab-header${activeClass}" data-wmd-tab="${i}">${escapeHtml(tab.label || '')}</button>`;
  }).join('');

  const panels = tabs.map((tab: any, i: number) => {
    const panelChildren = (tab.children || []).map((c: any) => renderNode(c, context)).join('\n    ');
    const hidden = tab.active ? '' : ' hidden';
    return `<div class="${prefix}tab-panel" role="tabpanel" data-wmd-tab-panel="${i}"${hidden}>
    ${panelChildren}
  </div>`;
  }).join('\n  ');

  return `<div class="${classes}" data-wmd-tabs>
  <div class="${prefix}tab-headers" role="tablist">${headers}</div>
  <div class="${prefix}tab-panels">
  ${panels}
  </div>
</div>${getTabsScript(prefix)}`;
}

function renderTab(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const hidden = node.active ? '' : ' hidden';
  const childrenHTML = (node.children || []).map((c: any) => renderNode(c, context)).join('');
  return `<div class="${prefix}tab-panel" role="tabpanel"${hidden}>${childrenHTML}</div>`;
}

function getTabsScript(prefix: string): string {
  return `<script>(function(){if(window.__wmdTabsInit)return;window.__wmdTabsInit=true;document.addEventListener('click',function(e){var btn=e.target.closest('.${prefix}tab-header');if(!btn)return;var root=btn.closest('[data-wmd-tabs]');if(!root)return;var idx=btn.getAttribute('data-wmd-tab');root.querySelectorAll('.${prefix}tab-header').forEach(function(b){b.classList.toggle('${prefix}active',b.getAttribute('data-wmd-tab')===idx);});root.querySelectorAll('[data-wmd-tab-panel]').forEach(function(p){if(p.getAttribute('data-wmd-tab-panel')===idx){p.removeAttribute('hidden');}else{p.setAttribute('hidden','');}});});})();</script>`;
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

  // Add state class
  if (props.state) {
    classes.push(`${prefix}state-${props.state}`);
  }

  return classes.join(' ');
}

function renderDemo(node: any, context: RenderContext): string {
  const { classPrefix: prefix } = context;
  const previewHTML = (node.children || []).map((child: any) => renderNode(child, context)).join('\n');
  const codeHTML = escapeHtml(node.raw || '');
  return `<div class="${prefix}demo">
  <div class="${prefix}demo-preview">${previewHTML}</div>
  <div class="${prefix}demo-code">
    <div class="${prefix}demo-code-toolbar">
      <button class="${prefix}demo-copy" onclick="(function(btn){var code=btn.closest('.${prefix}demo-code').querySelector('code');navigator.clipboard.writeText(code.textContent).then(function(){btn.textContent='Copied!';setTimeout(function(){btn.textContent='Copy'},1500)})})(this)">Copy</button>
    </div>
    <pre><code>${codeHTML}</code></pre>
  </div>
</div>`;
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
