/**
 * wiremd Renderer
 * Resolves renderers through the plugin registry and preserves legacy helpers.
 */

import type { DocumentNode, PluginRegistry, RenderOptions, RenderResult, WiremdPlugin } from '../types.js';
import { createPluginRegistry } from './plugin-registry.js';

export { createPluginRegistry } from './plugin-registry.js';
export { angularPlugin, coreRenderersPlugin, sveltePlugin, vuePlugin } from './builtin-plugins.js';

export const defaultPluginRegistry: PluginRegistry = createPluginRegistry();

export function registerPlugin(plugin: WiremdPlugin): void {
  defaultPluginRegistry.registerPlugin(plugin);
}

export function listRenderers() {
  return defaultPluginRegistry.listRenderers();
}

export function listTransformers() {
  return defaultPluginRegistry.listTransformers();
}

export function renderArtifacts(ast: DocumentNode, options: RenderOptions = {}): RenderResult {
  return defaultPluginRegistry.renderArtifacts(ast, options);
}

export function renderToHTML(ast: DocumentNode, options: RenderOptions = {}): string {
  return defaultPluginRegistry.render(ast, {
    ...options,
    format: 'html',
  });
}

export function renderToJSON(ast: DocumentNode, options: RenderOptions = {}): string {
  return defaultPluginRegistry.render(ast, {
    ...options,
    format: 'json',
  });
}

export function renderToReact(
  ast: DocumentNode,
  options: RenderOptions & { typescript?: boolean; componentName?: string } = {},
): string {
  return defaultPluginRegistry.render(ast, {
    ...options,
    format: 'react',
  });
}

export function renderToTailwind(ast: DocumentNode, options: RenderOptions = {}): string {
  return defaultPluginRegistry.render(ast, {
    ...options,
    format: 'tailwind',
  });
}

export function renderToVue(
  ast: DocumentNode,
  options: RenderOptions & {
    componentName?: string;
    typescript?: boolean;
    scopedStyles?: boolean;
    compositionApi?: boolean;
  } = {},
): string {
  return defaultPluginRegistry.render(ast, {
    ...options,
    format: 'vue',
  });
}

export function renderToSvelte(
  ast: DocumentNode,
  options: RenderOptions & {
    componentName?: string;
    typescript?: boolean;
  } = {},
): string {
  return defaultPluginRegistry.render(ast, {
    ...options,
    format: 'svelte',
  });
}

export function renderToAngular(
  ast: DocumentNode,
  options: RenderOptions & {
    componentName?: string;
    selector?: string;
    standalone?: boolean;
    inlineStyles?: boolean;
  } = {},
): RenderResult {
  return defaultPluginRegistry.renderArtifacts(ast, {
    ...options,
    format: 'angular',
  });
}

export function render(ast: DocumentNode, options: RenderOptions = {}): string {
  return defaultPluginRegistry.render(ast, options);
}
