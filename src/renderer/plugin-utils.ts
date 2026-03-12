import type {
  DocumentNode,
  RenderHelpers,
  WiremdNode,
  WiremdNodeType,
} from '../types.js';

export interface FrameworkField {
  key: string;
  sourceName: string;
  nodeType: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio';
  inputType?: string;
  initialValue: string | boolean | string[];
  options?: string[];
}

export interface FrameworkAnalysis {
  fields: FrameworkField[];
  hasForm: boolean;
  hasSubmitButton: boolean;
  nodeBindings: WeakMap<WiremdNode, string>;
}

export function createRenderHelpers(): RenderHelpers {
  const counters = new Map<string, number>();

  return {
    nextId(prefix = 'id'): string {
      const current = counters.get(prefix) ?? 0;
      const next = current + 1;
      counters.set(prefix, next);
      return `${prefix}-${next}`;
    },
    toIdentifier(value: string, fallbackPrefix = 'value'): string {
      const normalized = value
        .trim()
        .replace(/[^A-Za-z0-9]+/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .map((part, index) => {
          const lower = part.toLowerCase();
          if (index === 0) {
            return lower;
          }
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join('');

      if (!normalized) {
        return `${fallbackPrefix}${Math.abs(hashString(value))}`;
      }

      if (/^[0-9]/.test(normalized)) {
        return `${fallbackPrefix}${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`;
      }

      return normalized;
    },
    toKebabCase(value: string, fallbackPrefix = 'value'): string {
      const normalized = value
        .trim()
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[^A-Za-z0-9]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();

      if (!normalized) {
        return `${fallbackPrefix}-${Math.abs(hashString(value))}`;
      }

      if (/^[0-9]/.test(normalized)) {
        return `${fallbackPrefix}-${normalized}`;
      }

      return normalized;
    },
  };
}

export function repeatString(str: string, count: number): string {
  let result = '';
  for (let index = 0; index < count; index++) {
    result += str;
  }
  return result;
}

export function buildPrefixedClasses(prefix: string, baseClass: string, props: Record<string, unknown>): string {
  const classes = [`${prefix}${baseClass}`];
  const classNames = props.classes;

  if (Array.isArray(classNames)) {
    classNames.forEach((className) => {
      if (typeof className === 'string' && className) {
        classes.push(`${prefix}${className}`);
      }
    });
  }

  if (typeof props.variant === 'string' && props.variant) {
    classes.push(`${prefix}${baseClass}-${props.variant}`);
  }

  if (typeof props.state === 'string' && props.state) {
    classes.push(`${prefix}state-${props.state}`);
  }

  return classes.join(' ');
}

export function escapeHtml(text: string): string {
  if (!text) {
    return '';
  }

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function escapeJsString(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n');
}

export function getIconGlyph(name: string): string {
  const iconMap: Record<string, string> = {
    twitter: '𝕏',
    github: '⊙',
    linkedin: 'in',
    facebook: 'f',
    instagram: '◉',
    youtube: '▶',
    home: '🏠',
    user: '👤',
    settings: '⚙️',
    search: '🔍',
    star: '⭐',
    heart: '❤️',
    mail: '✉️',
    phone: '📞',
    calendar: '📅',
    clock: '🕐',
    location: '📍',
    link: '🔗',
    download: '⬇️',
    upload: '⬆️',
    edit: '✏️',
    delete: '🗑️',
    plus: '➕',
    minus: '➖',
    check: '✓',
    close: '✕',
    menu: '☰',
    more: '⋯',
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✅',
    'arrow-up': '↑',
    'arrow-down': '↓',
    'arrow-left': '←',
    'arrow-right': '→',
    chart: '📊',
    dollar: '$',
    euro: '€',
    pound: '£',
    code: '</>',
    database: '🗄️',
    cloud: '☁️',
    wifi: '📶',
    chat: '💬',
    video: '🎥',
    microphone: '🎤',
    bell: '🔔',
    file: '📄',
    folder: '📁',
    image: '🖼️',
    document: '📃',
    pdf: '📑',
    logo: '◈',
    brand: '◆',
    rocket: '🚀',
    bulb: '💡',
    shield: '🛡️',
    lock: '🔒',
    unlock: '🔓',
    key: '🔑',
    gift: '🎁',
    trophy: '🏆',
    flag: '🚩',
    bookmark: '🔖',
    tag: '🏷️',
    cart: '🛒',
    'credit-card': '💳',
    default: '●',
  };

  return iconMap[name] || iconMap.default;
}

export function analyzeFrameworkState(ast: DocumentNode, helpers: RenderHelpers): FrameworkAnalysis {
  const fields = new Map<string, FrameworkField>();
  const nodeBindings = new WeakMap<WiremdNode, string>();
  let hasForm = false;
  let hasSubmitButton = false;
  let anonymousIndex = 0;

  function ensureField(field: FrameworkField): void {
    if (!fields.has(field.key)) {
      fields.set(field.key, field);
    }
  }

  function resolveName(seed: string | undefined, fallbackPrefix: string): string {
    anonymousIndex += 1;
    return helpers.toIdentifier(seed || `${fallbackPrefix} ${anonymousIndex}`, fallbackPrefix);
  }

  function visit(nodes: WiremdNode[], radioGroupName?: string): void {
    nodes.forEach((node) => {
      switch (node.type) {
        case 'form':
          hasForm = true;
          visit(node.children, radioGroupName);
          return;

        case 'container':
        case 'nav':
        case 'brand':
        case 'grid':
        case 'grid-item':
        case 'list':
        case 'table':
        case 'table-header':
        case 'table-row':
        case 'blockquote':
        case 'radio-group':
          visit(getNodeChildren(node), node.type === 'radio-group'
            ? resolveName(
              typeof node.name === 'string' && node.name
                ? node.name
                : typeof node.props.name === 'string'
                  ? node.props.name
                  : undefined,
              'radioGroup',
            )
            : radioGroupName);
          return;

        case 'button':
          if ((node.props.type || 'button') === 'submit' || /submit/i.test(node.content || '')) {
            hasSubmitButton = true;
          }
          if (node.children) {
            visit(node.children, radioGroupName);
          }
          return;

        case 'input':
          {
            const key = resolveName(
              typeof node.props.name === 'string'
                ? node.props.name
                : typeof node.props.placeholder === 'string'
                  ? node.props.placeholder
                  : undefined,
              'field',
            );
            nodeBindings.set(node, key);
            ensureField({
              key,
              sourceName: key,
              nodeType: 'input',
              inputType: typeof node.props.inputType === 'string' ? node.props.inputType : 'text',
              initialValue: typeof node.props.value === 'string' ? node.props.value : '',
            });
          }
          return;

        case 'textarea':
          {
            const key = resolveName(
              typeof node.props.name === 'string'
                ? node.props.name
                : typeof node.props.placeholder === 'string'
                  ? node.props.placeholder
                  : undefined,
              'field',
            );
            nodeBindings.set(node, key);
            ensureField({
              key,
              sourceName: key,
              nodeType: 'textarea',
              initialValue: typeof node.props.value === 'string' ? node.props.value : '',
            });
          }
          return;

        case 'select':
          {
            const key = resolveName(
              typeof node.props.name === 'string'
                ? node.props.name
                : typeof node.props.placeholder === 'string'
                  ? node.props.placeholder
                  : undefined,
              'select',
            );
            nodeBindings.set(node, key);
            ensureField({
              key,
              sourceName: key,
              nodeType: 'select',
              initialValue: typeof node.props.value === 'string'
                ? node.props.value
                : node.options.find((option) => option.selected)?.value || '',
              options: node.options.map((option) => option.value),
            });
          }
          return;

        case 'checkbox':
          {
            const key = resolveName(
              typeof node.props.name === 'string'
                ? node.props.name
                : node.label,
              'checkbox',
            );
            nodeBindings.set(node, key);
            ensureField({
              key,
              sourceName: key,
              nodeType: 'checkbox',
              initialValue: Boolean(node.checked),
            });
          }
          if (node.children) {
            visit(node.children, radioGroupName);
          }
          return;

        case 'radio': {
          const key = radioGroupName || resolveName(typeof node.props.name === 'string' ? node.props.name : node.label, 'radioGroup');
          nodeBindings.set(node, key);
          const existing = fields.get(key);
          const optionValue = typeof node.props.value === 'string' ? node.props.value : node.label;
          const options = existing?.options ? [...existing.options] : [];
          if (!options.includes(optionValue)) {
            options.push(optionValue);
          }

          fields.set(key, {
            key,
            sourceName: key,
            nodeType: 'radio',
            initialValue: node.selected ? optionValue : (existing?.initialValue || ''),
            options,
          });

          if (node.children) {
            visit(node.children, radioGroupName);
          }
          return;
        }

        default:
          if ('children' in node && Array.isArray(node.children)) {
            visit(node.children, radioGroupName);
          }
      }
    });
  }

  visit(ast.children);

  return {
    fields: Array.from(fields.values()),
    hasForm,
    hasSubmitButton,
    nodeBindings,
  };
}

export function collectReachableNodeTypes(ast: DocumentNode): WiremdNodeType[] {
  const types = new Set<WiremdNodeType>();

  function visit(nodes: WiremdNode[]): void {
    nodes.forEach((node) => {
      types.add(node.type);
      if ('children' in node && Array.isArray(node.children)) {
        visit(node.children);
      }
    });
  }

  visit(ast.children);
  return Array.from(types);
}

function getNodeChildren(node: WiremdNode): WiremdNode[] {
  if ('children' in node && Array.isArray(node.children)) {
    return node.children;
  }
  return [];
}

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(index);
    hash |= 0;
  }
  return hash;
}
