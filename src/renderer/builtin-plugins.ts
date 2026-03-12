import { VERSION } from '../constants.js';
import type { RenderOptions, WiremdPlugin } from '../types.js';
import {
  renderHTMLDocument,
  renderJSONDocument,
  renderReactComponentDocument,
  renderTailwindDocument,
} from './render-implementations.js';
import { renderAngularArtifacts } from './angular-renderer.js';
import { renderSvelteComponent } from './svelte-renderer.js';
import { renderVueComponent } from './vue-renderer.js';

export const coreRenderersPlugin: WiremdPlugin = {
  name: 'wiremd-core-renderers',
  version: VERSION,
  renderers: {
    html: {
      format: 'html',
      description: 'Standalone HTML document renderer',
      outputType: 'single',
      render(ast, context) {
        return renderHTMLDocument(ast, context.options);
      },
    },
    json: {
      format: 'json',
      description: 'JSON AST renderer',
      outputType: 'single',
      render(ast, context) {
        return renderJSONDocument(ast, context.options);
      },
    },
    react: {
      format: 'react',
      description: 'React component renderer',
      outputType: 'single',
      render(ast, context) {
        return renderReactComponentDocument(ast, context.options);
      },
    },
    tailwind: {
      format: 'tailwind',
      description: 'Tailwind HTML renderer',
      outputType: 'single',
      render(ast, context) {
        return renderTailwindDocument(ast, context.options);
      },
    },
  },
};

export const vuePlugin: WiremdPlugin = {
  name: 'wiremd-vue',
  version: VERSION,
  renderers: {
    vue: {
      format: 'vue',
      description: 'Vue 3 Single File Component renderer',
      outputType: 'single',
      render(ast, context) {
        const options = {
          ...context.options,
          ...context.rendererOptions,
        } as RenderOptions;
        return renderVueComponent(ast, options, context.helpers);
      },
    },
  },
};

export const sveltePlugin: WiremdPlugin = {
  name: 'wiremd-svelte',
  version: VERSION,
  renderers: {
    svelte: {
      format: 'svelte',
      description: 'Svelte component renderer',
      outputType: 'single',
      render(ast, context) {
        const options = {
          ...context.options,
          ...context.rendererOptions,
        } as RenderOptions;
        return renderSvelteComponent(ast, options, context.helpers);
      },
    },
  },
};

export const angularPlugin: WiremdPlugin = {
  name: 'wiremd-angular',
  version: VERSION,
  renderers: {
    angular: {
      format: 'angular',
      description: 'Angular standalone component renderer',
      outputType: 'multi',
      render(ast, context) {
        const options = {
          ...context.options,
          ...context.rendererOptions,
        } as RenderOptions;
        return renderAngularArtifacts(ast, options, context.helpers);
      },
    },
  },
};

export function getBuiltinPlugins(): WiremdPlugin[] {
  return [coreRenderersPlugin, vuePlugin, sveltePlugin, angularPlugin];
}
