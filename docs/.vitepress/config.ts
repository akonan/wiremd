import { defineConfig } from "vitepress";
import { resolve } from "path";
import { wiremdDemoPlugin } from "./plugins/wiremd-demo";

export default defineConfig({
  title: "wiremd",
  description:
    "Wireframes in plain text — write Markdown, render visual UI mockups",
  base: "/wiremd/",

  themeConfig: {
    logo: "/logo.svg",

    sidebar: [
      {
        text: "Guide",
        collapsed: false,
        items: [
          { text: "Overview", link: "/guide/overview" },
          { text: "VS Code Extension", link: "/guide/vscode" },
          { text: "Using with Claude", link: "/guide/claude" },
          { text: "CLI Install", link: "/guide/installation" },
          { text: "How wiremd works", link: "/guide/how-it-works" },
        ],
      },
      {
        text: "Components",
        collapsed: false,
        items: [
          { text: "Overview", link: "/components/" },
          {
            text: "Inputs",
            collapsed: false,
            items: [
              { text: "Buttons", link: "/components/buttons" },
              { text: "Inputs", link: "/components/inputs" },
              {
                text: "Textarea & Select",
                link: "/components/textarea-select",
              },
              {
                text: "Checkboxes & Radio",
                link: "/components/checkboxes-radio",
              },
            ],
          },
          {
            text: "Display",
            collapsed: false,
            items: [
              { text: "Badges", link: "/components/badges" },
              { text: "Icons", link: "/components/icons" },
              { text: "Navigation", link: "/components/navigation" },
              { text: "Cards", link: "/components/cards" },
              { text: "Tabs", link: "/components/tabs" },
              { text: "Alerts", link: "/components/alerts" },
              { text: "Tables", link: "/components/tables" },
            ],
          },
          {
            text: "Layout",
            collapsed: false,
            items: [
              { text: "Grid", link: "/components/grid" },
              { text: "Row", link: "/components/row" },
              { text: "Page Layouts", link: "/components/page-layouts" },
            ],
          },
          {
            text: "Advanced",
            collapsed: false,
            items: [
              { text: "Button Links", link: "/components/button-links" },
              { text: "Reuse Components", link: "/components/includes" },
              { text: "Attributes & Classes", link: "/components/attributes" },
              { text: "Demo Blocks", link: "/components/demo" },
            ],
          },
          {
            text: "Visual Styles",
            collapsed: false,
            items: [{ text: "Visual Styles", link: "/components/styles" }],
          },
          {
            text: "Not Yet Implemented",
            link: "/components/not-implemented-components",
          },
        ],
      },
      {
        text: "Gallery",
        collapsed: true,
        items: [
          {
            text: "Forms",
            collapsed: false,
            items: [
              {
                text: "Login Form",
                link: "/examples/gallery/forms/login-form",
              },
              {
                text: "Registration Form",
                link: "/examples/gallery/forms/registration-form",
              },
              {
                text: "Contact Form",
                link: "/examples/gallery/forms/contact-form",
              },
              {
                text: "Search Form",
                link: "/examples/gallery/forms/search-form",
              },
              {
                text: "Multi-Step Form",
                link: "/examples/gallery/forms/multi-step-form",
              },
            ],
          },
          {
            text: "Components",
            collapsed: false,
            items: [
              {
                text: "Card Layouts",
                link: "/examples/gallery/components/card-layouts",
              },
              {
                text: "Form Controls",
                link: "/examples/gallery/components/form-controls",
              },
              {
                text: "Modals & Dialogs",
                link: "/examples/gallery/components/modals-dialogs",
              },
              {
                text: "Navigation Patterns",
                link: "/examples/gallery/components/navigation-patterns",
              },
              {
                text: "Tables & Data Grids",
                link: "/examples/gallery/components/tables-data-grids",
              },
            ],
          },
          {
            text: "Dashboards",
            collapsed: false,
            items: [
              {
                text: "Admin Panel",
                link: "/examples/gallery/dashboards/admin-panel",
              },
              {
                text: "Analytics Dashboard",
                link: "/examples/gallery/dashboards/analytics-dashboard",
              },
              {
                text: "E-commerce Dashboard",
                link: "/examples/gallery/dashboards/ecommerce-dashboard",
              },
              {
                text: "Project Management",
                link: "/examples/gallery/dashboards/project-management",
              },
              {
                text: "Social Media",
                link: "/examples/gallery/dashboards/social-media-dashboard",
              },
            ],
          },
          {
            text: "Landing Pages",
            collapsed: false,
            items: [
              {
                text: "SaaS Product",
                link: "/examples/gallery/landing-pages/saas-product",
              },
              {
                text: "App Landing",
                link: "/examples/gallery/landing-pages/app-landing",
              },
              {
                text: "E-commerce Home",
                link: "/examples/gallery/landing-pages/ecommerce-home",
              },
              {
                text: "Agency Site",
                link: "/examples/gallery/landing-pages/agency-site",
              },
              {
                text: "Portfolio",
                link: "/examples/gallery/landing-pages/portfolio",
              },
            ],
          },
          {
            text: "Layouts",
            collapsed: false,
            items: [
              {
                text: "Sidebar Layout",
                link: "/examples/gallery/layouts/sidebar-layout",
              },
              {
                text: "Row Layout",
                link: "/examples/gallery/layouts/row-layout",
              },
            ],
          },
          {
            text: "Multi-Page",
            collapsed: false,
            items: [
              { text: "Home", link: "/examples/gallery/multi-page/home" },
              { text: "About", link: "/examples/gallery/multi-page/about" },
              { text: "Contact", link: "/examples/gallery/multi-page/contact" },
            ],
          },
        ],
      },
      {
        text: "Reference",
        collapsed: true,
        items: [
          { text: "CLI Reference", link: "/reference/cli" },
          { text: "FAQ & Troubleshooting", link: "/reference/faq" },
        ],
      },
      {
        text: "API",
        collapsed: true,
        items: [
          { text: "Overview", link: "/api/" },
          { text: "Parser API", link: "/api/parser" },
          { text: "Renderer APIs", link: "/api/renderer" },
          { text: "JSON Schema", link: "/api/json-schema" },
          { text: "Type Definitions", link: "/api/types" },
          { text: "Plugin API", link: "/api/plugins" },
          { text: "Error Handling", link: "/api/errors" },
          { text: "Migration Guides", link: "/api/migration" },
        ],
      },
      {
        text: "Contributing",
        collapsed: true,
        items: [
          { text: "Testing", link: "/contributing/testing" },
          { text: "Publishing", link: "/contributing/publishing" },
        ],
      },
    ],

    nav: [
      { text: "Docs", link: "/guide/overview" },
      { text: "Editor", link: "/editor/", target: "_blank" },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/teezeit/wiremd" },
    ],

    search: {
      provider: "local",
    },

    outline: false,
  },

  vite: {
    plugins: [wiremdDemoPlugin()],
    resolve: {
      alias: {
        // Allow the MiniEditor Vue component to import wiremd source directly for
        // browser rendering — stubs replace Node-only fs/path used by resolveIncludes.
        wiremd: resolve(__dirname, "../../src/index.ts"),
        fs: resolve(__dirname, "../../editor/src/stubs/fs.ts"),
        path: resolve(__dirname, "../../editor/src/stubs/path.ts"),
      },
    },
    ssr: {
      // Keep Node.js built-ins external in SSR so the aliases above only
      // affect the client bundle; stubs are never needed server-side.
      external: ["fs", "path"],
    },
  },

  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
    lineNumbers: true,
  },

  ignoreDeadLinks: true,
});
