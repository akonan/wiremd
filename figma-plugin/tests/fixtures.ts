/**
 * Test Fixtures
 * Sample AST data for testing
 */

import type { DocumentNode, WiremdNode } from '../src/lib/types';

export const simpleButtonAST: Extract<WiremdNode, { type: 'button' }> = {
  type: 'button',
  content: 'Click Me',
  props: {
    variant: 'primary',
  },
};

export const disabledButtonAST: Extract<WiremdNode, { type: 'button' }> = {
  type: 'button',
  content: 'Disabled',
  props: {
    variant: 'secondary',
    state: 'disabled',
  },
};

export const inputAST: Extract<WiremdNode, { type: 'input' }> = {
  type: 'input',
  props: {
    inputType: 'text',
    placeholder: 'Enter your name',
    required: true,
  },
};

export const textareaAST: Extract<WiremdNode, { type: 'textarea' }> = {
  type: 'textarea',
  props: {
    placeholder: 'Enter message',
    rows: 5,
  },
};

export const selectAST: Extract<WiremdNode, { type: 'select' }> = {
  type: 'select',
  props: {
    placeholder: 'Choose an option',
  },
  options: [
    { type: 'option', value: '1', label: 'Option 1', selected: false },
    { type: 'option', value: '2', label: 'Option 2', selected: true },
    { type: 'option', value: '3', label: 'Option 3', selected: false },
  ],
};

export const checkboxAST: Extract<WiremdNode, { type: 'checkbox' }> = {
  type: 'checkbox',
  label: 'I agree',
  checked: true,
  props: {},
};

export const radioAST: Extract<WiremdNode, { type: 'radio' }> = {
  type: 'radio',
  label: 'Option A',
  selected: true,
  props: {
    name: 'choice',
    value: 'a',
  },
};

export const headingAST: Extract<WiremdNode, { type: 'heading' }> = {
  type: 'heading',
  level: 1,
  content: 'Welcome',
  props: {},
};

export const paragraphAST: Extract<WiremdNode, { type: 'paragraph' }> = {
  type: 'paragraph',
  content: 'This is a paragraph with some text.',
  props: {},
};

export const imageAST: Extract<WiremdNode, { type: 'image' }> = {
  type: 'image',
  src: 'https://example.com/image.jpg',
  alt: 'Example image',
  props: {},
};

export const iconAST: Extract<WiremdNode, { type: 'icon' }> = {
  type: 'icon',
  props: {
    name: 'home',
    size: 'medium',
  },
};

export const containerAST: Extract<WiremdNode, { type: 'container' }> = {
  type: 'container',
  containerType: 'card',
  props: {},
  children: [
    {
      type: 'heading',
      level: 2,
      content: 'Card Title',
      props: {},
    },
    {
      type: 'paragraph',
      content: 'Card content here.',
      props: {},
    },
  ],
};

export const gridAST: Extract<WiremdNode, { type: 'grid' }> = {
  type: 'grid',
  columns: 3,
  props: {},
  children: [
    {
      type: 'grid-item',
      props: {},
      children: [
        {
          type: 'heading',
          level: 3,
          content: 'Item 1',
          props: {},
        },
      ],
    },
    {
      type: 'grid-item',
      props: {},
      children: [
        {
          type: 'heading',
          level: 3,
          content: 'Item 2',
          props: {},
        },
      ],
    },
    {
      type: 'grid-item',
      props: {},
      children: [
        {
          type: 'heading',
          level: 3,
          content: 'Item 3',
          props: {},
        },
      ],
    },
  ],
};

export const navAST: Extract<WiremdNode, { type: 'nav' }> = {
  type: 'nav',
  props: {},
  children: [
    {
      type: 'brand',
      props: {},
      children: [
        {
          type: 'text',
          content: 'Logo',
          props: {},
        },
      ],
    },
    {
      type: 'nav-item',
      content: 'Home',
      href: '/',
      props: {},
    },
    {
      type: 'nav-item',
      content: 'About',
      href: '/about',
      props: {},
    },
  ],
};

export const listAST: Extract<WiremdNode, { type: 'list' }> = {
  type: 'list',
  ordered: false,
  props: {},
  children: [
    {
      type: 'list-item',
      content: 'First item',
      props: {},
    },
    {
      type: 'list-item',
      content: 'Second item',
      props: {},
    },
  ],
};

export const codeAST: Extract<WiremdNode, { type: 'code' }> = {
  type: 'code',
  value: 'const x = 42;',
  lang: 'javascript',
  inline: false,
};

export const simpleDocumentAST: DocumentNode = {
  type: 'document',
  version: '0.1.0',
  meta: {
    title: 'Test Document',
    theme: 'sketch',
  },
  children: [
    headingAST,
    paragraphAST,
    simpleButtonAST,
  ],
};

export const complexDocumentAST: DocumentNode = {
  type: 'document',
  version: '0.1.0',
  meta: {
    title: 'Complex Test',
    theme: 'clean',
  },
  children: [
    navAST,
    containerAST,
    gridAST,
    {
      type: 'container',
      containerType: 'form-group',
      props: {},
      children: [
        {
          type: 'heading',
          level: 2,
          content: 'Contact Form',
          props: {},
        },
        inputAST,
        textareaAST,
        checkboxAST,
        simpleButtonAST,
      ],
    },
  ],
};
