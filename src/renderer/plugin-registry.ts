import type {
  DocumentNode,
  PluginRegistry,
  RegisteredRendererInfo,
  RegisteredTransformerInfo,
  RendererPlugin,
  TransformerPlugin,
  TransformerReference,
  WiremdPlugin,
} from '../types.js';
import { createRenderHelpers } from './plugin-utils.js';
import { getBuiltinPlugins } from './builtin-plugins.js';

interface RegisteredRendererRecord {
  pluginName: string;
  renderer: RendererPlugin;
}

interface RegisteredTransformerRecord {
  pluginName: string;
  transformer: TransformerPlugin;
}

export function createPluginRegistry(): PluginRegistry {
  const plugins = new Map<string, WiremdPlugin>();
  const renderers = new Map<string, RegisteredRendererRecord>();
  const transformers = new Map<string, RegisteredTransformerRecord>();

  const registry: PluginRegistry = {
    registerPlugin(plugin) {
      if (plugins.has(plugin.name)) {
        throw new Error(`Plugin "${plugin.name}" is already registered.`);
      }

      const rendererEntries = Object.entries(plugin.renderers || {});
      const transformerEntries = Object.entries(plugin.transformers || {});

      rendererEntries.forEach(([format, renderer]) => {
        if (renderer.format !== format) {
          throw new Error(`Renderer key "${format}" does not match renderer.format "${renderer.format}".`);
        }
        if (renderers.has(format)) {
          const existing = renderers.get(format);
          throw new Error(`Renderer format "${format}" is already registered by plugin "${existing?.pluginName}".`);
        }
      });

      transformerEntries.forEach(([name, transformer]) => {
        if (transformer.name !== name) {
          throw new Error(`Transformer key "${name}" does not match transformer.name "${transformer.name}".`);
        }
        if (transformers.has(name)) {
          const existing = transformers.get(name);
          throw new Error(`Transformer "${name}" is already registered by plugin "${existing?.pluginName}".`);
        }
      });

      plugins.set(plugin.name, plugin);

      rendererEntries.forEach(([format, renderer]) => {
        renderers.set(format, { pluginName: plugin.name, renderer });
      });

      transformerEntries.forEach(([name, transformer]) => {
        transformers.set(name, { pluginName: plugin.name, transformer });
      });
    },

    render(ast, options = {}) {
      const result = registry.renderArtifacts(ast, options);

      if (result.artifacts.length !== 1) {
        throw new Error(
          `Renderer "${options.format || 'html'}" produced multiple artifacts. Use renderArtifacts() instead.`,
        );
      }

      return result.artifacts[0].content;
    },

    renderArtifacts(ast, options = {}) {
      const helpers = createRenderHelpers();
      const clonedAst = structuredClone(ast) as DocumentNode;
      const transformedAst = applyTransformers(clonedAst, options.transformers || [], helpers);
      const format = options.format || 'html';
      const renderer = registry.getRenderer(format);

      if (!renderer) {
        throw new Error(`Unknown renderer format "${format}".`);
      }

      return renderer.render(transformedAst, {
        registry,
        options,
        rendererOptions: options.rendererOptions || {},
        helpers,
      });
    },

    getRenderer(format) {
      return renderers.get(format)?.renderer;
    },

    getTransformer(name) {
      return transformers.get(name)?.transformer;
    },

    listRenderers() {
      return Array.from(renderers.entries())
        .map(([format, entry]): RegisteredRendererInfo => ({
          pluginName: entry.pluginName,
          format,
          outputType: entry.renderer.outputType || 'single',
          description: entry.renderer.description,
        }))
        .sort((left, right) => left.format.localeCompare(right.format));
    },

    listTransformers() {
      return Array.from(transformers.entries())
        .map(([name, entry]): RegisteredTransformerInfo => ({
          pluginName: entry.pluginName,
          name,
          description: entry.transformer.description,
        }))
        .sort((left, right) => left.name.localeCompare(right.name));
    },
  };

  getBuiltinPlugins().forEach((plugin) => {
    registry.registerPlugin(plugin);
  });

  return registry;

  function applyTransformers(
    ast: DocumentNode,
    references: TransformerReference[],
    helpers: ReturnType<typeof createRenderHelpers>,
  ): DocumentNode {
    return references.reduce((currentAst, reference) => {
      const name = typeof reference === 'string' ? reference : reference.name;
      const transformer = registry.getTransformer(name);

      if (!transformer) {
        throw new Error(`Unknown transformer "${name}".`);
      }

      return transformer.transform(currentAst, {
        registry,
        options: typeof reference === 'string' ? {} : reference.options || {},
        helpers,
      });
    }, ast);
  }
}
