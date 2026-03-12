import { describe, expect, it } from 'vitest';
import type { DocumentNode } from '../src/types.js';
import {
  analyzeFrameworkState,
  buildPrefixedClasses,
  collectReachableNodeTypes,
  createRenderHelpers,
  escapeHtml,
  escapeJsString,
  getIconGlyph,
  repeatString,
} from '../src/renderer/plugin-utils.js';

describe('Renderer Plugin Utils', () => {
  it('covers helper formatting and fallback branches', () => {
    const helpers = createRenderHelpers();

    expect(helpers.nextId()).toBe('id-1');
    expect(helpers.nextId('radio')).toBe('radio-1');
    expect(helpers.toIdentifier('customer email')).toBe('customerEmail');
    expect(helpers.toIdentifier('42 status', 'field')).toBe('field42Status');
    expect(helpers.toIdentifier('', 'field')).toMatch(/^field\d+$/);
    expect(helpers.toKebabCase('AdminPanel')).toBe('admin-panel');
    expect(helpers.toKebabCase('42 status', 'view')).toBe('view-42-status');
    expect(helpers.toKebabCase('', 'view')).toMatch(/^view-\d+$/);

    expect(repeatString('ab', 3)).toBe('ababab');
    expect(buildPrefixedClasses('wmd-', 'button', {
      classes: ['primary', '', 12],
      variant: 'danger',
      state: 'disabled',
    })).toBe('wmd-button wmd-primary wmd-button-danger wmd-state-disabled');
    expect(escapeHtml(`<'">&`)).toBe('&lt;&#039;&quot;&gt;&amp;');
    expect(escapeHtml('')).toBe('');
    expect(escapeJsString("line\\n'break'\n")).toBe("line\\\\n\\'break\\'\\n");
    expect(getIconGlyph('rocket')).toBe('🚀');
    expect(getIconGlyph('unknown-icon')).toBe('●');
  });

  it('analyzes framework state and reachable node types from the AST', () => {
    const ast: DocumentNode = {
      type: 'document',
      version: '0.1',
      meta: {},
      children: [
        {
          type: 'form',
          props: {},
          children: [
            {
              type: 'input',
              props: {
                name: 'email',
                inputType: 'email',
              },
            },
            {
              type: 'select',
              props: {
                placeholder: 'Topic',
              },
              options: [
                {
                  type: 'option',
                  value: 'billing',
                  label: 'Billing',
                },
                {
                  type: 'option',
                  value: 'support',
                  label: 'Support',
                  selected: true,
                },
              ],
            },
            {
              type: 'checkbox',
              label: 'Accept terms',
              checked: true,
              props: {},
            },
            {
              type: 'radio-group',
              name: 'contact_method',
              props: {},
              children: [
                {
                  type: 'radio',
                  label: 'Email',
                  selected: true,
                  props: {
                    value: 'email',
                  },
                },
                {
                  type: 'radio',
                  label: 'Phone',
                  selected: false,
                  props: {
                    value: 'phone',
                  },
                },
              ],
            },
            {
              type: 'button',
              content: 'Submit',
              props: {
                type: 'submit',
              },
            },
          ],
        },
      ],
    };

    const helpers = createRenderHelpers();
    const analysis = analyzeFrameworkState(ast, helpers);
    const types = collectReachableNodeTypes(ast);

    expect(analysis.hasForm).toBe(true);
    expect(analysis.hasSubmitButton).toBe(true);
    expect(analysis.fields.map((field) => field.key)).toEqual(['email', 'topic', 'acceptTerms', 'contactMethod']);
    expect(analysis.fields.find((field) => field.key === 'topic')?.initialValue).toBe('support');
    expect(analysis.fields.find((field) => field.key === 'contactMethod')?.options).toEqual(['email', 'phone']);
    expect(types).toEqual(expect.arrayContaining(['form', 'input', 'select', 'checkbox', 'radio-group', 'radio', 'button']));
  });
});
