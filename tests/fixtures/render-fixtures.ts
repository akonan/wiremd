import type { DocumentNode } from '../../src/types.js';

export function createFrameworkRendererAst(): DocumentNode {
  return {
    type: 'document',
    version: '0.1',
    meta: {
      title: 'Renderer Fixture',
    },
    children: [
      {
        type: 'nav',
        props: {},
        children: [
          {
            type: 'brand',
            props: {},
            children: [
              {
                type: 'text',
                content: 'Wiremd',
              },
            ],
          },
          {
            type: 'nav-item',
            href: '/docs',
            content: 'Docs',
            props: {},
          },
          {
            type: 'nav-item',
            href: '/pricing',
            content: 'Pricing',
            props: {},
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: 'Profile settings',
        props: {},
      },
      {
        type: 'form',
        props: {},
        children: [
          {
            type: 'input',
            props: {
              name: 'email',
              placeholder: 'Email',
              inputType: 'email',
              required: true,
            },
          },
          {
            type: 'textarea',
            props: {
              name: 'message',
              placeholder: 'Message',
              rows: 5,
              value: 'Hello from wiremd',
            },
          },
          {
            type: 'select',
            props: {
              name: 'topic',
              placeholder: 'Choose topic',
            },
            options: [
              {
                type: 'option',
                value: 'sales',
                label: 'Sales',
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
            props: {
              name: 'accept_terms',
            },
          },
          {
            type: 'radio-group',
            name: 'contact_method',
            props: {
              inline: true,
            },
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
            content: 'Save',
            props: {
              variant: 'primary',
              type: 'submit',
            },
          },
          {
            type: 'button',
            content: 'Cancel',
            props: {
              type: 'button',
            },
          },
        ],
      },
      {
        type: 'grid',
        columns: 2,
        props: {},
        children: [
          {
            type: 'grid-item',
            props: {},
            children: [
              {
                type: 'heading',
                level: 3,
                content: 'Usage',
                props: {},
              },
              {
                type: 'paragraph',
                content: 'Track activity',
                props: {},
              },
            ],
          },
          {
            type: 'grid-item',
            props: {},
            children: [
              {
                type: 'alert',
                alertType: 'info',
                props: {},
                children: [
                  {
                    type: 'paragraph',
                    content: 'All systems nominal',
                    props: {},
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'table',
        props: {},
        children: [
          {
            type: 'table-header',
            children: [
              {
                type: 'table-cell',
                header: true,
                content: 'Metric',
              },
              {
                type: 'table-cell',
                header: true,
                align: 'right',
                content: 'Value',
              },
            ],
          },
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                content: 'Uptime',
              },
              {
                type: 'table-cell',
                align: 'right',
                content: '99.9%',
              },
            ],
          },
        ],
      },
    ],
  };
}

export function createVueStateAst(): DocumentNode {
  return {
    type: 'document',
    version: '0.1',
    meta: {
      title: 'Vue State Fixture',
    },
    children: [
      {
        type: 'empty-state',
        title: 'No records',
        icon: 'search',
        props: {},
        children: [
          {
            type: 'paragraph',
            content: 'Try another filter',
            props: {},
          },
        ],
      },
      {
        type: 'error-state',
        title: 'Load failed',
        icon: 'error',
        props: {
          state: 'error',
        },
        children: [
          {
            type: 'paragraph',
            content: 'Refresh the page and retry',
            props: {},
          },
        ],
      },
    ],
  };
}

export function createRadioGroupAst(): DocumentNode {
  return {
    type: 'document',
    version: '0.1',
    meta: {
      title: 'Radio Fixture',
    },
    children: [
      {
        type: 'radio-group',
        props: {},
        children: [
          {
            type: 'radio',
            label: 'Small',
            selected: false,
            props: {
              value: 'small',
            },
          },
          {
            type: 'radio',
            label: 'Medium',
            selected: true,
            props: {
              value: 'medium',
            },
          },
        ],
      },
    ],
  };
}

export function createLegacyRendererAst(): DocumentNode {
  return {
    type: 'document',
    version: '0.1',
    meta: {
      title: 'Legacy Renderer Fixture',
    },
    children: [
      {
        type: 'container',
        containerType: 'section',
        props: {},
        children: [
          {
            type: 'paragraph',
            content: 'Paragraph with <strong>rich</strong> content',
            props: {},
          },
          {
            type: 'image',
            src: '/hero.png',
            alt: 'Hero image',
            props: {
              width: 320,
              height: 180,
            },
          },
          {
            type: 'link',
            href: '/docs',
            title: 'Read docs',
            props: {},
            children: [
              {
                type: 'icon',
                props: {
                  name: 'github',
                },
              },
              {
                type: 'text',
                content: 'Documentation',
              },
            ],
          },
          {
            type: 'checkbox',
            label: 'Accept updates',
            checked: false,
            props: {
              value: 'yes',
            },
            children: [
              {
                type: 'text',
                content: 'Accept updates',
              },
              {
                type: 'list',
                ordered: false,
                props: {},
                children: [
                  {
                    type: 'list-item',
                    content: 'Weekly digest',
                    props: {},
                  },
                ],
              },
            ],
          },
          {
            type: 'list',
            ordered: true,
            props: {},
            children: [
              {
                type: 'list-item',
                content: 'First item',
                props: {},
              },
              {
                type: 'list-item',
                props: {},
                children: [
                  {
                    type: 'text',
                    content: 'Second item',
                  },
                ],
              },
            ],
          },
          {
            type: 'table',
            props: {},
            children: [
              {
                type: 'table-header',
                children: [
                  {
                    type: 'table-cell',
                    header: true,
                    content: 'Name',
                  },
                  {
                    type: 'table-cell',
                    header: true,
                    align: 'center',
                    children: [
                      {
                        type: 'text',
                        content: 'Value',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    content: 'Visits',
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    content: '42',
                  },
                ],
              },
            ],
          },
          {
            type: 'blockquote',
            props: {},
            children: [
              {
                type: 'paragraph',
                content: 'Shipped to production.',
                props: {},
              },
            ],
          },
          {
            type: 'code',
            inline: true,
            value: 'npm test',
          },
          {
            type: 'code',
            inline: false,
            lang: 'ts',
            value: 'const ready = true;',
          },
          {
            type: 'separator',
            props: {},
          },
        ],
      },
    ],
  };
}
