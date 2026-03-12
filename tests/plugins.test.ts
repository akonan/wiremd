import { describe, expect, it } from 'vitest';
import {
  createPluginRegistry,
  parse,
  render,
  renderArtifacts,
  renderToAngular,
  renderToSvelte,
  renderToVue,
} from '../src/index.js';

describe('Plugin System', () => {
  it('includes first-party renderers in fresh registries', () => {
    const registry = createPluginRegistry();
    const formats = registry.listRenderers().map((renderer) => renderer.format);

    expect(formats).toContain('html');
    expect(formats).toContain('json');
    expect(formats).toContain('react');
    expect(formats).toContain('tailwind');
    expect(formats).toContain('vue');
    expect(formats).toContain('svelte');
    expect(formats).toContain('angular');
  });

  it('renders the built-in single-artifact formats through the registry', () => {
    const registry = createPluginRegistry();
    const ast = parse('## Hello');

    expect(registry.render(ast, { format: 'html' })).toContain('<!DOCTYPE html>');
    expect(registry.render(ast, { format: 'json' })).toContain('"type": "document"');
    expect(registry.render(ast, { format: 'react' })).toContain('import React from \'react\'');
    expect(registry.render(ast, { format: 'tailwind' })).toContain('cdn.tailwindcss.com');
  });

  it('registers third-party plugins and renders through the registry', () => {
    const registry = createPluginRegistry();
    registry.registerPlugin({
      name: 'wiremd-fixture',
      version: '1.0.0',
      renderers: {
        fixture: {
          format: 'fixture',
          outputType: 'single',
          render() {
            return {
              format: 'fixture',
              artifacts: [
                {
                  filename: 'fixture.txt',
                  content: 'fixture output',
                },
              ],
            };
          },
        },
      },
    });

    const ast = parse('## Hello');
    const output = registry.render(ast, { format: 'fixture' });

    expect(output).toBe('fixture output');
  });

  it('rejects renderer collisions with stable errors', () => {
    const registry = createPluginRegistry();

    expect(() => {
      registry.registerPlugin({
        name: 'wiremd-duplicate-html',
        version: '1.0.0',
        renderers: {
          html: {
            format: 'html',
            outputType: 'single',
            render() {
              return {
                format: 'html',
                artifacts: [{ filename: 'duplicate.html', content: 'duplicate' }],
              };
            },
          },
        },
      });
    }).toThrow(/already registered/);
  });

  it('rejects duplicate plugin names and mismatched renderer keys', () => {
    const registry = createPluginRegistry();

    registry.registerPlugin({
      name: 'wiremd-unique-plugin',
      version: '1.0.0',
      renderers: {
        fixtureA: {
          format: 'fixtureA',
          outputType: 'single',
          render() {
            return {
              format: 'fixtureA',
              artifacts: [{ filename: 'fixture-a.txt', content: 'a' }],
            };
          },
        },
      },
    });

    expect(() => {
      registry.registerPlugin({
        name: 'wiremd-unique-plugin',
        version: '1.0.1',
      });
    }).toThrow(/already registered/);

    expect(() => {
      registry.registerPlugin({
        name: 'wiremd-mismatch-renderer',
        version: '1.0.0',
        renderers: {
          wrongKey: {
            format: 'other-key',
            outputType: 'single',
            render() {
              return {
                format: 'other-key',
                artifacts: [{ filename: 'mismatch.txt', content: 'oops' }],
              };
            },
          },
        },
      });
    }).toThrow(/does not match renderer\.format/);
  });

  it('registers and executes transformers before rendering', () => {
    const registry = createPluginRegistry();

    registry.registerPlugin({
      name: 'wiremd-transformer-fixture',
      version: '1.0.0',
      transformers: {
        retitle: {
          name: 'retitle',
          transform(ast, context) {
            const title = typeof context.options.title === 'string' ? context.options.title : 'Fallback title';
            return {
              ...ast,
              meta: {
                ...ast.meta,
                title,
              },
            };
          },
        },
      },
    });

    const ast = parse('## Hello');
    const output = registry.render(ast, {
      format: 'html',
      transformers: [{ name: 'retitle', options: { title: 'Retitled document' } }],
    });

    expect(output).toContain('<title>Retitled document</title>');
    expect(registry.listTransformers()).toEqual(expect.arrayContaining([
      expect.objectContaining({
        pluginName: 'wiremd-transformer-fixture',
        name: 'retitle',
      }),
    ]));
  });

  it('rejects transformer collisions, mismatches, and unknown transformers', () => {
    const registry = createPluginRegistry();

    registry.registerPlugin({
      name: 'wiremd-transformer-base',
      version: '1.0.0',
      transformers: {
        normalize: {
          name: 'normalize',
          transform(ast) {
            return ast;
          },
        },
      },
    });

    expect(() => {
      registry.registerPlugin({
        name: 'wiremd-transformer-mismatch',
        version: '1.0.0',
        transformers: {
          wrongKey: {
            name: 'other-name',
            transform(ast) {
              return ast;
            },
          },
        },
      });
    }).toThrow(/does not match transformer\.name/);

    expect(() => {
      registry.registerPlugin({
        name: 'wiremd-transformer-duplicate',
        version: '1.0.0',
        transformers: {
          normalize: {
            name: 'normalize',
            transform(ast) {
              return ast;
            },
          },
        },
      });
    }).toThrow(/already registered/);

    expect(() => {
      registry.render(parse('## Hello'), {
        format: 'html',
        transformers: ['missing-transformer'],
      });
    }).toThrow(/Unknown transformer/);
  });

  it('renders Vue output through the universal render API', () => {
    const ast = parse('## Contact Form\n\n[Email___]{type:email}\n\n[Submit]*');
    const output = render(ast, {
      format: 'vue',
      rendererOptions: {
        componentName: 'ContactForm',
      },
    });

    expect(output).toContain('<template>');
    expect(output).toContain('<script setup');
    expect(output).toContain('v-model="formState');
  });

  it('renders Vue helper output', () => {
    const ast = parse('[Name___]\n\n[Submit]*');
    const output = renderToVue(ast, {
      componentName: 'ProfileForm',
    });

    expect(output).toContain('ProfileForm');
    expect(output).toContain('handleSubmit');
  });

  it('renders Svelte helper output', () => {
    const ast = parse('[Name___]\n\n[Submit]*');
    const output = renderToSvelte(ast, {
      componentName: 'ProfileForm',
    });

    expect(output).toContain('<script lang="ts">');
    expect(output).toContain('bind:value');
    expect(output).toContain('createEventDispatcher');
  });

  it('renders Angular artifacts and keeps CSS split by default', () => {
    const ast = parse('[Name___]\n\n[Submit]*');
    const result = renderToAngular(ast, {
      componentName: 'ProfileForm',
    });

    expect(result.artifacts).toHaveLength(3);
    expect(result.artifacts.find((artifact) => artifact.filename.endsWith('.ts'))?.content).toContain('ReactiveFormsModule');
    expect(result.artifacts.find((artifact) => artifact.filename.endsWith('.html'))?.content).toContain('[formControl]');
    expect(result.artifacts.find((artifact) => artifact.filename.endsWith('.css'))?.content).toContain('.wmd-root');
  });

  it('exposes multi-artifact renderers through renderArtifacts()', () => {
    const ast = parse('[Name___]\n\n[Submit]*');
    const result = renderArtifacts(ast, {
      format: 'angular',
      rendererOptions: {
        componentName: 'ArtifactForm',
      },
    });

    expect(result.format).toBe('angular');
    expect(result.artifacts).toHaveLength(3);
  });

  it('fails clearly for unknown renderers', () => {
    const registry = createPluginRegistry();

    expect(() => {
      registry.render(parse('## Missing'), { format: 'missing-format' });
    }).toThrow(/Unknown renderer format/);
  });
});
