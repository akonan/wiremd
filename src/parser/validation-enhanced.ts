/**
 * Enhanced Validation for wiremd AST
 * Provides comprehensive validation with clear, actionable error messages
 *
 * Copyright (c) 2025 wiremd
 * Licensed under MIT License
 */

import type { DocumentNode, ValidationError } from '../types.js';

interface ComponentValidationRule {
  required?: string[];
  optional?: string[];
  requiresOneOf?: string[];
  noChildren?: boolean;
  validChildren?: string[];
  minChildren?: number;
  containerTypes?: string[];
  variants?: string[];
  types?: string[];
  inputTypes?: string[];
  alertTypes?: string[];
  methods?: string[];
  validation?: (node: any, path: string[]) => ValidationError | ValidationError[] | null;
}

/**
 * Enhanced validation function with better error messages and position tracking
 */
export function validateEnhanced(ast: DocumentNode): ValidationError[] {
  const errors: ValidationError[] = [];

  // Track validation context for better error messages
  const validationContext = {
    hasSeenRadioGroups: new Set<string>(),
    hasSeenFormElements: new Map<string, any>(),
    parentStack: [] as any[],
  };

  // Helper function to get position info if available
  function getPositionInfo(node: any): string {
    if (node?.position?.start) {
      return ` at line ${node.position.start.line}, column ${node.position.start.column}`;
    }
    return '';
  }

  // Helper function to create error with position and context
  function createError(
    message: string,
    code: string,
    path: string[],
    node?: any
  ): ValidationError {
    const posInfo = node ? getPositionInfo(node) : '';
    return {
      message: message + posInfo,
      code,
      path,
      node,
    };
  }

  // Validate document structure
  if (!ast.type || ast.type !== 'document') {
    errors.push(createError(
      'Root node must be of type "document". Ensure you are passing a valid wiremd AST',
      'INVALID_ROOT_TYPE',
      ['root']
    ));
    return errors;
  }

  if (!ast.meta) {
    errors.push(createError(
      'Document must have metadata. Add a meta property with at least an empty object',
      'MISSING_META',
      ['root.meta']
    ));
  }

  if (!Array.isArray(ast.children)) {
    errors.push(createError(
      'Document children must be an array. Initialize with an empty array if there are no children',
      'INVALID_CHILDREN',
      ['root.children']
    ));
    return errors;
  }

  // Component type definitions with validation rules
  const componentValidation: Record<string, ComponentValidationRule> = {
    // Layout Components
    container: {
      required: ['props', 'children'],
      containerTypes: ['hero', 'card', 'modal', 'sidebar', 'footer', 'alert', 'grid', 'layout', 'section', 'form-group', 'button-group'],
      validation: (node: any, path: string[]) => {
        if (!node.containerType) {
          return createError(
            'Container must have a containerType property (e.g., "hero", "card", "modal")',
            'MISSING_CONTAINER_TYPE',
            path,
            node
          );
        }
        const validTypes = ['hero', 'card', 'modal', 'sidebar', 'footer', 'alert', 'grid', 'layout', 'section', 'form-group', 'button-group'];
        if (!validTypes.includes(node.containerType)) {
          return createError(
            `Invalid containerType: "${node.containerType}". Must be one of: ${validTypes.join(', ')}`,
            'INVALID_CONTAINER_TYPE',
            path,
            node
          );
        }
        return null;
      },
    },
    nav: {
      required: ['props', 'children'],
      validChildren: ['nav-item', 'brand', 'button'],
    },
    'nav-item': {
      required: ['props'],
      optional: ['content', 'children', 'href'],
    },
    brand: {
      required: ['children', 'props'],
    },
    grid: {
      required: ['columns', 'props', 'children'],
      validChildren: ['grid-item'],
      validation: (node: any, path: string[]) => {
        if (typeof node.columns !== 'number' || node.columns < 1 || node.columns > 12) {
          return createError(
            `Grid columns must be a number between 1 and 12, got: ${node.columns}`,
            'INVALID_GRID_COLUMNS',
            path,
            node
          );
        }
        return null;
      },
    },
    'grid-item': {
      required: ['props', 'children'],
    },

    // Form Components
    button: {
      required: ['props'],
      requiresOneOf: ['content', 'children'],
      variants: ['primary', 'secondary', 'danger'],
      types: ['button', 'submit', 'reset'],
    },
    input: {
      required: ['props'],
      noChildren: true,
      inputTypes: ['text', 'email', 'password', 'tel', 'url', 'number', 'date', 'time', 'datetime-local', 'search'],
    },
    textarea: {
      required: ['props'],
      noChildren: true,
    },
    select: {
      required: ['props', 'options'],
      validation: (node: any, path: string[]) => {
        if (!Array.isArray(node.options)) {
          return createError(
            'Select must have an options array with at least one option',
            'MISSING_OPTIONS',
            path,
            node
          );
        }
        const optionErrors: ValidationError[] = [];
        node.options.forEach((option: any, index: number) => {
          const optionPath = [...path, `options[${index}]`];
          if (option.type !== 'option') {
            optionErrors.push(createError(
              `Select option must have type "option", got: "${option.type}"`,
              'INVALID_OPTION_TYPE',
              optionPath,
              option
            ));
          }
          if (!option.value && option.value !== '') {
            optionErrors.push(createError(
              'Select option must have a value property (can be empty string)',
              'MISSING_OPTION_VALUE',
              optionPath,
              option
            ));
          }
          if (!option.label && option.label !== '') {
            optionErrors.push(createError(
              'Select option must have a label property to display',
              'MISSING_OPTION_LABEL',
              optionPath,
              option
            ));
          }
        });
        return optionErrors.length > 0 ? optionErrors : null;
      },
    },
    checkbox: {
      required: ['checked', 'props'],
      optional: ['label', 'children'],
      validation: (node: any, path: string[]) => {
        if (typeof node.checked !== 'boolean') {
          return createError(
            'Checkbox must have a boolean checked property (true/false)',
            'MISSING_CHECKED',
            path,
            node
          );
        }
        return null;
      },
    },
    radio: {
      required: ['label', 'selected', 'props'],
      optional: ['children'],
      validation: (node: any, path: string[]) => {
        if (typeof node.selected !== 'boolean') {
          return createError(
            'Radio button must have a boolean selected property (true/false)',
            'MISSING_SELECTED',
            path,
            node
          );
        }
        return null;
      },
    },
    'radio-group': {
      required: ['props', 'children'],
      validChildren: ['radio'],
      minChildren: 1,
    },
    form: {
      required: ['props', 'children'],
      methods: ['get', 'post'],
    },

    // Content Components
    heading: {
      required: ['level', 'props'],
      requiresOneOf: ['content', 'children'],
      validation: (node: any, path: string[]) => {
        if (!node.level || ![1, 2, 3, 4, 5, 6].includes(node.level)) {
          return createError(
            `Heading level must be between 1 and 6, got: ${node.level}`,
            'INVALID_HEADING_LEVEL',
            path,
            node
          );
        }
        return null;
      },
    },
    paragraph: {
      required: ['props'],
      optional: ['content', 'children'],
    },
    text: {
      required: ['content'],
      noChildren: true,
    },
    image: {
      required: ['src', 'alt', 'props'],
      noChildren: true,
    },
    icon: {
      required: ['props'],
      noChildren: true,
      validation: (node: any, path: string[]) => {
        if (!node.props?.name) {
          return createError(
            'Icon must have a props.name property specifying the icon identifier',
            'MISSING_ICON_NAME',
            path,
            node
          );
        }
        return null;
      },
    },
    link: {
      required: ['href', 'props'],
      optional: ['title', 'content', 'children'],
    },
    list: {
      required: ['ordered', 'props', 'children'],
      validChildren: ['list-item', 'checkbox', 'radio'],
    },
    'list-item': {
      required: ['props'],
      optional: ['content', 'children'],
    },
    table: {
      required: ['props', 'children'],
      validChildren: ['table-header', 'table-row'],
      minChildren: 1,
      validation: (node: any, path: string[]) => {
        if (node.children && node.children.length > 0) {
          const firstChild = node.children[0];
          if (firstChild.type !== 'table-header') {
            return createError(
              'Table should start with a table-header for accessibility',
              'MISSING_TABLE_HEADER',
              path,
              node
            );
          }
        }
        return null;
      },
    },
    'table-header': {
      required: ['children'],
      validChildren: ['table-cell'],
      minChildren: 1,
    },
    'table-row': {
      required: ['children'],
      validChildren: ['table-cell'],
      minChildren: 1,
    },
    'table-cell': {
      optional: ['content', 'children', 'align', 'header'],
      validation: (node: any, path: string[]) => {
        if (node.align && !['left', 'center', 'right'].includes(node.align)) {
          return createError(
            `Table cell alignment must be 'left', 'center', or 'right', got: "${node.align}"`,
            'INVALID_CELL_ALIGNMENT',
            path,
            node
          );
        }
        return null;
      },
    },
    blockquote: {
      required: ['props', 'children'],
    },
    code: {
      required: ['value'],
      optional: ['lang', 'inline'],
    },

    // UI Components
    tabs: {
      required: ['props', 'children'],
      validChildren: ['tab'],
      minChildren: 1,
    },
    tab: {
      required: ['label', 'active', 'props', 'children'],
      validation: (node: any, path: string[]) => {
        if (typeof node.active !== 'boolean') {
          return createError(
            'Tab must have a boolean active property to indicate selection state',
            'MISSING_ACTIVE',
            path,
            node
          );
        }
        return null;
      },
    },
    accordion: {
      required: ['props', 'children'],
      validChildren: ['accordion-item'],
      minChildren: 1,
    },
    'accordion-item': {
      required: ['summary', 'expanded', 'props', 'children'],
      validation: (node: any, path: string[]) => {
        if (typeof node.expanded !== 'boolean') {
          return createError(
            'Accordion item must have a boolean expanded property',
            'MISSING_EXPANDED',
            path,
            node
          );
        }
        return null;
      },
    },
    breadcrumbs: {
      required: ['props', 'children'],
      validChildren: ['breadcrumb-item'],
      minChildren: 1,
    },
    'breadcrumb-item': {
      optional: ['content', 'children', 'href', 'current'],
    },
    alert: {
      required: ['alertType', 'props', 'children'],
      alertTypes: ['success', 'info', 'warning', 'error'],
    },
    badge: {
      required: ['content', 'props'],
      variants: ['default', 'primary', 'success', 'warning', 'error'],
    },
    separator: {
      required: ['props'],
    },

    // State Components
    'loading-state': {
      required: ['props'],
      optional: ['message', 'children'],
    },
    'empty-state': {
      required: ['props', 'children'],
      optional: ['icon', 'title'],
    },
    'error-state': {
      required: ['props', 'children'],
      optional: ['icon', 'title'],
    },
  };

  // Validate nested structure rules
  function validateNestedStructure(node: any, path: string[]): void {
    const nodeType = node.type;

    // Buttons can't contain buttons
    if (nodeType === 'button' && node.children) {
      const hasNestedButton = findNestedType(node, 'button');
      if (hasNestedButton) {
        errors.push(createError(
          'Buttons cannot contain other buttons. Consider using a button-group container instead',
          'INVALID_NESTING',
          path,
          node
        ));
      }
    }

    // Links shouldn't contain interactive elements
    if (nodeType === 'link' && node.children) {
      const interactiveTypes = ['button', 'input', 'textarea', 'select', 'checkbox', 'radio'];
      const hasInteractive = node.children.some((child: any) =>
        interactiveTypes.includes(child.type) ||
        interactiveTypes.some(type => findNestedType(child, type))
      );
      if (hasInteractive) {
        errors.push(createError(
          'Links should not contain interactive elements like buttons or form inputs',
          'INVALID_LINK_CONTENT',
          path,
          node
        ));
      }
    }

    // Radio groups validation
    if (nodeType === 'radio-group') {
      const name = node.name || `radio-group-${path.join('.')}`;
      if (validationContext.hasSeenRadioGroups.has(name)) {
        errors.push(createError(
          `Duplicate radio group name: "${name}". Each radio group must have a unique name`,
          'DUPLICATE_RADIO_GROUP',
          path,
          node
        ));
      }
      validationContext.hasSeenRadioGroups.add(name);

      // Check that only one radio is selected
      const selectedCount = node.children?.filter((child: any) =>
        child.type === 'radio' && child.selected === true
      ).length || 0;

      if (selectedCount > 1) {
        errors.push(createError(
          `Radio group has ${selectedCount} selected items. Only one radio can be selected at a time`,
          'MULTIPLE_RADIO_SELECTED',
          path,
          node
        ));
      }
    }
  }

  // Helper to find nested node type
  function findNestedType(node: any, targetType: string): boolean {
    if (!node.children) return false;

    for (const child of node.children) {
      if (child.type === targetType) return true;
      if (findNestedType(child, targetType)) return true;
    }
    return false;
  }

  // Main validation function for nodes
  function validateNode(node: any, path: string[] = []): void {
    if (!node || typeof node !== 'object') {
      errors.push(createError(
        'Node must be an object. Check for malformed AST structure',
        'INVALID_NODE',
        path,
        node
      ));
      return;
    }

    if (!node.type) {
      errors.push(createError(
        'Node must have a type property. Every wiremd node requires a type field',
        'MISSING_NODE_TYPE',
        path,
        node
      ));
      return;
    }

    const nodeType = node.type;
    const validation = componentValidation[nodeType as keyof typeof componentValidation];

    if (!validation) {
      // Suggest similar types if there's a typo
      const validTypes = Object.keys(componentValidation);

      // First check for simple typos (one character difference)
      const similarByTypo = validTypes.filter(t => {
        if (Math.abs(t.length - nodeType.length) > 1) return false;
        let differences = 0;
        const shorter = t.length < nodeType.length ? t : nodeType;
        const longer = t.length >= nodeType.length ? t : nodeType;
        for (let i = 0, j = 0; i < shorter.length && j < longer.length; ) {
          if (shorter[i] !== longer[j]) {
            differences++;
            if (differences > 1) return false;
            if (shorter.length === longer.length) {
              i++;
              j++;
            } else {
              j++;
            }
          } else {
            i++;
            j++;
          }
        }
        return differences <= 1;
      });

      // Then check for substring matches
      const similarBySubstring = similarByTypo.length === 0
        ? validTypes.filter(t =>
            t.toLowerCase().includes(nodeType.toLowerCase()) ||
            nodeType.toLowerCase().includes(t.toLowerCase())
          )
        : [];

      const similarTypes = similarByTypo.length > 0 ? similarByTypo : similarBySubstring;
      const suggestion = similarTypes.length > 0
        ? ` Did you mean: ${similarTypes.join(', ')}?`
        : '';

      errors.push(createError(
        `Unknown component type: "${nodeType}". See documentation for valid types.${suggestion}`,
        'INVALID_COMPONENT_TYPE',
        path,
        node
      ));
      return;
    }

    // Check required properties
    if (validation.required) {
      for (const prop of validation.required) {
        if (prop === 'props') {
          if (!node[prop] || typeof node[prop] !== 'object') {
            errors.push(createError(
              `${nodeType} must have a props object. Initialize with {} if no properties are needed`,
              'MISSING_PROPS',
              path,
              node
            ));
          }
        } else if (prop === 'children') {
          if (!Array.isArray(node[prop])) {
            errors.push(createError(
              `${nodeType} must have a children array. Initialize with [] if there are no children`,
              'MISSING_CHILDREN',
              path,
              node
            ));
          }
        } else if (!(prop in node) || (node[prop] === undefined && node[prop] !== '')) {
          errors.push(createError(
            `${nodeType} must have a ${prop} property`,
            `MISSING_${prop.toUpperCase()}`,
            path,
            node
          ));
        }
      }
    }

    // Check requiresOneOf
    if (validation.requiresOneOf) {
      const hasOne = validation.requiresOneOf.some((prop: string) =>
        node[prop] !== undefined && node[prop] !== null &&
        (typeof node[prop] !== 'string' || node[prop] !== '')
      );
      if (!hasOne) {
        errors.push(createError(
          `${nodeType} must have at least one of: ${validation.requiresOneOf.join(' or ')}`,
          'MISSING_CONTENT',
          path,
          node
        ));
      }
    }

    // Check noChildren
    if (validation.noChildren && node.children) {
      errors.push(createError(
        `${nodeType} elements cannot have children`,
        'INVALID_CHILDREN',
        path,
        node
      ));
    }

    // Check validChildren
    if (validation.validChildren && node.children) {
      const invalidChildren = node.children.filter((child: any) =>
        !validation.validChildren!.includes(child.type)
      );
      if (invalidChildren.length > 0) {
        const invalidTypes = [...new Set(invalidChildren.map((c: any) => c.type))];
        errors.push(createError(
          `${nodeType} can only contain ${validation.validChildren.join(', ')} children. Found: ${invalidTypes.join(', ')}`,
          `INVALID_${nodeType.toUpperCase().replace('-', '_')}_CHILDREN`,
          path,
          node
        ));
      }
    }

    // Check minChildren
    if (validation.minChildren && node.children) {
      if (node.children.length < validation.minChildren) {
        errors.push(createError(
          `${nodeType} must have at least ${validation.minChildren} child${validation.minChildren > 1 ? 'ren' : ''}`,
          `EMPTY_${nodeType.toUpperCase().replace('-', '_')}`,
          path,
          node
        ));
      }
    }

    // Run custom validation
    if (validation.validation) {
      const result = validation.validation(node, path);
      if (result) {
        if (Array.isArray(result)) {
          errors.push(...result);
        } else {
          errors.push(result);
        }
      }
    }

    // Validate specific property values
    if (validation.variants && node.props?.variant) {
      if (!validation.variants.includes(node.props.variant)) {
        errors.push(createError(
          `Invalid ${nodeType} variant: "${node.props.variant}". Must be one of: ${validation.variants.join(', ')}`,
          `INVALID_${nodeType.toUpperCase()}_VARIANT`,
          path,
          node
        ));
      }
    }

    if (validation.types && node.props?.type) {
      if (!validation.types.includes(node.props.type)) {
        errors.push(createError(
          `Invalid ${nodeType} type: "${node.props.type}". Must be one of: ${validation.types.join(', ')}`,
          `INVALID_${nodeType.toUpperCase()}_TYPE`,
          path,
          node
        ));
      }
    }

    if (validation.inputTypes && node.props?.inputType) {
      if (!validation.inputTypes.includes(node.props.inputType)) {
        errors.push(createError(
          `Invalid input type: "${node.props.inputType}". Must be one of: ${validation.inputTypes.join(', ')}`,
          'INVALID_INPUT_TYPE',
          path,
          node
        ));
      }
    }

    if (validation.alertTypes && node.alertType) {
      if (!validation.alertTypes.includes(node.alertType)) {
        errors.push(createError(
          `Invalid alert type: "${node.alertType}". Must be one of: ${validation.alertTypes.join(', ')}`,
          'INVALID_ALERT_TYPE',
          path,
          node
        ));
      }
    }

    if (validation.methods && node.props?.method) {
      if (!validation.methods.includes(node.props.method)) {
        errors.push(createError(
          `Invalid form method: "${node.props.method}". Must be one of: ${validation.methods.join(', ')}`,
          'INVALID_FORM_METHOD',
          path,
          node
        ));
      }
    }

    // Validate nested structure
    validateNestedStructure(node, path);

    // Recursively validate children
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child: any, index: number) => {
        validateNode(child, [...path, `${nodeType}.children[${index}]`]);
      });
    }

    // Validate options for select
    if (nodeType === 'select' && node.options && Array.isArray(node.options)) {
      node.options.forEach((option: any, index: number) => {
        validateNode(option, [...path, `options[${index}]`]);
      });
    }
  }

  // Start validation from root children
  if (ast.children) {
    ast.children.forEach((child, index) => {
      validateNode(child, [`children[${index}]`]);
    });
  }

  return errors;
}