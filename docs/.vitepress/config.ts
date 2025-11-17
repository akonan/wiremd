import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'wiremd',
  description: 'Text-first UI design tool - Create wireframes and mockups using Markdown syntax',

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'GitHub', link: 'https://github.com/akonan/wiremd' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Syntax Reference', link: '/guide/syntax' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Parser API', link: '/api/parser' },
            { text: 'Renderer APIs', link: '/api/renderer' },
            { text: 'Type Definitions', link: '/api/types' },
            { text: 'Plugin API', link: '/api/plugins' },
            { text: 'Error Handling', link: '/api/errors' },
            { text: 'Migration Guides', link: '/api/migration' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/akonan/wiremd' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present'
    },

    search: {
      provider: 'local'
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  }
});
