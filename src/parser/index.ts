/**
 * wiremd Parser
 * Converts markdown with wiremd syntax into AST
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { DocumentNode, ParseOptions, ValidationError } from '../types.js';
import { transformToWiremdAST } from './transformer.js';
import { remarkWiremdContainers } from './remark-containers.js';
import { remarkWiremdInlineContainers } from './remark-inline-containers.js';

/**
 * Parse markdown with wiremd syntax into AST
 *
 * @param input - Markdown string with wiremd syntax
 * @param options - Parse options
 * @returns wiremd AST (DocumentNode)
 *
 * @example
 * ```ts
 * import { parse } from 'markdown-mockup/parser';
 *
 * const ast = parse(`
 *   ## Contact Form
 *   Name
 *   [_____________________________]
 *   [Submit]{.primary}
 * `);
 * ```
 */
export function parse(input: string, options: ParseOptions = {}): DocumentNode {
  // Create unified processor with remark
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkWiremdInlineContainers)
    .use(remarkWiremdContainers);

  // Parse markdown to MDAST
  const mdast = processor.parse(input);

  // Run the processor to apply plugins
  const processed = processor.runSync(mdast) as any;

  // Transform MDAST to wiremd AST
  const wiremdAST = transformToWiremdAST(processed, options);

  return wiremdAST;
}

/**
 * Validate a wiremd AST
 *
 * @param ast - wiremd AST to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validate(ast: DocumentNode): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate document structure
  if (!ast.type || ast.type !== 'document') {
    errors.push({
      message: 'Root node must be of type "document"',
      code: 'INVALID_ROOT_TYPE',
    });
    return errors; // Can't continue if root is invalid
  }

  if (!ast.meta) {
    errors.push({
      message: 'Document must have metadata',
      code: 'MISSING_META',
    });
  }

  if (!Array.isArray(ast.children)) {
    errors.push({
      message: 'Document children must be an array',
      code: 'INVALID_CHILDREN',
    });
    return errors; // Can't continue without children array
  }

  // Validate children recursively
  function validateNode(node: any, path: string[] = []): void {
    if (!node || typeof node !== 'object') {
      errors.push({
        message: 'Node must be an object',
        path,
        code: 'INVALID_NODE',
      });
      return;
    }

    if (!node.type) {
      errors.push({
        message: 'Node must have a type property',
        path,
        code: 'MISSING_NODE_TYPE',
      });
      return;
    }

    const nodeType = node.type;

    // Validate component type is recognized
    const validTypes = [
      'container', 'nav', 'nav-item', 'brand', 'grid', 'grid-item',
      'button', 'input', 'textarea', 'select', 'option', 'checkbox', 'radio', 'radio-group', 'form',
      'heading', 'paragraph', 'text', 'image', 'icon', 'link', 'list', 'list-item',
      'table', 'table-header', 'table-row', 'table-cell', 'blockquote', 'code',
      'tabs', 'tab', 'accordion', 'accordion-item', 'breadcrumbs', 'breadcrumb-item',
      'alert', 'badge', 'separator',
      'loading-state', 'empty-state', 'error-state'
    ];

    if (!validTypes.includes(nodeType)) {
      errors.push({
        message: `Unknown component type: "${nodeType}". Must be one of: ${validTypes.join(', ')}`,
        path,
        code: 'INVALID_COMPONENT_TYPE',
      });
      return; // Can't validate further if type is unknown
    }

    // Validate required properties for each component type
    switch (nodeType) {
      case 'container':
        if (!node.containerType) {
          errors.push({
            message: 'Container must have a containerType property',
            path,
            code: 'MISSING_CONTAINER_TYPE',
          });
        } else {
          const validContainerTypes = ['hero', 'card', 'modal', 'sidebar', 'footer', 'alert', 'grid', 'layout', 'section', 'form-group', 'button-group'];
          if (!validContainerTypes.includes(node.containerType)) {
            errors.push({
              message: `Invalid containerType: "${node.containerType}". Must be one of: ${validContainerTypes.join(', ')}`,
              path,
              code: 'INVALID_CONTAINER_TYPE',
            });
          }
        }
        if (!node.props || typeof node.props !== 'object') {
          errors.push({
            message: 'Container must have a props object',
            path,
            code: 'MISSING_PROPS',
          });
        }
        if (!Array.isArray(node.children)) {
          errors.push({
            message: 'Container must have a children array',
            path,
            code: 'MISSING_CHILDREN',
          });
        }
        break;

      case 'heading':
        if (!node.level || ![1, 2, 3, 4, 5, 6].includes(node.level)) {
          errors.push({
            message: `Heading must have a level property between 1 and 6, got: ${node.level}`,
            path,
            code: 'INVALID_HEADING_LEVEL',
          });
        }
        if (!node.content && !node.children) {
          errors.push({
            message: 'Heading must have either content or children',
            path,
            code: 'MISSING_CONTENT',
          });
        }
        break;

      case 'button':
        if (!node.props || typeof node.props !== 'object') {
          errors.push({
            message: 'Button must have a props object',
            path,
            code: 'MISSING_PROPS',
          });
        }
        if (!node.content && (!node.children || node.children.length === 0)) {
          errors.push({
            message: 'Button must have either content or children',
            path,
            code: 'MISSING_CONTENT',
          });
        }
        // Validate button variant if present
        if (node.props?.variant && !['primary', 'secondary', 'danger'].includes(node.props.variant)) {
          errors.push({
            message: `Invalid button variant: "${node.props.variant}". Must be one of: primary, secondary, danger`,
            path,
            code: 'INVALID_BUTTON_VARIANT',
          });
        }
        break;

      case 'input':
        if (!node.props || typeof node.props !== 'object') {
          errors.push({
            message: 'Input must have a props object',
            path,
            code: 'MISSING_PROPS',
          });
        }
        // Validate inputType if present
        if (node.props?.inputType) {
          const validInputTypes = ['text', 'email', 'password', 'tel', 'url', 'number', 'date', 'time', 'datetime-local', 'search'];
          if (!validInputTypes.includes(node.props.inputType)) {
            errors.push({
              message: `Invalid inputType: "${node.props.inputType}". Must be one of: ${validInputTypes.join(', ')}`,
              path,
              code: 'INVALID_INPUT_TYPE',
            });
          }
        }
        // Inputs shouldn't have children
        if (node.children) {
          errors.push({
            message: 'Input elements cannot have children',
            path,
            code: 'INVALID_CHILDREN',
          });
        }
        break;

      case 'textarea':
        if (!node.props || typeof node.props !== 'object') {
          errors.push({
            message: 'Textarea must have a props object',
            path,
            code: 'MISSING_PROPS',
          });
        }
        // Textareas shouldn't have children
        if (node.children) {
          errors.push({
            message: 'Textarea elements cannot have children',
            path,
            code: 'INVALID_CHILDREN',
          });
        }
        break;

      case 'select':
        if (!node.props || typeof node.props !== 'object') {
          errors.push({
            message: 'Select must have a props object',
            path,
            code: 'MISSING_PROPS',
          });
        }
        if (!Array.isArray(node.options)) {
          errors.push({
            message: 'Select must have an options array',
            path,
            code: 'MISSING_OPTIONS',
          });
        } else {
          // Validate each option
          node.options.forEach((option: any, index: number) => {
            if (option.type !== 'option') {
              errors.push({
                message: `Select option must have type "option", got: "${option.type}"`,
                path: [...path, `options[${index}]`],
                code: 'INVALID_OPTION_TYPE',
              });
            }
            if (!option.value && option.value !== '') {
              errors.push({
                message: 'Select option must have a value property',
                path: [...path, `options[${index}]`],
                code: 'MISSING_OPTION_VALUE',
              });
            }
            if (!option.label && option.label !== '') {
              errors.push({
                message: 'Select option must have a label property',
                path: [...path, `options[${index}]`],
                code: 'MISSING_OPTION_LABEL',
              });
            }
          });
        }
        break;

      case 'checkbox':
        if (typeof node.checked !== 'boolean') {
          errors.push({
            message: 'Checkbox must have a boolean checked property',
            path,
            code: 'MISSING_CHECKED',
          });
        }
        if (!node.props || typeof node.props !== 'object') {
          errors.push({
            message: 'Checkbox must have a props object',
            path,
            code: 'MISSING_PROPS',
          });
        }
        break;

      case 'radio':
        if (typeof node.selected !== 'boolean') {
          errors.push({
            message: 'Radio button must have a boolean selected property',
            path,
            code: 'MISSING_SELECTED',
          });
        }
        if (!node.label && node.label !== '') {
          errors.push({
            message: 'Radio button must have a label property',
            path,
            code: 'MISSING_LABEL',
          });
        }
        if (!node.props || typeof node.props !== 'object') {
          errors.push({
            message: 'Radio button must have a props object',
            path,
            code: 'MISSING_PROPS',
          });
        }
        break;

      case 'radio-group':
        if (!Array.isArray(node.children)) {
          errors.push({
            message: 'Radio group must have a children array',
            path,
            code: 'MISSING_CHILDREN',
          });
        } else if (node.children.length === 0) {
          errors.push({
            message: 'Radio group must contain at least one radio button',
            path,
            code: 'EMPTY_RADIO_GROUP',
          });
        }
        break;

      case 'icon':
        if (!node.props?.name) {
          errors.push({
            message: 'Icon must have a props.name property',
            path,
            code: 'MISSING_ICON_NAME',
          });
        }
        // Icons shouldn't have children
        if (node.children) {
          errors.push({
            message: 'Icon elements cannot have children',
            path,
            code: 'INVALID_CHILDREN',
          });
        }
        break;

      case 'image':
        if (!node.src && node.src !== '') {
          errors.push({
            message: 'Image must have a src property',
            path,
            code: 'MISSING_IMAGE_SRC',
          });
        }
        if (!node.alt && node.alt !== '') {
          errors.push({
            message: 'Image must have an alt property for accessibility',
            path,
            code: 'MISSING_IMAGE_ALT',
          });
        }
        if (!node.props || typeof node.props !== 'object') {
          errors.push({
            message: 'Image must have a props object',
            path,
            code: 'MISSING_PROPS',
          });
        }
        // Images shouldn't have children
        if (node.children) {
          errors.push({
            message: 'Image elements cannot have children',
            path,
            code: 'INVALID_CHILDREN',
          });
        }
        break;

      case 'link':
        if (!node.href && node.href !== '') {
          errors.push({
            message: 'Link must have an href property',
            path,
            code: 'MISSING_LINK_HREF',
          });
        }
        if (!node.props || typeof node.props !== 'object') {
          errors.push({
            message: 'Link must have a props object',
            path,
            code: 'MISSING_PROPS',
          });
        }
        break;

      case 'grid':
        if (typeof node.columns !== 'number' || node.columns < 1) {
          errors.push({
            message: `Grid must have a columns property with a number >= 1, got: ${node.columns}`,
            path,
            code: 'INVALID_GRID_COLUMNS',
          });
        }
        if (!Array.isArray(node.children)) {
          errors.push({
            message: 'Grid must have a children array',
            path,
            code: 'MISSING_CHILDREN',
          });
        }
        break;

      case 'text':
        if (!node.content && node.content !== '') {
          errors.push({
            message: 'Text node must have a content property',
            path,
            code: 'MISSING_TEXT_CONTENT',
          });
        }
        // Text nodes shouldn't have children
        if (node.children) {
          errors.push({
            message: 'Text nodes cannot have children',
            path,
            code: 'INVALID_CHILDREN',
          });
        }
        break;

      case 'code':
        if (!node.value && node.value !== '') {
          errors.push({
            message: 'Code node must have a value property',
            path,
            code: 'MISSING_CODE_VALUE',
          });
        }
        break;

      case 'table':
        if (!Array.isArray(node.children)) {
          errors.push({
            message: 'Table must have a children array',
            path,
            code: 'MISSING_CHILDREN',
          });
        } else if (node.children.length === 0) {
          errors.push({
            message: 'Table must have at least one row',
            path,
            code: 'EMPTY_TABLE',
          });
        }
        break;

      case 'table-header':
      case 'table-row':
        if (!Array.isArray(node.children)) {
          errors.push({
            message: `${nodeType} must have a children array`,
            path,
            code: 'MISSING_CHILDREN',
          });
        } else if (node.children.length === 0) {
          errors.push({
            message: `${nodeType} must have at least one cell`,
            path,
            code: 'EMPTY_TABLE_ROW',
          });
        }
        break;

      case 'table-cell':
        if (node.align && !['left', 'center', 'right'].includes(node.align)) {
          errors.push({
            message: `Invalid table cell alignment: "${node.align}". Must be one of: left, center, right`,
            path,
            code: 'INVALID_CELL_ALIGNMENT',
          });
        }
        break;

      case 'nav':
        if (!Array.isArray(node.children)) {
          errors.push({
            message: 'Nav must have a children array',
            path,
            code: 'MISSING_CHILDREN',
          });
        }
        break;

      case 'list':
        if (typeof node.ordered !== 'boolean') {
          errors.push({
            message: 'List must have a boolean ordered property',
            path,
            code: 'MISSING_ORDERED',
          });
        }
        if (!Array.isArray(node.children)) {
          errors.push({
            message: 'List must have a children array',
            path,
            code: 'MISSING_CHILDREN',
          });
        }
        break;

      case 'alert':
        if (!node.alertType) {
          errors.push({
            message: 'Alert must have an alertType property',
            path,
            code: 'MISSING_ALERT_TYPE',
          });
        } else {
          const validAlertTypes = ['success', 'info', 'warning', 'error'];
          if (!validAlertTypes.includes(node.alertType)) {
            errors.push({
              message: `Invalid alertType: "${node.alertType}". Must be one of: ${validAlertTypes.join(', ')}`,
              path,
              code: 'INVALID_ALERT_TYPE',
            });
          }
        }
        break;

      case 'badge':
        if (!node.content && node.content !== '') {
          errors.push({
            message: 'Badge must have a content property',
            path,
            code: 'MISSING_CONTENT',
          });
        }
        if (node.props?.variant) {
          const validVariants = ['default', 'primary', 'success', 'warning', 'error'];
          if (!validVariants.includes(node.props.variant)) {
            errors.push({
              message: `Invalid badge variant: "${node.props.variant}". Must be one of: ${validVariants.join(', ')}`,
              path,
              code: 'INVALID_BADGE_VARIANT',
            });
          }
        }
        break;

      case 'tab':
        if (!node.label && node.label !== '') {
          errors.push({
            message: 'Tab must have a label property',
            path,
            code: 'MISSING_LABEL',
          });
        }
        if (typeof node.active !== 'boolean') {
          errors.push({
            message: 'Tab must have a boolean active property',
            path,
            code: 'MISSING_ACTIVE',
          });
        }
        break;

      case 'accordion-item':
        if (!node.summary && node.summary !== '') {
          errors.push({
            message: 'Accordion item must have a summary property',
            path,
            code: 'MISSING_SUMMARY',
          });
        }
        if (typeof node.expanded !== 'boolean') {
          errors.push({
            message: 'Accordion item must have a boolean expanded property',
            path,
            code: 'MISSING_EXPANDED',
          });
        }
        break;
    }

    // Validate nested structure rules
    validateNestedStructure(node, path);

    // Recursively validate children
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child: any, index: number) => {
        validateNode(child, [...path, `${nodeType}.children[${index}]`]);
      });
    }
  }

  // Validate nested structure rules
  function validateNestedStructure(node: any, path: string[]): void {
    const nodeType = node.type;

    // Buttons can't contain buttons
    if (nodeType === 'button' && node.children) {
      const hasNestedButton = node.children.some((child: any) => child.type === 'button');
      if (hasNestedButton) {
        errors.push({
          message: 'Buttons cannot contain other buttons',
          path,
          code: 'INVALID_NESTING',
        });
      }
    }

    // Form elements (input, textarea, select) shouldn't have children
    if (['input', 'textarea', 'select'].includes(nodeType) && node.children) {
      errors.push({
        message: `${nodeType} elements cannot have children`,
        path,
        code: 'INVALID_CHILDREN',
      });
    }

    // Grid should contain grid-items
    if (nodeType === 'grid' && node.children) {
      const hasNonGridItems = node.children.some((child: any) => child.type !== 'grid-item');
      if (hasNonGridItems) {
        errors.push({
          message: 'Grid should only contain grid-item children',
          path,
          code: 'INVALID_GRID_CHILDREN',
        });
      }
    }

    // Radio group should contain radio buttons
    if (nodeType === 'radio-group' && node.children) {
      const hasNonRadio = node.children.some((child: any) => child.type !== 'radio');
      if (hasNonRadio) {
        errors.push({
          message: 'Radio group should only contain radio button children',
          path,
          code: 'INVALID_RADIO_GROUP_CHILDREN',
        });
      }
    }

    // Table validation
    if (nodeType === 'table' && node.children) {
      const firstChild = node.children[0];
      if (firstChild && firstChild.type !== 'table-header') {
        errors.push({
          message: 'Table should start with a table-header',
          path,
          code: 'MISSING_TABLE_HEADER',
        });
      }
      const hasInvalidChildren = node.children.some((child: any) =>
        !['table-header', 'table-row'].includes(child.type)
      );
      if (hasInvalidChildren) {
        errors.push({
          message: 'Table can only contain table-header and table-row children',
          path,
          code: 'INVALID_TABLE_CHILDREN',
        });
      }
    }

    if (['table-header', 'table-row'].includes(nodeType) && node.children) {
      const hasInvalidChildren = node.children.some((child: any) => child.type !== 'table-cell');
      if (hasInvalidChildren) {
        errors.push({
          message: `${nodeType} can only contain table-cell children`,
          path,
          code: 'INVALID_TABLE_ROW_CHILDREN',
        });
      }
    }

    // Nav validation
    if (nodeType === 'nav' && node.children) {
      const validNavChildren = ['nav-item', 'brand', 'button'];
      const hasInvalidChildren = node.children.some((child: any) =>
        !validNavChildren.includes(child.type)
      );
      if (hasInvalidChildren) {
        errors.push({
          message: 'Nav should only contain nav-item, brand, or button children',
          path,
          code: 'INVALID_NAV_CHILDREN',
        });
      }
    }

    // Tabs should contain tab children
    if (nodeType === 'tabs' && node.children) {
      const hasNonTab = node.children.some((child: any) => child.type !== 'tab');
      if (hasNonTab) {
        errors.push({
          message: 'Tabs should only contain tab children',
          path,
          code: 'INVALID_TABS_CHILDREN',
        });
      }
    }

    // Accordion should contain accordion-item children
    if (nodeType === 'accordion' && node.children) {
      const hasNonAccordionItem = node.children.some((child: any) => child.type !== 'accordion-item');
      if (hasNonAccordionItem) {
        errors.push({
          message: 'Accordion should only contain accordion-item children',
          path,
          code: 'INVALID_ACCORDION_CHILDREN',
        });
      }
    }

    // Breadcrumbs should contain breadcrumb-item children
    if (nodeType === 'breadcrumbs' && node.children) {
      const hasNonBreadcrumbItem = node.children.some((child: any) => child.type !== 'breadcrumb-item');
      if (hasNonBreadcrumbItem) {
        errors.push({
          message: 'Breadcrumbs should only contain breadcrumb-item children',
          path,
          code: 'INVALID_BREADCRUMBS_CHILDREN',
        });
      }
    }

    // List should contain list-item or checkbox/radio children
    if (nodeType === 'list' && node.children) {
      const validListChildren = ['list-item', 'checkbox', 'radio'];
      const hasInvalidChildren = node.children.some((child: any) =>
        !validListChildren.includes(child.type)
      );
      if (hasInvalidChildren) {
        errors.push({
          message: 'List should only contain list-item, checkbox, or radio children',
          path,
          code: 'INVALID_LIST_CHILDREN',
        });
      }
    }
  }

  // Start validation from root children
  if (ast.children) {
    ast.children.forEach((child, index) => {
      validateNode(child, [`root.children[${index}]`]);
    });
  }

  return errors;
}

// ValidationError is exported from types.ts
